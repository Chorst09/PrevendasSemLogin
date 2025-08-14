import jsPDF from 'jspdf'
import type { ProposalData } from '@/lib/types/proposals'

export class ProposalPDFGenerator {
  private doc: jsPDF
  private pageHeight: number
  private pageWidth: number
  private margin: number
  private currentY: number

  constructor() {
    this.doc = new jsPDF()
    this.pageHeight = this.doc.internal.pageSize.height
    this.pageWidth = this.doc.internal.pageSize.width
    this.margin = 20
    this.currentY = this.margin
  }

  private addText(text: string, x: number, y: number, options?: { fontSize?: number, fontStyle?: string }) {
    if (options?.fontSize) {
      this.doc.setFontSize(options.fontSize)
    }
    if (options?.fontStyle) {
      this.doc.setFont('helvetica', options.fontStyle as any)
    }
    this.doc.text(text, x, y)
  }

  private addLine(y: number) {
    this.doc.line(this.margin, y, this.pageWidth - this.margin, y)
  }

  private checkPageBreak(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage()
      this.currentY = this.margin
    }
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  generateProposalPDF(proposal: ProposalData): void {
    // Header
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.addText('PROPOSTA COMERCIAL', this.margin, this.currentY)
    this.currentY += 15

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.addText(`Proposta: ${proposal.id}`, this.margin, this.currentY)
    this.addText(`Data: ${this.formatDate(proposal.createdAt)}`, this.pageWidth - 80, this.currentY)
    this.currentY += 20

    // Linha separadora
    this.addLine(this.currentY)
    this.currentY += 15

    // Dados do Cliente
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.addText('DADOS DO CLIENTE', this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.addText(`Cliente: ${proposal.clientName}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`Empresa: ${proposal.clientCompany}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`E-mail: ${proposal.clientEmail}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`Telefone: ${proposal.clientPhone}`, this.margin, this.currentY)
    this.currentY += 6
    
    if (proposal.clientCNPJ) {
      this.addText(`CNPJ: ${proposal.clientCNPJ}`, this.margin, this.currentY)
      this.currentY += 6
    }
    this.currentY += 10

    // Dados do Projeto
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.addText('DADOS DO PROJETO', this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.addText(`Projeto: ${proposal.projectName}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`Tipo: ${proposal.projectType}`, this.margin, this.currentY)
    this.currentY += 6
    
    // Descrição com quebra de linha
    const description = this.doc.splitTextToSize(proposal.projectDescription, this.pageWidth - 2 * this.margin)
    this.addText('Descrição:', this.margin, this.currentY)
    this.currentY += 6
    this.doc.text(description, this.margin, this.currentY)
    this.currentY += description.length * 4 + 6

    if (proposal.deliveryDate) {
      this.addText(`Prazo de Entrega: ${this.formatDate(proposal.deliveryDate)}`, this.margin, this.currentY)
      this.currentY += 6
    }
    this.currentY += 10

    // Gerente de Contas
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.addText('GERENTE DE CONTAS', this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.addText(`Nome: ${proposal.managerName}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`E-mail: ${proposal.managerEmail}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`Telefone: ${proposal.managerPhone}`, this.margin, this.currentY)
    this.currentY += 6
    this.addText(`Departamento: ${proposal.managerDepartment}`, this.margin, this.currentY)
    this.currentY += 15

    // Orçamentos
    if (proposal.budgets.length > 0) {
      this.checkPageBreak(50)
      
      this.doc.setFontSize(14)
      this.doc.setFont('helvetica', 'bold')
      this.addText('ORÇAMENTOS DETALHADOS', this.margin, this.currentY)
      this.currentY += 15

      let totalGeral = 0

      proposal.budgets.forEach((budget, index) => {
        this.checkPageBreak(40)
        
        // Título do módulo
        this.doc.setFontSize(12)
        this.doc.setFont('helvetica', 'bold')
        const moduleTitle = budget.module === 'sales' ? 'VENDAS' : 
                           budget.module === 'rental' ? 'LOCAÇÃO' : 'SERVIÇOS'
        this.addText(`${index + 1}. ${moduleTitle}`, this.margin, this.currentY)
        this.currentY += 10

        // Cabeçalho da tabela
        this.doc.setFontSize(9)
        this.doc.setFont('helvetica', 'bold')
        this.addText('Descrição', this.margin, this.currentY)
        this.addText('Qtd', this.margin + 100, this.currentY)
        this.addText('Valor Unit.', this.margin + 120, this.currentY)
        this.addText('Total', this.margin + 160, this.currentY)
        this.currentY += 5
        this.addLine(this.currentY)
        this.currentY += 8

        // Itens do orçamento
        this.doc.setFont('helvetica', 'normal')
        budget.items.forEach((item) => {
          this.checkPageBreak(15)
          
          const description = this.doc.splitTextToSize(item.description, 90)
          this.doc.text(description, this.margin, this.currentY)
          this.addText(item.quantity.toString(), this.margin + 100, this.currentY)
          this.addText(this.formatCurrency(item.unitPrice), this.margin + 120, this.currentY)
          this.addText(this.formatCurrency(item.totalPrice), this.margin + 160, this.currentY)
          
          this.currentY += Math.max(description.length * 4, 8)
        })

        // Subtotal do módulo
        this.currentY += 5
        this.addLine(this.currentY)
        this.currentY += 8
        this.doc.setFont('helvetica', 'bold')
        this.addText(`Subtotal ${moduleTitle}:`, this.margin + 120, this.currentY)
        this.addText(this.formatCurrency(budget.totalValue), this.margin + 160, this.currentY)
        this.currentY += 15

        totalGeral += budget.totalValue
      })

      // Total Geral
      this.checkPageBreak(30)
      this.currentY += 10
      this.doc.setFontSize(14)
      this.doc.setFont('helvetica', 'bold')
      this.addLine(this.currentY)
      this.currentY += 10
      this.addText('TOTAL GERAL DA PROPOSTA:', this.margin + 80, this.currentY)
      this.addText(this.formatCurrency(totalGeral), this.margin + 160, this.currentY)
    }

    // Rodapé
    this.checkPageBreak(40)
    this.currentY = this.pageHeight - 40
    this.addLine(this.currentY)
    this.currentY += 10
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    this.addText('Esta proposta é válida por 30 dias a partir da data de emissão.', this.margin, this.currentY)
    this.currentY += 5
    this.addText('Valores sujeitos a alteração sem aviso prévio.', this.margin, this.currentY)
  }

  save(filename: string): void {
    this.doc.save(filename)
  }

  getBlob(): Blob {
    return this.doc.output('blob')
  }

  getDataURL(): string {
    return this.doc.output('dataurlstring')
  }
}

export function generateProposalPDF(proposal: ProposalData, action: 'save' | 'print' = 'save'): void {
  const generator = new ProposalPDFGenerator()
  generator.generateProposalPDF(proposal)
  
  if (action === 'save') {
    const filename = `proposta-${proposal.id}-${proposal.projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`
    generator.save(filename)
  } else if (action === 'print') {
    const blob = generator.getBlob()
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url)
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }
    }
  }
}