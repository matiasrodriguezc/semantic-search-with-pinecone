import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Para permitir que Vercel se conecte
from pydantic import BaseModel
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv, find_dotenv

# --- Carga y Configuración Inicial (se ejecuta una vez al iniciar) ---
print("Cargando variables de entorno...")
load_dotenv(find_dotenv(), override=True)

print("Cargando modelo de embeddings...")
# Cargar el modelo (toma tiempo, por eso se hace al inicio)
model = SentenceTransformer('multi-qa-distilbert-cos-v1')
print("Modelo cargado.")

print("Conectando a Pinecone...")
# Conectar a Pinecone
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = "my-index"

if index_name not in [index.name for index in pc.list_indexes()]:
    print(f"Error: El índice '{index_name}' no existe. Por favor, corre 'ingest.py' primero.")
    exit()

index = pc.Index(index_name)
print("Conexión a Pinecone exitosa.")

# Crear la aplicación FastAPI
app = FastAPI()

# Configurar CORS (¡Muy importante para Vercel!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todas las fuentes (para el demo)
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],
)

# Definir el formato de la petición que esperamos
class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    score_threshold: float = 0.0

# --- El Endpoint de Búsqueda ---
@app.post("/search")
def search(request: SearchRequest):
    print(f"Recibida query: {request.query}")
    
    # 1. Crear el embedding para el query
    query_embedding = model.encode(request.query, show_progress_bar=False).tolist()
    
    # 2. Consultar a Pinecone
    query_results = index.query(
        vector=[query_embedding],
        top_k=request.top_k,
        include_metadata=True # ¡Pedimos los metadatos!
    )
    
    # 3. Filtrar y formatear la respuesta
    results = []
    for match in query_results["matches"]:
        if match['score'] >= request.score_threshold:
            results.append({
                "id": match['id'],
                "score": match['score'],
                "data": match['metadata'] # Aquí vienen los datos del curso
            })
            
    # 4. Devolver la respuesta (con la info de debug que te sugerí)
    return {
        "results": results,
        "debug_info": {
            "query_text": request.query,
            "query_vector_snippet": query_embedding[:5], # Mostramos solo los primeros 5
            "vector_dimensions": len(query_embedding)
        }
    }