#!/bin/bash
#
# Website Monitoring System Installation Script
# Automated deployment for comprehensive monitoring solution
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/website-monitoring"
SERVICE_USER="monitoring"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
DOMAIN="monitoring.yourdomain.com"

echo -e "${BLUE}🚀 Website Monitoring System Installation${NC}"
echo "=================================================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   exit 1
fi

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required system packages
echo -e "${YELLOW}📦 Installing system dependencies...${NC}"
apt install -y python3 python3-pip python3-venv nginx sqlite3 fail2ban ufw curl wget git

# Create monitoring user
echo -e "${YELLOW}👤 Creating monitoring user...${NC}"
if ! id "$SERVICE_USER" &>/dev/null; then
    useradd -r -s /bin/bash -d $INSTALL_DIR $SERVICE_USER
    echo -e "${GREEN}✅ User $SERVICE_USER created${NC}"
else
    echo -e "${GREEN}✅ User $SERVICE_USER already exists${NC}"
fi

# Create installation directory
echo -e "${YELLOW}📁 Creating installation directory...${NC}"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Create directory structure
mkdir -p {logs,uploads,templates,static,data,backups,config}

# Copy monitoring files
echo -e "${YELLOW}📄 Copying monitoring files...${NC}"
cp /workspace/code/*.py $INSTALL_DIR/
cp /workspace/code/*.js $INSTALL_DIR/
cp /workspace/code/*.json $INSTALL_DIR/config/
cp -r /workspace/code/templates/* $INSTALL_DIR/templates/
cp /workspace/docs/*.md $INSTALL_DIR/

# Set permissions
chown -R $SERVICE_USER:$SERVICE_USER $INSTALL_DIR
chmod +x $INSTALL_DIR/*.py

# Create Python virtual environment
echo -e "${YELLOW}🐍 Setting up Python virtual environment...${NC}"
sudo -u $SERVICE_USER python3 -m venv $INSTALL_DIR/venv
source $INSTALL_DIR/venv/bin/activate

# Install Python dependencies
echo -e "${YELLOW}📦 Installing Python packages...${NC}"
pip install --upgrade pip
pip install requests flask sqlite3 jinja2 dnspython psutil schedule

# Create systemd service files
echo -e "${YELLOW}⚙️  Creating systemd services...${NC}"

# Website monitoring service
cat > /etc/systemd/system/website-monitoring.service << EOF
[Unit]
Description=Website Monitoring Service
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
Environment=PATH=$INSTALL_DIR/venv/bin
ExecStart=$INSTALL_DIR/venv/bin/python monitoring_system.py
Restart=always
RestartSec=10
StandardOutput=append:$INSTALL_DIR/logs/monitoring.log
StandardError=append:$INSTALL_DIR/logs/monitoring.error.log

[Install]
WantedBy=multi-user.target
EOF

# Automated audits service
cat > /etc/systemd/system/automated-audits.service << EOF
[Unit]
Description=Automated Website Audits
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
Environment=PATH=$INSTALL_DIR/venv/bin
ExecStart=$INSTALL_DIR/venv/bin/python automated_audits.py schedule
Restart=always
RestartSec=10
StandardOutput=append:$INSTALL_DIR/logs/audits.log
StandardError=append:$INSTALL_DIR/logs/audits.error.log

[Install]
WantedBy=multi-user.target
EOF

# User reporting service
cat > /etc/systemd/system/user-reporting.service << EOF
[Unit]
Description=User Issue Reporting System
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
Environment=PATH=$INSTALL_DIR/venv/bin
Environment=FLASK_ENV=production
ExecStart=$INSTALL_DIR/venv/bin/python user_reporting_system.py
Restart=always
RestartSec=10
StandardOutput=append:$INSTALL_DIR/logs/reporting.log
StandardError=append:$INSTALL_DIR/logs/reporting.error.log

[Install]
WantedBy=multi-user.target
EOF

# Status page service
cat > /etc/systemd/system/status-page.service << EOF
[Unit]
Description=Public Status Page
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
Environment=PATH=$INSTALL_DIR/venv/bin
ExecStart=$INSTALL_DIR/venv/bin/python status_page.py
Restart=always
RestartSec=10
StandardOutput=append:$INSTALL_DIR/logs/status.log
StandardError=append:$INSTALL_DIR/logs/status.error.log

[Install]
WantedBy=multi-user.target
EOF

# Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
cat > $NGINX_AVAILABLE/monitoring << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirect to HTTPS (when SSL is configured)
    # return 301 https://\$server_name\$request_uri;
    
    # For now, serve HTTP
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Status page
    location /status {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Static files
    location /static {
        alias $INSTALL_DIR/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Content-Type application/json;
    }
}
EOF

# Enable nginx site
ln -sf $NGINX_AVAILABLE/monitoring $NGINX_ENABLED/monitoring

# Test nginx configuration
nginx -t

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw --force enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw reload

# Configure fail2ban
echo -e "${YELLOW}🛡️  Configuring fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

# Initialize databases
echo -e "${YELLOW}🗄️  Initializing databases...${NC}"
sudo -u $SERVICE_USER $INSTALL_DIR/venv/bin/python $INSTALL_DIR/monitoring_system.py check
sudo -u $SERVICE_USER $INSTALL_DIR/venv/bin/python $INSTALL_DIR/automated_audits.py security

# Create backup script
echo -e "${YELLOW}💾 Creating backup script...${NC}"
cat > $INSTALL_DIR/backup.sh << 'EOF'
#!/bin/bash
# Daily backup script

BACKUP_DIR="/opt/backups/monitoring"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup databases and configs
cp $INSTALL_DIR/*.db $BACKUP_DIR/monitoring_backup_$DATE/
cp $INSTALL_DIR/config/*.json $BACKUP_DIR/monitoring_backup_$DATE/

# Compress backup
tar -czf $BACKUP_DIR/monitoring_backup_$DATE.tar.gz -C $BACKUP_DIR monitoring_backup_$DATE/
rm -rf $BACKUP_DIR/monitoring_backup_$DATE/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: monitoring_backup_$DATE.tar.gz"
EOF

chmod +x $INSTALL_DIR/backup.sh
chown $SERVICE_USER:$SERVICE_USER $INSTALL_DIR/backup.sh

# Add backup to crontab
echo -e "${YELLOW}⏰ Setting up automated backups...${NC}"
(crontab -u $SERVICE_USER -l 2>/dev/null; echo "0 2 * * * $INSTALL_DIR/backup.sh") | crontab -u $SERVICE_USER -

# Enable and start services
echo -e "${YELLOW}🔄 Enabling and starting services...${NC}"
systemctl daemon-reload
systemctl enable website-monitoring automated-audits user-reporting status-page
systemctl start website-monitoring automated-audits user-reporting status-page nginx

# Wait a moment for services to start
sleep 5

# Check service status
echo -e "${YELLOW}✅ Checking service status...${NC}"
for service in website-monitoring automated-audits user-reporting status-page nginx; do
    if systemctl is-active --quiet $service; then
        echo -e "${GREEN}✅ $service is running${NC}"
    else
        echo -e "${RED}❌ $service failed to start${NC}"
        systemctl status $service --no-pager -l
    fi
done

# Create configuration completion script
cat > $INSTALL_DIR/configure.sh << 'EOF'
#!/bin/bash
# Post-installation configuration

echo "🔧 Website Monitoring System Configuration"
echo "=========================================="
echo ""
echo "Please complete the following configuration steps:"
echo ""
echo "1. Edit monitoring configuration:"
echo "   nano $INSTALL_DIR/config/monitoring_config.json"
echo "   - Update website_url"
echo "   - Configure email settings"
echo "   - Set alert thresholds"
echo ""
echo "2. Edit alerting configuration:"
echo "   nano $INSTALL_DIR/config/alerting_config.json"
echo "   - Configure notification channels"
echo "   - Set up stakeholder contacts"
echo "   - Configure escalation rules"
echo ""
echo "3. Configure SSL certificate (recommended):"
echo "   certbot --nginx -d your-domain.com"
echo ""
echo "4. Update Nginx domain:"
echo "   sed -i 's/monitoring.yourdomain.com/your-actual-domain.com/g' /etc/nginx/sites-available/monitoring"
echo "   systemctl reload nginx"
echo ""
echo "5. Test the installation:"
echo "   curl http://localhost:5000/api/status"
echo "   curl http://localhost:8080/api/status"
echo ""
echo "6. Access the web interfaces:"
echo "   - User Reporting: http://your-domain.com/"
echo "   - Status Page: http://your-domain.com/status"
echo ""
echo "For detailed configuration, see: $INSTALL_DIR/deployment_guide.md"
EOF

chmod +x $INSTALL_DIR/configure.sh

# Final output
echo ""
echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Run configuration script: $INSTALL_DIR/configure.sh"
echo "2. Edit configuration files in: $INSTALL_DIR/config/"
echo "3. Configure your domain and SSL certificate"
echo "4. Test the monitoring system"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
systemctl status website-monitoring automated-audits user-reporting status-page --no-pager -l | grep -E "(Active|Main PID)"
echo ""
echo -e "${BLUE}📁 Installation Directory:${NC} $INSTALL_DIR"
echo -e "${BLUE}📖 Documentation:${NC} $INSTALL_DIR/deployment_guide.md"
echo -e "${BLUE}🔧 Configuration:${NC} $INSTALL_DIR/configure.sh"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "- Update configuration files with your actual settings"
echo "- Configure SSL certificates for production use"
echo "- Set up proper DNS records for your domain"
echo "- Review and test all alert configurations"
echo ""
echo -e "${GREEN}✅ Website monitoring system is now running!${NC}"
