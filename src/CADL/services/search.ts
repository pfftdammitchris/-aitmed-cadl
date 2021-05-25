import { Client } from 'elasticsearch'
import { get } from 'https'
import _, { isArray } from 'lodash'
// const node = 'http://44.192.21.229:9200'
let client = new Client({ hosts: 'https://searchapi.aitmed.io' })
// let client = new Client({ host: 'https://searchapi.aitmed.io' })
// let DEFAULT_ADDRESS = "92805"
// let SIZE = 100
interface LatResponse {
  center: any[]
}

let GetlatAndlon = (query) => {
  let promise = new Promise((res, rej) => {
    let path =
      '/geocoding/v5/mapbox.places/' +
      query +
      '.json?access_token=pk.eyJ1IjoiamllamlleXV5IiwiYSI6ImNrbTFtem43NzF4amQyd3A4dmMyZHJhZzQifQ.qUDDq-asx1Q70aq90VDOJA'
    var options = {
      // host: 'api.81p.net/api?p=json&t=jisupk10&token=15414985AABD5796&limit=1'
      host: 'api.mapbox.com',
      path: path,
    }
    get(options, function (http_res) {
      // initialize the container for our data
      let data = ''
      http_res.on('data', function (chunk) {
        data += chunk
      })
      // console.log(http_res.statusCode)
      http_res.on('end', function () {
        let JsonData: any = JSON.parse(data)
        let response = JsonData.features[0].center
        res({
          center: response,
        })
      })
    }).on('error', function (e) {
      rej(e)
    })
  })
  return promise
}
export default {
  /**
   * 以prefix为前缀查询搜索建议，返回doctor_suggestion: []，speciality_suggestion 分别是推荐的医生姓名和科室名
   * 数据无重复，最大10条
   * @param prefix
   * @returns {Promise<{doctor_suggestion: [], speciality_suggestion: []}>}
   */
  async suggest({ prefix }) {
    console.log('test suggest', prefix)
    let INDEX = 'doctors'
    const doc_sug: any[] = []
    const spe_sug: any[] = []
    const body = await client.search({
      index: INDEX,
      body: {
        suggest: {
          speciality_suggestion: {
            prefix: prefix,
            completion: {
              field: 'Speciality',
              skip_duplicates: true,
              size: 10,
            },
          },
          doctor_suggestion: {
            prefix: prefix,
            completion: {
              field: 'Name',
              skip_duplicates: true,
              size: 10,
            },
          },
        },
      },
    })
    console.log('test suggest', body)
    for (const s of body.suggest.doctor_suggestion[0].options) {
      doc_sug.push(s.text)
    }
    for (const s of body.suggest.speciality_suggestion[0].options) {
      spe_sug.push(s.text)
    }
    console.log('test suggest', {
      doctor_suggestion: doc_sug,
      speciality_suggestion: spe_sug,
    })
    return { doctor_suggestion: doc_sug, speciality_suggestion: spe_sug }
  },
  async query({ cond = null, distance = 30, carrier = null, pos = 92508 }) {
    console.log('test query', {
      cond: cond,
      distance: distance,
      carrier: carrier,
      pos: pos,
    })
    let INDEX = 'doctors'
    let arr: any[] = []
    if (pos) {
      // let address
      await GetlatAndlon(pos).then(
        (data: LatResponse) => {
          arr[0] = data.center[0]
          arr[1] = data.center[1]
          console.log('query zip code1', data)
        },
        (err) => {
          console.log('query error', err)
        }
      )
      // arr = address
    }
    console.log('query zip code2', arr)

    let template = {
      "query": {
        "bool": {
          "must": {
            "function_score": {
              "query": {
                "multi_match": {
                  "query": cond,
                  "type": "best_fields",
                  "fields": [
                    "specialty^3",
                    "name^2",
                    "symptom^1"
                  ],
                  "fuzziness": "AUTO",
                  "prefix_length": 2
                }
              }
            }
          },
          "filter": {
            "geo_distance": {
              "distance": distance + "mi",
              "location": arr[1] + " , " + arr[0]
            }
          }
        }
      }
    }

    let body = await client.search({
      index: INDEX,
      body: template,
    })
    // console.log(carrier)
    // console.log(template.query.bool.must)
    console.log("test query", body.hits.hits)
    return body.hits.hits
  },
  async queryByDate({ cond = null, distance = 30, carrier = null, pos = 92508, stime, etime }) {
    console.log('test query', {
      cond: cond,
      distance: distance,
      carrier: carrier,
      pos: pos,
      stime: stime,
      etime: etime
    })
    let INDEX = 'doctors'
    let arr: any[] = []
    if (pos) {
      // let address
      await GetlatAndlon(pos).then(
        (data: LatResponse) => {
          arr[0] = data.center[0]
          arr[1] = data.center[1]
          console.log('query zip code1', data)
        },
        (err) => {
          console.log('query error', err)
        }
      )
      // arr = address
    }
    if (typeof stime == 'string' || typeof etime == 'string') {
      let d = new Date()
      let dateObject = new Date()
      dateObject.setMonth(d.getMonth() + 1)
      dateObject.setDate(d.getDate())
      dateObject.setFullYear(d.getFullYear())
      dateObject.setHours(0)
      dateObject.setMinutes(0)
      dateObject.setSeconds(0)
      stime = Date.parse(dateObject.toString()) / 1000
      etime = stime + 86400
    }


    console.log('query zip code2', { arr: arr, stime: stime, etime: etime })
    let template =
    {
      "query": {
        "bool": {
          "must": {
            "function_score": {
              "query": {
                "multi_match": {
                  "query": cond,
                  "type": "best_fields",
                  "fields": [
                    "specialty^3",
                    "name^2",
                    "symptom^1"
                  ],
                  "fuzziness": "AUTO",
                  "prefix_length": 2
                }
              }
            }
          },
          "filter": [
            {
              "range": {
                "avail": {
                  "gte": stime,
                  "lt": etime,
                  "relation": "intersects"
                }
              }
            },
            {
              "geo_distance": {
                "distance": distance + "mi",
                "location": arr[1] + " , " + arr[0]
              }
            }
          ]
        }
      }
    }
    let template2 = {
      "query": {
        "bool": {
          "must": {
            "function_score": {
              "query": {
                "multi_match": {
                  "query": cond,
                  "type": "best_fields",
                  "fields": [
                    "specialty^3",
                    "name^2",
                    "symptom^1"
                  ],
                  "fuzziness": "AUTO",
                  "prefix_length": 2
                }
              }
            }
          },
          "filter": {
            "geo_distance": {
              "distance": distance + "mi",
              "location": arr[1] + " , " + arr[0]
            }
          }
        }
      }
    }

    let body = await client.search({
      index: INDEX,
      body: template,
    })
    // console.log(carrier)
    // console.log(template.query.bool.must)
    console.log("test query", body.hits.hits)
    return body.hits.hits
  },

  GetAllLonAndLat({ object }) {
    if (isArray(object)) {
      let re: Record<string, any> = []
      object.forEach((obj) => {
        let st = obj['_source']['location'].split(',')
        let address =
          obj['_source']['address_street'] +
          ' ' +
          obj['_source']['address_city'] +
          ' ' +
          obj['_source']['address_state'] +
          ' ' +
          obj['_source']['address_zipcode']
        let Lon = parseFloat(st[1])
        let Lat = parseFloat(st[0])
        re.push({
          data: [Lon, Lat],
          information: {
            address: address,
            name: obj['_source']['name'] + " " + obj['_source']['title'],
            phoneNumber: obj['_source']['phone_number'],
            speciality: obj['_source']['specialty'],
            title: obj['_source']['title'],
          },
        })
      })
      console.log('test transform', re)
      return re
    }
    return
  },

  SortBySpeciality({ object }) {
    if (isArray(object)) {
      console.log('test SortBySpeciality', object)
      let re: Record<string, any> = []
      object.forEach((obj) => {
        let i = 0
        for (; i < re.length; i++) {
          if (obj['_source']['specialty'] == re[i]['Speciality']) {
            re[i]['num'] = re[i]['num'] + 1
            re[i]['data'].push(obj)
            break
          }
        }
        if (i == re.length) {
          let item = {
            Speciality: obj['_source']['specialty'],
            num: 1,
            data: [obj],
          }
          // item.data.push(obj)
          re.push(item)
        }
      })

      for (let j = 0; j < re.length; j++) {
        if (re[j]['Speciality'] == null) {
          re[j]['Speciality'] = 'unknown'
        }
      }
      return re
    }
    return
  },

  processingSearchData({ object }) {
    let path = ["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png"]
    if (isArray(object)) {
      object.forEach(obj => {
        let randomNumber = Math.ceil(Math.random() * 10)
        if (randomNumber >= 0 && randomNumber < 2.5) {
          randomNumber = 0
        } else if (randomNumber < 5 && randomNumber >= 2.5) {
          randomNumber = 1
        } else if (randomNumber >= 5 && randomNumber < 7.5) {
          randomNumber = 2
        } else {
          randomNumber = 3
        }
        obj['path'] = path[randomNumber]
        obj['address'] = obj['_source']['address_street'] + " " + obj['_source']['address_city'] + " " + obj['_source']['address_state']
        if (obj['_source']['Speciality'] == null) {
          obj['_source']['Speciality'] = "unknown"
        }
      })
    }
    return
  }
}
