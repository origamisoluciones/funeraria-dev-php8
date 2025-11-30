/** @var {object} roomsTable Documents rooms table */
var roomsTable = null;

/** @var {object} rowClick Row click table */
var rowClick = null;

/**
 * Select2 function for remote data
 * 
 * @param {array} data
 * @return {string}
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>';
}

function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height();
    $('.content-wrapper').css('padding-bottom', heightFooter);
}

$(window).scroll(function(){
    changeSpaceFooter();
})

$(window).resize(function(){
    changeSpaceFooter();
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

    $('.mortuary-tellmebye').select2({
        containerCssClass: 'select2-container',
        language: langSelect2,
        allowClear: false,
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

    // List
    roomsTable = $('#datatable').DataTable({
        "ajax": uri + 'core/tellmebyeRooms/list.php',
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
            {"title": "Id sala"},
            {"title": "Id delegación"},
            {"title": "Tanatorio"},
            {"title": "Nombre"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0, 1],
            "searchable": false,
            "visible": false
        },
        {
            "className": 'viewClick',
            "targets": [2, 3]
        },
        {
            "className": "details-control centered editClick",
            "targets": [4],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": [5],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'salas Tellmebye',
            title: 'salas Tellmebye',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'salas Tellmebye',
            title: 'salas Tellmebye',
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
                            text: 'Listado de editores de documentación',
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
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'asc'], [3, 'asc']]
    });

    $('#input-search').on('keyup', function () {
        roomsTable.search(this.value).draw();
    });

    // Create
    $('#saveNewRoom').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewDataRoom #mortuaryTellmebye'))){
            validate++;
        }
        if(isEmpty($('#formNewDataRoom #name'))){
            validate++;
        }
        
        if(validate == 0){
            var mortuaryTellmebye = $("#formNewDataRoom #mortuaryTellmebye").val();
            var name = $("#formNewDataRoom #name").val();

            $.ajax({
                url: uri + 'core/tellmebyeRooms/create.php',
                method: 'POST',
                data: {
                    mortuaryTellmebye: mortuaryTellmebye,
                    name: name,
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data);

                    if(data === false){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-room').modal('hide');
                    }else{
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La sala de Tellmebye se ha creado con éxito.</div>');
                        roomsTable.ajax.reload();
                        $('#modal-new-room').modal('hide');
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
        }else{
            $('#modal-new-room #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-room #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-room').on('hidden.bs.modal', function (e) {
        $('#formNewDataRoom input').val('');
        clean("formNewDataRoom");
        $('#modal-new-room #warning-message').empty();
    });

    // Read
    roomsTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');
        
        rowClick = roomsTable.row($(this).closest('tr')).data() == undefined ? roomsTable.row($(this).closest('tr.child').prev()).data() : roomsTable.row($(this).closest('tr')).data()
        
        $('#modal-edit-room #mortuaryTellmebye').val(rowClick[2]);
        $('#modal-edit-room #name').val(rowClick[3]);

        $('#modal-edit-room').modal('show');
    });
    
    // Update
    $('#saveEditRoom').click(function(){
        var validate = 0

        if(isEmpty($('#formEditDataRoom #name'))){
            validate++
        }

        if(validate == 0){
            var name = $("#formEditDataRoom #name").val();

            $.ajax({
                url: uri + 'core/tellmebyeRooms/update.php',
                method: 'POST',
                data: {
                    id: rowClick[0],
                    mortuaryTellmebye: rowClick[1],
                    name: name
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data);

                    if(data === false){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-edit-room').modal('hide');
                    }else{
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la sala se han actualizado con éxito.</div>');
                        roomsTable.ajax.reload();
                        $('#modal-edit-room').modal('hide');
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

                    $('#modal-edit-room').modal('hide');
                }
            })
        }else{
            $('#modal-edit-room #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-room #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-edit-room').on('hidden.bs.modal', function (e) {
        $('#formEditDataRoom input').val('');
        clean("formEditDataRoom");
        $('#modal-edit-room #warning-message').empty();
    });

    // Delete
    roomsTable.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        rowClick = roomsTable.row($(this).closest('tr')).data() == undefined ? roomsTable.row($(this).closest('tr.child').prev()).data() : roomsTable.row($(this).closest('tr')).data()
        if(parseInt(rowClick[2]) > 0){
            $('#modal-delete-room-info').modal('show');
            return false;
        }

        if(confirm("¿Está seguro de que quiere borrar la sala " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/tellmebyeRooms/delete.php',
                method: 'POST',
                data: {
                    id: rowClick[0],
                    mortuaryTellmebye: rowClick[1],
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La sala se ha eliminado con éxito.</div>');

                        roomsTable.ajax.reload();
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
})