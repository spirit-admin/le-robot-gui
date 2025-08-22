"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Monitor,
  Palette,
  Volume2,
  Shield,
  Activity,
  Database,
  Network,
  Save,
  RotateCcw,
  Download,
  Upload,
} from "lucide-react"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    // General Settings
    theme: "system",
    language: "en",
    autoSave: true,
    notifications: true,
    
    // Performance Settings
    maxConcurrentJobs: 4,
    gpuAcceleration: true,
    memoryLimit: 8,
    cacheSize: 2,
    
    // UI Settings
    sidebarCollapsed: false,
    showTooltips: true,
    animationsEnabled: true,
    compactMode: false,
    
    // Data Settings
    dataPath: "/home/project/data",
    cachePath: "/home/project/cache",
    outputPath: "/home/project/outputs",
    autoCleanup: true,
    
    // Network Settings
    proxyEnabled: false,
    proxyUrl: "",
    timeout: 30,
    retryAttempts: 3,
    
    // Security Settings
    requireAuth: false,
    sessionTimeout: 60,
    logLevel: "info",
    
    // Audio Settings
    soundEnabled: true,
    volume: 50,
    notificationSounds: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    setSettings({
      theme: "system",
      language: "en",
      autoSave: true,
      notifications: true,
      maxConcurrentJobs: 4,
      gpuAcceleration: true,
      memoryLimit: 8,
      cacheSize: 2,
      sidebarCollapsed: false,
      showTooltips: true,
      animationsEnabled: true,
      compactMode: false,
      dataPath: "/home/project/data",
      cachePath: "/home/project/cache",
      outputPath: "/home/project/outputs",
      autoCleanup: true,
      proxyEnabled: false,
      proxyUrl: "",
      timeout: 30,
      retryAttempts: 3,
      requireAuth: false,
      sessionTimeout: 60,
      logLevel: "info",
      soundEnabled: true,
      volume: 50,
      notificationSounds: true,
    })
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lerobot-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(prev => ({ ...prev, ...importedSettings }))
        } catch (error) {
          console.error('Failed to import settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings & Preferences
              </CardTitle>
              <CardDescription>Configure LeRobot GUI to your preferences</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportSettings}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => document.getElementById('import-settings')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                id="import-settings"
                type="file"
                accept=".json"
                className="hidden"
                onChange={importSettings}
              />
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Basic application settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show system notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Enable audio feedback</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                  />
                </div>
                {settings.soundEnabled && (
                  <div>
                    <Label>Volume: {settings.volume}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.volume}
                      onChange={(e) => handleSettingChange("volume", parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sidebar Collapsed</Label>
                    <p className="text-sm text-muted-foreground">Start with collapsed sidebar</p>
                  </div>
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) => handleSettingChange("sidebarCollapsed", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Tooltips</Label>
                    <p className="text-sm text-muted-foreground">Display helpful tooltips</p>
                  </div>
                  <Switch
                    checked={settings.showTooltips}
                    onCheckedChange={(checked) => handleSettingChange("showTooltips", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable UI animations</p>
                  </div>
                  <Switch
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange("animationsEnabled", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use compact interface layout</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
              <CardDescription>Optimize system performance and resource usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-jobs">Max Concurrent Jobs</Label>
                  <Select 
                    value={settings.maxConcurrentJobs.toString()} 
                    onValueChange={(value) => handleSettingChange("maxConcurrentJobs", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="memory-limit">Memory Limit (GB)</Label>
                  <Select 
                    value={settings.memoryLimit.toString()} 
                    onValueChange={(value) => handleSettingChange("memoryLimit", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 GB</SelectItem>
                      <SelectItem value="8">8 GB</SelectItem>
                      <SelectItem value="16">16 GB</SelectItem>
                      <SelectItem value="32">32 GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="cache-size">Cache Size (GB)</Label>
                <Select 
                  value={settings.cacheSize.toString()} 
                  onValueChange={(value) => handleSettingChange("cacheSize", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 GB</SelectItem>
                    <SelectItem value="2">2 GB</SelectItem>
                    <SelectItem value="4">4 GB</SelectItem>
                    <SelectItem value="8">8 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>GPU Acceleration</Label>
                  <p className="text-sm text-muted-foreground">Use GPU for computations when available</p>
                </div>
                <Switch
                  checked={settings.gpuAcceleration}
                  onCheckedChange={(checked) => handleSettingChange("gpuAcceleration", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Configure data storage and management settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="data-path">Data Directory</Label>
                  <Input
                    id="data-path"
                    value={settings.dataPath}
                    onChange={(e) => handleSettingChange("dataPath", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cache-path">Cache Directory</Label>
                  <Input
                    id="cache-path"
                    value={settings.cachePath}
                    onChange={(e) => handleSettingChange("cachePath", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="output-path">Output Directory</Label>
                  <Input
                    id="output-path"
                    value={settings.outputPath}
                    onChange={(e) => handleSettingChange("outputPath", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Cleanup</Label>
                  <p className="text-sm text-muted-foreground">Automatically clean temporary files</p>
                </div>
                <Switch
                  checked={settings.autoCleanup}
                  onCheckedChange={(checked) => handleSettingChange("autoCleanup", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>Configure network and connectivity options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings.timeout}
                    onChange={(e) => handleSettingChange("timeout", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <Input
                    id="retry-attempts"
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) => handleSettingChange("retryAttempts", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Proxy</Label>
                  <p className="text-sm text-muted-foreground">Use proxy server for connections</p>
                </div>
                <Switch
                  checked={settings.proxyEnabled}
                  onCheckedChange={(checked) => handleSettingChange("proxyEnabled", checked)}
                />
              </div>

              {settings.proxyEnabled && (
                <div>
                  <Label htmlFor="proxy-url">Proxy URL</Label>
                  <Input
                    id="proxy-url"
                    placeholder="http://proxy.example.com:8080"
                    value={settings.proxyUrl}
                    onChange={(e) => handleSettingChange("proxyUrl", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and privacy options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require login to access the application</p>
                </div>
                <Switch
                  checked={settings.requireAuth}
                  onCheckedChange={(checked) => handleSettingChange("requireAuth", checked)}
                />
              </div>

              {settings.requireAuth && (
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="log-level">Log Level</Label>
                <Select value={settings.logLevel} onValueChange={(value) => handleSettingChange("logLevel", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">v2.0.1</div>
              <div className="text-sm text-muted-foreground">LeRobot GUI</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">Node.js</div>
              <div className="text-sm text-muted-foreground">Runtime</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">WebContainer</div>
              <div className="text-sm text-muted-foreground">Environment</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">Ready</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}