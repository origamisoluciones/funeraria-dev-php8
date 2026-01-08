/**
 * Stores expedient type
 */
var expedientType = 0

var table = null;

/**
 * Comprueba si la compañia tiene claves para smsUp
 */
function getSmsUp(){

    var info = null;

    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'getSmsUp'
        },
        type : 'POST',
        async : false,
        success : function(data){
            info = data = $.parseJSON(data)
        }
    })

    return info;
}

//Obtiene la fecha de la primera factura para un tanatorio propio
function getFirstExpedientDate() {
    var date;
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {type: "getFirstExpedient"},
        type: 'POST',
        async: false,
        success: function (data){
            date = $.parseJSON(data);
            if(date == null){
                date = moment((new Date()).getFullYear(), "YYYY").format("X");
            }        
        }
    });

    
    return date;
}

$.fn.stars = function() {
    return $(this).each(function() {
        // // Get the value
        var val = parseFloat($(this).html());
        var size = Math.max(1, (Math.min(5, val)));
        
        size = size * 80 / 5;

        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);

        // $(this).html($('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
    });
}

var expedientsInvoices = [];
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
    
    $('#backLink').click(function(event){
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    // PICKERS
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })
    
    //Select
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    //Icheck
    $('.check-control label input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });

    // Year filter
    var date = getFirstExpedientDate();
    var year = parseInt(moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY"));
    var currentYear = parseInt(moment().format('YYYY'));
    $('#yearShowFilter').append("<option></option>");
    for (year; year <= currentYear; year++){
        $('#yearShowFilter').append("<option value=" + year + ">" + year + "</option>");
    }
    
    //Datatables
    var selected = [];
    var userTypeForDeleteCheck 
    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getUserTypeID',
        },
        async: false,
        success: function(data){
            userTypeForDeleteCheck = $.parseJSON(data)
        }
    })

    getBankAccounts();

    getTPVs();
    
    table = $('#expedients-table').DataTable({
        "ajax": uri + 'core/expedients/expedient/list.php?all=1',
        "rowCallback": function( row, data ) {
            if($.inArray(data.DT_RowId, selected) !== -1){
                $(row).addClass('selected');
            }
        },
        "select": true,
        "pageLength": 50,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '597px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "" },
            {"title": "Nº Expediente" },
            {"title": "Ref. Interna" },
            {"title": "Fecha Solicitud" },
            {"title": "Nombre" },
            {"title": "Apellidos" },  // 5
            {"title": "Cliente" },
            {"title": "Estado expd."},
            {"title": "Tanatorio" },
            {"title": "Tipo expd."},
            {"title": "Tipo cliente" }, // 10
            {"title": "Usuario" }, 
            {"title": "crematoriumID"},
            {"title": "Asistencia"},
            {"title": "room"},
            {"title": "Notas"}, // 15
            {"title": "Orden"}, 
            {"title" : "Editar"},
            {"title" : "Eliminar"},
            {"title" : "Asistencia"},
            {"title" : "Orden año"}, // 20
            {"title" : "Client type"}, 
            {"title" : "FS"},
            {"title" : "TPV"},
            {"title" : "Encuesta"},
            {"title" : "hasInvoice"}, // 25
            {"title" : "exists_invoice_rectified"} // 26
        ], 
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "visible": false,
            "targets" : [16, 20, 21, 22, 23, 25, 26]
        },
        {
            "className" : "numberExpedient editClick centered",
            "targets" : 1
        },
        {
            "className": "date centered",
            "targets": 3,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "status centered",
            "targets": 7,
            "render": function (data, type, row) {
                if(type === 'display'){
                    switch (data) {
                        case '1':
                            return '-';
                        break;
                        case '2':
                            return 'En curso';
                        break;
                        case '3':
                            return 'Pendiente de facturación';
                        break;
                        case '4':
                            return 'Facturado';
                        break;
                        case '5':
                            return 'Finalizado';
                        break;
                        case '6':
                            return 'Pendiente de revisión';
                        break;
                        default:
                            return data;
                        break;
                    }
                }else{
                    return data;
                }
            }
        },
        {
            "className": "centered",
            "targets": 8,
            "render": function (data, type, row) {
                if(data == '' || data == null){
                    return '-';
                }else{
                    return data;
                }
            }
        },
        {
            "className": "type centered",
            "targets": 9,
            "width" : "7%",
            "searchable": false,
            "render": function (data, type, row) {
                if(type === 'display'){
					var crematoryID = row[12];
					var room = row[14];
					var fs = row[22];
					var tpv = row[23];
					var rectified = row[26];

					var typeLabel = '';
					if(crematoryID!=null && crematoryID!=undefined && crematoryID!=null){
						typeLabel += ' <span class="label label-danger">C</span>';
					}
					if(room == '1'){
						typeLabel += ' <span class="label label-success">S</span>';
					}
					if(fs != null && fs != '' && parseInt(fs) > 0){
						typeLabel += ' <span class="label label-warning">FS</span>';
					}
					if(parseInt(tpv) == 1){
						typeLabel += ' <span class="label bge-lile">TPV</span>';
					}
					if(rectified != null && rectified != '' && parseInt(rectified) > 0){
						typeLabel += ' <span class="label bge-brown">FR</span>';
					}
					switch (data){
						case '1':
							return 'Defunción'+typeLabel;
						break;
						case '2':
							return 'Presupuesto'+typeLabel;
						break;
						case '3':
							return 'Varios'+typeLabel;
						break;
						default:
							return data+typeLabel;
						break;
					}
				}else{
					return data;
				}
            }
        },
        {
            "className": "centered",
            "targets": [2,4,5,10,11]
        },
        {
            "className": "centered",
            "width": "13%",
            "targets": [6]
        },
        {
            "className": "crematoriumID",
            "targets": 12,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className" : "assistanceID",
            "targets": 13,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className" : "room",
            "targets": 14,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets": 15,
            "render": function(data){
                return data == null || parseInt(data) == 0 ? 'No' : 'Sí'
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 17,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered",
            "targets": 18,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render" : function(data, type, row){
                if(data[25] == '0'){
                    if(userTypeForDeleteCheck == 1 || userTypeForDeleteCheck == '1'){
                        return "<ul class='actions-menu'><li class=''><a href='javascript:void(0)' class='btn-delete removeClick' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                    }else{
                        return "-"
                    }
                }else{
                    return "-"
                }
            }
        },
        {
            "className" : "details-control centered assistance btn-assistance",
            "targets" : 19,
            "orderable" : false,
            "searchable" : false,
            "width" : "4%",
            "data" : null,
            "render" : function(data, type, row){
                if(row[23] == '0'){
                    if(data[13] != null){
                        return "<ul class='actions-menu'><li><a class='' title='Editar Asistencia'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                    }else{
                        return "<ul class='actions-menu'><li><a class='' title='Crear Asistencia'><i class='fa fa-plus-circle' aria-hidden='true'></i></a></li></ul>"
                    }
                }else{
                    return '-'
                }
            }
        },
        {
            "className" : "details-control centered",
            "targets" : 24,
            "orderable" : false,
            "searchable" : false,
            "width" : "6%",
            "data" : null,
            "render" : function(data, type, row){
                if(data[24] != null){
                    return "<span class='stars cursor-pointer btn-survey' title='Ver respuestas'>"+parseFloat(data[24])+"</span>"
                }else{
                    return "-"
                }
            }
        }],
        "rowCallback": function(row, data, index){
            switch(data[9]){
                case '1':
                    $(row).find('td').css('background-color', '#cfdef4')
                break
                case '2':
                    $(row).find('td').css('background-color', '#cdeeb7')
                break
                case '3':
                    $(row).find('td').css('background-color', '#d3d2d2')
                break
            }
        },
        "drawCallback": function( settings ) {
            $('span.stars').stars();
        },
        "initComplete": function(settings, json){
            $('span.stars').stars();
        },
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                search: 'applied',
                order: 'applied'
            },
            filename: 'expedientes',
            title: 'Expedientes',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                search: 'applied',
                order: 'applied'
            },
            filename: 'expedientes',
            title: 'Expedientes',
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content.splice(0, 1)
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de expedientes',
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
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[9, 'asc'], [20, 'desc'], [16, 'desc']]
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });
    
    //Acciones para filtrar 
    $('.death-label').click(function(){
        $("#typeShowFilter").val(1).trigger('change');
        $("#typeShowFilter").attr("disabled", true)
        expedientType = 1
    });
    $('.budget-label').click(function(){
        $("#typeShowFilter").val(2).trigger('change');
        $("#typeShowFilter").attr("disabled", true)
        expedientType = 2
    });
    $('.various-label').click(function(){
        $("#typeShowFilter").val(3).trigger('change');
        $("#typeShowFilter").attr("disabled", true)
        expedientType = 3
    });
    $('.all-label').click(function(){
        $("#typeShowFilter").val(null).trigger('change');
        $("#typeShowFilter").attr("disabled", false)
        expedientType = 0
    });

    $(".change-select-filter").change(function(){
        reloadExpedientTable();
    })

    $("#clearTopFilters").click(function(){
        $('#searchInTableFilter').val('');
        $("#from").val('');
        $("#to").val('');

        setTimeout(() => {
            reloadExpedientTable();
        }, 25);
    })

    $("#showFiltersButton").click(function(){
        if($(".expedients-filters").hasClass('hide')){
            $(".expedients-filters").removeClass('hide');

            $("#showFiltersButton").text('OCULTAR FILTROS');
        }else{
            $(".expedients-filters").addClass('hide');

            $(".change-select-filter").val(null).trigger('change')

            $("#showFiltersButton").text('VER MÁS FILTROS');
        }
    })

    $('#searchInTableFilter').keypress(function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which)
        if(keycode == '13'){
            $('#searchInTable').click();
        }
    })

    $("#searchInTableFilter").change(function(){
        if($(this).val() == ''){
            reloadExpedientTable();
        }
    })
        
    //Acciones para seleccionar filas del expediente
    table.on('click', 'tbody tr', function (){
        $(this).toggleClass('selected');

        var items = 0;
        table.rows('.selected').every( function ( rowIdx, tableLoop, rowLoop ) {
            items++;
        })

        if(items > 0){
            $('.gen-invoice .btn-info').attr("disabled", false)
        }else{
            $('.gen-invoice .btn-info').attr("disabled", true)
        }
    });

    $('.state-filter .btn-primary').on('click', function(){
        table.rows('.selected').every( function ( rowIdx, tableLoop, rowLoop ) {
            var data = this.data();
            var expedientID = data[0];
            var status = $('#stateFilter').val();
            //Enviamos y procesamos la solicitud para actualizar el valor en la tabla de expedientes
            $.post(uri+"core/expedients/expedient/functions.php",{ expedientID: expedientID, status: status, type: 'setStatusExpedient'}, function() {
                $('#searchField').val("");
                table.columns().search("").draw();
                table.ajax.reload();
            });
        });
    });

    $('.gen-invoice .btn-info').on('click', function(){
        var status = false;
        var date = 0;
        table.rows('.selected').every( function ( rowIdx, tableLoop, rowLoop ) {
            var data = this.data();
            if(data[7] == '4'){
                status = true;;
            }
            if(moment(data[3],'YYYY-MM-DD').format('X') > date){
                date = moment(data[3],'YYYY-MM-DD').format('X');
            }
        });

        if(status){
            $('#modal-warning-invoice').modal('show');
        }else{
            //Mostramos la modal
            if(date == 0){
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = dd + '/' + mm + '/' + yyyy;
                $('#modal-gen-invoice #date').val(today)
            }else{
                $('#modal-gen-invoice #date').val( moment(date,'X').format('DD/MM/YYYY') )
            }
            $('#modal-gen-invoice #withLogo').prop("checked", true)
            $('#modal-gen-invoice #paymentMethod').trigger('change')
            $('#modal-gen-invoice').modal('show');
        }
    });

    // Nuevo
    $('#saveNewTPV').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewTPV #name'))){
            validate++;
        }
        
        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create        
            var name = $('#formNewTPV #name').val()        
            
            $.post(uri + "core/expenses/configuration/createTPV.php", {name:name}, function(data){
                if(JSON.parse(data)){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El TPV se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            })

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            // Refresco del datatable
            getTPVs();
            
            // Ocultamos la ventana modal
            $('#modal-new-tpv').modal('hide')
        }else{
            $('#modal-new-tpv #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-tpv #warning-message').empty()
            }, 3500)
        }
    })

    var factura;
    var paymentMethod;
    var comments;
    var accountNumber;
    $('#saveInvoice').click(function(){
        var clientContado = null;
        switch(COMPANY){
            case 1:
            case 3:
                clientContado = '1116';
            break;
            case 2:
                clientContado = '573';
            break;
            case 4:
                clientContado = '22';
            break;
            case 5:
                clientContado = '24';
            break;
            case 27:
                clientContado = '1058';
            break;
            default:
                clientContado = '1';
            break;
        }

        var invoicesNotGenerated = '';
        $("#modal-warning-cash-customer #expedientsNotGenerated").empty();
        table.rows('.selected').every( function ( rowIdx, tableLoop, rowLoop ) {
            var data = this.data();
            let expedientID = data[0];
            
            //Validaciones       
            var validate = 0
            
            if(isEmpty($("#formNewInvoice #paymentMethod"))){
                validate++
            }

            if(isEmpty($("#formNewInvoice #date"))){
                validate++
            }
            
            if($("#formNewInvoice #paymentMethod").val() == 'Transferencia'){
                if(isEmpty($("#formNewInvoice #accountNumber"))){
                    validate++
                }
            }
            if($("#formNewInvoice #paymentMethod").val() == 'Tarjeta'){
                if(isEmpty($("#formNewInvoice #tpv"))){
                    validate++
                }
            }
            //Si las validaciones han resultado satisfactorias
            if(validate == 0){
                
                paymentMethod = $('#paymentMethod').val();
                date = moment($('#formNewInvoice #date').val(), 'DD/MM/YYYY').format('X');
                comments = $('#comments').val();
                switch($('#paymentMethod').val()){
                    case 'Tarjeta':
                        accountNumber = $('#tpv').val();             
                    break
                    case 'Transferencia':
                        accountNumber = $('#accountNumber').val();
                    break
                    default:
                        accountNumber = '';
                    break
                }

                $.ajax({
                    url: uri + "core/expedients/docs/functions.php",
                    data: {service: expedientID, type: "getFactura"},
                    type: 'POST',
                    async: false,
                    success: function (data){                    
                        factura = $.parseJSON(data);
                    }
                });

                var listIvas = [];
                var supplied = 0;
                var totalDiscount = 0;
                var total = 0;

                if(factura.factura != null){
                    factura.factura.forEach(function(elem){

                        var priceNoIVA = parseFloat(elem.priceNoIVA).toFixed(2)
                        var percentage = parseFloat(elem.percentage).toFixed(2)
                        if(elem.texts == 0){
                            var amount = parseInt(elem.amount)
                            var discount = parseFloat(elem.discount).toFixed(2)
                        }else{
                            var amount = 1
                            var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                        }
                        var subTotalDiscount = parseFloat(priceNoIVA) * parseFloat(discount) / 100
                        var subTotalPrice = (parseFloat(priceNoIVA) - parseFloat(subTotalDiscount)) * amount

                        // Get ivas
                        var indexAux = listIvas.findIndex(p => p.type_iva == percentage);
                        if(indexAux === -1){
                            listIvas.push(
                                {
                                    'type_iva': percentage,
                                    'base': parseFloat(subTotalPrice),
                                    'iva': (parseFloat(subTotalPrice) * parseFloat(percentage) / 100)
                                }
                            )
                        }else{
                            listIvas[indexAux]['base'] += parseFloat(subTotalPrice);
                            listIvas[indexAux]['iva'] += (parseFloat(subTotalPrice) * parseFloat(percentage) / 100);
                        }
                    })
                }

                if(factura.suplidos != null){
                    factura.suplidos.forEach(function(elem){
                        var cost = parseFloat(elem.cost).toFixed(2)

                        if(elem.texts == 0){
                            var amount = parseInt(elem.amount)
                            var discount = parseFloat(elem.discount).toFixed(2)

                            var subTotal = parseFloat((parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)) * parseInt(amount)).toFixed(2)
                        }else{
                            var discount = parseFloat(elem.multipleDiscount).toFixed(2)
                            
                            var subTotal = parseFloat(parseFloat(cost) - (parseFloat(cost) * parseFloat(discount) / 100)).toFixed(2)
                        }

                        totalDiscount = parseFloat(parseFloat(totalDiscount) + parseFloat(discount)).toFixed(2)
                        supplied = parseFloat(parseFloat(supplied) + parseFloat(subTotal)).toFixed(2)
                    })
                }

                // Calculate total
                var bruto = parseFloat(supplied);
                var total = parseFloat(supplied);
                var totalIva = 0;
                $.each(listIvas, function(index, elem){
                    total += parseFloat(elem['base']) + parseFloat(elem['iva']);
                    bruto += parseFloat(elem['base']);
                    totalIva += parseFloat(elem['iva']);

                    listIvas[index]['base'] = parseFloat(elem['base']).toFixed(2);
                    listIvas[index]['iva'] = parseFloat(elem['iva']).toFixed(2);
                })
                total = parseFloat(total).toFixed(2);
                bruto = parseFloat(bruto).toFixed(2);
                totalIva = parseFloat(totalIva).toFixed(2);

                // If total is not equal to iva + bruto, recalculate bruto
                if(parseFloat(total) != (parseFloat(totalIva) + parseFloat(bruto))){
                    bruto = parseFloat(total) - parseFloat(totalIva);
                }
                
                if(clientContado == factura.clientID && parseFloat(total) > 400){
                    invoicesNotGenerated += ' <li><strong>Expediente</strong> '+factura.number+' | <strong>Total: </strong> '+total+' €</li>';
                }else{

                    var invoiceInfo = null;
                    $.ajax({
                        url: uri + "core/invoices/create.php",
                        data: {
                            expedient: expedientID, 
                            paymentMethod: paymentMethod, 
                            date: date, 
                            bruto: bruto, 
                            supplieds: supplied, 
                            listIvas: listIvas, 
                            total: total, 
                            comments: comments, 
                            accountNumber: accountNumber
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){
                            invoiceInfo = $.parseJSON(data)
                        }
                    });

                    var text;
                    $.ajax({
                        url: uri + "core/libraries/pdfs/getPdfs.php",
                        data: {
                            expedient: expedientID, 
                            doc: 'factura-logo', 
                            logo: 1, 
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){
                            text = data;
                        }
                    });

                    $.ajax({
                        url: uri + "core/libraries/pdfs/process.php",
                        data: {
                            doc: 'factura-logo', 
                            text: text, 
                            expedientID: expedientID, 
                            invoiceID: invoiceInfo['invoiceID'], 
                            invoiceName: invoiceInfo['invoiceNumber']
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    });

                    var text;
                    $.ajax({
                        url: uri + "core/libraries/pdfs/getPdfs.php",
                        data: {
                            expedient: expedientID, 
                            doc: 'factura-logo', 
                            logo: 0, 
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){
                            text = data;
                        }
                    });

                    $.ajax({
                        url: uri + "core/libraries/pdfs/process.php",
                        data: {
                            doc: 'factura-logo', 
                            text: text, 
                            expedientID: expedientID, 
                            invoiceID: invoiceInfo['invoiceID'], 
                            invoiceName: invoiceInfo['invoiceNumber'] +'_no-logo'
                        },
                        type: 'POST',
                        async: false,
                        success: function (data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La factura ha sido creado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    });
    
                    $('#modal-gen-invoice').modal('hide');
                    $('#view-Fac').removeClass( "hide" );
                }
            }
        });

        table.ajax.reload();

        if(invoicesNotGenerated != ''){
            $('#modal-gen-invoice').modal('hide');
            $("#modal-warning-cash-customer #expedientsNotGenerated").append(invoicesNotGenerated);

            $("#modal-warning-cash-customer").modal("show");
        }
    })
    
    //Edit. Acciones datatatable
    table.on('click', 'tbody .editClick', function(){
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        var filtersActivated = false;
        if($("#from").val() != '' || $("#to").val() != '' || $("#stateShowFilter").val() != '' || $("#input-search").val() != ''){
            filtersActivated = true;
        }

        //Redireccionamos a la vista de editar el expediente
        if(parseInt(table.row(this).data()[23]) == 1){
            if(filtersActivated){
                window.open(uri+'editar-expediente-tpv/'+rowClick[0], '_blank');
            }else{
                window.location.href = uri+'editar-expediente-tpv/'+rowClick[0];
            }
        }else{
            if(filtersActivated){
                window.open(uri+'editar-expediente/'+rowClick[0], '_blank');
            }else{
                window.location.href = uri+'editar-expediente/'+rowClick[0];
            }
        }
    });

    //Delete. Eliminamos un expediente
    table.on('click', 'tbody .removeClick', function(){
        if(userTypeForDeleteCheck == 1 || userTypeForDeleteCheck == '1'){
            //Tras hacer click ocultamos el tooltip informativo
            $('.btn-delete').tooltip('hide');

            var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
            
            var expedientID = rowClick[0]
            var expedientNumber = rowClick[1]
    
            if(confirm("¿Está seguro de que quiere borrar el expediente " + expedientNumber + "?")){
                $.post(uri+"core/expedients/expedient/delete.php", {expedientID: expedientID, ID: expedientID}, function(response){
                    response = $.parseJSON(response)
                    if(Array.isArray(response)){
                        if(response[0]){
                            if(response[1] === 'has_invoice'){
                                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se puede borrar el expediente porque tiene una factura generada.</div>');
                            }else{
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente se ha eliminado con éxito.</div>');
                            }
                            
                            table.ajax.reload();
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                    }
    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                });
            }
        }else{
            alert('No tienes permiso para eliminar el expediente!')
        }
    });
    
    // Asistencia. Acciones datatatable
    table.on('click', '.btn-assistance', function(){

        if(table.row(this).data()[22] != null && table.row(this).data()[22] != '' && parseInt(table.row(this).data()[22]) > 0){
            return false
        }

        $('.btn-assistance').tooltip('hide');
        var assistance = 0;
        var expedient = 0;
        assistance = table.row(this).data()[13]
        expedient = table.row(this).data()[0]
        expedientNumber = table.row(this).data()[1]

        var filtersActivated = false;
        if($("#from").val() != '' || $("#to").val() != '' || $("#stateShowFilter").val() != '' || $("#input-search").val() != ''){
            filtersActivated = true;
        }

        // Asistencias
        if(assistance == null){
            // Se crea la asistencia y se envía a la vista de edición
            $.post(uri + "core/assistances/create.php", {expedient : expedient}, function(data){
                data = $.parseJSON(data)
                if(data != "null"){
                    if(filtersActivated){
                        window.open(uri + 'asistencias/editar/' + data, '_blank');
                    }else{
                        window.location.href = uri + 'asistencias/editar/' + data;
                    }
                }
            })
        }else{
            // Se envía a la vista de edición
            if(filtersActivated){
                window.open(uri + 'asistencias/editar/' + assistance, '_blank');
            }else{
                window.location.href = uri + 'asistencias/editar/' + assistance;
            }
        }
    });

    //Go to survey results. Acciones datatatable
    table.on('click', 'tbody .btn-survey', function(){
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        //Redireccionamos a la vista de ver resultados de la encuesta

        var filtersActivated = false;
        if($("#from").val() != '' || $("#to").val() != '' || $("#stateShowFilter").val() != '' || $("#input-search").val() != ''){
            filtersActivated = true;
        }
        window.open(uri+'expediente/encuesta-satisfaccion/'+rowClick[0], '_blank');
    });

    // Filter dates
    $('#searchDates').click(function(){
        var validate = 0

        if(isEmpty($('#from'))){
            validate++
        }
        if(isEmpty($('#to'))){
            validate++
        }

        if(validate == 0){
            from = moment($('#from').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
            to = moment($('#to').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')

            if(from > to){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La fecha desde tiene que ser menor que la fecha hasta</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 3500)
                
                return false
            }

            reloadExpedientTable();
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty()
            }, 3500)
        }
    })
});

function reloadExpedientTable(){
    
    var fromParam = null;
    if($('#from').val() != ''){
        fromParam = moment($('#from').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
    var toParam = null;
    if($('#to').val() != ''){
        toParam = moment($('#to').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    var yearParam = $('#yearShowFilter').val();
    var expedientTypeParam = $('#typeShowFilter').val();
    var statusParam = $('#stateShowFilter').val();
    var covidShowFilterParam = $('#covidShowFilter').val();
    var tanatologicalPracticeFilterParam = $('#tanatologicalPracticeShowFilter').val();
    var searchInTableFilterParam = $('#searchInTableFilter').val();

    var numParams = 0;

    var uriLoadTable = uri + 'core/expedients/expedient/list.php';
    if(yearParam != null && yearParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }
        uriLoadTable +='year=' + yearParam;
    }
    if(expedientTypeParam != null && expedientTypeParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='type=' + expedientTypeParam;
    }
    if(statusParam != null && statusParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='status=' + statusParam;
    }
    if(fromParam != null && fromParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='from=' + fromParam;
    }
    if(toParam != null && toParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='to=' + toParam;
    }
    if(covidShowFilterParam != null && covidShowFilterParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='covid=' + covidShowFilterParam;
    }
    if(tanatologicalPracticeFilterParam != null && tanatologicalPracticeFilterParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='tanatological=' + tanatologicalPracticeFilterParam;
    }
    if(searchInTableFilterParam != null && searchInTableFilterParam != ''){
        if(numParams == 0){
            uriLoadTable += '?';
            numParams++;
        }else{
            uriLoadTable += '&';
        }
        uriLoadTable +='search-table=' + searchInTableFilterParam;
    }

    table.ajax.url(uriLoadTable).load()

}

function getBankAccounts(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {type : 'listBankAccounts'},
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#accountNumber').empty()
                $.each(data, function(index, elem){
                    if(elem.bank == null){
                        bank = ''
                    }else{
                        bank = elem.bank
                    }
                    $('#accountNumber').append('<option value="'+ bank +' - ' + elem.number + '">' + elem.alias + '</option>')
                })
            }
        }
    })
}

function getTPVs(){
    $.ajax({
        url : uri + 'core/expenses/configuration/functions.php',
        method : 'POST',
        data : {
            type : 'listTPVs'
        },
        success : function(data){                
            data = $.parseJSON(data)
            if(data != null){
                $('#tpv').empty()
                $('#tpv').append('<option value="">-</option>')
                $.each(data, function(index, elem){
                    $('#tpv').append('<option value="'+ elem.id + '">' + elem.text + '</option>')
                })
            }
        }
    })
}

// Comprueba si existe una factura para el expediente dado
function existInvoice(expedient){
    var invoice;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {expedient: expedient, type: "exist"},
        type: 'POST',
        async: false,
        success: function (data){
            invoice = $.parseJSON(data)           
        }
    });

    return invoice;
}

// Comprueba si existe una factura para el expediente dado
function getInvoiceDate(expedient){
    var invoice;
    $.ajax({
        url: uri + "core/invoices/functions.php",
        data: {expedient: expedient, type: "getInvoiceDate"},
        type: 'POST',
        async: false,
        success: function (data){
            invoice = $.parseJSON(data)           
        }
    });

    return invoice;
}