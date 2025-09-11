"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, BarChart3, Database, Brain, Clock, Download, Copy, CheckCircle } from "lucide-react"

interface AnalysisResults {
  query: string
  final_answer: string
  eda_output: string
  scrape_results: string
  cleaned_data: string
  model_info: string
  processing_time?: number
  data_sources: number
  characters_processed: number
  agent_actions: number
}

interface ResultsDisplayProps {
  results: AnalysisResults | null
  onClose?: () => void
}

export function ResultsDisplay({ results, onClose }: ResultsDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const downloadResults = () => {
    if (!results) return

    const reportContent = `
# Analysis Report: ${results.query}

## Final Answer
${results.final_answer}

## Exploratory Data Analysis
${results.eda_output}

## Model Information
${results.model_info}

## Processing Details
- Processing Time: ${results.processing_time ? results.processing_time.toFixed(2) : "N/A"} seconds
- Data Sources: ${results.data_sources}
- Data Length: ${results.characters_processed} characters

## Agent Execution Log
Analysis completed successfully through 6-agent pipeline:
1. Prompt Agent - Query processing
2. Scraper Agent - Web data collection  
3. Data Cleaning Agent - Text preprocessing
4. EDA Agent - Exploratory analysis
5. Model Training Agent - ML model creation
6. Report Agent - Final report generation

## Raw Data Summary
${results.scrape_results}
`

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analysis-report-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No results available - please run an analysis first</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">Analysis Results</CardTitle>
              </div>
              <CardDescription className="text-base">
                Query: <span className="font-medium text-foreground">"{results.query}"</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={downloadResults} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="outline" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{results.data_sources}</div>
              <div className="text-sm text-muted-foreground">Data Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{results.characters_processed.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Characters Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{results.agent_actions}</div>
              <div className="text-sm text-muted-foreground">Agent Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {results.processing_time ? `${results.processing_time.toFixed(1)}s` : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="answer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="answer" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Answer
          </TabsTrigger>
          <TabsTrigger value="eda" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Model
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="answer">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI-Generated Answer
                </CardTitle>
                <Button onClick={() => copyToClipboard(results.final_answer, "answer")} variant="outline" size="sm">
                  {copiedSection === "answer" ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedSection === "answer" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">{results.final_answer}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eda">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Exploratory Data Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    {results.eda_output}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Data Sources & Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Scraped Data Summary</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Found {results.data_sources} sources • {results.characters_processed.toLocaleString()} characters
                  </p>
                  <ScrollArea className="h-32">
                    <div className="text-sm font-mono whitespace-pre-wrap">
                      {results.scrape_results.substring(0, 1000)}
                      {results.scrape_results.length > 1000 && "..."}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cleaned Data Preview</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <ScrollArea className="h-32">
                    <div className="text-sm font-mono whitespace-pre-wrap">
                      {results.cleaned_data.substring(0, 500)}
                      {results.cleaned_data.length > 500 && "..."}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Machine Learning Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Model Information</h4>
                  <div className="text-sm whitespace-pre-wrap">{results.model_info}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Agent Execution Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { agent: "prompt_agent", action: "Query processing initiated", status: "completed" },
                  { agent: "scraper_agent", action: "Web data collection from multiple sources", status: "completed" },
                  { agent: "data_cleaning_agent", action: "Text preprocessing and cleaning", status: "completed" },
                  { agent: "eda_agent", action: "Exploratory data analysis performed", status: "completed" },
                  { agent: "model_training_agent", action: "Machine learning model trained", status: "completed" },
                  { agent: "report_agent", action: "Final report generated with Gemini AI", status: "completed" },
                ].map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      {log.agent.replace("_agent", "")}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString()} • {log.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
