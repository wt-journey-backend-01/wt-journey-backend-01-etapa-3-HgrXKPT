
const db = require('../db/db');

async function findAll(){
    return await db('agentes').select('*');
}

async function findAgentById(id){

    return await db('agentes').where({id}).first();

}

  async function createAgent(agenteData){

      const [createdAgent] = await db('agentes')
              .insert(agenteData)
              .returning('*'); // Retorna todas as colunas do registro criado

          return createdAgent;
    
  }

async function updateAgents(id,agenteData){

    return db('agentes').where({ id }).update(agenteData).returning('*');
}

async function deleteAgent(id){
    
    return await db('agentes').where({ id }).del();

    
}

module.exports ={
    findAll,
    findAgentById,
    createAgent,
    updateAgents,
    deleteAgent
}
