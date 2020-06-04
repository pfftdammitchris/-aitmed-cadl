import Store from './Store'
export * from './types'

export { Store }
export default new Store({
    apiVersion: 'v1beta1',
    apiHost: 'testapi2.aitmed.com',
    env: 'development',
    configUrl: 'https://public.aitmed.com/config',
})
