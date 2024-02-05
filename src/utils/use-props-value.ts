import { useRef, useCallback } from 'react'
import { useForceUpdate } from '@/utils/use-force-update'

interface UsePropsValue<T> {
  value?: T
  defaultValue?: T
  finalValue?: T
  onChange?: (value: T) => void
}

export function usePropsValue<T>({
  value,
  defaultValue,
  finalValue,
  onChange = (value: T) => {},
}: UsePropsValue<T>) {
  let forceUpdate = useForceUpdate()
  let dfValue = (defaultValue !== undefined ? defaultValue : finalValue) as T
  let stateRef = useRef<T>(value !== undefined ? value : dfValue)
  if (value !== undefined) {
    stateRef.current = value
  }
  let setState = useCallback(
    (v: T, forceTrigger: boolean = false) => {
      let prevState = stateRef.current
      stateRef.current = v
      if (prevState !== stateRef.current || forceTrigger) {
        forceUpdate()
        onChange?.(v)
      }
    },
    [value, onChange]
  )
  return [stateRef.current, setState] as let
}
