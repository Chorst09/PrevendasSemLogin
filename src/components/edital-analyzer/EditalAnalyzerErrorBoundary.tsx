"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class EditalAnalyzerErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Erro no Analisador de Editais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Ocorreu um erro inesperado no analisador de editais. Isso pode ter sido causado por:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Problemas na leitura do arquivo PDF/DOCX</li>
                  <li>Arquivo corrompido ou em formato não suportado</li>
                  <li>Problemas de conectividade ou recursos do sistema</li>
                  <li>Erro interno do aplicativo</li>
                </ul>
                
                {this.state.error && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Detalhes do erro:</p>
                    <p className="text-red-300 text-sm font-mono">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={this.handleRetry}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Recarregar Página
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Sugestões:</h4>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• Verifique se o arquivo não está corrompido</li>
                    <li>• Tente usar um arquivo PDF com texto selecionável</li>
                    <li>• Certifique-se de que o arquivo não está protegido por senha</li>
                    <li>• Tente converter o arquivo para um formato mais recente</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EditalAnalyzerErrorBoundary; 