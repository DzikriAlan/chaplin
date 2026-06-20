export interface PayloadPostAgent {
  name: string
  description?: string
  image?: string
  personalization?: string
  knowledgeBaseIds: string[]
  isDefault: boolean
}

export interface PayloadPatchAgent {
  name?: string
  description?: string
  image?: string
  personalization?: string
  knowledgeBaseIds?: string[]
  isDefault?: boolean
}

export interface DataAgent {
  id: string
  name: string
  description: string | null
  image: string | null
  personalization: string | null
  knowledgeBaseIds: string[]
  isDefault: boolean
  embedScript: string | null
  whatsappScript: string | null
  createdAt: string
  updatedAt: string
}

export interface AgentsList {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataAgent[] | null
}

export interface AgentCreate {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataAgent | null
}
