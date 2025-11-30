/**  @var {string} userLimit Plan hired */
var userLimit = null;

/**  @var {boolean} limitOvercome Sets if the user limit is overcomed */
var limitOvercome = false;

/**  @var {string} company Company id */
var company = null;

/**
 * Obtiene el numero limite de usuarios
 * 
 * @return {int} company Empresa
 */
function getUserLimit(){
    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'getUserLimit'
        },
        type : 'POST',
        async : false,
        success : function(data){
            userLimit = $.parseJSON(data)
        }
    })
}

/**
 * Obtiene la empresa
 * 
 * @return {int} company Empresa
 */
function getCompany(){

    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            company = data
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
}

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

//Función que pasando como parámetro el ID se obtienen todos los datos (cp, provincia...)
function getLocation(locationID) {
    if(locationID != null){
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
    }else{
        return locationID
    }
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

    getUserLimit();

    //Toolbar Bottom
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
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    //Select
    $.fn.select2.defaults.set("width", "100%");
    var $select = $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: false
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

    // Tipos de usuario
    $.ajax({
        url: uri + 'core/users/functions2.php',
        method: 'POST',
        data: {
            type: 'getUserTypes'
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                $('.type').empty()
                if(data != null){
                    $.each(data, function(index, elem){
                        $('.type').append('<option value="' + elem.id + '">' + elem.name + '</option>')
                    })
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    //Pickers
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/users/listDatatables.php?all=0",
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
            {"title": "Nombre de Usuario"},
            {"title": "Nombre"},
            {"title": "E-mail"},
            {"title": "Tipo"},
            {"title": "Fecha de Baja"},
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
            "className": userType == '1' ? "editClick" : '',
            "targets": [1,2,4]
        },
        {
            "className": "email" + (userType == '1' ? " editClick" : ''),
            "targets": 3,
            "render": function (data, type, row) {
                if(type==='display'){
                    return '<a href="mailto:'+data+'"  title="Enviar correo">'+data+'</a>';
                }else{
                    return data;
                }
            }
        },
        {
            "className": "date" + (userType == '1' ? " editClick" : ''),
            "targets": 5,
            "render": function(data, type,){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "details-control centered" + (userType == '1' ? " editClick" : ''),
            "targets": 6,
            "visible": userType == '1' ? true : false,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(userType == '1'){
                    return "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "details-control centered" + (userType == '1' ? " removeClick" : ''),
            "targets": 7,
            "visible": userType == '1' ? true : false,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function(data, type, row){
                if(userType == '1' && row[0] != user[0].userID){
                    return data[5] == null ? "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' data-toggle='tooltip' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>" : ''
                }
                return '-'
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5],
                search: 'applied',
                order: 'applied'
            },
            filename: 'usuarios',
            title: 'Usuarios',
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
            filename: 'usuarios',
            title: 'Usuarios',
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
                            text: 'Listado de usuarios',
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
        "order": [[0, 'desc']],
        initComplete: function(){
            if(company != '1' && company != '8'){
                if(table.rows().count() >= userLimit){
                    limitOvercome = true;
                    $("#userLimitOvercomeDiv").removeClass('hide');
                    $("#importUsersSection").remove();
                }else{
                    $("#userLimitOvercomeDiv").remove();
                    $("#importUsersSection").removeClass('hide');
                }
            }

            //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
            $('#input-search').on( 'keyup', function () {
                table.search( this.value ).draw();
            });
        }
    });

    //Mostrar dados de baja
    $('#showDeleted').change(function(){
        if($('#showDeleted').prop('checked')){
            table.ajax.url(uri+"core/users/list.php?all=1").load()         
        }else{
            table.ajax.url(uri+"core/users/list.php?all=0").load()
        }
    })

    $("#createUserButton").click(function(){
        if(!limitOvercome){
            $("#modal-new-user").modal("show")
        }else{
            $("#user-limit-overcome").modal("show")
        }
    });

    //Create. Nuevo usuario
    $('#saveNewUser').click(function(){
        // Validaciones
        var validate = 0;
        
        if(isEmpty($('#formNewData #username'))){
            validate++;
        }
        if(isEmpty($('#formNewData #password'))){
            validate++;
        }else{
            if(!isPassword($('#formNewData #password'))){
                validate++;
            }
        }
        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
      
        if(isEmpty($('#formNewData #nif'))){
            validate++;
        }else{
            if(!isNifCif($("#formNewData #nif"))){
                validate++
            }
        }
        
        if(isEmpty($('#formNewData #type'))){
            validate++;
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
            var location = $("#formNewData #location").val();

            //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
            if(location=="undefined" || location=="" ||  location==null){
                location = "null";
            }
            var type = $("#formNewData #type").val();
            var post = $("#formNewData #post").val();
            var username = $("#formNewData #username").val();
            var password = $("#formNewData #password").val();
            var nif = $("#formNewData #nif").val();
            var name = $("#formNewData #name").val();
            var surname = $("#formNewData #surname").val();
            var address = $("#formNewData #address").val();
            var mail = $("#formNewData #mail").val();

            //Obtenemos los teléfonos con el formato "NUMERO1-NUMERO2"
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });

            //Eliminamos el último delimitador "-" de los teléfonos
            phones=phones.slice(0,-1);
            var entryDate = $("#formNewData #entryDate").val();
            if(moment(entryDate, "DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate ="NULL";
            }

            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/users/create.php", {location: location, type: type, post: post, username: username, password: password, nif: nif, name: name, surname: surname, address: address, mail: mail, phones: phones, entryDate: entryDate}, function(data){
                data = $.parseJSON(data)
                if(data["success"]){
                    table.ajax.reload();
                    $('#modal-new-user').modal('hide');
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El usuario se ha creado con éxito.</div>');
                }else if(data["cif"]){
                    $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un usuario con ese NIF.</div>');
                }else if(data["username"]){
                    $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un usuario con ese nombre de usuario.</div>');
                }else if(data["email"]){
                    $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un usuario con ese email.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-user').modal('hide');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                    $('#formNewData #msg').empty()
                }, 5000)
            });
           
        }else{
            $('#modal-new-user #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-user #warning-message').empty()
            }, 3500)
        }
    });

    //Edit. Acción editar un usuario
    table.on('click', 'tbody .editClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri+"core/users/read.php", {userID: rowClick[0]}, function(data){
            //Convertimos formato json para poder recorrer y obtener los datos
            data = $.parseJSON(data);
            
            $('#formEditData #userID').val(data[0].userID);
            $('#formEditData #name').val(data[0].userName); 
            $('#formEditData #nif').val(data[0].nif); 
            $('#formEditData #surname').val(data[0].surname); 
            $('#formEditData #address').val(data[0].address);

            if(data[0].locationID != null){
                if ($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length) {
                    $('#formEditData #location').val(data[0].locationID).trigger('change');
                } else { 
                    // Creamos la nueva opción DOM para preseleccionarlo por defecto
                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true);
                    //Lo añadimos al select
                    $('#formEditData #location').append(newOption).trigger('change');
                }
            }
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
                    if(data[0].postalCode == null){
                        data[0].postalCode = ''
                    }
                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true)
                    $('#formEditData #location').append(newOption).trigger('change')
                }
            }

            $('#formEditData #mail').val(data[0].mail);

            $('#formEditData .phone').val('');
            var arrayPhones;
            if(data[0].phones != null && data[0].phones != ""){
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
            $('#formEditData #username').val(data[0].username);
            $("#formEditData #type").val(data[0].type).trigger('change');
            $('#formEditData #post').val(data[0].post);
            $('#formEditData #entryDate').val(data[0].entryDate);
        });

        //Mostramos la modal
        $('#modal-edit-user').modal('show');
    });
    
    //Update. Actualizamos los datos del usuario tras la acción "editar"
    $('#saveEditUser').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
       
        if(isEmpty($('#formEditData #nif'))){
            validate++;
        }else{
            if(!isNifCif($("#formEditData #nif"))){
                validate++
            }
        }
        
        if(isEmpty($('#formEditData #type'))){
            validate++;
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud update
            var userID = $("#formEditData #userID").val();
            var location = $("#formEditData #location").val();

            //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
            if(location=="undefined" || location=="" || location == null){
                location = "NULL";
            }
            var type = $("#formEditData #type").val();
            var post = $("#formEditData #post").val();
            var username = $("#formEditData #username").val();
            var password = $("#formEditData #password").val();
            var nif = $("#formEditData #nif").val();
            var name = $("#formEditData #name").val();
            var surname = $("#formEditData #surname").val();
            var address = $("#formEditData #address").val();
            var mail = $("#formEditData #mail").val();

            //Obtenemos los teléfonos con el formato "NUMERO1-NUMERO2"
            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });

            //Eliminamos el último delimitador "-" de los teléfonos
            phones=phones.slice(0,-1);
            var entryDate = $("#formEditData #entryDate").val();
            if(moment(entryDate, "DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate ="NULL";
            }
            $.post(uri+"core/users/update.php", {userID: userID, location: location, type: type, post: post, username: username, password: password, nif: nif, name: name, surname: surname, address: address, mail: mail, phones: phones, entryDate: entryDate}, function(data){
                data = $.parseJSON(data)
                if(data["success"]){
                    table.ajax.reload();
                    $('#modal-edit-user').modal('hide');
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del usuario se han actualizado con éxito.</div>');
                }else if(data["cif"]){
                    $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un usuario con ese NIF.</div>');
                }else if(data["email"]){
                    $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un usuario con ese email.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-edit-user').modal('hide');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                    $('#formEditData #msg').empty()
                }, 5000)
            });
            
        }else{
            $('#modal-edit-user #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-user #warning-message').empty()
            }, 3500)
        }
    });
    
    //Delete. Eliminamos un usuario
    table.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(parseInt(rowClick[0]) == 100  || parseInt(rowClick[0]) == 1){
            return false
        }

        if(rowClick[5] == null){
            if(confirm("¿Está seguro de que quiere borrar el usuario " + rowClick[1] + "?")){
                $.post(uri+"core/users/delete.php", {userID: rowClick[0]}, function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El usuario se ha eliminado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    //Recargamos la tabla con los nuevos datos
                    table.ajax.reload();
                });
            }
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
    $('#modal-new-user').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('.phones').html('');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $("#formNewData #province").val('').trigger('change');
        $("#formNewData #location").attr('disabled', true)
        $("#formNewData #type").val('').trigger('change');
        $("#formNewData #post").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-user #warning-message').empty()
    });

    $('#modal-edit-user').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('.phones').html('');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }
        $("#formEditData #province").val('').trigger('change');
        $("#formEditData #location").attr('disabled', true)
        $("#formEditData #type").val('').trigger('change');
        $("#formEditData #post").val('').trigger('change');
        clean("formEditData");
        $('#modal-edit-user #warning-message').empty()
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/users/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/users/template.csv', '_blank')
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
                url: uri + 'core/users/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/users/list.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/users/list.php').load()

                        $.each(data, function(index, value){

                            if(
                                value == "Número de columnas incorrecto. Las columnas son: ID, Nombre de Usuario, Contraseña, Nombre, Apellidos, NIF, Dirección, Provincia, Localidad, Email, Teléfonos, Puesto, Tipo de Usuario"
                                || value == 'Se ha alcanzado el número máximo de usuarios permitidos.'
                            ){
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