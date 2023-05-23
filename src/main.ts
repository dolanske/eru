import { eru } from './eru'

const test = eru('/')

interface User {
  name: string
  age?: number
}

test.post<User>({
  body: {
    name: 'Bello',
    age: 10,
  },
})
