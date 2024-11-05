#Lancez les conteneurs :
docker-compose up -d

#Installez les dépendances et configurez Laravel :
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate