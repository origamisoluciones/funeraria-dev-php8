// Obtiene la fecha de la primera factura para un tanatorio propio
function getFirstOrderDate() {
    var date;
    $.ajax({
        url: uri + "core/warehouse/orders/functions.php",
        data: {type: 'getFirstOrderDate'},
        type: 'POST',
        async: false,
        success: function (data) {
            date = $.parseJSON(data);
        }
    });
    return date;
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

// FORMAT DATA SELECT2
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

$(window).bind("pageshow", function(){
    $.each($('form.form-inline'), function(){
        $(this).get(0).reset();
    })
});

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
    });

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

    var date = getFirstOrderDate();
    if(date != null){
        var year = moment($.parseJSON(date), "X").format("YYYY");
        var month = moment($.parseJSON(date), "X").format("MM");
    }else{
        var year = (new Date()).getFullYear();
    }
    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth() + 1;
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

    for (year; year <= currentYear+1; year++){
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
    var from = moment($('#year').val() + '-' + $('#month').val() + '-01', 'YYYY-MM-DD').format('X')
    var year = parseInt($('#year').val());
    var month = parseInt($('#month').val()) + 1;
    if(month == 13){
        month = 1;
        year ++;
    }
    var to = moment(year + '-' + month + '-01', 'YYYY-MM-DD').format('X')

    $('#year').change(function(){
        pdfType = "date";
        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        var month = parseInt($('#month').val()) + 1;
        var year = parseInt($('#year').val());

        if(month == 1){
            from = parseInt(new Date("01-01-" + $('#year').val()).getTime()) / 1000;
            to = parseInt(new Date( "12-01-" + year).getTime()) / 1000;
        }else{
            
            if(month == 13){
                month = 1;
                year ++;
            }
        
            from = parseInt(new Date($('#month').val() + "-01-" + $('#year').val()).getTime()) / 1000;
            to = parseInt(new Date(month + "-01-" + year).getTime()) / 1000;
        }

        
        table.ajax.url(uri + "core/warehouse/orders/listDatatables.php?type=" + $('#orderTypes').val() + "&agreement=" + $('#orderAgreement').val() + "&from=" + from + "&to=" + to).load();

        $('#trimester').val(0);
    })

    $('#month').change(function(){
        if($('#month').val() != 0){
            pdfType = "date";
            //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
            var month = parseInt($('#month').val()) + 1;
            var year = parseInt($('#year').val());
            if(month == 13){
                month = 1;
                year ++;
            }
            from = parseInt(new Date($('#month').val() + "-01-" + $('#year').val()).getTime()) / 1000;
            to = parseInt(new Date(month + "-01-" + year).getTime()) / 1000;

            table.ajax.url(uri + "core/warehouse/orders/listDatatables.php?type=" + $('#orderTypes').val() + "&agreement=" + $('#orderAgreement').val() + "&from=" + from + "&to=" + to).load();

            $('#trimester').val(0);
        }else{
            if($('#trimester').val() == 0){
                from = parseInt(new Date("01-01-" + $('#year').val()).getTime()) / 1000;
                to = parseInt(new Date("12-01-" + $('#year').val()).getTime()) / 1000;
                table.ajax.url(uri + "core/warehouse/orders/listDatatables.php?type=" + $('#orderTypes').val() + "&agreement=" + $('#orderAgreement').val() + "&from=" + from + "&to=" + to).load();
            }else{
                $('#trimester').change()
            }
        }
    })

    $('#trimester').change(function(){
        pdfType = "trimester";
        //Variables que contienen el valor en el cual se establece el rango de fechas de busqueda de facturado
        if($('#trimester').val() != 0){
            switch ($('#trimester').val()) {
                case '1':
                    from = parseInt(new Date("01-01-"+ $('#year').val()).getTime()) / 1000;
                    to = parseInt(new Date("04-01-"+ $('#year').val()).getTime()) / 1000;
                    break;
                case '2':
                    from = parseInt(new Date("04-01-"+ $('#year').val()).getTime()) / 1000;
                    to = parseInt(new Date("07-01-"+ $('#year').val()).getTime()) / 1000;
                    break;
                case '3':
                    from = parseInt(new Date("07-01-"+ $('#year').val()).getTime()) / 1000;
                    to = parseInt(new Date("10-01-"+ $('#year').val()).getTime()) / 1000;
                    break;
                case '4':
                    var year = parseInt($('#year').val())+ 1;
                    from = parseInt(new Date("10-01-"+ $('#year').val()).getTime()) / 1000;
                    to = parseInt(new Date("01-01-"+ year).getTime()) / 1000;
                    break;
                default:
                    var year = parseInt($('#year').val());
                    var month = parseInt($('#month').val()) + 1;
                    if(month == 13){
                        month = 1;
                        year ++;
                    }
                    from = parseInt(new Date($('#month').val() + "-01-" + $('#year').val()).getTime()) / 1000;
                    to = parseInt(new Date(month + "-01-" + year).getTime()) / 1000;
                    break;
            }
            $('#month').val(0);
            table.ajax.url(uri + "core/warehouse/orders/listDatatables.php?type=" + $('#orderTypes').val() + "&agreement=" + $('#orderAgreement').val() + "&from=" + from + "&to=" + to).load();
        }
    })
    
    // PEDIDOS - LISTADO
    var table = $('#datatable').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri + "core/warehouse/orders/listDatatables.php?type=1&agreement=0&from="+ from + "&to="+ to,
        "responsive": false,
        // "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },        
        "columns": [
            {"title": "Nº pedido"},
            {"title": "Expediente"},
            {"title": "Fecha"},
            {"title": "Proveedor"},
            {"title": "Lugar entrega"},
            {"title": "Fecha estimada entrega"},
            {"title": "Conforme"},
            {"title": "Editar"},
            {"title": "Eliminar"},
            {"title": "PDF"},
            {"title": "Albarán"}
        ],        
        "columnDefs": [{

            "className": "centered",
            "targets": 1,
            "render": function(data, type, row){
                return data == null ? '-' : data
            }
        },
        {
            "className": "centered",
            "targets": [0,1,3],
        },
        {
            "className": "centered",
            "targets": [4],
            "render": function(data, type, row){
                if(data == null){
                    var place
                    $.ajax({
                        url: uri + 'core/warehouse/orders/functions.php',
                        method: 'POST',
                        data: {
                            type: 'getOtherDeliveryPlace',
                            order: row[0]
                        },
                        async: false,
                        success: function(data){
                            place = $.parseJSON(data)
                        }
                    })
                    return place
                }else{
                    return data
                }
            }
        },
        {
            "className": "centered",
            "targets": [2, 5],
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "centered",
            "targets": 6,
            "render": function(data, type, row){
                switch(row[7]){
                    case null:
                        return '<strong>-</strong>'
                    break
                    case '0':
                        return '<strong>NO</strong>'
                    break
                    case '1':
                        return '<strong>SI</strong>'
                    break
                    case '2':
                        return '<strong>SI</strong>'
                    break
                    default:
                        return '<strong>-</strong>'
                    break
                }
            }
        },
        {
            "className": "centered details-control centered editClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control centered removeClick",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "centered details-control centered viewClick",
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-pdf'  title='Ver PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered deliveryNoteClick",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "render": function(data, type, row){
                return row[6] == null ? '-' : "<ul class='actions-menu'><li><a href='" + uri + "almacen/albaranes/" + row[6] + "' class='btnDeliveryNote'  title='Albarán'><i class='fa fa-file' aria-hidden='true'></i></a></li></ul>"
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'pedidos',
            title: 'Pedidos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'pedidos',
            title: 'Pedidos',
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
                            text: 'Listado de pedidos',
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
                columns: [0, 1, 2, 3, 4, 5, 6],
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
    })

    // PEDIDOS - BÚSQUEDA
    $('#input-search').on('keyup', function(){
        table.search(this.value).draw()
    })

    // PEDIDOS - TIPOS
    $('#orderTypes').change(function(){
        table.ajax.url(uri + 'core/warehouse/orders/listDatatables.php?type=' + $(this).val() + '&agreement=' + $('#orderAgreement').val()+ '&from='+ from + '&to='+ to).load()
    })

    $('#orderAgreement').change(function(){
        table.ajax.url(uri + 'core/warehouse/orders/listDatatables.php?type=' + $('#orderTypes').val() + '&agreement=' + $(this).val()+ '&from='+ from + '&to='+ to).load()
    })

    // PEDIDOS - EDITAR
    table.on('click', 'tbody .editClick', function () {
        var orderData =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        // window.open(uri + 'almacen/pedidos/' + orderData[0], '_blank');
        window.location.href = uri + 'almacen/pedidos/' + orderData[0];

    })

    // PEDIDOS - ELIMINAR
    table.on('click', '.removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var orderData =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el pedido nº " + orderData[0] + "?")){
            $.ajax({
                url: uri + 'core/warehouse/orders/delete.php',
                method: 'POST',
                data: {
                    ID: orderData[0]
                },
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pedido se ha eliminado con éxito.</div>')
                        
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

    // PEDIDOS - VER PDF
    table.on('click', '.viewClick', function(){
        $('.btn-pdf').tooltip('hide')

        var orderData =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'pedido', text: text, service: orderData[0], data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'pedido', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/pedido.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf del pedido ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })

    // ALBARANES - VER
    table.on('click', '.deliveryNoteClick', function(){
        $('.btnDeliveryNote').tooltip('hide')
    })
})