
/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */

import { fetchAll, fetchCADLObject } from '../utils'
import $ from 'jquery'
import { CADLResponse } from '../common/Response'
import CADL from '../CADL'
import { defaultConfig } from '../config'
export default (async function () {

    $(document).ready(function () {
        const cadl = new CADL({ ...defaultConfig })
        debugger
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
                    var li = $('<li/>')
                        .addClass('ui-menu-item')
                        .attr('role', 'menuitem')
                        .appendTo(cList);
                    var a = $('<a/>')
                        .addClass('pagename')
                        .text(invalid[i].pageName)
                        .appendTo(li);
                    $('<br/>').appendTo(a)
                    $('<a/>')
                        .addClass('error')
                        .text(invalid[i].error)
                        .appendTo(li);
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

            $.when(fetchCADLObject(url)).then(function (res) {
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