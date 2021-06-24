import CheckStopWord from './CheckStopWord'

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
  console.log('this is contentarr', contentArr)
  const wordMap = contentArr.reduce((acc, word) => {
    const currWord = word.toLowerCase()
    if (currWord && !checkStopWord.isStopWord(currWord)) {
      acc[currWord] = acc[currWord] + 1 || 1
    }
    return acc
  }, {})

  let result: string[] = []
  for (let [key, val] of Object.entries(wordMap)) {
    if (val === 1) result.push(key)
  }
  return result
}
