import Store from './Store'
import { defaultConfig } from '../../config'
export * from './types'

export { Store }
export default new Store({
    ...defaultConfig
})
