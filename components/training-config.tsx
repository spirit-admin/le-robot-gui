"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Play, Cpu, Clock, Target, Zap } from "lucide-react"

interface TrainingConfigProps {
  dataset: {
    id: string
    name: string
    episodes: number
  }
  model: {
    id: string
    name: string
  }
  onStartTraining: () => void
  isTraining: boolean
}

export function TrainingConfig({ dataset, model, onStartTraining, isTraining }: TrainingConfigProps) {
  const [config, setConfig] = useState({
    epochs: 100,
    batchSize: 32,
    learningRate: 0.0001,
    device: "cuda",
    useWandb: true,
    saveCheckpoints: true,
    checkpointFreq: 10,
    evalFreq: 5,
    seed: 42,
    numWorkers: 4,
    mixedPrecision: true,
    gradientClipping: 1.0,
    warmupSteps: 1000,
    outputDir: "outputs/train",
    experimentName: "",
  })

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const estimatedTime = Math.ceil((config.epochs * dataset.episodes) / (config.batchSize * 60)) // rough estimate in hours

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Training Configuration
          </CardTitle>
          <CardDescription>Configure hyperparameters and training settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{config.epochs}</div>
              <div className="text-sm text-muted-foreground">Epochs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{config.batchSize}</div>
              <div className="text-sm text-muted-foreground">Batch Size</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{config.learningRate}</div>
              <div className="text-sm text-muted-foreground">Learning Rate</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">~{estimatedTime}h</div>
              <div className="text-sm text-muted-foreground">Est. Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Training Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="epochs">Number of Epochs</Label>
              <div className="mt-2">
                <Slider
                  value={[config.epochs]}
                  onValueChange={(value) => handleConfigChange("epochs", value[0])}
                  max={500}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10</span>
                  <span>{config.epochs}</span>
                  <span>500</span>
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
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="64">64</SelectItem>
                  <SelectItem value="128">128</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="learning-rate">Learning Rate</Label>
              <Input
                id="learning-rate"
                type="number"
                step="0.00001"
                value={config.learningRate}
                onChange={(e) => handleConfigChange("learningRate", Number.parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="gradient-clipping">Gradient Clipping</Label>
              <Input
                id="gradient-clipping"
                type="number"
                step="0.1"
                value={config.gradientClipping}
                onChange={(e) => handleConfigChange("gradientClipping", Number.parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="warmup-steps">Warmup Steps</Label>
              <Input
                id="warmup-steps"
                type="number"
                value={config.warmupSteps}
                onChange={(e) => handleConfigChange("warmupSteps", Number.parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
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
              <Label htmlFor="num-workers">Data Loader Workers</Label>
              <Select
                value={config.numWorkers.toString()}
                onValueChange={(value) => handleConfigChange("numWorkers", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mixed-precision">Mixed Precision Training</Label>
              <Switch
                id="mixed-precision"
                checked={config.mixedPrecision}
                onCheckedChange={(checked) => handleConfigChange("mixedPrecision", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="use-wandb">Enable Weights & Biases</Label>
              <Switch
                id="use-wandb"
                checked={config.useWandb}
                onCheckedChange={(checked) => handleConfigChange("useWandb", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="save-checkpoints">Save Checkpoints</Label>
              <Switch
                id="save-checkpoints"
                checked={config.saveCheckpoints}
                onCheckedChange={(checked) => handleConfigChange("saveCheckpoints", checked)}
              />
            </div>

            <div>
              <Label htmlFor="checkpoint-freq">Checkpoint Frequency (epochs)</Label>
              <Input
                id="checkpoint-freq"
                type="number"
                value={config.checkpointFreq}
                onChange={(e) => handleConfigChange("checkpointFreq", Number.parseInt(e.target.value))}
                disabled={!config.saveCheckpoints}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experiment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Experiment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="experiment-name">Experiment Name</Label>
            <Input
              id="experiment-name"
              placeholder="my_training_experiment"
              value={config.experimentName}
              onChange={(e) => handleConfigChange("experimentName", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="output-dir">Output Directory</Label>
            <Input
              id="output-dir"
              value={config.outputDir}
              onChange={(e) => handleConfigChange("outputDir", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eval-freq">Evaluation Frequency (epochs)</Label>
              <Input
                id="eval-freq"
                type="number"
                value={config.evalFreq}
                onChange={(e) => handleConfigChange("evalFreq", Number.parseInt(e.target.value))}
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
          </div>
        </CardContent>
      </Card>

      {/* Command Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Command Preview
          </CardTitle>
          <CardDescription>Generated LeRobot training command</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-muted-foreground mb-2"># LeRobot training command:</div>
            <div className="whitespace-nowrap">
              lerobot-train \<br />
              &nbsp;&nbsp;--config-name={model.id} \<br />
              &nbsp;&nbsp;--dataset-repo-id={dataset.id} \<br />
              &nbsp;&nbsp;--training.offline_steps={config.epochs * Math.floor(dataset.episodes / config.batchSize)} \
              <br />
              &nbsp;&nbsp;--training.batch_size={config.batchSize} \<br />
              &nbsp;&nbsp;--training.lr={config.learningRate} \<br />
              &nbsp;&nbsp;--device={config.device} \<br />
              &nbsp;&nbsp;--wandb.enable={config.useWandb.toString()} \<br />
              &nbsp;&nbsp;--training.seed={config.seed}
              {config.experimentName && (
                <>
                  \<br />
                  &nbsp;&nbsp;--wandb.project={config.experimentName}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Training */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ready to Start Training</h3>
              <p className="text-sm text-muted-foreground">
                Estimated completion time: ~{estimatedTime} hours • {config.epochs} epochs • {dataset.episodes} episodes
              </p>
            </div>
            <Button onClick={onStartTraining} disabled={isTraining} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isTraining ? "Training..." : "Start Training"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
