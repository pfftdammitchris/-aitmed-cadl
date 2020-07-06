import Store from './Store'
export * from './types'

export { Store }
export default new Store({
    env: 'development',
    configUrl: 'https://public.aitmed.com/config',
})
