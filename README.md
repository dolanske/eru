# eru 得る

Japanese for `get` (that's what google translate told be at least)

Super simple wrapper around the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Usage

```ts
import { eru, setupEru } from './eru'

// Global configuration. Should be called before any instances are created
setupEru({ rootPath: 'https://swapi.dev/api' })

// Define a new API route
const peopleApi = eru('/people')

// You can also pass in a type of the expected data
interface User { name: string; email: string }

peopleApi.get<User[]>() // => Promise<User[]>
peopleApi.get<User>(1) // => Promise<User>

// By supplying the interface in post/put/patch, you can also make typescript aware of missing fields
peopleApi.post<User>({
  body: {
    // Will complain about a missing `email` field
    name: 'Hello world',
  },
})
  .then(() => console.log('It worked'))
  .catch(console.error)
```

---

## API

```ts
// Additional options on top of normal fetch options
interface EruConfig extends RequestInit {
  rootPath?: string
  authTokenKey?: string
  /**
   * In case the request fails for any reason, instead of return an Error object masked as T,
   * it will resolve as `resolve(cfg.rejectReturn as T).
   * This is an equivalent of adding the following example to your code:
   *
   * `const res = api.get<Item[]>().catch(() => [])`
   *
   * You can still work with the error by adding the `onError` function in the options.
   *
   */
  rejectReturn?: any
  onError?: (error: Error, type: Request['method'],) => void
  onLoading?: (isLoading: boolean, type: Request['method']) => void
  onDone?: (type: Request['method']) => void
}

interface RequestConfig<OptionalBodyType = string | object> extends Omit<EruConfig, 'body'> {
  // Object which will be stringified to the url query such as ?key=value&key=value,value2
  query?: string | Record<string, string | number>
  // Normal request wants body to be a string, but we allow an object
  body: OptionalBodyType
}

type Eru = (path: string, options?: EruConfig) => {
  get<T>(id?: string | number | Omit<RequestConfig, 'body'>, options?: RequestConfig): Promise<T>
  delete<T>(id: number, options?: Omit<RequestConfig, 'body'>): Promise<T>
  post<T>(options: RequestConfig<T>): Promise<T>
  put<T>(id: string | number, options: RequestConfig<T>): Promise<T>
  patch<T>(id: string | number, options: RequestConfig<T>): Promise<T>
  // Cancel all running requests
  cancel(): void
}
```

## Configuration

At any point you can supply a new `EruConfig` interface to the function. There are 3 steps to configuration, each overwriting the previous one.

```ts
// 1. The global options object.
//    Used to set up the rootPath or authentication token key
setupEru(options: EruConfig)

// 2. Instance options
//    Used when some options should be modified for all calls to a specific endpoint
const api = eru('/path', options: EruConfig)

// 3. Fetch method
//    Situational, per call settings. This settings object also contains two additional
//    fields as documented in the `RequestConfig` interface
api.get(options: RequestConfig)
```

---

## Feedback / Contributions

As usual, this library is to make my life easier when working on my personal projects. If you have any feedback, bugs, suggestions or just want to contribute, you're more than welcome to do so. I am open to any and all collaboration. So don't hesitate to open an Issue or a PR!
