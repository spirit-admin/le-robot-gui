"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Camera, Activity, Target } from "lucide-react"

interface EpisodeViewerProps {
  dataset: {
    id: string
    name: string
    episodes: number
  }
}

export function EpisodeViewer({ dataset }: EpisodeViewerProps) {
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const maxFrames = 250 // Mock frame count
  const frameRate = 10

  const mockObservations = {
    robot_state: [0.1, 0.2, -0.3, 0.4, -0.1, 0.2, 0.0],
    gripper_state: [0.8],
    camera_feeds: ["cam_high", "cam_low"],
  }

  const mockActions = [0.05, -0.1, 0.2, -0.05, 0.1, -0.2, 0.0]

  return (
    <div className="space-y-6">
      {/* Episode Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Episode Viewer
          </CardTitle>
          <CardDescription>Visualize robot demonstrations frame by frame</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="episode-select">Episode</Label>
              <Select
                value={currentEpisode.toString()}
                onValueChange={(value) => setCurrentEpisode(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(dataset.episodes, 10) }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      Episode {i.toString().padStart(3, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="speed-select">Playback Speed</Label>
              <Select
                value={playbackSpeed.toString()}
                onValueChange={(value) => setPlaybackSpeed(Number.parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.25">0.25x</SelectItem>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentFrame(Math.max(0, currentFrame - 10))}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant={isPlaying ? "secondary" : "default"} size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentFrame(Math.min(maxFrames - 1, currentFrame + 10))}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentFrame(0)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Frame Slider */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Frame {currentFrame}</span>
              <span>Time: {(currentFrame / frameRate).toFixed(2)}s</span>
              <span>Total: {maxFrames} frames</span>
            </div>
            <Slider
              value={[currentFrame]}
              onValueChange={(value) => setCurrentFrame(value[0])}
              max={maxFrames - 1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feeds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Feeds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockObservations.camera_feeds.map((camera, index) => (
                <div key={camera} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{camera}</Label>
                    <Badge variant="outline">640x480</Badge>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera feed placeholder</p>
                      <p className="text-xs">Frame {currentFrame}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Robot State & Actions */}
        <div className="space-y-6">
          {/* Robot State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Robot State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Joint Positions</Label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {mockObservations.robot_state.map((value, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-muted-foreground">J{index + 1}</div>
                        <div className="text-sm font-mono bg-muted px-2 py-1 rounded">{value.toFixed(3)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Gripper State</Label>
                  <div className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                    {mockObservations.gripper_state[0].toFixed(3)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium">Action Vector</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {mockActions.map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground">A{index + 1}</div>
                      <div className="text-sm font-mono bg-accent/10 px-2 py-1 rounded">{value.toFixed(3)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
