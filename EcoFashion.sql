CREATE DATABASE EcoFashion;
USE EcoFashion;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  foto VARCHAR(255),
  trevos INT DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  foto VARCHAR(255),
  descricao TEXT,
  destino VARCHAR(100),
  tempo_uso VARCHAR(50),
  estado VARCHAR(50),
  tamanho VARCHAR(10),
  status VARCHAR(20) DEFAULT 'analise',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

SELECT * FROM usuarios;
SELECT * FROM doacoes;