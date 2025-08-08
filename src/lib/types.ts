export interface Partner {
  id: number;
  name: string;
  type: 'Distribuidor' | 'Fornecedor';
  // Adicionado o campo mainContact aqui
  mainContact?: string;
  contact: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
  site?: string;
  products?: string;
  sitePartner?: string;
  siteRO?: string;
  templateRO?: string;
  procedimentoRO?: string;
  login?: string;
  password?: string;
}

export interface Quote {
  id: string;
  client: string;
  projectName: string;
  accountManager?: string;
  status: 'Pendente' | 'Enviado' | 'Aprovado' | 'Rejeitado' | 'Aguardando Distribuidor';
  total: number;
  date: string;
  distributorId: number | string; // Can be string from form
  quotationFile?: string;
  pricingFile?: string;
}

export interface Proposal {
  id: string;
  title: string;
  client: string;
  description: string;
  status: 'Rascunho' | 'Enviada' | 'Em Análise' | 'Aprovada' | 'Rejeitada';
  value: number;
  date: string;
  expiryDate: string;
  accountManager: string;
  distributorId: number | string;
  proposalFile?: string;
  technicalSpecs?: string;
  commercialTerms?: string;
}

export interface RO {
    id: number;
    supplierId: number | string; // Can be string from form
    roNumber: string;
    openDate: string;
    expiryDate: string;
    clientName: string;
    product: string;
    value: number;
}

export interface Training {
    id: number;
    supplierId: number | string; // Can be string from form
    trainingName: string;
    type: 'Comercial' | 'Técnico';
    participantName: string;
    expiryDate: string;
}

export interface RFP {
    id: string;
    title: string;
    client: string;
    type: 'RFP' | 'RFI';
    description: string;
    status: 'Aberto' | 'Em Análise' | 'Respondido' | 'Fechado' | 'Vencido';
    publishDate: string;
    deadlineDate: string;
    submissionDate?: string;
    value?: number;
    accountManager: string;
    category: string;
    requirements: string;
    attachments?: string[];
    notes?: string;
}

export interface PriceRecord {
    id: string;
    title: string;
    client: string;
    type: 'Ata de Registro de Preços' | 'Pregão Eletrônico' | 'Concorrência';
    description: string;
    status: 'Ativo' | 'Suspenso' | 'Vencido' | 'Cancelado' | 'Renovado';
    publishDate: string;
    validityDate: string;
    renewalDate?: string;
    totalValue: number;
    accountManager: string;
    category: string;
    items: PriceRecordItem[];
    participants: string[];
    attachments?: string[];
    notes?: string;
}

export interface PriceRecordItem {
    id: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplier: string;
    brand?: string;
    model?: string;
}

export interface BidFile {
    id: number;
    name: string;
}

export interface BidDocs {
    company: BidFile[];
    proofs: BidFile[];
    certifications: BidFile[];
}

export interface EditalFile {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'other';
    size: number;
    uploadDate: string;
    url?: string;
    aiAnalysis?: EditalAIAnalysis;
}

export interface EditalAIAnalysis {
    id: string;
    fileId: string;
    analysisDate: string;
    summary: string;
    keyPoints: string[];
    requirements: string[];
    deadlines: string[];
    values: string[];
    risks: string[];
    opportunities: string[];
    recommendations: string[];
    confidence: number; // 0-100
    processingTime: number; // in seconds
}

export interface Edital {
    id: string;
    title: string;
    publicationNumber: string;
    publishingBody: string;
    publishDate: string;
    openingDate: string;
    submissionDeadline: string;
    estimatedValue: number;
    category: string;
    status: 'Aberto' | 'Em Análise' | 'Fechado' | 'Vencido' | 'Cancelado';
    description: string;
    requirements: string;
    documents: EditalDocument[];
    products: EditalProduct[];
    analysis?: EditalAnalysis;
    files?: EditalFile[];
    attachments?: string[];
    notes?: string;
}

export interface EditalDocument {
    id: string;
    name: string;
    type: 'Obrigatório' | 'Opcional' | 'Complementar';
    description: string;
    deadline?: string;
    status: 'Pendente' | 'Em Preparação' | 'Pronto' | 'Enviado';
    notes?: string;
}

export interface EditalProduct {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    estimatedUnitPrice: number;
    totalEstimatedPrice: number;
    specifications: string;
    brand?: string;
    model?: string;
    supplier?: string;
    status: 'Disponível' | 'Em Cotação' | 'Indisponível';
}

export interface EditalAnalysis {
    id: string;
    editalId: string;
    analysisDate: string;
    analyst: string;
    documentAnalysis: {
        totalDocuments: number;
        readyDocuments: number;
        pendingDocuments: number;
        criticalDocuments: string[];
        notes: string;
    };
    productAnalysis: {
        totalProducts: number;
        availableProducts: number;
        unavailableProducts: number;
        totalEstimatedValue: number;
        competitiveAdvantage: string;
        notes: string;
    };
    timelineAnalysis: {
        daysUntilOpening: number;
        daysUntilDeadline: number;
        isUrgent: boolean;
        timelineRisk: 'Baixo' | 'Médio' | 'Alto';
        notes: string;
    };
    publishingBodyAnalysis: {
        bodyType: 'Federal' | 'Estadual' | 'Municipal' | 'Autarquia' | 'Empresa Pública';
        previousExperience: string;
        paymentHistory: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
        notes: string;
    };
    overallAssessment: {
        score: number; // 0-100
        recommendation: 'Participar' | 'Não Participar' | 'Avaliar Mais';
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
        finalNotes: string;
    };
}

export interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    subItems?: NavSubItem[];
}

export interface NavSubItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

// Tipos para o Analisador de Editais
export interface AnalysisType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  analysisType: string;
  analysisDate: string;
  summary: string;
  keyPoints: string[];
  requirements: string[];
  deadlines: string[];
  values: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  confidence: number;
  processingTime: number;
  products?: ProductItem[];
}

export interface ProductItem {
  item: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedValue: number;
  specifications: string[];
  category?: string;
  priority?: 'Crítico' | 'Importante' | 'Desejável';
  complianceLevel?: 'Total' | 'Parcial' | 'Não Atende';
  riskLevel?: 'Baixo' | 'Médio' | 'Alto';
  technicalJustification?: string;
  marketAnalysis?: string;
  alternativeOptions?: string[];
  suggestedModels?: SuggestedModel[];
}

export interface SuggestedModel {
  brand: string;
  model: string;
  partNumber?: string;
  estimatedPrice: number;
  availability: 'Disponível' | 'Sob Consulta' | 'Descontinuado';
  complianceScore: number;
  advantages: string[];
  disadvantages?: string[];
  distributors?: string[];
}

export interface DocumentRequirement {
  type: string;
  description: string;
  mandatory: boolean;
  deadline?: string;
  notes?: string;
}
