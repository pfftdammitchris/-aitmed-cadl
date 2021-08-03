import { Client } from 'elasticsearch'
import { get } from 'https'
import axios from 'axios'
import _, { isArray, map } from 'lodash'
import * as ob from "lodash";
import store from '../../common/store'
//set elasticsearch host client
let client = new Client({ hosts: 'https://elastic.aitmed.io' })
//query index
const INDEX = "doctors_v0.3"
// const mapboxHost = 'api.mapbox.com'
const mapboxToken = 'pk.eyJ1IjoiamllamlleXV5IiwiYSI6ImNrbTFtem43NzF4amQyd3A4dmMyZHJhZzQifQ.qUDDq-asx1Q70aq90VDOJA'
const mapboxHost = 'https://api.mapbox.com/'
const esSyncHost = 'https://sync.aitmed.io:443/'
interface LatResponse {
  center: any[]
}
/**
 * 
 * @param id  user id
 * @param type the type of document/edge want to sync
 * @returns sync result
 */
const updateEs = (id, type) => {
  // convert document type to url 
  let urlConvert = new Map([['40000', '/avail/'], ['35841', '/docProfile/'], ['79360', '/rsnForVst/']])
  let url = urlConvert.get(type)
  // let url = '/avail/'
  // if (type == 'profile') {
  //   url = '/docProfile/'
  // } else if (type == 'reasonForVisit') {
  //   url = '/rsnForVst/'
  // }
  return new Promise((res, rej) => {
    axios({
      url: url,
      baseURL: esSyncHost,
      method: 'put',
      data: {
        vid: id
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(
      data => {
        if (store.env === 'test') {
          console.log(
            '%cGet mapbox address response',
            'background: purple; color: white; display: block;',
            { data }
          )
        }
        if (data.status == 200) {
          res(data)
        }
      }
    ).catch(
      error => {
        rej(error)
      }
    )
  })
}


/**
 * Load similar addresses based on input text
 * Help function for suggestaddress
 * @param query 
 * @returns 
 */
const GetQuery = (query) => {
  const url = '/geocoding/v5/mapbox.places/' + query + '.json'
  return new Promise((res, rej) => {
    axios({
      url: url,
      baseURL: mapboxHost,
      method: 'get',
      params: {
        'country': 'US',
        'limit': 10,
        'access_token': mapboxToken
      }
    }).then(
      data => {
        if (store.env === 'test') {
          console.log(
            '%cGet mapbox address response',
            'background: purple; color: white; display: block;',
            { data }
          )
        }
        if (data.status == 200) {
          res(data)
        }
      }
    ).catch(error => {
      rej(error)
    })

  })
}


let Description = (query) => {
  let promise = new Promise((res, rej) => {
    let path =
      '/api/icd10cm/v3/search?sf=code,name&df=code,name&maxList=20&terms=' +
      query
    let options = {
      host: 'clinicaltables.nlm.nih.gov',
      path: path,
    }
    get(options, function (http_res) {
      let data = ''
      http_res.on('data', function (chunk) {
        data += chunk
      })
      http_res.on('end', function () {
        let JsonData: any = JSON.parse(data)
        // let response = JsonData.features[0].center
        res({
          center: JsonData,
        })
      })
    }).on('error', function (e) {
      rej(e)
    })
  })
  return promise
}




export default {
  async updateEsData({ id, type }: {
    id: string,
    type: string
  }) {
    let response: any
    if (id) {
      await updateEs(id, type).then(
        (data: any) => {
          response = data['data']
        },
        (err) => {
          console.log(err)
        }
      )
      return response

    }
    return
  },
  /**
   * Get the latitude and longitude of the most similar address based on the address input
   * @param query
   * @returns 
   */
  async transformGeo({ query }) {
    let arr: any[] = []
    query = query.replace("#", "")
    if (query) {
      // let address
      await GetQuery(query).then(
        (data: LatResponse) => {
          data = data['data']['features'][0]
          arr = data.center
          if (store.env === 'test') {
            console.log(data)
          }
        },
        (err) => {
          if (store.env === 'test') {
            console.log(err)
          }
        }
      )
      // arr = address
      return arr
    }
    return
  },
  async queryCode({ query }) {
    let arr: any[] = []
    let arrNew: any[][] = [];
    if (query) {
      await Description(query).then(
        (data: LatResponse) => {
          console.error(data.center[3])
          arr[0] = data.center[3]
          for (let j = 0; j < arr[0].length; j++) {
            arrNew.push([]);
          }
          for (let i = 0; i < arr[0].length; i++) {
            let arrStr: string = arr[0][i][0] + arr[0][i][1]
            let a: (string | number)[] = _.concat(arr[0][i], arrStr);
            console.error(a);
            arrNew[i].push(a);
          }
        },
        (err) => {
          console.log('query error', err)
        }
      )
      return arrNew
    }
    return []
  },
  async queryInsurance({ id }) {
    let template: any = {
      "query": {
        "match": {
          "_id": id
        }
      }
    }
    const body = await client.search({
      index: "test_doctors",
      body: template,
    })
    return body.hits.hits
  },
  /**
   * Get all related addresses of query
   * @param query 
   * @returns 
   */
  async suggestAddress({ query }) {
    // let arr: any[] = []
    query = query.replace("#", "")
    let response: any = []
    if (query) {
      // let address
      await GetQuery(query).then(
        (data: any) => {
          response = data['data']['features']
        },
        (err) => {
          console.log('query error', err)
        }
      )
      // arr = address
      if (response == null || typeof response == undefined) { return [] }
      return response
    }
    return []
  },
  /**
   * 以prefix为前缀查询搜索建议，返回doctor_suggestion: []，speciality_suggestion 分别是推荐的医生姓名和科室名
   * 数据无重复，最大10条
   * @param prefix
   * @returns {Promise<{doctor_suggestion: [], speciality_suggestion: []}>}
   */
  async suggest({ prefix }) {
    console.log('test suggest', prefix)
    let INDEX = 'doctors_v0.4'
    let TEXT_INDEX = "test_doctors"
    let doc_sug: any[] = []
    let spe_sug: any[] = []
    let sym_sug: any[] = []
    let len = prefix.length
    let color = ""
    let body = await client.search({
      index: INDEX,
      body: {
        "suggest": {
          "doctor_suggestion": {
            "text": prefix,
            "completion": {
              "field": "suggest",
              "skip_duplicates": true,
              "size": 10
            }
          }
        }
      }
    })
    let body_1 = await client.search({
      index: TEXT_INDEX,
      body: {
        "suggest": {
          "speciality_suggestion": {
            "text": prefix,
            "completion": {
              "field": "specialty",
              "skip_duplicates": true,
              "size": 5
            }
          },
          "symptom_suggestion": {
            "text": prefix,
            "completion": {
              "field": "symptom",
              "skip_duplicates": true,
              "size": 8
            }
          }
        }
      }
    })
    for (let s of body.suggest.doctor_suggestion[0].options) {
      let strLen = (s.text).indexOf(prefix) + 1
      let sum = strLen + len
      let str = (s.text).substring(strLen, sum)
      let otherStr = (s.text).substring(sum, s.length)
      if (((s.text).toLowerCase()).indexOf(prefix.toLowerCase()) != -1) {
        color = "0xca1e36"
        s["color"] = color
        s["id"] = s._id
        s["hightStr"] = str
        s["otherStr"] = otherStr
      } else {
        color = "0x143459"
        s["color"] = color
      }
      doc_sug.push(s)
    }
    for (let s of body_1.suggest.speciality_suggestion[0].options) {
      let strLen = (s.text).indexOf(prefix) + 1
      let sum = strLen + len
      let str = (s.text).substring(strLen, sum)
      let otherStr = (s.text).substring(sum, s.length)
      if (((s.text).toLowerCase()).indexOf(prefix.toLowerCase()) != -1) {
        color = "0xca1e36"
        s["color"] = color
        s["id"] = s._id
        s["hightStr"] = str
        s["otherStr"] = otherStr
      } else {
        color = "0x143459"
        s["color"] = color
      }
      spe_sug.push(s)
    }
    for (let s of body_1.suggest.symptom_suggestion[0].options) {
      let strLen = (s.text).indexOf(prefix)
      let sum = strLen + len
      let str = (s.text).substring(strLen, sum)
      s["text"] = (s.text).replace(/^\s+|\s+$/g, '')
      let otherStr = (s.text).substring(sum - 1, s.length)
      if (((s.text).toLowerCase()).indexOf(prefix.toLowerCase()) != -1) {
        color = "0xca1e36"
        s["color"] = color
        s["id"] = s._id
        s["hightStr"] = str
        s["otherStr"] = otherStr
      } else {
        color = "0x143459"
        s["color"] = color
      }
      sym_sug.push(s)
    }
    console.log('test suggest', {
      doctor_suggestion: doc_sug,
      speciality_suggestion: spe_sug,
      symptom_suggestion: Array.from(new Set(sym_sug)),
    })
    return { doctor_suggestion: doc_sug, speciality_suggestion: spe_sug, symptom_suggestion: Array.from(new Set(sym_sug)) }
  },

  /**
   * 
   * @param cond   => Search term
   * @param distance =>  Query range
   * @param carrier => Insurance
   * @param pos => address
   * @param stime => start time
   * @param etime  => end stime
   * @param type => 1: office and telemedicine  2:office, 3: telemedicine
   * @returns 
   */
  async queryByDate({
    cond = null,
    distance = 30,
    carrier = null,
    pos = 92805,
    stime,
    etime,
    type = 1
  }) {

    let arr: any[] = []
    if (pos) {
      // let address
      await GetQuery(pos).then(
        (data: LatResponse) => {
          data = data['data']['features'][0]
          arr[0] = data.center[0]
          arr[1] = data.center[1]
        },
        (err) => {
          if (store.env === 'test') {
            console.log(
              '%cError',
              'background: purple; color: white; display: block;',
              err
            )
          }
        }
      )
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
    if (store.env === 'test') {
      console.log(
        '%cGet Search request',
        'background: purple; color: white; display: block;',
        {
          cond: cond,
          distance: distance,
          carrier: carrier,
          pos: arr,
          stime: stime,
          etime: etime,
        }
      )
    }
    let template: any = {
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
                    "fullName^2",
                    "symptom^1"
                  ],
                  "fuzziness": "AUTO",
                  "prefix_length": 2
                }
              }
            }
          },
          "filter": {
            "nested": {
              "path": "availByLocation",
              "query": {
                "bool": {
                  "filter": [
                    {
                      "terms": {
                        "availByLocation.visitType": ["Office", "Telemedicine"]
                      }
                    },
                    {
                      "range": {
                        "availByLocation.avail": {
                          "gte": stime,
                          "lt": etime,
                          "relation": "intersects"
                        }
                      }
                    },
                    {
                      "geo_distance": {
                        "distance": distance + "mi",
                        "availByLocation.location.geoCode": arr[1] + ' , ' + arr[0]
                      }
                    }
                  ]
                }
              }
            }
          },
          "should": {
            "term": {
              "insurance.plan": carrier
            }
          }
        }
      }
    }

    if (type == 2) {
      template['query']['bool']['filter']['nested']['query']['bool']['filter'][0]['terms']["availByLocation.visitType"] = ['Office']
    } else if (type == 3) {
      template['query']['bool']['filter']['nested']['query']['bool']['filter'][0]['terms']["availByLocation.visitType"] = ['Telemedicine']
    }

    const body = await client.search({
      index: INDEX,
      body: template,
    })
    // console.log(carrier)
    // console.log(template.query.bool.must)
    if (store.env === 'test') {
      console.log(
        '%cGet Search response',
        'background: purple; color: white; display: block;',
        { index: INDEX, response: body.hits.hits }
      )
    }
    return body.hits.hits
  },

  /**
   * Process the data into the data type used by the map
   * @param object
   * @returns 
   */
  GetAllLonAndLat({ object }) {
    if (isArray(object)) {
      let re: Record<string, any> = []
      object.forEach((obj) => {
        console.error(obj)
        let st = obj['_source']['availByLocation'][0]['location']['geoCode'].split(',')
        let address =
          obj['_source']['availByLocation'][0]['location']['address']['street'] +
          ' ' +
          obj['_source']['availByLocation'][0]['location']['address']['city'] +
          ' ' +
          obj['_source']['availByLocation'][0]['location']['address']['state'] +
          ' ' +
          obj['_source']['availByLocation'][0]['location']['address']['zipCode']
        let Lon = parseFloat(st[1])
        let Lat = parseFloat(st[0])
        re.push({
          data: [Lon, Lat],
          information: {
            address: address,
            name: obj['_source']['fullName'] + ' ' + obj['_source']['title'],
            phoneNumber: obj['_source']['phone'],
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

  /**
   * Process the Speciality in the data
   * @param object 
   * @returns 
   */
  SortBySpeciality({ object }) {
    if (isArray(object)) {
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

  /**
   * Process data to facilitate the use of page UI
   * @param object
   * @returns 
   */
  processingSearchData({ object }) {
    let path = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png']
    let re: Record<string, any> = []
    if (isArray(object)) {
      object.forEach((obj) => {
        let map = new Map()
        for (let i = 0; i < obj['_source']['availByLocation'].length; i++) {
          let location = obj['_source']['availByLocation'][i]['location']
          let key = obj['_source']['availByLocation'][i]['location']['geoCode']
          if (map.has(key)) {
            map.set(key, map.get(key))
          } else {
            map.set(key, 1)
            let item = obj
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
            item['path'] = path[randomNumber]
            item['fullName'] =
              item['_source']['fullName'] +
              ', ' +
              item['_source']['title']
            item['address'] =
              location['address']['city'] +
              ', ' +
              location['address']['state'] +
              ' ' +
              location['address']['zipCode']
            item['street'] = location['address']['street']
            if (obj['_source']['specialty'] == null) {
              obj['_source']['specialty'] = 'unknown'
            }
            re.push(item)
          }
        }
      })
      let obj = {}
      re = re.reduce((item, next) => {
        if (!obj[next._id]) {
          item.push(next)
          obj[next._id] = true
        }
        return item
      }, []);
      // console.log("cmq---------------------", re, typeof (re))
      // console.log("cmq---------------------", re, typeof (obj))
      return re
    }
    return
  },
  ComputeObjectFieldCount({ objArr, strOne, strTwo }) {
    let subTpOne: number = 0;
    let subTpTwo: number = 0;
    let arr: number[] = []
    objArr.map((obj) => {
      if (obj['subtype'] === strOne) {
        subTpOne++;
      }
      else if (obj['subtype'] === strTwo)
        subTpTwo++;
    })
    arr.push(subTpOne);
    arr.push(subTpTwo);
    return arr;
  },
  ModifyObjectField({ objArr, str }) {
    return objArr.map((values) => ob.set(values, 'place_name', ob.trimEnd(values['place_name'], str)));

  },
  CountObj({ objArr }) {
    let newArr: {}[] = [];
    let newArrObj: { [key: string]: any }[] = []
    objArr.forEach((valuesObj) => {
      if ((valuesObj["_source"]["availByLocation"] as [])?.length >= 2) {
        let len: number = (valuesObj["_source"]["availByLocation"])?.length;
        newArr = valuesObj["_source"]["availByLocation"];
        _.unset(objArr, valuesObj["_source"]["availByLocation"]);
        for (let i = 0; i < len; i++) {
          // console.log(newArr[i])
          let obj = _.cloneDeep(valuesObj);
          obj["_source"]["availByLocation"] = new Array(newArr[i]);
          // console.error(obj)
          newArrObj.push(obj);
        }
      }
    })
    return newArrObj;
  }
}
