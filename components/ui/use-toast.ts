import * as React from "react"

const toastTimeoutRef = React.createRef<number>()

interface UseToastOptions {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<UseToastOptions & { id: string }>>([])

  const toast = React.useCallback((options: UseToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...options, id }])
    
    if (options.duration !== 0) {
      const timeout = window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, options.duration || 3000)
      
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current)
      }
      toastTimeoutRef.current = timeout
    }
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts
  }
}
