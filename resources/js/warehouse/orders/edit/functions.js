var order;

var fromBackButton = false;;

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
    var data = '<div id="'+data.id+'">'+data.text+'</div>'
    return data
}

/**
 * Comprueba si el pedido existe
 * 
 * @param {int} expedient Id del pedido
 * @return bool
 */
function existsOrder(order){
    var check

    $.ajax({
        url: uri + 'core/warehouse/orders/functions.php',
        method: 'POST',
        data: {
            type: 'existsOrder',
            order: order
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLinkToOrder" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver al expediente</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveEditOrder" name="saveEditOrder" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveConformity" name="saveConformity" class="btn btn-primary hide"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar conformidad</button>');
    
    changeSpaceFooter();

    $('#cancelLink').click(function(){
        if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
            if(order.tpv == '1'){
                window.location.href = uri + 'expediente/cservicio-tpv/' + order.expedient;
            }else if(order.tpv == '0'){
                window.location.href = uri + 'expediente/cservicio/' + order.expedient;
            }
        }else if(document.referrer.match(/almacen\/pedidos\/acciones-correctivas/)){
            window.location.href = uri + 'almacen/pedidos/acciones-correctivas';
        }else{
            window.location.href = uri + 'almacen/pedidos';
        }
    });

    $('#backLink').click(function(){
        fromBackButton = true;
        $('#saveEditOrder').click();

        if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
            if(order.tpv == '1'){
                window.location.href = uri + 'expediente/cservicio-tpv/' + order.expedient;
            }else if(order.tpv == '0'){
                window.location.href = uri + 'expediente/cservicio/' + order.expedient;
            }
        }else if(document.referrer.match(/almacen\/pedidos\/acciones-correctivas/)){
            window.location.href = uri + 'almacen/pedidos/acciones-correctivas';
        }else{
            window.location.href = uri + 'almacen/pedidos';
        }
    });

    if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
        $('#backLink').addClass('hide')
        $('#backLinkToOrder').removeClass('hide')

        // Config sidebar
        $("#sidebarAlmacen").removeClass('active');
        $("#sidebarAlmacenPedidos").removeClass('active');
        $("#sidebarExpedientes").addClass('active')

        // Opciones del pedido
        $('#type').attr('disabled', true)
        $('#expedient').attr('disabled', true)
        $('#date').attr('disabled', true)
        $('#orderLine').remove()
        $('#configSection').remove()

        $('#backLinkToOrder').click(function(){
            window.close()
        })
    }else{
        $('#backLinkToOrder').remove()
    }

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

    // LISTADO DE EXPEDIENTES
    $('#expedient').select2({
        containerCssClass: 'select2-expedient',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expedients/expedient/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.number,
                            id: item.expedientID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData,
    })

    $('#type').change(function(){
        if($(this).val() == 0){
            $('#expedientSection').removeClass('hide')
        }else{
            $('#expedientSection').addClass('hide')
            $('#expedient1').val('').trigger('change')
        }
    })

    // LISTADO DE PROVEEDORES
    $('#formEditOrder #supplier').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/suppliers/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
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
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData,
    })

    // LISTADO DE EMAILS
    $('#sendTo').select2({
        containerCssClass: 'select2-sendTo',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/emails/data.php',
            dataType: 'json',
            delay: 250,
            async: false,
            data: function (params) {
                return {
                    q: params.term || "",
                    page: params.page
                }
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
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData,
    })

    $('#deliveryPlace').change(function(){
        if($(this).val() == "4" || $(this).val() == "23"){
            $('#deliveryPlaceOtherSection').removeClass('hide')
        }else{
            $('#deliveryPlaceOtherSection').addClass('hide')
        }

        if(order.expedient != null && order.expedient != ''){
            if($(this).val() == "4" || $(this).val() == "23"){
                $('#deliveryPlaceOtherSection').removeClass('hide')
            }else{
                $('#deliveryPlaceOtherSection').addClass('hide')
            }
        }
        
    })

    var orderID = $('#orderID').val()    
    if(existsOrder(orderID)){
        $('#existsOrder').remove()
    }else{       
        $('#existsOrder').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'almacen/pedidos'
        }, 2500);
        return
    }
    var supplier = null
    var belowsExpedient;
    
    // PEDIDOS - DATOS
    $.ajax({
        url: uri + 'core/warehouse/orders/read.php',
        method: 'POST',
        data: {
            ID: orderID
        },
        async: false,
        success: function(data){
            data = $.parseJSON(data);

            if(data == null){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            }else{
                order = data[0];
                belowsExpedient = order.expedient == null ? false : true;
                
                $('#type').val(parseInt(order.type));
                if(parseInt(order.type) == 1){
                    $('#expedientSection').addClass('hide');
                }
                
                if(order.expedient != null){
                    if($('#expedient').find("option[value='" + order.expedient + "']").length){
                        $('#expedient').val(order.expedient).trigger('change')
                    }else{ 
                        var newOption = new Option(order.expedientNumber, order.expedient, true, true)
                        $('#expedient').append(newOption).trigger('change')
                    }
                    $('#type').attr('disabled', true)
                    $('#expedient').attr('disabled', true)
                    $('#date').attr('disabled', true)
                    $('#orderLine').remove()
                    $('#configSection').remove()
                }

                $('#formEditOrder #date').val(moment(order.date, 'X').format('DD/MM/YYYY'))
                supplier = order.supplierID
      
                if($('#formEditOrder #supplier').find("option[value='" + order.supplierID + "']").length){
                    $('#formEditOrder #supplier').val(order.supplierID).trigger('change')
                }else{ 
                    var newOption = new Option(order.supplierName, order.supplierID, true, true)
                    $('#formEditOrder #supplier').append(newOption).trigger('change')
                }

                $('#phones').val(order.supplierPhones)
                $('#email').val(order.supplierEmail)
                if(supplier == 127){
                    $('#supplierSection').hide()
                    $('#freeOrder').hide()
                }

                if(order.inAgreement == null){
                    $('#inAgreement').val('null')
                }else{
                    $('#inAgreement').val(order.inAgreement)
                }
                $('#nonApproval').val(order.nonApproval)
                $('#correctiveAction').val(order.correctiveAction)
                if(order.inAgreement != 0 && order.inAgreement != 2){
                    $('#failActions').addClass('hide')
                }

                $('#inAgreement').change(function(){
                    if($(this).val() == 0 || $(this).val() == 2){
                        $('#failActions').removeClass('hide')
                    }else{
                        $('#failActions').addClass('hide')
                    }
                })
                
                if(order.gasoil == '' || order.gasoil == null){
                    if(order.expedient != null){
                        if(order.deliveryPlace == null && order.deceasedMortuary == null){
                            if($('#deliveryPlace').find("option[value='0']").length){
                                $('#deliveryPlace').val(0).trigger('change')
                            }else{ 
                                var newOption = new Option('Otro', 0, true, true)
                                $('#deliveryPlace').append(newOption).trigger('change')
                            }
                        }else{
                            if(order.deliveryPlace != null){
                                if($('#deliveryPlace').find("option[value='" + order.deliveryPlace + "']").length){
                                    $('#deliveryPlace').val(order.deliveryPlace).trigger('change')
                                }else{ 
                                    var newOption = new Option(order.deliveryPlaceName, order.deliveryPlace, true, true)
                                    $('#deliveryPlace').append(newOption).trigger('change')
                                }
                            }else{
                                if($('#deliveryPlace').find("option[value='" + order.deceasedMortuary + "']").length){
                                    $('#deliveryPlace').val(order.deceasedMortuary).trigger('change')
                                }else{ 
                                    var newOption = new Option(order.mortuaryName, order.deceasedMortuary, true, true)
                                    $('#deliveryPlace').append(newOption).trigger('change')
                                }
                            }
                        }
                    }else{
                        if(order.deliveryPlace == null){
                            if($('#deliveryPlace').find("option[value='0']").length){
                                $('#deliveryPlace').val(0).trigger('change')
                            }else{ 
                                var newOption = new Option('Otro', 0, true, true)
                                $('#deliveryPlace').append(newOption).trigger('change')
                            }
                            $('#deliveryPlaceOther').val(order.otherDeliveryPlace)
                            $('#deliveryPlaceOtherSection').removeClass('hide')
                        }else{
                            if($('#deliveryPlace').find("option[value='" + order.deliveryPlace + "']").length){
                                $('#deliveryPlace').val(order.deliveryPlace).trigger('change')
                            }else{ 
                                var newOption = new Option(order.deliveryPlaceName, order.deliveryPlace, true, true)
                                $('#deliveryPlace').append(newOption).trigger('change')
                            }
                        }
                    }

                    if($('#deliveryPlace').text() == 'Otro'){
                        $('#deliveryPlaceOther').val(order.otherDeliveryPlace)
                        $('#deliveryPlaceOtherSection').removeClass('hide')
                    }
        
                    if(order.deliveryDate != null){
                        $('#deliveryDate').val(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                    }

                    if(order.sendTo != null){
                        if($('#sendTo').find("option[value='" + order.sendTo + "']").length){
                            $('#sendTo').val(order.sendTo).trigger('change')
                        }else{ 
                            var newOption = new Option(order.sendToEmail, order.sendTo, true, true)
                            $('#sendTo').append(newOption).trigger('change')
                        }
                    }
                    $('#sendCopy').val(order.sendCopy)
                    $('#notes').val(order.notes)
                   
                    if(order.sentEmail == 1){
                        $('#saveSendEmailOrder').html('Correo enviado');
                        $('#saveSendEmailOrder').removeClass('btn-danger');
                        $('#saveSendEmailOrder').addClass('btn-success');
                    }

                    if(order.expedient != null){
                        $('#deceasedRoomSection').removeClass('hide')
                        $('#deceasedRoom').val(order.deceasedRoom == null || order.deceasedRoom == 'null' ? '' : order.deceasedRoom);
                    }

                    var lines = data[1]
                    
                    if(lines != null){
                        $.each(lines, function(index, elem){
                            var id = elem.ID
                            var product = elem.productID
                            var productName = elem.productName
                            var supplierReference = elem.supplierReference == null ? '' : elem.supplierReference
                            var model = elem.model
                            var modelName = elem.modelName
                            var amount = elem.amount
                            var price = elem.price
                            var lastAmount = elem.lastPurchaseAmount
                            var lastPrice = elem.lastPurchasePrice
                            var lastPurchaseDate = elem.lastPurchaseDate
                            if(lastAmount == '' || lastAmount == null){
                                lastAmount = '-'
                            }
                
                            if(lastPrice == '' || lastPrice == null){
                                lastPrice = '-'
                            }else{
                                lastPrice = lastPrice.replace('.', ',')
                                lastPrice += " €"
                            }
                
                            if(lastPurchaseDate == '' || lastPurchaseDate == null){
                                lastPurchaseDate = '-'
                            }else{
                                lastPurchaseDate = moment(elem.lastPurchaseDate, 'X').format('DD/MM/YYYY')
                            }

                            $('#orderLineTable').empty();

                            if(order.expedient != null){
                                if(elem.texts.length > 0){
                                    $('#orderLineTable').append(
                                        '<th width="5%" class="index hide">index</th> '+
                                        ' <th width="5%" class="id hide">ID</th> '+
                                        ' <th width="15%" class="centered">Producto</th> '+
                                        ' <th width="15%" class="centered">Modelo</th> '+
                                        ' <th width="20%" class="centered">Textos</th> '+
                                        ' <th width="15%" class="centered">Referencia proveedor</th> '+
                                        ' <th width="5%" class="centered">Cantidad</th> '+
                                        ' <th width="5%" class="centered">Precio</th> '+
                                        ' <th class="text-center" width="5%" class="centered">Cantidad último pedido</th> '+
                                        ' <th class="text-center" width="5%" >Precio último pedido</th> '+
                                        ' <th class="text-center" width="5%">Fecha último pedido</th> ');
                                    
                                    var texts = "";
                                    $.each(elem.texts, function(index, value){
                                        texts += '<p>'+value.value+'</p>'
                                    })

                                    $('#lines').append( 
                                        '   <tr class="line">' +
                                        '       <td class="index hide" width="5%">' + index + '</td>' +
                                        '       <td class="id hide" width="5%">' + id + '</td>' +
                                        '       <td width="15%">' +
                                        '          <select class="form-control" id="product' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="15%">' +
                                        '          <select class="form-control" id="model' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="20%">' +
                                                    texts         +
                                        '       </td>' +
                                        '       <td width="15%">' +
                                        '          <input type="text" size="40" class="form-control" id="supplierReference' + index + '" value="' + supplierReference + '" disabled>' +
                                        '       </td>' +
                                        '       <td width="5%">' +
                                        '          <input type="number" size="10" min="1" class="form-control" id="amount' + index + '" value="' + amount + '">' +
                                        '       </td>' +
                                        '       <td width="5%">' +
                                        '          <input type="number" size="10" min="1" class="form-control" id="price' + index + '" value="' + price + '">' +
                                        '       </td>' +
                                        '       <td width="5%" align="center">' +
                                        '           <p style="margin-bottom:0" id="lastAmount' + index + '">' + lastAmount + '</p>' +
                                        '       </td>' +
                                        '       <td width="5%" align="center">' +
                                        '           <p style="margin-bottom:0" id="lastPrice' + index + '">' + lastPrice + '</p>' +
                                        '       </td>' +
                                        '       <td width="5%" align="center">' +
                                        '           <p style="margin-bottom:0" id="lastPurchaseDate' + index + '">' + lastPurchaseDate + '</p>' +
                                        '       </td>' +
                                        '   </tr>')
                                }else{
                                    $('#orderLineTable').append(
                                        '<th width="5%" class="index hide">index</th> '+
                                        ' <th width="5%" class="id hide">ID</th> '+
                                        ' <th width="15%">Producto</th> '+
                                        ' <th width="15%">Modelo</th> '+
                                        ' <th width="10%">Referencia proveedor</th> '+
                                        ' <th width="10%">Cantidad</th> '+
                                        ' <th width="10%">Precio</th> '+
                                        ' <th class="text-center" width="10%">Cantidad último pedido</th> '+
                                        ' <th class="text-center" width="10%">Precio último pedido</th> '+
                                        ' <th class="text-center" width="10%">Fecha último pedido</th>');

                                    $('#lines').append( 
                                        '   <tr class="line">' +
                                        '       <td class="index hide" width="5%">' + index + '</td>' +
                                        '       <td class="id hide" width="5%">' + id + '</td>' +
                                        '       <td width="15%">' +
                                        '          <select class="form-control" id="product' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="15%">' +
                                        '          <select class="form-control" id="model' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '          <input type="text" class="form-control" id="supplierReference' + index + '" value="' + supplierReference + '" disabled>' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '          <input type="number" min="1" class="form-control" id="amount' + index + '" value="' + amount + '">' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '          <input type="number" min="1" class="form-control" id="price' + index + '" value="' + price + '">' +
                                        '       </td>' +
                                        '       <td width="10%" align="center">' +
                                        '           <p style="margin-bottom:0;" id="lastAmount' + index + '">' + lastAmount + '</p>' +
                                        '       </td>' +
                                        '       <td width="10%" align="center">' +
                                        '           <p style="margin-bottom:0;" id="lastPrice' + index + '">' + lastPrice + '</p>' +
                                        '       </td>' +
                                        '       <td width="10%" align="center">' +
                                        '           <p style="margin-bottom:0;" id="lastPurchaseDate' + index + '">' + lastPurchaseDate + '</p>' +
                                        '       </td>' +
                                        '   </tr>')
                                }

                            }else{
                                $('#orderLineTable').append(
                                    '<th width="5%" class="index hide">index</th> '+
                                    ' <th width="5%" class="id hide">ID</th> '+
                                    ' <th width="15%">Producto</th> '+
                                    ' <th width="15%">Modelo</th> '+
                                    ' <th width="10%">Referencia proveedor</th> '+
                                    ' <th width="10%">Cantidad</th> '+
                                    ' <th width="10%">Precio</th> '+
                                    ' <th class="text-center" width="10%">Cantidad último pedido</th> '+
                                    ' <th class="text-center" width="10%">Precio último pedido</th> '+
                                    ' <th class="text-center" width="10%">Fecha último pedido</th> '+
                                    ' <th width="5%" class="headDelete text-center">Eliminar</th>');

                                    $('#lines').append( 
                                        '   <tr class="line">' +
                                        '       <td class="index hide" width="5%">' + index + '</td>' +
                                        '       <td class="id hide" width="5%">' + id + '</td>' +
                                        '       <td width="15%">' +
                                        '          <select class="form-control" id="product' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="15%">' +
                                        '          <select class="form-control" id="model' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '          <input type="text" class="form-control" id="supplierReference' + index + '" value="' + supplierReference + '" disabled>' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '          <input type="number" min="1" class="form-control" id="amount' + index + '" value="' + amount + '">' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '          <input type="number" min="1" class="form-control" id="price' + index + '" value="' + price + '">' +
                                        '       </td>' +
                                        '       <td width="10%" align="center">' +
                                        '           <p style="margin-bottom:0; id="lastAmount' + index + '">' + lastAmount + '</p>' +
                                        '       </td>' +
                                        '       <td width="10%" align="center">' +
                                        '           <p style="margin-bottom:0; id="lastPrice' + index + '">' + lastPrice + '</p>' +
                                        '       </td>' +
                                        '       <td width="10%" align="center">' +
                                        '           <p style="margin-bottom:0; id="lastPurchaseDate' + index + '">' + lastPurchaseDate + '</p>' +
                                        '       </td>' +
                                        '       <td width="5%" align="center" class="headDelete"><ul class="actions-menu"><li><a class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>' +
                                        '   </tr>')
                            }

                            if($('#product' + index).find("option[value='" + product + "']").length){
                                $('#product' + index).val(product).trigger('change')
                            }else{ 
                                var newOption = new Option(productName, product, true, true)
                                $('#product' + index).append(newOption).trigger('change')
                            }
                
                            if($('#model' + index).find("option[value='" + model + "']").length){
                                $('#model' + index).val(model).trigger('change')
                            }else{ 
                                var newOption = new Option(modelName, model, true, true)
                                $('#model' + index).append(newOption).trigger('change')
                            }

                            // LISTADO DE PRODUCTOS
                            $('#product' + index).select2({
                                containerCssClass: 'select2-product' + index,
                                language: langSelect2,
                                minimumResultsForSearch: Infinity,
                                placeholder: '--',
                                ajax: {
                                    url: uri + 'core/warehouse/orders/lines/dataProducts.php?supplier=' + supplier,
                                    dataType: 'json',
                                    delay: 250,
                                    data: function (params) {
                                        return {
                                            q: params.term || "",
                                            page_limit: limit_page,
                                            page: params.page
                                        }
                                    },
                                    processResults: function (data, params) {
                                        return {
                                            results: $.map(data.items, function (item) {
                                                return {
                                                    text: item.name,
                                                    id: item.productID
                                                }
                                            }),
                                            pagination: {
                                                more: false
                                            }
                                        }
                                    },
                                    cache: true
                                },
                                escapeMarkup: function (markup) { return markup },
                                templateResult: formatData,
                                templateSelection: formatData
                            })

                            // LISTADO DE MODELOS DADO EL PRODUCTO
                            $('#model' + index).select2({
                                containerCssClass: 'select2-model' + index,
                                language: langSelect2,
                                placeholder: '--',
                                minimumResultsForSearch: Infinity,
                                ajax: {
                                    url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product + '&supplier=' + supplier,
                                    dataType: 'json',
                                    delay: 250,
                                    data: function (params) {
                                        return {
                                            q: params.term || "",
                                            page_limit: limit_page,
                                            page: params.page
                                        }
                                    },
                                    processResults: function (data, params) {
                                        return {
                                            results: $.map(data.items, function (item) {
                                                return {
                                                    text: item.name,
                                                    id: item.productModelID
                                                }
                                            }),
                                            pagination: {
                                                more: false
                                            }
                                        }
                                    },
                                    cache: true
                                },
                                escapeMarkup: function (markup) { return markup },
                                templateResult: formatData,
                                templateSelection: formatData
                            })

                            // PRODUCTOS
                            $('#product' + index).change(function(){
                                var product = $(this).val()
                
                                $('#model' + index).val('').trigger('change')
                                $('#supplierReference' + index).val('').trigger('change')
                                $('#price' + index).val('')
                                $('#lastAmount' + index).html('-')
                                $('#lastPrice' + index).html('-')
                                $('#lastPurchaseDate' + index).html('-')
                
                                $('#model' + index).select2({
                                    containerCssClass: 'select2-model' + index,
                                    language: langSelect2,
                                    placeholder: '--',
                                    minimumResultsForSearch: Infinity,
                                    ajax: {
                                        url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product + '&supplier=' + supplier,
                                        dataType: 'json',
                                        delay: 250,
                                        data: function (params) {
                                            return {
                                                q: params.term || "",
                                                page_limit: limit_page,
                                                page: params.page
                                            }
                                        },
                                        processResults: function (data, params) {
                                            return {
                                                results: $.map(data.items, function (item) {
                                                    return {
                                                        text: item.name,
                                                        id: item.productModelID
                                                    }
                                                }),
                                                pagination: {
                                                    more: false
                                                }
                                            }
                                        },
                                        cache: true
                                    },
                                    escapeMarkup: function (markup) { return markup },
                                    templateResult: formatData,
                                    templateSelection: formatData
                                })
                            })

                            // MODELOS
                            $('#model' + index).change(function(){
                                var model = $(this).val()
                
                                if(model != null){
                                    $.ajax({
                                        url: uri + 'core/warehouse/orders/functions.php',
                                        method: 'POST',
                                        data: {
                                            type: 'getPurchasePrice',
                                            model: model
                                        },
                                        success: function(data){
                                            data = $.parseJSON(data)
                    
                                            var price = data[0]
                                            var lastPurchase = data[1]
                                            
                                            $('#price' + index).val(price)
                    
                                            if(lastPurchase == null){
                                                $('#lastAmount' + index).html('-')
                                                $('#lastPrice' + index).html('-')
                                                $('#lastPurchaseDate' + index).html('-')
                                            }else{
                                                $('#lastAmount' + index).html(lastPurchase.amount)
                                                $('#lastPrice' + index).html(lastPurchase.price + ' €')
                                                $('#lastPurchaseDate' + index).html(moment(lastPurchase.date, 'X').format('DD/MM/YYYY'))
                                            }
                                        }
                                    })

                                    $.ajax({
                                        url: uri + 'core/warehouse/orders/functions.php',
                                        method: 'POST',
                                        data: {
                                            type: 'getSupplierReference',
                                            model: model,
                                        },
                                        async: false,
                                        success: function(data){
                                            try{
                                                data = $.parseJSON(data)

                                                $('#supplierReference' + index).val(data)
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
                                }
                            })
                        })
                    }

                    if(order.received == 1){
                        $('input').attr('disabled', true)
                        $('select').attr('disabled', true)
                        $('textarea').attr('disabled', true)
                        $('.btn-delete').remove()
                        $('.headDelete').remove()
                        $('#orderLine').remove()
                        $('#saveEditOrder').remove()

                        if(parseInt(order.type) == 1){
                            $('#notes').attr('disabled', false);
                            $('#inAgreement').attr('disabled', false);
                            $('#nonApproval').attr('disabled', false);
                            $('#correctiveAction').attr('disabled', false);
                            $('#saveConformity').removeClass('hide');
                        }
                    }

                    // Pedidos del expediente
                    if(belowsExpedient){
                        $('.headDelete').remove()
                        $('#lines input').attr('disabled', true)
                        $('#lines select').attr('disabled', true)
                    }else{
                        //$('#failActions').remove()
                        $('#emailSection').remove()
                    }
                }else{
                    if(order.deliveryPlace == null){
                        $("#deliveryPlace").val(null).trigger("change")
                        $('#deliveryPlaceOther').val(order.otherDeliveryPlace)
                        $('#deliveryPlaceOtherSection').removeClass('hide')
                    }else{
                        if($('#deliveryPlace').find("option[value='" + order.deliveryPlace + "']").length){
                            $('#deliveryPlace').val(order.deliveryPlace).trigger('change')
                        }else{ 
                            var newOption = new Option(order.mortuaryName, order.deliveryPlace, true, true)
                            $('#deliveryPlace').append(newOption).trigger('change')
                        }
                    }

                    if(order.deliveryDate != null){
                        $('#deliveryDate').val(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                    }

                    //$("#addOrderLine").remove();
                    $("#orderConfiguration").remove();
                    $("#orderLineTable").empty();
                    $("#orderLineTable").append(
                        '<th width="20%" class="id hide">ID</th>' +
                        '<th width="20%" style="text-align:center">Litros</th>' +
                        '<th width="20%" style="text-align:center">Precio/Litro</th>' +
                        '<th width="20%" style="text-align:center">Base Imponible</th>' +
                        '<th width="15%" style="text-align:center">' +  getIvaLabel() + '</th>' +
                        '<th width="20%" style="text-align:center">Total</th>');

                    
                    $.post(uri + 'core/crematoriums/gasoil/read.php', {gasoilID : order.gasoil}, function(data){
                        data = $.parseJSON(data)
                        $("#addOrderLine").addClass('hide')
                        $("#gasoilID").val(data.gasoilID);
                        $('#lines').append( 
                            '   <tr class="line">' +
                            '       <td class="index hide" width="5%">' + 1 + '</td>' +
                            '       <td class="id hide" width="5%">' + data.gasoilID + '</td>' +
                            '       <td class="text-center" width="15%">' +
                            '        <input style="margin-left:auto; margin-right:auto; text-align:center" type="text" class="form-control" id="litres' + 1 + '" value="' + data.litres + ' l" disabled>' +
                            '       </td>' +
                            '       <td width="15%">' +
                            '         <input type="text"  style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="priceLitre' + 1 + '" value="' + data.priceLitre + ' €" disabled>' +
                            '       </td>' +
                            '       <td width="10%">' +
                            '          <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="net' + 1 + '" value="' + data.net + ' €" disabled>' +
                            '       </td>' +
                            '       <td width="10%">' +
                            '          <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="ivaName' + 1 + '" value="' +  data.ivaName + '" disabled>' +
                            '       </td>' +
                            '       <td width="10%">' +
                            '          <input type="text" style="margin-left:auto; margin-right:auto; text-align:center" class="form-control" id="total' + 1 + '" value="' + data.total + ' €" disabled>' +
                            '       </td>' +
                            '   </tr>')
                    })
                }
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
        }
    })
 
    if(order.expedient != null && order.expedient != ''){
        $("#addOrderLine").remove()
        // LISTADO DE CENTROS DE COSTE
        $('#deliveryPlace').select2({
            containerCssClass: 'select2-deliveryPlace',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/warehouse/orders/mortuariesData2.php',
                dataType: 'json',
                delay: 250,
                async: false,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    }
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.mortuaryID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    }
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData,
        })
    }else{
        // LISTADO DE CENTROS DE COSTE
        $('#deliveryPlace').select2({
            containerCssClass: 'select2-deliveryPlace',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/warehouse/orders/mortuariesData.php',
                dataType: 'json',
                delay: 250,
                async: false,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    }
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.mortuaryID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    }
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData,
        })
    }

    // LÍNEAS DE PEDIDO - NUEVA
    $('#orderLine').click(function(){
        $('#model').attr('disabled', true)
        $('#amount').attr('disabled', true)
        $('#price').attr('disabled', true)
        supplier = $('#supplier').val()
        
        // LISTADO DE PRODUCTOS
        $('#product').select2({
            containerCssClass: 'select2-product',
            language: langSelect2,
            minimumResultsForSearch: Infinity,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/warehouse/orders/lines/dataProducts.php?supplier=' + supplier,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        page_limit: limit_page,
                        page: params.page
                    }
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.productID
                            }
                        }),
                        pagination: {
                            more: false
                        }
                    }
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData
        })

        $('#product').change(function(){
            $('#model').val('').trigger('change')
            $('#amount').val('')
            $('#price').val('')
            $('#lastAmount').val('')
            $('#lastPrice').val('')
            $('#lastPurchaseDate').val('')
    
            var product = $(this).val()
            if(product == null){
                $('#model').attr('disabled', true)
                $('#amount').attr('disabled', true)
                $('#price').attr('disabled', true)
            }else{
                $('#model').attr('disabled', false)
                $('#amount').attr('disabled', false)
                $('#price').attr('disabled', false)
    
                // LISTADO DE MODELOS
                $('#model').select2({
                    containerCssClass: 'select2-model',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    minimumResultsForSearch: Infinity,
                    ajax: {
                        url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product + '&supplier=' + supplier,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term || "",
                                page_limit: limit_page,
                                page: params.page
                            }
                        },
                        processResults: function (data, params) {
                            return {
                                results: $.map(data.items, function (item) {
                                    return {
                                        text: item.name,
                                        id: item.productModelID
                                    }
                                }),
                                pagination: {
                                    more: false
                                }
                            }
                        },
                        cache: true
                    },
                    escapeMarkup: function (markup) { return markup },
                    templateResult: formatData,
                    templateSelection: formatData
                })
    
                $('#model').change(function(){
                    var model = $(this).val()
                    if(model == null){
                        $('#amount').attr('disabled', true)
                        $('#amount').val('')
                        $('#lastAmount').val('')
                        $('#price').attr('disabled', true)
                        $('#price').val('')
                        $('#lastPrice').val('')
                    }else{
                        $('#amount').attr('disabled', false)
                        $('#price').attr('disabled', false)
    
                        $.ajax({
                            url: uri + 'core/warehouse/orders/functions.php',
                            method: 'POST',
                            data: {
                                type: 'getPurchasePrice',
                                model: model
                            },
                            success: function(data){
                                data = $.parseJSON(data)
    
                                var price = data[0]
                                var lastPurchase = data[1]
                                
                                $('#price').val(price)
    
                                if(lastPurchase == null){
                                    $('#lastAmount').val('-')
                                    $('#lastPrice').val('-')
                                    $('#lastPurchaseDate').html('-')
                                }else{
                                    $('#lastAmount').val(lastPurchase.amount)
                                    $('#lastPrice').val(lastPurchase.price + ' €')
                                    $('#lastPurchaseDate').html(moment(lastPurchase.date, 'X').format('DD/MM/YYYY'))
                                }
                            }
                        })

                        $.ajax({
                            url: uri + 'core/warehouse/orders/functions.php',
                            method: 'POST',
                            data: {
                                type: 'getSupplierReference',
                                model: model,
                            },
                            async: false,
                            success: function(data){
                                try{
                                    data = $.parseJSON(data)
                                    
                                    $('#supplierReference').val(data)
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
                    }
                })
            }
        })
        $('#modal-new-orderLine').modal('show')
    })

    if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
        $('#tableLines :input').each(function(){
            $(this).attr('disabled', true)
        })
    }

    $('#saveNewOrderLine').click(function(){
        var validate = 0

        if(isEmpty($('#formNewOrderLine #product'))){
            validate++
        }
        if(isEmpty($('#formNewOrderLine #model'))){
            validate++
        }
        if(isEmpty($('#formNewOrderLine #amount'))){
            validate++
        }
        if(isEmpty($('#formNewOrderLine #price'))){
            validate++
        }

        if(validate == 0){
            var index = -1
            $('.tableLines tbody tr').each(function(){
                index = $(this).find('td.index').html()
            })
            index++

            var product = $('#formNewOrderLine #product').val()
            var productName = $('#formNewOrderLine #product option:selected').text()
            var model = $('#formNewOrderLine #model').val()
            var modelName = $('#formNewOrderLine #model option:selected').text()
            var supplierReference = $('#formNewOrderLine #supplierReference').val()
            var amount = $('#formNewOrderLine #amount').val()
            var price = $('#formNewOrderLine #price').val()
            var lastAmount = $('#lastAmount').val()
            var lastPrice = $('#lastPrice').val()
            var lastPurchaseDate = $('#lastPurchaseDate').text()
            
            if(lastAmount == '' || lastAmount == null){
                lastAmount = '-'
            }

            if(lastPrice == '' || lastPrice == null){
                lastPrice = '-'
            }else{
                lastPrice += " €"
            }

            if(lastPurchaseDate == '' || lastPurchaseDate == null){
                lastPurchaseDate = '-'
            }

            $('#lines').append( 
                '   <tr class="line">' +
                '       <td class="index hide" width="5%">' + index + '</td>' +
                '       <td class="id hide" width="5%"></td>' +
                '       <td width="15%">' +
                '          <select class="form-control" id="product' + index + '"></select>' +
                '       </td>' +
                '       <td width="15%">' +
                '          <select class="form-control" id="model' + index + '"></select>' +
                '       </td>' +
                '       <td width="10%">' +
                '          <input type="text" class="form-control" id="supplierReference' + index + '" value="' + supplierReference + '" disabled>' +
                '       </td>' +
                '       <td width="10%">' +
                '          <input type="number" min="1" class="form-control" id="amount' + index + '" value="' + amount + '">' +
                '       </td>' +
                '       <td width="10%">' +
                '          <input type="number" min="1" class="form-control" id="price' + index + '" value="' + price + '">' +
                '       </td>' +
                '       <td align="center" width="10%">' +
                '           <p id="lastAmount' + index + '">' + lastAmount + '</p>' +
                '       </td>' +
                '       <td width="10%" align="center">' +
                '           <p id="lastPrice' + index + '">' + lastPrice + '</p>' +
                '       </td>' +
                '       <td width="10%" align="center">' +
                '           <p id="lastPurchaseDate' + index + '">' + lastPurchaseDate + '</p>' +
                '       </td>' +
                '       <td width="5%" align="center"><ul class="actions-menu"><li><a class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>' +
                '   </tr>'
            )

            if($('#product' + index).find("option[value='" + product + "']").length){
                $('#product' + index).val(product).trigger('change')
            }else{ 
                var newOption = new Option(productName, product, true, true)
                $('#product' + index).append(newOption).trigger('change')
            }

            if($('#model' + index).find("option[value='" + model + "']").length){
                $('#model' + index).val(model).trigger('change')
            }else{ 
                var newOption = new Option(modelName, model, true, true)
                $('#model' + index).append(newOption).trigger('change')
            }

            // LISTADO DE PRODUCTOS
            $('#product' + index).select2({
                containerCssClass: 'select2-product' + index,
                language: langSelect2,
                minimumResultsForSearch: Infinity,
                placeholder: '--',
                ajax: {
                    url: uri + 'core/warehouse/orders/lines/dataProducts.php?supplier=' + supplier,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            page_limit: limit_page,
                            page: params.page
                        }
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    text: item.name,
                                    id: item.productID
                                }
                            }),
                            pagination: {
                                more: false
                            }
                        }
                    },
                    cache: true
                },
                escapeMarkup: function (markup) { return markup },
                templateResult: formatData,
                templateSelection: formatData
            })

            $('#product' + index).change(function(){
                var product = $(this).val()

                $('#model' + index).val('').trigger('change')
                $('#supplierReference' + index).val('').trigger('change')
                $('#price' + index).val('')
                $('#lastAmount' + index).html('-')
                $('#lastPrice' + index).html('-')
                $('#lastPurchaseDate' + index).html('-')

                $('#model' + index).select2({
                    containerCssClass: 'select2-model' + index,
                    language: langSelect2,
                    placeholder: '--',
                    minimumResultsForSearch: Infinity,
                    ajax: {
                        url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product + '&supplier=' + supplier,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term || "",
                                page_limit: limit_page,
                                page: params.page
                            }
                        },
                        processResults: function (data, params) {
                            return {
                                results: $.map(data.items, function (item) {
                                    return {
                                        text: item.name,
                                        id: item.productModelID
                                    }
                                }),
                                pagination: {
                                    more: false
                                }
                            }
                        },
                        cache: true
                    },
                    escapeMarkup: function (markup) { return markup },
                    templateResult: formatData,
                    templateSelection: formatData
                })
            })

            // LISTADO DE MODELOS DADO EL PRODUCTO
            $('#model' + index).select2({
                containerCssClass: 'select2-model' + index,
                language: langSelect2,
                placeholder: '--',
                minimumResultsForSearch: Infinity,
                ajax: {
                    url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product + '&supplier=' + supplier,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            page_limit: limit_page,
                            page: params.page
                        }
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    text: item.name,
                                    id: item.productModelID
                                }
                            }),
                            pagination: {
                                more: false
                            }
                        }
                    },
                    cache: true
                },
                escapeMarkup: function (markup) { return markup },
                templateResult: formatData,
                templateSelection: formatData
            })

            $('#model' + index).change(function(){
                var model = $(this).val()

                if(model != null){
                    $.ajax({
                        url: uri + 'core/warehouse/orders/functions.php',
                        method: 'POST',
                        data: {
                            type: 'getPurchasePrice',
                            model: model
                        },
                        success: function(data){
                            data = $.parseJSON(data)
    
                            var price = data[0]
                            var lastPurchase = data[1]
                            
                            $('#price' + index).val(price)
    
                            if(lastPurchase == null){
                                $('#lastAmount' + index).html('-')
                                $('#lastPrice' + index).html('-')
                                $('#lastPurchaseDate' + index).html('-')
                            }else{
                                $('#lastAmount' + index).html(lastPurchase.amount)
                                $('#lastPrice' + index).html(lastPurchase.price + ' €')
                                $('#lastPurchaseDate' + index).html(moment(lastPurchase.date, 'X').format('DD/MM/YYYY'))
                            }
                        }
                    })

                    $.ajax({
                        url: uri + 'core/warehouse/orders/functions.php',
                        method: 'POST',
                        data: {
                            type: 'getSupplierReference',
                            model: model,
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)
                                
                                $('#supplierReference' + index).val(data)
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
                }
            })

            $('#modal-new-orderLine').modal('hide')
        }
    })

    //Sticky Table Header
    $('#tableLinesEditOrder #tableLines').stickyTableHeaders();
    $('#tableLinesEditOrder #tableLines').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    // LÍNEAS DE PEDIDO - ELIMINAR
    var toDelete = new Array
    $('#tableLines').on('click', '.btn-delete', function(){
        $('.btn-delete').tooltip('hide')
        var id = $(this).closest('tr').find('td.id').html()
        if(id != ''){
            toDelete.push(id)
        }
        $(this).closest('tr').remove()
    })

    // LÍNEA DE PRODUCTO - NUEVA
    $('#addOrderLine').click(function(){
        $('#model').attr('disabled', true)
        $('#amount').attr('disabled', true)
        $('#price').attr('disabled', true)
        
        var gasoil = $("#gasoilID").val()
        if(gasoil == null || gasoil == ''){
            if(supplier != null){
    
                $('#modal-new-orderLine').modal('show')
    
                // LISTADO DE PRODUCTOS
                $('#product').select2({
                    containerCssClass: 'select2-product',
                    language: langSelect2,
                    minimumResultsForSearch: Infinity,
                    placeholder: '--',
                    allowClear: true,
                    ajax: {
                        url: uri + 'core/warehouse/orders/lines/dataProducts.php?supplier=' + supplier,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term || "",
                                page_limit: limit_page,
                                page: params.page
                            }
                        },
                        processResults: function (data, params) {
                            return {
                                results: $.map(data.items, function (item) {
                                    return {
                                        text: item.name,
                                        id: item.productID
                                    }
                                }),
                                pagination: {
                                    more: false
                                }
                            }
                        },
                        cache: true
                    },
                    escapeMarkup: function (markup) { return markup },
                    templateResult: formatData,
                    templateSelection: formatData
                })
            }
        }
    })

    $('#product').change(function(){
        $('#model').val('').trigger('change')
        $('#amount').val('')
        $('#price').val('')
        $('#lastAmount').val('')
        $('#lastPrice').val('')
        $('#lastPurchaseDate').val('')

        var product = $(this).val()
        if(product == null){
            $('#model').attr('disabled', true)
            $('#amount').attr('disabled', true)
            $('#price').attr('disabled', true)
        }else{
            $('#model').attr('disabled', false)
            $('#amount').attr('disabled', false)
            $('#price').attr('disabled', false)

            // LISTADO DE MODELOS
            $('#model').select2({
                containerCssClass: 'select2-model',
                language: langSelect2,
                placeholder: '--',
                allowClear: true,
                minimumResultsForSearch: Infinity,
                ajax: {
                    url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product + '&supplier=' + supplier,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            page_limit: limit_page,
                            page: params.page
                        }
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    text: item.name,
                                    id: item.productModelID
                                }
                            }),
                            pagination: {
                                more: false
                            }
                        }
                    },
                    cache: true
                },
                escapeMarkup: function (markup) { return markup },
                templateResult: formatData,
                templateSelection: formatData
            })

            $('#model').change(function(){
                var model = $(this).val()
                if(model == null){
                    $('#amount').attr('disabled', true)
                    $('#amount').val('')
                    $('#lastAmount').val('')
                    $('#price').attr('disabled', true)
                    $('#price').val('')
                    $('#lastPrice').val('')
                    $('#supplierReference').val('')
                }else{
                    $('#amount').attr('disabled', false)
                    $('#price').attr('disabled', false)

                    $.ajax({
                        url: uri + 'core/warehouse/orders/functions.php',
                        method: 'POST',
                        data: {
                            type: 'getPurchasePrice',
                            model: model
                        },
                        success: function(data){
                            data = $.parseJSON(data)

                            var price = data[0]
                            var lastPurchase = data[1]
                            
                            $('#price').val(price)

                            if(lastPurchase == null){
                                $('#lastAmount').val('-')
                                $('#lastPrice').val('-')
                                $('#lastPurchaseDate').html('-')
                            }else{
                                $('#lastAmount').val(lastPurchase.amount)
                                $('#lastPrice').val(lastPurchase.price)
                                $('#lastPurchaseDate').html(moment(lastPurchase.date, 'X').format('DD/MM/YYYY'))
                            }
                        }
                    })

                    $.ajax({
                        url: uri + 'core/warehouse/orders/functions.php',
                        method: 'POST',
                        data: {
                            type: 'getSupplierReference',
                            model: model,
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)
                                
                                $('#supplierReference').val(data)
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
                }
            })
        }
    })

    // GUARDAR PEDIDO
    $('#saveEditOrder').click(function(){
        var validate = 0
       
        if($('#type').val() == 0){
            if(isEmpty($('#formEditOrder #expedient1'))){
                validate++

                $('.select2-' + $('#formEditOrder #expedient1').attr('id')).addClass('validateError')
                $('.select2-' + $('#formEditOrder #expedient1').attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#formEditOrder #expedient1').attr('id')).removeClass('validateError')
                $('.select2-' + $('#formEditOrder #expedient1').attr('class')).removeClass('validateError')
            }
        }
        if(isEmpty($('#formEditOrder #date'))){
            validate++
        }
        if(isEmpty($('#formEditOrder #supplier'))){
            validate++
        }
        if(isEmpty($("#formEditOrder #deliveryPlace"))){
            validate++
        }
        if($("#formEditOrder #deliveryPlace").val() == 0){
            if(isEmpty($("#formEditOrder #deliveryPlaceOther"))){
                validate++
            }
        }
        if(isEmpty($("#formEditOrder #deliveryDate"))){
            validate++
        }

        var lines = new Array
        $('#lines tr').each(function(){
            var row = $(this)
            
            var index = row.find('td.index').text()
            var id = row.find('td.id').text()
            
            if(isEmpty($('#product' + index))){
                validate++
                $('.select2-' + $('#product' + index).attr('id')).addClass('validateError')
                $('.select2-' + $('#product' + index).attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#product' + index).attr('id')).removeClass('validateError')
                $('.select2-' + $('#product' + index).attr('class')).removeClass('validateError')
            }
            if(isEmpty($('#model' + index))){
                validate++
                $('.select2-' + $('#model' + index).attr('id')).addClass('validateError')
                $('.select2-' + $('#model' + index).attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#model' + index).attr('id')).removeClass('validateError')
                $('.select2-' + $('#model' + index).attr('class')).removeClass('validateError')
            }
            if(isEmpty($('#amount' + index))){
                validate++
            }
            if(isEmpty($('#price' + index))){
                validate++
            }
            
            var model = $('#model' + index).val()
            var amount = $('#amount' + index).val()
            var price = $('#price' + index).val()

            lines.push([id, model, amount, price])
        })
        
        if(validate == 0){
            var id = $('#formEditOrder #orderID').val()
            var type = $('#formEditOrder #type').val()
            var expedient = type == 1 ? null : $('#expedient').val()
            var date = moment($('#formEditOrder #date').val(), 'DD/MM/YYYY').format('X')
            var supplier = $('#formEditOrder #supplier').val()
            var deliveryPlace = $('#formEditOrder #deliveryPlace').val()
            var deliveryPlaceOther = $('#formEditOrder #deliveryPlaceOther').val()
            var deceasedRoom = $('#formEditOrder #deceasedRoom').val()
            var deliveryDate = moment($('#formEditOrder #deliveryDate').val(), 'DD/MM/YYYY').format('X')
            var sendTo = $('#formEditOrder #sendTo').val()
            var notes = $('#formEditOrder #notes').val()
            var inAgreement = $('#formEditOrder #inAgreement').val()
            var nonApproval = $('#formEditOrder #nonApproval').val()
            var correctiveAction = $('#formEditOrder #correctiveAction').val()

            if(!isEmpty($("#gasoilID"))){
                var gasoilID = $("#gasoilID").val();
            }else{
                var gasoilID = null; 
            }
          
            $.ajax({
                url: uri + 'core/warehouse/orders/update.php',
                method: 'POST',
                data: {
                    id: id,
                    type: type,
                    expedient: expedient,
                    date: date,
                    supplier: supplier,
                    deliveryPlace: deliveryPlace,
                    deliveryPlaceOther: deliveryPlaceOther,
                    deceasedRoom: deceasedRoom,
                    deliveryDate: deliveryDate,
                    notes: notes,
                    inAgreement: inAgreement,
                    nonApproval: nonApproval,
                    correctiveAction: correctiveAction,
                    lines: lines,
                    gasoilID: gasoilID,
                    toDelete: toDelete
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pedido se ha guardado correctamente</div>')
                        if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
                            setTimeout(() => {
                                window.close()
                            }, 1500);
                        }else{
                            if(!fromBackButton){
                                setTimeout(() => {
                                    window.location.href = uri + 'almacen/pedidos/' + id
                                }, 1500);
                            }
                        }
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
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

    $('#modal-new-orderLine').on('hidden.bs.modal', function(){
        $("#product").val('').trigger('change')
        $("#model").val('').trigger('change')
        $("#amount").val('')
        $("#price").val('')
        $("#lastAmount").val('')
        $("#lastPrice").val('')
        $("#lastPurchaseDate").val('')
    })

    //NUEVO PRODUCTO
    $('#modal-new-product').on('show.bs.modal', function(){
        
        $('#formNewProduct #IVATypeID').empty()
        $.ajax({
            url: uri + 'core/products/functions.php',
            method: 'POST',
            data: {
                type: 'getIVATypes'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
                
                $.each(data, function(index, elem){
                    $('#formNewProduct #IVATypeID').append('<option value="' + elem.IVATypeID + '">' + elem.name + '</option>')
                })
            }
        })

        $('#formNewProduct #productClassID').empty()
        $.ajax({
            url: uri + 'core/products/functions.php',
            method: 'POST',
            data: {
                type: 'getClasses'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
                
                $.each(data, function(index, elem){
                    $('#formNewProduct #productClassID').append('<option value="' + elem.productClassID + '">' + elem.name + '</option>')
                })
            }
        })

        $('#formNewProduct #productTypeID').empty()
        if($('#formNewProduct #productTypeID').find("option[value='4']").length){
            $('#formNewProduct #productTypeID').val(4).trigger('change')
        }else{ 
            var newOption = new Option('Producto libre', 4, true, true)
            $('#formNewProduct #productTypeID').append(newOption).trigger('change')
        }
    });
   
    $('#formNewProduct #saveNewProduct').click(function(){
        var validate = 0

        if(isEmpty($('#formNewProduct #productName'))){
            validate++
        }
        if(isEmpty($('#formNewProduct #IVATypeID'))){
            validate++
        }
        if(isEmpty($('#formNewProduct #productTypeID'))){
            validate++
        }
        if(isEmpty($('#formNewProduct #productClassID'))){
            validate++
        }

        if($('#formNewProduct #orderType').val() == 0){
            if(isEmpty($('#formNewProduct #blockBelow'))){
                validate++
            }
            if(isEmpty($('#formNewProduct #orderBy'))){
                validate++
            }
        }

        if(validate == 0){
            var productName = $('#formNewProduct #productName').val()
            var productTypeID = $("#formNewProduct #productTypeID").val()
            var productClassID = $("#formNewProduct #productClassID").val()
            var IVATypeID = $("#formNewProduct #IVATypeID").val()
            var press = $('#formNewProduct #press').prop('checked')
            var supplied = $('#formNewProduct #supplied').prop('checked')
            var isInvoiced = $('#formNewProduct #isInvoiced').prop('checked')
            var amount = $('#formNewProduct #amount').prop('checked')
            var texts = $('#formNewProduct #texts').prop('checked')
            var preOrder = $('#formNewProduct #preOrder').prop('checked')
            var blockBelow = $('#formNewProduct #blockBelow').val()
            var orderBy = 'null'
            var orderType = $('#formNewProduct #orderType').val()

            var actions = ""

            $.ajax({
                url: uri + 'core/products/createProductGetId.php',
                method: 'POST',
                data: {
                    name: productName,
                    type: productTypeID,
                    class: productClassID,
                    IVA: IVATypeID,
                    press: press,
                    supplied: supplied,
                    isInvoiced: isInvoiced,
                    amount: amount,
                    texts: texts,
                    preOrder: preOrder,
                    blockBelow: blockBelow,
                    orderBy: orderBy,
                    orderType: orderType,
                    actions: actions
                },
                success: function(response){
                    response = $.parseJSON(response)
                    if(response["success"]){
                        var productID = response.data.productID
                        var name = response.data.name
                       
                        $('#modal-new-product').modal('hide')
                        $('#modal-new-model #productID').val(productID)
                        $('#modal-new-model #productName').html(name)
                        $('#modal-new-model').modal('show')
                    }else if(response["name"]){
                        $('#modal-new-product #formNewProduct #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un producto con ese nombre.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-new-product').modal('hide')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewProduct #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-product').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-product #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-product #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-product').on('hidden.bs.modal', function(){
        $('#formNewProduct input').val('');
        $('#formNewProduct #productTypeID').val(1).trigger('change');
        $('#formNewProduct #productClassID').val(1).trigger('change');
        $('#formNewProduct #IVATypeID').val(1).trigger('change');
        $('#formNewProduct input:checkbox').removeAttr('checked');
        $('.phones').html('');
        if(!$('#formNewProduct .phones').hasClass('in')){
            $('#formNewProduct .phones').addClass('in');
        }
        $("#formNewProduct #location").val('').trigger('change');
        clean("formNewProduct");
        $('#modal-new-product #warning-message').empty()
    });

    // LISTADO DE PROVEEDORES
    $('#formNewModel #supplierModel').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/suppliers/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
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
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData,
    })

    // MODELOS - TARIFAS
    var prices
    $.ajax({
        url: uri + 'core/prices/functions.php',
        type: 'POST',
        data: {
            type: 'getPrices'
        },
        async: false,
        success: function(data){
            data =  $.parseJSON(data)
            data.forEach(function(element){
                $('#formNewModel .prices').append('<div class="form-group"><label class="col-xs-4 control-label">'+element.name+'</label><div class="col-xs-8"><div class="input-group"><input type="number" class="form-control" id="'+element.priceID+'" name="'+element.priceID+'"><span class="inputError" id="' + element.priceID + 'Error"></span><div class="input-group-addon">€</div></div></div></div>');
            }, this)
        }
    });

    // MODELOS - NUEVO
    $('#saveNewModel').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewModel #name'))){
            validate++;
        }
        if(isEmpty($('#formNewModel #supplierModel'))){
            validate++;
        }
        if(isEmpty($('#formNewModel #purchasePrice'))){
            validate++;
        }
        if(isEmpty($('#formNewModel #year'))){
            validate++;
        }

        if(validate == 0){
            var productID = $('#formNewModel #productID').val();
            var name = $('#formNewModel #name').val();
            var supplier = $("#formNewModel #supplierModel").val();
            var purchasePrice = $("#formNewModel #purchasePrice").val();
            var year = $("#formNewModel #year").val();
            
            // TARIFAS ASOCIADAS AL MODELO
            var modelPrices = [];
            $('#formNewModel .prices .form-group').each(function(){
                var name =  $(this).find('.control-label').text();
                var client =  $(this).find('.form-control').attr('id');
                var priceNoIVA = $(this).find('.form-control').val();
                if(isEmpty($(this).find('.form-control'))){
                    validate++;
                }
                if(priceNoIVA==null || priceNoIVA == undefined || priceNoIVA == ""){
                    priceNoIVA = 0;
                }

                array = [parseInt(client), parseFloat(priceNoIVA)];
                modelPrices.push(array);
            });

            if(validate == 0){
                modelPrices = JSON.stringify(modelPrices);
                $.ajax({
                    url: uri + 'core/products/createProductModel.php',
                    method: 'POST',
                    data: {
                        product: productID,
                        name: name,
                        purchasePrice: purchasePrice,
                        supplier: supplier,
                        year: year,
                        modelPrices: modelPrices
                    },
                    async: false,
                    success: function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El modelo se ha creado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })

                $('#modal-new-model').modal('hide');
            }
        }else{
            $('#modal-new-model #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-model #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-model').on('hidden.bs.modal', function (e) {
        $('#formNewModel input').val('');
        $("#formNewModel #supplierModel").val('').trigger('change');
        clean("formNewModel");
        $('#modal-new-model #warning-message').empty()
    });

    // ENVIAR EMAIL
    $('#sendEmail').click(function(){
        var sendTo = new Array

        if($('#email').val() != ''){
            sendTo.push($('#email').val())
        }
        if($('#sendTo').val() != null){
            $.ajax({
                url: uri + 'core/emails/functions.php',
                method: 'POST',
                data: {
                    type: 'getEmail',
                    id: $('#sendTo').val()
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data != null){
                        sendTo.push(data)
                    }
                }
            })
        }
        if($('#sendCopy').val() != ''){
            sendTo.push($('#sendCopy').val())
        }

        $.ajax({
            url: uri + 'core/warehouse/orders/functions.php',
            method: 'POST',
            data: {
                type: 'sendEmail',
                sendTo: sendTo,
                order: $('#orderID').val()
            },
            success: function(data){
                data = $.parseJSON(data)

                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El correo ha sido enviado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    // Para pedidos del expediente
    if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
        $('.headDelete').remove()
    }

    //Guardar pedido y enviar email
    $('#saveSendEmailOrderBtn').click(function(){
        var validate = 0

        if($('#type').val() == 0){
            if(isEmpty($('#formEditOrder #expedient1'))){
                validate++

                $('.select2-' + $('#formEditOrder #expedient1').attr('id')).addClass('validateError')
                $('.select2-' + $('#formEditOrder #expedient1').attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#formEditOrder #expedient1').attr('id')).removeClass('validateError')
                $('.select2-' + $('#formEditOrder #expedient1').attr('class')).removeClass('validateError')
            }
        }
        if(isEmpty($('#formEditOrder #date'))){
            validate++
        }
        if(isEmpty($('#formEditOrder #supplier'))){
            validate++
        }
        if(isEmpty($("#formEditOrder #deliveryPlace"))){
            validate++
        }
        if($("#formEditOrder #deliveryPlace").val() == 0){
            if(isEmpty($("#formEditOrder #deliveryPlaceOther"))){
                validate++
            }
        }
        if(isEmpty($("#formEditOrder #deliveryDate"))){
            validate++
        }

        var lines = new Array
        $('#lines tr').each(function(){
            var row = $(this)

            var index = row.find('td.index').text()
            var id = row.find('td.id').text()
            
            if(isEmpty($('#product' + index))){
                validate++

                $('.select2-' + $('#product' + index).attr('id')).addClass('validateError')
                $('.select2-' + $('#product' + index).attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#product' + index).attr('id')).removeClass('validateError')
                $('.select2-' + $('#product' + index).attr('class')).removeClass('validateError')
            }
            if(isEmpty($('#model' + index))){
                validate++

                $('.select2-' + $('#model' + index).attr('id')).addClass('validateError')
                $('.select2-' + $('#model' + index).attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#model' + index).attr('id')).removeClass('validateError')
                $('.select2-' + $('#model' + index).attr('class')).removeClass('validateError')
            }
            if(isEmpty($('#amount' + index))){
                validate++
            }
            if(isEmpty($('#price' + index))){
                validate++
            }

            var model = $('#model' + index).val()
            var amount = $('#amount' + index).val()
            var price = $('#price' + index).val()

            lines.push([id, model, amount, price])
        })

        if(validate == 0){
            var id = $('#orderID').val()
            var type = $('#type').val()
            var expedient = type == 1 ? null : $('#expedient').val()
            var date = moment($('#formEditOrder #date').val(), 'DD/MM/YYYY').format('X')
            var supplier = $('#formEditOrder #supplier').val()
            var deliveryPlace = $('#deliveryPlace').val()
            var deliveryPlaceOther = $('#deliveryPlaceOther').val()
            var deceasedRoom = $('#deceasedRoom').val()
            var deliveryDate = moment($('#deliveryDate').val(), 'DD/MM/YYYY').format('X')
            var sendTo = $('#sendTo').val()
            var notes = $('#notes').val()
            var inAgreement = $('#inAgreement').val()
            var nonApproval = $('#nonApproval').val()
            var correctiveAction = $('#correctiveAction').val()
            
            $.ajax({
                url: uri + 'core/warehouse/orders/update.php',
                method: 'POST',
                data: {
                    id: id,
                    type: type,
                    expedient: expedient,
                    date: date,
                    supplier: supplier,
                    deliveryPlace: deliveryPlace,
                    deliveryPlaceOther: deliveryPlaceOther,
                    deceasedRoom: deceasedRoom,
                    deliveryDate: deliveryDate,
                    notes: notes,
                    inAgreement: inAgreement,
                    nonApproval: nonApproval,
                    correctiveAction: correctiveAction,
                    gasoilID: '',
                    lines: lines,
                    toDelete: toDelete
                },
                async: false,
                success: function(data){
                
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pedido se ha guardado correctamente</div>')
                        
                        //Enviar correo
                        $.ajax({
                            url : uri + 'core/orders/functions.php',
                            method : 'POST',
                            data : {
                                type : 'getInfo',
                                order : id
                            },
                            async: false,
                            success : function(data){
                                
                                data = $.parseJSON(data)  
                             
                                var order = data[0]
                                var orderLines = data[1]
                                
                                $('#modal-send-email2 #oID').val(order.ID)
                                $('#modal-send-email2 #number2').html(order.ID)
                                $('#modal-send-email2 #date2').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                $('#modal-send-email2 #supplierName2').html(order.supplierName)
                                $('#modal-send-email2 #supplierID2').html(supplier)
                                $('#modal-send-email2 #supplierPhone2').html(order.phones)
                                if(order.fax == '' || order.fax == null){
                                    $('#modal-send-email2 #supplierFax2').html("-")
                                }else{
                                    $('#modal-send-email2 #supplierFax2').html(order.fax)
                                }
                               
                                $('#modal-send-email2 #orderLines2').empty()

                                if(order.gasoil == '' || order.gasoil == null){

                                    if(order.expedient !== null){
                                        $('#modal-send-email2 #orderLines2').append(  
                                            '<table class="table table-striped table-bordered">' +
                                            '   <thead>' +
                                            '       <tr>' +
                                            '           <th>Cantidad</th>' +
                                            '           <th>Producto</th>' +
                                            '           <th>Modelo</th>' +
                                            '           <th>Texto</th>' +
                                            '       </tr>' +
                                            '   </thead>' +
                                            '   <tbody></tbody>' +
                                            '</table>')
                                    }else{
                                        $('#modal-send-email2 #orderLines2').append(  
                                            '<table class="table table-striped table-bordered">' +
                                            '   <thead>' +
                                            '       <tr>' +
                                            '           <th>Cantidad</th>' +
                                            '           <th>Producto</th>' +
                                            '           <th>Modelo</th>' +
                                            '       </tr>' +
                                            '   </thead>' +
                                            '   <tbody></tbody>' +
                                            '</table>')
                                    }
                                    $.each(orderLines, function(index, elem){
                                        
                                        if(elem.texts == '' || typeof elem.texts == 'undefined'){
                                            var text = ''
                                        }else{
                                            var text = elem.texts[0]["value"]
                                        }

                                        if(order.expedient !== null){
                                            $('#modal-send-email2 #orderLines2 tbody').append(
                                                '<tr>' +
                                                '   <td>' + elem.amount + '</td>' +
                                                '   <td>' + elem.productName + '</td>' +
                                                '   <td>' + elem.modelName + '</td>' +
                                                '   <td>' + text + '</td>' +
                                                '</tr>')
                                        }else{
                                            $('#modal-send-email2 #orderLines2 tbody').append(
                                                '<tr>' +
                                                '   <td>' + elem.amount + '</td>' +
                                                '   <td>' + elem.productName + '</td>' +
                                                '   <td>' + elem.modelName + '</td>' +
                                                '</tr>')
                                        }
                                        
                                    })
                                }else{

                                    $('#modal-send-email2 #orderLines2').append(
                                        '<table class="table table-striped table-bordered">' +
                                        '   <thead>' +
                                        '       <tr>' +
                                        '           <th style="text-align:center">Litros</th>' +
                                        '       </tr>' +
                                        '    </thead>' +
                                        '   <tbody></tbody>' +
                                        '</table>');
                                    $('#modal-send-email2 #orderLines2 tbody').append(
                                        '<tr>' +
                                        '   <td style="text-align:center">' + orderLines.litres + ' l</td>' +
                                        '</tr>')
                                }

                                gender = ''
                                if(order.deceasedGender == 'Hombre'){
                                    gender = 'D. '
                                }else{
                                    gender = 'Dña. '
                                }

                                if(order.expedient !== null){
                                
                                    $('#modal-send-email2 #deceased2').html(gender + order.deceasedName + ' ' + order.deceasedSurname)
                                    $('#modal-send-email2 #expedient2').html(order.number)
                                }else{
                                    $("#modal-send-email2 #data1").remove();
                                }

                                if(order.deliveryPlace == null){
                                    $('#modal-send-email2 #deliveryPlace2').html(order.otherDeliveryPlace)
                                }else{
                                    $('#modal-send-email2 #deliveryPlace2').html(order.deliveryPlaceName)
                                }

                                if(order.deliveryDate != null){
                                    $('#modal-send-email2 #deliveryDate2').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                }

                                $('#modal-send-email2 #notes2').html(order.notes)
                               
                                if(order.mail == "" || order.mail == null){
                                    $('#modal-send-email2 #send2').append('<strong id="msg" style="color:red">ATENCIÓN. El proveedor no tiene email</strong>')
                                }else{
                                    $('#modal-send-email2 #send2').html(order.mail)
                                }
                               
                                if(order.sentEmail == 1){
                                    $('#modal-send-email2 #sentEmail2').html('El correo ya ha sido enviado')
                                }else{
                                    $('#modal-send-email2 #sentEmail2').html('')
                                }
                                $('#modal-send-email2 #notes1').val(order.notes)
                                                
                                $('#modal-send-email2').modal('show')
                            },
                            error : function(){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-send-email2 #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-send-email2 #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-send-email2 #sendEmail2').click(function(){
        var orderID = $('#modal-send-email2 #oID').val()
        var suppID = $('#modal-send-email2 #supplierID2').text()
        
        $.ajax({
            url : uri + 'core/orders/functions.php',
            method : 'POST',
            data : {
                type : 'sendEmail',
                order : orderID,
                notes : $('#modal-send-email2 #notes1').val(),
                sendCopy : $('#modal-send-email2 #sendCopy').val()
            },
            async: false,
            success : function(data){
                if(data){
                    //$('.btn-orders').click()
                    setTimeout(function(){                        
                        localStorage.setItem("AcualizarServicio", '');                             
                    }, 1500);

                    
                    $('#modal-send-email2').modal('hide')                    
                    $('#saveSendEmailOrder').html('Correo enviado');
                    $('#saveSendEmailOrder').removeClass('btn-danger');
                    $('#saveSendEmailOrder').addClass('btn-success');                   
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#modal-send-email2').on('hidden.bs.modal', function(){
		$('#modal-send-email2 #send2 #msg').remove();
    });

    $('#genPdfNC').click(function(){
        $("#saveEditOrder").click();
        var text
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'noConformidadPedido', text: text, service: orderID, data: ""},
            type: 'POST',
            async: false,            
            success: function(data){
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'noConformidadPedido', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/noConformidadPedido.pdf', '_blank')
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
        $("#saveEditOrder").click();
        var text
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'accionCorrectivaPedido', text: text, service: orderID, data: ""},
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

    // GUARDAR CONFORMIDAD
    $('#saveConformity').click(function(){
        var id = $('#formEditOrder #orderID').val();
        var notes = $('#formEditOrder #notes').val();
        var inAgreement = $('#formEditOrder #inAgreement').val();
        var nonApproval = $('#formEditOrder #nonApproval').val();
        var correctiveAction = $('#formEditOrder #correctiveAction').val();
        
        $.ajax({
            url: uri + 'core/warehouse/orders/updateConformity.php',
            method: 'POST',
            data: {
                id: id,
                notes: notes,
                inAgreement: inAgreement,
                nonApproval: nonApproval,
                correctiveAction: correctiveAction
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data);

                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La conformidad del pedido se ha guardado correctamente</div>')
                    if(document.referrer.match(/expediente\/cservicio/) || document.referrer.match(/expediente\/documentacion/)){
                        setTimeout(() => {
                            window.close()
                        }, 1500);
                    }else{
                        if(!fromBackButton){
                            setTimeout(() => {
                                window.location.href = uri + 'almacen/pedidos/' + id
                            }, 1500);
                        }
                    }
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })
})