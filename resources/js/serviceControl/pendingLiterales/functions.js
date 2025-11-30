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
    // PICKERS
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    });

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

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
    
    // Literales PENDIENTES
    var table = $('#pendingLiterales').DataTable({
        "ajax": uri+'core/serviceControl/pendingLiterales/listDatatables.php',
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
        "scrollY":  '670px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "Día"},
            {"title": "Mes"},
            {"title": "Estado"},
            {"title": "Nombre y apellidos"},
            {"title": "Fecha de nacimiento"},
            {"title": "Empresa"},
            {"title": "Registro Civil"},
            {"title": "Casa mortuoria"},
            {"title": "Cementerio"},
            {"title": "Nº Expediente"},
            {"title": ""},
            {"title": "Expediente ID"},
        ],
        "columnDefs": [{
            "targets": [10,11],
            "orderable": false,
            "searchable": false,
            "visible": false
        },
        {
            "className": "editClick centered",
            "targets": [0,1,2,3,5,6,9]
        },
        {
            "className": "date centered",
            "targets": 4,
            "render": function (data, type, row) {
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
                }
                return data == null ? 0 : moment(data, "YYYY-MM-DD").format("X")
            }
        },
        {
            "className": "centered",
            "targets": [6],
            "render": function(data, type, row){
                if(data != null){
                    return '<strong>'+data+'</strong>'
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "centered",
            "targets": [7,8],
            "render": function(data, type, row){
                if(data != null){
                    return data
                }else{
                    return '-'
                }
            }
        }],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [0,1,2,3,4,5,6,7,8,9],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Literales pendientes',
            title: 'Literales pendientes',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'A4',
            exportOptions: {
                columns: [0,1,2,3,4,5,6,7,8,9],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Literales pendientes',
            title: 'Literales pendientes',
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
                            text: 'Listado de literales pendientes',
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
                columns: [0,1,2,3,4,5,6,7,8,9],
                search: 'applied',
                order: 'applied'
            },
            customize: function(win){
                $(win.document.body).find('h1').css('display','none')
            },
            text: 'Imprimir <i class="fa fa-print" aria-hidden="true"></i>',
            className: 'c-lile export-button'
        }],
        "order": [[9, 'ASC']]
    });


    // TAREAS PENDIENTES - EDITAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')
        $('#tasks').empty();

        service = table.row($(this).closest('tr').index(),11).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()[11]
        expNumber = table.row($(this).closest('tr').index(),9).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()[9]
        
        $('#modal-edit-task #expedient').val(service)      
        
        var tasks
        $.ajax({
            url : uri + 'core/serviceControl/pendingTasks/functions.php',
            type : 'POST',
            data : {
                type: 'getLiteralsByExpedient',
                service: service
            },
            async : false,
            success : function(data){
                try{
                    tasks = $.parseJSON(data)
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        var details = tasks.details   
        var gender = 'D. '       
        if(details['deceasedGender'] == 'Mujer'){
            gender = 'Dña. '
        }

        $("#modal-edit-task #literal").empty();
        $("#modal-edit-task #literal").text(" literales")
        $('#modal-edit-task #expNumber').text(expNumber + ' - ' + gender + ' ' + details['deceasedName'] + ' ' + details['deceasedSurname']) //Numero de expediente y nombre del difunto

        var others2 = tasks.others2
      
        // Otros
        var others2Text = ''

        // Literales
        if(others2.literalReceived != "1" || others2.literalRequest != "1"){
            others2Text +=  '   <fieldset class="others2">' +
                            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Literales</span></legend>'

            if(others2.literalRequest != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="literalRequest">' +
                                '       <label>Solicitado</label>' +
                                '   </div>'
            }

            if(others2.literalReceived != "1"){
                others2Text +=  '   <div class="checkbox-inline">' +
                                '       <input type="checkbox" id="literalReceived">' +
                                '       <label>Recibido</label>' +
                                '   </div>'
            }
            
            others2Text +=  '   </fieldset>'
        }
        $('#tasks').append(others2Text)
  
        $('#modal-edit-task').modal('show');
    });

    $('#saveEditTask').click(function(){
        var expedient = $('#modal-edit-task #expedient').val()

        // Otros2
        var othersDiv2 = $('#tasks').children('fieldset.others2')
        var othersData2 = {}

        othersDiv2.each(function(){
            $(this).find('input[type=checkbox]').each(function(){
                var key = $(this).attr('id')

                if($(this).prop('checked')){
                    var value = 1
                }else{
                    var value = 0
                }

                othersData2[key] = value
            })
        })

        $.ajax({
            url : uri + "core/serviceControl/pendingTasks/functions.php",
            method : 'POST',
            data: {
                type: 'updateLiteralsByExpedient',
                expedient : expedient,
                others2: othersData2,
            },
            async : false,
            success : function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Las tareas pendientes se han guardado con éxito.</div>')

                    table.ajax.reload();

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
            }
        })

        $('#modal-edit-task').modal('hide')
    });
    
})