function formatData(data){
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
$(function(){
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
    $('#cancelLink').click(function(event) {
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

    $('#backLink').click(function(event) {
        $('#saveForm').click();
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // SELECT2
    //$.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    var limit_page = 10;

    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ...";
        },
        inputTooLong: function(args) {
            return "Término demasiado largo";
        },
        errorLoading: function() {
            return "No hay resultados";
        },
        loadingMore: function() {
            return "Cargando más resultados";
        },
        noResults: function() {
            return "No hay resultados";
        },
        searching: function() {
            return "Buscando...";
        },
        maximumSelected: function(args) {
            return "No hay resultados";
        }
    };

    //Select sin cuadro de búsquedas
    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
    }); 

    // - Cliente    
    $('#suppliers').select2({
        containerCssClass: 'select2-supplier',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/warehouse/deliveryNotes/correctiveActions/getSuppliers.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return {
                            text: item.name,
                            id: item.supplierID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $("#from").val('01/01/'+moment().format('YYYY'));
    $("#to").val('31/12/'+moment().format('YYYY'));

    var supplier = $('#suppliers').val();

    if($("#from").val() != ''){
        var from = moment($("#from").val(), 'DD/MM/YYYY').format('X');
    }
    if($("#to").val() != ''){
        var to = moment($("#to").val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
    }

    // ALBARANES - LISTADO
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/warehouse/deliveryNotes/correctiveActions/getDeliveryNotesDatatables.php?supplier=" + supplier+"&from="+from+"&to="+to,
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
        "scrollY":  '655px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": ""},
            {"title": "Fecha"},
            {"title": "Nº albarán"},
            {"title": "Proveedor"},
            {"title": "Total"},
            {"title": "Recibido"},
            {"title": "No conformidad"},
            {"title": "Editar"},
            /*{"title": "Eliminar"},*/
            {"title": "PDF"}
        ],        
        "columnDefs": [{
            "className" : "id",
            "targets" : 0,
            "searchable" : false,
            "orderable" : false,
            "visible" : false
        },
        {
            "className": "date",
            "targets": 1,
            "render" : function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "total",
            "targets": 4,
            "render" : function(data, type, row){
                var total
                $.ajax({
                    url: uri + "core/warehouse/deliveryNotes/functions.php",
                    data: {
                        type: 'getTotal',
                        ID : row[0]
                    },
                    type: 'POST',
                    async: false,
                    success: function(data){
                        total = $.parseJSON(data)
                        if(total.total == null){
                            total.total = 0
                        }
                        if(total.totalReceived == null){
                            total.totalReceived = 0
                        }
                    }
                })
                return total != null ? total.total + ' € (' + total.totalReceived + ' €)' : '-'
            }
        },
        {
            "className": "received",
            "targets": 5,
            "render" : function(data, type, row){
                return data == 0 ? 'No' : 'Si'
            }
        },
        {
            "className": "inAgreement",
            "targets": 6,
            "render" : function(data, type, row){
                return data == 0 ? "<ul class='actions-menu'><li><a class='btn-pdf-conf'  title='No conformidad'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a></li></ul>" : 'Si'
            }
        },
        {
            "className": "editClick",
            "targets": [1,2,3,4,6]
        },
        {
            "className": "details-control editClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "render" : function(data){
                return "<ul class='actions-menu'><li><a href='" + uri + "almacen/albaranes/" + data[0] + "' class='btn-edit'  title='Ver/Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
            }
        },
        /*{
            "className": "details-control centered removeClick",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "3%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a class='btn-delete'  title='Eliminar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        },*/
        {
            "className": "details-control pdfClick",
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
            filename: 'acciones correctivas',
            title: 'Acciones correctivas',
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
            filename: 'acciones correctivas',
            title: 'Acciones correctivas',
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
                            text: 'Listado de acciones correctivas',
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

    // ALBARANES - EDITAR
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var deliveryNote =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        window.open(uri + "almacen/albaranes/" + deliveryNote[0], '_blank');
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

    $('#searchButtom').click(function(){

        var supplier = '';
        var from = '';
        var to = '';

        if($('#suppliers').val() != null || $("#from").val() != '' || $("#to").val() != ''){
            var supplier = $('#suppliers').val();

            if($("#from").val() != ''){
                from = moment($("#from").val(), 'DD/MM/YYYY').format('X');
            }
            if($("#to").val() != ''){
                to = moment($("#to").val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
            }
        }
        table.ajax.url(uri + 'core/warehouse/deliveryNotes/correctiveActions/getDeliveryNotesDatatables.php?supplier=' + supplier+'&from='+from+'&to='+to).load();
    })
})