const agentesRepository = require("../repositories/agentesRepository");
const { parseISO, isValid, isFuture } = require("date-fns");
const Joi = require('joi');



async function findAll(req, res) {
  const { cargo, agente_id,sort } = req.query;

  let agentes = await agentesRepository.findAll();

  if (cargo) {
    agentes = agentes.filter((a) =>
      a.cargo.toLowerCase().includes(cargo.toLowerCase())
    );
  }

  if (agente_id) {
    casos = casos.filter((c) => c.agente_id === agente_id);
  }

  if (sort === "dataDeIncorporacao") {
    agentes.sort(
      (a, b) =>
        new Date(a.dataDeIncorporacao).getTime() -
        new Date(b.dataDeIncorporacao).getTime()
    );
  } else if (sort === "-dataDeIncorporacao") {
    agentes.sort(
      (a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao)
    );
  }

  res.status(200).json(agentes);
}

async function findById(req, res) {
  const { id } = req.params;

  const agente = await agentesRepository.findAgentById(id);

  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado",
      errors: {
        id: "Nenhum agente encontrado com o ID fornecido",
      },
    });
  };

  res.status(200).json(agente);
}
async function addAgente(req, res) {
  const { nome, dataDeIncorporacao, cargo } = req.body;

  if (!nome || !dataDeIncorporacao || !cargo) {
    return res.status(400).json({
      status: 400,
      message: `Parâmetros inválidos`,
      errors: {
        nome: !nome ? "Campo obrigatório não informado" : undefined,
        dataDeIncorporacao: !dataDeIncorporacao
          ? "Campo obrigatório não informado"
          : undefined,
        cargo: !cargo ? "Campo obrigatório não informado" : undefined,
      },
    });
  }

  validateDate(dataDeIncorporacao);

  const newAgent = {
    nome,
    dataDeIncorporacao,
    cargo,
  };
  const agent = await agentesRepository.createAgent(newAgent);
  res.status(201).json(agent);
}

async function updateAgent(req, res) {

  const agentSchema = Joi.object({
  nome: Joi.string().required(),
  dataDeIncorporacao: Joi.date().iso().required(),
  cargo: Joi.string().required()
});
  try{
  const { id } = req.params;


  const { error } = agentSchema.validate(req.body);

  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({
      status: 400,
      message: "Não é permitido alterar o campo 'id'.",
    });
  }
 if (error) {
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details
      });
    }

    const updated = await agentesRepository.updateAgent(id, req.body);
    
    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado"
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function partialUpdate(req, res) {

  const partialSchema = Joi.object({
    nome: Joi.string().trim().min(1).optional(),
    dataDeIncorporacao: Joi.date().iso().optional(),
    cargo: Joi.string().trim().min(1).optional()
  }).min(1);

  const { id } = req.params;
  const { error, value } = partialSchema.validate(req.body);



   if (error) {
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto",
      errors: {
        id: "O payload está incorreto",
      },
    });
  }

  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({
      status: 400,
      message: "Não é permitido alterar o campo 'id'.",
    });
  }

  const agente = await agentesRepository.findAgentById(id);
  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado",
      errors: {
        id: "O agente não foi encontrado"
      }
    });
  };

  const fields = {};
  if (value.nome !== undefined) fields.nome = value.nome;
  if (value.dataDeIncorporacao !== undefined) fields.dataDeIncorporacao = value.dataDeIncorporacao;
  if (value.cargo !== undefined) fields.cargo = value.cargo;

  const updated = await agentesRepository.updateAgents(id, fields);

  res.status(200).json(updated);
}

async function deleteAgent(req, res) {
  const { id } = req.params;


  const removed = await agentesRepository.deleteAgent(id);

  if (!removed) {
        return res.status(404).json({
      status: 404,
      message: "Agente não encontrado",
      errors: {
        id: "O agente não foi encontrado",
      },
    });
  };

  res.status(204).send();
}

function validateDate(dateString){

  const data = parseISO(dataDeIncorporacao);
  if (!isValid(data)) {
    return res.status(400).json({
      status: 400,
      message: "Data inválida",
      errors: {
        dataDeIncorporacao: "Formato de data inválido, use YYYY-MM-DD",
      },
    });
  }

  if (isFuture(data)) {
    return res.status(400).json({
      status: 400,
      message: "Data inválida",
      errors: {
        dataDeIncorporacao: "Data de incorporação não pode ser no futuro",
      },
    });
  }

}

module.exports = {
  findAll,
  findById,
  addAgente,
  updateAgent,
  partialUpdate,
  deleteAgent,
};
