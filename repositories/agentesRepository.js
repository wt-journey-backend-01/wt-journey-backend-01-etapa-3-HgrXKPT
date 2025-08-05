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

  try{
    const agente = await db("agentes").where({ id }).first();
  if (!agente) {
    throw new Error("Agente não encontrado");
  }
  return agente || null;
  }catch (error) {
    throw new Error("Erro ao buscar agente: " + error.message);
  }
  
}

async function createAgent(agenteData) {
  try {
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
  } catch (dbError) {
    throw new Error("Erro ao criar agente: " + dbError.message);
  }
}

async function updateAgent(id, agenteData) {
  try{
    const [updatedAgent] = await db("agentes")
    .where({ id })
    .update(agenteData)
    .returning("*");

    if(!updatedAgent) {
      throw new Error("Erro ao atualizar agente: o repositório retornou null/undefined"); 
    }
  return updatedAgent;
  }catch(error) {
    throw new Error("Erro ao atualizar agente: " + error.message);
  }
  
}

async function deleteAgent(id) {
  const deleted = await db("agentes").where({ id }).del();
  if (!deleted) {
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
