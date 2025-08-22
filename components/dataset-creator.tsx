"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Video, Settings, Square, CheckCircle, Loader2, Database } from "lucide-react"

interface RecordingSession {
  id: string
  name: string
  duration: string
  episodes: number
  status: "recording" | "stopped" | "processing" | "completed"
  robotType: string
  task: string
  startTime: Date
}

interface DatasetCreationConfig {
  name: string
  description: string
  outputPath: string
  fps: number
  compression: "none" | "h264" | "h265"
  includeDepth: boolean
  includeAudio: boolean
  episodeLength: number
  autoSplit: boolean
}

export function DatasetCreator() {
  const [recordings, setRecordings] = useState<RecordingSession[]>([
    {
      id: "rec_001",
      name: "Kitchen Manipulation Session",
      duration: "45:32",
      episodes: 12,
      status: "completed",
      robotType: "ALOHA",
      task: "coffee_making",
      startTime: new Date(Date.now() - 3600000),
    },
    {
      id: "rec_002",
      name: "Object Grasping Practice",
      duration: "23:15",
      episodes: 8,
      status: "processing",
      robotType: "xArm",
      task: "grasping",
      startTime: new Date(Date.now() - 1800000),
    },
  ])

  const [config, setConfig] = useState<DatasetCreationConfig>({
    name: "",
    description: "",
    outputPath: "/datasets/custom/",
    fps: 30,
    compression: "h264",
    includeDepth: true,
    includeAudio: false,
    episodeLength: 60,
    autoSplit: true,
  })

  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([])
  const [creationProgress, setCreationProgress] = useState<number>(0)
  const [isCreating, setIsCreating] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const startRecording = () => {
    const newRecording: RecordingSession = {
      id: `rec_${Date.now()}`,
      name: `Recording Session ${recordings.length + 1}`,
      duration: "00:00",
      episodes: 0,
      status: "recording",
      robotType: "Unknown",
      task: "general",
      startTime: new Date(),
    }
    setRecordings((prev) => [newRecording, ...prev])
  }

  const stopRecording = (id: string) => {
    setRecordings((prev) => prev.map((rec) => (rec.id === id ? { ...rec, status: "stopped" as const } : rec)))
  }

  const createDataset = async () => {
    if (selectedRecordings.length === 0) return

    setIsCreating(true)
    setCreationProgress(0)

    // Simulate dataset creation process
    const steps = [
      "Analyzing recordings...",
      "Processing video files...",
      "Extracting robot states...",
      "Generating metadata...",
      "Creating dataset structure...",
      "Finalizing dataset...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCreationProgress(((i + 1) / steps.length) * 100)
    }

    setIsCreating(false)
    setSelectedRecordings([])
  }

  const getStatusColor = (status: RecordingSession["status"]) => {
    switch (status) {
      case "recording":
        return "text-red-500"
      case "stopped":
        return "text-yellow-500"
      case "processing":
        return "text-blue-500"
      case "completed":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: RecordingSession["status"]) => {
    switch (status) {
      case "recording":
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      case "stopped":
        return <Square className="h-4 w-4 text-yellow-500" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Dataset Creator
              </CardTitle>
              <CardDescription>Create datasets from robot recordings and demonstrations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Dataset Creation Configuration</DialogTitle>
                    <DialogDescription>Configure how your dataset will be created</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dataset-name">Dataset Name</Label>
                        <Input
                          id="dataset-name"
                          value={config.name}
                          onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="output-path">Output Path</Label>
                        <Input
                          id="output-path"
                          value={config.outputPath}
                          onChange={(e) => setConfig((prev) => ({ ...prev, outputPath: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={config.description}
                        onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="fps">Frame Rate (FPS)</Label>
                        <Input
                          id="fps"
                          type="number"
                          value={config.fps}
                          onChange={(e) => setConfig((prev) => ({ ...prev, fps: Number.parseInt(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="compression">Video Compression</Label>
                        <Select
                          value={config.compression}
                          onValueChange={(value: any) => setConfig((prev) => ({ ...prev, compression: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="h264">H.264</SelectItem>
                            <SelectItem value="h265">H.265</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="episode-length">Episode Length (s)</Label>
                        <Input
                          id="episode-length"
                          type="number"
                          value={config.episodeLength}
                          onChange={(e) =>
                            setConfig((prev) => ({ ...prev, episodeLength: Number.parseInt(e.target.value) }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-depth"
                          checked={config.includeDepth}
                          onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, includeDepth: !!checked }))}
                        />
                        <Label htmlFor="include-depth">Include depth information</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-audio"
                          checked={config.includeAudio}
                          onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, includeAudio: !!checked }))}
                        />
                        <Label htmlFor="include-audio">Include audio recordings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="auto-split"
                          checked={config.autoSplit}
                          onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, autoSplit: !!checked }))}
                        />
                        <Label htmlFor="auto-split">Automatically split long recordings</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowConfig(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowConfig(false)}>Save Configuration</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={startRecording}>
                <Video className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Recording Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recording Sessions</CardTitle>
          <CardDescription>Manage your robot recording sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedRecordings.includes(recording.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecordings((prev) => [...prev, recording.id])
                        } else {
                          setSelectedRecordings((prev) => prev.filter((id) => id !== recording.id))
                        }
                      }}
                      disabled={recording.status === "recording" || recording.status === "processing"}
                    />
                    {getStatusIcon(recording.status)}
                    <div>
                      <h4 className="font-medium">{recording.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{recording.duration}</span>
                        <span>{recording.episodes} episodes</span>
                        <span>{recording.robotType}</span>
                        <Badge variant="outline" className="text-xs">
                          {recording.task}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(recording.status)}`}>
                      {recording.status}
                    </Badge>
                    {recording.status === "recording" && (
                      <Button variant="ghost" size="sm" onClick={() => stopRecording(recording.id)}>
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dataset Creation */}
      {selectedRecordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Dataset</CardTitle>
            <CardDescription>
              Convert {selectedRecordings.length} selected recording{selectedRecordings.length > 1 ? "s" : ""} into a
              dataset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCreating ? (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <h3 className="text-lg font-medium mb-2">Creating Dataset</h3>
                <Progress value={creationProgress} className="max-w-md mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{creationProgress.toFixed(0)}% complete</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quick-name">Dataset Name</Label>
                    <Input
                      id="quick-name"
                      placeholder="My Robot Dataset"
                      value={config.name}
                      onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quick-path">Output Path</Label>
                    <Input
                      id="quick-path"
                      value={config.outputPath}
                      onChange={(e) => setConfig((prev) => ({ ...prev, outputPath: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Total episodes:{" "}
                    {recordings
                      .filter((r) => selectedRecordings.includes(r.id))
                      .reduce((acc, r) => acc + r.episodes, 0)}
                  </div>
                  <Button onClick={createDataset} disabled={!config.name}>
                    <Database className="h-4 w-4 mr-2" />
                    Create Dataset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {recordings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Recording Sessions</h3>
            <p className="text-muted-foreground mb-4">Start recording robot demonstrations to create datasets</p>
            <Button onClick={startRecording}>
              <Video className="h-4 w-4 mr-2" />
              Start Your First Recording
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
