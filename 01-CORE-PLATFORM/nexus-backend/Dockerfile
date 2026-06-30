FROM python:3.11-slim as base
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PIP_NO_CACHE_DIR=1
RUN apt-get update && apt-get install -y build-essential curl git libpq-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base as development
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
RUN useradd --create-home --shell /bin/bash taurus && chown -R taurus:taurus /app
USER taurus
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 CMD curl -f http://localhost:8000/api/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "info"]

FROM base as production
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt && pip install gunicorn[gevent]
COPY . .
RUN useradd --create-home --shell /bin/bash taurus && chown -R taurus:taurus /app
USER taurus
RUN mkdir -p /app/logs
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 CMD curl -f http://localhost:8000/api/health || exit 1
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--access-logfile", "/app/logs/access.log", "--error-logfile", "/app/logs/error.log", "--log-level", "info"]
