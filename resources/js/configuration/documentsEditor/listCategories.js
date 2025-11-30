/** @var {object} documentsCategoriesTable Documents editor table */
var documentsCategoriesTable = null;

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

    // List
    documentsCategoriesTable = $('#datatable').DataTable({
        "ajax": uri + 'core/documentsEditor/listCategories.php',
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
            {"title": "Documentos"},
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
            "targets": [1]
        },
        {
            "className": "details-control centered viewClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-view' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                if(parseInt(row[2]) > 0){
                    return '-';
                }
                return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'categorías editores documentación',
            title: 'Categorías editores documentación',
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
            filename: 'categorías editores documentación',
            title: 'Categorías editores documentación',
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
        documentsCategoriesTable.search(this.value).draw();
    });

    // Create
    $('#saveNewCategory').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewDataCategory #name'))){
            validate++;
        }
        
        if(validate == 0){
            var name = $("#formNewDataCategory #name").val();

            $.ajax({
                url: uri + 'core/documentsEditor/createCategory.php',
                method: 'POST',
                data: {
                    name: name,
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data);

                    if(data === 'exists'){
                        $('#modal-new-category #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una categoría con ese nombre</div>')
                    }else if(data === false){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-category').modal('hide');
                    }else{
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La categoría se ha creado con éxito.</div>');
                        documentsCategoriesTable.ajax.reload();
                        $('#modal-new-category').modal('hide');
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
            $('#modal-new-category #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-category #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-new-category').on('hidden.bs.modal', function (e) {
        $('#formNewDataCategory input').val('');
        clean("formNewDataCategory");
        $('#modal-new-category #warning-message').empty();
    });

    // View document
    documentsCategoriesTable.on('click', 'tbody .viewClick', function(){
        $('.btn-view').tooltip('hide');
        
        rowClick = documentsCategoriesTable.row($(this).closest('tr')).data() == undefined ? documentsCategoriesTable.row($(this).closest('tr.child').prev()).data() : documentsCategoriesTable.row($(this).closest('tr')).data()
        
        window.location.href = uri + 'configuracion/editor-documentacion/categorias/documentos/' + rowClick[0];
    });

    // Read
    documentsCategoriesTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');
        
        rowClick = documentsCategoriesTable.row($(this).closest('tr')).data() == undefined ? documentsCategoriesTable.row($(this).closest('tr.child').prev()).data() : documentsCategoriesTable.row($(this).closest('tr')).data()
        $.ajax({
            url: uri + 'core/documentsEditor/readCategory.php',
            method: 'POST',
            data: {
                documentCategoryID: rowClick[0]
            },
            async: false,
            success: function(data){
                data = $.parseJSON(data);

                $('#formEditDataCategory #categoryID').val(data[0].ID);
                $('#formEditDataCategory #name').val(data[0].categoryName); 

                $('#modal-edit-category').modal('show');
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
    $('#saveEditCategory').click(function(){
        var validate = 0

        if(isEmpty($('#formEditDataCategory #name'))){
            validate++
        }

        if(validate == 0){
            var categoryID = $("#formEditDataCategory #categoryID").val();
            var name = $("#formEditDataCategory #name").val();

            $.ajax({
                url: uri + 'core/documentsEditor/updateCategory.php',
                method: 'POST',
                data: {
                    categoryID: categoryID,
                    name: name,
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data);

                    if(data === 'exists'){
                        $('#modal-edit-category #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una categoría con ese nombre</div>')
                    }else if(data === false){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-edit-category').modal('hide');
                    }else{
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la categoría se han actualizado con éxito.</div>');
                        documentsCategoriesTable.ajax.reload();
                        $('#modal-edit-category').modal('hide');
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

                    $('#modal-edit-category').modal('hide');
                }
            })
        }else{
            $('#modal-edit-category #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-category #warning-message').empty()
            }, 3500)
        }
    });

    $('#modal-edit-category').on('hidden.bs.modal', function (e) {
        $('#formEditDataCategory input').val('');
        clean("formEditDataCategory");
        $('#modal-edit-category #warning-message').empty();
    });

    // Delete
    documentsCategoriesTable.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        rowClick = documentsCategoriesTable.row($(this).closest('tr')).data() == undefined ? documentsCategoriesTable.row($(this).closest('tr.child').prev()).data() : documentsCategoriesTable.row($(this).closest('tr')).data()
        if(parseInt(rowClick[2]) > 0){
            $('#modal-delete-category-info').modal('show');
            return false;
        }

        if(confirm("¿Está seguro de que quiere borrar la categoría " + rowClick[1] + "? Esta acción eliminará también todos los documentos de la misma. ¿Quieres continuar?")){
            $.ajax({
                url: uri + 'core/documentsEditor/deleteCategory.php',
                method: 'POST',
                data: {
                    documentCategoryID: rowClick[0]
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La categoría y todos sus documentos se han eliminado con éxito.</div>');

                        documentsCategoriesTable.ajax.reload();
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