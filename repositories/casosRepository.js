

const db = require('../db/db');


 async function findAll() {
    return await db('casos').select('*');
}

 async function findCaseById(id){
    
    return await db('casos').where({id}).first();
   

}

async function createCase(caseData){



    return await db('casos')
        .insert(caseData)
        .returning('*'); // Retorna todas as colunas do registro criado

}

 function updateCase(id, caseData){


    return db('casos')
        .where({ id })
        .update(caseData)
        .returning('*'); // Retorna todas as colunas do registro atualizado
    
    
}
function deleteCase(id){

    return db('casos')
        .where({ id })
        .del()
        .returning('*'); // Retorna todas as colunas do registro deletado

}



module.exports = {
    findAll,
    findCaseById,
    createCase,
    updateCase,
    deleteCase
}
