-- schema.sql
-- Désactive temporairement les checks FK pour pouvoir supprimer les tables dans l'ordre sans erreur
SET FOREIGN_KEY_CHECKS = 0;
-- Suppression si existant (utile pour réinitialiser)
DROP TABLE IF EXISTS payments, commentaire, avis, liste_items, listes_cadeaux, commande_items, commandes, panier_items, panier, ouvrages, categories, users;
-- Reinstate FK checks
SET FOREIGN_KEY_CHECKS = 1;

-- Table users : stocke les utilisateurs
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,                       -- PK auto-incrémentée
  nom VARCHAR(150),                                        -- nom de l'utilisateur (nullable)
  email VARCHAR(255) NOT NULL UNIQUE,                      -- email unique et obligatoire
  password_hash VARCHAR(255) NOT NULL,                     -- hash bcrypt du mot de passe
  role ENUM('client','editeur','gestionnaire','administrateur') NOT NULL DEFAULT 'client', -- rôle
  actif BOOLEAN NOT NULL DEFAULT TRUE,                     -- flag compte actif/inactif
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,           -- date création
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- date maj auto
);

-- Table categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL UNIQUE,
  description TEXT
);

-- Table ouvrages (produits)
CREATE TABLE ouvrages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(255),
  isbn VARCHAR(50) UNIQUE,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  categorie_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ouvrage_categorie FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_ouvrages_titre ON ouvrages(titre);         -- index pour recherches par titre
CREATE INDEX idx_ouvrages_stock ON ouvrages(stock);         -- index pour filter stock>0

-- Table panier
CREATE TABLE panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_panier_user FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table panier_items
CREATE TABLE panier_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panier_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_panieritem_panier FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
  CONSTRAINT fk_panieritem_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- Table commandes
CREATE TABLE commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL,
  statut ENUM('en_cours','payee','annulee','expediee') NOT NULL DEFAULT 'en_cours',
  adresse_livraison TEXT,
  mode_livraison VARCHAR(100),
  mode_paiement VARCHAR(100),
  payment_provider_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_commande_user FOREIGN KEY (client_id) REFERENCES users(id)
);
CREATE INDEX idx_commandes_client ON commandes(client_id);

-- Table commande_items
CREATE TABLE commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_commandeitem_commande FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  CONSTRAINT fk_commandeitem_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- Listes de cadeaux
CREATE TABLE listes_cadeaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  proprietaire_id INT NOT NULL,
  code_partage VARCHAR(100) UNIQUE,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_liste_user FOREIGN KEY (proprietaire_id) REFERENCES users(id)
);

-- Items des listes
CREATE TABLE liste_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  liste_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite_souhaitee INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_listeitem_liste FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
  CONSTRAINT fk_listeitem_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- Avis (une seule note par client/ouvrage si on veut)
CREATE TABLE avis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  note TINYINT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_avis_client_ouvrage UNIQUE (client_id, ouvrage_id),
  CONSTRAINT fk_avis_user FOREIGN KEY (client_id) REFERENCES users(id),
  CONSTRAINT fk_avis_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- Commentaires (nécessitent validation)
CREATE TABLE commentaire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  contenu TEXT NOT NULL,
  valide BOOLEAN NOT NULL DEFAULT FALSE,
  date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_validation DATETIME NULL,
  valide_par INT NULL,
  CONSTRAINT fk_commentaire_user FOREIGN KEY (client_id) REFERENCES users(id),
  CONSTRAINT fk_commentaire_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id),
  CONSTRAINT fk_commentaire_validepar FOREIGN KEY (valide_par) REFERENCES users(id)
);

-- Payments (optionnel / simulation)
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  provider VARCHAR(100),
  provider_payment_id VARCHAR(255),
  statut VARCHAR(50),
  amount DECIMAL(12,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_commande FOREIGN KEY (commande_id) REFERENCES commandes(id)
);
