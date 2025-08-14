"use client"

import { useState } from "react"
import { ShoppingCart, Calendar, Wrench, ArrowLeft, Laptop, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SalesModule } from "./SalesModule"
import { RentalModule } from "./RentalModule"
import { ServiceModule } from "./ServiceModule"

type ModuleType = "home" | "sales" | "rental" | "services"

export function ITPricingModule() {
  const [currentModule, setCurrentModule] = useState<ModuleType>("home")

  const handleBack = () => {
    setCurrentModule("home")
  }

  if (currentModule === "sales") {
    return <SalesModule onBack={handleBack} />
  }

  if (currentModule === "rental") {
    return <RentalModule onBack={handleBack} />
  }

  if (currentModule === "services") {
    return <ServiceModule onBack={handleBack} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Laptop className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">PricingPro TI</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            Sistema Completo de Precificação
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Precificação Inteligente para TI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema robusto para precificação de produtos, locação de equipamentos e serviços de TI. Baseado nas
            melhores práticas do mercado atual.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Módulos do Sistema</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Três módulos integrados para atender todas as necessidades de precificação do seu negócio de TI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Módulo de Vendas</CardTitle>
                <CardDescription>Precificação inteligente para produtos de hardware e software</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cálculo automático de preços</li>
                  <li>• Descontos por volume</li>
                  <li>• Margem de lucro configurável</li>
                  <li>• Geração de cotações</li>
                </ul>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setCurrentModule("sales")}
                >
                  Acessar Vendas
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Módulo de Locação</CardTitle>
                <CardDescription>Gestão completa de locação de equipamentos de TI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Preços por período flexível</li>
                  <li>• Controle de disponibilidade</li>
                  <li>• Taxas de setup e depósito</li>
                  <li>• Contratos automatizados</li>
                </ul>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setCurrentModule("rental")}
                >
                  Acessar Locação
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Módulo de Serviços</CardTitle>
                <CardDescription>Precificação de consultoria, suporte e implementação</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Múltiplos modelos de cobrança</li>
                  <li>• Taxas de emergência</li>
                  <li>• Agendamento integrado</li>
                  <li>• Propostas personalizadas</li>
                </ul>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setCurrentModule("services")}
                >
                  Acessar Serviços
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>
}