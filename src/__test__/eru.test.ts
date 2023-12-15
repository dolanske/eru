import { describe, expect, test } from "vitest"
import { eru } from "../eru"

const inst = eru('https://swapi.dev/api/', {
  headers: {
    'Content-type': 'application/json'
  }
})

describe('Eru path serialization', () => {

  test('Eru config', () => {
    // @ts-expect-error it _will_
    expect(inst.cfg.headers['Content-type']).toBe('application/json')
    expect(inst.basePath).toBe('https://swapi.dev/api/')
  })

  test('Routes', () => {
    const instGet = inst.route('/people')

  })
  // test()
})