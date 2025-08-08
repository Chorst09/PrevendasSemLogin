// src/app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react'; // Mantenha todos os hooks necessários
// Importação de useAuth removida
// import { useAuth } from "@/hooks/use-auth";
import { useRouter } from 'next/navigation';
import {
    Loader2, LogOut, User, Briefcase, BarChart, Search,
    Users, DollarSign, Archive, Calculator, PlusCircle,
    Trash2, Edit, Building, ShoppingCart, ExternalLink, FileDown, Paperclip,
    X, Server, Headset, Printer, ChevronDown, Tag, Info, Settings, FileText,
    BarChart2, TrendingUp, Percent, ShoppingBag, Repeat, Wrench, Zap,
    CheckCircle, Award, Gavel, Moon, Sun, Brain, Phone // Ícones para o botão de tema
} from 'lucide-react'; // Importe todos os ícones usados diretamente aqui

// Importe seus componentes de UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Importe seus componentes de View
import DashboardView from '@/components/dashboard/DashboardView';
import PartnerView from '@/components/partners/PartnerView';
import QuotesView from '@/components/quotes/QuotesView';
import ProposalsView from '@/components/proposals/ProposalsView';
import RoManagementView from '@/components/ro-management/RoManagementView';
import TrainingManagementView from '@/components/training-management/TrainingManagementView';
import CalculatorFrame from '@/components/calculators/CalculatorFrame';
import BidsAnalysis from '@/components/bids/BidsAnalysis';
import BidsDocumentationView from '@/components/bids/BidsDocumentationView';
import RFPView from '@/components/rfp/RFPView';
import PriceRecordView from '@/components/price-records/PriceRecordView';
import EditalAnalysisView from '@/components/edital-analysis/EditalAnalysisView';
import EditalAnalyzer from '@/components/edital-analyzer/EditalAnalyzer';
import VMCalculator from '@/components/calculators/VMCalculator';
import PABXSIPCalculator from '@/components/calculators/PABXSIPCalculator';

// Importe dados e tipos se ainda usados aqui
import type { Partner, Quote, RO, Training, BidDocs, NavItem, NavSubItem, Proposal, RFP, PriceRecord, Edital } from '@/lib/types';
import { initialPartners, initialQuotes, initialRos, initialTrainings, initialBidDocs, initialProposals, initialRFPs, initialPriceRecords, initialEditais, salesData, quoteStatusData } from '@/lib/data';

// Importe o hook useTheme
import { useTheme } from 'next-themes'; // <--- ADICIONADO ESTE IMPORT


export default function App() { // Ou Home
    // Chamada e uso de useAuth removidos
    // const { user, loading, logout } = useAuth();
    const router = useRouter();
    // Use useTheme() para gerenciar o tema (chamado incondicionalmente)
    const { theme, setTheme } = useTheme(); // <-- useTheme chamado incondicionalmente
    const [mounted, setMounted] = useState(false); // Estado para verificar se montou no cliente

    const [activeTab, setActiveTab] = useState('dashboard'); // Estado da aba ativa
    // Você pode remover ou adaptar estes estados se os componentes de view gerenciarem seus próprios dados carregados do Firestore
    const [partners, setPartners] = useState<Partner[]>(initialPartners); // Exemplo: Manter se necessário para dados locais/testes
    const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
    const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
    const [rfps, setRfps] = useState<RFP[]>(initialRFPs);
    const [priceRecords, setPriceRecords] = useState<PriceRecord[]>(initialPriceRecords);
    const [editais, setEditais] = useState<Edital[]>(initialEditais);
    const [ros, setRos] = useState<RO[]>(initialRos);
    const [trainings, setTrainings] = useState<Training[]>(initialTrainings);
    const [bidDocs, setBidDocs] = useState<BidDocs>(initialBidDocs);

    // Estado para controlar se as seções colapsáveis estão abertas (adapte)
    const [openSections, setOpenSections] = useState({
        suppliers: true,
        pricing: true,
        bids: true,
    });


    // Efeito para verificar montagem no cliente (útil para coisas como useTheme)
    useEffect(() => {
        setMounted(true);
    }, []);


    // Efeito para redirecionamento removido
    // useEffect(() => { ... }, [user, loading, router]);


    // Definição dos Itens de Navegação (adapte do seu código original)
    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart size={20} /> },
        { id: 'distributors', label: 'Distribuidores', icon: <ShoppingCart size={20} /> },
        {
            id: 'suppliers',
            label: 'Fornecedores',
            icon: <Building size={20} />,
            subItems: [
                { id: 'suppliers-register', label: 'Cadastro', icon: <Users size={16} /> },
                { id: 'ro-management', label: 'Gestão de RO’s', icon: <FileText size={16} /> },
                { id: 'training-management', label: 'Gestão de Treinamentos', icon: <Award size={16} /> },
            ]
        },
        { id: 'quotes', label: 'Orçamentos', icon: <Briefcase size={20} /> },
        { id: 'proposals', label: 'Propostas', icon: <FileText size={20} /> },
        {
            id: 'pricing',
            label: 'Precificação',
            icon: <Calculator size={20} />,
            subItems: [
                { id: 'calculator-ti-vls', label: 'Venda/Locação/Serviços', icon: <Briefcase size={16} /> },
                { id: 'calculator-vm', label: 'VM', icon: <Server size={16} /> },
                { id: 'calculator-pabx-sip', label: 'PABX/SIP', icon: <Phone size={16} /> },
                { id: 'calculator-servicedesk', label: 'Service Desk', icon: <Headset size={16} /> },
                { id: 'calculator-printer', label: 'Outsourcing de Impressão', icon: <Printer size={16} /> },
            ]
        },
        {
            id: 'bids',
            label: 'Licitações/Editais',
            icon: <Gavel size={20} />,
            subItems: [
                { id: 'bids-analyzer', label: 'Analisador de Editais', icon: <Brain size={16} /> },
                { id: 'bids-analysis', label: 'Análise de Editais', icon: <Search size={16} /> },
                { id: 'bids-docs', label: 'Documentações para Editais', icon: <FileText size={16} /> },
            ]
        },
        { id: 'rfp', label: 'RFP/RFI', icon: <FileText size={20} /> },
        { id: 'price-records', label: 'Atas de Registros de Preços', icon: <Award size={20} /> },
    ];

    // Lógica para encontrar o item de navegação atual (adapte)
    const currentNavItem = useMemo(() => {
        for (const item of navItems) {
            if (item.id === activeTab) return { ...item, parentLabel: null };
            if (item.subItems) {
                const subItem = item.subItems.find(sub => sub.id === activeTab);
                if (subItem) return { ...subItem, parentLabel: item.label };
            }
        }
        return { ...navItems[0], parentLabel: null };
    }, [activeTab]);


    // Função para Renderizar o Conteúdo da View Ativa (adapte do seu código original)
    const renderContent = () => {
        // NOTA: Os componentes de view (DashboardView, PartnerView, etc.) agora devem gerenciar seus próprios dados.
        // Remova a dependência de useAuth() dentro deles, se houver.

        switch (activeTab) {
            case 'dashboard': return <DashboardView salesData={salesData} quoteStatusData={quoteStatusData} partners={partners} ros={ros} />;
            case 'distributors': return <PartnerView partnerType="Distribuidor" />; // PartnerView pode precisar adaptação
            case 'suppliers-register': return <PartnerView partnerType="Fornecedor" />; // PartnerView pode precisar adaptação
            case 'ro-management': return <RoManagementView partners={partners} ros={ros} onSave={() => { }} onDelete={() => { }} />; // Adapte as props
            case 'training-management': return <TrainingManagementView partners={partners} trainings={trainings} onSave={() => { }} onDelete={() => { }} />; // Adapte as props
            case 'quotes': return <QuotesView quotes={quotes} partners={partners} onSave={() => { }} onDelete={() => { }} />; // QuotesView pode precisar adaptação
            case 'proposals': return <ProposalsView proposals={proposals} partners={partners} onSave={(proposal) => setProposals(prev => [...prev.filter(p => p.id !== proposal.id), proposal])} onDelete={(id) => setProposals(prev => prev.filter(p => p.id !== id))} />;
            case 'calculator-ti-vls': return <CalculatorFrame src="https://precificacaoti.netlify.app/" title="Precificação Venda/Locação/Serviços" />;
            case 'calculator-vm': return <VMCalculator />;
            case 'calculator-pabx-sip': return <PABXSIPCalculator />;
            case 'calculator-servicedesk': return <CalculatorFrame src="https://precificaservicedesk.netlify.app/" title="Precificação Service Desk" />;
            case 'calculator-printer': return <CalculatorFrame src="https://precificalocacaoprinters.netlify.app/" title="Outsourcing de Impressão" />;
            case 'bids-analyzer': return <EditalAnalyzer />;
            case 'bids-analysis': return <EditalAnalysisView
                editais={editais}
                onAdd={(edital) => setEditais(prev => [...prev, { ...edital, id: `EDT-${Date.now()}` }])}
                onUpdate={(id, edital) => setEditais(prev => prev.map(e => e.id === id ? { ...edital, id } : e))}
                onDelete={(id) => setEditais(prev => prev.filter(e => e.id !== id))}
                onAddAnalysis={(editalId, analysis) => setEditais(prev => prev.map(e => e.id === editalId ? { ...e, analysis: { ...analysis, id: `ANL-${Date.now()}`, editalId } } : e))}
            />;
            case 'bids-docs': return <BidsDocumentationView docs={initialBidDocs} onDocsChange={setBidDocs} />; // Adapte se os docs vierem de outro lugar
            case 'rfp': return <RFPView rfps={rfps} onAdd={(rfp) => setRfps(prev => [...prev, { ...rfp, id: `RFP-${Date.now()}` }])} onUpdate={(id, rfp) => setRfps(prev => prev.map(r => r.id === id ? { ...rfp, id } : r))} onDelete={(id) => setRfps(prev => prev.filter(r => r.id !== id))} />;
            case 'price-records': return <PriceRecordView priceRecords={priceRecords} onAdd={(priceRecord) => setPriceRecords(prev => [...prev, { ...priceRecord, id: `ATA-${Date.now()}` }])} onUpdate={(id, priceRecord) => setPriceRecords(prev => prev.map(r => r.id === id ? { ...priceRecord, id } : r))} onDelete={(id) => setPriceRecords(prev => prev.filter(r => r.id !== id))} />;
            default: return <DashboardView salesData={salesData} quoteStatusData={quoteStatusData} partners={partners} ros={ros} />;
        }
    };


    // **Renderização da UI completa da página principal (sem verificações de autenticação)**
    return (
        <div className="min-h-screen font-body bg-background text-foreground transition-colors duration-500">
            <div className="flex">

                {/* Sidebar - Adaptada para usar navItems e activeTab/setActiveTab */}
                <aside className="w-64 bg-card shadow-xl flex-col h-screen sticky top-0 hidden md:flex">
                    {/* Cabeçalho da Sidebar */}
                    <div className="flex items-center justify-center h-20 border-b border-border">
                        <Briefcase className="w-8 h-8 text-primary" />
                        <span className="ml-3 text-xl font-bold text-foreground">Pré-Vendas TI</span>
                    </div>
                    {/* Navegação da Sidebar */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map(item => (
                            !item.subItems ? (
                                <Button
                                    key={item.id}
                                    variant={activeTab === item.id ? 'default' : 'ghost'}
                                    className="w-full justify-start px-4 py-3 h-auto text-sm"
                                    onClick={() => setActiveTab(item.id)} // Atualiza activeTab no clique
                                >
                                    {item.icon}
                                    <span className="ml-4">{item.label}</span>
                                </Button>
                            ) : (
                                // Collapsible para itens com sub-itens
                                <Collapsible
                                    key={item.id}
                                    // Adapte a condição 'open' se necessário (ex: verificar se algum sub-item está ativo)
                                    open={openSections[item.id as keyof typeof openSections] || item.subItems.some(sub => sub.id === activeTab)}
                                    onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, [item.id]: isOpen }))} // Adapte setOpenSections
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            // Adapte o variant para sub-itens ativos
                                            variant={item.subItems.some(sub => sub.id === activeTab) ? 'default' : 'ghost'}
                                            className="w-full justify-between px-4 py-3 h-auto text-sm"
                                        >
                                            <div className="flex items-center">
                                                {item.icon}
                                                <span className="ml-4">{item.label}</span>
                                            </div>
                                            {/* Gira o ícone Chevron baseado no estado 'open' */}
                                            <ChevronDown className={`w-5 h-5 transition-transform ${openSections[item.id as keyof typeof openSections] ? 'rotate-180' : ''}`} />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pl-8 pt-2 space-y-1">
                                        {item.subItems.map(subItem => (
                                            <Button
                                                key={subItem.id}
                                                variant="link" // Exemplo de variant para sub-item
                                                onClick={() => setActiveTab(subItem.id)} // Atualiza activeTab no clique
                                                className={`w-full justify-start h-auto p-0 py-2 text-sm ${activeTab === subItem.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                {subItem.icon}
                                                <span className="ml-3">{subItem.label}</span>
                                            </Button>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            )
                        ))}
                    </nav>
                    {/* Parte inferior da Sidebar (Modo Claro/Escuro, Logout removido) */}
                    <div className="p-4 border-t border-border flex flex-col gap-2">
                        {/* Botão de Tema - Usa mounted para renderizar o conteúdo condicionalmente */}
                        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="outline" className="w-full">
                            {mounted ? (
                                <>
                                    {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                                    {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                                </>
                            ) : (
                                <>
                                    <Sun className="mr-2 h-4 w-4" />
                                    Mudar Tema
                                </>
                            )}
                        </Button>

                        {/* Botão de Logout removido */}
                        {/* <Button onClick={logout} variant="destructive" className="w-full"> ... </Button> */}
                    </div>
                </aside>


                {/* Conteúdo Principal da Página (Main) */}
                <main className="flex-1 p-6 sm:p-10 max-h-screen overflow-y-auto">
                    {/* Header da Main (Busca, Info do Usuário removido) */}
                    <header className="flex justify-between items-center mb-8">
                        {/* Título da Página Atual - Usa a lógica currentNavItem ou activeTab */}
                        <div>
                            <h1 className="text-3xl font-bold text-foreground capitalize">{currentNavItem.parentLabel || currentNavItem.label}</h1>
                            {currentNavItem.parentLabel && <p className="text-sm text-muted-foreground">{currentNavItem.label}</p>}
                        </div>
                        {/* Info do Usuário Logado removido ou adaptado */}
                        {/* <div className="flex items-center space-x-4"> ... </div> */}
                    </header>

                    {/* Área de Conteúdo Principal - Renderiza a view ativa */}
                    <div className="h-[calc(100%-100px)]">
                        {renderContent()} {/* Chama a função para renderizar a view ativa */}
                    </div>

                </main>
            </div>
        </div>
    );
}
