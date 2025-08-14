"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TaxRegime } from '@/lib/types/tax-regimes'
import type { CostsExpenses } from '@/lib/types/costs-expenses'
import type { LaborCosts } from '@/lib/types/labor-costs'
import type { CompanyData } from '@/lib/types/company-data'
import { initialTaxRegimes } from '@/lib/types/tax-regimes'
import { initialCostsExpenses } from '@/lib/types/costs-expenses'
import { initialLaborCosts } from '@/lib/types/labor-costs'
import { defaultCompanyData } from '@/lib/types/company-data'
import { defaultICMSRates, type ICMSInterstateRates } from '@/lib/types/pricing'

interface ConfigurationStore {
  taxRegimes: TaxRegime[]
  costsExpenses: CostsExpenses
  laborCosts: LaborCosts
  companyData: CompanyData
  icmsRates: ICMSInterstateRates
  
  // Actions
  updateTaxRegime: (id: string, updates: Partial<TaxRegime>) => void
  toggleTaxRegimeActive: (id: string) => void
  updateCostsExpenses: (updates: Partial<CostsExpenses>) => void
  updateLaborCosts: (updates: Partial<LaborCosts>) => void
  updateCompanyData: (updates: Partial<CompanyData>) => void
  updateICMSRates: (updates: Partial<ICMSInterstateRates>) => void
  getActiveTaxRegime: () => TaxRegime | undefined
}

export const useConfigurationStore = create<ConfigurationStore>()(
  persist(
    (set, get) => ({
      taxRegimes: initialTaxRegimes,
      costsExpenses: initialCostsExpenses,
      laborCosts: initialLaborCosts,
      companyData: defaultCompanyData,
      icmsRates: defaultICMSRates,

      updateTaxRegime: (id, updates) => {
        set((state) => ({
          taxRegimes: state.taxRegimes.map(regime =>
            regime.id === id 
              ? { ...regime, ...updates, updatedAt: new Date() }
              : regime
          )
        }))
      },

      toggleTaxRegimeActive: (id) => {
        set((state) => ({
          taxRegimes: state.taxRegimes.map(regime =>
            regime.id === id 
              ? { ...regime, active: !regime.active, updatedAt: new Date() }
              : regime
          )
        }))
      },

      updateCostsExpenses: (updates) => {
        set((state) => ({
          costsExpenses: { 
            ...state.costsExpenses, 
            ...updates, 
            updatedAt: new Date() 
          }
        }))
      },

      updateLaborCosts: (updates) => {
        set((state) => ({
          laborCosts: { 
            ...state.laborCosts, 
            ...updates, 
            updatedAt: new Date() 
          }
        }))
      },

      updateCompanyData: (updates) => {
        set((state) => ({
          companyData: { 
            ...state.companyData, 
            ...updates, 
            updatedAt: new Date() 
          }
        }))
      },

      updateICMSRates: (updates) => {
        set((state) => ({
          icmsRates: { 
            ...state.icmsRates, 
            ...updates 
          }
        }))
      },

      getActiveTaxRegime: () => {
        return get().taxRegimes.find(regime => regime.active)
      }
    }),
    {
      name: 'configuration-storage',
    }
  )
)