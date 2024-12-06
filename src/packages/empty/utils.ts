import { EmptyAction } from './types'

export let getButtonType = (actions: Array<EmptyAction>, index: number) => {
  if (!actions || actions.length === 0) return 'default'
  let action = actions[index]
  if (action.type) return action.type
  return actions.length > 1 && index === 0 ? 'default' : 'primary'
}
