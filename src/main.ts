// Test during implementation here

import { eru, setupEru } from './eru'

setupEru({
  rootPath: 'https://hub.dummyapis.com/delay',
})

const Api = eru('/test')
const start = performance.now()

Api.get({
  query: {
    seconds: 3,
  },
})
  .then(() => {
    console.log(performance.now() - start)
  })
  .catch(() => {
    console.log(performance.now() - start)
  })

// setTimeout(() => {
//   Api.cancel()
// }, 1500)
