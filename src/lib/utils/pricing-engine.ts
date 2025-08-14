import type { PricingCalculation } from "@/lib/types/pricing"

export class PricingEngine {
  // Configurações padrão
  private readonly DEFAULT_TAX_RATE = 0.15 // 15% de impostos
  private readonly DEFAULT_COMMISSION_RATE = 0.05 // 5% de comissão

  calculateSalesPrice(
    unitCost: number,
    quantity: number,
    desiredMargin: number
  ): PricingCalculation {
    const baseCost = unitCost * quantity
    const marginCommission = baseCost * (desiredMargin / 100)
    const taxes = (baseCost + marginCommission) * this.DEFAULT_TAX_RATE
    const finalPrice = baseCost + marginCommission + taxes

    return {
      baseCost,
      marginCommission,
      taxes,
      finalPrice
    }
  }

  calculateRentalPrice(
    unitValue: number,
    quantity: number,
    contractPeriod: number,
    desiredMargin: number
  ): PricingCalculation {
    const baseCost = (unitValue * quantity) / contractPeriod
    const marginCommission = baseCost * (desiredMargin / 100)
    const taxes = (baseCost + marginCommission) * this.DEFAULT_TAX_RATE
    const finalPrice = baseCost + marginCommission + taxes

    return {
      baseCost,
      marginCommission,
      taxes,
      finalPrice
    }
  }

  calculateServicePrice(
    hourlyRate: number,
    totalHours: number,
    desiredMargin: number
  ): PricingCalculation {
    const baseCost = hourlyRate * totalHours
    const marginCommission = baseCost * (desiredMargin / 100)
    const taxes = (baseCost + marginCommission) * 0.11 // ISS + outros impostos sobre serviços
    const finalPrice = baseCost + marginCommission + taxes

    return {
      baseCost,
      marginCommission,
      taxes,
      finalPrice
    }
  }

  calculateDIFAL(
    product: any,
    destinationUF: string,
    icmsRates: any
  ): number {
    // Cálculo simplificado do DIFAL
    const icmsOrigin = 12 // SP
    const icmsDestination = icmsRates[destinationUF] || 7
    const difference = icmsDestination - icmsOrigin
    
    if (difference > 0) {
      return (product.totalCost * difference) / 100
    }
    
    return 0
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
}

export const pricingEngine = new PricingEngine()