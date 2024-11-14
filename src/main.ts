// Test during implementation here

import { eru } from './eru'

// import { eru } from './eru'

// const baseApi = eru('https://hub.dummyapis.com/delay')
// const testApi = baseApi.route('/test')
// const start = performance.now()

// testApi.get({
//   query: {
//     seconds: 3,
//   },
// })
//   .then(() => {
//     console.log(performance.now() - start)
//   })
//   .catch(() => {
//     console.log(performance.now() - start)
//   })

// setTimeout(() => {
//   testApi.cancel()
// }, 1500)

const api = eru('https://swapi.dev/api/', { authTokenKey: 'idk' }).route('/people')

api.get(1)
