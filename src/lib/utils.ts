import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function formatCurrencyForInput(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value
  const fixed = num.toFixed(2)
  const [integerPart, decimalPart] = fixed.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formattedInteger},${decimalPart}`
}

export function formatCurrencyInputFromUserInput(inputValue: string): { formatted: string; numeric: number } {
  // Remove tudo que não é dígito
  const digits = inputValue.replace(/\D/g, '')
  
  if (digits.length === 0) {
    return { formatted: '', numeric: 0 }
  }
  
  // Cria o número como centavos e divide por 100
  const numericValue = parseInt(digits, 10) / 100
  
  // Formata o valor
  const fixed = numericValue.toFixed(2)
  const [integerPart, decimalPart] = fixed.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return {
    formatted: `${formattedInteger},${decimalPart}`,
    numeric: numericValue
  }
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function formatInteger(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value, 10) || 0 : value
  return num.toLocaleString('pt-BR', {
    maximumFractionDigits: 0
  })
}

export function parseInteger(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}
