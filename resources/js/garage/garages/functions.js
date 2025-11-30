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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    // SELECT
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

    function formatData (data) {
        return '<div id="' + data.id + '">' + data.text + '</div>';
    }

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
            url: uri + 'core/locations/data2.php',
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

    // MODELOS - PROVEEDORES
    $('.supplier').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: false,
        ajax: {
            url: uri+'core/suppliers/data.php',
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
              
    // TALLERES
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/garage/garages/listDatatables.php",
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
        "scrollY":  '570px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nombre"},
            {"title": "Dirección"},
            {"title": "Localidad"},
            {"title": "Correo"},
            {"title": "Teléfono"},
            {"title": "Proveedor Asociado"},
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
            "className": "editClick",
            "targets": [1,2,3,4,5,6]
        },
        {
            "className": "details-control centered editClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' data-toggle='modal' data-target='#modal-edit-garage' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'talleres',
            title: 'Talleres',
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
            filename: 'talleres',
            title: 'Talleres',
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
                            text: 'Listado de talleres',
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
                columns: [1, 2, 3, 4, 5],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'asc']]
    })

    // TALLERES - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // TALLERES - NUEVO
    $('#saveNewGarage').click(function(){
        //Validaciones
        var validate = 0

        if(isEmpty($("#formNewGarage #name"))){
            validate++
        }

        if($('#formNewGarage #mail').val() != ''){
            if(!isMail($('#formNewGarage #mail'))){
                validate++;
            }
        }

        if($('#formNewGarage #phone').val() != ''){
            if(!isPhone($('#formNewGarage #phone'))){
                validate++;
            }
        }

        if(validate == 0){
            var name = $('#formNewGarage #name').val()
            var address = $('#formNewGarage #address').val()
            var location = $('#formNewGarage #location').val()
            var supplier = $('#formNewGarage #supplier').val()
            if(location == null){
                location = 'null'
            }
            var mail = $('#formNewGarage #mail').val()
            var phone = $('#formNewGarage #phone').val()
            
            $.post(uri + "core/garage/garages/create.php", {name : name, address : address, location : location, mail : mail, phone : phone, supplier: supplier}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El vehículo se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            table.ajax.reload()
            
            $('#modal-new-garage').modal('hide')

            $('#formNewGarage #name').val('')
            $('#formNewGarage #address').val('')
            $('#formNewGarage #location').val('')
            $('#formNewGarage #mail').val('')
            $('#formNewGarage #phone').val('')

            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-new-garage #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-garage #warning-message').empty()
            }, 3500)
        }
    })

    // TALLERES - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/garage/garages/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            if(data != null){
                $('#formEditGarage #ID').val(data.ID)        
                $('#formEditGarage #name').val(data.name)        
                $('#formEditGarage #address').val(data.address)
                if(data.province == null){
                    $("#formEditGarage #province option[value='']").attr('disabled', false)
                    $('.location').prop('disabled', true)
                }else{
                    province = data.province
                    $("#formEditGarage #province option[value='']").attr('disabled', true)
                    $('#formEditGarage #province').val(data.province)
                    $('.location').prop('disabled', false)
                }
                if(data.locationID != null){
                    $('#formEditGarage #location').prop('disabled', false)
                    if($('#formEditGarage #location').find("option[value='" + data.locationID + "']").length){
                        $('#formEditGarage #location').val(data.locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(data.locationName + ' - ' + data.postalCode, data.locationID, true, true)
                        $('#formEditGarage #location').append(newOption).trigger('change')
                    }
                }
                  
                if(data.supplier != null){
                    if($('#formEditGarage .supplier').find("option[value='" + data.supplier + "']").length){
                        $('#formEditGarage .supplier').val(data.supplier).trigger('change')
                    }else{ 
                        var newOption = new Option(data.suppName, data.supplier, true, true)
                        $('#formEditGarage .supplier').append(newOption).trigger('change')
                    }
                }
                $('#formEditGarage #mail').val(data.mail)
                $('#formEditGarage #phone').val(data.phone)
                $('#modal-edit-garage').modal('show')
            }
        })
    })

    $('#saveEditGarage').click(function(){
        var validate = 0

        if(isEmpty($("#formEditGarage #name"))){
            validate++
        }

        if($('#formEditGarage #mail').val() != ''){
            if(!isMail($('#formEditGarage #mail'))){
                validate++;
            }
        }

        if($('#formEditGarage #phone').val() != ''){
            if(!isPhone($('#formEditGarage #phone'))){
                validate++;
            }
        }
        
        if(validate == 0){
            var ID = $('#formEditGarage #ID').val()
            var name = $('#formEditGarage #name').val()
            var address = $('#formEditGarage #address').val()
            var location = $('#formEditGarage #location').val()
            if(location == null){
                location = 'null'
            }
            var mail = $('#formEditGarage #mail').val()
            var phone = $('#formEditGarage #phone').val()
            var supplier = $('#formEditGarage #supplier').val()
            
            $.post(uri + "core/garage/garages/update.php", {ID : ID, name : name, address : address, location : location, mail : mail, phone : phone, supplier: supplier}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El taller se ha modificado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            $('#modal-edit-garage').modal('hide')
            $('html, body').animate({scrollTop : 0}, 800)
        }else{
            $('#modal-edit-garage #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-garage #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').modal('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm('¿Está seguro de que sea eliminar el taller?')){
            $.post(uri + 'core/garage/garages/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El taller se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            table.ajax.reload()
            $('html, body').animate({scrollTop : 0}, 800)
        }
    })

    // MODALES
    $('#modal-new-garage').on('hidden.bs.modal', function (e) {
        $('#formNewGarage input').val('');
        $("#formNewGarage #location").val('').trigger('change');
        $("#formNewGarage #location").val('').trigger('change');
        $('#formNewGarage #location').empty();
        $('#formNewGarage #location').empty();
        $('.province').val('')
        $('.location').prop('disabled', true)
        $("#formNewGarage #supplier").val('').trigger('change');
        clean('formNewGarage');
    });

    $('#modal-edit-garage').on('hidden.bs.modal', function (e) {
        $('#formEditGarage input').val('');
        $("#formEditGarage #location").val('').trigger('change');
        $("#formEditGarage #location").val('').trigger('change');
        $('#formEditGarage #location').empty();
        $('#formEditGarage #location').empty();
        $('.province').val('')
        $('.location').prop('disabled', true)
        $("#formEditGarage #supplier").val('').trigger('change');
        clean('formEditGarage');
    });

    $('#formNewGarage #location').on('select2:unselecting', function(){
        $(this).empty();
    });

    $('#formEditGarage #location').on('select2:unselecting', function(){
        $(this).empty();
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/garage/garages/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/garages/template.csv', '_blank')
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
                url: uri + 'core/garage/garages/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/garage/garages/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/garage/garages/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Provincia, Localidad, Email, Teléfono, Proveedor asociado"){
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
})