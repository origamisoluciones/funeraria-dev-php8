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
function checkCremationBusyEdit(start, end, expedient, crematorium){
    var busy = false
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'checkCremationTimeEdit',
            crematoriumEntry: start,
            crematoriumLeaving: end,
            expedient: expedient,
            crematorium: crematorium,
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
    // --------------------CARGAMOS LA VISTA DE LA PÁGINA
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');
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
    
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
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
        defaultTime: false,
        timeFormat: 'HH:mm'
    })
    $('#formEditData #endTime').timepicker({
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
    
    var datos
    $('#calendar').fullCalendar({
        customButtons: {
            newEvent: {
                text: 'Nuevo Evento',
                click: function() {
                    $('#modal-new-event').modal('show');
                }
            },
            newCremation: {
                text: 'Nueva Cremación',
                click: function() {
                    $('#modal-choose-expedient').modal('show');
                }
            },
            newCleaning: {
                text: 'Nuevo Mantenimiento',
                click: function() {
                    $('#modal-new-cleaning').modal('show');
                }
            }
        },
        header: {
            left: 'prev,next today newEvent newCremation newCleaning',
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
        eventSources: uri + 'core/events/list.php',
        eventTextColor: '#F0F0F0',
        eventRender : function(calEvent, elem, view){
            if(calEvent.cremation == 1){
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
            }
        },
        eventClick: function(calEvent, jsEvent, view){
            datos = calEvent
            $("#formEditData #upkeepsDiv").addClass('hide')
            switch (calEvent.type) {
                case '1':
                    $('#formEditCremation #eventID').val(calEvent.id)
                    $('#formEditCremation #expedientID').val(calEvent.expedientID)
                    $('#formEditCremation #name').val(calEvent.title)

                    if(calEvent.crematoriumID != null){
                        if($('#formEditCremation #crematoriumEdit').find("option[value='" + calEvent.crematoriumID + "']").length){
                            $('#formEditCremation #crematoriumEdit').val(calEvent.crematoriumID).trigger('change');
                        }else{
                            var newOption = new Option(calEvent.crematoriumName, calEvent.crematoriumID, true, true);
                            $('#formEditCremation #crematoriumEdit').append(newOption).trigger('change');
                        }
                    }else{
                        $('#formEditCremation #crematoriumEdit').val('').trigger('change')
                    }

                    var start = moment(calEvent.start2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                    var startDate = start[0]
                    var startTime = start[1]
                    $('#formEditCremation #startDate').val(startDate)
                    $('#formEditCremation #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"))
        
                    var end = moment(calEvent.end2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                    var endDate = end[0]
                    var endTime = end[1]
                    $('#formEditCremation #endDate').val(endDate)
                    $('#formEditCremation #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"))
        
                    if(startTime == "00:00:00" && endTime == "23:59:59"){
                        $('#formEditCremation #allDay').iCheck('check')
                    }else{
                        $('#formEditCremation #allDay').iCheck('uncheck')
                    }
        
                    $('#formEditCremation #status').val(calEvent.statusID)
                    if(calEvent.statusID == 6){
                        $('#deleteCremation').removeClass('hide')
                    }else{
                        if(calEvent.statusID == 7){ 
                            $("#formEditCremation #startDate").attr("disabled", true);
                            $("#formEditCremation #startTime").attr("disabled", true);
                            $("#formEditCremation #endDate").attr("disabled", true);
                            $("#formEditCremation #endTime").attr("disabled", true);
                    }
                        $('#deleteCremation').addClass('hide')
                    }
                    $('#formEditCremation .status .fa-circle').css('color',calEvent.backgroundColor)
                    if (calEvent.reminder==0){
                        $('#formEditCremation #reminder').iCheck('uncheck')
                    }else if (calEvent.reminder==1){
                        $('#formEditCremation #reminder').iCheck('check')
                    }
                    $('#formEditCremation #user').val(calEvent.userName)
        
                    funeralHomeClientID = calEvent.clientID                    
                    if(calEvent.clientID != null){                        
                        funeralhomeClient = getFuneralHome(calEvent.clientID)                        
                        if($('#formEditCremation #client').find("option[value='" + calEvent.clientID + "']").length){
                            $('#formEditCremation #client').val(calEvent.clientID).trigger('change')
                        }else{ 
                            var newOption = new Option(funeralhomeClient.name, calEvent.clientID, true, true)
                            $('#formEditCremation #client').append(newOption).trigger('change')
                        }

                        $('#formEditCremation #cif').val(funeralhomeClient.nif)
                        $('#formEditCremation #phone').val(funeralhomeClient.phones)
                    }
                    if(calEvent.cremationServiceLocation != null){
                        if($('#formEditCremation #cremationServiceLocation').find("option[value='" + calEvent.cremationServiceLocation + "']").length){
                            $('#formEditCremation #cremationServiceLocation').val(calEvent.cremationServiceLocation).trigger('change')
                        }else{ 
                            var newOption = new Option(calEvent.cremationServiceLocationName, calEvent.cremationServiceLocation, true, true)
                            $('#formEditCremation #cremationServiceLocation').append(newOption).trigger('change')
                        }
                        $('#formEditCremation #cremationServiceLocation').prop('disabled', false);
                    }
                    $('#formEditCremation #cremationServiceProvince').val(calEvent.cremationServiceProvinceName);
                    $('#formEditCremation #ecologicCoffin').prop('checked', parseInt(calEvent.ecologicCoffin));

                    if(calEvent.crematoriumContactPerson != ''){
                        $('#formEditCremation #contactPerson').val(calEvent.crematoriumContactPerson)
                    }
                    if(calEvent.crematoriumContactPersonPhone != ''){
                        $('#formEditCremation #phone').val(calEvent.crematoriumContactPersonPhone)
                    }
                    if(calEvent.crematoriumContactPhonePerson != ''){
                        $('#formEditCremation #crematoriumContactPhonePerson').val(calEvent.crematoriumContactPhonePerson)
                    }
        
                    $('#formEditCremation #deceasedName').val(calEvent.deceasedName)
                    $('#formEditCremation #deceasedSurname').val(calEvent.deceasedSurname)
                    $('#formEditCremation #deceasedNIF').val(calEvent.deceasedNIF)
                    $('#formEditCremation #number').val(calEvent.number)
                    var gender = ' D. '
                    if(calEvent.deceasedGender == 'Mujer'){
                        gender = ' Dña. '
                    }
                    $('#modal-edit-cremation #numExp').text(calEvent.number + ' - ' + gender + calEvent.deceasedName + ' ' + calEvent.deceasedSurname)
        
                    $('#formEditCremation #familyContactName').val(calEvent.familyContactName)
                    $('#formEditCremation #familyContactSurname').val(calEvent.familyContactSurname)
                    $('#formEditCremation #familyContactPhone').val(calEvent.familyContactPhone)
                    if(calEvent.crematoriumArriveTime == null){
                        $('#formEditCremation #crematoriumArriveTime').val('')
                    }else{
                        $('#formEditCremation #crematoriumArriveTime').val(moment(calEvent.crematoriumArriveTime, "HH:mm:ss").format("HH:mm"))
                    }
      
                    if(calEvent.crematoriumIntroduction == 1){
                        $('#formEditCremation #crematoriumIntroduction').prop('checked', true)
                        $('#formEditCremation #arriveFamilyTime').removeClass('hide')
                    }else{
                        $('#formEditCremation #crematoriumIntroduction').prop('checked', false)
                        $('#formEditCremation #arriveFamilyTime').addClass('hide')
                    }
                    calEvent.crematoriumWaitOnRoom == 1 ? $('#formEditCremation #crematoriumWaitOnRoom').prop('checked', true) : $('#formEditCremation #crematoriumWaitOnRoom').prop('checked', false)
                    calEvent.crematoriumVaseBio == 1 ? $('#formEditCremation #crematoriumVaseBio').prop('checked', true) : $('#formEditCremation #crematoriumVaseBio').prop('checked', false)

                    if(calEvent.crematoriumTechnical != null){
                        if($('#formEditCremation #crematoriumTechnical').find("option[value='" + calEvent.crematoriumTechnical + "']").length){
                            $('#formEditCremation #crematoriumTechnical').val(calEvent.crematoriumTechnical).trigger('change');
                        }else{
                            var newOption = new Option(calEvent.crematoriumTechnicalName + ' ' + calEvent.crematoriumTechnicalSurname, calEvent.crematoriumTechnical, true, true);
                            $('#formEditCremation #crematoriumTechnical').append(newOption).trigger('change');
                        }
                    }else{
                        $('#formEditCremation #crematoriumTechnical').val('').trigger('change')
                    }
                    $('#formEditCremation #crematoriumPacemaker').prop('checked', parseInt(calEvent.crematoriumPacemaker));

                    $.ajax({
                        url : uri + 'core/events/functions.php',
                        method : 'POST',
                        data : {
                            action : 'getProducts',
                            expedient : calEvent.expedientID
                        },
                        success : function(data){
                            data = $.parseJSON(data)

                            $('#products').empty()

                            if(data == null){
                                $('#products').append('<p>No se han contratado productos referentes a la cremación.</p>')
                            }else{
                                $('#products').append(  
                                    '   <table class="table table-striped table-bordered" width="100%" cellspacing="0">' +
                                    '       <thead>' +
                                    '           <tr>' +
                                    '               <th class="text-center">Cantidad</th>' +
                                    '               <th>Producto</th>' +
                                    '               <th>Modelo</th>' +
                                    '               <th>Proveedor</th>' +
                                    '           </tr>' +
                                    '       </thead>' +
                                    '       <tbody id="productsBody"></tbody>' +
                                    '   </table>'
                                )

                                $.each(data, function(index, elem){
                                    $('#productsBody').append(  
                                        '   <tr>' +
                                        '       <td class="text-center">' + elem.amount + '</td>' +
                                        '       <td>' + elem.productName + '</td>' +
                                        '       <td>' + elem.modelName + '</td>' +
                                        '       <td>' + elem.supplierName + '</td>' +
                                        '   </tr>'
                                    )
                                })
                            }
                        }
                    })

                    $('#formEditCremation #authName').val(calEvent.authName)
                    $('#formEditCremation #authDni').val(calEvent.authDni)
                    if(calEvent.authDate != null){
                        $('#formEditCremation #authDate').val(moment(calEvent.authDate, 'X').format('DD/MM/YYYY'));
                    }
                    if(calEvent.authTime != null){
                        $('#formEditCremation #authTime').val(moment(calEvent.authTime, 'X').format('HH:mm'));
                    }
                    $('#formEditCremation #authContactPhone').val(calEvent.authContactPhone)
                    $('#formEditCremation #authPlace').val(calEvent.authPlace);

                    $('#modal-edit-cremation').modal('show')
                break;
                case '2':
                    $('#formEditCleaning #eventID').val(calEvent.id);                    
        
                    var start = moment(calEvent.start2).format("DD/MM/YYYY HH:mm:ss").split(" ");
                    var startDate = start[0];
                    var startTime = start[1];
        
                    $('#formEditCleaning #startDate').val(startDate);
                    $('#formEditCleaning #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"));
        
                    var end = moment(calEvent.end2).format("DD/MM/YYYY HH:mm:ss").split(" ");
                    var endDate = end[0];
                    var endTime = end[1];
        
                    $('#formEditCleaning #endDate').val(endDate);
                    $('#formEditCleaning #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"));
        
                    $('#formEditCleaning #regularity').val(calEvent.regularity)
        
                    if(calEvent.regularity == 0){
                        $('#closeCleaning').addClass('hide')
                        $('#closeDoneCleaning').addClass('hide')
                    }else{
                        $('#closeCleaning').removeClass('hide')
                        $('#closeDoneCleaning').removeClass('hide')
                    }
        
                    if(calEvent.cleaningType != null){
                        if($('#formEditCleaning #cleaningType').find("option[value='" + calEvent.cleaningType + "']").length){
                            $('#formEditCleaning #cleaningType').val(calEvent.cleaningType).trigger('change');
                        }else{ 
                            var newOption = new Option(calEvent.cleaningTypeName, calEvent.cleaningType, true, true);
                            $('#formEditCleaning #cleaningType').append(newOption).trigger('change');
                        }
                    }
                    $('#formEditCleaning #name').val(calEvent.title);
                    if(calEvent.cleaningMortuary != null){
                        if($('#formEditCleaning #cleaningMortuary').find("option[value='" + calEvent.cleaningMortuary + "']").length){
                            $('#formEditCleaning #cleaningMortuary').val(calEvent.cleaningMortuary).trigger('change');
                        }else{ 
                            var newOption = new Option(calEvent.cleaningMortuaryName,  calEvent.cleaningMortuary, true, true);
                            $('#formEditCleaning #cleaningMortuary').append(newOption).trigger('change');
                        }
                    }
                    if(calEvent.cleaningUser != null){
                        if($('#formEditCleaning #cleaningUser').find("option[value='" + calEvent.cleaningUser + "']").length){
                            $('#formEditCleaning #cleaningUser').val(calEvent.cleaningUser).trigger('change');
                        }else{ 
                            var newOption = new Option(calEvent.cleaningUserName + ' ' + calEvent.cleaningUserSurname, calEvent.cleaningUser, true, true);
                            $('#formEditCleaning #cleaningUser').append(newOption).trigger('change');
                        }
                    }
        
                    $('#formEditCleaning #status').val(calEvent.statusID);
                    $('#formEditCleaning .status .fa-circle').css('color',calEvent.backgroundColor);
                    if (calEvent.reminder==0){
                        $('#formEditCleaning #reminder').iCheck('uncheck');
                    }else if (calEvent.reminder==1){
                        $('#formEditCleaning #reminder').iCheck('check');
                    }
                    if(calEvent.success == '1'){
                        $('#formEditCleaning #closeCleaning').prop('disabled', true);
                        $('#formEditCleaning #closeDoneCleaning').prop('disabled', true);
                    }else{
                        $('#formEditCleaning #closeCleaning').prop('disabled', false);
                        $('#formEditCleaning #closeDoneCleaning').prop('disabled', false);
                    }
                    $('#formEditCleaning #user').val(calEvent.userName);
                    if(calEvent.allDay == 1){
                        $('#formEditCleaning #allDay').prop('checked', true)
                        $('#formEditCleaning #startTime').attr('disabled', true)
                        $('#formEditCleaning #endDate').attr('disabled', true)
                        $('#formEditCleaning #endTime').attr('disabled', true)
                    }
                    $('#formEditCleaning #description').val(calEvent.description)
                    $('#modal-edit-cleaning').modal('show');
                break;
                case '3':
                case '6':
                    $('#formEditData #eventID').val(null)
                    $('#formEditData #upkeepsID').val(null)
                    $('#formEditData #vehicleID').val(null)

                    if(calEvent.type == 3){
                        $('#modal-edit-event-garage #eventType').text("Taller")
                    }else{
                        $('#modal-edit-event-garage #eventType').text("ITV")
                    }

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
                    $("#formEditData #upkeepsDiv").addClass('hide')
                    $('#formEditData #eventID').val(calEvent.id)

                    $('#modal-edit-event-garage').modal('show');
                break;
                case '7':
                    $('#formEditItvEvent #eventID').val(calEvent.id)
                    $('#formEditItvEvent #name').val(calEvent.title)        
                    var start = moment(calEvent.start2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                    var startDate = start[0]       
                    $('#formEditItvEvent #startDate').val(startDate)
                    $('#formEditItvEvent #status').val(calEvent.statusID)
                    $('#formEditItvEvent .status .fa-circle').css('color', calEvent.backgroundColor)
                    $('#formEditItvEvent #reminder').prop('checked', parseInt(calEvent.reminder));                  
                    $('#formEditItvEvent #user').val(calEvent.userName)
                    $('#modal-editItv_Ins-event').modal('show')   
                break;
                case '8':
                        $('#modal-edit-event-garage #eventType').text("Matenimiento")
                        
                        $('#formEditData #eventID').val(null)
                        $('#formEditData #upkeepsID').val(null)
                        $('#formEditData #vehicleID').val(null)

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
                                    $("#formEditData #tableBody").append(
                                        '<tr>' +
                                            '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                            '<td>'+ elem.name  + '</td>' +
                                        '</tr>'
                                    )
                                })
                                
                            }
                        })
                        
                        $('#modal-edit-event-garage').modal('show');
                    break;
                case '9':

                        $('#modal-edit-event-garage #eventType').text("Matenimiento")
                        
                        $('#formEditData #eventID').val(null)
                        $('#formEditData #upkeepsID').val(null)
                        $('#formEditData #vehicleID').val(null)
                        
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
                                var upkeepsList = $.parseJSON(data)
                                if(upkeepsList['events'].length > 0){
                                    $.each(upkeepsList['events'], function(index, elem){
    
                                        $("#formEditData #tableBody").append(
                                            '<tr>' +
                                                '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                                                '<td>'+ elem.name  + '</td>' +
                                            '</tr>'
                                        )
                                    })
                                }
                            }
                        })
                        
                        $('#modal-edit-event-garage').modal('show');
                break;
                case '10':
                        $('#modal-show-anniversary #recordatoryEventID').val(calEvent.id)
                        $('#modal-show-anniversary #name').val(calEvent.title)   
                        
                        var start = moment(calEvent.start2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                        var startDate = start[0]
                        var startTime = start[1]
                        $('#modal-show-anniversary #startDate').val(startDate)
                        $('#modal-show-anniversary #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"))
            
                        var end = moment(calEvent.end2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                        var endDate = end[0]
                        var endTime = end[1]
                        $('#modal-show-anniversary #endDate').val(endDate)
                        $('#modal-show-anniversary #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"))

                        $('#modal-show-anniversary #goExpedient').attr("isTPV", calEvent.tpv);
                        $('#modal-show-anniversary #goExpedient').attr("expedient", calEvent.expedientID);

                        $('#modal-show-anniversary').modal('show')
                break;
                default:
                    $('#formEditEvent #eventID').val(calEvent.id)
                    $('#formEditEvent #name').val(calEvent.title)
                    
        
                    var start = moment(calEvent.start2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                    var startDate = start[0]
                    var startTime = start[1]
        
                    $('#formEditEvent #startDate').val(startDate)
                    $('#formEditEvent #startTime').val(moment(startTime, "HH:mm:ss").format("HH:mm"))
                    
                    var end = moment(calEvent.end2).format("DD/MM/YYYY HH:mm:ss").split(" ")
                    var endDate = end[0]
                    var endTime = end[1]
        
                    $('#formEditEvent #endDate').val(endDate)
                    $('#formEditEvent #endTime').val(moment(endTime, "HH:mm:ss").format("HH:mm"))
        
                    if(startTime == "00:00:00" && endTime == "23:59:59"){
                        $('#formEditEvent #allDay').iCheck('check')
                    }else{
                        $('#formEditEvent #allDay').iCheck('uncheck')
                    }
        
                    $('#formEditEvent #status').val(calEvent.statusID)
                    $('#formEditEvent .status .fa-circle').css('color', calEvent.backgroundColor)
                    $('#formEditEvent #reminder').prop('checked', parseInt(calEvent.reminder));
                    $('#formEditEvent #allDay').prop('checked', parseInt(calEvent.allDay));
                    if(parseInt(calEvent.allDay)){
                        $("#formEditEvent #endDate").prop('disabled', true);
                        $("#formEditEvent #startTime").prop('disabled', true);
                        $("#formEditEvent #endTime").prop('disabled', true);
                    }else{
                        $("#formEditEvent #endDate").prop('disabled', false);
                        $("#formEditEvent #endTime").prop('disabled', false);
                        $("#formEditEvent #startTime").prop('disabled', false);
                    }
                    $('#formEditEvent #user').val(calEvent.userName)
                    if(calEvent.mailSend == 1){
                        $('#formEditEvent #reminderEmailSection').removeClass('hide')
                        
                        $('#formEditEvent #reminderEmail').prop('checked', true)

                        var date = moment(calEvent.mailDate, 'X').format('DD/MM/YYYY')
                        var time = moment(calEvent.mailDate, 'X').format('HH:mm')
                        $('#formEditEvent #reminderDate').val(date)
                        $('#formEditEvent #reminderTime').val(time)
                        $('#formEditEvent #reminderSendTo').val(calEvent.mailTo)
                    }else{
                        $('#formEditEvent #reminderEmailSection').addClass('hide')
                        $('#formEditEvent #reminderEmail').prop('checked', false)
                    }

                    $('#modal-edit-event').modal('show')
                    break;
            }

        },
        editable: false,
        droppable: false,
        lazyFetching : true
    })

    //--------------------CARGAMOS EL CALENDARIO------------------------------//
    if(window.location.search != ""){
        var search = window.location.search
        search = search.split('&')
        var month = parseInt(search[0].split('=')[1]) - 1
        var year = decodeURI(search[1].split('=')[1])        
        $('#calendar').fullCalendar('gotoDate', new Date(year, month, 1))
    }

    //------------------------------------CREAR EVENTO NUEVO------------------------------//

    $('#formNewEvent #status').on('change', function () {
        switch($(this).val()){
            case '1':
                $('#formNewEvent .status .fa-circle').css('color', '#0080FF')
            break
            case '2':
                $('#formNewEvent .status .fa-circle').css('color', '#DF0101')
            break
            case '3':
                $('#formNewEvent .status .fa-circle').css('color', '#F7D358')
            break
            case '4':
                $('#formNewEvent .status .fa-circle').css('color', '#088A08')
            break
        }
    });  

    $('#formNewEvent #allDay').on('change', function () {
        var checkAllDay = $(this).prop('checked');
        if(checkAllDay){
            $("#formNewEvent #endDate").val($("#formNewEvent #startDate").val());
            $("#formNewEvent #endDate").prop('disabled', true);
            $("#formNewEvent #startTime").val('00:00');
            $("#formNewEvent #startTime").prop('disabled', true);
            $("#formNewEvent #endTime").val('23:59');
            $("#formNewEvent #endTime").prop('disabled', true);
        }else{
            $("#formNewEvent #endDate").prop('disabled', false);
            $("#formNewEvent #endTime").prop('disabled', false);
            $("#formNewEvent #startTime").prop('disabled', false);
        }
    });

    $('#formNewEvent #reminderEmail').change(function(){
        if($(this).prop('checked')){
            $('#formNewEvent #reminderEmailSection').removeClass('hide')
        }else{
            $('#formNewEvent #reminderEmailSection').addClass('hide')
        }
    })

    //------------------------------------GUARDAR EVENTO NUEVO------------------------------------//
    $("#saveNewEvent").click(function(){
        var validate = 0
        var allDay = $("#formNewEvent #allDay").prop('checked');
        var reminder = $("#formNewEvent #reminder").prop('checked');

        if(isEmpty($("#formNewEvent #startDate"))){
            validate++
        }

        if(isEmpty($("#formNewEvent #endDate"))){
            validate++
        }

        if(!isEmpty($("#formNewEvent #startDate")) && !isEmpty($("#formNewEvent #endDate"))){
            if(compareDates($("#formNewEvent #startDate").val(), $("#formNewEvent #endDate").val()) > 0){
                $("#formNewEvent #endDate").val($("#formNewEvent #startDate").val())
            }
        }

        if(!allDay){
            if(isEmpty($("#formNewEvent #startTime"))){
                validate++
            }
            if(isEmpty($("#formNewEvent #endTime"))){
                validate++
            }
        }

        if(isEmpty($("#formNewEvent #name"))){
            validate++
        }
        if(isEmpty($("#formNewEvent #status"))){
            validate++  
        }

        if($('#formNewEvent #reminderEmail').prop('checked')){
            if(isEmpty($("#formNewEvent #reminderDate"))){
                validate++  
            }
            if(isEmpty($("#formNewEvent #reminderTime"))){
                validate++  
            }
            if(isEmpty($("#formNewEvent #reminderSendTo"))){
                validate++  
            }
        }
        
        if(validate == 0){
            var startDate = moment($("#formNewEvent #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formNewEvent #startTime").val()

            var endDate = moment($("#formNewEvent #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formNewEvent #endTime").val()

            var name = $("#formNewEvent #name").val()
            var description = $("#formNewEvent #description").val()
            var status = $("#formNewEvent #status").val()

            var cremation = 0

            if(!allDay){
                if(isEmpty($("#formNewEvent #startTime"))){
                    validate++
                }
                if(isEmpty($("#formNewEvent #endTime"))){
                    validate++
                }
                var compareT = compareTimes(startTime, endTime)
                if(compareT == 0){
                    endTime = endTime + ':01'
                }else if(compareT == 1){
                    $("#formNewEvent #endTime").val($("#formNewEvent #startTime").val())
                    endTime = $("#formNewEvent #endTime").val() + ':01'
                }
            }else{
                startTime = "00:00:00";
                endTime = "23:59:59";
            }
            
            start = startDate + " " + startTime;
            end = endDate + " " + endTime;

            var reminderEmail = $("#formNewEvent #reminderEmail").prop('checked')
            if(reminderEmail){
                var reminderDate = moment($("#formNewEvent #reminderDate").val() + ' ' + $("#formNewEvent #reminderTime").val(), 'DD/MM/YYYY HH:mm').format('X')
                var reminderSendTo = $("#formNewEvent #reminderSendTo").val()
            }else{
                var reminderDate = 'null'
                var reminderSendTo = ''
            }

            $.ajax({
                url: uri + "core/events/create.php",
                method: 'POST',
                data: {
                    start: start,
                    end: end,
                    name: name,
                    description: description,
                    reminder: reminder,
                    status: status,
                    cremation: cremation,
                    type: 4, 
                    allDay: allDay,
                    reminderEmail: reminderEmail,
                    reminderDate: reminderDate,
                    reminderSendTo: reminderSendTo
                },
                success: function(data){
                    if(data){
                        $('#calendar').fullCalendar('prev')
                        $('#calendar').fullCalendar('next')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
    
            // Se oculta la ventana modal
            $('#modal-new-event').modal('hide');
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }else{
            $('#modal-new-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-event #warning-message').empty()
            }, 3500)
        }
    });
    //------------------------------------EDITAR EVENTO
    
    $('#formEditEvent #status').on('change', function () {
        switch($(this).val()){
            case '1':
                $('#formEditEvent .status .fa-circle').css('color', '#0080FF')
                break
            case '2':
                $('#formEditEvent .status .fa-circle').css('color', '#DF0101')
                break
            case '3':
                $('#formEditEvent .status .fa-circle').css('color', '#F7D358')
                break
            case '4':
                $('#formEditEvent .status .fa-circle').css('color', '#088A08')
                break
        }
    });

    $('#formEditEvent #allDay').on('change', function () {
        var checkAllDay = $(this).prop('checked');
        if(checkAllDay){
            $("#formEditEvent #endDate").val($("#formEditEvent #startDate").val());
            $("#formEditEvent #endDate").prop('disabled', true);
            $("#formEditEvent #startTime").val('00:00');
            $("#formEditEvent #startTime").prop('disabled', true);
            $("#formEditEvent #endTime").val('23:59');
            $("#formEditEvent #endTime").prop('disabled', true);
        }else{
            $("#formEditEvent #endDate").prop('disabled', false);
            $("#formEditEvent #endTime").prop('disabled', false);
            $("#formEditEvent #startTime").prop('disabled', false);
        }
    });

    $('#formEditEvent #reminderEmail').change(function(){
        if($(this).prop('checked')){
            $('#formEditEvent #reminderEmailSection').removeClass('hide')
        }else{
            $('#formEditEvent #reminderEmailSection').addClass('hide')
        }
    })

    //------------------------------------GUARDAR EDITAR EVENTO
    $('#saveEditEvent').click(function(){        
        var validate = 0
        var allDay = $("#formEditEvent #allDay").prop('checked');
        var reminder = $("#formEditEvent #reminder").prop('checked');

        if(isEmpty($("#formEditEvent #startDate"))){
            validate++
        }

        if(isEmpty($("#formEditEvent #endDate"))){
            validate++
        }

        if(!isEmpty($("#formEditEvent #startDate")) && !isEmpty($("#formEditEvent #endDate"))){
            if(compareDates($("#formEditEvent #startDate").val(), $("#formEditEvent #endDate").val()) > 0){
                $("#formEditEvent #endDate").val($("#formEditEvent #startDate").val())
            }
        }

        if(allDay){
            if(isEmpty($("#formEditEvent #startTime"))){
                validate++
            }
            if(isEmpty($("#formEditEvent #endTime"))){
                validate++
            }
        }

        if(isEmpty($("#formEditEvent #name"))){
            validate++
        }
        if(isEmpty($("#formEditEvent #status"))){
            validate++  
        }

        if($('#formEditEvent #reminderEmail').prop('checked')){
            if(isEmpty($("#formEditEvent #reminderDate"))){
                validate++  
            }
            if(isEmpty($("#formEditEvent #reminderTime"))){
                validate++  
            }
            if(isEmpty($("#formEditEvent #reminderSendTo"))){
                validate++  
            }
        }

        if(validate == 0){
            var eventID = $("#formEditEvent #eventID").val()

            var startDate = moment($("#formEditEvent #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formEditEvent #startTime").val()

            var endDate = moment($("#formEditEvent #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formEditEvent #endTime").val()

            var name = $("#formEditEvent #name").val()
            var status = $("#formEditEvent #status").val()           
            var cremation = 0

            if(allDay == 0){
                var compareT = compareTimes(startTime, endTime)
                if(compareT == 0){
                    endTime = endTime + ':01'
                }else if(compareT == 1){
                    $("#formEditEvent #endTime").val($("#formEditEvent #startTime").val())
                    endTime = $("#formEditEvent #endTime").val() + ':01'
                }
            }else{
                startTime = "00:00:00";
                endTime = "23:59:59";
            }

            start = startDate + " " + startTime;
            end = endDate + " " + endTime;

            var reminderEmail = $("#formEditEvent #reminderEmail").prop('checked')
            if(reminderEmail){
                var reminderDate = moment($("#formEditEvent #reminderDate").val() + ' ' + $("#formEditEvent #reminderTime").val(), 'DD/MM/YYYY HH:mm').format('X')
                var reminderSendTo = $("#formNewEvent #reminderSendTo").val()
            }else{
                var reminderDate = 'null'
                var reminderSendTo = ''
            }            

            $.ajax({
                url : uri + "core/events/update.php",
                method : 'POST',
                data : {
                    event: eventID,
                    start : start,
                    end : end,
                    name : name,
                    reminder : reminder,
                    allDay : allDay,
                    status : status,
                    cremation : cremation,
                    type : 4,
                    reminderEmail: reminderEmail,
                    reminderDate: reminderDate,
                    reminderSendTo: reminderSendTo
                },
                success : function(data){
                    if(data){
                        $('#calendar').fullCalendar('prev')
                        $('#calendar').fullCalendar('next')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El evento se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
    
            // Se oculta la ventana modal
            $('#modal-edit-event').modal('hide');
        }else{
            $('#modal-edit-event #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-event #warning-message').empty()
            }, 3500)
        }
    })

    //------------------------------------GUARDAR EDITAR EVENTO TALLER
    $('#saveEditEventGarage').click(function(){
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
            var status = $("#formEditData #status").val();
            var reminder = 0;
            if($('#formEditData #reminder').prop("checked") == true){
                reminder = 1;
            }else{
                reminder = 0;
            }
                    
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
            $('#modal-edit-event-garage').modal('hide');

            // Actualiza el calendario
            $('#calendar').fullCalendar('refetchEvents');
        }
    });

    //------------------------------------CREAR CREMACIÓN NUEVO
    $('#expedient').change(function(){
        if($(this).val() != null){
            var expedientID = $(this).val()
            $('#modal-choose-expedient').modal('hide')
    
            $('#expedientID').val(expedientID)

            $.ajax({
                url : uri + 'core/expedients/expedient/functions.php',
                method : 'POST',
                data : {
                    type : 'getInfo',
                    expedient : expedientID
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewCremation #name').val(data.deceasedName + ' ' + data.deceasedSurname + ' - ' + data.number)
                    $('#formNewCremation #deceasedName').val(data.deceasedName)
                    $('#formNewCremation #deceasedSurname').val(data.deceasedSurname)
                    $('#formNewCremation #deceasedNIF').val(data.deceasedNIF)
                    $('#formNewCremation #number').val(data.number)
                    $('#formNewCremation #familyContactName').val(data.familyContactName)
                    $('#formNewCremation #familyContactSurname').val(data.familyContactSurname)
                    $('#formNewCremation #familyContactPhone').val(data.familyContactPhone)
                }
            })

            $.ajax({
                url : uri + 'core/users/functions2.php',
                method : 'POST',
                data : {
                    type : 'getInfo'
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewCremation #user').val(data.name + ' ' + data.surname)
                }
            })

            $('#modal-new-cremation').modal('show')
        }
    })
    $('#formNewCremation #cremationServiceProvince').append($('<option selected/>').val('').text('Selecciona una provincia'));
    $('#formNewCremation #cremationServiceLocation').append($('<option selected/>').val('').text('Selecciona una localidad'));
    var provincesList = getProvinces();
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewCremation #cremationServiceProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewCremation #cremationServiceProvince').change(function(){
        $('#formNewCremation #cremationServiceLocation').attr('disabled', false);

        var province = $('#formNewCremation #cremationServiceProvince').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewCremation #cremationServiceLocation').select2({
            language: langSelect2,
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
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
    })

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

    $('#crematorium').select2({
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

    $('#crematoriumEdit').select2({
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

    $('.client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/funeralHomes/data.php', //'core/clients/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
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
    $('#formNewCremation #client').on('select2:select', function () {
        var funeralHomeID = $(this).val();        
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formNewCremation #cif').val(data[0].nif);
            $('#formNewCremation #phone').val(data[0].phones);
            $('#formNewCremation #contactPerson').val(data[0].person);
            $('#formNewCremation #crematoriumContactPhonePerson').val(data[0].phones);                  
        });
        
    });

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
                            text: item.name+" "+item.surname,
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

    $('#formNewCremation .status .fa-circle').css('color', '#f47d42')
    $('#formNewCremation #status').change(function(){
        switch($(this).val()){
            case '6':
                $('#formNewCremation .status .fa-circle').css('color', '#f47d42')
            break
            case '7':
                $('#formNewCremation .status .fa-circle').css('color', '#614126')
            break
        }
    })

    $('#formNewCremation #startDate').change(function(){
        if($(this).val() == ''){
            $('#formNewCremation #endDate').attr('disabled', true)
            $('#formNewCremation #endDate').val('')
            $('#formNewCremation #startTime').attr('disabled', true)
            $('#formNewCremation #startTime').val('')
            $('#formNewCremation #endTime').attr('disabled', true)
            $('#formNewCremation #endTime').val('')
        }else{
            $('#formNewCremation #startTime').attr('disabled', false)
        }
    })

    $('#formNewCremation #startTime').change(function(){
        if($(this).val() == ''){
            $('#formNewCremation #endDate').attr('disabled', true)
            $('#formNewCremation #endDate').val('')
            $('#formNewCremation #endTime').attr('disabled', true)
            $('#formNewCremation #endTime').val('')
        }else{
            $('#formNewCremation #endDate').attr('disabled', false)
            $('#formNewCremation #endTime').attr('disabled', false)

            var startDate = $('#formNewCremation #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formNewCremation #endDate').val(endDate)
            $('#formNewCremation #endTime').val(endTime)
        }
    })

    $('#formNewCremation #crematoriumIntroduction').change(function(){
        if($(this).prop('checked')){
            $('#formNewCremation #arriveFamilyTime').removeClass('hide')
        }else{
            $('#formNewCremation #arriveFamilyTime').addClass('hide')
        }
    })

    $('#formNewCremation #expedient').change(function(){
        if($(this).val() != null){
            var expedientID = $(this).val()
            $('#modal-choose-expedient').modal('hide')
    
            $('#expedientID').val(expedientID)

            $.ajax({
                url : uri + 'core/expedients/expedient/functions.php',
                method : 'POST',
                data : {
                    type : 'getInfo',
                    expedient : expedientID
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewCremation #name').val(data.deceasedName + ' ' + data.deceasedSurname + ' - ' + data.number)
                    $('#formNewCremation #deceasedName').val(data.deceasedName)
                    $('#formNewCremation #deceasedSurname').val(data.deceasedSurname)
                    $('#formNewCremation #deceasedNIF').val(data.deceasedNIF)
                    $('#formNewCremation #number').val(data.number)
                    $('#formNewCremation #familyContactName').val(data.familyContactName)
                    $('#formNewCremation #familyContactSurname').val(data.familyContactSurname)
                    $('#formNewCremation #familyContactPhone').val(data.familyContactPhone)
                }
            })

            $.ajax({
                url : uri + 'core/users/functions2.php',
                method : 'POST',
                data : {
                    type : 'getInfo'
                },
                success : function(data){
                    data = $.parseJSON(data)

                    $('#formNewCremation #user').val(data.name + ' ' + data.surname)
                }
            })

            $('#modal-new-cremation').modal('show')
        }
    })

    //------------------------------------GUARDAR NUEVA CREMACIÓN
    $('#saveNewCremation').click(function(){
        var validate = 0

        if($("#formNewCremation #crematoriumContactPhonePerson").val() != ""){
            if(!isPhone($("#formNewCremation #crematoriumContactPhonePerson"))){
                validate++;
            }
        }
        if($("#formNewCremation #authContactPhone").val() != ""){
            if(!isPhone($("#formNewCremation #authContactPhone"))){
                validate++;
            }
        }
        if(isEmpty($('#formNewCremation #startDate'))){
            validate++
        }
        if(!isEmpty($("#formNewCremation #startDate")) && !isEmpty($("#formNewCremation #endDate"))){
            if(compareDates($('#formNewCremation #startDate').val(), $('#formNewCremation #endDate').val()) > 0){
                $("#formNewCremation #endDate").val($("#formNewCremation #startDate").val())
            }
        }
        if(isEmpty($('#formNewCremation #endDate'))){
            validate++
        }
        if(isEmpty($('#formNewCremation #startTime'))){
            validate++
        }
        if(isEmpty($('#formNewCremation #endTime'))){
            validate++
        }
        if(isEmpty($('#formNewCremation #client'))){
            validate++
        }
        if($("#formNewCremation #phone").val() != ""){
            if(!isPhone($("#formNewCremation #phone"))){
                validate++;
            }
        }
        if($("#formNewCremation #familyContactPhone").val() != ""){
            if(!isPhone($("#formNewCremation #familyContactPhone"))){
                validate++;
            }
        }
        if($("#formNewCremation #authDni").val() != ""){
            if(!isNifCif($("#formNewCremation #authDni"))){
                validate++;
            }
        }

        if(validate == 0){
            var reminder = $('#formNewCremation #reminder').prop('checked')
            var expedient = $('#formNewCremation #expedientID').val()
            var crematorium = $('#formNewCremation #crematorium').val()
            var startDate = $('#formNewCremation #startDate').val()
            var endDate = $('#formNewCremation #endDate').val()
            var startTime = $('#formNewCremation #startTime').val()
            var endTime = $('#formNewCremation #endTime').val()
            var compareT = compareTimes(startTime, endTime)
            if(compareT == 0){
                endTime = endTime + ':01'
            }else if(compareT == 1){
                $("#formNewCremation #endTime").val($("#formNewCremation #startTime").val())
                endTime = $("#formNewCremation #endTime").val() + ':01'
            }
            var start = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD") + " " + startTime
            var end = moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD") + " " + endTime
            var name = $('#formNewCremation #name').val()
            var user = $('#formNewCremation #user').val()
            var state = $('#formNewCremation #status').val()
            var client = $('#formNewCremation #client').val()
            var contactPerson = $('#formNewCremation #contactPerson').val()
            var contactPersonPhone = $('#formNewCremation #phone').val()
            var familyContactName = $('#formNewCremation #familyContactName').val()
            var familyContactSurname = $('#formNewCremation #familyContactSurname').val()
            var familyContactPhone = $('#formNewCremation #familyContactPhone').val()
            var crematoriumArriveTime = $('#formNewCremation #crematoriumArriveTime').val()
            var cremationServiceLocation = $('#formNewCremation #cremationServiceLocation').val()
            var ecologicCoffin = $('#formNewCremation #ecologicCoffin').val()
            var introduction
            $('#formNewCremation #crematoriumIntroduction').prop('checked') ? introduction = 1 : introduction = 0
            var waitOnRoom
            $('#formNewCremation #crematoriumWaitOnRoom').prop('checked') ? waitOnRoom = 1 : waitOnRoom = 0
            var vaseBio
            $('#formNewCremation #crematoriumVaseBio').prop('checked') ? vaseBio = 1 : vaseBio = 0
            var authName = $('#formNewCremation #authName').val()
            var authDni = $('#formNewCremation #authDni').val()
            var authDate = $('#formNewCremation #authDate').val() == '' ? null : moment($('#formNewCremation #authDate').val(), 'DD/mm/YYYY').format('X')
            var authTime = $('#formNewCremation #authTime').val() == '' ? null : moment($('#formNewCremation #authTime').val(), 'HH:mm').format('X')
            var authPlace = $('#formNewCremation #authPlace').val()
            var crematoriumContactPhonePerson = $("#formNewCremation #crematoriumContactPhonePerson").val() 
            var authContactPhone = $("#formNewCremation #authContactPhone").val() 

            var crematoriumTechnical = $('#formNewCremation #crematoriumTechnical').val()
            var crematoriumPacemaker
            $('#formNewCremation #crematoriumPacemaker').prop('checked') ? crematoriumPacemaker = 1 : crematoriumPacemaker = 0

            // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORA
            var validate = true
        
            var crematoriumEntry = moment($('#formNewCremation #startDate').val() + ' ' + $('#formNewCremation #startTime').val(), 'DD/MM/YYYY HH:mm').format('X')
            var crematoriumLeaving = moment($('#formNewCremation #endDate').val() + ' ' + endTime, 'DD/MM/YYYY HH:mm').format('X')

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
                        reminder : reminder,
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
                        crematoriumTechnical: crematoriumTechnical,
                        crematoriumPacemaker: crematoriumPacemaker,
                        ecologicCoffin : ecologicCoffin,
                        authContactPhone : authContactPhone,
                        crematoriumContactPhonePerson : crematoriumContactPhonePerson

                    },
                    success : function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cremación se ha añadido con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    },
                    error : function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
                
                $('#calendar').fullCalendar('prev')
                $('#calendar').fullCalendar('next')
                
                $('#modal-new-cremation').modal('hide')
            }
        }else{
            $('#modal-new-cremation #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-cremation #warning-message').empty()
            }, 3500)
        }
    });

    //------------------------------------EDITAR CREMACIÓN
    $('#formEditCremation #cremationServiceProvince').append($('<option selected/>').val('').text('Selecciona una provincia'));
    $('#formEditCremation #cremationServiceLocation').append($('<option selected/>').val('').text('Selecciona una localidad'));
    var provincesList = getProvinces();
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formEditCremation #cremationServiceProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formEditCremation #cremationServiceProvince').change(function(){
        $('#formEditCremation #cremationServiceLocation').attr('disabled', false);

        var province = $('#formEditCremation #cremationServiceProvince').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formEditCremation #cremationServiceLocation').select2({
            language: langSelect2,
            //placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
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
    })

    $('#formEditCremation #startDate').change(function(){
        if($(this).val() == ''){
            $('#formEditCremation #endDate').attr('disabled', true)
            $('#formEditCremation #endDate').val('')
            $('#formEditCremation #startTime').attr('disabled', true)
            $('#formEditCremation #startTime').val('')
            $('#formEditCremation #endTime').attr('disabled', true)
            $('#formEditCremation #endTime').val('')
        }else{
            $('#formEditCremation #startTime').attr('disabled', false)
        }
    })

    $('#formEditCremation #startTime').change(function(){
        if($(this).val() == ''){
            $('#formEditCremation #endDate').attr('disabled', true)
            $('#formEditCremation #endDate').val('')
            $('#formEditCremation #endTime').attr('disabled', true)
            $('#formEditCremation #endTime').val('')
        }else{
            $('#formEditCremation #endDate').attr('disabled', false)
            $('#formEditCremation #endTime').attr('disabled', false)

            var startDate = $('#formEditCremation #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formEditCremation #endDate').val(endDate)
            $('#formEditCremation #endTime').val(endTime)
        }
    })

    $('#formEditCremation #client').on('select2:select', function () {
        var funeralHomeID = $(this).val();     
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formEditCremation #cif').val(data[0].nif);
            $('#formEditCremation #phone').val(data[0].phones);
           
            if(datos.clientID == funeralHomeID){
                if(datos.crematoriumContactPerson == null){
                    $('#formEditCremation #contactPerson').val(data[0].person);
                }else{
                    $('#formEditCremation #contactPerson').val(datos.crematoriumContactPerson);
                }                          
                if(datos.crematoriumContactPhonePerson == null){
                    $('#formEditCremation #crematoriumContactPhonePerson').val(data[0].phones);
                }else{
                    $('#formEditCremation #crematoriumContactPhonePerson').val(datos.crematoriumContactPhonePerson);
                }  
            }else{
                $('#formEditCremation #contactPerson').val(data[0].person);
                $('#formEditCremation #crematoriumContactPhonePerson').val(data[0].phones);
            }            
        });
        
    });

    $('#formEditCremation .status .fa-circle').css('color', '#f47d42')
    $('#formEditCremation #status').change(function(){
        switch($(this).val()){
            case '6':
                $('#formEditCremation .status .fa-circle').css('color', '#f47d42')
            break
            case '7':
                $('#formEditCremation .status .fa-circle').css('color', '#614126')
            break
        }
    })

    $('#formEditCremation #startDate').change(function(){
        if($(this).val() == ''){
            $('#formEditCremation #endDate').attr('disabled', true)
            $('#formEditCremation #endDate').val('')
            $('#formEditCremation #startTime').attr('disabled', true)
            $('#formEditCremation #startTime').val('')
            $('#formEditCremation #endTime').attr('disabled', true)
            $('#formEditCremation #endTime').val('')
        }else{
            $('#formEditCremation #startTime').attr('disabled', false)
        }
    })

    $('#formEditCremation #startTime').change(function(){
        if($(this).val() == ''){
            $('#formEditCremation #endDate').attr('disabled', true)
            $('#formEditCremation #endDate').val('')
            $('#formEditCremation #endTime').attr('disabled', true)
            $('#formEditCremation #endTime').val('')
        }else{
            $('#formEditCremation #endDate').attr('disabled', false)
            $('#formEditCremation #endTime').attr('disabled', false)

            var startDate = $('#formEditCremation #startDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3.5 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formEditCremation #endDate').val(endDate)
            $('#formEditCremation #endTime').val(endTime)
        }
    })

    $('#formEditCremation #crematoriumIntroduction').change(function(){
        if($(this).prop('checked')){
            $('#formEditCremation #arriveFamilyTime').removeClass('hide')
        }else{
            $('#formEditCremation #arriveFamilyTime').addClass('hide')
        }
    })

    //------------------------------------GUARDAR EDITAR CREMACIÓN
    $('#saveEditCremation').click(function(){
        var validate = 0
        var allDay = $('#formEditCremation #allDay').prop('checked');

        if($("#formEditCremation #crematoriumContactPhonePerson").val() != ""){
            if(!isPhone($("#formEditCremation #crematoriumContactPhonePerson"))){
                validate++;
            }
        }
        if($("#formEditCremation #authContactPhone").val() != ""){
            if(!isPhone($("#formEditCremation #authContactPhone"))){
                validate++;
            }
        }
        
        if(isEmpty($("#formEditCremation #startDate"))){
            validate++
        }
        if(isEmpty($("#formEditCremation #endDate"))){
            validate++
        }
        if(!isEmpty($("#formEditCremation #startDate")) && !isEmpty($("#formEditCremation #endDate"))){
            if(compareDates(startDate, endDate) > 0){
                $("#formEditCremation #endDate").val($("#formEditCremation #startDate").val())
            }
        }
        if(allDay){
            if(isEmpty($("#formEditCremation #startTime"))){
                validate++
            }
            if(isEmpty($("#formEditCremation #endTime"))){
                validate++
            }
        }
        if(isEmpty($("#formEditCremation #status"))){
            validate++
        }
        if(isEmpty($('#formEditCremation #client'))){
            validate++
        }
        if($("#formEditCremation #phone").val() != ""){
            if(!isPhone($("#formEditCremation #phone"))){
                validate++;
            }
        }
        if($("#formEditCremation #familyContactPhone").val() != ""){
            if(!isPhone($("#formEditCremation #familyContactPhone"))){
                validate++;
            }
        }
        if($("#formEditCremation #authDni").val() != ""){
            if(!isNifCif($("#formEditCremation #authDni"))){
                validate++;
            }
        }

        if(validate == 0){
            var reminder = $('#formEditCremation #reminder').prop('checked');
            var eventID = $("#formEditCremation #eventID").val()
            var expedientID = $("#formEditCremation #expedientID").val()

            var startDate = moment($("#formEditCremation #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formEditCremation #startTime").val()
            
            var endDate = moment($("#formEditCremation #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formEditCremation #endTime").val()

            var compareT = compareTimes(startTime, endTime)
            if(compareT == 0){
                endTime = endTime + ':01'
            }else if(compareT == 1){
                $("#formEditCremation #endTime").val($("#formEditCremation #startTime").val())
                endTime = $("#formEditCremation #endTime").val() + ':01'
            }

            start = startDate + " " + startTime
            end = endDate + " " + endTime

            var name = $("#formEditCremation #name").val()
            var status = $("#formEditCremation #status").val()

            var client = $('#formEditCremation #client').val()
            var contactPerson = $('#formEditCremation #contactPerson').val()
            var contactPersonPhone = $('#formEditCremation #phone').val()
            var familyContactName = $('#formEditCremation #familyContactName').val()
            var familyContactSurname = $('#formEditCremation #familyContactSurname').val()
            var familyContactPhone = $('#formEditCremation #familyContactPhone').val()
            var crematoriumArriveTime = $('#formEditCremation #crematoriumArriveTime').val()
            var cremationServiceLocation = $('#formEditCremation #cremationServiceLocation').val();
            var ecologicCoffin = $('#formEditCremation #ecologicCoffin').prop('checked');
            var crematoriumIntroduction
            $('#formEditCremation #crematoriumIntroduction').prop('checked') ? crematoriumIntroduction = 1 : crematoriumIntroduction = 0
            var crematoriumWaitOnRoom
            $('#formEditCremation #crematoriumWaitOnRoom').prop('checked') ? crematoriumWaitOnRoom = 1 : crematoriumWaitOnRoom = 0
            var crematoriumVaseBio
            $('#formEditCremation #crematoriumVaseBio').prop('checked') ? crematoriumVaseBio = 1 : crematoriumVaseBio = 0

            var authName = $('#formEditCremation #authName').val()
            var authDni = $('#formEditCremation #authDni').val()
            var authDate = $('#formEditCremation #authDate').val() == '' ? null : moment($('#formEditCremation #authDate').val(), 'DD/mm/YYYY').format('X')
            var authTime = $('#formEditCremation #authTime').val() == '' ? null : moment($('#formEditCremation #authTime').val(), 'HH:mm').format('X')
            var authPlace = $('#formEditCremation #authPlace').val()
            var authContactPhone = $('#formEditCremation #authContactPhone').val()
            var crematoriumContactPhonePerson = $('#formEditCremation #crematoriumContactPhonePerson').val()

            var crematoriumTechnical = $('#formEditCremation #crematoriumTechnical').val()
            var crematoriumPacemaker
            $('#formEditCremation #crematoriumPacemaker').prop('checked') ? crematoriumPacemaker = 1 : crematoriumPacemaker = 0

            // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORAmatoriumLeavingDate').val() != '' && $('#crematoriumLeavingTime').val() != ''){
            var validate = true
    
            var crematoriumId = $('#formEditCremation #crematoriumEdit').val()
            var crematoriumEntry = moment($('#formEditCremation #startDate').val() + ' ' + $('#formEditCremation #startTime').val(), 'DD/MM/YYYY HH:mm').format('X')
            var crematoriumLeaving = moment($('#formEditCremation #endDate').val() + ' ' + endTime, 'DD/MM/YYYY HH:mm').format('X')

            var busy = checkCremationBusyEdit(crematoriumEntry, crematoriumLeaving, expedientID, crematoriumId)

            if(busy){
                validate = false

                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación para la fecha y hora seleccionadas</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
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
                        reminder : reminder,
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
                        crematoriumTechnical: crematoriumTechnical,
                        crematoriumPacemaker: crematoriumPacemaker,
                        expedientID : expedientID,
                        crematoriumContactPhonePerson : crematoriumContactPhonePerson,
                        authContactPhone : authContactPhone,
                        crematoriumId : crematoriumId
                    },
                    success : function(data){
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La cremación se ha añadido con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    },
                    error : function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
                
                $('#calendar').fullCalendar('prev')
                $('#calendar').fullCalendar('next')
                
                $('#modal-edit-cremation').modal('hide')
            }
        }else{
            $('#modal-edit-cremation #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-cremation #warning-message').empty()
            }, 3500)
        }
    })

    // CREMACIONES - ELIMINAR
    $('#deleteCremation').click(function(){
        var ID = $("#formEditCremation #eventID").val()

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
                            $('#calendar').fullCalendar('prev')
                            $('#calendar').fullCalendar('next')
    
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

            $('#modal-edit-cremation').modal('hide')
        }
    })

    //------------------------------------CREAR LIMPIEZA NUEVO
    
    //------------------------------GUARDAR NUEVA LIMPIEZA
    $('#formNewCleaning #allDay').on('change', function () {
        var checkAllDay = $(this).prop('checked');
        if(checkAllDay){
            $("#formNewCleaning #endDate").val($("#formNewCleaning #startDate").val());
            $("#formNewCleaning #endDate").prop('disabled', true);
            $("#formNewCleaning #startTime").val('00:00');
            $("#formNewCleaning #startTime").prop('disabled', true);
            $("#formNewCleaning #endTime").val('23:59');
            $("#formNewCleaning #endTime").prop('disabled', true);
        }else{
            $("#formNewCleaning #endDate").val('');
            $("#formNewCleaning #endDate").prop('disabled', false);
            $("#formNewCleaning #endTime").val('');
            $("#formNewCleaning #endTime").prop('disabled', false);
            $("#formNewCleaning #startTime").val('');
            $("#formNewCleaning #startTime").prop('disabled', false);
        }
    });
    $('#formNewCleaning #cleaningType').on('change', function () {
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
                        $("#formNewCleaning #name").val(data.name);           
                    }else{
                        $("#formNewCleaning #name").val('');   
                    }
                },            
            })        
        }else{
            $("#formNewCleaning #name").val('');   
        }
        
    });

    $("#saveNewCleaning").click(function(){
        var validate = 0

        if(isEmpty($("#formNewCleaning #startDate"))){
            validate++
        }

        if(isEmpty($("#formNewCleaning #endDate"))){
            validate++
        }

        if(!isEmpty($("#formNewCleaning #startDate")) && !isEmpty($("#formNewCleaning #endDate"))){
            if(compareDates($("#formNewCleaning #startDate").val(), $("#formNewCleaning #endDate").val()) > 0){
                $("#formNewCleaning #endDate").val($("#formNewCleaning #startDate").val())
            }
        }

        var allDay = $("#formNewCleaning #allDay").prop('checked')
        if(!allDay){
            if(isEmpty($("#formNewCleaning #startTime"))){
                validate++
            }
            if(isEmpty($("#formNewCleaning #endTime"))){
                validate++
            }
        }

        if(isEmpty($("#formNewCleaning #name"))){
            validate++
        }
        if(isEmpty($("#formNewCleaning #status"))){
            validate++  
        }

        if(validate == 0){
            var startDate = moment($("#formNewCleaning #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formNewCleaning #startTime").val()

            var endDate = moment($("#formNewCleaning #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formNewCleaning #endTime").val()

            if(!allDay){
                if(isEmpty($("#formNewCleaning #startTime"))){
                    validate++
                }
                if(isEmpty($("#formNewCleaning #endTime"))){
                    validate++
                }
                var compareT = compareTimes(startTime, endTime)
                if(compareT == 0){
                    endTime = endTime + ':01'
                }else if(compareT == 1){
                    $("#formNewCleaning #endTime").val($("#formNewCleaning #startTime").val())
                    endTime = $("#formNewCleaning #endTime").val() + ':01'
                }
            }else{
                startTime = "00:00:00";
                endTime = "23:59:59";
            }
            if(allDay){
                allDay = 1
            }else{
                allDay = 0
            }

            start = startDate + " " + startTime;
            end = endDate + " " + endTime;

            var name = $("#formNewCleaning #name").val()
            var status = 5

            var regularity = $('#formNewCleaning #regularity').val()

            var description = $("#formNewCleaning #description").val()
            
            var cremation = 0

            var cleaningType
            $("#formNewCleaning #cleaningType").val() != null ? cleaningType = $("#formNewCleaning #cleaningType").val() : 'null'
            var cleaningMortuary
            $("#formNewCleaning #cleaningMortuary").val() != null ? cleaningMortuary = $("#formNewCleaning #cleaningMortuary").val() : 'null'
            var cleaningUser
            $("#formNewCleaning #cleaningUser").val() != null ? cleaningUser = $("#formNewCleaning #cleaningUser").val() : 'null'

            var reminder = $("#formNewCleaning #reminder").prop('checked')
            if(reminder){
                reminder = 1
            }else{
                reminder = 0
            }
        }else{
            $('#modal-new-cleaning #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-cleaning #warning-message').empty()
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
                    reminder : reminder,
                    allDay: allDay,
                    cleaningType : cleaningType,
                    cleaningMortuary: cleaningMortuary,
                    cleaningUser : cleaningUser,
                    status: status,
                    cremation: cremation,
                    type: 2,
                    description: description
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La limpieza se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#calendar').fullCalendar('prev')
            $('#calendar').fullCalendar('next')
            
            $('#modal-new-cleaning').modal('hide')
        }else{
            $('#modal-new-cleaning #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-cleaning #warning-message').empty()
            }, 3500)
        }
    });

    //------------------------------------EDITAR LIMPIEZA
    //------------------------------------GUARDAR EDITAR LIMPIEZA
    $('#formEditCleaning #allDay').on('change', function () {
        var checkAllDay = $(this).prop('checked');
        if(checkAllDay){
            $("#formEditCleaning #endDate").val($("#formEditCleaning #startDate").val());
            $("#formEditCleaning #endDate").prop('disabled', true);
            $("#formEditCleaning #startTime").val('00:00');
            $("#formEditCleaning #startTime").prop('disabled', true);
            $("#formEditCleaning #endTime").val('23:59');
            $("#formEditCleaning #endTime").prop('disabled', true);
        }else{
            $("#formEditCleaning #endDate").val('');
            $("#formEditCleaning #endDate").prop('disabled', false);
            $("#formEditCleaning #endTime").val('');
            $("#formEditCleaning #endTime").prop('disabled', false);
            $("#formEditCleaning #startTime").val('');
            $("#formEditCleaning #startTime").prop('disabled', false);
        }
    });

    $('#formEditCleaning #cleaningType').on('change', function () {
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
                        $("#formEditCleaning #name").val(data.name);           
                    }else{
                        $("#formEditCleaning #name").val('');   
                    }
                },            
            })        
        }else{
            $("#formEditCleaning #name").val('');   
        }        
    });

    $('#saveEditCleaning').click(function(){
        var validate = 0

        if(isEmpty($("#formEditCleaning #startDate"))){
            validate++
        }

        if(isEmpty($("#formEditCleaning #endDate"))){
            validate++
        }

        if(!isEmpty($("#formEditCleaning #startDate")) && !isEmpty($("#formEditCleaning #endDate"))){
            if(compareDates($("#formEditCleaning #startDate").val(), $("#formEditCleaning #endDate").val()) > 0){
                $("#formEditCleaning #endDate").val($("#formEditCleaning #startDate").val())
            }
        }

        var allDay = $("#formEditCleaning #allDay").prop('checked')
        if(allDay == 0){
            if(isEmpty($("#formEditCleaning #startTime"))){
                validate++
            }
            if(isEmpty($("#formEditCleaning #endTime"))){
                validate++
            }
        }

        if(isEmpty($("#formEditCleaning #name"))){
            validate++
        }
        if(isEmpty($("#formEditCleaning #status"))){
            validate++
        }

        if(validate == 0){
            var eventID = $("#formEditCleaning #eventID").val()

            var startDate = moment($("#formEditCleaning #startDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var startTime = $("#formEditCleaning #startTime").val()
            
            var endDate = moment($("#formEditCleaning #endDate").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
            var endTime = $("#formEditCleaning #endTime").val()

            if(allDay == 0){
                var compareT = compareTimes(startTime, endTime)
                if(compareT == 0){
                    endTime = endTime + ':01'
                }else if(compareT == 1){
                    $("#formEditCleaning #endTime").val($("#formEditCleaning #startTime").val())
                    endTime = $("#formEditCleaning #endTime").val() + ':01'
                }
            }else{
                startTime = "00:00:00"
                endTime = "23:59:59"
            }
    
            start = startDate + " " + startTime
            end = endDate + " " + endTime
    
            var reminder = $('#formEditCleaning #reminder').prop('checked')
            var regularity = $('#formEditCleaning #regularity').val()
    
            var name = $("#formEditCleaning #name").val()
    
            var cleaningType
            $("#formEditCleaning #cleaningType").val() != null ? cleaningType = $("#formEditCleaning #cleaningType").val() : cleaningType = 'null'
            var cleaningMortuary
            $("#formEditCleaning #cleaningMortuary").val() != null ? cleaningMortuary = $("#formEditCleaning #cleaningMortuary").val() : cleaningMortuary = 'null'
            var cleaningUser
            $("#formEditCleaning #cleaningUser").val() != null ? cleaningUser = $("#formEditCleaning #cleaningUser").val() : cleaningUser = 'null'
            var description = $("#formEditCleaning #description").val()

            var status = 5

            if(allDay){
                allDay = 1
            }else{
                allDay = 0
            }
            if(reminder){
                reminder = 1
            }else{
                reminder = 0
            }

            $.ajax({
                url : uri + 'core/events/update.php',
                method : 'POST',
                data : {
                    event : eventID,
                    start : start,
                    end : end,
                    regularity : regularity,
                    name: name,
                    description : description,
                    reminder: reminder,
                    cleaningType : cleaningType,
                    cleaningMortuary: cleaningMortuary,
                    cleaningUser : cleaningUser,
                    status: status,
                    allDay: allDay
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La limpieza se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#calendar').fullCalendar('prev')
            $('#calendar').fullCalendar('next')
            
            $('#modal-edit-cleaning').modal('hide')
        }else{
            $('#modal-edit-cleaning #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-edit-cleaning #warning-message').empty()
            }, 3500)
        }
    });

    //Editar MODAL ITV-SEGURO
    // Estado del iCheck "Recordatorio"
    var reminder = 0;
    $('#formEditItvEvent #reminder').on('ifChanged', function(event){
        $('#formEditItvEvent #reminder').on('ifUnchecked', function(event){
            reminder = 0;
        });
        $('#formEditItvEvent #reminder').on('ifChecked', function(event){
            reminder = 1;
        });
    });

    $('#saveEditItv_InsEvent').click(function(){
        //Validaciones
        var validate = 0;     
        if(isEmpty($("#formEditItvEvent #status"))){
            validate++
        }
        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            // Recogida de datos del formulario
            var eventID = $("#formEditItvEvent #eventID").val()
            var start = moment($("#formEditItvEvent #startDate").val(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00'
            var status = $("#formEditItvEvent #status").val()
                
            $.post(uri + "core/garage/events/update.php", {event : eventID, start : start, status : status, reminder : reminder}, function(data){
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
            $('#modal-editItv_Ins-event').modal('hide');

            // Actualiza el calendario
            $('#calendar').fullCalendar('refetchEvents');
        }
    });
    
    var color = $('#formEditItvEvent #status option:selected').val();
    switch(color){
        case '1':
            $('#formEditItvEvent .status .fa-circle').css('color', '#0080FF')
        break
        case '4':
            $('#formEditItvEvent .status .fa-circle').css('color', '#088A08')
        break
    }    

    $('#formEditItvEvent #status').on('change', function () {
        switch($(this).val()){
            case '1':
                $('#formEditItvEvent .status .fa-circle').css('color', '#0080FF')
            break
            case '4':
                $('#formEditItvEvent .status .fa-circle').css('color', '#088A08')
            break
        }
        
    });
    
    //Modales. Acciones
    $('#modal-new-event').on('hidden.bs.modal', function (e) {
        $('#formNewEvent input').val('');
        $('#formNewEvent textarea').val('');
        $('#formNewEvent #allDay').prop('checked', false); 
        $("#formNewEvent select#status").val(1).trigger('change');
        //Limpiamos las validaciones
        clean('formNewEvent');
        $('#modal-edit-cleaning #warning-message').empty()
    });

    $('#modal-edit-event').on('hidden.bs.modal', function (e) {
        $('#formEditEvent input').val('');
        $('#formEditEvent textarea').val('');
        $('#formEditEvent #allDay').prop('checked', false); 
        $("#formEditEvent select#status").val(1).trigger('change');
        //Limpiamos las validaciones
        clean('formEditEvent');
        $('#modal-edit-event #warning-message').empty()
    });

    $('#modal-choose-expedient').on('hidden.bs.modal', function(){
        $('#formNewData #expedient').val('').trigger('change')
        $('#modal-choose-expedient #warning-message').empty()
    })

    $('#modal-new-cremation').on('hidden.bs.modal', function (e) {
        //Limpiamos las validaciones
        $('#formNewCremation input').val('')
        $('#formNewCremation #startDate').val('');
        $('#formNewCremation #endDate').val('');
        $('#formNewCremation #name').val('');
        $("#formNewCremation #status").val(1).trigger('change');
        $('#formNewCremation #reminder').prop('checked', false); 
        $('#formNewCremation #allDay').prop('checked', false); 
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)  
        $('#formNewCremation #crematorium').val('').trigger('change')
        $('#formNewCremation #crematoriumTechnical').val('').trigger('change')
        $('#formNewCremation #client').val('').trigger('change')
        clean('formNewCremation');
        $('#modal-new-cremation #warning-message').empty()
    });

    $('#modal-edit-cremation').on('hidden.bs.modal', function (e) {
        //Limpiamos las validaciones
        $('#formEditCremation input').val('')
        $('#formEditCremation #endDate').attr('disabled', false)
        $('#formEditCremation #startTime').attr('disabled', false)
        $('#formEditCremation #endTime').attr('disabled', false)
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)  
        $('#formEditCremation #crematorium').val('').trigger('change')
        $('#formEditCremation #crematoriumTechnical').val('').trigger('change')
        $('#formEditCremation #client').val('').trigger('change')
        clean('formEditCremation')
        $('#modal-edit-cremation #warning-message').empty()
    })

    $('#modal-edit-cleaning').on('hidden.bs.modal', function (e) {
        $('#formEditCleaning input').val('')  
        $('#formEditCleaning #reminder').prop('checked', false); 
        $('#formEditCleaning #allDay').prop('checked', false);      
        $('#formEditCleaning #regularity').val('').trigger('change')        
        $('#formEditCleaning #cleaningType').val('').trigger('change')
        $('#formEditCleaning #cleaningMortuary').val('').trigger('change')
        $('#formEditCleaning #cleaningUser').val('').trigger('change')
        clean('formEditCleaning')
        $('#modal-edit-cleaning #warning-message').empty()
    })

    $('#modal-new-cleaning').on('hidden.bs.modal', function (e) {
        //Limpiamos las validaciones
        $('#formNewCleaning input').val('')  
        $('#formNewCleaning #reminder').prop('checked', false); 
        $('#formNewCleaning #allDay').prop('checked', false);      
        $('#formNewCleaning #regularity').val('').trigger('change')        
        $('#formNewCleaning #cleaningType').val('').trigger('change')
        $('#formNewCleaning #cleaningMortuary').val('').trigger('change')
        $('#formNewCleaning #cleaningUser').val('').trigger('change')
        $('#formNewCleaning #description').val('').trigger('change')
        clean('formNewCleaning')
        $('#modal-new-cleaning #warning-message').empty()
    })

    // DELETE - Borrar un evento del calendario
    $('#deleteEvent').click(function(){
        if(confirm("¿Está seguro de que quiere borrar el evento!")){
            var eventID = $("#formEditEvent #eventID").val()

            $.ajax({
                url : uri + 'core/events/delete.php',
                method : 'POST',
                data : {
                    eventID : eventID
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La limpieza se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#calendar').fullCalendar('prev')
            $('#calendar').fullCalendar('next')
            
            $('#modal-edit-event').modal('hide');
        }
    });

    $('#deleteCleaning').click(function(){
        if(confirm("¿Está seguro de que quiere borrar el evento!")){
            var eventID = $("#formEditCleaning #eventID").val()

            $.ajax({
                url : uri + 'core/events/delete.php',
                method : 'POST',
                data : {
                    eventID : eventID
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La limpieza se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#calendar').fullCalendar('prev')
            $('#calendar').fullCalendar('next')
            
            $('#modal-edit-cleaning').modal('hide');
        }
    });

    // Finalizar evento - Estado "realizado"
    $('#closeCleaning').click(function(){
        $('#saveEditCleaning').click();
        // Recogida de datos del formulario
        var eventID = $("#formEditCleaning #eventID").val();
        var name = $("#formEditCleaning #name").val();
        var status = 4

        $.post(uri+"core/events/close.php", {eventID : eventID, status : status, name : name}, function(data){
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El mantenimiento se ha añadido con éxito.</div>');
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        });

        // Actualiza el calendario
        $('#calendar').fullCalendar('prev')
        $('#calendar').fullCalendar('next')

        // Se oculta la ventana modal
        $('#modal-edit-event').modal('hide');
    })

    // Finalizar evento y no crear otro - Estado "realizado"
    $('#closeDoneCleaning').click(function(){
        if(confirm('Ojo! Si finalizas este evento se cancela la periodicidad y no se puede recuperar. ¿Deseas continuar?')){
            // Recogida de datos del formulario
            var eventID = $("#formEditCleaning #eventID").val();   
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
    
            // Actualiza el calendario
            $('#calendar').fullCalendar('prev')
            $('#calendar').fullCalendar('next')
    
            // Se oculta la ventana modal
            $('#modal-edit-event').modal('hide');
        }
    })

    $('#formNewEvent #reminder').prop('checked', true);
    $('#formNewCremation #reminder').prop('checked', true);
    $('#formNewCleaning #reminder').prop('checked', true);

    // RECORDATORY ANNIVERSARY OBITUARIES
    $("#modal-show-anniversary #goExpedient").click(function(){
        var tpv = $(this).attr("isTPV");
        var expedient = $(this).attr("expedient");

        if(parseInt(tpv) == 1){
            window.open(uri+'editar-expediente-tpv/'+expedient)
        }else{
            window.open(uri+'editar-expediente/'+expedient)
        }
    })

    // DELETE - Borrar un evento del calendario
    $('#deleteEventRecordatory').click(function(){
        if(confirm("¿Está seguro de que quiere borrar el evento?")){
            var eventID = $("#modal-show-anniversary #recordatoryEventID").val()

            $.ajax({
                url : uri + 'core/events/delete.php',
                method : 'POST',
                data : {
                    eventID : eventID
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La limpieza se ha añadido con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
            
            $('#calendar').fullCalendar('prev')
            $('#calendar').fullCalendar('next')
            
            $('#modal-show-anniversary').modal('hide');
        }
    });
});