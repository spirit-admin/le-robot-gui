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
import { Separator } from "@/components/ui/separator"
import { Upload, Bot, CheckCircle, Loader2, Globe, Lock, Tag, Plus, X } from "lucide-react"
import { uploadModel, type DownloadProgress } from "@/lib/huggingface-api"

interface ModelMetadata {
  name: string
  id: string
  description: string
  tags: string[]
  license: string
  private: boolean
  modelType: string
  framework: string
  dataset: string
  performance: {
    successRate?: number
    averageReward?: number
    episodeLength?: number
  }
  hyperparameters: Record<string, any>
  trainingDetails: {
    epochs: number
    batchSize: number
    learningRate: number
    optimizer: string
  }
}

interface TrainedModel {
  id: string
  name: string
  type: string
  dataset: string
  performance: number
  size: string
  trainedAt: Date
  status: "ready" | "training" | "failed"
  checkpointPath: string
}

export function ModelUpload() {
  const [trainedModels] = useState<TrainedModel[]>([
    {
      id: "act_pusht_001",
      name: "ACT PushT Policy",
      type: "ACT",
      dataset: "lerobot/pusht",
      performance: 87.5,
      size: "245 MB",
      trainedAt: new Date(Date.now() - 3600000),
      status: "ready",
      checkpointPath: "/models/act_pusht_001/checkpoint.pth",
    },
    {
      id: "diffusion_aloha_002",
      name: "Diffusion ALOHA Coffee",
      type: "Diffusion Policy",
      dataset: "lerobot/aloha_static_coffee",
      performance: 92.3,
      size: "312 MB",
      trainedAt: new Date(Date.now() - 7200000),
      status: "ready",
      checkpointPath: "/models/diffusion_aloha_002/checkpoint.pth",
    },
    {
      id: "vqbet_xarm_003",
      name: "VQ-BeT XArm Lifting",
      type: "VQ-BeT",
      dataset: "lerobot/xarm_lift_medium",
      performance: 78.9,
      size: "189 MB",
      trainedAt: new Date(Date.now() - 10800000),
      status: "ready",
      checkpointPath: "/models/vqbet_xarm_003/checkpoint.pth",
    },
  ])

  const [selectedModel, setSelectedModel] = useState<TrainedModel | null>(null)
  const [metadata, setMetadata] = useState<ModelMetadata>({
    name: "",
    id: "",
    description: "",
    tags: [],
    license: "apache-2.0",
    private: false,
    modelType: "policy",
    framework: "pytorch",
    dataset: "",
    performance: {},
    hyperparameters: {},
    trainingDetails: {
      epochs: 0,
      batchSize: 0,
      learningRate: 0,
      optimizer: "",
    },
  })

  const [uploadProgress, setUploadProgress] = useState<DownloadProgress | null>(null)
  const [currentStep, setCurrentStep] = useState<"select" | "metadata" | "upload" | "complete">("select")
  const [newTag, setNewTag] = useState("")

  const selectModel = (model: TrainedModel) => {
    setSelectedModel(model)
    setMetadata((prev) => ({
      ...prev,
      name: model.name,
      id: `username/${model.name.toLowerCase().replace(/\s+/g, "-")}`,
      dataset: model.dataset,
      modelType: model.type.toLowerCase().replace(/\s+/g, "-"),
      performance: {
        successRate: model.performance,
      },
    }))
    setCurrentStep("metadata")
  }

  const addTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const validateMetadata = () => {
    return metadata.name && metadata.id && metadata.description && metadata.tags.length > 0
  }

  const handleUpload = async () => {
    if (!validateMetadata() || !selectedModel) return

    setCurrentStep("upload")

    try {
      // Mock file creation for upload
      const mockFiles = [
        new File(["model weights"], "model.safetensors", { type: "application/octet-stream" }),
        new File([JSON.stringify(metadata)], "config.json", { type: "application/json" }),
      ]

      await uploadModel(metadata.id, mockFiles, metadata, (progress) => setUploadProgress(progress))
      setCurrentStep("complete")
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadProgress({
        status: "error",
        progress: 0,
        message: "Upload failed. Please try again.",
      })
    }
  }

  const resetUpload = () => {
    setCurrentStep("select")
    setSelectedModel(null)
    setUploadProgress(null)
    setMetadata({
      name: "",
      id: "",
      description: "",
      tags: [],
      license: "apache-2.0",
      private: false,
      modelType: "policy",
      framework: "pytorch",
      dataset: "",
      performance: {},
      hyperparameters: {},
      trainingDetails: {
        epochs: 0,
        batchSize: 0,
        learningRate: 0,
        optimizer: "",
      },
    })
  }

  if (currentStep === "complete") {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-2xl font-bold mb-2">Model Uploaded Successfully!</h3>
          <p className="text-muted-foreground mb-6">
            Your model "{metadata.name}" has been uploaded to Hugging Face Hub
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetUpload}>
              Upload Another
            </Button>
            <Button>View on Hub</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "upload") {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-2xl font-bold mb-2">Uploading Model</h3>
          <p className="text-muted-foreground mb-6">{uploadProgress?.message || "Preparing upload..."}</p>
          {uploadProgress && (
            <div className="max-w-md mx-auto">
              <Progress value={uploadProgress.progress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">{uploadProgress.progress}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Model to Hugging Face Hub
          </CardTitle>
          <CardDescription>Share your trained policies with the robotics community</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${currentStep === "select" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "select" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                1
              </div>
              <span>Select Model</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div
              className={`flex items-center gap-2 ${currentStep === "metadata" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "metadata" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span>Metadata</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div
              className={`flex items-center gap-2 ${currentStep === "upload" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "upload" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                3
              </div>
              <span>Upload</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentStep === "select" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Trained Model</CardTitle>
            <CardDescription>Choose a model from your training history to upload</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {trainedModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => selectModel(model)}
                  >
                    <div className="flex items-center gap-3">
                      <Bot className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{model.type}</span>
                          <span>{model.dataset}</span>
                          <span>{model.size}</span>
                          <Badge variant="outline" className="text-xs">
                            {model.performance}% success
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {model.status}
                      </Badge>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {currentStep === "metadata" && selectedModel && (
        <Card>
          <CardHeader>
            <CardTitle>Model Metadata</CardTitle>
            <CardDescription>Provide information about your trained model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model-name">Model Name *</Label>
                <Input
                  id="model-name"
                  placeholder="My Robot Policy"
                  value={metadata.name}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="model-id">Model ID *</Label>
                <Input
                  id="model-id"
                  placeholder="username/my-robot-policy"
                  value={metadata.id}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, id: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your model, its capabilities, training process, and performance..."
                value={metadata.description}
                onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label>Tags *</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag (e.g., robotics, manipulation, act)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="model-type">Model Type</Label>
                <Select
                  value={metadata.modelType}
                  onValueChange={(value) => setMetadata((prev) => ({ ...prev, modelType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="value-function">Value Function</SelectItem>
                    <SelectItem value="world-model">World Model</SelectItem>
                    <SelectItem value="encoder">Encoder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="framework">Framework</Label>
                <Select
                  value={metadata.framework}
                  onValueChange={(value) => setMetadata((prev) => ({ ...prev, framework: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pytorch">PyTorch</SelectItem>
                    <SelectItem value="tensorflow">TensorFlow</SelectItem>
                    <SelectItem value="jax">JAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="license">License</Label>
                <Select
                  value={metadata.license}
                  onValueChange={(value) => setMetadata((prev) => ({ ...prev, license: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apache-2.0">Apache 2.0</SelectItem>
                    <SelectItem value="mit">MIT</SelectItem>
                    <SelectItem value="cc-by-4.0">CC BY 4.0</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="success-rate">Success Rate (%)</Label>
                <Input
                  id="success-rate"
                  type="number"
                  placeholder="87.5"
                  value={metadata.performance.successRate || ""}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      performance: { ...prev.performance, successRate: Number.parseFloat(e.target.value) },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="avg-reward">Average Reward</Label>
                <Input
                  id="avg-reward"
                  type="number"
                  placeholder="245.3"
                  value={metadata.performance.averageReward || ""}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      performance: { ...prev.performance, averageReward: Number.parseFloat(e.target.value) },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="episode-length">Avg Episode Length (s)</Label>
                <Input
                  id="episode-length"
                  type="number"
                  placeholder="45.2"
                  value={metadata.performance.episodeLength || ""}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      performance: { ...prev.performance, episodeLength: Number.parseFloat(e.target.value) },
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={metadata.private}
                onCheckedChange={(checked) => setMetadata((prev) => ({ ...prev, private: !!checked }))}
              />
              <Label htmlFor="private" className="flex items-center gap-2">
                {metadata.private ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                Make this model private
              </Label>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("select")}>
                Back
              </Button>
              <Button onClick={handleUpload} disabled={!validateMetadata()}>
                Upload Model
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
