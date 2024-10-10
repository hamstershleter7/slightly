import Taro, { createSelectorQuery } from '@tarojs/taro'

export let getTaroRectById = (id: string) => {
  return new Promise((resolve, reject) => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      let t = document ? document.querySelector(`#${id}`) : ''
      if (t) {
        resolve(t?.getBoundingClientRect())
      }
      reject()
    } else {
      let query = createSelectorQuery()
      query
        .select(`#${id}`)
        .boundingClientRect()
        .exec(function (rect: any) {
          if (rect[0]) {
            resolve(rect[0])
          } else {
            reject()
          }
        })
    }
  })
}
