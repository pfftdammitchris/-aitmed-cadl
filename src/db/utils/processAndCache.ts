import IndexRepository from '../IndexRepository'

import basicExtraction from './KeyExtraction/BasicAlgorithm'

export default function processAndCache(doc){
    let content = doc.name.data
    const contentAfterExtraction = basicExtraction(content)

    for()
}