# 🏰 Taurus AI Corp. - Local AI Empire Container
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV MODE=local
ENV OLLAMA_URL=http://ollama:11434

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/configs /app/data /app/logs && \
    chmod -R 755 /app && \
    useradd -m -u 1000 taurus && \
    chown -R taurus:taurus /app

# Switch to non-root user
USER taurus

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Start the registry server
CMD ["python", "-m", "uvicorn", "registry.server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]