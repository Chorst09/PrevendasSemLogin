"use client"

import { useState } from "react"
import { Settings, Zap, ArrowLeft, Plus, Trash2, Briefcase, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { ServiceItem } from "@/lib/types/pricing"
import { pricingEngine } from "@/lib/utils/pricing-engine"
import { useProposalStore } from "@/lib/stores/proposal-store"

interface ServiceModuleProps {
  onBack: () => void
}

export function ServiceModule({ onBack }: ServiceModuleProps) {
  const { currentProposal, addBudgetToProposal } = useProposalStore()
  const [desiredMargin, setDesiredMargin] = useState(20)
  const [analysisTab, setAnalysisTab] = useState<"resumo" | "analise">("resumo")

  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    {
      id: "1",
      description: "Consultoria em TI",
      quantity: 1,
      unitValue: 150,
      totalValue: 6000,
      serviceType: "Consultoria",
      hourlyRate: 150,
      totalHours: 40,
      marginCommission: 1200,
    },
  ])

  const addServiceItem = () => {
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitValue: 0,
      totalValue: 0,
      serviceType: "Consultoria",
      hourlyRate: 0,
      totalHours: 0,
      marginCommission: 0,
    }
    setServiceItems([...serviceItems, newItem])
  }

  const removeServiceItem = (id: string) => {
    setServiceItems(serviceItems.filter((item) => item.id !== id))
  }

  const updateServiceItem = (id: string, field: keyof ServiceItem, value: string | number) => {
    setServiceItems(
      serviceItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          if (field === "hourlyRate" || field === "totalHours") {
            const calculation = pricingEngine.calculateServicePrice(
              updatedItem.hourlyRate,
              updatedItem.totalHours,
              desiredMargin,
            )

            updatedItem.totalValue = calculation.baseCost
            updatedItem.marginCommission = calculation.marginCommission
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const totalServiceCost = serviceItems.reduce((sum, item) => sum + item.totalValue, 0)
  const totalMarginCommission = serviceItems.reduce((sum, item) => sum + item.marginCommission, 0)

  const totalTaxes = serviceItems.reduce((sum, item) => {
    const calc = pricingEngine.calculateServicePrice(item.hourlyRate, item.totalHours, desiredMargin)
    return sum + calc.taxes
  }, 0)

  const finalSuggestedPrice = totalServiceCost + totalMarginCommission + totalTaxes

  const handleOptimizePrice = () => {
    alert("Funcionalidade de otimização com IA em desenvolvimento!")
  }

  const handleAddToBudget = () => {
    if (!currentProposal) {
      alert("Nenhuma proposta ativa encontrada!")
      return
    }

    const budgetItems = serviceItems.map(item => ({
      id: `ITEM-${Date.now()}-${Math.random()}`,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.hourlyRate,
      totalPrice: item.totalValue + item.marginCommission,
      module: 'services' as const,
      moduleData: item
    }))

    addBudgetToProposal(currentProposal.id, {
      module: 'services',
      items: budgetItems,
      totalValue: finalSuggestedPrice
    })

    alert(`Orçamento de serviços adicionado à proposta "${currentProposal.projectName}" com sucesso!`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Back Button */}
      <div className="mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Main Header */}
        <Card className="bg-gradient-to-r from-teal-600 to-blue-600 border-teal-500 mb-6">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Laptop className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Serviços de TI</h1>
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-teal-100 text-lg mb-4">Sistema de Serviços Inteligente</p>
            <Badge className="bg-teal-700 hover:bg-teal-600 text-white">Regime Tributário Ativo: Lucro Presumido</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="px-6">
        {/* Module Tab */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Serviços
            </Button>
          </div>
        </div>

        {/* Parameters Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-teal-600" />
              Parâmetros de Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table Header */}
            <div className="grid grid-cols-10 gap-2 mb-4 text-sm font-medium border-b pb-2">
              <div className="col-span-3">Descrição</div>
              <div>QTD</div>
              <div>Tipo de Serviço</div>
              <div>Valor/Hora R$</div>
              <div>Total Horas</div>
              <div>Valor Total R$</div>
              <div>(Margem + Comissão)</div>
              <div>Valor Final R$</div>
              <div></div>
            </div>

            {/* Table Rows */}
            {serviceItems.map((item) => (
              <div key={item.id} className="grid grid-cols-10 gap-2 mb-2 items-center">
                <div className="col-span-3">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateServiceItem(item.id, "description", e.target.value)}
                    className="w-full h-16 p-2 rounded resize-none border text-sm"
                    placeholder="Descrição detalhada do serviço"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateServiceItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <select
                    value={item.serviceType}
                    onChange={(e) => updateServiceItem(item.id, "serviceType", e.target.value)}
                    className="rounded px-2 py-1 w-full text-sm border"
                  >
                    <option value="Consultoria">Consultoria</option>
                    <option value="Suporte">Suporte</option>
                    <option value="Implementação">Implementação</option>
                    <option value="Treinamento">Treinamento</option>
                  </select>
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.hourlyRate}
                    onChange={(e) => updateServiceItem(item.id, "hourlyRate", Number.parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.totalHours}
                    onChange={(e) => updateServiceItem(item.id, "totalHours", Number.parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.totalValue)}
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.marginCommission)}
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.totalValue + item.marginCommission)}
                </div>
                <div>
                  <Button
                    onClick={() => removeServiceItem(item.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add Item Button */}
            <Button
              onClick={addServiceItem}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>

            {/* Total */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <div className="text-right">
                <div className="text-muted-foreground text-sm">Custo Base Total</div>
                <div className="text-lg font-semibold">
                  {pricingEngine.formatCurrency(totalServiceCost)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-teal-600" />
                <Label className="font-medium">Margem de Lucro Desejada</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={desiredMargin}
                  onChange={(e) => setDesiredMargin(Number.parseInt(e.target.value) || 20)}
                  className="w-20"
                />
                <span className="text-teal-600 text-sm">%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results and Analysis Section */}
        <Card className="bg-gradient-to-r from-teal-600 to-blue-600 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">📊 Resultados e Análise</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Analysis Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setAnalysisTab("resumo")}
                className={`flex-1 rounded-r-none ${analysisTab === "resumo" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent hover:bg-white/10"} text-white`}
              >
                📊 Resumo
              </Button>
              <Button
                onClick={() => setAnalysisTab("analise")}
                className={`flex-1 rounded-l-none ${analysisTab === "analise" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent hover:bg-white/10"} text-white`}
              >
                📋 Análise
              </Button>
            </div>

            {analysisTab === "resumo" ? (
              <div className="space-y-6">
                {/* Final Price */}
                <div className="text-center">
                  <p className="text-gray-300 mb-2">Preço Final Sugerido</p>
                  <p className="text-5xl font-bold text-blue-300">
                    {pricingEngine.formatCurrency(finalSuggestedPrice)}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-gray-300 text-sm mb-1">CUSTO BASE</p>
                    <p className="text-2xl font-bold">
                      {pricingEngine.formatCurrency(totalServiceCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-1">MARGEM+COM</p>
                    <p className="text-2xl font-bold">
                      {pricingEngine.formatCurrency(totalMarginCommission)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-1">IMPOSTOS</p>
                    <p className="text-2xl font-bold">
                      {pricingEngine.formatCurrency(totalTaxes)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={handleOptimizePrice} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
                    💡 Otimizar Preço com IA
                  </Button>
                  <Button onClick={handleAddToBudget} className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                    ✅ Adicionar ao Orçamento
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-white text-lg font-semibold">Análise DRE - Demonstrativo de Resultado</h3>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-600 pb-2">
                      <span className="text-slate-300">Receita Bruta</span>
                      <span className="text-green-400 font-semibold">
                        {pricingEngine.formatCurrency(finalSuggestedPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">(-) Impostos sobre Serviços</span>
                      <span className="text-red-400">
                        {pricingEngine.formatCurrency(totalTaxes)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 pb-2">
                      <span className="text-slate-300">(-) Custos Diretos</span>
                      <span className="text-red-400">
                        {pricingEngine.formatCurrency(totalServiceCost)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Lucro Líquido</span>
                      <span className="text-green-400">
                        {pricingEngine.formatCurrency(totalMarginCommission)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Margem Líquida</span>
                      <span className="text-teal-400">
                        {((totalMarginCommission / finalSuggestedPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}