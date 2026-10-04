import { ReactNode } from 'react'

/** The landing page's hero heading. */
export default function Heading({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <h1 className={ `text-4xl md:text-5xl font-extrabold text-center md:text-left text-balance ${className}` }>{ children }</h1>
}
