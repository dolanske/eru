# eru 得る

Japanese for `get` (that's what google translate told be at least)

Super simple wrapper around the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Create a simple API router, with full type safety.

## Usage

```ts
import { eru } from './eru'

interface Person {
  id: number
  name: string
}

// Setup, create an eru instance
const router = eru('https://swapi.dev/api')
// Create an API route
const people = router.route('/people')

// Each route exposes the RouteInstance
const getPeople = people.get<Person[]>() // Promise<Person[]>
const getPerson = (id) => people.get<Person>(id) // Promise<Person>
const createPerson = (newPerson: Person) => people.post(newPerson, {
  headers: {
    'Content-type': 'application/json'
  }
})
const removePerson = (id) => people.delete(id)
```