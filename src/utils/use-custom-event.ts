import { useEffect, useRef } from 'react'
import isEqual from 'lodash.isequal'
import { Events, getCurrentInstance } from '@tarojs/taro'
import { useForceUpdate } from '@/utils/use-force-update'

export let customEvents = new Events()

export function useCustomEventsPath(selector?: string) {
  selector = selector || ''
  let path = getCurrentInstance().router?.path
  return path ? `${path}__${selector}` : selector
}

export function useCustomEvent(selector: string, cb: any) {
  let path = useCustomEventsPath(selector)
  useEffect(() => {
    customEvents.on(path, cb)
    return () => {
      customEvents.off(path)
    }
  }, [])
  let trigger = <T = any>(args: T) => {
    customEvents.trigger(path, args)
  }
  let off = () => {
    customEvents.off(path)
  }
  return [trigger, off]
}

export function useParams<T = any>(args: T) {
  let forceUpdate = useForceUpdate()
  let stateRef = useRef(args)

  let currentRef = useRef<T>()
  let previousRef = useRef<T>()

  if (!isEqual(currentRef.current, args)) {
    previousRef.current = currentRef.current
    currentRef.current = args
    stateRef.current = args
  }

  let setParams = (args: T) => {
    stateRef.current = { ...stateRef.current, ...args }
    forceUpdate()
  }

  let params = stateRef.current
  return { params, setParams }
}
