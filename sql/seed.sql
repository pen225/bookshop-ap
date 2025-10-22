USE bookshop;

-- =========================
-- USERS
-- =========================
INSERT INTO users (nom, email, password_hash, role) VALUES
('Admin', 'admin@bookshop.com', '$2b$10$abcdefghijklmnopqrstuv', 'administrateur'),
('Editeur', 'editeur@bookshop.com', '$2b$10$abcdefghijklmnopqrstuv', 'editeur'),
('Gestionnaire', 'gestionnaire@bookshop.com', '$2b$10$abcdefghijklmnopqrstuv', 'gestionnaire'),
('Client A', 'client1@bookshop.com', '$2b$10$abcdefghijklmnopqrstuv', 'client'),
('Client B', 'client2@bookshop.com', '$2b$10$abcdefghijklmnopqrstuv', 'client');

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories (nom, description) VALUES
('Romans', 'Ouvrages de fiction et littérature'),
('Sciences', 'Ouvrages scientifiques et techniques'),
('Développement personnel', 'Livres de motivation et croissance personnelle');

-- =========================
-- OUVRAGES
-- =========================
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '9781234567897', 'Conte philosophique pour enfants', 12.99, 50, 1),
('Introduction à la physique', 'Albert Einstein', '9789876543210', 'Ouvrage sur la physique moderne', 29.99, 20, 2),
('Les 7 habitudes des gens efficaces', 'Stephen Covey', '9781111111111', 'Développement personnel', 19.50, 30, 3);

-- =========================
-- PANIER
-- =========================
INSERT INTO panier (client_id, actif) VALUES (4, TRUE);

-- =========================
-- PANIER_ITEMS
-- =========================
INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES
(1, 1, 2, 12.99),
(1, 3, 1, 19.50);

-- =========================
-- COMMANDES
-- =========================
INSERT INTO commandes (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement)
VALUES (4, 45.48, 'payee', '123 Rue des Livres, Montréal', 'standard', 'paypal');

-- =========================
-- COMMANDE_ITEMS
-- =========================
INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire)
VALUES (1, 1, 2, 12.99), (1, 3, 1, 19.50);

-- =========================
-- AVIS
-- =========================
INSERT INTO avis (client_id, ouvrage_id, note, commentaire)
VALUES (4, 1, 5, 'Excellent livre !'), (4, 3, 4, 'Très instructif');

-- =========================
-- COMMENTAIRES
-- =========================
INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide)
VALUES (4, 1, 'J\'ai adoré ce livre !', TRUE);