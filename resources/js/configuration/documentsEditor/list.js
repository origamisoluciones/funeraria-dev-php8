/** @var {object} categoryID Category ID */
const categoryID = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];

/** @var {object} documentsTable Documents editor table */
var documentsTable = null;

/** @var {object} rowClick Row click table */
var rowClick = null;

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
 * Gets info page
 */
function getInfoPage(){
    $.ajax({
        url: uri + 'core/documentsEditor/infoDocuments.php',
        data: {
            documentCategoryID: categoryID
        },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            if(data !== false){
                $('#categoryNameTitle').text(data[0].categoryName);
            }
        }
    });
}

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

    // Info page
    getInfoPage();

    // SELECT
    $.fn.select2.defaults.set("width", "100%");
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

    $('#categoryCopy').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/documentsEditor/getCategoriesSelect2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
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

    // List
    documentsTable = $('#datatable').DataTable({
        "ajax": uri + 'core/documentsEditor/list.php?category=' + categoryID,
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
            {"title": "Tamaño"},
            {"title": "Editar"},
            {"title": "Duplicar"},
            {"title": "Renombrar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": 'viewClick',
            "targets": [1, 2]
        },
        {
            "className": "details-control centered viewClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered duplicateClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-duplicate' title='Duplicar'><i class='fa fa-clipboard' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 6,
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
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'editores documentación',
            title: 'Editores documentación',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'editores documentación',
            title: 'Editores documentación',
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
        "order": [[1, 'asc']]
    });

    $('#input-search').on('keyup', function () {
        documentsTable.search(this.value).draw();
    });

    // Create
    $('#saveNewDocument').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #pageSize'))){
            validate++;
        }
        
        if(validate == 0){
            var name = $("#formNewData #name").val();
            var pageSize = $("#formNewData #pageSize").val();

            $.ajax({
                url: uri + 'core/documentsEditor/create.php',
                method: 'POST',
                data: {
                    categoryID: categoryID,
                    name: name,
                    pageSize: pageSize
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El documento se ha creado con éxito.</div>');

                        documentsTable.ajax.reload();
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
    
            $('#modal-new-document').modal('hide');
        }else{
            $('#modal-new-document #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-document #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-document').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        clean("formNewData");
        $('#modal-new-document #warning-message').empty();
        $('#formNewData #pageSize').val('A4');
    });

    // View document
    documentsTable.on('click', 'tbody .viewClick', function(){
        $('.btn-view').tooltip('hide');
        
        rowClick = documentsTable.row($(this).closest('tr')).data() == undefined ? documentsTable.row($(this).closest('tr.child').prev()).data() : documentsTable.row($(this).closest('tr')).data()
        
        window.location.href = uri + 'configuracion/editor-documentacion/categorias/documentos/documento/' + rowClick[0];
    });

    // Read
    documentsTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');
        
        rowClick = documentsTable.row($(this).closest('tr')).data() == undefined ? documentsTable.row($(this).closest('tr.child').prev()).data() : documentsTable.row($(this).closest('tr')).data()
        $.ajax({
            url: uri + 'core/documentsEditor/read.php',
            method: 'POST',
            data: {
                documentID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data);

                $('#formEditData #documentID').val(data[0].ID);
                $('#formEditData #name').val(data[0].documentName); 

                $('#modal-edit-document').modal('show');
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    });
    
    // Update
    $('#saveEditDocument').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }

        if(validate == 0){
            var documentID = $("#formEditData #documentID").val();
            var name = $("#formEditData #name").val();

            $.ajax({
                url: uri + 'core/documentsEditor/update.php',
                method: 'POST',
                data: {
                    documentID: documentID,
                    name: name,
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del documento se han actualizado con éxito.</div>');

                        documentsTable.ajax.reload();
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

            $('#modal-edit-document').modal('hide');
        }else{
            $('#modal-edit-document #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-document #warning-message').empty()
            }, 3500)
        }
    });

    // Delete
    documentsTable.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        rowClick = documentsTable.row($(this).closest('tr')).data() == undefined ? documentsTable.row($(this).closest('tr.child').prev()).data() : documentsTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/documentsEditor/delete.php',
                method: 'POST',
                data: {
                    documentID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El documento se ha eliminado con éxito.</div>');

                        documentsTable.ajax.reload();
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

    // Duplicate
    documentsTable.on('click', 'tbody .duplicateClick', function () {
        $('.btn-delete').tooltip('hide');

        rowClick = documentsTable.row($(this).closest('tr')).data() == undefined ? documentsTable.row($(this).closest('tr.child').prev()).data() : documentsTable.row($(this).closest('tr')).data()

        $('#modal-duplicate-document').modal('show');
    })

    // Duplicate document
    $('#goDuplicateDocument').click(function(){
        var validate = 0

        if(isEmpty($('#formDuplicateData #name'))){
            validate++
        }
        if(isEmpty($('#formDuplicateData #categoryCopy'))){
            validate++
        }

        if(validate == 0){
            var documentID = rowClick[0];
            var name = $("#formDuplicateData #name").val();
            var category = $("#formDuplicateData #categoryCopy").val();

            $.ajax({
                url: uri + 'core/documentsEditor/duplicateDocument.php',
                method: 'POST',
                data: {
                    documentID: documentID,
                    name: name,
                    category: category
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El documento ha sido duplicado con éxito.</div>');

                        documentsTable.ajax.reload();
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

            $('#modal-duplicate-document').modal('hide');
        }else{
            $('#modal-duplicate-document #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-duplicate-document #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-duplicate-document').on('hidden.bs.modal', function (e) {
        $('#formDuplicateData input').val('');
        clean("formDuplicateData");
        $('#modal-duplicate-document #warning-message').empty();
        $('#formDuplicateData #categoryCopy').val(null).trigger('change');
    });
})