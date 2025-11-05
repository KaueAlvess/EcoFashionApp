const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
// Rota para registrar doação
app.post('/api/doacao', upload.single('foto'), (req, res) => {
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

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // altere para seu usuário
  password: 'root', // altere para sua senha
  database: 'EcoFashion' // altere para o nome do seu banco
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
              const defaultEmail = 'admin@ecofashion.local';
              const defaultPass = '123'; // admin password (plaintext) per user's request
              if (!adminResults || adminResults.length === 0) {
                // Create default admin user with plaintext password
                db.query(
                  'INSERT INTO usuarios (nome, email, senha, foto, trevos, role) VALUES (?, ?, ?, ?, ?, ?) ',
                  ['kaue', defaultEmail, defaultPass, null, 0, 'admin'],
                  (errInsert) => {
                    if (errInsert) {
                      if (errInsert.code === 'ER_DUP_ENTRY') {
                        // If email exists, update role and senha
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
                // Ensure existing admin has role 'admin' and the default password
                const existing = adminResults[0];
                if (existing.role !== 'admin' || existing.senha !== defaultPass) {
                  db.query('UPDATE usuarios SET role = ?, nome = ?, senha = ? WHERE id = ?', ['admin','kaue', defaultPass, existing.id], (errUpd2) => {
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
      if (results.length === 0) return res.status(401).json({ error: 'Administrador não encontrado.' });
      const usuario = results[0];
      // Plain-text comparison for admin (per project/demo requirement)
      if (senha !== usuario.senha) return res.status(401).json({ error: 'Senha incorreta.' });
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
