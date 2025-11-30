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

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveEditOrder" name="saveEditOrder" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
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
    
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Datepicker
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // Select
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

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

    //Select2 functions for remote data
    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>'
        return data
    }

    var orderID = $('#orderID').val()
    var supplier
    var toDisable = false

    $.post(uri + 'core/warehouse/orders/read.php', {ID : orderID}, function(data){
        data = $.parseJSON(data)

        $('#formEditOrder #date').val(moment(data.date, 'X').format('DD/MM/YYYY'))
        supplier = data.supplierID
        $('#formEditOrder #supplier').val(data.name)
        $('#formEditOrder #phones').val(data.phones)
        $('#formEditOrder #fax').val(data.fax)
        if(data.mortuaryName != null){
            $('#formEditOrder #deliveryPlace').val(data.mortuaryName)
        }
        $('#formEditOrder #deliveryDate').val(moment(data.date, 'X').add(1, 'days').format('DD/MM/YYYY'))
        $('#formEditOrder #inAgreement').val(data.inAgreement)
        $('#formEditOrder #notes').val(data.notes)
        if(data.status == 0){
            $('#formEditOrder #status').prop('checked', false)

            $('#formEditOrder #date').prop('disabled', true)
            $('#formEditOrder #deliveryPlace').prop('disabled', true)
            $('#formEditOrder #deliveryDate').prop('disabled', true)
            $('#formEditOrder #inAgreement').prop('disabled', true)
            $('#formEditOrder #notes').prop('disabled', true)
            $('#formEditOrder #status').prop('disabled', true)
            $('.orderLine').addClass('hide')
            $('.delete').addClass('hide')
            $('#saveEditOrder').addClass('hide')

            toDisable = true
        }else{
            $('#formEditOrder #status').prop('checked', true)
        }
    })

    var lines = []
    var oldLines = []
    $.post(uri + 'core/warehouse/orders/lines/list.php', {order : orderID}, function(data){
        data = $.parseJSON(data)

        if(data != null){
            var index = 0
            data.forEach(function(elem){
                lines.push([elem.ID, elem.product, elem.model, elem.amount])
                oldLines.push(elem.ID)

                var i = index

                if(toDisable){
                    $('#lines').append( '<tr>' +
                                '<td class="index hide" width="5%">' + index + '</td>' +
                                '<td class="orderLineID hide" width="5%">' + elem.ID + '</td>' +
                                '<td width="30%">' +
                                '   <select class="form-control product' + index + '" disabled>' +
                                '</td>' +
                                '<td width="30%">' +
                                '   <select class="form-control model' + index + '" disabled>' +
                                '</td>' +
                                '<td width="10%">' +
                                '   <input type="number" min="1" class="form-control amount' + index  + '" value="' + elem.amount + '" disabled>' +
                                '</td>' +
                                '<td width="20%"></td>' +
                                '</tr>')
                }else{
                    $('#lines').append( '<tr>' +
                                '<td class="index hide" width="5%">' + index + '</td>' +
                                '<td class="orderLineID hide" width="5%">' + elem.ID + '</td>' +
                                '<td width="30%">' +
                                '   <select class="form-control product' + index + '">' +
                                '</td>' +
                                '<td width="30%">' +
                                '   <select class="form-control model' + index + '">' +
                                '</td>' +
                                '<td width="10%">' +
                                '   <input type="number" min="1" class="form-control amount' + index  + '" value="' + elem.amount + '">' +
                                '</td>' +
                                '<td width="20%" align="center"><ul class="actions-menu"><li><a class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>' +
                                '</tr>')
                }

                // Carga los productos
                $('.product' + index).select2({
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

                if($('.product' + index).find("option[value='" + elem.product + "']").length){
                    $('.product' + index).val(elem.product).trigger('change')
                }else{ 
                    var newOption = new Option(elem.productName, elem.product, true, true)
                    $('.product' + index).append(newOption).trigger('change')
                }

                // Carga los modelos
                $('.model' + index).select2({
                    containerCssClass: 'select2-model',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: true,
                    minimumResultsForSearch: Infinity,
                    ajax: {
                        url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + elem.product,
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

                if($('.model' + index).find("option[value='" + elem.model + "']").length){
                    $('.model' + index).val(elem.model).trigger('change')
                }else{ 
                    var newOption = new Option(elem.modelName, elem.model, true, true)
                    $('.model' + index).append(newOption).trigger('change')
                }

                $(document).on("change", '.product' + i, function(){
                    var product = $(this).val()

                    $('.model' + i).val('')
            
                    // Carga los modelos
                    $('.model' + i).select2({
                        containerCssClass: 'select2-model',
                        language: langSelect2,
                        placeholder: '--',
                        allowClear: true,
                        minimumResultsForSearch: Infinity,
                        ajax: {
                            url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product,
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

                $(document).on("change", '.model' + index, function(){
                    lines[i][2] = $(this).val()
                })
        
                $(document).on("change", '.amount' + index, function(){
                    lines[i][3] = $(this).val()
                })
                
                index++
            })
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

    $('#saveEditOrder').click(function(data){
        var validate = 0

        if(isEmpty($('#formEditOrder #date'))){
            validate++
        }else{
            if(!isDate($('#formEditOrder #date'))){
                validate++
            }
        }

        if(isEmpty($("#formEditOrder #deliveryPlace"))){
            validate++
        }

        if(isEmpty($("#formEditOrder #deliveryDate"))){
            validate++
        }else{
            if(!isDate($("#formEditOrder #deliveryDate"))){
                validate++
            }   
        }

        if(lines.length > 0){
            lines.forEach(function(elem, index){
                if(isEmpty($('#formEditOrder .product' + index))){
                    $('#formEditOrder .product' + index).next().children().children().addClass('validateError')
    
                    validate++
                }else{
                    $('#formEditOrder .product' + index).next().children().children().removeClass('validateError')
                }
                if(isEmpty($('#formEditOrder .model' + index))){
                    $('#formEditOrder .model' + index).next().children().children().addClass('validateError')
                    
                    validate++
                }else{
                    $('#formEditOrder .model' + index).next().children().children().removeClass('validateError')
    
                }
                if(isEmpty($('#formEditOrder .amount' + index))){
                    validate++
                }
            })
        }

        if(validate == 0){
            var orderID = $('#formEditOrder #orderID').val()
            var date = moment($('#formEditOrder #date').val(), 'DD/MM/YYYY').format('X')
            var deliveryPlace = $('#formEditOrder #deliveryPlace').val()
            var deliveryDate = moment($('#formEditOrder #deliveryDate').val(), 'DD/MM/YYYY').format('X')
            var inAgreement = $('#formEditOrder #inAgreement').val()
            var notes = $('#formEditOrder #notes').val()
            var status
            $('#formEditOrder #status').prop('checked') ? status = 1 : status = 0

            if(lines != null){
                if(lines.length == 0){
                    lines = null
                }
            }
            if(oldLines != null){
                if(oldLines.length == 0){
                    oldLines = null
                }
            }
            
            $.post(uri + 'core/warehouse/orders/update.php', {  
                    ID : orderID, date : date, deliveryPlace : deliveryPlace,
                    deliveryDate : deliveryDate, inAgreement : inAgreement,
                    notes : notes, status : status, lines : lines, oldLines : oldLines,
                    supplier : supplier}, function(data)
            {
                if(data){
                    $('#modal-confirmation').modal('show')
                    $('#comeback').click(function(){
                        window.close()
                    })
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }

                $('html, body').animate({scrollTop : 0}, 800)
            })
        }
    })

    $('.orderLine').click(function(){
        // Carga los productos
        $('.product').select2({
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
                            more: true
                        }
                    }
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup },
            templateResult: formatData,
            templateSelection: formatData
        })

        $('#modal-new-orderLine').modal('show')
    })

    $(document).on("change", '.product', function(){
        var product = $(this).val()
        
        $('.model').val('')

        // Carga los modelos
        $('.model').select2({
            containerCssClass: 'select2-model',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            minimumResultsForSearch: Infinity,
            ajax: {
                url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product,
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

    $('#saveNewOrderLine').click(function(){
        var product = $('#formNewOrderLine #product').val()
        var productName = $('#formNewOrderLine #product option:selected').text()
        var model = $('#formNewOrderLine #model').val()
        var modelName = $('#formNewOrderLine #model option:selected').text()
        var amount = $('#formNewOrderLine #amount').val()

        var index = -1
        $('.tableLines tbody tr').each(function(){
            index = $(this).find('td.index').html()
        })
        index++

        lines[index] = ['', product, model, amount]
        
        $('#lines').append( '<tr>' +
                            '<td class="index hide" width="10%">' + index + '</td>' +
                            '<td class="id hide" width="10%"></td>' +
                            '<td width="30%">' +
                            '   <select class="form-control product' + index + '">' +
                            '</td>' +
                            '<td width="30%">' +
                            '   <select class="form-control model' + index + '">' +
                            '</td>' +
                            '<td width="10%">' +
                            '   <input type="number" min="1" class="form-control amount' + index + '" value="' + amount + '">' +
                            '</td>' +
                            '<td width="20%" align="center"><ul class="actions-menu"><li><a class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul></td>' +
                            '</tr>')

        // Carga los productos
        $('.product' + index).select2({
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
        
        if($('.product' + index).find("option[value='" + product + "']").length){
            $('.product' + index).val(product).trigger('change')
        }else{ 
            var newOption = new Option(productName, product, true, true)
            $('.product' + index).append(newOption).trigger('change')
        }

        // Carga los modelos
        $('.model' + index).select2({
            containerCssClass: 'select2-model',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            minimumResultsForSearch: Infinity,
            ajax: {
                url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product,
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

        $(document).on("change", '.product' + index, function(){
            var product = $(this).val()
            lines[index][1] = product
            
            $('.model' + index).val('')
    
            // Carga los modelos
            $('.model' + index).select2({
                containerCssClass: 'select2-model',
                language: langSelect2,
                placeholder: '--',
                allowClear: true,
                minimumResultsForSearch: Infinity,
                ajax: {
                    url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product,
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

        $(document).on("change", '.model' + index, function(){
            lines[index][2] = $(this).val()
        })

        $(document).on("change", '.amount' + index, function(){
            lines[index][3] = $(this).val()
        })
        
        if($('.model' + index).find("option[value='" + model + "']").length){
            $('.model' + index).val(model).trigger('change')
        }else{ 
            var newOption = new Option(modelName, model, true, true)
            $('.model' + index).append(newOption).trigger('change')
        }

        $('#modal-new-orderLine').modal('hide')
    })

    $('#modal-new-orderLine').on('hidden.bs.modal', function (e) {
        $(".product").val('').trigger('change')
        $(".model").val('').trigger('change')
        $("#amount").val('')
    });
})