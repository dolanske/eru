# eru

Super simple wrapper around the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Usage

```ts
import { eru, setupEru } from './eru'

// Global configuration. Should be called before any instances are created
setupEru({ rootPath: 'https://swapi.dev/api' })

// Define a new API route (this will simply append )
const peopleApi = eru('/people', { })

interface User { name: string; email: string }

peopleApi.get<User[]>() // => Promise<User[]>
peopleApi.get<User>(1) // => Promise<User>
peopleApi.post<User>({
  body: {
    name: 'Hello world',
    email: 'hello@example.com'
  },
})
  .then(() => console.log('It worked'))
  .catch(e => console.error(e))
```

---

## API

```ts
// Additional options on top of normal fetch options
interface EruConfig extends RequestInit {
  rootPath?: string
  authTokenKey?: string
}

interface RequestOptions extends Omit<EruConfig, 'body'> {
  // Object which will be stringified to the url query such as ?key=value&key=value,value2
  query?: string | Record<string, string | number>
  // Normal request wants body to be a string, but we allow an object
  body?: string | object
}

type Eru = (path: string, options?: EruConfig) => {
  get<T>(id?: string | number | Omit<RequestOptions, 'body'>, options?: RequestOptions): Promise<T>
  delete<T>(id: number, options?: Omit<RequestOptions, 'body'>): Promise<T>
  post<T>(options: RequestOptions): Promise<T>
  put<T>(id: string | number, options: RequestOptions): Promise<T>
  patch<T>(id: string | number, options: RequestOptions): Promise<T>
}
```

## Configuration

At any point you can supply a new `EruConfig` interface to the function. There are 3 steps to configuration, each overwriting the following one.

```ts
// 3. The global options object.
//    Used to set up the rootPath or authentication token key
setupEru({})

// 2. Instance options
//    Used when some options should be modified for all calls to a specific endpoint

const api = eru('/path', { ...options })

// 3. Fetch method
//    Situational, per call settings. This settings object also contains two additional
//    fields as documented in the `RequestOptions` interface
api.get({ ...options })
```

---

## Feedback / Contributions

As usual, this library is to make my life easier when working on my personal projects. If you have any feedback, bugs, suggestions or just want to contribute, you're more than welcome to do so. I am open to any and all collaboration, so open an Issue or a PR! :)