var modulesPage = import.meta.glob('/src/packages/**/demo.tsx')

var routes: any[] = []
for (var path in modulesPage) {
  let name = (/packages\/(.*)\/demo.tsx/.exec(path) as any[])[1]
  routes.push({
    path: '/zh-CN/component/' + name.toLowerCase(),
    component: modulesPage[path],
    name,
  })

  routes.push({
    path: '/en-US/component/' + name.toLowerCase(),
    component: modulesPage[path],
    name,
  })
}

export default routes
