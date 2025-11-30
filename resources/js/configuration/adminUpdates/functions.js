//Select2 functions for remote data
function formatData (data) {
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

function inicializateFields(){

    var statusOptions = [{id: 1, text: 'Publicada'}, {id: 0, text: 'Borrador'}];
    $('#modal-new-update #status').select2({
        containerCssClass: 'select2-status',
        language: langSelect2,
        placeholder: 'Selecciona un estado...',
        data: statusOptions,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    })
    $('#modal-new-update #status').val(null).trigger('change');

    $('#modal-edit-update #statusEdit').select2({
        containerCssClass: 'select2-status',
        language: langSelect2,
        placeholder: 'Selecciona un estado...',
        data: statusOptions,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    })
    $('#modal-edit-update #statusEdit').val(null).trigger('change');

    //Loads the editor to meta_description field
    $('.text-editor').trumbowyg({
        lang: 'es',
        tagsToRemove: ['script', 'link'],
        btns: [
            ['formatting', 'fontfamily', 'fontsize', 'foreColor', 'backColor'],
            ['strong', 'em', 'underline'],
            ['superscript', 'subscript'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['lineheight'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['specialChars'],
            ['historyUndo', 'historyRedo'],
            ['fullscreen']
        ]
    })

}

$(function(){

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
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
    changeSpaceFooter()
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/adminUpdates/list.php",
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
            {"title": "Título"},
            {"title": "Fecha Publicación"},
            {"title": "Estado"},
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
            "className": "centered",
            "targets": [1],
        },
        {
            "className": "centered",
            "targets": 2,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY HH:mm")
                }
                return data
            }
        },
        {
            "className": "centered",
            "targets": [3],
            "render": function (data, type, row) {
                if(data == '0'){
                    data = 'Borrador';
                }else if(data == '1'){
                    data = 'Publicada';
                }else{
                    data = '-';
                }

                return data;
            }
        },
        {
            "className": "details-control centered",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function (data, type, row) {
                var result = "-";
                if(row[3] == '0'){
                    result = "<ul class='actions-menu'><li><a href='#' class='btn-edit editClick' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>";
                }

                return result;
            }
        },
        {
            "className": "details-control centered",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function (data, type, row) {
                var result = "-";
                if(row[3] == '0'){
                    result = "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete removeClick' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>";
                }
                return result;
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "order": [[2, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    inicializateFields();

    // CREATE
    $('#saveNewUpdate').click(function(){
        // Validaciones
        var validate = 0
        if(isEmpty($('#formNewData #title'))){
            validate++
        }
        if($('#formNewData #status').val() == null){
            validate++
        }
        if($('#formNewData #message').val() == ''){
            validate++
        }

        if(validate == 0){
            var title = $('#formNewData #title').val();
            var status = $('#formNewData #status').val();
            var message = $('#formNewData #message').val();

            $.post(uri + 'core/adminUpdates/create.php', {title : title, status : status, message: message}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El boletín se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-new-update').modal('hide')
        }else{
            $('#modal-new-update #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-update #warning-message').empty()
            }, 3500)
        }
    })

    // READ
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/adminUpdates/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditData #ID').val(data.ID)
            $('#formEditData #title').val(data.title)
            $('#formEditData #statusEdit').val(data.status).trigger('change');
            $('#formEditData #messageEdit').trumbowyg('html', data.message);
        })

        $('#modal-edit-update').modal('show')
    })

    // UPDATE
    $('#saveEditUpdate').click(function(){
        // Validaciones
        var validate = 0
        if(isEmpty($('#formEditData #title'))){
            validate++
        }
        if($('#formEditData #statusEdit').val() == null){
            validate++
        }
        if($('#formEditData #messageEdit').val() == ''){
            validate++
        }

        if(validate == 0){
            var ID = $('#formEditData #ID').val()
            var title = $('#formEditData #title').val();
            var status = $('#formEditData #statusEdit').val();
            var message = $('#formEditData #messageEdit').val();

            $.post(uri + 'core/adminUpdates/update.php', {ID : ID, title : title, status : status, message: message}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del boletín se han actualizado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            $('#modal-edit-update').modal('hide')
        }else{
            $('#modal-edit-update #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-update #warning-message').empty()
            }, 3500)
        }
    })

    // DELETE
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el boletín " + rowClick[1] + "?")){
            $.post(uri + 'core/adminUpdates/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El boletín se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
        }
    })
})