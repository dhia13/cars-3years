
# 3ansdz Backend API

Ce dépôt contient le backend API pour le site 3ansdz, développé avec Node.js, Express et MongoDB.

## Configuration

1. Clonez ce dépôt
2. Installez les dépendances avec `npm install`
3. Copiez `.env.example` vers `.env` et configurez les variables d'environnement
4. Lancez le serveur avec `npm start` ou `npm run dev` pour le mode développement

## Variables d'environnement

- `MONGODB_URI`: URI de connexion à votre base de données MongoDB
- `PORT`: Port sur lequel l'API va tourner (défaut: 5000)
- `EMAIL_USER`: Adresse email pour l'envoi des notifications
- `EMAIL_PASS`: Mot de passe ou mot de passe d'application pour l'email
- `ADMIN_USERNAME`: Nom d'utilisateur pour l'interface d'administration
- `ADMIN_PASSWORD`: Mot de passe pour l'interface d'administration
- `JWT_SECRET`: Clé secrète pour la génération des tokens JWT

## Fonctionnalités

- Gestion complète des véhicules (CRUD)
- Upload et gestion d'images pour les véhicules
- Formulaire de contact avec notifications par email
- Suivi des visiteurs avec statistiques
- Panneau d'administration sécurisé par JWT
- Configuration du site (vidéo, textes, informations de contact)

## Routes API

### Véhicules

- `GET /api/vehicles` - Récupérer tous les véhicules
- `GET /api/vehicles/featured` - Récupérer les véhicules mis en avant
- `GET /api/vehicles/:id` - Récupérer un véhicule spécifique
- `POST /api/vehicles` - Créer un nouveau véhicule (auth requise)
- `PUT /api/vehicles/:id` - Mettre à jour un véhicule (auth requise)
- `DELETE /api/vehicles/:id` - Supprimer un véhicule (auth requise)
- `POST /api/vehicles/upload/:id?` - Uploader des images pour un véhicule (auth requise)

### Contacts

- `POST /api/contact` - Soumettre un formulaire de contact
- `GET /api/contact` - Récupérer tous les contacts (auth requise)
- `GET /api/contact/:id` - Récupérer un contact spécifique (auth requise)
- `PUT /api/contact/:id/respond` - Marquer un contact comme traité (auth requise)
- `DELETE /api/contact/:id` - Supprimer un contact (auth requise)

### Visiteurs

- `POST /api/visitors/record` - Enregistrer une visite
- `GET /api/visitors/stats` - Obtenir les statistiques des visiteurs (auth requise)

### Administration

- `POST /api/admin/login` - Connexion administrateur
- `POST /api/admin/upload-video` - Uploader une vidéo (auth requise)
- `GET /api/admin/site-config` - Récupérer la configuration du site (auth requise)
- `PUT /api/admin/site-config` - Mettre à jour la configuration du site (auth requise)

## Authentification

L'API utilise l'authentification JWT pour les routes protégées. Pour accéder à ces routes, incluez un header `Authorization: Bearer <token>` dans vos requêtes.

Pour obtenir un token, envoyez une requête POST à `/api/admin/login` avec les identifiants admin.

## Déploiement

Ce backend peut être déployé sur n'importe quel service supportant Node.js comme:
- Heroku
- Vercel
- DigitalOcean
- AWS
- Google Cloud
- Etc.

Assurez-vous de configurer les variables d'environnement sur votre service d'hébergement.
