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
router.get('/share/:id', auth, fileController.generatePublicLink);


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

router.get('/shared/:token', async (req, res) => {
  try {
    const file = await File.findOne({ where: { publicToken: req.params.token } });

    if (!file || !file.tokenExpiry || new Date() > file.tokenExpiry) {
      return res.status(404).json({ msg: 'Link expired or invalid' });
    }

    res.download(file.path, file.filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error serving file' });
  }
});


module.exports = router;
