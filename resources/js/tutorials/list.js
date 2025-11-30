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

/**
 * Gets id from youtube url
 * 
 * @param {string} url Url
 * @return {string}
 */
function getIdFromYoutubeUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
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
    var table = $('#tutorials').DataTable({
        "ajax": uri+"core/tutorials/listPublic.php",
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
            {"title": "Ver"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0,2],
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets": [1],
        },
        {
            "className": "details-control centered editClick",
            "targets": 3,
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

        var update =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/tutorials/read.php', {ID : update[0]}, function(data){
            data = $.parseJSON(data)

            if(data.link.includes("youtube") || data.link.includes("youtu.be")){
                $('#modal-show-tutorial #titleInfo').html(data.title);
                var id = getIdFromYoutubeUrl(data.link);
                if(id != null){
                    $('#modal-show-tutorial #previewVideo').attr('src', 'https://www.youtube.com/embed/' + id)
                }
    
                setTimeout(() => {
                    $('#modal-show-tutorial').modal('show');
                }, 500);
            }else{
                window.open(data.link);
            }
        })
    })
})