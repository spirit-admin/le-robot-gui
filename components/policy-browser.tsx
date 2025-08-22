"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Download, Play, Clock, Target, Zap } from "lucide-react"

interface Policy {
  id: string
  name: string
  type: string
  environment: string
  size: string
  accuracy: number
  status: string
  description: string
  lastEvaluated: string
}

interface PolicyBrowserProps {
  policies: Policy[]
  selectedPolicy: Policy
  onSelectPolicy: (policy: Policy) => void
}

export function PolicyBrowser({ policies, selectedPolicy, onSelectPolicy }: PolicyBrowserProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Policy List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Available Policies
          </CardTitle>
          <CardDescription>Browse and select pretrained policies from the LeRobot hub</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPolicy.id === policy.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectPolicy(policy)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{policy.name}</h3>
                        <Badge variant={policy.status === "ready" ? "secondary" : "outline"} className="text-xs">
                          {policy.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {policy.environment}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {policy.accuracy}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {policy.lastEvaluated}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{policy.size}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {policy.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Policy Details */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Details</CardTitle>
          <CardDescription>Information about the selected policy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{selectedPolicy.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedPolicy.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Repository</span>
                <span className="text-sm font-mono">{selectedPolicy.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{selectedPolicy.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Environment</span>
                <span className="text-sm">{selectedPolicy.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Model Size</span>
                <span className="text-sm">{selectedPolicy.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-primary">{selectedPolicy.accuracy}%</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button className="w-full" disabled={selectedPolicy.status !== "ready"}>
                <Play className="h-4 w-4 mr-2" />
                Evaluate Policy
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Model
              </Button>
            </div>

            {selectedPolicy.status !== "ready" && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This policy is currently loading. Please wait for it to become available.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
