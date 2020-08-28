import * as edgeServices from '../services/edges'
import * as vertexServices from '../services/vertexes'
import * as documentServices from '../services/documents'
import * as builtInServices from '../services/builtIn'
import * as utils from '../services/utils'

export default function (key) {
  const fns = {
    ce: edgeServices.create,
    re: edgeServices.get,
    cv: vertexServices.create,
    rv: vertexServices.get,
    cd: documentServices.create,
    rd: documentServices.get,
    builtIn: builtInServices.builtIn,
    localSearch: utils.localSearch,
  }
  return fns[key]
}
