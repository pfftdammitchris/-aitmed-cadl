import axios from 'axios'
import _, { isArray } from 'lodash'
import store from '../../common/store'


const aitmedApiHost = 'https://api.aitmed.io/'
const drugBankHost = 'https://api-js.drugbank.com/v1/us/'
/**
 * generate drugbank api token with a maximum of 2 hours
 */
function generateDrugBankToken() {
    const url = '/drugbank-token'
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
    if (!store.drugbankToken) {
        await generateDrugBankToken()
    }
    const drugbankToken = store.drugbankToken
    let url = '/product_concepts'
    if (type == 'Route') {
        url = '/product_concepts/' + drugbank_pcid + '/routes'
    } else if (type == 'Strength') {
        url = '/product_concepts/' + drugbank_pcid + '/strengths'
    }
    let params = {}
    if (query) {
        params = {
            q: query
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



}