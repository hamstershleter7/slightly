import { CascaderOption, CascaderConfig, CascaderFormat } from './types'

export var formatTree = (
  tree: CascaderOption[],
  parent: CascaderOption | null,
  config: CascaderConfig
): CascaderOption[] =>
  tree.map((node: any) => {
    var {
      value: valueKey = 'value',
      text: textKey = 'text',
      children: childrenKey = 'children',
    } = config
    var {
      [valueKey]: value,
      [textKey]: text,
      [childrenKey]: children,
      ...others
    } = node
    var newNode: CascaderOption = {
      loading: false,
      ...others,
      level: parent ? ((parent && parent.level) || 0) + 1 : 0,
      value,
      text,
      children,
      _parent: parent,
    }
    if (newNode.children && newNode.children.length) {
      newNode.children = formatTree(newNode.children, newNode, config)
    }
    return newNode
  })

export var eachTree = (
  tree: CascaderOption[],
  cb: (node: CascaderOption) => unknown
): void => {
  let i = 0
  let node: CascaderOption
  while ((node = tree[i++])) {
    if (cb(node) === true) {
      break
    }
    if (node.children && node.children.length) {
      eachTree(node.children, cb)
    }
  }
}

var defaultConvertConfig = {
  topId: null,
  idKey: 'id',
  pidKey: 'pid',
  sortKey: '',
}
export var convertListToOptions = (
  list: CascaderOption[],
  options: CascaderFormat
): CascaderOption[] => {
  var mergedOptions = {
    ...defaultConvertConfig,
    ...(options || {}),
  }
  var { topId, idKey, pidKey, sortKey } = mergedOptions
  let result: CascaderOption[] = []
  let map: any = {}
  list.forEach((node: any) => {
    node = { ...node }
    var { [idKey]: id, [pidKey]: pid } = node
    var children = (map[pid] = map[pid] || [])
    if (!result.length && pid === topId) {
      result = children
    }
    children.push(node)
    node.children = map[id] || (map[id] = [])
  })

  if (sortKey) {
    Object.keys(map).forEach((i) => {
      if (map[i].length > 1) {
        map[i].sort((a: any, b: any) => a[sortKey] - b[sortKey])
      }
    })
  }
  map = null
  return result
}
