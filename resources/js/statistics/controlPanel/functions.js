var pendingID = null;

var ivaTypes = null;

/**
 * Obtiene los tipos de IVA
 */
function getIvaTypes(){
    $.ajax({
        url : uri + 'core/iva/functions.php',
        method : 'POST',
        data: {
            type: 'get',
            ivaType : 1
        },
        success : function(data){                
            ivaTypes = $.parseJSON(data)

            // Delete iva 0%
            // ivaTypes.shift();

            // Draw thead modals
            setTheadModalInvoicesPaid();
            setTheadModalInvoicesPaidPending();
            setTheadModalFacturacion();
        }
    })
}

/**
 * Genera la cabecera para la tabla facturación segun los tipos de IVA
 */
function setTheadModalFacturacion(){

    var tableHead =
        '<tr>'+
        '    <th class="text-center" style="vertical-align: middle;">Nº EXP.</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Cliente</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Difunto</th>'
    ;
    $.each(ivaTypes, function(index, ivaType){
        tableHead += '<th class="text-center" style="vertical-align: middle;">Base<br>'+ivaType.percentage+' %</th>'
    })
    tableHead +=
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Base</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Suplidos</th>'
    ;

    $.each(ivaTypes, function(index, ivaType){
        tableHead += '<th class="text-center" style="vertical-align: middle;"> ' + getIvaLabel() + '<br> ' + ivaType.percentage +' %</th>'
    })
    tableHead +=
        '    <th class="text-center" style="vertical-align: middle;">Total<br>' + getIvaLabel() + '</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Neto</th>'+
        // '    <th class="text-center" style="vertical-align: middle;">Fecha<br> emisión</th>'+
        // '    <th class="text-center" style="vertical-align: middle;">Fecha<br> cobro</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Factura/s</th>'+
        '</tr>'
    ;

    $("#modal-list-facturacion #listFacturacion thead").empty().append(tableHead);
}

/**
 * Genera la cabecera para la tabla de facturas pagadas o pagadas parcialmente segun los tipos de IVA
 */
function setTheadModalInvoicesPaid(){

    var tableHead =
        '<tr>'+
        '    <th class="text-center" style="vertical-align: middle;">Nº EXP.</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Nº factura</th>'
    ;
    $.each(ivaTypes, function(index, ivaType){
        tableHead += '<th class="text-center" style="vertical-align: middle;">Base <br>'+ivaType.percentage+' %</th>'
    })
    tableHead +=
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Base</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Suplidos</th>'
    ;

    $.each(ivaTypes, function(index, ivaType){
        tableHead += '<th class="text-center" style="vertical-align: middle;"> ' + getIvaLabel() + '<br> ' + ivaType.percentage +' %</th>'
    })
    tableHead +=
        '    <th class="text-center" style="vertical-align: middle;">Total<br> ' + getIvaLabel() + '</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Neto</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Cobrado</th>'+
        '    <th id="creationDate" class="text-center hide">Fecha<br> emisión</th>'+
        '       <th id="paymentDate" class="text-center hide">Fecha<br> cobro</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Factura</th>'+
        '</tr>'
    ;

    $("#modal-list-invoicesPaid #listPaidInvoices thead").empty().append(tableHead);
}

/**
 * Genera la cabecera para la tabla de facturas pendientes segun los tipos de IVA
 */
function setTheadModalInvoicesPaidPending(){
    var tableHead =
        '<tr>'+
        '    <th class="text-center" style="vertical-align: middle;">Nº EXP.</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Nº factura</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Fecha</th>'
    ;
    $.each(ivaTypes, function(index, ivaType){
        tableHead += '<th class="text-center" style="vertical-align: middle;">Base<br> '+ivaType.percentage+' %</th>'
    })
    tableHead +=
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Base</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Suplidos</th>'
    ;

    $.each(ivaTypes, function(index, ivaType){
        tableHead += '<th class="text-center" style="vertical-align: middle;"> ' + getIvaLabel() + '<br> ' + ivaType.percentage +' %</th>'
    })
    tableHead +=
        '    <th class="text-center" style="vertical-align: middle;">Total<br> ' + getIvaLabel() + '</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Neto</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Total<br> Cobrado</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Cobrar</th>'+
        '    <th class="text-center" style="vertical-align: middle;">Factura</th>'+
        '</tr>'
    ;

    $("#modal-list-invoicesPaid-pending #listPaidInvoicesPending thead").empty().append(tableHead);
}

/**
 * Idioma del select2
 */
var langSelect2 = {
    inputTooShort: function(args) {
        return "Escribir ..."
    },
    inputTooLong: function(args) {
        return "Término demasiado largo"
    },
    errorLoading: function() {
        return "No hay resultados"
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
        return "No hay resultados"
    }
}

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
function formatDataMortuaries(data){
    if(data.isYourOwn == 0){
        return '<div id="' + data.id + '">' + data.text + '</div>'
    }else{
        return '<div id="' + data.id + '" style="color: green">' + data.text + '</div>'
    }
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
    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
    $('#backLink').click(function(event) {
        event.preventDefault()
        
        if(document.referrer == ''){
            history.back(1);
        }else{
            if(window.location.href == document.referrer){
                history.back(1);
            }else{
                window.location.href = document.referrer;
            }
        }
    })

    getIvaTypes();

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

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

    // SELECT
    $.fn.select2.defaults.set("width", "100%")

    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    // COLLAPSE
    $('.btn-filters').click(function(){
        if($('.btn-filters i').hasClass('fa-angle-down')){
            $('.btn-filters i').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('.btn-filters').removeClass('btn-primary').addClass('btn-warning');
        }else{
            $('.btn-filters i').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('.btn-filters').removeClass('btn-warning').addClass('btn-primary');
        }
    });

    $('.btn-filters').click()
    //Sticky Table Header Lineas de Pedido
    $('#summaryTable').stickyTableHeaders();
    $('#summaryTable').stickyTableHeaders({fixedOffset: $('.main-header')});
    $(window).trigger('resize.stickyTableHeaders');

    // Filtros
    // Fecha
    $('#datePeriod').change(function(){
        if($(this).prop('checked')){
            $('#dateSince').attr('disabled', false)
            $('#dateUntil').attr('disabled', false)
        }else{
            $('#dateSince').attr('disabled', true)
            $('#dateUntil').attr('disabled', true)
        }
    })

    // Tanatorio
    $('#mortuaryCheck').change(function(){
        if($(this).prop('checked')){
            $('#mortuary').attr('disabled', false)
        }else{
            $('#mortuary').attr('disabled', true)

            $("#mortuary").val(null).trigger('change');
        }
    })

    $('#mortuary').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/statistics/controlPanel/getMortuaries.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || ""
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return {
                            text: item.name,
                            id: item.mortuaryID,
                            isYourOwn: item.isYourOwn
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataMortuaries,
        templateSelection: formatDataMortuaries
    })

    /** **************** Cliente **************** */
    $('#clientTypeCheck').change(function(){
        if($(this).prop('checked')){
            $('#clientType').attr('disabled', false);
            $('#clientCheck').attr('disabled', false);
        }else{
            $('#clientType').attr('disabled', true)
            $('#clientCheck').attr('disabled', true)
            $("#clientType").val(null).trigger('change');

            if($('#clientCheck').prop('checked')){
                $('#clientCheck').prop('checked', false).change()
            }
        }
    })

    $('#clientCheck').change(function(){
        if($(this).prop('checked')){
            $('#client').attr('disabled', false)
        }else{
            $('#client').attr('disabled', true)
            $("#client").val(null).trigger('change');
        }
    })

    $('#clientType').select2({
        containerCssClass: 'select2-clientType',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/clients/getClientTypes.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
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
        templateSelection: formatData
    })

    $('#clientType').change(function(){
        $('#client').select2({
            containerCssClass: 'select2-client',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/clients/getClients.php?clientType=' + $('#clientType').val(),
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || ""
                    }
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data.items, function (item) {
                            return {
                                text: item.name,
                                id: item.clientID
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

        $('#client').val('').trigger('change')
    })

    $('#client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/clients/getClients.php?clientType=' + $('#clientType').val(),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.clientID
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

    $('#template').select2({
        containerCssClass: 'select2-template',
        language: langSelect2,
        placeholder: 'Seleccione una plantilla',
        allowClear: false,
        ajax: {
            url: uri + 'core/statistics/controlPanel/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.id
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

    $('#template').change(function(){
        var ID = $(this).val()

        $.ajax({
            url: uri + 'core/statistics/controlPanel/templates/read.php',
            method: 'POST',
            data: {
                ID : ID
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)
    
                var dataControlPanel = data.controlPanelData
                var clients = data.clients
                var clientTypes = data.clientTypes
                var mortuaries = data.mortuaries
    
                // PLANTILLA
                $('#templateName').val(dataControlPanel.name)

                $('#datePeriod').prop('checked', false).trigger('change');
                $('#mortuaryCheck').prop('checked', false).trigger('change');
                $('#clientTypeCheck').prop('checked', false).trigger('change');
                $('#clientCheck').prop('checked', false).trigger('change');
    
                // FECHA PERIODO
                if(dataControlPanel.datePeriod == '1'){
                    $('#datePeriod').prop('checked', true).trigger('change')
                    $('#dateSince').val(moment(dataControlPanel.dateSince, 'X').format('DD/MM/YYYY'))
                    $('#dateUntil').val(moment(dataControlPanel.dateUntil, 'X').format('DD/MM/YYYY'))
                }
    
                // TIPOS DE CLIENTES
                if(clientTypes != null){
                    $('#clientTypeCheck').prop('checked', true).trigger('change')
                    $.each(clientTypes, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#clientType').append(newOption).trigger('change')
                    })
                }
    
                // CLIENTES
                if(clients != null){
                    $('#clientCheck').prop('checked', true).trigger('change')
                    $.each(clients, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#client').append(newOption).trigger('change')
                    })
                }
    
                // MORTUARIES
                if(mortuaries != null){
                    $('#mortuaryCheck').prop('checked', true).trigger('change')
                    $.each(mortuaries, function(index, elem){
                        var newOption = new Option(elem.name, elem.id, true, true)
                        $('#mortuary').append(newOption).trigger('change')
                    })
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    // Listar expedientes
    $('#accountNumber').select2({
        containerCssClass: 'select2-expedients select2-invoiceAccountNumber',
        language: langSelect2,
        placeholder: 'Seleccionar entidad bancaria',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expenses/configuration/bankAccountsData.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: 10,
                    page: params.page                
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        var info;
                        $.ajax({
                            url: uri + "core/tools/decrypt.php",
                            data: {data : item.number},
                            type: 'POST',
                            async: false,
                            success: function(data){
                                info = $.parseJSON(data)
                            }
                        })
                        return{
                            text: item.bank + " - " + info,
                            id: item.ID,
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Consulta
    $('#filter').click(function(){
        var date = null
        var dateSince = null
        var dateUntil = null
        var mortuary = null
        var clientType = null
        var client = null

        var validate = 0
        if($('#datePeriod').prop('checked')){
            if(isEmpty($('#dateSince'))){
                validate++
            }else{
                if(isEmpty($('#dateUntil'))){
                    validate++
                }else{
                    if(moment($('#dateSince').val(), 'DD/MM/YYYY').format('X') >= moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')){
                        validate++
                        $('#dateError').removeClass('hide')
                    }else{
                        dateSince = moment($('#dateSince').val(), 'DD/MM/YYYY').format('X')
                        dateUntil = moment($('#dateUntil').val(), 'DD/MM/YYYY').format('X')
                        $('#dateError').addClass('hide')
                    }
                }
            }
        }else{
            dateSince = null
            dateUntil = null
        }

        if($('#mortuaryCheck').prop('checked')){
            mortuary = $('#mortuary').val()

            if(mortuary == null){
                $('.select2-' + $('#mortuary').attr('id')).addClass('validateError')
                $('.select2-' + $('#mortuary').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#mortuary').attr('id')).removeClass('validateError')
                $('.select2-' + $('#mortuary').attr('class')).removeClass('validateError')
            }
        }else{
            mortuary = null
            $('.select2-' + $('#mortuary').attr('id')).removeClass('validateError')
            $('.select2-' + $('#mortuary').attr('class')).removeClass('validateError')
        }

        if($('#clientTypeCheck').prop('checked')){
            clientType = $('#clientType').val()

            if(clientType == null){
                $('.select2-' + $('#clientType').attr('id')).addClass('validateError')
                $('.select2-' + $('#clientType').attr('class')).addClass('validateError')
                validate++
            }else{
                $('.select2-' + $('#clientType').attr('id')).removeClass('validateError')
                $('.select2-' + $('#clientType').attr('class')).removeClass('validateError')
            }
            if($('#clientCheck').prop('checked')){
                client = $('#client').val()

                if(client == null){
                    $('.select2-' + $('#client').attr('id')).addClass('validateError')
                    $('.select2-' + $('#client').attr('class')).addClass('validateError')
                    validate++
                }else{
                    $('.select2-' + $('#client').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#client').attr('class')).removeClass('validateError')
                }
            }else{
                client = null
            }
        }else{
            clientType = null
            client = null
            $('.select2-' + $('#client').attr('id')).removeClass('validateError')
            $('.select2-' + $('#client').attr('class')).removeClass('validateError')
            $('.select2-' + $('#clientType').attr('id')).removeClass('validateError')
            $('.select2-' + $('#clientType').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var data = {
                date: date,
                dateSince: dateSince,
                dateUntil: dateUntil,
                mortuary: mortuary,
                clientType: clientType,
                client: client
            }
            $.ajax({
                url: uri + 'core/statistics/functions.php',
                method: 'POST',
                data: {
                    type: 'getControlPanel',
                    data: data
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        $('#summaryBody').empty()
                        $('#cremationsBody').empty()
                        $('#cashflowBody').empty()
                        $('#accountBody').empty()

                        // Resumen facturación
                        if(data.summary == null){
                            $('#summaryBody').append(   
                                '   <tr>' +
                                '       <td colspan="14">'+
                                '           <div class="alert alert-warning">No hay datos para mostrar en esta tabla</div>' +
                                '       </td>' +
                                '   </tr>'
                            )
                            
                            $('#exportSummary').attr('disabled', true)
                        }else{
                            $("#summary-tables").empty();
                            $.each(data.summary, function(index, value){
                                var totalNumDeceased = 0;
                                var totalBI = 0;
                                var totalSupplieds = 0;
                                var totalFact = 0;
                                let totaliva = JSON.parse(JSON.stringify(ivaTypes));
                                $.each(totaliva, function(indexTotalIva, totalIvaIt){
                                    totaliva[indexTotalIva].total = 0;
                                })
                                var totaltotalIva = 0;
                                var totalFactTotal = 0;
                                var totalearned = 0;
                                var totalpending = 0;
                                var totalgrossMargin = 0;
                                var grossMarginShowTotal = 0;
                                var grossMarginShowTotalNum = 0;
                                var averageTimeShowTotalNum = 0;
                                var averageTimeShowTotal = 0;

                                var theadTable = 
                                    '<div class="table-responsive clearfix" id="summary-'+index+'" style="overflow-x:hidden">'+
                                    '   <h1><strong>'+value[1]+'</strong></h1>'+
                                    '   <div style="display:flex">'+
                                    '       <div class="float-left"><h4><strong>EXPEDIENTES</strong></h1></div>'+
                                    '       <div class="float-right" style="margin-left: 1%;padding-top:5px">'+
                                    '           <button type="button" class="btn btn-secondary exportSummaryMortuary" mortuary="'+index+'" style="margin-left: 1%">'+
                                    '               <i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO'+
                                    '           </button>'+
                                    '       </div>'+
                                    '   </div>'+
                                    '   <table class="table table-striped table-bordered" id="summaryTable" width="100%" cellspacing="0">'+
                                    '       <thead>'+
                                    '           <tr class="text-center">'+
                                    '               <th id="mortuaryNameTitleTD-'+index+'" class="text-center mortuaryNameTitle hide style="width:200px">'+value[1]+'</th>'+
                                    '               <th class="text-center" style="width:200px;vertical-align: middle;">CLIENTE</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;" width="100">EXPEDIENTES</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">BASE IMPONIBLE</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">SUPLIDOS</th>'+
                                    '               <th class="text-center"style="vertical-align: middle;">FACTURACIÓN</th>'
                                ;

                                $.each(ivaTypes, function(indexIvaType, ivaType){
                                    theadTable += '<th class="text-center" style="width:100px; vertical-align: middle;">' + getIvaLabel() + ' ' + ivaType.percentage +' %</th>'
                                })

                                theadTable +=
                                    '               <th class="text-center" style="width:100px; vertical-align: middle;">TOTAL ' + getIvaLabel() + '</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">FACTURADO TOTAL</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">COBRADO MES c/' + getIvaLabel() + '</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">PDTE. DE COBRO</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">MARGEN BRUTO</th>'+
                                    '               <th class="text-center" style="width:100px; vertical-align: middle;">% MARGEN MEDIO POR CLIENTE</th>'+
                                    '               <th class="text-center" style="width:100px; vertical-align: middle;">TIEMPO MEDIO DE COBRO</th>'+
                                    '               <th class="text-center hide" style="width:100px; vertical-align: middle;">TIPO</th>'+
                                    '               <th class="text-center hide" style="width:100px; vertical-align: middle;">CLIENTE</th>'+
                                    '           </tr>'+
                                    '       </thead>'+
                                    '       <tbody id="summaryBody-'+index+'"></tbody>'+
                                    '   </table>'+
                                    '   <br>'+
                                    '</div>'
                                ;

                                $("#summary-tables").append(theadTable);

                                $.each(value[2], function(index2, item){

                                    totalNumDeceased += parseInt(item[2]);
                                    totalBI += parseFloat(item[3]);
                                    totalSupplieds += parseFloat(item[4]);
                                    totalFact += parseFloat(item[5]);
                                    $.each(item[7], function(indexIvaType, ivaElem){
                                        var indexAux = totaliva.findIndex(p => p.percentage == ivaElem.percentage);
                                        if(indexAux !== -1){
                                            totaliva[indexAux]['total'] = parseFloat(totaliva[indexAux]['total']) + parseFloat(ivaElem.total);
                                        }
                                    })
                                    totaltotalIva += parseFloat(item[8]);
                                    totalFactTotal += parseFloat(item[9]);
                                    totalearned += parseFloat(item[10]);
                                    totalpending += parseFloat(item[11]);
                                    totalgrossMargin += parseFloat(item[12]);
                                    averageTimeShowTotal += parseFloat(item[13]);
                                    grossMarginShowTotal += parseFloat(item[14]);

                                    if(item[13] != "" && item[13] != null){
                                        averageTimeShowTotalNum++;
                                    }

                                    if(item[14] != "" && item[14] != null){
                                        grossMarginShowTotalNum++;
                                    }

                                    var expedientType = item[1].includes(' - Defunción') ? 1 : 3;

                                    var tbodyTable = 
                                        '   <tr>' +
                                        '       <td class="currentClientName" style="text-align:center;"><strong>' + item[1] + '</strong></td>' +
                                        '       <td id="numDeceased' + index2 + '" cost="'+value[0]+'" mortuaryName="'+value[1]+'" expedientType="' + expedientType + '" class="numDeceased text-center" style="cursor:pointer;text-decoration: underline" title="Defunciones de '+item[2]+'">' + item[2] + '</td>' +
                                        '       <td class="bi text-center">' + toFormatNumber(item[3].toFixed(2)) + ' € </td>' +
                                        '       <td class="supplieds text-center">' + toFormatNumber(item[4].toFixed(2)) + ' € </td>' +
                                        '       <td id="fact' + index + '" cost="'+value[0]+'" mortuaryName="'+value[1]+'" expedientType="' + expedientType + '" class="fact text-center" style="cursor:pointer; text-decoration: underline" title="Facturación de '+item[1]+'">' + toFormatNumber(item[5].toFixed(2)) + ' € </td>'
                                    ;

                                    $.each(item[7], function(indexIvaType, ivaElem){
                                        tbodyTable += ' <td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' € </td>';
                                    })

                                    tbodyTable += 
                                        '       <td class="totalIva text-center">' + toFormatNumber(item[8].toFixed(2)) + ' € </td>' +
                                        '       <td class="factTotal text-center">' + toFormatNumber(item[9].toFixed(2)) + ' € </td>' +
                                        '       <td id="earned' + index + '" cost="'+value[0]+'" mortuaryName="'+value[1]+'" expedientType="' + expedientType + '" class="earned text-center" style="cursor:pointer; text-decoration: underline" title="Facturas cobradas de '+item[1]+'">' + toFormatNumber(item[10].toFixed(2)) + ' € </td>' +
                                        '       <td id="pending' + index + '" cost="'+value[0]+'" mortuaryName="'+value[1]+'" expedientType="' + expedientType + '" class="pending text-center" style="cursor:pointer; text-decoration: underline" title="Facturas pendientes de '+item[1]+'">' + toFormatNumber(item[11].toFixed(2)) + ' € </td>' +
                                        '       <td class="grossMargin text-center">' + toFormatNumber(item[12].toFixed(2)) + ' € </td>' +
                                        '       <td class="grossMarginShow text-center">' + toFormatNumber(item[14].toFixed(2)) + ' %</td>' +
                                        '       <td class="averageTimeShow text-center">' + toFormatNumber(item[13].toFixed(2)) + ' días</td>' +
                                        '       <td class="type text-center hide">'+item[16]+'</td>' +
                                        '       <td class="client text-center hide">'+item[17]+'</td>' +
                                        '   </tr>'
                                    ;

                                    $('#summaryBody-'+index).append(tbodyTable);
                                });

                                if(averageTimeShowTotalNum > 0){
                                    averageTimeShowTotal = averageTimeShowTotal / averageTimeShowTotalNum;
                                }

                                if(grossMarginShowTotalNum > 0){
                                    grossMarginShowTotal = grossMarginShowTotal / grossMarginShowTotalNum;
                                }

                                // Totals footer
                                var tableFooter =
                                    '   <tr>' +
                                    '       <td class="currentClientName" style="text-align:center"><strong>TOTAL</strong></td>' +
                                    '       <td class="numDeceased text-center totalnumDeceased" id="numDeceased">' + totalNumDeceased + '</td>' +
                                    '       <td class="bi text-center">' + toFormatNumber(totalBI.toFixed(2)) + ' €</td>' +
                                    '       <td class="supplieds text-center">' + toFormatNumber(totalSupplieds.toFixed(2)) + ' €</td>' +
                                    '       <td class="fact text-center totalFactTotal">' + toFormatNumber(totalFact.toFixed(2)) + ' €</td>'
                                ;

                                $.each(totaliva, function(indexIvaType, ivaElem){
                                    tableFooter +=    '<td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' €</td>'
                                })

                                tableFooter +=
                                    '       <td class="totalIva text-center">' + toFormatNumber(totaltotalIva.toFixed(2)) + ' €</td>' +
                                    '       <td class="factTotal text-center">' + toFormatNumber(totalFactTotal.toFixed(2)) + ' €</td>' +
                                    '       <td class="earned text-center totalEarned">' + toFormatNumber(totalearned.toFixed(2)) + ' €</td>' +
                                    '       <td class="pending text-center totalPending">' + toFormatNumber(totalpending.toFixed(2)) + ' €</td>' +
                                    '       <td class="grossMargin text-center">' + toFormatNumber(totalgrossMargin.toFixed(2)) + ' €</td>' +
                                    '       <td class="grossMarginShow text-center">'+toFormatNumber(grossMarginShowTotal.toFixed(2)) +' %</td>' +
                                    '       <td class="averageTimeShow text-center">' + toFormatNumber(averageTimeShowTotal.toFixed(2)) + ' días</td>' +
                                    '       <td class="type text-center hide"></td>' +
                                    '       <td class="client text-center hide"></td>' +
                                    '   </tr>'
                                ;

                                $('#summaryBody-'+index).append(tableFooter)
                                $('#exportSummary').attr('disabled', false)
                            })
                        }

                        $.each(data.dataGraff, function(index, value){

                            if(data.summary[index] != undefined && data.summary[index][1] == value[0] ){

                                $("#summary-"+index).append(
                                    '<div class="row">'+
                                    '   <div class="col-xs-4"></div>'+
                                    '   <div class="col-xs-4">'+
                                    '       <canvas id="clientTypeGraff-'+index+'"></canvas>'+
                                    '       </div><div class="col-xs-4"></div>'+
                                    '</div>'
                                );

                                var labels = [];
                                var datas = [];
                                var colors = [];
                                $.each(value[1], function(index, item){
                                    if(item['total'] > 0){
                                        labels.push(item['name'])
                                        datas.push(item['total'].toFixed(2))
                                        colors.push('#'+(Math.random()*0xFFFFFF<<0).toString(16))
                                    }
                                })

                                var dataGraff = {
                                    labels: labels,
                                    datasets: [{
                                        data: datas,
                                        backgroundColor: colors
                                    }]
                                }
                                
                                new Chart(document.getElementById("clientTypeGraff-"+index), {
                                    type: 'pie',
                                    data: dataGraff,
                                    options: {
                                        title: {
                                            display: true,
                                            text: value[0]
                                        }
                                    }
                                })

                                $("#summary-"+index).append(
                                    '<div class="text-center">'+
                                    '   <button class="btn btn-default exportGraff" summary="'+index+'" id="exportGraff-"'+index+'" style="margin-top:5px">'+
                                    '       <i class="fa fa-file-excel-o"></i> EXPORTAR GRÁFICO'+
                                    '   </button>'+
                                    '</div>'
                                )
                            }
                        })

                        $('.exportGraff').click(function(){
                            let index = $(this).attr("summary")
                            var canvas = document.getElementById("clientTypeGraff-"+index)
                            var dataExport = canvas.toDataURL("image/png", 1.0);
                    
                            var img = document.createElement('img');
                            img.src = dataExport;
                    
                            var a = document.createElement('a');
                            a.setAttribute("download", "defunciones_por_cliente.png");
                            a.setAttribute("href", dataExport);
                            a.appendChild(img);
                            a.click()
                            a.remove()
                        })

                        $('.content').css('margin-bottom', '30px')

                        // Cremaciones
                        if(data.cremations == null){
                            $('#cremationsBody').append(
                                '   <tr>' +
                                '       <td colspan="4">'+
                                '           <div class="alert alert-warning">No hay datos para mostrar en esta tabla</div>' +
                                '       </td>' +
                                '   </tr>'
                            )
                            
                            $('#exportCremations').attr('disabled', true)
                        }else{
                            $.each(data.cremations, function(index, value){

                                var totalNumCremations = 0;
                                var totalFact = 0;
                                var grossMarginShowTotal = 0;
                                var grossMarginShowTotalNum = 0;

                                $("#summary-"+index).append(
                                    '<div class="table-responsive clearfix" id="cremations-'+index+'">'+
                                    '   <div style="display:flex">'+
                                    '       <div class="float-left"><h4><strong>CREMACIONES</strong></h1></div>'+
                                    '       <div class="float-right" style="margin-left: 1%;padding-top:5px"><button type="button" class="btn btn-secondary exportCremationsMortuary" mortuary="'+index+'" style="margin-left: 1%"><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button></div>'+
                                    '   </div>'+
                                    '   <table class="table table-striped table-bordered" id="summaryTable" width="100%" cellspacing="0">'+
                                    '       <thead>'+
                                    '           <tr class="text-center">'+
                                    '               <th class="text-center" style="vertical-align: middle;">CLIENTE</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">Nº CREMACIONES</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">FACTURACIÓN TOTAL</th>'+
                                    '               <th class="text-center" style="vertical-align: middle;">MARGEN MEDIO</th>'+
                                    '               <th class="text-center hide" style="vertical-align: middle;">TIPO</th>'+
                                    '               <th class="text-center hide" style="vertical-align: middle;">CLIENTE</th>'+
                                    '           </tr>'+
                                    '       </thead>'+
                                    '       <tbody id="cremationsBody-'+index+'"></tbody>'+
                                    '   </table>'+
                                    '   <br>'+
                                    '</div>'
                                );

                                $.each(value[2], function(index2, elem){

                                    totalNumCremations += elem[2];
                                    totalFact += elem[3];

                                    var totalNumCremationTdStyle = ""; 
                                    if(parseInt(elem[2]) > 0){
                                        totalNumCremationTdStyle = 'style="cursor:pointer; text-decoration: underline"';
                                    }

                                    var factCremation = '-';
                                    var factCremationTdStyle = ""; 
                                    if(parseFloat(elem[3]) > 0){
                                        factCremation = toFormatNumber(elem[3].toFixed(2)) + ' €';
                                        factCremationTdStyle = 'style="cursor:pointer; text-decoration: underline"'
                                    }

                                    var grossMargin = '-';
                                    if(parseFloat(elem[4]) > 0 && parseFloat(elem[5]) > 0){
                                        grossMargin = parseFloat(elem[5]) / parseFloat(elem[4]) * 100;
                                        grossMarginShowTotal += parseFloat(grossMargin);
                                        grossMargin = toFormatNumber(grossMargin.toFixed(2)) + ' %'
                                        grossMarginShowTotalNum++;
                                    }

                                    var expType = '1'
                                    if(elem[1].includes('Varios')){
                                        expType = '3';
                                    }

                                    $('#cremationsBody-'+index).append(
                                        '   <tr>' +
                                        '       <td class="currentClientNameExport centered"><strong>' + elem[1] + '<strong></td>' +
                                        '       <td class="numCremations numCremationsExport centered" '+totalNumCremationTdStyle+'  cost="'+value[0]+'" mortuaryName="'+value[1]+'" expedientType="'+expType+'">' + elem[2] + '</td>' +
                                        '       <td class="factExport centered factCremation" '+factCremationTdStyle+' cost="'+value[0]+'" mortuaryName="'+value[1]+'">' + factCremation + '</td>' +
                                        '       <td class="grossMarginShowExport centered">' +grossMargin + '</td>' +
                                        '       <td class="type hide">' +elem[6] + '</td>' +
                                        '       <td class="client hide">' +elem[7] + '</td>' +
                                        '   </tr>')
                                })

                                if(grossMarginShowTotalNum > 0){
                                    grossMarginShowTotal = grossMarginShowTotal / grossMarginShowTotalNum;
                                }
                                $('#cremationsBody-'+index).append(
                                    '   <tr>' +
                                    '       <td class="currentClientNameExport centered"><strong>TOTAL</strong></td>' +
                                    '       <td class="numCremations centered numCremationsExport totalnumCremations">' + totalNumCremations + '</td>' +
                                    '       <td class="factExport centered totalFactExport">' + toFormatNumber(totalFact.toFixed(2)) + ' €</td>' +
                                    '       <td class="grossMarginShowExport centered">' + grossMarginShowTotal.toFixed(2) + '%</td>' +
                                    '   </tr>'
                                )
                                $('#exportCremations').attr('disabled', false)
                            })

                            $('.exportCremationsMortuary').click(function(){
                                var cremations = new Array

                                var mortuary = $(this).attr("mortuary");
                                cremations.push([$('#mortuaryNameTitleTD-'+mortuary).text()])
                                cremations.push(['Cremaciones'])
                                cremations.push([
                                    'Cliente',
                                    'Nº cremaciones',
                                    'Facturación',
                                    'Margen medio'
                                ])

                                $('#cremationsBody-'+mortuary+' > tr').each(function(index, elem){
                                    var currentClientNameCremation = $(this).find('.currentClientNameExport').text()
                                    var numCremationsCremation = $(this).find('.numCremations').text()
                                    var factCremation = $(this).find('.factCremation').text()
                                    var grossMarginShowCremation = $(this).find('.grossMarginShowExport').text()
            
                                    cremations.push([
                                        currentClientNameCremation,
                                        numCremationsCremation,
                                        factCremation,
                                        grossMarginShowCremation
                                    ])
                                })

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'exportControlPanelCremations',
                                        data: cremations
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                                
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                                
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            })
                        }

                        //TOTAL EXPEDIENTES
                        totalValuesExpedients = [];
                        $.each(data.summary, function(index, value){
                            var indexTotal = 7;
                            $.each(value[2], function(index2, item){

                                if(item[0] == '-'){
                                    var newIndex = indexTotal;
                                    indexTotal++;
                                }else{
                                    var newIndex = item[0]-1;
                                }

                                if(index == 0){ //Firts cost center
                                    totalValuesExpedients[newIndex] = [item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[16], item[17]];
                                }else{

                                    // Get ivas
                                    var totalIvasAux = totalValuesExpedients[newIndex][6];
                                    $.each(item[7], function(indexIvaType, ivaElem){
                                        var indexAux = totalIvasAux.findIndex(p => p.percentage == ivaElem.percentage);
                                        if(indexAux !== -1){
                                            totalIvasAux[indexAux]['total'] = parseFloat(totalIvasAux[indexAux]['total']) + parseFloat(ivaElem.total);
                                        }
                                    })


                                    // Average time
                                    var averageTimeTotal = totalValuesExpedients[newIndex][12];
                                    if(item[2] > 0 && item[13] > 0){
                                        averageTimeTotal += item[13];
                                        averageTimeTotal = averageTimeTotal / 2;
                                    }

                                    // Gross margin percentage
                                    var grossMargin = totalValuesExpedients[newIndex][13];
                                    if(item[2] > 0 && item[14] > 0){
                                        grossMargin += item[14];
                                        grossMargin = grossMargin / 2;
                                    }

                                    totalValuesExpedients[newIndex] = 
                                        [
                                            item[1], 
                                            totalValuesExpedients[newIndex][1] + item[2],
                                            totalValuesExpedients[newIndex][2] + item[3],
                                            totalValuesExpedients[newIndex][3] + item[4],
                                            totalValuesExpedients[newIndex][4] + item[5],
                                            totalValuesExpedients[newIndex][5],
                                            totalIvasAux,
                                            totalValuesExpedients[newIndex][7] + item[8],
                                            totalValuesExpedients[newIndex][8] + item[9],
                                            totalValuesExpedients[newIndex][9] + item[10],
                                            totalValuesExpedients[newIndex][10] + item[11],
                                            totalValuesExpedients[newIndex][11] + item[12],
                                            averageTimeTotal,
                                            grossMargin,
                                            item[16],
                                            item[17],
                                        ];
                                }
                            })
                        })

                        var tableThead = 
                            '<div class="table-responsive clearfix" style="overflow-x:hidden">'+
                            '   <h1><strong>TOTAL</strong></h1>'+
                            '   <table class="table table-striped table-bordered" id="totalTable" width="100%" cellspacing="0">'+
                            '       <thead>'+
                            '           <tr class="text-center">'+
                            '               <th class="text-center" style="width:200px; vertical-align: middle;">CLIENTE</th>'+
                            '               <th class="text-center" width="100" style="vertical-align: middle;">EXPEDIENTES</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">BASE IMPONIBLE</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">SUPLIDOS</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">FACTURACIÓN</th>'
                        ;

                        $.each(ivaTypes, function(indexIvaType, ivaType){
                            tableThead += ' <th class="text-center" style="width:100px; vertical-align: middle;">' + getIvaLabel() + ' ' + ivaType.percentage +' %</th>'
                        })

                        tableThead += 
                            '               <th class="text-center" style="width:100px; vertical-align: middle;">TOTAL ' + getIvaLabel() + '</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">FACTURADO TOTAL</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">COBRADO MES c/' + getIvaLabel() + '</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">PDTE. DE COBRO</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">MARGEN BRUTO</th>'+
                            '               <th class="text-center" style="width:100px; vertical-align: middle;">% MARGEN MEDIO POR CLIENTE</th>'+
                            '               <th class="text-center" style="width:100px; vertical-align: middle;">TIEMPO MEDIO DE COBRO</th>'+
                            '           </tr>'+
                            '       </thead>'+
                            '       <tbody id="summaryBodyTotal"></tbody>'+
                            '   </table>'+
                            '   <br>'+
                            '</div>'
                        ;

                        $("#summary-tables").append(tableThead);

                        var totalNumDeceased = 0;
                        var totalBI = 0;
                        var totalSupplieds = 0;
                        var totalFact = 0;
                        let totaliva = JSON.parse(JSON.stringify(ivaTypes));
                        $.each(totaliva, function(indexTotalIva, totalIvaIt){
                            totaliva[indexTotalIva].total = 0;
                        })
                        var totaltotalIva = 0;
                        var totalFactTotal = 0;
                        var totalearned = 0;
                        var totalpending = 0;
                        var totalgrossMargin = 0;
                        var totalGrossMarginShow = 0;
                        var totalGrossMarginShowNum = 0;
                        var totalAverageTimeShow = 0;
                        var totalAverageTimeShowNum = 0;
                        
                        totalValuesExpedients = totalValuesExpedients.filter(function (el) {
                            return el != null;
                        });

                        $.each(totalValuesExpedients, function(index, item){
                            totalNumDeceased += item[1];
                            totalBI += item[2];
                            totalSupplieds += item[3];
                            totalFact += item[4];
                            $.each(item[6], function(indexIvaType, ivaElem){
                                var indexAux = totaliva.findIndex(p => p.percentage == ivaElem.percentage);
                                if(indexAux !== -1){
                                    totaliva[indexAux]['total'] += parseFloat(ivaElem.total);
                                }
                            })
                            totaltotalIva += item[7];
                            totalFactTotal += item[8];
                            totalearned += item[9];
                            totalpending += item[10];
                            totalgrossMargin += item[11];
                           
                            var averageTimeShowTotal = item[1] > 0 ? item[12] : 0
                            if(item[1] > 0 && item[12] > 0){
                                totalAverageTimeShowNum++;
                            }

                            var grossMarginShowTotal = item[1] > 0 ? item[13] : 0
                            if(item[1] > 0 && item[13] > 0){
                                totalGrossMarginShowNum++;
                            }


                            totalAverageTimeShow += averageTimeShowTotal;
                            totalGrossMarginShow += grossMarginShowTotal;

                            var expedientType = item[0].includes(' - Defunción') ? 1 : 3

                            var tableBody = 
                               '   <tr>' +
                                '       <td class="currentClientNameTotal" style="text-align:center;"><strong>' + item[0] + '</strong></td>' +
                                '       <td class="numDeceasedTotal text-center numDeceased" style="cursor:pointer;text-decoration: underline" mortuaryName="Totales" type="'+item[14]+'" client="'+item[15]+'" expedientType="' + expedientType + '">' + item[1] + '</td>' +
                                '       <td class="biTotal text-center">' + toFormatNumber(item[2].toFixed(2)) + ' € </td>' +
                                '       <td class="suppliedsTotal text-center">' + toFormatNumber(item[3].toFixed(2)) + ' € </td>' +
                                '       <td class="factTotal text-center fact numDeceasedTotal" style="cursor:pointer;text-decoration: underline" mortuaryName="Totales" type="'+item[14]+'" client="'+item[15]+'" expedientType="' + expedientType + '">' + toFormatNumber(item[4].toFixed(2)) + ' € </td>'
                            ;

                            $.each(item[6], function(indexIvaType, ivaElem){
                                tableBody += ' <td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' € </td>';
                            })

                            tableBody += 
                                '       <td class="totalIvaTotal text-center">' + toFormatNumber(item[7].toFixed(2)) + ' € </td>' +
                                '       <td class="factTotalTotal text-center">' + toFormatNumber(item[8].toFixed(2)) + ' € </td>' +
                                '       <td class="earnedTotal text-center earned" style="cursor:pointer;text-decoration: underline" mortuaryName="Totales" type="'+item[14]+'" client="'+item[15]+'" expedientType="' + expedientType + '">' + toFormatNumber(item[9].toFixed(2)) + ' € </td>' +
                                '       <td class="pendingTotal text-center pending" style="cursor:pointer;text-decoration: underline" mortuaryName="Totales" type="'+item[14]+'" client="'+item[15]+'" expedientType="' + expedientType + '">' + toFormatNumber(item[10].toFixed(2)) + ' € </td>' +
                                '       <td class="grossMarginTotal text-center">' + toFormatNumber(item[11].toFixed(2)) + ' € </td>' +
                                '       <td class="grossMarginShowTotal text-center">' + toFormatNumber(grossMarginShowTotal.toFixed(2)) + ' %</td>' +
                                '       <td class="averageTimeShowTotal text-center">' + toFormatNumber(averageTimeShowTotal.toFixed(2)) + ' días</td>' +
                                '   </tr>'
                            ;

                            $('#summaryBodyTotal').append(tableBody)
                        })

                        totalGrossMarginShow = totalGrossMarginShowNum > 0 ? totalGrossMarginShow / totalGrossMarginShowNum : 0
                        totalAverageTimeShow = totalAverageTimeShowNum > 0 ? totalAverageTimeShow / totalAverageTimeShowNum : 0

                        // Totals footer
                        var tableFooter =
                            '   <tr>' +
                            '       <td class="currentClientNameTotal" style="text-align:center"><strong>TOTAL</strong></td>' +
                            '       <td class="numDeceasedTotal text-center totalnumDeceased" id="numDeceased" cost="" mortuaryName="">' + totalNumDeceased + '</td>' +
                            '       <td class="biTotal text-center">' + toFormatNumber(totalBI.toFixed(2)) + ' €</td>' +
                            '       <td class="suppliedsTotal text-center">' + toFormatNumber(totalSupplieds.toFixed(2)) + ' €</td>' +
                            '       <td class="factTotal text-center totalFactTotal">' + toFormatNumber(totalFact.toFixed(2)) + ' €</td>'
                        ;

                        $.each(totaliva, function(indexIvaType, ivaElem){
                            tableFooter +=    '<td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' €</td>'
                        })

                        tableFooter +=
                            '       <td class="totalIvaTotal text-center">' + toFormatNumber(totaltotalIva.toFixed(2)) + ' €</td>' +
                            '       <td class="factTotalTotal text-center">' + toFormatNumber(totalFactTotal.toFixed(2)) + ' €</td>' +
                            '       <td class="earnedTotal text-center totalEarned">' + toFormatNumber(totalearned.toFixed(2)) + ' €</td>' +
                            '       <td class="pendingTotal text-center totalPending">' + toFormatNumber(totalpending.toFixed(2)) + ' €</td>' +
                            '       <td class="grossMarginTotal text-center">' + toFormatNumber(totalgrossMargin.toFixed(2)) + ' €</td>' +
                            '       <td class="grossMarginShowTotal text-center">'+toFormatNumber(totalGrossMarginShow.toFixed(2)) +' %</td>' +
                            '       <td class="averageTimeShowTotal text-center">' + toFormatNumber(totalAverageTimeShow.toFixed(2)) + ' días</td>' +
                            '   </tr>'
                        ;

                        $('#summaryBodyTotal').append(tableFooter)
                        
                        $('.numDeceased').click(function(){

                            if(!$(this).hasClass('totalnumDeceased')){

                                var client = null;
                                var type = null;
                                if($(this).closest("tr").find(".client").text() != '' && $(this).closest("tr").find(".client").text() != null){
                                    client = $(this).closest("tr").find(".client").text();
                                    type = "";
                                }else{
                                    client = "";
                                    type = $(this).closest("tr").find(".type").text();
                                }
                                var costCenter = $(this).attr("cost")
                                var mortuaryName = $(this).attr("mortuaryName")
                                var expedientType = $(this).attr("expedientType")
                                var isTotals = $(this).hasClass('numDeceasedTotal') ? 1 : 0;
                              
                                //MODAL FROM TOTALS
                                if((client == null || client == "")  && (type == null || type == "")){
                                    if($(this).attr("type") != 'OTROS' && $(this).attr("type") != null){
                                        client = "";
                                        type = $(this).attr("type");
                                    }else{
                                        type = "";
                                        client = $(this).attr("client");
                                    }
                                }

                                var info = {
                                    client: client,
                                    type: type,
                                    costCenter: costCenter == undefined ? $('#mortuary').val() : costCenter,
                                    date: date,
                                    dateSince: ($("#datePeriod").prop('checked') ? dateSince : null),
                                    dateUntil: ($("#datePeriod").prop('checked') ? dateUntil : null),
                                    clientTypeFilter : ($("#clientTypeCheck").prop('checked') ? $("#clientType").val() : null),
                                    clientFilter : ($("#clientCheck").prop('checked') ? $("#client").val() : null),
                                    expedientType: expedientType,
                                    isTotals: isTotals
                                }

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getControlPanelExpedients',
                                        data: info
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            if(data != null){
                                                $('#listExpedients tbody').empty();
                                                $('#modal-list-expedients #modalType').empty();
                                                $('#modal-list-expedients #modalType').html('Expedientes de ');
                                                if(client == ""){
                                                    title = "";
                                                    switch(type){
                                                        case 'PD':
                                                            title = "Particulares - Defunciones";
                                                        break;
                                                        case 'ED':
                                                            title = "Empresas - Defunciones";
                                                        break;
                                                        case 'SD':
                                                            title = "Seguros - Defunciones";
                                                        break;
                                                        case 'PV':
                                                            title = "Particulares - Varios";
                                                        break;
                                                        case 'EV':
                                                            title = "Empresas - Varios";
                                                        break;
                                                        case 'SV':
                                                            title = "Seguros - Varios";
                                                        break;
                                                    }
                                                    $('#modal-list-expedients #mortuaryName').html(mortuaryName);
                                                    $('#modal-list-expedients #titleName').html(title);

                                                }else{
                                                    if(data[0].clientSurname != null && data[0].clientSurname != ''){
                                                        $('#modal-list-expedients #titleName').html(data[0].clientName + " " + data[0].clientSurname);
                                                    }else{
                                                        $('#modal-list-expedients #titleName').html(data[0].clientName);
                                                    }
                                                    $('#modal-list-expedients #mortuaryName').html(mortuaryName);
                                                }

                                                $("#exportSummaryExpedients").attr("client", client)

                                                $.each(data, function(index, elem){
                                                    $('#listExpedients tbody').append(  
                                                        '   <tr>' +
                                                        '       <td align="center" class="numberExpedient hide">' + elem.number + '</td>' +
                                                        '       <td align="center"><a href="' + uri + 'editar-expediente' + (elem.tpv == '1' ? '-tpv' : '') + '/' + elem.expedientID + '" target="_blank" style="text-decoration: underline" title="Ver expediente '+elem.number+'"><strong>' + elem.number + '</strong></a></td>' +
                                                        '       <td align="center" class="typeExpedient">' + elem.expedientType +'</td>' +
                                                        '       <td align="center" class="requestDateExpedient">' + moment(elem.requestDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + '</td>' +
                                                        '       <td align="center" class="deceasedExpedient">' + elem.deceasedName + ' ' + elem.deceasedSurname + '</td>' +
                                                        '       <td align="center" class="clientExpedient">' + elem.clientName + ' ' + elem.clientSurname + '</td>' +
                                                        '       <td align="center" class="clientTypeExpedient">' + elem.clientType +'</td>' +
                                                        '   </tr>')
                                                })
                                                $('#modal-list-expedients').modal('show')
                                            }else{
                                                alert('¡No hay expedientes!')
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        })
                        
                        $('.fact').click(function(){

                            if(!$(this).hasClass('totalFactTotal')){

                                var client = null;
                                var type = null;
                                var costCenter = null;
                                if($(this).closest("tr").find(".client").text() != '' && $(this).closest("tr").find(".client").text() != null){
                                    client = $(this).closest("tr").find(".client").text();
                                    type = "";
                                }else{
                                    client = "";
                                    type = $(this).closest("tr").find(".type").text();
                                }
                                var costCenter = $(this).attr("cost")
                                var mortuaryName = $(this).attr("mortuaryName");
                                var expedientType = $(this).attr("expedientType")

                                //MODAL FROM TOTALS
                                if((client == null || client == "")  && (type == null || type == "")){
                                    if($(this).attr("type") != 'OTROS' && $(this).attr("type") != null){
                                        client = "";
                                        type = $(this).attr("type");
                                    }else{
                                        type = "";
                                        client = $(this).attr("client");
                                    }
                                }

                                var isTotals = $(this).hasClass('numDeceasedTotal') ? 1 : 0;

                                var info = {
                                    client: client,
                                    type: type,
                                    costCenter: costCenter == undefined ? $('#mortuary').val() : costCenter,
                                    date: date,
                                    dateSince: ($("#datePeriod").prop('checked') ? dateSince : null),
                                    dateUntil: ($("#datePeriod").prop('checked') ? dateUntil : null),
                                    mortuary: ($("#mortuaryCheck").prop('checked') ? mortuary : null),
                                    clientTypeFilter : ($("#clientTypeCheck").prop('checked') ? $("#clientType").val() : null),
                                    clientFilter : ($("#clientCheck").prop('checked') ? $("#client").val() : null),
                                    expedientType: expedientType,
                                    isTotals: isTotals
                                }

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getControlPanelFacturacion',
                                        data: info
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            if(data != null){
                                                $('#listFacturacion tbody').empty();
                                                $('#modal-list-facturacion #modalType').empty();
                                                $('#modal-list-facturacion #modalType').html('Facturación de ');
                                                if(client == ""){
                                                    title = "";
                                                    switch(type){
                                                        case 'PD':
                                                            title = "Particulares - Defunciones";
                                                        break;
                                                        case 'ED':
                                                            title = "Empresas - Defunciones";
                                                        break;
                                                        case 'SD':
                                                            title = "Seguros - Defunciones";
                                                        break;
                                                        case 'PV':
                                                            title = "Particulares - Varios";
                                                        break;
                                                        case 'EV':
                                                            title = "Empresas - Varios";
                                                        break;
                                                        case 'SV':
                                                            title = "Seguros - Varios";
                                                        break;
                                                    }
                                                    $('#modal-list-facturacion #mortuaryName').html(mortuaryName);
                                                    $('#modal-list-facturacion #titleName').html(title);
                                                }else{
                                                    if(data[0][0].clientSurname != null && data[0][0].clientSurname != ''){
                                                        $('#modal-list-facturacion #titleName').html(data[0][0].clientName + " " + data[0][0].clientSurname);
                                                    }else{
                                                        $('#modal-list-facturacion #titleName').html(data[0][0].clientName);
                                                    }
                                                    $('#modal-list-facturacion #mortuaryName').html(mortuaryName);
                                                }

                                                let totalFacBis = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacBis, function(indexTotalIva, totalIvaIt){
                                                    totalFacBis[indexTotalIva].total = 0;
                                                })
                                                var totalFacBi = 0.0;
                                                var totalFacSu = 0.0;
                                                let totalFacIvas = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacIvas, function(indexTotalIva, totalIvaIt){
                                                    totalFacIvas[indexTotalIva].total = 0;
                                                })
                                                var totalFacIva = 0.0;
                                                var totalFactTotal = 0.0;

                                                $.each(data, function(index, elem){
                                                        
                                                    // Calculate totals
                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        var indexAux = totalFacBis.findIndex(p => p.percentage == baseElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacBis[indexAux]['total'] += parseFloat(baseElem.total);
                                                        }
                                                    })
                                                    totalFacBi += parseFloat((elem[0].bi));
                                                    totalFacSu += parseFloat((elem[0].su));
                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        var indexAux = totalFacIvas.findIndex(p => p.percentage == ivaElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacIvas[indexAux]['total'] += parseFloat(ivaElem.total);
                                                        }
                                                    })
                                                    totalFacIva += parseFloat((elem[0].totalIva));
                                                    totalFactTotal += parseFloat((elem[0].factTotal));

                                                    // if(elem[0].paymentDate != '' && elem[0].paymentDate != null){
                                                    //     paymentDate = moment(elem[0].paymentDate, 'X').format('DD/MM/YYYY')
                                                    // }else{
                                                    //     paymentDate = '-'
                                                    // }

                                                    // Draw body
                                                    var tbodyTable = 
                                                        '   <tr>' +
                                                        '       <td align="center" class="hide numExp">' + elem[0].number + '</td>' +
                                                        '       <td align="center" style="width:100px"><a href="' + uri + 'editar-expediente' + (elem[0].tpv == '1' ? '-tpv' : '') + '/' + elem[0].expedientID + '" target="_blank" style="text-decoration: underline" title="Ver expediente '+elem[0].number+'"><strong>' + elem[0].number + '</strong></a></td>' +
                                                        '       <td align="center" class="clientExpedient">' + elem[0].clientName + ' ' + elem[0].clientSurname + '</td>' +
                                                        '       <td align="center" class="deceasedExpedient">' + elem[0].deceasedName + '</td>'
                                                    ;

                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        tbodyTable += ' <td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="baseTotal">' + toFormatNumber(parseFloat((elem[0].bi)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="supplieds">' + toFormatNumber(parseFloat((elem[0].su)).toFixed(2)) + ' €</td>'
                                                    ;

                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        tbodyTable += ' <td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="totalIva">' + toFormatNumber(parseFloat((elem[0].totalIva)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="totalNeto">' + toFormatNumber(parseFloat((elem[0].factTotal)).toFixed(2)) + ' €</td>' +
                                                        // '       <td align="center" class="dateInvoice">' + moment(elem[0].creationDate, 'X').format('DD/MM/YYYY') + '</td>' +
                                                        // '       <td align="center" class="datePaid">' + paymentDate + '</td>' +
                                                        '       <td align="center"><a class="btn-pdf" style="cursor:pointer" expedient="'+elem[0].expedientID+'" invoice="'+elem[0].invoiceID+'" title="Descargar PDF"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></td>' +
                                                        '   </tr>'
                                                    ;

                                                    $('#listFacturacion tbody').append(tbodyTable)
                                                })

                                                // Draw footers totals
                                                var tableFooter = 
                                                    '   <tr>' +
                                                    '       <td align="center" class="numExp" colspan="3"><strong>TOTAL</strong></td>'
                                                ;
                                                $.each(totalFacBis, function(indexIvaType, baseElem){
                                                    tableFooter +=    '<td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter +=
                                                    '       <td align="center" class="baseTotal">' + toFormatNumber(totalFacBi.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="supplieds">' + toFormatNumber(totalFacSu.toFixed(2)) + ' €</td>'
                                                ;
                                                $.each(totalFacIvas, function(indexIvaType, ivaElem){
                                                    tableFooter +=    '<td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter +=
                                                    '       <td align="center" class="totalIva">' + toFormatNumber(totalFacIva.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="totalNeto">' + toFormatNumber(totalFactTotal.toFixed(2)) + ' €</td>' +
                                                    // '       <td align="center" class="dateInvoice"> - </td>' +
                                                    // '       <td align="center" class="datePaid"> - </td>' +
                                                    '       <td align="center"> - </td>' +
                                                    '   </tr>'
                                                ;

                                                $('#listFacturacion tbody').append(tableFooter)

                                                $(".btn-pdf").click(function(){
                                                    var expedientID = $(this).attr('expedient')

                                                    var invoiceData = null;

                                                    $.ajax({
                                                        url: uri + "core/expedients/hiring/listInvoices.php",
                                                        data: {
                                                            expedient: expedientID
                                                        },
                                                        type: 'POST',
                                                        async: false,
                                                        success: function (data){
                                                            invoiceData = $.parseJSON(data)
                                            
                                                            if(invoiceData.length == 1){
                                                                window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoices/' + invoiceData[0]['ID'] + '/'+invoiceData[0]['number']+'.pdf', '_blank')
                                                            }else{
                                                                $.each(invoiceData, function(index, elem){

                                                                    var invoiceTypeHtml = '';
                                                                    if(elem.invoice_type == '1'){
                                                                        invoiceTypeHtml = '<span class="label label-success" style="font-size:90%">ORIGINAL</span>'
                                                                    }else if(elem.invoice_type == '2'){
                                                                        if(elem.rectified_type == '1'){
                                                                            invoiceTypeHtml = '<span class="label label-warning" style="font-size:90%">RECTIFICADA - SUSTITUCIÓN</span>'
                                                                        }else{
                                                                            invoiceTypeHtml = '<span class="label label-warning" style="font-size:90%">RECTIFICADA - DIFERENCIAS</span>'
                                                                        }
                                                                    }else{
                                                                        invoiceTypeHtml = '<span class="label label-danger" style="font-size:90%">ANULADA</span>'
                                                                    }

                                                                    $('#modal-invoices-history #tableBodyInvoices').append(
                                                                        '<tr>' +
                                                                            '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                                                            '<td style="text-align:center">'+ elem["number"] + '</td>' +
                                                                            '<td style="text-align:center">'+ invoiceTypeHtml + '</td>' +
                                                                            '<td style="text-align:center">'+ moment(elem["creationDate"], 'X').format('DD/MM/YYYY') + '</td>' +
                                                                            '<td style="text-align:center">'+ moment(elem["createDate"], 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + '</td>' +
                                                                            '<td style="text-align:center">'+ elem["user_info"] + '</td>' +
                                                                            "<td style='text-align:center'><a class='downloadFac btn' expedient='"+elem["expedient"]+"' invoice-id='"+elem["ID"]+"' invoice-num='"+elem["number"]+"'  title='Descargar'><i class='fa fa-download' aria-hidden='true'></i></a></td>" +
                                                                        '</tr>'
                                                                    );
                                                                })

                                                                $("#modal-invoices-history").modal('show');
                                                
                                                                $("#modal-invoices-history .downloadFac").click(function(){
                                                                    var invoiceID = $(this).attr("invoice-id");
                                                                    var invoiceNumber = $(this).attr("invoice-num");
                                                                    window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoices/' + invoiceID + '/'+invoiceNumber+'.pdf', '_blank')
                                                                })
                                                            }
                                                        }
                                                    });
                                                })

                                                $('#modal-list-facturacion').modal('show')
                                            }else{
                                                alert('¡La facturación es 0,00€!')
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        })

                        $('.earned').click(function(){

                            if(!$(this).hasClass('totalEarned')){

                                var client = null;
                                var type = null;
                                var costCenter = null;
                                if($(this).closest("tr").find(".client").text() != '' && $(this).closest("tr").find(".client").text() != null){
                                    client = $(this).closest("tr").find(".client").text();
                                    type = "";
                                }else{
                                    client = "";
                                    type = $(this).closest("tr").find(".type").text();
                                }
                                var costCenter = $(this).attr("cost")
                                var mortuaryName = $(this).attr("mortuaryName")
                                var expedientType = $(this).attr("expedientType")

                                //MODAL FROM TOTALS
                                if((client == null || client == "")  && (type == null || type == "")){
                                    if($(this).attr("type") != 'OTROS' && $(this).attr("type") != null){
                                        client = "";
                                        type = $(this).attr("type");
                                    }else{
                                        type = "";
                                        client = $(this).attr("client");
                                    }
                                }

                                var info = {
                                    client: client,
                                    type: type,
                                    costCenter: costCenter == undefined ? $('#mortuary').val() : costCenter,
                                    date: date,
                                    dateSince: ($("#datePeriod").prop('checked') ? dateSince : null),
                                    dateUntil: ($("#datePeriod").prop('checked') ? dateUntil : null),
                                    mortuary: ($("#mortuaryCheck").prop('checked') ? mortuary : null),
                                    clientTypeFilter : ($("#clientTypeCheck").prop('checked') ? $("#clientType").val() : null),
                                    clientFilter : ($("#clientCheck").prop('checked') ? $("#client").val() : null),
                                    paid: 1,
                                    expedientType: expedientType
                                }

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getControlPanelPayInvoices',
                                        data: info
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            $('#listPaidInvoices tbody').empty();
                                            $('#modal-list-invoicesPaid #titleInvoices').empty();
                                            $('#modal-list-invoicesPaid #exportSummaryCobrado').removeClass('exportSummaryPending').addClass('exportSummaryCobrado')
                                            $("#modal-list-invoicesPaid #creationDate").removeClass('hide')
                                            $("#modal-list-invoicesPaid #paymentDate").removeClass('hide')

                                            if(data != null){
                                                if(client == ''){
                                                    title = "";
                                                    switch(type){
                                                        case 'PD':
                                                            title = "Particulares - Defunciones";
                                                        break;
                                                        case 'ED':
                                                            title = "Empresas - Defunciones";
                                                        break;
                                                        case 'SD':
                                                            title = "Seguros - Defunciones";
                                                        break;
                                                        case 'PV':
                                                            title = "Particulares - Varios";
                                                        break;
                                                        case 'EV':
                                                            title = "Empresas - Varios";
                                                        break;
                                                        case 'SV':
                                                            title = "Seguros - Varios";
                                                        break;
                                                    }
                                                    $('#modal-list-invoicesPaid #mortuaryName').html(mortuaryName);
                                                    $('#modal-list-invoicesPaid #titleName').html(title);
                                                }else{
                                                    if(data[0][0].clientSurname != null && data[0][0].clientSurname != ''){
                                                        $('#modal-list-invoicesPaid #titleName').html(data[0][0].clientName + " " + data[0][0].clientSurname);
                                                    }else{
                                                        $('#modal-list-invoicesPaid #titleName').html(data[0][0].clientName);
                                                    }
                                                    $('#modal-list-invoicesPaid #mortuaryName').html(mortuaryName);
                                                }

                                                $('#modal-list-invoicesPaid-pending #exportSummaryCobrado').addClass('exportSummaryCobrado').removeClass('exportSummaryPending')
                                                
                                                let totalFacBis = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacBis, function(indexTotalIva, totalIvaIt){
                                                    totalFacBis[indexTotalIva].total = 0;
                                                })
                                                var totalFacBi = 0.0;
                                                var totalFacSu = 0.0;
                                                let totalFacIvas = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacIvas, function(indexTotalIva, totalIvaIt){
                                                    totalFacIvas[indexTotalIva].total = 0;
                                                })
                                                var totalFacIva = 0.0;
                                                var totalFactTotal = 0.0;
                                                var totalFactPaid = 0.0;

                                                $.each(data, function(index, elem){
                                                    
                                                    // Calculate totals
                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        var indexAux = totalFacBis.findIndex(p => p.percentage == baseElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacBis[indexAux]['total'] += parseFloat(baseElem.total);
                                                        }
                                                    })
                                                    totalFacBi += parseFloat((elem[0].bi));
                                                    totalFacSu += parseFloat((elem[0].su));
                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        var indexAux = totalFacIvas.findIndex(p => p.percentage == ivaElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacIvas[indexAux]['total'] += parseFloat(ivaElem.total);
                                                        }
                                                    })
                                                    totalFacIva += parseFloat((elem[0].totalIva));
                                                    totalFactTotal += parseFloat((elem[0].factTotal));
                                                    totalFactPaid += parseFloat((elem[0].paid));

                                                    var datePaid = "-";
                                                    if(elem[0].paymentDate != '' && elem[0].paymentDate != null){
                                                        datePaid = moment(elem[0].paymentDate, 'X').format('DD/MM/YYYY')
                                                    }

                                                    // Draw body
                                                    var tbodyTable = 
                                                        '   <tr>' +
                                                        '       <td align="center" class="hide numExp">' + elem[0].number + '</td>' +
                                                        '       <td align="center"><a style="text-decoration: underline" href="' + uri + 'editar-expediente' + (elem[0].tpv == '1' ? '-tpv' : '') + '/' + elem[0].expedientID + '" target="_blank" title="Ver expediente '+elem[0].number+'"><strong>' + elem[0].number + '</strong></a></td>' +
                                                        '       <td align="center" class="hide numFact">' + elem[0].generatedInvoiceNumber + '</td>' +
                                                        '       <td align="center"><strong>' + elem[0].generatedInvoiceNumber + '</strong></a></td>'
                                                    ;

                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        tbodyTable += ' <td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="baseTotal">' + toFormatNumber(parseFloat((elem[0].bi)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="supplieds">' + toFormatNumber(parseFloat((elem[0].su)).toFixed(2)) + ' €</td>'
                                                    ;

                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        tbodyTable += ' <td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="totalIva">' + toFormatNumber(parseFloat((elem[0].totalIva)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="totalNeto">' + toFormatNumber(parseFloat((elem[0].factTotal)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="totalPaid">' + toFormatNumber(parseFloat((elem[0].paid)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="dateInvoice">' + moment(elem[0].creationDate, 'X').format('DD/MM/YYYY') + '</td>' +
                                                        '       <td align="center" class="datePaid">' + datePaid + '</td>' +
                                                        '       <td align="center"><a class="btn-pdf" style="cursor:pointer" expedient="'+elem[0].expedientID+'" invoice="'+elem[0].invoiceID+'" title="Descargar factura"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></td>' +
                                                        '   </tr>'
                                                    ;

                                                    $('#listPaidInvoices tbody').append(tbodyTable) 
                                                })

                                                // Draw footers totals
                                                var tableFooter = 
                                                    '   <tr>' +
                                                    '       <td align="center" colspan="2" class="numExp"><strong>TOTAL</strong></td>'
                                                ;
                                                $.each(totalFacBis, function(indexIvaType, baseElem){
                                                    tableFooter +=    '<td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter +=
                                                    '       <td align="center" class="baseTotal">' + toFormatNumber(totalFacBi.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="supplieds">' + toFormatNumber(totalFacSu.toFixed(2)) + ' €</td>'
                                                ;
                                                $.each(totalFacIvas, function(indexIvaType, ivaElem){
                                                    tableFooter +=    '<td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter +=
                                                    '       <td align="center" class="totalIva">' + toFormatNumber(totalFacIva.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="totalNeto">' + toFormatNumber(totalFactTotal.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="totalPaid">' + toFormatNumber(totalFactPaid.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="dateInvoice"> - </td>' +
                                                    '       <td align="center" class="datePaid"> - </td>' +
                                                    '       <td align="center"> - </td>' +
                                                    '   </tr>'
                                                ;

                                                $('#listPaidInvoices tbody').append(tableFooter)

                                                $(".btn-pdf").click(function(){
                                                    var expedientID = $(this).attr('expedient')
                                                    var invoiceID = $(this).attr('invoice')
                                                    
                                                    var invoiceInfo = null;
                                                    $.ajax({
                                                        url: uri + 'core/invoices/functions.php',
                                                        method: 'POST',
                                                        data: {
                                                            type: 'getInvoiceInfoToDownload',
                                                            invoice: invoiceID
                                                        },
                                                        async: false,
                                                        success: function(data){
                                                            try{
                                                                invoiceInfo = $.parseJSON(data)
                                                            }catch(e){
                                                                invoiceInfo = null
                                                                
                                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                                                                setTimeout(function(){
                                                                    $('#block-message').empty();
                                                                }, 5000)
                                                            }
                                                        }
                                                    })

                                                    window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'.pdf', '_blank');
                                                })

                                                $('#modal-list-invoicesPaid').modal('show')
                                            }else{
                                                alert('No hay facturas cobradas para este cliente con eses requisitos!')
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        })

                        $('.pending').click(function(){

                            if(!$(this).hasClass('totalPending')){
                                pendingID = $(this);
                                var client = null;
                                var type = null;
                                var costCenter = null;
                                if($(this).closest("tr").find(".client").text() != '' && $(this).closest("tr").find(".client").text() != null){
                                    client = $(this).closest("tr").find(".client").text();
                                    type = "";
                                }else{
                                    client = "";
                                    type = $(this).closest("tr").find(".type").text();
                                }
                                var costCenter = $(this).attr("cost")
                                var mortuaryName = $(this).attr("mortuaryName")
                                var expedientType = $(this).attr("expedientType")

                                //MODAL FROM TOTALS
                                if((client == null || client == "")  && (type == null || type == "")){
                                    if($(this).attr("type") != 'OTROS' && $(this).attr("type") != null){
                                        client = "";
                                        type = $(this).attr("type");
                                    }else{
                                        type = "";
                                        client = $(this).attr("client");
                                    }
                                }

                                var info = {
                                    client: client,
                                    type: type,
                                    costCenter: costCenter == undefined ? $('#mortuary').val() : costCenter,
                                    date: date,
                                    dateSince: ($("#datePeriod").prop('checked') ? dateSince : null),
                                    dateUntil: ($("#datePeriod").prop('checked') ? dateUntil : null),
                                    mortuary: ($("#mortuaryCheck").prop('checked') ? mortuary : null),
                                    clientTypeFilter : ($("#clientTypeCheck").prop('checked') ? $("#clientType").val() : null),
                                    clientFilter : ($("#clientCheck").prop('checked') ? $("#client").val() : null),
                                    paid: 0,
                                    expedientType: expedientType
                                }

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getControlPanelPayInvoices',
                                        data: info
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            $('#listPaidInvoicesPending tbody').empty();
                                            $('#modal-list-invoicesPaid-pending #titleInvoices').empty();
                                            $("#modal-list-invoicesPaid #creationDate").addClass('hide')
                                            $("#modal-list-invoicesPaid #paymentDate").addClass('hide')
                                            if(data != null){
                                                if(client == ''){
                                                    title = "";
                                                    switch(type){
                                                        case 'PD':
                                                            title = "Particulares - Defunciones";
                                                        break;
                                                        case 'ED':
                                                            title = "Empresas - Defunciones";
                                                        break;
                                                        case 'SD':
                                                            title = "Seguros - Defunciones";
                                                        break;
                                                        case 'PV':
                                                            title = "Particulares - Varios";
                                                        break;
                                                        case 'EV':
                                                            title = "Empresas - Varios";
                                                        break;
                                                        case 'SV':
                                                            title = "Seguros - Varios";
                                                        break;
                                                    }
                                                    $('#modal-list-invoicesPaid-pending #mortuaryName').html(mortuaryName);
                                                    $('#modal-list-invoicesPaid-pending #titleName').html(title);
                                                }else{
                                                    if(data[0][0].clientSurname != null && data[0][0].clientSurname != ''){
                                                        $('#modal-list-invoicesPaid-pending #titleName').html(data[0][0].clientName + " " + data[0][0].clientSurname);
                                                    }else{
                                                        $('#modal-list-invoicesPaid-pending #titleName').html(data[0][0].clientName);
                                                    }
                                                    $('#modal-list-invoicesPaid-pending #mortuaryName').html(mortuaryName);
                                                }
                                                $('#modal-list-invoicesPaid-pending #exportSummaryCobrado').removeClass('exportSummaryCobrado').addClass('exportSummaryPending')

                                                let totalFacBis = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacBis, function(indexTotalIva, totalIvaIt){
                                                    totalFacBis[indexTotalIva].total = 0;
                                                })
                                                var totalFacBi = 0.0;
                                                var totalFacSu = 0.0;
                                                let totalFacIvas = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacIvas, function(indexTotalIva, totalIvaIt){
                                                    totalFacIvas[indexTotalIva].total = 0;
                                                })
                                                var totalFacIva = 0.0;
                                                var totalFactTotal = 0.0;
                                                var totalFactPaid = 0.0;

                                                $.each(data, function(index, elem){
                                                    
                                                    // Calculate totals
                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        var indexAux = totalFacBis.findIndex(p => p.percentage == baseElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacBis[indexAux]['total'] += parseFloat(baseElem.total);
                                                        }
                                                    })
                                                    totalFacBi += parseFloat((elem[0].bi));
                                                    totalFacSu += parseFloat((elem[0].su));
                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        var indexAux = totalFacIvas.findIndex(p => p.percentage == ivaElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacIvas[indexAux]['total'] += parseFloat(ivaElem.total);
                                                        }
                                                    })
                                                    totalFacIva += parseFloat((elem[0].totalIva));
                                                    totalFactTotal += parseFloat((elem[0].totalInvoice));
                                                    totalFactPaid += parseFloat((elem[0].paid));

                                                    // Draw body
                                                    var tbodyTable = 
                                                        '   <tr>' +
                                                        '       <td align="center" class="hide numExp">' + elem[0].number + '</td>' +
                                                        '       <td align="center"><a style="text-decoration: underline" href="' + uri + 'editar-expediente' + (elem[0].tpv == '1' ? '-tpv' : '') + '/' + elem[0].expedientID + '" target="_blank" title="Ver expediente '+elem[0].number+'"><strong>' + elem[0].number + '</strong></a></td>' +
                                                        '       <td align="center" class="hide numFact">' + elem[0].generatedInvoiceNumber + '</td>' +
                                                        '       <td align="center"><strong>' + elem[0].generatedInvoiceNumber + '</strong></a></td>' +
                                                        '       <td align="center" class="creation-date"><strong>' + moment(elem[0].creationDate, 'X').format('DD/MM/YYYY') + '</strong></a></td>'
                                                    ;

                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        tbodyTable += ' <td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="baseTotal">' + toFormatNumber(parseFloat((elem[0].bi)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="supplieds">' + toFormatNumber(parseFloat((elem[0].su)).toFixed(2)) + ' €</td>'
                                                    ;

                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        tbodyTable += ' <td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="totalIva">' + toFormatNumber(parseFloat((elem[0].totalIva)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="totalNeto">' + toFormatNumber(parseFloat((elem[0].factTotal)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="totalPaid">' + toFormatNumber(parseFloat((elem[0].paid)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center"><a class="btn-charge" style="cursor:pointer" expedient="'+elem[0].expedientID+'" client="'+client+'" type="'+type+'" invoice="'+elem[0].invoiceID+'" title="Cobrar factura"><i class="fa fa-credit-card-alt" aria-hidden="true"></i></a></td>' +
                                                        '       <td align="center"><a class="btn-pdf" style="cursor:pointer" expedient="'+elem[0].expedientID+'" invoice="'+elem[0].invoiceID+'" title="Descargar factura"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></td>' +
                                                        '   </tr>'
                                                    ;

                                                    $('#listPaidInvoicesPending tbody').append(tbodyTable)
                                                })

                                                // Draw footers totals
                                                var tableFooter = 
                                                    '   <tr>' +
                                                    '       <td align="center" colspan="3" class="numExp"><strong>TOTAL</strong></td>'
                                                ;
                                                $.each(totalFacBis, function(indexIvaType, baseElem){
                                                    tableFooter +=    '<td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter +=
                                                    '       <td align="center" class="baseTotal">' + toFormatNumber(totalFacBi.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="supplieds">' + toFormatNumber(totalFacSu.toFixed(2)) + ' €</td>'
                                                ;
                                                $.each(totalFacIvas, function(indexIvaType, ivaElem){
                                                    tableFooter +=    '<td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' €</td>'
                                                })

                                                tableFooter +=
                                                    '       <td align="center" class="totalIva">' + toFormatNumber(totalFacIva.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="totalNeto">' + toFormatNumber(totalFactTotal.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="totalPaid">' + toFormatNumber(totalFactPaid.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center"> - </td>' +
                                                    '       <td align="center"> - </td>' +
                                                    '   </tr>'
                                                ;

                                                $('#listPaidInvoicesPending tbody').append(tableFooter)

                                                $(".btn-pdf").click(function(){
                                                    var expedientID = $(this).attr('expedient')
                                                    var invoiceID = $(this).attr('invoice')
                                                    
                                                    var invoiceInfo = null;
                                                    $.ajax({
                                                        url: uri + 'core/invoices/functions.php',
                                                        method: 'POST',
                                                        data: {
                                                            type: 'getInvoiceInfoToDownload',
                                                            invoice: invoiceID
                                                        },
                                                        async: false,
                                                        success: function(data){
                                                            try{
                                                                invoiceInfo = $.parseJSON(data)
                                                            }catch(e){
                                                                invoiceInfo = null
                                                                
                                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                                                                setTimeout(function(){
                                                                    $('#block-message').empty();
                                                                }, 5000)
                                                            }
                                                        }
                                                    })

                                                    window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'.pdf', '_blank');
                                                })

                                                $(".btn-charge").click(function(){
                                                    var expedientID = $(this).attr('expedient')
                                                    var invoiceID = $(this).attr('invoice')
                                                    var client = $(this).attr('client')
                                                    var type = $(this).attr('type')

                                                    $.ajax({
                                                        url: uri + 'core/invoices/functions.php',
                                                        method: 'POST',
                                                        data: {
                                                            type: 'getInvoiceInfo',
                                                            expedient: expedientID,
                                                            invoice: invoiceID,
                                                        },
                                                        async: false,
                                                        success: function(data){
                                                            try{
                                                                invoice = $.parseJSON(data)
                                                            }catch(e){
                                                                invoice = null
                                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                                                setTimeout(function(){
                                                                    $('#block-message').empty()
                                                                }, 5000)
                                                            }
                                                        }
                                                    })
                                                
                                                    if(invoice != null){
                                                        var paymentMethod = invoice.paymentMethod
                                                        var comments = invoice.comments
                                                        var accountNumber = invoice.accountNumber
                                                        var generatedInvoiceNumber = invoice.generatedInvoiceNumber
                                                        var expedientNumber = invoice.expedientNumber
                                                        var total = invoice.total
                                                        var pay = invoice.pay
                                                        var invoiceID = invoice.invoiceID
                                                        
                                                        //Mostramos la modal
                                                        $('#modal-edit-invoice').modal('show');
                                                        $('#modal-edit-invoice #generatedInvoiceNumber').text(generatedInvoiceNumber);
                                                        $('#modal-edit-invoice #expedientNumber').val(expedientNumber);
                                                        $('#modal-edit-invoice #expedient').val(expedientID);
                                                        $('#modal-edit-invoice #invoiceID').val(invoiceID);
                                                        $('#modal-edit-invoice #cost').val(costCenter);
                                                        $('#modal-edit-invoice #mortuaryName').val(mortuaryName);
                                                        $('#modal-edit-invoice #clientID').val(client);
                                                        $('#modal-edit-invoice #type').val(type);
                                                        $('#modal-edit-invoice #paymentMethod').val(paymentMethod);
                                                        $('#modal-edit-invoice #comments').val(comments);
                                                        $('#modal-edit-invoice #accountNumber').val(accountNumber);
                                                        $('#modal-edit-invoice #total').val(total + " €");
                                                        $('#modal-edit-invoice #paied').val(pay + " €");
                                                        let payAmount = parseFloat(total) - parseFloat(pay)
                                                        $('#modal-edit-invoice #pay').val(payAmount.toFixed(2));
                                            
                                                        var today = new Date();
                                                        var dd = String(today.getDate()).padStart(2, '0');
                                                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                                        var yyyy = today.getFullYear();
                                                        today = dd + '/' + mm + '/' + yyyy;
                                                        $('#modal-edit-invoice #date').val(today);
                                                    }
                                                });

                                                $('#modal-list-invoicesPaid-pending').modal('show')
                                            }else{
                                                alert('No hay facturas pendientes para este cliente con eses requisitos!')
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        })

                        $('.exportSummaryMortuary').click(function(){
                            var summary = new Array
                            
                            mortuary = $(this).attr("mortuary");
                            summary.push([$('#mortuaryNameTitleTD-'+mortuary).text()])
                            summary.push(['Expedientes'])
                            $('#summaryBody-'+mortuary+' tr').each(function(index, elem){
                    
                                var currentClientName = $(this).find('.currentClientName').text()
                                var numDeceased = $(this).find('.numDeceased').text()
                                var bi = $(this).find('.bi').text()
                                var supplieds = $(this).find('.supplieds').text()
                                var fact = $(this).find('.fact').text()
                                var ivaValues = [];
                                var itToSearch = $(this);
                                $.each(ivaTypes, function(index, value){
                                    ivaValues.push(itToSearch.find('.iva[data-iva="' + value.percentage + '"]').text())
                                })
                                var totalIva = $(this).find('.totalIva').text()
                                var factTotal = $(this).find('.factTotal').text()
                                var earned = $(this).find('.earned').text()
                                var pending = $(this).find('.pending').text()
                                var grossMargin = $(this).find('.grossMargin').text()
                                var grossMarginShow = $(this).find('.grossMarginShow').text()
                                var averageTimeShow = $(this).find('.averageTimeShow').text().replace('- días', '-')
                                
                                summary.push([
                                    currentClientName,
                                    numDeceased,
                                    bi,
                                    supplieds,
                                    fact,
                                    ...ivaValues,
                                    totalIva,
                                    factTotal,
                                    earned,
                                    pending,
                                    grossMargin,
                                    grossMarginShow,
                                    averageTimeShow
                                ])
                            })

                            $.ajax({
                                url: uri + 'core/statistics/functions.php',
                                method: 'POST',
                                data: {
                                    type: 'exportControlPanelSummary',
                                    data: {sumary: summary}
                    
                                },
                                dataType: 'json',
                                async: false,
                                success: function(data){
                                    try{
                                        window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                                    }catch(e){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                            
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                            
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            })
                        })

                        $('#exportSummary').attr('disabled', false)
                    
                        //TOTAL CREMACIONES
                        totalValuesExpedients = [];
                        $.each(data.cremations, function(index, value){
                            var indexTotal = 7;
                            $.each(value[2], function(index2, item){

                                if(item[0] == '-'){
                                    var newIndex = indexTotal;
                                    indexTotal++;
                                }else{
                                    var newIndex = item[0]-1;
                                }

                                if(index == 0){
                                    totalValuesExpedients[newIndex] = [item[1], item[2], item[3], item[4], item[5], item[6], item[7]];
                                }else{
                                    totalValuesExpedients[newIndex] = 
                                        [
                                            item[1], 
                                            totalValuesExpedients[newIndex][1] + item[2],
                                            totalValuesExpedients[newIndex][2] + item[3],
                                            totalValuesExpedients[newIndex][3] + item[4],
                                            totalValuesExpedients[newIndex][4] + item[5],
                                            totalValuesExpedients[newIndex][5],
                                            totalValuesExpedients[newIndex][6]
                                        ];
                                }
                            })
                        })

                        $("#summary-tables").append(
                            '<div class="table-responsive clearfix" style="overflow-x:hidden">'+
                            '   <h4><strong>Cremaciones</strong></h4>'+
                            '   <table class="table table-striped table-bordered" id="summaryTable" width="100%" cellspacing="0">'+
                            '       <thead>'+
                            '           <tr class="text-center">'+
                            '               <th class="text-center" style="vertical-align: middle;">CLIENTE</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">Nº CREMACIONES</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">FACTURACIÓN TOTAL</th>'+
                            '               <th class="text-center" style="vertical-align: middle;">MARGEN MEDIO</th>'+
                            '           </tr>'+
                            '       </thead>'+
                            '       <tbody id="cremationsBodyTotal"></tbody>'+
                            '   </table>'+
                            '   <br>'+
                            '</div>'
                        );

                        totalValuesExpedients = totalValuesExpedients.filter(function (el) {
                            return el != null;
                        });

                        var totalNumCremations = 0;
                        var totalFact = 0;
                        var totalGrossMarginShow = 0;
                        var grossNumber = 0;

                        $.each(totalValuesExpedients, function(index, item){
                            totalNumCremations += item[1];
                            totalFact += item[2];
                            
                            var grossMargin = '-';
                            if(parseFloat(item[3]) > 0 && parseFloat(item[4]) > 0){
                                grossMargin = parseFloat(item[4]) / parseFloat(item[3]) * 100;
                                totalGrossMarginShow += parseFloat(grossMargin);
                                grossMargin = toFormatNumber(grossMargin.toFixed(2)) + ' %'
                                grossNumber++;
                            }
                            
                            var expType = '1'
                            if(item[0].includes('Varios')){
                                expType = '3';
                            }

                            $('#cremationsBodyTotal').append(   
                                '   <tr>' +
                                '       <td class="currentClientNameExportTotal centered"><strong>' + item[0] + '<strong></td>' +
                                '       <td class="numCremationsExportTotal centered numCremations numDeceasedTotal" style="cursor:pointer;text-decoration: underline" mortuaryName="Totales" type="'+item[5]+'" client="'+item[6]+'" expedientType="'+expType+'">' + toFormatNumber(item[1]) + '</td>' +
                                '       <td class="factExportTotal centered factCremation numDeceasedTotal" style="cursor:pointer;text-decoration: underline" mortuaryName="Totales" type="'+item[5]+'" client="'+item[6]+'">' + toFormatNumber(item[2].toFixed(2)) + ' €</td>' +
                                '       <td class="grossMarginShowExportTotal centered">' +grossMargin + '</td>' +
                                '   </tr>'
                            )
                        })

                        totalGrossMarginShow = grossNumber > 0 ? totalGrossMarginShow / grossNumber : 0
                        $('#cremationsBodyTotal').append(   
                            '   <tr>' +
                            '       <td class="currentClientNameExportTotal centered"><strong>TOTAL</strong></td>' +
                            '       <td class="numCremationsTotal centered numCremationsExport totalnumCremations">' + totalNumCremations + '</td>' +
                            '       <td class="factExportTotal centered totalFactExport">' + toFormatNumber(totalFact.toFixed(2)) + ' €</td>' +
                            '       <td class="grossMarginShowExportTotal centered">' + totalGrossMarginShow.toFixed(2) + '%</td>' +
                            '   </tr>'
                        )

                        $('.numCremations').click(function(){

                            if(!$(this).hasClass('totalnumCremations')){
                                var client = null;
                                var type = null;
                                var costCenter = null;
                                if($(this).closest("tr").find(".client").text() != '' && $(this).closest("tr").find(".client").text() != null){
                                    client = $(this).closest("tr").find(".client").text();
                                    type = "";
                                }else{
                                    client = "";
                                    type = $(this).closest("tr").find(".type").text();
                                }
                                var costCenter = $(this).attr("cost")
                                var mortuaryName = $(this).attr("mortuaryName")
                                var expedientType = $(this).attr("expedientType")
                                var isTotals = $(this).hasClass('numDeceasedTotal') ? 1 : 0;

                                //MODAL FROM TOTALS
                                if((client == null || client == "")  && (type == null || type == "")){
                                    if($(this).attr("type") != 'OTROS' && $(this).attr("type") != null){
                                        client = "";
                                        type = $(this).attr("type");
                                    }else{
                                        type = "";
                                        client = $(this).attr("client");
                                    }
                                }

                                var info = {
                                    client: client,
                                    type: type,
                                    costCenter: costCenter == undefined ? $('#mortuary').val() : costCenter,
                                    date: date,
                                    dateSince: ($("#datePeriod").prop('checked') ? dateSince : null),
                                    dateUntil: ($("#datePeriod").prop('checked') ? dateUntil : null),
                                    mortuary: ($("#mortuaryCheck").prop('checked') ? mortuary : null),
                                    clientTypeFilter : ($("#clientTypeCheck").prop('checked') ? $("#clientType").val() : null),
                                    clientFilter : ($("#clientCheck").prop('checked') ? $("#client").val() : null),
                                    cremation: 1,
                                    expedientType: expedientType,
                                    isTotals:isTotals
                                }

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getControlPanelExpedients',
                                        data: info
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            if(data != null){
                                                $('#listExpedients tbody').empty();
                                                $('#modal-list-expedients #modalType').empty();
                                                $('#modal-list-expedients #modalType').html('Cremaciones ');
                                                if(type != ""){
                                                    title = "";
                                                    switch(type){
                                                        case 'PD':
                                                            title = "Particulares - Defunciones";
                                                        break;
                                                        case 'ED':
                                                            title = "Empresas - Defunciones";
                                                        break;
                                                        case 'SD':
                                                            title = "Seguros - Defunciones";
                                                        break;
                                                        case 'PV':
                                                            title = "Particulares - Varios";
                                                        break;
                                                        case 'EV':
                                                            title = "Empresas - Varios";
                                                        break;
                                                        case 'SV':
                                                            title = "Seguros - Varios";
                                                        break;
                                                    }

                                                    $('#modal-list-expedients #mortuaryName').html(mortuaryName);
                                                    $('#modal-list-expedients #titleName').html(title);

                                                }else{
                                                    if(data[0].clientSurname != null && data[0].clientSurname != ''){
                                                        $('#modal-list-expedients #titleName').html(data[0].clientName + " " + data[0].clientSurname);
                                                    }else{
                                                        $('#modal-list-expedients #titleName').html(data[0].clientName);
                                                    }
                                                    $('#modal-list-expedients #mortuaryName').html(mortuaryName);
                                                }

                                                $("#exportSummaryExpedients").attr("client", client)

                                                $.each(data, function(index, elem){
                                                    $('#listExpedients tbody').append(  
                                                        '   <tr>' +
                                                        '       <td align="center" class="numberExpedient hide">' + elem.number + '</td>' +
                                                        '       <td align="center" ><a href="' + uri + 'editar-expediente' + (elem.tpv == '1' ? '-tpv' : '') + '/' + elem.expedientID + '" target="_blank" style="text-decoration: underline" title="Ver expediente '+elem.number+'"><strong>' + elem.number + '</strong></a></td>' +
                                                        '       <td align="center" class="typeExpedient">' + elem.expedientType +'</td>' +
                                                        '       <td align="center" class="requestDateExpedient">' + moment(elem.requestDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + '</td>' +
                                                        '       <td align="center" class="deceasedExpedient">' + elem.deceasedName + ' ' + elem.deceasedSurname + '</td>' +
                                                        '       <td align="center" class="clientExpedient">' + elem.clientName + ' ' + elem.clientSurname + '</td>' +
                                                        '       <td align="center" class="clientTypeExpedient">' + elem.clientType +'</td>' +
                                                        '   </tr>'
                                                    )
                                                })
                                                $('#modal-list-expedients').modal('show')
                                            }else{
                                                alert('¡No hay expedientes de cremaciones!')
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        })

                        $('.factCremation').click(function(){
                            if(!$(this).hasClass('totalFactExport')){
                                var client = null;
                                var type = null;
                                var costCenter = null;
                                if($(this).closest("tr").find(".client").text() != '' && $(this).closest("tr").find(".client").text() != null){
                                    client = $(this).closest("tr").find(".client").text();
                                    type = "";
                                }else{
                                    client = "";
                                    type = $(this).closest("tr").find(".type").text();
                                }
                                var costCenter = $(this).attr("cost")
                                var mortuaryName = $(this).attr("mortuaryName")

                                //MODAL FROM TOTALS
                                if((client == null || client == "")  && (type == null || type == "")){
                                    if($(this).attr("type") != 'OTROS' && $(this).attr("type") != null){
                                        client = "";
                                        type = $(this).attr("type");
                                    }else{
                                        type = "";
                                        client = $(this).attr("client");
                                    }
                                }
                                var isTotals = $(this).hasClass('numDeceasedTotal') ? 1 : 0;

                                var info = {
                                    client: client,
                                    type: type,
                                    costCenter: costCenter == undefined ? $('#mortuary').val() : costCenter,
                                    date: date,
                                    dateSince: ($("#datePeriod").prop('checked') ? dateSince : null),
                                    dateUntil: ($("#datePeriod").prop('checked') ? dateUntil : null),
                                    mortuary: ($("#mortuaryCheck").prop('checked') ? mortuary : null),
                                    clientTypeFilter : ($("#clientTypeCheck").prop('checked') ? $("#clientType").val() : null),
                                    clientFilter : ($("#clientCheck").prop('checked') ? $("#client").val() : null),
                                    cremation: 1,
                                    isTotals: isTotals
                                }

                                $.ajax({
                                    url: uri + 'core/statistics/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getControlPanelFacturacion',
                                        data: info
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data){
                                        try{
                                            if(data != null){
                                                $('#listFacturacion tbody').empty();
                                                $('#modal-list-facturacion #modalType').empty();
                                                $('#modal-list-facturacion #modalType').html('Facturación de Cremaciones ');
                                                if(type != ''){
                                                    title = "";
                                                    switch(type){
                                                        case 'PD':
                                                            title = "Particulares - Defunciones";
                                                        break;
                                                        case 'ED':
                                                            title = "Empresas - Defunciones";
                                                        break;
                                                        case 'SD':
                                                            title = "Seguros - Defunciones";
                                                        break;
                                                        case 'PV':
                                                            title = "Particulares - Varios";
                                                        break;
                                                        case 'EV':
                                                            title = "Empresas - Varios";
                                                        break;
                                                        case 'SV':
                                                            title = "Seguros - Varios";
                                                        break;
                                                    }
                                                    $('#modal-list-facturacion #mortuaryName').html(mortuaryName);
                                                    $('#modal-list-facturacion #titleName').html(title);
                                                }else{
                                                    if(data[0][0].clientSurname != null && data[0][0].clientSurname != ''){
                                                        $('#modal-list-facturacion #titleName').html(data[0][0].clientName + " " + data[0][0].clientSurname);
                                                    }else{
                                                        $('#modal-list-facturacion #titleName').html(data[0][0].clientName);
                                                    }
                                                }

                                                let totalFacBis = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacBis, function(indexTotalIva, totalIvaIt){
                                                    totalFacBis[indexTotalIva].total = 0;
                                                })
                                                var totalFacBi = 0.0;
                                                var totalFacSu = 0.0;
                                                let totalFacIvas = JSON.parse(JSON.stringify(ivaTypes));
                                                $.each(totalFacIvas, function(indexTotalIva, totalIvaIt){
                                                    totalFacIvas[indexTotalIva].total = 0;
                                                })
                                                var totalFacIva = 0.0;
                                                var totalFactTotal = 0.0;

                                                $.each(data, function(index, elem){
                                                        
                                                    // Calculate totals
                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        var indexAux = totalFacBis.findIndex(p => p.percentage == baseElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacBis[indexAux]['total'] += parseFloat(baseElem.total);
                                                        }
                                                    })
                                                    totalFacBi += parseFloat((elem[0].bi));
                                                    totalFacSu += parseFloat((elem[0].su));
                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        var indexAux = totalFacIvas.findIndex(p => p.percentage == ivaElem.percentage);
                                                        if(indexAux !== -1){
                                                            totalFacIvas[indexAux]['total'] += parseFloat(ivaElem.total);
                                                        }
                                                    })
                                                    totalFacIva += parseFloat((elem[0].totalIva));
                                                    totalFactTotal += parseFloat((elem[0].factTotal));

                                                    if(elem[0].paymentDate != '' && elem[0].paymentDate != null){
                                                        paymentDate = moment(elem[0].paymentDate, 'X').format('DD/MM/YYYY')
                                                    }else{
                                                        paymentDate = '-'
                                                    }

                                                    // Draw body
                                                    var tbodyTable = 
                                                        '   <tr>' +
                                                        '       <td align="center" class="hide numExp">' + elem[0].number + '</td>' +
                                                        '       <td align="center" style="width:100px"><a href="' + uri + 'editar-expediente' + (elem[0].tpv == '1' ? '-tpv' : '') + '/' + elem[0].expedientID + '" target="_blank" style="text-decoration: underline" title="Ver expediente '+elem[0].number+'"><strong>' + elem[0].number + '</strong></a></td>' +
                                                        '       <td align="center" class="clientExpedient">' + elem[0].clientName + ' ' + elem[0].clientSurname + '</td>' +
                                                        '       <td align="center" class="deceasedExpedient">' + elem[0].deceasedName + '</td>'
                                                    ;

                                                    $.each(elem[0].bases, function(indexIvaType, baseElem){
                                                        tbodyTable += ' <td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="baseTotal">' + toFormatNumber(parseFloat((elem[0].bi)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="supplieds">' + toFormatNumber(parseFloat((elem[0].su)).toFixed(2)) + ' €</td>'
                                                    ;

                                                    $.each(elem[0].ivas, function(indexIvaType, ivaElem){
                                                        tbodyTable += ' <td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' € </td>';
                                                    })

                                                    tbodyTable +=
                                                        '       <td align="center" class="totalIva">' + toFormatNumber(parseFloat((elem[0].totalIva)).toFixed(2)) + ' €</td>' +
                                                        '       <td align="center" class="totalNeto">' + toFormatNumber(parseFloat((elem[0].factTotal)).toFixed(2)) + ' €</td>' +
                                                        // '       <td align="center" class="dateInvoice">' + moment(elem[0].creationDate, 'X').format('DD/MM/YYYY') + '</td>' +
                                                        // '       <td align="center" class="datePaid">' + paymentDate + '</td>' +
                                                        '       <td align="center"><a class="btn-pdf" style="cursor:pointer" expedient="'+elem[0].expedientID+'" invoice="'+elem[0].invoiceID+'" title="Descargar PDF"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></td>' +
                                                        '   </tr>'
                                                    ;

                                                    $('#listFacturacion tbody').append(tbodyTable)  
                                                })

                                                // Draw footers totals
                                                var tableFooter = 
                                                    '   <tr>' +
                                                    '       <td align="center" class="numExp" colspan="3"><strong>TOTAL</strong></td>'
                                                ;
                                                $.each(totalFacBis, function(indexIvaType, baseElem){
                                                    tableFooter +=    '<td class="base21 text-center">' + toFormatNumber(parseFloat(baseElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter +=
                                                    '       <td align="center" class="baseTotal">' + toFormatNumber(totalFacBi.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="supplieds">' + toFormatNumber(totalFacSu.toFixed(2)) + ' €</td>'
                                                ;
                                                $.each(totalFacIvas, function(indexIvaType, ivaElem){
                                                    tableFooter +=    '<td class="iva text-center" data-iva="'+ivaElem.percentage+'">' + toFormatNumber(parseFloat(ivaElem.total).toFixed(2)) + ' €</td>'
                                                })
                                                tableFooter += 
                                                    '       <td align="center" class="totalIva">' + toFormatNumber(totalFacIva.toFixed(2)) + ' €</td>' +
                                                    '       <td align="center" class="totalNeto">' + toFormatNumber(totalFactTotal.toFixed(2)) + ' €</td>' +
                                                    // '       <td align="center" class="dateInvoice"> - </td>' +
                                                    // '       <td align="center" class="datePaid"> - </td>' +
                                                    '       <td align="center"> - </td>' +
                                                    '   </tr>'
                                                ;

                                                $('#listFacturacion tbody').append(tableFooter)  

                                                $(".btn-pdf").click(function(){
                                                    var expedientID = $(this).attr('expedient')

                                                    var invoiceData = null;

                                                    $.ajax({
                                                        url: uri + "core/expedients/hiring/listInvoices.php",
                                                        data: {
                                                            expedient: expedientID
                                                        },
                                                        type: 'POST',
                                                        async: false,
                                                        success: function (data){
                                                            invoiceData = $.parseJSON(data)
                                            
                                                            if(invoiceData.length == 1){
                                                                window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoices/' + invoiceData[0]['ID'] + '/'+invoiceData[0]['number']+'.pdf', '_blank')
                                                            }else{
                                                                $.each(invoiceData, function(index, elem){

                                                                    var invoiceTypeHtml = '';
                                                                    if(elem.invoice_type == '1'){
                                                                        invoiceTypeHtml = '<span class="label label-success" style="font-size:90%">ORIGINAL</span>'
                                                                    }else if(elem.invoice_type == '2'){
                                                                        if(elem.rectified_type == '1'){
                                                                            invoiceTypeHtml = '<span class="label label-warning" style="font-size:90%">RECTIFICADA - SUSTITUCIÓN</span>'
                                                                        }else{
                                                                            invoiceTypeHtml = '<span class="label label-warning" style="font-size:90%">RECTIFICADA - DIFERENCIAS</span>'
                                                                        }
                                                                    }else{
                                                                        invoiceTypeHtml = '<span class="label label-danger" style="font-size:90%">ANULADA</span>'
                                                                    }

                                                                    $('#modal-invoices-history #tableBodyInvoices').append(
                                                                        '<tr>' +
                                                                            '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                                                            '<td style="text-align:center">'+ elem["number"] + '</td>' +
                                                                            '<td style="text-align:center">'+ invoiceTypeHtml + '</td>' +
                                                                            '<td style="text-align:center">'+ moment(elem["creationDate"], 'X').format('DD/MM/YYYY') + '</td>' +
                                                                            '<td style="text-align:center">'+ moment(elem["createDate"], 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') + '</td>' +
                                                                            '<td style="text-align:center">'+ elem["user_info"] + '</td>' +
                                                                            "<td style='text-align:center'><a class='downloadFac btn' expedient='"+elem["expedient"]+"' invoice-id='"+elem["ID"]+"' invoice-num='"+elem["number"]+"'  title='Descargar'><i class='fa fa-download' aria-hidden='true'></i></a></td>" +
                                                                        '</tr>'
                                                                    );
                                                                })

                                                                $("#modal-invoices-history").modal('show');
                                                
                                                                $("#modal-invoices-history .downloadFac").click(function(){
                                                                    var invoiceID = $(this).attr("invoice-id");
                                                                    var invoiceNumber = $(this).attr("invoice-num");
                                                                    window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/invoices/' + invoiceID + '/'+invoiceNumber+'.pdf', '_blank')
                                                                })
                                                            }
                                                        }
                                                    });
                                                })

                                                $('#modal-list-facturacion').modal('show')
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            }
                        })
                                
                        // Cash flow
                        if(data.cashflow == null){
                            $('#cashflowBody').append(  
                                '   <tr>' +
                                '       <td colspan="9">'+
                                '           <div class="alert alert-warning">No hay datos para mostrar en esta tabla</div>' +
                                '       </td>' +
                                '   </tr>'
                            )
                            
                            $('#exportCashflow').attr('disabled', true)
                        }else{
                            $.each(data.cashflow, function(index, elem){
                                var total = (parseFloat(elem.earned) - (parseFloat(elem.expensesFixed) + parseFloat(elem.expensesVariable) + parseFloat(elem.supplieds) + parseFloat(elem.financingInterests) + parseFloat(elem.financingAmortizations))).toFixed(2)
    
                                var costCenterName = elem.name
                                if(index == 'total'){
                                    costCenterName = elem.name + ' (Sin salarios)'
                                }
                                $('#cashflowBody').append(  
                                    '   <tr>' +
                                    '       <td class="costCenterName text-center toBold">' + costCenterName + '</td>' +
                                    '       <td class="earned text-center">' + toFormatNumber(parseFloat(elem.earned).toFixed(2)) + ' €</td>' +
                                    '       <td class="expensesFixed text-center">' + toFormatNumber(parseFloat(elem.expensesFixed).toFixed(2)) + ' €</td>' +
                                    '       <td class="expensesVariable text-center">' + toFormatNumber(parseFloat(elem.expensesVariable).toFixed(2)) + ' €</td>' +
                                    '       <td class="supplieds text-center">' + toFormatNumber(parseFloat(elem.supplieds).toFixed(2)) + ' €</td>' +
                                    '       <td class="salaries text-center hide">' + toFormatNumber(parseFloat(elem.salaries).toFixed(2)) + ' €</td>' +
                                    '       <td class="financingInterests text-center">' + toFormatNumber(parseFloat(elem.financingInterests).toFixed(2)) + ' €</td>' +
                                    '       <td class="financingAmortizations text-center">' + toFormatNumber(parseFloat(elem.financingAmortizations).toFixed(2)) + ' €</td>' +
                                    '       <td class="total text-center">' + toFormatNumber(total) + ' €</td>' +
                                    '   </tr>'
                                )

                                if(index == 'total'){
                                    var total = (parseFloat(elem.earned) - (parseFloat(elem.expensesFixed) + parseFloat(elem.expensesVariable) + parseFloat(elem.supplieds) + parseFloat(elem.salaries) + parseFloat(elem.financingInterests) + parseFloat(elem.financingAmortizations))).toFixed(2)
                                    var costCenterName = elem.name + ' (Con salarios)'
                                    $('#cashflowBody').append(  
                                        '   <tr>' +
                                        '       <td class="supplieds text-right toBold" colspan="5">Salarios</td>' +
                                        '       <td class="financingInterests text-center">' + toFormatNumber(parseFloat(elem.salaries).toFixed(2)) + ' €</td>' +
                                        '       <td class="financingAmortizations text-right toBold">' + costCenterName + '</td>' +
                                        '       <td class="total text-center">' + toFormatNumber(total) + ' €</td>' +
                                        '   </tr>'
                                    )
                                }
                            })
                        }

                        $('#exportCashflow').attr('disabled', false)

                        // Cuenta de resultados provisional sin Amort.
                        if(data.account == null){
                            $('#accountBody').append(   
                                '   <tr>' +
                                '       <td colspan="8">'+
                                '           <div class="alert alert-warning">No hay datos para mostrar en esta tabla</div>' +
                                '       </td>' +
                                '   </tr>'
                            )
                            $('#exportAccount').attr('disabled', true)
                        }else{
                            $.each(data.account, function(index, elem){
                                var total = (parseFloat(elem.invoice) - (parseFloat(elem.expensesFixed) + parseFloat(elem.expensesVariable) + parseFloat(elem.interest) + parseFloat(elem.taxes))).toFixed(2)
                                var costCenterName = elem.name
                                if(index == 'total'){
                                    costCenterName = 'Total (Sin salarios)'
                                }
                                $('#accountBody').append(
                                    '   <tr>' +
                                    '       <td class="costCenterName text-center toBold">' + costCenterName + '</td>' +
                                    '       <td class="invoiceItem text-center">' + toFormatNumber(parseFloat(elem.invoice).toFixed(2)) + ' €</td>' +
                                    '       <td class="expensesFixed text-center">' + toFormatNumber(parseFloat(elem.expensesFixed).toFixed(2)) + ' €</td>' +
                                    '       <td class="expensesVariable text-center">' + toFormatNumber(parseFloat(elem.expensesVariable).toFixed(2)) + ' €</td>' +
                                    '       <td class="interest text-center">' + toFormatNumber(parseFloat(elem.interest).toFixed(2)) + ' €</td>' +
                                    '       <td class="taxes text-center">' + toFormatNumber(parseFloat(elem.taxes).toFixed(2)) + ' €</td>' +
                                    '       <td class="total text-center">' + toFormatNumber(total) + ' €</td>' +
                                    '   </tr>'
                                )

                                if(index == 'total'){
                                    var total = (parseFloat(elem.invoice) - (parseFloat(elem.expensesFixed) + parseFloat(elem.expensesVariable) + parseFloat(elem.salaries) + parseFloat(elem.interest) + parseFloat(elem.taxes))).toFixed(2)
                                    $('#accountBody').append(
                                        '   <tr>' +
                                        '       <td class="expensesVariable text-right toBold" colspan="4">Salarios</td>' +
                                        '       <td class="interest text-center">' + toFormatNumber(parseFloat(elem.salaries).toFixed(2)) + ' €</td>' +
                                        '       <td class="taxes text-center toBold">Total (Con salarios)</td>' +
                                        '       <td class="total text-center">' + toFormatNumber(total) + ' €</td>' +
                                        '   </tr>'
                                    )
                                }
                            })

                            $('#exportAccount').attr('disabled', false)
                        }

                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        $('#summaryBody').empty()
                        $('#cremationsBody').empty()
                        $('#cashflowBody').empty()
                        $('#accountBody').empty()

                        $('#exportSummary').attr('disabled', true)
                        $('#exportCremations').attr('disabled', true)
                        $('#exportCashflow').attr('disabled', true)
                        $('#exportAccount').attr('disabled', true)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    $('#summaryBody').empty()
                    $('#cremationsBody').empty()
                    $('#cashflowBody').empty()
                    $('#accountBody').empty()

                    $('#exportSummary').attr('disabled', true)
                    $('#exportCremations').attr('disabled', true)
                    $('#exportCashflow').attr('disabled', true)
                    $('#exportAccount').attr('disabled', true)
                }
            })
        }
    })

    $('#saveInvoice').click(function(){
        //Validaciones
        var validate = 0
        $(".select2-invoiceAccountNumber").css("border-color", "")

        if(isEmpty($("#formEditInvoice #paymentMethod"))){
            validate++
        }
        
        if($("#formEditInvoice #accountNumber").val() == 0 || $("#formEditInvoice #accountNumber").val() == null){
            validate++
            $(".select2-invoiceAccountNumber").css("border-color", "red")
        }

        if(isEmpty($("#formEditInvoice #date"))){
            validate++
        }

        if(isEmpty($("#formEditInvoice #pay"))){
            validate++
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            var expedient = $('#modal-edit-invoice #expedient').val();
            var invoiceID = $('#modal-edit-invoice #invoiceID').val();
            var paymentMethod = $('#modal-edit-invoice #paymentMethod').val();
            var comments = $('#modal-edit-invoice #comments').val();
            var accountNumber = $('#modal-edit-invoice #accountNumber').text();
            var paymentState = $('#modal-edit-invoice #paymentState').val();
            var amountPay = $('#modal-edit-invoice #pay').val();
            var paymentDate = moment($('#modal-edit-invoice #date').val(), 'DD/MM/YYYY').format('X');

            $.ajax({
                url: uri + 'core/invoices/update.php',
                method: 'POST',
                data: {
                    expedient: expedient,
                    paymentMethod: paymentMethod,
                    comments: comments,
                    accountNumber: accountNumber,
                    paymentState: paymentState,
                    amountPay: amountPay,
                    paymentDate: paymentDate,
                    invoice: invoiceID
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){

                            if(pendingID != null){
                                $(pendingID).click();
                                $('#filter').click();
                            }

                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pago se ha realizado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)

                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }

                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            //ocultamos la ventana modal
            $('#modal-edit-invoice').modal('hide');
        }
    });

    $('#exportSummary').click(function(){
        var summary = new Array

        var ivaTypesHead = [];
        $.each(ivaTypes, function(index, value){
            ivaTypesHead.push(getIvaLabel() + ' ' + value.percentage + ' %');
        })

        indexM = 0;
        $('#summary-tables tr').each(function(index, elem){

            var mortuaryName = $(this).find('.mortuaryNameTitle').text()
            var currentClientName = $(this).find('.currentClientName').text()
            var numDeceased = $(this).find('.numDeceased').text()
            var bi = $(this).find('.bi').text().replace('€', '').replace('-', '0')
            var supplieds = $(this).find('.supplieds').text().replace('€', '').replace('-', '0')
            var fact = $(this).find('.fact').text().replace('€', '').replace('-', '0')

            var ivaValues = [];
            var itToSearch = $(this);
            $.each(ivaTypes, function(index, value){
                ivaValues.push(itToSearch.find('.iva[data-iva="' + value.percentage + '"]').text().replace('€', '').replace('-', '0'))
            })

            var totalIva = $(this).find('.totalIva').text().replace('€', '').replace('-', '0')
            var factTotal = $(this).find('.factTotal').text().replace('€', '').replace('-', '0')
            var earned = $(this).find('.earned').text().replace('€', '').replace('-', '0')
            var pending = $(this).find('.pending').text().replace('€', '').replace('-', '0')
            var grossMargin = $(this).find('.grossMargin').text().replace('€', '').replace('-', '0')
            var grossMarginShow = $(this).find('.grossMarginShow').text().replace('-', '0,00')
            var averageTimeShow = $(this).find('.averageTimeShow').text().replace('- días', '0').replace('días', '')

            if(mortuaryName != '' && mortuaryName != null){

                var summaryAux = new Array;
                var tableThead = document.querySelectorAll('#modal-list-expedients thead th');
                summaryAux.push(Array.from(tableThead).map(th => th.textContent.trim()));

                    summary.push([mortuaryName])
                    summary.push([''])
                    summary.push([
                        'Cliente',
                        'Nº Expedientes',
                        'Base imponible',
                        'Suplidos',
                        'Facturación',
                        ...ivaTypesHead,
                        'Total ' + getIvaLabel(),
                        'Facturado total',
                        'Cobrado mes c/' + getIvaLabel(),
                        'Pendiente de cobro',
                        'Margen bruto',
                        '% medio margen por cliente',
                        'Tiempo medio de cobro'
                    ])
            }else{
                if(currentClientName != ''){
                    summary.push([
                        currentClientName,
                        numDeceased,
                        bi,
                        supplieds,
                        fact,
                        ...ivaValues,
                        totalIva,
                        factTotal,
                        earned,
                        pending,
                        grossMargin,
                        grossMarginShow,
                        averageTimeShow
                    ])

                    if(currentClientName == 'TOTAL'){
                        summary.push([''])
                        summary.push([ 'Cremaciones'])
                        summary.push([
                            'Cliente',
                            'Nº cremaciones',
                            'Facturación',
                            'Margen medio'
                        ])
        
                        $('#cremationsBody-'+indexM+' > tr').each(function(index, elem){
                            var currentClientNameCremation = $(this).find('.currentClientNameExport').text()
                            var numCremationsCremation = $(this).find('.numCremations').text()
                            var factCremation = $(this).find('.factCremation').text().replace('€', '').replace('-', '0')
                            var grossMarginShowCremation = $(this).find('.grossMarginShowExport').text().replace('-', '0,00').replace('.', ',')
        
                            summary.push([
                                currentClientNameCremation,
                                numCremationsCremation,
                                factCremation,
                                grossMarginShowCremation
                            ])
                        })

                        summary.push([''])
                        summary.push([''])
                        indexM++;
                    }
                }
            }
        })

        summary.push(['Total Tanatorios'])
        summary.push([
            'Cliente',
            'Nº Expedientes',
            'Base imponible',
            'Suplidos',
            'Facturación',
            ...ivaTypesHead,
            'Total ' + getIvaLabel(),
            'Facturado total',
            'Cobrado mes c/' + getIvaLabel(),
            'Pendiente de cobro',
            'Margen bruto',
            '% medio margen por cliente',
            'Tiempo medio de cobro'
        ])

        $('#summaryBodyTotal > tr').each(function(index, elem){
            var currentClientName = $(this).find('.currentClientNameTotal').text()
            var numDeceased = $(this).find('.numDeceasedTotal').text()
            var bi = $(this).find('.biTotal').text().replace('€', '').replace('-', '0')
            var supplieds = $(this).find('.suppliedsTotal').text().replace('€', '').replace('-', '0')
            var fact = $(this).find('.factTotal').text().replace('€', '').replace('-', '0')

            var ivaValues = [];
            var itToSearch = $(this);
            $.each(ivaTypes, function(index, value){
                ivaValues.push(itToSearch.find('.iva[data-iva="' + value.percentage + '"]').text().replace('€', '').replace('-', '0'))
            })

            var totalIva = $(this).find('.totalIvaTotal').text().replace('€', '').replace('-', '0')
            var factTotal = $(this).find('.factTotalTotal').text().replace('€', '').replace('-', '0')
            var earned = $(this).find('.earnedTotal').text().replace('€', '').replace('-', '0')
            var pending = $(this).find('.pendingTotal').text().replace('€', '').replace('-', '0')
            var grossMargin = $(this).find('.grossMarginTotal').text().replace('€', '').replace('-', '0')
            var grossMarginShow = $(this).find('.grossMarginShowTotal').text().replace('-', '0,00')
            var averageTimeShow = $(this).find('.averageTimeShowTotal').text().replace('- días', '0').replace('días', '')

            summary.push([
                currentClientName,
                numDeceased,
                bi,
                supplieds,
                fact,
                ...ivaValues,
                totalIva,
                factTotal,
                earned,
                pending,
                grossMargin,
                grossMarginShow,
                averageTimeShow
            ])
        })

        summary.push([''])
        summary.push(['Cremaciones'])
        summary.push([
            'Cliente',
            'Nº cremaciones',
            'Facturación',
            'Margen medio'
        ])

        $('#cremationsBodyTotal > tr').each(function(index, elem){
            var currentClientNameCremation = $(this).find('.currentClientNameExportTotal').text()
            var numCremationsCremation = $(this).find('.numCremationsTotal').text()
            var factCremation = $(this).find('.factExportTotal').text().replace('€', '').replace('-', '0')
            var grossMarginShowCremation = $(this).find('.grossMarginShowExportTotal').text().replace('-', '0,00').replace('.', ',')

            summary.push([
                currentClientNameCremation,
                numCremationsCremation,
                factCremation,
                grossMarginShowCremation
            ])
        })

        summary.push([''])
        summary.push([''])
        summary.push(['Cash flow'])
        summary.push([
            'Centro de coste',
            'Cobrado',
            'Gastos fijos pagados',
            'Gastos variables pagados',
            'Suplidos profesionales',
            'Intereses pagados',
            'Amort. capital pagado',
            'Resultado'
        ])

        $('#cashflowBody > tr').each(function(index, elem){
            var costCenterName = $(this).find('.costCenterName').text()
            var earned = $(this).find('.earned').text().replace('€', '')
            var expensesFixed = $(this).find('.expensesFixed').text().replace('€', '')
            var expensesVariable = $(this).find('.expensesVariable').text().replace('€', '')
            var supplieds = $(this).find('.supplieds').text().replace('€', '')
            var financingInterests = $(this).find('.financingInterests').text().replace('€', '')
            var financingAmortizations = $(this).find('.financingAmortizations').text().replace('€', '')
            var total = $(this).find('.total').text().replace('€', '')

            summary.push([
                costCenterName,
                earned,
                expensesFixed,
                expensesVariable,
                supplieds,
                financingInterests,
                financingAmortizations,
                total
            ])
        })

        summary.push([''])
        summary.push([''])
        summary.push(['Cuenta de resultados provisional sin Amort.'])
        summary.push([
            'Centro de coste',
            'Cobrado',
            'Gastos fijos',
            'Gastos variables',
            'Intereses',
            'Tasas e impuestos',
            'Resultado'
        ])

        $('#accountBody > tr').each(function(index, elem){
            var costCenterName = $(this).find('.costCenterName').text()
            var invoice = $(this).find('.invoiceItem').text().replace('€', '')
            var expensesFixed = $(this).find('.expensesFixed').text().replace('€', '')
            var expensesVariable = $(this).find('.expensesVariable').text().replace('€', '')
            var interest = $(this).find('.interest').text().replace('€', '')
            var taxes = $(this).find('.taxes').text().replace('€', '')
            var total = $(this).find('.total').text().replace('€', '')

            summary.push([
                costCenterName,
                invoice,
                expensesFixed,
                expensesVariable,
                interest,
                taxes,
                total
            ])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelSummary',
                data: {sumary: summary}
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        $('.exportGraff').click();
    })

    $('.exportSummaryExpedients').click(function(){
      
        var clientName = $("#modal-list-expedients #titleName").text();
        var summary = new Array

        var tableThead = document.querySelectorAll('#modal-list-expedients thead th');
        summary.push(Array.from(tableThead).map(th => th.textContent.trim()));

        var tableTbody = document.querySelectorAll('#modal-list-expedients tbody tr');
        var tbodyData = Array.from(tableTbody).map(fila => {
            return Array.from(fila.cells).map(celda => celda.textContent.trim());
        });

        summary.push(tbodyData[0]);

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelSummaryClient',
                data: summary, 
                clientName: clientName
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('.exportSummaryFacturado').click(function(){
      
        var clientName = $("#modal-list-facturacion #titleName").text();
        var summary = new Array

        var tableThead = document.querySelectorAll('#modal-list-facturacion thead th');
        summary.push(Array.from(tableThead).map(th => th.textContent.trim()));

        var tableTbody = document.querySelectorAll('#modal-list-facturacion tbody tr');
        var tbodyData = Array.from(tableTbody).map(fila => {
            return Array.from(fila.cells).map(celda => celda.textContent.trim());
        });

        summary.push(tbodyData[0]);

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelSummaryFacturado',
                data: summary, 
                clientName: clientName
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('.exportSummaryCobrado').click(function(){
      
        var clientName = $("#modal-list-invoicesPaid #titleName").text();
        var summary = new Array

        var tableThead = document.querySelectorAll('#modal-list-invoicesPaid thead th');
        summary.push(Array.from(tableThead).map(th => th.textContent.trim()));

        var tableTbody = document.querySelectorAll('#modal-list-invoicesPaid tbody tr');
        var tbodyData = Array.from(tableTbody).map(fila => {
            return Array.from(fila.cells).map(celda => celda.textContent.trim());
        });

        summary.push(tbodyData[0]);

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelSummaryCobrado',
                data: summary, 
                clientName: clientName
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('.exportSummaryPending').click(function(){
      
        var clientName = $("#modal-list-invoicesPaid-pending #titleName").text();
        var summary = new Array

        var tableThead = document.querySelectorAll('#modal-list-invoicesPaid-pending thead th');
        summary.push(Array.from(tableThead).map(th => th.textContent.trim()));

        var tableTbody = document.querySelectorAll('#modal-list-invoicesPaid-pending tbody tr');
        var tbodyData = Array.from(tableTbody).map(fila => {
            return Array.from(fila.cells).map(celda => celda.textContent.trim());
        });

        summary.push(tbodyData[0]);

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelSummaryPending',
                data: summary, 
                clientName: clientName
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#exportCremations').click(function(){
        var cremations = new Array

        cremations.push([
            'Cliente',
            'Nº cremaciones',
            'Facturación',
            'Margen medio'
        ])

        $('#cremationsBody > tr').each(function(index, elem){
            var currentClientName = $(this).find('.currentClientName').html().replace('<strong>TOTAL</strong>', 'TOTAL')
            var numCremations = $(this).find('.numCremationsExport').html()
            var fact = $(this).find('.fact').html()
            var grossMarginShow = $(this).find('.grossMarginShow').html()

            cremations.push([
                currentClientName,
                numCremations,
                fact,
                grossMarginShow
            ])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelCremations',
                data: cremations
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#exportCashflow').click(function(){
        var cashflow = new Array

        cashflow.push([
            'Centro de coste',
            'Cobrado',
            'Gastos fijos pagados',
            'Gastos variables pagados',
            'Suplidos profesionales',
            'Intereses pagados',
            'Amort. capital pagado',
            'Resultado'
        ])

        $('#cashflowBody > tr').each(function(index, elem){
            var costCenterName = $(this).find('.costCenterName').text()
            var earned = $(this).find('.earned').text().replace('€', '')
            var expensesFixed = $(this).find('.expensesFixed').text().replace('€', '')
            var expensesVariable = $(this).find('.expensesVariable').text().replace('€', '')
            var supplieds = $(this).find('.supplieds').text().replace('€', '')
            var financingInterests = $(this).find('.financingInterests').text().replace('€', '')
            var financingAmortizations = $(this).find('.financingAmortizations').text().replace('€', '')
            var total = $(this).find('.total').text().replace('€', '')

            cashflow.push([
                costCenterName,
                earned,
                expensesFixed,
                expensesVariable,
                supplieds,
                financingInterests,
                financingAmortizations,
                total
            ])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelCashflow',
                data: cashflow
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#exportAccount').click(function(){
        var account = new Array

        account.push([
            'Centro de coste',
            'Facturado',
            'Gastos fijos',
            'Gastos variables',
            'Intereses',
            'Tasas e impuestos',
            'Resultado'
        ])

        $('#accountBody > tr').each(function(index, elem){
            var costCenterName = $(this).find('.costCenterName').text()
            var invoice = $(this).find('.invoiceItem').text().replace('€', '')
            var expensesFixed = $(this).find('.expensesFixed').text().replace('€', '')
            var expensesVariable = $(this).find('.expensesVariable').text().replace('€', '')
            var interest = $(this).find('.interest').text().replace('€', '')
            var taxes = $(this).find('.taxes').text().replace('€', '')
            var total = $(this).find('.total').text().replace('€', '')

            account.push([
                costCenterName,
                invoice,
                expensesFixed,
                expensesVariable,
                interest,
                taxes,
                total
            ])
        })

        $.ajax({
            url: uri + 'core/statistics/functions.php',
            method: 'POST',
            data: {
                type: 'exportControlPanelAccount',
                data: account
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $("#modal-list-invoicesPaid-pending").on('hide.bs.modal', function(){
        pendingID = null;
    });

    $("#modal-edit-invoice").on('hide.bs.modal', function(){
        $("#modal-edit-invoice #accountNumber").val(null).trigger('change');
        $("#modal-edit-invoice #fileAttachDocMultiple").val(null);
    });
})