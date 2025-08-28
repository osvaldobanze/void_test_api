const { Router } = require('express');


const EmpresasController = require('../controllers/EmpresaController.js');

const router = Router();

router.post("/", EmpresasController.store);

module.exports = router;