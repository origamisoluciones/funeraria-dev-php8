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
    });
    $('#formNewData #endTime').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false
    });
    $('#formEditData #endTime').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false
    });
    $('.datepicker').datepicker({
        todayHighlight : true,forceParse: false
    });    

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })

    // Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });
    
    // Check
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });
    
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
    var date = new Date();
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
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
        eventSources: uri + 'core/garage/events/list.php',
        eventTextColor: '#F0F0F0',
        eventClick: function(calEvent, jsEvent, view) {
           
            $('#formEditData #startDate').val(moment(calEvent.start).format("DD/MM/YYYY HH:mm:ss").split(" ")[0])
            $('#formEditData #name').val(calEvent.title)
            if(calEvent.allDay == 0){
                $('#formEditData #allDay').iCheck('uncheck');
            }else if(calEvent.allDay == 1){
                $('#formEditData #allDay').iCheck('check');
            }
            $('#formEditData #user').val(calEvent.userName)

            if(calEvent.reminder == 0){
                $('#formEditData #reminder').iCheck('uncheck');
            }else if(calEvent.reminder == 1){
                $('#formEditData #reminder').iCheck('check');
            }
            $('#formEditData #status').val(calEvent.statusID)
            $('#formEditData #eventID').val(null)
            $('#formEditData #upkeepsID').val(null)
            $('#formEditData #vehicleID').val(null)

            if(calEvent.upkeeps == null && calEvent.vehicle == null){
                $('#modal-edit-event #eventType').text("Taller")
                $("#formEditData #upkeepsDiv").addClass('hide')
                $('#formEditData #divCost').addClass('hide')
                $('#formEditData #eventID').val(calEvent.id)
            } else if(calEvent.upkeeps != null){
                $('#modal-edit-event #eventType').text("Matenimiento")
                $('#formEditData #upkeepsID').val(calEvent.upkeeps)
                $("#formEditData #upkeepsDiv").removeClass('hide')
                $("#formEditData #tableBody").empty()
                $.ajax({
                    url : uri + "core/garage/events/listUpkeeps.php",
                    data : {
                        data: calEvent.upkeeps,
                        car: calEvent.vehicle,
                        date: calEvent.start._i
                    },
                    type : 'POST',
                    async : false,
                    success : function(data){
                        var upkeeps = $.parseJSON(data)

                        if(upkeeps.upkeep.cost != null){
                            $('#formEditData #divCost').removeClass('hide')
                            $('#formEditData #cost').val(upkeeps.upkeep.cost + " €")
                        }
                        
                        if(upkeeps.upkeep.status == 4){
                            $('#formEditData .status .fa-circle').css('color', '#088A08')
                        }

                        $.each(upkeeps.events, function(index, elem){
                            $("#formEditData #tableBody").append('<tr>' +
                                                        '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                                        '<td>'+ elem.name  + '</td>' +
                                                    '</tr>')
                        })
                       
                    }
                })
            }else{
                $('#modal-edit-event #eventType').text("Mantenimiento")
                $('#formEditData #vehicleID').val(calEvent.vehicle)
                $("#formEditData #upkeepsDiv").removeClass('hide')
                $("#formEditData #tableBody").empty()
                $.ajax({
                    url : uri + "core/garage/events/listUpkeepsIntervals.php",
                    data : {
                        vehicle: calEvent.vehicle, start: moment(calEvent.start).format("YYYY-MM-DD HH:mm:ss")
                    },
                    type : 'POST',
                    async : false,
                    success : function(data){
                        var upkeeps = $.parseJSON(data)

                        $.each(upkeeps, function(index, elem){
                            $("#formEditData #tableBody").append('<tr>' +
                                                        '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                                        '<td>'+ elem.name  + '</td>' +
                                                    '</tr>')
                        })
                       
                    }
                })  
            }

            $('#modal-edit-event').modal('show');
           
        },
        editable: false,
        droppable: true, // this allows things to be dropped onto the calendar !!!
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
      }
    });
    //Cargar calendario    
    if(window.location.search != ""){
        var search = window.location.search
        search = search.split('&')
        var month = parseInt(search[0].split('=')[1]) - 1
        var year = decodeURI(search[1].split('=')[1])                    
        $('#calendar').fullCalendar('gotoDate', new Date(year, month, 1))
    }else{
        var date = new Date()
        var m = date.getMonth()
        var y = date.getFullYear()                 
        $('#calendar').fullCalendar('gotoDate', new Date(y, m, 1))
    }
    
    // Estado del iCheck "Recordatorio"
    var reminder = 0;
    $('#formEditData #reminder').on('ifChanged', function(event){
        $('#formEditData #reminder').on('ifUnchecked', function(event){
            reminder = 0;
        });
        $('#formEditData #reminder').on('ifChecked', function(event){
            reminder = 1;
        });
    });

    $('#saveEditEvent').click(function(){
        //Validaciones
        var validate = 0;
        
        if(isEmpty($("#formEditData #startDate"))){
            validate++
        }else{
            if(!isDate($("#formEditData #startDate"))){
                validate++
            }    
        }
       
        if(isEmpty($("#formEditData #status"))){
            validate++
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            // Recogida de datos del formulario
            var eventID = $("#formEditData #eventID").val()
            var upkeepsID = $("#formEditData #upkeepsID").val()
            var vehicleID = $("#formEditData #vehicleID").val()
            var start = moment($("#formEditData #startDate").val(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00'
            var status = $("#formEditData #status").val()
                
            $.post(uri + "core/garage/events/update.php", {event : eventID, start : start, status : status, reminder : reminder, upkeepsID: upkeepsID, vehicleID: vehicleID}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha actualizado con éxito.</div>');
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
    });

    // Color
    var color = $('#formEditData #status option:selected').text();
    $('#formEditData .status .fa-circle').css('color',color);

    $('#formEditData #status').on('change', function () {
        color = $('#formEditData #status option:selected').text();
        $('#formEditData .status .fa-circle').css('color',color);
    });

    //Modales. Acciones
    $('#modal-edit-event').on('hidden.bs.modal', function (e) {
        clean("formEditData");
    });
});