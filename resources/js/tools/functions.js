/**
 * Formats float number
 * 
 * @param {*} num Number
 */
function toFormatNumber(num){
    return num.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/**
 * Formats int number
 * 
 * @param {*} num Number
 */
function toFormatNumberNoDecimal(num){
    num = parseInt(num)
    return num.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/**
 * Compara dos fechas
 * 
 * @param {int} dateA Fecha
 * @param {int} dateB Fecha a comparar con
 * @return {int} Resultado de la comparación (-1 si A < B, 1 si A > B, 0 si A = B)
 */
function compareDates(dateA, dateB){
    if(dateA < dateB){
        return -1
    }else if(dateA > dateB){
        return 1
    }else{
        return 0
    }
}

/**
 * Compara dos horas
 * 
 * @param {string} timeA Hora
 * @param {string} timeB Hora a comparar con
 * @return {int} Resultado de la comparación (-1 si A < B, 1 si A > B, 0 si A = B)
 */
function compareTimes(timeA, timeB){
    if(timeA < timeB){
        return -1
    }else if(timeA > timeB){
        return 1
    }else{
        return 0
    }
}

/**
 * Obtiene el tipo de usuario que está loggueado
 * 
 * @return {int} Tipo de usuario
 */
function getUserType(){ //no
    var userType = null
    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getUserTypeID',
        },
        async: false,
        success: function(data){
            userType = $.parseJSON(data)
        }
    })
    return userType
}

// ------------------------- OPTIMIZACION CONSULTAS ----------------------

/**
 * Obtiene el número de tareas pendientes
 */
var contGarage = 0
var contNotices = 0
function getAllNotifications(){
    $.ajax({
        url: uri + "core/notifications/functions.php",
        data: {type: 'getAllNotifications'},
        type: 'POST',
        async: true,
        success: function(data){
            data = $.parseJSON(data)

            //Control de visitas
            $('#visitsControlData').empty()           
            if(data['getVisitsControlReminder'] == null){
                $('#visitsControlAmount').html('0')
                $('#visitsControlData').append('<li><a>No hay visitas pendientes</a></li>')
            }else{
                $('#visitsControlAmount').html(data['getVisitsControlReminder'].length)
                $('#visitsControlTitle').css('color', 'red')

                $.each(data['getVisitsControlReminder'], function(index, elem){
                    $('#visitsControlData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderVisits">X</button><a href="' + uri + 'control-de-visitas/visitas/'+ elem.ID +'">' + elem.number + ' - ' + elem.deceasedName +'</a></li>')
                })
            }

            //Eventos del calendario
            $('#eventsCalendarReminderData').empty()
            if(data['getEventCalendarReminder'] == null){
                $('#eventsCalendarReminderAmount').html('0')
                $('#eventsCalendarReminderData').append('<li><a>No hay eventos pendientes</a></li>')
            }else{
                $('#eventsCalendarReminderAmount').html(data['getEventCalendarReminder'].length)

                $.each(data['getEventCalendarReminder'], function(index, elem){
                    var start = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
                    var name = elem.name
                    var month = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('MM')
                    var year = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('YYYY')
                    //<i class="fa fa-circle-o text-red"></i>
                    $('#eventsCalendarReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminder">X</button><a href="' + uri + 'agenda/eventos?month=' + month + '&year=' + year + '">' + start + ' - ' + name + '</a></li>')
                })
            }

            //Cremaciones
            $('#eventsCremationReminderData').empty()
            if(data['getEventCremationReminder'] == null){
                $('#eventsCremationReminderAmount').html('0')
                $('#eventsCremationReminderData').append('<li><a>No hay cremaciones pendientes</a></li>')
            }else{
                $('#eventsCremationReminderAmount').html(data['getEventCremationReminder'].length)

                $.each(data['getEventCremationReminder'], function(index, elem){
                    var start = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
                    var name = elem.name
                    var month = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('MM')
                    var year = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('YYYY')
                    $('#eventsCremationReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderCremation">X</button><a href="' + uri + 'cremaciones?month=' + month + '&year=' + year + '">' + start + ' - ' + name + '</a></li>')
                })
            }

            //Manteminientos
            $('#eventsUpkeepReminderData').empty()
            if(data['getEventUpkeepReminder'] == null){
                $('#eventsUpkeepReminderAmount').html('0')
                $('#eventsUpkeepReminderData').append('<li><a>No hay mantenimientos pendientes</a></li>')
            }else{
                $('#eventsUpkeepReminderAmount').html(data['getEventUpkeepReminder'].length)

                $.each(data['getEventUpkeepReminder'], function(index, elem){
                    var start = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
                    var name = elem.name
                    var month = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('MM')
                    var year = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('YYYY')
                    $('#eventsUpkeepReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderUpkeep">X</button><a href="' + uri + 'mantenimiento/agenda?month=' + month + '&year=' + year + '">' + start + ' - ' + name + '</a></li>')
                })
            }

            //Agenda taller eventos            
            $('#eventsGarageReminderData').empty()
            if(data['getEventGarageReminder'] != null){
                contGarage = data['getEventGarageReminder'].length
                $('#eventsGarageReminderAmount').html(contGarage)

                $.each(data['getEventGarageReminder'], function(index, elem){
                    var car = elem.ID
                    var matricula = elem.licensePlate
                    var start = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY')
                    
                    if(parseInt(elem.type) == 8 || parseInt(elem.type) == 9){
                        var name ="Mantenimiento matrícula " + matricula;
                        $('#eventsGarageReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderGarage">X</button><a href="' + uri + 'taller/mantenimiento/'+ car +'">' + start + ' - ' + name + '</a><button type="button" class="btn btn-primary reminderGoTo" id="goTo' + index + '"><i class="fa fa-arrow-right" aria-hidden="true"></i></button></li>')
    
                        $('#goTo' + index).click(function(){
                            window.open(uri + 'taller/mantenimiento/' + elem.ID, '_blank');
                        })
                    }else{
                        var start = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY')
                        var name = elem.name;
                        var month = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('MM')
                        var year = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('YYYY')

                        $('#eventsGarageReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminder">X</button><a href="' + uri + 'agenda/eventos?month=' + month + '&year=' + year + '">' + start + ' - ' + name + '</a></li>')
                    }
                })
            }

            //ITV
            if(data['getEventItvReminder'] != null){                           
                contGarage  = contGarage + data['getEventItvReminder'].length
                $('#eventsGarageReminderAmount').html(contGarage)
                
                $.each(data['getEventItvReminder'], function(index, elem){     
                              
                    var start = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY')
                    var name = elem.name
                    var month = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('MM')
                    var year = moment(elem.start, 'YYYY/MM/DD HH:mm:ss').format('YYYY')
                    $('#eventsGarageReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderGarage">X</button><a href="' + uri + 'taller/agenda?month=' + month + '&year=' + year + '">' + start + ' - ' + name + '</a></li>')
                })
            }

            if($("#eventsGarageReminderData li").length == 0){
                $('#eventsGarageReminderData').append('<li><a>No hay notificaciones de taller pendientes</a></li>')
            }

            //Almacen y stock
            $('#stockReminderData').empty()
            if(data['getStockReminder'] == null){
                $('#stockReminderAmount').html('0')
                $('#stockReminderData').append('<li><a>No hay notificaciones de almacén</a></li>')
            }else{
                $('#stockReminderAmount').html(data['getStockReminder'].length)

                $.each(data['getStockReminder'], function(index, elem){
                    var store = elem.mortuaryName
                    var product = elem.productName
                    var model = elem.modelName
                    var warehouse = elem.mortuaryID
                    var id = elem.ID                    
                    $('#stockReminderData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderStock">X</button><a href="' + uri + 'almacen/productos?warehouse=' + warehouse + '&name=' + store + '&id='+ id +'">(' + store + ') ' + product + ' - ' + model + '</a></li>')
                })
            }

            //Tareas pendientes
            $('#pendingTasksNumber').text(data['getPendingTasksNumber'])

            //Eventos
            $('#eventsNumber').text(data['getEvents'])

            //Eventos mantenimientos
            $('#eventsNumberUpkeep').text(data['getEventsUpkeep'])

            var currentTime = moment().format("HH:mm:ss")

            //Notificacion curas
            priestNotify = data['isPriestNotified']    
            $('#noticeData').empty()
            if(priestNotify == null){                
                $('#noticeAmount').html('0')               
            }else{  
                contNotices = priestNotify.length
                priestNotify.forEach(element => {
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Cura: ' + element.name  + '</a></li>')
                 
                    }else{
                        contNotices = contNotices - 1 
                    }                                                
                }); 
                $('#noticeAmount').html(contNotices) 
            } 

            //Notificar enterradores
            gravedigger = data['isGravediggerNotified']                         

            if(gravedigger != null){
                contNotices = contNotices + gravedigger.length            
                gravedigger.forEach(element => {  
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Enterrador: ' + element.name  + '</a></li>')                        
                    }else{
                        contNotices = contNotices - 1 
                    }                    
                });  
                $('#noticeAmount').html(contNotices)
            }  

            //Porteadores
            carrier = data['isCarrierNotified']
            if(carrier != null){
                contNotices = contNotices + carrier.length                
                carrier.forEach(element => { 
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Porteador: ' + element.name  + '</a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                             
                });  
                $('#noticeAmount').html(contNotices)
            }   

            //Coro
            choir = data['isChoirNotified']
            if(choir != null){
                contNotices = contNotices + choir.length
                
                choir.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Coro: ' + element.name  + '</a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)
            }

            //Campaneros
            bellringer = data['isBellringerNotified']
            if(bellringer != null){
                contNotices = contNotices + bellringer.length
                
                bellringer.forEach(element => { 
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Campanero: ' + element.name  + '</a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                             
                });  
                $('#noticeAmount').html(contNotices)
            } 

            //Policía
            police = data['isPoliceNotified']
            if(police != null){                
                contNotices = contNotices + police.length                
                police.forEach(element => { 
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Policía </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                             
                });  
                $('#noticeAmount').html(contNotices)             
            }

            //Web
            web = data['isWebNotified']
            if(web != null){                
                contNotices = contNotices + web.length                
                web.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Página Web no confirmada </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            } 

            //Acta preparacion
            preparation = data['isPreparationNotified']
            if(preparation != null){                
                contNotices = contNotices + preparation.length                
                preparation.forEach(element => {
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Acta de preparación no confirmada </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            } 

            //Medicos
            doctor = data['isDoctorNotified']                   
            if(doctor != null){                
                contNotices = contNotices + doctor.length                
                doctor.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Certificado Médico no entregado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            }
            
            //Tribunal
            tribunal = data['isTribunalNotified']                  
            if(tribunal != null){                
                contNotices = contNotices + tribunal.length                
                tribunal.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Juzgado no entregado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            } 

            //Control
            control = data['isControlNotified']                 
            if(control != null){                
                contNotices = contNotices + control.length                
                control.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') Control no realizado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            } 
           
            //Recordatorios
            reminder = data['isReminderNotified']                     
            if(reminder != null){                
                contNotices = contNotices + reminder.length                
                reminder.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') PDF Recordatorio no creado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            } 

            //Flores
            flower = data['isFlowerNotified']                
            if(flower != null){                
                contNotices = contNotices + flower.length                
                flower.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') '+ element.product + ' '+ element.model+' no confirmado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            }

            //Buse
            bus = data['isBusNotified']                    
            if(bus != null){                
                contNotices = contNotices + bus.length                
                bus.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') '+ element.product + ' '+ element.model+' no confirmado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            }

            //Taxi
            taxi = data['isTaxiNotified'] 
            if(taxi != null){                
                contNotices = contNotices + taxi.length                
                taxi.forEach(element => {   
                    if(element.funeralTime > currentTime){
                        $('#noticeData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderNotice">X</button><a href="' + uri + 'expediente/cservicio' + (element.tpv == '1' ? '-tpv' : '') + '/'+ element.expedientID +'">(' + element.number + ') '+ element.product + ' '+ element.model+' no avisado </a></li>')
                    }else{
                        contNotices = contNotices - 1 
                    }                                           
                });  
                $('#noticeAmount').html(contNotices)             
            }

            if($('#noticeData li').length == 0){
                $('#noticeData').append('<li><a>No hay avisos pendientes</a></li>')
            }

            expedients = data['getExpedientStatusPendingInvoices']
            if(expedients == null){
                $('#expedientsAmount').html('0')
                $('#expedientsData').append('<li><a>No hay expedientes pendientes de facturar</a></li>')
            }else{
                $('#expedientsAmount').html(expedients.length)

                expedients.forEach(element => {                                   
                    $('#expedientsData').append('<li class="reminderItems"><button type="button" class="btn btn-danger reminderExpedients">X</button><a href="' + uri + 'editar-expediente' + (element.tpv == '1' ? '-tpv' : '') + '/' + element.expedientID +'">' + element.number + ' - ' + element.deceasedName +'</a></li>')
                })
            }

            // Notas de expediente
            expedientsNotes = data.expedientsNotes
            if(expedientsNotes == null){
                $('#expedientsNotesAmount').html('0')
                $('#expedientsNotesData').append('<li><a>No tienes menciones pendientes</a></li>')
            }else{
                $('#expedientsNotesAmount').html(expedientsNotes.length)

                var html = ''
                $.each(expedientsNotes, function(index, elem){
                    html += '<li class="expedientsNotesItems"><button type="button" class="btn btn-danger expedientsNotesExpedients">X</button><a class="go-expedient-note" note-id="' + elem.id + '" expedient-id="' + elem.expedientID + '" tpv="' + elem.tpv + '" section="' + elem.section + '" style="cursor:pointer;">Mención en <strong>' + (elem.section == '0' ? 'Contratación' : 'Control de Servicio') + '</strong> del expediente <strong>' + elem.number + '</strong></a></li>'
                })
                $('#expedientsNotesData').html(html)

                $('.go-expedient-note').click(function(){
                    var expedientNote = $(this).attr('note-id')
                    var goTpv = $(this).attr('tpv')
                    var goExpedientId = $(this).attr('expedient-id')
                    var section = $(this).attr('section')
                    $.ajax({
                        url: uri + 'core/expedients/notes/functions.php',
                        method: 'POST',
                        data: {
                            type: 'seenNote',
                            note: expedientNote
                        },
                        async: false,
                        success: function(){
                            window.location.href = uri + 'expediente/' + (section == '0' ? 'contratacion' : 'cservicio') + (goTpv == '1' ? '-tpv' : '') + '/' + goExpedientId + '#notesThreadSection'
                        }
                    })
                })
            }
        }
    })
}

function getUserId(){ //no
    var userId
    $.ajax({
        url: uri + 'core/users/functions2.php',
        method: 'POST',
        data: {
            type: 'getUserId'
        },
        async: false,
        success: function(data){
            try{
                userId = $.parseJSON(data)
            }catch{
                userId = null
            }
        }
    })
    return userId
}

function checkActivity(){
    sessionTimeCont = 0;
}

var sessionTimeCont = 0;

/**
 * Gets Iva label
 * 
 * @return {string} ivaLabel Iva label
 */
function getIvaLabel(){
    var ivaLabel = '-';

    switch(ivaTypeLabel){
        case 1:
            ivaLabel = 'IVA';
        break;
        case 2:
            ivaLabel = 'IGIC';
        break;
        case 3:
            ivaLabel = 'IPSI';
        break;
    }

    return ivaLabel;
}

$(function(){
    // SIDEBAR - TOOLTIP
    $('a.sidebar-toggle').tooltip({
        'trigger': 'hover',
        'placement': 'right',
        'title': 'MENU',
        'template': '<div class="tooltip tooltip-sidebar-toggle" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    })

    getAllNotifications()
    if(contGarage == 0){
        $('#eventsGarageReminderAmount').html('0')
        $('#eventsGarageReminderData').append('<li><a>No hay notificaciones de taller pendientes</a></li>')
    }else{
        contGarage = 0
    }

    $('#goLogout').click(function(){
        $.ajax({
            url: uri + 'core/logout/logout.php',
            method: 'POST',
            async: false,
            success: function(data){
                window.localStorage.setItem('LETS_FUNER', 'false')
                window.location.href = uri + 'inicio'
            }
        })
    })

    $('.autocompleteNif').keyup(function(){
        var inputId = $(this).attr('id')
        if(inputId == 'applicantNIF' || inputId == 'familyContactNIF' || inputId == 'deceasedNIF'){
            if($('input[name="applicantNifType"]:checked').val() != undefined && inputId == 'applicantNIF'){
                if($('input[name="applicantNifType"]:checked').val() == "1"){
                    var val = $(this).val()
        
                    if(val.length == 8 && !isNaN(val)){
                        var letters = 'TRWAGMYFPDXBNJZSQVHLCKET'
                        var position = val % 23;
                        var letter = letters.charAt(position);
                       
                        val += letter
                        $(this).val(val)
                    }
                }
            }else if($('input[name="familyContactNifType"]:checked').val() != undefined && inputId == 'familyContactNIF'){
                if($('input[name="familyContactNifType"]:checked').val() == "1"){
                    var val = $(this).val()
        
                    if(val.length == 8 && !isNaN(val)){
                        var letters = 'TRWAGMYFPDXBNJZSQVHLCKET'
                        var position = val % 23;
                        var letter = letters.charAt(position);
                       
                        val += letter
                        $(this).val(val)
                    }
                }
            }else if($('input[name="deceasedNifType"]:checked').val() != undefined && inputId == 'deceasedNIF'){
                if($('input[name="deceasedNifType"]:checked').val() == "1"){
                    var val = $(this).val()
        
                    if(val.length == 8 && !isNaN(val)){
                        var letters = 'TRWAGMYFPDXBNJZSQVHLCKET'
                        var position = val % 23;
                        var letter = letters.charAt(position);
                       
                        val += letter
                        $(this).val(val)
                    }
                }
            }
        }else{
            var val = $(this).val()
    
            if(val.length == 8 && !isNaN(val)){
                var letters = 'TRWAGMYFPDXBNJZSQVHLCKET'
                var position = val % 23;
                var letter = letters.charAt(position);
                
                val += letter
                $(this).val(val)
            }
        }
    })

    $('.reminder').click(function(e){
        $(this).closest('li').remove()
        amount = $('#eventsCalendarReminderAmount').text()
        $('#eventsCalendarReminderAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderVisits').click(function(e){
        $(this).closest('li').remove()
        amount = $('#visitsControlAmount').text()
        $('#visitsControlAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderCremation').click(function(e){
        $(this).closest('li').remove()
        amount = $('#eventsCremationReminderAmount').text()
        $('#eventsCremationReminderAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderUpkeep').click(function(e){
        $(this).closest('li').remove()
        amount = $('#eventsUpkeepReminderAmount').text()
        $('#eventsUpkeepReminderAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderGarage').click(function(e){
        $(this).closest('li').remove()
        amount = $('#eventsGarageReminderAmount').text()
        $('#eventsGarageReminderAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderStock').click(function(e){
        $(this).closest('li').remove()
        amount = $('#stockReminderAmount').text()
        $('#stockReminderAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderNotice').click(function(e){
        $(this).closest('li').remove()
        amount = $('#noticeAmount').text()
        $('#noticeAmount').html(amount - 1)
        e.stopPropagation()
    })
    $('.reminderExpedients').click(function(e){
        $(this).closest('li').remove()
        amount = $('#expedientsAmount').text()
        $('#expedientsAmount').html(amount - 1)
        e.stopPropagation()
    })
    //Borrar todas las notificaciones
    $('#closeNotices').click(function(e){        
        amount = $('#noticeAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#noticeData').closest('li').remove()
        }
        $('#noticeAmount').html(0)
        e.stopPropagation()
    })
    $('#closeVisits').click(function(e){        
        amount = $('#visitsControlAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#visitsControlData').closest('li').remove()
        }
        $('#visitsControlAmount').html(0)
        e.stopPropagation()
    })
    $('#closeCalendar').click(function(e){        
        amount = $('#eventsCalendarReminderAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#eventsCalendarReminderData').closest('li').remove()
        }
        $('#eventsCalendarReminderAmount').html(0)
        e.stopPropagation()
    })
    $('#closeCremations').click(function(e){        
        amount = $('#eventsCremationReminderAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#eventsCremationReminderData').closest('li').remove()
        }
        $('#eventsCremationReminderAmount').html(0)
        e.stopPropagation()
    })
    $('#closeUpkeeps').click(function(e){        
        amount = $('#eventsUpkeepReminderAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#eventsUpkeepReminderData').closest('li').remove()
        }
        $('#eventsUpkeepReminderAmount').html(0)
        e.stopPropagation()
    })
    $('#closeGarage').click(function(e){        
        amount = $('#eventsGarageReminderAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#eventsGarageReminderData').closest('li').remove()
        }
        $('#eventsGarageReminderAmount').html(0)
        e.stopPropagation()
    })
    $('#closeStock').click(function(e){        
        amount = $('#stockReminderAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#stockReminderData').closest('li').remove()
        }
        $('#stockReminderAmount').html(0)
        e.stopPropagation()
    })
    $('#closeExpedients').click(function(e){        
        amount = $('#expedientsAmount').text()
        for (let index = 0; index < amount; index++) {
            $('#expedientsData').closest('li').remove()
        }
        $('#expedientsAmount').html(0)
        e.stopPropagation()
    })
})