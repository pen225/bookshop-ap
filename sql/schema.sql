-- =====================================================================
-- SCHEMA SQL - BOOKSHOP
-- Base de donnÃ©es pour l'API REST Node.js + Express + MySQL
-- =====================================================================

DROP DATABASE IF EXISTS bookshop;
CREATE DATABASE bookshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookshop;

-- =========================
-- TABLE: users
-- =========================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client','editeur','gestionnaire','administrateur') DEFAULT 'client',
  actif BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- TABLE: categories
-- =========================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- =========================
-- TABLE: ouvrages
-- =========================
CREATE TABLE ouvrages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(150),
  isbn VARCHAR(50) UNIQUE,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
  stock INT DEFAULT 0 CHECK (stock >= 0),
  categorie_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =========================
-- TABLE: panier
-- =========================
CREATE TABLE panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: panier_items
-- =========================
CREATE TABLE panier_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panier_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL CHECK (quantite > 0),
  prix_unitaire DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: commandes
-- =========================
CREATE TABLE commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_cours','payee','annulee','expediee') DEFAULT 'en_cours',
  adresse_livraison TEXT,
  mode_livraison VARCHAR(100),
  mode_paiement VARCHAR(100),
  payment_provider_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: commande_items
-- =========================
CREATE TABLE commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL CHECK (quantite > 0),
  prix_unitaire DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: listes_cadeaux
-- =========================
CREATE TABLE listes_cadeaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  proprietaire_id INT NOT NULL,
  code_partage VARCHAR(100) UNIQUE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: liste_items
-- =========================
CREATE TABLE liste_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  liste_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite_souhaitee INT NOT NULL CHECK (quantite_souhaitee > 0),
  FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: avis
-- =========================
CREATE TABLE avis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_client_ouvrage (client_id, ouvrage_id),
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

-- =========================
-- TABLE: commentaires
-- =========================
CREATE TABLE commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  contenu TEXT NOT NULL,
  valide BOOLEAN DEFAULT FALSE,
  date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_validation DATETIME NULL,
  valide_par INT NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
  FOREIGN KEY (valide_par) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================
-- TABLE: payments (optionnel)
-- =========================
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