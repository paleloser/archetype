'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

export interface DrawerContextValue {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

export const DrawerWidth = 240

export function useDrawer() {
  return useContext(DrawerContext) as DrawerContextValue
}

export default function DrawerController({ children }: { children: React.ReactNode }) {
  const [ open, setOpen ] = useState<boolean>(false)

  return (
    <DrawerContext.Provider value={ { open, setOpen } }>
      { children }
    </DrawerContext.Provider>
  )
}
