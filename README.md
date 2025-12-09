# Everyday Physics Explain-It Bot

An AI-powered application that explains everyday physics phenomena using analogies, step-by-step breakdowns, and visual concepts.

## Features
- **Multi-Agent Architecture**: Physics Expert, Analogy Composer, Experiment Designer, and Visualizer agents.
- **Model Agnostic**: Switch between **Google Gemini** (2.5 Flash) and **Groq** (Llama 3.3, Mixtral) for explanations.
- **Interactive UI**: Clean React-based interface with dynamic model selection.

## Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

1. **Start Backend**:
   ```bash
   # From root
   cd backend
   # Ensure venv is active
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```
   Runs on `http://localhost:8000`.

2. **Start Frontend**:
   ```bash
   # From root
   cd frontend
   npm run dev
   ```
   Runs on `http://localhost:5173`.

## Usage
1. Open the frontend URL.
2. Select your preferred AI model from the top-right dropdown (e.g., Gemini 2.5 Flash, Llama 3.3 70B).
3. Type a physics question (e.g., "How do magnets work?").
4. Get a comprehensive explanation with analogies and experiment ideas!
