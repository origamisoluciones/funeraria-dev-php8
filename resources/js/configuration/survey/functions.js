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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="previewSurvey" class="btn btn-default"><i class="fa fa-eye c-lile" aria-hidden="true"></i> Ver Cuestionario</button>')
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
        "ajax": uri+"core/survey/listDatatables.php",
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
            {"title": "Servicio"},
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
            "targets": [1],
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
            filename: 'Cuestionario de satisfacción',
            title: 'Cuestionario de satisfacción',
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
            filename: 'Cuestionario de satisfacción',
            title: 'Cuestionario de satisfacción',
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
                            text: 'Cuestionario de satisfacción',
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
        "order": [[0, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function(){
        table.search( this.value ).draw()
    })

    // CREATE
    $('#saveNewService').click(function(){
        // Validaciones
        var validate = 0

        if(isEmpty($('#formNewData #service'))){
            validate++
        }

        if(isEmpty($('#formNewData #position'))){
            validate++
        }

        if(validate == 0){
            var service = $('#formNewData #service').val()
            var position = $('#formNewData #position').val()

            $.post(uri + 'core/survey/create.php', {service : service, position : position}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El servicio se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-new-service').modal('hide')
        }else{
            $('#modal-new-service #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-service #warning-message').empty()
            }, 3500)
        }
    })

    // READ
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.post(uri + 'core/survey/read.php', {ID : rowClick[0]}, function(data){
            data = $.parseJSON(data)
            $('#formEditData #ID').val(data.ID)
            $('#formEditData #service').val(data.service)
            $('#formEditData #position').val(data.position)
        })

        $('#modal-edit-service').modal('show')
    })

    // UPDATE
    $('#saveEditService').click(function(){
        // Validaciones
        var validate = 0

        if(isEmpty($('#formEditData #service'))){
            validate++
        }

        if(validate == 0){
            var ID = $('#formEditData #ID').val()
            var service = $('#formEditData #service').val()
            var position = $('#formEditData #position').val()

            $.post(uri + 'core/survey/update.php', {ID : ID, service : service, position : position}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos del servicio se han actualizado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
            $('#modal-edit-service').modal('hide')
        }else{
            $('#modal-edit-service #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-service #warning-message').empty()
            }, 3500)
        }
    })

    // DELETE
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere borrar el servicio " + rowClick[1] + "?")){
            $.post(uri + 'core/survey/delete.php', {ID : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El servicio se ha eliminado con éxito.</div>')
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

    $('#modal-new-service').on('hidden.bs.modal', function(){
        $('#formNewData input').val('');
        $('#modal-new-service #warning-message').empty()
    })

    $("#previewSurvey").click(function(){
        $('#modal-preview-survey').modal("show");

        $('#surveyBody').empty()
        var items = getSurvey();
        $.each(items.data, function(index, elem){

            $('#surveyBody').append('   <tr>' +
            '       <th scope="row">' + parseInt(index + 1) + '.</th>' +
            '       <td>' +  elem[1] + '</td>' +
            '       <td class="text-center">' +
            '           <input type="radio" name="item" id="5" disabled>' +
            '       </td>' +
            '       <td class="text-center">' +
            '           <input type="radio" name="item" id="4" disabled>' +
            '       </td>' +
            '       <td class="text-center">' +
            '           <input type="radio" name="item" id="3" disabled>' +
            '       </td>' +
            '       <td class="text-center">' +
            '           <input type="radio" name="item" id="2" disabled>' +
            '       </td>' +
            '       <td class="text-center">' +
            '           <input type="radio" name="item" id="1" disabled>' +
            '       </td>' +
            '       <td class="text-center">' +
            '           <input type="radio" nname="item" id="null" disabled>' +
            '       </td>' +
            '   </tr>')
        })
    })
})

/**
 * Obtiene service
 * 
 * @param {int} assistance Asistencia
 */
function getSurvey(){
    var survey = null

    $.ajax({
        url: uri+"core/survey/list.php",
        method: 'GET',
        data: false,
        async: false,
        success: function(response){
            survey =  response;
        },
    })

    return JSON.parse(survey);
}