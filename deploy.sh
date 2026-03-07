#!/bin/bash
# Deba Car Rental — VPS Deployment Script
# Usage: ./deploy.sh

set -e

echo "=== Deba Car Rental Deployment ==="

# 1. Build frontend
echo "[1/4] Building frontend..."
npm run build

# 2. Build backend Docker image
echo "[2/4] Building backend..."
docker compose build api

# 3. Run database migrations
echo "[3/4] Running database migrations..."
docker compose up -d db
sleep 3
docker compose exec api npx prisma db push

# 4. Start all services
echo "[4/4] Starting services..."
docker compose up -d

echo ""
echo "=== Deployment complete ==="
echo "Frontend: http://localhost (via Nginx)"
echo "API:      http://localhost/api/health"
echo ""
echo "Next steps:"
echo "  1. Set up SSL with certbot: sudo certbot --nginx -d yourdomain.com"
echo "  2. Update FRONTEND_URL in .env to your domain"
echo "  3. Generate admin password hash: node -e \"require('bcrypt').hash('yourpassword', 10).then(console.log)\""
