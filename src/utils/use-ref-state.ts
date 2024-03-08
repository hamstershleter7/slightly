import { MutableRefObject, useRef, useState } from 'react'

export let getRefValue = <T>(ref: React.MutableRefObject<T>): T => {
  return ref.current
}
export let useRefState = <T>(
  param: T
): [MutableRefObject<T>, (p: T) => void] => {
  let ref = useRef(param)
  let [, setState] = useState(param)
  let updateState = (p: T) => {
    ref.current = p
    setState(p)
  }
  return [ref, updateState]
}
