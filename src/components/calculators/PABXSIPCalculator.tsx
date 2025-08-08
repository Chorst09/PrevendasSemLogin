"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import '@/styles/print.css';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Calculator, 
    Phone, 
    PhoneForwarded, 
    Settings, 
    FileText, 
    Download, 
    Save,
    Search,
    Edit,
    Plus,
    User,
    Briefcase,
    Trash2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Interfaces
interface PABXTier {
    min: number;
    max: number;
    setup: number;
    monthly: number;
}

interface SIPPlan {
    setup: number;
    monthly: number;
    channels: number;
}

interface PABXResult {
    setup: number;
    baseMonthly: number;
    deviceRentalCost: number;
    aiAgentCost: number; 
    totalMonthly: number;
}

interface SIPResult {
    setup: number;
    monthly: number;
    additionalChannelsCost: number;
}

// Interface para um produto adicionado à proposta
type ProductType = 'PABX' | 'SIP';

interface Product {
    id: string;
    type: ProductType;
    description: string;
    setup: number;
    monthly: number;
    details: any; 
}

interface Proposal {
    id: string;
    clientName: string;
    accountManager: string;
    products: Product[];
    totalSetup: number;
    totalMonthly: number;
    date: string;
}

const PABXSIPCalculator: React.FC = () => {
    // Estados de gerenciamento de propostas
    const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
    const [viewMode, setViewMode] = useState<'search' | 'create' | 'edit'>('search');
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Estados dos formulários
    const [clientName, setClientName] = useState('');
    const [accountManager, setAccountManager] = useState('');
    const [addedProducts, setAddedProducts] = useState<Product[]>([]);

    // Estados PABX
    const [pabxExtensions, setPabxExtensions] = useState<number>(0);
    const [pabxIncludeDevices, setPabxIncludeDevices] = useState<boolean>(false);
    const [pabxDeviceQuantity, setPabxDeviceQuantity] = useState<number>(0);
    const [pabxResult, setPabxResult] = useState<PABXResult | null>(null);

    // Estados Agente IA
    const [includeAIAgent, setIncludeAIAgent] = useState(false);
    const [selectedAIAgentPlan, setSelectedAIAgentPlan] = useState('');

    // Estados SIP
    const [selectedSipPlan, setSelectedSipPlan] = useState<string>('');
    const [sipAdditionalChannels, setSipAdditionalChannels] = useState<number>(0);
    const [sipWithEquipment, setSipWithEquipment] = useState<boolean>(false);
    const [sipResult, setSipResult] = useState<SIPResult | null>(null);

    // Dados das tabelas
    const pabxTiers: PABXTier[] = [
        { min: 1, max: 10, setup: 1250, monthly: 200 },
        { min: 11, max: 20, setup: 2000, monthly: 220 },
        { min: 21, max: 30, setup: 2500, monthly: 250 },
        { min: 31, max: 50, setup: 3000, monthly: 300 },
        { min: 51, max: 100, setup: 3500, monthly: 400 },
        { min: 101, max: 500, setup: 4000, monthly: 500 },
        { min: 501, max: 1000, setup: 5000, monthly: 600 }
    ];

    const deviceRentalTiers = [
        { min: 1, max: 10, price: 35 },
        { min: 11, max: 20, price: 34 },
        { min: 21, max: 30, price: 33 },
        { min: 31, max: 50, price: 32 },
        { min: 51, max: 100, price: 30 },
        { min: 101, max: 500, price: 0 }, // Valor a combinar
        { min: 501, max: 1000, price: 0 } // Valor a combinar
    ];

    const aiAgentPlans: { [key: string]: { name: string; monthlyCost: number; messages: string; minutes: string; premiumVoice: string; } } = {
        '20k': { name: 'Agente IA 20K Créditos', monthlyCost: 720, messages: '10.000 mensagens* ou', minutes: '2.000 minutos** ou', premiumVoice: '1.000 voz premium*** ou' },
        '40k': { name: 'Agente IA 40K Créditos', monthlyCost: 1370, messages: '20.000 mensagens* ou', minutes: '4.000 minutos** ou', premiumVoice: '2.000 voz premium*** ou' },
        '60k': { name: 'Agente IA 60K Créditos', monthlyCost: 1940, messages: '30.000 mensagens* ou', minutes: '6.000 minutos** ou', premiumVoice: '3.000 voz premium*** ou' },
        '100k': { name: 'Agente IA 100K Créditos', monthlyCost: 3060, messages: '50.000 mensagens* ou', minutes: '10.000 minutos** ou', premiumVoice: '5.000 voz premium*** ou' },
        '150k': { name: 'Agente IA 150K Créditos', monthlyCost: 4320, messages: '75.000 mensagens* ou', minutes: '15.000 minutos** ou', premiumVoice: '7.500 voz premium*** ou' },
        '200k': { name: 'Agente IA 200K Créditos', monthlyCost: 5400, messages: '100.000 mensagens* ou', minutes: '20.000 minutos** ou', premiumVoice: '10.000 voz premium*** ou' },
    };

    const sipPlans: { [key: string]: SIPPlan } = {
        'plano1': { setup: 100, monthly: 150, channels: 2 },
        'plano2': { setup: 150, monthly: 250, channels: 5 },
        'plano3': { setup: 200, monthly: 400, channels: 10 },
    };

    const costPerAdditionalChannel = 50;
    const equipmentRentalCost = 35;

    // Efeitos para cálculos
    useEffect(() => {
        if (pabxExtensions > 0) {
            const tier = pabxTiers.find(t => pabxExtensions >= t.min && pabxExtensions <= t.max);
            if (tier) {
                let deviceRentalCost = 0;
                if (pabxIncludeDevices && pabxDeviceQuantity > 0) {
                    const rentalTier = deviceRentalTiers.find(t => pabxDeviceQuantity >= t.min && pabxDeviceQuantity <= t.max);
                    if (rentalTier && rentalTier.price > 0) {
                        deviceRentalCost = rentalTier.price * pabxDeviceQuantity;
                    } else if (rentalTier && rentalTier.price === 0) {
                        // Lógica para valor a combinar
                        deviceRentalCost = 0; // Ou um valor placeholder
                    }
                }

                let aiAgentCost = 0;
                if (includeAIAgent && selectedAIAgentPlan && aiAgentPlans[selectedAIAgentPlan]) {
                    aiAgentCost = aiAgentPlans[selectedAIAgentPlan].monthlyCost;
                }

                const baseMonthly = tier.monthly + (pabxExtensions > tier.max ? (pabxExtensions - tier.max) * (tier.monthly / tier.max) : 0);
                const totalMonthly = baseMonthly + deviceRentalCost + aiAgentCost;
                
                setPabxResult({ setup: tier.setup, baseMonthly, deviceRentalCost, aiAgentCost, totalMonthly });
            } else {
                setPabxResult(null);
            }
        } else {
            setPabxResult(null);
        }
    }, [pabxExtensions, pabxIncludeDevices, pabxDeviceQuantity, includeAIAgent, selectedAIAgentPlan]);

    useEffect(() => {
        if (selectedSipPlan) {
            const plan = sipPlans[selectedSipPlan];
            if (plan) {
                let monthly = plan.monthly;
                if (sipWithEquipment) {
                    monthly += equipmentRentalCost * plan.channels;
                }
                const additionalChannelsCost = sipAdditionalChannels * costPerAdditionalChannel;
                monthly += additionalChannelsCost;
                setSipResult({ setup: plan.setup, monthly, additionalChannelsCost });
            } else {
                setSipResult(null);
            }
        } else {
            setSipResult(null);
        }
    }, [selectedSipPlan, sipAdditionalChannels, sipWithEquipment]);

    // Funções auxiliares
    const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
    const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

    // Lógica de Produtos
    const handleAddPabxProduct = () => {
        if (pabxResult) {
            let products = [];

            // Produto PABX Principal
            products.push({
                id: generateUniqueId(),
                type: 'PABX',
                description: `PABX em Nuvem para ${pabxExtensions} ramais`,
                setup: pabxResult.setup,
                monthly: pabxResult.baseMonthly,
                details: { extensions: pabxExtensions }
            });

            // Produto Aluguel de Aparelhos
            if (pabxIncludeDevices && pabxDeviceQuantity > 0 && pabxResult.deviceRentalCost > 0) {
                products.push({
                    id: generateUniqueId(),
                    type: 'PABX',
                    description: `Aluguel de ${pabxDeviceQuantity} aparelho(s) IP`,
                    setup: 0,
                    monthly: pabxResult.deviceRentalCost,
                    details: { quantity: pabxDeviceQuantity }
                });
            }

            // Produto Agente IA
            if (pabxResult && pabxResult.aiAgentCost > 0 && selectedAIAgentPlan) {
                const plan = aiAgentPlans[selectedAIAgentPlan];
                const description = `${plan.name} (Até: ${plan.messages.split(' ')[0]} msg, ${plan.minutes.split(' ')[0]} min, ${plan.premiumVoice.split(' ')[0]} voz premium)`;
                products.push({
                    id: generateUniqueId(),
                    type: 'PABX',
                    description: description,
                    setup: 0,
                    monthly: pabxResult.aiAgentCost,
                    details: { plan: selectedAIAgentPlan }
                });
            }

            setAddedProducts(prev => [...prev, ...products]);
        }
    };

    const handleAddSipProduct = () => {
        if (sipResult && selectedSipPlan) {
            const plan = sipPlans[selectedSipPlan];
            const description = `Plano SIP Trunk (${plan.channels} canais)${sipWithEquipment ? ' com equipamento' : ''}${sipAdditionalChannels > 0 ? ` + ${sipAdditionalChannels} canais adicionais` : ''}`;
            setAddedProducts(prev => [...prev, {
                id: generateUniqueId(),
                type: 'SIP',
                description,
                setup: sipResult.setup,
                monthly: sipResult.monthly,
                details: { plan: selectedSipPlan, additionalChannels: sipAdditionalChannels, withEquipment: sipWithEquipment }
            }]);
        }
    };

    const handleRemoveProduct = (id: string) => {
        setAddedProducts(prev => prev.filter(p => p.id !== id));
    };

    // Lógica de Gerenciamento de Propostas
    useEffect(() => {
        const savedProposals = localStorage.getItem('proposals');
        if (savedProposals) {
            setProposals(JSON.parse(savedProposals));
        }
    }, []);

    useEffect(() => {
        if (proposals.length > 0) {
            localStorage.setItem('proposals', JSON.stringify(proposals));
        }
    }, [proposals]);

    const totalSetup = addedProducts.reduce((sum, p) => sum + p.setup, 0);
    const totalMonthly = addedProducts.reduce((sum, p) => sum + p.monthly, 0);

    const generateProposalId = (): string => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `PROP-${year}${month}${day}-${random}`;
    };

    const clearForm = () => {
        setClientName('');
        setAccountManager('');
        setAddedProducts([]);
        setPabxExtensions(0);
        setPabxIncludeDevices(false);
        setPabxDeviceQuantity(0);
        setIncludeAIAgent(false);
        setSelectedAIAgentPlan('');
        setSelectedSipPlan('');
        setSipAdditionalChannels(0);
        setSipWithEquipment(false);
    };

    const createNewProposal = () => {
        clearForm();
        const newProposalId = generateProposalId();
        const newProposal: Proposal = {
            id: newProposalId,
            clientName: '',
            accountManager: '',
            products: [],
            totalSetup: 0,
            totalMonthly: 0,
            date: new Date().toLocaleDateString('pt-BR')
        };
        setCurrentProposal(newProposal);
        setViewMode('create');
    };

    const editProposal = (proposal: Proposal) => {
        setCurrentProposal(proposal);
        setClientName(proposal.clientName);
        setAccountManager(proposal.accountManager);
        setAddedProducts(proposal.products);
        setViewMode('edit');
    };

    const saveProposal = () => {
        if (viewMode === 'create' || viewMode === 'edit') {
            const proposalToSave: Proposal = {
                ...(currentProposal as Proposal),
                clientName,
                accountManager,
                products: addedProducts,
                totalSetup,
                totalMonthly,
                date: currentProposal?.date || new Date().toLocaleDateString('pt-BR')
            };

            if (viewMode === 'create') {
                setProposals(prev => [...prev, proposalToSave]);
            } else {
                setProposals(prev => prev.map(p => p.id === proposalToSave.id ? proposalToSave : p));
            }
            
            setViewMode('search');
            setCurrentProposal(null);
            clearForm();
        }
    };

    const cancelAction = () => {
        setViewMode('search');
        setCurrentProposal(null);
        clearForm();
    };

    const filteredProposals = proposals.filter(p => 
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => window.print();

    return (
        <>
            <div className="p-4 md:p-8 print-hide">
                {viewMode === 'search' ? (
                    <Card className="bg-slate-900/80 border-slate-800 text-white">
                        <CardHeader>
                            <CardTitle>Buscar Propostas</CardTitle>
                            <CardDescription>Encontre propostas existentes ou crie uma nova.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <Input 
                                    type="text"
                                    placeholder="Buscar por cliente ou ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                                <Button onClick={createNewProposal} className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2"/>Nova Proposta</Button>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-700">
                                            <TableHead className="text-white">ID</TableHead>
                                            <TableHead className="text-white">Cliente</TableHead>
                                            <TableHead className="text-white">Data</TableHead>
                                            <TableHead className="text-white">Total Mensal</TableHead>
                                            <TableHead className="text-white">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProposals.map(p => (
                                            <TableRow key={p.id} className="border-slate-800">
                                                <TableCell>{p.id}</TableCell>
                                                <TableCell>{p.clientName}</TableCell>
                                                <TableCell>{p.date}</TableCell>
                                                <TableCell>{formatCurrency(p.totalMonthly)}</TableCell>
                                                <TableCell><Button variant="outline" size="sm" onClick={() => editProposal(p)}><Edit className="h-4 w-4"/></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div>
                        <Card className="bg-slate-900/80 border-slate-800 text-white mb-6">
                            <CardHeader>
                                <CardTitle>{viewMode === 'create' ? 'Criar Nova Proposta' : 'Editar Proposta'}</CardTitle>
                                <CardDescription>ID da Proposta: {currentProposal?.id}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="client-name">Nome do Cliente</Label>
                                    <Input id="client-name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-manager">Gerente de Contas</Label>
                                    <Input id="account-manager" value={accountManager} onChange={(e) => setAccountManager(e.target.value)} className="bg-slate-800 border-slate-700" />
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="calculator" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                                <TabsTrigger value="calculator">Calculadora</TabsTrigger>
                                <TabsTrigger value="list-price">List Price</TabsTrigger>
                            </TabsList>
                            <TabsContent value="calculator">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                    {/* Calculadora PABX */}
                                    <Card className="bg-slate-900/80 border-slate-800 text-white">
                                        <CardHeader>
                                            <CardTitle className="flex items-center"><Phone className="mr-2"/>PABX em Nuvem</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="pabx-extensions">Quantidade de Ramais</Label>
                                                    <Input id="pabx-extensions" type="number" value={pabxExtensions || ''} onChange={(e) => setPabxExtensions(Number(e.target.value))} min="0" className="bg-slate-700 border-slate-600 mt-1" />
                                                </div>
                                                <div className="space-y-2">
                                                 <div className="flex items-center space-x-2">
                                                     <Checkbox id="pabxIncludeDevices" checked={pabxIncludeDevices} onCheckedChange={(checked) => setPabxIncludeDevices(Boolean(checked))} />
                                                     <Label htmlFor="pabxIncludeDevices">Incluir Aparelhos (Ramais Físicos)</Label>
                                                 </div>
                                                 {pabxIncludeDevices && (
                                                     <div className="pl-6 mt-2">
                                                         <Label htmlFor="pabx-device-quantity">Quantidade de Aparelhos</Label>
                                                         <Input id="pabx-device-quantity" type="number" value={pabxDeviceQuantity || ''} onChange={(e) => setPabxDeviceQuantity(Number(e.target.value))} min="0" className="bg-slate-700 border-slate-600 mt-1" />
                                                     </div>
                                                 )}
                                                 <div className="flex items-center space-x-2 mt-4">
                                                     <Checkbox id="includeAIAgent" checked={includeAIAgent} onCheckedChange={(checked) => setIncludeAIAgent(Boolean(checked))} />
                                                     <Label htmlFor="includeAIAgent">Incluir Agente IA</Label>
                                                 </div>
                                                 {includeAIAgent && (
                                                     <div className="pl-6 mt-2">
                                                         <Label htmlFor="aiAgentPlan">Plano de Agente IA</Label>
                                                         <Select onValueChange={setSelectedAIAgentPlan} value={selectedAIAgentPlan}>
                                                             <SelectTrigger id="aiAgentPlan" className="bg-slate-700 border-slate-600">
                                                                 <SelectValue placeholder="Selecione um plano de créditos" />
                                                             </SelectTrigger>
                                                             <SelectContent className="bg-slate-800 text-white">
                                                                 {Object.entries(aiAgentPlans).map(([key, plan]) => (
                                                                     <SelectItem key={key} value={key}>{plan.name}</SelectItem>
                                                                 ))}
                                                             </SelectContent>
                                                         </Select>
                                                         {selectedAIAgentPlan && aiAgentPlans[selectedAIAgentPlan] && (
                                                             <div className="mt-4 p-3 bg-slate-800/50 rounded-lg text-sm text-slate-300">
                                                                 <p className="font-bold text-white mb-2">Tenha até:</p>
                                                                 <p>{aiAgentPlans[selectedAIAgentPlan].messages}</p>
                                                                 <p>{aiAgentPlans[selectedAIAgentPlan].minutes}</p>
                                                                 <p>{aiAgentPlans[selectedAIAgentPlan].premiumVoice}</p>
                                                                 <p className="text-xs text-slate-400 mt-2">Opções acima combinadas</p>
                                                             </div>
                                                         )}
                                                     </div>
                                                 )}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex-col items-start">
                                            {pabxResult && (
                                                <div className="w-full">
                                                    <Separator className="bg-slate-700 my-4"/>
                                                    <div className="text-lg font-bold mb-2">Resultado PABX:</div>
                                                    <div className="flex justify-between"><span>Taxa de Setup:</span> <span>{formatCurrency(pabxResult.setup)}</span></div>
                                                    <div className="flex justify-between"><span>Mensalidade Base:</span> <span>{formatCurrency(pabxResult.baseMonthly)}</span></div>
                                                    {pabxResult.deviceRentalCost > 0 && <div className="flex justify-between"><span>Aluguel Aparelhos:</span> <span>{formatCurrency(pabxResult.deviceRentalCost)}</span></div>}
                                                    {pabxResult.aiAgentCost > 0 && <div className="flex justify-between"><span>Agente IA:</span> <span>{formatCurrency(pabxResult.aiAgentCost)}</span></div>}
                                                    <div className="flex justify-between text-green-400 font-bold mt-2"><span>Total Mensal:</span> <span>{formatCurrency(pabxResult.totalMonthly)}</span></div>
                                                    <Button onClick={handleAddPabxProduct} className="w-full mt-4 bg-green-600 hover:bg-green-700">Adicionar à Proposta</Button>
                                                </div>
                                            )}
                                        </CardFooter>
                                    </Card>

                                    {/* Calculadora SIP Trunk */}
                                    <Card className="bg-slate-900/80 border-slate-800 text-white">
                                        <CardHeader>
                                            <CardTitle className="flex items-center"><PhoneForwarded className="mr-2"/>SIP Trunk</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="sip-plan">Plano SIP</Label>
                                                    <Select onValueChange={setSelectedSipPlan} value={selectedSipPlan}>
                                                        <SelectTrigger id="sip-plan" className="bg-slate-700 border-slate-600">
                                                            <SelectValue placeholder="Selecione um plano" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 text-white">
                                                            {Object.entries(sipPlans).map(([key, plan]) => (
                                                                <SelectItem key={key} value={key}>{`Plano ${plan.channels} canais`}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="sip-additional-channels">Canais Adicionais</Label>
                                                    <Input id="sip-additional-channels" type="number" value={sipAdditionalChannels || ''} onChange={(e) => setSipAdditionalChannels(Number(e.target.value))} min="0" className="bg-slate-700 border-slate-600 mt-1" />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="sip-with-equipment" checked={sipWithEquipment} onCheckedChange={(checked) => setSipWithEquipment(Boolean(checked))} />
                                                    <Label htmlFor="sip-with-equipment">Incluir Equipamento (ATA/SBC)</Label>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex-col items-start">
                                            {sipResult && (
                                                <div className="w-full">
                                                    <Separator className="bg-slate-700 my-4"/>
                                                    <div className="text-lg font-bold mb-2">Resultado SIP:</div>
                                                    <div className="flex justify-between"><span>Taxa de Setup:</span> <span>{formatCurrency(sipResult.setup)}</span></div>
                                                    <div className="flex justify-between text-green-400 font-bold mt-2"><span>Total Mensal:</span> <span>{formatCurrency(sipResult.monthly)}</span></div>
                                                    <Button onClick={handleAddSipProduct} className="w-full mt-4 bg-green-600 hover:bg-green-700">Adicionar à Proposta</Button>
                                                </div>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </div>
                            </TabsContent>
                            <TabsContent value="list-price">
                                <Card className="bg-slate-900/80 border-slate-800 text-white mt-6">
                                    <CardHeader>
                                        <CardTitle>Tabela de Preços (List Price)</CardTitle>
                                        <CardDescription>Valores de referência para os serviços.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-4">PABX em Nuvem</h3>
                                                <Table>
                                                    <TableHeader><TableRow className="border-slate-700"><TableHead className="text-white">Ramais</TableHead><TableHead className="text-white">Setup</TableHead><TableHead className="text-white">Mensal</TableHead></TableRow></TableHeader>
                                                    <TableBody>
                                                        {pabxTiers.map(tier => (
                                                            <TableRow key={tier.min} className="border-slate-800"><TableCell>{`${tier.min}-${tier.max}`}</TableCell><TableCell>{formatCurrency(tier.setup)}</TableCell><TableCell>{formatCurrency(tier.monthly)}</TableCell></TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-4">Aluguel de Aparelhos IP</h3>
                                                <Table>
                                                    <TableHeader><TableRow className="border-slate-700"><TableHead className="text-white">Quantidade</TableHead><TableHead className="text-white">Valor Mensal/Unitário</TableHead></TableRow></TableHeader>
                                                    <TableBody>
                                                        {deviceRentalTiers.map(tier => (
                                                            <TableRow key={tier.min} className="border-slate-800"><TableCell>{`${tier.min}-${tier.max}`}</TableCell><TableCell>{tier.price > 0 ? formatCurrency(tier.price) : 'A combinar'}</TableCell></TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-4">Agente IA - Créditos de Interação</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {Object.values(aiAgentPlans).map((plan, index) => (
                                                        <div key={index} className="bg-slate-800 rounded-lg p-6 flex flex-col text-center items-center">
                                                            <h4 className="text-lg font-bold text-cyan-400 mb-2">{plan.name}</h4>
                                                            <div className="flex-grow">
                                                                <p className="text-slate-300">{plan.messages}</p>
                                                                <p className="text-slate-300">{plan.minutes}</p>
                                                                <p className="text-slate-300 mb-4">{plan.premiumVoice}</p>
                                                                <p className="text-xs text-slate-400 mb-4">Opções acima combinadas</p>
                                                            </div>
                                                            <div className="bg-slate-900 w-full p-3 rounded-b-lg mt-auto">
                                                                <p className="text-2xl font-bold text-green-400">{formatCurrency(plan.monthlyCost)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-center mt-6 text-xs text-slate-400">
                                                    <p>* 2 créditos por mensagem</p>
                                                    <p>** 10 créditos por minuto (voz padrão)</p>
                                                    <p>*** 20 créditos por minuto (voz premium)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card className="bg-slate-900/80 border-slate-800 text-white mt-6">
                            <CardHeader>
                                <CardTitle>Resumo da Proposta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow className="border-slate-700"><TableHead className="text-white">Descrição</TableHead><TableHead className="text-white">Setup</TableHead><TableHead className="text-white">Mensal</TableHead><TableHead></TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {addedProducts.map(p => (
                                            <TableRow key={p.id} className="border-slate-800">
                                                <TableCell>{p.description}</TableCell>
                                                <TableCell>{formatCurrency(p.setup)}</TableCell>
                                                <TableCell>{formatCurrency(p.monthly)}</TableCell>
                                                <TableCell><Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(p.id)}><Trash2 className="h-4 w-4"/></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Separator className="bg-slate-700 my-4"/>
                                <div className="flex justify-end text-lg font-bold">
                                    <div className="w-1/3 text-right">
                                        <div className="flex justify-between"><span>Total Setup:</span> <span>{formatCurrency(totalSetup)}</span></div>
                                        <div className="flex justify-between"><span>Total Mensal:</span> <span>{formatCurrency(totalMonthly)}</span></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4 mt-8">
                            <Button onClick={saveProposal} className="bg-green-600 hover:bg-green-700"><Save className="h-4 w-4 mr-2" />Salvar Proposta</Button>
                            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" disabled={addedProducts.length === 0}><Download className="h-4 w-4 mr-2" />Gerar PDF</Button>
                            <Button variant="outline" onClick={cancelAction}>Cancelar</Button>
                        </div>
                    </div>
                )}
            </div>

            <div id="print-area" className="print-only">
                {currentProposal && (
                    <>
                        <div className="print-header">
                            <h1>Proposta Comercial</h1>
                            <p><strong>Proposta ID:</strong> {currentProposal.id}</p>
                            <p><strong>Cliente:</strong> {clientName}</p>
                            <p><strong>Gerente:</strong> {accountManager}</p>
                            <p><strong>Data:</strong> {currentProposal.date}</p>
                        </div>
                        <h2>Itens da Proposta</h2>
                        <table className="print-table">
                            <thead><tr><th>Descrição</th><th>Setup</th><th>Mensal</th></tr></thead>
                            <tbody>
                                {addedProducts.map(p => (
                                    <tr key={p.id}><td>{p.description}</td><td>{formatCurrency(p.setup)}</td><td>{formatCurrency(p.monthly)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="print-totals">
                            <h3>Total Geral</h3>
                            <p><strong>Total Instalação:</strong> {formatCurrency(totalSetup)}</p>
                            <p><strong>Total Mensal:</strong> {formatCurrency(totalMonthly)}</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default PABXSIPCalculator;
