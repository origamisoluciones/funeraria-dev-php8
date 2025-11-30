/**
 * Select2 function for remote data
 * 
 * @param {array} data
 * @return {string}
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Obtiene los datos de una localidad
 * 
 * @param {int} locationID ID de la localidad
 * @return {array} location Datos de la localidad
 */
function getLocation(locationID){
    var location
    $.ajax({
        url: uri + "core/locations/functions.php",
        data: {locationID: locationID, type: 'getLocationsByID'},
        type: 'POST',
        async: false,
        success: function(data){
            location = $.parseJSON(data)
        }
    })
    return location
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    // SELECT
    $.fn.select2.defaults.set("width", "100%");
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
            return "Sin resultados";
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
            return "Sin resultados";
        }
    };

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

    // DESTINOS INTERMEDIOS - LISTADO
    var destinationPlaces = $('#datatableMiddle').DataTable({
        "ajax": uri+"core/destinationPlaces/middle/list.php",
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
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Nombre"},
            {"title": "Localidad"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": 'editClick',
            "targets": [1,2]
        },
        {
            "className": "details-control centered",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render": function (data, type, row) {
                if(row[0] != 0){
                    return "<ul class='actions-menu'><li><a href='#' class='btn-edit editClick' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>";
                }else{
                    return "-";
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render": function (data, type, row) {
                if(row[0] != 0){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete removeClick' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>";
                }else{
                    return "-";
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'lugares intermedios',
            title: 'Lugares Intermedios',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'lugares intermedios',
            title: 'Lugares Intermedios',
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
                            text: 'Listado de lugares intermedios',
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
                columns: [1, 2],
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

    //DESTINO INTERMEDIO - BUSCAR
    $('#input-search').on( 'keyup', function () {
        destinationPlaces.search( this.value ).draw();
    });

    // DESTINO INTERMEDIO - NUEVO
    $('#saveNewDestinationMiddle').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewMiddleData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewMiddleData #locationMiddle'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewMiddleData #name").val();
            var location = $("#formNewMiddleData #locationMiddle").val();
            if(location == "undefined" || location=="" ||  location == null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/middle/create.php',
                method: 'POST',
                data: {
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        destinationPlaces.ajax.reload();
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino intermedio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-destinarion-middle').modal('hide');
        }else{
            $('#modal-new-destinarion-middle #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-destinarion-middle #warning-message').empty()
            }, 3500)
        }
    });

    // DESTINO INTERMEDIO - MODIFICAR
    destinationPlaces.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = destinationPlaces.row($(this).closest('tr')).data() == undefined ? destinationPlaces.row($(this).closest('tr.child').prev()).data() : destinationPlaces.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/destinationPlaces/middle/read.php',
            method: 'POST',
            data: {
                ID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                $('#formEditMiddleData #destinationPlaceID').val(data[0].ID);
                $('#formEditMiddleData #name').val(data[0].place_name); 
                if(data[0].province == null){
                    $("#formEditMiddleData #provinceMiddleEdit option[value='']").attr('disabled', false)
                    $('.location').prop('disabled', true)
                }else{
                    province = data[0].province
                    $("#formEditMiddleData #provinceMiddleEdit option[value='']").attr('disabled', true)
                    $('#formEditMiddleData #provinceMiddleEdit').val(data[0].province)
                    $('.location').prop('disabled', false)
                }
                if(data[0].locationID != null){
                    if ($('#formEditMiddleData #locationMiddleEdit').find("option[value='" + data[0].locationID + "']").length) {
                        $('#formEditMiddleData #locationMiddleEdit').val(data[0].locationID).trigger('change');
                    } else { 
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true);
                        $('#formEditMiddleData #locationMiddleEdit').append(newOption).trigger('change');
                    }
                }
                $('#modal-edit-destinarion-middle').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    $('#saveEditDestinationMiddle').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditMiddleData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditMiddleData #locationMiddleEdit'))){
            validate++;
        }

        if(validate == 0){
            var ID = $("#formEditMiddleData #destinationPlaceID").val();
            var name = $("#formEditMiddleData #name").val();
            var location = $("#formEditMiddleData #locationMiddleEdit").val();
            if(location == "undefined" || location == "" || location == null){
                location = "null";
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/middle/update.php',
                method: 'POST',
                data: {
                    ID: ID,
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        destinationPlaces.ajax.reload();
        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del destino intermedio se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#modal-edit-destinarion-middle').modal('hide');
        }else{
            $('#modal-edit-destinarion-middle #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-destinarion-middle #warning-message').empty()
            }, 3500)
        }
    });

    // DESTINO INTERMEDIO - ELIMINAR
    destinationPlaces.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = destinationPlaces.row($(this).closest('tr')).data() == undefined ? destinationPlaces.row($(this).closest('tr.child').prev()).data() : destinationPlaces.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el destino intermedio " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/destinationPlaces/middle/delete.php',
                method: 'POST',
                data: {
                    ID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        destinationPlaces.ajax.reload();
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino intermedio se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
            
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    });

    // MODALES
    $('#modal-new-destinarion-middle').on('shown.bs.modal', function (e) {
        $('#formNewMiddleData.location').prop('disabled', true)
    })

    $('#modal-new-destinarion-middle').on('hidden.bs.modal', function (e) {
        $('#formNewMiddleData input').val('');
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewMiddleData");
        $('#modal-new-destinarion-middle #warning-message').empty()
    });

    $('#modal-edit-destinarion-middle').on('hidden.bs.modal', function (e) {
        $('#formEditMiddleData input').val('');
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formEditMiddleData");
        $('#modal-edit-destinarion-middle #warning-message').empty()
    });

    // DESTINOS FINALES - LISTADO
    var destinationPlacesFinals = $('#datatableFinal').DataTable({
        "ajax": uri+"core/destinationPlaces/final/list.php",
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
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Nombre"},
            {"title": "Localidad"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": 'editClick',
            "targets": [1,2]
        },
        {
            "className": "details-control centered",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render": function (data, type, row) {
                if(row[0] != 0){
                    return "<ul class='actions-menu'><li><a href='#' class='btn-edit editClick' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>";
                }else{
                    return "-";
                }
            }
        },
        {
            "className": "details-control centered",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render": function (data, type, row) {
                if(row[0] != 0){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete removeClick' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>";
                }else{
                    return "-";
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'lugares finales',
            title: 'Lugares Finales',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'lugares finales',
            title: 'Lugares Finales',
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
                            text: 'Listado de lugares finales',
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
                columns: [1, 2],
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

    //DESTINO FINALES - BUSCAR
    $('#input-search').on( 'keyup', function () {
        destinationPlacesFinals.search( this.value ).draw();
    });

    // DESTINO FINALES - NUEVO
    $('#saveNewDestinationFinal').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewFinalData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewFinalData #locationFinal'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewFinalData #name").val();
            var location = $("#formNewFinalData #locationFinal").val();
            if(location == "undefined" || location=="" ||  location == null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/final/create.php',
                method: 'POST',
                data: {
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        destinationPlacesFinals.ajax.reload();
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino final se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-destinarion-final').modal('hide');
        }else{
            $('#modal-new-destinarion-final #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-destinarion-final #warning-message').empty()
            }, 3500)
        }
    });

    // DESTINO INTERMEDIO - MODIFICAR
    destinationPlacesFinals.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = destinationPlacesFinals.row($(this).closest('tr')).data() == undefined ? destinationPlacesFinals.row($(this).closest('tr.child').prev()).data() : destinationPlacesFinals.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/destinationPlaces/final/read.php',
            method: 'POST',
            data: {
                ID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                $('#formEditFinalData #destinationPlaceID').val(data[0].ID);
                $('#formEditFinalData #name').val(data[0].place_name); 
                if(data[0].province == null){
                    $("#formEditFinalData #provinceFinalEdit option[value='']").attr('disabled', false)
                    $('.location').prop('disabled', true)
                }else{
                    province = data[0].province
                    $("#formEditFinalData #provinceFinalEdit option[value='']").attr('disabled', true)
                    $('#formEditFinalData #provinceFinalEdit').val(data[0].province)
                    $('.location').prop('disabled', false)
                }
                if(data[0].locationID != null){
                    if ($('#formEditFinalData #locationFinalEdit').find("option[value='" + data[0].locationID + "']").length) {
                        $('#formEditFinalData #locationFinalEdit').val(data[0].locationID).trigger('change');
                    } else { 
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true);
                        $('#formEditFinalData #locationFinalEdit').append(newOption).trigger('change');
                    }
                }
                $('#modal-edit-destinarion-final').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    $('#saveEditDestinationFinal').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditFinalData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditFinalData #locationFinalEdit'))){
            validate++;
        }

        if(validate == 0){
            var ID = $("#formEditFinalData #destinationPlaceID").val();
            var name = $("#formEditFinalData #name").val();
            var location = $("#formEditFinalData #locationFinalEdit").val();
            if(location == "undefined" || location == "" || location == null){
                location = "null";
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/final/update.php',
                method: 'POST',
                data: {
                    ID: ID,
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        destinationPlacesFinals.ajax.reload();
        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del destino final se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#modal-edit-destinarion-final').modal('hide');
        }else{
            $('#modal-edit-destinarion-final #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-destinarion-final #warning-message').empty()
            }, 3500)
        }
    });

    // DESTINO INTERMEDIO - ELIMINAR
    destinationPlacesFinals.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = destinationPlacesFinals.row($(this).closest('tr')).data() == undefined ? destinationPlacesFinals.row($(this).closest('tr.child').prev()).data() : destinationPlacesFinals.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el destino final " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/destinationPlaces/final/delete.php',
                method: 'POST',
                data: {
                    ID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data){
                        destinationPlacesFinals.ajax.reload();
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino final se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    });

    // MODALES
    $('#modal-new-destinarion-final').on('shown.bs.modal', function (e) {
        $('#formNewFinalData.location').prop('disabled', true)
    })

    $('#modal-new-destinarion-final').on('hidden.bs.modal', function (e) {
        $('#formNewFinalData input').val('');
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewFinalData");
        $('#modal-new-destinarion-final #warning-message').empty()
    });

    $('#modal-edit-destinarion-final').on('hidden.bs.modal', function (e) {
        $('#formEditFinalData input').val('');
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formEditFinalData");
        $('#modal-edit-destinarion-final #warning-message').empty()
    });
});