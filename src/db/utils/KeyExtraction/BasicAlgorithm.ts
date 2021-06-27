import CheckStopWord from './CheckStopWord'
import { isObject } from '../../../utils'

export default function extract(content: any) {
  const { data, type, title, user, targetRoomName } = content
  let contentArr: string[] = []
  if (
    data &&
    typeof data === 'string' &&
    !data.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/g)
  ) {
    contentArr.push(...data.split(/\W+/))
  }
  if (isObject(data)) {
    const { isFavorite, ...restOfProps } = data
    for (let [key, val] of Object.entries(restOfProps)) {
      contentArr.push(...key.split(/\W+/))
      contentArr.push(...val.split(/\W+/))
    }
  }
  if (type) {
    contentArr.push(...type.split(/\W+/))
  }
  if (title) {
    contentArr.push(...title.split(/\W+/))
  }
  if (user) {
    contentArr.push(...user.split(/\W+/))
  }
  if (targetRoomName) {
    contentArr.push(...targetRoomName.split(/\W+/))
  }
  const checkStopWord = new CheckStopWord()
  const wordMap = contentArr.reduce((acc, word) => {
    const currWord = word.toLowerCase()
    if (currWord && !checkStopWord.isStopWord(currWord)) {
      acc[currWord] = acc[currWord] + 1 || 1
    }
    return acc
  }, {})

  let result: string[] = []
  for (let key of Object.keys(wordMap)) {
    result.push(key)
  }
  return result
}
