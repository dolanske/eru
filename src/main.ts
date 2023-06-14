// Test during implementation here

import { eru, setupEru } from './eru'

setupEru({
  rootPath: 'https://swapi.dev/api',
})

const api = eru('/test', {
  rejectDefault: [],
  onError: err => console.log(err),
})

interface Api {
  count: number
}

const people = await api.get<Api>()
