var url = window.location.pathname.split("/");
const id = url[url.length-1];

/**
 * Select2 function for remote data
 * 
 * @param {array} data
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Obtiene los datos de los ajustes
 * 
 * @return {array} info Datos
 */
function getInfoPoll(){
    var info = null

    $.ajax({
        url: uri + 'core/polls/read.php',
        method: 'POST',
        data: {ID:id},
        dataType: 'json',
        async: false,
        success: function(data){
            info = data
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
    return info
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

    var pollInfo = getInfoPoll();
    $(".poll-title").text(pollInfo.title);

    // TOOLBAR BOTTOM
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
  
    // PREGUNTAS - ENCUESTAS SATISFACCIÓN 
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/polls/items/list.php?id="+id,
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
            {"title": "Pregunta"},
            {"title": "Orden"},
            {"title": "Editar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
        {
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
            "className": "centered",
            "targets": 2,
            "width": "5%"
        },
        {
            "className": "details-control centered editClick",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete' title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Preguntas de la encuesta ' + pollInfo.title,
            title: 'Preguntas de la encuesta ' + pollInfo.title,
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1, 2],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Preguntas de la encuesta ' + pollInfo.title,
            title: 'Preguntas de la encuesta ' + pollInfo.title,
            customize: function(doc){
                // Limpia la plantilla por defecto
                doc.content[1].table.widths = ['100%'];
                
                doc.content.splice(0, 1)

                // Configuración
                doc.pageMargins = [30, 60, 30, 50]
                doc.defaultStyle.fontSize = 10

                // Header
                doc['header'] = (function(){
                    return {
                        columns: [{
                            alignment: 'left',
                            text: 'Preguntas de la encuesta ' + pollInfo.title,
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
                columns: [1,2],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[2, 'asc']]
    })

    // PREGUNTAS - BUSCAR
    $('#input-search').on('keyup', function (){
        table.search( this.value ).draw()
    })

    $('#newPollItem').click(function(){
        $('#modal-new-poll-item').modal('show')
    })

    $('#saveNewPollItem').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #question'))){
            validate++
        }
     
        if(validate == 0){
            var question = $('#formNewData #question').val();
            var order = $('#formNewData #questionOrder').val();
            $.ajax({
                url: uri + 'core/polls/items/create.php',
                method: 'POST',
                data: {
                    poll: id,
                    question: question,
                    order: order
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>La pregunta se ha creado con éxito.</div>');
                        
                        $('#modal-new-poll-item').modal('hide')
                        table.ajax.reload();
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-poll-item').modal('hide')       
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-poll-item').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-poll-item #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-poll-item #warning-message').empty()
            }, 3500)
        }
    })

    // PREGUNTAS - EDITAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/polls/items/read.php',
            method: 'POST',
            data: {
                ID: rowClick[0]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    $('#formEditData #itemID').val(data.ID)
                    $('#formEditData #question').val(data.question)
                    $('#formEditData #questionOrder').val(data.order_question)

                    $('#modal-edit-poll-item').modal('show')
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#saveEditPollItem').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #question'))){
            validate++
        }

        if(validate == 0){
            var id = $('#formEditData #itemID').val()
            var question = $('#formEditData #question').val()
            var order = $('#formEditData #questionOrder').val()
            $.ajax({
                url: uri + 'core/polls/items/update.php',
                method: 'POST',
                data: {
                    ID: id,
                    question: question,
                    order: order
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        table.ajax.reload();
                        $('#modal-edit-poll-item').modal('hide')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pregunta se ha actualizado con éxito.</div>');
                   }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-edit-poll-item').modal('hide')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-edit-poll-item').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
        }else{
            $('#modal-edit-poll-item #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-poll-item #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar la pregunta " + rowClick[1] + "?")){
            $.ajax({
                url: uri + 'core/polls/items/delete.php',
                method: 'POST',
                data: {
                    ID: rowClick[0]
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                            table.ajax.reload();
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La pregunta se ha eliminado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    });

    // MODALES
    $('#modal-new-poll-item').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('')
        clean("formNewData")
        $('#modal-new-poll-item #warning-message').empty()
    })

    $('#modal-edit-poll-item').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('')
        clean("formEditData")
        $('#modal-edit-poll-item #warning-message').empty()
    })
})