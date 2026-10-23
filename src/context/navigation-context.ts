import { createContext } from 'react'

export type AppView = 'home' | 'admin' | 'lookup'

export interface NavigationContextType {
  currentView: AppView
  navigateTo: (view: AppView, subSection?: string) => void
  lookupReference: string | null
  setLookupReference: (ref: string | null) => void
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined)
