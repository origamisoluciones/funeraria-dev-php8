function getProvinces() {
    var provinces;
    // DATOS DEL SOLICITANTE - PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            provinces = $.parseJSON(data)
        }
    })
    return provinces;
}

/**
 * Comprueba si ya hay una cremación para una fecha dada
 * 
 * @param {int} start Fecha de inicio
 * @param {int} end Fecha de fin
 * @returns {boolean}
 */
function checkCremationBusy(start, end){
    var busy = false
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'checkCremationTime',
            crematoriumEntry: start,
            crematoriumLeaving: end
        },
        async: false,
        success: function(data){
            try{
                busy = $.parseJSON(data)
            }catch{
            }
        }
    })
    return busy
}

/**
 * Comprueba si ya hay una cremación para una fecha dada
 * 
 * @param {int} start Fecha de inicio
 * @param {int} end Fecha de fin
 * @returns {boolean}
 */
function checkCremationBusyEdit(start, end, crematorium, expedient){
    var busy = false
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'checkCremationTimeEdit',
            crematoriumEntry: start,
            crematoriumLeaving: end,
            expedient: expedient,
            crematorium: crematorium
        },
        async: false,
        success: function(data){
            try{
                busy = $.parseJSON(data)
            }catch{
            }
        }
    })
    return busy
}

function getFuneralHome(funeralHomeID) {
    var funeralHome
    $.ajax({
        url : uri + "core/funeralHomes/functions.php",
        data : {
            funeralHomeID : funeralHomeID,
            type : 'getFuneralHome'
        },
        type: 'POST',
        async: false,
        success: function (data) {
            funeralHome = $.parseJSON(data)[0];
        }
    })
    return funeralHome;
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

    // PICKERS
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
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
    $.fn.select2.defaults.set("width", "100%")
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    var limit_page = 10

    var langSelect2 = {
        inputTooShort: function(args) {
            return "Escribir ..."
        },
        inputTooLong: function(args) {
            return "Término demasiado largo"
        },
        errorLoading: function() {
            return "No hay resultados"
        },
        loadingMore: function() {
            return "Cargando más resultados"
        },
        noResults: function() {
            return "No hay resultados"
        },
        searching: function() {
            return "Buscando..."
        },
        maximumSelected: function(args) {
            return "No hay resultados"
        }
    }

    function formatData (data) {
        var data = '<div id="'+data.id+'">'+data.text+'</div>'
        return data
    }

    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
    })

    // CHECKS
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    })

    // PROVINCIAS
    $.ajax({
        url : uri + "core/locations/functions.php",
        data : {
            type: 'getProvinces'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var provinces = $.parseJSON(data)
            if(provinces != null){
                $('.province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('.province').append($('<option />').val(this.province).text(this.province))
                })

                $('.province').change(function(){
                    $('.province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var province
    $('.province').change(function(){       
        province = $(this).val()
        $('.location').prop('disabled', false)
        $('.location').val('').trigger('change')
    })

    $('.location').prop('disabled', true)

    // LOCALIDADES
    $('.location').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : province
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.locationID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    // CALENDARIO
    function ini_events(ele){
        ele.each(function(){
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            }

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject)

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            })
        })
    }

    ini_events($('#external-events div.external-event'))
    var datos
    var date = new Date()
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear()

    $('#calendar').fullCalendar({
        customButtons: {
            newEvent: {
                text: 'Nueva cremación',
                click: function() {
                    $('#modal-choose-expedient').modal('show')
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
        displayEventTime : true,
        eventSources: uri+'core/events/cremations/list.php',
        eventTextColor: '#F0F0F0',
        eventRender : function(calEvent, elem, view){
            var deceased = '<br>' + calEvent.deceasedName + ' ' + calEvent.deceasedSurname
            var number = calEvent.number
            var introduction
            calEvent.crematoriumIntroduction == 1 ? introduction = '<br>Introducción' : introduction = ''
            var waitOnRoom
            calEvent.crematoriumWaitOnRoom == 1 ? waitOnRoom = '<br>Esperar en sala' : waitOnRoom = ''
            var vaseBio
            calEvent.crematoriumVaseBio == 1 ? vaseBio = '<br>Urna biodegradable' : vaseBio = ''
            var crematoriumName 
            calEvent.crematoriumName != null ? crematoriumName = '<br>Crematorio: ' + calEvent.crematoriumName : crematoriumName = ''

            switch(view.type){
                case 'month':
                    elem.find('.fc-title').html(' - ' + number + deceased + introduction + waitOnRoom + vaseBio + crematoriumName)
                break   
                case 'agendaWeek':
                case 'agendaDay':
                    elem.find('.fc-content').append(number + deceased + introduction + waitOnRoom + vaseBio + crematoriumName)
                break
            }
        },
        eventClick: function(calEvent, jsEvent, view){
            datos = calEvent

            $('#formEditData #eventID').val(calEvent.id)
            $('#formEditData #expedientID').val(calEvent.expedientID)
            $('#formEditData #name').val(calEvent.title)

            if(calEvent.crematoriumID != null){
                if($('#formEditData #crematoriumEdit').find("option[value='" + calEvent.crematoriumID + "']").length){
                    $('#formEditData #crematoriumEdit').val(calEvent.crematoriumID).trigger('change');
                }else{
                    var newOption = new Option(calEvent.crematoriumName, calEvent.crematoriumID, true, true);
                    $('#formEditData #crematoriumEdit').append(newOption).trigger('change');
                }
            }else{
                $('#formEditData #crematoriumEdit').val('').trigger('change')
            }

            var start = moment(calEvent.start).format("DD/MM/YYYY HH:mm:ss").split(" ")
            var startDate = start[0]
            var startTime = start[1]

            $('#formEditData #startDate').val(startDate)
            $('#formEditData #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"))

            var end = moment(calEvent.end).format("DD/MM/YYYY HH:mm:ss").split(" ")
            var endDate = end[0]
            var endTime = end[1]

            $('#formEditData #endDate').val(endDate)
            $('#formEditData #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"))

            if(startTime == "00:00:00" && endTime == "23:59:59"){
                $('#formEditData #allDay').iCheck('check')
            }else{
                $('#formEditData #allDay').iCheck('uncheck')
            }

            $('#formEditData #status').val(calEvent.statusID)
            if(calEvent.statusID == 6){
                $('#deleteCremation').removeClass('hide')
            }else{

                if(calEvent.statusID == 7){
                    $("#formEditData #startDate").attr("disabled", true);
                    $("#formEditData #startTime").attr("disabled", true);
                    $("#formEditData #endDate").attr("disabled", true);
                    $("#formEditData #endTime").attr("disabled", true);
                }
                $('#deleteCremation').addClass('hide')
            }
            $('#formEditData .status .fa-circle').css('color',calEvent.backgroundColor)
            if (calEvent.reminder==0){
                $('#formEditData #reminder').iCheck('uncheck')
            }else if (calEvent.reminder==1){
                $('#formEditData #reminder').iCheck('check')
            }
            $('#formEditData #user').val(calEvent.userName)

            funeralHomeClientID = calEvent.clientID

            if(calEvent.clientID != null){
                funeralhomeClient = getFuneralHome(calEvent.clientID)
  
                if($('#formEditData #client').find("option[value='" + calEvent.clientID + "']").length){
                    $('#formEditData #client').val(calEvent.clientID).trigger('change')
                }else{ 
                    var newOption = new Option(funeralhomeClient.name, calEvent.clientID, true, true)
                    $('#formEditData #client').append(newOption).trigger('change')
                }

                $('#formEditData #cif').val(funeralhomeClient.nif)
                $('#formEditData #phone').val(funeralhomeClient.phones)
            }
            
            if(calEvent.cremationServiceLocation != null){
                if($('#formEditData #cremationServiceLocation').find("option[value='" + calEvent.cremationServiceLocation + "']").length){
                    $('#formEditData #cremationServiceLocation').val(calEvent.cremationServiceLocation).trigger('change')
                }else{ 
                    var newOption = new Option(calEvent.cremationServiceLocationName, calEvent.cremationServiceLocation, true, true)
                    $('#formEditData #cremationServiceLocation').append(newOption).trigger('change')
                }
                $('#formEditData #cremationServiceLocation').prop('disabled', false);
            }
            $('#formEditData #cremationServiceProvince').val(calEvent.cremationServiceProvinceName);
            $('#formEditData #ecologicCoffin').prop('checked', parseInt(calEvent.ecologicCoffin));
            $('#formEditData #crematoriumPacemaker').prop('checked', parseInt(calEvent.crematoriumPacemaker));

            if(calEvent.crematoriumContactPerson != ''){
                $('#formEditData #contactPerson').val(calEvent.crematoriumContactPerson)
            }
            if(calEvent.crematoriumContactPersonPhone != ''){
                $('#formEditData #phone').val(calEvent.crematoriumContactPersonPhone)
            }
            if(calEvent.crematoriumContactPhonePerson != ''){
                $('#formEditData #phoneContact').val(calEvent.crematoriumContactPhonePerson)
            }

            $('#formEditData #deceasedName').val(calEvent.deceasedName)
            $('#formEditData #deceasedSurname').val(calEvent.deceasedSurname)
            $('#formEditData #deceasedNIF').val(calEvent.deceasedNIF)
            $('#formEditData #number').val(calEvent.number)
            var gender = ' D. '
            if(calEvent.deceasedGender == 'Mujer'){
                gender = ' Dña. '
            }
            $('#modal-edit-event #numExp').text(calEvent.number + ' - ' + gender + calEvent.deceasedName + ' ' + calEvent.deceasedSurname)

            $('#formEditData #familyContactName').val(calEvent.familyContactName)
            $('#formEditData #familyContactSurname').val(calEvent.familyContactSurname)
            $('#formEditData #familyContactPhone').val(calEvent.familyContactPhone)
            if(calEvent.crematoriumArriveTime == null){
                $('#formEditData #crematoriumArriveTime').val('')
            }else{
                $('#formEditData #crematoriumArriveTime').val(moment(calEvent.crematoriumArriveTime, "HH:mm:ss").format("HH:mm"))
            }
            if(calEvent.crematoriumIntroduction == 1){
                $('#formEditData #crematoriumIntroduction').prop('checked', true)
                $('#formEditData #arriveFamilyTime').removeClass('hide')
            }else{
                $('#formEditData #crematoriumIntroduction').prop('checked', false)
                $('#formEditData #arriveFamilyTime').addClass('hide')
            }
            calEvent.crematoriumWaitOnRoom == 1 ? $('#formEditData #crematoriumWaitOnRoom').prop('checked', true) : $('#formEditData #crematoriumWaitOnRoom').prop('checked', false)
            calEvent.crematoriumVaseBio == 1 ? $('#formEditData #crematoriumVaseBio').prop('checked', true) : $('#formEditData #crematoriumVaseBio').prop('checked', false)

            if(calEvent.crematoriumTechnical != null){
                if($('#formEditData #crematoriumTechnical').find("option[value='" + calEvent.crematoriumTechnical + "']").length){
                    $('#formEditData #crematoriumTechnical').val(calEvent.crematoriumTechnical).trigger('change');
                }else{
                    var newOption = new Option(calEvent.crematoriumTechnicalName + ' ' + calEvent.crematoriumTechnicalSurname, calEvent.crematoriumTechnical, true, true);
                    $('#formEditData #crematoriumTechnical').append(newOption).trigger('change');
                }
            }else{
                $('#formEditData #crematoriumTechnical').val('').trigger('change')
            }
            
            $.ajax({
                url : uri + 'core/events/functions.php',
                method : 'POST',
                data : {
                    action : 'getProducts',
                    expedient : calEvent.expedientID
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#modal-edit-event #products').empty()

                    if(data == null){
                        $('#modal-edit-event #products').append('<p>No se han contratado productos referentes a la cremación.</p>')
                    }else{
                        $('#modal-edit-event #products').append('   <table class="table table-striped table-bordered" width="100%" cellspacing="0">' +
                                                                '       <thead>' +
                                                                '           <tr>' +
                                                                '               <th class="text-center">Cantidad</th>' +
                                                                '               <th>Producto</th>' +
                                                                '               <th>Modelo</th>' +
                                                                '               <th>Proveedor</th>' +
                                                                '           </tr>' +
                                                                '       </thead>' +
                                                                '       <tbody id="productsBody"></tbody>' +
                                                                '   </table>')

                        $.each(data, function(index, elem){
                            $('#modal-edit-event #productsBody').append('   <tr>' +
                                                                        '       <td class="text-center">' + elem.amount + '</td>' +
                                                                        '       <td>' + elem.productName + '</td>' +
                                                                        '       <td>' + elem.modelName + '</td>' +
                                                                        '       <td>' + elem.supplierName + '</td>' +
                                                                        '   </tr>')
                        })
                    }
                }
            })

            $('#formEditData #authName').val(calEvent.authName)
            $('#formEditData #authDni').val(calEvent.authDni)
            $('#formEditData #authContactPhone').val(calEvent.authContactPhone)
            if(calEvent.authDate != null){
                $('#formEditData #authDate').val(moment(calEvent.authDate, 'X').format('DD/MM/YYYY'));
            }
            if(calEvent.authTime != null){
                $('#formEditData #authTime').val(moment(calEvent.authTime, 'X').format('HH:mm'));
            }
            $('#formEditData #authPlace').val(calEvent.authPlace);

            $('#modal-edit-event').modal('show')
        },
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject')

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject)

            // assign it the date that was reported
            copiedEventObject.start = date
            copiedEventObject.allDay = allDay
            copiedEventObject.backgroundColor = $(this).css("background-color")
            copiedEventObject.borderColor = $(this).css("border-color")

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true)

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove()
            }
        },
        lazyFetching : true
    })

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

    $('.client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+ 'core/funeralHomes/data.php', //'core/clients/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.funeralHomeID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })
    
    $('#formEditData #client').on('select2:select', function () {
        var funeralHomeID = $(this).val();
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formEditData #cif').val(data[0].nif);
            $('#formEditData #phone').val(data[0].phones);
           
            if(datos.clientID == funeralHomeID){
                if(datos.crematoriumContactPerson == null){
                    $('#formEditData #contactPerson').val(data[0].person);
                }else{
                    $('#formEditData #contactPerson').val(datos.crematoriumContactPerson);
                }                          
                if(datos.crematoriumContactPhonePerson == null){
                    $('#formEditData #phoneContact').val(data[0].phones);
                }else{
                    $('#formEditData #phoneContact').val(datos.crematoriumContactPhonePerson);
                }  
            }else{
                $('#formEditData #contactPerson').val(data[0].person);
                $('#formEditData #phoneContact').val(data[0].phones);
            }            
        });
        
    });

    $('#formNewData #crematorium').select2({
        containerCssClass: 'select2-crematorium',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/crematoriums/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.crematoriumID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    // NUEVA CREMACIÓN
    $('#expedient').select2({
        containerCssClass: 'select2-expedient',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/events/cremations/dataExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || ""
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.number,
                            id: item.expedientID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup },
        templateResult: formatData,
        templateSelection: formatData
    })

    $('#expedient').change(function(){
        if($(this).val() != null){
            var expedient = $(this).val()
            $('#modal-choose-expedient').modal('hide')
    
            $('#expedientID').val($(this).val())

            $.ajax({
                url : 'core/expedients/expedient/functions.php',
                method : 'POST',
                data : {
                    type : 'getInfo',
                    expedient : $(this).val()
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewData #name').val(data.deceasedName + ' ' + data.deceasedSurname + ' - ' + data.number)
                    $('#formNewData #deceasedName').val(data.deceasedName)
                    $('#formNewData #deceasedSurname').val(data.deceasedSurname)
                    $('#formNewData #deceasedNIF').val(data.deceasedNIF)
                    $('#formNewData #number').val(data.number)
                    $('#formNewData #familyContactName').val(data.familyContactName)
                    $('#formNewData #familyContactSurname').val(data.familyContactSurname)
                    $('#formNewData #familyContactPhone').val(data.familyContactPhone)
                }
            })

            $.ajax({
                url : 'core/users/functions2.php',
                method : 'POST',
                data : {
                    type : 'getInfo'
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewData #user').val(data.name + ' ' + data.surname)
                }
            })

            $('#modal-new-event').modal('show')
        }
    })

    $('#formNewData #client').on('select2:select', function () {
        var funeralHomeID = $(this).val();        
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formNewData #cif').val(data[0].nif);
            $('#formNewData #phone').val(data[0].phones);
            $('#formNewData #contactPerson').val(data[0].person);
            $('#formNewData #phoneContact').val(data[0].phones);                  
        });
        
    });

    $('#formNewData .status .fa-circle').css('color', '#f47d42')
    $('#formNewData #status').change(function(){
        switch($(this).val()){
            case '6':
                $('#formNewData .status .fa-circle').css('color', '#f47d42')
                break

            case '7':
                $('#formNewData .status .fa-circle').css('color', '#614126')
                break
        }
    })

    var reminderNew = 0
    $('#formNewData #reminder').on('ifUnchecked', function(event){
        reminderNew = 0
    })
    $('#formNewData #reminder').on('ifChecked', function(event){
        reminderNew = 1
    })

    // DATOS CREMACIÓN
    $('#formNewData #startDate').change(function(){
        if($(this).val() == ''){
            $('#formNewData #endDate').attr('disabled', true)
            $('#formNewData #endDate').val('')
            $('#formNewData #startTime').attr('disabled', true)
            $('#formNewData #startTime').val('')
            $('#formNewData #endTime').attr('disabled', true)
            $('#formNewData #endTime').val('')
        }else{
            $('#formNewData #startTime').attr('disabled', false)
        }
    })

    $('#formNewData #startTime').change(function(){
        if($(this).val() == ''){
            $('#formNewData #endDate').attr('disabled', true)
            $('#formNewData #endDate').val('')
            $('#formNewData #endTime').attr('disabled', true)
            $('#formNewData #endTime').val('')
        }else{
            $('#formNewData #endDate').attr('disabled', false)
            $('#formNewData #endTime').attr('disabled', false)

            var startDate = $('#formNewData #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formNewData #endDate').val(endDate)
            $('#formNewData #endTime').val(endTime)
        }
    })

    $('#formNewData #crematoriumIntroduction').change(function(){
        if($(this).prop('checked')){
            $('#formNewData #arriveFamilyTime').removeClass('hide')
        }else{
            $('#formNewData #arriveFamilyTime').addClass('hide')
        }
    })

    $('.crematoriumTechnical').select2({
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/staff/expedientsTechnical.php',
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
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#saveNewEvent').click(function(){
        var validate = 0

        /*if(isEmpty($('#formNewData #crematorium'))){
            validate++
        }*/
        if($("#formNewData #phoneContact").val() != ""){
            if(!isPhone($("#formNewData #phoneContact"))){
                validate++;
            }
        }
        if($("#formNewData #phone").val() != ""){
            if(!isPhone($("#formNewData #phone"))){
                validate++;
            }
        }
        if($("#formNewData #authDni").val() != ""){
            if(!isNifCif($("#formNewData #authDni"))){
                validate++;
            }
        }
        if($("#formNewData #authContactPhone").val() != ""){
            if(!isPhone($("#formNewData #authContactPhone"))){
                validate++;
            }
        }
        if($("#formNewData #familyContactPhone").val() != ""){
            if(!isPhone($("#formNewData #familyContactPhone"))){
                validate++;
            }
        }
        if(isEmpty($('#formNewData #startDate'))){
            validate++
        }
        if(!isEmpty($("#formNewData #startDate")) && !isEmpty($("#formNewData #endDate"))){
            if(compareDates($('#formNewData #startDate').val(), $('#formNewData #endDate').val()) > 0){
                $("#formNewData #endDate").val($("#formNewData #startDate").val())
            }
        }
        if(isEmpty($('#formNewData #endDate'))){
            validate++
        }
        if(isEmpty($('#formNewData #startTime'))){
            validate++
        }
        if(isEmpty($('#formNewData #endTime'))){
            validate++
        }
        if(isEmpty($('#formNewData #client'))){
            validate++
        }

        if(validate == 0){
            var expedient = $('#formNewData #expedientID').val()
            var crematorium = $('#formNewData #crematorium').val()
            var startDate = $('#formNewData #startDate').val()
            var endDate = $('#formNewData #endDate').val()
            var startTime = $('#formNewData #startTime').val()
            var endTime = $('#formNewData #endTime').val()
            var compareT = compareTimes(startTime, endTime)
            if(compareT == 0){
                endTime = endTime + ':01'
            }else if(compareT == 1){
                $("#formEditData #endTime").val($("#formEditData #startTime").val())
                endTime = $("#formEditData #endTime").val() + ':01'
            }
            var start = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD") + " " + startTime
            var end = moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD") + " " + endTime
            var name = $('#formNewData #name').val()
            var user = $('#formNewData #user').val()
            var state = $('#formNewData #status').val()
            var client = $('#formNewData #client').val()
            var contactPerson = $('#formNewData #contactPerson').val()
            var contactPersonPhone = $('#formNewData #phone').val()
            var crematoriumContactPhonePerson = $('#formNewData #phoneContact').val()
            var familyContactName = $('#formNewData #familyContactName').val()
            var familyContactSurname = $('#formNewData #familyContactSurname').val()
            var familyContactPhone = $('#formNewData #familyContactPhone').val()
            var crematoriumArriveTime = $('#formNewData #crematoriumArriveTime').val()
            var cremationServiceLocation = $('#formNewData #cremationServiceLocation').val()
            var ecologicCoffin = $('#formNewData #ecologicCoffin').val()
            var introduction
            $('#formNewData #crematoriumIntroduction').prop('checked') ? introduction = 1 : introduction = 0
            var waitOnRoom
            $('#formNewData #crematoriumWaitOnRoom').prop('checked') ? waitOnRoom = 1 : waitOnRoom = 0
            var vaseBio
            $('#formNewData #crematoriumVaseBio').prop('checked') ? vaseBio = 1 : vaseBio = 0
            var crematoriumpacemaker
            $('#formNewData #crematoriumpacemaker').prop('checked') ? crematoriumpacemaker = 1 : crematoriumpacemaker = 0
            var authName = $('#formNewData #authName').val()
            var authContactPhone = $('#formNewData #authContactPhone').val()
            var authDni = $('#formNewData #authDni').val()
            var authDate = $('#formNewData #authDate').val() == '' ? null : moment($('#formNewData #authDate').val(), 'DD/mm/YYYY').format('X')
            var authTime = $('#formNewData #authTime').val() == '' ? null : moment($('#formNewData #authTime').val(), 'HH:mm').format('X')
            var authPlace = $('#formNewData #authPlace').val()
            var crematoriumTechnical = $('#formNewData #crematoriumTechnical').val()
            
            // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORA
            var validate = true
            
            var crematoriumEntry = moment($('#formNewData #startDate').val() + ' ' + $('#formNewData #startTime').val(), 'DD/MM/YYYY HH:mm').format('X')
            var crematoriumLeaving = moment($('#formNewData #endDate').val() + ' ' + endTime, 'DD/MM/YYYY HH:mm').format('X')

            var busy = checkCremationBusy(crematoriumEntry, crematoriumLeaving)

            if(busy){
                validate = false

                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación para la fecha y hora seleccionadas</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
           
            if(validate){
                $.ajax({
                    url : uri + 'core/events/cremations/create.php',
                    method : 'POST',
                    data : {
                        expedient : expedient,
                        crematorium : crematorium,
                        start : start,
                        end : end,
                        name : name,
                        user : user,
                        state : state,
                        reminder : reminderNew,
                        client : client,
                        contactPerson : contactPerson,
                        contactPersonPhone : contactPersonPhone,
                        familyContactName : familyContactName,
                        familyContactSurname : familyContactSurname,
                        familyContactPhone : familyContactPhone,
                        crematoriumArriveTime : crematoriumArriveTime,
                        introduction : introduction,
                        waitOnRoom : waitOnRoom,
                        vaseBio : vaseBio,
                        authName : authName,
                        authDni : authDni,
                        authDate: authDate,
                        authTime: authTime,
                        authPlace: authPlace,
                        cremationServiceLocation : cremationServiceLocation,
                        ecologicCoffin : ecologicCoffin,
                        crematoriumpacemaker: crematoriumpacemaker,
                        crematoriumTechnical: crematoriumTechnical,
                        authContactPhone : authContactPhone,
                        crematoriumContactPhonePerson : crematoriumContactPhonePerson
                    },
                    success : function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha creado con éxito.</div>')
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
    
                $('#calendar').fullCalendar('refetchEvents');
    
                $('#modal-new-event').modal('hide')
            }
        }else{
            $('#modal-new-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-event #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-choose-expedient').on('hidden.bs.modal', function(){
        $('#formNewData #expedient').val('').trigger('change')
    })

    $('#modal-new-event').on('hidden.bs.modal', function(){
        $('#formNewData #client').val('').trigger('change')
        $('#formNewData input').val('')
        $('#formNewData input[type="checkbox"]').prop('checked', false)
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)  
    })

    // EDITAR CREMACIÓN
    var allDayEdit = 0
    $('#formEditData #allDay').on('ifChanged', function(event){
        $('#formEditData #allDay').on('ifUnchecked', function(event){
            allDayEdit = 0
            $("#formEditData #startTime").prop("disabled", false)
            $("#formEditData #endTime").prop("disabled", false)
        })
        $('#formEditData #allDay').on('ifChecked', function(event){
            allDayEdit = 1
            $("#formEditData #startTime").prop("disabled", true)
            $("#formEditData #endTime").prop("disabled", true)
        })
    })

    var reminderEdit = 0
    $('#formEditData #reminder').on('ifUnchecked', function(event){
        reminderEdit = 0
    })
    $('#formEditData #reminder').on('ifChecked', function(event){
        reminderEdit = 1
    })

    $('#formEditData #status').change(function(){
        switch($(this).val()){
            case '6':
                $('#formEditData .status .fa-circle').css('color', '#f47d42')
                break

            case '7':
                $('#formEditData .status .fa-circle').css('color', '#614126')
                break
        }
    })

    $('#formEditData #crematoriumEdit').select2({
        containerCssClass: 'select2-crematorium',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/crematoriums/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page
                }
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.crematoriumID
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    })

    // DATOS CREMACIÓN
    $('#formEditData #startDate').change(function(){
        if($(this).val() == ''){
            $('#formEditData #endDate').attr('disabled', true)
            $('#formEditData #endDate').val('')
            $('#formEditData #startTime').attr('disabled', true)
            $('#formEditData #startTime').val('')
            $('#formEditData #endTime').attr('disabled', true)
            $('#formEditData #endTime').val('')
        }else{
            $('#formEditData #startTime').attr('disabled', false)
        }
    })

    $('#formEditData #startTime').change(function(){
        if($(this).val() == ''){
            $('#formEditData #endDate').attr('disabled', true)
            $('#formEditData #endDate').val('')
            $('#formEditData #endTime').attr('disabled', true)
            $('#formEditData #endTime').val('')
        }else{
            $('#formEditData #endDate').attr('disabled', false)
            $('#formEditData #endTime').attr('disabled', false)

            var startDate = $('#formEditData #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formEditData #endDate').val(endDate)
            $('#formEditData #endTime').val(endTime)
        }
    })

    $('#formEditData #crematoriumIntroduction').change(function(){
        if($(this).prop('checked')){
            $('#formEditData #arriveFamilyTime').removeClass('hide')
        }else{
            $('#formEditData #arriveFamilyTime').addClass('hide')
        }
    })

    $('#saveEditEvent').click(function(){
        var validate = 0
        if($("#formEditData #phoneContact").val() != ""){
            if(!isPhone($("#formEditData #phoneContact"))){
                validate++;
            }
        }
        if($("#formEditData #authContactPhone").val() != ""){
            if(!isPhone($("#formEditData #authContactPhone"))){
                validate++;
            }
        }
        if($("#formEditData #phone").val() != ""){
            if(!isPhone($("#formEditData #phone"))){
                validate++;
            }
        }
        if($("#formEditData #familyContactPhone").val() != ""){
            if(!isPhone($("#formEditData #familyContactPhone"))){
                validate++;
            }
        }

        if($("#formEditData #authDni").val() != ""){
            if(!isNifCif($("#formEditData #authDni"))){
                validate++;
            }
        }

       
        
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

        if(allDayEdit == 0){
            if(isEmpty($("#formEditData #startTime"))){
                validate++
            }
            if(isEmpty($("#formEditData #endTime"))){
                validate++
            }
        }
        if(isEmpty($("#formEditData #status"))){
            validate++
        }
        if(isEmpty($('#formEditData #client'))){
            validate++
        }

        if(validate == 0){
            var eventID = $("#formEditData #eventID").val()
            var expedientID = $("#formEditData #expedientID").val()

            var startDate = moment($("#formEditData #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formEditData #startTime").val()
            
            var endDate = moment($("#formEditData #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formEditData #endTime").val()

            var compareT = compareTimes(startTime, endTime)
            if(compareT == 0){
                endTime = endTime + ':01'
            }else if(compareT == 1){
                $("#formEditData #endTime").val($("#formEditData #startTime").val())
                endTime = $("#formEditData #endTime").val() + ':01'
            }

            start = startDate + " " + startTime
            end = endDate + " " + endTime

            var name = $("#formEditData #name").val()
            var status = $("#formEditData #status").val()

            var client = $('#formEditData #client').val()
            var contactPerson = $('#formEditData #contactPerson').val()
            var contactPersonPhone = $('#formEditData #phone').val()
            var crematoriumContactPhonePerson = $('#formEditData #phoneContact').val()
            var familyContactName = $('#formEditData #familyContactName').val()
            var familyContactSurname = $('#formEditData #familyContactSurname').val()
            var familyContactPhone = $('#formEditData #familyContactPhone').val()
            var crematoriumArriveTime = $('#formEditData #crematoriumArriveTime').val()
            var cremationServiceLocation = $('#formEditData #cremationServiceLocation').val();
            var ecologicCoffin = $('#formEditData #ecologicCoffin').prop('checked');
            var crematoriumIntroduction
            $('#formEditData #crematoriumIntroduction').prop('checked') ? crematoriumIntroduction = 1 : crematoriumIntroduction = 0
            var crematoriumWaitOnRoom
            $('#formEditData #crematoriumWaitOnRoom').prop('checked') ? crematoriumWaitOnRoom = 1 : crematoriumWaitOnRoom = 0
            var crematoriumVaseBio
            $('#formEditData #crematoriumVaseBio').prop('checked') ? crematoriumVaseBio = 1 : crematoriumVaseBio = 0
            var crematoriumPacemaker
            $('#formEditData #crematoriumPacemaker').prop('checked') ? crematoriumPacemaker = 1 : crematoriumPacemaker = 0
            
            var authName = $('#formEditData #authName').val()
            var authContactPhone = $('#formEditData #authContactPhone').val()
            var authDni = $('#formEditData #authDni').val()
            var authDate = $('#formEditData #authDate').val() == '' ? null : moment($('#formEditData #authDate').val(), 'DD/mm/YYYY').format('X')
            var authTime = $('#formEditData #authTime').val() == '' ? null : moment($('#formEditData #authTime').val(), 'HH:mm').format('X')
            var authPlace = $('#formEditData #authPlace').val()

            var crematoriumTechnical = $('#formEditData #crematoriumTechnical').val()
            var crematoriumId = $('#formEditData #crematoriumEdit').val()

            // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORAmatoriumLeavingDate').val() != '' && $('#crematoriumLeavingTime').val() != ''){
            var validate = true
        
            var crematoriumEntry = moment($('#formEditData #startDate').val() + ' ' + $('#formEditData #startTime').val(), 'DD/MM/YYYY HH:mm').format('X')
            var crematoriumLeaving = moment($('#formEditData #endDate').val() + ' ' + endTime, 'DD/MM/YYYY HH:mm').format('X')
            
            var busy = checkCremationBusyEdit(crematoriumEntry, crematoriumLeaving, crematoriumId, expedientID)

            if(busy){
                validate = false

                $('#modal-edit-event #warning-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación para la fecha y hora seleccionadas</div>');
                setTimeout(function(){
                    $('#modal-edit-event #warning-message').empty()
                }, 5000)
                return false;
            }
            
            if(validate){
                $.ajax({
                    url : uri + 'core/events/cremations/update.php',
                    method : 'POST',
                    data : {
                        event : eventID,
                        start : start,
                        end : end,
                        name : name,
                        reminder : reminderEdit,
                        status : status,
                        client : client,
                        contactPerson : contactPerson,
                        contactPersonPhone : contactPersonPhone,
                        familyContactName : familyContactName,
                        familyContactSurname : familyContactSurname,
                        familyContactPhone : familyContactPhone,
                        crematoriumArriveTime : crematoriumArriveTime,
                        crematoriumIntroduction : crematoriumIntroduction,
                        crematoriumWaitOnRoom : crematoriumWaitOnRoom,
                        crematoriumVaseBio : crematoriumVaseBio,
                        authName : authName,
                        authDni : authDni,
                        authDate: authDate,
                        authTime: authTime,
                        authPlace: authPlace,
                        cremationServiceLocation : cremationServiceLocation,
                        ecologicCoffin : ecologicCoffin,
                        crematoriumPacemaker: crematoriumPacemaker,
                        crematoriumTechnical: crematoriumTechnical,
                        crematoriumId: crematoriumId,
                        expedientID : expedientID,
                        authContactPhone : authContactPhone,
                        crematoriumContactPhonePerson : crematoriumContactPhonePerson,
                        crematoriumId : crematoriumId
                    },
                    success : function(data){
                        if(data){
                            $('#calendar').fullCalendar('refetchEvents')
    
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha actualizado con éxito.</div>')
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
    
                $('#modal-edit-event').modal('hide')
            }else{
                $('#modal-edit-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

                setTimeout(function(){
                    $('#modal-edit-event #warning-message').empty()
                }, 3500)
            }
        }else{
            $('#modal-edit-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-event #warning-message').empty()
            }, 3500)
        }
    })

    $('#modal-edit-event').on('hidden.bs.modal', function(){
        $('#formEditData #client').val('').trigger('change')
        $('#formEditData input').val('')
        $('#formEditData input[type="checkbox"]').prop('checked', false)
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)  
    })

    $('#deleteCremation').click(function(){
        var ID = $("#formEditData #eventID").val()

        if(confirm('Desea eliminar la cremación?')){
            $.ajax({
                url: uri + 'core/events/cremations/delete.php',
                method: 'POST',
                data: {
                    ID: ID
                },
                async: false,
                success: function(data){
                    try{
                        if(data){
                            $('#calendar').fullCalendar('refetchEvents')
    
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha eliminado con éxito.</div>')
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        }
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

            $('#modal-edit-event').modal('hide')
        }
    })
})