"use client"

import { useState } from "react"
import SearchBar from "@/components/search-bar"
import BehindTheScenesSection from "@/components/behind-the-scenes"
import ResultCard from "@/components/result-card"

// Esta interfaz la definiste tú y está perfecta
interface SearchResult {
  id: string
  title: string
  description: string
  technology: string
  topic: string
  similarity: number
}

// Interfaz para la respuesta de NUESTRA API
// (Nota cómo la data de los cursos viene anidada)
interface ApiResultItem {
  id: string
  score: number
  data: {
    course_name: string
    description: string
    technology: string
    topic: string
    slug: string // aunque no la usemos, la API la devuelve
  }
}

// Interfaz para la info de debug de NUESTRA API
interface ApiDebugInfo {
  query_text: string
  query_vector_snippet: number[]
  vector_dimensions: number
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [queryText, setQueryText] = useState("")
  const [vectorDims, setVectorDims] = useState(0)
  const [vectorSnippet, setVectorSnippet] = useState("")
  const [error, setError] = useState<string | null>(null) // <-- Añadimos estado de error

  //
  // --- ¡ESTA ES LA FUNCIÓN MODIFICADA! ---
  //
  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setResults([]) // Limpiamos resultados anteriores
    setError(null) // Limpiamos errores anteriores
    setQueryText(query) // Mostramos el query inmediatamente

    try {
      // --- Llamada real a la API ---
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, { // <-- Usamos la variable de entorno
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          top_k: 5, // Pedimos 5 resultados
        }),
      })

      if (!response.ok) {
        throw new Error(`Error de API: ${response.statusText}`)
      }

      // --- Procesamos la respuesta real de la API ---
      const data: { results: ApiResultItem[]; debug_info: ApiDebugInfo } = await response.json()

      // --- ¡Mapeo de datos! ---
      // Transformamos la respuesta de la API a la estructura que esperan tus componentes de v0
      const formattedResults: SearchResult[] = data.results.map((item) => ({
        id: item.id,
        title: item.data.course_name, // <-- Mapeo
        description: item.data.description, // <-- Mapeo
        technology: item.data.technology, // <-- Mapeo
        topic: item.data.topic, // <-- Mapeo
        similarity: item.score, // <-- Mapeo
      }))
      
      // Formateamos el snippet del vector
      const snippet = `[${data.debug_info.query_vector_snippet.map(n => n.toFixed(3)).join(", ")}, ...]`

      // Actualizamos el estado con los datos REALES
      setResults(formattedResults)
      setVectorDims(data.debug_info.vector_dimensions)
      setVectorSnippet(snippet)
      setQueryText(data.debug_info.query_text) // El query que la API procesó

    } catch (err: any) {
      setError(err.message) // <-- Manejamos el error
    } finally {
      setIsLoading(false) // <-- Importante: detener la carga
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-[#0f0a2e] to-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
            Semantic Course Search
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">Discover courses using intelligent semantic search</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-4 text-center">
            <div className="inline-block rounded-full bg-primary/20 px-4 py-2">
              <span className="text-sm font-medium text-primary">Buscando...</span>
            </div>
          </div>
        )}
        
        {/* <-- Mostramos el error si existe --> */}
        {error && (
           <div className="mb-4 text-center">
            <div className="inline-block rounded-full bg-red-800/20 px-4 py-2">
              <span className="text-sm font-medium text-red-500">{error}</span>
            </div>
          </div>
        )}

        {/* Behind the Scenes Section */}
        {/* Esto funciona si la búsqueda NO dio error y NO está cargando */}
        {!isLoading && !error && (queryText.length > 0) && ( // <-- Solo mostrar si hay un query
           <BehindTheScenesSection queryText={queryText} vectorDims={vectorDims} vectorSnippet={vectorSnippet} />
        )}
       

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}