"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Server, Cpu, HardDrive, Wifi, Database, RefreshCw } from "lucide-react"

export function SystemHealth() {
  const [metrics, setMetrics] = useState({
    cpu: { usage: 45, temperature: 62, cores: 8 },
    memory: { used: 12.1, total: 32.0, percentage: 38 },
    gpu: { usage: 78, memory: 6.2, total: 8.0, temperature: 71 },
    disk: { used: 245, total: 500, percentage: 49 },
    network: { status: "connected", latency: 12, bandwidth: 1000 },
    services: [
      { name: "LeRobot Server", status: "running", port: 8000 },
      { name: "Database", status: "running", port: 5432 },
      { name: "Redis Cache", status: "running", port: 6379 },
      { name: "File Server", status: "running", port: 8080 },
    ],
  })

  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(20, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          temperature: Math.max(50, Math.min(80, prev.cpu.temperature + (Math.random() - 0.5) * 5)),
        },
        memory: {
          ...prev.memory,
          percentage: Math.max(20, Math.min(85, prev.memory.percentage + (Math.random() - 0.5) * 5)),
        },
        gpu: {
          ...prev.gpu,
          usage: Math.max(60, Math.min(95, prev.gpu.usage + (Math.random() - 0.5) * 8)),
          temperature: Math.max(65, Math.min(85, prev.gpu.temperature + (Math.random() - 0.5) * 3)),
        },
        network: {
          ...prev.network,
          latency: Math.max(5, Math.min(50, prev.network.latency + (Math.random() - 0.5) * 5)),
        },
      }))
      setLastUpdate(new Date())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800"
      case "stopped":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "critical"
    if (value >= thresholds.warning) return "warning"
    return "healthy"
  }

  return (
    <div className="space-y-6">
      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Cpu className="h-4 w-4" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span>{metrics.cpu.usage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.cpu.usage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{metrics.cpu.cores} cores</span>
                <span>{metrics.cpu.temperature}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Server className="h-4 w-4" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span>{metrics.memory.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.memory.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {metrics.memory.used.toFixed(1)} / {metrics.memory.total} GB
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Server className="h-4 w-4" />
              GPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span>{metrics.gpu.usage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.gpu.usage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {metrics.gpu.memory.toFixed(1)} / {metrics.gpu.total} GB
                </span>
                <span>{metrics.gpu.temperature}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HardDrive className="h-4 w-4" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span>{metrics.disk.percentage}%</span>
              </div>
              <Progress value={metrics.disk.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {metrics.disk.used} / {metrics.disk.total} GB
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">Connected</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{metrics.network.latency.toFixed(0)}ms</div>
              <div className="text-sm text-muted-foreground">Latency</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{metrics.network.bandwidth} Mbps</div>
              <div className="text-sm text-muted-foreground">Bandwidth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Services Status
            </CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">Port {service.port}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Update */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <span>Auto-refresh every 2 seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
