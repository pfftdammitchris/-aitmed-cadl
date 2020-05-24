export default class UnableToExecuteDataModelFn extends Error {
    public error: Error | undefined
    public name: string
    constructor(message: string, error?: Error) {
        super(message)
        this.error = error
        this.name = 'UnableToExecuteDataModelFn'
        Object.setPrototypeOf(this, UnableToExecuteDataModelFn.prototype)
    }
}