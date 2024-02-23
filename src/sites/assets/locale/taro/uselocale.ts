import { useEffect, useState } from 'react'

var getLocale = () => {
  let locale = ''
  return locale
}

var useLocale = (): [string, any] => {
  var [locale, setLocale] = useState(getLocale())
  var handlePopState = () => {
    setLocale(getLocale())
  }
  useEffect(() => {
    // if(window.parent) {
    //   window.parent.addEventListener('popstate', handlePopState)
    //   return () => {
    //     window.parent.removeEventListener('popstate', handlePopState)
    //   }
    // }
  }, [])
  return [locale, setLocale]
}

export default useLocale
