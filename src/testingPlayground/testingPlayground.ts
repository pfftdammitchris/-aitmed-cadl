
/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */

import CADL from '../'
import { defaultConfig } from '../config'
import { Account } from '../'


export default (async function () {

    // await test_LoginNewDevice({ phone_number: '+1 3238677306' }) // okMH+/8WSAgARxTuV7xqpA==
    // await test_login({ password: 'letmein12' })

    const cadl = new CADL({ ...defaultConfig })
    debugger
    await cadl.init()
    debugger

    await cadl.initPage('SignIn')
    // await cadl.initPage('CreateNewAccount')
    // debugger
    const vc = await Account.requestVerificationCode('+1 65322138556758')

    // await cadl.root['CreateNewAccount'].formData.vertexAPI.store({
    //     confirmPassword: "letmein123",
    //     countryCode: "+1",
    //     password: "letmein123",
    //     phoneNumber: "+1 6532dsdgf2138556758",
    //     username: "username",
    //     verificationCode: vc
    // })
    // debugger

    // await cadl.builtIn['signIn']({
    //     password: "letmein123",
    //     phoneNumber: "+1 65322138556758",
    //     verificationCode: vc
    // })
    // debugger
    // cadl.root['SignIn'].update()
    // cadl.root['CreateNewAccount'].update()
    // debugger
    // await cadl.initPage('MeetingRoomInvited')
    // debugger
    // await cadl.runInit('MeetingRoomInvited')
    // debugger
    // await cadl.initPage('MeetingRoomCreate')
    // debugger
    // await cadl.root['MeetingRoomCreate'].save[0][1]()
    // debugger
    // await cadl.runInit('MeetingRoomCreate')
    // debugger
    // cadl.updateObject({dataKey:'.Global.meetroom.edge.refid', dataObject:{id:'123'}, dataObjectKey:'id'})
    // debugger
    // debugger
    // cadl.setFromLocalStorage('user')
    // debugger
    // cadl.setFromLocalStorage('meetroom')
    // debugger
    // await cadl.initPage('CreateMeeting')
    // debugger

    // await cadl.root['CreateMeeting'].components[1].children[2].onClick[0].object()
    // debugger
    // await cadl.root['CreateMeeting'].components[1].children[3].onClick[0].object()
    // debugger
    await cadl.initPage('VideoChat')
    cadl.setValue({ path: 'VideoChat.listData.participants', value: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] })
    debugger
    cadl.addValue({ path: 'VideoChat.listData.participants', value: { id: 5 } })
    debugger
    cadl.replaceValue({ path: 'VideoChat.listData.participants', predicate: { id: 5 }, value: { id: 6, name: 'tom' } })
    debugger
    cadl.removeValue({ path: 'VideoChat.listData.participants', predicate: { id: 1 } })
    debugger
    // await cadl.initPage('InviteeInfo')
    // debugger
    // await cadl.root['InviteeInfo'].save[0][1]({ firstName: "Stan", lastName: "koko" })
    // debugger
    // await cadl.runInit('CreateMeeting')
    // debugger
    // await cadl.root['DashboardMeetingroom'].components[0].children[1].children[0].onClick[0].object()
    // debugger
    // await cadl.initPage('ApplyBusiness')
    // debugger
    // await cadl.root['ApplyBusiness'].formData.edgeAPI.store({ companyPhone: "+1 3431111dsdffsddsfd42essfsdfadfsdfsdsd1daf39" })
    // debugger
    // await cadl.root['ApplyBusiness'].formData.wciAPI.store({ type: 'text/plain', data: "+1 3009665sdsassaddsdsdsfsdfd1ffsdffsdfddaf39" })
    // debugger
    // await cadl.root['ApplyBusiness'].formData.w9API.store({ type: 'text/plain', data: "+1 hellow" })
    // debugger


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