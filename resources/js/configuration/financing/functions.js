function formatData(data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>'
    return data
}

function getFinancing(financingID) {
    var financing
    $.ajax({
        url: uri + "core/financing/functions.php",
        data: {opt: 'read', ID: financingID},
        type: 'POST',
        async: false,
        success: function (data) {            
            financing = $.parseJSON(data);
        }
    });
    return financing;
}

function getCuotas(financingID) {
    var cuotas
    $.ajax({
        url: uri + "core/financing/functions.php",
        data: {opt: 'getCuotas', ID: financingID},
        type: 'POST',
        async: false,
        success: function (data) {
            if(data){
                cuotas = $.parseJSON(data);
            }
        }
    });
    return cuotas;
}

/* Inicializando eventos externos
-----------------------------------------------------------------*/
function ini_events(ele) {
    ele.each(function () {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
        zIndex: 1070,
        revert: true, // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
        });

    });
}

// -------------------------------------------------------------------------------------
//Carga los datos del modal cuotas 
var pendingCapitalModal = 0
function loadCuotasModal(financing) {    
    $('#formViewCuotas #financingID').val(financing.ID);
    $('#formViewCuotas #destination').val(financing.destinationName);
    switch (financing.type) {
        case '0':
            $('#formViewCuotas #type').val('Crédito hipotecario');
        break;
        case '1':
            $('#formViewCuotas #type').val('Préstamo personal');
        break;
        case '2':
            $('#formViewCuotas #type').val('Leasing');
        break;
        case '3':
            $('#formViewCuotas #type').val('Renting');
        break;
    }
    $('#formViewCuotas #providerEntity').val(financing.providerEntity);
    $('#formViewCuotas #initialCapital').val(parseFloat(financing.initialCapital).toFixed(2) + ' €');
    $('#formViewCuotas #amortizedCapital').val(parseFloat(financing.amortizedCapital).toFixed(2) + ' €');
    if(financing.interestType == 0){
        $('#formViewCuotas #interestType').val('Fijo');
    }else{
        $('#formViewCuotas #interestType').val('Variable');
    }
    $('#formViewCuotas #interest').val(financing.interest + ' %');
    $('#formViewCuotas #financeCenter').val(financing.financeCenterName);
    $('#formViewCuotas #openingCommission').val(financing.openingCommission + ' %');
    $('#formViewCuotas #amortizationCommission').val(financing.amortizationCommission + ' %');
    $('#formViewCuotas #closeCommission').val(financing.closeCommission + ' %');
    $('#formViewCuotas #pendingCapital').val(parseFloat(financing.pendingCapital).toFixed(2) + ' €');
    pendingCapitalModal = parseFloat(financing.pendingCapital).toFixed(2)
    $('#formViewCuotas #comments').val(financing.comments);

    var currentYear = $('#years').val()

 
    //Datatables. Inicialización y configuración de las opciones del plugin
    tableCuotas = $('#formViewCuotas #datatableCuotas').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/financing/listCuotas.php?financingID=" + financing.ID + "&year=" + currentYear,
        "responsive": false,
        "autoWidth": true,
        "paging": false,
        "searching": false,
        "destroy": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "ID"},
            {"title": "financing"},
            {"title": "Cuota"},
            {"title": "Inicio"},
            {"title": "Fin"},
            {"title": "Pago"},
            {"title": "Interés"},
            {"title": "Amortización"},
            {"title": "Pendiente"},
            {"title": "Pagar"},
            {"title": "Fecha pago"},
            {"title": "Amortiz. manual"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0
        },
        {
            "targets": [0, 1],
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered index",
            "targets": 2,
            "render" : function(data, type, row, meta){
                return parseInt(meta.row) + 1;
            }
        },
        {
            "className": "centered pay",
            "targets": [5, 6, 7, 8],
            "render" : function(data, type, row, meta){
                return parseFloat(data).toFixed(2) + ' €';
            }
        },            
        {
            "className": "centered",
            "targets": [3, 4, 10],            
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }        
        },
        {
            "className": "centered",
            "targets": 9,
            "render" : function(data, type, row, meta){
                var result = 0;
                
                if(data == null){
                    result = '<input type="checkbox" id="check' + row[0] + '">';
                }else{
                    result = '<input type="checkbox" id="check' + row[0] + '" checked disabled>';
                }
                return result;
            }
        },
        {
            "className": "centered pay",
            "targets": 11,
            "render" : function(data, type, row, meta){
                var ret = data != null ? parseFloat(data).toFixed(2) + ' €' : '-'
                return ret;
            }
        }, 
        ],
        "order": [[3, 'asc']],
        "dom": 'rt<"bottom bottom-2"p><"clear">',
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
    
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
    
            // computing column Total of the complete result 
            var initialCapital = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return parseFloat(intVal(a) + intVal(b));
                }, 0 );                
            // computing column Total of the complete result 
            var interest = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return parseFloat(intVal(a) + intVal(b));
                }, 0 );                
            // computing column Total of the complete result 
            var amortization = api
                .column( 7 )
                .data()
                .reduce( function (a, b) {
                    return parseFloat(intVal(a) + intVal(b));
                }, 0 );                
            // computing column Total of the complete result 
            var amortizationExtra = api
                .column( 11 )
                .data()
                .reduce( function (a, b) {
                    return parseFloat(intVal(a) + intVal(b));
                }, 0 );                
            
                
            // Update footer by showing the total with the reference of the column index 
            $(api.column(2).footer()).html('Total');
            $(api.column(5).footer()).html(parseFloat(initialCapital).toFixed(2) + " €");
            $(api.column(6).footer()).html(parseFloat(interest).toFixed(2) + " €");
            $(api.column(7).footer()).html(parseFloat(amortization).toFixed(2) + " €");
            $(api.column(11).footer()).html(parseFloat(amortizationExtra).toFixed(2) + " €");
        },
    });

    return tableCuotas;
}
//---------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="block-message"></div>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    changeSpaceFooter()
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
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    var tableCuotas = 0;

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/financing/listDatatables.php",
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
        "scrollY":  '620px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "ID"},
            {"title": "Finan."},
            {"title": "Ent. prestadora"},
            {"title": "Destino"},
            {"title": "Inicio"},
            {"title": "Fin"},
            {"title": "Plazos"},
            {"title": "Pendietes"},
            {"title": "Capital"},
            {"title": "Inicial"},
            {"title": "Amortizado"},
            {"title": "Pendiente"},
            {"title": "Método"},
            {"title": "Centro financiado"},
            {"title": "Cuotas"},
            {"title": "Editar"},
            {"title": "Borrar"},
            {"title": "PDF"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0],
            "searchable": false,
            "visible": false
        },
        {
            "className": "viewClick text-center",
            "targets": [1,2,3,4,5,6,7,8,9,10,11,12,13]
        },             
        {
            "targets": [4, 5],            
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets": [8, 9, 10, 11],
            "render" : function(data){
                return parseFloat(data).toFixed(2) + " €";
            }
        },
        {
            "className": "details-control viewClick text-center",
            "targets": 14,
            "searchable": false,
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-view'  title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": " details-control editClick text-center",
            "targets": 15,
            "searchable": false,
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control removeClick text-center",
            "targets": 16,
            "searchable": false,
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": " details-control pdfClick text-center",
            "targets": 17,
            "searchable": false,
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-pdf'  title='Ver PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                search: 'applied',
                order: 'applied'
            },
            filename: 'financiaciones',
            title: 'Financiaciones',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                search: 'applied',
                order: 'applied'
            },
            filename: 'financiaciones',
            title: 'Financiaciones',
            customize: function(doc){
                doc.content.splice(0, 1)

                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10

                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Listado de financiaciones',
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
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'desc']]
    });

    var financingIDD;
    table.on('click', 'tbody .viewClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-view').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()   
        var financing = getFinancing(rowClick[0]);
        financingIDD = rowClick[0];
        var start = moment(financing.startDate, 'X').format('Y')
        var end = moment(financing.endDate, 'X').format('Y')

        $('#years').empty()
        for(var year = start; year <= end; year++){
            $('#years').append('<option value="' + year + '">' + year + '</option>')
        }

        tableCuotas = loadCuotasModal(financing);
        
        $('#modal-cuotas-financing').modal('show');

    });

    $('#modal-cuotas-financing #years').change(function(){
        var financing = getFinancing(financingIDD);
        tableCuotas = loadCuotasModal(financing);
    })


    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()   
        $('#formEditFinancing #financingID').val(rowClick[0]);

        var financing = getFinancing(rowClick[0]);        

        var newOption = new Option(financing.destinationName, financing.destination, true, true);
        $('#formEditFinancing #destination').append(newOption).trigger('change');
        newOption = new Option(financing.payMethodName, financing.payMethod, true, true);
        $('#formEditFinancing #payMethod').append(newOption).trigger('change');
        newOption = new Option(financing.financeCenterName, financing.financeCenter, true, true);
        $('#formEditFinancing #financeCenter').append(newOption).trigger('change');
        
        $('#formEditFinancing #amortization').val(parseFloat(financing.amortization).toFixed(2) + ' €');
        $('#formEditFinancing #initialCapital').val(parseFloat(financing.initialCapital).toFixed(2) + ' €');
        $('#formEditFinancing #type').val(financing.type);
        $('#formEditFinancing #providerEntity').val(financing.providerEntity);
        $('#formEditFinancing #startDate').val(moment(financing.startDate, "X").format("DD/MM/YYYY"));
        $('#formEditFinancing #endDate').val(moment(financing.endDate, "X").format("DD/MM/YYYY"));
        $('#formEditFinancing #term').val(financing.term);
        $('#formEditFinancing #interest').val(financing.interest);
        $('#formEditFinancing #interestType').val(financing.interestType).trigger('change');
        $('#formEditFinancing #openingCommission').val(financing.openingCommission + ' %');
        $('#formEditFinancing #amortizationCommission').val(financing.amortizationCommission + ' %');
        $('#formEditFinancing #closeCommission').val(financing.closeCommission + ' %');
        $('#formEditFinancing #amortizedCapital').val(parseFloat(financing.amortizedCapital).toFixed(2) + ' €');
        $('#formEditFinancing #pendingCapital').val(parseFloat(financing.pendingCapital).toFixed(2) + ' €');
        $('#formEditFinancing #pendingFee').val(financing.pendingFee);
        $('#formEditFinancing #payFeeDate').val(moment(financing.payFeeDate, "X").format("DD/MM/YYYY"));
        $('#formEditFinancing #comments').val(financing.comments);
        $('#formEditFinancing #diferencial').val(financing.diferencial);
        $('#formEditFinancing #euribor').val(financing.euribor);

        $('#modal-edit-financing').modal('show');
    });

    table.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()   

        if(confirm("¿Está seguro de que quiere borrar la financiación?")){
            $.ajax({
                url: uri + "core/financing/functions.php",
                data: {opt: 'delete', ID: rowClick[0]},
                type: 'POST',
                async: false,
                success: function (data) {
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La financiación ha sido eliminada con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha apodido borrar la financiación.</div>');
                    }
                    table.ajax.reload();
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });
        }
    });

    table.on('click', 'tbody .pdfClick', function(){
        $('.btn-pdf').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()   
        
        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'financiacion', text: text, service: rowClick[0], data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'financiacion', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/financiacion.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
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

    // Carga las entidades de destino
    $('.destination').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/financing/dataDestinations.php',
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

    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });

    // Evento "change" de la cantidad
    $("#formNewFinancing #interestType").change(function () {
        if($('#formNewFinancing #interestType').val() == 0){
            $('#formNewFinancing #variableRow').addClass('hide');
        }else{
            $('#formNewFinancing #variableRow').removeClass('hide');
        }
    });
    // Evento "change" de la cantidad
    $("#formEditFinancing #interestType").change(function () {
        if($('#formEditFinancing #interestType').val() == 0){
            $('#formEditFinancing #variableRow').addClass('hide');
        }else{
            $('#formEditFinancing #variableRow').removeClass('hide');
        }
    });
    
    $('.payMethod').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/financing/dataPayMethods.php',
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

    $('.financeCenter').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/financing/dataFinanceCenters.php',
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

    ini_events($('#external-events div.external-event'));

    $('#calendar').fullCalendar({        
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        lang: 'es',
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        //Datos
        eventSources: uri + 'core/financing/calendar.php',
        eventTextColor: '#F0F0F0',
        eventRender: function(calEvent, elem, view){
            switch(calEvent.type){
                case '0':
                    var type = 'Crédito - '
                    break

                case '1':
                    var type = 'Préstamo - '
                    break

                case '2':
                    var type = 'Leasing - '
                    break

                case '3':
                    var type = 'Renting - '
                    break
                case '4':
                    var type = calEvent.statusName + ' - '
                    break
            }
            switch(view.type){
                case 'month':
                    elem.find('.fc-title').html(' - ' + type  + calEvent.title)                    
                    break
                case 'agendaWeek':
                case 'agendaDay':
                   elem.find('.fc-content').append(type + calEvent.title)                   
                    break
            }
        },
        eventClick: function(calEvent, jsEvent, view) {

            if(calEvent.eventype == 1){
                var invoiceYear = moment(calEvent.item_date_search, 'X').format('YYYY');
                var invoiceMonth = parseInt(moment(calEvent.item_date_search, 'X').format('MM'));
            
                window.open(uri + 'salidas/facturas-recibidas?year='+ invoiceYear + '&month=' + invoiceMonth + '&number=' + calEvent.item_search + '&date=' + calEvent.item_date_search, '_blank');
            }
            return false
        },
        editable: false,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            copiedEventObject.backgroundColor = $(this).css("background-color");
            copiedEventObject.borderColor = $(this).css("border-color");
         
            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
        },
        lazyFetching : true
    });

    $('#saveNewFinancing').click(function(){
        var validate = true
        var destination = $('#formNewFinancing #destination').val();
        var type = $('#formNewFinancing #type').val();
        var providerEntity = $('#formNewFinancing #providerEntity').val();;
        var startDate = moment($('#formNewFinancing #startDate').val(), "DD-MM-YYYY").format("X");
        var term = $('#formNewFinancing #term').val();
        var interest = $('#formNewFinancing #interest').val();
        var interestType = $('#formNewFinancing #interestType').val();
        var diferencial = $('#formNewFinancing #diferencial').val();
        var euribor = $('#formNewFinancing #euribor').val();
        var initialCapital = $('#formNewFinancing #initialCapital').val();
        var amortization = $('#formNewFinancing #amortization').val();
        var openingCommission = $('#formNewFinancing #openingCommission').val();
        var closeCommission = $('#formNewFinancing #closeCommission').val();
        var amortizationCommission = $('#formNewFinancing #amortizationCommission').val();
        var pendingFee = $('#formNewFinancing #term').val();
        var payMethod = $('#formNewFinancing #payMethod').val();
        var financeCenter = $('#formNewFinancing #financeCenter').val();
        var comments = $('#formNewFinancing #comments').val();

        if(isEmpty($("#formNewFinancing #destination"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #type"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #providerEntity"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #startDate"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #term"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #initialCapital"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #openingCommission"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #closeCommission"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #amortizationCommission"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #pendingFee"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #interestType"))){
            validate = false;
        }
        if($("#formNewFinancing #interestType").val() == 0){
            if(isEmpty($("#formNewFinancing #interest"))){
                validate = false;
            }
        }else{
            if(isEmpty($("#formNewFinancing #diferencial"))){
                validate = false;
            }
            if(isEmpty($("#formNewFinancing #euribor"))){
                validate = false;
            }
        }
        if(isEmpty($("#formNewFinancing #payMethod"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #financeCenter"))){
            validate = false;
        }
        if(isEmpty($("#formNewFinancing #comments"))){
            validate = false;
        }

        if(validate){
            $.ajax({
                url: uri + "core/financing/functions.php",
                data: {opt: 'create', destination: destination, type: type, providerEntity: providerEntity, startDate: startDate, /*endDate: endDate, */term: term, 
                       initialCapital: initialCapital, amortization: amortization, openingCommission: openingCommission, closeCommission: closeCommission, amortizationCommission:amortizationCommission, pendingFee: pendingFee, interest: interest,
                       interestType: interestType, diferencial: diferencial, euribor: euribor, payMethod: payMethod, financeCenter: financeCenter, comments: comments},
                type: 'POST',
                async: false,
                success: function (data) {
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La financiación ha sido creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha apodido crear la financiación.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });
            $('#modal-new-financing').modal('hide');

            table.ajax.reload();
        }else{
            $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error de validación.</div>');
            
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    });

    $('#saveEditFinancing').click(function(){
        var validate = true
        var currentDate = moment().format("X")
        var financingID = $("#formEditFinancing #financingID").val();

        var destination = $('#formEditFinancing #destination').val();
        var type = $('#formEditFinancing #type').val();
        var startDate = moment($('#formEditFinancing #startDate').val(), "DD-MM-YYYY").format("X");
        var term = $('#formEditFinancing #term').val();
        var interest = $('#formEditFinancing #interest').val();
        var interestType = $('#formEditFinancing #interestType').val();
        var providerEntity = $('#formEditFinancing #providerEntity').val();
        var openingCommission = $('#formEditFinancing #openingCommission').val();
        var closeCommission = $('#formEditFinancing #closeCommission').val();
        var amortizationCommission = $('#formEditFinancing #amortizationCommission').val();
        var financeCenter = $('#formEditFinancing #financeCenter').val();
        var payMethod = $('#formEditFinancing #payMethod').val();
        var comments = $('#formEditFinancing #comments').val();
        var diferencial = $('#formEditFinancing #diferencial').val();
        var euribor = $('#formEditFinancing #euribor').val();

        if(isEmpty($("#formEditFinancing #destination"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #type"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #providerEntity"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #startDate"))){
            validate = false;
        }else{
            if(startDate < currentDate){
                validate = false;             
                $('#formEditFinancing #startDateError').text('La fecha de cargo debe ser posterior a la fecha actual')
                $('#formEditFinancing #startDateError').show()
            }
        }
        if(isEmpty($("#formEditFinancing #endDate"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #term"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #openingCommission"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #closeCommission"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #amortizationCommission"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #payMethod"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #financeCenter"))){
            validate = false;
        }
        if(isEmpty($("#formEditFinancing #comments"))){
            validate = false;
        }
        if($("#formEditFinancing #interestType").val() == 0){
            if(isEmpty($("#formEditFinancing #interest"))){
                validate = false;
            }
        }else{
            if(isEmpty($("#formEditFinancing #diferencial"))){
                validate = false;
            }
            if(isEmpty($("#formEditFinancing #euribor"))){
                validate = false;
            }
        }

        if(validate){
            $.ajax({
                url: uri + "core/financing/functions.php",
                data: {opt: 'update', ID: financingID, destination: destination, type: type, providerEntity: providerEntity, startDate: startDate, /*endDate: endDate, */term: term,
                       payMethod: payMethod, financeCenter: financeCenter, comments: comments, interest: interest, interestType: interestType, openingCommission: openingCommission, 
                       closeCommission: closeCommission, amortizationCommission:amortizationCommission, diferencial: diferencial, euribor: euribor},
                type: 'POST',
                async: false,
                success: function (data) {
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La financiación ha sido creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha apodido crear la financiación.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });
            $('#modal-edit-financing').modal('hide');

            table.ajax.reload();
        }else{
            $('#modal-edit-financing #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-financing #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveEditCuotas').click(function(){
        var checks = new Array();
        var financingID = $("#formViewCuotas #financingID").val();
        var data = tableCuotas.rows().data();
        var i = 1;
        data.each(function(elem) {
            var id = elem[0];
            var pay = elem[6];
            var payNoIVA = elem[8];
            var check = 0;
            if($('#formViewCuotas #check' + id).prop('checked')){
                check = 1;
            }

            checks.push([id, check, pay, payNoIVA, i]);
            i++;
        });

        $.ajax({
            url: uri + "core/financing/functions.php",
            data: {opt: 'updatePayments', checks: checks, financingID: financingID},
            type: 'POST',
            async: false,
            success: function (data) {
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La financiación ha sido creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha apodido crear la financiación.</div>');
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        });

        table.ajax.reload();
        $('#modal-cuotas-financing').modal('hide');
    });

    // ***************** AMORTIZAR ********************************
    $('#payAmortization').click(function(){
        var validate = true;
        if(isEmpty($("#modal-cuotas-financing #amortizationAmount"))){
            validate = false;
        }else{
            
            if(parseFloat($("#modal-cuotas-financing #amortizationAmount").val()) > pendingCapitalModal){                
                validate = false;
                $('#modal-cuotas-financing #amortizationAmountError').text('La amortización es mayor que el capital pendiente')
                $('#modal-cuotas-financing #amortizationAmountError').show()
            }

        }
       
        if(validate){
            var amortization = $('#modal-cuotas-financing #amortizationAmount').val()
            var financingID = $("#formViewCuotas #financingID").val();                                                
            var amortizationType = $("#formViewCuotas #amortizaionSelect").val();                                                

            $.ajax({
                url: uri + "core/financing/functions.php",
                data: {opt: 'repay', amortization : amortization, financingID : financingID, amortizationType : amortizationType},
                type: 'POST',
                async: false,
                success: function (data) {
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Amortización realizada con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha apodido crear la financiación.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            });

            tableCuotas.ajax.reload();
            table.ajax.reload();
        }else{
            $('#modal-cuotas-financing #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-cuotas-financing #warning-message').empty()
            }, 3500)
        }
    });
    
    $('#modal-edit-financing').on('hidden.bs.modal', function (e) {     
        $('#formEditFinancing #startDateError').text('')
        $('#formEditFinancing #startDateError').hide()
        $('#modal-cuotas-financing #amortizationAmountError').text('')
        $('#modal-cuotas-financing #amortizationAmountError').hide()
        $('#modal-edit-financing #warning-message').empty()
        $('#modal-cuotas-financing #warning-message').empty()
    });

    $('#modal-cuotas-financing').on('hidden.bs.modal', function (e) {  
        $('#modal-cuotas-financing #amortizationAmount').val('')
        $('#modal-cuotas-financing #amortizationAmountError').text('')
        $('#modal-cuotas-financing #amortizationAmountError').hide()
        $('#modal-cuotas-financing #warning-message').empty()
    });

    $('#modal-new-financing').on('hidden.bs.modal', function (e) {  
        $('#modal-new-financing #startDate').text('')
        $("#modal-new-financing #destination").val('').trigger('change');
        $('#modal-new-financing #type').val('');
        $('#modal-new-financing #providerEntity').val('');;
        $('#modal-new-financing #startDate').val('');        
        $('#modal-new-financing #term').val('');
        $('#modal-new-financing #interest').val('');
        $('#modal-new-financing #interestType').val('');
        $('#modal-new-financing #diferencial').val('');
        $('#modal-new-financing #euribor').val('');
        $('#modal-new-financing #diferencial').removeClass('show');
        $('#modal-new-financing #diferencial').addClass('hide');       
        $('#modal-new-financing #euribor').removeClass('show');
        $('#modal-new-financing #euribor').addClass('hide');       
        $('#modal-new-financing #initialCapital').val('');
        $('#modal-new-financing #amortization').val('');
        $('#modal-new-financing #openingCommission').val('');
        $('#modal-new-financing #closeCommission').val('');
        $('#modal-new-financing #amortizationCommission').val('');
        $('#modal-new-financing #term').val('');
        $('#modal-new-financing #payMethod').val('').trigger('change');
        $('#modal-new-financing #financeCenter').val('').trigger('change');
        $('#modal-new-financing #comments').val('');
        clean("formNewFinancing");
        $('#modal-new-financing #warning-message').empty()
    });
});