function getExpedientID(assistance) {
    var expedient;
    $.ajax({

        url: uri+"core/assistances/functions.php",
        data: {type: 'getExpedientID', assistance: assistance},
        type: 'POST',
        async: false,
        success: function (data) {
            expedient = $.parseJSON(data);            
        }
    });
    return expedient;
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
    // Toolbar Bottom
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
    
    //Datatables
    var selected = []
    
    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#assistances').DataTable({
        // "processing": true,
        // "serverSide": true,
        "ajax": uri+'core/assistances/listDatatables.php',
        "responsive": false,
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected')
            }
        },
        "select": true,
        // "paging": true,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        // "scrollY":  '650px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Fecha"},
            {"title": "Expediente"},
            {"title": "Nombre"},
            {"title": "Apellidos"},
            {"title": "PDF"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "date editClick",
            "targets": 1,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data > 0 ? moment(data, 'X').format('DD/MM/YYYY') : '-'
                }
                return data
            }
        },
        {
            "className": 'editClick',
            "targets": [2,3,4]
        },
        {
            "className": "details-control centered",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-pdf' title='PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered editClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'asistencias',
            title: 'Asistencias',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4],
                search: 'applied',
                order: 'applied'
            },
            filename: 'asistencias',
            title: 'Asistencias',
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
                            text: 'Listado de asistencias',
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
                columns: [1, 2, 3, 4],
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
    })

    // PDF asitencia
    table.on('click', 'tbody .btn-pdf', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var expedientID = getExpedientID(rowClick[0]);

        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'asistencia', text: text, service: expedientID, data: ""},
            type: 'POST',
            async: false,            
            success: function(data){
                text = data
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'asistencia', expedientID: expedientID},
                    type: 'POST',
                    async: false,            
                    success: function(){
                        window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/asistencia.pdf', '_blank')
                    }
                });
            }
        });


    })

    // Editar asistencia
    table.on('click', 'tbody .editClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide')
        
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'asistencias/editar/'+ rowClick[0]
    })

    // Eliminar asistencia
    table.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar la asistencia para el expediente: " + rowClick[2] + "?")){
            // Borrado
            $.post(uri + "core/assistances/delete.php", {assistance : rowClick[0]}, function(data){
                data = $.parseJSON(data)
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asistencia se ha eliminado con éxito.</div>')
                    table.ajax.reload();
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
        }

        // Go Top
        $('html, body').animate({scrollTop : 0}, 800)
    })

    // BUSCAR
    $('#input-search').on('keyup', function (){
        table.search( this.value ).draw()
    })
})