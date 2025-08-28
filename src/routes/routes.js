 


const { Router } = require('express');

const empresas  = require('./r_empresas');   
const campanhas = require('./r_campanhas');
const tecnicos  = require('./r_tecnicos');
const produtores= require('./r_produtores');

const routes = Router();
routes.use('/empresas',  empresas);
routes.use('/campanhas', campanhas);
routes.use('/tecnicos',  tecnicos);
routes.use('/produtores', produtores);

module.exports = routes;