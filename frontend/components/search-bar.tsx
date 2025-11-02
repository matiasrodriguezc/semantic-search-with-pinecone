"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 p-[1px]">
          <div className="h-full w-full rounded-lg bg-input" />
        </div>
        <input
          type="text"
          className="relative z-10 w-full rounded-lg border-0 bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="E.g.: clustering, web with python..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Button onClick={handleSearch} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  )
}
