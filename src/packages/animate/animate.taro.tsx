import React, { useState, FunctionComponent } from 'react'
import classNames from 'classnames'
import { View, ITouchEvent } from '@tarojs/components'
import { AnimateType, AnimateAction } from './types'
import { BasicComponent, ComponentDefaults } from '@/utils/typings'

export interface AnimateProps extends BasicComponent {
  type: AnimateType
  action: AnimateAction
  loop: boolean
  onClick: (event: React.MouseEvent<Element, MouseEvent> | ITouchEvent) => void
}

const defaultProps = {
  ...ComponentDefaults,
  type: 'shake',
  action: 'initial',
  loop: false,
  onClick: (event: React.MouseEvent<Element, MouseEvent> | ITouchEvent) => {},
} as AnimateProps

const classPrefix = 'nut-animate'

export const Animate: FunctionComponent<
  Partial<AnimateProps> & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { className, type, action, loop, onClick, children, style } = {
    ...defaultProps,
    ...props,
  }

  const [clicked, setClicked] = useState(false)

  const classes = classNames(
    {
      'nut-ani-container': true,
      [`${classPrefix}-${type}`]: action === 'initial' || clicked,
      loop,
    },
    className
  )

  const handleClick = (
    event: React.MouseEvent<Element, MouseEvent> | ITouchEvent
  ) => {
    setClicked(true)
    // 如果不是无限循环，清除类名
    if (!loop) {
      setTimeout(() => setClicked(false), 1000)
    }
    onClick(event)
  }

  return (
    <View className="nut-animate">
      <View className={classes} onClick={handleClick} style={style}>
        {children}
      </View>
    </View>
  )
}

Animate.displayName = 'NutAnimate'
