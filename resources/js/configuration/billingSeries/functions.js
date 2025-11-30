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

    // Expedients types
    $('.expedients-types').select2({
        containerCssClass: 'select2-expedientType',
        language: langSelect2,
        placeholder: '--',
        multiple: true,
        ajax: {
            url: uri + 'core/expedients/types/data.php',
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
                        if(item.id != 2){
                            return {
                                text: item.name,
                                id: item.id
                            }
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

    // BOTÓN "ARRIBA"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // SERIES DE FACTURACIÓN - LISTADO
    var tableBilling = $('#datatable').DataTable({
        "ajax": uri + "core/billingSeries/list.php",
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
            {"title": "Nombre"},
            {"title": "Letra"},
            {"title": "Tipo de expedientes"},
            {"title": "has_invoices"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
        {
            "className": "id",
            "targets": [0,4],
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,2,3]
        },
        {
            "className": "details-control centered editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(row[4] == 0){
                    return "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(row[4] == 0){
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
                columns: [1,2,3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'series_facturacion',
            title: 'Series de facturación',
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
            filename: 'series_facturacion',
            title: 'Series de facturación',
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
                            text: 'Listado de series de facturación',
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
                columns: [1,2,3],
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

    // SERIES DE FACTURACIÓN - BUSCAR
    $('#input-search').on('keyup', function(){
        tableBilling.search(this.value).draw()
    })

    // SERIES DE FACTURACIÓN - AÑADIR
    $('#modal-new-billing-serie #saveNewBillingSerie').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #letter'))){
            validate++;
        }
        if(checkMaxLength($('#formNewData #letter'), 5)){
            validate++;
        }
        if(isEmpty($('#formNewData #expedientsTypeCreate'))){
            validate++;
        }
        
        if(validate == 0){
            var serieName = $('#modal-new-billing-serie #name').val()
            var serieLetter = $('#modal-new-billing-serie #letter').val()
            var serieExpedientsTypes = $('#modal-new-billing-serie #expedientsTypeCreate').val()

            $.ajax({
                url: uri + 'core/billingSeries/functions.php',
                method: 'POST',
                data: {
                    type: 'create',
                    name: serieName,
                    letter: serieLetter,
                    types: serieExpedientsTypes,
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        if(data['status']){
                            tableBilling.ajax.reload()

                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La serie de facturación se ha creado correctamente</div>')

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)

                            $('#modal-new-billing-serie').modal('hide')
                        }else{
                            if(data['error'] == 'exists_letter'){
                                $('#modal-new-billing-serie #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una serie de facturación con esa letra.</div>')
                            }else{
                                $('#modal-new-billing-serie #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            }

                            setTimeout(function(){
                                $('#modal-new-billing-serie #warning-message').empty()
                            }, 5000)
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)

                        $('#modal-new-billing-serie').modal('hide')
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    $('#modal-new-billing-serie').modal('hide')
                }
            })

        }else{
            $('#modal-new-billing-serie #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-billing-serie #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-new-billing-serie').on('hidden.bs.modal', function(){
        clean("formNewData");
        $('#modal-new-billing-serie #name').val('')
        $('#modal-new-billing-serie #letter').val('')
        $('#modal-new-billing-serie #expedientsTypeCreate').val(null).trigger('change')
        $('#modal-new-billing-serie #warning-message').empty()
    })

    // SERIES DE FACTURACIÓN - EDITAR
    tableBilling.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = tableBilling.row($(this).closest('tr')).data() == undefined ? tableBilling.row($(this).closest('tr.child').prev()).data() : tableBilling.row($(this).closest('tr')).data()

        if(rowClick[4] != 0){
            return false;
        }
        
        $.ajax({
            url : uri + 'core/billingSeries/functions.php',
            method : 'POST',
            data : {
                type: 'read',
                id : rowClick[0]
            },
            async : false,
            success : function(data){
                data = $.parseJSON(data)

                $('#formEditData #id').val(rowClick[0]);
                $('#formEditData #name').val(data['serie'].name);
                $('#formEditData #letter').val(data['serie'].letter);

                $.each(data['types'], function(index, value){
                    var newOption = new Option(value.text, value.id, true, true);
                    $('#formEditData #expedientsTypeEdit').append(newOption).trigger('change');
                })

                $('#modal-edit-billing-serie').modal('show');
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });

    // SERIES DE FACTURACIÓN - EDITAR
    $('#modal-edit-billing-serie #saveEditBillingSerie').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditData #letter'))){
            validate++;
        }
        if(isEmpty($('#formEditData #expedientsTypeEdit'))){
            validate++;
        }
        
        if(validate == 0){
            var serieID = $('#modal-edit-billing-serie #id').val()
            var serieName = $('#modal-edit-billing-serie #name').val()
            var serieLetter = $('#modal-edit-billing-serie #letter').val()
            var serieExpedientsTypes = $('#modal-edit-billing-serie #expedientsTypeEdit').val()

            $.ajax({
                url: uri + 'core/billingSeries/functions.php',
                method: 'POST',
                data: {
                    type: 'update',
                    id: serieID,
                    name: serieName,
                    letter: serieLetter,
                    types: serieExpedientsTypes,
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        
                        if(data){
                            tableBilling.ajax.reload()

                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La serie de facturación ha sido actualizada correctamente</div>')

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

            $('#modal-edit-billing-serie').modal('hide')
        }else{
            $('#modal-edit-billing-serie #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-billing-serie #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-edit-billing-serie').on('hidden.bs.modal', function(){
        clean("formEditData");
        $('#modal-edit-billing-serie #id').val('')
        $('#modal-edit-billing-serie #name').val('')
        $('#modal-edit-billing-serie #letter').val('')
        $('#modal-edit-billing-serie #expedientsTypeEdit').val(null).trigger('change')
        $('#modal-edit-billing-serie #warning-message').empty()
    })

    // SERIES DE FACTURACIÓN - ELIMINAR
    tableBilling.on('click', 'tbody .removeClick', function(){
        $('.btn-delete').tooltip('hide')

        var rowClick = tableBilling.row($(this).closest('tr')).data() == undefined ? tableBilling.row($(this).closest('tr.child').prev()).data() : tableBilling.row($(this).closest('tr')).data()

        if(confirm('Está seguro de que quiere borrar la serie de facturación "' + rowClick[1] + '"?')){
            $.ajax({
                url : uri + 'core/billingSeries/functions.php',
                method : 'POST',
                data : {
                    type: 'delete',
                    id : rowClick[0]
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data)

                    if(data){
                        tableBilling.ajax.reload()
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La serie de facturación se ha eliminado con éxito.</div>')
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
})