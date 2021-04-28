import sha256 from 'crypto-js/sha256'

class ObjectCacheCtr {
  public retrieveDocFromCache(indexRepository, dataInStr: string) {
    let retrieveResult = []

    let api_input_sha = sha256(dataInStr)
    let api_Result = indexRepository.getApiResult(api_input_sha)

    for (let docId of api_Result) {
      let cachedDoc = indexRepository.docTableDao.getDocById(docId)
      if (cachedDoc !== null) {
        retrieveResult.push(cachedDoc)
      }
    }
    return retrieveResult
  }
}
