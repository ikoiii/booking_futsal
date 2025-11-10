'use client'

import { cn } from '@/lib/utils'
import { Label } from './label'
import { Input } from './input'
import { Textarea } from './textarea'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea'
  placeholder?: string
  value?: string | number
  defaultValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  maxLength?: number
  min?: number
  max?: number
  step?: number
  rows?: number
}

export function FormField({ 
  label, 
  name, 
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  className,
  rows = 4,
  ...props 
}: FormFieldProps) {
  const inputProps = {
    id: name,
    name,
    type: type === 'textarea' ? undefined : type,
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    disabled,
    required,
    className: cn(
      'flex h-10 w-full rounded-md border border-input bg-background',
      'px-3 py-2 text-sm ring-offset-background file:border-0',
      'file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors duration-200',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    ),
    ...props
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          {...inputProps}
          rows={rows}
        />
      ) : (
        <Input {...inputProps} />
      )}
      
      {error && (
        <p className="text-sm text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Specialized form field components
export function EmailField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField type="email" placeholder="contoh@email.com" {...props} />
}

export function PasswordField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField type="password" placeholder="••••••••" {...props} />
}

export function NumberField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField type="number" {...props} />
}

export function PhoneField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField type="tel" placeholder="+62 812-3456-7890" {...props} />
}