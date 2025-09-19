#!/bin/bash

# Neurlyn Development Environment Manager
# This script ensures clean process management and prevents duplicate instances

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Neurlyn Development Environment${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking port $port...${NC}"
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}Killing process on port $port${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        echo -e "${GREEN}Port $port is free${NC}"
    fi
}

# Function to kill processes by name
kill_process() {
    local process=$1
    echo -e "${YELLOW}Checking for $process processes...${NC}"
    if pgrep -f "$process" >/dev/null 2>&1; then
        echo -e "${RED}Killing $process processes${NC}"
        pkill -f "$process" 2>/dev/null || true
        sleep 1
    else
        echo -e "${GREEN}No $process processes found${NC}"
    fi
}

# Parse command line arguments
COMMAND=${1:-start}
MODE=${2:-full}

case $COMMAND in
    clean)
        echo -e "${YELLOW}🧹 Cleaning all processes...${NC}\n"

        # Kill all Node and Python processes
        kill_process "node backend"
        kill_process "npm run"
        kill_process "nodemon"
        kill_process "python3 -m http.server"
        kill_process "webpack"

        # Clean specific ports
        for port in 3000 3001 3002 8000 8080; do
            kill_port $port
        done

        echo -e "\n${GREEN}✅ All processes cleaned!${NC}"
        ;;

    start)
        # First clean everything
        $0 clean

        echo -e "\n${BLUE}🚀 Starting Neurlyn services...${NC}\n"

        case $MODE in
            backend)
                echo -e "${GREEN}Starting backend only on port 3002...${NC}"
                PORT=3002 npm run dev
                ;;

            frontend)
                echo -e "${GREEN}Starting frontend development server...${NC}"
                npm run serve
                ;;

            full|*)
                echo -e "${GREEN}Starting full development stack...${NC}"
                echo -e "${BLUE}Backend will run on port 3002${NC}"
                echo -e "${BLUE}Frontend will be served from file://${NC}\n"

                # Start backend in background
                PORT=3002 npm run dev &
                BACKEND_PID=$!

                echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
                echo -e "${BLUE}API available at: http://localhost:3002${NC}"
                echo -e "${BLUE}Open index.html in your browser to access the frontend${NC}\n"

                # Wait for backend to be ready
                echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
                for i in {1..30}; do
                    if curl -s http://localhost:3002/api/health >/dev/null 2>&1; then
                        echo -e "${GREEN}✅ Backend is ready!${NC}\n"
                        break
                    fi
                    sleep 1
                done

                # Keep script running
                echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
                wait $BACKEND_PID
                ;;
        esac
        ;;

    stop)
        echo -e "${RED}🛑 Stopping all Neurlyn services...${NC}"
        $0 clean
        ;;

    status)
        echo -e "${BLUE}📊 Current status:${NC}\n"

        # Check ports
        for port in 3000 3001 3002 8000 8080; do
            if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
                echo -e "${GREEN}✓ Port $port is in use${NC}"
                lsof -i :$port | grep LISTEN | head -1
            else
                echo -e "${RED}✗ Port $port is free${NC}"
            fi
        done

        echo ""

        # Check processes
        if pgrep -f "node backend" >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Backend is running${NC}"
            pgrep -f "node backend" | head -5
        else
            echo -e "${RED}✗ Backend is not running${NC}"
        fi
        ;;

    *)
        echo -e "${YELLOW}Usage: ./dev.sh [command] [mode]${NC}"
        echo ""
        echo "Commands:"
        echo "  start [mode]  - Start development environment (default)"
        echo "  stop          - Stop all services"
        echo "  clean         - Kill all processes and free ports"
        echo "  status        - Show current status"
        echo ""
        echo "Modes for start command:"
        echo "  full          - Start both backend and frontend (default)"
        echo "  backend       - Start only backend on port 3002"
        echo "  frontend      - Start only frontend dev server"
        echo ""
        echo "Examples:"
        echo "  ./dev.sh                # Start full stack"
        echo "  ./dev.sh start backend  # Start only backend"
        echo "  ./dev.sh clean          # Clean all processes"
        echo "  ./dev.sh status         # Check what's running"
        ;;
esac