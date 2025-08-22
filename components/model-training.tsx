"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Settings, BarChart3, Clock, Database, Upload } from "lucide-react"
import { TrainingConfig } from "./training-config"
import { TrainingMonitor } from "./training-monitor"
import { TrainingHistory } from "./training-history"
import { ModelSelector } from "./model-selector"
import { ModelUpload } from "./model-upload"

const mockDatasets = [
  {
    id: "lerobot/pusht",
    name: "PushT Environment",
    episodes: 1000,
    size: "2.3 GB",
    environment: "pusht",
    status: "ready",
  },
  {
    id: "lerobot/aloha_static_coffee",
    name: "ALOHA Coffee Making",
    episodes: 50,
    size: "1.1 GB",
    environment: "aloha",
    status: "ready",
  },
  {
    id: "lerobot/xarm_lift_medium",
    name: "XArm Lifting Task",
    episodes: 200,
    size: "890 MB",
    environment: "xarm",
    status: "ready",
  },
]

const mockModels = [
  {
    id: "act",
    name: "Action Chunking Transformer (ACT)",
    description: "Transformer-based policy for sequential action prediction",
    complexity: "Medium",
    recommendedFor: ["Bimanual manipulation", "Sequential tasks"],
  },
  {
    id: "diffusion_policy",
    name: "Diffusion Policy",
    description: "Diffusion model for generating smooth action trajectories",
    complexity: "High",
    recommendedFor: ["Continuous control", "Smooth trajectories"],
  },
  {
    id: "tdmpc",
    name: "Temporal Difference MPC",
    description: "Model predictive control with learned dynamics",
    complexity: "High",
    recommendedFor: ["Sample efficiency", "Model-based learning"],
  },
  {
    id: "vq_bet",
    name: "VQ-BeT",
    description: "Vector quantized behavior transformer",
    complexity: "Medium",
    recommendedFor: ["Discrete actions", "Behavior cloning"],
  },
]

export function ModelTraining() {
  const [selectedDataset, setSelectedDataset] = useState(mockDatasets[0])
  const [selectedModel, setSelectedModel] = useState(mockModels[0])
  const [activeTab, setActiveTab] = useState("config")
  const [isTraining, setIsTraining] = useState(false)

  const handleStartTraining = () => {
    setIsTraining(true)
    setActiveTab("monitor")
    // Simulate training completion after 10 seconds for demo
    setTimeout(() => {
      setIsTraining(false)
    }, 10000)
  }

  return (
    <div className="space-y-6">
      {/* Training Setup Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Model Training
              </CardTitle>
              <CardDescription>Train new policies using state-of-the-art algorithms</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataset-select">Training Dataset</Label>
              <Select
                value={selectedDataset.id}
                onValueChange={(value) => {
                  const dataset = mockDatasets.find((d) => d.id === value)
                  if (dataset) setSelectedDataset(dataset)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockDatasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>{dataset.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {dataset.episodes} episodes
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model-select">Model Architecture</Label>
              <Select
                value={selectedModel.id}
                onValueChange={(value) => {
                  const model = mockModels.find((m) => m.id === value)
                  if (model) setSelectedModel(model)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.complexity}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset & Model Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dataset Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{selectedDataset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Episodes</span>
                <span className="text-sm font-medium">{selectedDataset.episodes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Size</span>
                <span className="text-sm font-medium">{selectedDataset.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Environment</span>
                <Badge variant="outline">{selectedDataset.environment}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Model Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">{selectedModel.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Complexity</span>
                <Badge variant="outline">{selectedModel.complexity}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Recommended for:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedModel.recommendedFor.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Training Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2" disabled={!isTraining}>
            <Clock className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <TrainingConfig
            dataset={selectedDataset}
            model={selectedModel}
            onStartTraining={handleStartTraining}
            isTraining={isTraining}
          />
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <ModelSelector models={mockModels} selectedModel={selectedModel} onSelectModel={setSelectedModel} />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <TrainingMonitor model={selectedModel} dataset={selectedDataset} isTraining={isTraining} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <TrainingHistory />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <ModelUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
