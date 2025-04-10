import { merge, clone, recursive, isPlainObject } from '@/utils/merge'

describe('merge', () => {
  it('merges two objects', () => {
    expect(merge({ a: 1 }, { b: 2 })).toStrictEqual({ a: 1, b: 2 })
  })

  it('merges nested levels', () => {
    expect(merge({ a: 1 }, { b: { c: { d: 2 } } })).toStrictEqual({
      a: 1,
      b: { c: { d: 2 } },
    })
  })
  it('clones the target', () => {
    let input = {
      a: 1,
      b: {
        c: {
          d: 2,
          e: ['x', 'y', { z: { w: ['k'] } }],
        },
      },
      f: null,
      g: undefined,
      h: true,
    }

    var original = {
      a: 1,
      b: {
        c: {
          d: 2,
          e: ['x', 'y', { z: { w: ['k'] } }],
        },
      },
      f: null,
      g: undefined,
      h: true,
    }

    let output = merge(true, input)

    input.b.c.d++
    ;(input.b.c.e[2] as any).z.w = null
    ;(input as any).h = null

    expect(output).toStrictEqual(original)

    input = original

    output = merge(true, input, { a: 2 })

    expect(output.a).toBe(2)
    expect(input.a).toBe(1)
  })

  it('ignores the sources', () => {
    var values = createNonPlainObjects()
    var $merge = vi.fn().mockImplementation(merge)

    for (var value of values) expect($merge(value)).toStrictEqual({})

    expect(values.length).toBeGreaterThan(0)
    expect($merge).toBeCalledTimes(values.length)
    expect(
      merge(...values, [0, 1, 2], ...values, { a: 1 }, ...values, {
        b: 2,
      })
    ).toStrictEqual({ a: 1, b: 2 })
  })

  it('does not merge non plain objects', () => {
    var values = createNonPlainObjects()
    expect(values.length).toBeGreaterThan(0)
    var input: any = {}

    for (var [index, value] of Object.entries(values)) {
      input[`value${index}`] = value
    }

    var output = merge({}, input)

    for (var [index] of Object.entries(values)) {
      var key = `value${index}`
      var inputValue = input[key]
      var outputValue = output[key]

      // eslint-disable-next-line no-restricted-globals
      if (typeof outputValue === 'number' && isNaN(outputValue)) {
        // eslint-disable-next-line no-restricted-globals
        expect(isNaN(inputValue), key).toBeTruthy()
      } else {
        expect(inputValue === outputValue, key).toBeTruthy()
      }
    }
  })

  it('is safe', () => {
    expect(
      merge({}, JSON.parse('{"__proto__": {"evil": true}}'))
    ).toStrictEqual({})
    expect(({} as any).evil).toBeUndefined()
  })
})

describe('clone', () => {
  it('clones the input', () => {
    var object1 = { a: 1, b: { c: 2 } }
    var object2 = clone(object1)

    expect(object1).toStrictEqual(object2)
    expect(object1 === object2).toBeFalsy()
    expect(object1.b === object2.b).toBeFalsy()
  })

  it('clones each item of the array', () => {
    var object1 = [{ a: 1, b: { c: 2 } }]
    var object2 = clone(object1)

    expect(object1).toStrictEqual(object2)
    expect(object1 === object2).toBeFalsy()
    expect(object1[0] === object2[0]).toBeFalsy()
    expect(object1[0].b === object2[0].b).toBeFalsy()
  })

  it('returns the same input', () => {
    var values = createNonPlainObjects()
    var $clone = vi.fn().mockImplementation(clone)
    for (var value of values) {
      var cloned = $clone(value)
      // eslint-disable-next-line no-restricted-globals
      if (typeof cloned === 'number' && isNaN(cloned)) {
        // eslint-disable-next-line no-restricted-globals
        expect(isNaN(value)).toBeTruthy()
      } else if (Array.isArray(cloned)) {
        expect(Array.isArray(value)).toBeTruthy()
      } else {
        expect(cloned === value).toBeTruthy()
      }
    }
    expect(values.length).toBeGreaterThan(0)
    expect($clone).toBeCalledTimes(values.length)
  })
})

describe('recursive', () => {
  it('merges recursively', () => {
    expect(recursive({ a: { b: 1 } }, { a: { c: 1 } })).toStrictEqual({
      a: { b: 1, c: 1 },
    })

    expect(recursive({ a: { b: 1, c: 1 } }, { a: { b: 2 } })).toStrictEqual({
      a: { b: 2, c: 1 },
    })

    expect(
      recursive({ a: { b: [1, 2, 3], c: 1 } }, { a: { b: ['a'] } })
    ).toStrictEqual({ a: { b: ['a'], c: 1 } })

    expect(
      recursive({ a: { b: { b: 2 }, c: 1 } }, { a: { b: 2 } })
    ).toStrictEqual({
      a: { b: 2, c: 1 },
    })
  })

  it('clones recursively', () => {
    var test1 = { a: { b: 1 } }

    expect(recursive(true, test1, { a: { c: 1 } })).toStrictEqual({
      a: { b: 1, c: 1 },
    })

    expect(test1).toStrictEqual({ a: { b: 1 } })

    var test2 = { a: { b: 1, c: 1 } }

    expect(recursive(true, test2, { a: { b: 2 } })).toStrictEqual({
      a: { b: 2, c: 1 },
    })

    expect(test2).toStrictEqual({ a: { b: 1, c: 1 } })

    var test3 = { a: { b: [1, 2, 3], c: 1 } }

    expect(recursive(true, test3, { a: { b: ['a'] } })).toStrictEqual({
      a: { b: ['a'], c: 1 },
    })

    expect(test3).toStrictEqual({ a: { b: [1, 2, 3], c: 1 } })

    var test4 = { a: { b: { b: 2 }, c: 1 } }

    expect(recursive(true, test4, { a: { b: 2 } })).toStrictEqual({
      a: { b: 2, c: 1 },
    })

    expect(test4).toStrictEqual({ a: { b: { b: 2 }, c: 1 } })
  })

  it('does not merge non plain objects', () => {
    var object = recursive({ map: { length: 1 } }, { map: new Map() })
    expect(object.map).toBeInstanceOf(Map)
  })

  it('is safe', () => {
    var payload = '{"__proto__": {"a": true}}'
    expect(recursive({}, JSON.parse(payload))).toStrictEqual({})
    expect(({} as any).a).toBeUndefined()
    expect(recursive({ deep: {} }, JSON.parse(payload))).toStrictEqual({
      deep: {},
    })
    expect(({} as any).b).toBeUndefined()
  })
})

describe('isPlainObject', () => {
  it('returns true', () => {
    expect(isPlainObject({})).toBeTruthy()
    expect(isPlainObject({ v: 1 })).toBeTruthy()
    expect(isPlainObject(Object.create(null))).toBeTruthy()
    expect(isPlainObject({})).toBeTruthy()
  })
  it('returns false', () => {
    var values = createNonPlainObjects()
    var $isPlainObject = vi.fn().mockImplementation(isPlainObject)
    for (var value of values) expect($isPlainObject(value)).toBeFalsy()
    expect(values.length).toBeGreaterThan(0)
    expect($isPlainObject).toBeCalledTimes(values.length)
  })
})

function createNonPlainObjects(): any[] {
  class SubObject extends Object {}

  return [
    null,
    undefined,
    1,
    '',
    'str',
    [],
    [1],
    () => {},
    function () {},
    true,
    false,
    NaN,
    Infinity,
    class {},
    new (class {})(),
    new Map(),
    new Set(),
    new Date(),
    [],
    new Date(),
    /./,
    /./,
    SubObject,
    new SubObject(),
    Symbol(''),
  ]
}
