function getUserID(){
    var user;
    $.ajax({

        url: uri+"core/users/functions2.php",
        data: {type: 'getUser'},
        type: 'POST',
        async: false,
        success: function (data) {
            user = $.parseJSON(data);            
        }
    });
    return user[0].userID;
}

var userId = getUserID()

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

//Función que pasando como parámetro el ID se obtienen todos los datos (cp, provincia...)
function getLocation(locationID) {
    var location;
    $.ajax({
        url: uri+"core/locations/functions.php",
        data: {locationID: locationID, type: 'getLocationsByID'},
        type: 'POST',
        async: false,
        success: function (data) {
            location = $.parseJSON(data);
        }
    });
    return location;
}

/*
 * Function for adjust dimmensions fixed static toolbar
 */ 
function setWidthBottomToolbar(){    
    //Vertical Scrollbar
    var scrollHeight = document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var hasVerticalScrollbar = scrollHeight > clientHeight;
   
    var wWindow = window.innerWidth;
    var wSidebar = $(".main-sidebar").innerWidth();
    if(hasVerticalScrollbar){
        $(".footer-static-bottom").innerWidth(wWindow-wSidebar-12);
    }else{
        $(".footer-static-bottom").innerWidth(wWindow-wSidebar);
    }
    $(".footer-static-bottom").css("left",wSidebar);
    return true;
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })
    
    //Select2
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

    //Función para cargar los datos del perfil de usuario
    function getUserProfile(){
        $.post(uri+"core/users/profile/read.php", function(data){
            data = $.parseJSON(data);

            //Cargamos los datos en el formulario Edit Data
            $('#formEditData #userID').val(data[0].userID);
            $('#formEditData #name').val(data[0].name); 
            $('#formEditData #nif').val(data[0].nif); 
            $('#formEditData #surname').val(data[0].surname); 
            $('#formEditData #address').val(data[0].address);
            if(data[0].province == null){
                $('.location').prop('disabled', true)
            }else{
                province = data[0].province
                $("#formEditData #province option[value='']").attr('disabled', true)
                $('#formEditData #province').val(data[0].province)
            }
            if(data[0].locationID != null){
                if($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length){
                    $('#formEditData #location').val(data[0].locationID).trigger('change')
                }else{ 
                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true)
                    $('#formEditData #location').append(newOption).trigger('change')
                }
            }
            $('#formEditData #mail').val(data[0].mail);
            $('#formEditData #username').val(data[0].username);
            $('#formEditData #password').val('');
            $("#formEditData #type").val(data[0].userTypeID).trigger('change');
            $('#formEditData #post').val(data[0].post);
            $('#formEditData #entryDate').val(data[0].entryDate);

            //Obtenemos el id del usuario para cargar sus datos de localidad
            var userID = $('#formEditData #userID').val(); 

            $('#formEditData .phone').val('');
            $('#formEditData .phones.in').empty();

            if(data[0].phones != "" && data[0].phones != null){
                var arrayPhones = data[0].phones.split("-");

                for (var i=0; i < arrayPhones.length; i++){
                    $('#formEditData .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                }                
                if(!$('#formEditData .phones').hasClass('in')){
                    $('#formEditData .phones').addClass('in');
                }
                $('#formEditData #phones').val(data[0].phones);
            }

            //Cargamos los datos en el apartado "Sobre Mí" de la página
            $('.box-body #profile-username').html(data[0].username);
            $('.box-body #name').html(data[0].name);
            $('.box-body #surname').html(data[0].surname);
            $('.box-body #post').html(data[0].post);
            $('.box-body #type').html(data[0].userTypeName);
            $('.box-body #nif').html(data[0].nif);
            $('.box-body #mail').html(data[0].mail);
            $('.box-body #mail').attr('href',"mailto:"+data[0].mail);
        });
    }

    //Cargamos los datos de usuario tanto el formulario formEditData como en el apartado de la página "Sobre Mí"
    getUserProfile();
    
    //Update. Actualizamos los datos del usuario tras la acción "editar"
    $('#saveEditProfile').click(function(){
        //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud update
        if($("#formEditData #password").val() != ""){
            if(!checkPassword($("#formEditData #password"))){
                return false
            }else{
                var password
                $("#formEditData #password").val() != "" ? password = $("#formEditData #password").val() : password = 'null'
        
                $.post(uri+"core/users/profile/update.php", {password: password}, function(data){
                    //Recargamos los datos del perfil de usuario ficha "Sobre Mi"
                    getUserProfile();
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del usuario se han actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                });

                //ocultamos la ventana modal
                $('#modal-edit-profile').modal('hide');
            }
        }else{
            $('#block-message-modal').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debes introducir una contraseña para poder guardar</div>');
            setTimeout(function(){
                $('#block-message-modal').empty()
            }, 5000)
        }
    });

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#logs-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/users/profile/list.php?user=" + userId,
        "responsive": false,      
        "paging": true,
        "pageLength": 15,
        "searching": true,
        "ordering": true,
        "autoWidth": true,
        "language": {
        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "Fecha"},
            {"title": "Usuario"},
            {"title": "Acción"},
            {"title": "Descripción"}
        ],
        "columnDefs": [{
            "className": "date",
            "targets": [0],
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        }],
        "dom": 'rt<"centered"p><"clear">',
        "order": [[0, 'desc']]
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
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
});