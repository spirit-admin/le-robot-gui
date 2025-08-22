"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Zap, TrendingUp, BarChart3 } from "lucide-react"

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    responseTime: 45,
    throughput: 1250,
    errorRate: 0.2,
    uptime: 99.8,
    activeConnections: 23,
    requestsPerMinute: 180,
    averageLatency: 12,
    peakMemoryUsage: 78,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        responseTime: Math.max(20, Math.min(100, prev.responseTime + (Math.random() - 0.5) * 10)),
        throughput: Math.max(800, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 100)),
        errorRate: Math.max(0, Math.min(2, prev.errorRate + (Math.random() - 0.5) * 0.2)),
        activeConnections: Math.max(10, Math.min(50, prev.activeConnections + Math.floor((Math.random() - 0.5) * 6))),
        requestsPerMinute: Math.max(
          100,
          Math.min(300, prev.requestsPerMinute + Math.floor((Math.random() - 0.5) * 20)),
        ),
        averageLatency: Math.max(5, Math.min(30, prev.averageLatency + (Math.random() - 0.5) * 3)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{metrics.responseTime.toFixed(0)}ms</div>
              <div className="text-xs text-muted-foreground">Average response time</div>
              <Progress value={Math.min(100, metrics.responseTime)} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{metrics.throughput.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Requests per second</div>
              <Progress value={Math.min(100, (metrics.throughput / 2000) * 100)} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{metrics.errorRate.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Error percentage</div>
              <Progress value={metrics.errorRate * 50} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{metrics.uptime.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">System availability</div>
              <Progress value={metrics.uptime} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Metrics</CardTitle>
            <CardDescription>Real-time connection and request statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Connections</span>
              <Badge variant="secondary">{metrics.activeConnections}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Requests/Minute</span>
              <Badge variant="secondary">{metrics.requestsPerMinute}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Latency</span>
              <Badge variant="secondary">{metrics.averageLatency.toFixed(0)}ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Peak Memory Usage</span>
              <Badge variant="secondary">{metrics.peakMemoryUsage}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Historical performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Time Trend</span>
                <span className="text-green-600">↓ 12% (Good)</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Throughput Trend</span>
                <span className="text-green-600">↑ 8% (Good)</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Error Rate Trend</span>
                <span className="text-green-600">↓ 45% (Excellent)</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uptime Trend</span>
                <span className="text-green-600">↑ 2% (Stable)</span>
              </div>
              <Progress value={99} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Alerts</CardTitle>
          <CardDescription>Current performance status and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-green-800">System Performance Optimal</div>
                <div className="text-sm text-green-600">All metrics are within acceptable ranges</div>
              </div>
            </div>

            {metrics.responseTime > 80 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium text-yellow-800">High Response Time</div>
                  <div className="text-sm text-yellow-600">
                    Consider optimizing database queries or scaling resources
                  </div>
                </div>
              </div>
            )}

            {metrics.errorRate > 1 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium text-red-800">Elevated Error Rate</div>
                  <div className="text-sm text-red-600">Check application logs for recurring errors</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
