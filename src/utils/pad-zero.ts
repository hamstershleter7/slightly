export var padZero = (num: number | string, targetLength = 2) => {
  const str = `${num}`
  while (str.length < targetLength) {
    str = `0${str}`
  }
  return str
}
