"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, XCircle, Play, FileText, Settings, RefreshCw, Download } from "lucide-react"

interface ValidationResult {
  category: string
  checks: ValidationCheck[]
  score: number
  status: "passed" | "warning" | "failed"
}

interface ValidationCheck {
  name: string
  status: "passed" | "warning" | "failed"
  message: string
  details?: string
}

export function DatasetValidator() {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([
    {
      category: "File Structure",
      score: 95,
      status: "passed",
      checks: [
        {
          name: "Dataset directory structure",
          status: "passed",
          message: "All required directories are present",
        },
        {
          name: "Metadata files",
          status: "passed",
          message: "metadata.json and info.json found",
        },
        {
          name: "Episode files",
          status: "warning",
          message: "2 episodes missing video files",
          details: "Episodes 15 and 23 are missing camera_main.mp4",
        },
      ],
    },
    {
      category: "Data Quality",
      score: 87,
      status: "warning",
      checks: [
        {
          name: "Frame consistency",
          status: "passed",
          message: "All episodes have consistent frame rates",
        },
        {
          name: "Action bounds",
          status: "warning",
          message: "Some actions exceed expected ranges",
          details: "Joint 3 values exceed [-π, π] in 5 episodes",
        },
        {
          name: "Observation completeness",
          status: "passed",
          message: "All required observations are present",
        },
      ],
    },
    {
      category: "Format Compliance",
      score: 100,
      status: "passed",
      checks: [
        {
          name: "LeRobot format",
          status: "passed",
          message: "Dataset follows LeRobot format specification",
        },
        {
          name: "HuggingFace compatibility",
          status: "passed",
          message: "Compatible with HuggingFace datasets library",
        },
        {
          name: "Version compatibility",
          status: "passed",
          message: "Compatible with LeRobot v2.0+",
        },
      ],
    },
  ])

  const [isValidating, setIsValidating] = useState(false)
  const [validationProgress, setValidationProgress] = useState(0)

  const runValidation = async () => {
    setIsValidating(true)
    setValidationProgress(0)

    // Simulate validation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setValidationProgress(i)
    }

    setIsValidating(false)
  }

  const getStatusIcon = (status: ValidationCheck["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: ValidationCheck["status"]) => {
    switch (status) {
      case "passed":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "failed":
        return "text-red-500"
    }
  }

  const overallScore = Math.round(
    validationResults.reduce((acc, result) => acc + result.score, 0) / validationResults.length,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Dataset Validator
              </CardTitle>
              <CardDescription>Validate dataset quality and format compliance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button onClick={runValidation} disabled={isValidating}>
                {isValidating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                {isValidating ? "Validating..." : "Run Validation"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{overallScore}%</div>
            <div className="text-lg font-medium mb-4">Overall Dataset Quality Score</div>
            {isValidating && (
              <div className="max-w-md mx-auto">
                <Progress value={validationProgress} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">Validating dataset... {validationProgress}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4">
            {validationResults.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.category}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <span className="text-lg font-bold">{result.score}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.checks.map((check, checkIndex) => (
                      <div key={checkIndex} className="flex items-start gap-3">
                        {getStatusIcon(check.status)}
                        <div className="flex-1">
                          <p className="font-medium">{check.name}</p>
                          <p className="text-sm text-muted-foreground">{check.message}</p>
                          {check.details && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted p-2 rounded">
                              {check.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Structure Analysis</CardTitle>
              <CardDescription>Detailed analysis of dataset file structure</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>dataset/</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>metadata.json</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>info.json</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>episodes/</span>
                  </div>
                  <div className="flex items-center gap-2 ml-8">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>episode_000000.hdf5</span>
                  </div>
                  <div className="flex items-center gap-2 ml-8">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>episode_000015.hdf5 (missing video)</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>videos/</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Episodes</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Episode Length</span>
                    <span className="font-medium">45.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Duration</span>
                    <span className="font-medium">15.6 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frame Rate</span>
                    <span className="font-medium">30 FPS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Action Smoothness</span>
                    <span className="font-medium text-green-500">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trajectory Diversity</span>
                    <span className="font-medium text-green-500">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium text-yellow-500">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Completeness</span>
                    <span className="font-medium text-green-500">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Format Compliance Report</CardTitle>
              <CardDescription>Compatibility with robotics frameworks and standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">LeRobot Format v2.0</p>
                      <p className="text-sm text-muted-foreground">Fully compatible</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Compatible</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">HuggingFace Datasets</p>
                      <p className="text-sm text-muted-foreground">Ready for upload</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Compatible</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">ROS Bag Format</p>
                      <p className="text-sm text-muted-foreground">Conversion available</p>
                    </div>
                  </div>
                  <Badge variant="outline">Convertible</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Fixes
            </Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Validated
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
