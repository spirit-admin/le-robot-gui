"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, CheckCircle, Info } from "lucide-react"

interface Model {
  id: string
  name: string
  description: string
  complexity: string
  recommendedFor: string[]
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: Model
  onSelectModel: (model: Model) => void
}

export function ModelSelector({ models, selectedModel, onSelectModel }: ModelSelectorProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Model List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Available Models
          </CardTitle>
          <CardDescription>Choose from state-of-the-art robotics learning algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModel.id === model.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectModel(model)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{model.name}</h3>
                        {selectedModel.id === model.id && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {model.recommendedFor.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={`text-xs ${getComplexityColor(model.complexity)}`}>{model.complexity}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Model Details */}
      <Card>
        <CardHeader>
          <CardTitle>Model Details</CardTitle>
          <CardDescription>Information about the selected model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{selectedModel.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Model ID</span>
                <span className="text-sm font-mono">{selectedModel.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Complexity</span>
                <Badge className={`text-xs ${getComplexityColor(selectedModel.complexity)}`}>
                  {selectedModel.complexity}
                </Badge>
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Best suited for:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedModel.recommendedFor.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-transparent" variant="outline">
                <Info className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </div>

            {/* Model-specific information */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Training Tips</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {selectedModel.id === "act" && (
                  <>
                    <p>• Works best with sequential manipulation tasks</p>
                    <p>• Requires sufficient demonstration data</p>
                    <p>• Consider chunk size for action sequences</p>
                  </>
                )}
                {selectedModel.id === "diffusion_policy" && (
                  <>
                    <p>• Excellent for smooth continuous control</p>
                    <p>• May require longer training times</p>
                    <p>• Benefits from data augmentation</p>
                  </>
                )}
                {selectedModel.id === "tdmpc" && (
                  <>
                    <p>• Sample efficient but computationally intensive</p>
                    <p>• Good for environments with clear dynamics</p>
                    <p>• Requires careful hyperparameter tuning</p>
                  </>
                )}
                {selectedModel.id === "vq_bet" && (
                  <>
                    <p>• Effective for discrete action spaces</p>
                    <p>• Fast inference and training</p>
                    <p>• Good baseline for behavior cloning</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
