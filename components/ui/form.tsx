import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-8", className)} {...props} />
))
Form.displayName = "Form"

const FormFieldContext = React.createContext<{ name: string }>({
  name: "",
})

const FormField = FormFieldContext.Provider

type FieldState = {
  error?: any
  invalid?: boolean
  isDirty?: boolean
  isTouched?: boolean
  isValidating?: boolean
  isSubmitted?: boolean
}

const useFormField = () => {
  const fieldContext = useFormContext()
  const field = React.useContext(FormFieldContext)

  const { name } = field

  return {
    id: `${name}-form-item`,
    name,
    formItemId: `${name}-form-item`,
    formDescriptionId: `${name}-form-item-description`,
    formMessageId: `${name}-form-item-message`,
    labelId: `${name}-form-item-label`,
    descriptionId: `${name}-form-item-description`,
    messageId: `${name}-form-item-message`,
    error: fieldContext.formState.errors[name],
    invalid: !!fieldContext.formState.errors[name],
    value: fieldContext.getValues(name),
  }
}

type FormItemContextValue = {
  id: string
  labelId: string
  descriptionId: string
  messageId: string
}

const FormItemContext = React.createContext<FormItemContextValue>({
  id: "",
  labelId: "",
  descriptionId: "",
  messageId: "",
})

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  const { name } = React.useContext(FormFieldContext)

  const {
    formItemId,
    labelId,
    descriptionId,
    messageId,
    ...formItemProps
  } = useFormField()

  const value = {
    id,
    labelId: `${name}-form-item-label`,
    descriptionId: `${name}-form-item-description`,
    messageId: `${name}-form-item-message`,
  }

  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
      data-aria-invalid={props["aria-invalid"] || formItemProps?.invalid}
      data-aria-describedby={`${value.descriptionId} ${value.messageId}`.trim()}
    />
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { formItemId, labelId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(className)}
      htmlFor={formItemId}
      id={labelId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<any>,
  React.ComponentPropsWithoutRef<any>
>(({ ...props }, ref) => {
  const { formItemId, messageId, name } = useFormField()

  return (
    <Controller
      name={name}
      render={({ field }) => {
        return (
          <Slot
            {...props}
            id={formItemId}
            aria-describedby={messageId}
            aria-invalid={props["aria-invalid"]}
            {...field}
          />
        )
      }}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { name } = React.useContext(FormFieldContext)
  const { descriptionId } = React.useContext(FormItemContext)

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, role, ...props }, ref) => {
  const { name } = React.useContext(FormFieldContext)
  const { messageId } = React.useContext(FormItemContext)

  const fieldState = useFormField()
  const error = fieldState?.error || props.children

  const message = React.useMemo(() => {
    if (!error) return ""

    if (typeof error === "string") {
      return error
    }

    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as any).message
    }

    return "Error"
  }, [error])

  return (
    <p
      ref={ref}
      id={messageId}
      role="alert"
      className={cn("text-sm text-destructive font-medium", className)}
      {...props}
    />
  )
})
FormMessage.displayName = "FormMessage"

export { useFormField, Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage }
