
# Guia de Deploy para VPS - Sistema de Gestão CRM

Este guia contém todas as instruções necessárias para rodar o sistema 24h em sua VPS.

## Pré-requisitos da VPS

- Ubuntu 20.04+ ou Debian 11+
- Mínimo 2GB RAM
- 20GB+ espaço em disco
- Acesso root ou sudo

## 1. Preparação do Servidor

### Atualizar o sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar dependências essenciais
```bash
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx
```

### Instalar Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verificar instalações
```bash
node --version
npm --version
nginx -v
```

## 2. Configuração do Projeto

### Clonar o repositório
```bash
cd /var/www
sudo git clone <SEU_REPOSITORIO_GIT> crm-system
sudo chown -R $USER:$USER /var/www/crm-system
cd crm-system
```

### Instalar dependências
```bash
npm install
```

### Build do projeto
```bash
npm run build
```

## 3. Configuração do Nginx

### Criar arquivo de configuração
```bash
sudo nano /etc/nginx/sites-available/crm-system
```

### Conteúdo do arquivo nginx:
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com www.SEU_DOMINIO.com;
    
    root /var/www/crm-system/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
}
```

### Ativar o site
```bash
sudo ln -s /etc/nginx/sites-available/crm-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Configuração SSL (HTTPS)

### Obter certificado SSL
```bash
sudo certbot --nginx -d SEU_DOMINIO.com -d www.SEU_DOMINIO.com
```

### Verificar renovação automática
```bash
sudo certbot renew --dry-run
```

## 5. Process Manager com PM2

### Instalar PM2 globalmente
```bash
sudo npm install -g pm2
```

### Criar script de deploy automático
```bash
nano /var/www/crm-system/deploy.sh
```

### Conteúdo do deploy.sh:
```bash
#!/bin/bash
set -e

echo "🚀 Iniciando deploy do CRM System..."

# Navegar para o diretório do projeto
cd /var/www/crm-system

# Fazer backup da build anterior
if [ -d "dist" ]; then
    mv dist dist.backup.$(date +%Y%m%d_%H%M%S)
fi

# Atualizar código
git pull origin main

# Instalar/atualizar dependências
npm ci

# Build do projeto
npm run build

# Reiniciar nginx
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
```

### Tornar executável
```bash
chmod +x /var/www/crm-system/deploy.sh
```

## 6. Monitoramento e Logs

### Configurar logrotate para nginx
```bash
sudo nano /etc/logrotate.d/nginx
```

### Conteúdo do logrotate:
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

## 7. Firewall (UFW)

### Configurar firewall
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

## 8. Backup Automático

### Criar script de backup
```bash
sudo nano /usr/local/bin/backup-crm.sh
```

### Conteúdo do backup:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/crm-system"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do código
tar -czf "$BACKUP_DIR/crm-code-$DATE.tar.gz" -C /var/www crm-system

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "crm-code-*.tar.gz" -mtime +7 -delete

echo "Backup concluído: crm-code-$DATE.tar.gz"
```

### Tornar executável e agendar
```bash
sudo chmod +x /usr/local/bin/backup-crm.sh
sudo crontab -e
```

### Adicionar ao crontab (backup diário às 2h):
```
0 2 * * * /usr/local/bin/backup-crm.sh >> /var/log/backup-crm.log 2>&1
```

## 9. Monitoramento de Sistema

### Instalar htop para monitoramento
```bash
sudo apt install htop
```

### Script de monitoramento de recursos
```bash
sudo nano /usr/local/bin/system-monitor.sh
```

### Conteúdo do monitor:
```bash
#!/bin/bash
LOGFILE="/var/log/system-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Obter uso de CPU, RAM e Disco
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
RAM=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
DISK=$(df -h / | awk 'NR==2{printf "%s", $5}')

echo "$DATE - CPU: ${CPU}% | RAM: ${RAM}% | DISK: $DISK" >> $LOGFILE
```

### Agendar monitoramento (a cada 30 minutos)
```bash
sudo chmod +x /usr/local/bin/system-monitor.sh
sudo crontab -e
```

### Adicionar ao crontab:
```
*/30 * * * * /usr/local/bin/system-monitor.sh
```

## 10. Deploy Inicial

### Executar o primeiro deploy
```bash
cd /var/www/crm-system
./deploy.sh
```

### Verificar status dos serviços
```bash
sudo systemctl status nginx
sudo nginx -t
curl -I http://SEU_DOMINIO.com
```

## 11. Atualizações Futuras

### Para atualizações do código:
```bash
cd /var/www/crm-system
./deploy.sh
```

### Para atualizações do sistema:
```bash
sudo apt update && sudo apt upgrade -y
sudo systemctl restart nginx
```

## 12. Troubleshooting

### Verificar logs do nginx:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Verificar espaço em disco:
```bash
df -h
du -sh /var/www/crm-system/*
```

### Verificar status dos serviços:
```bash
sudo systemctl status nginx
sudo ufw status
```

### Limpar cache e logs antigos:
```bash
sudo journalctl --vacuum-time=7d
sudo find /var/log -type f -name "*.log" -mtime +30 -delete
```

## 13. Configurações de Segurança Adicionais

### Desabilitar server tokens
```bash
sudo nano /etc/nginx/nginx.conf
```
Adicionar dentro do bloco http:
```
server_tokens off;
```

### Configurar fail2ban (opcional)
```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Checklist Final

- [ ] Servidor atualizado
- [ ] Node.js e npm instalados
- [ ] Projeto clonado e build realizado
- [ ] Nginx configurado
- [ ] SSL/HTTPS configurado
- [ ] Firewall ativo
- [ ] Backup automático configurado
- [ ] Monitoramento ativo
- [ ] Deploy testado
- [ ] Domínio apontando para o servidor

## Comandos de Manutenção Rápida

```bash
# Ver status geral
sudo systemctl status nginx
df -h
free -h

# Atualizar aplicação
cd /var/www/crm-system && ./deploy.sh

# Ver logs em tempo real
sudo tail -f /var/log/nginx/access.log

# Restart completo
sudo systemctl restart nginx
```

Seu sistema estará rodando 24h/7 dias após seguir este guia!
