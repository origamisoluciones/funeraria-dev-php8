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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
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
        $('#saveForm').click();
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });

    // SELECT2
    //$.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    var limit_page = 10;

    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ...";
        },
        inputTooLong: function(args) {
            return "Término demasiado largo";
        },
        errorLoading: function() {
            return "No hay resultados";
        },
        loadingMore: function() {
            return "Cargando más resultados";
        },
        noResults: function() {
            return "No hay resultados";
        },
        searching: function() {
            return "Buscando...";
        },
        maximumSelected: function(args) {
            return "No hay resultados";
        }
    };

    //Select sin cuadro de búsquedas
    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
    }); 

    // - Cliente    
    $('#suppliers').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/warehouse/orders/correctiveActions/getSuppliers.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
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
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $("#from").val('01/01/'+moment().format('YYYY'));
    $("#to").val('31/12/'+moment().format('YYYY'));

    var supplier = $('#suppliers').val();

    if($("#from").val() != ''){
        var from = moment($("#from").val(), 'DD/MM/YYYY').format('X');
    }
    if($("#to").val() != ''){
        var to = moment($("#to").val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
    }

    var table = $('#datatable').DataTable({
        "ajax": uri + "core/warehouse/orders/correctiveActions/getOrdersDatatables.php?supplier=" + supplier+"&from="+from+"&to="+to,
        "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        // "scrollY":  '570px',
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
            {"title": "Ver no conformidad"},
            {"title": "PDF no conformidad"},
            {"title": "Editar"},
            {"title": "Eliminar"},
            {"title": "PDF"},
            {"title": "Albarán"}
        ],        
        "columnDefs": [
            {
                "targets": [0],
                "className": "text-center",
                "render": function(data, type, row){
                    return data
                }
            },
            {
            "targets": 1,
            "className": "text-center",
            "render": function(data, type, row){
                return data == null ? '-' : data
            }
        },
        {
            "targets": [4],
            "className": "text-center",
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
            "targets": [2, 5],
            "className": "text-center",
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "targets": [3],
            "className": "text-center",
            "render": function(data, type, row){
                return data
            }
        },
        {
			"className": "details-control viewClick text-center",
			"targets": 6,
			"orderable": false,
			"searchable": false,
			"data": null,
			"defaultContent": "<ul class='actions-menu' style='width:100%'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
		},
        {
			"className": "details-control pdfNonApprovalClick text-center",
			"targets": 7,
			"orderable": false,
			"searchable": false,
			"data": null,
			"defaultContent": "<ul class='actions-menu' style='width:100%'><li><a href='#'  title='Ver PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
		},
        {
			"className": "details-control editClick text-center",
			"targets": 8,
			"orderable": false,
			"searchable": false,
			"data": null,
			"defaultContent": "<ul class='actions-menu' style='width:100%'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
		},
		{
			"className": "details-control removeClick text-center",
			"targets": 9,
			"orderable": false,
			"searchable": false,
			"data": null,
			"defaultContent": "<ul class='actions-menu' style='width:100%'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },
        {
			"className": "details-control pdfClick text-center",
			"targets": 10,
			"orderable": false,
			"searchable": false,
			"data": null,
			"defaultContent": "<ul class='actions-menu' style='width:100%'><li><a href='javascript:void(0)' class='btn-pdf'  title='Ver PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
        },
        {
			"className": "details-control centered deliveryNoteClick",
			"targets": 11,
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
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'acciones correctivas',
            title: 'Acciones correctivas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'acciones correctivas',
            title: 'Acciones correctivas',
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
                            text: 'Listado de acciones correctivas',
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
                columns: [1, 2, 3, 4, 5, 6],
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

    // Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function(){
        table.search(this.value).draw()
    })

    // Ver no conformidad
    table.on('click', 'tbody .viewClick', function () {
        var orderData =  table.row($(this).closest('tr')).data() == undefined ?  table.row($(this).closest('tr.child').prev()).data() :  table.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/warehouse/orders/correctiveActions/functions.php',
            method: 'POST',
            data: {
                type: 'getNonApproval',
                order: orderData[0]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    $('#nonApproval').html(data.nonApproval)
                    $('#correctiveAction').html(data.correctiveAction)

                    $('#modal-no-agreement').modal('show')
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
    })

    // PEDIDOS - EDITAR
    table.on('click', 'tbody .editClick', function () {
        var orderData =  table.row($(this).closest('tr')).data() == undefined ?  table.row($(this).closest('tr.child').prev()).data() :  table.row($(this).closest('tr')).data()

        // window.open(uri + 'almacen/pedidos/' + orderData[0], '_blank');
        window.location.href = uri + 'almacen/pedidos/' + orderData[0];
    })

    // PEDIDOS - ELIMINAR
    table.on('click', '.removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var orderData =  table.row($(this).closest('tr')).data() == undefined ?  table.row($(this).closest('tr.child').prev()).data() :  table.row($(this).closest('tr')).data()

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
    table.on('click', '.pdfClick', function(){
        $('.btn-pdf').tooltip('hide')
        var orderData =  table.row($(this).closest('tr')).data() == undefined ?  table.row($(this).closest('tr.child').prev()).data() :  table.row($(this).closest('tr')).data()
        var text;
        //window.open(uri + 'documento/nuevo/' + order + '/pedido', '_blank');
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
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })

    table.on('click', '.pdfNonApprovalClick', function(){
        $('.btn-pdf').tooltip('hide')
        var orderData =  table.row($(this).closest('tr')).data() == undefined ?  table.row($(this).closest('tr.child').prev()).data() :  table.row($(this).closest('tr')).data()

        var text
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'noConformidadPedido', text: text, service: orderData[0], data: ""},
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

    $('#searchButtom').click(function(){

        var supplier = '';
        var from = '';
        var to = '';

        if($('#suppliers').val() != null || $("#from").val() != '' || $("#to").val() != ''){
            var supplier = $('#suppliers').val();

            if($("#from").val() != ''){
                from = moment($("#from").val(), 'DD/MM/YYYY').format('X');
            }
            if($("#to").val() != ''){
                to = moment($("#to").val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            }
        }
        table.ajax.url(uri + 'core/warehouse/orders/correctiveActions/getOrdersDatatables.php?supplier=' + supplier+'&from='+from+'&to='+to).load();
    })

    // $('#suppliers').change(function(){
    //     if($(this).val() == null){
    //         $('#orders').addClass('hide')
    //     }else{
    //         table.ajax.url(uri + 'core/warehouse/orders/correctiveActions/getOrders.php?supplier=' + $(this).val()).load()

    //         $('#orders').removeClass('hide')
    //     }
    // })

    // ALBARANES - VER
    table.on('click', '.deliveryNoteClick', function(){
        $('.btnDeliveryNote').tooltip('hide')
    })
})