"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, Download, Play, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const mockTrainingHistory = [
  {
    id: "train_001",
    name: "ACT ALOHA Coffee",
    model: "Action Chunking Transformer",
    dataset: "lerobot/aloha_static_coffee",
    status: "completed",
    startTime: "2024-01-15 14:30",
    duration: "2h 45m",
    finalLoss: 0.0234,
    bestEpoch: 87,
    totalEpochs: 100,
  },
  {
    id: "train_002",
    name: "Diffusion PushT",
    model: "Diffusion Policy",
    dataset: "lerobot/pusht",
    status: "running",
    startTime: "2024-01-16 09:15",
    duration: "1h 23m",
    finalLoss: 0.0456,
    bestEpoch: 45,
    totalEpochs: 200,
  },
  {
    id: "train_003",
    name: "TDMPC XArm",
    model: "Temporal Difference MPC",
    dataset: "lerobot/xarm_lift_medium",
    status: "failed",
    startTime: "2024-01-14 16:20",
    duration: "0h 34m",
    finalLoss: 1.2345,
    bestEpoch: 12,
    totalEpochs: 150,
  },
  {
    id: "train_004",
    name: "VQ-BeT Manipulation",
    model: "VQ-BeT",
    dataset: "lerobot/pusht",
    status: "completed",
    startTime: "2024-01-13 11:45",
    duration: "1h 56m",
    finalLoss: 0.0189,
    bestEpoch: 78,
    totalEpochs: 80,
  },
]

export function TrainingHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "secondary",
      running: "default",
      failed: "destructive",
      paused: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* History Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Training History
          </CardTitle>
          <CardDescription>View and manage your previous training runs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {mockTrainingHistory.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {mockTrainingHistory.filter((t) => t.status === "running").length}
              </div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {mockTrainingHistory.filter((t) => t.status === "failed").length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{mockTrainingHistory.length}</div>
              <div className="text-sm text-muted-foreground">Total Runs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Runs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Training Runs</CardTitle>
          <CardDescription>Detailed view of your training experiments</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {mockTrainingHistory.map((run) => (
                <div key={run.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <h3 className="font-medium">{run.name}</h3>
                      {getStatusBadge(run.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <div className="font-medium">{run.model}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dataset:</span>
                      <div className="font-medium">{run.dataset.split("/")[1]}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{run.duration}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Final Loss:</span>
                      <div className="font-medium">{run.finalLoss.toFixed(4)}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Started: {run.startTime}</span>
                    <span>
                      Epoch {run.bestEpoch}/{run.totalEpochs}
                    </span>
                  </div>

                  {run.status === "running" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{Math.round((run.bestEpoch / run.totalEpochs) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${(run.bestEpoch / run.totalEpochs) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Export All Results
            </Button>
            <Button variant="outline" size="sm">
              Clear Failed Runs
            </Button>
            <Button variant="outline" size="sm">
              View Logs
            </Button>
            <Button variant="outline" size="sm">
              Compare Models
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
