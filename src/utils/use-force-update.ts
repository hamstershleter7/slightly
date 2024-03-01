import React from 'react'

export function useForceUpdate() {
  let [, updateState] = React.useState()
  return React.useCallback(() => updateState({} as any), [])
}
