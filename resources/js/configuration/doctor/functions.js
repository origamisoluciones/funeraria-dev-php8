//Select2 functions for remote data
function formatData (data) {
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
    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    $('#backLink').click(function(event) {
        event.preventDefault() 
        history.back(1)
    })
    changeSpaceFooter()
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Datatables. Inicialización y configuración de las opciones del plugin
    var table = $('#datatable').DataTable({
        "ajax": uri+"core/doctors/listDatatables.php",
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
            {"title": "Nombre"},
            {"title": "Colegiado"},
            {"title": "Email"},
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
            filename: 'médicos',
            title: 'Médicos',
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
            filename: 'médicos',
            title: 'Médicos',
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
                            text: 'Listado de médicos',
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
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on( 'keyup', function () {
        table.search( this.value ).draw()
    })

    // CREATE
    $('#saveNewDoctor').click(function(){
        // Validaciones
        var validate = 0

        if(isEmpty($('#formNewData #name'))){
            validate++
        }
        if($('#formNewData #email').val() != ''){
            if(!isEmail($("#formNewData #email"))){
                validate++
            }
        }

        if(validate == 0){
            var name = $('#formNewData #name').val()
            var college = $('#formNewData #college').val()
            var email = $('#formNewData #email').val()

            $.post(uri + 'core/doctors/create.php', {name : name, college : college, email : email}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El médico se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-new-doctor').modal('hide')
        }else{
            $('#modal-new-doctor #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-doctor #warning-message').empty()
            }, 3500)
        }
    })

    // READ
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/doctors/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditData #ID').val(data.ID)
            $('#formEditData #name').val(data.name)
            $('#formEditData #college').val(data.college)
            $('#formEditData #email').val(data.email)
        })

        $('#modal-edit-doctor').modal('show')
    })

    // UPDATE
    $('#saveEditDoctor').click(function(){
        // Validaciones
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }
        if($('#formEditData #email').val() != ''){
            if(!isEmail($("#formEditData #email"))){
                validate++
            }
        }

        if(validate == 0){
            var ID = $('#formEditData #ID').val()
            var name = $('#formEditData #name').val()
            var college = $('#formEditData #college').val()
            var email = $('#formEditData #email').val()

            $.post(uri + 'core/doctors/update.php', {ID : ID, name : name, college : college, email : email}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del médico se han actualizado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            $('#modal-edit-doctor').modal('hide')
        }else{
            $('#modal-edit-doctor #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-doctor #warning-message').empty()
            }, 3500)
        }
    })

    // DELETE
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el médico " + rowClick[1] + "?")){
            $.post(uri + 'core/doctors/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El médico se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
        }
    })

    // Descargar plantilla
    $('#downloadTemplate').click(function(){
        if(confirm('Recuerda que no puedes modificar la columna ID!')){
            $.ajax({
                url: uri + "core/doctors/exportData.php",
                data: false,
                type: 'POST',
                async: false,
                success: function (data){
                    window.open(uri + 'descargar-archivoExcel?file=configuration/doctors/template.csv', '_blank')
                }
            });
        }
    })

    // Importar datos
    $('#goImportData').click(function(){
        var filelist = $('#importData')[0].files

        if(filelist.length == 0){
            $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un archivo para cargar</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)
        }else if(filelist[0].name.split('.')[filelist[0].name.split('.').length - 1] != 'csv'){
            $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debe elegir un formato de archivo válido</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)
        }else{
            $('#importDataMessage').html('<div class="alert alert-info alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La importación puede tardar varios minutos</div>')
            setTimeout(function(){
                $('#importDataMessage').empty()
            }, 5000)

            var data = new FormData

            data.append('file', filelist[0])

            $.ajax({
                url: uri + 'core/doctors/importData.php',
                method: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                async: true,
                success: function(data){
                    if(data.length == 0){
                        table.ajax.url(uri + 'core/doctors/listDatatables.php').load()
                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con éxito</div>')
                    }else{
                        table.ajax.url(uri + 'core/doctors/listDatatables.php').load()

                        $.each(data, function(index, value){

                            if(value == "Número de columnas incorrecto. Las columnas son: ID, Nombre, Colegio"){
                                $("#modal-import-errors #titleError").text("Los datos no se han importado por: ");
                            }else{
                                $("#modal-import-errors #titleError").text('Se han importado los datos salvo las siguientes filas: ');
                            }
                            $("#modal-import-errors #errors").append('<p> * ' + value + '</p>');
                        })
                        $("#modal-import-errors").modal("show")

                        $('#importData').val('')
                        $('#importDataMessage').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El fichero se ha cargado con errores</div>')
                    }
                },
                error: function(){
                    $('#importDataMessage').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Se ha producido un error al cargar el fichero</div>')
                    setTimeout(function(){
                        $('#importDataMessage').empty()
                    }, 5000)
                }
            })
        }
    })

    $("#modal-import-errors").on('hidden.bs.modal', function(){
        $("#modal-import-errors #errors").empty();
    })
})