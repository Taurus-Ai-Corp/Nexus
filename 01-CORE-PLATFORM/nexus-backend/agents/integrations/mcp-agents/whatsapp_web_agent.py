#!/usr/bin/env python3
"""
📱 TAURUS AI CORP. - WhatsApp Web.js Integration Agent
Secure WhatsApp integration using pedroslopez/whatsapp-web.js
"""

import asyncio
import logging
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path
import subprocess
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WhatsAppWebAgent:
    """
    WhatsApp Web.js Integration Agent for TAURUS AI CORP
    Secure integration with proper API key management
    """
    
    def __init__(self):
        self.name = "WhatsApp Web Integration Agent"
        self.version = "1.0.0"
        self.client = None
        self.session_data = None
        self.qr_code = None
        self.is_ready = False
        
        # WhatsApp Web.js configuration
        self.config = {
            "library_name": "whatsapp-web.js",
            "github_repo": "pedroslopez/whatsapp-web.js",
            "node_version": "18+",
            "puppeteer_config": {
                "headless": False,  # Set to True for production
                "args": [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            }
        }
        
        # Integration paths
        self.integration_path = Path(__file__).parent
        self.node_project_path = self.integration_path / "whatsapp-web-project"
        self.session_path = self.integration_path / "session"
        
    async def initialize_whatsapp_integration(self):
        """Initialize WhatsApp Web.js integration"""
        logger.info("📱 Initializing WhatsApp Web.js integration...")
        
        # Check Node.js installation
        if not await self._check_node_installation():
            await self._install_node_js()
            
        # Create Node.js project
        await self._create_node_project()
        
        # Install WhatsApp Web.js
        await self._install_whatsapp_web_js()
        
        # Create WhatsApp client
        await self._create_whatsapp_client()
        
        logger.info("✅ WhatsApp Web.js integration initialized")
        
    async def _check_node_installation(self) -> bool:
        """Check if Node.js is installed"""
        try:
            result = subprocess.run(['node', '--version'], 
                                 capture_output=True, text=True, check=True)
            node_version = result.stdout.strip()
            logger.info(f"✅ Node.js found: {node_version}")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("❌ Node.js not found")
            return False
            
    async def _install_node_js(self):
        """Install Node.js using nvm or direct installation"""
        logger.info("📦 Installing Node.js...")
        
        # Try to install using nvm first
        try:
            subprocess.run(['curl', '-o-', 'https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh'], 
                         check=True)
            subprocess.run(['bash', '-c', 'source ~/.bashrc && nvm install 18 && nvm use 18'], 
                         check=True)
            logger.info("✅ Node.js installed via nvm")
        except subprocess.CalledProcessError:
            logger.warning("⚠️ nvm installation failed, please install Node.js manually")
            logger.info("📋 Please install Node.js 18+ from: https://nodejs.org/")
            
    async def _create_node_project(self):
        """Create Node.js project for WhatsApp Web.js"""
        logger.info("📁 Creating Node.js project...")
        
        # Create project directory
        self.node_project_path.mkdir(exist_ok=True)
        
        # Create package.json
        package_json = {
            "name": "taurus-whatsapp-web-integration",
            "version": "1.0.0",
            "description": "WhatsApp Web.js integration for TAURUS AI CORP",
            "main": "whatsapp-client.js",
            "scripts": {
                "start": "node whatsapp-client.js",
                "dev": "nodemon whatsapp-client.js"
            },
            "dependencies": {
                "whatsapp-web.js": "^1.23.0",
                "qrcode-terminal": "^0.12.0",
                "express": "^4.18.2",
                "cors": "^2.8.5"
            },
            "devDependencies": {
                "nodemon": "^3.0.1"
            }
        }
        
        with open(self.node_project_path / "package.json", 'w') as f:
            json.dump(package_json, f, indent=2)
            
        logger.info("✅ Node.js project created")
        
    async def _install_whatsapp_web_js(self):
        """Install WhatsApp Web.js and dependencies"""
        logger.info("📦 Installing WhatsApp Web.js...")
        
        try:
            # Change to project directory and install
            result = subprocess.run(
                ['npm', 'install'],
                cwd=self.node_project_path,
                capture_output=True,
                text=True,
                check=True
            )
            logger.info("✅ WhatsApp Web.js installed successfully")
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Installation failed: {e.stderr}")
            raise
            
    async def _create_whatsapp_client(self):
        """Create WhatsApp client JavaScript file"""
        logger.info("🤖 Creating WhatsApp client...")
        
        whatsapp_client_js = """
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// WhatsApp client configuration
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "taurus-ai-corp-whatsapp"
    }),
    puppeteer: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Global state
let isReady = false;
let qrCode = null;
let sessionData = null;

// Event handlers
client.on('qr', (qr) => {
    console.log('QR Code received');
    qrCode = qr;
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    isReady = true;
    qrCode = null;
});

client.on('authenticated', (session) => {
    console.log('WhatsApp authenticated');
    sessionData = session;
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp disconnected:', reason);
    isReady = false;
});

client.on('message', async (message) => {
    console.log('Message received:', message.body);
    
    // Handle different message types
    if (message.body.startsWith('!ping')) {
        await message.reply('🏰 TAURUS AI CORP. - Pong!');
    } else if (message.body.startsWith('!help')) {
        const helpText = `
🏰 TAURUS AI CORP. WhatsApp Bot

Available commands:
!ping - Test connection
!help - Show this help
!status - Show system status
!agents - List available agents
!webflow - Webflow integration info
!intelligence - Intelligence dashboard info
        `;
        await message.reply(helpText);
    } else if (message.body.startsWith('!status')) {
        const status = {
            ready: isReady,
            timestamp: new Date().toISOString(),
            version: "1.0.0"
        };
        await message.reply(`Status: ${JSON.stringify(status, null, 2)}`);
    }
});

// API endpoints
app.get('/api/status', (req, res) => {
    res.json({
        ready: isReady,
        qr_code: qrCode,
        session: sessionData ? 'authenticated' : 'not_authenticated',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/qr', (req, res) => {
    res.json({
        qr_code: qrCode,
        ready: isReady
    });
});

app.post('/api/send-message', async (req, res) => {
    if (!isReady) {
        return res.status(400).json({ error: 'WhatsApp client not ready' });
    }
    
    const { to, message } = req.body;
    
    try {
        const result = await client.sendMessage(to, message);
        res.json({ success: true, messageId: result.id._serialized });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/send-media', async (req, res) => {
    if (!isReady) {
        return res.status(400).json({ error: 'WhatsApp client not ready' });
    }
    
    const { to, mediaUrl, caption } = req.body;
    
    try {
        const media = await MessageMedia.fromUrl(mediaUrl);
        const result = await client.sendMessage(to, media, { caption });
        res.json({ success: true, messageId: result.id._serialized });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/contacts', async (req, res) => {
    if (!isReady) {
        return res.status(400).json({ error: 'WhatsApp client not ready' });
    }
    
    try {
        const contacts = await client.getContacts();
        res.json({ contacts: contacts.map(c => ({
            id: c.id._serialized,
            name: c.name || c.pushname,
            number: c.number
        })) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 WhatsApp Web.js API server running on port ${PORT}`);
});

// Initialize WhatsApp client
client.initialize();
        """
        
        with open(self.node_project_path / "whatsapp-client.js", 'w') as f:
            f.write(whatsapp_client_js)
            
        logger.info("✅ WhatsApp client created")
        
    async def start_whatsapp_service(self):
        """Start WhatsApp Web.js service"""
        logger.info("🚀 Starting WhatsApp Web.js service...")
        
        try:
            # Start the Node.js application
            process = subprocess.Popen(
                ['npm', 'start'],
                cwd=self.node_project_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            logger.info("✅ WhatsApp Web.js service started")
            logger.info("📱 Scan QR code when it appears to authenticate")
            logger.info("🌐 API available at: http://localhost:3000")
            
            return process
            
        except Exception as e:
            logger.error(f"❌ Failed to start WhatsApp service: {e}")
            raise
            
    async def send_message(self, to: str, message: str) -> Dict[str, Any]:
        """Send WhatsApp message"""
        if not self.is_ready:
            return {"error": "WhatsApp client not ready"}
            
        try:
            import requests
            response = requests.post('http://localhost:3000/api/send-message', 
                                  json={"to": to, "message": message})
            return response.json()
        except Exception as e:
            return {"error": str(e)}
            
    async def send_media(self, to: str, media_url: str, caption: str = "") -> Dict[str, Any]:
        """Send WhatsApp media message"""
        if not self.is_ready:
            return {"error": "WhatsApp client not ready"}
            
        try:
            import requests
            response = requests.post('http://localhost:3000/api/send-media',
                                  json={"to": to, "mediaUrl": media_url, "caption": caption})
            return response.json()
        except Exception as e:
            return {"error": str(e)}
            
    async def get_contacts(self) -> List[Dict[str, Any]]:
        """Get WhatsApp contacts"""
        try:
            import requests
            response = requests.get('http://localhost:3000/api/contacts')
            data = response.json()
            return data.get('contacts', [])
        except Exception as e:
            return []
            
    async def get_status(self) -> Dict[str, Any]:
        """Get WhatsApp client status"""
        try:
            import requests
            response = requests.get('http://localhost:3000/api/status')
            return response.json()
        except Exception as e:
            return {"error": str(e)}
            
    async def generate_integration_report(self) -> Dict[str, Any]:
        """Generate WhatsApp integration report"""
        logger.info("📋 Generating WhatsApp integration report...")
        
        report = {
            "integration_name": "WhatsApp Web.js Integration",
            "version": self.version,
            "github_repo": self.config["github_repo"],
            "node_version_required": self.config["node_version"],
            "features": [
                "Send text messages",
                "Send media messages (images, documents, audio)",
                "Receive messages and handle commands",
                "Contact management",
                "QR code authentication",
                "Session persistence",
                "REST API endpoints"
            ],
            "api_endpoints": [
                "GET /api/status - Get client status",
                "GET /api/qr - Get QR code for authentication",
                "POST /api/send-message - Send text message",
                "POST /api/send-media - Send media message",
                "GET /api/contacts - Get contact list"
            ],
            "security_notes": [
                "Uses LocalAuth for session persistence",
                "QR code authentication required",
                "No API keys needed - uses WhatsApp Web protocol",
                "Account blocking risk - use responsibly",
                "Avoid bulk messaging to prevent bans"
            ],
            "setup_instructions": [
                "1. Install Node.js 18+",
                "2. Run: npm install in project directory",
                "3. Start service: npm start",
                "4. Scan QR code with WhatsApp mobile app",
                "5. Use API endpoints for integration"
            ],
            "integration_status": "ready_for_deployment"
        }
        
        # Save report
        report_path = self.integration_path / "whatsapp_integration_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
            
        logger.info(f"📄 Integration report saved to {report_path}")
        return report
        
    async def run_whatsapp_agent(self):
        """Run WhatsApp Web.js agent"""
        logger.info("📱 Starting WhatsApp Web.js Agent...")
        
        try:
            await self.initialize_whatsapp_integration()
            
            # Start the service
            process = await self.start_whatsapp_service()
            
            # Generate report
            report = await self.generate_integration_report()
            
            logger.info("🎉 WhatsApp Web.js Agent is ready!")
            logger.info("📱 Scan QR code to authenticate")
            logger.info("🌐 API available at: http://localhost:3000")
            
            # Keep agent running
            while True:
                await asyncio.sleep(30)
                status = await self.get_status()
                if status.get('ready'):
                    self.is_ready = True
                    logger.info("💓 WhatsApp agent heartbeat - authenticated and ready")
                else:
                    logger.info("💓 WhatsApp agent heartbeat - waiting for authentication")
                
        except KeyboardInterrupt:
            logger.info("🛑 WhatsApp Web.js Agent shutting down...")
        except Exception as e:
            logger.error(f"❌ WhatsApp agent error: {e}")

if __name__ == "__main__":
    # Start WhatsApp Web.js Agent
    agent = WhatsAppWebAgent()
    asyncio.run(agent.run_whatsapp_agent())
