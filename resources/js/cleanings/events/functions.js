/**
 * Select2 function for remote data
 * 
 * @param {array} data Datos a formatear
 * @return {string} Datos formateados
 */
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
$(function () {
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

    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    })
    $('#formNewData #endTime').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false
    })
    $('#formEditData #endTime').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false
    })
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    })  

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // SELECT2
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    var limit_page = 10
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
    }
    
    // CHECKS
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    })

    $('#formNewData #reminder').iCheck('check');
    
    /* Inicializando eventos externos
     -----------------------------------------------------------------*/
    function ini_events(ele) {
        ele.each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
    }

    ini_events($('#external-events div.external-event'));

    /* Inicializando el calendario de eventos
     -----------------------------------------------------------------*/
    //Date for the calendar events (dummy data)
    var date = new Date()
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear()

    $('#calendar').fullCalendar({
        customButtons: {
            newEvent: {
                text: 'Nuevo Evento',
                click: function() {
                    $('#modal-new-event').modal('show');
                }
            }
        },
        header: {
            left: 'prev,next today newEvent',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        lang: 'es',
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        eventSources: uri + 'core/cleanings/events/list.php',
        eventTextColor: '#F0F0F0',
        eventClick: function(calEvent, jsEvent, view) {
            $('#formEditData #eventID').val(calEvent.id);            

            var start = moment(calEvent.start).format("DD/MM/YYYY HH:mm:ss").split(" ");
            var startDate = start[0];
            var startTime = start[1];

            $('#formEditData #startDate').val(startDate);
            $('#formEditData #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"));

            var end = moment(calEvent.end).format("DD/MM/YYYY HH:mm:ss").split(" ");
            var endDate = end[0];
            var endTime = end[1];

            $('#formEditData #endDate').val(endDate);
            $('#formEditData #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"));

            if(startTime == "00:00:00" && endTime == "23:59:59"){
                $('#formEditData #allDay').iCheck('check');
            }else{
                $('#formEditData #allDay').iCheck('uncheck');
            }

            $('#formEditData #regularity').val(calEvent.regularity)

            if(calEvent.regularity == 0){
                // $('#closeEvent').addClass('hide')
                $('#closeDoneEvent').addClass('hide')
            }else{
                $('#closeEvent').removeClass('hide')
                $('#closeDoneEvent').removeClass('hide')
            }

            if(calEvent.cleaningType != null){
                if($('#formEditData #cleaningType').find("option[value='" + calEvent.cleaningType + "']").length){
                    $('#formEditData #cleaningType').val(calEvent.cleaningType).trigger('change');
                }else{ 
                    var newOption = new Option(calEvent.cleaningTypeName, calEvent.cleaningType, true, true);
                    $('#formEditData #cleaningType').append(newOption).trigger('change');
                }
            }
            $('#formEditData #name').val(calEvent.title)            
            if(calEvent.cleaningMortuary != null){
                if($('#formEditData #cleaningMortuary').find("option[value='" + calEvent.cleaningMortuary + "']").length){
                    $('#formEditData #cleaningMortuary').val(calEvent.cleaningMortuary).trigger('change');
                }else{ 
                    var newOption = new Option(calEvent.cleaningMortuaryName,  calEvent.cleaningMortuary, true, true);
                    $('#formEditData #cleaningMortuary').append(newOption).trigger('change');
                }
            }
            if(calEvent.cleaningUser != null){
                if($('#formEditData #cleaningUser').find("option[value='" + calEvent.cleaningUser + "']").length){
                    $('#formEditData #cleaningUser').val(calEvent.cleaningUser).trigger('change');
                }else{ 
                    var newOption = new Option(calEvent.cleaningUserName + ' ' + calEvent.cleaningUserSurname, calEvent.cleaningUser, true, true);
                    $('#formEditData #cleaningUser').append(newOption).trigger('change');
                }
            }

            $('#formEditData #status').val(calEvent.statusID);
            $('#formEditData .status .fa-circle').css('color',calEvent.backgroundColor);
            if (calEvent.reminder==0){
                $('#formEditData #reminder').iCheck('uncheck');
            }else if (calEvent.reminder==1){
                $('#formEditData #reminder').iCheck('check');
            }
            if(calEvent.success == '1'){
                $('#formEditData #closeEvent').prop('disabled', true);
                $('#formEditData #closeDoneEvent').prop('disabled', true);
            }else{
                $('#formEditData #closeEvent').prop('disabled', false);
                $('#formEditData #closeDoneEvent').prop('disabled', false);
            }
            $('#formEditData #user').val(calEvent.userName);

            if(calEvent.description != null){
                $('#formEditData #description').val(calEvent.description);
            }

            $('#modal-edit-event').modal('show');
        },
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            copiedEventObject.backgroundColor = $(this).css("background-color");
            copiedEventObject.borderColor = $(this).css("border-color");

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
        },
        lazyFetching : true
    });
    //cargar calendario
    if(window.location.search != ""){
        var search = window.location.search
        search = search.split('&')
        var month = parseInt(search[0].split('=')[1]) - 1
        var year = decodeURI(search[1].split('=')[1])
        $('#calendar').fullCalendar('gotoDate', moment("01/" + (month + 1) + '/' + year).format('DD/MM/YYYY'))

        // $('#calendar').fullCalendar('gotoDate', new Date(year, month, 1))
    }else{
        var date = new Date()
        var m = date.getMonth()
        var y = date.getFullYear()
        $('#calendar').fullCalendar('gotoDate', moment("01/" + (m + 1) + '/' + y).format('DD/MM/YYYY'))
    }
    // Cargamos los datos de los usuarios en el select
    $('.cleaningType').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cleaningTypes/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.ID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });
    
    // Cargamos los datos de los usuarios en el select
    $('.cleaningMortuary').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/mortuaries/dataOwn.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.mortuaryID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Cargamos los datos de los usuarios en el select
    $('.cleaningUser').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/users/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name + " " + item.surname,
                            id: item.userID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatData,
        templateSelection: formatData
    });

    // Al introducir una fecha de inicio, automáticamente se rellena la fecha de fin
    $('#formNewData #startDate').datepicker().on("changeDate", function(e) {
        $("#formNewData #endDate").val(e.format("dd/mm/yyyy"));
    });

    // AÑADIR - Crea un nuevo evento en el calendario
    // Autocompleta la fecha de fin con el valor de la fecha de inicio
    $("#formNewData #startTime").timepicker().on("change", function(e){
        $("#formNewData #endTime").val($("#formNewData #startTime").val());
    });

    // Activa o desactiva las horas si se selecciona el check "Todo el día"
    var allDayNew = 0;
    $('#formNewData #allDay').on('ifChanged', function(event){
       
        $('#formNewData #allDay').on('ifUnchecked', function(event){
            allDayNew = 0;
            $("#formNewData #startTime").prop("disabled", false);
            $("#formNewData #endDate").prop("disabled", false);
            $("#formNewData #endTime").prop("disabled", false);
        });
        $('#formNewData #allDay').on('ifChecked', function(event){
            allDayNew = 1;
            $("#formNewData #startTime").prop("disabled", true);
            $("#formNewData #endDate").prop("disabled", true);
            $("#formNewData #endTime").prop("disabled", true);

            $("#formNewData #startTime").val('00:00');
            $("#formNewData #endTime").val('23:59');
            $("#formNewData #endDate").val($("#formNewData #startDate").val());
        });
    });
    
    $('#formNewData #cleaningType').on('change', function () {
        var id = $(this).val();              
        if(id != null){
            $.ajax({
                url : uri + 'core/cleaningTypes/functions.php',
                method : 'POST',
                data : {
                    type: 'getName',
                    id : id 
                },
                async: false,
                success : function(data){                   
                    if(data != null){
                        data= $.parseJSON(data)                       
                        $("#formNewData #name").val(data.name);           
                    }else{
                        $("#formNewData #name").val('');   
                    }
                },            
            })        
        }else{
            $("#formNewData #name").val('');   
        }        
    });
    
    // Estado del iCheck "Recordatorio"
    var reminderNew = 0;
    $('#formNewData #reminder').on('ifChanged', function(event){
        $('#formNewData #reminder').on('ifUnchecked', function(event){
            reminderNew = 0;
        });
        $('#formNewData #reminder').on('ifChecked', function(event){
            reminderNew = 1;
        });
    });

    $("#saveNewEvent").click(function(){
        var validate = 0

        if(isEmpty($("#formNewData #startDate"))){
            validate++
        }

        if(isEmpty($("#formNewData #endDate"))){
            validate++
        }

        if(!isEmpty($("#formNewData #startDate")) && !isEmpty($("#formNewData #endDate"))){
            if(compareDates($("#formNewData #startDate").val(), $("#formNewData #endDate").val()) > 0){
                $("#formNewData #endDate").val($("#formNewData #startDate").val())
            }
        }

        if(allDayNew == 0){
            if(isEmpty($("#formNewData #startTime"))){
                validate++
            }
            if(isEmpty($("#formNewData #endTime"))){
                validate++
            }
        }

        if(isEmpty($("#formNewData #name"))){
            validate++
        }
        if(isEmpty($("#formNewData #status"))){
            validate++  
        }

        if(validate == 0){
            var startDate = moment($("#formNewData #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formNewData #startTime").val()

            var endDate = moment($("#formNewData #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formNewData #endTime").val()

            if(allDayNew == 0){
                if(isEmpty($("#formNewData #startTime"))){
                    validate++
                }
                if(isEmpty($("#formNewData #endTime"))){
                    validate++
                }
                var compareT = compareTimes(startTime, endTime)
                if(compareT == 0){
                    endTime = endTime + ':01'
                }else if(compareT == 1){
                    $("#formNewData #endTime").val($("#formNewData #startTime").val())
                    endTime = $("#formNewData #endTime").val() + ':01'
                }
            }else{
                startTime = "00:00:00";
                endTime = "23:59:59";
            }

            start = startDate + " " + startTime;
            end = endDate + " " + endTime;

            var name = $("#formNewData #name").val()
            var status = 5

            var regularity = $('#formNewData #regularity').val()
            var description = $('#formNewData #description').val()

            var cremation = 0

            var cleaningType
            $("#formNewData #cleaningType").val() != null ? cleaningType = $("#formNewData #cleaningType").val() : 'null'
            var cleaningMortuary
            $("#formNewData #cleaningMortuary").val() != null ? cleaningMortuary = $("#formNewData #cleaningMortuary").val() : 'null'
            var cleaningUser
            $("#formNewData #cleaningUser").val() != null ? cleaningUser = $("#formNewData #cleaningUser").val() : 'null'
        }else{
            $('#modal-new-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-event #warning-message').empty()
            }, 3500)
        }

        if(validate == 0){
            $.ajax({
                url : uri + 'core/events/create.php',
                method : 'POST',
                data : {
                    start : start,
                    end : end,
                    regularity : regularity,
                    name : name,
                    reminder : reminderNew,
                    cleaningType : cleaningType,
                    cleaningMortuary: cleaningMortuary,
                    cleaningUser : cleaningUser,
                    status: status,
                    cremation: cremation,
                    allDay: allDayNew,
                    description: description,
                    type: 2
                },
                success : function(data){
                    if(data){
                        $('#calendar').fullCalendar('refetchEvents')

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> El evento se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-event').modal('hide')
        }else{
            $('#modal-new-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-event #warning-message').empty()
            }, 3500)
        }
    });

    // EDITAR - Edita un evento del calendario
    // Activa o desactiva las horas si se selecciona el check "Todo el día"
    var allDayEdit = 0;
    $('#formEditData #allDay').on('ifChanged', function(event){
        $('#formEditData #allDay').on('ifUnchecked', function(event){
            allDayEdit = 0;
            $("#formEditData #startTime").prop("disabled", false);
            $("#formEditData #endTime").prop("disabled", false);
            $("#formEditData #endDate").prop("disabled", false);

            $("#formEditData #startTime").val('00:00');
            $("#formEditData #endTime").val('23:59');
            $("#formEditData #endDate").val($("#formEditData #startDate").val());
        });
        $('#formEditData #allDay').on('ifChecked', function(event){
            allDayEdit = 1;
            $("#formEditData #startTime").prop("disabled", true);
            $("#formEditData #endTime").prop("disabled", true);
            $("#formEditData #endDate").prop("disabled", true);
        });
    });

    $('#formEditData #cleaningType').on('change', function () {
        var id = $(this).val();   
        if(id != null){
            $.ajax({
                url : uri + 'core/cleaningTypes/functions.php',
                method : 'POST',
                data : {
                    type: 'getName',
                    id : id 
                },
                async: false,
                success : function(data){                   
                    if(data != null){
                        data= $.parseJSON(data)                       
                        $("#formEditData #name").val(data.name);           
                    }else{
                        $("#formEditData #name").val('');   
                    }
                },            
            })        
        }else{
            $("#formEditData #name").val('');   
        }        
    });

    // Estado del iCheck "Recordatorio"
    var reminderEdit = 0;
    $('#formEditData #reminder').on('ifUnchecked', function(event){
        reminderEdit = 0;
    });
    $('#formEditData #reminder').on('ifChecked', function(event){
        reminderEdit = 1;
    });

    $('#saveEditEvent').click(function(){
        var validate = 0

        if(isEmpty($("#formEditData #startDate"))){
            validate++
        }

        if(isEmpty($("#formEditData #endDate"))){
            validate++
        }

        if(!isEmpty($("#formEditData #startDate")) && !isEmpty($("#formEditData #endDate"))){
            if(compareDates($("#formEditData #startDate").val(), $("#formEditData #endDate").val()) > 0){
                $("#formEditData #endDate").val($("#formEditData #startDate").val())
            }
        }

        if(allDayNew == 0){
            if(isEmpty($("#formEditData #startTime"))){
                validate++
            }
            if(isEmpty($("#formEditData #endTime"))){
                validate++
            }
        }

        if(isEmpty($("#formEditData #name"))){
            validate++
        }
        if(isEmpty($("#formEditData #status"))){
            validate++
        }

        if(validate == 0){
            var eventID = $("#formEditData #eventID").val()

            var startDate = moment($("#formEditData #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formEditData #startTime").val()
            
            var endDate = moment($("#formEditData #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formEditData #endTime").val()

            if(allDayEdit == 0){
                var compareT = compareTimes(startTime, endTime)
                if(compareT == 0){
                    endTime = endTime + ':01'
                }else if(compareT == 1){
                    $("#formEditData #endTime").val($("#formEditData #startTime").val())
                    endTime = $("#formEditData #endTime").val() + ':01'
                }
            }else{
                startTime = "00:00:00"
                endTime = "23:59:59"
            }
    
            start = startDate + " " + startTime
            end = endDate + " " + endTime
    
            var regularity = $('#formEditData #regularity').val()
    
            var name = $("#formEditData #name").val()
            var description = $("#formEditData #description").val()
    
            var cleaningType
            $("#formEditData #cleaningType").val() != null ? cleaningType = $("#formEditData #cleaningType").val() : cleaningType = 'null'
            var cleaningMortuary
            $("#formEditData #cleaningMortuary").val() != null ? cleaningMortuary = $("#formEditData #cleaningMortuary").val() : cleaningMortuary = 'null'
            var cleaningUser
            $("#formEditData #cleaningUser").val() != null ? cleaningUser = $("#formEditData #cleaningUser").val() : cleaningUser = 'null'
    
            var status = 5

            $.ajax({
                url : uri + 'core/events/update.php',
                method : 'POST',
                data : {
                    event : eventID,
                    start : start,
                    end : end,
                    regularity : regularity,
                    name: name,
                    description: description,
                    reminder: reminderEdit,
                    cleaningType : cleaningType,
                    cleaningMortuary: cleaningMortuary,
                    cleaningUser : cleaningUser,
                    status: status
                },
                success : function(data){
                    if(data){
                        $('#calendar').fullCalendar('refetchEvents')

                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> El evento se ha actualizado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-edit-event').modal('hide')
        }else{
            $('#modal-edit-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-event #warning-message').empty()
            }, 3500)
        }
    });

    // DELETE - Borrar un evento del calendario
    $('#deleteEvent').click(function(){
        if(confirm('¿Estás seguro de que deseas eliminar el evento?')){
            var eventID = $("#formEditData #eventID").val()
    
            $.ajax({
                url : uri + 'core/events/delete.php',
                method : 'POST',
                data : {
                    eventID : eventID
                },
                success : function(data){
                    if(data){
                        $('#calendar').fullCalendar('refetchEvents')
        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> El evento se ha eliminado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
    
            $('#modal-edit-event').modal('hide')
        }
    });

    // Finalizar evento - Estado "realizado"
    $('#closeEvent').click(function(){
        $('#saveEditEvent').click();
        // Recogida de datos del formulario
        var eventID = $("#formEditData #eventID").val();
        var name = $("#formEditData #name").val();
        var status = 4

        $.post(uri+"core/events/close.php", {eventID : eventID, status : status, name : name}, function(data){
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> El evento se ha eliminado con éxito.</div>');
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="" data-dismiss="alert" aria-label=""><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        });

        // Se oculta la ventana modal
        $('#modal-edit-event').modal('hide');

        // Actualiza el calendario
        $('#calendar').fullCalendar('refetchEvents');
    })

    // Finalizar evento y no crear otro - Estado "realizado"
    $('#closeDoneEvent').click(function(){
        if(confirm('Ojo! Si finalizas este evento se cancela la periodicidad y no se puede recuperar. ¿Deseas continuar?')){
            // Recogida de datos del formulario
            var eventID = $("#formEditData #eventID").val();   
            var status = 4
    
            $.post(uri+"core/events/functions.php", {action: 'closeAndDoneEvent', eventID : eventID, status : status}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mantenimiento se ha realizado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });
    
            // Se oculta la ventana modal
            $('#modal-edit-event').modal('hide');
    
            // Actualiza el calendario
            $('#calendar').fullCalendar('refetchEvents');
        }
    })

    // Color
    $('#formEditData #status').on('change', function () {
        var color = $('#formEditData #status option:selected').text();
        $('#formEditData .status .fa-circle').css('color',color);
    });

    //Modales. Acciones
    $('#modal-edit-event').on('hidden.bs.modal', function (e) {
        $('#formEditData input').val('');        
        $('#formEditData textarea').val('');        
        $("#formEditData #cleaningType").val('').trigger('change');
        $("#formEditData #cleaningMortuary").val('').trigger('change');
        $("#formEditData #cleaningUser").val('').trigger('change');
        $('#formEditData #regularity').val('').trigger('change')        
        $('#formEditData .minimal').iCheck('check');
        clean("formEditData");
        $('#modal-edit-event #warning-message').empty()
    });
    $('#modal-new-event').on('hidden.bs.modal', function (e) {
        $('#formNewData input').val('');        
        $('#formNewData textarea').val('');        
        $("#formNewData #cleaningType").val('').trigger('change');
        $("#formNewData #cleaningMortuary").val('').trigger('change');
        $("#formNewData #cleaningUser").val('').trigger('change');
        $('#formNewData #regularity').val('').trigger('change')        
        $('#formNewData #reminder').iCheck('check');
        clean("formNewData");
        $('#modal-new-event #warning-message').empty()
    });
});