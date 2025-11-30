/**
 * Select2 function for remote data
 * 
 * @param {array} data
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Obtiene las categorías de teléfonos
 */
function getPhonesCategories(){
    $.ajax({
        url : uri + 'core/phones/functions.php',
        method : 'POST',
        data : {
            type : 'getPhonesCategories'
        },
        async : false,
        success : function(data){
            data = $.parseJSON(data)

            if(data != null){
                $.each(data, function(index, elem){
                    $('#phonesCategories').append('<option value="' + elem.ID + '">' + elem.name + '</option>')
                    $('#categories').append('<option value="' + elem.ID + '">' + elem.name + '</option>')
                })
                $('#phonesCategories').append('<option value="null" selected>Todos</option>')
            }
        }
    })
}

/**
 * Obtiene el nombre de una categoría
 * 
 * @param {int} ID ID de la categoría
 * @return {array} data Datos de la categoría
 */
function getCategory(ID){
    var category
    
    $.ajax({
        url : uri + 'core/phones/functions.php',
        method : 'POST',
        data : {
            type : 'getCategory',
            ID : ID
        },
        async : false,
        success : function(data){
            category = $.parseJSON(data)
        },
        error : function(){
            category = [null, null]
        }
    })
    
    return category
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
    // Toolbar Bottoms
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

    getPhonesCategories()

    $('#phoneList').click(function(){
        window.location.href = uri + 'telefonos/categorias';
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

    var category = $('#phonesCategories').val()

    // TELÉFONOS
    var table = $('#datatable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/phones/list.php?category=" + category,
        "responsive": false,
        "select": true,
        "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '600px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Categoría"},
            {"title": "Nombre"},
            {"title": "Casa"},
            {"title": "Móvil"},
            {"title": "Otro"},
            {"title": "Fax"},
            {"title": "Localidad"},
            {"title": "Parroquia"},
            {"title": "Área"},
            {"title": "Pago"},
            {"title": "Correo"},
            {"title": "Descripción"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": [0,1],
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": [2,3,4,5,6,7,8,9,10,11,12]
        },
        {
            'targets' : [2,3,4,5,6,7,8,9,11,12],
            'render' : function(data, type, row){
                if(data == '' || data == null){
                    return '-';
                }
                return data
            }
        },
        {
            'targets' : 10,
            'render' : function(data, type, row){
                return data == 1 ? 'Si' : 'No'
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 13,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 14,
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
                columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                search: 'applied',
                order: 'applied'
            },
            filename: 'teléfonos',
            title: 'Teléfonos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                search: 'applied',
                order: 'applied'
            },
            filename: 'teléfonos',
            title: 'Teléfonos',
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
                            text: 'Listado de teléfonos',
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
                columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[0, 'asc']]
    })

    // TELÉFONOS - CATEGORÍAS
    $('#phonesCategories').change(function(){
        category = $(this).val()

        table.ajax.url(uri + 'core/phones/list.php?category=' + category).load()
    })

    // TELÉFONOS - BUSCAR
    $('#input-search').on('keyup', function (){
        table.search( this.value ).draw()
    })

    // TELÉFONOS - NUEVO
    $('#addPhones').click(function(){        
        $('#modal-new-phone').modal('show')
    })

    $('#formNewData #saveNewPhone').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #name'))){
            validate++
        }

        if($('#formNewData #homePhone').val() != ''){
            if(!isPhone($('#formNewData #homePhone'))){
                validate++
            }
        }
        if($('#formNewData #mobilePhone').val() != ''){
            if(!isPhone($('#formNewData #mobilePhone'))){
                validate++
            }
        }

        if($('#formNewData #otherPhone').val() != ''){
            if(!isPhone($('#formNewData #otherPhone'))){
                validate++
            }
        }
        if($('#formNewData #fax').val() != ''){
            if(!isPhone($('#formNewData #fax'))){
                validate++
            }
        }
        if($('#formNewData #email').val() != ''){
            if(!isMail($('#formNewData #email'))){
                validate++
            }
        }

        if(validate == 0){
            var categoryID = $('#formNewData #categories').val()
            var name = $('#formNewData #name').val()
            var homePhone = $('#formNewData #homePhone').val()
            var mobilePhone = $('#formNewData #mobilePhone').val()
            var otherPhone = $('#formNewData #otherPhone').val()
            var fax = $('#formNewData #fax').val()
            var location
            $('#formNewData #location').val() == null ? location = 'null' : location = $('#formNewData #location').val()
            var parish = $('#formNewData #parish').val()
            var area = $('#formNewData #area').val()
            var pay
            $('#formNewData #pay').prop('checked') ? pay = 1 : pay = 0
            var email = $('#formNewData #email').val()
            var description = $('#formNewData #description').val()

            $.ajax({
                url : uri + 'core/phones/create.php',
                method : 'POST',
                data : {
                    category : categoryID,
                    name : name,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    fax : fax,
                    location : location,
                    parish : parish,
                    area : area,
                    pay : pay,
                    email : email,
                    description : description
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El nuevo registro se ha creado con éxito.</div>')
                        
                        table.ajax.url(uri + 'core/phones/list.php?category=' + category).load()

                        $('#phonesCategories').val(categoryID)
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-phone').modal('hide')
        }else{
            $('#modal-new-phone #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-phone #warning-message').empty()
            }, 3500)
        }
    })

    // TELÉFONOS - EDITAR
    table.on('click', 'tbody .editClick', function(e){
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/phones/read.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            success : function(data){
                data = $.parseJSON(data)

                $('#formEditData #ID').val(data.ID)
                $('#formEditData #categoryID').val(data.category)
                $('#formEditData #category').val(data.categoryName)
                $('#formEditData #name').val(data.name)
                $('#formEditData #homePhone').val(data.homePhone)
                $('#formEditData #mobilePhone').val(data.mobilePhone)
                $('#formEditData #otherPhone').val(data.otherPhone)
                $('#formEditData #fax').val(data.fax)
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
                    $('#formEditData #location').prop('disabled', false)
                    if($('#formEditData #location').find("option[value='" + data.locationID + "']").length){
                        $('#formEditData #location').val(data.locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(data.locationName + ' - ' + data.postalCode, data.locationID, true, true)
                        $('#formEditData #location').append(newOption).trigger('change')
                    }
                }
                $('#formEditData #parish').val(data.parish)
                $('#formEditData #area').val(data.area)
                data.pay == 0 ? $('#formEditData #pay').prop('checked', false) : $('#formEditData #pay').prop('checked', true)
                $('#formEditData #email').val(data.email)
                $('#formEditData #description1').val(data.description)

                $('#modal-edit-phone').modal('show')
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#formEditData #saveEditPhone').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }

        if($('#formEditData #homePhone').val() != ''){
            if(!isPhone($('#formEditData #homePhone'))){
                validate++
            }
        }
        if($('#formEditData #mobilePhone').val() != ''){
            if(!isPhone($('#formEditData #mobilePhone'))){
                validate++
            }
        }

        if($('#formEditData #otherPhone').val() != ''){
            if(!isPhone($('#formEditData #otherPhone'))){
                validate++
            }
        }
        if($('#formEditData #fax').val() != ''){
            if(!isPhone($('#formEditData #fax'))){
                validate++
            }
        }
        if($('#formEditData #email').val() != ''){
            if(!isMail($('#formEditData #email'))){
                validate++
            }
        }

        if(validate == 0){
            var ID = $('#formEditData #ID').val()
            var name = $('#formEditData #name').val()
            var homePhone = $('#formEditData #homePhone').val()
            var mobilePhone = $('#formEditData #mobilePhone').val()
            var otherPhone = $('#formEditData #otherPhone').val()
            var fax = $('#formEditData #fax').val()
            var location
            $('#formEditData #location').val() == null ? location = 'null' : location = $('#formEditData #location').val()
            var parish = $('#formEditData #parish').val()
            var area = $('#formEditData #area').val()
            var pay
            $('#formEditData #pay').prop('checked') ? pay = 1 : pay = 0
            var email = $('#formEditData #email').val()
            var description = $('#formEditData #description').val()

            $.ajax({
                url : uri + 'core/phones/update.php',
                method : 'POST',
                data : {
                    ID : ID,
                    name : name,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    fax : fax,
                    location : location,
                    parish : parish,
                    area : area,
                    pay : pay,
                    email : email,
                    description : description
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El registro telefónico se ha modificado con éxito.</div>')
                        
                        table.ajax.url(uri + 'core/phones/list.php?category=' + category).load()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-edit-phone').modal('hide')
        }else{
            $('#modal-edit-phone #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-phone #warning-message').empty()
            }, 3500)
        }
    })

    // TELÉFONOS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el registro telefónico " + rowClick[1] + "?")){
            $.ajax({
                url : uri + 'core/phones/delete.php',
                method : 'POST',
                data : {
                    ID : rowClick[0]
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El registro telefónico se ha eliminado con éxito.</div>')
                        
                        table.ajax.url(uri + 'core/phones/list.php?category=' + category).load()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    $('#phoneListCsv').click(function(){
        $.ajax({
            url: uri + 'core/phones/functions.php',
            method: 'POST',
            data: {
                type: 'downloadCategories'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                window.open(uri + 'descargar-archivo?file=phones/categorias.csv', '_blank')
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición no se ha podido realizar en estos momentos.</div>');
            }
        })
    })

    $('#phoneTemplate').click(function(){
        $.ajax({
            url: uri + 'core/phones/functions.php',
            method: 'POST',
            data: {
                type: 'downloadTemplate'
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                window.open(uri + 'descargar-archivo?file=phones/plantilla.csv', '_blank')
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición no se ha podido realizar en estos momentos.</div>');
            }
        })
    })

    $('#uploadFile').click(function(){
        var filelist = $('#file')[0].files

        if(filelist.length == 0){
            $('#fileMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un archivo para cargar</div>')
            setTimeout(function(){
                $('#fileMessage').empty()
            }, 5000)
        }else if(filelist[0].name.split('.')[filelist[0].name.split('.').length - 1] != 'csv'){
            $('#fileMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un formato de archivo válido</div>')
            setTimeout(function(){
                $('#fileMessage').empty()
            }, 5000)
        }else{
            var data = new FormData

            data.append('file', filelist[0])
            data.append('type', 'loadTemplate')

            $.ajax({
                url: uri + 'core/phones/functions.php',
                method: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        if(data){
                            table.ajax.url(uri + 'core/phones/list.php?category=' + category).load()
                        }
                        
                        $('#fileMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }catch(e){
                        $('#fileMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                        setTimeout(function(){
                            $('#fileMessage').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#fileMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                    setTimeout(function(){
                        $('#fileMessage').empty()
                    }, 5000)
                }
            })
        }
    })

    $('#phoneJoin').click(function(){
        var category = $('#phonesCategories').val()

        switch(category){
            case '1':
            case '2':
            case '3':
            case '4':
            case '13':
            case '14':
            case '15':
                $.ajax({
                    url: uri + 'core/phones/join.php',
                    method: 'POST',
                    data: {
                        category: category
                    },
                    dataType: 'json',
                    success: function(data){
                        try{
                            if(data){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos se han modificado correctamente</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }else{
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
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
                break

            default:
                $('#joinMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La categoría seleccionada no existe en configuración</div>')
                setTimeout(function(){
                    $('#joinMessage').empty()
                }, 5000)
                break
        }
    })

    $('#phoneJoinInfo').click(function(){
        if($('#phoneJoinInfoSection').hasClass('hide')){
            $('#phoneJoinInfoSection').removeClass('hide')
        }else{
            $('#phoneJoinInfoSection').addClass('hide')
        }
    })

    // MODALES
    $('#modal-new-phone').on('hidden.bs.modal', function(){
        $('#formNewData input').val('')
        $('.province').val('')
        $('#formNewData #location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewData")
    })

    $('#modal-edit-phone').on('hidden.bs.modal', function(){
        $('#formEditData input').val('')
        $('.province').val('')
        $('#formEditData #location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formEditData")
    })
})