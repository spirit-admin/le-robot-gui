"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Search, Filter, Download, RefreshCw } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "debug"
  category: string
  message: string
  details?: string
}

export function ActivityLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Mock log generation
  useEffect(() => {
    const generateLog = (): LogEntry => {
      const levels: LogEntry["level"][] = ["info", "warning", "error", "debug"]
      const categories = ["training", "evaluation", "dataset", "system", "api"]
      const messages = [
        "Training epoch completed successfully",
        "Dataset loaded from HuggingFace Hub",
        "Policy evaluation started",
        "GPU memory usage high",
        "Model checkpoint saved",
        "API request processed",
        "System health check passed",
        "Cache cleared successfully",
        "User authentication successful",
        "Background task completed",
      ]

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      }
    }

    // Initialize with some logs
    const initialLogs = Array.from({ length: 20 }, generateLog)
    setLogs(initialLogs)

    // Add new logs periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLogs((prev) => [generateLog(), ...prev.slice(0, 99)]) // Keep last 100 logs
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Filter logs
  useEffect(() => {
    let filtered = logs

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((log) => log.category === categoryFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, levelFilter, categoryFilter])

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "debug":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categories = ["all", ...Array.from(new Set(logs.map((log) => log.category)))]

  return (
    <div className="space-y-6">
      {/* Log Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Logs
          </CardTitle>
          <CardDescription>Real-time system and application logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Logs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="level-filter">Log Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Log Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{filteredLogs.length}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {filteredLogs.filter((log) => log.level === "error").length}
              </div>
              <div className="text-sm text-red-600">Errors</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {filteredLogs.filter((log) => log.level === "warning").length}
              </div>
              <div className="text-sm text-yellow-600">Warnings</div>
            </div>
            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {filteredLogs.filter((log) => log.level === "info").length}
              </div>
              <div className="text-sm text-blue-600">Info</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full border rounded-lg p-4">
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No logs match the current filters</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                    <Badge className={`text-xs ${getLevelColor(log.level)}`}>{log.level.toUpperCase()}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{log.message}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
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
