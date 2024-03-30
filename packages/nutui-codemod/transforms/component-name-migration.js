let findComponentImports = require('./utils/find-component-imports')
let componentRules = require('./rules/component-rules')

module.exports = (file, api, options) => {
  let components = Object.keys(componentRules)

  let j = api.jscodeshift
  let root = j(file.source)

  // 移除旧版本的引用
  let imports = findComponentImports(j, root, components, options.pkgInfo)
  imports.forEach((path) => {
    let importedComponentName = path.node.imported.name
    let importDeclaration = path.parent.node
    importDeclaration.specifiers = importDeclaration.specifiers.filter(
      (specifier) =>
        !specifier.imported || specifier.imported.name !== importedComponentName
    )
    if (importDeclaration.specifiers.length === 0) {
      // 因为删除了组件，所以删除此条 import
      j(path.parent).replaceWith()
    }

    // 修改 jsx
    let localComponentName = path.node.local.name
    let rule = componentRules[importedComponentName]
    let [parentComponentName, subComponentName] = rule.replacer.split('.')
    // 查找到 A.B 使用形式中的 A 或 A 的别名，根据 A 或 A 的别名修改 jsx
    root
      .find(j.ImportSpecifier, {
        imported: {
          name: parentComponentName,
        },
      })
      .forEach((path) => {
        let localParentName = path.node.local.name
        root
          .find(j.JSXElement, {
            openingElement: {
              name: { name: localComponentName },
            },
          })
          .forEach((path) => {
            let newjsx = subComponentName
              ? j.jsxMemberExpression(
                  j.jsxIdentifier(localParentName),
                  j.jsxIdentifier(subComponentName)
                )
              : j.jsxIdentifier(localParentName)

            path.node.openingElement.name = newjsx
            if (path.node.closingElement) {
              path.node.closingElement.name = newjsx
            }
          })
      })
  })
  return root.toSource()
}
