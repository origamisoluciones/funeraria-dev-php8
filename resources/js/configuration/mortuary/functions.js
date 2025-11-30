//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

//Función que pasando como parámetro el ID se obtienen todos los datos (cp, provincia...)
function getLocation(locationID) {
    var location;
    $.ajax({
        url: uri+"core/locations/read.php",
        data: {locationID: locationID},
        type: 'POST',
        async: false,
        success: function (data) {
            location = $.parseJSON(data);
        }
    });
    return location;
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

$(function () {
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
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
    changeSpaceFooter()
    
    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Select
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

    // GOOGLE MAPS
    $('#modal-new-mortuary #goToMaps').click(function(e){        
        $('#modal-new-mortuary #goToMaps').attr('href', '')        
        if($('#modal-new-mortuary #latitude').val() != '' && $('#modal-new-mortuary #longitude').val() != ''){
            var lat = $('#modal-new-mortuary #latitude').val()
            var long = $('#modal-new-mortuary #longitude').val()
            $('#modal-new-mortuary #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{
            $('#modal-new-mortuary #goToMaps').attr('href', '')
            e.preventDefault()
        }
    })
    
    $('#modal-edit-mortuary #goToMaps').click(function(e){        
        $('#modal-edit-mortuary #goToMaps').attr('href', '')       
        if($('#modal-edit-mortuary #latitude').val() != '' && $('#modal-edit-mortuary #longitude').val() != ''){            
            var lat = $('#modal-edit-mortuary #latitude').val()
            var long = $('#modal-edit-mortuary #longitude').val()
            $('#modal-edit-mortuary #goToMaps').attr('href', 'https://google.es/maps/search/?api=1&query=' + lat + ',' + long)
        }else{           
            $('#modal-edit-mortuary #goToMaps').attr('href', '')
            e.preventDefault()
        }
    })

    // Mortuary tellmebye
    $('.mortuary-tellmebye').select2({
        containerCssClass: 'select2-container',
        language: langSelect2,
        allowClear: true,
        minimumResultsForSearch: Infinity,
        placeholder: 'Selecciona una sucursal',
        ajax: {
            url: uri + 'core/tellmebyeDelegations/getSelect2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {                                
                    results: $.map(data.items, function (item) {                                    
                        return {
                            text: item.name,
                            id: item.id
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
    });

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/mortuaries/listDatatables.php",
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
            {"title": "Tanatorio"},
            {"title": "Localidad"},
            {"title": "Teléfonos"},
            {"title": "Propio"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0],
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,2,3]
        },
        {
            "className": "centered isYourOwn editClick",
            "targets": 4,
            "render": function (data, type, row) {
                if(type === 'display'){
                    if(data == 0 || data == null){
                        return "No";
                    }else if(data == 1){
                        return "Sí";
                    }
                }else{
                    return data;
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                return row[1] == 'Otro' ? '-' : "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered removeClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                return row[1] == 'Otro' ? '-' : "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tanatorios',
            title: 'Tanatorios',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'tanatorios',
            title: 'Tanatorios',
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
                            text: 'Listado de tanatorios',
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
        // "order": [[0, 'desc']]
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    //Icheck
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });

    var isYourOwnE, isYourOwnN;
    isYourOwnE = isYourOwnN = 0;

    $('#formNewData #isYourOwn').on('ifUnchecked', function(event){
        isYourOwnN = 0;

        $('.vivoRecuerdoSectionCreate').addClass('hide');
        $('#formNewData #apiClient').val('');
        $('#formNewData #apiKey').val('');

        if(COMPANY == 1 || COMPANY == 2 || COMPANY == 3 || COMPANY == 8){
            $('.tellmebyeMortuarySectionCreate').addClass('hide');

            $('#tellmebyeMortuary').val(null).trigger('change');
        }
    });
    $('#formEditData #isYourOwn').on('ifUnchecked', function(event){
        isYourOwnE = 0;

        $('.vivoRecuerdoSectionUpdate').addClass('hide');
        $('#formEditData #apiClient').val('');
        $('#formEditData #apiKey').val('');

        if(COMPANY == 1 || COMPANY == 2 || COMPANY == 3 || COMPANY == 8){
            $('.tellmebyeMortuarySectionUpdate').addClass('hide');

            $('#tellmebyeMortuaryUpdate').val(null).trigger('change');
        }
    });
    $('#formNewData #isYourOwn').on('ifChecked', function(event){
        isYourOwnN = 1;

        $('.vivoRecuerdoSectionCreate').removeClass('hide');

        if(COMPANY == 1 || COMPANY == 2 || COMPANY == 3 || COMPANY == 8){
            $('.tellmebyeMortuarySectionCreate').removeClass('hide');
        }
    });
    $('#formEditData #isYourOwn').on('ifChecked', function(event){
        isYourOwnE = 1;

        $('.vivoRecuerdoSectionUpdate').removeClass('hide');

        if(COMPANY == 1 || COMPANY == 2 || COMPANY == 3 || COMPANY == 8){
            $('.tellmebyeMortuarySectionUpdate').removeClass('hide');
        }
    });

    //Create. Nuevo tanatorio
    $('#saveNewMortuary').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
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

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
            var name = $("#formNewData #name").val();
            var address = $("#formNewData #address").val();
            var location = $("#formNewData #location").val();
            var apiClient = $("#formNewData #apiClient").val();
            var apiKey = $("#formNewData #apiKey").val();

            //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
            if(location == "undefined" || location=="" ||  location == null){
                location = "null";
            }

            var mail = $("#formNewData #mail").val();

            //Obtenemos los teléfonos con el formato "NUMERO1-NUMERO2"
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });

            // Gets latitude and longitude
            var latitude =  parseFloat($('#formNewData #latitude').val());
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            var longitude = parseFloat($('#formNewData #longitude').val());
            if(isNaN(longitude)){
                longitude = 'NULL';
            }

            //Eliminamos el último delimitador "-" de los teléfonos
            phones = phones.slice(0,-1);
            var company = $("#formNewData #company").val();

            // Tellmebye
            var tellmebye = $("#formNewData #tellmebyeMortuary").val();
            var tellmebyeName = '';
            if($("#formNewData #tellmebyeMortuary").select2('data').length > 0){
                tellmebyeName = $("#formNewData #tellmebyeMortuary").select2('data')[0].text;
            }

            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(
                uri+"core/mortuaries/create.php",
                {
                    name: name,
                    address: address,
                    location: location,
                    mail: mail,
                    phones: phones,
                    company: company,
                    latitude: latitude,
                    longitude: longitude,
                    isYourOwn: isYourOwnN,
                    apiClient:apiClient,
                    apiKey: apiKey,
                    tellmebye: tellmebye,
                    tellmebyeName: tellmebyeName
                },
                function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tanatorio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    //Recargamos la tabla con los nuevos datos
                    table.ajax.reload();

                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000)
                }
            );

            //Mostramos la ventana modal
            $('#modal-new-mortuary').modal('hide');
        }else{
            $('#modal-new-mortuary #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-mortuary #warning-message').empty()
            }, 3500)
        }
    });

    //Edit. Acción editar un tanatorio
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri+"core/mortuaries/read.php", {mortuaryID: rowClick[0]}, function(data){
            data = $.parseJSON(data);
            
            $('#formEditData #mortuaryID').val(data[0].mortuaryID);
            $('#formEditData #name').val(data[0].mortuaryName);

            if(data[0].province == null){
                $("#formEditData #province option[value='']").attr('disabled', false);
                $('.location').prop('disabled', true);
            }else{
                province = data[0].province
                $("#formEditData #province option[value='']").attr('disabled', true);
                $('#formEditData #province').val(data[0].province);
                $('.location').prop('disabled', false);
            }
            if(data[0].locationID != null){
                $('.location').prop('disabled', false)
                if($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length){
                    $('#formEditData #location').val(data[0].locationID).trigger('change');
                }else{
                    if(data[0].postalCode == null){
                        data[0].postalCode = ''
                    }
                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true)
                    $('#formEditData #location').append(newOption).trigger('change')
                }
            }

            $('#formEditData #address').val(data[0].address);
            $('#formEditData #mail').val(data[0].mail);
            if(data[0].isYourOwn == 1){
                $('#formEditData #isYourOwn').iCheck('check');
                isYourOwnE = 1;
            }else{
                $('#formEditData #isYourOwn').iCheck('uncheck');
                isYourOwnE = 0;
            }
            $('#formEditData .phone').val('');
            $('#formEditData #company').val(data[0].company);
            $('#formEditData #latitude').val(data[0].latitude);
            $('#formEditData #longitude').val(data[0].longitude);
            if(data[0].phones != ""){
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

            if(data[0]['api_client'] != null && data[0]['api_client'] != ''){
                $('#formEditData #apiClient').val(data[0].api_client);
            }

            if(data[0]['api_key'] != null && data[0]['api_key'] != ''){
                $('#formEditData #apiKey').val(data[0].api_key);
            }

            if(data[0].tellmebye != null){
                if($('#formEditData #tellmebyeMortuaryUpdate').find("option[value='" + data[0].tellmebye + "']").length){
                    $('#formEditData #tellmebyeMortuaryUpdate').val(data[0].tellmebye).trigger('change');
                }else{
                    var newOption = new Option(data[0].tellmebyeName, data[0].tellmebye, true, true);
                    $('#formEditData #tellmebyeMortuaryUpdate').append(newOption).trigger('change');
                }
            }
            // $("#formEditData #tellmebyeMortuaryUpdate").val(data[0].tellmebye).trigger('change');
        });

        $('#modal-edit-mortuary').modal('show');
    });
    
    //Update. Actualizamos los datos del tanatorio tras la acción "editar"
    $('#saveEditMortuary').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }

        if($('#formEditData #mail').val() != ""){
            if(!isMail($('#formEditData #mail'))){
                validate++;
            }
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

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud update
            var mortuaryID = $("#formEditData #mortuaryID").val();
            var name = $("#formEditData #name").val();
            var address = $("#formEditData #address").val();
            var location = $("#formEditData #location").val();
            var apiClient = $("#formEditData #apiClient").val();
            var apiKey = $("#formEditData #apiKey").val();
            if(location== "undefined" || location=="" ||  location==null){
                location = "null";
            }

            var mail = $("#formEditData #mail").val();

            //Obtenemos los teléfonos con el siguiente formato "NUMERO1-NUMERO2"
            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });

            // Gets latitude and longitude
            var latitude = parseFloat($('#formEditData #latitude').val());
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            var longitude = parseFloat($('#formEditData #longitude').val());
            if(isNaN(longitude)){
                longitude = 'NULL';
            }

            //Eliminamos el último delimitador "-" de los teléfonos
            phones = phones.slice(0,-1);

            var company = $("#formEditData #company").val();

            // Tellmebye
            var tellmebye = $("#formEditData #tellmebyeMortuaryUpdate").val();
            var tellmebyeName = '';
            if($("#formEditData #tellmebyeMortuaryUpdate").select2('data').length > 0){
                tellmebyeName = $("#formEditData #tellmebyeMortuaryUpdate").select2('data')[0].text;
            }

            $.post(
                uri+"core/mortuaries/update.php",
                {
                    mortuaryID: mortuaryID,
                    name: name,
                    address: address,
                    location: location,
                    mail: mail,
                    phones: phones,
                    company: company,
                    latitude: latitude,
                    longitude: longitude,
                    isYourOwn: isYourOwnE,
                    apiClient: apiClient,
                    apiKey: apiKey,
                    tellmebye: tellmebye,
                    tellmebyeName: tellmebyeName
                },
                function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del tanatorio se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Recargamos la tabla con los nuevos datos
                    table.ajax.reload();
                }
            );

            //ocultamos la ventana modal
            $('#modal-edit-mortuary').modal('hide');
        }else{
            $('#modal-edit-mortuary #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-mortuary #warning-message').empty()
            }, 3500)
        }
    });
    
    //Delete. Eliminamos un tanatorio
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el tanatorio " + rowClick[1] + "?")){
            $.post(uri+"core/mortuaries/delete.php", {mortuaryID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tanatorio se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                table.ajax.reload();
            });
        }
    });

    //Acción para añadir nuevos teléfonos
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

    //Acción para eliminar un teléfono
    $('.phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    //Modales. Acciones
    $('#modal-new-mortuary').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('.phones').html('');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $("#formNewData #location").val('').trigger('change');
        $('#formNewData #isYourOwn').iCheck('uncheck'); 
        isYourOwnN = 0;
        clean("formNewData");
        $('#modal-new-mortuary #warning-message').empty()
    });

    $('#modal-edit-mortuary').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('.phones').html('');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }
        $("#formEditData #location").val('').trigger('change');
        $('#formEditData #isYourOwn').iCheck('uncheck'); 
        isYourOwnE = 0;
        clean("formEditData");
        $('#modal-edit-mortuary #warning-message').empty()
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/mortuaries/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/mortuaries/template.csv', '_blank')
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
                url: uri + 'core/mortuaries/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/mortuaries/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/mortuaries/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Provincia, Localidad, Email, Teléfonos, Compañía, Propio, Texto"){
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