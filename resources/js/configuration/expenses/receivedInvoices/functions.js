const urlParams = new URLSearchParams(window.location.search);

/**@var {array} tempAttachments Stores temp Attachments */
var tempAttachments = new Array;

/**@var {array} tableInvoices Stores table invoices */
var tableInvoices = new Array;

/**@var {array} ivasReceived Stores ivas received */
var ivasReceived = new Array;

/**@var {array} ivasReceivedOptions Stores ivas received */
var ivasReceivedOptions = new Array;

/**@var {int} itemsIvasBreakdown Stores ivas modal breakdown */
var itemsIvasBreakdown = 1;

/**@var {array} columsIvaSelectedExport Stores temp Attachments */
var columsIvaSelectedExport = new Array;

/**
 * Draws attachments section
 */
function drawAttachments(modal){
    $('#' + modal + ' #fileAttachDocMultiple').val(null);
    $('#' + modal + ' #fileAttachDocMultipleSection').empty();
    $.each(tempAttachments, function(index, elem){
        $('#' + modal + ' #fileAttachDocMultipleSection').append(
            '   <div class="d-flex" style="margin-bottom: 5px;" index="' + index + '" modal="' + modal + '">' +
            '       <button class="btn btn-danger delete-attachment" style="margin-right:5px" title="Eliminar adjunto"><i class="fa fa-minus"></i></button>' +
            '       <span>' + elem.name + '</span>' +
            '   </div>'
        )
    })

    $('#' + modal + ' .delete-attachment').click(function(){
        var docName = $(this).closest('div').find('span').text();
        if(confirm('Si continúas, al guardar la factura se eliminará este documento: ' + docName)){
            var index = $(this).closest('div').attr('index');
            var modal = $(this).closest('div').attr('modal');
            tempAttachments.splice(index, 1);
            drawAttachments(modal);
        }
    })
}

/**
 * Downloads attachments
 * 
 * @param {int} id Id
 */
function downloadAttachments(id){
    $.ajax({
        url: uri + 'core/expenses/receivedInvoices/downloadAttachments.php',
        method: 'POST',
        data: {
            id: id
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

// SELECT2
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>'
    return data
}

// Obtiene la fecha de la primera factura para un tanatorio propio
function getFirstReceivedInvoiceDate() {
    var date;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {type: 'getFirstReceivedInvoiceDate'},
        type: 'POST',
        async: false,
        success: function (data) {
            date = $.parseJSON(data);
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
        url: uri + "core/expenses/receivedInvoices/functions.php",
        data: {type: 'getPaidInfo', invoice: invoice},
        type: 'POST',
        async: false,
        success: function (data) {
            info = $.parseJSON(data);
        }
    });
    return info;
}

// Calcula los totales de importes totales, pendientes y pagadas
function getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter) {
    var info;
    $.ajax({
        url: uri + "core/expenses/receivedInvoices/functions.php",
        data: {
            type: 'getTotals', 
            from: from,
            to: to,
            typeInvoice: type,
            supplier: supplier,
            costCenterFilter: costCenterFilter,
            cashOutFilter: cashOutFilter,
            expenseTypeFilter: expenseTypeFilter,
            paymentMethodFilter: paymentMethodFilter,
            bankAccountFilter: bankAccountFilter,
            creditCardFilter: creditCardFilter,
        },
        type: 'POST',
        async: false,
        success: function (data) {
            info = $.parseJSON(data);

            $('#totalCost').html(toFormatNumber(info['invoices'].toFixed(2)) + ' €')
            $('#totalPay').html(toFormatNumber(info['paid'].toFixed(2)) + ' €')

            $totalNoPay = parseFloat(info['invoices']) - parseFloat(info['paid']);
            $('#totalNoPay').html(toFormatNumber($totalNoPay.toFixed(2)) + ' €')
        }
    });
    return info;
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

$(function(){

    var yearParam = urlParams.get('year');
    var monthParam = urlParams.get('month');
    var invoiceNumberParam = urlParams.get('number');
    var dateParam = urlParams.get('date');

    // TOOLBAR BOTTOM
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    changeSpaceFooter()
    $('#backLink').click(function(event){
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
    })

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

    // IVA
    $.ajax({
        url: uri + 'core/iva/functions.php',
        method: 'POST',
        data: {
            type: 'get',
            ivaType : 2
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                ivasReceivedOptions = data;

                if(data == null){
                    $('.iva').append('<option value="0">-</option>')
                }else{

                    var typesIvasFilter = [];
                    $.each(data, function(index, elem){
                        $('.iva').append('<option value="' + elem.percentage + '">' + elem.name + '</option>')
                        
                        if(elem.percentage > 0){
                            typesIvasFilter.push({'id': elem.percentage, 'text': elem.name});
                            ivasReceived.push(elem.percentage)
                        }
                    })

                    $('#typesIvaFilter').select2({
                        language: 'es',
                        placeholder: '--',
                        allowClear: true,
                        multiple: true,
                        data: typesIvasFilter
                    })
                    $('#typesIvaFilter').val(null).trigger('change')

                    $('#typesIvaFilter').change(function(index, value){

                        // Hide columns
                        $.each(ivasReceived, function(index, value){
                            var arrayPosition = 5 + index;
                            table.column(arrayPosition).visible(false);
                        })

                        // Show columns
                        if($(this).val() != null){
                           
                            columsIvaSelectedExport = [1,2,3,4];
                            
                            $.each($(this).val(), function(index, value){
                                var arrayPosition = 5 + ivasReceived.indexOf(value);
                                table.column(arrayPosition).visible(true);

                                columsIvaSelectedExport.push(arrayPosition);
                            })

                            columsIvaSelectedExport.push(columIdRetencion);
                            columsIvaSelectedExport.push(columIdSuplido);
                            columsIvaSelectedExport.push(columIdTotal);
                            columsIvaSelectedExport.push(columIdPagada);
                            columsIvaSelectedExport.push(columIdFormaPago);

                        }else{
                            columsIvaSelectedExport = [1,2,3,4, columIdRetencion, columIdSuplido, columIdTotal, columIdPagada, columIdFormaPago]
                        }
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

    $('#suppliers').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/suppliers/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
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

    $('#costCenterFilter').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expenses/configuration/dataCostCenter.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
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

    // FACTURAS RECIBIDAS - BÚSQUEDA
    var pdfType = "date";
    var date = getFirstReceivedInvoiceDate();
    if(date.firtsDate != null){
        var year = moment($.parseJSON(date['firtsDate']), "X").format("YYYY");
        var maxYear = moment($.parseJSON(date['lastDate']), "X").format("YYYY");
        var month = moment($.parseJSON(date['firtsDate']), "X").format("MM");
    }else{
        var year = (new Date()).getFullYear();
        var maxYear = (new Date()).getFullYear();
    }
    var currentYear = yearParam != null ? yearParam : (new Date()).getFullYear();
    var currentMonth = monthParam != null ? monthParam : (new Date()).getMonth() + 1;
    var month = new Array();
    month[0] = "--";
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

    for(year; year <= maxYear; year++){
        if(currentYear == year){
            $('#year').append("<option value=" + year + " selected>" + year + "</option>");
        }else{
            $('#year').append("<option value=" + year + ">" + year + "</option>");
        }
    }
    var i = 0;
    for(i; i <= 12; i++){
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
    var year = parseInt($('#year').val());
    var month = parseInt($('#month').val());
    if(month < 10){
        month = "0" + month;
    }

    if(dateParam != null){
        day = moment(dateParam, 'X').format('DD')
        from = moment(dateParam, 'X').format('DD/MM/YYYY')
        $("#from").val(from)
        to = moment(dateParam, 'X').format('DD/MM/YYYY')
        $("#to").val(to)
    }else{
        var day = moment("01/" + month + "/" + year, "DD/MM/YYYY").endOf('month').format('DD');
        var from = moment($('#year').val() + '-' + month + '-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').format('X')
        var to = moment(year + '-' + month + '-' + day + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss').format('X')
    }
    
    var type = 0;
    var status = '-';
    var supplier = '';
    var costCenterFilter = '';
    var cashOutFilter = '0';
    var expenseTypeFilter = '0';
    var paymentMethodFilter = '0';
    var bankAccountFilter = '';
    var creditCardFilter = '';

    var columnsTable = [];
    columnsTable.push({"title": ""})
    columIdTitle = 0;
    columnsTable.push({"title": "Nº de factura"})
    columIdNumInvoice = 1;
    columnsTable.push({"title": "Fecha"})
    columIdFecha = 2;
    columnsTable.push({"title": "NIF"})
    columIdNif = 3;
    columnsTable.push({"title": "Expedidor"}) // 4
    columIdExpedidor = 4;

    columIdBaseImp = []
    columnsTableBaseImp = '';
    $.each(ivasReceived, function(index, value){
        columnsTable.push({"title": "Base Imp. <br>" + value + ' %'})
        columIdBaseImp.push(columIdExpedidor + 1 + index)
    })

    columnsTable.push({"title": "Retención"})
    columIdRetencion = 5 + ivasReceived.length;
    columnsTable.push({"title": "Suplido"})
    columIdSuplido = 5 + ivasReceived.length + 1;
    columnsTable.push({"title": "Total"})
    columIdTotal = 5 + ivasReceived.length + 2;
    columnsTable.push({"title": "Pagado"})
    columIdPagado = 5 + ivasReceived.length + 3;
    columnsTable.push({"title": getIvaLabel() + " 1"})
    columIdIva1 = 5 + ivasReceived.length + 4;
    columnsTable.push({"title": getIvaLabel() + " 2"})
    columIdIva2 = 5 + ivasReceived.length + 5;
    columnsTable.push({"title": getIvaLabel() + " 3"})
    columIdIva3 = 5 + ivasReceived.length + 6;
    columnsTable.push({"title": "Pagada"})
    columIdPagada = 5 + ivasReceived.length + 7;
    columnsTable.push({"title": "Forma de pago"})
    columIdFormaPago = 5 + ivasReceived.length + 8;
    columnsTable.push({"title": "Doc. Adjunto"})
    columIdDocAdjunto = 5 + ivasReceived.length + 9;
    columnsTable.push({"title": "PDF"})
    columIdPDF = 5 + ivasReceived.length + 10;
    columnsTable.push({"title": "Editar"})
    columIdEditar = 5 + ivasReceived.length + 11;
    columnsTable.push({"title": "Eliminar"})
    columIdEliminar = 5 + ivasReceived.length + 12;
    columnsTable.push({"title": "Pagar"})
    columIdPagar = 5 + ivasReceived.length + 13;
    columnsTable.push({"title": "Pagos"})
    columIdPagos = 5 + ivasReceived.length + 14;

    columsIvaSelectedExport = [1,2,3,4, columIdRetencion, columIdSuplido, columIdTotal, columIdPagada, columIdFormaPago]
   
    // FACTURAS RECIBIDAS - LISTADO
    table = $('#datatable').DataTable({
        "ajax": uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter + "&paymentMethodFilter=" + paymentMethodFilter + "&bankAccountFilter=" + bankAccountFilter+ "&creditCardFilter=" + creditCardFilter,
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
        "scrollY":  '645px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": columnsTable,        
        "columnDefs": [{
            "className" : "id",
            "targets" : [columIdTitle, columIdPagado, columIdIva1, columIdIva2, columIdIva3],
            "searchable" : false,
            "visible" : false
        },
        {
            "className": "centered editClick",
            "targets": [columIdNumInvoice,columIdNif,columIdExpedidor,columIdFormaPago]
        },
        {
            "targets": columIdBaseImp,
            "className": "centered editClick",
            "visible" : false,
            "render" : function(data){
                if(data != null){
                    return toFormatNumber(parseFloat(data).toFixed(2)) + " €";
                } else{
                    return "-"
                } 
            }
        },
        {
            "targets": [columIdSuplido,columIdTotal],
            "className": "centered editClick",
            "render" : function(data){
                if(data != null){
                    return toFormatNumber(parseFloat(data).toFixed(2)) + " €";
                } else{
                    return "-"
                } 
            }
        },
        {
            "targets": [columIdRetencion],
            "className": "centered editClick",
            "render" : function(data){
                if(data != null){
                    return data + " %";
                }else{
                    return "-"
                }
            }
        },
        {
            "className": "centered date editClick",
            "targets": [columIdFecha],
            "render" : function(data, type){
                if(data != null){
                    if(type === 'display' || type === 'filter'){
                        return moment(data, 'X').format('DD/MM/YYYY')
                    }
                    return data
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": columIdPagada,
            "render" : function(data, type, row){             
                if (data != null){
                    pagos_actuales = parseFloat(data)
                }else{
                    pagos_actuales = null;
                }                        
          
                if(pagos_actuales == null || pagos_actuales == 0 || pagos_actuales == "0"){
                    return "<strong>NO</strong>";
                }else if (pagos_actuales >= parseFloat(row[columIdTotal])){    
                    return "<strong>SI</strong>";                    
                }else{                        
                    return "<strong>Pago Parcial</strong>";                        
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": columIdDocAdjunto,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){ 
                if(row[columIdDocAdjunto] == null || row[columIdDocAdjunto] == ''){
                    return '-';
                }else{
                    return "<ul class='actions-menu'><li><a class='btn-docAdj' title='Descargar Documento adjunto'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": columIdPDF,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent" : "<ul class='actions-menu'><li><a class='btn-pdf' title='Descargar PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": columIdEditar,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent" : "<ul class='actions-menu'><li><a class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": columIdEliminar,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent" : "<ul class='actions-menu'><li><a class='btn-delete'  title='Eliminar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered",
            "targets": columIdPagar,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){
                if (row[columIdPagada] != null){
                    pagos_actuales = parseFloat(row[columIdPagada])
                }else{
                    pagos_actuales = null;
                }
                                        
                if(pagos_actuales == null){
                    return "<ul class='actions-menu'><li><a class='btn-pay' title='Pagar'><i class='fa fa-credit-card-alt' aria-hidden='true'></i></a></li></ul>";                    
                }else if (pagos_actuales >= parseFloat(row[columIdTotal])){                    
                    return "<ul class='actions-menu'><li><a class='c-grey'><i class='fa fa-credit-card-alt' aria-hidden='true'></i></a></li></ul>";                   
                }else{                        
                    return "<ul class='actions-menu'><li><a class='btn-pay' title='Pagar'><i class='fa fa-credit-card-alt' aria-hidden='true'></i></a></li></ul>";                        
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": columIdPagos,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){
                return "<ul class='actions-menu'><li><a class='btn-payments'  title='Listado de pagos'><i class='fa fa-list-ul' aria-hidden='true'></i></a></li></ul>";
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [],
                    search: 'applied',
                    order: 'applied'
                },
                
                filename: 'facturas recibidas',
                title: 'facturas recibidas',
                text: 'Excel <i class="fa fa-file-excel-o"></i>',
                className: 'c-lile export-button',
                action: function (e, dt, button, config) {
                    config.exportOptions.columns = columsIvaSelectedExport; 
                    $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                }
            },
            {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'A4',
                exportOptions: {
                    columns: [],
                    search: 'applied',
                    order: 'applied'
                },
                filename: 'facturas recibidas',
                title: 'facturas recibidas',
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
                                text: 'Listado de facturas recibidas',
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
                action: function (e, dt, button, config) {
                    // aquí decides qué columnas exportar
                    config.exportOptions.columns = columsIvaSelectedExport; 
                    // ejecutar la acción original
                    $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
                },
                text: 'PDF <i class="fa fa-file-pdf-o"></i>',
                className: 'c-lile export-button'
            }
        ],
        "order": [[0, 'desc']]
    })

    getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);

    // Carga las cuentas bancarias
    $('#bankAccountFilter').select2({
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
    $('#creditCardFilter').select2({
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

    // FACTURAS RECIBIDAS - BÚSQUEDA
    $('#input-search').on('keyup', function(){
        table.search(this.value).draw()
    })

    $('#year').change(function(){
        pdfType = "date";
        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());

        if(month == 0){
            from = parseInt(new Date(year+"-01-01 00:00:00").getTime()) / 1000;
            to = parseInt(new Date(year+"-12-31 23:59:59").getTime()) / 1000;
        }else{
            if(month < 10){
                month = "0" + month;
            }
            var day = moment("01/" + month + "/" + year, "DD/MM/YYYY").endOf('month').format('DD');
            from = parseInt(new Date(year + "-" + month + "-01 00:00:00").getTime()) / 1000;
            to = parseInt(new Date(year + "-" + month + "-" + day + " 23:59:59").getTime()) / 1000;
            type = $("#type").val();
        }
        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter + "&paymentMethodFilter=" + paymentMethodFilter + "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
        $('#trimester').val(0);

        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#month').change(function(){
        if($('#month').val() != 0){
            pdfType = "date";
            //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
            var year = parseInt($('#year').val());
            var month = parseInt($('#month').val());
            if(month < 10){
                month = "0" + month;
            }
            from = parseInt(moment('01/' + month + '/' + year, 'DD/MM/YYYY').format('X'))
            var lastDay = parseInt(moment(month + '/' + year, 'MM/YYYY').clone().endOf('month').format('DD'))
            to = moment(lastDay + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X')
            type = $("#type").val();
            status = $('#status').val()
            supplier = $('#suppliers').val()

            table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter + "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();

            $('#trimester').val(0);

            // Get table totals
            getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
        }else{
            if($('#trimester').val() == 0){
                from = parseInt(new Date($('#year').val()+"-01-01 00:00:00").getTime()) / 1000;
                to = parseInt(new Date($('#year').val()+"-12-31 23:59:59").getTime()) / 1000;
                type = $("#type").val();
                status = $('#status').val()
                supplier = $('#suppliers').val()

                table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
            
                // Get table totals
                getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
            }else{
                $('#trimester').change()
            }
        }
    })

    $('#trimester').change(function(){
        pdfType = "trimester";
        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        switch ($('#trimester').val()) {
            case '1':
                from = parseInt(new Date($('#year').val()+"-01-01 00:00:00").getTime()) / 1000;
                to = parseInt(new Date($('#year').val()+"-03-31 23:59:59").getTime()) / 1000;
            break;
            case '2':
                from = parseInt(new Date($('#year').val()+"-04-01 00:00:00").getTime()) / 1000;
                to = parseInt(new Date($('#year').val()+"-06-30 23:59:59").getTime()) / 1000;
            break;
            case '3':
                from = parseInt(new Date($('#year').val()+"-07-01 00:00:00").getTime()) / 1000;
                to = parseInt(new Date($('#year').val()+"-09-30 23:59:59").getTime()) / 1000;
            break;
            case '4':
                from = parseInt(new Date($('#year').val()+"-10-01 00:00:00").getTime()) / 1000;
                to = parseInt(new Date($('#year').val()+"-12-31 23:59:59").getTime()) / 1000;
            break;
            default:
                var month = $('#month').val();
                if(month < 10){
                    month = "0" + month;
                }
                if($('#month').val() == 0){
                    from = moment('01/01/' + $('#year').val() + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X')
                    to = moment('31/12/' + $('#year').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X')
                }else{
                    //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                    from = moment('01/' + month + '/' + $('#year').val() + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                    var dayAux = parseInt(moment(month + '/' + year, 'MM/YYYY').clone().endOf('month').format('DD'));
                    to = moment(dayAux + '/' + month + '/' + $('#year').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                }
                type = $("#type").val();
                status = $('#status').val();
                supplier = $('#suppliers').val();
            break;
        }

        $('#month').val(0);

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to + "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter + "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
   
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#type').change(function(){
        type = $("#type").val();

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter + "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    });

    $('#status').change(function(){
        status = $('#status').val()

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter + "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    })

    $('#suppliers').change(function(){
        supplier = $('#suppliers').val()

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#costCenterFilter').change(function(){
        costCenterFilter = $("#costCenterFilter").val();

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#cashOutFilter').change(function(){
        if($('#cashOutFilter').val() == '1'){
            $('#expenseTypeFilterSection').removeClass('hide');
        }else{
            $('#expenseTypeFilterSection').addClass('hide');

            $('#expenseTypeFilter').val('0').trigger('change');
            expenseTypeFilter = '0';
        }

        cashOutFilter = $("#cashOutFilter").val();

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#expenseTypeFilter').change(function(){
        expenseTypeFilter = $("#expenseTypeFilter").val();

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#paymentMethodFilter').change(function(){
        paymentMethodFilter = $("#paymentMethodFilter").val();

        $("#bankAccountFilterSection").addClass('hide');
        $("#bankAccountFilter").val(null).trigger('change');
        $("#creditCardFilterSection").addClass('hide');
        $("#creditCardFilter").val(null).trigger('change');

        switch(paymentMethodFilter){
            case '2':
            case '3':
                $("#bankAccountFilterSection").removeClass('hide')
            break;
            case '4':
                $("#creditCardFilterSection").removeClass('hide')
            break;
        }

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#bankAccountFilter').change(function(){
        bankAccountFilter = $("#bankAccountFilter").val();

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#creditCardFilter').change(function(){
        creditCardFilter = $("#creditCardFilter").val();

        table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
    
        // Get table totals
        getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
    })

    $('#search').click(function(){
        pdfType = "search";
        var validate = 0
        if(!isDate($("#from"))){
            validate++
        }
        if(!isDate($("#to"))){
            validate++
        }
        if(validate == 0){
            var from = moment($('#from').val(), "DD/MM/YYYY").format('X');
            var to = moment($('#to').val() + ' 23:59:59', "DD/MM/YYYY HH:mm:ss").format('X');
            type = $("#type").val();
            status = $('#status').val()
            supplier = $('#suppliers').val()
            costCenterFilter = $('#costCenterFilter').val()
            cashOutFilter = $('#cashOutFilter').val()
            expenseTypeFilter = $('#expenseTypeFilter').val()
            paymentMethodFilter = $('#paymentMethodFilter').val()

            table.ajax.url(uri + "core/expenses/receivedInvoices/listDatatables.php?from=" + from + "&to=" + to+ "&type=" + type+ "&status=" + status + "&supplier=" + supplier + "&costCenterFilter=" + costCenterFilter + "&cashOutFilter=" + cashOutFilter + "&expenseTypeFilter=" + expenseTypeFilter+ "&paymentMethodFilter=" + paymentMethodFilter+ "&bankAccountFilter=" + bankAccountFilter + "&creditCardFilter=" + creditCardFilter).load();
        
            // Get table totals
            getTotals(from, to, type, supplier, costCenterFilter, cashOutFilter, expenseTypeFilter, paymentMethodFilter, bankAccountFilter, creditCardFilter);
        }
    });

    if(invoiceNumberParam != null){
        $('#input-search').val(invoiceNumberParam)
        table.search(invoiceNumberParam).draw()
        
        setTimeout(() => {
            $("#search").click();
        }, 150);
    }

    // FACTURAS RECIBIDAS - NUEVA
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

    $('#formNewReceivedInvoice #costCenter').change(function(){
        
        if($('#formNewReceivedInvoice #costCenter').val() == '23'){
            $('#formNewReceivedInvoice #costOtherDiv').removeClass('hide')
        }else{
            $('#formNewReceivedInvoice #costOtherDiv').addClass('hide')
        }
    })

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

    // Carga los proveedores
    $('#formNewReceivedInvoice #supplier').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        dropdownParent: $('#modal-new-received-invoice'),
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
    $('#formNewReceivedInvoiceDelivery #bankAccount').select2({
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

    // Carga las tarjetas de crédito
    $('#formNewReceivedInvoiceDelivery #creditCard').select2({
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
            case '2':
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
            break;
        }
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
        $("#modal-new-supplier-invoices #validateCIF").prop('checked', true);
    });

    $('#formNewReceivedInvoice #fileAttachDocMultiple').change(function(){
        var total = $('#formNewReceivedInvoice #fileAttachDocMultiple')[0].files.length;
        var cont = $('#formNewReceivedInvoice #fileAttachDocMultiple')[0].files.length;
        $.each($('#formNewReceivedInvoice #fileAttachDocMultiple')[0].files, function(index, elem){
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
                    $('#modal-new-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se permite subir un fichero vacío.</div>');
                }else{
                    tempAttachments.push(elem);
                }
            }
        })
        if(total == 0){
            $('#modal-new-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún documento pdf.</div>');
        }else{
            if(total > cont){
                $('#modal-new-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos de los documentos pdf que has seleccionado no se han añadido porque ya los habías seleccionado antes.</div>');
            }
        }

        drawAttachments('modal-new-received-invoice');
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
        if(isEmpty($('#formNewReceivedInvoice #taxBase0'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #feeHoldIva0'))){
            validate++;
        }
        if(isEmpty($('#formNewReceivedInvoice #total'))){
            validate++;
        }
        switch($('#formNewReceivedInvoice #paymentMethod').val()){
            case '2':
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
            if($('#formNewReceivedInvoice #expenseType').val() == '1'){
                var expenseFixed = $('#formNewReceivedInvoice #expenseFixed').val()
                var expenseVariable = ''
            }else if($('#formNewReceivedInvoice #expenseType').val() == '2'){
                var expenseFixed = ''
                var expenseVariable = $('#formNewReceivedInvoice #expenseVariable').val()
            }else{
                var expenseFixed = ''
                var expenseVariable = ''
            }

            // Get ivas
            var listIvas = [];
            $.each($('#formNewReceivedInvoice .iva-breakdown-item'), function(index, value){
                var itemSelected = $(this).attr('item');
                
                var taxBaseSelected = parseFloat($('#formNewReceivedInvoice #taxBase' + itemSelected).val())
                var feeHoldIvaSelected = parseFloat($('#formNewReceivedInvoice #feeHoldIva' + itemSelected).val())
               
                var indexAux = listIvas.findIndex(p => p.type_iva == feeHoldIvaSelected);
                if(indexAux === -1){
                    listIvas.push(
                        {
                            'type_iva': feeHoldIvaSelected,
                            'base': taxBaseSelected,
                            'iva': (parseFloat(taxBaseSelected) * parseFloat(feeHoldIvaSelected) / 100)
                        }
                    )
                }else{
                    listIvas[indexAux]['base'] += parseFloat(taxBaseSelected);
                    listIvas[indexAux]['iva'] += (parseFloat(taxBaseSelected) * parseFloat(feeHoldIvaSelected) / 100);
                }
            })

            var costCenter = $('#formNewReceivedInvoice #costCenter').val()
            var otherCostcenter = $('#formNewReceivedInvoice #otherCostcenter').val()
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
            var withholding = $('#formNewReceivedInvoice #withholding').val()
            var supplied = $('#formNewReceivedInvoice #supplied').val()
            var total = $('#formNewReceivedInvoice #total').val()
            var paymentMethod = $('#formNewReceivedInvoice #paymentMethod').val()
            var expenseType = $('#formNewReceivedInvoice #expenseType').val()
            var cashOut = $('#formNewReceivedInvoice #cashOut').val()
            var concept = $('#formNewReceivedInvoice #concept').val()
            var comments = $('#formNewReceivedInvoice #comments').val()
            var regularity = $('#formNewReceivedInvoice #regularity').val()
            var invoiceNumber = $('#formNewReceivedInvoice #invoiceNumber').val()
            var isTicket = $('#formNewReceivedInvoice #isTicket').prop('checked') == true ? '1' : '0'

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
                    paymentDueDate: paymentDueDate,
                    paymentDueDate2: paymentDueDate2,
                    paymentDueDate3: paymentDueDate3,
                    paymentDate: paymentDate,
                    shipper: shipper,
                    nif: nif,
                    listIvas: listIvas,
                    withholding: withholding,
                    supplied: supplied,
                    total: total,
                    paymentMethod: paymentMethod,
                    expenseType: expenseType,
                    cashOut: cashOut,
                    concept: concept,
                    comments: comments,
                    regularity: regularity,
                    invoiceNumber: invoiceNumber,
                    otherCostcenter : otherCostcenter,
                    isTicket : isTicket
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    var continueFlag = false;
                    switch(data){
                        case 'invoice_number':
                            $('#modal-new-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una factura de este proveedor con este número de factura.</div>');
                            break;
                        case false:
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        break;
                        default:
                            continueFlag = true
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creada con éxito.</div>')
                            table.ajax.reload();
                        break;
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    if(!continueFlag){
                        return false
                    }

                    $('#modal-new-received-invoice').modal('hide')
                   
                    $('#formNewReceivedInvoice #withholding').val(0);
                    $('#formNewReceivedInvoice #supplied').val(0);
                    $('#formNewReceivedInvoice #total').val(0);
                    $('#formNewReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'));
                    $('#formNewReceivedInvoice textarea').val('');
                    $("#formNewReceivedInvoice #bankAccount").val('').trigger('change');
                    $("#formNewReceivedInvoice #creditCard").val('').trigger('change');
                    $("#formNewReceivedInvoice #supplier").val('').trigger('change');
                    $("#formNewReceivedInvoice #cashOut").val(0).trigger('change');
                    $("#formNewReceivedInvoice #costCenter").val(0).trigger('change');
                    $("#formNewReceivedInvoice #otherCostcenter").val('');
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
                            dataFile.append('invoice', $.parseJSON(data));
                            $.ajax({
                                url: uri + "core/expenses/receivedInvoices/fileUpload.php",
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

                    $('#formNewReceivedInvoice #fileAttachDocMultiple').val(null);
                    $('#formNewReceivedInvoice #fileAttachDocMultipleSection').empty();
                    tempAttachments = new Array;

                    $('#formNewReceivedInvoice input').val('');
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
            $('#modal-new-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-received-invoice #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-new-received-invoice').on('show.bs.modal', function (e){
        $('#formNewReceivedInvoice #fileAttachDocMultiple').val(null);
        $('#formNewReceivedInvoice #fileAttachDocMultipleSection').empty();
        tempAttachments = new Array;
    })

    $('#modal-new-received-invoice').on('hidden.bs.modal', function (e) {
        $('#formNewReceivedInvoice input').val('');

        $('#formNewReceivedInvoice #taxBase0').val(0);
        $('#formNewReceivedInvoice #feeHoldIva0').val('0.00');
        $('#formNewReceivedInvoice #totalIva0').text('0.00 €')
        $('#formNewReceivedInvoice #withholding').val(0);
        $('#formNewReceivedInvoice #supplied').val(0);

        $.each($('#modal-new-received-invoice #createIvasBreakdown .iva-breakdown-item'), function(index, value){
            if(index > 0){
                var itemSelected = $(this).attr('item');
                deleteIvaBreakdown('#modal-new-received-invoice', '#createIvasBreakdown', itemSelected)
            }
        })
        itemsIvasBreakdown = 1;

        $('#formNewReceivedInvoice #total').val(0);
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
        $('#modal-new-received-invoice #warning-message').html('')
        $('#formNewReceivedInvoice #paymentMethod').val(1).trigger('change')

        tempAttachments = new Array;
    })

    $('#modal-new-received-invoice #close').click(function(){
        $('#formNewReceivedInvoice input').val('');

        $('#formNewReceivedInvoice #taxBase0').val(0);
        $('#formNewReceivedInvoice #feeHoldIva0').val('0.00');
        $('#formNewReceivedInvoice #totalIva0').text('0.00 €')
        $('#formNewReceivedInvoice #withholding').val(0);
        $('#formNewReceivedInvoice #supplied').val(0);

        $.each($('#modal-new-received-invoice #createIvasBreakdown .iva-breakdown-item'), function(index, value){
            if(index > 0){
                var itemSelected = $(this).attr('item');
                deleteIvaBreakdown('#modal-new-received-invoice', '#createIvasBreakdown', itemSelected)
            }
        })
        itemsIvasBreakdown = 1;

        $('#formNewReceivedInvoice #total').val(0);
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
        $('#modal-new-received-invoice #warning-message').html('')
        $('#formNewReceivedInvoice #paymentMethod').val(1).trigger('change')
    })

    // FACTURAS RECIBIDAS - DESCARGAR PDF
    table.on('click', 'tbody .btn-pdf', function(){
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'facturaRecibida', text: text, service: rowClick[0], data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'facturaRecibida', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/facturaRecibida.pdf', '_blank')
                    }
                });
            }
        });
    });

    // FACTURAS RECIBIDAS - DESCARGAR ADJUNTO
    table.on('click', 'tbody .btn-docAdj', function(){
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        downloadAttachments(rowClick[0]);
    });

    // FACTURAS RECIBIDAS - EDITAR
    table.on('click', 'tbody .editClick', function(){
        
        $('.numberExpedient').tooltip('hide')
		
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var invoice = null
 
        $.ajax({
            url: uri + 'core/expenses/receivedInvoices/read.php',
            method: 'POST',
            data: {
                ID: rowClick[0]
            },
            async: false,
            success: function(data){
                invoice = $.parseJSON(data)
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        if(invoice == null){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
        }else{

            // Carga los centros de coste
            $('#formEditReceivedInvoice #costCenter').select2({
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

            $('#formEditReceivedInvoice #costCenter').change(function(){
        
                if($('#formEditReceivedInvoice #costCenter').val() == '23'){
                    $('#formEditReceivedInvoice #costOtherDiv').removeClass('hide')
                }else{
                    $('#formEditReceivedInvoice #costOtherDiv').addClass('hide')
                }
            })

            // Carga los proveedores
            $('#formEditReceivedInvoice #supplier').select2({
                containerCssClass: 'select2-supplier',
                language: langSelect2,
                placeholder: '--',
                allowClear: true,
                dropdownParent: $('#modal-edit-received-invoice'),
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
            $('#formEditReceivedInvoice #bankAccount').select2({
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
            $('#formEditReceivedInvoice #creditCard').select2({
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
            $('#formEditReceivedInvoice #expenseFixed').select2({
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

            $('#formReceivedInvoiceDelivery #bankAccount').empty();
            $('#formReceivedInvoiceDelivery #creditCard').empty();
            
            if (invoice.items !== undefined && invoice.items !== null){

                // Carga los centros de coste
                $('#formReceivedInvoiceDelivery #costCenter').select2({
                    containerCssClass: 'select2-costCenter',
                    language: langSelect2,
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

                // Carga las cuentas bancarias (Modal de factura de un albarán)
                $('#formReceivedInvoiceDelivery #bankAccount').select2({
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

                // Carga las tarjetas de crédito (Modal de factura de un albarán)
                $('#formReceivedInvoiceDelivery #creditCard').select2({
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

                $('#formReceivedInvoiceDelivery #paymentMethod').change(function(){
                    var paymentMethod = $(this).val()

                    switch(paymentMethod){
                        case '2':
                        case '3':
                            $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
                            $('#formReceivedInvoiceDelivery #creditCard').val('').trigger('change')
                            $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccounts').addClass('show');
                        break
                        case '4':
                            $('#formReceivedInvoiceDelivery #creditCards').removeClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccount').val('').trigger('change')

                        break
                        default:
                            $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccount').val('').trigger('change')
                            $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
                            $('#formReceivedInvoiceDelivery #creditCard').val('').trigger('change')

                            break
                    }
                })

                $('#formReceivedInvoiceDelivery #id').val(invoice.data.ID)
                $('#formReceivedInvoiceDelivery #invoiceNumber').val(invoice.data.invoiceNumber)
                $('#formReceivedInvoiceDelivery #date').val(moment(invoice.data.date, 'X').format('DD/MM/YYYY'))
                if(invoice.data.paymentDate != null){
                    $('#formReceivedInvoiceDelivery #paymentDate').val(moment(invoice.data.paymentDate, 'X').format('DD/MM/YYYY'))
                }
                if(invoice.data.dueDate != null){
                    $('#modal-new-received-invoice-delivery #dueDate').val(moment(invoice.data.dueDate, 'X').format('DD/MM/YYYY'))
                }

                if(invoice.data.dueDate2 != null){
                    $('#modal-new-received-invoice-delivery #dueDate2').val(moment(invoice.data.dueDate2, 'X').format('DD/MM/YYYY'))
                }
                if(invoice.data.dueDate3 != null){
                    $('#modal-new-received-invoice-delivery #dueDate3').val(moment(invoice.data.dueDate3, 'X').format('DD/MM/YYYY'))
                }

                if(invoice.data.paymentDueDate != null){
                    $('#modal-new-received-invoice-delivery #paymentDueDate').val(invoice.data.paymentDueDate)
                }else{
                    $('#modal-new-received-invoice-delivery #paymentDueDate').val('-')
                }

                if(invoice.data.paymentDueDate2 != null){
                    $('#modal-new-received-invoice-delivery #paymentDueDate2').val(invoice.data.paymentDueDate2)
                }else{
                    $('#modal-new-received-invoice-delivery #paymentDueDate2').val('-')
                }

                if(invoice.data.paymentDueDate3 != null){
                    $('#modal-new-received-invoice-delivery #paymentDueDate3').val(invoice.data.paymentDueDate3)
                }else{
                    $('#modal-new-received-invoice-delivery #paymentDueDate3').val('-')
                }

                if(invoice.data.supplierName != null){
                    $('#formReceivedInvoiceDelivery #supplier').val(invoice.data.supplierName)
                    $('#formReceivedInvoiceDelivery #nif').val(invoice.data.supplierNif)
   
                }
                $('#formReceivedInvoiceDelivery #paymentMethod').val(invoice.data.paymentMethod)

                if(invoice.data.bankAccount != null){
                    $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('hide')
                    if($('#formReceivedInvoiceDelivery #bankAccount').find("option[value='" + invoice.data.bankAccount + "']").length){
                        $('#formReceivedInvoiceDeliverye #bankAccount').val(invoice.data.bankAccount).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.bankAccountOwner, invoice.data.bankAccount, true, true)
                        $('#formReceivedInvoiceDelivery #bankAccount').append(newOption).trigger('change')
                    }
                }
                if(invoice.data.creditCard != null){
                    $('#formReceivedInvoiceDelivery #creditCards').removeClass('hide')
                    if($('#formReceivedInvoiceDelivery #creditCard').find("option[value='" + invoice.data.creditCard + "']").length){
                        $('#formReceivedInvoiceDelivery #creditCard').val(invoice.data.creditCard).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.creditCardOwner, invoice.data.creditCard, true, true)
                        $('#formReceivedInvoiceDelivery #creditCard').append(newOption).trigger('change')
                    }
                }

                if(invoice.data.costCenter != null){
                    if($('#formReceivedInvoiceDelivery #costCenter').find("option[value='" + invoice.data.costCenter + "']").length){
                        $('#formReceivedInvoiceDelivery #costCenter').val(invoice.data.costCenter).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.costCenterName, invoice.data.costCenter, true, true)
                        $('#formReceivedInvoiceDelivery #costCenter').append(newOption).trigger('change')
                    }
                }

                $('#formReceivedInvoiceDelivery #comments').val(invoice.data.comments)


                var total = 0, amount = 0, IVA = 0, baseImponible = 0;
                var amount = 0
                var baseImponible = 0;
                var iva = 0;
                $.each(invoice.items, function(index, elem){
                    amount = amount + parseInt(elem.amount)
                            
                    if(parseFloat(elem.iva) > iva){
                        iva = parseFloat(elem.iva);
                    }
                    
                    baseImponibleProduct = ((parseFloat(elem.price) - (parseFloat(elem.price) * parseFloat(elem.discount)/100)) * parseInt(elem.amount))
                    baseImponible = baseImponible + baseImponibleProduct;
                    total += parseFloat(baseImponibleProduct + ( baseImponibleProduct  * parseFloat(elem.iva)/100)) 

                    if(elem.discount == '0.000'){
                        elem.discount = '-'
                    }else{
                        elem.discount = parseFloat(elem.discount).toFixed(2) + ' %'
                    }

                    $("#deliveryLines").append('<tr>' +
                                            '<td class="text-center">' + (index + 1) + '</td>' + 
                                            '<td class="text-center">' + elem.productName + '</td>' + 
                                            '<td class="text-center">' + elem.modelName + '</td>' +
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
                        
                $('#modal-new-received-invoice-delivery #total').val(total.toFixed(2) + " €")

                $("#modal-new-received-invoice-delivery").modal("show");

   
            }else if (invoice.gasoil !== undefined && invoice.gasoil !== null){

                // Carga los centros de coste
                $('#formReceivedInvoiceDelivery #costCenter').select2({
                    containerCssClass: 'select2-costCenter',
                    language: langSelect2,
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

                // Carga las cuentas bancarias (Modal de factura de un albarán)
                $('#formReceivedInvoiceDelivery #bankAccount').select2({
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

                // Carga las tarjetas de crédito (Modal de factura de un albarán)
                $('#formReceivedInvoiceDelivery #creditCard').select2({
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

                $('#formReceivedInvoiceDelivery #paymentMethod').change(function(){
                    var paymentMethod = $(this).val()

                    switch(paymentMethod){
                        case '2':
                        case '3':
                            $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
                            $('#formReceivedInvoiceDelivery #creditCard').val('').trigger('change')
                            $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccounts').addClass('show');
                        break
                        case '4':
                            $('#formReceivedInvoiceDelivery #creditCards').removeClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccount').val('').trigger('change')
                        break
                        default:
                            $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
                            $('#formReceivedInvoiceDelivery #bankAccount').val('').trigger('change')
                            $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
                            $('#formReceivedInvoiceDelivery #creditCard').val('').trigger('change')
                        break
                    }
                })

                $('#formReceivedInvoiceDelivery #id').val(invoice.data.ID)
                $('#formReceivedInvoiceDelivery #invoiceNumber').val(invoice.data.invoiceNumber)
                $('#formReceivedInvoiceDelivery #date').val(moment(invoice.data.date, 'X').format('DD/MM/YYYY'))
                if(invoice.data.paymentDate != null){
                    $('#formReceivedInvoiceDelivery #paymentDate').val(moment(invoice.data.paymentDate, 'X').format('DD/MM/YYYY'))
                }
                if(invoice.data.dueDate != null){
                    $('#formReceivedInvoiceDelivery #dueDate').val(moment(invoice.data.dueDate, 'X').format('DD/MM/YYYY'))
                }
                if(invoice.data.supplierName != null){
                    $('#formReceivedInvoiceDelivery #supplier').val(invoice.data.supplierName)
                    $('#formReceivedInvoiceDelivery #nif').val(invoice.data.supplierNif)
   
                }
                $('#formReceivedInvoiceDelivery #paymentMethod').val(invoice.data.paymentMethod).trigger('change')

                if(invoice.data.bankAccount != null){
                    $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('hide')
                    if($('#formReceivedInvoiceDelivery #bankAccount').find("option[value='" + invoice.data.bankAccount + "']").length){
                        $('#formReceivedInvoiceDeliverye #bankAccount').val(invoice.data.bankAccount).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.bankAccountOwner, invoice.data.bankAccount, true, true)
                        $('#formReceivedInvoiceDelivery #bankAccount').append(newOption).trigger('change')
                    }
                }
                if(invoice.data.creditCard != null){
                    $('#formReceivedInvoiceDelivery #creditCards').removeClass('hide')
                    if($('#formReceivedInvoiceDelivery #creditCard').find("option[value='" + invoice.data.creditCard + "']").length){
                        $('#formReceivedInvoiceDelivery #creditCard').val(invoice.data.creditCard).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.creditCardOwner, invoice.data.creditCard, true, true)
                        $('#formReceivedInvoiceDelivery #creditCard').append(newOption).trigger('change')
                    }
                }

                if(invoice.data.costCenter != null){
                    if($('#formReceivedInvoiceDelivery #costCenter').find("option[value='" + invoice.data.costCenter + "']").length){
                        $('#formReceivedInvoiceDelivery #costCenter').val(invoice.data.costCenter).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.costCenterName, invoice.data.costCenter, true, true)
                        $('#formReceivedInvoiceDelivery #costCenter').append(newOption).trigger('change')
                    }
                }

                $('#formReceivedInvoiceDelivery #comments').val(invoice.data.comments)


                $("#linesTable").empty();
                $("#linesTable").append(' <tr>' +
                                            '<th class="text-center">Litros Pedidos</th>' +
                                            '<th class="text-center">Litros Recibidos</th>' +
                                            '<th class="text-center">Precio/Litro</th>' +
                                            '<th class="text-center">Base Imponible</th>' +
                                            '<th class="text-center">Cuota ' + getIvaLabel() + '</th>' +
                                            '<th class="text-center">Total</th>' +
                                        '</tr>');

                
                $.each(invoice.gasoil, function(index, elem){

                    $("#deliveryLines").append('<tr>' +  
                                                    '<td class="text-center">' + elem.litresRequest + ' l</td>' + 
                                                    '<td class="text-center">' + elem.litresReceived + ' l</td>' +
                                                    '<td class="text-center">' + elem.priceLiter + ' €</td>' +
                                                    '<td id="deliveryNet" class="text-center">' + elem.net + ' €</td>' +
                                                    '<td id="deliveryIVA" class="text-center">' + elem.ivaName + '</td>' +
                                                    '<td class="text-center">' + elem.total + ' €</td>' +
                                                '</tr>');
                    $('#modal-new-received-invoice-delivery #total').val(elem.total + " €")
                })

                $("#modal-new-received-invoice-delivery").modal("show");
            }else{

                // Carga los tipos de gastos fijos
                $('#formEditReceivedInvoice #expenseFixed').select2({
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
                $('#formEditReceivedInvoice #expenseVariable').select2({
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

                $('#formEditReceivedInvoice #paymentMethod').change(function(){
                    var paymentMethod = $(this).val()

                    switch(paymentMethod){
                        case '2':
                        case '3':
                            $('#formEditReceivedInvoice #creditCards').addClass('hide');
                            $('#formEditReceivedInvoice #creditCard').val('').trigger('change')
                            $('#formEditReceivedInvoice #bankAccounts').removeClass('hide');
                            $('#formEditReceivedInvoice #bankAccounts').addClass('show');
                        break
                        case '4':
                            $('#formEditReceivedInvoice #creditCards').removeClass('hide');
                            $('#formEditReceivedInvoice #bankAccounts').addClass('hide');
                            $('#formEditReceivedInvoice #bankAccount').val('').trigger('change')
                        break
                        default:
                            $('#formEditReceivedInvoice #bankAccounts').addClass('hide');
                            $('#formEditReceivedInvoice #bankAccount').val('').trigger('change')
                            $('#formEditReceivedInvoice #creditCards').addClass('hide');
                            $('#formEditReceivedInvoice #creditCard').val('').trigger('change')
                        break
                    }
                })

                $('#formEditReceivedInvoice #cashOut').change(function(){
                    var expense = $(this).val()

                    switch(expense){
                        // Gasto
                        case '1':
                            $('#formEditReceivedInvoice #expenses').removeClass('hide');
                        break
                        
                        // Inversión
                        case '2':
                            $('#formEditReceivedInvoice #expenses').addClass('hide');
                            $('#formEditReceivedInvoice #expenseType').val(0)
                            $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
                            $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
                            $('#formEditReceivedInvoice #expenseFixed').val('').trigger('change')
                            $('#formEditReceivedInvoice #expenseVariable').val('').trigger('change')
                        break
                        default:
                            $('#formEditReceivedInvoice #expenses').addClass('hide');
                            $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
                            $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
                        break
                    }
                })

                $('#formEditReceivedInvoice #expenseType').change(function(){
                    var expenseType = $(this).val()

                    switch(expenseType){
                        case '1':
                            $('#formEditReceivedInvoice #expensesFixed').removeClass('hide');
                            $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
                        break
                        case '2':
                            $('#formEditReceivedInvoice #expensesVariable').removeClass('hide');
                            $('#formEditReceivedInvoice #expensesVariable').addClass('show');
                            $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
                            $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
                        break
                        case '3':
                            $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
                            $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
                            $('#formEditReceivedInvoice #expensesVariable').removeClass('show');
                            $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
                        break
                        default:
                            $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
                            $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
                            $('#formEditReceivedInvoice #expensesVariable').removeClass('show');
                            $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
                        break
                    }
                })

                $('#formEditReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'))

                $('#formEditReceivedInvoice #supplier').change(function(){
                    var supplierID = $(this).val()

                    switch(supplierID){
                        case null:
                            $('#formEditReceivedInvoice #shipperSection').addClass('hide')
                            $('#formEditReceivedInvoice #nif').val('').attr('disabled', true)
                        break
                        case '0':
                            $('#formEditReceivedInvoice #shipperSection').removeClass('hide')
                            $('#formEditReceivedInvoice #nif').val('').attr('disabled', false)
                        break
                        default:
                            $('#formEditReceivedInvoice #shipperSection').addClass('hide')

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

                                    $('#formEditReceivedInvoice #nif').val(data).attr('disabled', true)
                                }
                            })
                        break
                    }
                })

                $('#modal-edit-received-invoice #ID').val(invoice.data.ID)
                $('#modal-edit-received-invoice #date').val(moment(invoice.data.date, 'X').format('DD/MM/YYYY'))

                if(invoice.data.paymentDate != null){
                    $('#modal-edit-received-invoice #paymentDate').val(moment(invoice.data.paymentDate, 'X').format('DD/MM/YYYY'))
                }

                if(invoice.data.dueDate != null){
                    $('#modal-edit-received-invoice #dueDate').val(moment(invoice.data.dueDate, 'X').format('DD/MM/YYYY'))
                }
                if(invoice.data.dueDate2 != null){
                    $('#modal-edit-received-invoice #dueDate2').val(moment(invoice.data.dueDate2, 'X').format('DD/MM/YYYY'))
                }
                if(invoice.data.dueDate3 != null){
                    $('#modal-edit-received-invoice #dueDate3').val(moment(invoice.data.dueDate3, 'X').format('DD/MM/YYYY'))
                }

                if(invoice.data.paymentDueDate != null){
                    $('#modal-edit-received-invoice #paymentDueDate').val(invoice.data.paymentDueDate)
                }else{
                    $('#modal-edit-received-invoice #paymentDueDate').val('-')
                }

                if(invoice.data.paymentDueDate2 != null){
                    $('#modal-edit-received-invoice #paymentDueDate2').val(invoice.data.paymentDueDate2)
                }else{
                    $('#modal-edit-received-invoice #paymentDueDate2').val('-')
                }

                if(invoice.data.paymentDueDate3 != null){
                    $('#modal-edit-received-invoice #paymentDueDate3').val(invoice.data.paymentDueDate3)
                }else{
                    $('#modal-edit-received-invoice #paymentDueDate3').val('-')
                }

                if(invoice.data.supplier == null){
                    $('#formEditReceivedInvoice #shipperSection').removeClass('hide')
                    if($('#modal-edit-received-invoice #supplier').find("option[value='0']").length){
                        $('#modal-edit-received-invoice #supplier').val('0').trigger('change')
                    }else{ 
                        var newOption = new Option('Otro', '0', true, true)
                        $('#modal-edit-received-invoice #supplier').append(newOption).trigger('change')
                    }
                    $('#modal-edit-received-invoice #shipper').val(invoice.data.shipper)
                    $('#modal-edit-received-invoice #nif').val(invoice.data.nif)
                }else{
                    if($('#modal-edit-received-invoice #supplier').find("option[value='" + invoice.data.supplier + "']").length){
                        $('#modal-edit-received-invoice #supplier').val(invoice.data.supplier).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.supplierName, invoice.data.supplier, true, true)
                        $('#modal-edit-received-invoice #supplier').append(newOption).trigger('change')
                    }
                    $('#modal-edit-received-invoice #nif').val(invoice.data.supplierNif)

                    if(invoice.data.supplier == 0){
                        $('#formEditReceivedInvoice #shipperSection').removeClass('hide')
                        $('#formEditReceivedInvoice #nif').val('').attr('disabled', false)
                    }else{
                        $('#formEditReceivedInvoice #shipperSection').addClass('hide') 
                    }
                }

                if(invoice.ivas.length > 0){
                    $.each(invoice.ivas, function(index, value){
                        if(index == 0){
                            $('#modal-edit-received-invoice #receivedIvaId0').val(value.id)
                            $('#modal-edit-received-invoice #taxBase0').val(value.base)
                            $('#modal-edit-received-invoice #feeHoldIva0').val(parseFloat(value.typeIva).toFixed(2))
                            $('#modal-edit-received-invoice #totalIva0').empty().text(parseFloat(value.iva).toFixed(2) + ' €')
                        }else{
                            addIvaBreakdown('#modal-edit-received-invoice', '#editIvasBreakdown', value)
                        }
                    })
                }
                
                $('#modal-edit-received-invoice #withholding').val(invoice.data.withholding)
                $('#modal-edit-received-invoice #supplied').val(invoice.data.supplied)
                $('#modal-edit-received-invoice #total').val(invoice.data.total)
                $('#modal-edit-received-invoice #paymentMethod').val(invoice.data.paymentMethod).trigger('change')
                if(invoice.data.bankAccount != null){
                    $('#modal-edit-received-invoice #bankAccounts').removeClass('hide')
                    if($('#modal-edit-received-invoice #bankAccount').find("option[value='" + invoice.data.bankAccount + "']").length){
                        $('#modal-edit-received-invoice #bankAccount').val(invoice.data.bankAccount).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.bankAccountOwner, invoice.data.bankAccount, true, true)
                        $('#modal-edit-received-invoice #bankAccount').append(newOption).trigger('change')
                    }
                }
                if(invoice.data.creditCard != null){
                    $('#modal-edit-received-invoice #creditCards').removeClass('hide')
                    if($('#modal-edit-received-invoice #creditCard').find("option[value='" + invoice.data.creditCard + "']").length){
                        $('#modal-edit-received-invoice #creditCard').val(invoice.data.creditCard).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.creditCardOwner, invoice.data.creditCard, true, true)
                        $('#modal-edit-received-invoice #creditCard').append(newOption).trigger('change')
                    }
                }
                $('#modal-edit-received-invoice #cashOut').val(invoice.data.cashOut)
                if(invoice.data.cashOut != 0){
                    $('#modal-edit-received-invoice #expenses').removeClass('hide')
                }
                
                $('#modal-edit-received-invoice #expenseType').val(invoice.data.expenseType)
                if(invoice.data.expenseFixed != null){
                    $('#modal-edit-received-invoice #expensesFixed').removeClass('hide')
                    if($('#modal-edit-received-invoice #expenseFixed').find("option[value='" + invoice.data.expenseFixed + "']").length){
                        $('#modal-edit-received-invoice #expenseFixed').val(invoice.data.expenseFixed).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.expenseFixedName, invoice.data.expenseFixed, true, true)
                        $('#modal-edit-received-invoice #expenseFixed').append(newOption).trigger('change')
                    }
                }
                if(invoice.data.expenseVariable != null){
                    $('#modal-edit-received-invoice #expensesVariable').removeClass('hide')
                    if($('#modal-edit-received-invoice #expenseVariable').find("option[value='" + invoice.data.expenseVariable + "']").length){
                        $('#modal-edit-received-invoice #expenseVariable').val(invoice.data.expenseVariable).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.expenseVariableName, invoice.data.expenseVariable, true, true)
                        $('#modal-edit-received-invoice #expenseVariable').append(newOption).trigger('change')
                    }
                }
                if(invoice.data.costCenter != null){
                    if($('#modal-edit-received-invoice #costCenter').find("option[value='" + invoice.data.costCenter + "']").length){
                        $('#modal-edit-received-invoice #costCenter').val(invoice.data.costCenter).trigger('change')
                    }else{ 
                        var newOption = new Option(invoice.data.costCenterName, invoice.data.costCenter, true, true)
                        $('#modal-edit-received-invoice #costCenter').append(newOption).trigger('change')
                    }
                }
                if(invoice.data.otherCostcenter != null && invoice.data.otherCostcenter != 'null'){
                    $('#modal-edit-received-invoice #otherCostcenter').val(invoice.data.otherCostcenter)
                }
                $('#modal-edit-received-invoice #concept').val(invoice.data.concept)
                $('#modal-edit-received-invoice #comments').val(invoice.data.comments)
                $('#modal-edit-received-invoice #regularity').val(invoice.data.regularity)
                $('#modal-edit-received-invoice #invoiceNumber').val(invoice.data.invoiceNumber)
            
                if(invoice.data.deliveryNote != null){
                    $('#regularitySection').addClass('hide')
                }else{
                    $('#regularitySection').removeClass('hide')
                }

                $('#modal-edit-received-invoice').modal('show')
            }

            if(invoice.data.isTicket == '1'){
                $('#formEditReceivedInvoice #isTicket').prop('checked', true)
            }else{
                $('#formEditReceivedInvoice #isTicket').prop('checked', false)
            }

            // Files
            tempAttachments = new Array;
            $.each(invoice.files, function(index, elem){
                tempAttachments.push({'name': elem});
            })

            drawAttachments('modal-edit-received-invoice');
        }
    })

    $('#formEditReceivedInvoice #fileAttachDocMultiple').change(function(){
        var total = $('#formEditReceivedInvoice #fileAttachDocMultiple')[0].files.length;
        var cont = $('#formEditReceivedInvoice #fileAttachDocMultiple')[0].files.length;
        $.each($('#formEditReceivedInvoice #fileAttachDocMultiple')[0].files, function(index, elem){
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
                    $('#modal-edit-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se permite subir un fichero vacío.</div>');
                }else{
                    tempAttachments.push(elem);
                }
            }
        })
        if(total == 0){
            $('#modal-edit-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún documento pdf.</div>');
        }else{
            if(total > cont){
                $('#modal-edit-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos de los documentos pdf que has seleccionado no se han añadido porque ya los habías seleccionado antes.</div>');
            }
        }

        drawAttachments('modal-edit-received-invoice');
    })

    $('#modal-new-received-invoice-delivery').on('hidden.bs.modal', function (e) {
        $("#deliveryLines").empty();
    })

    $('#formEditReceivedInvoice #cancelRegularity').click(function(){
        $('#formEditReceivedInvoice #regularity').val(0)
    })

    // PROVEEDORES - NUEVO - EDITAR FACTURA
    $('#modal-new-supplier-edit-invoices #saveNewSupplier').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewSuppEditInvoices #name'))){
            validate++;
        }
        if(isEmpty($('#formNewSuppEditInvoices #nif'))){
            validate++;
        }

        if($('#formNewSuppEditInvoices #nif').val() != ""){  
            if($('#formNewSuppEditInvoices #validateEditCIF').prop('checked')){  
                if(!isNifCif($("#formNewSuppEditInvoices #nif"))){
                    validate++
                }
            }      
        }

        if($('#formNewSuppEditInvoices #mail').val() != ""){
            if(!isMail($('#formNewSuppEditInvoices #mail'))){
                validate++;
            }
        }
        if($('#formNewSuppEditInvoices #fax').val() != ""){
            if(!isPhone($('#formNewSuppEditInvoices #fax'))){
                validate++;
            }
        }

        if(validate == 0){
            var nif = $("#formNewSuppEditInvoices #nif").val();
            var name = $("#formNewSuppEditInvoices #name").val();
            var address = $("#formNewSuppEditInvoices #address").val();
            var mail = $("#formNewSuppEditInvoices #mail").val();
            var description = $("#formNewSuppEditInvoices #description").val();
            var location = $("#formNewSuppEditInvoices #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var phones = "";
            $('#formNewSuppEditInvoices .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#formNewSuppEditInvoices #fax").val();
            var contactPeople = "";
            $('#formNewSuppEditInvoices .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var department = $(this).find('.department').text();
                contactPeople += name+"?"+department+"-";
            });
            contactPeople=contactPeople.slice(0,-1);
            var entryDate = $("#formNewSuppEditInvoices #entryDate").val();        
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

            $('#modal-new-supplier-edit-invoices').modal('hide');        
        }else{
            $('#modal-new-supplier-edit-invoices #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-supplier-edit-invoices #warning-message').empty()
            }, 3500)
        }
    });
    
    $('#modal-new-supplier-edit-invoices').on('shown.bs.modal', function (e) {
        $('#formNewSuppEditInvoices #location').prop('disabled', true)
    })

    $('#modal-new-supplier-edit-invoices').on('hidden.bs.modal', function (e) {   
        $('#modal-edit-received-invoice').modal('show')       
        $('#formNewSuppEditInvoices input').val('');
        $('#formNewSuppEditInvoices textarea').val('');
        $('.phones').html('');
        if(!$('#formNewSuppEditInvoices .phones').hasClass('in')){
            $('#formNewSuppEditInvoices .phones').addClass('in');
        }
        $('.contactPeople').html('');
        if(!$('#formNewSuppEditInvoices .contactPeople').hasClass('in')){
            $('#formNewSuppEditInvoices .contactPeople').addClass('in');
        }
        $(".province").val('').trigger('change');
        $(".location").attr('disabled', true)
        $(".location").val('').trigger('change');
        clean("formNewSuppEditInvoices");
        $('#modal-new-supplier-edit-invoices #warning-message').empty()

        $("#modal-new-supplier-edit-invoices #validateEditCIF").prop('checked', true);
    });

    $('#modal-edit-received-invoice #newSupplierInvoice').click(function(){
        $('#modal-new-supplier-edit-invoices').modal('show')
        $('#modal-edit-received-invoice').modal('hide')
    })

    $('#saveEditReceivedInvoice').click(function(){
        var validate = 0

        if(isEmpty($('#formEditReceivedInvoice #invoiceNumber'))){
            validate++;
        }
        if(isEmpty($('#formEditReceivedInvoice #date'))){
            validate++;
        }
        if(isEmpty($('#formEditReceivedInvoice #supplier'))){
            $('.select2-' + $('#supplier').attr('id')).addClass('validateError')
            $('.select2-' + $('#supplier').attr('class')).addClass('validateError')
            
            validate++;
        }else if($('#formEditReceivedInvoice #supplier').val() == 0){
            if(isEmpty($('#formEditReceivedInvoice #shipper'))){
                validate++
            }
        }else{
            $('.select2-' + $('#supplier').attr('id')).removeClass('validateError')
            $('.select2-' + $('#supplier').attr('class')).removeClass('validateError')
        }
        if(isEmpty($('#formEditReceivedInvoice #taxBase'))){
            validate++;
        }
        if(isEmpty($('#formEditReceivedInvoice #feeHoldIva'))){
            validate++;
        }
        if(isEmpty($('#formEditReceivedInvoice #total'))){
            validate++;
        }
        switch($('#formEditReceivedInvoice #paymentMethod').val()){
            case '2':
            case '3':
                if(isEmpty($('#formEditReceivedInvoice #bankAccount'))){
                    $('.select2-' + $('#formEditReceivedInvoice #bankAccount').attr('id')).addClass('validateError')
                    $('.select2-' + $('#formEditReceivedInvoice #bankAccount').attr('class')).addClass('validateError')
                    
                    validate++;
                }else{
                    $('.select2-' + $('#formEditReceivedInvoice #bankAccount').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#formEditReceivedInvoice #bankAccount').attr('class')).removeClass('validateError')
                }
            break
            case '4':
                if(isEmpty($('#formEditReceivedInvoice #creditCard'))){
                    $('.select2-' + $('#formEditReceivedInvoice #creditCard').attr('id')).addClass('validateError')
                    $('.select2-' + $('#formEditReceivedInvoice #creditCard').attr('class')).addClass('validateError')
                    
                    validate++;
                }else{
                    $('.select2-' + $('#formEditReceivedInvoice #creditCard').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#formEditReceivedInvoice #creditCard').attr('class')).removeClass('validateError')
                }
            break
        }
        if(isEmpty($('#formEditReceivedInvoice #costCenter'))){
            $('.select2-' + $('#formEditReceivedInvoice #costCenter').attr('id')).addClass('validateError')
            $('.select2-' + $('#formEditReceivedInvoice #costCenter').attr('class')).addClass('validateError')

            validate++;
        }else{
            $('.select2-' + $('#formEditReceivedInvoice #costCenter').attr('id')).removeClass('validateError')
            $('.select2-' + $('#formEditReceivedInvoice #costCenter').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var ID = $('#formEditReceivedInvoice #ID').val()
            var bankAccount = $('#formEditReceivedInvoice #bankAccount').val()
            var creditCard = $('#formEditReceivedInvoice #creditCard').val()
            if($('#formEditReceivedInvoice #expenseType').val() == '1'){
                var expenseFixed = $('#formEditReceivedInvoice #expenseFixed').val()
                var expenseVariable = ''
            }else if($('#formEditReceivedInvoice #expenseType').val() == '2'){
                var expenseFixed = ''
                var expenseVariable = $('#formEditReceivedInvoice #expenseVariable').val()
            }else{
                var expenseFixed = ''
                var expenseVariable = ''
            }
            var costCenter = $('#formEditReceivedInvoice #costCenter').val()
            var otherCostcenter = $('#formEditReceivedInvoice #otherCostcenter').val()
            var supplier = $('#formEditReceivedInvoice #supplier').val()
            var date = moment($('#formEditReceivedInvoice #date').val(), 'DD/MM/YYYY').format('X')
            var dueDate = $('#formEditReceivedInvoice #dueDate').val() == '' ? 'null' : moment($('#formEditReceivedInvoice #dueDate').val(), 'DD/MM/YYYY').format('X')
            var dueDate2 = $('#formEditReceivedInvoice #dueDate2').val() == '' ? 'null' : moment($('#formEditReceivedInvoice #dueDate2').val(), 'DD/MM/YYYY').format('X')
            var dueDate3 = $('#formEditReceivedInvoice #dueDate3').val() == '' ? 'null' : moment($('#formEditReceivedInvoice #dueDate3').val(), 'DD/MM/YYYY').format('X')
            var paymentDueDate = $('#formEditReceivedInvoice #paymentDueDate').val()
            var paymentDueDate2 = $('#formEditReceivedInvoice #paymentDueDate2').val()
            var paymentDueDate3 = $('#formEditReceivedInvoice #paymentDueDate3').val()
            var paymentDate = $('#formEditReceivedInvoice #paymentDate').val() == '' ? null : moment($('#formEditReceivedInvoice #paymentDate').val(), 'DD/MM/YYYY').format('X')
            var shipper = $('#formEditReceivedInvoice #shipper').val()
            var nif = $('#formEditReceivedInvoice #nif').val()
           
            // Get ivas
            var listIvas = [];
            $.each($('#formEditReceivedInvoice .iva-breakdown-item'), function(index, value){
                var itemSelected = $(this).attr('item');
                
                var receivedIvoiceId = '';
                if($('#formEditReceivedInvoice #receivedIvaId' + itemSelected).length == 1 && $('#formEditReceivedInvoice #receivedIvaId' + itemSelected).val() != null){
                    receivedIvoiceId = $('#formEditReceivedInvoice #receivedIvaId' + itemSelected).val();
                }
                var taxBaseSelected = parseFloat($('#formEditReceivedInvoice #taxBase' + itemSelected).val())
                var feeHoldIvaSelected = parseFloat($('#formEditReceivedInvoice #feeHoldIva' + itemSelected).val())
               
                var indexAux = listIvas.findIndex(p => p.type_iva == feeHoldIvaSelected);
                if(indexAux === -1){
                    listIvas.push(
                        {
                            'id': receivedIvoiceId,
                            'type_iva': feeHoldIvaSelected,
                            'base': taxBaseSelected,
                            'iva': (parseFloat(taxBaseSelected) * parseFloat(feeHoldIvaSelected) / 100)
                        }
                    )
                }else{
                    listIvas[indexAux]['base'] += parseFloat(taxBaseSelected);
                    listIvas[indexAux]['iva'] += (parseFloat(taxBaseSelected) * parseFloat(feeHoldIvaSelected) / 100);
                }
            })

            var withholding = $('#formEditReceivedInvoice #withholding').val()
            var supplied = $('#formEditReceivedInvoice #supplied').val()
            var total = $('#formEditReceivedInvoice #total').val()
            var paymentMethod = $('#formEditReceivedInvoice #paymentMethod').val()
            var expenseType = $('#formEditReceivedInvoice #expenseType').val()
            var cashOut = $('#formEditReceivedInvoice #cashOut').val()
            var concept = $('#formEditReceivedInvoice #concept').val()
            var comments = $('#formEditReceivedInvoice #comments').val()
            var regularity = $('#formEditReceivedInvoice #regularity').val()
            var invoiceNumber = $('#formEditReceivedInvoice #invoiceNumber').val()
            var isTicket = $('#formEditReceivedInvoice #isTicket').prop('checked') == true ? '1' : '0'

            var newAttachments = new Array;
            $.each(tempAttachments, function(index, elem){
                if(!(elem instanceof File)){
                    newAttachments.push(elem);
                }
            })
           
            $.ajax({
                url: uri + 'core/expenses/receivedInvoices/update.php',
                method: 'POST',
                data: {
                    ID: ID,
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
                    paymentDueDate: paymentDueDate,
                    paymentDueDate2: paymentDueDate2,
                    paymentDueDate3: paymentDueDate3,
                    paymentDate: paymentDate,
                    shipper: shipper,
                    nif: nif,
                    listIvas: listIvas,
                    withholding: withholding,
                    supplied: supplied,
                    total: total,
                    paymentMethod: paymentMethod,
                    expenseType: expenseType,
                    cashOut: cashOut,
                    concept: concept,
                    comments: comments,
                    regularity: regularity,
                    invoiceNumber: invoiceNumber,
                    otherCostcenter: otherCostcenter,
                    isTicket : isTicket,
                    newAttachments: newAttachments.length == 0 ? '' : newAttachments
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    var continueFlag = false;
                    switch(data){
                        case 'invoice_number':
                            $('#modal-edit-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una factura de este proveedor con este número de factura.</div>');
                        break;
                        case false:
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        break;
                        default:
                            continueFlag = true
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido modificada con éxito.</div>')
                        break;
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    if(!continueFlag){
                        return false
                    }

                    $('#modal-edit-received-invoice').modal('hide')
                    $('#formEditReceivedInvoice #withholding').val(0);
                    $('#formEditReceivedInvoice #supplied').val(0);
                    $('#formEditReceivedInvoice #total').val(0);
                    $('#formEditReceivedInvoice textarea').val('');
                    $("#formEditReceivedInvoice #bankAccount").val('').trigger('change');
                    $("#formEditReceivedInvoice #creditCard").val('').trigger('change');
                    $("#formEditReceivedInvoice #supplier").val('').trigger('change');
                    $("#formEditReceivedInvoice #cashOut").val(0).trigger('change');
                    $("#formEditReceivedInvoice #costCenter").val(0).trigger('change');
                    $("#formEditReceivedInvoice #regularity").val(0).trigger('change');
                    $("#formEditReceivedInvoice #expenseType").val(0).trigger('change');
                    $("#formEditReceivedInvoice #expenseCostCenter").val('').trigger('change');
                    $("#formEditReceivedInvoice #otherCostcenter").val('')
                    $("#formEditReceivedInvoice #expenseFixed").val('').trigger('change');
                    $("#formEditReceivedInvoice #expenseVariable").val('').trigger('change');
                    $('#formEditReceivedInvoice #bankAccounts').removeClass('show');
                    $('#formEditReceivedInvoice #bankAccounts').addClass('hide');
                    $('#formEditReceivedInvoice #creditCards').removeClass('show');
                    $('#formEditReceivedInvoice #creditCards').addClass('hide');
                    $('#formEditReceivedInvoice #expenses').removeClass('show');
                    $('#formEditReceivedInvoice #expenses').addClass('hide');
                    $('#formEditReceivedInvoice #expensesCostCenter').removeClass('show');
                    $('#formEditReceivedInvoice #expensesCostCenter').addClass('hide');
                    $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
                    $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
                    $('#formEditReceivedInvoice #expensesVariable').removeClass('show');
                    $('#formEditReceivedInvoice #expensesVariable').addClass('hide');

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
                                dataFile.append('invoice', data);
                                $.ajax({
                                    url: uri + "core/expenses/receivedInvoices/fileUploadEdit.php",
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

                    $('#formNewReceivedInvoice #fileAttachDocMultiple').val(null);
                    $('#formNewReceivedInvoice #fileAttachDocMultipleSection').empty();
                    tempAttachments = new Array;

                    $('#formEditReceivedInvoice input').val('');
                    clean("formEditReceivedInvoice");

                    table.ajax.reload()
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-edit-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-received-invoice #warning-message').empty()
            }, 3500)
        }
    })

    $('#saveEditReceivedInvoiceDelivery').click(function(){
        var validate = 0

        if(isEmpty($('#formReceivedInvoiceDelivery #invoiceNumber'))){
            validate++;
        }
   
        if(isEmpty($('#formReceivedInvoiceDelivery #date'))){
            validate++;
        }
     
        switch($('#formReceivedInvoiceDelivery #paymentMethod').val()){
            case '3':
                if(isEmpty($('#formReceivedInvoiceDelivery #bankAccount'))){
                    $('.select2-' + $('#formReceivedInvoiceDelivery #bankAccount').attr('id')).addClass('validateError')
                    $('.select2-' + $('#formReceivedInvoiceDelivery #bankAccount').attr('class')).addClass('validateError')
                    validate++;
                }else{
                    $('.select2-' + $('#formReceivedInvoiceDelivery #bankAccount').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#formReceivedInvoiceDelivery #bankAccount').attr('class')).removeClass('validateError')
                }
            break
            case '4':
                if(isEmpty($('#formReceivedInvoiceDelivery #creditCard'))){
                    $('.select2-' + $('#formReceivedInvoiceDelivery #creditCard').attr('id')).addClass('validateError')
                    $('.select2-' + $('#formReceivedInvoiceDelivery #creditCard').attr('class')).addClass('validateError')
                    validate++;
                }else{
                    $('.select2-' + $('#formReceivedInvoiceDelivery #creditCard').attr('id')).removeClass('validateError')
                    $('.select2-' + $('#formReceivedInvoiceDelivery #creditCard').attr('class')).removeClass('validateError')
                }
            break
        }
     
        if(isEmpty($('#formReceivedInvoiceDelivery #costCenter'))){
            $('.select2-' + $('#formReceivedInvoiceDelivery #costCenter').attr('id')).addClass('validateError')
            $('.select2-' + $('#formReceivedInvoiceDelivery #costCenter').attr('class')).addClass('validateError')

            validate++;
        }else{
            $('.select2-' + $('#formReceivedInvoiceDelivery #costCenter').attr('id')).removeClass('validateError')
            $('.select2-' + $('#formReceivedInvoiceDelivery #costCenter').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var ID = $('#formReceivedInvoiceDelivery #id').val()
            var bankAccount = $('#formReceivedInvoiceDelivery #bankAccount').val()
            var creditCard = $('#formReceivedInvoiceDelivery #creditCard').val()
            var expenseFixed = $('#formReceivedInvoiceDelivery #expenseFixed').val()
            var expenseVariable = $('#formReceivedInvoiceDelivery #expenseVariable').val()
            var costCenter = $('#formReceivedInvoiceDelivery #costCenter').val()
            var otherCostcenter = $('#formReceivedInvoiceDelivery #otherCostcenter').val()
            var supplier = $('#formReceivedInvoiceDelivery #supplier').val()
            var date = moment($('#formReceivedInvoiceDelivery #date').val(), 'DD/MM/YYYY').format('X')
            var dueDate = $('#formReceivedInvoiceDelivery #dueDate').val() == '' ? 'null' : moment($('#formReceivedInvoiceDelivery #dueDate').val(), 'DD/MM/YYYY').format('X')
            var paymentDate = $('#formReceivedInvoiceDelivery #paymentDate').val() == '' ? null : moment($('#formReceivedInvoiceDelivery #paymentDate').val(), 'DD/MM/YYYY').format('X')
            var dueDate = $('#formReceivedInvoiceDelivery #dueDate').val() == '' ? 'null' : moment($('#formReceivedInvoiceDelivery #dueDate').val(), 'DD/MM/YYYY').format('X')
            var dueDate2 = $('#formReceivedInvoiceDelivery #dueDate2').val() == '' ? 'null' : moment($('#formReceivedInvoiceDelivery #dueDate2').val(), 'DD/MM/YYYY').format('X')
            var dueDate3 = $('#formReceivedInvoiceDelivery #dueDate3').val() == '' ? 'null' : moment($('#formReceivedInvoiceDelivery #dueDate3').val(), 'DD/MM/YYYY').format('X')
            var paymentDueDate = $('#formReceivedInvoiceDelivery #paymentDueDate').val()
            var paymentDueDate2 = $('#formReceivedInvoiceDelivery #paymentDueDate2').val()
            var paymentDueDate3 = $('#formReceivedInvoiceDelivery #paymentDueDate3').val()
            var shipper = $('#formReceivedInvoiceDelivery #shipper').val()
            var nif = $('#formReceivedInvoiceDelivery #nif').val()
            var taxBase = $('#formReceivedInvoiceDelivery #taxBase').val()
            var withholding = $('#formReceivedInvoiceDelivery #withholding').val()
            var feeHoldIva = $('#formReceivedInvoiceDelivery #feeHoldIva').val()
            var supplied = $('#formReceivedInvoiceDelivery #supplied').val()
            var total = $('#formReceivedInvoiceDelivery #total').val()
            var paymentMethod = $('#formReceivedInvoiceDelivery #paymentMethod').val()
            var expenseType = $('#formReceivedInvoiceDelivery #expenseType').val()
            var cashOut = $('#formReceivedInvoiceDelivery #cashOut').val()
            var concept = $('#formReceivedInvoiceDelivery #concept').val()
            var comments = $('#formReceivedInvoiceDelivery #comments').val()
            var regularity = $('#formReceivedInvoiceDelivery #regularity').val()
            var invoiceNumber = $('#formReceivedInvoiceDelivery #invoiceNumber').val()
            var deliveryMode =  true;
    
            $.ajax({
                url: uri + 'core/expenses/receivedInvoices/update.php',
                method: 'POST',
                data: {
                    ID: ID,
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
                    paymentDueDate: paymentDueDate,
                    paymentDueDate2: paymentDueDate2,
                    paymentDueDate3: paymentDueDate3,
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
                    otherCostcenter: otherCostcenter,
                    deliveryMode : deliveryMode
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    var continueFlag = false;
                    switch(data){
                        case 'invoice_number':
                            $('#modal-edit-received-invoice #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una factura de este proveedor con este número de factura.</div>');
                        break;
                        case false:
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        break;
                        default:
                            continueFlag = true
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido modificada con éxito.</div>')
                        break;
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    if(!continueFlag){
                        return false
                    }

                    $('#modal-new-received-invoice-delivery').modal('hide')
                    $('#formReceivedInvoiceDelivery #taxBase').val(0);
                    $('#formReceivedInvoiceDelivery #feeHoldIva').val(0);
                    $('#formReceivedInvoiceDelivery #withholding').val(0);
                    $('#formReceivedInvoiceDelivery #supplied').val(0);
                    $('#formReceivedInvoiceDelivery #total').val(0);
                    $('#formReceivedInvoiceDelivery textarea').val('');
                    $("#formReceivedInvoiceDelivery #bankAccount").val('').trigger('change');
                    $("#formReceivedInvoiceDelivery #creditCard").val('').trigger('change');
                    $("#formReceivedInvoiceDelivery #supplier").val('').trigger('change');
                    $("#formReceivedInvoiceDelivery #cashOut").val(0).trigger('change');
                    $("#formReceivedInvoiceDelivery #costCenter").val(0).trigger('change');
                    $("#formReceivedInvoiceDelivery #regularity").val(0).trigger('change');
                    $("#formReceivedInvoiceDelivery #expenseType").val(0).trigger('change');
                    $("#formReceivedInvoiceDelivery #expenseCostCenter").val('').trigger('change');
                    $("#formReceivedInvoiceDelivery #otherCostcenter").val('')
                    $("#formReceivedInvoiceDelivery #expenseFixed").val('').trigger('change');
                    $("#formReceivedInvoiceDelivery #expenseVariable").val('').trigger('change');
                    $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('show');
                    $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
                    $('#formReceivedInvoiceDelivery #creditCards').removeClass('show');
                    $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
                    $('#formReceivedInvoiceDelivery #expenses').removeClass('show');
                    $('#formReceivedInvoiceDelivery #expenses').addClass('hide');
                    $('#formReceivedInvoiceDelivery #expensesCostCenter').removeClass('show');
                    $('#formReceivedInvoiceDelivery #expensesCostCenter').addClass('hide');
                    $('#formReceivedInvoiceDelivery #expensesFixed').removeClass('show');
                    $('#formReceivedInvoiceDelivery #expensesFixed').addClass('hide');
                    $('#formReceivedInvoiceDelivery #expensesVariable').removeClass('show');
                    $('#formReceivedInvoiceDelivery #expensesVariable').addClass('hide');

                    var inputFile = document.getElementById('fileAttachDocEditDelivery');
                    var files = inputFile.files;
                    if(files.length > 0){
                        for(var i = 0; i < files.length; i++){
                            var docName = files[i].name;
            
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
                                dataFile.append('archivo', files[0]);
                                dataFile.append('invoice', data);
                                $.ajax({
                                    url: uri + "core/expenses/receivedInvoices/fileUploadEdit.php",
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
                    }
                    $('#formReceivedInvoiceDelivery input').val('');
                    clean("formEditReceivedInvoiceDelivery");
                    table.ajax.reload()
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

        }else{
            $('#modal-new-received-invoice-deliveryy #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-received-invoice-delivery #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-edit-received-invoice #cancel').click(function(){
        $('#formEditReceivedInvoice input').val('');

        $('#formEditReceivedInvoice #taxBase0').val(0);
        $('#formEditReceivedInvoice #feeHoldIva0').val('0.00');
        $('#formEditReceivedInvoice #totalIva0').text('0.00 €')
        $('#formEditReceivedInvoice #withholding').val(0);
        $('#formEditReceivedInvoice #supplied').val(0);

        $.each($('#modal-edit-received-invoice #editIvasBreakdown .iva-breakdown-item'), function(index, value){
            if(index > 0){
                var itemSelected = $(this).attr('item');
                deleteIvaBreakdown('#modal-edit-received-invoice', '#editIvasBreakdown', itemSelected)
            }
        })
        itemsIvasBreakdown = 1;

        $('#formEditReceivedInvoice #total').val(0);
        $('#formEditReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'));
        $('#formEditReceivedInvoice textarea').val('');
        $("#formEditReceivedInvoice #bankAccount").val('').trigger('change');
        $("#formEditReceivedInvoice #creditCard").val('').trigger('change');
        $("#formEditReceivedInvoice #supplier").val('').trigger('change');
        $("#formEditReceivedInvoice #cashOut").val(0).trigger('change');
        $("#formEditReceivedInvoice #costCenter").val(0).trigger('change');
        $("#formEditReceivedInvoice #regularity").val(0).trigger('change');
        $("#formEditReceivedInvoice #expenseType").val(0).trigger('change');
        $("#formEditReceivedInvoice #expenseCostCenter").val('').trigger('change');
        $("#formEditReceivedInvoice #expenseFixed").val('').trigger('change');
        $("#formEditReceivedInvoice #expenseVariable").val('').trigger('change');
        $('#formEditReceivedInvoice #bankAccounts').removeClass('show');
        $('#formEditReceivedInvoice #bankAccounts').addClass('hide');
        $('#formEditReceivedInvoice #creditCards').removeClass('show');
        $('#formEditReceivedInvoice #creditCards').addClass('hide');
        $('#formEditReceivedInvoice #expenses').removeClass('show');
        $('#formEditReceivedInvoice #expenses').addClass('hide');
        $('#formEditReceivedInvoice #expensesCostCenter').removeClass('show');
        $('#formEditReceivedInvoice #expensesCostCenter').addClass('hide');
        $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
        $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
        $('#formEditReceivedInvoice #expensesVariable').removeClass('show');
        $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
        clean("formEditReceivedInvoice");
        $('#modal-edit-received-invoice #warning-message').html('')
        $('#formEditReceivedInvoice #paymentMethod').val(1).trigger('change')

        tempAttachments = new Array;
    })

    $('#modal-edit-received-invoice').on('hidden.bs.modal', function (e) {
        $('#formEditReceivedInvoice input').val('');

        $('#formEditReceivedInvoice #taxBase0').val(0);
        $('#formEditReceivedInvoice #feeHoldIva0').val('0.00');
        $('#formEditReceivedInvoice #totalIva0').text('0.00 €')
        $('#formEditReceivedInvoice #withholding').val(0);
        $('#formEditReceivedInvoice #supplied').val(0);

        $.each($('#modal-edit-received-invoice #editIvasBreakdown .iva-breakdown-item'), function(index, value){
            if(index > 0){
                var itemSelected = $(this).attr('item');
                deleteIvaBreakdown('#modal-edit-received-invoice', '#editIvasBreakdown', itemSelected)
            }
        })
        itemsIvasBreakdown = 1;

        $('#formEditReceivedInvoice #total').val(0);
        $('#formEditReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'));
        $('#formEditReceivedInvoice textarea').val('');
        $("#formEditReceivedInvoice #bankAccount").val('').trigger('change');
        $("#formEditReceivedInvoice #creditCard").val('').trigger('change');
        $("#formEditReceivedInvoice #supplier").val('').trigger('change');
        $("#formEditReceivedInvoice #cashOut").val(0).trigger('change');
        $("#formEditReceivedInvoice #costCenter").val(0).trigger('change');
        $("#formEditReceivedInvoice #regularity").val(0).trigger('change');
        $("#formEditReceivedInvoice #expenseType").val(0).trigger('change');
        $("#formEditReceivedInvoice #expenseCostCenter").val('').trigger('change');
        $("#formEditReceivedInvoice #expenseFixed").val('').trigger('change');
        $("#formEditReceivedInvoice #expenseVariable").val('').trigger('change');
        $('#formEditReceivedInvoice #bankAccounts').removeClass('show');
        $('#formEditReceivedInvoice #bankAccounts').addClass('hide');
        $('#formEditReceivedInvoice #creditCards').removeClass('show');
        $('#formEditReceivedInvoice #creditCards').addClass('hide');
        $('#formEditReceivedInvoice #expenses').removeClass('show');
        $('#formEditReceivedInvoice #expenses').addClass('hide');
        $('#formEditReceivedInvoice #expensesCostCenter').removeClass('show');
        $('#formEditReceivedInvoice #expensesCostCenter').addClass('hide');
        $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
        $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
        $('#formEditReceivedInvoice #expensesVariable').removeClass('show');
        $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
        clean("formEditReceivedInvoice");
        $('#modal-edit-received-invoice #warning-message').html('')
        $('#formEditReceivedInvoice #paymentMethod').val(1).trigger('change')

        tempAttachments = new Array;
    })

    $('#modal-edit-received-invoice #close').click(function(){
        $('#formEditReceivedInvoice input').val('');

        $('#formEditReceivedInvoice #taxBase0').val(0);
        $('#formEditReceivedInvoice #feeHoldIva0').val('0.00');
        $('#formEditReceivedInvoice #totalIva0').text('0.00 €')
        $('#formEditReceivedInvoice #withholding').val(0);
        $('#formEditReceivedInvoice #supplied').val(0);

        $.each($('#modal-edit-received-invoice #editIvasBreakdown .iva-breakdown-item'), function(index, value){
            if(index > 0){
                var itemSelected = $(this).attr('item');
                deleteIvaBreakdown('#modal-edit-received-invoice', '#editIvasBreakdown', itemSelected)
            }
        })
        itemsIvasBreakdown = 1;
        
        $('#formEditReceivedInvoice #total').val(0);
        $('#formEditReceivedInvoice #date').val(moment(new Date()).format('DD/MM/YYYY'));
        $('#formEditReceivedInvoice textarea').val('');
        $("#formEditReceivedInvoice #bankAccount").val('').trigger('change');
        $("#formEditReceivedInvoice #creditCard").val('').trigger('change');
        $("#formEditReceivedInvoice #supplier").val('').trigger('change');
        $("#formEditReceivedInvoice #cashOut").val(0).trigger('change');
        $("#formEditReceivedInvoice #costCenter").val(0).trigger('change');
        $("#formEditReceivedInvoice #regularity").val(0).trigger('change');
        $("#formEditReceivedInvoice #expenseType").val(0).trigger('change');
        $("#formEditReceivedInvoice #expenseCostCenter").val('').trigger('change');
        $("#formEditReceivedInvoice #expenseFixed").val('').trigger('change');
        $("#formEditReceivedInvoice #expenseVariable").val('').trigger('change');
        $('#formEditReceivedInvoice #bankAccounts').removeClass('show');
        $('#formEditReceivedInvoice #bankAccounts').addClass('hide');
        $('#formEditReceivedInvoice #creditCards').removeClass('show');
        $('#formEditReceivedInvoice #creditCards').addClass('hide');
        $('#formEditReceivedInvoice #expenses').removeClass('show');
        $('#formEditReceivedInvoice #expenses').addClass('hide');
        $('#formEditReceivedInvoice #expensesCostCenter').removeClass('show');
        $('#formEditReceivedInvoice #expensesCostCenter').addClass('hide');
        $('#formEditReceivedInvoice #expensesFixed').removeClass('show');
        $('#formEditReceivedInvoice #expensesFixed').addClass('hide');
        $('#formEditReceivedInvoice #expensesVariable').removeClass('show');
        $('#formEditReceivedInvoice #expensesVariable').addClass('hide');
        clean("formEditReceivedInvoice");
        $('#modal-edit-received-invoice #warning-message').html('')
        $('#formEditReceivedInvoice #paymentMethod').val(1).trigger('change')

        tempAttachments = new Array;
    })

    $('#modal-edit-received-invoice-delivery #cancel').click(function(){
        $('#formReceivedInvoiceDelivery input').val('');
        $('#formReceivedInvoiceDelivery #taxBase').val(0);
        $('#formReceivedInvoiceDelivery #feeHoldIva').val(0);
        $('#formReceivedInvoiceDelivery #totalIva1').empty();
        $('#formReceivedInvoiceDelivery #withholding').val(0);
        $('#formReceivedInvoiceDelivery #supplied').val(0);
        $('#formReceivedInvoiceDelivery #total').val(0);
        $('#formReceivedInvoiceDelivery textarea').val('');
        $("#formReceivedInvoiceDelivery #bankAccount").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #creditCard").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #supplier").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #cashOut").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #costCenter").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #otherCostcenter").val('')
        $("#formReceivedInvoiceDelivery #regularity").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #expenseType").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #expenseCostCenter").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #expenseFixed").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #expenseVariable").val('').trigger('change');
        $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('show');
        $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
        $('#formReceivedInvoiceDelivery #creditCards').removeClass('show');
        $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
        $('#formReceivedInvoiceDelivery #expenses').removeClass('show');
        $('#formReceivedInvoiceDelivery #expenses').addClass('hide');
        $('#formReceivedInvoiceDelivery #expensesCostCenter').removeClass('show');
        $('#formReceivedInvoiceDelivery #expensesCostCenter').addClass('hide');
        $('#formReceivedInvoiceDelivery #expensesFixed').removeClass('show');
        $('#formReceivedInvoiceDelivery #expensesFixed').addClass('hide');
        $('#formReceivedInvoiceDelivery #expensesVariable').removeClass('show');
        $('#formReceivedInvoiceDelivery #expensesVariable').addClass('hide');
        clean("formEditReceivedInvoiceDelivery");
        $('#modal-edit-received-invoice-delivery #warning-message').empty()
    })

    $('#modal-edit-received-invoice-delivery #close').click(function(){
        $('#formReceivedInvoiceDelivery input').val('');
        $('#formReceivedInvoiceDelivery #taxBase').val(0);
        $('#formReceivedInvoiceDelivery #feeHoldIva').val(0);
        $('#formReceivedInvoiceDelivery #totalIva1').empty();
        $('#formReceivedInvoiceDelivery #withholding').val(0);
        $('#formReceivedInvoiceDelivery #supplied').val(0);
        $('#formReceivedInvoiceDelivery #total').val(0);
        $('#formReceivedInvoiceDelivery textarea').val('');
        $("#formReceivedInvoiceDelivery #bankAccount").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #creditCard").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #supplier").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #cashOut").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #costCenter").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #otherCostcenter").val('')
        $("#formReceivedInvoiceDelivery #regularity").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #expenseType").val(0).trigger('change');
        $("#formReceivedInvoiceDelivery #expenseCostCenter").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #expenseFixed").val('').trigger('change');
        $("#formReceivedInvoiceDelivery #expenseVariable").val('').trigger('change');
        $('#formReceivedInvoiceDelivery #bankAccounts').removeClass('show');
        $('#formReceivedInvoiceDelivery #bankAccounts').addClass('hide');
        $('#formReceivedInvoiceDelivery #creditCards').removeClass('show');
        $('#formReceivedInvoiceDelivery #creditCards').addClass('hide');
        $('#formReceivedInvoiceDelivery #expenses').removeClass('show');
        $('#formReceivedInvoiceDelivery #expenses').addClass('hide');
        $('#formReceivedInvoiceDelivery #expensesCostCenter').removeClass('show');
        $('#formReceivedInvoiceDelivery #expensesCostCenter').addClass('hide');
        $('#formReceivedInvoiceDelivery #expensesFixed').removeClass('show');
        $('#formReceivedInvoiceDelivery #expensesFixed').addClass('hide');
        $('#formReceivedInvoiceDelivery #expensesVariable').removeClass('show');
        $('#formReceivedInvoiceDelivery #expensesVariable').addClass('hide');
        clean("formEditReceivedInvoiceDelivery");
        $('#modal-edit-received-invoice-delivery #warning-message').empty()
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

    // FACTURAS RECIBIDAS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(confirm("¿Está seguro que desea eliminar la factura?")){
            $.ajax({
                url: uri + 'core/expenses/receivedInvoices/delete.php',
                method: 'POST',
                data: {
                    ID : rowClick[0]
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura recibida se ha eliminado con éxito.</div>')
                        
                        table.ajax.reload()
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
        }
    })

    // FACTURAS RECIBIDAS - CONFIRMAR PAGO
    var IDreceivedInvoice
    table.on('click', '.btn-pay', function(){
        $('.btn-pay').tooltip('hide')
        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        IDreceivedInvoice = rowClick[0]

        paidInfo = getPaidInfo(rowClick[0]);
        if(paidInfo.totalPaid == 0 || paidInfo.totalPaid == null){
            paidInfo.totalPaid = "0.00";
        }
        if(paidInfo.invoiceNumber == null){
            paidInfo.invoiceNumber = ""
        }
        totalPending = parseFloat(paidInfo.total) - parseFloat(paidInfo.totalPaid)
        if(totalPending < 0){
            totalPending = 0.00
        }
        $("#modal-invoices-pay #payInvoiceTitle").empty();
        $("#modal-invoices-pay #payInvoiceTitle").append("<strong> "+paidInfo.invoiceNumber+"</strong>")
        $('#modal-invoices-pay #totalInvoice').val(parseFloat(paidInfo.total).toFixed(2) + " €")
        $('#modal-invoices-pay #totalPaid').val(parseFloat(paidInfo.totalPaid).toFixed(2) + " €")
        $('#modal-invoices-pay #amount').val(totalPending.toFixed(2))
        $('#modal-invoices-pay #date').val((moment().format('DD/MM/YYYY')))
        $('#modal-invoices-pay').modal('show')
    })

    table.on('click', '.btn-payments', function(){
        $('.btn-payments').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/expenses/receivedInvoices/functions.php',
            method: 'POST',
            data: {
                type: 'getPayments',
                invoice: rowClick[0]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    paidInfo = getPaidInfo(rowClick[0]); 
                    $("#modal-payments #paymentListInvoiceTitle").empty();
                    $('#paymentsSection').empty();   
                    if(paidInfo.invoiceNumber == null){
                        paidInfo.invoiceNumber = ""
                    }
                    $("#modal-payments #paymentListInvoiceTitle").append("<strong> "+paidInfo.invoiceNumber+"</strong>")

                    $('#modal-payments #divSummary').addClass("hide")
                    $('#modal-payments #totalInvoice').val(null)
                    $('#modal-payments #totalPaid').val(null)
                    $('#modal-payments #amountPending').val(null)
                    if(data == null){                        
                        $('#paymentsSection').append('<strong>No hay pagos realizados</strong>')
                        $('#paymentsTable').addClass('hide')
                    }else{
                        $('#paymentsBody').empty()
                        $('#paymentsSection').html('')
                        $('#paymentsTable').removeClass('hide')
                        $('#modal-payments #divSummary').removeClass("hide")

                        if(paidInfo.totalPaid == 0 || paidInfo.totalPaid == null){
                            paidInfo.totalPaid = "0.00";
                        }
        
                        totalPending = parseFloat(paidInfo.total) - parseFloat(paidInfo.totalPaid)
                        if(totalPending < 0){
                            totalPending = 0.00
                        }
                        $('#modal-payments #totalInvoice').val(parseFloat(paidInfo.total).toFixed(2) + " €")
                        $('#modal-payments #totalPaid').val(parseFloat(paidInfo.totalPaid).toFixed(2) + " €")
                        $('#modal-payments #amountPending').val(totalPending.toFixed(2) + " €")
                        $.each(data, function(index, elem){
                            $('#paymentsBody').append(  
                                '   <tr>' +
                                '       <td class="hide" id="id">' + elem.ID + '</td>' +
                                '       <td align="center">' +
                                '           <input type="text" class="form-control datepicker" style="text-align: center" id="date'+elem.ID+'" value="' + moment(elem.date, 'X').format('DD/MM/YYYY') + '">' +
                                '       </td>' +
                                '       <td align="center">' +
                                '           <input type="number" class="form-control payment-edit-amount" style="text-align: center" id="amount'+elem.ID+'" value="' + elem.amount + '">' +
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

                    $('#modal-payments').modal('show')
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
        
        $(".editPayment").click(function(){
            var paymentID = $(this).attr("payment")

            var validate = 0
            if(isEmpty($('#modal-payments #amount' +paymentID))){
                validate++
            }  

            if(isEmpty($('#modal-payments #date'+paymentID))){
                validate++
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
                var amount = $('#modal-payments #amount'+paymentID).val()            
                var date = $('#modal-payments #date'+paymentID).val() == '' ? null : moment($('#modal-payments #date'+paymentID).val(), 'DD/MM/YYYY').format('X')       
                
                $.ajax({
                    url: uri + 'core/expenses/receivedInvoices/functions.php',
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
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Pago realizado.</div>')
                            
                            table.ajax.reload()
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
                $('#modal-payments').modal('hide')
            }else{
                if(totalAmounts > totalInvoice){
                    $('#modal-payments #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La suma de los pagos parciales no puede ser superior al total de la factura</div>')
                }else{
                    $('#modal-payments #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
                }
    
                setTimeout(function(){
                    $('#modal-payments #warning-message').empty()
                }, 3500)
            }
        })

        $(".deletePayment").click(function(){
            var paymentID = $(this).attr("payment")

            var ID = paymentID
            $.ajax({
                url: uri + 'core/expenses/receivedInvoices/functions.php',
                method: 'POST',
                data: {
                    type: 'deletePayment',
                    ID: ID
                },
                async: false,
                success: function(data){                    
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Pago realizado.</div>')
                        table.ajax.reload()
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
            $('#modal-payments').modal('hide')
        })
    })

    $('#modal-invoices-pay #savePayments').click(function(){

        $('#modal-invoices-pay #amountError').hide()
        $('#modal-invoices-pay #amount').removeClass('validateError')

        var amount = $('#modal-invoices-pay #amount').val();
        var totalPaid = $('#modal-invoices-pay #totalPaid').val();
        var totalInvoice = $('#modal-invoices-pay #totalInvoice').val();

        var validate = 0;
        if(validate == 0){
            totalPaid = parseFloat(totalPaid) + parseFloat(amount);
            if(totalPaid > parseFloat(totalInvoice)){
                $("#confirm-paid-invoice-modal").modal("show")
                
                $("#confirmBtn").click(function(){
                    var validate = 0
                    if(isEmpty($('#modal-invoices-pay #amount'))){
                        validate++
                    }  
                    if(isEmpty($('#modal-invoices-pay #date'))){
                        validate++
                    }  
                
                    if(validate == 0){
                        var ID_inv = IDreceivedInvoice
                        var amount_payed = $('#modal-invoices-pay #amount').val()            
                        var date_pay = $('#modal-invoices-pay #date').val() == '' ? null : moment($('#modal-invoices-pay #date').val(), 'DD/MM/YYYY').format('X')       
                        
                        $.ajax({
                            url: uri + 'core/expenses/receivedInvoices/functions.php',
                            method: 'POST',
                            data: {
                                type: 'payPartialInvoice',
                                ID_inv: ID_inv,
                                amount_payed: amount_payed,
                                date_pay: date_pay
                            },
                            async: false,
                            success: function(data){                    
                                if(data){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Pago realizado.</div>')
                                    
                                    table.ajax.reload()
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
                        $('#modal-invoices-pay').modal('hide')
                        $("#confirm-paid-invoice-modal").modal("hide")
                    }else{
                        $('#modal-invoices-pay #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            
                        setTimeout(function(){
                            $('#modal-invoices-pay #warning-message').empty()
                        }, 3500)
                    }
                })
               
            }else{
                var validate = 0
                if(isEmpty($('#modal-invoices-pay #amount'))){
                    validate++
                }  
                if(isEmpty($('#modal-invoices-pay #date'))){
                    validate++
                }  
                if(validate == 0){
                    var ID_inv = IDreceivedInvoice
                    var amount_payed = $('#modal-invoices-pay #amount').val()            
                    var date_pay = $('#modal-invoices-pay #date').val() == '' ? null : moment($('#modal-invoices-pay #date').val(), 'DD/MM/YYYY').format('X')       
                    
                    $.ajax({
                        url: uri + 'core/expenses/receivedInvoices/functions.php',
                        method: 'POST',
                        data: {
                            type: 'payPartialInvoice',
                            ID_inv: ID_inv,
                            amount_payed: amount_payed,
                            date_pay: date_pay
                        },
                        async: false,
                        success: function(data){                    
                            if(data){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Pago realizado.</div>')
                                
                                table.ajax.reload()
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
                    $('#modal-invoices-pay').modal('hide')
                }else{
                    $('#modal-invoices-pay #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
        
                    setTimeout(function(){
                        $('#modal-invoices-pay #warning-message').empty()
                    }, 3500)
                }
            }
        }
    })
        
    $('#modal-invoices-pay').on('hidden.bs.modal', function(){
        $("#modal-invoices-pay input").val('').trigger('change')
        $('#modal-invoices-pay #warning-message').empty()
        clean("formEditInvoice");
    })

    // Downloads invoices in A3 format
    $('#downloadFormatA3').click(function(){

        $("#downloadFormatA3").attr("disabled", true);

        validate = true;
    
        var month = parseInt($('#month').val());
        var year = parseInt($('#year').val());

        if($('#trimester').val() != null && $('#trimester').val() != ''){
            switch ($('#trimester').val()){
                case '0':
                    if($('#month').val() == 0){
                        from = moment('01/01/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        to = moment('31/12/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
                    }else{
                        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                        if(month < 10){
                            month = "0" + month;
                        }
                        from = moment('01/' + month + '/' + year + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
                        var lastDay = parseInt(moment(month + '/' + year, 'MM/YYYY').clone().endOf('month').format('DD'))
                        to = moment(lastDay + '/' + month + '/' + year + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
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
        
                    from = parseInt(new Date($('#year').val()+"-01-01 00:00:00").getTime()) / 1000;
                    to = parseInt(new Date($('#year').val() + "-12-31 23:59:59").getTime()) / 1000;
                }else{
                    //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
                    var year = parseInt($('#year').val());
                    var month = parseInt($('#month').val());
                    if(month < 10){
                        month = "0" + month;
                    }
                    var day = moment("01/" + month + "/" + year, "DD/MM/YYYY").endOf('month').format('DD');

                    from = parseInt(new Date($('#year').val() + "-" + month + "-01 00:00:00").getTime()) / 1000;
                    to = parseInt(new Date(year + "-" + month + "-" + day + " 23:59:59").getTime()) / 1000;
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

        if(from != null && from != '' && to != null && to != ''){
            type = $('#type').val();
            status = $('#status').val();
            supplier = $('#suppliers').val()
            search = $('#input-search').val();
            costCenterFilter = $('#costCenterFilter').val();
            cashOutFilter = $('#cashOutFilter').val();
            expenseTypeFilter = $('#expenseTypeFilter').val();
            paymentMethodFilter = $('#paymentMethodFilter').val();
            bankAccountFilter = $('#bankAccountFilter').val();
            creditCardFilter = $('#creditCardFilter').val();
    
            $.ajax({
                url: uri + "core/expenses/receivedInvoices/downloadA3.php",
                data: {
                    from: from,
                    to: to,
                    type: type,
                    supplier: supplier,
                    search: search,
                    status: status,
                    costCenterFilter: costCenterFilter,
                    cashOutFilter: cashOutFilter,
                    expenseTypeFilter: expenseTypeFilter,
                    paymentMethodFilter: paymentMethodFilter,
                    bankAccountFilter: bankAccountFilter,
                    creditCardFilter: creditCardFilter,
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
            $("#downloadFormatA3").attr("disabled", false);
            alert('Indica un rango de fechas correcto.');
        }
    })
})

/**
 * Add iva breakdown
 * 
 * @param {string} modal Modal id
 * @param {string} section  Section
 */
function addIvaBreakdown(modal, section, data = null){

    var numberLabel = itemsIvasBreakdown + 1;

    var inputId = '';
    if(data != null){
        inputId = '<input type="hidden" id="receivedIvaId'+itemsIvasBreakdown+'">'
    }

    $(modal + ' ' +section).append(
        '   <div id="ivaBreakdown'+itemsIvasBreakdown+'" item="'+itemsIvasBreakdown+'" class="row form-group iva-breakdown-item">'+
                inputId +
        '       <div class="col-xs-4">'+
        '           <label for="taxBase'+itemsIvasBreakdown+'" class="col-xs-5 control-label">Base imponible '+numberLabel+'</label>'+
        '           <div class="input-group" style="padding-left: 3%;">'+
        '               <input type="number" min="0" value="0" id="taxBase'+itemsIvasBreakdown+'" name="taxBase'+itemsIvasBreakdown+'" onchange="calculateTotalInvoice(\''+modal+'\', \''+section+'\')" item="'+itemsIvasBreakdown+'" class="form-control" style="width: 120px !important;" aria-describedby="base imponible" autocomplete="none"/>'+
        '               <div class="input-group-addon">€</div>'+
        '           </div>'+
        '       </div>'+
        '       <div class="col-xs-3">'+
        '           <label for="feeHoldIva'+itemsIvasBreakdown+'" class="col-xs-9 control-label">Cuota de '+getIvaLabel()+' retenido '+numberLabel+'</label>'+
        '           <div class="col-xs-3">'+
        '               <select class="form-control" id="feeHoldIva'+itemsIvasBreakdown+'" onchange="calculateTotalInvoice(\''+modal+'\', \''+section+'\')" item="'+itemsIvasBreakdown+'"></select>'+
        '           </div>'+
        '       </div>'+
        '       <div class="col-xs-3">'+
        '           <label for="totalIva'+itemsIvasBreakdown+'" class="col-xs-12 control-label" style="text-align:center">Total '+getIvaLabel()+' '+numberLabel+': <strong><span id="totalIva'+itemsIvasBreakdown+'">0.00 €</span></strong></label>'+
        '       </div>'+
        '       <div class="col-xs-2">'+
        '           <button type="button" class="btn btn-danger" onclick="deleteIvaBreakdown(\''+modal+'\', \''+section+'\', '+itemsIvasBreakdown+')">'+
        '               <i class="fa fa-trash" aria-hidden="true"></i> ELIMINAR'+
        '           </button>'+
        '       </div>'+
        '   </div>'
    )

    // Set iva options
    if(ivasReceivedOptions == null){
        $(modal + ' ' +section + ' #feeHoldIva' + itemsIvasBreakdown).append('<option value="0">-</option>')
    }else{
        $.each(ivasReceivedOptions, function(index, elem){
            $(modal + ' ' +section + ' #feeHoldIva' + itemsIvasBreakdown).append('<option value="' + elem.percentage + '">' + elem.name + '</option>')
        })
    }

    if(data != null){
        $(modal + ' ' +section + ' #receivedIvaId' + itemsIvasBreakdown).val(data.id)
        $(modal + ' ' +section + ' #taxBase' + itemsIvasBreakdown).val(data.base)
        $(modal + ' ' +section + ' #feeHoldIva' + itemsIvasBreakdown).val(parseFloat(data.typeIva).toFixed(2)).trigger('change')
        $(modal + ' ' +section + ' #totalIva' + itemsIvasBreakdown).text(parseFloat(data.iva).toFixed(2) + ' €')
    }

    // Increment number of items
    itemsIvasBreakdown++;
}

/**
 * Delete expense product type
 * 
 * @param {string} modal Modal id
 * @param {string} section  Section
 * @param {int} itemSelected Item to delete
 */
function deleteIvaBreakdown(modal, section, itemSelected){
    $(modal + ' ' +section + ' #ivaBreakdown' + itemSelected).remove();

    calculateTotalInvoice(modal, section);
}

/**
 * Calculate total invoice
 * 
 * @param {string} modal Modal id
 * @param {string} section  Section
 */
function calculateTotalInvoice(modal, section){
    var supplied = $(modal + ' #supplied').val() == '' ? 0 : $(modal + ' #supplied').val()
    var withholding = $(modal + ' #withholding').val() == '' ? 0 : $(modal + ' #withholding').val()

    // Calculate ivas
    var total = 0;
    var totalBases = 0;

    $.each($(modal + ' ' + section + ' .iva-breakdown-item'), function(index, value){
        var itemSelected = $(this).attr('item');
        
        if(
            $(modal + ' ' + section + ' #taxBase' + itemSelected).val() != '' &&
            $(modal + ' ' + section + ' #feeHoldIva' + itemSelected).val() != ''
        ){
            var taxBaseSelected = parseFloat($(modal + ' ' + section + ' #taxBase' + itemSelected).val())
            var feeHoldIvaSelected = parseFloat($(modal + ' ' + section + ' #feeHoldIva' + itemSelected).val())
            var totalIvaItem = taxBaseSelected *  feeHoldIvaSelected / 100;
            $(modal + ' ' +section + ' #totalIva' + itemSelected).empty().text(parseFloat(totalIvaItem).toFixed(2) + ' €')
    
            totalBases += taxBaseSelected;
            total += taxBaseSelected *  feeHoldIvaSelected / 100;
        }
    })

    total += totalBases - (totalBases * parseFloat(withholding)/100) + parseFloat(supplied);
    $(modal + ' #total').val((Math.round(total * 100) / 100).toFixed(2));
}