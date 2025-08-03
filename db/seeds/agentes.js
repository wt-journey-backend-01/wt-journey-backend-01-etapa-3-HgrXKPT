/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agentes').del()
  await knex('agentes').insert([
    {id: 1, nome: "Roberto", dataDeIncorporacao: "2023-01-01", cargo: "Detetive"},
    {id: 2, nome: "Maria", dataDeIncorporacao: "2023-02-01", cargo: "Investigadora"},
    
  ]);
};
