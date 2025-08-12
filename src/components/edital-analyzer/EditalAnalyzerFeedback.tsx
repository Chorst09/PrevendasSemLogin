"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, AlertTriangle, FileText, Brain } from 'lucide-react';

interface EditalAnalyzerFeedbackProps {
  isAnalyzing: boolean;
  currentStep: string;
  progress: number;
  fileName?: string;
  error?: string;
}

const EditalAnalyzerFeedback: React.FC<EditalAnalyzerFeedbackProps> = ({
  isAnalyzing,
  currentStep,
  progress,
  fileName,
  error
}) => {
  if (!isAnalyzing && !error) return null;

  const getStepIcon = (step: string) => {
    switch (step.toLowerCase()) {
      case 'carregando':
        return <FileText className="h-5 w-5 text-blue-400" />;
      case 'extraindo':
        return <FileText className="h-5 w-5 text-green-400" />;
      case 'analisando':
        return <Brain className="h-5 w-5 text-purple-400" />;
      case 'processando':
        return <Brain className="h-5 w-5 text-orange-400" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
    }
  };

  const getStepColor = (step: string) => {
    switch (step.toLowerCase()) {
      case 'carregando':
        return 'text-blue-400';
      case 'extraindo':
        return 'text-green-400';
      case 'analisando':
        return 'text-purple-400';
      case 'processando':
        return 'text-orange-400';
      default:
        return 'text-blue-400';
    }
  };

  if (error) {
    return (
      <Card className="bg-gray-800 border-red-600">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h3 className="text-red-400 font-semibold">Erro na Análise</h3>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="bg-red-900/20 p-4 rounded-lg">
            <h4 className="text-red-300 font-semibold mb-2">Sugestões:</h4>
            <ul className="text-sm text-red-200 space-y-1">
              <li>• Verifique se o arquivo não está corrompido</li>
              <li>• Use um PDF com texto selecionável (não digitalizado)</li>
              <li>• Remova proteções de senha se houver</li>
              <li>• Tente um arquivo DOCX como alternativa</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-blue-600">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {getStepIcon(currentStep)}
          <div>
            <h3 className={`font-semibold ${getStepColor(currentStep)}`}>
              {currentStep}...
            </h3>
            {fileName && (
              <p className="text-sm text-gray-400">{fileName}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progresso</span>
            <span className="text-blue-400 font-medium">{progress}%</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processando arquivo, aguarde...</span>
        </div>

        {/* Etapas do processo */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Arquivo carregado</span>
          </div>
          <div className="flex items-center gap-2">
            {progress >= 30 ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <div className="h-4 w-4 border-2 border-gray-600 rounded-full" />
            )}
            <span className="text-sm text-gray-300">Extraindo texto</span>
          </div>
          <div className="flex items-center gap-2">
            {progress >= 70 ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <div className="h-4 w-4 border-2 border-gray-600 rounded-full" />
            )}
            <span className="text-sm text-gray-300">Analisando conteúdo</span>
          </div>
          <div className="flex items-center gap-2">
            {progress >= 100 ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <div className="h-4 w-4 border-2 border-gray-600 rounded-full" />
            )}
            <span className="text-sm text-gray-300">Gerando relatório</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditalAnalyzerFeedback; 