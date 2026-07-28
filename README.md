# CampusGenie Lite

CampusGenie Lite is a premium, production-ready 3-tier student productivity application. It provides assignments tracking, study task planning, and campus events registration within a unified student dashboard.

Designed specifically with an production-oriented architecture, the application separation allows it to be served via Nginx on Amazon EC2, connect to Amazon RDS MySQL, and route secure HTTPS traffic via AWS Application Load Balancer (ALB) and AWS Certificate Manager (ACM).

---

## 🏗 Tech Stack

- **Frontend**: React 18 + Vite 6
- **Backend**: Node.js + Express 4.x
- **Database**: MySQL (Amazon RDS for Production)
- **Web Server / Reverse Proxy**: Nginx
- **Production Target**: AWS EC2 (Ubuntu) + ALB (Application Load Balancer) + ACM (AWS Certificate Manager)

---

## 📁 Project Structure

```text
campusgenie-lite/
├── frontend/             # React application (Vite-powered SPA)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Context (State Management)
│   │   ├── pages/        # Main view routes
│   │   └── services/     # REST API service client
│   ├── package.json
│   └── vite.config.js
├── backend/              # Node.js + Express REST API
│   ├── config/           # Database configuration & pool
│   ├── controllers/      # Route controllers (MVC)
│   ├── middleware/       # Custom middleware & validations
│   ├── models/           # Data models (Raw SQL with MySQL2)
│   ├── routes/           # Endpoint definitions
│   ├── server.js         # Express app entry point
│   └── package.json
├── database/
│   └── schema.sql        # Database initialization DDL schema
├── nginx/
│   └── nginx.conf        # Production Nginx reverse-proxy configuration
├── .gitignore            # Version control exclusions
└── README.md             # Project documentation (This file)
```

---

## ⚙️ Development Setup

### 1. Database Setup
Create a MySQL database and run the schema import to load the initial tables and seed data:
```bash
mysql -u root -p -e "CREATE DATABASE campusgenie_db;"
mysql -u root -p campusgenie_db < database/schema.sql
```

### 2. Environment Variables Configuration
Copy the `.env.example` configurations to `.env` in both folders:

#### Backend Settings (`backend/.env`):
```ini
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=campusgenie_db
```

#### Frontend Settings (`frontend/.env`):
*No env vars are required for local development or production as the app utilizes relative paths (`/api`) dynamically proxied to the API backend.*

### 3. Install Dependencies
Run the installation command in both folders:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Running Locally
Run both servers in separate shells:
```bash
# Start Express Backend on http://localhost:5000
cd backend
npm run dev

# Start Vite Frontend on http://localhost:3000
cd ../frontend
npm run dev
```

---

## 🔒 Production Deployment on AWS

### 1. Amazon RDS (MySQL)
1. Launch an Amazon RDS MySQL instance.
2. Ensure the Security Group allows inbound connections on port `3306` from your EC2 instance security group.
3. Connect and initialize the database schema using `database/schema.sql`.

### 2. Amazon EC2 (Nginx + Application Node Server)
1. Launch an Ubuntu EC2 instance.
2. Clone the repository and install Node.js (v20 LTS recommended).
3. Configure the backend env variables in `backend/.env` pointing `DB_HOST` to your Amazon RDS Endpoint.
4. Start the Node.js process using a process manager to keep it alive:
   ```bash
   cd backend
   npm install --production
   npm install -g pm2
   pm2 start server.js --name "campusgenie-api"
   pm2 save
   pm2 startup
   ```

### 3. Frontend Production Build
Build the optimized static assets. Vite will output the build bundle into `frontend/dist/`.
```bash
cd frontend
npm install
npm run build
```

### 4. Nginx Server Configuration
Install Nginx on your EC2 instance:
```bash
sudo apt update
sudo apt install nginx
```

Deploy the Nginx config located at `nginx/nginx.conf` to `/etc/nginx/sites-available/default` (or map it accordingly). The configuration does the following:
- Serves static compiled React assets from `frontend/dist` directly.
- Reverse-proxies all calls under `/api/*` to the Express backend running locally on port `5000`.
- Implements single-page application SPA routing (fallback to `index.html` for client-side routing).

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL & Load Balancing (HTTPS)
For production secure delivery:
1. Configure an **AWS Application Load Balancer (ALB)**.
2. Request a public certificate using **AWS Certificate Manager (ACM)** for your custom domain.
3. Create an HTTPS Listener (port `443`) on the ALB forwarding traffic to your EC2 target group (port `80` Nginx).
4. Restrict the EC2 instance Security Group to accept traffic ONLY from the Application Load Balancer.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
