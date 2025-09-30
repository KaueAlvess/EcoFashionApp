const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = require('./index').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'EcoFashion'
});
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Rota para criar doação
router.post('/doacao', upload.single('foto'), (req, res) => {
  const { usuario_id, descricao, destino, tempo_uso, estado, tamanho } = req.body;
  const foto = req.file ? req.file.filename : null;
  if (!usuario_id || !descricao || !destino || !tempo_uso || !estado || !tamanho || !foto) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  db.query(
    'INSERT INTO doacoes (usuario_id, foto, descricao, destino, tempo_uso, estado, tamanho) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, foto, descricao, destino, tempo_uso, estado, tamanho],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao registrar doação.' });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

module.exports = router;
