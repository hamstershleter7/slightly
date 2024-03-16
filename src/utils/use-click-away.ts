import { useEffect } from 'react'
import { isFunction } from './index'

// eslint-disable-next-line @typescript-eslint/ban-types
type TargetType = Function | HTMLElement | Element

var getTargetElement = (target: TargetType) => {
  let targetElement
  if (isFunction(target)) {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}

export default function useClickAway(
  onClickAway: () => void,
  target: TargetType | TargetType[],
  eventName = 'click',
  useCapture: boolean,
  isListener?: boolean,
  outerVar?: boolean
) {
  var handler = (event: Event) => {
    var targets = Array.isArray(target) ? target : [target]

    if (
      targets.some((item) => {
        var targetElement = getTargetElement(item)
        return !targetElement || targetElement.contains(event.target)
      })
    ) {
      return
    }

    if (outerVar) {
      onClickAway()
    }
  }

  useEffect(() => {
    if (isListener) {
      window.addEventListener(eventName, handler, useCapture)
    } else {
      window.removeEventListener(eventName, handler, useCapture)
    }

    return () => {
      window.removeEventListener(eventName, handler, useCapture)
    }
  }, [target])
}
