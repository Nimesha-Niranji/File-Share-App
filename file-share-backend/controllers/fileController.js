//cintrollers/fileController.js


const File = require('../models/File');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('file');

const { v4: uuidv4 } = require('uuid');

// Generate public shareable link
exports.generatePublicLink = async (req, res) => {
  try {
    console.log("Generating public link for file:", req.params.id);
    const file = await File.findByPk(req.params.id);

    if (!file) {
      console.log("❌ File not found");
      return res.status(404).json({ msg: 'File not found' });
    }

    if (file.userId !== req.user.id && req.user.role !== 'admin') {
      console.log("⛔ Unauthorized");
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    file.publicToken = token;
    file.tokenExpiry = expiry;
    await file.save();

    console.log("✅ Public link created:", token);
    res.json({ link: `http://localhost:5000/shared/${token}`, expiresAt: expiry });
  } catch (error) {
    console.error("🔥 Error generating link:", error);
    res.status(500).json({ msg: 'Error generating link' });
  }
};

exports.uploadFile = async (req, res) => {
  const file = await File.create({
    filename: req.file.filename,
    path: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
    userId: req.user.id
  });
  res.json(file);
};

exports.downloadFile = async (req, res) => {
  const file = await File.findByPk(req.params.id);
  res.download(file.path, file.filename);
};

// exports.getUserFiles = async (req, res) => {
//   const files = await File.findAll({ where: { userId: req.user.id } });
//   res.json(files);
// };

exports.getUserFiles = async (req, res) => {
  let files;

  if (req.user.role === 'admin') {
    // Admin can view all
    files = await File.findAll();
  } else {
    // Regular users see only their own
    files = await File.findAll({ where: { userId: req.user.id } });
  }

  res.json(files);
};

exports.deleteFile = async (req, res) => {
  const file = await File.findByPk(req.params.id);

  // Check if the file exists
  if (!file) {
    return res.status(404).json({ msg: 'File not found' });
  }

  // Check if the user is the file owner OR an admin
  if (file.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  try {
    const fs = require('fs');
    fs.unlinkSync(file.path);
    await file.destroy();
    res.json({ msg: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error deleting file' });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  getUserFiles,
  deleteFile,
  generatePublicLink, // make sure this is here
  uploadMiddleware
};




