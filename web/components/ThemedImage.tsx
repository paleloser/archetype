import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import Image from 'next/image'

// Captures are taken at 2x device pixels, so they render at half their pixel size.
const DENSITY = 2
const BORDER = 2

type ThemedImageProps = {
  alt: string
  light: string
  dark: string
  width: number
  height: number
  notZoomable?: boolean
  className?: string
}

/**
 * A screenshot in both themes: renders both variants and shows the one matching the reader's theme, with no flash on
 * load. `width`/`height` are the asset's actual pixel dimensions (both themes share them).
 */
export default function ThemedImage({ alt, light, dark, width, height, notZoomable, className }: ThemedImageProps) {
  const imagesClassName = 'h-auto w-full select-none my-0!'
  const Component = notZoomable ? Image : ImageZoom

  return (
    <div
      className={ `relative mx-auto w-full overflow-hidden rounded-3xl border border-fd-border ${className ?? ''}` }
      style={ { maxWidth: width / DENSITY + BORDER } }>
      <Component alt={ alt } className={ `themed-image-light ${imagesClassName}` } loading='lazy' src={ light } width={ width } height={ height } />
      <Component alt={ alt } className={ `themed-image-dark ${imagesClassName}` } loading='lazy' src={ dark } width={ width } height={ height } />
    </div>
  )
}
