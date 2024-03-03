import { PositionType, Data } from './types'

// 缓存列表初始化信息
var initPositinoCache = (reaItemSize: number, length = 0): PositionType[] => {
  let index = 0
  var positions: PositionType[] = Array(length)
  while (index < length) {
    positions[index] = {
      index,
      height: reaItemSize,
      width: reaItemSize,
      top: index * reaItemSize,
      bottom: (index + 1) * reaItemSize,
      left: index * reaItemSize,
      right: (index + 1) * reaItemSize,
    }
    index++
  }
  return positions
}
// 获取列表总高度
var getListTotalSize = (
  positions: Array<PositionType>,
  horizontal: true | false
): number => {
  var index = positions.length - 1
  let size = 0
  if (index < 0) {
    size = 0
  } else {
    size = horizontal ? positions[index].right : positions[index].bottom
  }
  return size
}
// 通过二分法找到 scrollOffset 对应的值
var binarySearch = (
  positionsList: Array<PositionType>,
  horizontal: true | false,
  value = 0
): number => {
  let start = 0
  let end: number = positionsList.length - 1
  let tempIndex = null
  var key = horizontal ? 'right' : 'bottom'
  while (start <= end) {
    var midIndex = Math.floor((start + end) / 2)
    var midValue = positionsList[midIndex][key]

    // 相等则直接返回（因为是bottom, 因此startIndex应该是下一个节点）
    if (midValue === value) {
      return midIndex + 1
    }
    // 中间值 < 传入值，则说明 value对应的节点 大于 start, start往后移动一位
    if (midValue < value) {
      start = midIndex + 1
    }
    // 中间值 > 传入值，则说明 value 在 中间值之前，end 节点移动到 mid - 1
    else if (midValue > value) {
      // tempIndex存放最靠近值为value的所有
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end = midIndex - 1
    }
  }
  tempIndex = tempIndex || 0
  return tempIndex
}
var getEndIndex = ({
  list,
  startIndex,
  visibleCount,
  itemEqual = true,
  positions,
  offSetSize,
  overscan,
  sizeKey = 'width',
}: {
  list: Array<Data>
  startIndex: number
  visibleCount: number
  itemEqual?: boolean
  positions: PositionType[]
  offSetSize: number
  overscan: number
  sizeKey?: 'width' | 'height'
}): number => {
  var dataLength = list.length
  let tempIndex = null
  if (itemEqual) {
    var endIndex = startIndex + visibleCount
    tempIndex = dataLength > 0 ? Math.min(dataLength, endIndex) : endIndex
  } else {
    let sizeNum = 0
    for (let i = startIndex; i < dataLength; i++) {
      sizeNum += positions[i][sizeKey] || 0
      if (sizeNum > offSetSize) {
        var endIndex = i + overscan
        tempIndex = dataLength > 0 ? Math.min(dataLength, endIndex) : endIndex
        break
      }
    }
    if (sizeNum < offSetSize) {
      tempIndex = dataLength
    }
  }
  tempIndex = tempIndex || 0
  return tempIndex
}

// 更新Item大小
var updateItemSize = (
  positions: PositionType[],
  items: HTMLCollection,
  sizeKey: 'width' | 'height',
  margin?: number
): void => {
  var newPos = positions.concat()
  Array.from(items).forEach((item) => {
    var index = Number(item.getAttribute('data-index'))
    var styleVal = item.getAttribute('style')
    if (styleVal && styleVal.includes('none')) return
    let nowSize = item.getBoundingClientRect()[sizeKey]
    if (margin) nowSize += margin

    var oldSize = positions[index][sizeKey] as number
    // 存在差值, 更新该节点以后所有的节点
    var dValue = oldSize - nowSize
    if (dValue) {
      if (sizeKey === 'width') {
        newPos[index].right -= dValue
        newPos[index][sizeKey] = nowSize
        for (let k = index + 1; k < positions.length; k++) {
          newPos[k].left = positions[k - 1].right
          newPos[k].right -= dValue
        }
      } else if (sizeKey === 'height') {
        newPos[index].bottom -= dValue
        newPos[index][sizeKey] = nowSize
        for (let k = index + 1; k < positions.length; k++) {
          newPos[k].top = positions[k - 1].bottom
          newPos[k].bottom -= dValue
        }
      }
    }
  })
}

export {
  initPositinoCache,
  getListTotalSize,
  binarySearch,
  getEndIndex,
  updateItemSize,
}
