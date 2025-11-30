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

    // LISTADO DE TANATORIOS (NUEVO)
    $('#formNewData #mortuary').select2({
        containerCssClass: 'select2-mortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/costCenter/mortuariesData.php',
            dataType: 'json',
            delay: 250,
            async: false,
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
                            id: item.mortuaryID
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
        templateSelection: formatData,
    })

    // LISTADO DE TANATORIOS (EDITAR)
    $('#formEditData #mortuary').select2({
    containerCssClass: 'select2-mortuary',
    language: langSelect2,
    placeholder: '--',
    allowClear: true,
    ajax: {
        url: uri + 'core/costCenter/mortuariesData.php',
        dataType: 'json',
        delay: 250,
        async: false,
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
                        id: item.mortuaryID
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
    templateSelection: formatData,
})

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/costCenter/listDatatables.php",
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
            {"title": "Centro de Coste"},
            {"title": "Localidad"},
            {"title": "Teléfonos"},
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
            "className": "details-control centered editClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 5,
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

    var ppalE, ppalN;
    var ppalE = ppalN = 0;

    $('#formNewData #warehousePpal').on('ifUnchecked', function(event){
        ppalN = 0;
    });
    $('#formNewData #warehousePpal').on('ifChecked', function(event){
        ppalN = 1;
    });

    $('#formEditData #warehousePpal').on('ifUnchecked', function(event){
        ppalE = 0;
    });
    $('#formEditData #warehousePpal').on('ifChecked', function(event){
        ppalE = 1;
    });

    //Create. Nuevo tanatorio
    $('#saveNewCostCenter').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }

        // if(isEmpty($('#formNewData #mortuary'))){
        //     validate++
        // }
        
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
            var name = $("#formNewData #name").val();
            var address = $("#formNewData #address").val();
            var location = $("#formNewData #location").val();
            var mortuary = $("#formNewData #mortuary").val();
            if(mortuary=="undefined" || mortuary=="" ||  mortuary==null){
                mortuary = "null";
            }

            //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
            if(location=="undefined" || location=="" ||  location==null){
                location = "null";
            }

            var mail = $("#formNewData #mail").val();

            //Obtenemos los teléfonos con el formato "NUMERO1-NUMERO2"
            var phones = "";
            $('#formNewData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });

            //Eliminamos el último delimitador "-" de los teléfonos
            phones=phones.slice(0,-1);
            var company = $("#formNewData #company").val();

            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/costCenter/create.php", {name: name, address: address, location: location, mail: mail, phones: phones, company: company, mortuary:mortuary, ppal: ppalN}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tanatorio se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                //Recargamos la tabla con los nuevos datos
                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            //Mostramos la ventana modal
            $('#modal-new-costCenter').modal('hide');
        }else{
            $('#modal-new-costCenter #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-costCenter #warning-message').empty()
            }, 3500)
        }
    });

    //Edit. Acción editar un tanatorio
    table.on('click', 'tbody .editClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        $('#formEditData #mortuary').empty();
        $.post(uri+"core/costCenter/read.php", {ID: rowClick[0]}, function(data){
            data = $.parseJSON(data);
            
            $('#formEditData #ID').val(data[0].ID);
            $('#formEditData #name').val(data[0].costCenterName); 

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
                $('.location').prop('disabled', false)
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

            if(data[0].mortuary != null){
                if($('#formEditData #mortuary').find("option[value='" + data[0].mortuary + "']").length){
                    $('#formEditData #mortuary').val(data[0].mortuary).trigger('change')
                }else{
                    var newOption = new Option(data[0].mortuaryName == null ? 'Otro' : data[0].mortuaryName, data[0].mortuary, true, true)
                    $('#formEditData #mortuary').append(newOption).trigger('change')
                }
            }

            $('#formEditData #address').val(data[0].address);
            $('#formEditData #mail').val(data[0].mail);
            $('#formEditData .phone').val('');
            $('#formEditData #company').val(data[0].company);
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
            if(data[0].warehousePpal == '1'){
                $('#formEditData #warehousePpal').iCheck('check')
            }else{
                $('#formEditData #warehousePpal').iCheck('uncheck')
            }
        });

        //Mostramos la modal
        $('#modal-edit-costCenter').modal('show');
    });
    
    //Update. Actualizamos los datos del centro de coste tras la acción "editar"
    $('#saveEditCostCenter').click(function(){
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

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud update
            var ID = $("#formEditData #ID").val();
            var name = $("#formEditData #name").val();
            var address = $("#formEditData #address").val();
            var location = $("#formEditData #location").val();
            var mortuary = $("#formEditData #mortuary").val();
            if(mortuary=="undefined" || mortuary=="" ||  mortuary==null){
                mortuary = "null";
            }
            if(location=="undefined" || location=="" ||  location==null){
                location = "null";
            }

            var mail = $("#formEditData #mail").val();

            //Obtenemos los teléfonos con el siguiente formato "NUMERO1-NUMERO2"
            var phones = "";
            $('#formEditData .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            //Eliminamos el último delimitador "-" de los teléfonos
            phones = phones.slice(0,-1);

            var company = $("#formEditData #company").val();

            $.post(uri+"core/costCenter/update.php", {ID: ID, name: name, address: address, location: location, mail: mail, phones: phones, company: company, mortuary:mortuary, ppal: ppalE}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del centro de coste se han actualizado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                //Recargamos la tabla con los nuevos datos
                table.ajax.reload();
            });

            //ocultamos la ventana modal
            $('#modal-edit-costCenter').modal('hide');
        }else{
            $('#modal-edit-costCenter #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-costCenter #warning-message').empty()
            }, 3500)
        }
    });
    
    //Delete. Eliminamos un tanatorio
    table.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el centro de coste " + rowClick[1] + "?")){
            $.post(uri+"core/costCenter/delete.php", {ID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tanatorio se ha eliminado con éxito.</div>');
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
    $('#modal-new-costCenter').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $('.phones').html('');
        if(!$('#formNewData .phones').hasClass('in')){
            $('#formNewData .phones').addClass('in');
        }
        $("#formNewData #location").val('').trigger('change');
        $('#formNewData #warehousePpal').iCheck('uncheck'); 
        clean("formNewData");
        $('#modal-new-costCenter #warning-message').empty()
    });
    $('#modal-edit-costCenter').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $('.phones').html('');
        if(!$('#formEditData .phones').hasClass('in')){
            $('#formEditData .phones').addClass('in');
        }
        $("#formEditData #location").val('').trigger('change');
        $('#formEditData #warehousePpal').iCheck('uncheck'); 
        clean("formEditData");
        $('#modal-edit-costCenter #warning-message').empty()
    });

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/costCenter/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/costCenter/template.csv', '_blank')
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
                url: uri + 'core/costCenter/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/costCenter/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/costCenter/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Email, Teléfono, Localidad, Tanatorio asociado, Compañía, Principal"){
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