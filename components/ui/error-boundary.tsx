'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Terjadi Kesalahan
              </h2>
              <p className="text-gray-600">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button onClick={this.handleReset} className="w-full">
                Coba Lagi
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Muat Ulang Halaman
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-sm text-gray-500 mt-4">
                <summary className="cursor-pointer hover:text-gray-700">
                  Detail Error (Development)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}