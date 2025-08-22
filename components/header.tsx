"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Settings,
  User,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Activity,
  Monitor,
  Palette,
  Volume2,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  activeView?: string
}

export function Header({ activeView = "dashboard" }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [cpuUsage, setCpuUsage] = useState(45)
  const [memoryUsage, setMemoryUsage] = useState(62)
  const [activeJobs, setActiveJobs] = useState(2)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Training Complete",
      message: "ACT model training finished successfully",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "High Memory Usage",
      message: "System memory usage is above 80%",
      time: "5 min ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Dataset Updated",
      message: "New episodes added to pusht dataset",
      time: "10 min ago",
      read: true,
    },
  ])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getViewTitle = () => {
    switch (activeView) {
      case "datasets":
        return "Dataset Visualization"
      case "policies":
        return "Policy Evaluation"
      case "training":
        return "Model Training"
      case "monitoring":
        return "System Monitoring"
      default:
        return "LeRobot Dashboard"
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30)
      setMemoryUsage(Math.floor(Math.random() * 20) + 50)
      setIsConnected(Math.random() > 0.1) // 90% uptime simulation
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-card-foreground">{getViewTitle()}</h2>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "secondary" : "destructive"} className="gap-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            CPU: {cpuUsage}%
          </Badge>
          <Badge variant="outline" className="gap-1">
            RAM: {memoryUsage}%
          </Badge>
          {activeJobs > 0 && (
            <Badge variant="default" className="gap-1">
              {activeJobs} Jobs Running
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center justify-center text-sm text-muted-foreground"
                  onClick={() => setNotifications([])}
                >
                  Clear all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme} className="gap-2">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Monitor className="h-4 w-4" />
              Display Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Volume2 className="h-4 w-4" />
              Audio Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Palette className="h-4 w-4" />
              Theme Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Shield className="h-4 w-4" />
              Security & Privacy
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Activity className="h-4 w-4" />
              Performance Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
