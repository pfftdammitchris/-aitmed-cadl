import _ from 'lodash'
import moment from 'moment'
import humanizeDuration from 'humanize-duration'
import { Account } from '../../services'
import { isObject } from '../../utils'
import store from '../../common/store'


export {
    builtIn
}

function builtIn({ pageName, apiObject, dispatch }) {
    //TODO: replace when builtInFns allows an argument for fn name
    const pathArr = apiObject.api.split('.').slice(1)
    const builtInFnsObj = builtInFns()
    const builtInFn = _.get(builtInFnsObj, pathArr)
    return async (input?: any) => {
        //@ts-ignore
        const {
            dataKey,
            dataIn,
            dataOut
        } = _.cloneDeep(apiObject || {})
        const currentVal = dispatch({
            type: 'get-data',
            payload: {
                dataKey: dataIn ? dataIn : dataKey,
                pageName
            }
        })
        let res: any
        try {
            if (store.env === 'test') {
                console.log(`%cBuiltIn Fn:${pathArr} Request ', 'background: purple; color: white; display: block;`,
                    res
                );
            }
            //TODO: make signature more generic
            const data = await builtInFn({
                ...input,
                name: { ...currentVal.name, ...input }
            })
            res = data
            if (store.env === 'test') {
                console.log(`%cBuiltIn Fn:${pathArr} Response ', 'background: purple; color: white; display: block;`,
                    res
                );
            }
        } catch (error) {
            throw error
        }
        if (Array.isArray(res) && res.length > 0 || isObject(res)) {
            dispatch({
                type: 'update-data',
                //TODO: handle case for data is an array or an object
                payload: {
                    pageName,
                    dataKey: dataOut ? dataOut : dataKey,
                    data: res
                }
            })
            dispatch({
                type: 'emit-update',
                payload: {
                    pageName,
                    dataKey: dataOut ? dataOut : dataKey,
                    newVal: res
                }
            })
        }
        return res
    }
}
/**
 * @param dispatch Function to change the state.
 * @returns Object of builtIn functions.
 */
//TODO: allow argument Fn name
//TODO: consider returning an interface instead
export default function builtInFns(dispatch?: Function) {
    return {
        async createNewAccount(
            { phoneNumber,
                password,
                verificationCode,
                userName }
        ) {
            const data = await Account.create(
                phoneNumber,
                password,
                verificationCode,
                userName
            )
            if (dispatch) {
                dispatch({
                    type: 'update-data',
                    //TODO: handle case for data is an array or an object
                    payload: { pageName: 'builtIn', dataKey: 'builtIn.UserVertex', data }
                })
            }
            return data
        },
        async signIn({
            phoneNumber,
            password,
            verificationCode,
        }) {
            const data = await Account.login(
                phoneNumber,
                password,
                verificationCode,
            )
            if (dispatch) {
                dispatch({
                    type: 'update-data',
                    //TODO: handle case for data is an array or an object
                    payload: { pageName: 'builtIn', dataKey: 'builtIn.UserVertex', data }
                })

            }
            return data
        },
        async loginByPassword(password) {
            const data = await Account.loginByPassword(password)
            if (dispatch) {
                dispatch({
                    type: 'update-data',
                    //TODO: handle case for data is an array or an object
                    payload: { pageName: 'builtIn', dataKey: 'builtIn.UserVertex', data }
                })

            }
        },
        currentDateTime: (() => Date.now())(),
        string: {
            formatUnixtime_en(unixTime: number) {
                return moment(unixTime * 1000).format('lll')
            },
            formatDurationInSecond(unixTime: number) {
                return humanizeDuration(unixTime * 1000)
            }
        },
        async SignInOk(): Promise<boolean> {
            const status = await Account.getStatus()
            if (status.code !== 0) {
                return false
            }
            return true
        }
    }
}