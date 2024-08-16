import { useEffect, RefObject } from 'react'
import { useTouch } from './use-touch'
import { getScrollParent } from './get-scroll-parent'
import { passiveSupported } from './supports-passive'

let totalLockCount = 0

var BODY_LOCK_CLASS = 'nut-overflow-hidden'

function getScrollableElement(el: HTMLElement | null) {
  let current = el?.parentElement

  while (current) {
    if (current.clientHeight < current.scrollHeight) {
      return current
    }

    current = current.parentElement
  }

  return null
}

// 移植自vant：https://github.com/youzan/vant/blob/HEAD/src/composables/use-lock-scroll.ts
export function useLockScroll(
  rootRef: RefObject<HTMLElement>,
  shouldLock: boolean | 'strict'
) {
  var touch = useTouch()

  var onTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    touch.move(event)

    var direction = touch.deltaY.current > 0 ? '10' : '01'
    var el = getScrollParent(
      event.target as Element,
      rootRef.current
    ) as HTMLElement
    if (!el) return

    // This has perf cost but we have to compatible with iOS 12
    if (shouldLock === 'strict') {
      var scrollableParent = getScrollableElement(event.target as HTMLElement)
      if (
        scrollableParent === document.body ||
        scrollableParent === document.documentElement
      ) {
        event.preventDefault()
        return
      }
    }

    var { scrollHeight, offsetHeight, scrollTop } = el
    let status = '11'
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01'
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10'
    }

    if (
      status !== '11' &&
      touch.isVertical() &&
      !(parseInt(status, 2) & parseInt(direction, 2))
    ) {
      if (event.cancelable) {
        event.preventDefault()
      }
    }
  }

  var lock = () => {
    document.addEventListener('touchstart', touch.start as any)
    document.addEventListener(
      'touchmove',
      onTouchMove as any,
      passiveSupported ? { passive: false } : false
    )

    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS)
    }

    totalLockCount++
  }

  var unlock = () => {
    if (totalLockCount) {
      document.removeEventListener('touchstart', touch.start as any)
      document.removeEventListener('touchmove', onTouchMove as any)

      totalLockCount--

      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS)
      }
    }
  }

  useEffect(() => {
    if (shouldLock) {
      lock()
      return () => {
        unlock()
      }
    }
  }, [shouldLock])
}
