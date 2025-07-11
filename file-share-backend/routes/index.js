// routes/index.js
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');

const File = require('../models/File');
const User = require('../models/User');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/upload', auth, fileController.uploadMiddleware, fileController.uploadFile);
router.get('/download/:id', auth, fileController.downloadFile);
router.get('/files', auth, fileController.getUserFiles);
router.delete('/files/:id', auth, fileController.deleteFile);

// File routes (Admin)
router.get('/admin/files', auth, isAdmin, async (req, res) => {
  try {
    const files = await File.findAll({
      include: {
        model: User,
        attributes: ['id', 'email', 'username'],
      },
    });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
