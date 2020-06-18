
/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */

import CADL from '../'
import { defaultConfig } from '../config'
import { Account } from '../services'
export default (async function () {
    debugger
    await test_LoginNewDevice({ phone_number: '+1 3238677306' }) // okMH+/8WSAgARxTuV7xqpA==
    await test_login({ password: 'letmein12' })

    const cadl = new CADL({ ...defaultConfig })
    await cadl.init()
    // await cadl.initPage('DashboardPatient')
    // await cadl.initPage('SignUp')
    await cadl.initPage('ApplyBusiness')
    debugger
    // const vc = await Account.requestVerificationCode('+1 196360039')
    // await cadl.root['CreateNewAccount'].formData.vertexAPI.store({
    //     confirmPassword: "confirmPassword",
    //     countryCode: "+1",
    //     password: "new password",
    //     phoneNumber: "+1 196360039",
    //     username: "username",
    //     verificationCode: vc
    // })
    // debugger
    // await cadl.root['CreateNewAccount'].update()
    // debugger

    // //@ts-ignore
    // const res = cadl.getData('CreateNewAccount', 'formData.vertex')
    // debugger

    console.log(cadl)

    async function test_LoginNewDevice({ phone_number }) {
        console.log('Testing loginNewDevice')
        let verification_code
        try {
            verification_code = await Account.requestVerificationCode(
                phone_number,
            )
        } catch (err) {
            debugger
            console.log(err)
        }
        try {
            const loginResult = await Account.loginByVerificationCode(
                phone_number,
                verification_code,
            ).catch((err) => {
                console.log(err)
                debugger
            })
            console.log(loginResult)
        } catch (err) {
            // debugger
            console.log(err)
        }
    }
    //**************************** */
    //**************************** */
    //**************************** */
    async function test_login({ password }) {
        console.log('Testing login')
        try {
            const loginResult = await Account.loginByPassword(
                password,
            )
            console.log(loginResult)
        } catch (err) {
            console.log(err)
        }
    }

})()