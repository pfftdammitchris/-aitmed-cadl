import CheckStopWord from './CheckStopWord'
import { isObject } from '../../../utils'

const checkStopWord = new CheckStopWord()

function cPush(contentMap: Map<string, string>, sKey: string) {
  if (sKey.length <= 1) {
    return
  }
  if (checkStopWord.isStopWord(sKey)) {
    return
  }
  if (contentMap.has(sKey)) {
    return
  }
  contentMap.set(sKey, "")
}

function caPush(contentMap: Map<string, string>, sKey: string[]) {
  for (let key of sKey) {
    cPush(contentMap, key)
  }
}

export default function extract(content: any) {
  const { data, type, title, user, targetRoomName } = content
  //let contentArr: string[] = []
  let contentMap = new Map()
  if (
    data &&
    typeof data === 'string' &&
    !data.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/g)
  ) {
    caPush(contentMap, data.split(/\W+/))
  }
  if (isObject(data)) {
    const { isFavorite, ...restOfProps } = data
    for (let [_, val] of Object.entries(restOfProps)) {
      //contentArr.push(...key.split(/\W+/))
      caPush(contentMap, (<string>val).split(/\W+/))
    }
  }
  if (type) {
    caPush(contentMap, type.split(/\W+/))
  }
  if (title) {
    caPush(contentMap, title.split(/\W+/))
  }
  if (user) {
    caPush(contentMap, user.split(/\W+/))
  }
  if (targetRoomName) {
    caPush(contentMap, targetRoomName.split(/\W+/))
  }
  // return contentMap.keys
  // let contentArr = contentMap.keys
  // const checkStopWord = new CheckStopWord()
  // const wordMap = contentArr.reduce((acc, word) => {
  //   const currWord = word.toLowerCase()
  //   if (currWord && !checkStopWord.isStopWord(currWord)) {
  //     acc[currWord] = acc[currWord] + 1 || 1
  //   }
  //   return acc
  // }, {})

  let result: string[] = []
  for (let key of contentMap.keys()) {
    result.push(key)
  }
  console.log('BasicAlgorithm.ts:55', result)
  return result
}
