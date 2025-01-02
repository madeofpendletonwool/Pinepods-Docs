# Pinepods Technical Documentation

## Overview

Pinepods is a self-hosted podcast management system built with Rust (Yew framework) for the frontend and Python for the backend services. It uses a microservices architecture to handle podcast management, user authentication, and media playback.

## Core Components

### 1. Frontend (Rust/Yew)
- Built using the Yew framework for Rust
- Compiled to WebAssembly (WASM) for browser execution
- Key features:
  - Podcast episode management
  - User authentication
  - Media playback
  - History tracking
  - Search functionality
  - Settings management
  - Theme customization
  - Queue management
  - Download management

### 2. Backend (Python)
- FastAPI-based REST API (port 8032)
- Handles:
  - Database operations
  - Podcast feed parsing and updating
  - User management
  - API authentication
  - File downloads
  - WebSocket connections for real-time updates
  - Updates feeds

### 3. Database Layer
- Supports both PostgreSQL and MySQL/MariaDB
- Stores:
  - User information
  - Podcast metadata
  - Episode data
  - Listening history
  - Settings
  - Download queue

### 4. Nginx Server
Nginx config file lives in startup/ directory

- Serves the compiled WASM application
- Handles routing
- Manages WebSocket connections
- Provides CORS support
- Serves static files

## System Architecture

### API Endpoints

#### Core Endpoints
- `/api/data/*` - Data management endpoints - Most API calls fall under this
- `/api/feed/*` - Podcast feed management
- `/ws/api/data/*` - WebSocket connections
- `/rss/*` - RSS feed handling

#### Authentication
- Uses API key-based authentication
- Keys stored in `/tmp/web_api_key.txt`
- Required for all API calls

### Scheduled Tasks
1. Podcast Refresh (Every 30 minutes)
   ```bash
   */30 * * * * /pinepods/startup/call_refresh_endpoint.sh
   ```
2. Nightly Tasks (Midnight)
   ```bash
   0 0 * * * /pinepods/startup/call_nightly_tasks.sh
   ```

## Building a Native Version

### Prerequisites
- Rust toolchain with wasm32-unknown-unknown target
- Python 3.x
- PostgreSQL or MySQL/MariaDB

### Frontend Build Process

1. Setup Rust Environment:
```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli
cargo install trunk
```

2. Build Frontend:
```bash
cd web
RUSTFLAGS="--cfg=web_sys_unstable_apis" trunk build --features server_build --release
```

### Backend Setup

1. Python Environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Database Setup:
- Create database using provided scripts in `database_functions/`
- Configure connection in environment variables

### Required Environment Variables
```bash
DB_USER=<database_user>
DB_PASSWORD=<database_password>
DB_HOST=<database_host>
DB_NAME=<database_name>
DB_PORT=<database_port>
DB_TYPE=<postgresql|mysql>
FULLNAME=<admin_fullname>
USERNAME=<admin_username>
EMAIL=<admin_email>
PASSWORD=<admin_password>
REVERSE_PROXY=<true|false>
SEARCH_API_URL=<search_api_endpoint>
PEOPLE_API_URL=<people_api_endpoint>
PINEPODS_PORT=<port_number>
PROXY_PROTOCOL=<protocol>
DEBUG_MODE=<true|false>
VALKEY_HOST=<valkey_host>
VALKEY_PORT=<valkey_port>
```

### Typical Container Directory Structure
```
/pinepods/
├── cache/
├── clients/
│   └── clientapi.py
├── database_functions/
├── startup/
│   ├── app_startup.sh
│   ├── call_refresh_endpoint.sh
│   ├── call_nightly_tasks.sh
│   └── supervisord.conf
└── current_version
```

### Typical Required Directories - Hardcoded currently due to their use inside containers
```bash
mkdir -p /pinepods/cache
mkdir -p /opt/pinepods/backups
mkdir -p /opt/pinepods/downloads
mkdir -p /opt/pinepods/certs
```

## Running the Application - This is what a native package would need to do

1. Start Database Service - Or have one externally started and setup proper environment vars
2. Ensure variables are all setup. 
3. Ensure the jobs that need to run on occation are able to. The container uses cron to do this. The jobs are in the startup directory:
- app_startup.sh - Runs once on Pinepods Start
- call_nightly_tasks.sh - Runs every night and makes a few calls to the api server
- call_refresh_endpoint.sh - Runs every 30 mins and makes a few calls to the api server. This is what updates feeds. 
2. Run Database Setup Script - This is idempotent and can be ran on every startup:
```bash
python3 /pinepods/startup/setup[postgres|mysql]database.py
```

3. Start Backend Services - Exposes the Pinepods API:
```bash
python3 /pinepods/clients/clientapi.py --port 8032
```

4. Configure and Start Nginx - The frontend:
- Copy nginx.conf to appropriate location
- Start nginx service

5. Initialize Application:
```bash
/pinepods/startup/app_startup.sh
```

### Logs
- Supervisor logs: `/var/log/supervisor/`
- Nginx logs: Standard nginx log locations
- Application logs: stdout/stderr via supervisord

### Debug Mode
Enable debug mode by setting:
```bash
DEBUG_MODE=true
```

This will use supervisordebug.conf instead of supervisor.conf and will provide additional logging and debugging information directly to standard out.
