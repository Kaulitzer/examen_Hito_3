const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const verifyToken = require('../controllers/authMiddleware'); 
const adminOnly = require('../controllers/adminMiddleware'); 

router.get('/',productsController.getProducts);
router.post('/', verifyToken, adminOnly, productsController.addProduct);
router.put('/:id', verifyToken, adminOnly, productsController.updateProduct);
router.delete('/:id', verifyToken, adminOnly, productsController.deleteProduct);

module.exports = router;
