/* Configure moment language */
moment.updateLocale('es', {
    week: {
        dow: 1
    }
});

/** @var infoPage Store info page */
var infoPage = '';

/** @var startTimeline start moment timeline */
var startTimeline = '';

/** @var endTimeline end moment timeline */
var endTimeline = '';

/** @var cellsHeaders Header cells to draw */
var cellsHeaders = '';

/** @var cellsWidth Store cells width */
var cellsWidth = 50;

/** @var cellsPendingTasks Pending tasks cells to draw */
var cellsPendingTasks = '';

/** @var cellsDeparturesToday Departures today cells to draw */
var cellsDeparturesToday = '';

/** @var cellsCremations Cremations cells to draw */
var cellsCremations = '';

/** @var cellsPersonalTasks Personal tasks cells to draw */
var cellsPersonalTasks = '';

var currentEmptyRows = [];

var pendingTasksArray = [];

var departuresTodayArray = [];

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

/**
 * Get timeline settings and other info for page
 * 
 * @return {array} infoPage 
 */
function getInfo(){
    $.ajax({
        url: uri + 'core/timeline/info.php',
        method: 'POST',
        async: false,
        data : null,
        success: function(data){
            infoPage = $.parseJSON(data);
        }
    })
}

/**
 * Get own mortuaries
 * 
 * @return {array} info 
 */
function getOwnMortuaries() {
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
 * Get timeline events
 * 
 * @return {array} info 
 */
function getEvents(){
    var info = null;

    $.ajax({
        url: uri + 'core/timeline/list.php',
        method: 'POST',
        async: false,
        data : {
            start : moment(startTimeline).format('YYYY-MM-DD HH:mm:ss'), 
            end : moment(endTimeline).format('YYYY-MM-DD HH:mm:ss'),
            mortuary: $("#mortuary").val()
        },
        success: function(data){
            info = $.parseJSON(data);
        }
    })

    return info;
}

/**
 * Draw timeline structure and items
 */
function loadTimeline(){
    drawStructure()
    drawItems()
}

/**
 * Show current datetime header
 */
function clockTimeHeader(){
    $("#headerDatetime").text(moment().format('dddd').toUpperCase() + ', ' + moment().format('D') + ' DE ' + moment().format('MMMM').toUpperCase() + ' ' + ' DE ' + moment().format('YYYY') + ' | ' + moment().format('HH:mm'))
}

/**
 * Draw timeline structure
 */
function drawStructure(){

    var currentMoment = '';
    if(parseInt(moment().format('mm')) >= 30){
        currentMoment = moment().format('DD/MM/YYYY HH') + ':30:00';
    }else{
        currentMoment = moment().format('DD/MM/YYYY HH') + ':00:00';
    }
    startTimeline = moment(currentMoment, 'DD/MM/YYYY HH:mm:ss').subtract(4, 'hours');
    endTimeline = moment(currentMoment, 'DD/MM/YYYY HH:mm:ss').add(20, 'hours');

    cellsHeader = '';
    cellsPendingTasks = '';
    cellsDeparturesToday = '';
    cellsCremations = '';
    cellsPersonalTasks = '';

    for(var i = 0; i <= 47; i++){
        var cellID = i == 0 ? moment(startTimeline).format('X') : moment(moment(startTimeline, 'DD/MM/YYYY HH:mm:ss').add((30 * i), 'minutes')).format('X');
        var cellTime = i == 0 ? moment(startTimeline).format('HH:mm') : moment(moment(startTimeline, 'DD/MM/YYYY HH:mm:ss').add((30 * i), 'minutes')).format('HH:mm');
        var cellCurrentTime = moment(moment(currentMoment, 'DD/MM/YYYY HH:mm:ss')).format('HH:mm') == cellTime ? 'current-moment' : '';

        // Hide half hours and higlighting current cell hour moment
        if(!cellTime.includes(':30')){
            cellsHeader += '<div id="LA_HORA" class="cell-header-item '+cellCurrentTime+'">'+cellTime+'</div>'
        }else{
            cellsHeader += '<div id="LA_HORA" class="cell-header-item '+cellCurrentTime+'"></div>'
        }

        cellsPendingTasks += '<div id="pendingTasks-'+cellID+'"></div>'
        cellsDeparturesToday += '<div id="departuresToday-'+cellID+'"></div>'
        cellsCremations += '<div id="cremations-'+cellID+'"></div>'
        cellsPersonalTasks += '<div id="personalTasks-'+cellID+'"></div>'
    }
}

/**
 * Draw timeline items
 */
function drawItems(){
    var listEvents = getEvents();

    $("#headerCells .cell-header-item").remove();
    $("#headerCells").append(cellsHeader);

    if(
        listEvents.pendingTasks.length > 0 || 
        listEvents.cremations.length > 0 || 
        listEvents.departuresToday.length > 0 ||
        listEvents.personalTasks.length > 0
    ){
        // Pending tasks
        $("#pendingTasksContainer").empty().append(cellsPendingTasks);
        currentEmptyRows = [];
        var reOrderArray = [];
        $.each(listEvents.pendingTasks, function(index, value){
            var startEvent = moment(value.funeralDatetime, 'YYYY-MM-DD HH:mm:ss').subtract(parseFloat(value.advance), 'hours');
            var endEvent = moment(value.funeralDatetime, 'YYYY-MM-DD HH:mm:ss');

            var cellInfo = getCellInfo('pendingTasks-', startEvent, endEvent, false, null);
            var cardColor = infoPage.pendingTasksColor;

            var time = endEvent.format('HH:mm');
            var cardMargin = endEvent.format('mm') != '00' && endEvent.format('mm') != '30' ? 'margin-left:1.5em;' : '';

            // Configure texts
            var numberExp = 'Expd.: '+ value.number;
            var deceased = (value.deceasedGender == 'Hombre' ? 'D. ' : 'Dña. ') + value.deceasedName + ' ' + value.deceasedSurname;
            var timeOut = 'Hora de salida: '+ time;
            var amountPending = 'Tareas pendientes: '+ value.amount;
            if(cellInfo['width'] <= 250){
                numberExp = '';
                deceased = '';
                timeOut = '';
                amountPending = '';
            }
            var item = 
                '   <div>'+
                '       <span class="hora-salida">'+time+'</span>'+
                '   </div>'+
                '   <div class="d-flex flex-column">'+
                '       <span><strong>'+ numberExp +'</strong></span>'+
                '       <span><strong>'+ deceased + '</strong></span>'+
                '       <span>'+ timeOut +'</span>'+
                '       <span>'+ amountPending +'</span>'+
                '   </div>'
            ;

            var infoCell = {
                'class': 'card-tareas-pendientes',
                'style': 'width:'+cellInfo['width']+'px; background-color:'+cardColor+';'+cardMargin,
                'expedient' : value.expedientID,
                'title': 'Ver rtareas pendientes de de '+value.deceasedName + ' ' + value.deceasedSurname,
                'content': item
            }

            // Re order items in lines
            var reOrderInfo = reOrderItems(reOrderArray, cellInfo['start'], cellInfo['start']);
            reOrderArray = reOrderInfo[0];
            var indexSelected = reOrderInfo[1];

            drawCells(cellInfo['start'], 'pendingTasks-', indexSelected, infoCell, 8.75);
        })

        $(".card-tareas-pendientes").click(function(){
            var info = getPendingTasksInfo($(this).attr("expedient"));
            drawPendingTaskSummary(info);
            $('#modal-show-info').modal("show");
            setTimeout(() => {
                $("#modal-show-info input[type=checkbox]").attr("disabled", true)
            }, 50);
        })

        // Departures today
        $("#departuresTodayContainer").empty().append(cellsDeparturesToday);
        var cardWidth = 2 * parseFloat(infoPage.departuresTodayWidth) * cellsWidth;
        currentEmptyRows = [];
        var reOrderArray = [];
        $.each(listEvents.departuresToday, function(index, value){
            var cardColor = value.funeralHomeService == infoPage.company ? infoPage.departuresTodayOwnColor : infoPage.departuresTodayExternalColor;
            var time = value.funeralTime.substring(0, value.funeralTime.length - 3);
            var timeItems = time.split(':');
            var cardMargin = timeItems[1] != '00' && timeItems[1] != '30' ? 'margin-left:1.5em;' : '';
            var deceasedRoom = value.deceasedRoom != null && value.deceasedRoom != '' ? '<div class="badge-cointer"><span class="badge">S</span></div>' : '';

            var endEvent = moment(moment(value.funeralDate + ' ' + value.funeralTime, 'YYYY-MM-DD HH:mm:ss').add(infoPage.departuresTodayWidth ,'hours'));
            var cellInfo = getCellInfo('departuresToday-', moment(value.funeralDate + ' ' + value.funeralTime, 'YYYY-MM-DD HH:mm:ss'), endEvent, true, cardWidth);
            endEvent = moment(endEvent).format('X');

            // Configure texts
            var numberExp = 'Expd.: '+ value.number;
            var deceased = (value.deceasedGender == 'Hombre' ? 'D. ' : 'Dña. ') + value.deceasedName + ' ' + value.deceasedSurname;
            var timeOut = 'Hora de salida: '+ time;
            if(cellInfo['width'] < 250){
                numberExp = '';
                deceased = '';
                timeOut = '';
            }

            var item = 
                '   <div>'+
                '       <span class="hora-salida">'+time+'</span>'+
                '   </div>'+
                '   <div class="d-flex flex-column">'+
                '       <span><strong>'+ numberExp +'</strong></span>'+
                '       <span><strong>'+ deceased + '</strong></span>'+
                '       <span>'+timeOut+'</span>'+
                '   </div>'+
                    deceasedRoom
            ;
            
            var infoCell = {
                'class': 'card-salidas-hoy',
                'style': 'width:'+cellInfo['width']+'px; background-color:'+cardColor+';'+cardMargin,
                'expedient' : value.expedientID,
                'title': 'Ver resumen de la salida de '+value.deceasedName + ' ' + value.deceasedSurname,
                'content': item
            }

            // Re order items in lines
            var reOrderInfo = reOrderItems(reOrderArray, cellInfo['start'], endEvent);
            reOrderArray = reOrderInfo[0];
            var indexSelected = reOrderInfo[1];

            drawCells(cellInfo['start'], 'departuresToday-', indexSelected, infoCell, 8);
        })

        $(".card-salidas-hoy").click(function(){
            var info = getDepartureTodayInfo($(this).attr("expedient"));
            drawDepartureTodaySummary(info);
            $('#modal-show-info').modal("show");
        })

        // Cremations
        $("#cremationsContainer").empty().append(cellsCremations);
        currentEmptyRows = [];
        var reOrderArray = [];
        $.each(listEvents.cremations, function(index, value){

            // Calculate card width
            var startEvent = moment(value.start, 'YYYY-MM-DD HH:mm:ss');
            var endEvent = moment(value.end, 'YYYY-MM-DD HH:mm:ss');

            var cellInfo = getCellInfo('cremations-', startEvent, endEvent, false, null);
            var cardColor = value.crematoriumClient == infoPage.company ? infoPage.cremationsOwnColor : infoPage.cremationsExternalColor;

            var time = moment(value.start, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
            var timeItems = time.split(':');
            var cardMargin = timeItems[1] != '00' && timeItems[1] != '30' ? 'margin-left:1.5em;' : '';

            // Configure texts
            var numberExp = 'Expd.: '+ value.number;
            var deceased = (value.deceasedGender == 'Hombre' ? 'D. ' : 'Dña. ') + value.deceasedName + ' ' + value.deceasedSurname;
            var timeOut = 'Hora de introducción: '+ time;
            var idTrazability = 'ID. Trazabilidad: '+ (value.trazabilityId == null || value.trazabilityId == '' ? '-' : value.trazabilityId);
            if(cellInfo['width'] < 250){
                numberExp = '';
                deceased = '';
                timeOut = '';
                idTrazability = '';
            }

            var item = 
                '   <div>'+
                '       <span class="hora-salida">'+time+'</span>'+
                '   </div>'+
                '   <div class="d-flex flex-column">'+
                '       <span><strong>'+numberExp+'</strong></span>'+
                '       <span><strong>'+ deceased + '</strong></span>'+
                '       <span>'+timeOut+'</span>'+
                '       <span>'+ idTrazability +'</span>'+
                '   </div>'
            ;

            var infoCell = {
                'class': 'card-cremaciones',
                'style': 'width:'+cellInfo['width']+'px; background-color:'+cardColor+';'+cardMargin,
                'expedient' : value.expedientID,
                'title': 'Ver resumen de la cremación de '+value.deceasedName + ' ' + value.deceasedSurname,
                'content': item
            }

            // Re order items in lines
            var reOrderInfo = reOrderItems(reOrderArray, cellInfo['start'], cellInfo['end']);
            reOrderArray = reOrderInfo[0];
            var indexSelected = reOrderInfo[1];

            drawCells(cellInfo['start'], 'cremations-', indexSelected, infoCell, 8);
        })

        $(".card-cremaciones").click(function(){
            var info = getCremationInfo($(this).attr("expedient"));
            drawCremationSummary(info);
            $('#modal-show-info').modal("show");
        })

        // Personal tasks
        $("#personalTasksContainer").empty().append(cellsPersonalTasks);
        currentEmptyRows = [];
        var reOrderArray = [];
        var garageWidth = 2 * 4 * cellsWidth;
        $.each(listEvents.personalTasks, function(index, value){

            var startEvent = null;
            var endEvent = moment(value.end, 'YYYY-MM-DD HH:mm:ss');
            if(value.type == 'ashes'){
                startEvent = moment(value.start, 'YYYY-MM-DD HH:mm:ss').subtract(parseFloat(infoPage.personalTasksAdvance), 'hours');
            }else{
                startEvent = moment(value.start, 'YYYY-MM-DD HH:mm:ss');
            }

            if(value.type == 'garageTask'){
                var cellInfo = getCellInfo('personalTasks-', startEvent, endEvent, true, garageWidth);
            }else{
                var cellInfo = getCellInfo('personalTasks-', startEvent, endEvent, false, null);
            }

            var timeItems = moment(value.start, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm').split(':');
            var cardMargin = timeItems[1] != '00' && timeItems[1] != '30' ? 'margin-left:1.5em;' : '';

            // Configure texts
            var typeName = value.type_name;
            var datetime = 'Fecha y hora: '+moment(value.start, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            var designed = 'Operario: '+ (value.designated == null || value.designated == '' ? '-' : value.designated);
            
            if(cellInfo['width'] >= 200 && cellInfo['width'] < 400){
                datetime = moment(value.start, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
                designed = (value.designated == null || value.designated == '' ? '-' : value.designated);
                
                if(designed.length > (parseFloat(cellInfo['width']))/10){
                    designed = designed.substring(0, 17) + '...';
                }
            }else if(cellInfo['width'] < 200){
                typeName = '';
                datetime = '';
                designed = '';
            }

            var item = 
                '   <div>'+
                '       <span class="hora-salida">'+moment(value.start, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')+'</span>'+
                '   </div>'+
                '   <div class="d-flex flex-column">'+
                '       <span><strong>'+ typeName +'</strong></span>'+
                '       <span>'+ datetime +'</span>'+
                '       <span>'+ designed + '</span>'+
                '   </div>'
            ;

            var infoCell = {
                'class': 'card-tareas-personal',
                'style': 'width:'+cellInfo['width']+'px; background-color:'+value.color+';'+cardMargin,
                'id' : value.id,
                'type' : value.type,
                'title': 'Ver detalles de la tarea de personal',
                'content': item
            }

            // Re order items in lines
            var reOrderInfo = reOrderItems(reOrderArray, cellInfo['start'], cellInfo['end']);
            reOrderArray = reOrderInfo[0];
            var indexSelected = reOrderInfo[1];

            drawCells(cellInfo['start'], 'personalTasks-', indexSelected, infoCell, 7.4);
        })

        $(".card-tareas-personal").click(function(){
            var type = $(this).attr("type");
            var info = getPersonalTaskInfo(type, $(this).attr("entityID"))
            switch(type){
                case 'ashes':
                    drawDeliveryAshesSummary(info);
                break;
                case 'installation':
                    drawInstallationSummary(info);
                break;
                case 'freeTask':
                    drawFreeTaskSummary(info);
                break;
                case 'garageTask':
                    drawGarageTaskSummary(info);
                break;
            }
           
            $('#modal-show-info').modal("show");
        })

    }else{
        $("#headerCells .cell-header-item").remove();
        $("#headerCells").append(cellsHeader);
    
        $("#pendingTasksContainer").empty().append(cellsPendingTasks);
        $("#departuresTodayContainer").empty().append(cellsDeparturesToday);
        $("#cremationsContainer").empty().append(cellsCremations);
        $("#personalTasksContainer").empty().append(cellsPersonalTasks);
    }
}

/**
 * Calculate firts cell width and start cell id
 * 
 * @return {array} Cell width and start cell id
 */
function getCellInfo(category, startEvent, endEvent, durationFixed, durationWidthFixed){

    /**
     * Calculamos la celda en la que debería de empezar el evento
     */
    var itemSelected = null;
    if(parseInt(startEvent.format('mm')) >= 30){
        var itemSelected = moment(startEvent.format('DD/MM/YYYY HH') + ' :30:00', 'DD/MM/YYYY HH:mm:ss').format('X');
    }else{
        var itemSelected = moment(startEvent.format('DD/MM/YYYY HH') + ' :00:00', 'DD/MM/YYYY HH:mm:ss').format('X');
    }

    /**
     * Comprobamos si la celda en la que debería empezar el evento está en los límites del timeline 
     * (PJ: Sí el timeline empieza a las 09:00 y la hora del evento teniendo en cuenta la antelación empieza a las 05:00, debe empezar a las 09:00)
     */
    var cellID = '';
    var diffWithStartTimeline = 0;
    if($("#" + category + itemSelected).length > 0){
        // El inicio del evento está en los límites
        cellID = category + itemSelected;
    }else{
        // El inicio del evento está FUERA de los límites del timeline
        diffWithStartTimeline = moment.duration(startTimeline.diff(moment(itemSelected, 'X'))).asHours()
        cellID = category + startTimeline.format('X');
        itemSelected = startTimeline.format('X');
    }

    // Calculamos la duración del evento (Ancho en pixeles)
    var cardWidth = 0;
    var durationEvent = 0;
    if(!durationFixed){ // La duración del evento depende del propio evento
        if(moment(endEvent).format('HH:mm:ss') == '23:59:59'){
            endEvent = moment(endEvent).add(1, 'seconds');
        }else if(moment(endEvent).format('HH:mm:ss') == '23:59:00'){
            endEvent = moment(endEvent).add(1, 'minutes');
        }

        if(moment(endEvent).format('X') > moment(endTimeline).format('X')){
            endEvent = endTimeline;
        }

        durationEvent = moment.duration(endEvent.diff(startEvent)).asHours()
        cardWidth = (2 * durationEvent * cellsWidth) - (2 * diffWithStartTimeline * cellsWidth);
        cardWidth = cardWidth <= 0 ? cellsWidth : cardWidth;
    }else{ // La duración del evento es fija, calculamos el final del evento en caso de que esté fuera de los límites del timeline
        cardWidth = durationWidthFixed;
        if(moment(endEvent).format('X') > moment(endTimeline).format('X')){
            endEvent = endTimeline;

            durationEvent = moment.duration(endEvent.diff(startEvent)).asHours()
            cardWidth = (2 * durationEvent * cellsWidth) - (2 * diffWithStartTimeline * cellsWidth);
            cardWidth = cardWidth <= 0 ? cellsWidth : cardWidth;
        }
    }

    return {'id' : cellID, 'width' : cardWidth, 'start' : itemSelected, 'end': moment(endEvent).format('X')}
}

/**
 * Re order array items in rows
 * 
 * @return {array} 
 */
function reOrderItems(reOrderArray, startEvent, endEvent){

    var indexSelected = 0;
    if(reOrderArray.length == 0){
        reOrderArray[0] = [];
        reOrderArray[0].push({'end': endEvent})
    }else{
        var flag = false;
        $.each(reOrderArray, function(ind, it){
            if(parseInt(startEvent) >= parseInt(it[it.length-1].end)){
                flag = true;
                indexSelected = ind;
                return false;
            }
        })
        if(flag){
            if(reOrderArray[indexSelected] == undefined){
                reOrderArray[indexSelected] = [];
            }
            reOrderArray[indexSelected].push({'end': endEvent})
        }else{
            if(reOrderArray[reOrderArray.length] == undefined){
                reOrderArray[reOrderArray.length] = [];
            }
            reOrderArray[reOrderArray.length-1].push({'end': endEvent})

            indexSelected = reOrderArray.length-1;
        }
    }

    return [reOrderArray, indexSelected]
}

/**
 * Draw cells
 */
function drawCells(startCellTime, category, rowIndex, infoCell, height){

    // Complete row with empty cells
    if(currentEmptyRows.includes(rowIndex) == false){
        var startCell = startTimeline;
        var numCells = 2 * moment.duration(moment(endTimeline, 'X').diff(moment(moment(startTimeline, 'X'), 'X'))).asHours();
        var itemHidden = '';
        for(var i = 0; i<=numCells; i++){
            startCell = i > 0 ? (moment(moment(startCell, 'X').add(30, 'minutes')).format('X')) : moment(startCell, 'X').format('X');
            var marginTop = rowIndex == 0 ? '' : 'margin-top: 0.60em;';
            itemHidden = '<div id="'+category+startCell+'-'+rowIndex+'" style="width:'+cellsWidth+'px;height: '+height+'em;visibility:hidden;'+marginTop+'">'+startCell+'-'+rowIndex+'</div>';
            $("#"+category+startCell).append(itemHidden);
        }
        currentEmptyRows.push(rowIndex);
    }

    // Replace cell -> Draw
    if(rowIndex > 0){
        $('#'+category+startCellTime+'-'+rowIndex).attr("style", infoCell['style'] + 'margin-top:1em;');
    }else{
        $('#'+category+startCellTime+'-'+rowIndex).attr("style", infoCell['style']);
    }
    $('#'+category+startCellTime+'-'+rowIndex).addClass(infoCell['class']).addClass('card-item')
    $('#'+category+startCellTime+'-'+rowIndex).attr('title', infoCell['title']);
    $('#'+category+startCellTime+'-'+rowIndex).empty().append(infoCell['content']);
    if(infoCell['expedient'] != undefined){
        $('#'+category+startCellTime+'-'+rowIndex).attr('expedient', infoCell['expedient']);
    }
    if(infoCell['type'] != undefined){
        $('#'+category+startCellTime+'-'+rowIndex).attr('type', infoCell['type']);
    }
    if(infoCell['id'] != undefined){
        $('#'+category+startCellTime+'-'+rowIndex).attr('entityID', infoCell['id']);
    }
    $('#'+category+startCellTime+'-'+rowIndex).removeAttr("id");
}

/**
 * Get info for pending tasks event
 * 
 * @return {array} info 
 */
function getPendingTasksInfo(expedient){
    var info = null;

    $.ajax({
        url: uri + 'core/timeline/functions.php',
        method: 'POST',
        async: false,
        data : {
            type: 'getPendingTaskInfo',
            expedient: expedient
        },
        success: function(data){
            info = $.parseJSON(data);
        }
    })

    return info;
}

/**
 * Draw peding task summary info
 */
function drawPendingTaskSummary(summary){

    $('#modal-show-info #modalSection').addClass('modal-xxl').removeClass('modal-md');
    $('#modal-show-info #todaySummary').empty();
    $('#modal-show-info #tasks').empty();

    var details = summary.details       
    var gender = 'D. '       
    if(details[4] == 'Mujer'){
        gender = 'Dña. '
    }

    $('#modal-show-info #titleExp').empty().html('Tareas pendientes | <strong>Expd: ' +details[5] + ' - ' + details[2] + ' ' + details[3] + '</strong>');

    var priests = summary.priests
    var gravediggers = summary.gravediggers
    var others = summary.others
    var others2 = summary.others2
    var carriers  = summary.carriers

    var detailsText = ''
    if((details[0] == 1 && details[1] == 0) || details[2] == null){            
        detailsText +=      
            '   <fieldset class="details">' +
            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Detalles del servicio</span></legend>' 

        if(details[0] == 1 && details[1] == 0){
            detailsText +=  
                '       <div class="checkbox-inline">' +
                '           <input type="checkbox" id="control">' +
                '           <label for="control">Control realizado</label>' +
                '       </div>' 
        }               
        
        if(details[2] == null){
            detailsText +=  
                '       <div class="col-xs-12 hide" style="margin-bottom: 10px;">' +
                '           <label for="arriveTimePendTask" class="control-label">Hora de llegada</label>'+                                                                                             
                '           <div class="input-group bootstrap-timepicker timepicker">'+
                '               <input type="text" class="form-control time" id="arriveTimePendTask" name="arriveTimePendTask">' +
                '               <div class="input-group-addon">' +
                '                   <i class="fa fa-clock-o"></i>' +
                '               </div>' +
                '           </div>' +
                '       </div>'            
        }

        detailsText += '</fieldset>'
        $('#modal-show-info #tasks').append(detailsText)                         
    }

    var priestsText = ''
    if(priests != null && priests.length > 0){
        if(
            (priests[0] == 0 || priests[1] != null) || 
            (priests[3].priestInspected != undefined && priests[3].priestInspected == '0') || 
            (priests[3].priestPayed != undefined && priests[3].priestPayed == '0')
        ){
            priestsText +=  
                '   <fieldset class="priests">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Curas</span></legend>'

            if(priests[0] == 0){
                priestsText +=  
                    '   <div class="col-xs-12 hide">' +
                    '       <div class="input-group bootstrap-timepicker timepicker">' +
                    '           <input type="text" class="form-control time" id="priestTimePendTask" name="priestTimePendTask">' +
                    '           <div class="input-group-addon">' +
                    '               <i class="fa fa-clock-o"></i>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="col-xs-12" id="priestsChecks">' +
                    '       <div class="checkbox-inline">' +
                    '           <input type="checkbox" id="priestTime">' +
                    '           <label for="priestTime">Hora confirmada</label>' +
                    '       </div>' +
                    '   </div>'
            }

            if(priests[1] != null){
                priestsText +=  
                    '       <div class="col-xs-12 table-responsive">' +
                    '           <table class="table table-striped table-bordered" id="priestsTable" width="100%" cellspacing="0">' +
                    '               <thead>' +
                    '                   <tr>' +
                    '                       <td class="hide">ID</td>' +
                    '                       <td>Nombre</td>' +
                    '                       <td>Parroquia</td>' +
                    '                       <td>Teléfonos</td>' +
                    '                       <td class="text-center">Avisado</td>' +
                    '                   </tr>' +
                    '               </thead>' +
                    '               <tbody>'

                $.each(priests[1], function(index, elem){
                    var phones = ''

                    if(elem.homePhone == '' && elem.mobilePhone == '' && elem.otherPhone != ''){
                        phones += 'Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else if(elem.homePhone == '' && elem.mobilePhone != '' && elem.otherPhone == ''){
                        phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>'
                    }else if(elem.homePhone == '' && elem.mobilePhone != '' && elem.otherPhone != ''){
                        phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else if(elem.homePhone != '' && elem.mobilePhone == '' && elem.otherPhone == ''){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a>'
                    }else if(elem.homePhone != '' && elem.mobilePhone == '' & elem.otherPhone != ''){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else if(elem.homePhone != '' && elem.mobilePhone != '' & elem.otherPhone == ''){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>' 
                    }else if(elem.homePhone != '' && elem.mobilePhone != '' & elem.otherPhone != ''){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else{
                        phones += ''
                    }

                    var parish = elem.parish == null ? '-' : elem.parish;

                    priestsText +=  
                        '<tr>' +
                        '    <td class="priestID hide">' + elem.ID + '</td>' +
                        '    <td>' + elem.name + ' ' + elem.surname + '</td>' +
                        '    <td>' + parish + '</td>' +
                        '    <td>' + phones + '</td>' +
                        '    <td class="text-center priestNotified">' +
                        '        <input type="checkbox" name="priestNotified' + index + '" id="priestNotified' + index + '">' +
                        '    </td>' +
                        '</tr>'
                })
                
                priestsText +=  
                    '              </tbody>' +
                    '           </table>' +
                    '       </div>'
            }

            if(priests[3].priestInspected != undefined && priests[3].priestInspected == '0'){
                priestsText +=  
                    '       <div class="checkbox-inline">' +
                    '           <input type="checkbox" id="priestInspected">' +
                    '           <label for="control">Revisado (Funeral)</label>' +
                    '       </div>' 
            }

            if(priests[3].priestPayed != undefined && priests[3].priestPayed == '0'){
                priestsText +=  
                    '       <div class="checkbox-inline">' +
                    '           <input type="checkbox" id="priestPayed">' +
                    '           <label for="control">Pagado (Funeral)</label>' +
                    '       </div>' 
            }

            priestsText += '</fieldset>'
            
            $('#modal-show-info #tasks').append(priestsText)
        }

        if(priests[2] != null){             
            $('#priestTimePendTask').val(priests[2])
        }
    }         

    var gravediggersText = ''
    if(gravediggers != null && gravediggers.length > 0){
        if(gravediggers[0] == 0 || gravediggers[1] == 0 || gravediggers[2] == 0 || (gravediggers[3] != null && gravediggers[3].length > 0)){
            gravediggersText += 
                '   <fieldset class="gravediggers">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Enterradores</span></legend>'

            if(gravediggers[0] == 0 || gravediggers[1] == 0 || gravediggers[2] == 0){
                gravediggersText += '   <div class="col-xs-12" id="gravediggersChecks">'

                if(gravediggers[0] == 0){
                    gravediggersText += 
                        '   <input type="checkbox" id="gravediggersCheck">' +
                        '   <label for="gravediggersCheck">Revisado</label>'
                }

                if(gravediggers[1] == 0){
                    gravediggersText +=
                        '   <input type="checkbox" id="gravediggersCheckPrinted">' +
                        '   <label for="gravediggersCheckPrinted">Impreso</label>'
                }

                if(gravediggers[2] == 0){
                    gravediggersText += 
                        '   <input type="checkbox" id="gravediggersCheckSigned">' +
                        '   <label for="gravediggersCheckSigned">Firmado</label>'
                }

                gravediggersText += '</div>'
            }

            if(gravediggers[3] != null && gravediggers[3].length > 0){
                gravediggersText += 
                    '   <div class="col-xs-12 table-responsive">' +
                    '       <table class="table table-striped table-bordered" id="gravediggersTable" width="100%" cellspacing="0">' +
                    '           <thead>' +
                    '               <tr>' +
                    '                   <td class="hide">ID</td>' +
                    '                   <td>Nombre</td>' +
                    '                   <td>Teléfonos</td>' +
                    '                   <td class="text-center">Avisado</td>' +
                    '               </tr>' +
                    '           </thead>' +
                    '           <tbody>'

                $.each(gravediggers[3], function(index, elem){
                    var phones = ''
                    if(elem.homePhone == null && elem.mobilePhone == null && elem.otherPhone != null){
                        phones += 'Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else if(elem.homePhone == null && elem.mobilePhone != null && elem.otherPhone == null){
                        phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>'
                    }else if(elem.homePhone == null && elem.mobilePhone != null && elem.otherPhone != null){
                        phones += 'Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else if(elem.homePhone != null && elem.mobilePhone == null && elem.otherPhone == null){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a>'
                    }else if(elem.homePhone != null && elem.mobilePhone == null & elem.otherPhone != null){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else if(elem.homePhone != null && elem.mobilePhone != null & elem.otherPhone == null){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a>' 
                    }else if(elem.homePhone != null && elem.mobilePhone != null & elem.otherPhone != null){
                        phones += 'Casa: <a href="tel:' + elem.homePhone + '">' + elem.homePhone + '</a> - Móvil: <a href="tel:' + elem.mobilePhone + '">' + elem.mobilePhone + '</a> - Otro: <a href="tel:' + elem.otherPhone + '">' + elem.otherPhone + '</a>'
                    }else{
                        phones += ''
                    }

                    gravediggersText += 
                        '   <tr>' +
                        '       <td class="gravediggerID hide">' + elem.ID + '</td>' +
                        '       <td>' + elem.name + ' ' + elem.surname + '</td>' +
                        '       <td>' + phones + '</td>' +
                        '       <td class="text-center gravediggerNotified">' +
                        '           <input type="checkbox" name="gravediggerNotified' + index + '" id="gravediggerNotified' + index + '">' +
                        '       </td>' +
                        '   </tr>'
                    })
                
                gravediggersText +=     
                    '          </tbody>' +
                    '      </table>' +
                    '  </div>'
            }

            gravediggersText += '   </fieldset>'

            $('#modal-show-info #tasks').append(gravediggersText)
        }
    }

    currentProduct = ""
    if(others != null){
        others.forEach(function(product){
            if(currentProduct.productModelID != product.productModelID){
                if(product.supplierPhones == null || product.supplierPhones == ''){
                    product.supplierPhones = '--'
                }

                $('#modal-show-info #tasks').append("<fieldset class='others' id='" + product.productModelID + "'><legend class='legendBottom'><span class='label label-primary labelLgExp'><strong>Producto: </strong>" + product.productName + " - <strong>Modelo: </strong> " + product.name + "  |  <strong>Proveedor:</strong> "+ product.supplierName + " <strong>Telefónos:</strong> " + product.supplierPhones +"</span></legend>")
            }

            if(product.type == "checkbox"){
                if(product.label != 'No aplica'){
                    $('#modal-show-info #tasks').find("fieldset#" + product.productModelID).append(
                        "<div class='checkbox-inline'><input type='" + product.type + "' id='" + product.action + "' /> " + 
                        "   <label for='" + product.action + "'>" + product.label + "</label>"+
                        "</div>"
                    )
                }
            }

            currentProduct = product;
        })
    }

    // Otros
    var others2Text = ''

    // Policía
    if(others2.policeNotified != "1"){
        others2Text +=  
            '   <fieldset class="others2">' +
            '        <legend class="legendBottom"><span class="label label-primary labelLgExp">Policía</span></legend>'

        if(others2.policeNotified != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="policeNotified">' +
                '       <label for="policeNotified">Avisada</label>' +
                '   </div>'
        }
        
        others2Text +=  '</fieldset>'
    }

    if(others2.policeNotApply == 1){
        $(document).find('[id="policeNotified"]').closest('fieldset').remove()
    }

    // Juzgado
    if(others2.tribunalInProgress != "1" || others2.tribunalDeliver != "1"){
        others2Text +=  
            '   <fieldset class="others2">' +
                '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Juzgado</span></legend>'

        if(others2.tribunalInProgress != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="tribunalInProgress">' +
                '       <label for="tribunalInProgress">En proceso</label>' +
                '   </div>'
        }

        if(others2.tribunalDeliver != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="tribunalDeliver">' +
                '       <label for="tribunalDeliver">Entregado</label>' +
                '   </div>'
        }
        
        others2Text += '</fieldset>'
    }

    // Certificado médico
    if(others2.doctorInProgress != "1" || others2.doctorDone != "1"){
        others2Text +=  
            '   <fieldset class="others2">' +
            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Médico</span></legend>'

        if(others2.doctorInProgress != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="doctorInProgress">' +
                '       <label for="doctorInProgress">En proceso</label>' +
                '   </div>'
        }

        if(others2.doctorDone != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="doctorDone">' +
                '       <label for="doctorDone">Entregado</label>' +
                '   </div>'
        }
        
        others2Text +=  '</fieldset>'
    }

    // Página web
    if(others2.webConfirm != "1"){
        others2Text +=  
            '   <fieldset class="others2">' +
            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Página web</span></legend>'

        if(others2.webConfirm != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="webConfirm">' +
                '       <label for="webConfirm">Confirmada</label>' +
                '   </div>'
        }
        
        others2Text +=  '</fieldset>'
    }

    // Actividades de preparación
    if(others2.preparationConfirm != "1"){
        others2Text +=  
            '   <fieldset class="others2">' +
            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Act. preparación</span></legend>'

        if(others2.preparationConfirm != "1"){
            others2Text +=  
                '   <div class="checkbox-inline">' +
                '       <input type="checkbox" id="preparationConfirm">' +
                '       <label for="preparationConfirm">Confirmada</label>' +
                '   </div>'
        }
        
        others2Text +=  '</fieldset>'
    }
    
    $('#modal-show-info #tasks').append(others2Text)

    var carriersText = ''
    if(carriers[1] != null){
        carriersText += 
            '   <fieldset class="carriers">' +
            '       <legend class="legendBottom"><span class="label label-primary labelLgExp">Porteadores</span></legend>'
        if(carriers[1] != null){
            carriersText += 
                '   <div class="col-xs-12 table-responsive">' +
                '       <table class="table table-striped table-bordered" id="carriersTable" width="100%" cellspacing="0">' +
                '           <thead>' +
                '               <tr>' +
                '                   <td class="hide">ID</td>' +
                '                   <td>Nombre</td>' +
                '                   <td>Teléfonos</td>' +
                '                   <td class="text-center">Confirmado</td>' +
                '               </tr>' +
                '           </thead>' +
                '           <tbody>'

            $.each(carriers[1], function(index, elem){
                carriersText += 
                    '           <tr>' +
                    '               <td class="carrierID hide">' + elem.ID + '</td>' +
                    '               <td>' + elem.name + ' ' + elem.surname + '</td>' +
                    '               <td>' + elem.phones + '</td>' +
                    '               <td class="text-center carrierNotified">' +
                    '                   <input type="checkbox" name="carrierNotified' + index + '" id="carrierNotified' + index + '">' +
                    '               </td>' +
                    '           </tr>'
                })
            
            carriersText += 
                '           </tbody>' +
                '       </table>' +
                '   </div>'
        }

        carriersText += '   </fieldset>'

        $('#modal-show-info #tasks').append(carriersText)
    }
}

/**
 * Get info for departure today event
 * 
 * @return {array} info 
 */
function getDepartureTodayInfo(expedient){
    var info = null;

    $.ajax({
        url: uri + 'core/timeline/functions.php',
        method: 'POST',
        async: false,
        data : {
            type: 'getDepartureTodayInfo',
            expedient: expedient
        },
        success: function(data){
            info = $.parseJSON(data);
        }
    })

    return info;
}

/**
 * Draw departure today summary info
 */
function drawDepartureTodaySummary(summary){

    $('#modal-show-info #modalSection').removeClass('modal-xxl').addClass('modal-md');
    $('#modal-show-info #tasks').empty();
        
    var funeralTime = '-'
    if(summary.funeralTime != null){
        funeralTime = moment(summary.funeralTime, 'HH:mm:ss').format('HH:mm')
    }
    var number = summary.number
    var deceasedName = '-'
    if(summary.deceasedName != ''){
        deceasedName = summary.deceasedName
    }
    var deceasedSurname = '-'
    if(summary.deceasedSurname != ''){
        deceasedSurname = summary.deceasedSurname
    }
    var mortuary = '-'
    if(summary.mortuary != null){
        mortuary = summary.mortuary
    }
    var deceasedRoom = '-'
    if(summary.deceasedRoom != null && summary.deceasedRoom != ''){
        deceasedRoom = summary.deceasedRoom
    }
    var cemetery = '-'
    if(summary.cemetery != null){
        cemetery = summary.cemetery
    }
    var carriersTime = '-'
    if(summary.carriersTime != null){
        carriersTime = moment(summary.carriersTime, 'HH:mm:ss').format('HH:mm')
    }
    var funeralHome = '-'
    if(summary.funeralHome != null){
        funeralHome = summary.funeralHome
    }
    var church = '-'
    if(summary.church != null){
        church = summary.church
    }
    var buses = '-'
    if(summary.buses != null){
        buses = summary.buses
    }

    var text = 
        '<dl class="dl-horizontal">' +
        '    <dt>Hora de salida: </dt><dd><strong>' + funeralTime + '</strong></dd>' +
        '    <dt>Nº Expediente: </dt><dd>' + number + '</dd>' +
        '    <dt>Nombre: </dt><dd>' + deceasedName + ' ' + deceasedSurname + '</dd>' +
        '    <dt>Funeraria del servicio: </dt><dd>' + funeralHome + '</dd>' +
        '    <dt>Casa mortuoria: </dt><dd>' + mortuary + '</dd>' +
        '    <dt>Sala: </dt><dd>' + deceasedRoom + '</dd>' +
        '    <dt>Nº Autobuses: </dt><dd>' + buses + '</dd>' +
        '    <dt>Parroquia: </dt><dd>' + church + '</dd>' +
        '    <dt>Cementerio: </dt><dd>' + cemetery + '</dd>' +
        '    <dt>Porteadores: </dt><dd>' + carriersTime + '</dd>' +
        '    <ol>'
    ;

    if(summary.carriers.length > 0){                        
        var brand =''
        var model = ''
        var license = ''
        summary.carriers.forEach(function(carrier){
            var flag = true
            if(summary.cars.length > 0){                                                              
                summary.cars.forEach(function(car){
                    if(flag){
                        if((carrier.name + ' ' + carrier.surname) == (car.driverName + ' ' + car.driverSurname)){                                            
                            brand = ' - ' + car.brand
                            model = car.model
                            license = car.licensePlate
                            flag = false                                        
                        }else{
                            brand =''
                            model = ''
                            license = ''
                        }
                    }
                })
            }
            if(carrier.confirmed == 1){                                
                text +=     "       <li>" + carrier.name + " " + carrier.surname + "<strong>" + brand + " " + model + " " + license + "</strong></li>";      
            }else{                                
                text +=     "       <li class='c-red'>" + carrier.name + " " + carrier.surname + "<strong>" + brand + "  " + model + " " + license + "</strong></li>";
            }
        })
    }
    text +=     " </ol></dl>";

    $("#modal-show-info #titleExp").empty().html('Salida de hoy | <strong>Exp: ' + number + '</strong> - <strong>' + deceasedName + ' ' + deceasedSurname+'</strong>');
    $('#modal-show-info #todaySummary').empty().append(text)
}

/**
 * Get info for cremation event
 * 
 * @return {array} info 
 */
function getCremationInfo(expedient){
    var info = null;

    $.ajax({
        url: uri + 'core/timeline/functions.php',
        method: 'POST',
        async: false,
        data : {
            type: 'getCremationInfo',
            expedient: expedient
        },
        success: function(data){
            info = $.parseJSON(data);
        }
    })

    return info;
}

/**
 * Draw cremation summary info
 */
function drawCremationSummary(summary){

    $('#modal-show-info #modalSection').removeClass('modal-xxl').addClass('modal-md');
    $('#modal-show-info #tasks').empty();

    var number = summary.number
    var deceasedName = '-'
    if(summary.deceasedName != ''){
        deceasedName = summary.deceasedName
    }
    var deceasedSurname = '-'
    if(summary.deceasedSurname != ''){
        deceasedSurname = summary.deceasedSurname
    }
    var funeralHome = '-'
    if(summary.funeralHome != null && summary.funeralHome != ''){
        funeralHome = summary.funeralHome
    }
    var crematoriumPacemaker = 'No';
    if(parseInt(summary.crematoriumPacemaker) == 1){
        crematoriumPacemaker = "Sí";
    }
    var crematoriumIntroduction = 'No'
    if(parseInt(summary.crematoriumIntroduction) == 1){
        crematoriumIntroduction = "Sí"
    }
    var crematoriumVaseBio = 'No'
    if(parseInt(summary.crematoriumVaseBio) == 1){
        crematoriumVaseBio = "Sí"
    }
    var authDate = '-'
    if(summary.authDate != null && summary.authDate != ''){
        authDate = moment(summary.authDate, 'X').format('DD/MM/YYYY')
    }
    var authTime = '-'
    if(summary.authTime != null && summary.authTime != ''){
        authTime = moment(summary.authTime, 'X').format('HH:mm')
    }
    var authPlace = '-'
    if(summary.authPlace != null && summary.authPlace != ''){
        authPlace = summary.authPlace
    }
    var trazabilityId = '-'
    if(summary.trazabilityId != null && summary.trazabilityId != ''){
        trazabilityId = summary.trazabilityId
    }

    var text = 
        '       <dl class="dl-horizontal">' +
        '           <dt>Nº Expediente: </dt><dd>' + number + '</dd>' +
        '           <dt>Nombre: </dt><dd>' + deceasedName + ' ' + deceasedSurname + '</dd>' +
        '           <dt>Funeraria: </dt><dd>' + funeralHome + '</dd>' +
        '           <dt>Marcapasos: </dt><dd>' + crematoriumPacemaker + '</dd>' +
        '           <dt>Introducción: </dt><dd>' + crematoriumIntroduction + '</dd>' +
        '           <dt>Urna: </dt><dd>' + crematoriumVaseBio + '</dd>' +
        '           <dt>Fecha de entrega: </dt><dd><strong>' + authDate + '</strong></dd>' +
        '           <dt>Hora de entrega: </dt><dd><strong>' + authTime + '</strong></dd>' +
        '           <dt>Lugar de entrega: </dt><dd>' + authPlace + '</dd>' +
        '           <dt>ID. Trazabilidad: </dt><dd>' + trazabilityId + '</dd>' +
        '       </dl>';
    ;
        
    $("#modal-show-info #titleExp").empty().html('Cremación | <strong>Exp: ' + number + '</strong> - <strong>' + deceasedName + ' ' + deceasedSurname + '</strong>');
    $('#modal-show-info #todaySummary').empty().append(text)
}

/**
 * Get info for personal task event
 * 
 * @return {array} info 
 */
function getPersonalTaskInfo(type, id){
    var info = null;

    $.ajax({
        url: uri + 'core/timeline/functions.php',
        method: 'POST',
        async: false,
        data : {
            type: 'getPersonalTaskInfo',
            taskType: type,
            id: id
        },
        success: function(data){
            info = $.parseJSON(data);
        }
    })

    return info;
}

/**
 * Draw personal task - delivery ashes- summary info
 */
function drawDeliveryAshesSummary(summary){

    $('#modal-show-info #modalSection').removeClass('modal-xxl').addClass('modal-md');
    $('#modal-show-info #tasks').empty();

    var number = summary.number
    var deceasedName = '-'
    if(summary.deceasedName != ''){
        deceasedName = summary.deceasedName
    }
    var deceasedSurname = '-'
    if(summary.deceasedSurname != ''){
        deceasedSurname = summary.deceasedSurname
    }
    var authDate = '-'
    if(summary.authDate != null && summary.authDate != ''){
        authDate = moment(summary.authDate, 'X').format('DD/MM/YYYY')
    }
    var authTime = '-'
    if(summary.authTime != null && summary.authTime != ''){
        authTime = moment(summary.authTime, 'X').format('HH:mm')
    }
    var crematoriumWhoDelivered = '-'
    if(summary.crematoriumWhoDelivered != null && summary.crematoriumWhoDelivered != ''){
        crematoriumWhoDelivered = summary.crematoriumWhoDelivered
    }
    var authPlace = '-'
    if(summary.authPlace != null && summary.authPlace != ''){
        authPlace = summary.authPlace
    }
    var authName = '-'
    if(summary.authName != null && summary.authName != ''){
        authName = summary.authName
    }
    var trazabilityId = '-'
    if(summary.trazabilityId != null && summary.trazabilityId != ''){
        trazabilityId = summary.trazabilityId
    }

    var text = 
        '       <dl class="dl-horizontal">' +
        '           <dt>Nº Expediente: </dt><dd>' + number + '</dd>' +
        '           <dt>Fallecido: </dt><dd>' + deceasedName + ' ' + deceasedSurname + '</dd>' +
        '           <dt>Fecha de entrega: </dt><dd><strong>' + authDate + '</strong></dd>' +
        '           <dt>Hora de entrega: </dt><dd><strong>' + authTime + '</strong></dd>' +
        '           <dt>Entrega las cenizas: </dt><dd>' + crematoriumWhoDelivered + '</dd>' +
        '           <dt>Lugar de entrega: </dt><dd>' + authPlace + '</dd>' +
        '           <dt>Entrega cenizas a: </dt><dd>' + authName + '</dd>' +
        '           <dt>ID. Trazabilidad: </dt><dd>' + trazabilityId + '</dd>' +
        '       </dl>';
    ;

    $("#modal-show-info #titleExp").empty().html('Entrega de Cenizas | <strong>Exp: ' + number + '</strong> - <strong>' + deceasedName + ' ' + deceasedSurname + '</strong>');
    $('#modal-show-info #todaySummary').empty().append(text)
}

/**
 * Draw personal task - installation maintenance- summary info
 */
function drawInstallationSummary(summary){

    $('#modal-show-info #modalSection').removeClass('modal-xxl').addClass('modal-md');
    $('#modal-show-info #tasks').empty();

   
    var startDate = '-'
    if(summary.start != null && summary.start != ''){
        startDate = moment(summary.start, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }
    var endDate = '-'
    if(summary.end != null && summary.end != ''){
        endDate = moment(summary.end, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }
    var allDay = summary.allDay;
    var regularity = summary.regularity;
   
    var cleaningType = '-'
    if(summary.cleaningType != null && summary.cleaningType != ''){
        cleaningType = summary.cleaningType;
    }
    var mortuary = '-'
    if(summary.mortuary != null && summary.mortuary != ''){
        mortuary = summary.mortuary;
    }
    var designed = '-'
    if(summary.designed != null && summary.designed != ''){
        designed = summary.designed;
    }
    var name = summary.name;
    var reminder = summary.reminder;
    var description = summary.description;

    var text = 
        '       <dl class="dl-horizontal">' +
        '           <dt>Evento: </dt><dd><strong>' + name + '</strong></dd>' +
        '           <dt>Fecha y hora de inicio: </dt><dd><strong>' + startDate + '</strong></dd>' +
        '           <dt>Fecha y hora de fin: </dt><dd><strong>' + endDate +'</strong></dd>' +
        '           <dt>¿Todo el día?: </dt><dd>' + allDay + '</dd>' +
        '           <dt>Periocidad: </dt><dd>' + regularity + '</dd>' +
        '           <dt>Tipo: </dt><dd>' + cleaningType + '</dd>' +
        '           <dt>Tanatorio: </dt><dd>' + mortuary + '</dd>' +
        '           <dt>Personal: </dt><dd>' + designed + '</dd>' +
        '           <dt>¿Aviso?: </dt><dd>' + reminder + '</dd>' +
        '           <dt>Descripción: </dt><dd style="white-space: pre-line;">' + description + '</dd>' +
        '       </dl>';
    ;

    $("#modal-show-info #titleExp").empty().html('Mantenimiento de Instalaciones - <strong>' + name + '</strong>');
    $('#modal-show-info #todaySummary').empty().append(text)
}

/**
 * Draw personal task - free task- summary info
 */
function drawFreeTaskSummary(summary){

    $('#modal-show-info #modalSection').removeClass('modal-xxl').addClass('modal-md');
    $('#modal-show-info #tasks').empty();
    
    var start = '-'
    if(summary.start != null && summary.start != ''){
        start = moment(summary.start, 'X').format('DD/MM/YYYY HH:mm')
    }
    var end = '-'
    if(summary.end != null && summary.end != ''){
        end = moment(summary.end, 'X').format('DD/MM/YYYY HH:mm')
    }
    var staffDesignated = '-'
    if(summary.staffDesignatedName != null && summary.staffDesignatedName != ''){
        staffDesignated = summary.staffDesignatedName
    }
    var mortuary = '-'
    if(summary.mortuaryName != null && summary.mortuaryName != ''){
        mortuary = summary.mortuaryName
    }
    var description = '-'
    if(summary.description != null && summary.description != ''){
        description = summary.description
    }

    var text = 
        '       <dl class="dl-horizontal">' +
        '           <dt>Fecha y hora inicio: </dt><dd>' + start + '</dd>' +
        '           <dt>Fecha y hora fin: </dt><dd>' + end + '</dd>' +
        '           <dt>Personal: </dt><dd>' + staffDesignated + '</dd>' +
        '           <dt>Tanatorio: </dt><dd>' + mortuary + '</dd>' +
        '           <dt>Descripción: </dt><dd style="white-space: pre-line;">' + description + '</dd>' +
        '       </dl>';
    ;

    $("#modal-show-info #titleExp").empty().html('Tarea Libre | asociada a <strong>'+ staffDesignated +'</strong>');
    $('#modal-show-info #todaySummary').empty().append(text)
}

/**
 * Draw personal task - garage task- summary info
 */
function drawGarageTaskSummary(summary){

    $('#modal-show-info #modalSection').removeClass('modal-md').addClass('modal-xxl');
    $('#modal-show-info #tasks').empty();
    
    var name = '-'
    if(summary.name != null && summary.name != ''){
        name = staffDesignated = summary.name
    }
    var start = '-'
    if(summary.start != null && summary.start != ''){
        start = moment(summary.start, 'X').format('DD/MM/YYYY HH:mm')
    }
    var staffDesignated = '-'
    if(summary.staffDesignatedName != null && summary.staffDesignatedName != ''){
        staffDesignated = summary.staffDesignatedName
    }
    var mortuary = '-'
    if(summary.mortuaryName != null && summary.mortuaryName != ''){
        mortuary = summary.mortuaryName
    }
    
    if(summary.upkeeps.length > 0){
        var listUpkeeps =
            '<fieldset>'+
            '    <legend><span class="label label-primary labelLgExp">Mantenimientos</span></legend>'+
            '    <div class="clearfix table-responsive">'+
            '        <table class="table table-striped table-bordered display" cellspacing="0" width="100%">'+
            '            <thead>'+
            '                <tr>'+
            '                    <th class="centered">#</th>'+
            '                    <th>Tarea de mantenimiento</th>'+
            '                </tr>'+
            '            </thead>'+
            '            <tbody>'
        ;

        $.each(summary.upkeeps, function(index, value){
            listUpkeeps += 
                '   <tr>'+
                '       <td style="text-align:center">' +(index + 1)+ '</td>'+
                '       <td>'+ value['name']+'</td>'+
                '   </tr>';
        })

        listUpkeeps += 
            '            </tbody>'+
            '        </table>'+
            '    </div>'+
            '</fieldset>'
        ;

        $("#tasks").append(listUpkeeps);
    }

    var text = 
        '       <dl class="dl-horizontal">' +
        '           <dt>Tarea: </dt><dd>' + name + '</dd>' +
        '           <dt>Fecha y hora: </dt><dd>' + start + '</dd>' +
        '           <dt>Personal: </dt><dd>' + staffDesignated + '</dd>' +
        '           <dt>Tanatorio: </dt><dd>' + mortuary + '</dd>' +
        '       </dl>';
    ;

    $("#modal-show-info #titleExp").empty().html('Tarea de Mantenimiento de Vehículo | <strong>'+ name +'</strong>');
    $('#modal-show-info #todaySummary').empty().append(text)
}

$(function(){
    $(".schedule-box").css("background-image", 'url(' + ROOT + 'resources/files/'+COMPANY+'/settings/logo.png)')

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    $('#backLink').click(function(event){
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
    })
    changeSpaceFooter();
    setWidthBottomToolbar();
    $(window).resize(function(){
        setWidthBottomToolbar();
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Inicializate mortuaries filters
    var mortuaries = getOwnMortuaries();
    if(mortuaries != null){
        $('#mortuary').select2({
            allowClear: true,
            language: 'es',
            placeholder: 'Selecciona un tanatorio...',
            data: mortuaries
        })
        $('#mortuary').val(null).trigger('change');

        $("#mortuary").change(function(){
            clockTimeHeader();
            loadTimeline();
        })
    }else{
        $('#mortuary').addClass('hide');
        $('#mortuary').attr('disabled', true)
    }

    // Gets timeline settings info
    getInfo();

    // Component header - Current datetime header (Sync each 5 segs)
    clockTimeHeader();
    setInterval(() => clockTimeHeader(), 30000);

    // Draw timeline structure
    loadTimeline();
    setInterval(() => loadTimeline(), 30000);

    // Go/Remove full screen
    $("#changeResolutionButton").click(function(){
        if($(this).attr('action') == 'to-max'){
            $("header").addClass('hide');
            $("aside").addClass('hide');
            $(".footer-static-bottom").addClass('hide');
            $(".content-wrapper").attr("style", 'margin-left:0!important;padding-top: 0!important;');

            $("#changeResolutionButton").attr('title', 'Salir de pantalla completa');
            $("#changeResolutionButton").attr("action", 'to-min');
            $("#changeResolutionButton").empty().html('<i class="fa fa-window-restore" aria-hidden="true"></i>')
        }else{
            $("header").removeClass('hide');
            $("aside").removeClass('hide');
            $(".footer-static-bottom").removeClass('hide');
            $(".content-wrapper").attr("style", 'margin-left:50px!important;padding-top: 50px!important;');

            $("#changeResolutionButton").attr('title', 'Ver a pantalla completa');
            $("#changeResolutionButton").attr("action", 'to-max');
            $("#changeResolutionButton").empty().html('<i class="fa fa-window-maximize" aria-hidden="true"></i>')
        }
    })
})

