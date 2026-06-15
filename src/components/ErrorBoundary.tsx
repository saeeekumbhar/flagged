import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50/50 sm:p-8 font-sans">
          <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[#E4EDE0] bg-cover bg-center bg-no-repeat sm:rounded-[40px] sm:border-[8px] sm:border-white/20 sm:shadow-[0_0_40px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl mb-4">🌳</h1>
            <h2 className="text-xl font-bold text-[#354024] mb-2">Whoops! Something broke.</h2>
            <p className="text-sm text-[#4C3D19] mb-6">Even the best ecosystems have a bug now and then.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#354024] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-[#4C3D19] active:scale-95 transition-transform"
            >
              Reload FLAGGED
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
