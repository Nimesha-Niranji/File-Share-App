// routes/index.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upload', auth, fileController.uploadMiddleware, fileController.uploadFile);
router.get('/download/:id', auth, fileController.downloadFile);
router.get('/files', auth, fileController.getUserFiles);



module.exports = router;
