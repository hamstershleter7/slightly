import { MouseEventHandler } from 'react'

let handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
  e.stopPropagation()
  let isIcon = (e.target as HTMLDivElement).className.includes('arrow-icon')
  let isTitle =
    (e.target as HTMLDivElement).className.includes('-title') || isIcon
  let currentClass = e.currentTarget.className
  let isShow = currentClass.includes('sidenavbar-show')
  let arrowIcon = e.currentTarget.querySelector('.arrow-icon') as Element
  let iconClass = arrowIcon.className

  if (isTitle) {
    e.currentTarget.className = isShow
      ? currentClass.replace('sidenavbar-show', 'sidenavbar-hide')
      : currentClass.replace('sidenavbar-hide', 'sidenavbar-show')
    arrowIcon.className = isShow
      ? iconClass.replace('arrow-down', 'arrow-up')
      : iconClass.replace('arrow-up', 'arrow-down')
  }
}
export { handleClick }
