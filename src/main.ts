import { eru, setupEru } from './eru'

setupEru({
  rootPath: 'https://swapi.dev/api',
  rejectDefault: [],
})

const test = eru('/cum')

interface Result {
  count: number
}

test.get<Result[]>({
  rejectDefault: [],
  onLoading: state => console.log(state),

})
  .then((result) => {
    console.log(result)
  })

const result = fetch('/test')
