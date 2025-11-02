# Semantic Course Search (Pinecone Demo)

This is a portfolio project demonstrating a full-stack semantic search application. It uses a Sentence Transformer model to generate vector embeddings for course descriptions, stores them in [Pinecone](https://www.pinecone.io/), and serves a [Next.js](https://nextjs.org/) frontend that can perform natural language queries against the vector database.

### ✨ Live Demo

* **Frontend (Vercel):** `[https://semantic-search-with-pinecone.vercel.app]`
* **Backend (Hugging Face):** `[https://matiasrodriguezc-semantic-search.hf.space/search]`

---

### 🚀 Tech Stack

* **Frontend:** Next.js (with v0.dev), React, TypeScript, Tailwind CSS
* **Backend:** FastAPI (Python), Docker
* **Vector Database:** Pinecone
* **AI / Embeddings:** `sentence-transformers` (`all-MiniLM-L6-v2` model)
* **Deployment:** Vercel (Frontend) & **Hugging Face Spaces** (Backend)

---

### 🏛️ How It Works

This project is divided into two main parts: the **ingestion** script and the **search API**.

#### 1. Ingestion (`backend/ingest.py`)
This script is run once locally to populate the Pinecone index.
1.  It reads a `course_descriptions.csv` file.
2.  For each course, it creates a combined text description.
3.  It uses the `all-MiniLM-L6-v2` model to convert this text into a 384-dimension vector embedding.
4.  It uploads (upserts) this vector to Pinecone, along with its metadata (like `course_name`, `description`, etc.).

#### 2. Search API & UI
1.  A user types a query (e.g., "web apps with python") into the Next.js frontend.
2.  The frontend sends this query to the FastAPI backend deployed on Hugging Face Spaces.
3.  The backend creates a vector embedding for the user's query *using the same model*.
4.  It queries the Pinecone index, asking for the `top_k` most similar vectors (using cosine similarity).
5.  Pinecone returns the matching course data.
6.  The API sends the results back to the frontend, which displays them as result cards.

---

### 🔧 How to Run Locally

#### Prerequisites
* Python 3.9+
* Node.js & pnpm
* Docker (para replicar el entorno de HF Spaces)
* A Pinecone API Key

#### 1. Backend (FastAPI)
```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
python3 -m pip install -r requirements.txt

# Create a .env file and add your Pinecone key
echo "PINECONE_API_KEY='your_pinecone_key_here'" > .env

# Run the ingestion script (only once)
# This will create the 384-dimension index in Pinecone
python3 ingest.py

# Run the local server
python3 -m uvicorn main:app --reload

# Navigate to the frontend folder
cd frontend

# Install Node.js dependencies
pnpm install

# Create a .env.local file
# This points to your local backend server
echo "NEXT_PUBLIC_API_URL='[http://127.0.0.1:8000/search](http://127.0.0.1:8000/search)'" > .env.local

# Run the local server
pnpm run dev
