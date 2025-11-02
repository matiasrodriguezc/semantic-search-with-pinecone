"use client"

import { Brain } from "lucide-react"

interface BehindTheScenesProps {
  queryText: string
  vectorDims: number
  vectorSnippet: string
}

export default function BehindTheScenesSection({ queryText, vectorDims, vectorSnippet }: BehindTheScenesProps) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-card to-card/50 p-6 shadow-lg shadow-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-accent" />
        <h4 className="font-semibold text-foreground">How does this work?</h4>
      </div>
      <ol className="space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white">
            1
          </span>
          <span>
            Your search: <span className="font-medium text-accent">{queryText || "[No search yet]"}</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-accent text-xs font-bold text-white">
            2
          </span>
          <span>
            Converted to vector: <span className="font-medium text-accent">{vectorDims}</span> dimensions
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-accent to-primary text-xs font-bold text-white">
            3
          </span>
          <span>
            Vector snippet:{" "}
            <code className="inline rounded bg-input px-2 py-1 font-mono text-xs text-secondary">
              {vectorSnippet || "[No data]"}
            </code>
          </span>
        </li>
      </ol>
    </div>
  )
}
