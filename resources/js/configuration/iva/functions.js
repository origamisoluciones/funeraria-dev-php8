var ivaTypeSelected = null;

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
    changeSpaceFooter()

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // BOTÓN "ARRIBA"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // IVA EMITIDO - LISTADO
    var tableIva = $('#datatableIva').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/iva/list.php?ivaType=1",
        "responsive": false,
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
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": getIvaLabel()},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "details-control centered",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(row[1] != 0){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete removeClick'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'impuestos',
            title: 'impuestos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'impuestos',
            title: 'impuestos',
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
                            text: 'Listado de impuestos',
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
                columns: [1],
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

    // IVA EMITIDOS - BUSCAR
    $('#input-search').on('keyup', function(){
        tableIva.search(this.value).draw()
    })

    // IVA EMITIDOS - ELIMINAR
    tableIva.on('click', 'tbody .removeClick', function(){
        $('.btn-delete').tooltip('hide')

        var rowClick = tableIva.row($(this).closest('tr')).data() == undefined ? tableIva.row($(this).closest('tr.child').prev()).data() : tableIva.row($(this).closest('tr')).data()

        if(confirm('Está seguro de que quiere borrar el impuesto "' + rowClick[1] + '"?')){
            $.ajax({
                url : uri + 'core/iva/functions.php',
                method : 'POST',
                data : {
                    type: 'delete',
                    ID : rowClick[0]
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data)

                    if(data){
                        tableIva.ajax.reload()
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El impuesto se ha eliminado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // MODALES
    $('#modal-new-iva').on('hidden.bs.modal', function(){
        $('#formNewData #iva').val('')
        clean("formNewData");
        $('#modal-new-iva #warning-message').empty()
    })

    // IVA RECIBIDOS - LISTADO
    var tableIvaReceived = $('#datatableIvaReceived').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/iva/list.php?ivaType=2",
        "responsive": false,
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
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": getIvaLabel()},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "details-control centered",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(row[1] != 0.00){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete removeClick'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'impuestos',
            title: 'impuestos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'impuestos',
            title: 'impuestos',
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
                            text: 'Listado de impuestos',
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
                columns: [1],
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

    // IVA RECIBIDOS - BUSCAR
    $('#input-search-received').on('keyup', function(){
        tableIvaReceived.search(this.value).draw()
    })

    // IVA EMITIDOS - ELIMINAR
    tableIvaReceived.on('click', 'tbody .removeClick', function(){
        $('.btn-delete').tooltip('hide')

        var rowClick = tableIvaReceived.row($(this).closest('tr')).data() == undefined ? tableIvaReceived.row($(this).closest('tr.child').prev()).data() : tableIvaReceived.row($(this).closest('tr')).data()

        if(confirm('Está seguro de que quiere borrar el impuestos "' + rowClick[1] + '"?')){
            $.ajax({
                url : uri + 'core/iva/functions.php',
                method : 'POST',
                data : {
                    type: 'delete',
                    ID : rowClick[0]
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data)

                    if(data){
                        tableIvaReceived.ajax.reload()
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El impuesto se ha eliminado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // IVA - NUEVO
    $("#goToCreateIvaProducts").click(function(){
        ivaTypeSelected = 1;

        $("#modal-new-iva #ivaTypeName").empty().text(' para facturas emitidas')
        $("#modal-new-iva").modal("show");
    })

    $("#goToCreateIvaReceived").click(function(){
        ivaTypeSelected = 2;

        $("#modal-new-iva #ivaTypeName").empty().text(' para facturas recibidas')
        $("#modal-new-iva").modal("show");
    })
    
    $('#modal-new-iva #saveNewIva').click(function(){
        var validate = isFloat($('#modal-new-iva #iva'))
        
        if(validate){
            var iva = $('#modal-new-iva #iva').val()

            $.ajax({
                url: uri + 'core/iva/functions.php',
                method: 'POST',
                data: {
                    type: 'create',
                    iva: iva,
                    ivaType: ivaTypeSelected
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        if(data){
                            tableIva.ajax.reload()
                            tableIvaReceived.ajax.reload()

                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El impuesto se ha creado correctamente</div>')

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
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

            $('#modal-new-iva').modal('hide')
        }else{
            $('#modal-new-iva #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-iva #warning-message').empty()
            }, 3500)
        }
    })

    $("#modal-new-iva").on('hidden.bs.modal', function(){
        ivaTypeSelected = null
    })
})