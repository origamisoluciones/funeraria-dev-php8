var items = [];

var deliveryPlaceID, deliveryPlaceName;
// SELECT2
var limit_page = 10
var langSelect2 = {
    inputTooShort: function(args) {
        return "Escribir ..."
    },
    inputTooLong: function(args) {
        return "Término demasiado largo"
    },
    errorLoading: function() {
        return "Sin resultados"
    },
    loadingMore: function() {
        return "Cargando más resultados"
    },
    noResults: function() {
        return "No hay resultados"
    },
    searching: function() {
        return "Buscando..."
    },
    maximumSelected: function(args) {
        return "Sin resultados"
    }
}

function formatData (data) {
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

function getTotal(){
    var total = 0
    var buyed = 0

    $('#deliveryNoteLines tr').each(function(){
        var row = $(this)

        var id = row.find('td.id').html()
        var amount = row.find('td#amount' + id).html()
        var price = row.find('input#price' + id).val()
        var received = row.find('input#receivedAmount' + id).val()

        total = parseFloat(total) + parseFloat(parseInt(amount) * parseFloat(price)) 
        buyed = parseFloat(buyed) + parseFloat(parseInt(received) * parseFloat(price))
        if(isNaN(buyed)){
            buyed = 0;
        }
    })

    $('#total').html(total + ' €' + ' (' + buyed + ' €)')
}

/**
 * Comprueba si el albarán existe
 * 
 * @param {int} expedient Id del albarán
 * @return bool
 */
function existsDeliveryNote(deliveryNote){
    var check

    $.ajax({
        url: uri + 'core/warehouse/deliveryNotes/functions.php',
        method: 'POST',
        data: {
            type: 'existsDeliveryNote',
            deliveryNote: deliveryNote
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data)
            }catch(e){
                check = false
            }
        },
        error: function(){
            check = false
        }
    })

    return check
}

function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height()
    $('.content-wrapper').css('padding-bottom', heightFooter)
}
$(window).scroll(function(){
    changeSpaceFooter()
})
$(window).resize(function(){
    changeSpaceFooter()
})
$(function(){
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveEditDeliveryNote" name="saveEditDeliveryNote" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
    $('#cancelLink').click(function(event) {
        event.preventDefault();

        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    });

    $('#backLink').click(function(event) {
        $('#saveEditDeliveryNote').click();
        event.preventDefault();

        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    });
    
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })
    
    // GO TOP
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // DATEPICKER
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT2
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    var deliveryNoteID = $('#deliveryNoteID').val()
    if(existsDeliveryNote(deliveryNoteID)){
        $('#existsDeliveryNote').remove()
    }else{
        $('#existsDeliveryNote').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'almacen/albaranes'
        }, 2500);
        return
    }

    // ALBARÁN - DATOS
    $.ajax({
        url: uri + 'core/warehouse/deliveryNotes/read.php',
        method: 'POST',
        data: {
            ID: deliveryNoteID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data)
            
            var deliveryNote = data[0]
            
            deliveryPlaceID = deliveryNote.deliveryPlaceId
            deliveryPlaceName = deliveryNote.deliveryPlace
            
            $("#deliveryNoteIDTitle").text(deliveryNote.number)
            $('#number').val(deliveryNote.number)
            $('#formEditDeliveryNote #date').val(moment(deliveryNote.date, 'X').format('DD/MM/YYYY'))
            if(deliveryNote.deliveryPlace == null){
                $('#deliveryPlace').val(deliveryNote.otherDeliveryPlace)
            }else{
                $('#deliveryPlace').val(deliveryNote.deliveryPlace)
                $('#deliveryPlaceId').val(deliveryNote.deliveryPlaceId)
            }
            $('#supplierID').val(deliveryNote.supplierID)
            $('#supplierName').val(deliveryNote.supplierName)
            $('#supplierPhones').val(deliveryNote.supplierPhones)
            $('#supplierEmail').val(deliveryNote.supplierEmail)
            if(deliveryNote.inAgreement == '0'){
                $('#nonconformitySection').removeClass('hide')
                $('#nonconformityDescription').val(deliveryNote.nonconformityDescription)
                $('#nonconformitySolution').val(deliveryNote.nonconformitySolution)
                $('#inAgreement').val(deliveryNote.inAgreement)
            }
            if(deliveryNote.inAgreement == null){
                $('#inAgreement').val('-')
            }else{
                $('#inAgreement').val(deliveryNote.inAgreement)
            }
            $('#notes').val(deliveryNote.notes)


            var total = data[3];
            $("#totalReceived").append('Total Albarán (Sin ' + getIvaLabel() + '): <strong>' + toFormatNumber(parseFloat(data[3].total).toFixed(2)) + ' €</strong>')
            $("#totalPending").append('Total Recibido (Sin ' + getIvaLabel() + '): <strong>' + toFormatNumber(parseFloat(data[3].totalReceived).toFixed(2)) + ' €</strong>')
            if(deliveryNote.gasoil == '' || deliveryNote.gasoil == null){

                var deliveryNoteLines = data[1]

                $.each(deliveryNoteLines, function(index, elem){
                    var id = elem.ID
                    var productID = elem.productID
                    var productName = elem.productName
                    var modelId = elem.modelID
                    var modelName = elem.modelName
                    var amount = elem.amount
                    var price = elem.price
                    var discount = elem.discount
                    var iva = elem.iva
                    var receivedAmount = elem.receivedAmount
                    var pendingAmount = elem.pendingAmount
                    var canceled = elem.canceled

                    $('#deliveryNoteLines').append( 
                        '<tr>' +
                        '   <td width="5%" class="hide id">' + id + '</td>' +
                        '   <td width="5%" class="hide" id="product' + id + '">' + productID + '</td>' +
                        '   <td width="20%">' + productName + '</td>' +
                        '   <td width="5%" class="hide" id="model' + id + '">' + modelId + '</td>' +
                        '   <td width="20%">' + modelName + '</td>' +
                        '   <td width="5%" class="hide" id="iva' + id + '">' + iva + '</td>' +
                        '   <td width="10%" id="amount' + id + '" class="text-center">' + amount + '</td>' +
                        '   <td width="10%" align="center">' +
                        '       <input type="number" class="input-medium text-center" id="price' + id + '" value="' + price + '"><span> €</span>' +
                        '   </td>' +
                        '   <td width="10%" align="center">' +
                        '       <input type="number" class="input-medium text-center" id="discount' + id + '" value="' + discount + '"><span> %</span>' +
                        '   </td>' +
                        '   <td width="10%" align="center">' +
                        '       <input type="number" class="input-medium text-center" id="receivedAmount' + id + '" value="' + receivedAmount + '">' +
                        '   </td>' +
                        '   <td width="10%" align="center">' +
                        '       <input type="number" class="input-medium text-center" id="pendingAmount' + id + '" value="' + pendingAmount + '">' +
                        '   </td>' +
                        '   <td width="20%" class="hide" id="canceledVal' + id + '">' + canceled + '</td>' +
                        '   <td class="text-center" width="5%" id="canceledSection' + id + '">' +
                        '       <button type="button" class="btn btn-danger canceledBtn" id="canceled' + id + '"><i class="fa fa-ban"></i></button>' +
                        '   </td>' +
                        '   <td class="text-center" width="5%">' +
                        '       <button type="button" class="btn btn-primary pendingBtn" id="pending' + id + '"><i class="fa fa-plus"></i></button>' +
                        '   </td>' +
                        '</tr>')
                                                
                    if(canceled == 1){
                        $('#newDatePending').attr('disabled', true)
                        $('#canceledSection' + id).empty().append('<label class="label label-danger">Anulado</label>')
                    }
                  
                    $('#newDatePending').attr('disabled', true)

                    // CANTIDADES
                    $('#receivedAmount' + id).change(function(){
                        var receivedAmount = $(this).val()
                        var amount = $('#amount' + id).html()

                        var difference = parseInt(amount) - parseInt(receivedAmount)
                        if(difference < 0){
                            difference = 0
                            $('#newDatePending').attr('disabled', true)
                        }else{
                            $('#newDatePending').attr('disabled', false)
                        }

                        $('#pendingAmount' + id).val(difference)
                    })

                    $('#price' + id).change(function(){
                        getTotal()
                    })

                    $('#discount' + id).change(function(){
                        getTotal()
                    })

                    $('#receivedAmount' + id).change(function(){
                        getTotal()
                    })

                    // ANULAR PENDIENTE
                    $('#canceled' + id).click(function(){
                        $('#canceledVal' + id).html(1)
                        $('#newDatePending').attr('disabled', true)
                    })
                    
                    // RECIBIR PENDIENTE
                    $('#pending' + id).click(function(){
                        var pendingAmount = $('#pendingAmount' + id).val()
                        if(pendingAmount == 0){
                            $('#newDatePending').attr('disabled', true)
                        }else{
                            if($('#canceled' + id).prop('disabled') == false){
                                $('#newDatePending').attr('disabled', false)
                            }
                        }

                        $('#deliveryNoteLineID').val(id)

                        $.ajax({
                            url: uri + 'core/warehouse/deliveryNotes/functions.php',
                            method: 'POST',
                            data: {
                                type: 'getDeliveryNotesLinesPending',
                                ID : id
                            },
                            async: false,
                            success: function(data){
                                data = $.parseJSON(data)
                                $('#linesPending').empty()
                                if(data != null){
                                    $.each(data, function(index2, elem2){
                                        $('#linesPending').append(  
                                            '   <tr>' +
                                            '       <td class="pendingIndex hide">' + index2 + '</td>' +
                                            '       <td class="pendingId hide">' + elem2.ID + '</td>' +
                                            '       <td>' +
                                            '           <input type="text" class="form-control datepicker" id="pendingDate' + index2 + '" value="' + moment(elem2.date, 'X').format('DD/MM/YYYY') + '" disabled>' +
                                            '       </td>' +
                                            '       <td>' +
                                            '           <input type="number" class="form-control" id="pendingAmount' + index2 + '" value="' + elem2.amount + '" disabled>' +
                                            '       </td>' +
                                            '   </tr>')

                                        // DATEPICKER
                                        $('.datepicker').datepicker({
                                            todayHighlight : true,forceParse: false
                                        })
                                    })
                                }
                            }
                        })
                        $('#modal-pending-deliveryNoteLine').modal('show')
                    })
                })
            }else{
                $("#orderLinesTable").empty();
                $("#orderLinesTable").append('<th width="20%" class="id hide">ID</th>' +
                                            '<th width="20%" style="text-align:center">Litros</th>' +
                                            '<th width="20%" style="text-align:center">Precio/Litro</th>' +
                                            '<th width="20%" style="text-align:center">Base Imponible</th>' +
                                            '<th width="15%" style="text-align:center">' + getIvaLabel() + '</th>' +
                                            '<th width="20%" style="text-align:center">Total</th>');
    
                $.post(uri + 'core/crematoriums/gasoil/read.php', {gasoilID : deliveryNote.gasoil}, function(data){
                    data = $.parseJSON(data)
                    
                    $("#gasoilID").val(data.gasoilID);
                    
                    $('#orderLines').append( 
                        '   <tr class="line">' +
                        '       <td class="index hide" width="5%"></td>' +
                        '       <td class="id hide" width="5%"></td>' +
                        '       <td class="text-center" width="15%">' +
                        '           <input style="margin-left:auto; margin-right:auto; text-align:center" type="text" class="form-control" id="litres'  + '" value="' + data.litres + ' l" disabled>' +
                        '       </td>' +
                        '       <td width="15%">' +
                        '           <input type="text"  style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="priceLitre' + '" value="' + data.priceLitre + ' €" disabled>' +
                        '       </td>' +
                        '       <td width="10%">' +
                        '           <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="net'  + '" value="' + data.net + ' €" disabled>' +
                        '       </td>' +
                        '       <td width="10%">' +
                        '           <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="ivaName'  + '" value="' +  data.ivaName + '" disabled>' +
                        '       </td>' +
                        '       <td width="10%">' +
                        '           <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="total'  + '" value="' + data.total + ' €" disabled>' +
                        '       </td>' +
                        '   </tr>')
                })

                $.post(uri + 'core/warehouse/deliveryNotes/readGasoilLines.php', {ID : deliveryNote.ID}, function(data){

                    data = $.parseJSON(data)
                    $("#orderDeliveryTable").empty();
                    $("#orderDeliveryTable").append(
                        '<th width="20%" class="id hide">ID</th>' +
                        '<th width="20%" style="text-align:center">Litros Pedidos</th>' +
                        '<th width="20%" style="text-align:center">Litros Recibidos</th>' +
                        '<th width="20%" style="text-align:center">Precio/Litro</th>' +
                        '<th width="20%" style="text-align:center">Base Imponible</th>' +
                        '<th width="15%" style="text-align:center">' + getIvaLabel() + '</th>' +
                        '<th width="20%" style="text-align:center">Total</th>');

                    $('#deliveryNoteLines').append(
                        '<tr class="line">' +
                        '       <td class="index hide" width="5%"></td>' +
                        '       <td class="id hide" width="5%"></td>' +
                        '       <td class="text-center" width="15%">' +
                        '        <input style="margin-left:auto; margin-right:auto; text-align:center" type="text" class="form-control" id="litres' + '" value="' + data.litersRequest + '" disabled>' +
                        '       </td>' +
                        '       <td width="15%">' +
                        '         <input type="number" step="0.5" min= 0 style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="litresDelivery" value="' + data.litresReceived + '">' +
                        '       </td>' +
                        '       <td width="15%">' +
                        '         <input type="number" step="0.5" min= 0 style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="priceLitreDelivery" value="' + data.priceLiter + '">' +
                        '       </td>' +
                        '       <td width="10%">' +
                        '          <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="netDelivery" value="' + data.neto + ' €" disabled>' +
                        '       </td>' +
                        '       <td width="10%">' +
                        '           <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="ivaDelivery" value="' + data.ivaName + '" disabled>' +
                        '       </td>' +
                        '       <td width="10%">' +
                        '          <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="totalDelivery" value="' + data.total + ' €" disabled>' +
                        '       </td>' +
                        '   </tr>')
                    
                    //If changes litres
                    $('#litresDelivery').change(function(){
                        var net = 0;
                        if($('#priceLitreDelivery').val() != ''){
                            var net =  $('#litresDelivery').val() *  $('#priceLitreDelivery').val()
                            $('#netDelivery').val(net + " €");
                        }

                        if($('#netDelivery').val() != '' && $('#ivaDelivery').val() != '' && $('#ivaDelivery').val() != null){
                            var iva = parseInt($('#ivaDelivery').val().replace('%',''))
                            if(Number.isInteger(iva)){
                                var neto = $('#netDelivery').val().replace("€","");
                                $("#totalDelivery").val(parseInt(neto) + (parseInt(neto) * parseInt(iva) / 100) );
                            } else{
                                var neto = $('#netDelivery').val().replace("€","");
                                $("#totalDelivery").val(parseInt(neto).toFixed(2));
                            }
                        }
                    })

                    //If changes litres
                    $('#priceLitreDelivery').change(function(){
                        var net = 0;
                        if($('#litresDelivery').val() != ''){
                            var net =  $('#litresDelivery').val() *  $('#priceLitreDelivery').val()
                            $('#netDelivery').val(net + " €");
                        }

                        if($('#netDelivery').val() != '' && $('#ivaDelivery').val() != '' && $('#ivaDelivery').val() != null){
                            var iva = parseInt($('#ivaDelivery').val().replace('%',''))
                            if(Number.isInteger(iva)){
                                var neto = $('#netDelivery').val().replace("€","");
                                $("#totalDelivery").val(parseInt(neto) + (parseInt(neto) * parseInt(iva) / 100) );
                            } else{
                                var neto = $('#netDelivery').val().replace("€","");
                                $("#totalDelivery").val(parseInt(neto).toFixed(2));
                            }
                        }
                    })
            
                })
            }

            $('#newDatePending').click(function(){
                var index = -1
                $('#linesPending tr').each(function(){
                    index = $(this).find('td.pendingIndex').html()
                })
                index++

                $('#linesPending').append(  
                    '   <tr>' +
                    '       <td class="pendingIndex hide">' + index + '</td>' +
                    '       <td class="pendingId hide"></td>' +
                    '       <td>' +
                    '           <input type="text" class="form-control datepicker" id="pendingDate' + index + '">' +
                    '       </td>' +
                    '       <td>' +
                    '           <input type="number" class="form-control" id="pendingAmount' + index + '">' +
                    '       </td>' +
                    '   </tr>')

                // DATEPICKER
                $('.datepicker').datepicker({
                    todayHighlight : true,forceParse: false
                })
            })

            $('#savePendingDeliveryNoteLine').click(function(){
                var validate = 0

                $('#linesPending tr').each(function(elem, index){
                    var row = $(this)
                    var pendingIndex = row.find('td.pendingIndex').html()

                    if(isEmpty(row.find('input#pendingDate' + pendingIndex))){
                        validate++
                    }
                    if(isEmpty(row.find('input#pendingAmount' + pendingIndex))){
                        validate++
                    }
                })

                if(validate == 0){
                    var deliveryNoteLineId = $('#deliveryNoteLineID').val()
                    var pending = new Array

                    $('#linesPending tr').each(function(elem, index){
                        var row = $(this)
                        var pendingIndex = row.find('td.pendingIndex').html()
                        var pendingId = row.find('td.pendingId').html()
                        var pendingDate = moment(row.find('input#pendingDate' + pendingIndex).val(), 'DD/MM/YYYY').format('X')
                        var pendingAmount = row.find('input#pendingAmount' + pendingIndex).val()

                        if(!row.find('input#pendingDate' + pendingIndex).attr('disabled')){
                            pending.push([pendingId, deliveryNoteLineId, pendingDate, pendingAmount])
                        }
                    })

                    if(pending.length > 0){
                        $.ajax({
                            url: uri + 'core/warehouse/deliveryNotes/functions.php',
                            method: 'POST',
                            data: {
                                type: 'addPending',
                                pending: pending,
                                receivedAmount: $('#receivedAmount' + deliveryNoteLineId).val(),
                                pendingAmount: $('#pendingAmount' + deliveryNoteLineId).val()
                            },
                            async: false,
                            success: function(data){
                                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Por favor, guarde el albarán para terminar de añadir los productos pendientes de recibir</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)

                                data = $.parseJSON(data)

                                var pending = data[0]
                                var received = data[1]

                                $('#receivedAmount' + deliveryNoteLineId).val(received)
                                $('#pendingAmount' + deliveryNoteLineId).val(pending)
                            }
                        })
                    }

                    if($('#pendingAmount' + deliveryNoteLineId).val() == 0){
                        $('#newDatePending' + deliveryNoteLineId).attr('disabled', true)
                    }

                    $('#modal-pending-deliveryNoteLine').modal('hide')
                }else{
                    $('#modal-pending-deliveryNoteLine #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

                    setTimeout(function(){
                        $('#modal-pending-deliveryNoteLine #warning-message').empty()
                    }, 3500)
                }
            })

            var orderLines = data[2]

            $.each(orderLines, function(index, elem){
                var productName = elem.productName
                var modelName = elem.modelName
                var supplierReference = elem.supplierReference == null ? '' : elem.supplierReference
                var amount = elem.amount
                var price = elem.price
                var lastAmount = elem.lastPurchaseAmount
                var lastPrice = elem.lastPurchasePrice == null ? '-' : elem.lastPurchasePrice.replace('.', ',')
                var lastPurchaseDate = moment(elem.lastPurchaseDate, 'X').format('DD/MM/YYYY')

                $('#orderLines').append(
                    '   <tr>' +
                    '       <td width="15%">' + productName + '</td>' +
                    '       <td width="15%">' + modelName + '</td>' +
                    '       <td width="10%" style="text-align:center">' + supplierReference + '</td>' +
                    '       <td width="10%" style="text-align:center">' + amount + '</td>' +
                    '       <td width="10%" style="text-align:center">' + price + '<span> €</span></td>' +
                    '       <td width="10%" style="text-align:center">' + lastAmount + '</td>' +
                    '       <td width="10%" style="text-align:center">' + lastPrice.replace('.', ',') + ' €</td>' +
                    '       <td width="10%" style="text-align:center">' + lastPurchaseDate + '</td>' +
                    '   </tr>')
            })
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    $('#inAgreement').attr('disabled', false)
    $('#nonconformityDescription').attr('disabled', false)
    $('#nonconformitySolution').attr('disabled', false)

    // TOTAL
    getTotal()

    //Sticky Table Header Lineas de Pedido
    $('#tableLinesDeliveryNotes #tableLines').stickyTableHeaders();
    $('#tableLinesDeliveryNotes #tableLines').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    //Sticky Table Header Lineas de albarán
    $('#tableDeliveryNoteLines').stickyTableHeaders();
    $('#tableDeliveryNoteLines').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');
    
    // NO CONFORMIDAD
    $('#inAgreement').change(function(){
        if(parseInt($(this).val()) == 0 || parseInt($(this).val()) == 2){
            $('#nonconformitySection').removeClass('hide')
        }else{
            $('#nonconformitySection').addClass('hide')
        }
    })

    $('#genPdfNC').click(function(){
        var text
        $("#saveEditDeliveryNote").click();
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'noConformidad', text: text, service: deliveryNoteID, data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'noConformidad', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/noConformidad.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la no conformidad ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })

    $('#genPdfAC').click(function(){
        $("#saveEditDeliveryNote").click();
        var text
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'accionCorrectiva', text: text, service: deliveryNoteID, data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'accionCorrectiva', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/accionCorrectiva.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la acción correctiva ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })
    
    // ALBARÁN - GUARDAR
    $('#saveEditDeliveryNote').click(function(){
        var validate = 0

        if(isEmpty($('#date'))){
            validate++
        }

        $('#deliveryNoteLines tr').each(function(){
            var row = $(this)

            var id = row.find('td.id').text()

            if(isEmpty($('#price' + id))){
                validate++
            }
            if(isEmpty($('#discount' + id))){
                validate++
            }
            if(isEmpty($('#receivedAmount' + id))){
                validate++
            }
            if(isEmpty($('#pendingAmount' + id))){
                validate++
            }
        })

        if(validate == 0){
            var ID = $('#deliveryNoteID').val()
            var number = $('#number').val()
            var date = moment($('#date').val(), 'DD/MM/YYYY').format('X')
            var inAgreement = $('#inAgreement').val()
            var nonconformityDescription = $('#nonconformityDescription').val()
            var nonconformitySolution = $('#nonconformitySolution').val()
            var notes = $('#notes').val()
            var deliveryPlace = $('#deliveryPlaceId').val()

            if($("#gasoilID").val() == '' || $("#gasoilID").val() == undefined || $("#gasoilID").val() == null){

                var lines = new Array
                var items = [];
                $('#deliveryNoteLines tr').each(function(index){
                    var row = $(this)

                    var id = row.find('td.id').text()
                    var model = row.find('td#model' + id).html()
                    var price = row.find('input#price' + id).val()
                    var discount = row.find('input#discount' + id).val()
                    var receivedAmount = row.find('input#receivedAmount' + id).val()
                    var pendingAmount = row.find('input#pendingAmount' + id).val()
                    var canceled = row.find('td#canceledVal' + id).html()

                    lines.push([id, model, price, receivedAmount, pendingAmount, canceled, discount])

                    var product = row.find('td#product' + id).html()
                    var iva = row.find('td#iva' + id).html()
                    
                    items[index] = {
                        "productID" : product,
                        "modelID" : model,
                        "amount" : receivedAmount,
                        "price" :  price,
                        "iva" :  iva,
                        "discount" : discount
                    };
                })

                $.ajax({
                    url: uri + 'core/warehouse/deliveryNotes/update.php',
                    method: 'POST',
                    data: {
                        ID: ID,
                        number: number,
                        date: date,
                        inAgreement: inAgreement,
                        nonconformityDescription: nonconformityDescription,
                        nonconformitySolution: nonconformitySolution,
                        notes: notes,
                        deliveryPlace: deliveryPlace,
                        lines: lines,
                        items : items
                    },
                    async: false,
                    success: function(data){
                        data = $.parseJSON(data)

                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El albarán se ha guardado correctamente</div>')
                            setTimeout(() => {
                                window.location.href = uri + 'almacen/albaranes/' + deliveryNoteID
                            }, 1500);
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })

            }else{

                if(isEmpty($('#litresDelivery'))){
                    validate++;
                }else{
                    var litresReceived = $('#litresDelivery').val()
                }
    
                if(isEmpty($('#priceLitreDelivery'))){
                    validate++;
                }else{
                    var priceLiter = $('#priceLitreDelivery').val()
                }
    
                if(isEmpty($('#netDelivery'))){
                    validate++;
                }else{
                    var net = $('#netDelivery').val()
                }
    
                if(isEmpty($('#totalDelivery'))){
                    validate++;
                }else{
                    var total = $('#totalDelivery').val();
                }
    
                $.ajax({
                    url: uri + 'core/warehouse/deliveryNotes/updateGasoil.php',
                    method: 'POST',
                    data: {
                        ID: ID,
                        number: number,
                        date: date,
                        inAgreement: inAgreement,
                        nonconformityDescription: nonconformityDescription,
                        nonconformitySolution: nonconformitySolution,
                        notes: notes,
                        deliveryPlace: deliveryPlace,
                        litresReceived : litresReceived,
                        priceLiter : priceLiter,
                        net : net,
                        total : total
                    },
                    async: false,
                    success: function(data){
                        data = $.parseJSON(data)
    
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El albarán se ha guardado correctamente</div>')
                            setTimeout(() => {
                                window.location.href = uri + 'almacen/albaranes/' + deliveryNoteID
                            }, 1500);
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
            }
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })

    // ALBARÁN - GENERAR FACTURA
    // IVA
    $.ajax({
        url: uri + 'core/iva/functions.php',
        method: 'POST',
        data: {
            type: 'get',
            ivaType : 1
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data == null){
                    $('.iva').append('<option value="0">-</option>')
                }else{
                    $.each(data, function(index, elem){
                        $('.iva').append('<option value="' + elem.percentage + '">' + elem.name + '</option>')
                    })
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    // Carga los centros de coste
    $('#formNewReceivedInvoice #costCenter').select2({
        containerCssClass: 'select2-costCenter',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataCostCenter.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    var newOption = new Option(deliveryPlaceName,deliveryPlaceID, true, true)
    $('#formNewReceivedInvoice #costCenter').append(newOption).trigger('change')

    // Carga los proveedores
    $('#formNewReceivedInvoice #supplier').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expenses/receivedInvoices/supplierData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.supplierID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Carga las cuentas bancarias
    $('#formNewReceivedInvoice #bankAccount').select2({
        containerCssClass: 'select2-bankAccount',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataBank.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.owner,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Carga las tarjetas de crédito
    $('#formNewReceivedInvoice #creditCard').select2({
        containerCssClass: 'select2-bankAccount',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataCard.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.owner,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Carga los tipos de gastos fijos
    $('#formNewReceivedInvoice #expenseFixed').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataExpenseFixed.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Carga los tipos de gastos fijos
    $('#formNewReceivedInvoice #expenseFixed').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataExpenseFixed.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Carga los tipos de gastos variables
    $('#formNewReceivedInvoice #expenseVariable').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expenses/configuration/dataExpenseVariable.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#formNewReceivedInvoice #paymentMethod').change(function(){
        var paymentMethod = $(this).val()

        switch(paymentMethod){
            case '3':
                $('#formNewReceivedInvoice #creditCards').addClass('hide');
                $('#formNewReceivedInvoice #creditCard').val('').trigger('change')
                $('#formNewReceivedInvoice #bankAccounts').removeClass('hide');
                $('#formNewReceivedInvoice #bankAccounts').addClass('show');
            break
            case '4':
                $('#formNewReceivedInvoice #creditCards').removeClass('hide');
                $('#formNewReceivedInvoice #bankAccounts').addClass('hide');
                $('#formNewReceivedInvoice #bankAccount').val('').trigger('change')

            break
            default:
                $('#formNewReceivedInvoice #bankAccounts').addClass('hide');
                $('#formNewReceivedInvoice #bankAccount').val('').trigger('change')
                $('#formNewReceivedInvoice #creditCards').addClass('hide');
                $('#formNewReceivedInvoice #creditCard').val('').trigger('change')
            break
        }
    })

    $('#formNewReceivedInvoice #cashOut').change(function(){
        var expense = $(this).val()

        switch(expense){
            // Gasto
            case '1':
                $('#formNewReceivedInvoice #expenses').removeClass('hide');
            break
            // Inversión
            case '2':
                $('#formNewReceivedInvoice #expenses').addClass('hide');
                $('#formNewReceivedInvoice #expenseType').val(0)
                $('#formNewReceivedInvoice #expensesFixed').addClass('hide');
                $('#formNewReceivedInvoice #expensesVariable').addClass('hide');
                $('#formNewReceivedInvoice #expenseFixed').val('').trigger('change')
                $('#formNewReceivedInvoice #expenseVariable').val('').trigger('change')
            break
            default:
                $('#formNewReceivedInvoice #expenses').addClass('hide');
                $('#formNewReceivedInvoice #expensesFixed').addClass('hide');
                $('#formNewReceivedInvoice #expensesVariable').addClass('hide');
            break
        }
    })

    $('#formNewReceivedInvoice #expenseType').change(function(){
        var expenseType = $(this).val()

        switch(expenseType){
            case '1':
                $('#formNewReceivedInvoice #expensesFixed').removeClass('hide');
                $('#formNewReceivedInvoice #expensesVariable').addClass('hide');
            break
            case '2':
                $('#formNewReceivedInvoice #expensesVariable').removeClass('hide');
                $('#formNewReceivedInvoice #expensesVariable').addClass('show');
                $('#formNewReceivedInvoice #expensesFixed').removeClass('show');
                $('#formNewReceivedInvoice #expensesFixed').addClass('hide');
            break
            case '3':
                $('#formNewReceivedInvoice #expensesFixed').removeClass('show');
                $('#formNewReceivedInvoice #expensesFixed').addClass('hide');
                $('#formNewReceivedInvoice #expensesVariable').removeClass('show');
                $('#formNewReceivedInvoice #expensesVariable').addClass('hide');

            break
            default:
                $('#formNewReceivedInvoice #expensesFixed').removeClass('show');
                $('#formNewReceivedInvoice #expensesFixed').addClass('hide');
                $('#formNewReceivedInvoice #expensesVariable').removeClass('show');
                $('#formNewReceivedInvoice #expensesVariable').addClass('hide');
            break
        }
    })

    $('#formNewReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'))

    $('#formNewReceivedInvoice #supplier').change(function(){
        var supplierID = $(this).val()

        switch(supplierID){
            case null:
                $('#formNewReceivedInvoice #shipperSection').addClass('hide')
                $('#formNewReceivedInvoice #nif').val('').attr('disabled', true)
            break
            case '0':
                $('#formNewReceivedInvoice #shipperSection').removeClass('hide')
                $('#formNewReceivedInvoice #nif').val('').attr('disabled', false)
            break
            default:
                $('#formNewReceivedInvoice #shipperSection').addClass('hide')

                $.ajax({
                    url: uri + 'core/expenses/receivedInvoices/functions.php',
                    method: 'POST',
                    data: {
                        type: 'getSupplierNif',
                        ID: supplierID
                    },
                    async: false,
                    success: function(data){
                        data = $.parseJSON(data)

                        $('#formNewReceivedInvoice #nif').val(data).attr('disabled', true)
                    }
                })
            break
        }
    })

    $('#formNewReceivedInvoice #taxBase').change(function(){
        var taxBase = $(this).val() == '' ? 0 : $(this).val()
        var feeHoldIva = $('#formNewReceivedInvoice #feeHoldIva').val() == '' ? 0 : $('#formNewReceivedInvoice #feeHoldIva').val()
        var withholding = $('#formNewReceivedInvoice #withholding').val() == '' ? 0 : $('#formNewReceivedInvoice #withholding').val()
        var supplied = $('#formNewReceivedInvoice #supplied').val() == '' ? 0 : $('#formNewReceivedInvoice #supplied').val()
        var total = parseFloat(taxBase) + (parseFloat(parseFloat(taxBase) * parseFloat(feeHoldIva) / 100)) - (parseFloat(parseFloat(taxBase) * parseFloat(withholding) / 100)) + parseFloat(supplied)
        $('#formNewReceivedInvoice #total').val(total.toFixed(2))
    })

    $('#formNewReceivedInvoice #feeHoldIva').change(function(){
        var feeHoldIva = $(this).val() == '' ? 0 : $(this).val()
        var taxBase = $('#formNewReceivedInvoice #taxBase').val() == '' ? 0 : $('#formNewReceivedInvoice #taxBase').val()
        var withholding = $('#formNewReceivedInvoice #withholding').val() == '' ? 0 : $('#formNewReceivedInvoice #withholding').val()
        var supplied = $('#formNewReceivedInvoice #supplied').val() == '' ? 0 : $('#formNewReceivedInvoice #supplied').val()
        var total = parseFloat(taxBase) + (parseFloat(parseFloat(taxBase) * parseFloat(feeHoldIva) / 100)) - (parseFloat(parseFloat(taxBase) * parseFloat(withholding) / 100)) + parseFloat(supplied)
        $('#formNewReceivedInvoice #total').val(total.toFixed(2))
    })

    $('#formNewReceivedInvoice #withholding').change(function(){
        var withholding = $(this).val() == '' ? 0 : $(this).val()
        var feeHoldIva = $('#formNewReceivedInvoice #feeHoldIva').val() == '' ? 0 : $('#formNewReceivedInvoice #feeHoldIva').val()
        var taxBase = $('#formNewReceivedInvoice #taxBase').val() == '' ? 0 : $('#formNewReceivedInvoice #taxBase').val()
        var supplied = $('#formNewReceivedInvoice #supplied').val() == '' ? 0 : $('#formNewReceivedInvoice #supplied').val()
        var total = parseFloat(taxBase) + (parseFloat(parseFloat(taxBase) * parseFloat(feeHoldIva) / 100)) - (parseFloat(parseFloat(taxBase) * parseFloat(withholding) / 100)) + parseFloat(supplied)
        $('#formNewReceivedInvoice #total').val(total.toFixed(2))
    })

    $('#formNewReceivedInvoice #supplied').change(function(){
        var supplied = $(this).val() == '' ? 0 : $(this).val()
        var feeHoldIva = $('#formNewReceivedInvoice #feeHoldIva').val() == '' ? 0 : $('#formNewReceivedInvoice #feeHoldIva').val()
        var withholding = $('#formNewReceivedInvoice #withholding').val() == '' ? 0 : $('#formNewReceivedInvoice #withholding').val()
        var taxBase = $('#formNewReceivedInvoice #taxBase').val() == '' ? 0 : $('#formNewReceivedInvoice #taxBase').val()
        var total = parseFloat(taxBase) + (parseFloat(parseFloat(taxBase) * parseFloat(feeHoldIva) / 100)) - (parseFloat(parseFloat(taxBase) * parseFloat(withholding) / 100)) + parseFloat(supplied)
        $('#formNewReceivedInvoice #total').val(total.toFixed(2))
    })

    $('#formNewReceivedInvoice #newSupplierInvoice').click(function(){
        $('#modal-new-supplier-invoices').modal('show')
        $('#modal-new-received-invoice').modal('hide')       
    })   
    
    // PROVEEDORES - NUEVO
    $('#modal-new-supplier-invoices #saveNewSupplier').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewSuppInvoices #name'))){
            validate++;
        }
        if(isEmpty($('#formNewSuppInvoices #nif'))){
            validate++;
        }
        if($('#formNewSuppInvoices #nif').val() != ""){ 
            if($('#formNewSuppInvoices #validateCIF').prop('checked')){
                if(!isNifCif($("#formNewSuppInvoices #nif"))){
                    validate++
                }            
            }           
        }
        if($('#formNewSuppInvoices #mail').val() != ""){
            if(!isMail($('#formNewSuppInvoices #mail'))){
                validate++;
            }
        }
        if($('#formNewSuppInvoices #fax').val() != ""){
            if(!isPhone($('#formNewSuppInvoices #fax'))){
                validate++;
            }
        }

        if(validate == 0){
            var nif = $("#formNewSuppInvoices #nif").val();
            var name = $("#formNewSuppInvoices #name").val();
            var address = $("#formNewSuppInvoices #address").val();
            var mail = $("#formNewSuppInvoices #mail").val();
            var description = $("#formNewSuppInvoices #description").val();
            var location = $("#formNewSuppInvoices #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var phones = "";
            $('#formNewSuppInvoices .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#formNewSuppInvoices #fax").val();
            var contactPeople = "";
            $('#formNewSuppInvoices .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var department = $(this).find('.department').text();
                contactPeople += name+"?"+department+"-";
            });
            contactPeople=contactPeople.slice(0,-1);
            var entryDate = $("#formNewSuppInvoices #entryDate").val();        
            if(moment(entryDate,"DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate = "";
            }

            $.post(uri+"core/suppliers/create.php", {nif: nif, name: name, address: address, mail: mail, location: location, description: description, phones: phones, fax: fax, contactPeople: contactPeople, entryDate: entryDate}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El proveedor se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                table.ajax.reload();
            });

            $('#modal-new-supplier-invoices').modal('hide');            
        }else{
            $('#modal-new-supplier-invoices #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-supplier-invoices #warning-message').empty()
            }, 3500)
        }
    });
    
    $('#modal-new-supplier-invoices').on('shown.bs.modal', function (e) {
        $('#formNewSuppInvoices #location').prop('disabled', true)
    })
    $('#modal-new-supplier-invoices').on('hidden.bs.modal', function (e) {
        $('#modal-new-received-invoice').modal('show')          
        $('#formNewSuppInvoices input').val('');
        $('#formNewSuppInvoices textarea').val('');
        $('.phones').html('');
        if(!$('#formNewSuppInvoices .phones').hasClass('in')){
            $('#formNewSuppInvoices .phones').addClass('in');
        }
        $('.contactPeople').html('');
        if(!$('#formNewSuppInvoices .contactPeople').hasClass('in')){
            $('#formNewSuppInvoices .contactPeople').addClass('in');
        }
        $(".province").val('').trigger('change');
        $(".location").attr('disabled', true)
        $(".location").val('').trigger('change');
        clean("formNewSuppInvoices");
        $('#modal-new-supplier-invoices #warning-message').empty()

        $("#modal-new-supplier #validateCIF").prop('checked', true);
    });

    var flagGenInvoice = true
    $('#genInvoice').click(function(){
        $("#deliveryLines").empty();
        if($('#modal-new-received-invoice #supplier').find("option[value='" + $('#supplierID').val() + "']").length){
            $('#modal-new-received-invoice #supplier').val($('#supplierID').val()).trigger('change')
        }else{ 
            var newOption = new Option($('#supplierName').val(), $('#supplierID').val(), true, true)
            $('#modal-new-received-invoice #supplier').append(newOption).trigger('change')
        }
        
        var price
        var total
        $.ajax({
            url: uri + 'core/warehouse/deliveryNotes/functions.php',
            method: 'POST',
            data: {
                type: 'getDataInvoiceDelivery',
                id: $('#deliveryNoteID').val()
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                  
                    if($("#gasoilID").val() == '' || $("#gasoilID").val() == undefined || $("#gasoilID").val() == null){
                        price = 0 ,total = 0
                        var amount = 0
                        var baseImponible = 0;
                        var iva = 0;
                        $.each(data, function(index, elem){
                            amount = amount + parseInt(elem.amount)
                            
                            if(parseFloat(elem.iva) > iva){
                                iva = parseFloat(elem.iva);
                            }
                            
                            baseImponibleProduct = ((parseFloat(elem.price) - (parseFloat(elem.price) * parseFloat(elem.discount)/100)) * parseInt(elem.amount))
                            baseImponible = baseImponible + baseImponibleProduct;
                            total += parseFloat(baseImponibleProduct + ( baseImponibleProduct  * parseFloat(elem.iva)/100)) 

                            items[index] = {"productID" : elem.productID,
                                            "modelID" : elem.modelID,
                                            "amount" : elem.amount,
                                            "price" :  elem.price,
                                            "iva" :  elem.iva,
                                            "discount" : elem.discount
                            };

                            if(elem.discount == '0'){
                                elem.discount = '-'
                            }else{
                                elem.discount = parseFloat(elem.discount).toFixed(2) + ' %'
                            }

                            $("#deliveryLines").append('<tr>' +
                                                    '<td class="text-center">' + (index + 1) + '</td>' + 
                                                    '<td class="text-center">' + elem.product + '</td>' + 
                                                    '<td class="text-center">' + elem.model + '</td>' +
                                                    '<td class="text-center">' + elem.price + ' €</td>' +
                                                    '<td class="text-center">' + elem.amount + '</td>' +
                                                    '<td class="text-center">' + baseImponibleProduct.toFixed(2) + ' €</td>' +
                                                    '<td class="text-center">' + elem.discount + '</td>' +
                                                    '<td class="text-center">' + elem.iva + ' %</td>' +
                                                    '<td class="text-center">' + parseFloat((baseImponibleProduct + ( baseImponibleProduct  * parseFloat(elem.iva)/100))).toFixed(2) + ' €</td>');
                        })

                        $("#deliveryLines").append( '<tr>' +
                                                    '<td class="text-center"><strong>TOTAL</strong></td>' + 
                                                    '<td class="text-center"><strong>-</strong></td>' + 
                                                    '<td class="text-center"><strong>-</strong></td>' +
                                                    '<td class="text-center"><strong>-</strong></td>' +
                                                    '<td class="text-center"><strong>' + amount + '</strong></td>' +
                                                    '<td class="text-center"><strong>' + baseImponible.toFixed(2) + ' €</strong></td>' +
                                                    '<td class="text-center"><strong>-</strong></td>' +
                                                    '<td class="text-center"><strong>' + parseFloat(iva) + ' %</strong></td>' +
                                                    '<td class="text-center"><strong>' + total.toFixed(2) + ' €</strong></td>');

                        
                        if(amount == 0){
                            flagGenInvoice = false
                        }else{
                            flagGenInvoice = true
                        }

                        $('#modal-new-received-invoice #taxBase').val(price)
                        $('#modal-new-received-invoice #totalDeliveryNote').val(total.toFixed(2) + " €")
                        $('#formNewReceivedInvoice #totalDeliveryNote').attr("disabled", true)

                    }else{

                        $.ajax({
                            url: uri + "core/warehouse/deliveryNotes/listInvoices.php?deliveryNote=" + $('#deliveryNoteID').val(),
                            method: 'POST',
                            data: {
                                type: 'getDataInvoiceDelivery',
                                id: $('#deliveryNoteID').val()
                            },
                            async: false,
                            success: function(data){
                                data = $.parseJSON(data);
                                if(data.data.length > 0){
                                    flagGenInvoice = false;
                                }
                            }
                        })

                        $("#deliveryLinesTable").empty();
                        $("#deliveryLines").append(
                            ' <tr>' +
                                '<th class="text-center">Litros Pedidos</th>' +
                                '<th class="text-center">Litros Recibidos</th>' +
                                '<th class="text-center">Precio/Litro</th>' +
                                '<th class="text-center">Base Imponible</th>' +
                                '<th class="text-center">Cuota ' + getIvaLabel() + '</th>' +
                                '<th class="text-center">Total</th>' +
                            '</tr>');

                        $("#deliveryLines").append(
                            '<tr>' +  
                                '<td class="text-center">' + data.litersRequest + ' l</td>' + 
                                '<td class="text-center">' + data.litresReceived + ' l</td>' +
                                '<td class="text-center">' + data.priceLiter + ' €</td>' +
                                '<td id="deliveryNet" class="text-center">' + data.neto + ' €</td>' +
                                '<td id="deliveryIVA" class="text-center">' + data.ivaName + '</td>' +
                                '<td class="text-center">' + data.total + ' €</td>' +
                            '</tr>');

                        items = {
                            "litresReceived" : data.litresReceived,
                            "priceLiter" :  data.priceLiter,
                            "net" : data.neto,
                            "iva" :  data.iva,
                            "total" :  data.total,
                        };
                        
                        $('#formNewReceivedInvoice #totalDeliveryNote').val(data.total + " €");
                        $('#formNewReceivedInvoice #totalDeliveryNote').attr("disabled", true)
                    }
                }catch(e){
                    price = 0
                    total = 0
                    flagGenInvoice = false
                }
            },

            error: function(){
                price = 0
                total = 0
                flagGenInvoice = false
            }
        })

        // Carga las cuentas bancarias
        $('#modal-new-received-invoice #bankAccount').select2({
            containerCssClass: 'select2-bankAccount',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/expenses/configuration/dataBank.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.owner,
                                id: item.ID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatData,
            templateSelection: formatData
        });

        // Carga las tarjetas de crédito
        $('#modal-new-received-invoice #creditCard').select2({
            containerCssClass: 'select2-bankAccount',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/expenses/configuration/dataCard.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.owner,
                                id: item.ID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatData,
            templateSelection: formatData
        });

       
        if(flagGenInvoice){
            $('#modal-new-received-invoice').modal('show')
        }else{
            $('#invoice-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se pueden generar más facturas para este albarán por el momento porque no se han recibido más productos o porque ya se han recibidos todos.</div>')    

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    $('#modal-new-received-invoice #paymentMethod').change(function(){
        var paymentMethod = $(this).val()

        switch(paymentMethod){
            case '3':
                $('#modal-new-received-invoice #creditCards').addClass('hide');
                $('#modal-new-received-invoice #creditCard').val('').trigger('change')
                $('#modal-new-received-invoice #bankAccounts').removeClass('hide');
                $('#modal-new-received-invoice #bankAccounts').addClass('show');
            break
            case '4':
                $('#modal-new-received-invoice #creditCards').removeClass('hide');
                $('#modal-new-received-invoice #bankAccounts').addClass('hide');
                $('#modal-new-received-invoice #bankAccount').val('').trigger('change')
            break
            default:
                $('#modal-new-received-invoice #bankAccounts').addClass('hide');
                $('#modal-new-received-invoice #bankAccount').val('').trigger('change')
                $('#modal-new-received-invoice #creditCards').addClass('hide');
                $('#modal-new-received-invoice #creditCard').val('').trigger('change')
            break
        }
    })

    $('#saveNewReceivedInvoice').click(function(){
        var validate = 0

        if(isEmpty($('#formNewReceivedInvoice #invoiceNumber'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #date'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #supplier'))){
            $('.select2-' + $('#supplier').attr('id')).addClass('validateError')
            $('.select2-' + $('#supplier').attr('class')).addClass('validateError')
            
            validate++;
        }else if($('#formNewReceivedInvoice #supplier').val() == 0){
            if(isEmpty($('#formNewReceivedInvoice #shipper'))){
                validate++
            }
        }else{
            $('.select2-' + $('#supplier').attr('id')).removeClass('validateError')
            $('.select2-' + $('#supplier').attr('class')).removeClass('validateError')
        }
        if(isEmpty($('#formNewReceivedInvoice #taxBase'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #feeHoldIva'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #withholding'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #supplied'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #totalDeliveryNote'))){
            validate++;
        }
        switch($('#formNewReceivedInvoice #paymentMethod').val()){
            case '3':
                if(isEmpty($('#formNewReceivedInvoice #bankAccount'))){
                    $('.select2-' + $('#formNewReceivedInvoice #bankAccount').attr('id')).addClass('validateError')
                    $('.select2-' + $('#formNewReceivedInvoice #bankAccount').attr('class')).addClass('validateError')
                    
                    validate++;
                }else{
                    $('.select2-' + $('#formNewReceivedInvoice #bankAccount').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#formNewReceivedInvoice #bankAccount').attr('class')).removeClass('validateError')
                }
            break
            case '4':
                if(isEmpty($('#formNewReceivedInvoice #creditCard'))){
                    $('.select2-' + $('#formNewReceivedInvoice #creditCard').attr('id')).addClass('validateError')
                    $('.select2-' + $('#formNewReceivedInvoice #creditCard').attr('class')).addClass('validateError')
                    
                    validate++;
                }else{
                    $('.select2-' + $('#formNewReceivedInvoice #creditCard').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#formNewReceivedInvoice #creditCard').attr('class')).removeClass('validateError')
                }
            break
        }
        if(isEmpty($('#formNewReceivedInvoice #costCenter'))){
            $('.select2-' + $('#formNewReceivedInvoice #costCenter').attr('id')).addClass('validateError')
            $('.select2-' + $('#formNewReceivedInvoice #costCenter').attr('class')).addClass('validateError')
            validate++;
        }else{
            $('.select2-' + $('#formNewReceivedInvoice #costCenter').attr('id')).removeClass('validateError')
            $('.select2-' + $('#formNewReceivedInvoice #costCenter').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var bankAccount = $('#formNewReceivedInvoice #bankAccount').val()
            var creditCard = $('#formNewReceivedInvoice #creditCard').val()
            var expenseFixed = $('#formNewReceivedInvoice #expenseFixed').val()
            var expenseVariable = $('#formNewReceivedInvoice #expenseVariable').val()
            var costCenter = $('#formNewReceivedInvoice #costCenter').val()
            var supplier = $('#formNewReceivedInvoice #supplier').val()
            var date = moment($('#formNewReceivedInvoice #date').val(), 'DD/MM/YYYY').format('X')
            var dueDate = $('#formNewReceivedInvoice #dueDate').val() == '' ? 'null' : moment($('#formNewReceivedInvoice #dueDate').val(), 'DD/MM/YYYY').format('X')
            var dueDate2 = $('#formNewReceivedInvoice #dueDate2').val() == '' ? 'null' : moment($('#formNewReceivedInvoice #dueDate2').val(), 'DD/MM/YYYY').format('X')
            var dueDate3 = $('#formNewReceivedInvoice #dueDate3').val() == '' ? 'null' : moment($('#formNewReceivedInvoice #dueDate3').val(), 'DD/MM/YYYY').format('X')
            var paymentDate = $('#formNewReceivedInvoice #paymentDate').val() == '' ? null : moment($('#formNewReceivedInvoice #paymentDate').val(), 'DD/MM/YYYY').format('X')
            var paymentDueDate = $('#formNewReceivedInvoice #paymentDueDate').val()
            var paymentDueDate2 = $('#formNewReceivedInvoice #paymentDueDate2').val()
            var paymentDueDate3 = $('#formNewReceivedInvoice #paymentDueDate3').val()
            var shipper = $('#formNewReceivedInvoice #shipper').val()
            var nif = $('#formNewReceivedInvoice #nif').val()
           
            if($("#gasoilID").val() == '' || $("#gasoilID").val() == undefined || $("#gasoilID").val() == null){
                var taxBase = $('#formNewReceivedInvoice #taxBase').val()
                var feeHoldIva = $('#formNewReceivedInvoice #feeHoldIva').val()
            }else{
                var taxBase =  $('#formNewReceivedInvoice #deliveryNet').text().replace("€","")
                var feeHoldIva =  $('#formNewReceivedInvoice #deliveryIVA').text().replace("%", "")
            }

            var withholding = $('#formNewReceivedInvoice #withholding').val()
            var supplied = $('#formNewReceivedInvoice #supplied').val()
            var total = $('#formNewReceivedInvoice #totalDeliveryNote').val().replace("€","");
            var paymentMethod = $('#formNewReceivedInvoice #paymentMethod').val()
            var expenseType = $('#formNewReceivedInvoice #expenseType').val()
            var cashOut = $('#formNewReceivedInvoice #cashOut').val()
            var concept = $('#formNewReceivedInvoice #concept').val()
            var comments = $('#formNewReceivedInvoice #comments').val()
            var regularity = $('#formNewReceivedInvoice #regularity').val()
            var invoiceNumber = $('#formNewReceivedInvoice #invoiceNumber').val()

            $.ajax({
                url: uri + 'core/expenses/receivedInvoices/create.php',
                method: 'POST',
                data: {
                    bankAccount: bankAccount,
                    creditCard: creditCard,
                    expenseFixed: expenseFixed,
                    expenseVariable: expenseVariable,
                    costCenter: costCenter,
                    supplier: supplier,
                    date: date,
                    dueDate: dueDate,
                    dueDate2: dueDate2,
                    dueDate3: dueDate3,
                    paymentDueDate : paymentDueDate,
                    paymentDueDate2 : paymentDueDate2,
                    paymentDueDate3 : paymentDueDate3,
                    paymentDate: paymentDate,
                    shipper: shipper,
                    nif: nif,
                    taxBase: taxBase,
                    withholding: withholding,
                    feeHoldIva: feeHoldIva,
                    supplied: supplied,
                    total: total,
                    paymentMethod: paymentMethod,
                    expenseType: expenseType,
                    cashOut: cashOut,
                    concept: concept,
                    comments: comments,
                    regularity: regularity,
                    invoiceNumber: invoiceNumber,
                    deliveryNote: $('#deliveryNoteID').val(),
                    items : items
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creada con éxito.</div>')

                        $.ajax({
                            url: uri + 'core/warehouse/deliveryNotes/functions.php',
                            method: 'POST',
                            data: {
                                type: 'updateHasInvoice',
                                deliveryNote: $('#deliveryNoteID').val()
                            },
                            async: false
                        })

                        table.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    $('#modal-new-received-invoice').modal('hide')
                    $('#formNewReceivedInvoice input').val('');
                    $('#formNewReceivedInvoice #taxBase').val(0);
                    $('#formNewReceivedInvoice #feeHoldIva').val(0);
                    $('#formNewReceivedInvoice #withholding').val(0);
                    $('#formNewReceivedInvoice #supplied').val(0);
                    $('#formNewReceivedInvoice #totalDeliveryNote').val(0);
                    $('#formNewReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'));
                    $('#formNewReceivedInvoice textarea').val('');
                    $("#formNewReceivedInvoice #bankAccount").val('').trigger('change');
                    $("#formNewReceivedInvoice #creditCard").val('').trigger('change');
                    $("#formNewReceivedInvoice #supplier").val('').trigger('change');
                    $("#formNewReceivedInvoice #cashOut").val(0).trigger('change');
                    $("#formNewReceivedInvoice #costCenter").val(0).trigger('change');
                    $("#formNewReceivedInvoice #regularity").val(0).trigger('change');
                    $("#formNewReceivedInvoice #expenseType").val(0).trigger('change');
                    $("#formNewReceivedInvoice #expenseCostCenter").val('').trigger('change');
                    $("#formNewReceivedInvoice #expenseFixed").val('').trigger('change');
                    $("#formNewReceivedInvoice #expenseVariable").val('').trigger('change');
                    $('#formNewReceivedInvoice #bankAccounts').removeClass('show');
                    $('#formNewReceivedInvoice #bankAccounts').addClass('hide');
                    $('#formNewReceivedInvoice #creditCards').removeClass('show');
                    $('#formNewReceivedInvoice #creditCards').addClass('hide');
                    $('#formNewReceivedInvoice #expenses').removeClass('show');
                    $('#formNewReceivedInvoice #expenses').addClass('hide');
                    $('#formNewReceivedInvoice #expensesCostCenter').removeClass('show');
                    $('#formNewReceivedInvoice #expensesCostCenter').addClass('hide');
                    $('#formNewReceivedInvoice #expensesFixed').removeClass('show');
                    $('#formNewReceivedInvoice #expensesFixed').addClass('hide');
                    $('#formNewReceivedInvoice #expensesVariable').removeClass('show');
                    $('#formNewReceivedInvoice #expensesVariable').addClass('hide');
                    clean("formNewReceivedInvoice");
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })

    // ALBARÁN - LISTADO DE FACTURAS ASOCIADAS
    var table = $('#invoices').DataTable({
        "ajax": uri + "core/warehouse/deliveryNotes/listInvoices.php?deliveryNote=" + $('#deliveryNoteID').val(),
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nº de factura"},
            {"title": "Fecha"},
            {"title": "NIF"},
            {"title": "Expedidor"},
            {"title": "Base Imp. 21%"},
            {"title": "Base Imp. 10%"},
            {"title": "Base Imp. 7%"},
            {"title": "Retención"},
            {"title": "Suplido"},
            {"title": "Total"},
            {"title": getIvaLabel() + " 1"},
            {"title": getIvaLabel() + " 2"},
            {"title": getIvaLabel() + " 3"},
            {"title": "Pagada"}
        ],        
        "columnDefs": [{
            "className" : "id",
            "targets" : [0,11,12,13],
            "searchable" : false,
            "visible" : false
        },
        {
            "className": "centered",
            "targets": [1,3,9]
        },
        {
            "targets": [5,6,7,10],
            "className": "centered",
            "render" : function(data){
                if(data != null){
                    return toFormatNumber(parseFloat(data).toFixed(2)) + " €";
                } else{
                    return "-"
                } 
            }
        },
        {
            "targets": [4],
            "render" : function(data){
                return data;
            }
        },
        {
            "targets": [8],
            "render" : function(data){
                if(data != null){
                    return data + " %";
                }else{
                    return "-"
                }
            }
        },
        {
            "className": "centered date",
            "targets": [2],
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "details-control centered",
            "targets": 14,
            "render" : function(data, type, row){             
                if (data != null){
                    pagos_actuales = parseFloat(data)
                }else{
                    pagos_actuales = null;
                }                        
          
                if(pagos_actuales == null || pagos_actuales == 0 || pagos_actuales == "0"){
                    return "<strong>NO</strong>";
                }else if (pagos_actuales >= parseFloat(row[14])){    
                    return "<strong>SI</strong>";                    
                }else{                        
                    return "<strong>Pago Parcial</strong>";                        
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "order": [[0, 'desc']]
    })
})