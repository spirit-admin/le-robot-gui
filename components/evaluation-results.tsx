"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, Share, TrendingUp, Target, Clock, Award } from "lucide-react"

interface EvaluationResultsProps {
  policy: {
    id: string
    name: string
    environment: string
  }
}

export function EvaluationResults({ policy }: EvaluationResultsProps) {
  const mockResults = {
    overallMetrics: {
      successRate: 94.5,
      averageReward: 87.3,
      averageSteps: 156,
      totalEpisodes: 100,
      completedEpisodes: 100,
      failedEpisodes: 5,
    },
    episodeBreakdown: [
      { range: "0-20", success: 95, avgReward: 89.2, avgSteps: 145 },
      { range: "21-40", success: 92, avgReward: 85.7, avgSteps: 162 },
      { range: "41-60", success: 96, avgReward: 88.9, avgSteps: 151 },
      { range: "61-80", success: 94, avgReward: 86.4, avgSteps: 159 },
      { range: "81-100", success: 93, avgReward: 87.8, avgSteps: 163 },
    ],
    comparison: {
      previousBest: 91.2,
      improvement: 3.3,
      ranking: 2,
      totalPolicies: 15,
    },
  }

  return (
    <div className="space-y-6">
      {/* Results Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Evaluation Results
              </CardTitle>
              <CardDescription>Comprehensive evaluation results for {policy.name}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">{mockResults.overallMetrics.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />+{mockResults.comparison.improvement}%
              </Badge>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{mockResults.overallMetrics.averageReward}</div>
              <div className="text-sm text-muted-foreground">Avg Reward</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{mockResults.overallMetrics.averageSteps}</div>
              <div className="text-sm text-muted-foreground">Avg Steps</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {mockResults.comparison.ranking}/{mockResults.comparison.totalPolicies}
              </div>
              <div className="text-sm text-muted-foreground">Ranking</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="episodes">Episodes</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{mockResults.overallMetrics.successRate}%</span>
                  </div>
                  <Progress value={mockResults.overallMetrics.successRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Reward</span>
                    <span>{mockResults.overallMetrics.averageReward}</span>
                  </div>
                  <Progress value={mockResults.overallMetrics.averageReward} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>
                      {(
                        (mockResults.overallMetrics.completedEpisodes / mockResults.overallMetrics.totalEpisodes) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (mockResults.overallMetrics.completedEpisodes / mockResults.overallMetrics.totalEpisodes) * 100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Episode Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {mockResults.overallMetrics.completedEpisodes}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-red-600">{mockResults.overallMetrics.failedEpisodes}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">{mockResults.overallMetrics.averageSteps}</div>
                    <div className="text-sm text-muted-foreground">Avg Steps</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">{mockResults.overallMetrics.totalEpisodes}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="episodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Episode Breakdown</CardTitle>
              <CardDescription>Performance across different episode ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResults.episodeBreakdown.map((range, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Episodes {range.range}</span>
                      <Badge variant="outline">{range.success}% Success</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-medium">{range.success}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Reward:</span>
                        <div className="font-medium">{range.avgReward}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Steps:</span>
                        <div className="font-medium">{range.avgSteps}</div>
                      </div>
                    </div>
                    <Progress value={range.success} className="h-1 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Comparison
              </CardTitle>
              <CardDescription>How this policy compares to others on the same environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Policy</h3>
                      <p className="text-sm text-muted-foreground">{policy.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{mockResults.overallMetrics.successRate}%</div>
                      <Badge variant="secondary">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Rank #{mockResults.comparison.ranking}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Previous Best</h3>
                      <p className="text-sm text-muted-foreground">Best performing policy before this evaluation</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-muted-foreground">
                        {mockResults.comparison.previousBest}%
                      </div>
                      <div className="text-sm text-green-600">+{mockResults.comparison.improvement}% improvement</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Leaderboard Position</h3>
                  <div className="text-sm text-muted-foreground mb-2">
                    Ranked #{mockResults.comparison.ranking} out of {mockResults.comparison.totalPolicies} evaluated
                    policies
                  </div>
                  <Progress
                    value={
                      ((mockResults.comparison.totalPolicies - mockResults.comparison.ranking + 1) /
                        mockResults.comparison.totalPolicies) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
