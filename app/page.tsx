"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Brain, Database, Search, BarChart3, Cpu, FileText, Loader2, Eye } from "lucide-react"
import { PipelineVisualization } from "@/components/pipeline-visualization"
import { AgentStatusCard } from "@/components/agent-status-card"
import { QueryForm } from "@/components/query-form"
import { ConnectionStatus } from "@/components/connection-status"
import { ResultsDisplay } from "@/components/results-display"

export default function Dashboard() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisStatus, setAnalysisStatus] = useState({
    status: "idle",
    current_agent: null,
    progress: 0,
    error: null,
    timestamp: null,
  })
  const [results, setResults] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const checkBackendHealth = async () => {
    try {
      const response = await fetch("http://localhost:8000/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      setIsConnected(response.ok)
      return response.ok
    } catch (error) {
      setIsConnected(false)
      return false
    }
  }

  const startAnalysis = async (query: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error("Failed to start analysis")

      setAnalysisStatus({
        status: "running",
        current_agent: "prompt_agent",
        progress: 10,
        error: null,
        timestamp: Date.now(),
      })

      const pollStatus = async () => {
        try {
          const statusResponse = await fetch("http://localhost:8000/api/status")
          const status = await statusResponse.json()
          setAnalysisStatus(status)

          if (status.status === "completed") {
            const resultsResponse = await fetch("http://localhost:8000/api/results")
            const resultsData = await resultsResponse.json()
            setResults(resultsData)
            setShowResults(true)
          } else if (status.status === "running") {
            setTimeout(pollStatus, 2000)
          }
        } catch (error) {
          console.error("Status polling error:", error)
          setAnalysisStatus((prev) => ({ ...prev, error: "Connection lost" }))
        }
      }

      setTimeout(pollStatus, 1000)
    } catch (error) {
      setAnalysisStatus({
        status: "error",
        current_agent: null,
        progress: 0,
        error: error.message,
        timestamp: Date.now(),
      })
    }
  }

  const reconnect = async () => {
    await checkBackendHealth()
  }

  useEffect(() => {
    checkBackendHealth()
  }, [])

  const agents = [
    { id: "scraper", name: "Web Scraper", icon: Search, description: "Searches and collects data from web sources" },
    { id: "data_cleaning", name: "Data Cleaner", icon: Database, description: "Preprocesses and cleans raw data" },
    { id: "eda", name: "EDA Agent", icon: BarChart3, description: "Performs exploratory data analysis" },
    { id: "model_training", name: "ML Trainer", icon: Cpu, description: "Trains machine learning models" },
    { id: "report", name: "Report Generator", icon: FileText, description: "Generates final analysis report" },
  ]

  const handleStartAnalysis = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setShowResults(false)
    try {
      await startAnalysis(query)
    } finally {
      setIsLoading(false)
    }
  }

  if (showResults || analysisStatus.status === "completed") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Analysis Dashboard</h1>
                <p className="text-sm text-muted-foreground">Analysis Results</p>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8">
          <ResultsDisplay results={results} onClose={() => setShowResults(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">UagentsIQ</h1>
                <p className="text-sm text-muted-foreground">Multi-Agent Data Analysis Pipeline</p>
              </div>
            </div>
            <ConnectionStatus
              isConnected={isConnected}
              onReconnect={reconnect}
              showReconnect={analysisStatus.status === "running"}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Query Input */}
            <Card>
              <CardHeader>
                <CardTitle>Start New Analysis</CardTitle>
                <CardDescription>Enter your research query to begin the multi-agent analysis pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <QueryForm
                  query={query}
                  onQueryChange={setQuery}
                  onSubmit={handleStartAnalysis}
                  isLoading={isLoading}
                  disabled={analysisStatus.status === "running"}
                />
              </CardContent>
            </Card>

            {/* Pipeline Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Analysis Pipeline
                  {analysisStatus.status === "running" && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-muted-foreground">Live Updates</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>Real-time visualization of the multi-agent analysis process</CardDescription>
              </CardHeader>
              <CardContent>
                <PipelineVisualization
                  agents={agents}
                  currentAgent={analysisStatus.current_agent}
                  status={analysisStatus.status}
                />
              </CardContent>
            </Card>

            {/* Progress Overview */}
            {analysisStatus.status !== "idle" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Analysis Progress
                    {analysisStatus.status === "running" && <Loader2 className="w-4 h-4 animate-spin" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{analysisStatus.progress}%</span>
                  </div>
                  <Progress value={analysisStatus.progress} className="w-full" />

                  {analysisStatus.current_agent && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Current:{" "}
                        {agents.find((a) => a.id === analysisStatus.current_agent)?.name ||
                          analysisStatus.current_agent}
                      </Badge>
                      {analysisStatus.timestamp && (
                        <span className="text-xs text-muted-foreground">
                          Updated: {new Date(analysisStatus.timestamp * 1000).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  )}

                  {analysisStatus.status === "completed" && (
                    <div className="flex items-center gap-2 pt-2">
                      <Button onClick={() => setShowResults(true)} className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Results
                      </Button>
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Analysis Complete
                      </Badge>
                    </div>
                  )}

                  {analysisStatus.error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{analysisStatus.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Status Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Agent Status</h3>
              {agents.map((agent) => (
                <AgentStatusCard
                  key={agent.id}
                  agent={agent}
                  isActive={analysisStatus.current_agent === agent.id}
                  isCompleted={
                    analysisStatus.status === "completed" ||
                    (analysisStatus.current_agent !== agent.id && analysisStatus.progress > 0)
                  }
                  status={analysisStatus.status}
                />
              ))}
            </div>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backend Status</span>
                  <Badge variant={isConnected ? "outline" : "destructive"} className="text-xs">
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Agents</span>
                  <span className="font-medium">{agents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pipeline Version</span>
                  <span className="font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updates</span>
                  <span className="font-medium">Real-time</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
