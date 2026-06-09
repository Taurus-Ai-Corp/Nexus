#!/bin/bash

# 🏰 TAURUS AI CORP - Analytics Platform Startup Script
# Complete full-stack analytics solution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}🏰 TAURUS AI CORP - Analytics Platform${NC}"
    echo -e "${PURPLE}======================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${CYAN}🔄 $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Docker will be used instead."
        return 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_warning "Node.js version 18+ required. Current version: $(node --version)"
        print_warning "Docker will be used instead."
        return 1
    fi
    
    print_success "Node.js $(node --version) is installed"
    return 0
}

# Setup environment files
setup_environment() {
    print_step "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/env.example backend/.env
        print_success "Created backend/.env from template"
    else
        print_info "Backend .env already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
EOF
        print_success "Created frontend/.env"
    else
        print_info "Frontend .env already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    # Backend dependencies
    if [ -d "backend" ]; then
        cd backend
        if [ ! -d "node_modules" ]; then
            npm install
            print_success "Backend dependencies installed"
        else
            print_info "Backend dependencies already installed"
        fi
        cd ..
    fi
    
    # Frontend dependencies
    if [ -d "frontend" ]; then
        cd frontend
        if [ ! -d "node_modules" ]; then
            npm install
            print_success "Frontend dependencies installed"
        else
            print_info "Frontend dependencies already installed"
        fi
        cd ..
    fi
}

# Start with Docker
start_docker() {
    print_step "Starting with Docker..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "All services started with Docker"
    print_info "Services:"
    print_info "  - Frontend: http://localhost:3000"
    print_info "  - Backend: http://localhost:3001"
    print_info "  - MongoDB: localhost:27017"
    print_info "  - Redis: localhost:6379"
}

# Start with Node.js
start_node() {
    print_step "Starting with Node.js..."
    
    # Start backend
    print_info "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    print_info "Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "All services started with Node.js"
    print_info "Services:"
    print_info "  - Frontend: http://localhost:3000"
    print_info "  - Backend: http://localhost:3001"
    print_info "  - MongoDB: localhost:27017 (external)"
    print_info "  - Redis: localhost:6379 (external)"
    
    # Wait for user to stop
    print_info "Press Ctrl+C to stop all services"
    wait
}

# Show logs
show_logs() {
    print_step "Showing logs..."
    docker-compose logs -f
}

# Stop services
stop_services() {
    print_step "Stopping services..."
    docker-compose down
    print_success "All services stopped"
}

# Clean up
cleanup() {
    print_step "Cleaning up..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Show status
show_status() {
    print_step "Service status:"
    docker-compose ps
}

# Main function
main() {
    print_header
    
    case "${1:-start}" in
        "start")
            check_docker
            setup_environment
            
            if check_node; then
                install_dependencies
                start_node
            else
                start_docker
            fi
            ;;
        "docker")
            check_docker
            setup_environment
            start_docker
            ;;
        "node")
            if check_node; then
                setup_environment
                install_dependencies
                start_node
            else
                print_error "Node.js 18+ is required for this option"
                exit 1
            fi
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            stop_services
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  start    - Start the platform (auto-detect Node.js or Docker)"
            echo "  docker   - Start with Docker"
            echo "  node     - Start with Node.js (requires Node.js 18+)"
            echo "  logs     - Show logs"
            echo "  stop     - Stop services"
            echo "  status   - Show service status"
            echo "  cleanup  - Clean up containers and volumes"
            echo "  help     - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            print_info "Use '$0 help' for available commands"
            exit 1
            ;;
    esac
}

# Handle Ctrl+C
trap 'print_info "Shutting down..."; exit 0' INT

# Run main function
main "$@"

