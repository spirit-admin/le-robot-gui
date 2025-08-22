"use client"

import type React from "react"

import { useState, useCallback } from "react"
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
import {
  Upload,
  X,
  FileText,
  ImageIcon,
  Video,
  Database,
  Tag,
  Globe,
  Lock,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"
import { uploadDataset, type DownloadProgress } from "@/lib/huggingface-api"

interface DatasetMetadata {
  name: string
  id: string
  description: string
  tags: string[]
  license: string
  private: boolean
  language: string
  task: string
  robotType: string
  environment: string
}

interface UploadFile {
  file: File
  type: "video" | "image" | "data" | "config"
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
}

export function DatasetUpload() {
  const [metadata, setMetadata] = useState<DatasetMetadata>({
    name: "",
    id: "",
    description: "",
    tags: [],
    license: "apache-2.0",
    private: false,
    language: "en",
    task: "imitation-learning",
    robotType: "",
    environment: "",
  })

  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploadProgress, setUploadProgress] = useState<DownloadProgress | null>(null)
  const [currentStep, setCurrentStep] = useState<"metadata" | "files" | "upload" | "complete">("metadata")
  const [newTag, setNewTag] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadFile[] = fileList.map((file) => ({
      file,
      type: getFileType(file),
      status: "pending",
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const getFileType = (file: File): UploadFile["type"] => {
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("image/")) return "image"
    if (file.name.endsWith(".json") || file.name.endsWith(".yaml")) return "config"
    return "data"
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
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
    if (!validateMetadata() || files.length === 0) return

    setCurrentStep("upload")

    try {
      await uploadDataset(
        metadata.id,
        files.map((f) => f.file),
        metadata,
        (progress) => setUploadProgress(progress),
      )
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

  const getFileIcon = (type: UploadFile["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "config":
        return <FileText className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (currentStep === "complete") {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-2xl font-bold mb-2">Dataset Uploaded Successfully!</h3>
          <p className="text-muted-foreground mb-6">
            Your dataset "{metadata.name}" has been uploaded to Hugging Face Hub
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep("metadata")
                setFiles([])
                setUploadProgress(null)
                setMetadata({
                  name: "",
                  id: "",
                  description: "",
                  tags: [],
                  license: "apache-2.0",
                  private: false,
                  language: "en",
                  task: "imitation-learning",
                  robotType: "",
                  environment: "",
                })
              }}
            >
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
          <h3 className="text-2xl font-bold mb-2">Uploading Dataset</h3>
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
            Upload Dataset to Hugging Face Hub
          </CardTitle>
          <CardDescription>Share your robotics dataset with the community</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${currentStep === "metadata" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "metadata" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                1
              </div>
              <span>Metadata</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div
              className={`flex items-center gap-2 ${currentStep === "files" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "files" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span>Files</span>
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

      {currentStep === "metadata" && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Metadata</CardTitle>
            <CardDescription>Provide information about your dataset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataset-name">Dataset Name *</Label>
                <Input
                  id="dataset-name"
                  placeholder="My Robot Dataset"
                  value={metadata.name}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dataset-id">Dataset ID *</Label>
                <Input
                  id="dataset-id"
                  placeholder="username/my-robot-dataset"
                  value={metadata.id}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, id: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your dataset, the task, robot used, and any important details..."
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
                  placeholder="Add tag (e.g., robotics, manipulation)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task">Task Type</Label>
                <Select
                  value={metadata.task}
                  onValueChange={(value) => setMetadata((prev) => ({ ...prev, task: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imitation-learning">Imitation Learning</SelectItem>
                    <SelectItem value="reinforcement-learning">Reinforcement Learning</SelectItem>
                    <SelectItem value="manipulation">Manipulation</SelectItem>
                    <SelectItem value="navigation">Navigation</SelectItem>
                    <SelectItem value="grasping">Grasping</SelectItem>
                    <SelectItem value="multi-task">Multi-task</SelectItem>
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
                    <SelectItem value="cc-by-sa-4.0">CC BY-SA 4.0</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="robot-type">Robot Type</Label>
                <Input
                  id="robot-type"
                  placeholder="e.g., ALOHA, xArm, Franka"
                  value={metadata.robotType}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, robotType: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Input
                  id="environment"
                  placeholder="e.g., Kitchen, Warehouse, Simulation"
                  value={metadata.environment}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, environment: e.target.value }))}
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
                Make this dataset private
              </Label>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep("files")} disabled={!validateMetadata()}>
                Next: Add Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "files" && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Files</CardTitle>
            <CardDescription>Upload your dataset files (videos, images, data files, configs)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports videos, images, JSON configs, and data files
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Uploaded Files ({files.length})</h4>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium">{file.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("metadata")}>
                Back
              </Button>
              <Button onClick={handleUpload} disabled={files.length === 0}>
                Upload Dataset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
