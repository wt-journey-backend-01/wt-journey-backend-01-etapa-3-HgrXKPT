const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

const Joi = require("joi");

async function getAllCasos(req, res) {
  try{
    const { status, agente_id, search } = req.query;
  const filters = { status, agente_id, search }

  const casos = await casosRepository.findAll(filters);
  
  return res.status(200).json(casos);

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

  try{
    const { caso_id } = req.params;

  const caso = await casosRepository.findCaseById(caso_id);

  if (!caso) {
    return res.status(404).json({
      status: 404,
      message: "Caso inexistente",
      errors: {
        caso_id: "O caso não foi encontrado" },
    });
  };

  return res.status(200).json(caso);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao buscar caso",
      errors: {
        internal: error.message
      }
    });
  }
  
}



async function getAgenteAssociateToCase(req, res) {
  try{
    const { caso_id } = req.params;
    const caso = await casosRepository.findCaseById(caso_id);
    if (!caso) {
    return res.status(404).json({ message: "Caso não encontrado" });
  }
    const agente = await agentesRepository.findAgentById(caso.agente_id);
    res.status(200).json(agente);

  }catch (error){
      return res.status(404).json({
      status: 500,
      message: "Erro ao buscar casos",
      errors: {
        caso_id: error.message},
    });
  }

}

async function createCase(req, res) {

   const createSchema = Joi.object({
    titulo: Joi.string().trim().min(1).required(),
    descricao: Joi.string().trim().min(1).required(),
    status: Joi.string().valid("aberto", "solucionado").required(),
    agente_id: Joi.number().required(),
  }); 

  try{
  const { error, value } = createSchema.validate(req.body);

   if(error){
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details,
      });
    }


  const existingAgent = await agentesRepository.findAgentById(value.agente_id);
  if (!existingAgent) {
    return res.status(404).json({
      status: 404,
      message: "Agente inexistente",
      errors: errors.details
    });
  };

  const createdCase =  await casosRepository.createCase(value);

  

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
  });
  try{
      const { caso_id } = req.params;

  const { error, value } = updateSchema.validate(req.body);

  if (error) {
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
  return res.status(200).json(updated);
  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao atualizar caso",
      errors: {
        internal: error.message
      }
    });
  }

  
}

async function  partialUpdateCase(req, res) {
  const updateSchema = Joi.object({
    titulo: Joi.string().trim().min(1).optional(),
    descricao: Joi.string().trim().min(1).optional(),
    status: Joi.string().valid("aberto", "solucionado").optional(),
    agente_id: Joi.number().optional(),
  });

  try{
      const { caso_id } = req.params;

  const {error, value} = updateSchema.validate(req.body);

   if (error) {
    return res.status(400).json({
      status: 400,
      message: "Dados inválidos",
      errors: error.details,
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

  return res.status(200).json(updated);

  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao atualizar caso",
      errors: {
        internal: error.message
      }
    });
  }
  
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
