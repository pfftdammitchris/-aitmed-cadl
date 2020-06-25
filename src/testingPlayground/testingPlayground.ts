
/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */

import CADL from '../'
import { defaultConfig } from '../config'
import { Account } from '../services'
export default (async function () {
    // await test_LoginNewDevice({ phone_number: '+1 3238677306' }) // okMH+/8WSAgARxTuV7xqpA==
    // await test_login({ password: 'letmein12' })

    const cadl = new CADL({ ...defaultConfig })
    await cadl.init()
    await cadl.initPage('SignIn')
    // await cadl.initPage('CreateNewAccount')

    const vc = await Account.requestVerificationCode('+1 8858687687')

    // await cadl.root['CreateNewAccount'].formData.vertexAPI.store({
    //     confirmPassword: "letmein123",
    //     countryCode: "+1",
    //     password: "letmein123",
    //     phoneNumber: "+1 8858687687",
    //     username: "username",
    //     verificationCode: vc
    // })

    await cadl.builtIn['signIn']({
        password: "letmein123",
        phoneNumber: "+1 8858687687",
        verificationCode: vc
    })

    cadl.root['SignIn'].update()
    await cadl.initPage('DashboardMeetingroom')
    debugger
    await cadl.root['ApplyBusiness'].formData.edgeAPI.store({ companyPhone: "+1 3431111dsd42ssadfsdfsdsd1daf39" })
    debugger
    await cadl.root['ApplyBusiness'].formData.wciAPI.store({ type: 'text/plain', data: "+1 3009665sassadsdsd1dafsdfsdff39" })
    debugger
    await cadl.root['ApplyBusiness'].formData.w9API.store({ type: 'text/plain', data: "+1 hellow" })
    debugger


    // //@ts-ignore
    // const res = cadl.getData('CreateNewAccount', 'formData.vertex')
    // debugger

    console.log(cadl)

    // async function test_LoginNewDevice({ phone_number }) {
    //     console.log('Testing loginNewDevice')
    //     let verification_code
    //     try {
    //         verification_code = await Account.requestVerificationCode(
    //             phone_number,
    //         )
    //     } catch (err) {
    //         debugger
    //         console.log(err)
    //     }
    //     try {
    //         const loginResult = await Account.loginByVerificationCode(
    //             phone_number,
    //             verification_code,
    //         ).catch((err) => {
    //             console.log(err)
    //             debugger
    //         })
    //         console.log(loginResult)
    //     } catch (err) {
    //         // debugger
    //         console.log(err)
    //     }
    // }
    //**************************** */
    //**************************** */
    //**************************** */
    // async function test_login({ password }) {
    //     console.log('Testing login')
    //     try {
    //         const loginResult = await Account.loginByPassword(
    //             password,
    //         )
    //         console.log(loginResult)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

})()