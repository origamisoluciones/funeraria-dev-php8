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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
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

    // BOTÓN "ARRIBA"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // CORREOS - CONTROL - LISTADO
    var emailsControl = $('#datatableControl').DataTable({
        "ajax": uri + "core/emails/listDatatables.php",
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
            filename: 'correos',
            title: 'Correos',
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
            filename: 'correos',
            title: 'Correos',
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
                            text: 'Listado de correos',
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

    // CORREOS - CONTROL - BUSCAR
    $('#input-search-control').on('keyup', function(){
        emailsControl.search(this.value).draw()
    })

    // CORREOS - CONTROL - NUEVO
    $('#saveNewEmailControl').click(function(){
        var validate = 0

        if(isEmpty($('#formNewDataControl #email'))){
            validate++
        }else{
            if(!isMail($('#formNewDataControl #email'))){
                validate++
            }
        }

        if(validate == 0){
            var email = $('#formNewDataControl #email').val()

            $.ajax({
                url : uri + 'core/emails/create.php',
                method : 'POST',
                data : {
                    email : email,
                    type : 0
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data)

                    if(data){
                        emailsControl.ajax.reload()

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El correo se ha creado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-email-control').modal('hide')
        }else{
            $('#modal-new-email-control #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-email-control #warning-message').empty()
            }, 3500)
        }
    })

    // CORREOS - CONTROL - EDITAR
    emailsControl.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = emailsControl.row($(this).closest('tr')).data() == undefined ? emailsControl.row($(this).closest('tr.child').prev()).data() : emailsControl.row($(this).closest('tr')).data()

        $.ajax({
            url : uri + 'core/emails/read.php',
            method : 'POST',
            data : {
                ID : rowClick[0]
            },
            async : false,
            success : function(data){
                data = $.parseJSON(data)

                $('#formEditDataControl #ID').val(data.ID)
                $('#formEditDataControl #email').val(data.email)

                $('#modal-edit-email-control').modal('show')
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#saveEditEmailControl').click(function(){
        var validate = 0

        if(isEmpty($('#formEditDataControl #email'))){
            validate++
        }else{
            if(!isMail($('#formEditDataControl #email'))){
                validate++
            }
        }

        if(validate == 0){
            var ID = $('#formEditDataControl #ID').val()
            var email = $('#formEditDataControl #email').val()

            $.ajax({
                url: uri + 'core/emails/update.php',
                method: 'POST',
                async: false,
                data: {
                    ID : ID,
                    email : email
                },
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        emailsControl.ajax.reload()

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El correo se ha editado con éxito.</div>')
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

            $('#modal-edit-email-control').modal('hide')
        }else{
            $('#modal-edit-email-control #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-email-control #warning-message').empty()
            }, 3500)
        }
    })

    // CORREOS - CONTROL - ELIMINAR
    emailsControl.on('click', 'tbody .removeClick', function(){
        $('.btn-delete').tooltip('hide')

        var rowClick = emailsControl.row($(this).closest('tr')).data() == undefined ? emailsControl.row($(this).closest('tr.child').prev()).data() : emailsControl.row($(this).closest('tr')).data()

        if(confirm('Está seguro de que quiere borrar el correo "' + rowClick[1] + '"?')){
            $.ajax({
                url : uri + 'core/emails/delete.php',
                method : 'POST',
                data : {
                    ID : rowClick[0]
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data)
                    if(data){
                        emailsControl.ajax.reload()
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El correo se ha eliminado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    })

    // MODALES
    $('#modal-new-email-control').on('hidden.bs.modal', function(){
        $('#formNewDataControl #email').val('')
        clean("formNewDataControl");
        $('#modal-new-email-control #warning-message').empty()
    })

    $('#modal-edit-email-control').on('hidden.bs.modal', function(){
        $('#formEditDataControl #email').val('')
        clean("formEditDataControl");
        $('#modal-edit-email-control #warning-message').empty()
    })
})