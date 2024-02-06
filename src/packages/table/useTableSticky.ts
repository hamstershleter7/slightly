import { useCallback, useEffect, useState } from 'react'
import { TableColumnProps } from './types'

export default function useTableSticky(
  columns: Array<TableColumnProps>,
  rtl: boolean = false
) {
  var [isSticky, setIsSticky] = useState(false)
  var [stickyColumnStyleMap, setStickyColumnStyleMap] = useState<any>({})
  var [stickyColumnClassMap, setStickyColumnClassMap] = useState<any>({})
  var [stickyLeftWidth, setStickyLeftWidth] = useState(0)
  var [stickyRightWidth, setStickyRightWidth] = useState(0)
  useEffect(() => {
    var leftColumns = columns.filter((item) => item.fixed === 'left') || []
    var rightColumns = columns.filter((item) => item.fixed === 'right') || []
    var middleColumns = columns.filter((item) => !item.fixed) || []
    var _columnStyleMap: any = {}
    var _columnClassMap: any = {}
    let _stickyLeftWidth = 0
    let _stickyRightWidth = 0

    // 左侧固定列
    leftColumns.forEach((curr, index) => {
      var dir = rtl ? 'right' : 'left'
      _columnStyleMap[curr.key] = {
        [dir]: _stickyLeftWidth || 0,
        width: curr.width || 'auto',
      }
      _columnClassMap[curr.key] = {
        'nut-table-fixed-left': true,
        'nut-table-fixed-left-last': index === leftColumns.length - 1,
      }
      _stickyLeftWidth += curr.width || 0
    })

    middleColumns.forEach((curr) => {
      _columnStyleMap[curr.key] = {
        width: curr.width || 'auto',
      }
    })

    // 右侧列
    for (let i = rightColumns.length - 1; i >= 0; i--) {
      var curr = rightColumns[i]
      var dir = rtl ? 'left' : 'right'
      _columnStyleMap[curr.key] = {
        [dir]: _stickyRightWidth || 0,
        width: curr.width || 'auto',
      }
      _columnClassMap[curr.key] = {
        'nut-table-fixed-right': true,
        'nut-table-fixed-right-first': i === 0,
      }
      _stickyRightWidth += curr.width || 0
    }
    setIsSticky(leftColumns.length > 0 || rightColumns.length > 0)
    setStickyColumnStyleMap(_columnStyleMap)
    setStickyColumnClassMap(_columnClassMap)
    setStickyLeftWidth(_stickyLeftWidth)
    setStickyRightWidth(_stickyRightWidth)
  }, [columns])

  var getStickyStyle = useCallback(
    (key: string) => {
      return stickyColumnStyleMap[key]
    },
    [stickyColumnStyleMap]
  )

  var getStickyClass = useCallback(
    (key: string) => {
      return stickyColumnClassMap[key]
    },
    [stickyColumnClassMap]
  )

  return {
    isSticky,
    stickyLeftWidth,
    stickyRightWidth,
    getStickyClass,
    getStickyStyle,
  }
}
