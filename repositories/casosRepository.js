

const db = require('../db/db');


 async function findAll() {
    const casos = await db('casos').select('*');
    return casos;
}

 async function findCaseById(id){
    
    return await db('casos').where({id}).first();
   

}

async function createCase(caseData){

    const [createdCase] = await db('casos').insert(caseData).returning('*');
    return createdCase;

}

 async function updateCase(id, caseData){

const [updatedCase] = await db('casos')
      .where({ id })
      .update(caseData)
      .returning('*');

     if (!updatedCase) {
      throw new Error('Caso não encontrado');
    }
  return updatedCase;
    
}
async function deleteCase(id){

    const deletedCount = await db('casos')
      .where({ id })
      .del();
  return deletedCount; // Retorna o número de registros deletados

}



module.exports = {
    findAll,
    findCaseById,
    createCase,
    updateCase,
    deleteCase
}
