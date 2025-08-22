"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HardDrive, Trash2, Eye, Calendar, Database, Plus, RefreshCw, Search } from "lucide-react"
import { DatasetCreator } from "./dataset-creator"
import { DatasetValidator } from "./dataset-validator"

interface LocalDataset {
  id: string
  name: string
  path: string
  size: string
  episodes: number
  lastModified: Date
  status: "ready" | "processing" | "error"
  source: "downloaded" | "created" | "imported"
  description?: string
}

export function LocalDatasets() {
  const [localDatasets, setLocalDatasets] = useState<LocalDataset[]>([
    {
      id: "lerobot/pusht",
      name: "PushT Environment",
      path: "/datasets/lerobot/pusht",
      size: "2.3 GB",
      episodes: 1000,
      lastModified: new Date(Date.now() - 86400000),
      status: "ready",
      source: "downloaded",
      description: "2D pushing task with block manipulation",
    },
    {
      id: "lerobot/aloha_static_coffee",
      name: "ALOHA Coffee Making",
      path: "/datasets/lerobot/aloha_static_coffee",
      size: "1.1 GB",
      episodes: 50,
      lastModified: new Date(Date.now() - 172800000),
      status: "ready",
      source: "downloaded",
      description: "Bimanual coffee making demonstrations",
    },
    {
      id: "custom/my_robot_data",
      name: "My Robot Data",
      path: "/datasets/custom/my_robot_data",
      size: "450 MB",
      episodes: 25,
      lastModified: new Date(Date.now() - 3600000),
      status: "processing",
      source: "created",
      description: "Custom dataset created from robot recordings",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDataset, setSelectedDataset] = useState<LocalDataset | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const filteredDatasets = localDatasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const deleteDataset = (id: string) => {
    setLocalDatasets((prev) => prev.filter((d) => d.id !== id))
  }

  const refreshDatasets = () => {
    // Simulate refresh
    console.log("[v0] Refreshing local datasets...")
  }

  const getStatusColor = (status: LocalDataset["status"]) => {
    switch (status) {
      case "ready":
        return "text-green-500"
      case "processing":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getSourceBadge = (source: LocalDataset["source"]) => {
    switch (source) {
      case "downloaded":
        return <Badge variant="secondary">Downloaded</Badge>
      case "created":
        return <Badge variant="default">Created</Badge>
      case "imported":
        return <Badge variant="outline">Imported</Badge>
    }
  }

  const DatasetCard = ({ dataset }: { dataset: LocalDataset }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{dataset.name}</h4>
              {getSourceBadge(dataset.source)}
              <Badge variant="outline" className={`text-xs ${getStatusColor(dataset.status)}`}>
                {dataset.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{dataset.id}</p>
            <p className="text-xs text-muted-foreground mt-1">{dataset.path}</p>
            {dataset.description && <p className="text-sm text-muted-foreground mt-2">{dataset.description}</p>}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setSelectedDataset(dataset)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteDataset(dataset.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              {dataset.episodes} episodes
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              {dataset.size}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dataset.lastModified.toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Local Dataset Management
              </CardTitle>
              <CardDescription>Create, validate, and manage datasets stored locally</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshDatasets}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dataset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Dataset</DialogTitle>
                    <DialogDescription>Create a new dataset from recorded robot data</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dataset-name">Dataset Name</Label>
                      <Input id="dataset-name" placeholder="My Robot Dataset" />
                    </div>
                    <div>
                      <Label htmlFor="dataset-id">Dataset ID</Label>
                      <Input id="dataset-id" placeholder="custom/my_robot_dataset" />
                    </div>
                    <div>
                      <Label htmlFor="dataset-description">Description</Label>
                      <Input id="dataset-description" placeholder="Description of the dataset..." />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowCreateDialog(false)}>Create Dataset</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="local-search">Search Local Datasets</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="local-search"
                  placeholder="Search by name or path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="creator">Creator</TabsTrigger>
          <TabsTrigger value="validator">Validator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Dataset Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{localDatasets.length}</div>
                  <div className="text-sm text-muted-foreground">Total Datasets</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {localDatasets.filter((d) => d.status === "ready").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Ready</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    {localDatasets.filter((d) => d.status === "processing").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Processing</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {localDatasets.reduce((acc, d) => acc + d.episodes, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Episodes</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dataset List */}
          <div className="grid gap-4">
            {filteredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
            {filteredDatasets.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No local datasets found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Download datasets from the Hub or create your own
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="creator" className="space-y-4">
          <DatasetCreator />
        </TabsContent>

        <TabsContent value="validator" className="space-y-4">
          <DatasetValidator />
        </TabsContent>
      </Tabs>

      {/* Dataset Details Dialog */}
      <Dialog open={!!selectedDataset} onOpenChange={() => setSelectedDataset(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDataset?.name}</DialogTitle>
            <DialogDescription>{selectedDataset?.id}</DialogDescription>
          </DialogHeader>
          {selectedDataset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Episodes</Label>
                  <p className="text-sm">{selectedDataset.episodes}</p>
                </div>
                <div>
                  <Label>Size</Label>
                  <p className="text-sm">{selectedDataset.size}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className={`text-sm ${getStatusColor(selectedDataset.status)}`}>{selectedDataset.status}</p>
                </div>
                <div>
                  <Label>Source</Label>
                  <p className="text-sm">{selectedDataset.source}</p>
                </div>
              </div>
              <div>
                <Label>Path</Label>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedDataset.path}</p>
              </div>
              {selectedDataset.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm">{selectedDataset.description}</p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedDataset(null)}>
                  Close
                </Button>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  View Dataset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
