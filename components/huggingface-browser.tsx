"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Download, Heart, Calendar, Database, Bot, Tag, HardDrive, ExternalLink, Loader2 } from "lucide-react"
import {
  searchDatasets,
  searchModels,
  downloadDataset,
  type HFDataset,
  type HFModel,
  type DownloadProgress,
} from "@/lib/huggingface-api"

export function HuggingFaceBrowser() {
  const [activeTab, setActiveTab] = useState("datasets")
  const [searchQuery, setSearchQuery] = useState("")
  const [datasets, setDatasets] = useState<HFDataset[]>([])
  const [models, setModels] = useState<HFModel[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadProgress>>({})

  useEffect(() => {
    handleSearch()
  }, [activeTab])

  const handleSearch = async () => {
    setLoading(true)
    try {
      if (activeTab === "datasets") {
        const results = await searchDatasets(searchQuery)
        setDatasets(results)
      } else {
        const results = await searchModels(searchQuery)
        setModels(results)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (id: string) => {
    setDownloadProgress((prev) => ({
      ...prev,
      [id]: { status: "downloading", progress: 0, message: "Starting download..." },
    }))

    try {
      await downloadDataset(id, (progress) => {
        setDownloadProgress((prev) => ({
          ...prev,
          [id]: progress,
        }))
      })
    } catch (error) {
      setDownloadProgress((prev) => ({
        ...prev,
        [id]: { status: "error", progress: 0, message: "Download failed" },
      }))
    }
  }

  const DatasetCard = ({ dataset }: { dataset: HFDataset }) => {
    const progress = downloadProgress[dataset.id]
    const isDownloading = progress?.status === "downloading"
    const isCompleted = progress?.status === "completed"

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-4 w-4" />
                {dataset.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">{dataset.id}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleDownload(dataset.id)} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                "Downloaded"
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{dataset.description}</p>

          {progress && (
            <div className="space-y-2">
              <Progress value={progress.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{progress.message}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {dataset.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {dataset.downloads.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {dataset.likes}
              </span>
              {dataset.size && (
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  {dataset.size}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dataset.lastModified}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ModelCard = ({ model }: { model: HFModel }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-4 w-4" />
              {model.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">{model.id}</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{model.description}</p>

        <div className="flex flex-wrap gap-1">
          {model.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {model.downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {model.likes}
            </span>
            {model.size && (
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {model.size}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {model.lastModified}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Hugging Face Hub Browser
          </CardTitle>
          <CardDescription>Browse and download datasets and models from the LeRobot community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="hf-search">Search Hub</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hf-search"
                  placeholder="Search datasets and models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading} className="mt-6">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="datasets" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datasets ({datasets.length})
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Models ({models.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
              {datasets.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No datasets found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
              {models.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No models found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
