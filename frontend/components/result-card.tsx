"use client"

import { Zap } from "lucide-react"

interface ResultCardProps {
  result: {
    id: string
    title: string
    description: string
    technology: string
    topic: string
    similarity: number
  }
}

export default function ResultCard({ result }: ResultCardProps) {
  const similarityPercentage = (result.similarity * 100).toFixed(0)
  const similarityColor =
    result.similarity >= 0.9
      ? "from-primary to-secondary"
      : result.similarity >= 0.8
        ? "from-secondary to-accent"
        : "from-accent to-primary"

  return (
    <div className="group overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-card to-card/50 p-5 shadow-md shadow-primary/5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{result.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
              {result.technology}
            </span>
            <span className="inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
              {result.topic}
            </span>
          </div>
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br ${similarityColor} p-4 text-white shadow-md`}
        >
          <Zap className="h-5 w-5" />
          <div className="text-center">
            <div className="text-xl font-bold">{similarityPercentage}%</div>
            <div className="text-xs font-medium opacity-90">Match</div>
          </div>
        </div>
      </div>
    </div>
  )
}
