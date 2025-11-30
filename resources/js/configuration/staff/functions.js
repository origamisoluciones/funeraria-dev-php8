/**
 * Select2 function for remote data
 * 
 * @param {array} data
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Obtiene los puestos de trabajo
 * 
 * @return {array} posts Puestos de trabajo
 */
function getPosts(){
    var posts
    $.ajax({
        url: uri + 'core/staff/functions.php',
        method: 'POST',
        data: {
            type: 'getPosts'
        },
        async: false,
        success: function(data){
            try{
                posts = $.parseJSON(data)
            }catch(e){
                posts = null
            }
        }
    })
    return posts
}

/**
 * Obtiene los usuarios disponibles
 * 
 * @return {array} users Usuarios
 */
function getUsersNew(){
    var users

    $.ajax({
        url: uri + 'core/staff/functions.php',
        method: 'POST',
        data: {
            type: 'getUsersNew'
        },
        async: false,
        success: function(data){
            try{
                users = $.parseJSON(data)
            }catch(e){
                users = null
            }
        },
        error: function(){
            users = null
        }
    })

    return users
}

/**
 * Obtiene los usuarios disponibles
 * 
 * @param {int} staff Personal
 * @return {array} users Usuarios
 */
function getUsersUpdate(staff){
    var users

    $.ajax({
        url: uri + 'core/staff/functions.php',
        method: 'POST',
        data: {
            type: 'getUsersUpdate',
            staff: staff
        },
        async: false,
        success: function(data){
            try{
                users = $.parseJSON(data)
            }catch(e){
                users = null
            }
        },
        error: function(){
            users = null
        }
    })

    return users
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
    // TOOLBAR BOTTOM
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

    //Pickers
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
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

    // PERSONAL
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/staff/listDatatables.php",
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
            {"title": "Código"},
            {"title": "Nombre"},
            {"title": "Apellidos"},
            {"title": "NIF"},
            {"title": "Localidad"},
            {"title": "Correo"},
            {"title": "Teléfonos"},
            {"title": "Extension"},
            {"title": "Puestos"},
            {"title": "Formación"},
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
            'className' : 'editClick',
            'targets' : [1,2,3,4,5,6,8,9]
        },
        {
            'targets' : 7,
            'render' : function(data, type, row){
                var print = ''
                if(data != null || data != ''){
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
            "targets": 9,
            "orderable": false,
            "searchable": false,
            "width": "20%"
        },
        {
            "className": "details-control centered training-test",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-training cursor-pointer' title='Formación'><i class='fa fa-book' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 12,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                if(row[0] == '1' || row[0] == 1){
                    return '-'
                }
                return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                search: 'applied',
                order: 'applied'
            },
            filename: 'personal',
            title: 'Personal',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                search: 'applied',
                order: 'applied'
            },
            filename: 'personal',
            title: 'Personal',
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
                            text: 'Listado de personal',
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
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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

    // PERSONAL - BUSCAR
    $('#input-search').on('keyup', function (){
        table.search( this.value ).draw()
    })

    // PERSONAL - NUEVO
    var posts = getPosts()
    
    $('#newStaff').click(function(){
        $('#posts').empty()
        
        if(posts != null){
            $.each(posts, function(index, elem){
                $('#posts').append('<input type="checkbox" id="post' + elem.ID + '"> <label for="post' + elem.ID + '">' + elem.name + '</label><br>')
            })
        }

        $('#modal-new-staff #user').empty()

        var users = getUsersNew()
        if(users == null){
            $('#modal-new-staff #user').append('<option value="-">-</option>')
        }else{
            $('#modal-new-staff #user').append('<option value=  "-">-</option>')
            $.each(users, function(index, elem){
                if(elem.surname == null){
                    $('#modal-new-staff #user').append('<option value="' + elem.userID + '">' + elem.name + '</option>')
                }else{
                    $('#modal-new-staff #user').append('<option value="' + elem.userID + '">' + elem.name + ' ' + elem.surname + '</option>')
                }
            })
        }

        $('#modal-new-staff').modal('show')
    })

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
    })

    $('.phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove()
    })

    $('#saveNewStaff').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #code'))){
            validate++
        }
        if(isEmpty($('#formNewData #name'))){
            validate++
        }

        if(!isEmpty($('#formNewData #nif'))){
            if(!isNifCif($('#formNewData #nif'))){
                validate++
            }
        }else{
            validate++;
        }

        if($('#formNewData #email').val() != ''){
            if(!isMail($('#formNewData #email'))){
                validate++
            }
        }

        if(validate == 0){
            var code = $('#formNewData #code').val()
            var name = $('#formNewData #name').val()
            var surname = $('#formNewData #surname').val()
            var nif = $('#formNewData #nif').val()
            var nuss = $('#formNewData #nuss').val()
            var address = $('#formNewData #address').val()
            var location = $("#formNewData #location").val()
            var email = $('#formNewData #email').val()
            var phones = ""
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text()
                phones += number+"-"
            })
            phones = phones.slice(0, -1)
            var extension = $('#formNewData #extension').val()
            var accountNumber = $('#formNewData #accountNumber').val()
            var checksPost = new Object
            $('#formNewData #posts input:checkbox').each(function(index, elem){
                var checked = $(this).prop('checked')
                var id = $(this).attr('id').split('post')[1]
                checksPost[id] = checked
            })
            var user = $("#formNewData #user").val()

            var dischargeDay = ''
            if($('#formNewData #dischargeDay').val() != null && $('#formNewData #dischargeDay').val() != ''){
                dischargeDay = moment($('#formNewData #dischargeDay').val(), 'DD/MM/YYYY').format('X')
            }

            $.ajax({
                url: uri + 'core/staff/create.php',
                method: 'POST',
                data: {
                    code: code,
                    name: name,
                    surname: surname,
                    nif: nif,
                    nuss: nuss,
                    address: address,
                    location: location,
                    email: email,
                    phones: phones,
                    extension: extension,
                    accountNumber: accountNumber,
                    user: user,
                    dischargeDay: dischargeDay,
                    checksPost: JSON.stringify(checksPost)
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El personal se ha creado con éxito.</div>');
                        $('#modal-new-staff').modal('hide')
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un alguien en el personal con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-staff').modal('hide')       
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-staff').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

           
        }else{
            $('#modal-new-staff #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-staff #warning-message').empty()
            }, 3500)
        }
    })

    // PERSONAL - EDITAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        $.ajax({
            url: uri + 'core/staff/read.php',
            method: 'POST',
            data: {
                id: rowClick[0]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    var posts = getPosts()
                    $('#formEditData #posts').empty()
                    if(posts != null){
                        $.each(posts, function(index, elem){
                            $('#formEditData #posts').append('<input type="checkbox" id="post' + elem.ID + '"> <label for="post' + elem.ID + '">' + elem.name + '</label><br>')
                        })
                    }
                    $.each(data.checkPosts, function(index, elem){
                        var checked = elem.value == 0 ? false : true
                        $('#formEditData #post' + elem.post).prop('checked', checked)
                    })


                    $('#modal-edit-staff #user').empty()
                    var users = getUsersUpdate(rowClick[0])
                    if(users == null){
                        $('#modal-edit-staff #user').append('<option value="-">-</option>')
                    }else{
                        $('#modal-edit-staff #user').append('<option value="-">-</option>')
                        $.each(users, function(index, elem){
                            if(elem.surname == null){
                                $('#modal-edit-staff #user').append('<option value="' + elem.userID + '">' + elem.name + '</option>')
                            }else{
                                $('#modal-edit-staff #user').append('<option value="' + elem.userID + '">' + elem.name + ' ' + elem.surname + '</option>')
                            }
                        })
                    }

                    if(data.user == null){
                        $('#formEditData #user').val('-')
                    }else{
                        $('#formEditData #user').val(data.user)
                    }

                    $('#formEditData #staffID').val(data.ID)
                    $('#formEditData #code').val(data.code)
                    $('#formEditData #name').val(data.name)
                    $('#formEditData #surname').val(data.surname)
                    $('#formEditData #nif').val(data.nif)
                    $('#formEditData #nuss').val(data.nuss)
                    $('#formEditData #address').val(data.address)
                    if(data.dischargeDay != '' &&  data.dischargeDay != null){
                        $('#formEditData #dischargeDay').val(moment(data.dischargeDay, 'X').format('DD/MM/YYYY'))
                    }
                    if(data.downDate != '' &&  data.downDate != null){
                        $('#formEditData #downDate').val(moment(data.downDate, 'X').format('DD/MM/YYYY'))
                    }
                    if(data.province == null){
                        $("#formEditData #province option[value='']").attr('disabled', false)
                        $('.location').prop('disabled', true)
                    }else{
                        province = data.province
                        $("#formEditData #province option[value='']").attr('disabled', true)
                        $('#formEditData #province').val(data.province)
                        $('.location').prop('disabled', false)
                    }
                    if(data.locationID != null){
                        $('.location').prop('disabled', false)
                        if($('#formEditData #location').find("option[value='" + data.locationID + "']").length){
                            $('#formEditData #location').val(data.locationID).trigger('change')
                        }else{
                            var newOption = new Option(data.locationName + ' - ' + data.postalCode, data.locationID, true, true)
                            $('#formEditData #location').append(newOption).trigger('change')
                        }
                    }
                    $('#formEditData #email').val(data.email)
                    $('#formEditData .phone').val('');
                    if(data.phones!=""){
                        var arrayPhones;
                        if(data.phones != null){
                            arrayPhones = data.phones.split("-");
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
                        $('#formEditData #phones').val(data.phones);
                    }
                    $('#formEditData #extension').val(data.extension)
                    $('#formEditData #accountNumber').val(data.accountNumber)

                    $('#modal-edit-staff').modal('show')
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
    })

    $('#saveEditStaff').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #code'))){
            validate++
        }
        if(isEmpty($('#formEditData #name'))){
            validate++
        }
        if(!isEmpty($('#formEditData #nif'))){
            if(!isNifCif($('#formEditData #nif'))){
                validate++
            }
        }else{
            validate++;
        }
        if($('#formEditData #email').val() != ''){
            if(!isMail($('#formEditData #email'))){
                validate++
            }
        }

        if(validate == 0){
            var id = $('#formEditData #staffID').val()
            var code = $('#formEditData #code').val()
            var name = $('#formEditData #name').val()
            var surname = $('#formEditData #surname').val()
            var nif = $('#formEditData #nif').val()
            var nuss = $('#formEditData #nuss').val()
            var address = $('#formEditData #address').val()
            var location = $("#formEditData #location").val()
            var email = $('#formEditData #email').val()
            var phones = ""
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text()
                phones += number+"-"
            })
            phones = phones.slice(0, -1)
            var extension = $('#formEditData #extension').val()
            var accountNumber = $('#formEditData #accountNumber').val()
            var user = $('#formEditData #user').val()
            var checksPost = new Object
            $('#formEditData #posts input:checkbox').each(function(index, elem){
                var checked = $(this).prop('checked')
                var id = $(this).attr('id').split('post')[1]
                checksPost[id] = checked
            })

            var dischargeDay = ''
            if($('#formEditData #dischargeDay').val() != null && $('#formEditData #dischargeDay').val() != ''){
                dischargeDay = moment($('#formEditData #dischargeDay').val(), 'DD/MM/YYYY').format('X')
            }

            var downDate = ''
            if($('#formEditData #downDate').val() != null && $('#formEditData #downDate').val() != ''){
                downDate = moment($('#formEditData #downDate').val(), 'DD/MM/YYYY').format('X')
            }

            $.ajax({
                url: uri + 'core/staff/update.php',
                method: 'POST',
                data: {
                    id: id,
                    code: code,
                    name: name,
                    surname: surname,
                    nif: nif,
                    nuss: nuss,
                    address: address,
                    location: location,
                    email: email,
                    phones: phones,
                    extension: extension,
                    accountNumber: accountNumber,
                    user: user,
                    dischargeDay: dischargeDay,
                    downDate: downDate,
                    checksPost: JSON.stringify(checksPost)
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload();
                        $('#modal-edit-staff').modal('hide')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos personal se han actualizado con éxito.</div>');
                    }else if(data["cif"]){
                        $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe alguie entre el personal con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-edit-staff').modal('hide')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-edit-staff').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
        }else{
            $('#modal-edit-staff #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-staff #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        if(parseInt(rowClick[0]) == 1){
            return false
        }

        if(confirm("¿stá seguro de que quiere borrar el personal " + rowClick[2] + " " + rowClick[3] + "?")){
            $.ajax({
                url: uri + 'core/staff/delete.php',
                method: 'POST',
                data: {
                    id: rowClick[0]
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        if(data){
                            table.ajax.reload();
                            
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El personal se ha eliminado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
    
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
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
        }
    });

    // PERSONAL - FORMACIÓN
    table.on('click', 'tbody .training-test', function(){
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        window.location.href = uri + 'configuracion/personal/formacion/' + rowClick[0];
    })

    // MODALES
    $('#modal-new-staff').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('')
        $('.phones').html('')
        $(".location").val('').trigger('change');
        $(".province").val('').trigger('change');
        $(".location").attr('disabled', true);
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in')
        }
        clean("formNewData")
        $('#modal-new-staff #warning-message').empty()
    })

    $('#modal-edit-staff').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('')
        $('.phones').html('')
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in')
        }
        $(".location").val('').trigger('change');
        $(".province").val('').trigger('change');
        $(".location").attr('disabled', true);
        clean("formEditData")
        $('#modal-edit-staff #warning-message').empty()
    })

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/staff/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/staff/template.csv', '_blank')
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
                url: uri + 'core/staff/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/staff/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/staff/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Código, Nombre, Apellidos, NIF, NUSS, Dirección, Provincia, Localidad, Email, Extensión Telefónico, Núm. Cuenta, Usuario asociado, Puestos"){
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