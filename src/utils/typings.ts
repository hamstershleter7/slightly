import type { CSSProperties, ReactNode } from 'react'

export interface BasicComponent {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  id?: string
}

export let ComponentDefaults = {
  className: '',
  style: {},
}
