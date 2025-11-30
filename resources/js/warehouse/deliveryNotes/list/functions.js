// SELECT2
var limit_page = 10
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

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>'
    return data
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

$(window).bind("pageshow", function(){
    $.each($('form.form-inline'), function(){
        $(this).get(0).reset();
    })
});

$(function(){
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    changeSpaceFooter()
    $('#backLink').click(function(event){
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
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // DATEPICKER
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT2
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    // ALBARANES - LISTADO
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/warehouse/deliveryNotes/listDatatables.php",
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
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Nº albarán"},
            {"title": "Fecha"},
            {"title": "Proveedor"},
            {"title": "Total"},
            {"title": "Recibido"},
            {"title": "Conforme"},
            {"title": "Editar"},
            {"title": "PDF"}
        ],        
        "columnDefs": [{
            "className" : "centered id",
            "targets" : 0,
            "searchable" : false,
            "orderable" : false,
            "visible" : false
        },
        {
            "className": "centered date",
            "targets": 2,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "centered",
            "targets": 1,
            "render" : function(data){
                return data == '' ? "-" : data
            }
        },
        {
            "className": "centered total",
            "targets": 4,
            "render" : function(data, type, row){
                var total = data
                if(total != null && total.total == null){
                    total.total = 0
                }
                if(total != null && total.totalReceived == null){
                    total.totalReceived = 0
                }
                return total != null ? '<strong>'+ toFormatNumber(parseFloat(total.total).toFixed(2)) + ' €</strong> (' + toFormatNumber(parseFloat(total.totalReceived).toFixed(2)) + ' €)' : '-'
            }
        },
        {
            "className": "centered received",
            "targets": 5,
            "render" : function(data, type, row){
          
                return data == 0 ? "<strong>NO</strong>" : "<strong>SI</strong>"
            }
        },
        {
            "className": "centered inAgreement",
            "targets": 6,
            "render" : function(data, type, row){
                return data == 0 ? "<strong>NO</strong>" : "<strong>SI</strong>"
            }
        },
        {
            "className": "centered editClick",
            "targets": [1,2,3,4,6]
        },
        {
            "className": "centered details-control centered editClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render" : function(data){
                return "<ul class='actions-menu'><li><a href='" + uri + "almacen/albaranes/" + data[0] + "' class='btn-edit'  title='Ver/Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            }
        },
        {
            "className": "details-control centered pdfClick",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-pdf'  title='Generar PDF'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'albaranes',
            title: 'Albaranes',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'albaranes',
            title: 'Albaranes',
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
                            text: 'Listado de albaranes',
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
                columns: [1, 2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'desc']]
    })

    // ALBARANES - BÚSQUEDA
    $('#input-search').on('keyup', function(){
        table.search( this.value ).draw()
    })

    // ALBARANES - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')
        
        var deliveryNote =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        // window.open(uri + "almacen/albaranes/" + deliveryNote[0], '_blank');
        window.location.href = uri + "almacen/albaranes/" + deliveryNote[0];
    });

    // ALBARANES - ELIMINAR
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')
        var deliveryNote =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        if(confirm("¿Está seguro de que quiere borrar el albarán " + deliveryNote[2] + "!")){
            $.ajax({
                url: uri + 'core/warehouse/deliveryNotes/delete.php',
                method: 'POST',
                data: {
                    ID: deliveryNote[0]
                },
                async: false,
                success: function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El albarán se ha eliminado con éxito.</div>')
                        
                        table.ajax.reload()
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // ALBARANES - CREAR PDF
    table.on('click', '.pdfClick', function () {
        $('.btn-pdf').tooltip('hide')
        var deliveryNote =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var text;
        //window.open(uri + 'documento/nuevo/' + deliveryNote + '/albaran', '_blank');
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'albaran', text: text, service: deliveryNote[0], data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'albaran', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/albaran.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })
    
    // ALBARANES - CREAR PDF
    table.on('click', '.inAgreement', function () {
        $('.btn-pdf').tooltip('hide')
        var deliveryNote =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        var text;
        //window.open(uri + 'documento/nuevo/' + deliveryNote + '/noConformidad', '_blank');
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'noConformidad', text: text, service: deliveryNote[0], data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'noConformidad', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/noConformidad.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })

    // ALBARANES - CREAR PDF
    $('#genPDF').click(function(){
        var text;
        //window.open(uri + 'documento/nuevo/' + deliveryNote + '/noConformidades', '_blank');
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'noConformidades', text: text, service: 0, data: ""},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'noConformidades', expedientID: 0},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/noConformidades.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })
})