const { Router } = require('express'); 

const CampanhasController =  require('../controllers/CampanhaController.js');   

const router = Router();

router.post("/", CampanhasController.store);

module.exports = router;
