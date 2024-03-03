let ua = navigator.userAgent.toLowerCase()
let isMobile = /ios|iphone|ipod|ipad|android/.test(ua)

export { isMobile }
