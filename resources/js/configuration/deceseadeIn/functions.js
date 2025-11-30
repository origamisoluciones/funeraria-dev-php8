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

    // FALLECIDO EN - LISTADO
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/deceasedIn/listDatatables.php",
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
                    return "<ul class='actions-menu'><li><a href='#' class='btn-edit editClick'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>";
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
            filename: 'fallecido en',
            title: 'Fallecido en',
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
            filename: 'fallecido en',
            title: 'Fallecido en',
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
                            text: 'Listado de fallecido en',
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

    // FALLECIDO EN - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    // ICHECK
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });
    var textE = 0;
    var textN = 0;
    $('#formNewData #text').on('ifUnchecked', function(event){
        textN = 0;
    });
    $('#formEditData #text').on('ifUnchecked', function(event){
        textE = 0;
    });
    $('#formNewData #text').on('ifChecked', function(event){
        textN = 1;
    });
    $('#formEditData #text').on('ifChecked', function(event){
        textE = 1;
    });

    // FALLECIDO EN - NUEVO
    $('#saveNewDeceasedIn').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #location'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewData #name").val();
            var text = $("#formNewData #text").val();
            var location = $("#formNewData #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/deceasedIn/create.php',
                method: 'POST',
                data: {
                    name: name,
                    text: textN,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        table.ajax.reload();
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El "fallecido en" se ha creado con éxito.</div>');
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

            $('#modal-new-deceasedIn').modal('hide');
        }else{
            $('#modal-new-deceasedIn #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceasedIn #warning-message').empty()
            }, 3500)
        }
    });

    // FALLECIDO EN - MODIFICAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/deceasedIn/read.php',
            method: 'POST',
            data: {
                deceasedInID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                $('#formEditData #deceasedInID').val(data[0].deceasedInID);
                $('#formEditData #name').val(data[0].deceasedInName); 
                $('#formEditData #text').val(data[0].text);
                if(data[0].province == null){
                    $("#formEditData #province option[value='']").attr('disabled', false)
                    $('.location').prop('disabled', true)
                }else{
                    province = data[0].province
                    $("#formEditData #province option[value='']").attr('disabled', true)
                    $('#formEditData #province').val(data[0].province)
                    $('.location').prop('disabled', false)
                }
                if(data[0].locationID != null){
                    if ($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length) {
                        $('#formEditData #location').val(data[0].locationID).trigger('change');
                    } else { 
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true);
                        $('#formEditData #location').append(newOption).trigger('change');
                    }
                }
                if(data[0].text == 1){
                    $('#formEditData #text').iCheck('check');
                    textE = 1;
                }else{
                    $('#formEditData #text').iCheck('uncheck');
                    textE = 0;
                }

                $('#modal-edit-deceasedIn').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    $('#saveEditDeceasedIn').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditData #location'))){
            validate++;
        }

        if(validate == 0){
            var deceasedInID = $("#formEditData #deceasedInID").val();
            var name = $("#formEditData #name").val();
            var text = $("#formEditData #text").val();
            var location = $("#formEditData #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "null";
            }

            $.ajax({
                url: uri + 'core/deceasedIn/update.php',
                method: 'POST',
                data: {
                    deceasedInID: deceasedInID,
                    name: name,
                    text: textE,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        table.ajax.reload();
        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del "fallecido en" se han actualizado con éxito.</div>');
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
            
            $('#modal-edit-deceasedIn').modal('hide');
        }else{
            $('#modal-edit-deceasedIn #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-deceasedIn #warning-message').empty()
            }, 3500)
        }
    });

    // FALLECIDO EN - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el fallecido en " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/deceasedIn/delete.php',
                method: 'POST',
                data: {
                    deceasedInID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        table.ajax.reload();
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El "fallecido en" se ha eliminado con éxito.</div>');
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
    $('#modal-new-deceasedIn').on('shown.bs.modal', function (e) {
        $('#formNewData.location').prop('disabled', true)
    })

    $('#modal-new-deceasedIn').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('#formNewData textarea').val('');
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $('#formNewData #text').iCheck('uncheck'); 
        clean("formNewData");
        textN = 0;
        $('#modal-new-deceasedIn #warning-message').empty()
    });

    $('#modal-edit-deceasedIn').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('#formEditData textarea').val('');
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $('#formEditData #text').iCheck('uncheck'); 
        textE = 0;
        clean("formEditData");
        $('#modal-edit-deceasedIn #warning-message').empty()
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/deceasedIn/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/deceasedIn/template.csv', '_blank')
                }
            });
        }
    })


    // Importar datos
    $('#goImportData').click(function(){
        var filelist = $('#importData')[0].files

        if(filelist.length == 0){
            $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un archivo para cargar</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)
        }else if(filelist[0].name.split('.')[filelist[0].name.split('.').length - 1] != 'csv'){
            $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un formato de archivo válido</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)
        }else{
            $('#importDataMessage').html('<div class="alert alert-info alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La importación puede tardar varios minutos</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)

            var data = new FormData

            data.append('file', filelist[0])

            $.ajax({
                url: uri + 'core/deceasedIn/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/deceasedIn/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/deceasedIn/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Provincia, Localidad,Texto"){
                                $("#modal-import-errors #titleError").text("Los datos no se han importado por: ");
                            }else{
                                $("#modal-import-errors #titleError").text('Se han importado los datos salvo las siguientes filas: ');
                            }
                            $("#modal-import-errors #errors").append('<p> * ' + value + '</p>');
                        })
                        $("#modal-import-errors").modal("show")

                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con errores</div>')
                    }
                },
                error: function(){
                    $('#importDataMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                    setTimeout(function(){
                        $('#importDataMessage').empty()
                    }, 5000)
                }
            })
        }
    })

    $("#modal-import-errors").on('hidden.bs.modal', function(){
        $("#modal-import-errors #errors").empty();
    })
});