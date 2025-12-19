var invoicesTable = null;

/**@var {array} tempAttachments Stores temp Attachments */
var tempAttachments = new Array;

/**
 * Draws attachments section
 */
function drawAttachments(modal){
    $('#' + modal + ' #fileAttachDocMultiple').val(null);
    $('#' + modal + ' #fileAttachDocMultipleSection').empty();
    $.each(tempAttachments, function(index, elem){

        var previewDocButton = '';
        if(!(tempAttachments[index] instanceof File)){
            previewDocButton = '<button class="btn btn-primary preview-doc" style="margin-right:5px" title="Descargar adjunto"><i class="fa fa-file-pdf-o"></i></button>';
        }

        $('#' + modal + ' #fileAttachDocMultipleSection').append(
            '   <div class="d-flex" style="margin-bottom: 5px;" index="' + index + '" modal="' + modal + '">' +
                    previewDocButton +
            '       <button class="btn btn-danger delete-attachment" style="margin-right:5px" title="Eliminar adjunto"><i class="fa fa-minus"></i></button>' +
            '       <span>' + elem.name + '</span>' +
            '   </div>'
        )
    })

    $('#' + modal + ' .delete-attachment').click(function(){
        var docName = $(this).closest('div').find('span').text();
        if(confirm('Si continúas, al guardar el cobro se eliminará este documento: ' + docName)){
            var index = $(this).closest('div').attr('index');
            var modal = $(this).closest('div').attr('modal');
            tempAttachments.splice(index, 1);
            drawAttachments(modal);
        }else{
            return false;
        }
    })

    $('#' + modal + ' .preview-doc').click(function(){
        var index = $(this).closest('div').attr('index')
        var docName = $(this).closest('div').find('span').text();

        if(!(tempAttachments[index] instanceof File)){
            window.open(uri + 'descargar-archivo?file=invoices/' + $("#modal-payments-docs #invoiceID").val() + '/payment/' + $("#modal-payments-docs #paymentID").val()  + '/'+ docName, '_blank');
            return false;
        }
    })
}

//Obtiene la fecha de la primera factura para un tanatorio propio
function getFirstInvoiceDate() {
    var date;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {type: 'getFirstInvoiceDate'},
        type: 'POST',
        async: false,
        success: function (data) {
            date = $.parseJSON(data);
            if(date == null){
                date = moment((new Date()).getFullYear(), "YYYY").format("X");
            }
        }
    });
    return date;
}

function getDayMonth(month){
    var dayAux = 31
    switch(month){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            dayAux = 31
        break
        case 2:
            dayAux = 28
        break
        case 4:
        case 6:
        case 9:
        case 11:
            dayAux = 30
        break
    }
    return dayAux
}

// Obtiene la fecha de la primera factura para un tanatorio propio
function getPaidInfo(invoice) {
    var info;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {type: 'getPaidInfo', invoice: invoice},
        type: 'POST',
        async: false,
        success: function (data) {
            info = $.parseJSON(data);
        }
    });
    return info;
}

function getClients(){
    $('#clients').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: 'Seleccione un cliente',
        allowClear: true,
        ajax: {
            url: uri+'core/clients/dataClientsTypeInvoices.php?clientType=' + $('#clientType').val(),
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
                            id: item.clientID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatDataClient,
        templateSelection: formatDataClient
    });
}

function getBankAccountsFilter(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {
            type : 'listBankAccounts'
        },
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#bankAccountFilter').empty()
                $.each(data, function(index, elem){
                    if(elem.bank == null){
                        bank = ''
                    }else{
                        bank = elem.bank
                    }
                    $('#bankAccountFilter').append('<option value="'+ bank +' - ' + elem.number + '">' + elem.alias + '</option>')
                })
            }
        }
    })
}

function getTPVsFilter(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {
            type : 'listTPVs'
        },
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#tpvFilter').empty()
                $('#tpvFilter').append('<option value="">-</option>')
                $.each(data, function(index, elem){
                    $('#tpvFilter').append('<option value="'+ elem.id + '">' + elem.text + '</option>')
                })
            }
        }
    })
}

function getBillingSeries(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {
            type : 'listBillingSeries'
        },
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#invoiceType').empty()
                $('#invoiceType').append('<option value="">-</option>')
                $.each(data, function(index, elem){
                    $('#invoiceType').append('<option value="'+ elem.id + '">' + elem.text + '</option>')
                })
            }
        }
    })
}

function getTPVsOptions() {
    var info;
    $.ajax({
        url: uri + 'core/expenses/configuration/tpvData.php',
        type: 'POST',
        async: false,
        success: function (data) {
            info = $.parseJSON(data);
        }
    });
    return info;
}

// Calcula los totales de importes totales, pendientes y pagadas
function getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter) {
    var info;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {
                type: 'getTotals', 
                from: from,
                to: to,
                typeInvoice: type,
                clientType: clientType,
                client: client,
                status: status,
                invoiceType: invoiceType,
                paymentMethod: paymentMethodFilter,
                numAccount: numAccount,
                invoiceDateFilter: invoiceDateFilter,
                invoicePaymentFilter: invoicePaymentFilter,
                search: $("#input-search").val()
        },
        type: 'POST',
        async: false,
        success: function (data) {
            info = $.parseJSON(data);

            $('#totalCost').html(toFormatNumber(parseFloat(info['invoices']).toFixed(2)) + ' €')
            $('#totalPay').html(toFormatNumber(parseFloat(info['paid']).toFixed(2)) + ' €')

            $totalNoPay = parseFloat(info['invoices']) - parseFloat(info['paid']);
            $('#totalNoPay').html(toFormatNumber($totalNoPay.toFixed(2)) + ' €')
        }
    });
    return info;
}

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
    return '<div id="' + data.id + '">' + data.text + '</div>';
}

function formatDataClient(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

var selected = [];

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
    //Toolbar Bottom
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
    
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });

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

    // listar clientes
    getClients()

    // Obtener cuentas bancarias para los filtros
    getBankAccountsFilter();

    // Obtener TPVs para los filtros
    getTPVsFilter();

    // Obtener las series de facturacion
    getBillingSeries();

    var pdfType = "date";
    var date = getFirstInvoiceDate();
    var year = moment($.parseJSON(date), "X").format("YYYY");
    var month = moment($.parseJSON(date), "X").format("MM");
    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;
    var month = new Array();
    month[0] = "-";
    month[1] = "Enero";
    month[2] = "Febrero";
    month[3] = "Marzo";
    month[4] = "Abril";
    month[5] = "Mayo";
    month[6] = "Junio";
    month[7] = "Julio";
    month[8] = "Agosto";
    month[9] = "Septiembre";
    month[10] = "Octubre";
    month[11] = "Noviembre";
    month[12] = "Diciembre";

    $('#year').append("<option value='0'>--</option>");
    for (year; year <= currentYear; year++){
        if(currentYear == year){
            $('#year').append("<option value=" + year + " selected>" + year + "</option>");
        }else{
            $('#year').append("<option value=" + year + ">" + year + "</option>");
        }
    }
    var i = 0;
    for (i; i <= 12; i++){
        if(i == currentMonth){
            $('#month').append("<option value=" + i + " selected>" + month[i] + "</option>");
        }else{
            $('#month').append("<option value=" + i + ">" + month[i] + "</option>");
        }
        
    }
    $('#trimester').append($('<option></option>').attr('value', 0).text('--').attr('selected', true));
    $('#trimester').append($('<option></option>').attr('value', 1).text('Trimestre 1'));
    $('#trimester').append($('<option></option>').attr('value', 2).text('Trimestre 2'));
    $('#trimester').append($('<option></option>').attr('value', 3).text('Trimestre 3'));
    $('#trimester').append($('<option></option>').attr('value', 4).text('Trimestre 4'));

    //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
    var from = moment('01/' + $('#month').val() + '/' + $('#year').val(), 'DD/MM/YYYY').format('X')
    var year = parseInt($('#year').val());
    var month = parseInt($('#month').val());
    var dayAux = '31'
    switch(month){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            dayAux = 31
        break
        case 2:
            dayAux = 28
        break
        case 4:
        case 6:
        case 9:
        case 11:
            dayAux = 30
        break
    }
    var to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X')
    var type = $('#type').val()
    var clientType = $('#clientType').val()
    var invoiceType = $('#invoiceType').val()
    var client = $('#clients').val()
    var search = $('#input-search').val()
    var status = $('#status').val()
    var paymentMethodFilter = $('#paymentMethodFilter').val()
    var numAccount = '';
    if(paymentMethodFilter == 'Transferencia'){
        numAccount = $("#bankAccountFilter").val();
    }else if(paymentMethodFilter == 'Tarjeta'){
        numAccount = $("#tpvFilter").val();
    }
    var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
    var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;
    
    // Datatables. Inicialización y configuración de las opciones del plugin
    invoicesTable = $('#invoicesTable').DataTable({
        "ajax": uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status+ "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter,
        "responsive": false,
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '630px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ExpedienteID"},
            {"title": "FacturaID"},
            {"title": "Nº Exp."},
            {"title": "Fecha Factura"},
            {"title": "Nº Factura"},
            {"title": "Cliente"}, // 5
            {"title": "Difunto"},
            {"title": "NIF"},
            {"title": "Importe"},
            {"title": "Cobrado"},
            {"title": "Pendiente"}, // 10
            {"title": "Estado"},
            {"title": "Fecha Cobro"},
            {"title": "Método Cobro"}, 
            {"title": "Núm. Cuenta/TPV"},
            {"title": "Usuario"}, // 15
            {"title": ""},
            {"title": ""},
            {"title": "Exp year"}, 
            {"title": "Invoice number"},
            {"title": "Ver"}, // 20
            {"title": "Cobrar"},
            {"title": "Cobros"},
            {"title": "Cambiar estado"}, 
            {"title": "Nº siniestro"},
            {"title": "Nº póliza"}, // 25
            {"title": "Capital"},
            {"title": "Tanatorio"},
            {"title": "create_date"},
            {"title": "invoice_status"},
            {"title": "last_invoice_id_expedient"}, // 30
            {"title": "rectified_type"}, // 31
        ],
        "columnDefs": [{
            "className": "id centered",
            "targets": [0, 1, 16, 17, 18, 19, 24, 25, 26, 27, 28, 29, 30, 31],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {   "className": "viewClick centered",
            "orderable": false,
            "targets": [2],
            "width": "5%"
        },
        {
            "className": "centered",
            "targets": [3, 12],
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY");
                }
                return data;
            }
        },
        {   "className": "centered",
            "orderable": false,
            "targets": [4],
            "width": "5%"
        },
        {
            "className": "centered",
            "targets": [5,6,9,15]
        },
        {   "className": "centered",
            "targets": [7],
            "width": "5%"
        },
        {
            "className": "centered importModal",
            "targets": [8],
            "width": "5%",
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return '<a title="Ver desglose del importe" style="cursor:pointer"><u>' + toFormatNumber(parseFloat(data).toFixed(2)) + " €" + '</u></a>';
                }
                return parseFloat(data);
            }
        },
        {
            "className": "centered",
            "targets": [9],
            "render": function(data, type, row){
                if(
                    row[29] != 3 &&
                    (row[30] == row[1] || row[31] == 2)
                ){
                    if(type === 'display' || type === 'filter'){
                        return toFormatNumber(parseFloat(data).toFixed(2)) + ' €';
                    }
                    return parseFloat(data)
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "centered",
            "targets": [10],
            "render": function(data, type, row){
                if(
                    row[29] != 3 &&
                    (row[30] == row[1] || row[31] == 2)
                ){
                    return toFormatNumber((parseFloat(row[8]) - parseFloat(row[9])).toFixed(2)) + ' €';
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "centered",
            "targets": [11],
            "render": function (data, type, row) {
                var estado = '';
                if(row[29] == 3){
                    estado = "<strong style='color:red'>Anulada</strong>";
                }else if(
                    row[30] != row[1] && row[31] != 2
                ){
                    estado = "<strong style='color:chocolate'>Rectificada</strong>";
                }else if(parseInt(data) == 1){
                    estado = "<strong style='color:green'>Pagada</strong>";
                }else if(
                    parseFloat(row[8]) != 0 && 
                    parseFloat(row[9]) != 0 &&
                    parseFloat(row[8]) != parseFloat(row[9])
                ){
                    estado = "<strong style='color: blueviolet;'>Pago Parcial</strong>";
                }else{
                    estado = "<strong>Pendiente</strong>";
                }

                return estado;
            }
        },
        {
            "className": "centered",
            "targets": [12,13,14],
            "render": function (data, type, row) {
                if(
                    row[29] != 3 &&
                    (row[30] == row[1] || row[31] == 2)
                ){
                    return data
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "details-control centered viewClick",
            "targets": [20],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered",
            "targets": 21,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function (data, type, row) {
                var charge = '-';
                if(
                    row[29] != 3 &&
                    (row[30] == row[1] || row[31] == 2)
                ){
                    if(row[11] == 1){
                        charge = "<ul class='actions-menu'><li class='disabled'><a class='disabled'><i class='fa fa-credit-card-alt c-grey' aria-hidden='true'></i></a></li></ul>";
                    }else{
                        charge = "<ul class='actions-menu'><li><a class='btn-charge' title='Cobrar'><i class='fa fa-credit-card-alt' aria-hidden='true'></i></a></li></ul>";
                    }
                }
                return charge;
            }
        },
        {
            "className": "details-control centered",
            "targets": 22,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){
                if(
                    row[29] != 3
                    //  && (row[30] == row[1] || row[31] == 2)
                ){
                    return "<ul class='actions-menu'><li><a class='btn-payments' title='Listado de cobros'><i class='fa fa-list-ul' aria-hidden='true'></i></a></li></ul>";
                }else{
                    return "-";
                }
            }
        },
        {
            "className": "details-control centered changeClick",
            "targets": [23],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){
                if(
                    row[29] != 3 &&
                    (row[30] == row[1] || row[31] == 2)
                ){
                    return "<ul class='actions-menu'><li class='disabled'><a class='btn-change' title='Cambiar estado'><i class='fa fa-exchange' aria-hidden='true'></i></a></li></ul>";
                }else{
                    return "-";
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                search: 'applied',
                order: 'applied'
            },
            filename: 'facturas',
            title: 'Facturas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A3',
            exportOptions: {
                columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                search: 'applied',
                order: 'applied'
            },
            filename: 'facturas',
            title: 'Facturas',
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content.splice(0, 1)

                // Configuración
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10

                // Header
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de facturas',
                            bold: true,
                            fontSize: 12
                        },
                        {
                            alignment: 'right',
                            text: moment().format('DD/MM/YYYY HH:mm'),
                            fontSize: 10
                        }],
                        margin: 30
                    }
                })

                // Footer
                doc['footer'] = (function(page, pages){
                    return {
                        columns: [{
                            alignment: 'center',
                            text: 'Página ' + page.toString() + ' de ' + pages.toString(),
                            fontSize: 10
                        }],
                        margin: 20
                    }
                })
            },
            text: 'PDF <i class="fa fa-file-pdf-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'print',
            exportOptions: {
                columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[3, 'desc'], [28, 'desc'], [19, 'desc']],
        "rowCallback": function( row, data ) {
			if($.inArray(data.DT_RowId, selected) !== -1){
				$(row).addClass('selected');
			}
		}
    })

    getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);

    function arrayRemove(arr, value) { return arr.filter(function(ele){ return ele != value; });}

    invoicesTable.on('click', 'tbody tr', function (){
        $(this).toggleClass('selected');
        var expedientID =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data()[0] : invoicesTable.row($(this).closest('tr')).data()[0]
        if(selected.includes(expedientID)){
            selected = arrayRemove(selected, expedientID);
        }else{
            selected.push(expedientID);
        }
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function () {
        invoicesTable.search( this.value ).draw();
        search = this.value
    });

    $('#input-search').on('change', function () {

        // Get totals
        clientType = $('#clientType').val()
        invoiceType = $('#invoiceType').val()
        client = $('#clients').val()
        status = $('#status').val()
        var year = parseInt($('#year').val());

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    invoicesTable.on('click', 'tbody .viewClick', function () {

        $('.btn-view').tooltip('hide');
        var expedientID =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data()[0] : invoicesTable.row($(this).closest('tr')).data()[0]
        $('#modal-print-logo #expID').val(expedientID);
        var invoiceID =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data()[1] : invoicesTable.row($(this).closest('tr')).data()[1]
        $('#modal-print-logo #invID').val(invoiceID);

        $('#modal-print-logo').modal('show');    
    });

    var expedientNumber;
    invoicesTable.on('click', 'tbody .importModal', function(){

        $('.btn-view').tooltip('hide');
        var expedientID =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data()[0] : invoicesTable.row($(this).closest('tr')).data()[0];
        var invoiceID =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data()[0] : invoicesTable.row($(this).closest('tr')).data()[1];
        expedientNumber =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data()[2] : invoicesTable.row($(this).closest('tr')).data()[2];
        
        $.ajax({
            url: uri + 'core/invoices/functions.php',
            method: 'POST',
            data: {
                type: 'getInvoiceInfoEconomic',
                expedient: expedientID,
                invoice: invoiceID
            },
            async: false,
            success: function(data){
                
                let invoiceData = $.parseJSON(data)
                $("#modal-breakdown-import #titleName").empty();
                $("#modal-breakdown-import #titleName").text(expedientNumber);

                // Update THEAD
                var theadTable =
                    '<tr>'+
                    '    <th class="text-center">Num. EXP.</th>'+
                    '    <th class="text-center">Imp. Bruto</th>'+
                    '    <th class="text-center">Suplidos</th>'
                ;
                $.each(invoiceData.listIvas, function(index, elem){
                    theadTable +=
                    '    <th class="text-center">Base Imponible ' + elem['type_iva'] + ' %</th>'+
                    '    <th class="text-center">'+getIvaLabel()+' ' + elem['type_iva'] + ' %</th>'
                })
                theadTable += ' <th class="text-center">Total</th><tr>'
            
                $("#desgloseImporte thead").empty().append(theadTable);

                // Update TBODY
                var tbodyTable =
                '   <tr>' +
                '       <td align="center">' + expedientNumber + '</td>' +
                '       <td align="center">' + invoiceData.bruto +' €</td>' +
                '       <td align="center">' + invoiceData.suplidos +' €</td>';
                $.each(invoiceData.listIvas, function(index, elem){

                    tbodyTable +=
                    '    <td class="text-center">'+ elem['base'] + ' €</td>'+
                    '    <td class="text-center">'+ elem['iva'] + ' €</td>'
                })
                tbodyTable += '<td align="center">' + invoiceData.total +' €</td></tr>';
                
                $("#desgloseImporte tbody").empty().append(tbodyTable);

                $("#modal-breakdown-import").modal('show');
            }
        })
    });

    $('.exportImport').click(function(){
      
        var summary = new Array

        var tableThead = document.querySelectorAll('#desgloseImporte thead th');
        summary.push(Array.from(tableThead).map(th => th.textContent.trim()));

        var tableTbody = document.querySelectorAll('#desgloseImporte tbody tr');
        var tbodyData = Array.from(tableTbody).map(fila => {
            return Array.from(fila.cells).map(celda => celda.textContent.trim());
        });

        summary.push(tbodyData[0]);

        $.ajax({
            url: uri + 'core/invoices/functions.php',
            method: 'POST',
            data: {
                type: 'exportImportExcel',
                data: summary, 
                number: expedientNumber
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.open(uri + 'descargar-archivoExcel?file=' + data, '_blank');
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
            }
        })
    })

    //ver factura con o sin logo
    $('#modal-print-logo #viewInvoice').click(function(){
    
        expedientID = $('#modal-print-logo #expID').val();       
        var invoiceID = $('#modal-print-logo #invID').val();
        var logo = $('#formPrintLogo input:radio[name=print]:checked').val();
        
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

        if(parseInt(logo) == 1){
            window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'.pdf', '_blank');
        }else{
            window.open(uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/invoices/'+ invoiceID +'/'+invoiceInfo['number']+'_no-logo.pdf', '_blank');
        }
        $('#modal-print-invoice-logo').modal('hide');
    });

    invoicesTable.on('click', '.btn-charge', function () {
        $('.btn-charge').tooltip('hide');

        var invoices =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data() : invoicesTable.row($(this).closest('tr')).data();
        var invoice;
        expedientID = invoices[0]
        $.ajax({
            url: uri + 'core/invoices/functions.php',
            method: 'POST',
            data: {
                type: 'getInvoiceInfo',
                expedient: invoices[0],
                invoice: invoices[1]
            },
            async: false,
            success: function(data){
                try{
                    invoice = $.parseJSON(data)
                }catch(e){
                    invoice = null
                    
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            }
        })

        if(invoice != null){

            $("#tpvNumAccountNumberSection").addClass('hide');

            var paymentMethod = invoice.paymentMethod
            var comments = invoice.comments
            var accountNumber = invoice.accountNumber
            var generatedInvoiceNumber = invoice.generatedInvoiceNumber
            var expedientNumber = invoice.expedientNumber
            var total = invoice.total
            var pay = invoice.pay
            var invoiceID = invoice.invoiceID
            var tpvNumAccount = invoice.tpv_num_account;
            
            //Mostramos la modal
            $('#modal-edit-invoice').modal('show');
            $('#modal-edit-invoice #generatedInvoiceNumber').text(generatedInvoiceNumber);
            $('#modal-edit-invoice #expedientNumber').val(expedientNumber);
            $('#modal-edit-invoice #expedient').val(expedientID);
            $('#modal-edit-invoice #invoiceID').val(invoiceID);
            $('#modal-edit-invoice #comments').val(comments);
            
            if(paymentMethod != 'Contado' && paymentMethod != 'Tarjeta' && paymentMethod != 'Giro bancario' && paymentMethod != 'Transferencia'){
                var optionPaymentMethod = new Option(paymentMethod, paymentMethod, false, false);
                $('#modal-edit-invoice #paymentMethod').append(optionPaymentMethod).trigger('change');
            }else{
                $('#modal-edit-invoice #paymentMethod').val(paymentMethod).trigger('change');
            }

            if(accountNumber != null && accountNumber != ''){
                $('#modal-edit-invoice #accountNumber').val(accountNumber).trigger('change');
                if($('#modal-edit-invoice #accountNumber').val() == null){
                    var optionAccountNumber = new Option(accountNumber, accountNumber, false, false);
                    $('#modal-edit-invoice #accountNumber').append(optionAccountNumber);
                    $('#modal-edit-invoice #accountNumber').val(accountNumber).trigger('change');
                }
            }

            if(paymentMethod == 'Tarjeta' && tpvNumAccount != null && tpvNumAccount != ''){
                $("#tpvNumAccountNumber").val(tpvNumAccount)
                $("#tpvNumAccountNumberSection").removeClass('hide');
            }else{
                $("#tpvNumAccountNumberSection").addClass('hide');
            }

            $('#modal-edit-invoice #total').val(total + " €");
            $('#modal-edit-invoice #paied').val(pay + " €");
            let payAmount = parseFloat(total) - parseFloat(pay)
            $('#modal-edit-invoice #pay').val(payAmount.toFixed(2));
            $('#modal-edit-invoice #pay').attr('max-pending-amount', payAmount.toFixed(2));

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = dd + '/' + mm + '/' + yyyy;
            $('#modal-edit-invoice #date').val(today);
        }
    });

    $('#formEditInvoice #fileAttachDocMultiple').change(function(){
        var total = $('#formEditInvoice #fileAttachDocMultiple')[0].files.length;
        var cont = $('#formEditInvoice #fileAttachDocMultiple')[0].files.length;
        $.each($('#formEditInvoice #fileAttachDocMultiple')[0].files, function(index, elem){
            var flag = true;
            $.each(tempAttachments, function(i, item){
                if(item.name == elem.name && item.size == elem.size && item.type == elem.type){
                    flag = false;
                    cont--;
                    return false;
                }
            })

            if(flag){
                // Validate files size
                if(elem.size == 0){
                    $('#modal-edit-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se permite subir un fichero vacío.</div>');
                }else{
                    tempAttachments.push(elem);
                }
            }
        })
        if(total == 0){
            $('#modal-edit-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún documento pdf.</div>');
        }else{
            if(total > cont){
                $('#modal-edit-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos de los documentos pdf que has seleccionado no se han añadido porque ya los habías seleccionado antes.</div>');
            }
        }

        drawAttachments('modal-edit-invoice');
    })

    $('#saveInvoice').click(function(){
        //Validaciones
        var validate = 0;
        $(".select2-invoiceAccountNumber").css("border-color", "");

        $('#formEditInvoice #payError').hide()
        $('#formEditInvoice #pay').removeClass('validateError')

        if(isEmpty($("#formEditInvoice #paymentMethod"))){
            validate++;
        }
        if($("#formEditInvoice #paymentMethod").val() == 'Transferencia'){
            if(isEmpty($("#formEditInvoice #accountNumber"))){
                validate++
            }
        }
        if($("#formEditInvoice #paymentMethod").val() == 'Tarjeta'){
            if(isEmpty($("#formEditInvoice #tpv"))){
                validate++
            }
        }

        if(isEmpty($("#formEditInvoice #date"))){
            validate++;
        }

        if(isEmpty($("#formEditInvoice #pay"))){
            validate++;
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            var expedient = $('#modal-edit-invoice #expedient').val();
            var invoiceID = $('#modal-edit-invoice #invoiceID').val();
            var paymentMethod = $('#modal-edit-invoice #paymentMethod').val();
            var comments = $('#modal-edit-invoice #comments').val();
            var accountNumber = ''
            if($("#formEditInvoice #paymentMethod").val() == 'Transferencia'){
                if($("#formEditInvoice #accountNumber").val() != null && $("#formEditInvoice #accountNumber").val() != 0){
                    accountNumber = $('#modal-edit-invoice #accountNumber').select2('data')[0].text;
                }
            }else if($("#formEditInvoice #paymentMethod").val() == 'Tarjeta'){
                accountNumber = $('#modal-edit-invoice #accountNumber').val();
            }

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

                        var continueFlag = false;
                        switch(data){
                            case false:
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            break;
                            default:
                                continueFlag = true
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pago se ha registrado con éxito.</div>');
                                invoicesTable.ajax.reload();
                            break;
                        }

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
    
                        if(!continueFlag){
                            return false
                        }

                        $.each(tempAttachments, function(index, elem){
                            var docName = elem.name;
            
                            var extension = docName.split('.')[docName.split('.').length - 1]
                            var flagUp = true
                            switch(extension.toLowerCase()){
                                case 'pdf':
                                break
                                default:
                                    flag = false
                                    flagUp = false
                                break;
                            }
            
                            if(flagUp){
                                var dataFile = new FormData();
                                dataFile.append('archivo', elem);
                                dataFile.append('invoice', $.parseJSON(invoiceID));
                                dataFile.append('id', $.parseJSON(data));
                                $.ajax({
                                    url: uri + "core/invoices/fileUpload.php",
                                    type: 'POST',
                                    contentType: false,
                                    data: dataFile,
                                    dataType: 'json',
                                    processData: false,
                                    cache: false,
                                    async: false,
                                    success : function(data){
                                        try{
                                            switch(data){
                                                case true:
                                                break
                                                case false:
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                break
                                                case 'extension':
                                                    flag = false
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tipo de archivo no permitido.</div>')
                                                break
                                                default:
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                break
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    }
                                })
    
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })
    
                        $('#formEditInvoice #fileAttachDocMultiple').val(null);
                        $('#formEditInvoice #fileAttachDocMultipleSection').empty();
                        tempAttachments = new Array;

                        setTimeout(function(){
                            $('#formEditInvoice #msg').empty()
                            $('#block-message').empty()
                        }, 5000)

                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            })

            //ocultamos la ventana modal
            $('#modal-edit-invoice').modal('hide');
        }
    });

    invoicesTable.on('click', '.btn-change', function(){
        $('.btn-change').tooltip('hide');

        var invoices =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data() : invoicesTable.row($(this).closest('tr')).data();

        $.ajax({
            url: uri + 'core/invoices/functions.php',
            method: 'POST',
            data: {
                type: 'changeStatus',
                expedient: invoices[0],
                invoice: invoices[1],
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){
                        invoicesTable.ajax.reload();

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cambio de estado se ha realizado con éxito.</div>');

                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
            }
        })
    })

    invoicesTable.on('click', '.btn-payments', function(){
        $('.btn-payments').tooltip('hide')
        var invoice =  invoicesTable.row($(this).closest('tr')).data() == undefined ? invoicesTable.row($(this).closest('tr.child').prev()).data() : invoicesTable.row($(this).closest('tr')).data()
        $.ajax({
            url: uri + 'core/invoices/functions.php',
            method: 'POST',
            data: {
                type: 'getPayments',
                invoice: invoice[1]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    paidInfo = getPaidInfo(invoice[1]); 

                    $("#modal-payments #titleInvoice").empty();
                    $("#modal-payments #titleInvoice").append('Cobros de la factura <span id="paymentListInvoiceTitle"></span>');
                    $("#modal-payments #paymentListInvoiceTitle").empty();
                    $('#modal-payments #message').empty();   
                    if(paidInfo.generatedInvoiceNumber == null){
                        paidInfo.generatedInvoiceNumber = "";
                    }
                    $("#modal-payments #paymentListInvoiceTitle").append("<strong> "+ paidInfo.generatedInvoiceNumber +"</strong>");
                    $('#modal-payments #divSummary').addClass("hide");
                    $('#modal-payments #totalInvoice').val(null);
                    $('#modal-payments #totalPaid').val(null);
                    $('#modal-payments #amountPending').val(null);
                    if(data == null || data.length == 0){             
                        $('#modal-payments #message').append('<strong>No se ha realizado ningún cobro</strong>');
                        $('#paymentsTable').addClass('hide');
                    }else{
                        $('#paymentsBody').empty();
                        $('#modal-payments #message').html('');
                        $('#paymentsTable').removeClass('hide');
                        $('#modal-payments #divSummary').removeClass("hide");

                        if(paidInfo.totalPaid == 0 || paidInfo.totalPaid == null){
                            paidInfo.totalPaid = "0.00";
                        }
        
                        totalPending = parseFloat(paidInfo.total) - parseFloat(paidInfo.totalPaid);
                        if(totalPending < 0){
                            totalPending = 0.00;
                        }

                        $('#modal-payments #totalInvoice').val(parseFloat(paidInfo.total).toFixed(2) + " €");
                        $('#modal-payments #totalPaid').val(parseFloat(paidInfo.totalPaid).toFixed(2) + " €");
                        $('#modal-payments #amountPending').val(totalPending.toFixed(2) + " €");

                        $.each(data, function(index, elem){

                            var downloadAttachmentButton = '-';
                            if(elem.has_attachments){
                                downloadAttachmentButton = '<button type="button" onclick="downloadAttachments('+invoice[1]+','+elem.ID+')" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>'
                            }

                            $('#paymentsBody').append(  
                                '   <tr>' +
                                '       <td class="hide" id="id">' + elem.ID + '</td>' +
                                '       <td align="center">' +
                                '           <input type="text" class="form-control datepicker" style="text-align: center" id="date'+elem.ID+'" value="' + moment(elem.date, 'X').format('DD/MM/YYYY') + '">' +
                                '       </td>' +
                                '       <td align="center">' +
                                '           <input type="number" class="form-control payment-edit-amount" style="text-align: center" id="amount'+elem.ID+'" value="' + elem.amount + '">' +
                                '       </td>' +
                                '       <td id="downloadPaymentsSection-'+elem.ID+'" class="text-center">' +
                                            downloadAttachmentButton +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <button type="button" invoice="'+invoice[1]+'" payment="' + elem.ID +'" class="btn btn-primary docsPayment"><i class="fa fa-pencil" aria-hidden="true"></i></button>' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <button type="button" payment="' + elem.ID +'" class="btn btn-primary editPayment"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>' +
                                '       </td>' +
                                '       <td class="text-center">' +
                                '           <button type="button" payment="' + elem.ID +'" class="btn btn-danger deletePayment"><i class="fa fa-trash" aria-hidden="true"></i></button>' +
                                '       </td>' +
                                '   </tr>')
                        })
                    }

                    $('.datepicker').datepicker({
                        todayHighlight : true,forceParse: false
                    })

                    $('#modal-payments').modal('show');
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
            }
        })

        // Go to save docs payment
        $("#modal-payments .docsPayment").click(function(){
            
            var invoiceID = $(this).attr('invoice');
            var paymentID = $(this).attr('payment');
            
            var paymentsDocs = getPaymentDocs(invoiceID, paymentID);
            if(paymentsDocs.length > 0){
                tempAttachments = new Array;
                $.each(paymentsDocs, function(index, elem){
                    tempAttachments.push({'name': elem});
                })
            }
            drawAttachments('modal-payments-docs');

            $("#modal-payments-docs #invoiceID").val(invoiceID);
            $("#modal-payments-docs #paymentID").val(paymentID);

            $("#modal-payments-docs #titleModal").empty().html($("#modal-payments #paymentListInvoiceTitle").html());
            $("#modal-payments-docs").modal("show");
            $("#modal-payments").addClass('hide');
        })

        // Go to save edit payment
        $("#modal-payments .editPayment").click(function(){
            var paymentID = $(this).attr("payment");
            var validate = 0;

            if(isEmpty($('#modal-payments #amount' +paymentID))){
                validate++;
            }  

            if(isEmpty($('#modal-payments #date'+paymentID))){
                validate++;
            }

            var totalAmounts = 0;
            $.each($("#modal-payments #paymentsBody .payment-edit-amount"), function(index, value){
                totalAmounts += parseFloat($(this).val())
            })
            var totalInvoice = parseFloat($("#modal-payments #totalInvoice").val());

            if(totalAmounts > totalInvoice){
                validate++;
            }

            if(validate == 0){
                var ID = paymentID
                var amount = $('#modal-payments #amount'+paymentID).val();           
                var date = $('#modal-payments #date'+paymentID).val() == '' ? null : moment($('#modal-payments #date'+paymentID).val(), 'DD/MM/YYYY').format('X');   
                
                $.ajax({
                    url: uri + 'core/invoices/functions.php',
                    method: 'POST',
                    data: {
                        type: 'updatePayment',
                        ID: ID,
                        amount: amount,
                        date: date
                    },
                    async: false,
                    success: function(data){                    
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Pago realizado.</div>');
                            
                            invoicesTable.ajax.reload();
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
        
                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
    
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
    
                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    }
                })
                $('#modal-payments').modal('hide');
            }else{

                if(totalAmounts > totalInvoice){
                    $('#modal-payments #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La suma de los pagos parciales no puede ser superior al total de la factura</div>')
                }else{
                    $('#modal-payments #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>');
                }
    
                setTimeout(function(){
                    $('#modal-payments #warning-message').empty();
                }, 3500)
            }
        })

        // Go to save delete payment
        $("#modal-payments .deletePayment").click(function(){
            var paymentID = $(this).attr("payment");
            var ID = paymentID;
        
            $.ajax({
                url: uri + 'core/invoices/functions.php',
                method: 'POST',
                data: {
                    type: 'deletePayment',
                    ID: ID
                },
                async: false,
                success: function(data){                    
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Pago eliminado.</div>');
                        invoicesTable.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
    
                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000);
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            })
            $('#modal-payments').modal('hide');
        })
    })

    $('#formPaymentsDocs #fileAttachDocMultiple').change(function(){
        var total = $('#formPaymentsDocs #fileAttachDocMultiple')[0].files.length;
        var cont = $('#formPaymentsDocs #fileAttachDocMultiple')[0].files.length;
        $.each($('#formPaymentsDocs #fileAttachDocMultiple')[0].files, function(index, elem){
            var flag = true;
            $.each(tempAttachments, function(i, item){
                if(item.name == elem.name && item.size == elem.size && item.type == elem.type){
                    flag = false;
                    cont--;
                    return false;
                }
            })

            if(flag){
                // Validate files size
                if(elem.size == 0){
                    $('#modal-payments-docs #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se permite subir un fichero vacío.</div>');
                }else{
                    tempAttachments.push(elem);
                }
            }
        })
        if(total == 0){
            $('#modal-payments-docs #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún documento pdf.</div>');
        }else{
            if(total > cont){
                $('#modal-payments-docs #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos de los documentos pdf que has seleccionado no se han añadido porque ya los habías seleccionado antes.</div>');
            }
        }

        drawAttachments('modal-payments-docs');
    })

    $('#savePaymentsDocs').click(function(){

        var invoiceID = $('#formPaymentsDocs #invoiceID').val()
        var paymentID = $('#formPaymentsDocs #paymentID').val()

        var newAttachments = new Array;
        $.each(tempAttachments, function(index, elem){
            if(!(elem instanceof File)){
                newAttachments.push(elem);
            }
        })

        $.ajax({
            url: uri + 'core/invoices/updatePaymentDocs.php',
            method: 'POST',
            data: {
                invoice: invoiceID,
                payment: paymentID,
                newAttachments: newAttachments.length == 0 ? '' : newAttachments
            },
            async: false,
            success: function(data){
                var continueFlag = false;
                switch(data){
                    case false:
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    break;
                    default:
                        $('#modal-payments #message').empty().html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los documentos adjuntos del cobro se han actualizado con éxito.</div>');
                        continueFlag = true
                    break;
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                if(!continueFlag){
                    return false
                }

                $.each(tempAttachments, function(index, elem){
                    if(elem instanceof File){
                        var docName = elem.name;
        
                        var extension = docName.split('.')[docName.split('.').length - 1]
                        var flagUp = true
                        switch(extension.toLowerCase()){
                            case 'pdf':
                            break
                            default:
                                flag = false
                                flagUp = false
                            break;
                        }
        
                        if(flagUp){
                            var dataFile = new FormData();
                            dataFile.append('archivo', elem);
                            dataFile.append('invoice', $.parseJSON(invoiceID));
                            dataFile.append('payment', $.parseJSON(paymentID));
                            $.ajax({
                                url: uri + "core/invoices/fileUploadEdit.php",
                                type: 'POST',
                                contentType: false,
                                data: dataFile,
                                dataType: 'json',
                                processData: false,
                                cache: false,
                                async: false,
                                success : function(data){
                                    try{
                                        switch(data){
                                            case true:
                                                $('#modal-payments #message').empty().html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los documentos adjuntos del cobro se han actualizado con éxito.</div>');
                                            break
                                            case false:
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            break
                                            case 'extension':
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tipo de archivo no permitido.</div>')
                                            break
                                            default:
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            break
                                        }
                                    }catch(e){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    }
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                }
                            })

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    }
                })

                var downloadAttachmentButton = '-';
                if(newAttachments.length > 0 || tempAttachments.length > 0){
                    downloadAttachmentButton = '<button type="button" onclick="downloadAttachments('+invoiceID+','+paymentID+')" class="btn btn-primary"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>'
                }
                $("#downloadPaymentsSection-" + paymentID).empty().append(downloadAttachmentButton);


                $('#formPaymentsDocs #fileAttachDocMultiple').val(null);
                $('#formPaymentsDocs #fileAttachDocMultipleSection').empty();
                tempAttachments = new Array;
               
                invoicesTable.ajax.reload();
                $('#modal-payments-docs').modal('hide')

                setTimeout(function(){
                    $('#block-message').empty()
                    $('#modal-payments #message').empty()
                    $('#formPaymentsDocs #msg').empty()
                }, 5000)
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                $('#modal-payments-docs').modal('hide')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#year').change(function(){
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());
        pdfType = "date";

        type = $('#type').val()
        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        client = $('#clients').val();
        status = $('#status').val();
        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            $('#month').attr("disabled", true);
            $('#month').val(0);
            $('#trimester').attr("disabled", true);

            from = null;
            to = null;
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            $('#month').attr("disabled", false);
            $('#trimester').attr("disabled", false);

            if($('#month').val() == 0){
                from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            }else{
                from = moment('01/' + $('#month').val() + '/' + $('#year').val() + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                var dayAux = getDayMonth(month)
                to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            }
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }

        $('#from').val('');
        $('#to').val('');

        $('#trimester').val(0);
    })

    $('#month').change(function(){
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());
        pdfType = "date";
        if($('#month').val() == 0){
            from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
            to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
        }else{
            //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
            from = moment('01/' + $('#month').val() + '/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
            var dayAux = getDayMonth(month);
            to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
        }
        type = $('#type').val();
        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        client = $('#clients').val();
        status = $('#status').val();

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();

        getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);

        $('#from').val('');
        $('#to').val('');

        $('#trimester').val(0);
    })

    $('#trimester').change(function(){
        pdfType = "trimester";
        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        var year = parseInt($('#year').val());
        var month = parseInt($('#month').val());
        switch($('#trimester').val()){
            case '0':
                if($('#month').val() == 0){
                    from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                }else{
                    //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                    from = moment('01/' + month + '/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    var dayAux = getDayMonth(month);
                    to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                }
            break;
            case '1':
                from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                var dayAux = getDayMonth(3);
                to = moment(dayAux + '/03/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            break;
            case '2':
                from = moment('01/04/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                var dayAux = getDayMonth(6);
                to = moment(dayAux + '/06/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            break;
            case '3':
                from = moment('01/07/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                var dayAux = getDayMonth(9);
                to = moment(dayAux + '/09/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            break;
            case '4':
                from = moment('01/10/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                var dayAux = getDayMonth(12);
                to = moment(dayAux + '/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            break;
        }

        type = $('#type').val();
        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        client = $('#clients').val();
        status = $('#status').val();
        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status+ "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();

        getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);

        $('#from').val('');
        $('#to').val('');

        $('#month').val(0);
    })

    $('#type').change(function(){
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());

        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        type = $(this).val();
        client = $('#clients').val();
        status = $('#status').val();

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            switch ($('#trimester').val()){
                case '0':
                    if($('#month').val() == 0){
                        from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    }else{
                        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                        from = moment('01/' + month + '/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(month);
                        to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    }
                break;
                case '1':
                    from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    var dayAux = getDayMonth(3);
                    to = moment(dayAux + '/03/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                break;
                case '2':
                    from = moment('01/04/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    var dayAux = getDayMonth(6);
                    to = moment(dayAux + '/06/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                break;
                case '3':
                    from = moment('01/07/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    var dayAux = getDayMonth(9);
                    to = moment(dayAux + '/09/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                break;
                case '4':
                    from = moment('01/10/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    var dayAux = getDayMonth(12);
                    to = moment(dayAux + '/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                break;
            }

            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#clientType').change(function(){
        $('#clients').val(null)
        clientType = $(this).val()
        invoiceType = $('#invoiceType').val()
        client = $('#clients').val()
        status = $('#status').val()
        var year = parseInt($('#year').val());

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            getClients()
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load()
        
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            getClients()
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load()
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#clients').change(function(){
        clientType = $('#clientType').val()
        invoiceType = $('#invoiceType').val()
        client = $('#clients').val()
        status = $('#status').val()
        var year = parseInt($('#year').val());

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load()
       
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load()
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#search').click(function(){
        var validate = 0;

        if(isEmpty($('#from'))){
            validate++;
        }
        if(isEmpty($('#to'))){
            validate++;
        }

        if(validate == 0){
            from = moment($('#from').val(), 'DD/MM/YYYY').format('X');
            to = moment($('#to').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            type = $('#type').val();
            invoiceType = $('#invoiceType').val();
            clientType = $('#clientType').val();
            client = $('#clients').val();
            status = $('#status').val();

            var paymentMethodFilter = $('#paymentMethodFilter').val()
            var numAccount = '';
            if(paymentMethodFilter == 'Transferencia'){
                numAccount = $("#bankAccountFilter").val();
            }else if(paymentMethodFilter == 'Tarjeta'){
                numAccount = $("#tpvFilter").val();
            }
            var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
            var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>');

            setTimeout(function(){
                $('#block-message').empty();
            }, 3500)
        }
    })

    $('#status').change(function(){
        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        client = $('#clients').val();
        status = $('#status').val();
        var year = parseInt($('#year').val());

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#invoiceType').change(function(){
        invoiceType = $('#invoiceType').val();
        clientType = $('#clientType').val();
        client = $('#clients').val();
        status = $('#status').val();
        var year = parseInt($('#year').val());

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#paymentMethodFilter').change(function(){
        $("#tpvSection").addClass('hide');
        $("#bankAccountSection").addClass('hide');
        if($('#paymentMethodFilter').val() == 'Transferencia'){
            $("#tpvFilter").val('').trigger('change');
            $("#bankAccountSection").removeClass('hide');
        }else if($('#paymentMethodFilter').val() == 'Tarjeta'){
            $("#tpvSection").removeClass('hide');
            $("#bankAccountFilter").val('').trigger('change');
        }else{
            invoiceType = $('#invoiceType').val();
            clientType = $('#clientType').val();
            client = $('#clients').val();
            status = $('#status').val();
            var year = parseInt($('#year').val());
            var paymentMethodFilter = $('#paymentMethodFilter').val()
            var numAccount = '';
            var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
            var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;
            if(year == 0){
                invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
            
                getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
            }else{
                invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
            
                getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
            }
        }
    })

    $('#bankAccountFilter').change(function(){
        invoiceType = $('#invoiceType').val();
        clientType = $('#clientType').val();
        client = $('#clients').val();
        status = $('#status').val();
        var year = parseInt($('#year').val());
        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = $("#bankAccountFilter").val();
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#tpvFilter').change(function(){
        invoiceType = $('#invoiceType').val();
        clientType = $('#clientType').val();
        client = $('#clients').val();
        status = $('#status').val();
        var year = parseInt($('#year').val());
        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount =  $("#tpvFilter").val()
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if(year == 0){
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType+ "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(null, null, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }else{
            invoicesTable.ajax.url(uri + "core/invoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type + "&clientType=" + clientType + "&client=" + client + "&status=" + status + "&invoiceType=" + invoiceType + "&paymentMethod=" + paymentMethodFilter + "&numAccount=" + numAccount + "&invoiceDateFilter=" + invoiceDateFilter + "&invoicePaymentFilter=" + invoicePaymentFilter).load();
        
            getTotals(from, to, type, clientType, client, status, invoiceType, paymentMethodFilter, numAccount, invoiceDateFilter, invoicePaymentFilter);
        }
    })

    $('#modal-edit-invoice #paymentMethod').change(function(){
        if($('#modal-edit-invoice #paymentMethod').val() == 'Transferencia'){

            // Obtener cuentas bancarias
            $('#modal-edit-invoice #accountNumber').empty().select2({
                containerCssClass: 'select2-expedients select2-invoiceAccountNumber',
                language: langSelect2,
                placeholder: 'Seleccionar entidad bancaria',
                allowClear: false,       
                ajax: {
                    url: uri + 'core/expenses/configuration/bankAccountsDatav2.php',
                    dataType: 'json',
                    delay: 250,
                    data: function(params){
                        return {
                            q: params.term || "",
                            page_limit: limit_page,
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

            $("#modal-edit-invoice #accountNumberLabel").text('Nº Cuenta:');

            $("#modal-edit-invoice #accountNumberSection").removeClass('hide');

            $("#modal-edit-invoice #tpvNumAccountNumberSection").addClass('hide');
        }else if($('#modal-edit-invoice #paymentMethod').val() == 'Tarjeta'){

            // Obtener los tpvs
            var options = getTPVsOptions();
            $('#modal-edit-invoice #accountNumber').empty().select2({
                language: 'es',
                placeholder: 'Selecciona un TPV...',
                data: options
            })
            $('#modal-edit-invoice #accountNumber').val(null).trigger('change');

            $("#modal-edit-invoice #accountNumberLabel").text('TPV:');
            $("#modal-edit-invoice #accountNumberSection").removeClass('hide');

            $('#modal-edit-invoice #accountNumber').change(function(){
                if($(this).val() != null && $('#modal-edit-invoice #paymentMethod').val() == 'Tarjeta'){
                    if($('#modal-edit-invoice #accountNumber').select2('data')[0]['numAccount'] != ''){
                        $("#tpvNumAccountNumber").val($('#modal-edit-invoice #accountNumber').select2('data')[0]['numAccount'])
                        $("#tpvNumAccountNumberSection").removeClass('hide')
                    }else{
                        $("#tpvNumAccountNumberSection").addClass('hide')
                    }
                }else{
                    $("#tpvNumAccountNumberSection").addClass('hide')
                }
            })
        }else{
            $("#modal-edit-invoice #accountNumberSection").addClass('hide')
            $("#modal-edit-invoice #tpvNumAccountNumberSection").addClass('hide');
        }
    })

    //Modales. Acciones
    $('#modal-edit-invoice').on('hidden.bs.modal', function (e) {
        $('#formEditInvoice input').val('');
        $(".select2-invoiceAccountNumber").css("border-color", "");
        clean("formEditInvoice");

        $('#formEditInvoice #fileAttachDocMultiple').val(null);
        $('#formEditInvoice #fileAttachDocMultipleSection').empty();
        tempAttachments = new Array;
    });

    $('#modal-payments-docs').on('hidden.bs.modal', function (e) {
        $('#formPaymentsDocs #fileAttachDocMultiple').val(null);
        $('#formPaymentsDocs #fileAttachDocMultipleSection').empty();
        tempAttachments = new Array;

        $("#modal-payments").removeClass('hide');
    });

    // Downloads Zip
    $('#downloadZip').click(function(){
        $('#downloadZip').attr("disabled", true);
       
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());

        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        type = $('#type').val();
        client = $('#clients').val();
        status = $('#status').val();

        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        var validate = true;

        if($('#from').val() != '' && $('#to').val() != ''){
            from = moment($('#from').val(), 'DD/MM/YYYY').format('X');
            to = moment($('#to').val(), 'DD/MM/YYYY').format('X');
        }else{
            if($('#trimester').val() != null && $('#trimester').val() != ''){
                switch ($('#trimester').val()){
                    case '0':
                        if($('#month').val() == 0){
                            from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                            to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                        }else{
                            //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                            from = moment('01/' + month + '/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                            var dayAux = getDayMonth(month);
                            to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                        }
                    break;
                    case '1':
                        from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(3);
                        to = moment(dayAux + '/03/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                    case '2':
                        from = moment('01/04/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(6);
                        to = moment(dayAux + '/06/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                    case '3':
                        from = moment('01/07/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(9);
                        to = moment(dayAux + '/09/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                    case '4':
                        from = moment('01/10/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(12);
                        to = moment(dayAux + '/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                }
            }else{
                if(($('#from').val() == '' || $('#from').val() == null) && ($('#to').val() == '' || $('#to').val() == null) ){
                    if($('#month').val() == 0){
                        var month = parseInt($('#month').val());
                        var year = parseInt($('#year').val());
            
                        from = parseInt(new Date("01-01-" + $('#year').val()).getTime()) / 1000;
                        to = parseInt(new Date("12-31-" + $('#year').val()).getTime()) / 1000;
                    }else{
                        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                        var month = parseInt($('#month').val()) + 1;
                        var year = parseInt($('#year').val());
                        if(month == 13){
                            month = 1;
                            year ++;
                        }
                        from = parseInt(new Date($('#month').val() + "-01-" + $('#year').val()).getTime()) / 1000;
                        to = parseInt(new Date(month + "-01-" + year).getTime()) / 1000;
                    }
                }else{
                    if($('#from').val() == '' || $('#to').val() == ''){
                        validate = false;
                    }else{
                        from = moment($('#from').val() + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        to = moment($('#to').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    }
                }
            }
        }
        
        if(validate){
            if($('#year').val() == 0 && $('#from').val() == '' && $('#to').val() == ''){
                $.ajax({
                    url: uri + "core/invoices/downloadZip.php",
                    data: {
                        type: type,
                        clientType: clientType,
                        invoiceType: invoiceType,
                        client: client,
                        search: search,
                        status: status,
                        paymentMethod: paymentMethodFilter,
                        numAccount: numAccount,
                        invoiceDateFilter: invoiceDateFilter,
                        invoicePaymentFilter: invoicePaymentFilter
                    },
                    type: 'POST',
                    async: true,
                    success: function (data) {
                        info = $.parseJSON(data);
        
                        if(info == 'no_results'){
                            alert('No se han encontrado resultados');
                        }else if(info == 'error'){
                            alert('error')
                        }else{
                            window.open(uri + 'descargar-archivo-zip?file=' + info, '_blank');
                        }

                        $('#downloadZip').attr("disabled", false);
                    }
                });
            }else{
                $.ajax({
                    url: uri + "core/invoices/downloadZip.php",
                    data: {
                        from: from,
                        to: to,
                        type: type,
                        clientType: clientType,
                        invoiceType: invoiceType,
                        client: client,
                        search: search,
                        status: status,
                        paymentMethod: paymentMethodFilter,
                        numAccount: numAccount,
                        invoiceDateFilter: invoiceDateFilter,
                        invoicePaymentFilter: invoicePaymentFilter
                    },
                    type: 'POST',
                    async: true,
                    success: function (data) {
                        info = $.parseJSON(data);
            
                        if(info == 'no_results'){
                            alert('No se han encontrado resultados');
                        }else if(info == 'error'){
                            alert('error');
                        }else{
                            window.open(uri + 'descargar-archivo-zip?file=' + info, '_blank');
                        }

                        $('#downloadZip').attr("disabled", false);
                    }
                });
            }
        }else{
            alert('Indica un rango de fechas correcto.');
        }
    })

    // Downloads selected Zip
    $('#downloadZipSelected').click(function(){

        $('#downloadZipSelected').attr("disabled", true);

        if(selected.length > 0){
            $.ajax({
                url: uri + "core/invoices/downloadZipSelected.php",
                data: {
                    selected: selected.toString()
                },
                type: 'POST',
                async: true,
                success: function (data) {
                    info = $.parseJSON(data);
    
                    if(info == 'error'){
                        alert('error');
                    }else{
                        window.open(uri + 'descargar-archivo-zip?file=' + info, '_blank');
                    }

                    $('#downloadZipSelected').attr("disabled", false);
                }
            })
        }else{
            alert('No se ha seleccionado ninguna factura.');
            $('#downloadZipSelected').attr("disabled", false);
        }
    })

    // Downloads invoices in A3 format
    $('#downloadFormatA3').click(function(){
        $("#downloadFormatA3").attr("disabled", true);

        validate = true;

        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());

        clientType = $('#clientType').val();
        invoiceType = $('#invoiceType').val();
        type = $('#type').val();
        client = $('#clients').val();
        status = $('#status').val();
        var paymentMethodFilter = $('#paymentMethodFilter').val()
        var numAccount = '';
        if(paymentMethodFilter == 'Transferencia'){
            numAccount = $("#bankAccountFilter").val();
        }else if(paymentMethodFilter == 'Tarjeta'){
            numAccount = $("#tpvFilter").val();
        }
        var invoiceDateFilter = $('#invoiceDateFilter').prop('checked') ? 1 : 0;
        var invoicePaymentFilter = $('#invoicePaymentFilter').prop('checked') ? 1 : 0;

        if($('#from').val() != '' && $('#to').val() != ''){
            from = moment($('#from').val(), 'DD/MM/YYYY').format('X');
            to = moment($('#to').val(), 'DD/MM/YYYY').format('X');
        }else{
            if($('#trimester').val() != null && $('#trimester').val() != '' && $('#trimester').val() != '0'){
                switch ($('#trimester').val()){
                    case '0':
                        if($('#month').val() == 0){
                            from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                            to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                        }else{
                            //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                            from = moment('01/' + month + '/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                            var dayAux = getDayMonth(month);
                            to = moment(dayAux + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                        }
                    break;
                    case '1':
                        from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(3);
                        to = moment(dayAux + '/03/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                    case '2':
                        from = moment('01/04/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(6);
                        to = moment(dayAux + '/06/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                    case '3':
                        from = moment('01/07/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(9);
                        to = moment(dayAux + '/09/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                    case '4':
                        from = moment('01/10/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var dayAux = getDayMonth(12);
                        to = moment(dayAux + '/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    break;
                }
            }else{
                if(($('#from').val() == '' || $('#from').val() == null) && ($('#to').val() == '' || $('#to').val() == null) ){
                    if($('#month').val() == 0){
                        var month = parseInt($('#month').val());
                        var year = parseInt($('#year').val());
            
                        from = parseInt(new Date("01-01-" + $('#year').val()).getTime()) / 1000;
                        to = parseInt(new Date("12-31-" + $('#year').val()).getTime()) / 1000;
                    }else{
                        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                        var month = parseInt($('#month').val()) + 1;
                        var year = parseInt($('#year').val());
                        if(month == 13){
                            month = 1;
                            year ++;
                        }
                        from = parseInt(new Date($('#month').val() + "-01-" + $('#year').val()).getTime()) / 1000;
                        to = parseInt(new Date(month + "-01-" + year).getTime()) / 1000;
                    }
                }else{
                    if($('#from').val() == '' || $('#to').val() == ''){
                        validate = false;
                    }else{
                        from = moment($('#from').val() + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        to = moment($('#to').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    }
                }
            }
        }

        if(validate){
            if($('#year').val() == 0 && $('#from').val() == '' && $('#to').val() == ''){
                $.ajax({
                    url: uri + "core/invoices/downloadA3.php",
                    data: {
                        type: type,
                        clientType: clientType,
                        invoiceType: invoiceType,
                        client: client,
                        search: search,
                        status: status,
                        paymentMethod: paymentMethodFilter,
                        numAccount: numAccount,
                        invoiceDateFilter: invoiceDateFilter,
                        invoicePaymentFilter: invoicePaymentFilter
                    },
                    type: 'POST',
                    async: true,
                    success: function (data) {
                        info = $.parseJSON(data);
        
                        if(info == 'no_results'){
                            alert('No se han encontrado resultados');
                        }else if(info == 'error'){
                            alert('error');
                        }else{
                            window.open(uri + 'descargar-archivoAll?file=' + info, '_blank');
                        }

                        $("#downloadFormatA3").attr("disabled", false);
                    }
                });
            }else{
                $.ajax({
                    url: uri + "core/invoices/downloadA3.php",
                    data: {
                        from: from,
                        to: to,
                        type: type,
                        clientType: clientType,
                        invoiceType: invoiceType,
                        client: client,
                        search: search,
                        status: status,
                        paymentMethod: paymentMethodFilter,
                        numAccount: numAccount,
                        invoiceDateFilter: invoiceDateFilter,
                        invoicePaymentFilter: invoicePaymentFilter
                    },
                    type: 'POST',
                    async: true,
                    success: function (data) {
                        info = $.parseJSON(data);
            
                        if(info == 'no_results'){
                            alert('No se han encontrado resultados');
                        }else if(info == 'error'){
                            alert('error');
                        }else{
                            window.open(uri + 'descargar-archivoAll?file=' + info, '_blank');
                        }

                        $("#downloadFormatA3").attr("disabled", false);
                    }
                });
            }

        }else{
            $("#downloadFormatA3").attr("disabled", false);
            alert('Indica un rango de fechas correcto.');
        }
    })
});

/**
 * Gets docs by payment
 * 
 * @return {array}
 */
function getPaymentDocs(invoiceID, paymentID){

    var info = null;

    $.ajax({
        url: uri + "core/invoices/functions.php",
        method: 'POST',
        data: {
            type: 'getPaymentsDocs',
            invoice: invoiceID,
            payment: paymentID
        },
        type : 'POST',
        dataType: 'json',
        async: false,
        success: function(data){
            info = $.parseJSON(data);
        }
    })

    return info;
}

function downloadAttachments(invoiceID, paymentID){

    $.ajax({
        url: uri + "core/invoices/downloadPaymentsAttachments.php",
        method: 'POST',
        data: {
            invoice: invoiceID,
            payment: paymentID
        },
        dataType: 'json',
        async: false,
        success: function(data){
            if(data == 'no_files'){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No hay adjuntos para descargar.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else if(data == 'error'){
                $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error al descargar los adjuntos.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else{
                setTimeout(() => {
                    window.open(uri + 'descargar-archivo?file=' + data, '_blank')
                });
            }
        }
    })
}