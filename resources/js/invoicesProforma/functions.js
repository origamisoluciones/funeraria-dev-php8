/** @var {array} invoicesProformaTable Stores invoices proforma table */
var invoicesProformaTable = null;

/** @var {array} rowClickInvoicesProforma Stores data from row clicked of invoices proforma table */
var rowClickInvoicesProforma = null;

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
    invoicesProformaTable = $('#invoicesProformaTable').DataTable({
        "ajax": uri + "core/invoicesProforma/listDatatables.php",
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
            {"title": "expedient_id"},
            {"title": "Número"},
            {"title": "Expediente"},
            {"title": "Fecha"},
            {"title": "Cliente"},
            {"title": "Difunto"}, // 5
            {"title": "Importe"},
            {"title": "Usuario"},
            {"title": "invoice_id"},
            {"title": "is_expedient_tpv"},
            {"title": "Ver"}
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "targets": [8,9],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets": [2],
            "render": function (data, type, row) {
                return  "<a target='_blank' href='"+uri + 'expediente/contratacion/'+row[0]+"' title='Ir al expediente "+data+"'>"+data+"</a>";

            }
        },
        {
            "className": "centered",
            "targets": [3],
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
            "targets": [1,4,5,6,7],
        },
        {
            "className": "centered",
            "targets": [6],
            "render": function (data, type, row) {
                return toFormatNumber(parseFloat(data).toFixed(2)) + " €";
            }
        },
        {
            "className": "details-control centered",
            "targets": [10],
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "render": function (data, type, row) {
                return  "<ul class='actions-menu'><li><a class='viewClick' expedient = '" + row[0] + "' budget = '" + row[8] + "'  title='Ver'><i class='fa fa-eye' aria-hidden='true'></i></a></li></ul>";

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
            filename: 'facturas proforma',
            title: 'Facturas proforma',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7],
                search: 'applied',
                order: 'applied'
            },
            filename: 'facturas proforma',
            title: 'Facturas proforma',
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
                            text: 'Listado de facturas proforma',
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
        "order": [[3, 'desc'], [0, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function () {
        invoicesProformaTable.search( this.value ).draw();
    });

    invoicesProformaTable.on('click', 'tbody .viewClick', function () {
        $('.btn-view').tooltip('hide');

        rowClickInvoicesProforma = invoicesProformaTable.row($(this).closest('tr')).data() == undefined ? invoicesProformaTable.row($(this).closest('tr.child').prev()).data() : invoicesProformaTable.row($(this).closest('tr')).data();
        
        var numInvoice = rowClickInvoicesProforma[1].replace("/", "-");

        window.open(uri + 'descargar-archivo?file=expedients/' + rowClickInvoicesProforma[0] + '/docs/invoicesProforma/' + numInvoice + '.pdf', '_blank');
    });
});