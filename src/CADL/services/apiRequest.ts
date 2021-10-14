import axios from 'axios'
import _ from 'lodash'
import store from '../../common/store'


const aitmedApiHost = 'https://api.aitmed.io/'
const drugBankHost = 'https://api-js.drugbank.com/v1/us'
/**
 * generate drugbank api token with a maximum of 2 hours
 */
function generateDrugBankToken() {
    const url = '/drugbank-token/'
    let date = new Date()
    axios({
        url: url,
        baseURL: aitmedApiHost,
        method: "get",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response['status'] == 200) {
            store.drugbankToken = response['data']['token']
            localStorage.setItem('expiredTime', (date.getTime() + 2 * 60 * 60 * 1000).toString())
            localStorage.setItem('drugbankToken', response['data']['token'])
            console.log('test', response['data'])
        }
    }).catch(error => {
        if (store.env === 'test') {
            console.log(
                console.log(error)
            )
        }
    })
}


/**
 * get data according to drugbank api
 * help function for drugbank
 * @param query 
 * @param drugbank_pcid 
 * @param type => Drug | Route | Strength
 * @returns 
 */
async function getDrugs(query, drugbank_pcid, type) {
    let currentDateTime = new Date().getTime()
    let expired = localStorage.getItem('expiredTime')
    let expiredTime = typeof expired == 'string' ? parseInt(expired) : 0
    if (currentDateTime >= expiredTime) {//maxium hours=2h，reget token after it expired
        await generateDrugBankToken()
    }
    const drugbankToken = localStorage.getItem('drugbankToken')
    console.log(drugbankToken)
    let url = '/product_concepts'
    if (type == 'Route') {
        url = '/product_concepts/' + drugbank_pcid + '/routes'
    } else if (type == 'Strength') {
        url = '/product_concepts/' + drugbank_pcid + '/strengths'
    }
    let params = {}
    if (query) {
        params = {
            // region: 'us,ca',
            q: query,
        }
    }
    return new Promise((res, rej) => {
        axios({
            url: url,
            baseURL: drugBankHost,
            method: "get",
            params: params,
            headers: {
                'Authorization': 'Bearer ' + drugbankToken,
            },

        }).then(response => {
            if (response['status'] == 200) {
                res(response['data'])
            }
        }).catch(error => {
            rej(error)
        })
    })
}

async function getCPT(query) {

    const CPTUrl = "https://clinicaltables.nlm.nih.gov/api/hcpcs/v3/search"

    return new Promise((res, rej) => {
        axios({
            url: CPTUrl,
            method: "get",
            params: {
                authenticity_token: "",
                terms: query
            },

        }).then((response) => {
            if (store.env === 'test') {
                console.log(
                    '%cGet CPT response',
                    'background: purple; color: white; display: block;',
                    response['data']
                )
            }
            res(response['data'])
        }).catch(error => {
            rej(error)
        })
    })
}


export default {
    async drugBank(
        {
            query,
            id,
            type
        }:
            {
                query: string | null,
                id: string | null,
                type: 'Drug' | 'Route' | 'Strength'
            }) {
        let response: any = []
        await getDrugs(query, id, type).then(
            (data) => {
                if (store.env === 'test') {
                    console.log(
                        '%cGet Drug response',
                        'background: purple; color: white; display: block;',
                        { data }
                    )
                }
                response = data
            },
            (err) => {
                console.log(err)
            }
        )
        return response
    },

    async queryCPT({query}) {
        let response: any = []
        await getCPT(query).then(
            (data: Array<string>) => {
                if (store.env === 'test') {
                    console.log(
                        '%cGet Drug response',
                        'background: purple; color: white; display: block;',
                        { data }
                    )
                }
                response = data[3]
            },
            (err) => {
                console.log(err)
            }
        )
        return response
    }


}