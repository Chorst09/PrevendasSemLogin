"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Settings, Building, Calculator, BarChart3, Users, Edit, Save } from "lucide-react"
import type { TaxRegime } from "@/lib/types/tax-regimes"
import type { CostsExpenses } from "@/lib/types/costs-expenses"
import type { LaborCosts } from "@/lib/types/labor-costs"
import type { CompanyData } from "@/lib/types/company-data"
import { initialTaxRegimes } from "@/lib/types/tax-regimes"
import { initialCostsExpenses } from "@/lib/types/costs-expenses"
import { initialLaborCosts } from "@/lib/types/labor-costs"
import { defaultCompanyData } from "@/lib/types/company-data"
import { defaultICMSRates, stateNames, type ICMSInterstateRates } from "@/lib/types/pricing"

export function ConfigurationModule() {
  const [taxRegimes, setTaxRegimes] = useState<TaxRegime[]>(initialTaxRegimes)
  const [costsExpenses, setCostsExpenses] = useState<CostsExpenses>(initialCostsExpenses)
  const [laborCosts, setLaborCosts] = useState<LaborCosts>(initialLaborCosts)
  const [companyData, setCompanyData] = useState<CompanyData>(defaultCompanyData)
  const [icmsRates, setIcmsRates] = useState<ICMSInterstateRates>(defaultICMSRates)
  
  const [isEditingCosts, setIsEditingCosts] = useState(false)
  const [isEditingLabor, setIsEditingLabor] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [isEditingICMS, setIsEditingICMS] = useState(false)
  const [editingRegime, setEditingRegime] = useState<TaxRegime | null>(null)

  const handleToggleActive = (id: string) => {
    setTaxRegimes((regimes) =>
      regimes.map((regime) =>
        regime.id === id ? { ...regime, active: !regime.active, updatedAt: new Date() } : regime,
      ),
    )
  }

  const handleUpdateRegime = (field: keyof TaxRegime, value: number, id: string) => {
    setTaxRegimes((regimes) =>
      regimes.map((regime) =>
        regime.id === id ? { ...regime, [field]: value, updatedAt: new Date() } : regime,
      ),
    )
  }

  const handleSaveCosts = () => {
    setCostsExpenses({ ...costsExpenses, updatedAt: new Date() })
    setIsEditingCosts(false)
  }

  const handleSaveLabor = () => {
    // Recalcular valores
    const totalEncargos = laborCosts.ferias + laborCosts.umTercoFerias + laborCosts.decimoTerceiro + 
                         laborCosts.inssBase + laborCosts.inssSistemaS + laborCosts.inssFeriasDecimo +
                         laborCosts.fgts + laborCosts.fgtsFeriasDecimo + laborCosts.multaFgtsRescisao + laborCosts.outros
    
    const totalBeneficios = laborCosts.valeTransporte + laborCosts.planoSaude + laborCosts.valeAlimentacao
    
    const horasMes = laborCosts.diasUteisNoMes * laborCosts.horasPorDia
    const custoHora = (laborCosts.salarioBasePadrao * (1 + totalEncargos / 100) + totalBeneficios) / horasMes
    const valorVendaHora = custoHora * 1.66 // Aplicando margem padrão
    
    setLaborCosts({
      ...laborCosts,
      totalEncargos,
      totalBeneficios,
      custoHora,
      valorVendaHora,
      updatedAt: new Date()
    })
    setIsEditingLabor(false)
  }

  const handleSaveCompany = () => {
    setIsEditingCompany(false)
  }

  const handleSaveICMS = () => {
    setIsEditingICMS(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações Gerais e Tributárias</h2>
          <p className="text-muted-foreground">Gerencie regimes tributários, custos e dados da empresa</p>
        </div>
      </div>

      <Tabs defaultValue="regimes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="regimes" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Regimes Tributários
          </TabsTrigger>
          <TabsTrigger value="custos" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Custos e Despesas
          </TabsTrigger>
          <TabsTrigger value="mao-obra" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Mão de Obra
          </TabsTrigger>
          <TabsTrigger value="icms" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            ICMS Interestadual
          </TabsTrigger>
          <TabsTrigger value="empresa" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Dados da Empresa
          </TabsTrigger>
        </TabsList>

        {/* Regimes Tributários */}
        <TabsContent value="regimes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gerenciar Regimes</h3>
          </div>

          <div className="space-y-4">
            {taxRegimes.map((regime) => (
              <Card key={regime.id} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{regime.name}</CardTitle>
                      <Badge variant={regime.active ? "default" : "secondary"}>
                        {regime.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={regime.active} onCheckedChange={() => handleToggleActive(regime.id)} />
                      <Button variant="ghost" size="sm" onClick={() => setEditingRegime(regime)}>
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">PIS</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.pis} 
                          onChange={(e) => handleUpdateRegime('pis', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">COFINS</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.cofins} 
                          onChange={(e) => handleUpdateRegime('cofins', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">CSLL</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.csll} 
                          onChange={(e) => handleUpdateRegime('csll', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">IRPJ</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.irpj} 
                          onChange={(e) => handleUpdateRegime('irpj', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">ICMS</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.icms} 
                          onChange={(e) => handleUpdateRegime('icms', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">ISS</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.iss} 
                          onChange={(e) => handleUpdateRegime('iss', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Base Presunção Venda</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.basePresuncaoVenda} 
                          onChange={(e) => handleUpdateRegime('basePresuncaoVenda', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Base Presunção Serviço</Label>
                      <div className="flex items-center gap-1">
                        <Input 
                          value={regime.basePresuncaoServico} 
                          onChange={(e) => handleUpdateRegime('basePresuncaoServico', Number(e.target.value), regime.id)}
                          className="text-center" 
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custos e Despesas */}
        <TabsContent value="custos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custos e Despesas Globais (%)</CardTitle>
                <Button onClick={() => setIsEditingCosts(!isEditingCosts)} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {isEditingCosts ? 'Salvar' : 'Editar'} Configurações
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comissão Venda</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.comissaoVenda} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, comissaoVenda: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comissão Locação</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.comissaoLocacao} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, comissaoLocacao: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comissão Serviço</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.comissaoServico} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, comissaoServico: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Margem Lucro Serviço</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.margemLucroServico} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, margemLucroServico: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Despesas Admin.</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.despesasAdmin} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, despesasAdmin: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Outras Despesas</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.outrasDespesas} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, outrasDespesas: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custo Financeiro Mensal</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.custoFinanceiroMensal} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, custoFinanceiroMensal: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Taxa Desconto VPL</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.taxaDescontoVPL} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, taxaDescontoVPL: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Depreciação</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={costsExpenses.depreciacao} 
                      onChange={(e) => setCostsExpenses({...costsExpenses, depreciacao: Number(e.target.value)})}
                      readOnly={!isEditingCosts}
                      className="text-center" 
                    />
                    <span className="text-sm text-primary font-medium">%</span>
                  </div>
                </div>
              </div>
              {isEditingCosts && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveCosts} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mão de Obra */}
        <TabsContent value="mao-obra">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gasto com Mão de Obra</CardTitle>
                <Button onClick={() => setIsEditingLabor(!isEditingLabor)} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {isEditingLabor ? 'Salvar' : 'Editar'} Configurações
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Encargos Sociais */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Encargos Sociais (CLT)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Férias</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.ferias} 
                            onChange={(e) => setLaborCosts({...laborCosts, ferias: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">1/3 Férias</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.umTercoFerias} 
                            onChange={(e) => setLaborCosts({...laborCosts, umTercoFerias: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">13º Salário</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.decimoTerceiro} 
                            onChange={(e) => setLaborCosts({...laborCosts, decimoTerceiro: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">INSS (Base)</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.inssBase} 
                            onChange={(e) => setLaborCosts({...laborCosts, inssBase: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">FGTS</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.fgts} 
                            onChange={(e) => setLaborCosts({...laborCosts, fgts: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Outros</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.outros} 
                            onChange={(e) => setLaborCosts({...laborCosts, outros: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Encargos:</span>
                        <span className="text-lg font-bold text-primary">{laborCosts.totalEncargos.toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefícios */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Benefícios (CLT)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Vale Transporte</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.valeTransporte} 
                            onChange={(e) => setLaborCosts({...laborCosts, valeTransporte: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">R$</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Plano de Saúde</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.planoSaude} 
                            onChange={(e) => setLaborCosts({...laborCosts, planoSaude: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">R$</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Vale Alimentação</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.valeAlimentacao} 
                            onChange={(e) => setLaborCosts({...laborCosts, valeAlimentacao: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">R$</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Benefícios:</span>
                        <span className="text-lg font-bold text-primary">
                          R$ {laborCosts.totalBeneficios.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parâmetros Gerais */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Parâmetros Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Salário Base Padrão</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={laborCosts.salarioBasePadrao} 
                            onChange={(e) => setLaborCosts({...laborCosts, salarioBasePadrao: Number(e.target.value)})}
                            readOnly={!isEditingLabor}
                            className="text-center" 
                          />
                          <span className="text-sm text-primary font-medium">R$</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Dias Úteis no Mês</Label>
                        <Input 
                          value={laborCosts.diasUteisNoMes} 
                          onChange={(e) => setLaborCosts({...laborCosts, diasUteisNoMes: Number(e.target.value)})}
                          readOnly={!isEditingLabor}
                          className="text-center" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Horas/Dia</Label>
                        <Input 
                          value={laborCosts.horasPorDia} 
                          onChange={(e) => setLaborCosts({...laborCosts, horasPorDia: Number(e.target.value)})}
                          readOnly={!isEditingLabor}
                          className="text-center" 
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-primary" />
                          <span className="font-medium">Custo/Hora (CLT)</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          R$ {laborCosts.custoHora.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💰</span>
                          <span className="font-medium">Valor/Venda (Hora)</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          R$ {laborCosts.valorVendaHora.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {isEditingLabor && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveLabor} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar e Recalcular
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ICMS Interestadual */}
        <TabsContent value="icms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Taxas ICMS Interestaduais (%)</CardTitle>
                <Button onClick={() => setIsEditingICMS(!isEditingICMS)} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {isEditingICMS ? 'Salvar' : 'Editar'} Taxas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {Object.entries(stateNames).map(([uf, name]) => (
                  <div key={uf} className="space-y-2">
                    <Label className="text-sm font-medium">{uf}</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        value={icmsRates[uf as keyof ICMSInterstateRates]}
                        onChange={(e) => setIcmsRates({...icmsRates, [uf]: Number(e.target.value)})}
                        readOnly={!isEditingICMS}
                        className="text-center text-sm"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
              {isEditingICMS && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveICMS} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Taxas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dados da Empresa */}
        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dados da Empresa</CardTitle>
                <Button onClick={() => setIsEditingCompany(!isEditingCompany)} className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {isEditingCompany ? 'Salvar' : 'Editar'} Dados
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Razão Social / Nome Fantasia</Label>
                  <Input
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    readOnly={!isEditingCompany}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">CNPJ</Label>
                  <Input
                    value={companyData.cnpj}
                    onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
                    readOnly={!isEditingCompany}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Endereço</Label>
                  <Input
                    value={companyData.address}
                    onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                    readOnly={!isEditingCompany}
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cidade - Estado</Label>
                  <Input
                    value={companyData.cityState}
                    onChange={(e) => setCompanyData({...companyData, cityState: e.target.value})}
                    readOnly={!isEditingCompany}
                    placeholder="Cidade - UF"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Telefone</Label>
                  <Input
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    readOnly={!isEditingCompany}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">E-mail</Label>
                  <Input
                    value={companyData.email}
                    onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                    readOnly={!isEditingCompany}
                    placeholder="contato@empresa.com"
                  />
                </div>
              </div>
              {isEditingCompany && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveCompany} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Dados
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}