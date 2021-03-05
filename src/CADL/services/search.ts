import { Client } from 'elasticsearch'

// const node = 'http://44.192.21.229:9200'
let client = new Client({ host: 'http://44.192.21.229:9200' })
// let DEFAULT_ADDRESS = "92805"
let SIZE = 20

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
  async query({ cond = null, distance = 10000, carrier = null }) {
    let type = 'either',
      //   start = 0,
      size = SIZE,
      pos = [-117.9086, 33.8359]
    let INDEX = 'doctors'
    let office = true
    let video = true
    if (type === 'office') {
      video = false
    } else if (type === 'video') {
      office = false
    } else if (type === 'either' || type === 'both') {
    } else {
      throw new Error('argument error')
    }

    let template = {
      query: {
        bool: {
          must: [
            {
              geo_distance: {
                distance: distance,
                unit: 'mi',
                location: pos,
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
            location: pos,
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
}
