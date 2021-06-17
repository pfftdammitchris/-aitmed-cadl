import sha256 from 'crypto-js/sha256'

export default class ObjectCacheCtr {
  public retrieveDocFromCache(indexRepository, dataInStr: string) {
    let retrieveResult = []

    let api_input_sha = sha256(dataInStr).toString()
    let api_Result = indexRepository.ApiHashTableDao.getApiResult(api_input_sha)
    console.log('this is apiresult', api_Result)

    for (let docId of api_Result) {
      let cachedDoc = indexRepository.DocTableDao.getDocById(docId)
      console.log('this is cached doc', cachedDoc)
      if (cachedDoc !== null) {
        retrieveResult.push(cachedDoc)
      }
    }
    return retrieveResult
  }
}
