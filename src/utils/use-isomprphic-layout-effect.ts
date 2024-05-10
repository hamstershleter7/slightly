import { useEffect, useLayoutEffect } from 'react'
import { canUseDom } from '@/utils/can-use-dom'

export let useIsomorphicLayoutEffect = canUseDom ? useLayoutEffect : useEffect
