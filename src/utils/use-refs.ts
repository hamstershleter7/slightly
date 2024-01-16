import React from 'react'

export default function useRefs() {
  let refs = React.useRef<HTMLDivElement[]>([])

  let setRefs = React.useCallback(
    (index: number) => (el: HTMLDivElement) => {
      if (el) refs.current[index] = el
    },
    []
  )

  let reset = React.useCallback(() => {
    refs.current = []
  }, [])

  return [refs.current, setRefs as any, reset]
}
