"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useToast } from "./use-toast";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 p-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border transition-all duration-300 transform translate-x-full hover:translate-x-0 ${
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && (
                <h3 className="font-semibold mb-1">{toast.title}</h3>
              )}
              {toast.description && (
                <p className="text-sm opacity-80">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
