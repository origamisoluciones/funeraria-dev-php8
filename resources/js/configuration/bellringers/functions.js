/**
 * Select2 function for remote data
 * 
 * @param {array} data
 * @return {string}
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
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
        history.back(1)
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

    // IGLESIAS - AÑADIR
    $('#modal-new-bellringer .btn-add-church').click(function(){

        if($("#modal-new-bellringer #church").val() != null){
            var church = $(this).parent().parent().find('#modal-new-bellringer #church').val()
            var churchName = $(this).parent().parent().find('#modal-new-bellringer #church').text()
    
            $('#modal-new-bellringer .churches').append(  '<span class="label label-default small labelPhones">' +
                                    '   <input type="hidden" value="' + church + '">' +
                                    '   <span class="number">' + churchName + '</span> ' +
                                    '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                                    '   <br>'+
                                    '</span>')
    
            if(!$('#modal-new-bellringer .churches').hasClass('in')){
                $('#modal-new-bellringer .churches').addClass('in')
            }
    
            $('#modal-new-bellringer .churches .label .btn-remove').click(function(){
                $(this).parent('.label').remove();
            })
    
            $('#modal-new-bellringer #formNewData #church').empty().trigger('change')
        }
    });

    $('#modal-edit-bellringer .btn-add-church').click(function(){

        if($("#modal-edit-bellringer #church").val() != null){
            var church = $('#modal-edit-bellringer #church').val();
            var churchName = $('#modal-edit-bellringer #church').select2('data')[0].text;

            $('#modal-edit-bellringer .churches').append(  
                '<span class="label label-default small labelPhones">' +
                '   <input type="hidden" value="' + church + '">' +
                '   <span class="number">' + churchName + '</span> ' +
                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                '   <br>'+
                '</span>')
    
            if(!$('#modal-edit-bellringer .churches').hasClass('in')){
                $('#modal-edit-bellringer .churches').addClass('in')
            }
    
            $('#modal-edit-bellringer .churches .label .btn-remove').click(function(){
                $(this).parent('.label').remove();
            })
    
            $('#modal-edit-bellringer #formEditData #church').empty().trigger('change')
        }
    });

    // CAMPANEROS
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/bellringers/listDatatables.php",
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
            {"title": "Apellidos"},
            {"title": "Parroquia"},
            {"title": "Email"},
            {"title": "Telf. móvil"},
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
            'targets' : [1,2,3,4,5]
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
            filename: 'campaneros',
            title: 'Campaneros',
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
            filename: 'campaneros',
            title: 'Campaneros',
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
                            text: 'Listado de campaneros',
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
                columns: [1, 2, 3, 4],
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

    // CAMPANEROS - BUSCAR
    $('#input-search').on('keyup', function (){
        table.search( this.value ).draw()
    })    

    // CAMPANEROS - NUEVO
    $('#saveNewBellringer').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #name'))){
            validate++
        }

        if($('#formNewData #nif').val() != ''){
            if(!isNifCif($("#formNewData #nif"))){
                validate++
            }  
        }

        if($('#formNewData #email').val() != ''){
            if(!isEmail($("#formNewData #email"))){
                validate++
            }
        }

        if($('#formNewData #homePhone').val() != ''){
            if(!isPhone($("#formNewData #homePhone"))){
                validate++
            }
        }
    
        if($('#formNewData #otherPhone').val() != ''){
            if(!isPhone($("#formNewData #otherPhone"))){
                validate++
            }
        }
       
        if($('#formNewData #mobilePhone').val() != ''){
            if(!isPhone($("#formNewData #mobilePhone"))){
                validate++
            }
        }
        
        if(validate == 0){
            var name = $('#formNewData #name').val()
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
                url: uri + 'core/bellringers/create.php',
                method: 'POST',
                data: {
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
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload()
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campanero se ha creado con éxito.</div>')
                        $('#modal-new-bellringer').modal('hide')
                    }else if(data["cif"]){
                        $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un campanero con ese NIF.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-new-bellringer').modal('hide')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-bellringer').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-bellringer #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-bellringer #warning-message').empty()
            }, 3500)
        }
    })

    // CAMPANEROS - EDITAR
    table.on('click', 'tbody .editClick', function(e){
        $('.churches').empty()
        
        $('.btn-edit').tooltip('hide')
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        $.ajax({
            url: uri + 'core/bellringers/read.php',
            method: 'POST',
            data: {
                ID : rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                var bellringer = data[0]

                $('#formEditData #bellringerID').val(bellringer.ID)
                $('#formEditData #name').val(bellringer.name)
                $('#formEditData #surname').val(bellringer.surname)
                $('#formEditData #nif').val(bellringer.nif)
                $('#formEditData #address').val(bellringer.address)
                if(bellringer.province == null){
                    $("#formEditData #province option[value='']").attr('disabled', false)
                    $('.location').prop('disabled', true)
                }else{
                    province = bellringer.province
                    $("#formEditData #province option[value='']").attr('disabled', true)
                    $('#formEditData #province').val(bellringer.province)
                    $('.location').prop('disabled', false)
                }
                if(bellringer.locationID != null){
                    if($('#formEditData #location').find("option[value='" + bellringer.locationID + "']").length){
                        $('#formEditData #location').val(bellringer.locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(bellringer.locationName + ' - ' + bellringer.postalCode, bellringer.locationID, true, true)
                        $('#formEditData #location').append(newOption).trigger('change')
                    }
                }

                $('#formEditData #area').val(bellringer.area)
                $('#formEditData #parish').val(bellringer.parish)
                $('#formEditData #email').val(bellringer.email)
                $('#formEditData #homePhone').val(bellringer.homePhone)
                $('#formEditData #mobilePhone').val(bellringer.mobilePhone)
                $('#formEditData #otherPhone').val(bellringer.otherPhone)

                if(data[1] != null){
                    data[1].forEach(function(elem){
                        $('#formEditData .churches').append(
                            '<span class="label label-default small labelPhones">' +
                            '   <input type="hidden" value="' + elem.churchID + '">' +
                            '   <span class="number">' + elem.name + '</span> ' +
                            '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                            '   <br>'+
                            '</span>')
                    })

                    $('.churches .label .btn-remove').on('click', function(){
                        $(this).parent('.label').remove()
                    })
                }

                $('#modal-edit-bellringer').modal('show')
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#saveEditBellringer').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }
        
        if($('#formEditData #nif').val() != ''){
            if(!isNifCif($("#formEditData #nif"))){
                validate++
            }  
        }

        if($('#formEditData #email').val() != ''){
            if(!isEmail($("#formEditData #email"))){
                validate++
            }
        }

        if($('#formEditData #homePhone').val() != ''){
            if(!isPhone($("#formEditData #homePhone"))){
                validate++
            }
        }
        
        if($('#formEditData #otherPhone').val() != ''){
            if(!isPhone($("#formEditData #otherPhone"))){
                validate++
            }
        }
        
        if($('#formEditData #mobilePhone').val() != ''){
            if(!isPhone($("#formEditData #mobilePhone"))){
                validate++
            }
        }
        
        if(validate == 0){
            var bellringerID = $('#formEditData #bellringerID').val()
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
                url: uri + 'core/bellringers/update.php',
                method: 'POST',
                data: {
                    ID: bellringerID,
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
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data["success"]){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del campanero se han actualizado con éxito.</div>')
                        table.ajax.reload()
                        $('#modal-edit-bellringer').modal('hide')
                    }else if(data["cif"]){
                        $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un campanero con ese NIF.</div>')
                    }
                    else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-edit-bellringer').modal('hide')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-edit-bellringer').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

        }else{
            $('#modal-edit-bellringer #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-bellringer #warning-message').empty()
            }, 3500)
        }
    })

    // CAMPANEROS - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el campanero " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/bellringers/delete.php',
                method: 'POST',
                data: {
                    ID : rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campanero se ha eliminado con éxito.</div>')

                        table.ajax.reload()
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

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/bellringers/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/bellringers/template.csv', '_blank')
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
                url: uri + 'core/bellringers/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/bellringers/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/bellringers/listDatatables.php').load()

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

    // MODALES
    $('#modal-new-bellringer').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('')
        $('#formNewData .churches').html('')
        $('#formNewData #church').val('').trigger('change')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewData")
        $('#modal-new-bellringer #warning-message').empty()
    })
    
    $('#modal-edit-bellringer').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('')
        $('#formEditData .churches').html('')
        $('#formEditData #church').val('').trigger('change')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formEditData")
        $('#modal-edit-bellringer #warning-message').empty()
    })

    $("#modal-import-errors").on('hidden.bs.modal', function(){
        $("#modal-import-errors #errors").empty();
    })
})