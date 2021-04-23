export default class FuzzyIndexCreator {
  initialMapping(indexStr: string) {
    debugger
    console.log(indexStr)
    indexStr = indexStr.toLowerCase()
    console.log(typeof indexStr)
    //replace the double char first

    indexStr = indexStr.replace(/[aeiouy]+/g, 'a')
    indexStr = indexStr.replace('^gh', 'g')
    //todo: need to talk with Austin about ga, ge for J and ga
    indexStr = indexStr.replace('^g[eiy]', 'j')
    indexStr = indexStr.replace('^geo', 'jo')
    indexStr = indexStr.replace('^gen', 'jn')
    // Chris -> kris, Christina -> kristina
    indexStr = indexStr.replace(/chr/g, 'kr')
    indexStr = indexStr.replace(/[aeiou]r/g, 'a')
    indexStr = indexStr.replace(/c[ei]/g, 'sa')
    indexStr = indexStr.replace(/cc/g, 'c')
    indexStr = indexStr.replace(/dd/g, 'd')
    indexStr = indexStr.replace(/gg/g, 'g')
    indexStr = indexStr.replace(/ll/g, 'l')
    indexStr = indexStr.replace(/mm/g, 'm')
    indexStr = indexStr.replace(/nn/g, 'n')
    indexStr = indexStr.replace(/pp/g, 'p')
    indexStr = indexStr.replace(/rr/g, 'r')
    indexStr = indexStr.replace(/ss/g, 's')
    indexStr = indexStr.replace(/tt/g, 't')
    indexStr = indexStr.replace(/zz/g, 'z')
    indexStr = indexStr.replace(/gh/g, '')
    indexStr = indexStr.replace(/ph/g, 'f')
    indexStr = indexStr.replace(/pt/g, 'd')
    indexStr = indexStr.replace(/ti/g, 's')
    indexStr = indexStr.replace(/ci/g, 's')
    indexStr = indexStr.replace(/cl/g, 'k')
    indexStr = indexStr.replace(/ng/g, 'n')
    indexStr = indexStr.replace(/gn/g, 'n')

    indexStr = indexStr.replace(/h/g, '')
    indexStr = indexStr.replace('^i', 'j')
    indexStr = indexStr.replace('^u', 'j')
    indexStr = indexStr.replace(/[+]/g, '')
    indexStr = indexStr.replace(/\\W/g, '`')
    indexStr = indexStr.replace(/0/g, '`')
    indexStr = indexStr.replace(/[123]+/g, '{')
    indexStr = indexStr.replace(/[456]+/g, '|')
    indexStr = indexStr.replace(/[789]+/g, '}')
    indexStr = indexStr.replace('^y', 'a')
    return indexStr
  }

  toFuzzyInt64(initMapping: string) {
    let arr: string[] = []
    for (let n = 0, l = initMapping.length; n < l; n++) {
      let hex = Number(initMapping.charCodeAt(n)).toString(16)
      arr.push(hex)
    }
    return arr.join('')
  }

  toFuzzyHex(initMapping: string) {
    let arr: string[] = []
    for (let n = 0, l = initMapping.length; n < l; n++) {
      let hex = Number(initMapping.charCodeAt(n)).toString(16)
      arr.push(hex)
    }
    return arr.join('')
  }
}
