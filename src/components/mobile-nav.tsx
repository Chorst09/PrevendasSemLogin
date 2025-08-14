"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"

interface MobileNavProps {
  onNavigate: (module: string) => void
}

export function MobileNav({ onNavigate }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleNavigation = (module: string) => {
    onNavigate(module)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          <Button
            variant="ghost"
            className="justify-start text-lg font-medium hover:text-primary transition-colors"
            onClick={() => handleNavigation("sales")}
          >
            Vendas
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-lg font-medium hover:text-primary transition-colors"
            onClick={() => handleNavigation("rental")}
          >
            Locação
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-lg font-medium hover:text-primary transition-colors"
            onClick={() => handleNavigation("services")}
          >
            Serviços
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-lg font-medium hover:text-primary transition-colors"
            onClick={() => handleNavigation("admin")}
          >
            Admin
          </Button>
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm font-medium">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}