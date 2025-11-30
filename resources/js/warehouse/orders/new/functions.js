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

// Select2 functions for remote data
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveNewOrder" name="saveNewOrder" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
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

    // LISTADO DE EXPEDIENTES
    $('#expedient1').select2({
        containerCssClass: 'select2-expedient1',
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

    /*$('#type').change(function(){
        if($(this).val() == 0){
            $('#expedientSection').removeClass('hide')
            $('#freeOrder').show()
            $('#supplier').val('').trigger('change')
            $('#supplierSection').show()
        }else{
            $('#expedientSection').addClass('hide')
            $('#expedient1').val('').trigger('change')
            $('#freeOrder').hide()
            if($('#supplier').find("option[value='127']").length){
                $('#supplier').val(127).trigger('change')
            }else{ 
                var newOption = new Option('No proveedor', 127, true, true)
                $('#supplier').append(newOption).trigger('change')
            }
            $('#supplierSection').hide()
        }
    })*/

    $('#date').val(moment().format('DD/MM/YYYY'))
    $('#deliveryDate').val(moment().add(1, 'days').format('DD/MM/YYYY'))

    // LISTADO DE PROVEEDORES
    $('#formNewOrder #supplier').select2({
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

    var supplier = null
    $('#formNewOrder #supplier').change(function(){
        supplier = $(this).val()

        if(supplier != null){
            $.ajax({
                url: uri + "core/warehouse/orders/functions.php",
                type: 'POST',
                data: {
                    type : 'getSupplierInfo',
                    supplier : supplier
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    
                    $('#phones').val(data.phones)
                    $('#email').val(data.mail)
                }
            })

            $('#orderLine').removeAttr('disabled')
        }else{
            $('#orderLine').attr('disabled', true)
            $('#phones').val('')
            $('#email').val('')
        }

        $('#lines').empty()
    })

    // LISTADO DE TANATORIOS
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

    $('#deliveryPlace').change(function(){
        if($(this).val() == 23){
            $('#deliveryPlaceOtherSection').removeClass('hide')
        }else{
            $('#deliveryPlaceOtherSection').addClass('hide')
        }
    })

    // LÍNEA DE PRODUCTO - NUEVA
    $('#orderLine').click(function(){
        $('#model').attr('disabled', true)
        $('#amount').attr('disabled', true)
        $('#price').attr('disabled', true)

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

    var lines = []
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
    
            var index = -1
            $('.tableLines tbody tr').each(function(){
                index = $(this).find('td.index').html()
            })
            index++
    
            lines[index] = [model, amount, price, index]
            
            $('#lines').append( '   <tr>' +
                                '       <td class="index hide" width="5%">' + index + '</td>' +
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
                                '           <p id="lastAmount' + index + '">' + lastAmount + '</p>' +
                                '       </td>' +
                                '       <td width="10%" align="center">' +
                                '           <p id="lastPrice' + index + '">' + lastPrice.replace('.', ',') + '</p>' +
                                '       </td>' +
                                '       <td width="10%" align="center">' +
                                '           <p id="lastPurchaseDate' + index + '">' + lastPurchaseDate + '</p>' +
                                '       </td>' +
                                '       <td width="5%" align="center"><ul class="actions-menu"><li><a class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>' +
                                '   </tr>')

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
                lines[index][0] = model

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

            $('#amount' + index).change(function(){
                lines[index][1] = $(this).val()
            })

            $('#price' + index).change(function(){
                lines[index][2] = $(this).val()
            })

            $('#modal-new-orderLine').modal('hide')
        }else{
            $('#modal-new-orderLine #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-orderLine #warning-message').empty()
            }, 3500)
        }
    })

    $('#tableLines').on('click', '.btn-delete', function () {
        var rowIndex = $(this).closest('tr').find('td.index').html()
        var result = []
        lines.forEach(function(elem, index){
            if(index != rowIndex){
                result[index] = elem
            }
        })
        lines = result
        $(this).closest('tr').remove()
    })
    //Sticky Table Header
    $('#tableLinesNewOrder #tableLines').stickyTableHeaders();
    $('#tableLinesNewOrder #tableLines').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    
    $('#saveNewOrder').click(function(){
        var validate = 0

        /*if($('#type').val() == 0){
            if(isEmpty($('#formNewOrder #expedient1'))){
                validate++

                $('.select2-' + $('#formNewOrder #expedient1').attr('id')).addClass('validateError')
                $('.select2-' + $('#formNewOrder #expedient1').attr('class')).addClass('validateError')
            }else{
                $('.select2-' + $('#formNewOrder #expedient1').attr('id')).removeClass('validateError')
                $('.select2-' + $('#formNewOrder #expedient1').attr('class')).removeClass('validateError')

            }
        }*/
        if(isEmpty($('#formNewOrder #date'))){
            validate++
        }
        if(isEmpty($('#formNewOrder #supplier'))){
            validate++
        }
        if(isEmpty($("#formNewOrder #deliveryPlace"))){
            validate++
        }
        if($("#formNewOrder #deliveryPlace").val() == 0){
            if(isEmpty($("#formNewOrder #deliveryPlaceOther"))){
                validate++
            }
        }
        if(isEmpty($("#formNewOrder #deliveryDate"))){
            validate++
        }

        if(lines.length == 0){
            alert("Debe añadir alguna línea al pedido")
        }

        lines.forEach(function(elem){
            if(isEmpty($('#formNewOrder #product' + elem[3]))){
                $('#formNewOrder #product' + elem[3]).next().children().children().addClass('validateError')
                validate++
            }else{
                $('#formNewOrder #product' + elem[3]).next().children().children().removeClass('validateError')
            }
            if(isEmpty($('#formNewOrder #model' + elem[3]))){
                $('#formNewOrder #model' + elem[3]).next().children().children().addClass('validateError')
                
                validate++
            }else{
                $('#formNewOrder #model' + elem[3]).next().children().children().removeClass('validateError')

            }
            if(isEmpty($('#formNewOrder #amount' + elem[3]))){
                validate++
            }
            if(isEmpty($('#formNewOrder #price' + elem[3]))){
                validate++
            }
        })

        if(validate == 0){
            //var type = $('#type').val()
            var expedient = $('#expedient').val()
            var date = moment($('#formNewOrder #date').val(), 'DD/MM/YYYY').format('X')
            var supplier = $('#formNewOrder #supplier').val()
            var deliveryPlace = $('#deliveryPlace').val()
            var deliveryPlaceOther = $('#deliveryPlaceOther').val()
            var deliveryDate = moment($('#deliveryDate').val(), 'DD/MM/YYYY').format('X')
            var notes = $('#notes').val()

            $.ajax({
                url: uri + 'core/warehouse/orders/create.php',
                method: 'POST',
                data: {
                    type: 1,
                    expedient: null,
                    date: date,
                    supplier: supplier,
                    deliveryPlace: deliveryPlace,
                    deliveryPlaceOther: deliveryPlaceOther,
                    deliveryDate: deliveryDate,
                    notes: notes,
                    lines: lines
                },
                async: false,
                success: function(data){                                     
                    if(data){                        
                        window.location.href = uri + 'almacen/pedidos'
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
        $('#modal-new-orderLine #warning-message').empty()
    })

    // AÑADIR TELÉFONOS
    $('.btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('.phone').val('')
            $('.phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('.phones').hasClass('in')){
                $('.phones').addClass('in')
            }
            $('.phones .label .btn-remove').click(function(){
                $(this).parent('.label').remove()
            })
        }
    });
    // AÑADIR PERSONAS DE CONTACTO
    $('.btn-add-person').click(function(){
        var name = $(this).parent().parent().find('#person').val();
        var department = $(this).parent().parent().find('#department').val();
        $('.input-contactPeople .form-control').val('');
        $('.contactPeople').append('<span class="label label-default small"><span class="name">'+name+'</span> (<span class="department">'+department+'</span>) <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span>')
        if(!$('.contactPeople').hasClass('in')){
            $('.contactPeople').addClass('in');
        }
        $('.contactPeople .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });
    });

    //NUEVO PROVEEDOR
    $('#saveNewSupplier').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
       
        if(isEmpty($('#formNewData #nif'))){
            validate++;
        }else{
            if($('#formNewData #validateCIF').prop('checked')){
                if(!isNifCif($("#formNewData #nif"))){
                    validate++
                }
            }
        }
        
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
        }
        if($('#formNewData #fax').val() != ""){
            if(!isPhone($('#formNewData #fax'))){
                validate++;
            }
        }

        if(validate == 0){
            var nif = $("#formNewData #nif").val();
            var name = $("#formNewData #name").val();
            var address = $("#formNewData #address").val();
            var mail = $("#formNewData #mail").val();
            var description = $("#formNewData #description").val();
            var location = $("#formNewData #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#formNewData #fax").val();
            var contactPeople = "";
            $('#formNewData .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var department = $(this).find('.department').text();
                contactPeople += name+"?"+department+"-";
            });
            contactPeople=contactPeople.slice(0,-1);
            var entryDate = $("#formNewData #entryDate").val();        
            if(moment(entryDate,"DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate = "";
            }

            var sentObituary
            $('#formNewData #sentObituary').prop('checked') ? sentObituary = 1 : sentObituary = 0

            $.post(uri+"core/suppliers/create.php", {nif: nif, name: name, address: address, mail: mail, location: location, description: description, phones: phones, fax: fax, contactPeople: contactPeople, entryDate: entryDate, sentObituary: sentObituary}, function(data){
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

            $('#modal-new-supplier').modal('hide');
        }else{
            $('#modal-new-supplier #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-supplier #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-supplier').on('shown.bs.modal', function (e) {
        $('.location').prop('disabled', true)
    })

    $('#modal-new-supplier').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('#formNewData textarea').val('');
        $('.phones').html('');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $('.contactPeople').html('');
        if(!$('#formNewData .contactPeople').hasClass('in')){
            $('#formNewData .contactPeople').addClass('in');
        }
        $(".province").val('').trigger('change');
        $(".location").attr('disabled', true)
        $(".location").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-supplier #warning-message').empty()
        
        $("#modal-new-supplier #validateCIF").prop('checked', true);
    });

    // PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var provinces = $.parseJSON(data)
            if(provinces != null){
                $('.province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('.province').append($('<option />').val(this.province).text(this.province))
                })

                $('.province').change(function(){
                    $('.province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var province
    $('.province').change(function(){
        province = $(this).val()
        $('.location').prop('disabled', false)
        $('.location').val('').trigger('change')
    })

    $('.location').prop('disabled', true)

    // LOCALIDADES
    $('.location').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : province
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.locationID
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

    //NUEVO-PRODUCTO
    $('#formNewProduct #supplied').change(function(){
        if($(this).prop('checked')){
            $('#formNewProduct #IVATypeID').val(1).trigger('change')
        }
    })

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
})