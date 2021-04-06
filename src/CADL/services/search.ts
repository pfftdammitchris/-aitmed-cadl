import { Client } from 'elasticsearch'
import { get } from 'https'
import _, { isArray } from 'lodash'
// const node = 'http://44.192.21.229:9200'
let client = new Client({ host: 'http://44.192.21.229:9200' })
// let DEFAULT_ADDRESS = "92805"
let SIZE = 100
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
  async query({ cond = null, distance = 10000, carrier = null, pos = 92508 }) {
    console.log('test query', {
      cond: cond,
      distance: distance,
      carrier: carrier,
      pos: pos,
    })
    let type = 'either',
      size = SIZE
    let INDEX = 'doctors'
    let office = true
    let video = true
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
    if (type === 'office') {
      video = false
    } else if (type === 'video') {
      office = false
    } else if (type === 'either' || type === 'both') {
    } else {
      throw new Error('argument error')
    }
    console.log('query zip code2', arr)

    let template = {
      query: {
        bool: {
          must: [
            {
              geo_distance: {
                distance: distance,
                unit: 'mi',
                location: arr,
              },
            },
            {
              match_phrase: {
                carriers: carrier,
              },
            },

            {
              match: {
                conditions: {
                  query: cond,
                },
              },
            },
          ],
          filter: [
            {
              term: {
                office: office,
              },
            },
            {
              term: {
                video: video,
              },
            },
          ],
        },
      },
      sort: [
        {
          _geo_distance: {
            location: arr,
            order: 'asc',
            unit: 'mi',
            distance_type: 'arc',
          },
        },
      ],
      from: 0,
      size: size,
    }
    if (!cond) {
      template['query']['bool']['must'].splice(2, 1)
    }

    if (!carrier) {
      template['query']['bool']['must'].splice(1, 1)
    }
    if (type === 'either') {
      delete template.query.bool.filter
    }
    let body = await client.search({
      index: INDEX,
      body: template,
    })
    // console.log(carrier)
    // console.log(template.query.bool.must)
    console.log(body.hits.hits)
    return body.hits.hits
  },

  GetAllLonAndLat({ object }) {
    if (isArray(object)) {
      let re: Record<string, any> = []
      object.forEach((obj) => {
        let st = obj['_source']['location'].split(' ')
        let address =
          obj['_source']['address_street'] +
          ' ' +
          obj['_source']['address_city'] +
          ' ' +
          obj['_source']['address_state'] +
          ' ' +
          obj['_source']['address_zipCode']
        let Lon = parseFloat(st[1].replace('(', ''))
        let Lat = parseFloat(st[2].replace(')', ''))
        re.push({
          data: [Lon, Lat],
          information: {
            address: address,
            Name: obj['_source']['Name'],
            Speciality: obj['_source']['Speciality'],
            Title: obj['_source']['Title'],
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
          if (obj['_source']['Speciality'] == re[i]['Speciality']) {
            re[i]['num'] = re[i]['num'] + 1
            re[i]['data'].push(obj)
            break
          }
        }
        if (i == re.length) {
          let item = {
            Speciality: obj['_source']['Speciality'],
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
}
