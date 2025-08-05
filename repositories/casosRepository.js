

const { tr } = require('date-fns/locale');
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

    const query =  db("casos");

    const caso = await query.where({ id }).first();
    return caso;  
  
    
   

}

async function createCase(caseData){

    const [createdCase] = await db('casos').insert(caseData).returning('*');
    if(!createdCase){
      throw new Error('Erro ao criar caso: o repositório retornou null/undefined'); 
    }
    return createdCase
  
    

    

}

 async function updateCase(id, caseData){
 
    const updated = {
    ...caseData
  }
    const [updatedCase] = await db('casos')
      .where({ id })
      .update(updated)
      .returning('*');

      if(!updatedCase){
        return null
      }

 

      return updatedCase;

  
}
async function deleteCase(id){
    const query = db('casos')

    const deleted = await query.where({ id }).del();

      if(deleted === 0){
         return null
      }
  return true; // Retorna o número de registros deletados

}



module.exports = {
    findAll,
    findCaseById,
    createCase,
    updateCase,
    deleteCase
}
