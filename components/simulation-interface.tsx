"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Maximize,
  Minimize,
  Cpu,
  MemoryStick,
  Zap,
  Timer,
  Target,
  Activity,
  Camera,
  Bot,
  Layers,
  Grid3X3,
  Compass,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SimulationInterfaceProps {
  className?: string
}

export function SimulationInterface({ className }: SimulationInterfaceProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [simulationTime, setSimulationTime] = useState(0)
  const [fps, setFps] = useState(60)
  const [selectedRobot, setSelectedRobot] = useState("so-arm-100")
  const [selectedEnvironment, setSelectedEnvironment] = useState("genesis")
  const [viewMode, setViewMode] = useState("solid")
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulation metrics
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    gpuUsage: 78,
    frameTime: 16.7,
    physicsSteps: 240,
    collisions: 0,
  })

  // Robot state
  const [robotState, setRobotState] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    jointPositions: [0, -0.5, 1.2, -0.7, 0, 0],
    endEffectorPos: [0.3, 0.2, 0.4],
    gripperState: 0.5,
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSimulationTime((prev) => prev + 0.1)
        // Simulate changing metrics
        setMetrics((prev) => ({
          ...prev,
          cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5)),
          gpuUsage: Math.max(40, Math.min(100, prev.gpuUsage + (Math.random() - 0.5) * 15)),
          frameTime: Math.max(8, Math.min(33, prev.frameTime + (Math.random() - 0.5) * 2)),
        }))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused])

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setSimulationTime(0)
  }

  const handleReset = () => {
    setSimulationTime(0)
    setRobotState({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      jointPositions: [0, -0.5, 1.2, -0.7, 0, 0],
      endEffectorPos: [0.3, 0.2, 0.4],
      gripperState: 0.5,
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header Controls */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Robotics Simulation
              </CardTitle>
              <CardDescription>Train and test policies in virtual environments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isRunning ? "default" : "secondary"} className="bg-primary">
                {isRunning ? (isPaused ? "Paused" : "Running") : "Stopped"}
              </Badge>
              <Badge variant="outline">{simulationTime.toFixed(1)}s</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStart}
                disabled={isRunning && !isPaused}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
              <Button onClick={handlePause} disabled={!isRunning} variant="outline" size="sm">
                {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button onClick={handleStop} disabled={!isRunning} variant="outline" size="sm">
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">{fps} FPS</span>
              </div>
              <Button onClick={() => setIsFullscreen(!isFullscreen)} variant="outline" size="sm">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Simulation View */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  3D Simulation View
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="wireframe">Wireframe</SelectItem>
                      <SelectItem value="textured">Textured</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                    <Grid3X3 className={cn("h-4 w-4", showGrid && "text-primary")} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAxes(!showAxes)}>
                    <Compass className={cn("h-4 w-4", showAxes && "text-primary")} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden"
                style={{ height: "500px" }}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
                />
                {/* Simulation Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Genesis Simulation Engine</h3>
                    <p className="text-muted-foreground mb-4">3D robotics simulation environment</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Robot: {selectedRobot.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />
                        Environment: {selectedEnvironment}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Performance Overlay */}
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-3 w-3 text-chart-1" />
                    <span>FPS: {fps}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="h-3 w-3 text-chart-2" />
                    <span>CPU: {metrics.cpuUsage.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-3 w-3 text-chart-3" />
                    <span>GPU: {metrics.gpuUsage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="robot" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="robot">Robot</TabsTrigger>
              <TabsTrigger value="env">Environment</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="robot" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Robot Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs">Robot Model</Label>
                    <Select value={selectedRobot} onValueChange={setSelectedRobot}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="so-arm-100">SO-ARM-100</SelectItem>
                        <SelectItem value="so-arm-101">SO-ARM-101</SelectItem>
                        <SelectItem value="franka-panda">Franka Panda</SelectItem>
                        <SelectItem value="ur5">UR5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs mb-2 block">Joint Positions</Label>
                    <div className="space-y-2">
                      {robotState.jointPositions.map((pos, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs w-8">J{idx + 1}</span>
                          <Slider
                            value={[pos]}
                            onValueChange={(value) => {
                              const newPositions = [...robotState.jointPositions]
                              newPositions[idx] = value[0]
                              setRobotState((prev) => ({ ...prev, jointPositions: newPositions }))
                            }}
                            min={-3.14}
                            max={3.14}
                            step={0.01}
                            className="flex-1"
                          />
                          <span className="text-xs w-12 font-mono">{pos.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs mb-2 block">Gripper</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Closed</span>
                      <Slider
                        value={[robotState.gripperState]}
                        onValueChange={(value) => setRobotState((prev) => ({ ...prev, gripperState: value[0] }))}
                        min={0}
                        max={1}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-xs">Open</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="env" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Environment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs">Physics Engine</Label>
                    <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genesis">Genesis</SelectItem>
                        <SelectItem value="pybullet">PyBullet</SelectItem>
                        <SelectItem value="gazebo">Gazebo</SelectItem>
                        <SelectItem value="isaac-sim">Isaac Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Grid</Label>
                      <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Axes</Label>
                      <Switch checked={showAxes} onCheckedChange={setShowAxes} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs mb-2 block">Gravity (m/s²)</Label>
                    <Input type="number" defaultValue="-9.81" className="text-xs" />
                  </div>

                  <div>
                    <Label className="text-xs mb-2 block">Time Step (ms)</Label>
                    <Slider defaultValue={[16.7]} min={1} max={50} step={0.1} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          CPU Usage
                        </span>
                        <span className="text-xs font-mono">{metrics.cpuUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={metrics.cpuUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs flex items-center gap-1">
                          <MemoryStick className="h-3 w-3" />
                          Memory
                        </span>
                        <span className="text-xs font-mono">{metrics.memoryUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={metrics.memoryUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          GPU Usage
                        </span>
                        <span className="text-xs font-mono">{metrics.gpuUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={metrics.gpuUsage} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Frame Time</div>
                      <div className="font-mono">{metrics.frameTime.toFixed(1)}ms</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Physics Steps</div>
                      <div className="font-mono">{metrics.physicsSteps}</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Collisions</div>
                      <div className="font-mono">{metrics.collisions}</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Sim Time</div>
                      <div className="font-mono">{simulationTime.toFixed(1)}s</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
