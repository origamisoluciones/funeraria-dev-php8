function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height()
    $('.content-wrapper').css('padding-bottom', heightFooter)
}



$(window).scroll(function(){
    changeSpaceFooter();
})
$(window).resize(function(){
    changeSpaceFooter();
})
$(function(){
    // TOOLBAR BOTTOM
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

    $('#from').val('01/' + moment().format('MM') + '/' + moment().format('YYYY'))
    $('#to').val(moment().endOf('month').format('DD') + '/' + moment().format('MM') + '/' + moment().format('YYYY'))

    var from = moment($('#from').val(), "DD/MM/YYYY").format('X');
    var to = moment($('#to').val(), "DD/MM/YYYY").format('X');

    // LOGS - LISTADO
    var table = $('#logs-table').DataTable({
        "processing": true,
        "serverSide": true,
        ajax: {
            url: uri + 'core/logs/listDatatables.php',
            method: 'POST',
            data: {
                from: from,
                to: to
            },
            dataType: 'json',
            async: true,
        },
		"responsive": false,      
        "paging": true,
        "pageLength": 50,
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
			{"title": "Fecha"},
			{"title": "Usuario"},
			{"title": "Categoría"},
			{"title": "Acción"},
			{"title": "Expediente"},
			{"title": "Descripción"}
		],
		"columnDefs": [
            {
                "className": "date",
                "targets": 0,
                "render": function(data, type){
                    if(type === 'display' || type === 'filter'){
                        return moment(data, 'X').format('DD/MM/YYYY HH:mm:ss')
                    }
                    return data
                }
            },
            {
                "className": "centered",
                "targets": 4,
                "render": function(data, type, row){
                    if(data != null && data != 'null'){
                        return data;
                    }else{
                        return '-';
                    }
                }
		}],
		"dom": 'rt<"bottom bottom-2"p><"clear">',
		"order": [[0, 'desc']]
    });

    // LOGS - BUSCAR
    $('#input-search').on( 'keyup', function () {
      	table.search( this.value ).draw();
    });

    $('#search').click(function(){
        pdfType = "search";
        var validate = 0
        if(!isDate($("#from"))){
            validate++
        }
        if(!isDate($("#to"))){
            validate++
        }
        if(validate == 0){
            var from = moment($('#from').val(), "DD/MM/YYYY").format('X');
            var to = moment($('#to').val(), "DD/MM/YYYY").format('X');

            table.ajax.url(uri + "core/logs/listDatatables.php?from=" + from + "&to=" + to).load();
        }
    });
});