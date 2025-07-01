interface Movie {
  id: number
  name: string
  image?: {
    medium?: string
  }
  summary: string
  genres: string[]
  language: string
  rating?: {
    average?: number
  }
  type: string
  premiered: string
  status: string
  _links?: {
    previousepisode?: {
      name?: string
    }
  }
}