/**
 * Comprueba si el proveedor existe
 * 
 * @param {int} expedient Id de el proveedor
 * @return bool
 */
function existsSupplier(supplier){
    var check

    $.ajax({
        url: uri + 'core/suppliers/functions.php',
        method: 'POST',
        data: {
            type: 'existsSupplier',
            supplier: supplier
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data)
            }catch(e){
                check = false
            }
        },
        error: function(){
            check = false
        }
    })

    return check
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
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })
    changeSpaceFooter()
    if(existsSupplier(supplierID)){
        $('#existsSupplier').remove()
    }else{
        $('#existsSupplier').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'configuracion/proveedores'
        }, 2500);
        return
    }

    // PEDIDOS
    var table = $('#datatable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/suppliers/listOrders.php?id=" + supplierID,
        "responsive": false,
        "paging": true,
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
            {"title": "Proveedor"},
            {"title": "Solicitud"},
            {"title": "Recepción"},
            {"title": "Ver"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "viewClick",
            "targets": [1,2,3]
        },
        {
            "className": "date viewClick",
            "targets": [2,3],
            "searchable": false,
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "details-control centered viewClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-view'  title='Ver pedido'><i class='fa fa-search' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'proveedores',
            title: 'Proveedores',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'proveedores',
            title: 'Proveedores',
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
                            text: 'Listado de proveedores',
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
                columns: [1, 2, 3],
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
    });

    // PEDIDOS - EDITAR
    table.on('click', 'tbody .viewClick', function () {
        $('.btn-order').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'almacen/pedidos/' + rowClick[0]; 
    });
});