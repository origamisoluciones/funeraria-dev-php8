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
$(function () {
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
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
    changeSpaceFooter()
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Select2
    $.fn.select2.defaults.set("width", "100%");
    //Select sin cuadro de búsquedas
    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
    });

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/templates/listDatatables.php",
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
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Plantilla"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick",
            "targets": 1
        },
        {
            "className": "details-control centered editClick",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'plantillas',
            title: 'Plantillas',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            filename: 'plantillas',
            title: 'Plantillas',
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
                            text: 'Listado de plantillas',
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
                columns: [1],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[1, 'asc']]
    });

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    //Cargamos las opciones en los "clientType" que utilizamos
    $.post(uri+'core/clients/functions.php', {type: 'getClientTypes'}, function(data){
        data = $.parseJSON(data);
        data.forEach(function(element) {
            var optionsClientType = new Option(element.name, element.clientTypeID, false, false);
            // Añadimos al select de clientType
            $('.client').append(optionsClientType).trigger('change');
        });
    });

    //Cargamos las opciones en los "clientType" que utilizamos
    $.post(uri+'core/prices/functions.php', {type: 'getPrices'}, function(data){
        data = $.parseJSON(data);
        data.forEach(function(element) {
            var optionPrices = new Option(element.name, element.priceID, false, false);
            // Añadimos al select de clientType
            $('.price').append(optionPrices).trigger('change');
        });
    });

    //Create. Nueva plantilla
    $('#saveNewTemplate').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #client'))){
            validate++;
        }
        if(isEmpty($('#formNewData #price'))){
            validate++;
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
            var name = $("#formNewData #name").val();
            var client = $("#formNewData #client").val();
            var price = $("#formNewData #price").val();
            
            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/templates/create.php", {name: name, client: client, price: price}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                //Recargamos la tabla con los nuevos datos
                table.ajax.reload();
            });

            //Ocultamos la ventana modal
            $('#modal-new-template').modal('hide');
            $('#formNewData #name').val('');
            $('#formNewData #client').val('');
            $('#formNewData #total').val('');
        }else{
            $('#modal-new-template #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-template #warning-message').empty()
            }, 3500)
        }
    });

    //Editamos la plantilla
    table.on('click', 'tbody .editClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        window.location.href = uri + 'configuracion/plantillas/' + rowClick[0];
    });

    //Delete. Eliminamos una plantilla
    table.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar la plantilla " + rowClick[1] + "?")){
            $.post(uri+"core/templates/delete.php", {templateID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La plantilla se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
                
                //Recargamos la tabla con los nuevos datos
                table.ajax.reload();
            });
        }
    });

    //Modales. Acciones
    $('#modal-new-template').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        clean("formNewData");
        $('#modal-new-template #warning-message').empty()
    });
});