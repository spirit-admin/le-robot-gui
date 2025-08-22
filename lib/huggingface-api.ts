export interface HFDataset {
  id: string
  name: string
  description: string
  downloads: number
  likes: number
  tags: string[]
  size?: string
  lastModified: string
  private: boolean
}

export interface HFModel {
  id: string
  name: string
  description: string
  downloads: number
  likes: number
  tags: string[]
  size?: string
  lastModified: string
  private: boolean
}

export interface DownloadProgress {
  status: "idle" | "downloading" | "completed" | "error"
  progress: number
  message: string
}

// Mock API functions - in real implementation, these would use @huggingface/hub
export async function searchDatasets(query = "", limit = 20): Promise<HFDataset[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockDatasets: HFDataset[] = [
    {
      id: "lerobot/pusht",
      name: "PushT Environment",
      description: "2D pushing task with block manipulation demonstrations",
      downloads: 15420,
      likes: 234,
      tags: ["robotics", "imitation-learning", "pusht"],
      size: "2.3 GB",
      lastModified: "2024-01-15",
      private: false,
    },
    {
      id: "lerobot/aloha_static_coffee",
      name: "ALOHA Coffee Making",
      description: "Bimanual coffee making demonstrations using ALOHA robot",
      downloads: 8930,
      likes: 156,
      tags: ["robotics", "bimanual", "aloha"],
      size: "1.1 GB",
      lastModified: "2024-01-10",
      private: false,
    },
    {
      id: "lerobot/aloha_mobile_cabinet",
      name: "ALOHA Mobile Cabinet",
      description: "Mobile manipulation tasks with cabinet opening",
      downloads: 12340,
      likes: 189,
      tags: ["robotics", "mobile", "manipulation"],
      size: "3.2 GB",
      lastModified: "2024-01-20",
      private: false,
    },
    {
      id: "lerobot/xarm_lift_medium",
      name: "XArm Lifting Task",
      description: "Object lifting and placement demonstrations",
      downloads: 6780,
      likes: 98,
      tags: ["robotics", "xarm", "lifting"],
      size: "890 MB",
      lastModified: "2024-01-08",
      private: false,
    },
    {
      id: "lerobot/unitreeh1_warehouse",
      name: "UnitreeH1 Warehouse",
      description: "Humanoid robot warehouse navigation and manipulation",
      downloads: 4560,
      likes: 145,
      tags: ["robotics", "humanoid", "warehouse"],
      size: "5.1 GB",
      lastModified: "2024-01-25",
      private: false,
    },
  ]

  return mockDatasets
    .filter(
      (dataset) =>
        query === "" ||
        dataset.name.toLowerCase().includes(query.toLowerCase()) ||
        dataset.description.toLowerCase().includes(query.toLowerCase()) ||
        dataset.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, limit)
}

export async function searchModels(query = "", limit = 20): Promise<HFModel[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockModels: HFModel[] = [
    {
      id: "lerobot/act_aloha_sim_insertion_human",
      name: "ACT ALOHA Insertion",
      description: "Action Chunking Transformer for ALOHA insertion task",
      downloads: 3420,
      likes: 67,
      tags: ["robotics", "act", "aloha"],
      size: "245 MB",
      lastModified: "2024-01-18",
      private: false,
    },
    {
      id: "lerobot/diffusion_pusht",
      name: "Diffusion Policy PushT",
      description: "Diffusion policy trained on PushT environment",
      downloads: 5680,
      likes: 123,
      tags: ["robotics", "diffusion", "pusht"],
      size: "312 MB",
      lastModified: "2024-01-22",
      private: false,
    },
    {
      id: "lerobot/pi0",
      name: "Pi0 Base Model",
      description: "Base Pi0 model for robotics applications",
      downloads: 12340,
      likes: 285,
      tags: ["robotics", "pi0", "base"],
      size: "4.2 GB",
      lastModified: "2024-01-20",
      private: false,
    },
  ]

  return mockModels
    .filter(
      (model) =>
        query === "" ||
        model.name.toLowerCase().includes(query.toLowerCase()) ||
        model.description.toLowerCase().includes(query.toLowerCase()) ||
        model.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, limit)
}

export async function downloadDataset(
  datasetId: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  const steps = [
    { message: "Connecting to Hugging Face Hub...", progress: 10 },
    { message: "Fetching dataset metadata...", progress: 25 },
    { message: "Downloading dataset files...", progress: 50 },
    { message: "Extracting and processing...", progress: 80 },
    { message: "Finalizing download...", progress: 95 },
    { message: "Download completed!", progress: 100 },
  ]

  for (const step of steps) {
    onProgress?.({
      status: step.progress === 100 ? "completed" : "downloading",
      progress: step.progress,
      message: step.message,
    })
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
}

export async function uploadDataset(
  datasetId: string,
  files: File[],
  metadata: any,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  const steps = [
    { message: "Preparing upload...", progress: 10 },
    { message: "Creating repository...", progress: 25 },
    { message: "Uploading files...", progress: 60 },
    { message: "Processing metadata...", progress: 85 },
    { message: "Finalizing upload...", progress: 100 },
  ]

  for (const step of steps) {
    onProgress?.({
      status: step.progress === 100 ? "completed" : "downloading",
      progress: step.progress,
      message: step.message,
    })
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

export async function uploadModel(
  modelId: string,
  files: File[],
  metadata: any,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  const steps = [
    { message: "Preparing model upload...", progress: 10 },
    { message: "Creating model repository...", progress: 25 },
    { message: "Uploading model files...", progress: 60 },
    { message: "Processing model metadata...", progress: 85 },
    { message: "Finalizing model upload...", progress: 100 },
  ]

  for (const step of steps) {
    onProgress?.({
      status: step.progress === 100 ? "completed" : "downloading",
      progress: step.progress,
      message: step.message,
    })
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}
