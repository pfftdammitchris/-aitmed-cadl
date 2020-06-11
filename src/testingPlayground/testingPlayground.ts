
/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */

import { fetchAll, fetchCADLObject, isObject } from '../utils'
import $ from 'jquery'
import { CADLResponse } from '../common/Response'
import CADL from '../CADL'
import { defaultConfig } from '../config'
import store from '../common/store'
export default (async function () {
    console.log(isObject(null))
    console.log(isObject(1))
    console.log(isObject(undefined))
    await test_LoginNewDevice({ phone_number: '+1 3238677306' }) // okMH+/8WSAgARxTuV7xqpA==
    await test_login({ password: 'letmein12' })
    debugger
    const cadl = new CADL({ ...defaultConfig })
    await cadl.init()
    debugger
    await cadl.initPage('SignIn')
    // await cadl.initPage('SignUp')
    await cadl.initPage('ApplyBusiness')
    // await cadl.initPage('InboxPatient')
    debugger
    // await cadl.initPage('SignUp')
    // cadl.pages['SignIn'].update({
    //     UserVertex: 'hello',
    //     JWT: 'pop'
    // })
    // debugger

    async function test_LoginNewDevice({ phone_number }) {
        console.log('Testing loginNewDevice')
        try {
            var {
                data: { verification_code },
            } = await store.level2SDK.Account.requestVerificationCode({
                phone_number,
            })
            debugger
        } catch (err) {
            debugger
            console.log(err)
        }
        try {
            const loginResult = await store.level2SDK.Account.loginNewDevice({
                phone_number,
                verification_code,
            }).catch((err) => {
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
        debugger
        console.log('Testing login')
        try {
            const loginResult = await store.level2SDK.Account.login({
                password,
            })
            console.log(loginResult)
        } catch (err) {
            console.log(err)
        }
    }
    $(document).ready(function () {

        $('#cadlEndpoint-btn').click(function () {
            const url = $('#cadlEndpoint-txtField').val()
            if (!url) return
            //clear previous response and details
            $(".invalid-list").empty()
            $('.cadlEndpoint-details').empty()
            $('.cadlEndpoint-error').empty()

            //show validating..
            $('#val-endpoint-text').show()


            $.when(fetchAll(url)).then(function (res) {

                //hide validating...
                $('#val-endpoint-text').hide()
                type Acc = {
                    valid: CADLResponse[],
                    invalid: CADLResponse[],
                }
                const { valid, invalid } = res.reduce((acc: Acc, obj: CADLResponse) => {
                    if (obj.isValid) acc.valid.push(obj)
                    if (!obj.isValid) acc.invalid.push(obj)
                    return acc
                }, { valid: [], invalid: [] })

                //add details
                $('.cadlEndpoint-details').html(`<span style='font-weight:500'>Total #</span>: ${valid.length + invalid.length}  <span style='color:green;font-weight:500'>VALID</span>: ${valid.length}  <span style='color:red;font-weight:500'>INVALID</span>: ${invalid.length}`)

                //add response to ui
                const cList = $('ul.invalid-list')
                $.each(invalid, function (i) {
                    const li = $('<li/>')
                        .addClass('ui-menu-item')
                        .attr('role', 'menuitem')
                        .appendTo(cList);
                    const a = $('<a/>')
                        .addClass('pagename')
                        .text(invalid[i].pageName)
                        .appendTo(li);
                    $('<br/>').appendTo(a)
                    const errors = invalid[i].error
                    $.each(errors, function (j) {
                        const a = $('<a/>')
                            .addClass('error')
                            .text(errors[j])
                            .appendTo(li);
                        $('<br/>').appendTo(a)
                    })
                });
            }).catch((err) => {
                $('#val-endpoint-text').hide()
                $('.cadlEndpoint-details').html("<span style='color:red;font-weight:400'>INVALID</span>")
                $('.cadlEndpoint-error').html(`<span style='color:red;font-weight:400'>${err}</span>`)
            })
        })

        //single page validation
        $('#cadlPage-btn').click(function () {
            const url = $('#cadlPage-txtField').val()
            if (!url) return
            //clear previous response
            $('#isValid').empty()
            //clear error
            $('.page-error').empty()
            //show validating...
            $('#val-page-text').show()

            $.when(fetchCADLObject(url)).then(function () {
                $('#val-page-text').hide()
                $('#isValid').html("<span style='color:green;font-weight:400'>VALID</span>")
            }).catch((err) => {
                $('#val-page-text').hide()
                $('#isValid').html("<span style='color:red;font-weight:400'>INVALID</span>")
                $('.page-error').html(`<span style='color:red;font-weight:400'>${err}</span>`)
            })
        })

    });
})()