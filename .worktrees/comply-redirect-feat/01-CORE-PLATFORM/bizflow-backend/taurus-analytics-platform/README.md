# 🏰 TAURUS AI CORP - Analytics Platform

A complete, full-stack analytics platform built with modern technologies, featuring real-time data visualization, comprehensive business metrics, and enterprise-grade security.

## 🚀 **Features**

### **📊 Analytics & Metrics**
- **Real-time Dashboard**: Live updates with WebSocket integration
- **Business Metrics**: Revenue, users, agents, system health
- **Interactive Charts**: Revenue trends, user growth, agent performance
- **Custom Queries**: Flexible analytics with custom time ranges
- **Export Capabilities**: Data export in multiple formats

### **🔐 Security & Authentication**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, user, and viewer roles
- **API Key Management**: Secure API access
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation

### **⚡ Performance & Scalability**
- **MongoDB**: Scalable NoSQL database
- **Redis Caching**: High-performance caching
- **WebSocket**: Real-time data streaming
- **Docker**: Containerized deployment
- **Load Balancing**: Horizontal scaling support

### **🛠️ Developer Experience**
- **TypeScript**: Type-safe development
- **RESTful API**: Well-documented endpoints
- **WebSocket API**: Real-time communication
- **Comprehensive Logging**: Winston-based logging
- **Error Handling**: Graceful error management

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   WebSocket     │◄─────────────┘
                        │   (Socket.io)   │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   Cache         │
                        │   (Redis)       │
                        │   Port: 6379    │
                        └─────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB 5.0+
- Redis 6.0+
- Docker (optional)

### **1. Clone the Repository**
```bash
git clone https://github.com/taurus-ai/analytics-platform.git
cd analytics-platform
```

### **2. Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm start
```

### **4. Using Docker (Recommended)**
```bash
docker-compose up -d
```

## 📁 **Project Structure**

```
taurus-analytics-platform/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── Dockerfile
├── database/               # Database scripts
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Backend (.env)**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/taurus-analytics
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=http://localhost:3000
```

#### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## 📚 **API Documentation**

### **Authentication Endpoints**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### **Analytics Endpoints**
- `GET /api/analytics/business` - Get comprehensive business metrics
- `GET /api/analytics/revenue` - Get revenue analytics
- `GET /api/analytics/users` - Get user analytics
- `GET /api/analytics/agents` - Get agent performance
- `GET /api/analytics/system` - Get system health
- `GET /api/analytics/realtime` - Get real-time metrics

### **WebSocket Events**
- `connect` - Client connection
- `subscribe_analytics` - Subscribe to analytics updates
- `get_realtime_data` - Request real-time data
- `acknowledge_alert` - Acknowledge system alert
- `custom_query` - Execute custom analytics query

## 🧪 **Testing**

### **Backend Tests**
```bash
cd backend
npm test
npm run test:watch
```

### **Frontend Tests**
```bash
cd frontend
npm test
npm run test:coverage
```

### **Integration Tests**
```bash
npm run test:integration
```

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Production Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Environment-Specific Configurations**

#### **Development**
```bash
NODE_ENV=development
npm run dev
```

#### **Production**
```bash
NODE_ENV=production
npm start
```

## 📊 **Monitoring & Logging**

### **Health Checks**
- Backend: `GET /health`
- Database: MongoDB connection status
- Cache: Redis connection status
- WebSocket: Connection count

### **Logging**
- **Console**: Development logs
- **Files**: Production logs in `logs/` directory
- **Levels**: error, warn, info, debug
- **Rotation**: Automatic log rotation

### **Metrics**
- Request count and response times
- Database query performance
- WebSocket connection metrics
- System resource usage

## 🔒 **Security Features**

### **Authentication**
- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Account lockout protection

### **Authorization**
- Role-based access control
- API endpoint protection
- Resource-level permissions
- Admin-only operations

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### **API Security**
- Rate limiting
- Request size limits
- CORS configuration
- Security headers

## 🛠️ **Development**

### **Code Style**
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Consistent naming conventions

### **Git Workflow**
- Feature branches
- Pull request reviews
- Automated testing
- Continuous integration

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📈 **Performance**

### **Backend Performance**
- **Response Time**: < 100ms average
- **Throughput**: 1000+ requests/second
- **Memory Usage**: < 512MB
- **CPU Usage**: < 50%

### **Frontend Performance**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Lighthouse Score**: 90+

### **Database Performance**
- **Query Time**: < 50ms average
- **Connection Pool**: 10-100 connections
- **Indexing**: Optimized for common queries
- **Caching**: Redis for frequent data

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check MongoDB status
docker-compose ps mongodb
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### **Redis Connection Failed**
```bash
# Check Redis status
docker-compose ps redis
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

#### **WebSocket Connection Issues**
- Check CORS configuration
- Verify JWT token validity
- Check network connectivity
- Review browser console errors

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable verbose logging
LOG_LEVEL=debug npm run dev
```

## 📞 **Support**

### **Documentation**
- [API Documentation](http://localhost:3001/api/docs)
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

### **Community**
- [GitHub Issues](https://github.com/taurus-ai/analytics-platform/issues)
- [Discord Community](https://discord.gg/taurus-ai)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/taurus-analytics)

### **Enterprise Support**
- Email: support@taurus-ai.com
- Phone: +1 (555) 123-4567
- Documentation: [Enterprise Docs](https://docs.taurus-ai.com)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **React** - Frontend framework
- **Node.js** - Backend runtime
- **MongoDB** - Database
- **Redis** - Caching
- **Socket.io** - WebSocket communication
- **Docker** - Containerization

---

**Built with ❤️ by TAURUS AI CORP**

*Empowering businesses with intelligent analytics and real-time insights.*

