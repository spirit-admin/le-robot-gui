"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Download, Settings, BarChart3, Clock } from "lucide-react"
import { PolicyBrowser } from "./policy-browser"
import { EvaluationConfig } from "./evaluation-config"
import { EvaluationResults } from "./evaluation-results"
import { EvaluationMonitor } from "./evaluation-monitor"

const mockPolicies = [
  {
    id: "lerobot/diffusion_pusht",
    name: "Diffusion Policy - PushT",
    type: "Diffusion Policy",
    environment: "pusht",
    size: "45.2 MB",
    accuracy: 94.5,
    status: "ready",
    description: "State-of-the-art diffusion policy for 2D pushing tasks",
    lastEvaluated: "2 hours ago",
  },
  {
    id: "lerobot/act_aloha_coffee",
    name: "ACT - ALOHA Coffee",
    type: "Action Chunking Transformer",
    environment: "aloha",
    size: "128.7 MB",
    accuracy: 87.2,
    status: "ready",
    description: "Bimanual manipulation policy for coffee making task",
    lastEvaluated: "1 day ago",
  },
  {
    id: "lerobot/tdmpc_xarm",
    name: "TDMPC - XArm Lifting",
    type: "Temporal Difference MPC",
    environment: "xarm",
    size: "67.3 MB",
    accuracy: 91.8,
    status: "loading",
    description: "Model predictive control for robotic arm manipulation",
    lastEvaluated: "3 days ago",
  },
]

export function PolicyEvaluation() {
  const [selectedPolicy, setSelectedPolicy] = useState(mockPolicies[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("browser")
  const [isEvaluating, setIsEvaluating] = useState(false)

  const filteredPolicies = mockPolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStartEvaluation = () => {
    setIsEvaluating(true)
    setActiveTab("monitor")
    // Simulate evaluation completion after 5 seconds
    setTimeout(() => {
      setIsEvaluating(false)
      setActiveTab("results")
    }, 5000)
  }

  return (
    <div className="space-y-6">
      {/* Policy Selection Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Policy Evaluation
              </CardTitle>
              <CardDescription>Evaluate pretrained policies on robotics environments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="policy-search">Search Policies</Label>
              <div className="relative">
                <Brain className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="policy-search"
                  placeholder="Search by name, type, or repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-64">
              <Label htmlFor="policy-select">Select Policy</Label>
              <Select
                value={selectedPolicy.id}
                onValueChange={(value) => {
                  const policy = mockPolicies.find((p) => p.id === value)
                  if (policy) setSelectedPolicy(policy)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredPolicies.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      <div className="flex items-center gap-2">
                        <span>{policy.name}</span>
                        <Badge variant={policy.status === "ready" ? "secondary" : "outline"} className="text-xs">
                          {policy.status}
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

      {/* Policy Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedPolicy.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedPolicy.size}</div>
              <div className="text-sm text-muted-foreground">Model Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedPolicy.environment}</div>
              <div className="text-sm text-muted-foreground">Environment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedPolicy.lastEvaluated}</div>
              <div className="text-sm text-muted-foreground">Last Evaluated</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{selectedPolicy.type}</Badge>
              <Badge variant={selectedPolicy.status === "ready" ? "secondary" : "outline"}>
                {selectedPolicy.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selectedPolicy.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Evaluation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2" disabled={!isEvaluating}>
            <Clock className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-4">
          <PolicyBrowser
            policies={filteredPolicies}
            selectedPolicy={selectedPolicy}
            onSelectPolicy={setSelectedPolicy}
          />
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <EvaluationConfig policy={selectedPolicy} onStartEvaluation={handleStartEvaluation} />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <EvaluationMonitor policy={selectedPolicy} isRunning={isEvaluating} />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <EvaluationResults policy={selectedPolicy} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
