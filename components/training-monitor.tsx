"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Clock, Pause, Square, TrendingUp, Zap, BarChart3 } from "lucide-react"

interface TrainingMonitorProps {
  model: {
    id: string
    name: string
  }
  dataset: {
    id: string
    name: string
  }
  isTraining: boolean
}

export function TrainingMonitor({ model, dataset, isTraining }: TrainingMonitorProps) {
  const [progress, setProgress] = useState(0)
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [trainLoss, setTrainLoss] = useState(1.0)
  const [valLoss, setValLoss] = useState(1.2)
  const [learningRate, setLearningRate] = useState(0.0001)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!isTraining) return

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100))
      setCurrentEpoch((prev) => Math.min(prev + 1, 100))
      setTrainLoss((prev) => Math.max(prev - Math.random() * 0.01, 0.1))
      setValLoss((prev) => Math.max(prev - Math.random() * 0.008, 0.12))
      setLearningRate((prev) => prev * 0.999)

      // Add random log entries
      const logMessages = [
        `Epoch ${currentEpoch + 1}/100 - Train Loss: ${trainLoss.toFixed(4)}`,
        `Validation Loss: ${valLoss.toFixed(4)}`,
        `Learning Rate: ${learningRate.toExponential(2)}`,
        `Batch processed - GPU Memory: ${(Math.random() * 2 + 6).toFixed(1)}GB`,
        `Checkpoint saved at epoch ${currentEpoch + 1}`,
      ]

      if (Math.random() > 0.6) {
        setLogs((prev) => [
          ...prev.slice(-15),
          `[${new Date().toLocaleTimeString()}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`,
        ])
      }
    }, 200)

    return () => clearInterval(interval)
  }, [isTraining, currentEpoch, trainLoss, valLoss, learningRate])

  return (
    <div className="space-y-6">
      {/* Training Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Training Status
          </CardTitle>
          <CardDescription>Real-time monitoring of model training progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{currentEpoch}/100</div>
              <div className="text-sm text-muted-foreground">Epochs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{progress.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{trainLoss.toFixed(4)}</div>
              <div className="text-sm text-muted-foreground">Train Loss</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">
                {isTraining ? `${Math.max(0, Math.ceil((100 - progress) / 5))}h` : "Complete"}
              </div>
              <div className="text-sm text-muted-foreground">Est. Remaining</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Training Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Badge variant={isTraining ? "secondary" : "outline"} className="flex items-center gap-1">
              {isTraining ? <Activity className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {isTraining ? "Training" : "Completed"}
            </Badge>
            <Badge variant="outline">Model: {model.name}</Badge>
            <Badge variant="outline">Dataset: {dataset.name}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Training Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Loss Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Training Loss</span>
                  <span>{trainLoss.toFixed(4)}</span>
                </div>
                <Progress value={Math.max(0, 100 - trainLoss * 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Validation Loss</span>
                  <span>{valLoss.toFixed(4)}</span>
                </div>
                <Progress value={Math.max(0, 100 - valLoss * 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Learning Rate</span>
                  <span>{learningRate.toExponential(2)}</span>
                </div>
                <Progress value={Math.min(100, learningRate * 1000000)} className="h-2" />
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
                  <span>{(Math.random() * 20 + 80).toFixed(1)}%</span>
                </div>
                <Progress value={Math.random() * 20 + 80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GPU Memory</span>
                  <span>{(Math.random() * 2 + 6).toFixed(1)}/8.0 GB</span>
                </div>
                <Progress value={Math.random() * 25 + 75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Training Speed</span>
                  <span>{(Math.random() * 5 + 15).toFixed(1)} samples/sec</span>
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
          <CardTitle>Training Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!isTraining}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" size="sm" disabled={!isTraining}>
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

      {/* Training Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Training Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Training charts will appear here</p>
              <p className="text-xs">Loss curves, metrics, and performance graphs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Training Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-muted/50">
            <div className="font-mono text-sm space-y-1">
              {logs.length === 0 ? (
                <div className="text-muted-foreground">Waiting for training to start...</div>
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
