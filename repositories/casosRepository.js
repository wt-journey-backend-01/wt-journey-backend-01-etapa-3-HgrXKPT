

const db = require('../db/db');


 async function findAll(filters) {
  try{
     const query = db('casos');

    if(filters.status){
     query.where('status', filters.status);
    }

    if(filters.agente_id){
      query.where('agente_id', filters.agente_id);
    }

    if(filters.search){
      query.where(function() {
        this.where('titulo', 'like', `%${filters.search}%`)
            .orWhere('descricao', 'like', `%${filters.search}%`);
      });
    }
    const casos = await query.select('*');
    return casos;
  }catch (error) {
    throw new Error('Erro ao buscar casos: ' + error.message);
  }
   
}

 async function findCaseById(id){
  
    const query =  db('casos');
    // Verifica se o caso foi encontrado
    if(!caso){
      throw new Error('Caso não encontrado');
    }
    const caso = await  query.where({ id }).first();
    return caso || null;  
   

}

async function createCase(caseData){

    const [createdCase] = await db('casos').insert(caseData).returning('*');
    return createdCase;

}

 async function updateCase(id, caseData){
  
  try{  
    const updated = {
    ...caseData
  }
    const [updatedCase] = await db('casos')
      .where({ id })
      .update(updated)
      .returning('*');

      return updatedCase;

  }catch (error) {
    throw new Error('Erro ao atualizar caso: ' + error.message);
  }
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
