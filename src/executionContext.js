import { AsyncLocalStorage } from 'node:async_hooks'

export const requestExecutionContext = new AsyncLocalStorage();