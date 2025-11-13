const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
// increase default body size limits to allow large base64 images from web
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Criado diretório uploads');
  }
} catch (e) {
  console.error('Não foi possível criar uploads dir:', e);
}
app.use('/uploads', express.static(uploadsDir));
// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
// limit file size to 10MB by default to avoid huge uploads
// limit file size to 50MB to allow larger uploads if necessary
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });
// Rota para registrar doação
app.post('/api/doacao', (req, res) => {
  // use upload.single but handle errors explicitly
  upload.single('foto')(req, res, function (err) {
    if (err) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Arquivo muito grande.' });
      return res.status(400).json({ error: 'Erro no upload do arquivo.' });
    }

    try {
      const { usuario_id, descricao, destino, tempo_uso, estado, tamanho } = req.body;
      const foto = req.file ? req.file.filename : null;
      if (!usuario_id || !descricao || !destino || !tempo_uso || !estado || !tamanho || !foto) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
      }
      db.query(
        'INSERT INTO doacoes (usuario_id, foto, descricao, destino, tempo_uso, estado, tamanho) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [usuario_id, foto, descricao, destino, tempo_uso, estado, tamanho],
        (dbErr, result) => {
          if (dbErr) {
            console.error('DB error on insert doacoes:', dbErr);
            return res.status(500).json({ error: 'Erro ao registrar doação.' });
          }
          res.json({ success: true, id: result.insertId });
        }
      );
    } catch (e) {
      console.error('Unexpected error in /api/doacao:', e);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });
});

// Admin upload for web: accepts JSON with base64 image (data URL)
app.post('/api/admin-upload', express.json({ limit: '50mb' }), (req, res) => {
  try {
    console.log('[admin-upload] incoming request from', req.ip || req.connection.remoteAddress);
    const { nome, descricao, imagemBase64 } = req.body;
    if (!nome || !imagemBase64) {
      console.warn('[admin-upload] missing parameters:', { nome: !!nome, hasImage: !!imagemBase64 });
      return res.status(400).json({ error: 'Parâmetros ausentes.' });
    }

    // log approximate payload size to help debugging
    try {
      const approxSize = Buffer.byteLength(imagemBase64 || '', 'utf8');
      console.log(`[admin-upload] imagemBase64 size: ${approxSize} bytes`);
      if (approxSize > 50 * 1024 * 1024) {
        return res.status(413).json({ error: 'Imagem muito grande.' });
      }
    } catch (sizeErr) {
      console.warn('[admin-upload] failed to compute payload size', sizeErr);
    }

    const matches = (imagemBase64 || '').match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      console.warn('[admin-upload] invalid image format');
      return res.status(400).json({ error: 'Formato de imagem inválido.' });
    }
    const mime = matches[1];
    const ext = mime.split('/')[1] || 'jpg';
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    const filename = Date.now() + '.' + ext;
    const filepath = path.join(__dirname, 'uploads', filename);
    require('fs').writeFileSync(filepath, buffer);

    // Insert into doacoes table with placeholders for required fields
    const usuario_id = req.body.usuario_id || 0;
    const destino = req.body.destino || 'bazar';
    const tempo_uso = req.body.tempo_uso || '0';
    const estado = req.body.estado || 'novo';
    const tamanho = req.body.tamanho || 'N/A';
    db.query('INSERT INTO doacoes (usuario_id, foto, descricao, destino, tempo_uso, estado, tamanho) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuario_id, filename, descricao || nome, destino, tempo_uso, estado, tamanho], (err, result) => {
        if (err) {
          console.error('[admin-upload] DB error on insert:', err);
          return res.status(500).json({ error: 'Erro ao registrar doação.' });
        }
        console.log('[admin-upload] saved as', filename);
        return res.json({ success: true, id: result.insertId, filename });
      }
    );
  } catch (e) {
    console.error('[admin-upload] unexpected error:', e);
    return res.status(500).json({ error: 'Erro ao processar imagem.' });
  }
});

// List doacoes (for admin panel)
app.get('/api/doacoes', (req, res) => {
  db.query('SELECT id, usuario_id, foto, descricao, destino, tempo_uso, estado, tamanho FROM doacoes ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar doações.' });
    // map foto to full URL path
    const host = req.protocol + '://' + req.get('host');
    const rows = results.map(r => ({ ...r, fotoUrl: r.foto ? host + '/uploads/' + r.foto : null }));
    res.json({ success: true, doacoes: rows });
  });
});

// Delete a donation (admin)
app.delete('/api/doacao/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'ID ausente.' });
  db.query('SELECT foto FROM doacoes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar doação.' });
    if (!results || results.length === 0) return res.status(404).json({ error: 'Doação não encontrada.' });
    const foto = results[0].foto;
    db.query('DELETE FROM doacoes WHERE id = ?', [id], (delErr) => {
      if (delErr) return res.status(500).json({ error: 'Erro ao remover doação.' });
      try {
        if (foto) {
          const filepath = path.join(__dirname, 'uploads', foto);
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        }
      } catch (e) {
        console.warn('Não foi possível remover arquivo associado:', e);
      }
      return res.json({ success: true });
    });
  });
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', // altere via env
  password: process.env.DB_PASS || 'root', // altere via env
  database: process.env.DB_NAME || 'EcoFashion' // altere via env
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
    // Ensure 'role' column exists and create default admin user if missing
    (async () => {
      try {
        // Check if 'role' column exists
        db.query(
          "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'role'",
          [db.config.database],
          async (errCol, colResults) => {
            if (errCol) {
              console.error('Erro ao checar colunas:', errCol);
              return;
            }
            if (!colResults || colResults.length === 0) {
              // Add role column (default 'user')
              db.query("ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) DEFAULT 'user'", (errAlter) => {
                if (errAlter) console.error('Erro ao adicionar coluna role:', errAlter);
                else console.log("Coluna 'role' adicionada à tabela usuarios.");
              });
            }

            // Check if an admin user already exists
            db.query("SELECT * FROM usuarios WHERE role = 'admin' LIMIT 1", (errAdmin, adminResults) => {
              if (errAdmin) {
                console.error('Erro ao buscar admin:', errAdmin);
                return;
              }
              const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'adm@gmail.com';
              const defaultPass = process.env.DEFAULT_ADMIN_PASS || 'adm123';
              const defaultName = process.env.DEFAULT_ADMIN_NAME || 'admin';
              if (!adminResults || adminResults.length === 0) {
                // Create default admin user with plaintext password (keeps previous demo behaviour)
                db.query(
                  'INSERT INTO usuarios (nome, email, senha, foto, trevos, role) VALUES (?, ?, ?, ?, ?, ?) ',
                  [defaultName, defaultEmail, defaultPass, null, 0, 'admin'],
                  (errInsert) => {
                    if (errInsert) {
                      if (errInsert.code === 'ER_DUP_ENTRY') {
                        // If email exists, update role and senha (store plaintext per demo)
                        db.query(
                          'UPDATE usuarios SET role = ?, senha = ? WHERE email = ?',
                          ['admin', defaultPass, defaultEmail],
                          (errUpd) => {
                            if (errUpd) console.error('Erro ao atualizar role do admin:', errUpd);
                            else console.log('Usuário admin atualizado com role=admin e senha padrão.');
                          }
                        );
                      } else {
                        console.error('Erro ao inserir admin default:', errInsert);
                      }
                    } else {
                      console.log('Usuário admin default criado (Administrador) com senha padrão.');
                    }
                  }
                );
              } else {
                // Ensure existing admin has role 'admin' and default plaintext password if needed
                const existing = adminResults[0];
                  if (existing.role !== 'admin' || existing.senha !== defaultPass) {
                  db.query('UPDATE usuarios SET role = ?, nome = ?, senha = ? WHERE id = ?', ['admin', defaultName, defaultPass, existing.id], (errUpd2) => {
                    if (errUpd2) console.error('Erro ao ajustar role/senha do admin existente:', errUpd2);
                    else console.log('Role/senha do admin existente ajustada para admin/senha padrão.');
                  });
                }
              }
            });
          }
        );
      } catch (e) {
        console.error('Erro na inicialização do admin:', e);
      }
    })();
  }
});

// Admin-specific login endpoint (searches admins by nome or email)
app.post('/api/admin-login', (req, res) => {
  const { user, senha } = req.body;
  if (!user || !senha) {
    return res.status(400).json({ error: 'Preencha usuário e senha.' });
  }
  db.query(
    "SELECT * FROM usuarios WHERE role = 'admin' AND (email = ? OR nome = ?)",
    [user, user],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
      const fallbackEmail = process.env.DEFAULT_ADMIN_EMAIL || 'adm@gmail.com';
      const fallbackPass = process.env.DEFAULT_ADMIN_PASS || 'adm123';

      if (results.length === 0) {
        // No admin found in DB - allow fallback default credentials to create admin
        if (user === fallbackEmail && senha === fallbackPass) {
          // create admin record
          db.query('INSERT INTO usuarios (nome, email, senha, foto, trevos, role) VALUES (?, ?, ?, ?, ?, ?) ', [user, user, senha, null, 0, 'admin'], (errIns, resultIns) => {
            if (errIns) return res.status(500).json({ error: 'Erro ao criar admin.' });
            return res.json({ success: true, usuario: { id: resultIns.insertId, nome: user, email: user } });
          });
          return;
        }
        return res.status(401).json({ error: 'Administrador não encontrado.' });
      }

      const usuario = results[0];
      // Plain-text comparison for admin (keeps demo behaviour)
      if (senha !== usuario.senha) {
        // If provided credentials match fallback, update the existing admin to fallback password
        if (user === fallbackEmail && senha === fallbackPass) {
          db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [senha, usuario.id], (errUpd) => {
            if (errUpd) return res.status(500).json({ error: 'Erro ao atualizar senha do admin.' });
            return res.json({ success: true, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
          });
          return;
        }
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      res.json({ success: true, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    }
  );
});

// Cadastro
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, foto } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  const hash = await bcrypt.hash(senha, 10);
  db.query('INSERT INTO usuarios (nome, email, senha, foto, trevos) VALUES (?, ?, ?, ?, ?)', [nome, email, hash, foto || null, 0], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email já cadastrado.' });
      }
      return res.status(500).json({ error: 'Erro ao cadastrar.' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha email e senha.' });
  }
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado.' });
    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ error: 'Senha incorreta.' });
    res.json({ success: true, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, foto: usuario.foto, trevos: usuario.trevos } });
  });
});

// Buscar usuário por ID
app.get('/api/usuario/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT id, nome, email, foto, trevos FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const usuario = results[0];
    res.json({ success: true, usuario });
  });
});

// Processar troca: debita trevos se houver saldo suficiente
app.post('/api/troca', (req, res) => {
  const { usuario_id, custo, produto, endereco } = req.body;
  if (!usuario_id || typeof custo === 'undefined') {
    return res.status(400).json({ error: 'Parâmetros ausentes.' });
  }
  // Verificar saldo
  db.query('SELECT trevos FROM usuarios WHERE id = ?', [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao consultar usuário.' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const saldo = results[0].trevos || 0;
    if (saldo < custo) {
      return res.json({ success: false, error: 'trevos_insuficientes', saldo });
    }
    const novo = saldo - custo;
    // Atualizar saldo no banco
    db.query('UPDATE usuarios SET trevos = ? WHERE id = ?', [novo, usuario_id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao atualizar saldo.' });
      // Opcional: registrar a troca em uma tabela 'trocas' (se existir). Para agora, retornamos sucesso.
      return res.json({ success: true, novoSaldo: novo });
    });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Export DB for modular routers
module.exports.db = db;
