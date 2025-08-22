"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Server, AlertTriangle, CheckCircle, Clock, Download } from "lucide-react"
import { SystemHealth } from "./system-health"
import { ActivityLogs } from "./activity-logs"
import { NotificationCenter } from "./notification-center"
import { PerformanceMetrics } from "./performance-metrics"

export function MonitoringDashboard() {
  const [systemStatus, setSystemStatus] = useState("healthy")
  const [activeJobs, setActiveJobs] = useState(2)
  const [totalJobs, setTotalJobs] = useState(15)
  const [uptime, setUptime] = useState("2d 14h 32m")

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Monitoring
              </CardTitle>
              <CardDescription>Real-time status and performance monitoring</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-700">Healthy</div>
              <div className="text-sm text-green-600">System Status</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{activeJobs}</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalJobs}</div>
              <div className="text-sm text-muted-foreground">Total Jobs</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{uptime}</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <SystemHealth />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ActivityLogs />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
