const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

const Joi = require("joi");

async function getAllCasos(req, res) {
  try{
    const { status, agente_id, search } = req.query;
  const filters = { status, agente_id, search }
  const casos = await casosRepository.findAll(filters);
  
  res.status(200).json(casos);
  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao buscar casos",
      errors: {
        internal: error.message
      }
    });
  }
  
}

async function getCasoById(req, res) {


  const { caso_id } = req.params;

  let caso = await casosRepository.findCaseById(caso_id);

  if (!caso) {
    return res.status(404).json({
      status: 404,
      message: "Caso inexistente",
      errors: {
        caso_id: "O caso não foi encontrado" },
    });
  };

  res.status(200).json(caso);
}



async function getAgenteAssociateToCase(req, res) {
  try{
    const { caso_id } = req.params;
    const caso = await casosRepository.findCaseById(caso_id);
    const agente = await agentesRepository.findAgentById(caso.agente_id);
    res.status(200).json(agente);

  }catch (error){
      return res.status(404).json({
      status: 404,
      message: "Parâmetros inválidos",
      errors: {
        caso_id: "O caso não foi encontrado",},
    });
  }

}

async function createCase(req, res) {

   const createSchema = Joi.object({
    titulo: Joi.string().trim().min(1).required(),
    descricao: Joi.string().trim().min(1).required(),
    status: Joi.string().valid("aberto", "solucionado").required(),
    agente_id: Joi.number().required(),
  }).strict();

try{
  const { error, value } = createSchema.validate(req.body, {
    allowUnknown: false
  });

   if (error) {
    const errorDetails = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message.replace(/"/g, "'");
      return acc;
    }, {});

    return res.status(400).json({
      status: 400,
      message: "Dados inválidos",
      errors: errorDetails
    });
  }


  const existingAgent = await agentesRepository.findAgentById(value.agente_id);
  if (!existingAgent) {
    return res.status(404).json({
      status: 404,
      message: "Agente inexistente",
      errors: {
        id: "Agente não encontrado",
      },
    });
  };


  const newCase = {
    titulo: value.titulo,
    descricao:value.descricao,
    status : value.status,
    agente_id : value.agente_id,
  };

  const createdCase =  await casosRepository.createCase(newCase);

  res.status(201).json(createdCase);
} catch (error) {
  return res.status(500).json({
    status: 500,
    message: "Erro ao criar caso",
    errors: {
      internal: error.message
    }
  });
  
}}

async function updateCase(req, res) {
  const updateSchema = Joi.object({
    titulo: Joi.string().trim().min(1).required(),
    descricao: Joi.string().trim().min(1).required(),
    status: Joi.string().valid("aberto", "solucionado").required(),
    agente_id: Joi.number().required(),
  }).strict();

  const { caso_id } = req.params;

  const { error, value } = updateSchema.validate(req.body, {
    allowUnknown: false,
  });

  if (error) {
    const errorDetails = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message.replace(/"/g, "'");
      return acc;
    }, {});

    return res.status(400).json({
      status: 400,
      message: "Dados inválidos",
      errors: errorDetails
    });
  }

  const existingCase = await casosRepository.findCaseById(caso_id);
  if (!existingCase) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado",
      errors: {
        caso_id: "Nenhum caso encontrado com o ID fornecido",
      },
    });
  };


  if (value.id && value.id !== caso_id) {
    return res.status(400).json({
      status: 400,
      message: "Não é permitido alterar o campo 'id'.",
    });
  }

  

    const agentExists = await agentesRepository.findAgentById(value.agente_id);

    if (!agentExists) {
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado",
      });
    }



  const updated = await casosRepository.updateCase(caso_id, value);
  res.status(200).json(updated);
}

async function  partialUpdateCase(req, res) {
  const updateSchema = Joi.object({
    titulo: Joi.string().trim().min(1).optional(),
    descricao: Joi.string().trim().min(1).optional(),
    status: Joi.string().valid("aberto", "solucionado").optional(),
    agente_id: Joi.optional(),
  }).strict();

  const { caso_id } = req.params;

  const {error, value} = updateSchema.validate(req.body, {
    allowUnknown: false,
  });

   if (error) {
    const errorDetails = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message.replace(/"/g, "'");
      return acc;
    }, {});

    return res.status(400).json({
      status: 400,
      message: "Dados inválidos",
      errors: errorDetails
    });
  }


  if (value.id && value.id !== caso_id) {
  return res.status(400).json({
    status: 400,
    message: "Não é permitido alterar o campo 'id'.",
  });
}

  const existingCase = await casosRepository.findCaseById(caso_id);
  if (!existingCase) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado",
      errors: {
        caso_id: "Nenhum caso encontrado com o ID fornecido",
      },
    });
  };


  if (value.agente_id) {
    const agentExists = await agentesRepository.findAgentById(value.agente_id);
    if (!agentExists) {
      return res.status(404).json({
        status: 404,
        message: `Agente responsável não encontrado`,
      });
    }
  };

 

  const updated = await casosRepository.updateCase(caso_id, value);

  res.status(200).json(updated);
}

async function deleteCase(req, res) {
  const { caso_id } = req.params;
 

  const removed = await casosRepository.deleteCase(caso_id);
  if (!removed) {
    return res.status(404).json({
      status: 404,
      message: "Parâmetros inválidos",
      errors: {
        caso_id: "O caso não foi encontrado' ",
      },
    });
  };

  res.status(204).send();
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCase,
  updateCase,
   partialUpdateCase,
  deleteCase,
  getAgenteAssociateToCase,
};
