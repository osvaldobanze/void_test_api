const { Router } = require('express');

const TecnicoController = require('../controllers/TecnicoController.js');

const router = Router();

router.post("/", TecnicoController.store);
router.get("/:id/produtores", TecnicoController.getProdutores);

module.exports = router;
