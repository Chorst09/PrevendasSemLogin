"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Trash2, ArrowLeft, Laptop, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ModuleShortcuts } from "./ModuleShortcuts"
import type { ProductItem, ICMSInterstateRates } from "@/lib/types/pricing"
import { defaultICMSRates, stateNames } from "@/lib/types/pricing"
import { pricingEngine } from "@/lib/utils/pricing-engine"
import { useProposalStore } from "@/lib/stores/proposal-store"

interface SalesModuleProps {
  onBack: () => void
  onModuleChange?: (module: 'sales' | 'rental' | 'services') => void
}

export function SalesModule({ onBack, onModuleChange }: SalesModuleProps) {
  const { currentProposal, addBudgetToProposal } = useProposalStore()
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: "1",
      description: "Servidor Dell",
      quantity: 1,
      unitCost: 8500,
      icmsCredit: 1020,
      totalCost: 8500,
      icmsSalePercent: 12,
      icmsDestLocalPercent: defaultICMSRates["SP"],
      difalSale: 0,
      icmsST: false,
      marginCommission: 2234.29,
      taxes: 1802.35,
      grossRevenue: 11516.64,
    },
  ])

  const [desiredMargin, setDesiredMargin] = useState(20)
  const [isFinalConsumer, setIsFinalConsumer] = useState(false)
  const [destinationUF, setDestinationUF] = useState<keyof ICMSInterstateRates>("SP")
  const [analysisTab, setAnalysisTab] = useState<"resumo" | "analise">("resumo")

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitCost: 0,
      icmsCredit: 0,
      totalCost: 0,
      icmsSalePercent: 12,
      icmsDestLocalPercent: defaultICMSRates[destinationUF],
      difalSale: 0,
      icmsST: false,
      marginCommission: 0,
      taxes: 0,
      grossRevenue: 0,
    }
    setProducts([...products, newProduct])
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const updateProduct = (id: string, field: keyof ProductItem, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value }
          if (field === "quantity" || field === "unitCost") {
            updated.totalCost = updated.quantity * updated.unitCost
            const calculation = pricingEngine.calculateSalesPrice(updated.unitCost, updated.quantity, desiredMargin)
            updated.marginCommission = calculation.marginCommission
            updated.taxes = calculation.taxes
            updated.grossRevenue = calculation.finalPrice
            updated.difalSale = pricingEngine.calculateDIFAL(updated, destinationUF, defaultICMSRates)
          }
          return updated
        }
        return p
      }),
    )
  }

  const getTotals = () => {
    return products.reduce(
      (acc, product) => ({
        baseCost: acc.baseCost + product.totalCost,
        marginCommission: acc.marginCommission + product.marginCommission,
        taxes: acc.taxes + product.taxes,
        grossRevenue: acc.grossRevenue + product.grossRevenue,
      }),
      { baseCost: 0, marginCommission: 0, taxes: 0, grossRevenue: 0 },
    )
  }

  const totals = getTotals()
  const suggestedPrice = totals.grossRevenue

  const handleOptimizePrice = () => {
    alert("Funcionalidade de otimização com IA em desenvolvimento!")
  }

  const handleAddToBudget = () => {
    if (!currentProposal) {
      alert("Nenhuma proposta ativa encontrada!")
      return
    }

    const budgetItems = products.map(product => ({
      id: `ITEM-${Date.now()}-${Math.random()}`,
      description: product.description,
      quantity: product.quantity,
      unitPrice: product.unitCost,
      totalPrice: product.grossRevenue,
      module: 'sales' as const,
      moduleData: product
    }))

    addBudgetToProposal(currentProposal.id, {
      module: 'sales',
      items: budgetItems,
      totalValue: totals.grossRevenue
    })

    alert(`Orçamento de vendas adicionado à proposta "${currentProposal.projectName}" com sucesso!`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Back Button and Title */}
      <div className="mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
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
              <h1 className="text-3xl font-bold text-white">Vendas de TI</h1>
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-teal-100 text-lg mb-4">Sistema de Vendas Inteligente</p>
            <Badge className="bg-teal-700 hover:bg-teal-600 text-white">Regime Tributário Ativo: Lucro Presumido</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="px-6">
        {/* Module Shortcuts */}
        {onModuleChange && (
          <ModuleShortcuts 
            currentModule="sales" 
            onModuleChange={onModuleChange}
          />
        )}

        {/* Module Tab */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Venda
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-teal-600" />
                Parâmetros de Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 w-64">Descrição</th>
                      <th className="text-left p-2">Qtde</th>
                      <th className="text-left p-2">Custo Unit. R$</th>
                      <th className="text-left p-2">Créd. ICMS R$</th>
                      <th className="text-left p-2">Custo Total</th>
                      <th className="text-left p-2">ICMS Venda %</th>
                      <th className="text-left p-2">ICMS Dest. Local %</th>
                      <th className="text-left p-2">DIFAL Venda</th>
                      <th className="text-left p-2">ICMS ST</th>
                      <th className="text-left p-2">(Margem+Comissão)</th>
                      <th className="text-left p-2">Impostos</th>
                      <th className="text-left p-2">Receita Bruta</th>
                      <th className="text-left p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">
                          <textarea
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                            className="w-60 h-16 p-2 rounded resize-none border"
                            placeholder="Descrição detalhada do produto"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, "quantity", Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={product.unitCost}
                            onChange={(e) =>
                              updateProduct(product.id, "unitCost", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-24"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={product.icmsCredit}
                            onChange={(e) =>
                              updateProduct(product.id, "icmsCredit", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-24"
                          />
                        </td>
                        <td className="p-2 font-medium">{pricingEngine.formatCurrency(product.totalCost)}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={product.icmsSalePercent}
                              onChange={(e) =>
                                updateProduct(product.id, "icmsSalePercent", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-16"
                            />
                            <span className="text-teal-600">%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={product.icmsDestLocalPercent}
                              onChange={(e) =>
                                updateProduct(product.id, "icmsDestLocalPercent", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-16"
                            />
                            <span className="text-teal-600">%</span>
                          </div>
                        </td>
                        <td className="p-2 font-medium">{pricingEngine.formatCurrency(product.difalSale)}</td>
                        <td className="p-2">
                          <Checkbox
                            checked={product.icmsST}
                            onCheckedChange={(checked) => updateProduct(product.id, "icmsST", checked)}
                          />
                        </td>
                        <td className="p-2 font-medium">{pricingEngine.formatCurrency(product.marginCommission)}</td>
                        <td className="p-2 font-medium">{pricingEngine.formatCurrency(product.taxes)}</td>
                        <td className="p-2 font-medium">{pricingEngine.formatCurrency(product.grossRevenue)}</td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={addProduct}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <Label>Margem de Lucro Desejada</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={desiredMargin}
                    onChange={(e) => setDesiredMargin(Number.parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-teal-600">%</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="finalConsumer"
                    checked={isFinalConsumer}
                    onCheckedChange={setIsFinalConsumer}
                  />
                  <Label htmlFor="finalConsumer">
                    Consumidor Final é Contribuinte do ICMS?
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>UF Destino:</Label>
                  <Select value={destinationUF} onValueChange={(value) => setDestinationUF(value as keyof ICMSInterstateRates)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.entries(stateNames).map(([uf, name]) => (
                        <SelectItem key={uf} value={uf}>
                          {uf} - {defaultICMSRates[uf as keyof ICMSInterstateRates]}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results and Analysis section */}
          <Card className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl">📊 Resultados e Análise</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex mb-6">
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
                <>
                  {/* Price Display */}
                  <div className="text-center mb-8">
                    <p className="text-gray-300 mb-2">Preço Final Sugerido</p>
                    <p className="text-5xl font-bold text-blue-300 mb-8">{pricingEngine.formatCurrency(suggestedPrice)}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <p className="text-gray-300 text-sm mb-1">CUSTO BASE</p>
                      <p className="text-2xl font-bold">{pricingEngine.formatCurrency(totals.baseCost)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300 text-sm mb-1">MARGEM+COM</p>
                      <p className="text-2xl font-bold">{pricingEngine.formatCurrency(totals.marginCommission)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300 text-sm mb-1">IMPOSTOS</p>
                      <p className="text-2xl font-bold">{pricingEngine.formatCurrency(totals.taxes)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <Button
                      onClick={handleOptimizePrice}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg"
                    >
                      💡 Otimizar Preço com IA
                    </Button>
                    <Button
                      onClick={handleAddToBudget}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                    >
                      ✅ Adicionar ao Orçamento
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-white text-lg font-semibold">Análise DRE - Demonstrativo de Resultado</h3>
                  <div className="bg-slate-900 p-6 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-600 pb-2">
                        <span className="text-slate-300">Receita Bruta</span>
                        <span className="text-green-400 font-semibold">{pricingEngine.formatCurrency(suggestedPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">(-) Impostos</span>
                        <span className="text-red-400">{pricingEngine.formatCurrency(totals.taxes)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-600 pb-2">
                        <span className="text-slate-300">(-) Custos Diretos</span>
                        <span className="text-red-400">{pricingEngine.formatCurrency(totals.baseCost)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Lucro Líquido</span>
                        <span className="text-green-400">{pricingEngine.formatCurrency(totals.marginCommission)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Margem Líquida</span>
                        <span className="text-teal-400">
                          {((totals.marginCommission / suggestedPrice) * 100).toFixed(1)}%
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
    </div>
  )
}