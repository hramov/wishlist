git pull origin main --allow-unrelated-histories
docker build -t wishlist .
docker-compose up -d && docker-compose logs -f