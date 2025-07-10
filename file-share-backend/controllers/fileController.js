const File = require('../models/File');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('file');

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

exports.getUserFiles = async (req, res) => {
  const files = await File.findAll({ where: { userId: req.user.id } });
  res.json(files);
};

exports.deleteFile = async (req, res) => {
  const file = await File.findByPk(req.params.id);

  // Check if file exists and belongs to user
  if (!file || file.userId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized or file not found' });
  }

  // Delete file from disk
  try {
    fs.unlinkSync(path.join(__dirname, '..', file.path));
  } catch (err) {
    console.error('File delete error:', err.message);
  }

  // Delete file from database
  await file.destroy();

  res.json({ message: 'File deleted successfully' });
};

