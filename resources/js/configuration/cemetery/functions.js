/**
 * Select2 function for remote data
 * 
 * @param {array} data Información a formatear
 * @return {string} Información formateada
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

    // GOOGLE MAPS
    $('#modal-new-cemetery #goToMaps').click(function(e){
        $('#modal-new-cemetery #goToMaps').attr('href', '')
        if($('#modal-new-cemetery #latitude').val() != '' && $('#modal-new-cemetery #longitude').val() != ''){
            var lat = $('#modal-new-cemetery #latitude').val()
            var long = $('#modal-new-cemetery #longitude').val()
            $('#modal-new-cemetery #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{
            $('#modal-new-cemetery #goToMaps').attr('href', '')

            $('#modal-new-cemetery #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Introduzca latitud y longitud para ver la situación en Google Maps.</div>')
            setTimeout(function(){
                $('#modal-new-cemetery #warning-message').empty()
            }, 3500)

            e.preventDefault()
        }
    })
    $('#modal-edit-cemetery #goToMaps').click(function(e){
        $('#modal-edit-cemetery #goToMaps').attr('href', '');
        if($('#modal-edit-cemetery #latitude').val() != '' && $('#modal-edit-cemetery #longitude').val() != ''){
            var lat = $('#modal-edit-cemetery #latitude').val()
            var long = $('#modal-edit-cemetery #longitude').val()
            $('#modal-edit-cemetery #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{
            $('#modal-edit-cemetery #goToMaps').attr('href', '')

            $('#modal-edit-cemetery #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Introduzca latitud y longitud para ver la situación en Google Maps.</div>')
            setTimeout(function(){
                $('#modal-edit-cemetery #warning-message').empty()
            }, 3500)

            e.preventDefault()
        }
    })

    // CEMENTERIOS
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/cemeteries/listDatatables.php",
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
            {"title": "Cementerio"},
            {"title": "Dirección"},
            {"title": "Localidad"},
            {"title": "E-mail"},
            {"title": "Teléfonos"},
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
            "targets": [1,2,3]
        },
        {
            'targets' : 4,
            'render' : function(data){
                var print = ''
                if(data != null || data != ''){
                    print += '<a href="mailto:' + data + '">' + data + '</a>'
                }
                return print
            }
        },
        {
            'targets' : 5,
            'render' : function(data){
                var print = ''
                if(data != null && data != ''){
                    var phones = data.split('-')
                    $.each(phones, function(index, elem){
                        print += '<a href="tel:' + elem + '">' + elem + '</a> - '
                    })
                }
                return print.substring(0, print.length - 3)
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5],
                search: 'applied',
                order: 'applied'
            },
            filename: 'cementerios',
            title: 'Cementerios',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5],
                search: 'applied',
                order: 'applied'
            },
            filename: 'cementerios',
            title: 'Cementerios',
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
                            text: 'Listado de cementerios',
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
        "order": [[0, 'desc']]
    });
    
    // CEMENTERIO - BÚSQUEDA
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    // CEMENTERIO - NUEVO
    $('#saveNewCemetery').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if($('#formNewData #latitude').val() != ""){
            if(isEmpty($('#formNewData #latitude'))){
                validate++;
            }    
        }
        if($('#formNewData #longitude').val() != ""){
            if(isEmpty($('#formNewData #longitude'))){
                validate++;
            }
        }
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
        }
        if(validate == 0){
            var name = $("#formNewData #name").val();
            var address = $("#formNewData #address").val();
            var location = $("#formNewData #location").val();
            var latitude =  parseFloat($('#formNewData #latitude').val());
            var longitude = parseFloat($('#formNewData #longitude').val());
            
            if(location=="undefined" || location=="" ||  location==null){
                location = 'NULL';
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var mail = $("#formNewData #mail").val();
            
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones = phones.slice(0,-1);

            $.ajax({
                url: uri + 'core/cemeteries/create.php',
                method: 'POST',
                data: {
                    name: name,
                    address: address,
                    location: location,
                    latitude: latitude,
                    longitude: longitude,
                    mail: mail,
                    phones: phones
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cementerio se ha creado con éxito.</div>');

                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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
    
            $('#modal-new-cemetery').modal('hide');
        }else{
            $('#modal-new-cemetery #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-cemetery #warning-message').empty()
            }, 3500)
        }
    });

    // CEMENTERIOS - EDITAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        $.ajax({
            url: uri + 'core/cemeteries/read.php',
            method: 'POST',
            data: {
                cemeteryID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data);

                $('#formEditData #cemeteryID').val(data[0].cemeteryID);
                $('#formEditData #name').val(data[0].cemeteryName); 
                $('#formEditData #address').val(data[0].address);
                $('#formEditData #postalCode').val(data[0].postalCode);
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
                    $('#formEditData #location').prop('disabled', false)
                    if($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length){
                        $('#formEditData #location').val(data[0].locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true)
                        $('#formEditData #location').append(newOption).trigger('change')
                    }
                }
                $('#formEditData #latitude').val(data[0].latitude);
                $('#formEditData #longitude').val(data[0].longitude);
                $('#formEditData #mail').val(data[0].mail);
                $('#formEditData .phone').val('');
                if(data[0].phones!=""){
                    var arrayPhones;
                    if(data[0].phones != null){
                        arrayPhones = data[0].phones.split("-");
                    }else{
                        arrayPhones = "";
                    }
                    for (var i=0; i < arrayPhones.length; i ++){
                        $('#formEditData .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
                    }                
                    if(!$('#formEditData .phones').hasClass('in')){
                        $('#formEditData .phones').addClass('in');
                    }
                    $('#formEditData .phones .label .btn-remove').click(function(){
                        $(this).parent('.label').remove();
                    });
                    $('#formEditData #phones').val(data[0].phones);
                }

                $('#modal-edit-cemetery').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    $('#saveEditCemetery').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }
        if($('#formEditData #latitude').val() != ""){
            if(isEmpty($('#formEditData #longitude'))){
                validate++
            }
        }
        if($('#formEditData #longitude').val() != ""){
            if(isEmpty($('#formEditData #latitude'))){
                validate++
            }
        }
        if($('#formEditData #mail').val() != ""){
            if(!isMail($('#formEditData #mail'))){
                validate++
            }
        }
        if(validate == 0){
            var cemeteryID = $("#formEditData #cemeteryID").val();
            var name = $("#formEditData #name").val();
            var address = $("#formEditData #address").val();
            var location = $("#formEditData #location").val();
            var latitude = parseFloat($('#formEditData #latitude').val());
            var longitude = parseFloat($('#formEditData #longitude').val());

            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var mail = $("#formEditData #mail").val();

            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);

            $.ajax({
                url: uri + 'core/cemeteries/update.php',
                method: 'POST',
                data: {
                    cemeteryID: cemeteryID,
                    name: name,
                    address: address,
                    location: location,
                    latitude: latitude,
                    longitude: longitude,
                    mail: mail,
                    phones: phones
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del cementerio se han actualizado con éxito.</div>');

                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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

            $('#modal-edit-cemetery').modal('hide');
        }else{
            $('#modal-edit-cemetery #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-cemetery #warning-message').empty()
            }, 3500)
        }
    });
    
    // CEMENTERIOS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el cementerio " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/cemeteries/delete.php',
                method: 'POST',
                data: {
                    cemeteryID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cementerio se ha eliminado con éxito.</div>');

                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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
    });

    // TELÉFONOS - AÑADIR
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

    // TELÉFONOS - ELIMINAR
    $('.phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    // MODALES
    $('#modal-new-cemetery').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('.phones').html('');
        $('.situation-link a').attr('href','#');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $("#formNewData #location").val('').trigger('change');
        $('.province').val('')
        $('.location').prop('disabled', true)
        clean("formNewData");
        $('#modal-new-cemetery #warning-message').empty()
    });

    $('#modal-edit-cemetery').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('.phones').html('');
        $('.situation-link a').attr('href','#');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }
        $("#formEditData #location").val('').trigger('change');
        $('.province').val('')
        $('.location').prop('disabled', true)
        clean("formEditData");
        $('#modal-edit-cemetery #warning-message').empty()
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/cemeteries/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/cemeteries/template.csv', '_blank')
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
                url: uri + 'core/cemeteries/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/cemeteries/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/cemeteries/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Provincia, Localidad,Latitud, Longitud, Email, Teléfonos"){
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