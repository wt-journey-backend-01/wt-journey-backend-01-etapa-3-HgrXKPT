const db = require("../db/db");

async function findAll(filters) {
  try {
    const agentes = db("agentes").select("*");
    if (filters.cargo) {
      agentes.where("cargo", "like", `%${filters.cargo}%`);
    }

    if (filters.sort === "dataDeIncorporacao") {
      agentes.orderBy("dataDeIncorporacao", "asc");
    } else if (filters.sort === "-dataDeIncorporacao") {
      agentes.orderBy("dataDeIncorporacao", "desc");
    }

    return agentes;
  } catch (dbError) {
    throw new Error("Erro ao buscar agentes: " + dbError.message);
  }
}

async function findAgentById(id) {
  const agente = await db("agentes").where({ id }).first();
  if (!agente) {
    throw new Error("Agente não encontrado");
  }
  return agente;
}

async function createAgent(agenteData) {
  try {
    const [createdAgent] = await db("agentes")
      .insert(agenteData)
      .returning("*"); // Retorna todas as colunas do registro criado

    return createdAgent;
  } catch (dbError) {
    throw new Error("Erro ao criar agente: " + dbError.message);
  }
}

async function updateAgent(id, agenteData) {
  const [updatedAgent] = await db("agentes")
    .where({ id })
    .update(agenteData)
    .returning("*");
  return updatedAgent;
}

async function deleteAgent(id) {
  const deletedCount = await db("agentes").where({ id }).del();
  return deletedCount; // Retorna o número de registros deletados
}

module.exports = {
  findAll,
  findAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};
