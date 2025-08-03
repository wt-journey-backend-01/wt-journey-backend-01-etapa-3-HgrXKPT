/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

    // Cria primeiro a tabela agentes (a tabela referenciada pela FK)
  await knex.schema.createTable('agentes', (table) => {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.date('dataDeIncorporacao').notNullable();
    table.string('cargo', 50).notNullable();
  });

  // Depois cria a tabela casos (que referencia agentes)
  await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo', 100).notNullable();
    table.text('descricao').notNullable();
    table.enum('status', ['aberto', 'solucionado']).notNullable().defaultTo('aberto');
    table.integer('agente_id').unsigned().notNullable()
      .references('id').inTable('agentes').onDelete('CASCADE');
  });
};
  
;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Remove primeiro a tabela casos (que tem a FK)
  await knex.schema.dropTable('casos');
  // Depois remove a tabela agentes
  await knex.schema.dropTable('agentes');
};
