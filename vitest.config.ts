import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // keep output concise
    reporters: 'default',
  },
})
