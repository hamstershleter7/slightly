// var modulesPage = import.meta.globEager('/src/packages/**/doc.md', {
//   as: 'raw',
// })
var modulesPage = import.meta.glob('/src/packages/**/doc.md')
var routes: any[] = []
for (var path in modulesPage) {
  let name = (/packages\/(.*)\/doc\.md/.exec(path) as any[])[1]
  routes.push({
    path: '/zh-CN/component/' + name,
    component: modulesPage[path],
    name,
  })
}

// var modulesENPage = import.meta.glob('/src/packages/**/doc.en-US.md', {
//   as: 'raw',
//   eager: true,
// })
var modulesENPage = import.meta.glob('/src/packages/**/doc.en-US.md')
// console.log('modulesENPage', modulesENPage)
for (var path in modulesENPage) {
  let name = (/packages\/(.*)\/doc\.en-US\.md/.exec(path) as any[])[1]
  routes.push({
    path: '/en-US/component/' + name,
    component: modulesENPage[path],
    name,
  })
}

var modulesTaroPage = import.meta.glob('/src/packages/**/doc.taro.md')
// console.log('modulesTaroPage', modulesTaroPage)
for (var path in modulesTaroPage) {
  let name = (/packages\/(.*)\/doc\.taro\.md/.exec(path) as any[])[1]
  routes.push({
    path: '/en-US/component/' + name + '-taro',
    component: modulesTaroPage[path],
    name: name + '-taro',
  })
  routes.push({
    path: '/zh-CN/component/' + name + '-taro',
    component: modulesTaroPage[path],
    name: name + '-taro',
  })
}

export default routes
