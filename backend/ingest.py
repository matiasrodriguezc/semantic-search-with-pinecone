import pandas as pd
import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv, find_dotenv
from sentence_transformers import SentenceTransformer
import time

# --- Carga de datos y modelo ---
print("Cargando variables de entorno...")
load_dotenv(find_dotenv(), override=True)

print("Cargando CSV...")
files = pd.read_csv("course_descriptions.csv", encoding="windows-1252")

def create_course_description(row):
    return f'''The course name is {row["course_name"]}, the slug is {row["course_slug"]},
            the technology is {row["course_technology"]} and the course topic is {row["course_topic"]}'''

files['course_description_new'] = files.apply(create_course_description, axis=1)

# --- Inicialización de Pinecone ---
print("Conectando a Pinecone...")
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = "my-index"

# ¡¡OJO!! El modelo 'multi-qa-distilbert-cos-v1' tiene 768 dimensiones, no 384.
# (El modelo 'all-MiniLM-L6-v2' tiene 384)
dimension = 384
metric = "cosine"

if index_name in [index.name for index in pc.list_indexes()]:
    print(f"Borrando índice existente: {index_name}...")
    pc.delete_index(index_name)
    print(f"{index_name} borrado exitosamente.")

print(f"Creando nuevo índice: {index_name}...")
pc.create_index(
    name=index_name,
    dimension=dimension,
    metric=metric,
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

# Esperar a que el índice esté listo
while not pc.describe_index(index_name).status['ready']:
    print("Esperando que el índice esté listo...")
    time.sleep(5)

index = pc.Index(index_name)
print("Índice listo.")

# --- Creación de Embeddings ---
print("Cargando modelo de embeddings (esto puede tardar)...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Modelo cargado.")

def create_embeddings(row):
    combined_text = ' '.join([str(row[field]) for field in ['course_description', 'course_description_new', 'course_description_short']])
    embedding = model.encode(combined_text, show_progress_bar=False)
    return embedding

files["embedding"] = files.apply(create_embeddings, axis=1)
print("Embeddings creados.")

# --- ¡CAMBIO IMPORTANTE: Upsert con Metadatos! ---
vectors_to_upsert = []
for _, row in files.iterrows():
    vector = {
        "id": str(row["course_name"]), # ID único
        "values": row["embedding"].tolist(), # El vector
        "metadata": { # ¡Toda la info que quieres mostrar!
            "course_name": str(row["course_name"]),
            "description": str(row["course_description_short"]),
            "technology": str(row["course_technology"]),
            "topic": str(row["course_topic"]),
            "slug": str(row["course_slug"])
        }
    }
    vectors_to_upsert.append(vector)

# Sube los vectores en lotes (batches)
print("Subiendo vectores a Pinecone...")
for i in range(0, len(vectors_to_upsert), 100): # Lotes de 100
    batch = vectors_to_upsert[i:i+100]
    index.upsert(vectors=batch)

print("¡Datos subidos exitosamente!")
print(index.describe_index_stats())