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
    
    // Datatables. Inicialización y configuración de las opciones del plugin
    var budgetsTable = $('#budgetsTable').DataTable({
        "ajax": uri + "core/budgets/listDatatables.php",
        "responsive": false,
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
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Expediente"},
            {"title": "Fecha"},
            {"title": "Nombre del cliente"},
            {"title": "Apellidos del cliente"},
            {"title": "Nombre del difunto"},
            {"title": "Apellidos del difunto"},
            {"title": "Importe"},
            {"title": "Usuario"},
            {"title": ""},
            {"title": "Ver"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "targets": [9],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets": 1,
            "render": function (data, type, row) {
                return  "<a target='_blank' href='"+uri + 'expediente/contratacion/'+row[0]+"' title='Ir al expediente "+data+"'>"+data+"</a>";
            }
        },
        {
            "className": "centered",
            "targets": [2],
            "render": function (data, type, row) {
                if(type==='display' || type === 'filter'){
                    if(data > 0){
                        return moment(data, "X").format("DD/MM/YYYY");
                    }else{
                        return '-'
                    }
                }else{
                    return data
                }
            }
        },
        {
            "className": "centered",
            "targets": [3,4,5,6,7,8],
        },
        {
            "className": "centered",
            "targets": [7],
            "render": function (data, type, row) {
                return toFormatNumber(parseFloat(data).toFixed(2)) + " €";
            }
        },
        {
            "className": "details-control centered",
            "targets": 10,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function (data, type, row) {
                return  "<ul class='actions-menu'><li><a class='viewClick' expedient = '" + row[0] + "' budget = '" + row[9] + "'  title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>";

            }
        },
        {
            "className": "details-control centered",
            "targets": 11,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function (data, type, row) {
                return "<ul class='actions-menu'><li><a class='btn-delete removeClick' expedient = '" + row[0] + "' budget = '" + row[9] + "' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>";

            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            filename: 'presupuestos',
            title: 'Presupuestos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            filename: 'presupuestos',
            title: 'Presupuestos',
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
                            text: 'Listado de presupuestos',
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
                columns: [1, 2, 3, 4, 5, 6, 7, 8],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'desc'], [0, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function () {
        budgetsTable.search( this.value ).draw();
    });

    budgetsTable.on('click', 'tbody .viewClick', function () {
        $('.btn-view').tooltip('hide');
        
        budgetID = $(this).attr("budget");
        expedientID = $(this).attr("expedient");

        var numBudget;
        $.ajax({
            url: uri + "core/budgets/functions.php",
            data: {
                budget: budgetID,
                type: 'getNumBudget'
            },
            type: 'POST',
            async: false,
            success: function (data){
                data = $.parseJSON(data)
                numBudget = data.replace(" ", "-");
                numBudget = data.replace("/", "-");
            }
        });

        window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/presupuesto_'+numBudget+'.pdf', '_blank')   
    });

    budgetsTable.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        budgetID = $(this).attr("budget");
        expedientID = $(this).attr("expedient");
        
        var rowClick = budgetsTable.row($(this).closest('tr')).data() == undefined ? budgetsTable.row($(this).closest('tr.child').prev()).data() : budgetsTable.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere borrar el presupuesto para el expediente " + rowClick[1] + "?")){
            $.ajax({
                url: uri + "core/budgets/delete.php",
                data: {expedient: expedientID, budget : budgetID},
                type: 'POST',
                async: false,
                success: function (data){
                    try{
                        budgetsTable.ajax.reload();
                    
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido creado con éxito.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ha ocurrido un error al procesar su solicitud.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                }
            });
        }
    });
});