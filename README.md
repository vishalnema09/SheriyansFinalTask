# AI-Powered Intelligent Image Compression (MERN)

This project is a full-stack web application that intelligently compresses images using AI-powered region detection. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it preserves important regions (like faces/text) while reducing file size.

## Features
- Upload JPG/PNG images
- AI-powered detection of important regions (faces, text, etc.)
- Adaptive compression: high quality in key areas, aggressive elsewhere
- Preview original and compressed images
- Download optimized results
- Secure, fast, and scalable
- Responsive UI

## Project Structure
```
/ai-image-compressor/
  /backend/
  /frontend/
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas, optional for MVP)

### Backend Setup
```
cd backend
npm install
cp .env.example .env # Edit with your config
npm run dev
```

### Frontend Setup
```
cd frontend
npm install
npm start
```

### Environment Variables
See `backend/.env.example` for required variables (AI API keys, MongoDB URI, etc).

## Usage
1. Start backend and frontend servers.
2. Open the frontend in your browser.
3. Upload an image, preview results, and download the compressed version.

## License
MIT 