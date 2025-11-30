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
        data: {
            locationID: locationID,
            type: 'getLocationsByID'
        },
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

    // GOOGLE MAPS
    $('#modal-new-church #goToMaps').click(function(e){        
        $('#modal-new-church #goToMaps').attr('href', '')        
        if($('#modal-new-church #latitude').val() != '' && $('#modal-new-church #longitude').val() != ''){
            var lat = $('#modal-new-church #latitude').val()
            var long = $('#modal-new-church #longitude').val()
            $('#modal-new-church #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{
            $('#modal-new-church #goToMaps').attr('href', '')
            e.preventDefault()
        }
    })
    $('#modal-edit-church #goToMaps').click(function(e){        
        $('#modal-edit-church #goToMaps').attr('href', '')       
        if($('#modal-edit-church #latitude').val() != '' && $('#modal-edit-church #longitude').val() != ''){            
            var lat = $('#modal-edit-church #latitude').val()
            var long = $('#modal-edit-church #longitude').val()
            $('#modal-edit-church #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{           
            $('#modal-edit-church #goToMaps').attr('href', '')
            e.preventDefault()
        }
    })

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

    // IGLESIAS - LISTADO
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/churches/listDatatables.php",
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
            {"title": "Iglesia"},
            {"title": "Dirección"},
            {"title": "Localidad"},
            {"title": "Email"},
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
            "targets": [1,2,3,4,5]
        },
        {
            "className": "details-control centered editClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit editClick'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
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
            filename: 'iglesias',
            title: 'Iglesias',
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
            filename: 'iglesias',
            title: 'Iglesias',
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
                            text: 'Listado de iglesias',
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

    // IGLESIAS - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    // CURAS
    $('#formNewData #priest').select2({
        containerCssClass: 'select2-priest',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/priests/data.php',
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
                            id: item.priestID
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

    // IGLESIAS - NUEVA
    $('#saveNewChurch').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if($('#formNewData #latitude').val() != ""){
            if(isEmpty($('#formNewData #longitude'))){
                validate++;
            }
        }
        if($('#formNewData #longitude').val() != ""){
            if(isEmpty($('#formNewData #latitude'))){
                validate++;
            }
        }
        if($('#formNewData #email').val() != ""){
            if(!isEmail($("#formNewData #email"))){
                validate++;
            }
        }
        
        if(validate == 0){
            var name = $("#formNewData #name").val();
            var address = $("#formNewData #address").val();
            var location = $("#formNewData #location").val();
            var latitude =  parseFloat($('#formNewData #latitude').val());
            var longitude = parseFloat($('#formNewData #longitude').val());
            var email = $('#formNewData #email').val();
            if(location == "undefined" || location == "" || location == null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var priests = []
            $('#formNewData .priests .label').each(function(){
                var priest = $(this).find('.number').parent().find('[type=hidden]').val();
                priests.push(priest)
            });

            $.post(uri+"core/churches/create.php", {name: name, address: address, location: location, latitude: latitude, longitude: longitude, email: email, phones: phones, priests : priests}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La iglesia se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            $('#modal-new-church').modal('hide');
        }else{
            $('#modal-new-church #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-church #warning-message').empty()
            }, 3500)
        }
    });

    // IGLESIAS - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var churchID = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        // CURAS
        $('#formEditData #priest').select2({
            containerCssClass: 'select2-priest',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/priests/data.php',
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
                                id: item.priestID
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

        $.post(uri+"core/churches/read.php", {churchID: churchID[0]}, function(data){
            data = $.parseJSON(data);

            $('#formEditData #churchID').val(data[0].churchID);
            $('#formEditData #name').val(data[0].churchName); 
            $('#formEditData #address').val(data[0].address);
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
                    if(data[0].postalCode == null){
                        data[0].postalCode = ''
                    }
                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true);
                    $('#formEditData #location').append(newOption).trigger('change');
                }
            }
            $('#formEditData #postalCode').val(data[0].postalCode);
            $('#formEditData #province').val(data[0].province);
            $('#formEditData #latitude').val(data[0].latitude);
            $('#formEditData #longitude').val(data[0].longitude);
            $('#formEditData #email').val(data[0].email);
            $('#formEditData .phone').val('');
            $('#formEditData .phones').empty()
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

            $('#formEditData .priests').empty()
            if(data[1].length > 0){
                data[1].forEach(function(elem){
                    $('#formEditData .priests').append('<span class="label label-default small labelPhones"><input type="hidden" value="' + elem.priest + '"><span class="number">' + elem.name + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
                })

                $('.priests .label .btn-remove').click(function(){
                    $(this).parent('.label').remove();
                });
            }
        });

        $('#modal-edit-church').modal('show');
    });
    
    $('#saveEditChurch').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if($('#formEditData #longitude').val() != ""){
            if(isEmpty($('#formEditData #latitude'))){
                validate++;
            }
        }
        if($('#formEditData #latitude').val() != ""){
            if(isEmpty($('#formEditData #longitude'))){
                validate++;
            }
        }
        if($('#formEditData #email').val() != ''){
            if(!isEmail($("#formEditData #email"))){
                validate++
            }
        }

        if(validate == 0){
            var churchID = $("#formEditData #churchID").val();
            var name = $("#formEditData #name").val();
            var address = $("#formEditData #address").val();
            var location = $("#formEditData #location").val();
            var email = $("#formEditData #email").val();
            var latitude = parseFloat($('#formEditData #latitude').val());
            var longitude = parseFloat($('#formEditData #longitude').val());
            if(location == "undefined" || location == "" || location == null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            var priests = []
            $('#formEditData .priests .label').each(function(){
                var priest = $(this).find('.number').parent().find('[type=hidden]').val();
                priests.push(priest)
            });
            phones=phones.slice(0,-1);

            $.post(uri+"core/churches/update.php", {churchID: churchID, name: name, address: address, location: location, latitude: latitude, longitude: longitude, email: email, phones: phones, priests : priests}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la iglesia se han actualizado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                table.ajax.reload();
            });

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            $('#modal-edit-church').modal('hide');
        }else{
            $('#modal-edit-church #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-church #warning-message').empty()
            }, 3500)
        }
    });
    
    // IGLESIAS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar la iglesia " + rowClick[1] + "?")){
            $.post(uri+"core/churches/delete.php", {churchID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La iglesia se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
                
                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });
        }
    });

    // AÑADIR TELÉFONOS
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

    // ELIMINAR TELÉFONOS
    $('.phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    // AÑADIR/ELIMINAR CURAS
    $('.btn-add-priest').click(function(){

        var modalForm = $(this).closest('form').attr('id');

        if($("#" + modalForm + " #priest").val() != null){
            var priest = $(this).parent().parent().find('#priest').val();
            var priestName = $(this).parent().parent().find('#priest').text();
    
            $("#" + modalForm + ' .priests').append(  
                '<span class="label label-default small labelPhones">' +
                '   <input type="hidden" value="' + priest + '">' +
                '   <span class="number">' + priestName + '</span> ' +
                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                '   <br>'+
                '</span>')
    
            if(!$("#" + modalForm + ' .priests').hasClass('in')){
                $("#" + modalForm + ' .priests').addClass('in');
            }
    
            $("#" + modalForm + ' .priests .label .btn-remove').click(function(){
                $(this).parent('.label').remove();
            });
    
            $("#" + modalForm + ' #priest').empty().trigger('change')
        }
    });

    // MODALES
    $('#modal-new-church').on('shown.bs.modal', function (e) {
        $('.location').prop('disabled', true)
    })

    $('#modal-new-church').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('.phones').html('');
        $('.situation-link a').attr('href','#');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $('.priests').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $("#formNewData #priest").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-church #warning-message').empty()
    });

    $('#modal-edit-church').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('.phones').html('');
        $('.situation-link a').attr('href','#');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }
        $('.priests').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $("#formEditData #priest").val('').trigger('change');
        clean("formEditData");
        $('#modal-edit-church #warning-message').empty()
    });
    
    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/churches/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/churches/template.csv', '_blank')
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
                url: uri + 'core/churches/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/churches/list.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/churches/list.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Provincia, Localidad, Código Postal, Latitude, Longitud, Teléfonos, Curas"){
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