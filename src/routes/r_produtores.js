const { Router } = require('express');

const ProdutoresController = require('../controllers/ProdutoresController.js');

const router = Router()

router.post("/", ProdutoresController.store)
router.post("/atribuir", ProdutoresController.atribuirProdutor)
router.put("/transferir", ProdutoresController.transferirProdutor)

module.exports = router

