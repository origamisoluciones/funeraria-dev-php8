/**
 * Select2 function for remote data
 * 
 * @param {array} data Información a formatear
 * @return {string} Información formateada
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

    // Clientes
    $('.select2').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: 'Seleccione un cliente',
        allowClear: true,
        ajax: {
            url: uri + 'core/clients/getClientsNoParticular.php',
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
                            id: item.clientID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });

    // Clientes
    $('#clientEdit').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: 'Seleccione un cliente',
        allowClear: true,
        ajax: {
            url: uri + 'core/clients/getClientsNoParticular.php',
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
                            id: item.clientID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });

    // ASISTENTES
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/assistants/list.php",
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
            {"title": "Teléfono"},
            {"title": "Correo"},
            {"title": "Propio"},
            {"title": "Cliente"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": 
        [{
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": 'editClick',
            "targets": [1,2]
        },
        {
            'targets' : 3,
            'render' : function(data){
                var print = ''
                if(data != null && data != ''){
                    var phones = data.split('-')
                    $.each(phones, function(index, elem){
                        print += '<a href="tel:' + elem + '">' + elem + '</a> - '
                    })
                }
                return print.substring(0, print.length - 3)
            }
        },
        {
            'targets' : 4,
            'render' : function(data){
                var print = ''
                if(data != null || data != ''){
                    print += '<a href="mailto:' + data + '">' + data + '</a>'
                }
                return print
            }
        },
        {
            'targets' : 5,
            'render' : function(data){
                if(data == 0){
                    return 'No';
                }else{
                    return 'Sí'
                }
            }
        },
        {
            'targets' : 6,
            'render' : function(data){
                if(data == '' || data == null){
                    return '-';
                }else{
                    return data;
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 8,
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
            filename: 'asistentes',
            title: 'Asistentes',
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
            filename: 'asistentes',
            title: 'Asistentes',
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
                            text: 'Listado de cementerios',
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
    
    // ASISTENTE - BÚSQUEDA
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    $('#formNewData #isYourOwn').change(function(){
        if($(this).prop('checked') == true){
            $("#clientDiv").addClass('hide')
            $("#client").val(null).trigger('change')
        }else{
            $("#clientDiv").removeClass('hide')
        }
    })

    // ASISTENTE - NUEVO
    $('#saveNewAssistant').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if($('#formNewData #surname').val() != ""){
            if(isEmpty($('#formNewData #surname'))){
                validate++;
            }    
        }
        if($('#formNewData #phone').val() != ""){
            if(isEmpty($('#formNewData #phone'))){
                validate++;
            }
        }
        if($('#formNewData #mail').val() != ""){
            if(!isMail($('#formNewData #mail'))){
                validate++;
            }
        }

        if(isEmpty($('#formNewData #client')) && $('#formNewData #isYourOwn').prop('checked') == false){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewData #name").val();
            var surname = $("#formNewData #surname").val();
            var phone = $("#formNewData #phone").val();
            var email =  $("#formNewData #mail").val();
            var client =  $("#formNewData #client").val();
            var isYourOwn = '0';
            if($("#formNewData #isYourOwn").prop('checked') == true){
                isYourOwn = '1';
            }
            var client =  $("#formNewData #client").val();

            $.ajax({
                url: uri + 'core/assistants/create.php',
                method: 'POST',
                data: {
                    name: name,
                    surname: surname,
                    phone: phone,
                    email: email,
                    client: client,
                    isYourOwn: isYourOwn
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El asistente se ha creado con éxito.</div>');
                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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
    
            $('#modal-new-assistant').modal('hide');
        }else{
            if(isEmpty($('#formNewData #client')) && $('#formNewData #isYourOwn').prop('checked') == false){
                $('#modal-new-assistant #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Si el asistente no es propio debe ir asociado a un cliente</div>')
            }else{
                $('#modal-new-assistant #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }

            setTimeout(function(){
                $('#modal-new-assistant #warning-message').empty()
            }, 3500)
        }
    });

    $('#formEditData #isYourOwn').change(function(){
        if($(this).prop('checked') == true){
            $("#clientEditDiv").addClass('hide')
            $("#clientEdit").val(null).trigger('change')
        }else{
            $("#clientEditDiv").removeClass('hide')
        }
    })

    // ASISTENTE - EDITAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        $.ajax({
            url: uri + 'core/assistants/read.php',
            method: 'POST',
            data: {
                assistantID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data);

                $('#formEditData #assistantID').val(data[0].assistantID);
                $('#formEditData #name').val(data[0].name); 
                $('#formEditData #surname').val(data[0].surname);
                $('#formEditData #phone').val(data[0].phone);
                $('#formEditData #mail').val(data[0].mail);
                if(data[0].isYourOwn == "1"){
                    $('#formEditData #isYourOwn').prop('checked', true);
                    $('#formEditData #clientEditDiv').addClass('hide')
                }else{
                    $('#formEditData #isYourOwn').prop('checked', false);
                    $('#formEditData #clientEditDiv').removeClass('hide')
                }

                if(data[0].client != "" && data[0].client != null){
                    if($('#formEditData #clientEdit').find("option[value='" + data[0].client + "']").length){
                        $('#formEditData #clientEdit').val(data[0].client).trigger('change')
                    }else{
                        var clientName = "";
                        if(data[0].brandName != '' && data[0].brandName != null){
                            clientName = data[0].brandName + " - " + data[0].nif;
                        }else{
                            clientName = data[0].clientName + " - " +  data[0].nif
                        }
                        var newOption = new Option(clientName, data[0].client, true, true)
                        $('#formEditData #clientEdit').append(newOption).trigger('change')
                    }
                }

                $('#modal-edit-assistant').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    $('#saveEditAssistant').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if($('#formEditData #surname').val() != ""){
            if(isEmpty($('#formEditData #surname'))){
                validate++;
            }    
        }
        if($('#formEditData #phone').val() != ""){
            if(isEmpty($('#formEditData #phone'))){
                validate++;
            }
        }
        if($('#formEditData #mail').val() != ""){
            if(!isMail($('#formEditData #mail'))){
                validate++;
            }
        }

        if(isEmpty($('#formEditData #clientEdit')) && $('#formEditData #isYourOwn').prop('checked') == false){
            validate++;
        }

        if(validate == 0){
            var assistantID = $("#formEditData #assistantID").val();
            var name = $("#formEditData #name").val();
            var surname = $("#formEditData #surname").val();
            var phone = $("#formEditData #phone").val();
            var email = $('#formEditData #mail').val();
            var client = $('#formEditData #clientEdit').val();
            var isYourOwn = '0';
            if($("#formEditData #isYourOwn").prop('checked') == true){
                isYourOwn = '1';
            }

            $.ajax({
                url: uri + 'core/assistants/update.php',
                method: 'POST',
                data: {
                    assistantID: assistantID,
                    name: name,
                    surname: surname,
                    phone: phone,
                    email: email,
                    client: client,
                    isYourOwn: isYourOwn
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del asistente se han actualizado con éxito.</div>');
                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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
            $('#modal-edit-assistant').modal('hide');
        }else{


            if(isEmpty($('#formEditData #client')) && $('#formEditData #isYourOwn').prop('checked') == false){
                $('#modal-edit-assistant #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Si el asistente no es propio debe ir asociado a un cliente</div>')
            }else{
                $('#modal-edit-assistant #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
            }

            setTimeout(function(){
                $('#modal-edit-assistant #warning-message').empty()
            }, 3500)
        }
    });
    
    // ASISTENTE - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar al asistente " + rowClick[1] + " " + rowClick[2] + "?")){
            $.ajax({
                url: uri + 'core/assistants/delete.php',
                method: 'POST',
                data: {
                    ID : rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El asistente se ha eliminado con éxito.</div>');

                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
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
    });
    
    // MODALES
    $('#modal-new-assistant').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        clean("formNewData");
        $('#modal-new-assistant #warning-message').empty()
        $('#formNewData #client').val(null).trigger('change')
        $('#formNewData #clientDiv').removeClass('hide')
        $('#formNewData #isYourOwn').prop('checked', false);
    });

    $('#modal-edit-assistant').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        clean("formEditData");
        $('#modal-edit-assistant #warning-message').empty()
        $('#formEditData #client').val(null).trigger('change')
        $('#formEditData #clientEditDiv').removeClass('hide')
        $('#formEditData #isYourOwn').prop('checked', false);
    });

});