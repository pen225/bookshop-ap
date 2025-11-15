DROP DATABASE IF EXISTS bookshop;
CREATE DATABASE bookshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookshop;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client','editeur','gestionnaire','administrateur') NOT NULL DEFAULT 'client',
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE ouvrages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(200),
  isbn VARCHAR(32) UNIQUE,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  categorie_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE panier_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panier_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);
ALTER TABLE panier_items ADD UNIQUE KEY uniq_panier_ouvrage (panier_id, ouvrage_id);

CREATE TABLE commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_cours','payee','annulee','expediee') DEFAULT 'en_cours',
  adresse_livraison TEXT,
  mode_livraison VARCHAR(100),
  mode_paiement VARCHAR(100),
  payment_provider_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  ouvrage_id INT,
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE SET NULL
);

CREATE TABLE listes_cadeaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  proprietaire_id INT NOT NULL,
  code_partage VARCHAR(64) UNIQUE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE liste_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  liste_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite_souhaitee INT NOT NULL,
  FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

CREATE TABLE avis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  ouvrage_id INT,
  note INT,
  commentaire TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_client_ouvrage (client_id, ouvrage_id),
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

CREATE TABLE commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  ouvrage_id INT,
  contenu TEXT,
  valide BOOLEAN DEFAULT FALSE,
  date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_validation DATETIME NULL,
  valide_par INT NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
  FOREIGN KEY (valide_par) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  provider VARCHAR(100),
  provider_payment_id VARCHAR(255),
  statut VARCHAR(50),
  amount DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
);

-- Seeds

INSERT INTO users (nom,email,password_hash,role) VALUES
('Admin','admin@example.com','$2b$10$abcdefghijklmnopqrstuv','administrateur'),
('Editeur','editeur@example.com','$2b$10$abcdefghijklmnopqrstuv','editeur'),
('Client','client@example.com','$2b$10$abcdefghijklmnopqrstuv','client');

INSERT INTO categories (nom,description) VALUES
('Informatique','Livres techniques'),
('Romans','Fiction'),
('Développement personnel','Bien-être et efficacité');

INSERT INTO ouvrages (titre,auteur,isbn,description,prix,stock,categorie_id) VALUES
('Node.js avancé','Jane Dev','978000000001','Perfectionnez Node.js',49.90,10,1),
('Le grand roman','A. Auteur','978000000002','Roman populaire',19.50,5,2),
('Les 7 habitudes','S. Covey','9781111111111','Développement personnel',19.50,30,3);
