# eru 得る

Japanese for `get` (that's what google translate told me at least)

Super simple wrapper around the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Create a simple API router, with full type safety.

```bash
npm i @dolanske/eru
```

## Usage

First create an API router by providing it with the base API path and options.

```ts
import { eru } from './eru'
import { apiToken } from './config'

const router = eru('api.myproject.dev', {
  headers: {
    Authorization: `Bearer ${apiToken}`
  }
})
```

Now you can create as many routes as you wish, using the `route` function.

```ts
const people = router.route('/people')
const tags = router.route('/people/tags')
```

Each route exposes standard request methods and a cancel method, which would stop all pending calls within the route.
```ts
people.get()
people.post()
people.put()
people.patch()
people.delete()
people.cancel()
```

## Examples

Create an API route for `/people`. Each request method is wrapped in an arrow function so you can provide types for parameters.

```ts
interface Person { id: number, name: string }
const people = eru('https://swapi.dev/api').route('/people')

// returns Promise<Person[]>
const getPeople = () => people.get<Person[]>()

// Adding an ID to the .get() call will append a `/${id}` to the route path
// returns Promise<Person>
const getPerson = (id: number) => people.get<Person>(id)

function createPerson(newPerson: Person) {
  return people.post(newPerson, {
    headers: { 'Content-type': 'application/json' }
  })
    .then((data) => {})
    .catch((err) => {})
}

const removePerson = (id: number) => people.delete(id)
```
