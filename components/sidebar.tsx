"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Brain, Play, Settings, Activity, ChevronLeft, ChevronRight, Bot, Gamepad2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Activity, description: "Overview and quick actions" },
  { id: "datasets", label: "Datasets", icon: Database, description: "Visualize and manage datasets" },
  { id: "policies", label: "Policies", icon: Brain, description: "Evaluate pretrained policies" },
  { id: "training", label: "Training", icon: Play, description: "Train new models" },
  { id: "simulation", label: "Simulation", icon: Gamepad2, description: "Virtual training environment" },
  { id: "monitoring", label: "Monitoring", icon: Activity, description: "Real-time status and logs" },
  { id: "settings", label: "Settings", icon: Settings, description: "Configuration and preferences" },
]

interface SidebarProps {
  className?: string
  onNavigate?: (itemId: string) => void
  activeView?: string
}

export function Sidebar({ className, onNavigate, activeView = "dashboard" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNavigation = (itemId: string) => {
    onNavigate?.(itemId)
  }

  return (
    <Card
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="font-semibold text-sidebar-foreground">LeRobot GUI</h1>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3",
                  isCollapsed && "justify-center p-2",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                onClick={() => handleNavigation(item.id)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sidebar-foreground">Status</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ready
            </Badge>
          </div>
        </div>
      )}
    </Card>
  )
}
