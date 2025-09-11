"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Loader2, AlertCircle } from "lucide-react"

interface Agent {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface PipelineVisualizationProps {
  agents: Agent[]
  currentAgent: string | null
  status: "idle" | "running" | "completed" | "error"
}

export function PipelineVisualization({ agents, currentAgent, status }: PipelineVisualizationProps) {
  const getAgentStatus = (agentId: string, index: number) => {
    if (status === "idle") return "idle"
    if (status === "error") return "error"
    if (status === "completed") return "completed"

    if (currentAgent === agentId) return "active"

    // Check if this agent should be marked as completed based on pipeline order
    const currentIndex = agents.findIndex((a) => a.id === currentAgent)
    if (currentIndex > index) return "completed"

    return "pending"
  }

  const getStatusIcon = (agentStatus: string) => {
    switch (agentStatus) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "active":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (agentStatus: string) => {
    switch (agentStatus) {
      case "completed":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            Completed
          </Badge>
        )
      case "active":
        return <Badge variant="default">Running</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Idle</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {agents.map((agent, index) => {
        const agentStatus = getAgentStatus(agent.id, index)
        const Icon = agent.icon

        return (
          <div key={agent.id} className="relative">
            <Card
              className={cn(
                "p-4 transition-all duration-200",
                agentStatus === "active" && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                agentStatus === "completed" && "bg-green-500/5 border-green-500/20",
                agentStatus === "error" && "bg-destructive/5 border-destructive/20",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-lg",
                    agentStatus === "active" && "bg-primary text-primary-foreground",
                    agentStatus === "completed" && "bg-green-500 text-white",
                    agentStatus === "error" && "bg-destructive text-destructive-foreground",
                    agentStatus === "idle" && "bg-muted text-muted-foreground",
                    agentStatus === "pending" && "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-foreground">{agent.name}</h4>
                    {getStatusBadge(agentStatus)}
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>

                <div className="flex items-center">{getStatusIcon(agentStatus)}</div>
              </div>
            </Card>

            {/* Connection Line */}
            {index < agents.length - 1 && (
              <div className="flex justify-center py-2">
                <div
                  className={cn(
                    "w-0.5 h-6 transition-colors duration-200",
                    agentStatus === "completed" ? "bg-green-500" : "bg-border",
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
