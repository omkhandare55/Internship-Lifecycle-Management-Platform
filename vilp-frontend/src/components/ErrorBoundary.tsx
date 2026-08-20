import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F4EEF7] flex flex-col items-center justify-center p-4 text-[#171024] font-mono">
          <div className="max-w-lg w-full bg-white p-8 border-2 border-[#ED4B86] rounded-sm shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E0D3E8] pb-4">
              <div className="w-10 h-10 bg-[#ED4B86]/10 border border-[#ED4B86]/30 flex items-center justify-center text-[#ED4B86] rounded-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold uppercase tracking-tight text-[#171024]">
                  RUNTIME EXCEPTION CAUGHT
                </h1>
                <p className="text-[10px] text-[#5D4A75]">Error boundary isolated the failure.</p>
              </div>
            </div>

            <div className="bg-[#FEF8E7] p-3 border border-[#EADBBE] rounded-sm text-xs space-y-1">
              <p className="font-bold text-[#ED4B86]">{this.state.error?.name || 'Error'}:</p>
              <p className="text-zinc-700 break-words">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-[#723ECF] text-white text-xs font-bold rounded-sm flex items-center justify-center gap-2 hover:bg-[#5f33ad] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> RELOAD VIEW
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 bg-[#FEF8E7] text-[#171024] text-xs font-bold rounded-sm border border-[#E0D3E8] flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> PORTAL HOME
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
