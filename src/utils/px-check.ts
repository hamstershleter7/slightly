export let pxCheck = (value: string | number): string => {
  return Number.isNaN(Number(value)) ? String(value) : `${value}px`
}
