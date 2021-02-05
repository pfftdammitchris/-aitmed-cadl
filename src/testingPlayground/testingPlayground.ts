/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */

import CADL from '../'
import { defaultConfig } from '../config'
import { Account } from '../'
import Document from '../services/Document'
import store from '../common/store'
import ecc from '../CADL/services/ecc'
import string from '../CADL/services/string'
import fcm from '../CADL/services/fcm'

// export default (async function () {
//   console.log('red')
// })()
export default (async function () {
  const token = fcm.getAPPID({ appName: 'Aitchat' })
  const res = fcm.getFCMTokenSHA256Half({ token })
  debugger
  // console.log(stringServices.formatUnixtimeLT_en(Date.now()))
  // const cadl = new CADL({
  //   ...defaultConfig,
  //   configUrl: 'https://public.aitmed.com/config/meet2d.yml',
  //   aspectRatio: 3,
  // })

  // await cadl.init()

  // const obj = {
  //   emit: {
  //     dataKey: {
  //       var1: { value: 4, key: 'red' },
  //       var2: { value: 6, key: 'green' },
  //     },
  //     actions: [
  //       {
  //         if: [
  //           {
  //             '=.builtIn.string.equal': {
  //               dataIn: {
  //                 string1: 'fred',
  //                 string2: 'ted',
  //               },
  //             },
  //           },
  //           '$var1.value',
  //           'Male',
  //         ],
  //       },
  //       {
  //         '=.builtIn.object.remove': {
  //           object: '..GeneralInfo.Radio',
  //           key: '$var1.key',
  //         },
  //       },
  //       {
  //         '=.builtIn.object.set': {
  //           object: '..GeneralInfo.Radio',
  //           key: '$var2.key',
  //           value: 'Male',
  //         },
  //       },
  //     ],
  //   },
  // }

  // const newObj = await cadl.emitCall({
  //   dataKey: obj.emit.dataKey,
  //   actions: obj.emit.actions,
  //   pageName: 'SignIn',
  // })
  // debugger
  // const vc = await Account.requestVerificationCode('+1 8881907654')
  // debugger

  // await test_LoginNewDevice({ phone_number: '+1 8889997654' })
  // await test_login({ password: 'letmein123' })

  // const re = await Account.create('+1 8881907654', 'letmein123', vc, 'goog')

  // debugger
  // await cadl.initPage('SignIn', [], {
  //   builtIn: { goto: () => console.log('lolo') },
  // })
  // const tree = [{ hat: '3' }]
  // cadl.editListDraft({
  //   list: cadl.root.SignIn.update,
  //   index: 0,
  //   dataKey: '.Global.currentUser.vertex@',
  //   value: 8,
  // })
  // debugger
  // cadl.root.SignIn.update[0].islist = 5
  // console.log(tree)
  // debugger
  // const pk = localStorage.getItem('pk')
  // debugger
  // const esak = ecc.generateESAK({ pk })
  // const rootInbox2 = await store.level2SDK.edgeServices.createEdge({
  //   type: 10002,
  //   besak: esak,
  //   name: { title: 'root' },
  // })
  // debugger
  // const { data: fsdfsd } = await store.level2SDK.edgeServices.createEdge({
  //   type: 1040,
  //   name: {
  //     phone_number: '+1 8889997654',
  //     verification_code: vc,
  //   },
  // })
  // fsdfsd.edge.list = 909
  // debugger
  // const { data: redws } = await store.level2SDK.edgeServices.createEdge({
  //   type: 1030,
  //   stime: Date.now(),
  //   bvid: edge?.deat?.user_id,
  // })
  // debugger
  // const red = cadl.root.builtIn.eccNaCl.decryptAES({
  //   key: 'letmein12',
  //   message:
  //     'HJFpLPj1NST7MCaeWRryW5lGEjRdWXrU9PhGHExfekIoaahgvyD2Gk4R4noli7JQMBpkhMWH3MYN/I5PBS4Ks/oo4aOUT4Bh',
  // })
  // debugger
  // cadl.newDispatch({ type: 'SET_VALUE', payload: { pageName: 'SignIn', dataKey: 'formData.password', value: 'ghost' } })

  // await cadl.initPage('CreateNewAccount')

  // await cadl.root['CreateNewAccount'].formData.vertexAPI.store({
  //     confirmPassword: "letmein123",
  //     countryCode: "+1",
  //     password: "letmein123",
  //     phoneNumber: "+1 88887654321",
  //     username: "sammy",
  //     verificationCode: vc
  // })
  // debugger
  // debugger
  // await cadl.root.builtIn['signIn']({
  //   password: 'letmein123',
  //   phoneNumber: '+1 8889997654',
  //   verificationCode: vc,
  // })
  // debugger
  // await cadl.root.actions['SignIn'].update()

  // setTimeout(async () => {
  //   debugger
  //   const testDoc = await cadl.root.builtIn.uploadDocument({
  //     dataType: 0,
  //     content: 'hello this is a test',
  //     type: 'text/plain',
  //     title: 'test document',
  //   })
  //   debugger
  // }, 5000)
  // const { data: { eid } } = await store.level2SDK.edgeServices.createEdge({ type: 10000 })
  // // cadl.root['CreateNewAccount'].update()
  // debugger
  // // await cadl.initPage('MeetingRoomInvited')
  // // debugger
  // // await cadl.runInit('MeetingRoomInvited')
  // // debugger
  // await cadl.initPage('MeetingRoomCreate', [], { builtIn: { goto(destination) { console.log(destination) } } })

  // debugger
  // await cadl.root['MeetingRoomCreate'].save[0][1]()
  // debugger
  // await cadl.initPage('MeetingLobbyStart')
  // debugger
  // // await cadl.runInit('MeetingRoomCreate')
  // // debugger
  // // cadl.updateObject({dataKey:'.Global.meetroom.edge.refid', dataObject:{id:'123'}, dataObjectKey:'id'})
  // // debugger
  // // debugger
  // // cadl.setFromLocalStorage('user')
  // // debugger
  // // cadl.setFromLocalStorage('meetroom')
  // // debugger
  // // await cadl.initPage('CreateMeeting')
  // // debugger

  // // await cadl.root['CreateMeeting'].components[1].children[2].onClick[0].object()
  // // debugger
  // // cadl.updateObject({dataKey:'.Global.meetroom.edge.name.roomName', dataObject:'hello tom'})
  // // debugger
  // // await cadl.root['MeetingLobbyStart'].components[1].children[3].onClick[0].object()
  // const ed = await cadl.root['MeetingLobbyStart'].save[0][1]()
  // debugger
  // cadl.root.VideoChatObjStore.reference = ed
  // debugger
  // await cadl.initPage('InviteeInfo01')
  // debugger
  // await cadl.root['InviteeInfo01'].save[0][1]({ firstName: "Stan", lastName: "koko" })
  // debugger
  // await cadl.initPage('VideoChat', [], { builtIn: { videoChat: ({ roomId, accessToken }) => { console.log(roomId); console.log(accessToken) } } })
  // debugger
  // await cadl.initPage('MeetingLobbyClose')
  // debugger
  // cadl.setValue({ path: 'VideoChat.listData.participants', value: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] })
  // debugger
  // cadl.addValue({ path: 'VideoChat.listData.participants', value: { id: 5 } })
  // debugger
  // cadl.replaceValue({ path: 'VideoChat.listData.participants', predicate: { id: 5 }, value: { id: 6, name: 'tom' } })
  // debugger
  // cadl.removeValue({ path: 'VideoChat.listData.participants', predicate: { id: 1 } })
  // debugger
  // console.log(cadl)

  // cadl.initPage('MeetingLobbyStart', [])
  // console.log(cadl)

  // // await cadl.initPage('InviteeInfo')
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

  // async function test_LoginNewDevice({ phone_number }) {
  //   console.log('Testing loginNewDevice')
  //   let verification_code
  //   try {
  //     verification_code = await Account.requestVerificationCode(phone_number)
  //   } catch (err) {
  //     debugger
  //     console.log(err)
  //   }
  //   try {
  //     const loginResult = await Account.loginByVerificationCode(
  //       phone_number,
  //       verification_code
  //     ).catch((err) => {
  //       console.log(err)
  //       debugger
  //     })
  //     console.log(loginResult)
  //   } catch (err) {
  //     // debugger
  //     console.log(err)
  //   }
  // }
  // //**************************** */
  // //**************************** */
  // //**************************** */
  // async function test_login({ password }) {
  //   console.log('Testing login')
  //   try {
  //     const loginResult = await Account.loginByPassword(password)
  //     console.log(loginResult)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // async function test_UpdateDocument() {
  //   try {
  //     var {
  //       data: {
  //         edge: { eid },
  //       },
  //     } = await store.level2SDK.edgeServices.createEdge({ type: 10001 })
  //   } catch (err) {
  //     console.log(err)
  //   }
  //   var b64Id = store.level2SDK.utilServices.uint8ArrayToBase64(eid)

  //   debugger
  //   try {
  //     var {
  //       data: {
  //         document: { id, name: oldName, deat },
  //       },
  //     } = await store.level2SDK.documentServices.createDocument({
  //       type: 10001,
  //       eid: b64Id,
  //       name: {
  //         data: { hello: 'goodbye' },
  //       },
  //     })
  //     debugger
  //     console.log(deat)
  //   } catch (err) {
  //     console.log(err)
  //   }
  //   debugger
  //   try {
  //     var b64DocId = store.level2SDK.utilServices.uint8ArrayToBase64(id)

  //     const updateDocumentResponse = await Document.update(b64DocId, {
  //       content: { ...oldName, data: { george: 'jungle' } },
  //       type: 2,
  //       subtype: 3,
  //       size: 154,
  //     })
  //     console.log('This is the result of updating the document')
  //     console.log(updateDocumentResponse)
  //   } catch (err) {
  //     console.log(err)
  //   }
  //   debugger
  //   try {
  //     const retrieveDocument = await store.level2SDK.documentServices.retrieveDocument(
  //       {
  //         idList: [id],
  //       }
  //     )
  //     console.log(retrieveDocument)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
})()
