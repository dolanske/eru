import { eru } from './eru'

const test = eru('/')

test.post({
  body: {
    test: 5,
  },
})
