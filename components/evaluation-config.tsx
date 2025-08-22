"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Play, Cpu, Clock, Target } from "lucide-react"

interface EvaluationConfigProps {
  policy: {
    id: string
    name: string
    environment: string
  }
  onStartEvaluation: () => void
}

export function EvaluationConfig({ policy, onStartEvaluation }: EvaluationConfigProps) {
  const [config, setConfig] = useState({
    episodes: 100,
    batchSize: 10,
    device: "cuda",
    useAmp: false,
    seed: 42,
    maxSteps: 1000,
    renderMode: "rgb_array",
    saveVideos: true,
    parallelEnvs: 4,
  })

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const estimatedTime = Math.ceil((config.episodes * config.maxSteps) / (config.batchSize * config.parallelEnvs * 10))

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Evaluation Configuration
          </CardTitle>
          <CardDescription>Configure parameters for policy evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{config.episodes}</div>
              <div className="text-sm text-muted-foreground">Episodes</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{config.batchSize}</div>
              <div className="text-sm text-muted-foreground">Batch Size</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{config.parallelEnvs}</div>
              <div className="text-sm text-muted-foreground">Parallel Envs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">~{estimatedTime}min</div>
              <div className="text-sm text-muted-foreground">Est. Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Evaluation Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="episodes">Number of Episodes</Label>
              <div className="mt-2">
                <Slider
                  value={[config.episodes]}
                  onValueChange={(value) => handleConfigChange("episodes", value[0])}
                  max={1000}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10</span>
                  <span>{config.episodes}</span>
                  <span>1000</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="batch-size">Batch Size</Label>
              <Select
                value={config.batchSize.toString()}
                onValueChange={(value) => handleConfigChange("batchSize", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max-steps">Max Steps per Episode</Label>
              <Input
                id="max-steps"
                type="number"
                value={config.maxSteps}
                onChange={(e) => handleConfigChange("maxSteps", Number.parseInt(e.target.value))}
                min={100}
                max={10000}
              />
            </div>

            <div>
              <Label htmlFor="seed">Random Seed</Label>
              <Input
                id="seed"
                type="number"
                value={config.seed}
                onChange={(e) => handleConfigChange("seed", Number.parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="device">Compute Device</Label>
              <Select value={config.device} onValueChange={(value) => handleConfigChange("device", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cuda">CUDA (GPU)</SelectItem>
                  <SelectItem value="cpu">CPU</SelectItem>
                  <SelectItem value="mps">MPS (Apple Silicon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parallel-envs">Parallel Environments</Label>
              <Select
                value={config.parallelEnvs.toString()}
                onValueChange={(value) => handleConfigChange("parallelEnvs", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="use-amp">Use Automatic Mixed Precision</Label>
              <Switch
                id="use-amp"
                checked={config.useAmp}
                onCheckedChange={(checked) => handleConfigChange("useAmp", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="save-videos">Save Evaluation Videos</Label>
              <Switch
                id="save-videos"
                checked={config.saveVideos}
                onCheckedChange={(checked) => handleConfigChange("saveVideos", checked)}
              />
            </div>

            <div>
              <Label htmlFor="render-mode">Render Mode</Label>
              <Select value={config.renderMode} onValueChange={(value) => handleConfigChange("renderMode", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rgb_array">RGB Array</SelectItem>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Command Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Command Preview
          </CardTitle>
          <CardDescription>Generated LeRobot evaluation command</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-muted-foreground mb-2"># LeRobot evaluation command:</div>
            <div className="whitespace-nowrap">
              lerobot-eval \<br />
              &nbsp;&nbsp;--policy.path={policy.id} \<br />
              &nbsp;&nbsp;--env.type={policy.environment} \<br />
              &nbsp;&nbsp;--eval.batch_size={config.batchSize} \<br />
              &nbsp;&nbsp;--eval.n_episodes={config.episodes} \<br />
              &nbsp;&nbsp;--policy.use_amp={config.useAmp.toString()} \<br />
              &nbsp;&nbsp;--policy.device={config.device} \<br />
              &nbsp;&nbsp;--eval.seed={config.seed}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Evaluation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ready to Start Evaluation</h3>
              <p className="text-sm text-muted-foreground">Estimated completion time: ~{estimatedTime} minutes</p>
            </div>
            <Button onClick={onStartEvaluation} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Evaluation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
