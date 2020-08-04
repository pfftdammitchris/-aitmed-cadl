import Store from './Store'
export * from './types'

export { Store }
export default new Store({
    env: 'test',
    configUrl: 'https://public.aitmed.com/config',
})
