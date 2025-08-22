"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, File, ImageIcon, Video, Database, ChevronRight, ChevronDown } from "lucide-react"

interface DatasetBrowserProps {
  dataset: {
    id: string
    name: string
    episodes: number
    size: string
    status: string
  }
}

const mockFileStructure = {
  name: "lerobot/pusht",
  type: "folder",
  children: [
    {
      name: "episodes",
      type: "folder",
      children: [
        { name: "episode_000000.mp4", type: "video", size: "2.3 MB" },
        { name: "episode_000001.mp4", type: "video", size: "2.1 MB" },
        { name: "episode_000002.mp4", type: "video", size: "2.4 MB" },
        { name: "episode_000003.mp4", type: "video", size: "2.2 MB" },
      ],
    },
    {
      name: "observations",
      type: "folder",
      children: [
        {
          name: "images",
          type: "folder",
          children: [
            { name: "cam_high", type: "folder", children: [] },
            { name: "cam_low", type: "folder", children: [] },
          ],
        },
        { name: "states.parquet", type: "file", size: "45.2 MB" },
      ],
    },
    {
      name: "actions",
      type: "folder",
      children: [{ name: "actions.parquet", type: "file", size: "12.8 MB" }],
    },
    { name: "metadata.json", type: "file", size: "2.1 KB" },
    { name: "dataset_info.json", type: "file", size: "1.8 KB" },
  ],
}

export function DatasetBrowser({ dataset }: DatasetBrowserProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["episodes", "observations"]))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const getFileIcon = (type: string, name: string) => {
    if (type === "folder") return <Folder className="h-4 w-4 text-blue-500" />
    if (name.endsWith(".mp4") || name.endsWith(".avi")) return <Video className="h-4 w-4 text-purple-500" />
    if (name.endsWith(".jpg") || name.endsWith(".png")) return <ImageIcon className="h-4 w-4 text-green-500" />
    if (name.endsWith(".parquet") || name.endsWith(".json")) return <Database className="h-4 w-4 text-orange-500" />
    return <File className="h-4 w-4 text-gray-500" />
  }

  const renderFileTree = (node: any, path = "", level = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedFolders.has(currentPath)
    const isSelected = selectedFile === currentPath

    return (
      <div key={currentPath}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted ${
            isSelected ? "bg-accent text-accent-foreground" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(currentPath)
            } else {
              setSelectedFile(currentPath)
            }
          }}
        >
          {node.type === "folder" && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
          )}
          {node.type !== "folder" && <div className="w-4" />}

          {getFileIcon(node.type, node.name)}

          <span className="flex-1 text-sm">{node.name}</span>

          {node.size && (
            <Badge variant="outline" className="text-xs">
              {node.size}
            </Badge>
          )}
        </div>

        {node.type === "folder" && isExpanded && node.children && (
          <div>{node.children.map((child: any) => renderFileTree(child, currentPath, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* File Browser */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Dataset Structure
          </CardTitle>
          <CardDescription>Browse files and folders in the dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">{renderFileTree(mockFileStructure)}</ScrollArea>
        </CardContent>
      </Card>

      {/* File Details */}
      <Card>
        <CardHeader>
          <CardTitle>File Details</CardTitle>
          <CardDescription>Information about the selected file</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedFile ? (
            <div className="space-y-4">
              <div>
                <Label>File Path</Label>
                <div className="text-sm font-mono bg-muted p-2 rounded mt-1">{selectedFile}</div>
              </div>

              <div>
                <Label>File Type</Label>
                <div className="text-sm mt-1">
                  {selectedFile.endsWith(".mp4")
                    ? "Video File"
                    : selectedFile.endsWith(".parquet")
                      ? "Parquet Data"
                      : selectedFile.endsWith(".json")
                        ? "JSON Metadata"
                        : "Unknown"}
                </div>
              </div>

              <div>
                <Label>Actions</Label>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
              </div>

              {selectedFile.endsWith(".mp4") && (
                <div>
                  <Label>Video Preview</Label>
                  <div className="mt-2 bg-muted rounded-lg p-4 text-center">
                    <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Video preview coming soon</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a file to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
