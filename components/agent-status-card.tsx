"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Loader2, AlertCircle } from "lucide-react"

interface Agent {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface AgentStatusCardProps {
  agent: Agent
  isActive: boolean
  isCompleted: boolean
  status: "idle" | "running" | "completed" | "error"
}

export function AgentStatusCard({ agent, isActive, isCompleted, status }: AgentStatusCardProps) {
  const Icon = agent.icon

  const getStatusIcon = () => {
    if (status === "error") return <AlertCircle className="w-4 h-4 text-destructive" />
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (isActive) return <Loader2 className="w-4 h-4 text-primary animate-spin" />
    return <Circle className="w-4 h-4 text-muted-foreground" />
  }

  const getStatusText = () => {
    if (status === "error") return "Error"
    if (isCompleted) return "Completed"
    if (isActive) return "Running"
    return "Idle"
  }

  const getStatusVariant = () => {
    if (status === "error") return "destructive"
    if (isCompleted) return "outline"
    if (isActive) return "default"
    return "secondary"
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isActive && "ring-1 ring-primary ring-offset-1 ring-offset-background",
        isCompleted && "bg-green-500/5 border-green-500/20",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md",
              isActive && "bg-primary text-primary-foreground",
              isCompleted && "bg-green-500 text-white",
              !isActive && !isCompleted && "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-foreground truncate">{agent.name}</h4>
              {getStatusIcon()}
            </div>
            <Badge variant={getStatusVariant()} className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
