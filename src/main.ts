import { eru, setupEru } from './eru'

// Global configuration
setupEru({
  rootPath: 'https://swapi.dev/api',
})

// Define a new API route
const someUserAPI = eru('/people')

interface User {
  name: string
  email: string
}

// Tell the API what type you expect to receive
someUserAPI.get<User[]>()
someUserAPI.get<User>(1)
someUserAPI.post({
  body: {
    name: 'new-user',
    email: 'idk',
  },
})
  .then(() => {
    console.log('It worked')
  })
  .catch((e) => {
    console.log(e)
  })

someUserAPI.patch(2, {
  body: {
    name: 'actually-different-name',
  },
})

someUserAPI.put(2, {
  body: {
    name: 'actually-different-name',
  },
})
someUserAPI.delete(2)
