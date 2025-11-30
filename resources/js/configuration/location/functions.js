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
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    });
    changeSpaceFooter()

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "processing": true,
        "serverSide": true,
        ajax: {
            url: uri+"core/locations/listDatatables.php",
            method: 'POST',
            async: true
        },
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
            {"title": "Localidad"},
            {"title": "Código Postal"},
            {"title": "Provincia"},
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
            "targets": [1,2,3],
        },
        {
            "className": "details-control centered editClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit'  title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 5,
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
                columns: [1, 2, 3],
                search: 'applied',
                order: 'applied'
            },
            filename: 'localidades',
            title: 'Localidades',
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
            filename: 'localidades',
            title: 'Localidades',
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
                            text: 'Listado de localidades',
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
        "order": [[1, 'asc']]
    });

    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    //Create. Nueva localidad
    $('#saveNewLocation').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewData #name'))){
            validate++;
        }
        if(isEmpty($('#formNewData #postalCode'))){
            validate++;
        }
        if(isEmpty($('#formNewData #province'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewData #name").val();
            var postalCode = $("#formNewData #postalCode").val();
            
            if(postalCode == "undefined" || postalCode == ""){
                postalCode = "NULL";
            }

            var province = $("#formNewData #province").val();

            $.post(uri+"core/locations/create.php", {name: name, postalCode: postalCode, province: province}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La localidad se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            $('#modal-new-location').modal('hide');
        }else{
            $('#modal-new-location #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-location #warning-message').empty()
            }, 3500)
        }
    });

    //Edit. Acción editar un localidad
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri+"core/locations/read.php", {locationID: rowClick[0]}, function(data){
            data = $.parseJSON(data);
            $('#formEditData #locationID').val(data[0].locationID);
            $('#formEditData #name').val(data[0].name); 
            $('#formEditData #postalCode').val(data[0].postalCode);
            $('#formEditData #province').val(data[0].province);
        });

        $('#modal-edit-location').modal('show');
    });
    
    //Update. Actualizamos los datos de la localidad tras la acción "editar"
    $('#saveEditLocation').click(function(){
        var validate = 0;

        if(isEmpty($('#formEditData #name'))){
            validate++;
        }
        if(isEmpty($('#formEditData #postalCode'))){
            validate++;
        }
        if(isEmpty($('#formEditData #province'))){
            validate++;
        }

        if(validate == 0){
            var locationID = $("#formEditData #locationID").val();
            var name = $("#formEditData #name").val();
            var postalCode = $("#formEditData #postalCode").val();
            var province = $("#formEditData #province").val();
            
            $.post(uri+"core/locations/update.php", {locationID: locationID, name: name, postalCode: postalCode, province: province}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la localidad se han actualizado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            $('#modal-edit-location').modal('hide');
        }else{
            $('#modal-edit-location #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-location #warning-message').empty()
            }, 3500)
        }
    });
    
    //Delete. Eliminamos un localidad
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar la localidad " + rowClick[1] + "?")){
            $.post(uri+"core/locations/delete.php", {locationID: rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La localidad se ha eliminado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });
        }
    });

    //Modales. Acciones
    $('#modal-new-location').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');
        $("#formNewData #location").val('').trigger('change');
        clean("formNewData");
        $('#modal-new-location #warning-message').empty()
    });

    $('#modal-edit-location').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');
        $("#formEditData #location").val('').trigger('change');
        clean("formEditData");
        $('#modal-edit-location #warning-message').empty()
    });
});