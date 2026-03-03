# URUMURI REGIO - Deployment Guide

## Backend Deployment (Production Ready ✅)

### Prerequisites

- Ubuntu 20.04+ or similar Linux server
- Node.js 18+
- PostgreSQL 14+
- nginx (for reverse proxy)
- SSL certificate (Let's Encrypt recommended)
- Domain name

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE urumuri;
CREATE USER urumuri_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE urumuri TO urumuri_user;
\q
```

### Step 3: Application Deployment

```bash
# Create app directory
sudo mkdir -p /var/www/urumuri
sudo chown $USER:$USER /var/www/urumuri

# Clone or copy project
cd /var/www/urumuri
# Upload your backend folder here

cd backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env
```

### Step 4: Environment Configuration

Edit `/var/www/urumuri/backend/.env`:

```env
DATABASE_URL="postgresql://urumuri_user:your_secure_password@localhost:5432/urumuri"
JWT_SECRET="generate-a-strong-random-secret-here"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="generate-another-strong-secret"
JWT_REFRESH_EXPIRES_IN="30d"
PORT=3001
NODE_ENV="production"
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Database Migration & Seed

```bash
cd /var/www/urumuri/backend

# Run migrations
npx prisma migrate deploy

# Seed database (optional for demo data)
npx prisma db seed

# Build application
npm run build
```

### Step 6: Process Manager (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
cd /var/www/urumuri/backend
pm2 start dist/main.js --name urumuri-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs

# Monitor
pm2 status
pm2 logs urumuri-api
```

### Step 7: Nginx Configuration

Create `/etc/nginx/sites-available/urumuri`:

```nginx
server {
    listen 80;
    server_name api.urumuri.rw;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/urumuri /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: SSL Certificate

```bash
sudo certbot --nginx -d api.urumuri.rw
```

### Step 9: Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 10: Verify Deployment

```bash
# Check API health
curl https://api.urumuri.rw/api

# Check Swagger docs
# Visit: https://api.urumuri.rw/api
```

## Docker Deployment (Alternative)

### Using Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose

# Navigate to project
cd /var/www/urumuri

# Update docker-compose.yml with production settings
nano docker-compose.yml

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: urumuri
      POSTGRES_USER: urumuri_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - urumuri-network

  backend:
    build: ./backend
    restart: always
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://urumuri_user:${DB_PASSWORD}@postgres:5432/urumuri
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      NODE_ENV: production
      TZ: Africa/Kigali
    depends_on:
      - postgres
    networks:
      - urumuri-network

volumes:
  postgres_data:

networks:
  urumuri-network:
    driver: bridge
```

## Monitoring & Maintenance

### Log Management

```bash
# PM2 logs
pm2 logs urumuri-api --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-urumuri.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/urumuri"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U urumuri_user urumuri > $BACKUP_DIR/urumuri_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "urumuri_*.sql" -mtime +7 -delete

echo "Backup completed: urumuri_$DATE.sql"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-urumuri.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-urumuri.sh
```

### Application Updates

```bash
cd /var/www/urumuri/backend

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart application
pm2 restart urumuri-api

# Check status
pm2 status
pm2 logs urumuri-api --lines 50
```

### Health Checks

```bash
# Check application
curl https://api.urumuri.rw/api

# Check database connection
sudo -u postgres psql -d urumuri -c "SELECT COUNT(*) FROM \"User\";"

# Check PM2 status
pm2 status

# Check nginx status
sudo systemctl status nginx

# Check disk space
df -h

# Check memory
free -h
```

## Performance Optimization

### PostgreSQL Tuning

Edit `/etc/postgresql/14/main/postgresql.conf`:

```conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Nginx Caching

Add to nginx config:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
    # ... rest of proxy settings
}
```

## Security Checklist

- ✅ Use strong JWT secrets (64+ characters)
- ✅ Enable SSL/TLS (HTTPS only)
- ✅ Configure firewall (UFW)
- ✅ Regular security updates
- ✅ Database user with limited privileges
- ✅ Environment variables (never commit .env)
- ✅ Rate limiting enabled
- ✅ CORS configured for frontend domain only
- ✅ Regular backups
- ✅ Monitor logs for suspicious activity

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs urumuri-api

# Check environment
cat /var/www/urumuri/backend/.env

# Test database connection
npx prisma db pull
```

### Database connection errors

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
sudo -u postgres psql -d urumuri -c "SELECT 1;"

# Verify DATABASE_URL in .env
```

### High memory usage

```bash
# Check PM2 memory
pm2 monit

# Restart application
pm2 restart urumuri-api

# Check for memory leaks in logs
pm2 logs urumuri-api | grep -i "memory"
```

## Support

For production issues:
- Check logs first
- Review error messages
- Verify environment configuration
- Test database connectivity
- Check firewall rules

## Rollback Procedure

```bash
# Stop application
pm2 stop urumuri-api

# Restore database backup
psql -U urumuri_user urumuri < /var/backups/urumuri/urumuri_YYYYMMDD_HHMMSS.sql

# Revert code
git checkout <previous-commit-hash>
npm install --production
npm run build

# Restart
pm2 restart urumuri-api
```

---

**Production Status**: Backend Ready ✅
**Last Updated**: March 3, 2026
**Version**: 1.0.0
