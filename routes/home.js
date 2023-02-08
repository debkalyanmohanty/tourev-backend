const express = require('express');
const homeController = require('../controllers/home');
const upload = require('../middlewares/multer');
const router = express.Router();

router.get('/', homeController.getHome);
router.post('/employee' , upload.single('image') ,homeController.addEmployee);
router.get('/employee', homeController.getEmployee);

module.exports = router;