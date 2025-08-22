"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Clock, Database } from "lucide-react"

interface DatasetStatsProps {
  dataset: {
    id: string
    name: string
    episodes: number
    size: string
  }
}

export function DatasetStats({ dataset }: DatasetStatsProps) {
  const mockStats = {
    totalFrames: 25000,
    avgEpisodeLength: 25,
    successRate: 87,
    actionDimensions: 7,
    observationDimensions: {
      robot_state: 7,
      gripper_state: 1,
      images: 2,
    },
    dataDistribution: [
      { label: "Episode 0-200", value: 35, color: "bg-chart-1" },
      { label: "Episode 201-400", value: 28, color: "bg-chart-2" },
      { label: "Episode 401-600", value: 22, color: "bg-chart-3" },
      { label: "Episode 601-800", value: 15, color: "bg-chart-4" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{mockStats.totalFrames.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Frames</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{mockStats.avgEpisodeLength}</p>
                <p className="text-sm text-muted-foreground">Avg Episode Length</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{mockStats.successRate}%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{mockStats.actionDimensions}D</p>
                <p className="text-sm text-muted-foreground">Action Space</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Data Distribution</CardTitle>
          <CardDescription>Distribution of episodes across the dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.dataDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Observation Space */}
      <Card>
        <CardHeader>
          <CardTitle>Observation Space</CardTitle>
          <CardDescription>Breakdown of observation dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{mockStats.observationDimensions.robot_state}</div>
              <div className="text-sm text-muted-foreground">Robot State</div>
              <Badge variant="outline" className="mt-2">
                Joint Positions
              </Badge>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{mockStats.observationDimensions.gripper_state}</div>
              <div className="text-sm text-muted-foreground">Gripper State</div>
              <Badge variant="outline" className="mt-2">
                Binary
              </Badge>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{mockStats.observationDimensions.images}</div>
              <div className="text-sm text-muted-foreground">Camera Feeds</div>
              <Badge variant="outline" className="mt-2">
                RGB Images
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
          <CardDescription>Dataset quality and completeness indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Data Completeness</span>
                <span>98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Annotation Quality</span>
                <span>95.2%</span>
              </div>
              <Progress value={95.2} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Temporal Consistency</span>
                <span>92.8%</span>
              </div>
              <Progress value={92.8} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
