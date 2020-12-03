import setAPIBuffer from './setAPIBuffer'
export default function applyMidleware(apiFn) {
  return ({ ...args }) => {
    let pass = setAPIBuffer(args?.apiObject)
    if (pass) {
      return apiFn({ ...args })
    } else {
      return ({ ...args }) => {
        console.log(`rejected api request ${args}`)
        return
      }
    }
  }
}
