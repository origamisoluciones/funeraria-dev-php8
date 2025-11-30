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

$(function(){

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
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
    var table = $('#updates').DataTable({
        "ajax": uri+"core/adminUpdates/listByUser.php",
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
        "scrollY":  '570px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Título"},
            {"title": "Fecha"},
            {"title": "Readed"},
            {"title": "Ver"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0,3],
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets": [1],
            "render": function (data, type, row) {
                if(row[3] == '0'){
                    return '<strong>'+ data +'</strong>';
                }else{
                    return data;
                }
            }
        },
        {
            "className": "centered",
            "targets": 2,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : row[3] == '0' ? '<strong>'+moment(data, "X").format("DD/MM/YYYY HH:mm")+'</strong>' : moment(data, "X").format("DD/MM/YYYY HH:mm");
                }
                return data;
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent":"<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"p><"clear">',
        "order": [[2, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function(){
        table.search( this.value ).draw()
    })

    // READ
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/adminUpdates/readByUser.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#modal-show-update #updateID').val(data.updateID);
            $('#modal-show-update #titleInfo').html(data.title);
            $('#modal-show-update #message').html(data.message);

            $('#modal-show-update').modal('show');

            // Mark as readed the user notification
            if(parseInt(data.readed) == 0){
                $.post(uri + 'core/adminUpdates/updateReadedByUser.php', {ID : data.update_user}, function(data){
                    table.ajax.reload()
                })

                var countUpdates = parseInt($("#countUpdatesSidebar").text()) - 1;
                if(countUpdates > 0){
                    $("#countUpdatesSidebar").html(countUpdates);
                }else{
                    $("#countUpdatesSidebar").addClass('hide');
                }
            }
        })
    })

    $("#exportUpdate").click(function(){

        var updateID = $('#modal-show-update #updateID').val();
        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'update', text: text, update: updateID, data: ""},
            type: 'POST',
            async: false,            
            success: function(data){
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'update', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/update.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La actualización se ha descargado con éxito.</div>');
                        $('#modal-show-update').modal("hide");
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                });
            }
        });
    })
})