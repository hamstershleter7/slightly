import React from 'react'
import { GridItemProps } from '../griditem/griditem'

let gridContext = {
  onClick: (item: GridItemProps, index: number) => {},
}

export default React.createContext(gridContext)
