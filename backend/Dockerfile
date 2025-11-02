# 1. Usar una imagen base de Python
FROM python:3.9-slim

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar solo el archivo de requisitos e instalarlos
# Esto aprovecha la caché de Docker y hace que las builds futuras sean más rápidas
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copiar el resto de tu aplicación
# (main.py, course_descriptions.csv, etc.)
COPY . .

# 5. Exponer el puerto en el que correrá Uvicorn
# HF Spaces espera el puerto 8000 para Docker
EXPOSE 8000

# 6. El comando para iniciar tu aplicación
# Usamos --host 0.0.0.0 para que sea accesible
CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]