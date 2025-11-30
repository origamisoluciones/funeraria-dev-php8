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

$(window).bind("pageshow", function(){
    $.each($('form.form-inline'), function(){
        $(this).get(0).reset();
    })
});

$(function(){
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
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

    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    var from = 0;
    var to = 0;

    // Datatables
    var selected = []
    
    // Datatables. Inicialización y configuración de las opciones del plugin
    var cleaningCarsTable = $('#cleaningCarsTable').DataTable({
        "ajax": uri + "core/cleanings/cars/listDatatables.php?from=" + from + "&to=" + to,
        "responsive": false,
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected')
            }
        },
        "select": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '645px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nº Exp."},
            {"title": "Fecha Exp."},
            {"title": "Marca"},
            {"title": "Modelo"},
            {"title": "Matrícula"},
            {"title": "Limpieza antes"},
            {"title": "Limpieza después"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "date",
            "targets": 2,
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "cleanBefore",
            "targets": 6,
            "render" : function(data, type, row){
                    var user = data;
                    return user == null ? "-" : user;
                }
        },
        {
            "className": "cleanAfter",
            "targets": 7,
            "render" : function(data){
                    var user = data;
                    return user == null ? "-" : user;
                } 
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'limpieza coches',
            title: 'Limpieza coches',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'limpieza coches',
            title: 'Limpieza coches',
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
                            text: 'Listado de limpieza coches',
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
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'desc'], [1, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function () {
        cleaningCarsTable.search( this.value ).draw();
    });

    $('#search').click(function(){
        var validate = true;
        if(!isDate($("#from"))){
            validate = false;
        }
        if(!isDate($("#to"))){
            validate = false;
        }
        if(validate){
            var from = moment($('#from').val(), "DD/MM/YYYY").format('X');
            var to = moment($('#to').val(), "DD/MM/YYYY").format('X');
        
            cleaningCarsTable.ajax.url(uri + "core/cleanings/cars/listDatatables.php?from=" + from + "&to=" + to).load();
        }
        
    });
});