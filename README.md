# bookshop-api

## PrÃ©sentation du projet

Le projet **Bookshop API** est une application RESTful dÃ©veloppÃ©e avec **Node.js**, **Express** et **MySQL**.  
Elle permet de gÃ©rer une librairie en ligne incluant :

- La gestion des **utilisateurs** (authentification JWT + rÃ´les)
- Le **catalogue de livres** (CRUD complet)
- Le **panier**, les **commandes**, et les **paiements simulÃ©s**
- Les **avis** et **commentaires** validÃ©s
- Les **listes de cadeaux** partageables

Lâ€™API respecte les bonnes pratiques REST et les rÃ¨gles mÃ©tier (stock, validation, rÃ´les, etc.), sans ORM.

---

## Membres de lâ€™Ã©quipe & rÃ©partition des tÃ¢ches

Membre (Penuel & Alvin Obo)

**Penuel Essoh** Back-end | Architecture du backend, routes Express, validation des endpoints
**Alvin Obo** Base de donnÃ©es | ModÃ©lisation SQL, scripts `schema.sql` et `seed.sql`
**Alvin Obo** Documentation | RÃ©daction README, Postman

---

## Installation et exÃ©cution locale

### PrÃ©requis

- Node.js â‰¥ 18
- MySQL â‰¥ 8
- npm ou yarn
- (Optionnel) Postman pour tester les requÃªtes

### Ã‰tapes dâ€™installation (Back-end)

1. **Cloner le dÃ©pÃ´t :**
   ```bash
   git clone https://github.com/pen225/bookshop-api.git
   cd bookshop-api
   
---

### Installer les dÃ©pendances

- Dans la console (bash)
- npm install

---

### Configurer lâ€™environnement

- Ajuster les variables du fichier .env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bookshop
JWT_SECRET=secret_key
PORT=3000

---

### CrÃ©er la base de donnÃ©es

- Dans la console (bash)
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql


---

### Lancer le serveur

- Dans la console (bash)
npm run dev

---

### Endpoints principaux

- Authentification

| MÃ©thode | Endpoint             | Description             |
| ------- | -------------------- | ----------------------- |
| `POST`  | `/api/auth/register` | Inscription utilisateur |
| `POST`  | `/api/auth/login`    | Connexion et token JWT  |

- Utilisateurs

| MÃ©thode | Endpoint        | Description                      |
| ------- | --------------- | -------------------------------- |
| `GET`   | `/api/users/me` | Profil de lâ€™utilisateur connectÃ© |
| `GET`   | `/api/users`    | Liste des utilisateurs (admin)   |
| `POST`  | `/api/users`    | CrÃ©er un utilisateur (admin)     |

- Ouvrages

| MÃ©thode | Endpoint        | Description              |
| ------- | --------------- | ------------------------ |
| `GET`   | `/api/ouvrages` | Liste des livres         |
| `POST`  | `/api/ouvrages` | CrÃ©er un livre (editeur) |

- Panier

| MÃ©thode | Endpoint            | Description        |
| ------- | ------------------- | ------------------ |
| `GET`   | `/api/panier`       | RÃ©cupÃ¨re le panier |
| `POST`  | `/api/panier/items` | Ajoute un article  |