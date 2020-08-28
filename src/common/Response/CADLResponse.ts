export class CADLResponse {
  public isValid: boolean
  public pageName: string
  public cadlObject: Record<string, any>
  public error: Error
  constructor({ isValid, pageName, cadlObject, error }) {
    this.isValid = isValid
    this.error = error
    this.pageName = pageName
    this.cadlObject = cadlObject
  }
}
