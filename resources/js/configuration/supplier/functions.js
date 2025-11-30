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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLinkToOrder" class="btn btn-default hide"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver al pedido</button>');
    changeSpaceFooter()
    if(document.referrer.match(/almacen\/pedidos\/nuevo-pedido/)){
        $('#backLink').addClass('hide')

        $('#backLinkToOrder').click(function(){
            window.close()
        })
    }
    
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
    
    /** 
     * @var int id ID del proveedor a editar
     */
    var id;
    
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

    //Pickers
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

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

    // PROVEEDORES
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/suppliers/listDatatables.php",
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
            {"title": "CIF"},
            {"title": "Proveedor"},
            {"title": "Teléfonos"},
            {"title": "E-mail"},
            {"title": "Pedidos"},
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
            "targets": [1,2,3]
        },
        {
            "className": "email editClick",
            "targets": 4,
            "render": function (data, type, row) {
                if(type==='display'){
                    return '<a href="mailto:'+data+'"  title="Envir correo">'+data+'</a>';
                }else{
                    return data;
                }
            }
        },
        {
            "className": "details-control centered viewClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-order'  title='Ver pedidos'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
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
             "render": function(data, type, row){
                if(row[0] != 127){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
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
            filename: 'cuestionarios',
            title: 'Cuestionarios',
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
            filename: 'cuestionarios',
            title: 'Cuestionarios',
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
                            text: 'Listado de cuestionarios',
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
    });

    // PROVEEDORES - BUSCAR
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    // PROVEEDORES - NUEVO
    $('#saveNewSupplier').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }

        if(isEmpty($('#formNewData #nif'))){
            validate++;
        }else{
            if($("#validateCIF").prop('checked')){
                if(!isNifCif($("#formNewData #nif"))){
                    validate++
                }
            }
        }
       
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
        }

        if(validate == 0){
            var nif = $("#formNewData #nif").val();
            var name = $("#formNewData #name").val();
            var address = $("#formNewData #address").val();
            var mail = $("#formNewData #mail").val();
            var description = $("#formNewData #description").val();
            var location = $("#formNewData #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#formNewData #fax").val();
            var contactPeople = "";
            $('#formNewData .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var department = $(this).find('.department').text();
                contactPeople += name+"?"+department+"-";
            });
            contactPeople=contactPeople.slice(0,-1);
            var entryDate = $("#formNewData #entryDate").val();        
            if(moment(entryDate,"DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate = "";
            }

            var sentObituary
            $('#formNewData #sentObituary').prop('checked') ? sentObituary = 1 : sentObituary = 0

            $.post(uri+"core/suppliers/create.php", {nif: nif, name: name, address: address, mail: mail, location: location, description: description, phones: phones, fax: fax, contactPeople: contactPeople, entryDate: entryDate, sentObituary: sentObituary}, function(data){
                data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El proveedor se ha creado con éxito.</div>');
                        $('#modal-new-supplier').modal('hide');
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un proveedor con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-supplier').modal('hide');                  
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                })
        }else{
            $('#modal-new-supplier #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-supplier #warning-message').empty()
            }, 3500)
        }
    });

    // PROVEEDORES - PEDIDOS
    table.on('click', 'tbody .viewClick', function () {
        $('.btn-order').tooltip('hide');
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/proveedor/historico/' + rowClick[0];
    });

    // PROVEEDORES - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');
        $('#progress .progress-bar').css(
            'width', 0 + '%'
        );

        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var result = true;
        $('#formEditData').fileupload({
            url: uri + 'core/suppliers/uploadFile.php?id=' + rowClick[0],
            dataType: 'json',
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    if(file.type != 'application/pdf'){
                        alert('Solo se permiten subir ficheros .pdf')
                        result = false;
                    }else{
                        result = true
                    }
                })
            },
            progressall: function (e, data) {
                setTimeout(() => {
                    if(result == true){
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width', 100 + '%'
                        );

                        $.post(uri+"core/suppliers/read.php", {supplierID: rowClick[0]}, function(data){
                            data = $.parseJSON(data);
                            
                            var href = data[0].catalogue;
                            if(href!="" && href!=undefined && href!=null){
                                $('#formEditData #catalogue-link').html(
                                    '<a class="cursor-pointer downloadFile" data="'+href+'" style="cursor:pointer" onclick="downloadCatalogue(this)"><i class="fa fa-eye c-blue" aria-hidden="true"></i>'+
                                    '   Ver Catálogo'+
                                    '</a>');
                            }
                        });
                    }
                }, 250);
            }
        }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');

        $.post(uri+"core/suppliers/read.php", {supplierID: rowClick[0]}, function(data){
            data = $.parseJSON(data);
            
            $('#formEditData #supplierID').val(data[0].supplierID);
            $('#formEditData #nif').val(data[0].nif);
            $('#formEditData #name').val(data[0].supplierName); 
            $('#formEditData #description').val(data[0].description);
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
                    // Creamos la nueva opción DOM para preseleccionarlo por defecto
                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].locationID, true, true);
                    //Lo añadimos al select
                    $('#formEditData #location').append(newOption).trigger('change');
                }
            }
            $('#formEditData #address').val(data[0].address);
            $('#formEditData #postalCode').val(data[0].postalCode);
            $('#formEditData #province').val(data[0].province);
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
            $('#formEditData #fax').val(data[0].fax);

            if(data[0].sentObituary == 1){
                $("#formEditData #sentObituary").prop("checked", true);  
            } else{
                $("#formEditData #sentObituary").prop("checked", false); 
            }
            
            $.post(uri+"core/suppliers/functions.php", {supplierID: rowClick[0], type: 'readContactPeople'}, function(data){
                data = $.parseJSON(data);
                if(data!=null){
                    for (var i=0; i < data.length; i ++){
                        let department = "-";
                        if(data[i].department != 'null' && data[i].department != null){
                            department = data[i].department
                        }
                        $('#formEditData .contactPeople').append(
                            '<span class="label label-default small">'
                            +'<span class="name">'+data[i].person+'</span> '
                            +'(<span class="department">'+department+'</span>) <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
                    }                
                    if(!$('#formEditData .contactPeople').hasClass('in')){
                        $('#formEditData .contactPeople').addClass('in');
                    }
                    $('#formEditData .contactPeople .label .btn-remove').click(function(){
                        $(this).parent('.label').remove();
                    });
                    $('#formEditData #contactPeople').val(data[0].person);
                }
            });
            if(data[0].entryDate != null){
                $('#formEditData #entryDate').val(moment(data[0].entryDate,"YYYY-MM-DD").format("DD/MM/YYYY"));
            }
            
            var href = data[0].catalogue;
            if(href!="" && href!=undefined && href!=null){
                $('#formEditData #catalogue-link').html(
                    '<a class="cursor-pointer downloadFile" data="'+href+'" style="cursor:pointer" onclick="downloadCatalogue(this)"><i class="fa fa-eye c-blue" aria-hidden="true"></i>'+
                    '   Ver Catálogo'+
                    '</a>');
            }
        });

        $('#modal-edit-supplier').modal('show');
    });

    $('#saveEditSupplier').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }

        if(isEmpty($('#formEditData #nif'))){
            validate++;
        }else{
            if($("#validateEditCIF").prop('checked')){
                if(!isNifCif($("#formEditData #nif"))){
                    validate++
                }
            }
        }
        
        if($('#formEditData #mail').val() != ""){
            if(!isMail($('#formEditData #mail'))){
                validate++;
            }
        }

        if(validate == 0){
            var supplierID = $("#formEditData #supplierID").val();
            var nif = $("#formEditData #nif").val();
            var name = $("#formEditData #name").val();
            var address = $("#formEditData #address").val();
            var mail = $("#formEditData #mail").val();
            var description = $("#formEditData #description").val();
            var location = $("#formEditData #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var mail = $("#formEditData #mail").val();
            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#formEditData #fax").val();
            var contactPeople = "";
            $('#formEditData .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var department = $(this).find('.department').text();
                contactPeople += name+"?"+department+"-";
            });
            contactPeople=contactPeople.slice(0,-1);
            var entryDate = $("#formEditData #entryDate").val();
            if(moment(entryDate, "DD/MM/YYYY").isValid()){
                entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
            }else{
                entryDate = "";
            }

            var sentObituary
            $('#formEditData #sentObituary').prop('checked') ? sentObituary = 1 : sentObituary = 0

            $.post(uri+"core/suppliers/update.php", {supplierID: supplierID, nif: nif, name: name, address: address, mail: mail, description: description, location: location, phones: phones, fax: fax, contactPeople: contactPeople, entryDate: entryDate, sentObituary: sentObituary}, function(data){
                data = $.parseJSON(data)
                if(data["success"]){
                    table.ajax.reload();
                    $('#modal-edit-supplier').modal('hide');
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del proveedor se han actualizado con éxito.</div>');
                }else if(data["cif"]){
                    $('#formEditData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un proveedor con ese NIF.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-edit-supplier').modal('hide');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                    $('#formEditData #msg').empty()
                }, 5000)
            })
           
        }else{
            $('#modal-edit-supplier #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-supplier #warning-message').empty()
            }, 3500)
        }
    });
    
    // PROVEEDORES - ELIMINAR
    table.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
       
        if(confirm("¿Está seguro de que quiere borrar el proveedor " + rowClick[2] + "?")){
            $.post(uri+"core/suppliers/delete.php", {supplierID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El proveedor se ha eliminado con éxito.</div>');
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

    // AÑADIR PERSONAS DE CONTACTO
    $('.btn-add-person').click(function(){
        var name = $(this).parent().parent().find('#person').val();
        var department = $(this).parent().parent().find('#department').val();
        $('.input-contactPeople .form-control').val('');
        $('.contactPeople').append('<span class="label label-default small"><span class="name">'+name+'</span> (<span class="department">'+department+'</span>) <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
        if(!$('.contactPeople').hasClass('in')){
            $('.contactPeople').addClass('in');
        }
        $('.contactPeople .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });
    });

    // ELIMINAR PERSONAS DE CONTACTO
    $('.contactPeople .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });
    
    // MODALES
    $('#modal-new-supplier').on('shown.bs.modal', function (e) {
        $('.location').prop('disabled', true)
    })

    $('#modal-new-supplier').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('#formNewData textarea').val('');
        $('.phones').html('');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $('.contactPeople').html('');
        if(!$('#formNewData .contactPeople').hasClass('in')){
            $('#formNewData .contactPeople').addClass('in');
        }
        $("#formNewData #province option[value='']").attr('disabled', false)
        $("#formNewData #province option[value='']").attr('selected', true)
        $("#formNewData #location").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-supplier #warning-message').empty()

        $("#modal-new-supplier #validateCIF").prop('checked', true);
    });

    $('#modal-edit-supplier').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('#formNewData textarea').val('');
        $('.phones').html('');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }
        $('.contactPeople').html('');
        if(!$('#formEditData .contactPeople').hasClass('in')){
            $('#formEditData .contactPeople').addClass('in');
        }
        $("#formEditData #province option[value='']").attr('disabled', false)
        $("#formEditData #province option[value='']").attr('selected', true)
        $("#formEditData #location").val('').trigger('change');
        clean("formEditData");
        $('#modal-edit-supplier #warning-message').empty()

        $("#modal-new-supplier #validateEditCIF").prop('checked', true);
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/suppliers/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/suppliers/template.csv', '_blank')
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
                url: uri + 'core/suppliers/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/suppliers/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/suppliers/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, NIF, Dirección, Provincia, Localidad, Email, Teléfonos, Fax, Descripción, Fecha Entrada, Enviar Esquela, Persona de Contacto"){
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

function downloadCatalogue(elem){
    let info = $(elem).attr("data")
    info = info.split("suppliers")[1];
    info = 'suppliers/'+info;
    window.open(uri + 'descargar-archivo?file=' + info, '_blank')
}