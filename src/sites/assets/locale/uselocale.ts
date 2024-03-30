import { useEffect, useState } from 'react'
import config from '@/sites/config/env'

export var getLocale = () => {
  let locale = 'zh-CN'
  try {
    var matched = window.parent.location.href.match(/#\/([a-z-]+)/i)
    if (matched) {
      ;[, locale] = matched
      if (config.locales.indexOf(locale) === -1) locale = 'zh-CN'
    }
  } catch (e) {}

  return locale
}

var useLocale = (): [string, any] => {
  var [locale, setLocale] = useState<string>(getLocale())
  var handlePopState = () => {
    setLocale(getLocale())
  }
  useEffect(() => {
    try {
      window.parent.addEventListener('popstate', handlePopState)
    } catch (e) {}
    return () => {
      try {
        window.parent.removeEventListener('popstate', handlePopState)
      } catch (e) {}
    }
  }, [])
  return [locale, setLocale]
}

export default useLocale
