"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Loader2 } from "lucide-react"

interface QueryFormProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: () => void
  isLoading: boolean
  disabled: boolean
}

export function QueryForm({ query, onQueryChange, onSubmit, isLoading, disabled }: QueryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        placeholder="Enter your research query (e.g., 'Cricket trends in 2025')"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={!query.trim() || isLoading || disabled} className="px-6">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        {isLoading ? "Starting..." : "Analyze"}
      </Button>
    </form>
  )
}
