"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Play, Download, Search, Filter, BarChart3, Eye, Settings, Upload } from "lucide-react"
import { DatasetStats } from "./dataset-stats"
import { EpisodeViewer } from "./episode-viewer"
import { DatasetBrowser } from "./dataset-browser"
import { HuggingFaceBrowser } from "./huggingface-browser"
import { DownloadManager } from "./download-manager"
import { LocalDatasets } from "./local-datasets"
import { DatasetUpload } from "./dataset-upload"

const mockDatasets = [
  {
    id: "lerobot/pusht",
    name: "PushT Environment",
    episodes: 1000,
    size: "2.3 GB",
    fps: 10,
    duration: "2.5 hours",
    status: "ready",
    description: "2D pushing task with block manipulation",
  },
  {
    id: "lerobot/aloha_static_coffee",
    name: "ALOHA Coffee Making",
    episodes: 50,
    size: "1.1 GB",
    fps: 30,
    duration: "45 minutes",
    status: "loading",
    description: "Bimanual coffee making demonstrations",
  },
  {
    id: "lerobot/xarm_lift_medium",
    name: "XArm Lifting Task",
    episodes: 200,
    size: "890 MB",
    fps: 20,
    duration: "1.2 hours",
    status: "ready",
    description: "Object lifting and placement task",
  },
]

export function DatasetVisualization() {
  const [selectedDataset, setSelectedDataset] = useState(mockDatasets[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("browser")

  const filteredDatasets = mockDatasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Dataset Selection Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dataset Visualization
              </CardTitle>
              <CardDescription>Explore and analyze robotics datasets from the LeRobot collection</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Datasets</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-64">
              <Label htmlFor="dataset-select">Select Dataset</Label>
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
                  {filteredDatasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      <div className="flex items-center gap-2">
                        <span>{dataset.name}</span>
                        <Badge variant={dataset.status === "ready" ? "secondary" : "outline"} className="text-xs">
                          {dataset.status}
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

      {/* Dataset Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedDataset.episodes}</div>
              <div className="text-sm text-muted-foreground">Episodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedDataset.size}</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedDataset.fps} FPS</div>
              <div className="text-sm text-muted-foreground">Frame Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedDataset.duration}</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Browser
          </TabsTrigger>
          <TabsTrigger value="episodes" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Episodes
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="hub" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Hub
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Downloads
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Local
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-4">
          <DatasetBrowser dataset={selectedDataset} />
        </TabsContent>

        <TabsContent value="episodes" className="space-y-4">
          <EpisodeViewer dataset={selectedDataset} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <DatasetStats dataset={selectedDataset} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Analysis Tools</CardTitle>
              <CardDescription>Advanced analysis and filtering options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analysis tools coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hub" className="space-y-4">
          <HuggingFaceBrowser />
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <DownloadManager />
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <LocalDatasets />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <DatasetUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
