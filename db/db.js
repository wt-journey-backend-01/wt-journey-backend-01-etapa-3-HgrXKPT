const knexConfig = require('../knexfile');
const knex = require('knex'); 

require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const config = knexConfig[nodeEnv]; 

const db = knex(config);

module.exports = db;