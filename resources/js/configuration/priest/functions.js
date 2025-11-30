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

/**
 * Obtiene los datos de una iglesia
 * 
 * @param {int} churchID ID de la iglesia
 * @return {array} church Datos de la iglesia
 */
function getChurch(churchID){
    var church
    $.ajax({
        url: uri+"core/churches/functions.php",
        data: {churchID: churchID},
        type: 'POST',
        async: false,
        success: function (data) {
            church = $.parseJSON(data)
        }
    })
    return church
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
    $('#backLink').click(function(event) {
        event.preventDefault()
        history.back(1)
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // BOTÓN "ARRIBA"
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

    // IGLESIAS
    $('.church').select2({
        containerCssClass: 'select2-church',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/churches/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.churchID
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

    // ICHECK
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    })

    // CURAS
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/priests/listDatatables.php",
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
            {"title": "Zona"},
            {"title": "Parroquia"},
            {"title": "Teléfono casa"},
            {"title": "Teléfono móvil"},
            {"title": "Teléfono otro"},
            {"title": "Email"},
            {"title": "Teléfonos"},
            {"title": "Iglesias"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [
        {
            "className": "id",
            "targets": [0, 5, 6, 7],
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [1,2,3,4,8,10]
        },
        {
            'targets' : 9,
            'render' : function(data, type, row){
                var homePhone = row[5]
                var mobilePhone = row[6]
                var otherPhone = row[7]

                if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                    return 'Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                    return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                    return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                    return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a>'
                }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                    return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                    return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                    return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                }else{
                    return ''
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 12,
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
                columns: [1,2,3,4,8,9,10],
                search: 'applied',
                order: 'applied'
            },
            filename: 'curas',
            title: 'Curas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4,8,9,10],
                search: 'applied',
                order: 'applied'
            },
            filename: 'curas',
            title: 'Curas',
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
                            text: 'Listado de curas',
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
                columns: [1,2,3,4,8,9,10],
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

    // CURAS - BÚSQUEDA
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // CURAS - NUEVO
    $('#saveNewPriest').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #name'))){
            validate++
        }
        if($("#formNewData #nif").val()!=""){
            if(!isNifCif($("#formNewData #nif"))){
                validate++
            }
        }
        if($("#formNewData #email").val()!=""){
            if(!isEmail($("#formNewData #email"))){
                validate++
            }
        }
        if($("#formNewData #homePhone").val()!=""){
            if(!isPhone($("#formNewData #homePhone"))){
                validate++
            }
        }
        if($("#formNewData #mobilePhone").val()!=""){
            if(!isPhone($("#formNewData #mobilePhone"))){
                validate++
            }
        }
        if($("#formNewData #otherPhone").val()!=""){
            if(!isPhone($("#formNewData #otherPhone"))){
                validate++
            }
        }

        if(validate == 0){
            var name = $("#formNewData #name").val()
            var surname = $("#formNewData #surname").val()
            var address = $("#formNewData #address").val()
            var nif = $("#formNewData #nif").val()
            var location = $("#formNewData #location").val()
            if(location == "undefined" || location == "" || location == null){
                location = "NULL"
            }
            var area = $("#formNewData #area").val()
            var parish = $("#formNewData #parish").val()
            var email = $("#formNewData #email").val()
            var homePhone = $("#formNewData #homePhone").val()
            var mobilePhone = $("#formNewData #mobilePhone").val()
            var otherPhone = $("#formNewData #otherPhone").val()
            var churches = []
            $('#formNewData .churches .label').each(function(){
                var church = $(this).find('.number').parent().find('[type=hidden]').val()
                churches.push(church)
            })
            
            $.ajax({
                url: uri + 'core/priests/create.php',
                method: 'POST',
                data: {
                    name : name,
                    surname : surname,
                    address : address,
                    nif : nif,
                    location : location,
                    area : area,
                    parish : parish,
                    email: email,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    churches : churches
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cura se ha creado con éxito.</div>');
                        $('#modal-new-priest').modal('hide');
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cura con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-priest').modal('hide');                   
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-priest').modal('hide');    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-priest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-priest #warning-message').empty()
            }, 3500)
        }
    })

    // CURAS - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/priests/read.php',
            method : 'POST',
            data : {
                priestID: rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)

                $('#formEditData #priestID').val(data[0].priestID)
                $('#formEditData #name').val(data[0].priestName) 
                $('#formEditData #surname').val(data[0].surname) 
                $('#formEditData #address').val(data[0].address)
                $('#formEditData #nif').val(data[0].nif)
                $('#formEditData #email').val(data[0].email)
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
                    if($('#formEditData #location').find("option[value='" + data[0].locationID + "']").length){
                        $('#formEditData #location').val(data[0].locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true)
                        $('#formEditData #location').append(newOption).trigger('change')
                    }
                }
                $('#formEditData #area').val(data[0].area)
                $('#formEditData #parish').val(data[0].parish)
                $('#formEditData #homePhone').val(data[0].homePhone)
                $('#formEditData #mobilePhone').val(data[0].mobilePhone)
                $('#formEditData #otherPhone').val(data[0].otherPhone)
                $("#formEditData .churches").empty()
                if(data[1] != null){                    
                    data[1].forEach(function(elem){
                        $('#formEditData .churches').append(
                            '<span class="label label-default small labelPhones">' +
                            '   <input type="hidden" value="' + elem.church + '">' +
                            '   <span class="number">' + elem.name + '</span> ' +
                            '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                            '</span><br>')
                    })

                    $('.churches .label .btn-remove').on('click', function(){
                        $(this).parent('.label').remove()
                    })
                }

                $('#modal-edit-priest').modal('show')
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })
    
    // CURAS - MODIFICAR
    $('#saveEditPriest').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }
        if($("#formEditData #nif").val()!=""){
            if(!isNifCif($("#formEditData #nif"))){
                validate++
            }
        }
        if($("#formEditData #email").val()!=""){
            if(!isEmail($("#formEditData #email"))){
                validate++
            }
        }
        if($("#formEditData #homePhone").val()!=""){
            if(!isPhone($("#formEditData #homePhone"))){
                validate++
            }
        }
        if($("#formEditData #mobilePhone").val()!=""){
            if(!isPhone($("#formEditData #mobilePhone"))){
                validate++
            }
        }
        if($("#formEditData #otherPhone").val()!=""){
            if(!isPhone($("#formEditData #otherPhone"))){
                validate++
            }
        }

        if(validate == 0){
            var priestID = $("#formEditData #priestID").val()
            var name = $("#formEditData #name").val()
            var surname = $("#formEditData #surname").val()
            var address = $("#formEditData #address").val()
            var nif = $("#formEditData #nif").val()
            var location = $("#formEditData #location").val()
            if(location == "undefined" || location == "" || location == null){
                location = "NULL"
            }
            var area = $("#formEditData #area").val()
            var parish = $("#formEditData #parish").val()
            var email = $("#formEditData #email").val()
            var homePhone = $("#formEditData #homePhone").val()
            var mobilePhone = $("#formEditData #mobilePhone").val()
            var otherPhone = $("#formEditData #otherPhone").val()
            var churches = []
            $('#formEditData .churches .label').each(function(){
                var church = $(this).find('.number').parent().find('[type=hidden]').val()
                churches.push(church)
            })

            $.ajax({
                url : uri + 'core/priests/update.php',
                method : 'POST',
                data : {
                    priestID: priestID,
                    name : name,
                    surname : surname,
                    address : address,
                    nif : nif,
                    location : location,
                    area : area,
                    parish : parish,
                    email : email,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    churches : churches
                },
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload();
                        $('#modal-edit-priest').modal('hide');
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del cura se han actualizado con éxito.</div>');
                    }else if(data["cif"]){
                        $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cura con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-edit-priest').modal('hide');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-edit-priest').modal('hide');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-edit-priest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-priest #warning-message').empty()
            }, 3500)
        }
    })
    
    // CURAS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere borrar el cura " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/priests/delete.php',
                method: 'POST',
                data: {
                    priestID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    
                    if(data){
                        table.ajax.reload()
                        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cura se ha eliminado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
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
    })

    // IGLESIAS - AÑADIR
    $('.btn-add-church').click(function(){

        var modalForm = $(this).attr("modal");

        if($('#' + modalForm + ' #church').val() != null){
            var church = $(this).parent().parent().find('#church').val()
            var churchName = $(this).parent().parent().find('#church').text()
    
            $('#' + modalForm + ' .churches').append(  
                '<span class="label label-default small labelPhones">' +
                '   <input type="hidden" value="' + church + '">' +
                '   <span class="number">' + churchName + '</span> ' +
                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                '<br></span>')
    
            if(!$('#' + modalForm + ' .churches').hasClass('in')){
                $('#' + modalForm + ' .churches').addClass('in')
            }
    
            $('#' + modalForm + ' .churches .label .btn-remove').click(function(){
                $(this).parent('.label').remove()
            })
    
            $('#' + modalForm + ' #church').empty().trigger('change')
        }
    });

    // MODALES
    $('#modal-new-priest').on('show.bs.modal', function (e) {
        $("#formNewData .churches").empty()
        $('.location').prop('disabled', true)
    })
    
    $('#modal-new-priest').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $("#formNewData #church").val('').trigger('change')
        $("#formNewData .churches").empty()
        clean("formNewData")
        $('#modal-new-priest #warning-message').empty()
    })

    $('#modal-edit-priest').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $("#formEditData #church").val('').trigger('change')
        $("#formEditData .churches").empty()
        clean("formEditData")
        $('#modal-edit-priest #warning-message').empty()
    })

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/priests/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/priests/template.csv', '_blank')
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
                url: uri + 'core/priests/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/priests/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/priests/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Apellidos, NIF, Dirección, Provincia, Localidad, Zona, Parroquia, Teléfono, Teléfono Móvil, Otro Teléfono, Iglesias"){
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