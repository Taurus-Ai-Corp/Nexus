# Development Guide

## Setting Up the Environment

1. Install Docker and Docker Compose
2. Clone the repository
3. Copy `.env.example` to `.env` and fill in the required values
4. Run `docker-compose up --build` to start all services

## Project Structure

- `api/`: Python FastAPI backend
- `web/`: React frontend
- `nlp/`: Node.js NLP service
- `docker-compose.yml`: Services orchestration

## Making Changes

### Backend (API)
1. Make changes to files in the `api/` directory
2. The API will automatically reload when you save changes
3. Add new dependencies to `api/requirements.txt`

### Frontend
1. Make changes to files in the `web/` directory
2. The frontend will automatically reload when you save changes
3. Add new dependencies with `npm install <package>` in the `web/` directory

### NLP Service
1. Make changes to files in the `nlp/` directory
2. The NLP service will automatically reload when you save changes
3. Add new dependencies with `npm install <package>` in the `nlp/` directory

## Testing

Run the test script:
```bash
./test-setup.sh
```

## Extending the Platform

1. **Add new API endpoints**: Add new routes in `api/main.py`
2. **Add new NLP capabilities**: Enhance the NLP service in `nlp/index.js`
3. **Add new UI components**: Create new React components in `web/src/components/`
4. **Add database models**: Add new SQLAlchemy models in `api/main.py`

## Deployment

For production deployment:
1. Update environment variables in `.env` for production values
2. Build and push Docker images to a container registry
3. Deploy to your preferred cloud platform (AWS, GCP, Azure, etc.)