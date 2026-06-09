# 🏰 TAURUS AI CORP Analytics Dashboard

A comprehensive real-time analytics dashboard for TAURUS AI CORP business metrics, built with React, TypeScript, and modern web technologies.

## 🚀 Features

### 📊 **Real-time Metrics**
- **Revenue Tracking**: Live revenue data with growth trends
- **User Analytics**: Active users, retention rates, and demographics
- **AI Agent Performance**: Agent status, efficiency, and task completion
- **System Health**: CPU, memory, network, and overall system status
- **Performance Metrics**: Response times, throughput, and error rates

### 🔄 **Real-time Updates**
- WebSocket integration for live data streaming
- Automatic refresh with configurable intervals
- Connection status monitoring
- Fallback polling when WebSocket is unavailable

### 📈 **Interactive Charts**
- Revenue trends over time
- User growth analytics
- Agent performance comparisons
- System health distribution
- Customizable time ranges

### 🚨 **Alert System**
- Real-time system alerts
- Alert acknowledgment
- Alert categorization (info, warning, error, critical)
- Alert history and filtering

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/light theme support
- Custom TAURUS AI CORP branding
- Smooth animations and transitions
- Accessible components

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Jest, React Testing Library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server (see API section)

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd analytics-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env with your API endpoints

# Start development server
npm start
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=http://localhost:3001

# Optional: Authentication
REACT_APP_AUTH_ENABLED=false
REACT_APP_AUTH_TOKEN_KEY=auth_token
```

### API Endpoints
The dashboard expects the following API endpoints:

```
GET /api/metrics/business          # Business metrics
GET /api/metrics/revenue           # Revenue data
GET /api/metrics/users             # User analytics
GET /api/metrics/agents            # Agent performance
GET /api/metrics/performance       # System performance
GET /api/metrics/system            # System health
GET /api/metrics/realtime          # Real-time data
GET /api/alerts                    # System alerts
POST /api/alerts/:id/acknowledge   # Acknowledge alert
GET /api/health                    # Health check
```

### WebSocket Events
The dashboard listens for these WebSocket events:

```
metrics:update      # Business metrics updates
alert:new          # New alerts
system:status      # System status changes
agent:performance  # Agent performance updates
revenue:update     # Revenue updates
user:activity      # User activity updates
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
```
tests/
├── MetricCard.test.tsx      # Metric card component tests
├── Chart.test.tsx          # Chart component tests
├── AlertPanel.test.tsx     # Alert panel tests
└── Dashboard.test.tsx      # Main dashboard tests
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── MetricCard.tsx   # Metric display card
│   ├── Chart.tsx        # Chart components
│   ├── AlertPanel.tsx   # Alert management
│   └── Dashboard.tsx    # Main dashboard
├── hooks/               # Custom React hooks
│   ├── useMetrics.ts    # Metrics data hook
│   └── useRealtime.ts   # Real-time data hook
├── services/            # API services
│   ├── api.ts          # REST API client
│   └── websocket.ts    # WebSocket service
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── utils/              # Utility functions
│   └── formatters.ts   # Data formatting
└── App.tsx             # Main app component
```

## 🎨 Customization

### Themes
The dashboard uses Tailwind CSS with custom TAURUS AI CORP colors:

```css
/* Custom colors in tailwind.config.js */
taurus: {
  50: '#f0f9ff',
  500: '#0ea5e9',
  900: '#0c4a6e',
}
```

### Components
All components are modular and customizable:

```tsx
<MetricCard
  title="Custom Metric"
  value={1000}
  type="currency"
  trend={5.2}
  color="success"
  size="lg"
/>
```

### Charts
Charts support various configurations:

```tsx
<Chart
  data={data}
  type="line"
  xKey="date"
  yKey="value"
  title="Custom Chart"
  height={400}
  color="#ff0000"
/>
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Builds
```bash
# Development
npm run build

# Production
NODE_ENV=production npm run build
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Automatic code splitting with React.lazy
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data sets
- **Debounced Updates**: Prevents excessive API calls
- **Connection Pooling**: Efficient WebSocket management

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 500KB gzipped

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Style
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **TypeScript**: Strict mode enabled

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**WebSocket Connection Failed**
- Check if backend server is running
- Verify WebSocket URL in environment variables
- Check network connectivity

**Charts Not Rendering**
- Ensure data is in correct format
- Check console for JavaScript errors
- Verify Recharts dependencies

**API Calls Failing**
- Verify API URL configuration
- Check CORS settings on backend
- Ensure authentication tokens are valid

### Debug Mode
Enable debug logging:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## 📈 Roadmap

### Upcoming Features
- [ ] **Advanced Filtering**: Date range, agent, region filters
- [ ] **Export Functionality**: PDF, CSV, Excel export
- [ ] **Custom Dashboards**: User-configurable layouts
- [ ] **Mobile App**: React Native mobile version
- [ ] **AI Insights**: Automated insights and recommendations
- [ ] **Multi-tenant Support**: Organization-level dashboards

### Performance Improvements
- [ ] **Server-Side Rendering**: Next.js migration
- [ ] **Progressive Web App**: Offline support
- [ ] **Advanced Caching**: Redis integration
- [ ] **Real-time Collaboration**: Multi-user editing

## 📄 License

This project is proprietary software owned by TAURUS AI CORP.

## 🤝 Support

For support and questions:
- **Email**: support@taurusai.io
- **Documentation**: [Internal Wiki]
- **Issues**: [GitHub Issues]

---

**Built with ❤️ by TAURUS AI CORP Development Team**

