# Lamanager

## Description
Lamanager est une application web basée sur Laravel et React, utilisant Inertia.js pour créer une expérience utilisateur fluide.

## Prérequis
- Docker
- Docker Compose
- Git

## Installation

1. Cloner le projet
bash
git clone <url-du-repo>
cd lamanager

2. Copier le fichier d'environnement
cp .env.example .env

3. Lancer les conteneurs Docker
bash
docker-compose build
docker-compose up -d

docker exec -it lamanager-app composer install
docker exec -it lamanager-app npm i

4. Installer les dépendances et configurer l'application
bash
Générer la clé d'application
docker-compose exec app php artisan key:generate
Exécuter les migrations
docker-compose exec app php artisan migrate

Lancer le serveur React
docker exec -it lamanager-app npm run dev

## Accès à l'application
Une fois l'installation terminée, l'application est accessible à :
- Application : http://localhost:8000
- Base de données MariaDB :
  - Host: localhost
  - Port: 3306
  - Database: lamanager
  - Username: lamanager
  - Password: password

## Structure Docker
Le projet utilise trois services Docker :
- **app** : PHP 8.2 avec Apache
- **db** : MariaDB 10.6

## Commandes utiles

### Docker

Démarrer les conteneurs
docker-compose up -d
Arrêter les conteneurs
docker-compose down
Voir les logs
docker-compose logs -f
Reconstruire les conteneurs
docker-compose build --no-cache

### Utiliser Docker sous Ubuntu
Installer Ubuntu depuis le Windows Store
wsl --install sous Powershell windows
sur Docker Desktop : Paramètres > Ressources > WSL Integration > Activer Ubuntu.
lancer le logiciel Ubuntu > Créer son utilisateur
Toujours sous Ubuntu :
mkdir projet
cp -r /mnt/c/Users/utilisateur/<votre>/<dossier>/Lamanager /projet
docker-compose build
docker-compose up -d
docker-compose exec app npm run dev

Si erreur de permission, aller sur le conteneur app et executer
sudo chown -R www-data:www-data /var/www/html/Lamanager/storage /var/www/html/Lamanager/bootstrap/cache
sudo chmod -R 775 /var/www/html/Lamanager/storage /var/www/html/Lamanager/bootstrap/cache


### Laravel
Exécuter les migrations
docker-compose exec app php artisan migrate
Réinitialiser la base de données
docker-compose exec app php artisan migrate:fresh
Créer un nouveau contrôleur
docker-compose exec app php artisan make:controller NomController
Vider le cache
docker-compose exec app php artisan cache:clear


### NPM (si nécessaire)
Installer les dépendances
docker-compose exec app npm install
Compiler les assets
docker-compose exec app npm run build
Mode développement
docker-compose exec app npm run dev
executer seeder

docker exec -it lamanager-app php artisan migrate:fresh --seed

Migration

caramel
