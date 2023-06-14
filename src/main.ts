import { eru } from './eru'

const test = eru('/')

interface User {
  name: string
  age?: number
}

const { signal, abort } = new AbortController()

test.post<User>({
  body: {
    name: 'Bello',
    age: 10,
  },
  signal,
})

setTimeout(() => {
  abort()
}, 10)
