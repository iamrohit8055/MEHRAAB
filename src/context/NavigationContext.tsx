import { useState, useEffect, type ReactNode } from 'react'
import { NavigationContext, type AppView } from './navigation-context'

function getViewFromLocation(): AppView {
  if (typeof window === 'undefined') return 'home'

  const hash = window.location.hash.toLowerCase()
  const path = window.location.pathname.toLowerCase()

  if (hash.startsWith('#/admin') || hash.startsWith('#admin') || path.startsWith('/admin')) {
    return 'admin'
  }
  if (hash.startsWith('#/lookup') || hash.startsWith('#lookup') || path.startsWith('/lookup')) {
    return 'lookup'
  }
  return 'home'
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>(() => getViewFromLocation())
  const [lookupReference, setLookupReference] = useState<string | null>(null)

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentView(getViewFromLocation())
    }

    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [])

  const navigateTo = (view: AppView, subSection?: string) => {
    setCurrentView(view)
    if (view === 'admin') {
      window.location.hash = '/admin'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (view === 'lookup') {
      window.location.hash = '/lookup'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (subSection) {
        window.location.hash = subSection.startsWith('#') ? subSection : `#${subSection}`
        const element = document.querySelector(subSection.startsWith('#') ? subSection : `#${subSection}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        window.location.hash = '/'
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        navigateTo,
        lookupReference,
        setLookupReference,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
