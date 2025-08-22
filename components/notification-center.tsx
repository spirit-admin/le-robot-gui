"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, Info, X, Settings, Bell } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
  category: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState({
    training: true,
    evaluation: true,
    system: true,
    errors: true,
    desktop: false,
    email: false,
  })

  // Mock notification generation
  useEffect(() => {
    const generateNotification = (): Notification => {
      const types: Notification["type"][] = ["success", "warning", "error", "info"]
      const categories = ["training", "evaluation", "system", "dataset"]
      const notifications = [
        {
          type: "success" as const,
          title: "Training Completed",
          message: "ACT model training finished successfully with 94.5% accuracy",
        },
        {
          type: "warning" as const,
          title: "High GPU Usage",
          message: "GPU utilization has been above 90% for the last 10 minutes",
        },
        {
          type: "error" as const,
          title: "Dataset Load Failed",
          message: "Failed to load dataset from HuggingFace Hub. Check network connection",
        },
        {
          type: "info" as const,
          title: "Evaluation Started",
          message: "Policy evaluation has begun with 100 episodes",
        },
      ]

      const notification = notifications[Math.floor(Math.random() * notifications.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        ...notification,
        timestamp: new Date().toISOString(),
        read: false,
        category: categories[Math.floor(Math.random() * categories.length)],
      }
    }

    // Initialize with some notifications
    const initialNotifications = Array.from({ length: 8 }, generateNotification)
    setNotifications(initialNotifications)

    // Add new notifications periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setNotifications((prev) => [generateNotification(), ...prev.slice(0, 19)]) // Keep last 20
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "info":
        return "border-blue-200 bg-blue-50"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Categories</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="training-notifs">Training Events</Label>
                  <Switch
                    id="training-notifs"
                    checked={settings.training}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, training: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="eval-notifs">Evaluation Events</Label>
                  <Switch
                    id="eval-notifs"
                    checked={settings.evaluation}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, evaluation: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-notifs">System Alerts</Label>
                  <Switch
                    id="system-notifs"
                    checked={settings.system}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, system: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="error-notifs">Error Notifications</Label>
                  <Switch
                    id="error-notifs"
                    checked={settings.errors}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, errors: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Delivery Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="desktop-notifs">Desktop Notifications</Label>
                  <Switch
                    id="desktop-notifs"
                    checked={settings.desktop}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, desktop: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifs">Email Notifications</Label>
                  <Switch
                    id="email-notifs"
                    checked={settings.email}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, email: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-blue-600">Unread</div>
            </div>
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {notifications.filter((n) => n.type === "error").length}
              </div>
              <div className="text-sm text-red-600">Errors</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {notifications.filter((n) => n.type === "warning").length}
              </div>
              <div className="text-sm text-yellow-600">Warnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${getNotificationColor(notification.type)} ${
                      !notification.read ? "border-l-4" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            Mark Read
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => dismissNotification(notification.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
