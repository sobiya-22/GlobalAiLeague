"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react"

interface ConnectionStatusProps {
  isConnected: boolean
  onReconnect: () => void
  showReconnect?: boolean
}

export function ConnectionStatus({ isConnected, onReconnect, showReconnect = true }: ConnectionStatusProps) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "outline" : "destructive"} className="flex items-center gap-1">
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3" />
            Connected
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Disconnected
          </>
        )}
      </Badge>

      {!isConnected && (
        <Button variant="outline" size="sm" onClick={onReconnect} className="h-6 px-2 bg-transparent">
          <RefreshCw className="w-3 h-3 mr-1" />
          Reconnect
        </Button>
      )}

      {!isConnected && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span>Backend: {backendUrl}</span>
        </div>
      )}
    </div>
  )
}
