const db = require("../db/db");

async function findAll(filters) {

    const query = db("agentes");

    if (filters.cargo) {
      query.where("cargo", "like", `%${filters.cargo}%`);
    }

    if (filters.sort === "dataDeIncorporacao") {
      query.orderBy("dataDeIncorporacao", "asc");
    } else if (filters.sort === "-dataDeIncorporacao") {
      query.orderBy("dataDeIncorporacao", "desc");
    }
    const agentes = await query.select("*");

    if(!agentes) {
      return null; 
    }
    return agentes ;


}

async function findAgentById(id) {

   
       const query = db("agentes");

    const agente = await query.where({ id }).first();

    if (!agente) {
      return null;
    }
  return agente;
  
   

  
}

async function createAgent(agenteData) {

    const [createdAgent] = await db("agentes")
      .insert(agenteData)
      .returning("*"); // Retorna todas as colunas do registro criado

      if (!createdAgent) {
        return null; // Ou lance um erro, dependendo da lógica do seu aplicativo 
      }

    return{
      ...createdAgent,
      dataDeIncorporacao: new Date(agenteData.dataDeIncorporacao)
        .toISOString()
        .split("T")[0],
    } 
  } 


async function updateAgent(id, agenteData) {

    const [updatedAgent] = await db("agentes")
    .where({ id })
    .update(agenteData)
    .returning("*");

    if(!updatedAgent) {
      return null
    }

    const updated = {
      ...updatedAgent,
      dataDeIncorporacao: new Date(agenteData.dataDeIncorporacao)
        .toISOString()
        .split("T")[0],
    };

  return updated;
  }
  


async function deleteAgent(id) {
  const deleted = await db("agentes").where({ id }).del();
  if (deleted === 0) {
    return null
  }
  return true; // Retorna o número de registros deletados
}

module.exports = {
  findAll,
  findAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};
