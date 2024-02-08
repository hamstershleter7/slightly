import React, { useEffect, useState } from 'react'
import useLocale from '@/sites/assets/locale/uselocale'
import { BaseLang } from '@/locales/base'

type Keys = keyof BaseLang
interface LanguagesPackage<A = {}> {
  [key: string]: {
    [k in Keys]?: string
  } &
    A
}

export let useTranslate = <T>(languagesPackage: LanguagesPackage<T>) => {
  let [locale] = useLocale()
  let [translated, setLanguagesPackage] = useState<BaseLang & T>(
    languagesPackage[locale || 'zh-CN'] as any
  )
  // useEffect(() => {
  //   if (languagesPackage) {
  //     // @ts-ignore
  //     setLanguagesPackage(languagesPackage[locale || 'zh-CN'] || {})
  //   }
  // }, [])
  return [translated]
}
