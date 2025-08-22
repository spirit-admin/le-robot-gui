"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Clock, Pause, Square, Zap, TrendingUp } from "lucide-react"

interface EvaluationMonitorProps {
  policy: {
    id: string
    name: string
  }
  isRunning: boolean
}

export function EvaluationMonitor({ policy, isRunning }: EvaluationMonitorProps) {
  const [progress, setProgress] = useState(0)
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100))
      setCurrentEpisode((prev) => Math.min(prev + 1, 100))
      setSuccessRate((prev) => Math.min(prev + Math.random() * 2, 95))

      // Add random log entries
      const logMessages = [
        `Episode ${currentEpisode + 1}/100 completed - Success: ${Math.random() > 0.2}`,
        `Environment reset - New episode starting`,
        `Policy inference time: ${(Math.random() * 50 + 10).toFixed(1)}ms`,
        `Reward: ${(Math.random() * 100).toFixed(2)}`,
        `Steps: ${Math.floor(Math.random() * 200 + 50)}`,
      ]

      if (Math.random() > 0.7) {
        setLogs((prev) => [
          ...prev.slice(-20),
          `[${new Date().toLocaleTimeString()}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`,
        ])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, currentEpisode])

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Evaluation Status
          </CardTitle>
          <CardDescription>Real-time monitoring of policy evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{currentEpisode}/100</div>
              <div className="text-sm text-muted-foreground">Episodes</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{progress.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">
                {isRunning ? `${Math.max(0, Math.ceil((100 - progress) / 2))}min` : "Complete"}
              </div>
              <div className="text-sm text-muted-foreground">Est. Remaining</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Badge variant={isRunning ? "secondary" : "outline"} className="flex items-center gap-1">
              {isRunning ? <Activity className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {isRunning ? "Running" : "Completed"}
            </Badge>
            <Badge variant="outline">Policy: {policy.name}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Success Rate</span>
                  <span>{successRate.toFixed(1)}%</span>
                </div>
                <Progress value={successRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Reward</span>
                  <span>{(Math.random() * 100).toFixed(1)}</span>
                </div>
                <Progress value={Math.random() * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Episode Length</span>
                  <span>{Math.floor(Math.random() * 200 + 50)} steps</span>
                </div>
                <Progress value={Math.random() * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GPU Utilization</span>
                  <span>{(Math.random() * 30 + 70).toFixed(1)}%</span>
                </div>
                <Progress value={Math.random() * 30 + 70} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>{(Math.random() * 20 + 60).toFixed(1)}%</span>
                </div>
                <Progress value={Math.random() * 20 + 60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Inference Speed</span>
                  <span>{(Math.random() * 20 + 30).toFixed(1)} FPS</span>
                </div>
                <Progress value={Math.random() * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!isRunning}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" size="sm" disabled={!isRunning}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <div className="flex-1" />
            <Badge variant="outline" className="text-xs">
              Started: {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-muted/50">
            <div className="font-mono text-sm space-y-1">
              {logs.length === 0 ? (
                <div className="text-muted-foreground">Waiting for evaluation to start...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-xs">
                    {log}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
