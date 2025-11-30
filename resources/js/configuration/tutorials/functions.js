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

    var statusOptions = [{id: 1, text: 'Publicado'}, {id: 0, text: 'Borrador'}];
    $('#modal-new-tutorial #status').select2({
        containerCssClass: 'select2-status',
        language: langSelect2,
        allowClear: true,
        placeholder: 'Selecciona un estado...',
        data: statusOptions,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    })
    $('#modal-new-tutorial #status').val(null).trigger('change');

    $('#modal-edit-tutorial #statusEdit').select2({
        containerCssClass: 'select2-status',
        language: langSelect2,
        allowClear: true,
        placeholder: 'Selecciona un estado...',
        data: statusOptions,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    })
    $('#modal-edit-tutorial #statusEdit').val(null).trigger('change');
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
        "ajax": uri+"core/tutorials/list.php",
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
            {"title": "Ver"},
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
            "targets": [2],
            "render": function (data, type, row) {
                return '<u><a href="'+data+'" target="_blank"><i class="fa fa-eye" aria-hidden="true"></i></a></u>'
            }
        },
        {
            "className": "centered",
            "targets": 3,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY HH:mm")
                }
                return data == null ? 0 : moment(data, "X").format("DD/MM/YYYY HH:mm")
            }
        },
        {
            "className": "centered",
            "targets": [4],
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
            "className": "details-control centered editClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent":"<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent":"<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
           
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "order": [[3, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    inicializateFields();

    // CREATE
    $('#saveNewTutorial').click(function(){
        // Validaciones
        var validate = 0
        if(isEmpty($('#formNewData #title'))){
            validate++
        }
        if($('#formNewData #status').val() == null){
            validate++
        }
        if(isEmpty($('#formNewData #link'))){
            validate++
        }

        if(validate == 0){
            var title = $('#formNewData #title').val();
            var status = $('#formNewData #status').val();
            var link = $('#formNewData #link').val();

            $.post(uri + 'core/tutorials/create.php', {title : title, status : status, link: link}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tutorial se ha añadido con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-new-tutorial').modal('hide')
        }else{
            $('#modal-new-tutorial #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-tutorial #warning-message').empty()
            }, 3500)
        }
    })

    $("#modal-new-tutorial").on('hidden.bs.modal', function(){
        clean("formNewData");
        $("#modal-new-tutorial #title").val('');
        $("#modal-new-tutorial #status").val(null).trigger('change');
        $("#modal-new-tutorial #link").val('');
    })

    // READ
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/tutorials/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditData #ID').val(data.ID)
            $('#formEditData #title').val(data.title)
            $('#formEditData #statusEdit').val(data.status).trigger('change');
            $('#formEditData #link').val(data.link)
        })

        $('#modal-edit-tutorial').modal('show')
    })

    // UPDATE
    $('#saveEditTutorial').click(function(){
        // Validaciones
        var validate = 0
        if(isEmpty($('#formEditData #title'))){
            validate++
        }
        if($('#formEditData #statusEdit').val() == null){
            validate++
        }
        if(isEmpty($('#formEditData #link'))){
            validate++
        }

        if(validate == 0){
            var ID = $('#formEditData #ID').val()
            var title = $('#formEditData #title').val();
            var status = $('#formEditData #statusEdit').val();
            var link = $('#formEditData #link').val();

            $.post(uri + 'core/tutorials/update.php', {ID : ID, title : title, status : status, link: link}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del tutorial se han actualizado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            $('#modal-edit-tutorial').modal('hide')
        }else{
            $('#modal-edit-tutorial #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-tutorial #warning-message').empty()
            }, 3500)
        }
    })

    $("#modal-edit-tutorial").on('hidden.bs.modal', function(){
        clean("formEditData");
        $("#modal-edit-tutorial #title").val('');
        $("#modal-edit-tutorial #statusEdit").val(null).trigger('change');
        $("#modal-edit-tutorial #link").val('');
    })

    // DELETE
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el tutorial " + rowClick[1] + "?")){
            $.post(uri + 'core/tutorials/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El tutorial se ha eliminado con éxito.</div>')
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