#!/bin/bash
# Database Migration Management Script

MIGRATIONS_DIR="migrations"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

case "$1" in
    "init")
        echo "🚀 Initializing database migrations..."
        cd "$PROJECT_ROOT"
        alembic init $MIGRATIONS_DIR
        echo "✅ Migration system initialized"
        ;;

    "new")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 new <migration_name>"
            exit 1
        fi
        echo "📝 Creating new migration: $2"
        cd "$PROJECT_ROOT"
        alembic revision --autogenerate -m "$2"
        echo "✅ Migration created"
        ;;

    "upgrade")
        echo "⬆️ Running database migrations..."
        cd "$PROJECT_ROOT"
        alembic upgrade head
        echo "✅ Database upgraded"
        ;;

    "downgrade")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 downgrade <revision>"
            exit 1
        fi
        echo "⬇️ Downgrading to revision: $2"
        cd "$PROJECT_ROOT"
        alembic downgrade $2
        echo "✅ Database downgraded"
        ;;

    "status")
        echo "📊 Checking migration status..."
        cd "$PROJECT_ROOT"
        alembic current
        alembic history --verbose
        ;;

    "reset")
        echo "⚠️ This will reset all migrations. Continue? (y/N)"
        read -r confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            echo "🔄 Resetting migrations..."
            cd "$PROJECT_ROOT"
            rm -rf $MIGRATIONS_DIR/versions/*
            echo "✅ Migrations reset"
        fi
        ;;

    *)
        echo "🔧 Database Migration Commands:"
        echo "  init     - Initialize migration system"
        echo "  new      - Create new migration"
        echo "  upgrade  - Run all migrations"
        echo "  downgrade- Downgrade to specific revision"
        echo "  status   - Show migration status"
        echo "  reset    - Reset all migrations"
        ;;
esac
