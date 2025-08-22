"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Pause, Play, X, CheckCircle, AlertCircle, Clock, Trash2 } from "lucide-react"
import type { DownloadProgress } from "@/lib/huggingface-api"

interface DownloadItem {
  id: string
  name: string
  type: "dataset" | "model"
  size: string
  progress: DownloadProgress
  startTime: Date
  estimatedTime?: string
  downloadSpeed?: string
}

export function DownloadManager() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: "lerobot/pusht",
      name: "PushT Environment",
      type: "dataset",
      size: "2.3 GB",
      progress: { status: "downloading", progress: 65, message: "Downloading dataset files..." },
      startTime: new Date(Date.now() - 120000),
      estimatedTime: "2 min remaining",
      downloadSpeed: "15.2 MB/s",
    },
    {
      id: "lerobot/aloha_static_coffee",
      name: "ALOHA Coffee Making",
      type: "dataset",
      size: "1.1 GB",
      progress: { status: "completed", progress: 100, message: "Download completed!" },
      startTime: new Date(Date.now() - 300000),
    },
    {
      id: "lerobot/diffusion_pusht",
      name: "Diffusion Policy PushT",
      type: "model",
      size: "312 MB",
      progress: { status: "error", progress: 0, message: "Download failed: Network error" },
      startTime: new Date(Date.now() - 60000),
    },
  ])

  const [showCompleted, setShowCompleted] = useState(true)

  const activeDownloads = downloads.filter((d) => d.progress.status === "downloading")
  const completedDownloads = downloads.filter((d) => d.progress.status === "completed")
  const failedDownloads = downloads.filter((d) => d.progress.status === "error")

  const pauseDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, progress: { ...d.progress, status: "idle" as const, message: "Download paused" } } : d,
      ),
    )
  }

  const resumeDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, progress: { ...d.progress, status: "downloading" as const, message: "Resuming download..." } }
          : d,
      ),
    )
  }

  const cancelDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id))
  }

  const retryDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, progress: { status: "downloading", progress: 0, message: "Retrying download..." } } : d,
      ),
    )
  }

  const clearCompleted = () => {
    setDownloads((prev) => prev.filter((d) => d.progress.status !== "completed"))
  }

  const getStatusIcon = (status: DownloadProgress["status"]) => {
    switch (status) {
      case "downloading":
        return <Download className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "idle":
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatElapsedTime = (startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const DownloadCard = ({ download }: { download: DownloadItem }) => (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {getStatusIcon(download.progress.status)}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{download.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {download.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{download.id}</p>
              <p className="text-xs text-muted-foreground mt-1">{download.progress.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{download.size}</span>
            <div className="flex gap-1">
              {download.progress.status === "downloading" && (
                <Button variant="ghost" size="sm" onClick={() => pauseDownload(download.id)}>
                  <Pause className="h-3 w-3" />
                </Button>
              )}
              {download.progress.status === "idle" && (
                <Button variant="ghost" size="sm" onClick={() => resumeDownload(download.id)}>
                  <Play className="h-3 w-3" />
                </Button>
              )}
              {download.progress.status === "error" && (
                <Button variant="ghost" size="sm" onClick={() => retryDownload(download.id)}>
                  <Play className="h-3 w-3" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => cancelDownload(download.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {download.progress.status !== "idle" && (
          <div className="space-y-2">
            <Progress value={download.progress.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{download.progress.progress}%</span>
              <div className="flex gap-4">
                {download.downloadSpeed && <span>{download.downloadSpeed}</span>}
                {download.estimatedTime && <span>{download.estimatedTime}</span>}
                <span>Elapsed: {formatElapsedTime(download.startTime)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Manager
              </CardTitle>
              <CardDescription>Manage your dataset and model downloads</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearCompleted}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Completed
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Download Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{activeDownloads.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{completedDownloads.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{failedDownloads.length}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{downloads.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Downloads */}
      {activeDownloads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              {activeDownloads.map((download) => (
                <DownloadCard key={download.id} download={download} />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Failed Downloads */}
      {failedDownloads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-500">Failed Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-64">
              {failedDownloads.map((download) => (
                <DownloadCard key={download.id} download={download} />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Completed Downloads */}
      {completedDownloads.length > 0 && showCompleted && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-green-500">Completed Downloads</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-64">
              {completedDownloads.map((download) => (
                <DownloadCard key={download.id} download={download} />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {downloads.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No downloads yet</p>
            <p className="text-sm text-muted-foreground mt-2">Start downloading datasets and models from the Hub tab</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
