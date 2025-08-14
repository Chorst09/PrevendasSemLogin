"use client"

import { useState } from "react"
import { Laptop, Zap, FileText, Plus, ArrowLeft, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { RentalItem } from "@/lib/types/pricing"
import { pricingEngine } from "@/lib/utils/pricing-engine"

interface RentalModuleProps {
  onBack: () => void
}

export function RentalModule({ onBack }: RentalModuleProps) {
  const [contractPeriod, setContractPeriod] = useState(12)
  const [desiredMargin, setDesiredMargin] = useState(20)
  const [analysisTab, setAnalysisTab] = useState<"resumo" | "analise">("resumo")

  const [rentalItems, setRentalItems] = useState<RentalItem[]>([
    {
      id: "1",
      description: "Servidor Dell",
      quantity: 1,
      unitValue: 5000,
      totalValue: 5000,
      icmsCompra: 0,
      icmsPR: 12,
      difal: 681.82,
      freight: 0,
      totalActiveCost: 5681.82,
      monthlyActiveCost: 510.26,
      marginCommission: 210,
    },
  ])

  const addRentalItem = () => {
    const newItem: RentalItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitValue: 0,
      totalValue: 0,
      icmsCompra: 0,
      icmsPR: 12,
      difal: 0,
      freight: 0,
      totalActiveCost: 0,
      monthlyActiveCost: 0,
      marginCommission: 0,
    }
    setRentalItems([...rentalItems, newItem])
  }

  const removeRentalItem = (id: string) => {
    setRentalItems(rentalItems.filter((item) => item.id !== id))
  }

  const updateRentalItem = (id: string, field: keyof RentalItem, value: string | number) => {
    setRentalItems(
      rentalItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          if (field === "quantity" || field === "unitValue") {
            const calculation = pricingEngine.calculateRentalPrice(
              updatedItem.unitValue,
              updatedItem.quantity,
              contractPeriod,
              desiredMargin,
            )

            updatedItem.totalValue = calculation.baseCost * contractPeriod
            updatedItem.totalActiveCost = calculation.baseCost * contractPeriod + calculation.taxes * contractPeriod
            updatedItem.monthlyActiveCost = calculation.finalPrice
            updatedItem.marginCommission = calculation.marginCommission
            updatedItem.difal = calculation.taxes
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const totalMonthlyCost = rentalItems.reduce((sum, item) => sum + item.monthlyActiveCost, 0)
  const totalMarginCommission = rentalItems.reduce((sum, item) => sum + item.marginCommission, 0)
  const totalTaxes = rentalItems.reduce((sum, item) => sum + item.difal, 0)
  const finalSuggestedPrice = totalMonthlyCost

  const handleOptimizePrice = () => {
    alert("Funcionalidade de otimização com IA em desenvolvimento!")
  }

  const handleAddToBudget = () => {
    alert("Item adicionado ao orçamento com sucesso!")
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
              <h1 className="text-3xl font-bold text-white">Locação de TI</h1>
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-teal-100 text-lg mb-4">Sistema de Locação Inteligente</p>
            <Badge className="bg-teal-700 hover:bg-teal-600 text-white">Regime Tributário Ativo: Lucro Presumido</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="px-6">
        {/* Module Tab */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Laptop className="h-4 w-4 mr-2" />
              Locação
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
            <div className="grid grid-cols-12 gap-2 mb-4 text-sm font-medium border-b pb-2">
              <div className="col-span-3">Descrição</div>
              <div>QTD</div>
              <div>Unidade de Valor R$</div>
              <div>Valor Total R$</div>
              <div>ICMS Compra</div>
              <div>ICMS PR %</div>
              <div>DIFAL R$</div>
              <div>Frete R$</div>
              <div>Custo Total Ativo R$</div>
              <div>CT Mensalizado R$</div>
              <div>(Margem + Comissão)</div>
              <div></div>
            </div>

            {/* Table Rows */}
            {rentalItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-3">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateRentalItem(item.id, "description", e.target.value)}
                    className="w-full h-16 p-2 rounded resize-none border"
                    placeholder="Descrição detalhada do item"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateRentalItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.unitValue}
                    onChange={(e) => updateRentalItem(item.id, "unitValue", Number.parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.totalValue)}
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.icmsCompra}
                    onChange={(e) => updateRentalItem(item.id, "icmsCompra", Number.parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="text-sm text-teal-600">{item.icmsPR}%</div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.difal)}
                </div>
                <div>
                  <Input
                    type="number"
                    value={item.freight}
                    onChange={(e) => updateRentalItem(item.id, "freight", Number.parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.totalActiveCost)}
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.monthlyActiveCost)}
                </div>
                <div className="text-sm">
                  {pricingEngine.formatCurrency(item.marginCommission)}
                </div>
                <div>
                  <Button
                    onClick={() => removeRentalItem(item.id)}
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
              onClick={addRentalItem}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>

            {/* Total */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <div className="text-right">
                <div className="text-muted-foreground text-sm">Custo Base Mensal (Total)</div>
                <div className="text-lg font-semibold">
                  {pricingEngine.formatCurrency(totalMonthlyCost)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-teal-600" />
                <Label className="font-medium">Período do Contrato (meses)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={contractPeriod}
                  onChange={(e) => setContractPeriod(Number.parseInt(e.target.value) || 12)}
                  className="w-20"
                />
                <span className="text-teal-600 text-sm">meses</span>
              </div>
            </CardContent>
          </Card>

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
                      {pricingEngine.formatCurrency(totalMonthlyCost - totalMarginCommission - totalTaxes)}
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
                      <span className="text-slate-300">(-) Impostos</span>
                      <span className="text-red-400">
                        {pricingEngine.formatCurrency(totalTaxes)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 pb-2">
                      <span className="text-slate-300">(-) Custos Diretos</span>
                      <span className="text-red-400">
                        {pricingEngine.formatCurrency(totalMonthlyCost - totalMarginCommission - totalTaxes)}
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