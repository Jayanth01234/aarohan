# Temple Crowd Management System

A real-time crowd management and visualization system for temples and heritage sites.

## Features

- 🗺️ Real-time crowd density visualization
- 📊 Admin dashboard with live metrics
- 🎟️ Visitor booking system
- 📈 Crowd prediction
- ⚡ Real-time updates using Socket.IO

## Tech Stack

- Frontend: React, TailwindCSS, D3.js, Chart.js
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB (configured separately)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/temple-crowd-management.git
cd temple-crowd-management
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
cd client
npm install
\`\`\`

3. Install backend dependencies:
\`\`\`bash
cd ../server
npm install
\`\`\`

4. Create a .env file in the server directory:
\`\`\`
PORT=5000
MONGODB_URI=your_mongodb_uri (optional)
\`\`\`

### Running the Application

1. Start the backend server:
\`\`\`bash
cd server
npm run dev
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

### Admin Dashboard
Access the admin dashboard at `/admin` to:
- View real-time crowd density
- Monitor zone-wise occupancy
- Receive alerts for overcrowding

### Visitor Interface
Access the main page at `/` to:
- Check current crowd levels
- View predicted busy times
- Book visit slots

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request