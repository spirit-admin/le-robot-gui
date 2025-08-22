"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Database, Play, Brain, Activity, Eye, BarChart3 } from "lucide-react"
import { DatasetVisualization } from "./dataset-visualization"

export function MainContent() {
  const [activeView, setActiveView] = useState("dashboard")

  if (activeView === "datasets") {
    return (
      <main className="flex-1 overflow-auto p-6">
        <DatasetVisualization />
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and operations for robotics workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                variant="outline"
                onClick={() => setActiveView("datasets")}
              >
                <Database className="h-6 w-6" />
                <span className="font-medium">Load Dataset</span>
                <span className="text-xs text-muted-foreground">From HuggingFace Hub</span>
              </Button>

              <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
                <Eye className="h-6 w-6" />
                <span className="font-medium">Visualize Data</span>
                <span className="text-xs text-muted-foreground">Explore episodes</span>
              </Button>

              <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
                <Brain className="h-6 w-6" />
                <span className="font-medium">Evaluate Policy</span>
                <span className="text-xs text-muted-foreground">Test pretrained models</span>
              </Button>

              <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" variant="outline">
                <Play className="h-6 w-6" />
                <span className="font-medium">Train Model</span>
                <span className="text-xs text-muted-foreground">Start new training</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Datasets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Recent Datasets
            </CardTitle>
            <CardDescription>Recently accessed datasets and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "lerobot/pusht", episodes: 1000, size: "2.3 GB", status: "ready" },
                { name: "lerobot/aloha_static_coffee", episodes: 50, size: "1.1 GB", status: "loading" },
                { name: "lerobot/xarm_lift_medium", episodes: 200, size: "890 MB", status: "ready" },
              ].map((dataset, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{dataset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dataset.episodes} episodes • {dataset.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={dataset.status === "ready" ? "secondary" : "outline"}>{dataset.status}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => setActiveView("datasets")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GPU Memory</span>
                  <span>6.2 / 8.0 GB</span>
                </div>
                <Progress value={77} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>RAM Usage</span>
                  <span>12.1 / 32.0 GB</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Dataset loaded", target: "lerobot/pusht", time: "2 min ago" },
                  { action: "Policy evaluated", target: "diffusion_pusht", time: "5 min ago" },
                  { action: "Training started", target: "act_aloha_coffee", time: "1 hour ago" },
                  { action: "Model exported", target: "my_custom_policy", time: "2 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-muted-foreground"> • {activity.target}</span>
                    </div>
                    <span className="text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
