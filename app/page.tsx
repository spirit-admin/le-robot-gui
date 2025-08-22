"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { DatasetVisualization } from "@/components/dataset-visualization"
import { PolicyEvaluation } from "@/components/policy-evaluation"
import { ModelTraining } from "@/components/model-training"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { SimulationInterface } from "@/components/simulation-interface"

export default function HomePage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderMainContent = () => {
    switch (activeView) {
      case "datasets":
        return <DatasetVisualization />
      case "policies":
        return <PolicyEvaluation />
      case "training":
        return <ModelTraining />
      case "simulation":
        return <SimulationInterface />
      case "monitoring":
        return <MonitoringDashboard />
      case "dashboard":
      default:
        return <MainContent />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigate={setActiveView} activeView={activeView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-auto p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}
