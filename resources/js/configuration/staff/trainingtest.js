var url = window.location.pathname.split("/");
const id = url[url.length-1];

/**@var {array} tempAttachments Stores temp Attachments */
var tempAttachments = new Array;

/**
 * Draws attachments section
 */
function drawAttachments(modal){
    $('#' + modal + ' #fileAttachDocMultiple').val(null);
    $('#' + modal + ' #fileAttachDocMultipleSection').empty();
    $.each(tempAttachments, function(index, elem){

        var previewDocButton = '';
        if(!(tempAttachments[index] instanceof File)){
            previewDocButton = '<button class="btn btn-primary preview-doc" style="margin-right:5px" title="Descargar adjunto"><i class="fa fa-file-pdf-o"></i></button>';
        }

        $('#' + modal + ' #fileAttachDocMultipleSection').append(
            '   <div class="d-flex" style="margin-bottom: 5px;" index="' + index + '" modal="' + modal + '">' +
                    previewDocButton +
            '       <button class="btn btn-danger delete-attachment" style="margin-right:5px" title="Eliminar adjunto"><i class="fa fa-minus"></i></button>' +
            '       <span>' + elem.name + '</span>' +
            '   </div>'
        )
    })

    $('#' + modal + ' .delete-attachment').click(function(){
        var docName = $(this).closest('div').find('span').text();
        if(confirm('Si continúas, al guardar el curso se eliminará este documento: ' + docName)){
            var index = $(this).closest('div').attr('index');
            var modal = $(this).closest('div').attr('modal');
            tempAttachments.splice(index, 1);
            drawAttachments(modal);
        }
    })

    $('#' + modal + ' .preview-doc').click(function(){
        var index = $(this).closest('div').attr('index')
        var docName = $(this).closest('div').find('span').text();

        if(!(tempAttachments[index] instanceof File)){
            window.open(uri + 'descargar-archivo?file=staff/' + id + '/trainingTests/' + $("#formEditData #testID").val()  + '/'+ docName, '_blank');
            return false;
        }
    })
}

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
function getInfoClient(){
    var info = null

    $.ajax({
        url: uri + 'core/staff/read.php',
        method: 'POST',
        data: {id:id},
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

    var userInfo = getInfoClient();
    $("#userData").text(userInfo.name + " " + userInfo.surname);

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

    // SELECT
    $.fn.select2.defaults.set("width", "100%");
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
            return "Sin resultados";
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
            return "Sin resultados";
        }
    };

    // Datepicker
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // FORMACION - CURSOS 
    var table = $('#datatable').DataTable({
        "ajax": uri + "core/staff/trainingTests/listTrainingTest.php?id="+id,
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
            {"title": "Nombre y apellidos"},
            {"title": "Nombre del curso"},
            {"title": "Fecha de realización"},
            {"title": "Duración del curso"},
            {"title": "Fecha de evaluación"},
            {"title": "Resultado"},
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
            "targets": 1,
            "searchable": false,
            "visible": false,
        },
        {
            'className' : 'editClick centered',
            'targets' : [2]
        },
        {
            "className": "date editClick centered",
            "targets": 3,
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "date editClick centered",
            "targets": 4,
            "render": function (data, type, row) {
               return data + ' h'
            }
        },
        {
            "className": "date editClick centered",
            "targets": 5,
            "render": function(data, type){
                if(type === 'display' || type === 'filter'){
                    return data == null ? '-' : moment(data, "X").format("DD/MM/YYYY")
                }
                return data
            }
        },
        {
            "className": "date editClick centered",
            "targets": 6,
            "render": function (data, type, row) {
                if(data == '1'){
                    return 'Apto';
                }else if(data == '2'){
                    return 'Pte. Evaluación';
                }else{
                    return 'No Apto';
                }
            }
        },
        {
            "className": "details-control centered editClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 8,
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
                columns: [2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'cursos',
            title: 'cursos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [2, 3, 4, 5, 6],
                search: 'applied',
                order: 'applied'
            },
            filename: 'cursos',
            title: 'cursos',
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
                            text: 'Listado de cursos',
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
                columns: [2, 3, 4, 5, 6],
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

    // FORMACION - BUSCAR
    $('#input-search').on('keyup', function (){
        table.search( this.value ).draw()
    })

    $('#newTrainingTest').click(function(){
        $('#modal-new-trainingTest').modal('show')
    })

    $('#formNewData #fileAttachDocMultiple').change(function(){
        var total = $('#formNewData #fileAttachDocMultiple')[0].files.length;
        var cont = $('#formNewData #fileAttachDocMultiple')[0].files.length;
        $.each($('#formNewData #fileAttachDocMultiple')[0].files, function(index, elem){
            var flag = true;
            $.each(tempAttachments, function(i, item){
                if(item.name == elem.name && item.size == elem.size && item.type == elem.type){
                    flag = false;
                    cont--;
                    return false;
                }
            })

            if(flag){
                // Validate files size
                if(elem.size == 0){
                    $('#modal-new-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se permite subir un fichero vacío.</div>');
                }else{
                    tempAttachments.push(elem);
                }
            }
        })
        if(total == 0){
            $('#modal-new-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún documento pdf.</div>');
        }else{
            if(total > cont){
                $('#modal-new-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos de los documentos pdf que has seleccionado no se han añadido porque ya los habías seleccionado antes.</div>');
            }
        }

        drawAttachments('modal-new-trainingTest');
    })

    $('#saveNewTrainingTest').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #name'))){
            validate++
        }
        if(isEmpty($('#formNewData #date'))){
            validate++
        }
        if(isEmpty($('#formNewData #duration'))){
            validate++
        }
        if(isEmpty($('#formNewData #dateReview'))){
            validate++
        }

        var result = $('#formNewData #result').val() == null ? 0 : $('#formNewData #result').val();

        if(validate == 0){
            var name = $('#formNewData #name').val()
            var date =   moment($('#formNewData #date').val(), "DD/MM/YYYY").format("X") 
            var duration = $('#formNewData #duration').val()
            var dateReview = moment($('#formNewData #dateReview').val(), "DD/MM/YYYY").format("X") 
            var notes = $('#formNewData #notes').val()
            $.ajax({
                url: uri + 'core/staff/trainingTests/create.php',
                method: 'POST',
                data: {
                    user: id,
                    name: name,
                    date: date,
                    duration: duration,
                    dateReview: dateReview,
                    result: result,
                    notes: notes
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    var continueFlag = false;
                    switch(data){
                        case false:
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        break;
                        default:
                            continueFlag = true
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El curso se ha creado con éxito.</div>');
                            table.ajax.reload();
                        break;
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    if(!continueFlag){
                        return false
                    }

                    $('#modal-new-trainingTest').modal('hide')


                    $.each(tempAttachments, function(index, elem){
                        var docName = elem.name;
        
                        var extension = docName.split('.')[docName.split('.').length - 1]
                        var flagUp = true
                        switch(extension.toLowerCase()){
                            case 'pdf':
                            break
                            default:
                                flag = false
                                flagUp = false
                            break;
                        }
        
                        if(flagUp){
                            var dataFile = new FormData();
                            dataFile.append('archivo', elem);
                            dataFile.append('staff', $.parseJSON(id));
                            dataFile.append('trainingTest', $.parseJSON(data));
                            $.ajax({
                                url: uri + "core/staff/trainingTests/fileUpload.php",
                                type: 'POST',
                                contentType: false,
                                data: dataFile,
                                dataType: 'json',
                                processData: false,
                                cache: false,
                                async: false,
                                success : function(data){
                                    try{
                                        switch(data){
                                            case true:
                                            break
                                            case false:
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            break
                                            case 'extension':
                                                flag = false
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tipo de archivo no permitido.</div>')
                                            break
                                            default:
                                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            break
                                        }
                                    }catch(e){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    }
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                }
                            })

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })

                    $('#formNewData #fileAttachDocMultiple').val(null);
                    $('#formNewData #fileAttachDocMultipleSection').empty();
                    tempAttachments = new Array;

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-trainingTest').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-trainingTest #warning-message').empty()
            }, 3500)
        }
    })

    // CURSOS - EDITAR
    table.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $.ajax({
            url: uri + 'core/staff/trainingTests/read.php',
            method: 'POST',
            data: {
                id: rowClick[0]
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    $('#formEditData #testID').val(data.trainingTest.id)
                    $('#formEditData #name').val(data.trainingTest.name)
                    $('#formEditData #date').val(moment(data.trainingTest.date_test, 'X').format('DD/MM/YYYY'))
                    $('#formEditData #duration').val(data.trainingTest.duration)
                    $('#formEditData #dateReview').val(moment(data.trainingTest.date_review, 'X').format('DD/MM/YYYY'))
                    $('#formEditData #result').val(data.trainingTest.result).trigger('change')
                    $('#formEditData #notes').val(data.trainingTest.notes)

                    // Files
                    tempAttachments = new Array;
                    $.each(data.files, function(index, elem){
                        tempAttachments.push({'name': elem});
                    })

                    drawAttachments('modal-edit-trainingTest');

                    $('#modal-edit-trainingTest').modal('show')
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

    $('#formEditData #fileAttachDocMultiple').change(function(){
        var total = $('#formEditData #fileAttachDocMultiple')[0].files.length;
        var cont = $('#formEditData #fileAttachDocMultiple')[0].files.length;
        $.each($('#formEditData #fileAttachDocMultiple')[0].files, function(index, elem){
            var flag = true;
            $.each(tempAttachments, function(i, item){
                if(item.name == elem.name && item.size == elem.size && item.type == elem.type){
                    flag = false;
                    cont--;
                    return false;
                }
            })

            if(flag){
                // Validate files size
                if(elem.size == 0){
                    $('#modal-edit-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se permite subir un fichero vacío.</div>');
                }else{
                    tempAttachments.push(elem);
                }
            }
        })
        if(total == 0){
            $('#modal-edit-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún documento pdf.</div>');
        }else{
            if(total > cont){
                $('#modal-edit-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos de los documentos pdf que has seleccionado no se han añadido porque ya los habías seleccionado antes.</div>');
            }
        }

        drawAttachments('modal-edit-trainingTest');
    })

    $('#saveEditTrainingTest').click(function(){
        var validate = 0

        if(isEmpty($('#formEditData #name'))){
            validate++
        }
        if(isEmpty($('#formEditData #date'))){
            validate++
        }
        if(isEmpty($('#formEditData #duration'))){
            validate++
        }
        if(isEmpty($('#formEditData #dateReview'))){
            validate++
        }

        var result = $('#formEditData #result').val() == null ? 0 : $('#formEditData #result').val();

        if(validate == 0){
            var testId = $('#formEditData #testID').val()
            var name = $('#formEditData #name').val()
            var date =   moment($('#formEditData #date').val(), "DD/MM/YYYY").format("X") 
            var duration = $('#formEditData #duration').val()
            var dateReview = moment($('#formEditData #dateReview').val(), "DD/MM/YYYY").format("X") 
            var notes = $('#formEditData #notes').val()

            var newAttachments = new Array;
            $.each(tempAttachments, function(index, elem){
                if(!(elem instanceof File)){
                    newAttachments.push(elem);
                }
            })

            $.ajax({
                url: uri + 'core/staff/trainingTests/update.php',
                method: 'POST',
                data: {
                    id: testId,
                    user: id,
                    name: name,
                    date: date,
                    duration: duration,
                    dateReview: dateReview,
                    result: result,
                    notes: notes,
                    newAttachments: newAttachments.length == 0 ? '' : newAttachments
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    var continueFlag = false;
                    switch(data){
                        case false:
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        break;
                        default:
                            continueFlag = true
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos curso se han actualizado con éxito.</div>');
                        break;
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    if(!continueFlag){
                        return false
                    }

                    $('#modal-edit-trainingTest').modal('hide')

                    $.each(tempAttachments, function(index, elem){
                        if(elem instanceof File){
                            var docName = elem.name;
            
                            var extension = docName.split('.')[docName.split('.').length - 1]
                            var flagUp = true
                            switch(extension.toLowerCase()){
                                case 'pdf':
                                break
                                default:
                                    flag = false
                                    flagUp = false
                                break;
                            }
            
                            if(flagUp){
                                var dataFile = new FormData();
                                dataFile.append('archivo', elem);
                                dataFile.append('staff', $.parseJSON(id));
                                dataFile.append('trainingTest', $.parseJSON(data));
                                $.ajax({
                                    url: uri + "core/staff/trainingTests/fileUploadEdit.php",
                                    type: 'POST',
                                    contentType: false,
                                    data: dataFile,
                                    dataType: 'json',
                                    processData: false,
                                    cache: false,
                                    async: false,
                                    success : function(data){
                                        try{
                                            switch(data){
                                                case true:
                                                break
                                                case false:
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                break
                                                case 'extension':
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Tipo de archivo no permitido.</div>')
                                                break
                                                default:
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                break
                                            }
                                        }catch(e){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        }
                                    },
                                    error: function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    }
                                })

                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        }
                    })

                    $('#formEditData #fileAttachDocMultiple').val(null);
                    $('#formEditData #fileAttachDocMultipleSection').empty();
                    tempAttachments = new Array;
                   
                    table.ajax.reload();

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formEditData #msg').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-edit-trainingTest').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
        }else{
            $('#modal-edit-trainingTest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-trainingTest #warning-message').empty()
            }, 3500)
        }
    })

    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el curso de  " + rowClick[2] + "?")){
            $.ajax({
                url: uri + 'core/staff/trainingTests/delete.php',
                method: 'POST',
                data: {
                    id: rowClick[0],
                    user: id
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)
                        if(data){
                            table.ajax.reload();
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El curso se ha eliminado con éxito.</div>');
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
    $('#modal-new-trainingTest').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('')
        $('#formNewData textarea').val('')
        clean("formNewData")
        $('#modal-new-trainingTest #warning-message').empty()

        $('#formNewData #fileAttachDocMultiple').val(null);
        $('#formNewData #fileAttachDocMultipleSection').empty();
        tempAttachments = new Array;
    })

    $('#modal-edit-trainingTest').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('')
        $('#formEditData textarea').val('')
        clean("formEditData")
        $('#modal-edit-trainingTest #warning-message').empty()

        $('#formEditData #fileAttachDocMultiple').val(null);
        $('#formEditData #fileAttachDocMultipleSection').empty();
        tempAttachments = new Array;
    })
})