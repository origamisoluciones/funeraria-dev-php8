/** @var {array} table Stores free tasks datatables */
var table = null;

/** @var {array} rowClick Stores free tasks datatables row click */
var rowClick = null;

/** @const {Option} statusOptions Stores default option for status */
const statusOptions = [{'id': 0, 'text': 'Pendiente'}, {'id': 1, 'text': 'Realizada'}];

/** @var {int} limit_page Stores limit by page for select2 */
var limit_page = 10;

/** @var {array} langSelect2 Stores language array for select2 */
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

/**
 * Get own mortuaries
 * 
 * @return {array} info 
 */
function getOwnMortuaries(){
    var mortuaries;

    $.ajax({
        url: uri + 'core/timeline/functions.php',
        method: 'POST',
        async: false,
        data : {
            type: 'getOwnMortuaries'
        },
        success: function(data){
            mortuaries = $.parseJSON(data);
        }
    })

    return mortuaries;
}

/**
 * Get upkeeps associated with a event
 * 
 * @return {array} info 
 */
function getUpkeeps(upkeepID){
    var upkeeps;

    $.ajax({
        url: uri + 'core/timeline/garageTasks/functions.php',
        method: 'POST',
        async: false,
        data : {
            type: 'getUpkeeps',
            upkeep: upkeepID
        },
        success: function(data){
            upkeeps = $.parseJSON(data);
        }
    })

    return upkeeps;
}

/**
 * Inicializate modal fields
 */
function inicializateFields(){

    // DATEPICKER
    $('#fitlers .datepicker').datepicker({
        autoclose: true,
        todayHighlight : true,
        forceParse: false,
        enableOnReadonly: false
    })

    $('#modal-new-task .datepicker').datepicker({
        autoclose: true,
        todayHighlight : true,
        forceParse: false,
        startDate: new Date(),
    })
    $('#modal-edit-task .datepicker').datepicker({
        autoclose: true,
        todayHighlight : true,
        forceParse: false,
        startDate: new Date(),
    })

    // DATEPICKER
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
    });

    // SELECT
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    // Inicializate events field
    $('#modal-new-task #event').select2({
        language: langSelect2,
        placeholder: 'Selecciona un evento...',
        ajax: {
            url: uri+'core/timeline/garageTasks/functions.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    type: 'getGarageEvents'
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            id: item.ID,
                            text: item.name,
                            upkeepID: item.upkeepID,
                            upkeeps: item.upkeeps
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#modal-new-task #event').change(function(){
        if($(this).val() != null && parseInt($(this).select2('data')[0]['upkeeps']) > 0){
            var upkeeps = getUpkeeps($(this).select2('data')[0]['upkeepID']);
            if(upkeeps != null){
                var tableBody = '';
                $.each(upkeeps, function(index, value){
                    tableBody += 
                        '   <tr>'+
                        '       <td style="text-align:center">' +(index + 1)+ '</td>'+
                        '       <td>'+ value['name']+'</td>'+
                        '   </tr>';
                })
                $("#modal-new-task #upkeepsListBody").empty().append(tableBody);

                $("#modal-new-task #upkeepsListSection").removeClass('hide');
            }else{
                $("#modal-new-task #upkeepsListSection").addClass('hide');
            }
        }else{
            $("#modal-new-task #upkeepsListSection").addClass('hide');
        }
    })

    // Inicializate staff field
    $('#modal-new-task #staffDesignated').select2({
        language: 'es',
        placeholder: 'Indica el inicio de la tarea',
        data: []
    })
    $('#modal-new-task #staffDesignated').val(null).trigger('change');

    // Inicializate mortuaries fields
    var mortuaries = getOwnMortuaries();
    if(mortuaries != null){

        $('#mortuaryFilter').append("<option value='null'>--</option>");
        $.each(mortuaries, function(index, value){
            $('#mortuaryFilter').append("<option value=" + value['id'] + " selected>" + value['text'] + "</option>");
        })
        $('#mortuaryFilter').val('null').trigger('change');

        $('#modal-new-task #mortuary').select2({
            language: 'es',
            placeholder: 'Selecciona un tanatorio...',
            data: mortuaries
        })
        $('#modal-new-task #mortuary').val(null).trigger('change');

        $('#modal-edit-task #mortuaryEdit').select2({
            language: 'es',
            placeholder: 'Selecciona un tanatorio...',
            data: mortuaries
        })
        $('#modal-edit-task #mortuaryEdit').val(null).trigger('change');
    }

    // Inicializate status fields
    $('#statusFilter').append("<option value='null'>--</option>");
    $.each(statusOptions, function(index, value){
        $('#statusFilter').append("<option value=" + value['id'] + " selected>" + value['text'] + "</option>");
    })
    $('#statusFilter').val('null').trigger('change');

    $('#modal-new-task #status').select2({
        language: 'es',
        placeholder: 'Selecciona un estado...',
        data: statusOptions
    })
    $('#modal-new-task #status').val(statusOptions[0]['id']).trigger('change');

    $('#modal-edit-task #statusEdit').select2({
        language: 'es',
        placeholder: 'Selecciona un estado...',
        data: statusOptions
    })
    $('#modal-edit-task #statusEdit').val(null).trigger('change');
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

// Select2 functions for remote data
function formatData(data){
    return '<div id="'+data.id+'">'+data.text+'</div>';
}
function formatData2(data){
    if(data.busy == 0){
        return '<div id="' + data.id + '">' + data.text + '</div>';
    }else{
        return '<div id="' + data.id + '" style="color: #E61919">' + data.text + '</div>';
    }
}

$(function(){

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    changeSpaceFooter()
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    inicializateFields();

    // If not exists garage events, block create new task
    setTimeout(() => {
        if($("#eventsGarageReminderData").children().length == 0){
            $("#goToCreateTask").attr("disabled", true);
            $("#goToCreateTask").removeAttr('data-toggle');
            $("#goToCreateTask").removeAttr('data-target');
            $("#modal-new-task").remove();
        }
    }, 150);

    // Load datatables
    $("#fitlers #from").val('01/' + moment().format('MM') + '/' + moment().format('YYYY'));
    $("#fitlers #to").val(moment().endOf('month').format('DD')+'/' + moment().format('MM') + '/' + moment().format('YYYY'));

    var from = $("#fitlers #from").val() == '' ? null : moment($("#fitlers #from").val(), 'DD/MM/YYYY').format('X');
    var to = $("#fitlers #to").val() == '' ? null : moment($("#fitlers #to").val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
    var mortuary = $("#mortuaryFilter").val() == 'null' ? null : $("#mortuaryFilter").val();
    var status = $("#statusFilter").val() == 'null' ? null : $("#statusFilter").val();

    table = $('#datatable').DataTable({
        "ajax": uri+"core/timeline/garageTasks/list.php?from=" +from +'&to=' + to + '&mortuary=' + mortuary + '&status=' + status,
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
            {"title": "Tarea"},
            {"title": "Fecha y hora"},
            {"title": "Personal asignado"},
            {"title": "Tanatorio"},
            {"title": "Estado"},
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
            "targets": [1,2,3,4,5]
        },
        {
            "className": "details-control centered editClick",
            "targets": 6,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='#' class='btn-edit' title='Editar'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
        },
        {
            "className": "details-control centered removeClick",
            "targets": 7,
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
                columns: [1,2,3,4,5],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Tareas de mantenimiento de vehículos',
            title: 'Tareas de mantenimiento de vehículos',
            text: 'Excel <i class="fa fa-file-excel-o"></i>',
            className: 'c-lile export-button'
        },
        {
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'A4',
            exportOptions: {
                columns: [1,2,3,4,5],
                search: 'applied',
                order: 'applied'
            },
            filename: 'Tareas de mantenimiento de vehículos',
            title: 'Tareas de mantenimiento de vehículos',
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
                            text: 'Listado de tareas de mantenimiento de vehículos',
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
        "order": [[1, 'desc']]
    })

    //Al escribir en el campo de búsqueda se filtrarán los resultados en la tabla
    $('#input-search').on('keyup', function(){
        table.search( this.value ).draw()
    })

    // Update garage task
    table.on('click', 'tbody .editClick', function () {
        $('.btn-edit').tooltip('hide')

        rowClick =  table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        $.post(uri + 'core/timeline/garageTasks/read.php', {id : rowClick[0]}, function(data){
            data = $.parseJSON(data)

            $('#formEditData #eventName').val(data.eventName);

            if(data.listUpkeeps.length > 0){
                var tableBody = '';
                $.each(data.listUpkeeps, function(index, value){
                    tableBody += 
                        '   <tr>'+
                        '       <td style="text-align:center">' +(index + 1)+ '</td>'+
                        '       <td>'+ value['name']+'</td>'+
                        '   </tr>';
                })
                $("#formEditData #upkeepsListBody").empty().append(tableBody);
                $("#formEditData #upkeepsListSection").removeClass('hide');
            }else{
                $("#formEditData #upkeepsListSection").addClass('hide');
            }

            $('#formEditData #startDateEdit').val(moment(data.start, 'X').format('DD/MM/YYYY'));
            $('#formEditData #startTimeEdit').val(moment(data.start, 'X').format('HH:mm')).trigger('change')

            if($('#formEditData #staffDesignatedEdit').find("option[value='" + data.staffDesignated + "']").length){
                $('#formEditData #staffDesignatedEdit').val(data.staffDesignated).trigger('change');
            }else{ 
                var newOption = new Option(data.staffDesignatedName, data.staffDesignated, true, true);
                $('#formEditData #staffDesignatedEdit').append(newOption).trigger('change');
            }

            if($('#formEditData #mortuaryEdit').find("option[value='" + data.mortuary + "']").length){
                $('#formEditData #mortuaryEdit').val(data.mortuary).trigger('change');
            }else{ 
                var newOption = new Option(data.mortuaryName, data.mortuary, true, true);
                $('#formEditData #mortuaryEdit').append(newOption).trigger('change');
            }

            $('#formEditData #statusEdit').val(data.status).trigger('change');
        })

        $('#modal-edit-task').modal('show')
    })

    // Delete garage task
    table.on('click', 'tbody .removeClick', function () {
        $('.btn-delete').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()
        
        if(confirm("¿Está seguro de que quiere borrar la tarea de mantenimiento asociada al evento " + rowClick[1] + "?")){
            $.post(uri + 'core/timeline/garageTasks/delete.php', {id : rowClick[0]}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La tarea libre se ha eliminado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }
                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })
        }
    })

    // Apply filters
    $("#search").click(function(){
        var from = $("#fitlers #from").val() == '' ? null : moment($("#fitlers #from").val(), 'DD/MM/YYYY').format('X');
        var to = $("#fitlers #to").val() == '' ? null : moment($("#fitlers #to").val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
        var mortuary = $("#mortuaryFilter").val() == 'null' ? null : $("#mortuaryFilter").val();
        var status = $("#statusFilter").val() == 'null' ? null : $("#statusFilter").val();
    
        table.ajax.url(uri+"core/timeline/garageTasks/list.php?from=" +from +'&to=' + to + '&mortuary=' + mortuary + '&status=' + status).load();
    })

    /*** Create task modal events ***/
    $('#modal-new-task .change-new-time').change(function(){
        $('#modal-new-task #staffDesignated').empty();
        if(
            $('#modal-new-task #startDate').val() != '' && $('#modal-new-task #startTime').val() != ''
        ){
            var start = moment($('#modal-new-task #startDate').val() + ' ' + $('#modal-new-task #startTime').val(), 'DD/MM/YYYY HH:mm').format('X');
            var end = moment($('#modal-new-task #startDate').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');

            // Get free staf members
            $('#modal-new-task #staffDesignated').empty();
            $('#modal-new-task #staffDesignated').select2({
                language: langSelect2,
                placeholder: 'Selecciona un miembro del personal...',
                ajax: {
                    url: uri+'core/timeline/freeTasks/functions.php',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            start: start,
                            end: end,
                            page_limit: limit_page,
                            page: params.page,
                            type: 'getStaffMembers'
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    id: item.ID,
                                    text: item.name,
                                    busy : item.busy
                                }
                            }),
                            pagination: {
                                more: false
                            }
                        };
                    },
                    cache: false
                },
                escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
                templateResult: formatData2,
                templateSelection: formatData
            })

            $('#modal-new-task #staffDesignated').attr("disabled", false);
        }else{
            $('#modal-new-task #staffDesignated').select2({
                language: 'es',
                placeholder: 'Indica el inicio de la tarea',
                data: []
            })
            $('#modal-new-task #staffDesignated').val(null).trigger('change');
            $('#modal-new-task #staffDesignated').attr("disabled", true);
        }
    })

    $('#modal-new-task #saveNewTask').click(function(){
        // Validaciones
        var validate = 0

        if(isEmpty($('#formNewData #event'))){
            validate++
        }

        if(isEmpty($('#formNewData #startDate'))){
            validate++
        }
        if(isEmpty($('#formNewData #startTime'))){
            validate++
        }
        
        var start = null;
        var end = null;
        if(validate == 0){
            start = moment($('#modal-new-task #startDate').val() + ' ' + $('#modal-new-task #startTime').val(), 'DD/MM/YYYY HH:mm').format('X');
            end = moment($('#modal-new-task #startDate').val() + ' 19:59:59', 'DD/MM/YYYY HH:mm:ss').format('X');
        }
        if(isEmpty($('#formNewData #staffDesignated'))){
            validate++
        }
        if(isEmpty($('#formNewData #mortuary'))){
            validate++
        }
        if(isEmpty($('#formNewData #status'))){
            validate++
        }

        if(validate == 0){
            var event = $('#formNewData #event').val();
            var upkeep = $('#formNewData #event').select2('data')[0]['upkeepID'];
            var staffDesignated = $('#formNewData #staffDesignated').val();
            var mortuary = $('#formNewData #mortuary').val();
            var status = $('#formNewData #status').val();

            $.post(uri + 'core/timeline/garageTasks/create.php', {event:event, upkeep:upkeep, start:start, end:end, staff:staffDesignated, mortuary:mortuary, status:status}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La encuesta se ha creado con éxito.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                table.ajax.reload()

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-new-task').modal('hide')
        }else{
            $('#modal-new-task #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-task #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-new-task').on('hidden.bs.modal', function(){
        clean("formNewData");

        $('#formNewData input').val('');
        $('#formNewData #event').val(null).trigger('change');
        $('#formNewData #staffDesignated').val(null).trigger('change');
        $('#formNewData #mortuary').val(null).trigger('change');
        $('#formNewData #status').val(statusOptions[0]['id']).trigger('change');
        $('#formNewData textarea').val('');
        
        $('#modal-new-task #warning-message').empty();
    })

    /*** Edit task modal events ***/
    $('#modal-edit-task .change-edit-time').change(function(){
        $('#modal-edit-task #staffDesignatedEdit').empty();
        if(
            $('#modal-edit-task #startDateEdit').val() != '' && $('#modal-edit-task #startTimeEdit').val() != '' 
        ){
            start = moment($('#modal-edit-task #startDateEdit').val() + ' ' + $('#modal-edit-task #startTimeEdit').val(), 'DD/MM/YYYY HH:mm').format('X');
            end = moment($('#modal-edit-task #startDateEdit').val() + ' 19:59:59', 'DD/MM/YYYY HH:mm').format('X');

            // Get free staf members
            $('#modal-edit-task #staffDesignatedEdit').empty();
            $('#modal-edit-task #staffDesignatedEdit').select2({
                language: langSelect2,
                placeholder: 'Selecciona un miembro del personal...',
                ajax: {
                    url: uri+'core/timeline/freeTasks/functions.php',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            start: start,
                            end: end,
                            page_limit: limit_page,
                            page: params.page,
                            type: 'getStaffMembers'
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    id: item.ID,
                                    text: item.name,
                                    busy : item.busy
                                }
                            }),
                            pagination: {
                                more: false
                            }
                        };
                    },
                    cache: false
                },
                escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
                templateResult: formatData2,
                templateSelection: formatData
            })

            $('#modal-edit-task #staffDesignatedEdit').attr("disabled", false);
        }else{
            $('#modal-edit-task #staffDesignatedEdit').attr("disabled", true);
        }
    })

    $('#modal-edit-task #saveEditTask').click(function(){
        // Validaciones
        var validate = 0;
        if(isEmpty($('#formEditData #startDateEdit'))){
            validate++;
        }
        if(isEmpty($('#formEditData #startTimeEdit'))){
            validate++;
        }
       
        var start = null;
        var end = null;
        if(validate == 0){
            start = moment($('#modal-edit-task #startDateEdit').val() + ' ' + $('#modal-edit-task #startTimeEdit').val(), 'DD/MM/YYYY HH:mm').format('X');
            end = moment($('#modal-edit-task #startDateEdit').val() + ' 23:59:59', 'DD/MM/YYYY HH:mm').format('X');
        }
        if(isEmpty($('#formEditData #staffDesignatedEdit'))){
            validate++
        }
        if(isEmpty($('#formEditData #mortuaryEdit'))){
            validate++
        }
        if(isEmpty($('#formEditData #statusEdit'))){
            validate++
        }

        if(validate == 0){
            var staffDesignated = $('#formEditData #staffDesignatedEdit').val();
            var mortuary = $('#formEditData #mortuaryEdit').val();
            var status = $('#formEditData #statusEdit').val();
            var id = rowClick[0];

            $.post(uri + 'core/timeline/garageTasks/update.php', {id:id, start:start, end:end, staff:staffDesignated, mortuary:mortuary, status:status}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> ¡La tarea libre ha sido actualziada con éxito!.</div>')
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                }

                table.ajax.reload();

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            })

            $('#modal-edit-task').modal('hide');
        }else{
            $('#modal-edit-task #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-task #warning-message').empty();
            }, 3500)
        }
    })

    $('#modal-edit-task').on('hidden.bs.modal', function(){
        clean("formEditData");

        $('#formEditData input').val('');
        $('#formEditData #staffDesignatedEdit').val(null).trigger('change');
        $('#formEditData #mortuaryEdit').val(null).trigger('change');
        $('#formEditData #statusEdit').val(null).trigger('change');
        $('#formEditData textarea').val('');
        
        $('#modal-edit-task #warning-message').empty();
        rowClick = null;
    })
})