

const db = require('../db/db');


 async function findAll(filters) {
  try{
     const casos = await db('casos').select('*');

    if(filters.status){
      casos.where('status', filters.status);
    }

    if(filters.agente_id){
      casos.where('agente_id', filters.agente_id);
    }

    if(filters.search){
      casos.where(function() {
        this.where('titulo', 'like', `%${filters.search}%`)
            .orWhere('descricao', 'like', `%${filters.search}%`);
      });
    }
    return casos;
  }catch (error) {
    throw new Error('Erro ao buscar casos: ' + error.message);
  }
   
}

 async function findCaseById(id){
  
    const caso = await db('casos').where({id}).first();
    // Verifica se o caso foi encontrado
    if(!caso){
      throw new Error('Caso não encontrado');
    }
    return caso
   

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
