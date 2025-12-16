/**  @var {string} changeTabRef Store url to change pre save */
var changeTabRef = null;

/** @var {string} expedientIdUrl Expedient ID */
var expedientIdUrl = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

/** @var {array} expedientData Expedient work order data */
var expedientData = null;

/** @var {int} limit_page Limit page for select 2 */
var limit_page = 10;

/** @var {object} langSelect2 Store select2 lang */
var langSelect2 = {
    inputTooShort: function(args) {
        return "Escribir ...";
    },
    inputTooLong: function(args) {
        return "Término demasiado largo";
    },
    errorLoading: function() {
        return "No hay resultados";
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
        return "No hay resultados";
    }
};

/**
 * Validate crematory notes length
 * 
 * @param {string} field Field
 * @return {boolean}
 */
function validateCrematoryNotes(field){
    var MAX_LINEAS = 12;
    var MAX_CHARS_POR_LINEA = 100;

    var lineasUsuario = field.split(/\r?\n/);
    let lineasFinales = [];

    for (var linea of lineasUsuario) {
        // Cortamos la línea en trozos de máximo 70 caracteres
        for (let i = 0; i < linea.length; i += MAX_CHARS_POR_LINEA) {
            lineasFinales.push(linea.slice(i, i + MAX_CHARS_POR_LINEA));
        }

        // Si la línea está vacía (solo salto), cuenta como 1 línea
        if (linea.length === 0) {
            lineasFinales.push("");
        }

        // Si ya superó el límite, ni seguimos calculando
        if (lineasFinales.length > MAX_LINEAS) {
            return false;
        }
    }

    return lineasFinales.length <= MAX_LINEAS;
}

function validateInhumationNotes(field){
    var MAX_LINEAS = 4;
    var MAX_CHARS_POR_LINEA = 100;

    var lineasUsuario = field.split(/\r?\n/);
    let lineasFinales = [];

    for (var linea of lineasUsuario) {
        // Cortamos la línea en trozos de máximo 70 caracteres
        for (let i = 0; i < linea.length; i += MAX_CHARS_POR_LINEA) {
            lineasFinales.push(linea.slice(i, i + MAX_CHARS_POR_LINEA));
        }

        // Si la línea está vacía (solo salto), cuenta como 1 línea
        if (linea.length === 0) {
            lineasFinales.push("");
        }

        // Si ya superó el límite, ni seguimos calculando
        if (lineasFinales.length > MAX_LINEAS) {
            return false;
        }
    }

    return lineasFinales.length <= MAX_LINEAS;
}

function validateTranslationNotes(field){
    var MAX_LINEAS = 5;
    var MAX_CHARS_POR_LINEA = 100;

    var lineasUsuario = field.split(/\r?\n/);
    let lineasFinales = [];

    for (var linea of lineasUsuario) {
        // Cortamos la línea en trozos de máximo 70 caracteres
        for (let i = 0; i < linea.length; i += MAX_CHARS_POR_LINEA) {
            lineasFinales.push(linea.slice(i, i + MAX_CHARS_POR_LINEA));
        }

        // Si la línea está vacía (solo salto), cuenta como 1 línea
        if (linea.length === 0) {
            lineasFinales.push("");
        }

        // Si ya superó el límite, ni seguimos calculando
        if (lineasFinales.length > MAX_LINEAS) {
            return false;
        }
    }

    return lineasFinales.length <= MAX_LINEAS;
}

function validateNotes(field){
    var MAX_LINEAS = 5;
    var MAX_CHARS_POR_LINEA = 100;

    var lineasUsuario = field.split(/\r?\n/);
    let lineasFinales = [];

    for (var linea of lineasUsuario) {
        // Cortamos la línea en trozos de máximo 70 caracteres
        for (let i = 0; i < linea.length; i += MAX_CHARS_POR_LINEA) {
            lineasFinales.push(linea.slice(i, i + MAX_CHARS_POR_LINEA));
        }

        // Si la línea está vacía (solo salto), cuenta como 1 línea
        if (linea.length === 0) {
            lineasFinales.push("");
        }

        // Si ya superó el límite, ni seguimos calculando
        if (lineasFinales.length > MAX_LINEAS) {
            return false;
        }
    }

    return lineasFinales.length <= MAX_LINEAS;
}

/**
 * Draw expedients colors on footer select2
 * 
 * @param {array} data Expedient info
 * @return {string}
 */
function formatDataExpedients(data){
    var color = 'black'
    switch(data.status){
        case '2':
            color = 'green'
        break
        case '3':
            color = 'blue'
        break
        case '6':
            color = 'orange'
        break
    }
    return '<div style="color: ' + color + ';" id="' + data.id + '">' + data.text + '</div>';
}

/**
 * Formats result for select2
 * 
 * @param {array} data Select option info
 * @return {string}
 */
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Comprueba si el expediente existe
 * 
 * @return bool
 */
function isExpedient(){
    var check

    $.ajax({
        url: uri + 'core/expedients/check.php',
        method: 'POST',
        data: {
            expedient: expedientIdUrl,
            url: window.location.href
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data)
            }catch(e){
                check = false
            }
        },
        error: function(){
            check = false
        }
    })

    return check
}

/**
 * Gets current expedient info
 * 
 * @return {array}
 */
function getExpedient(){
    $.ajax({
        url: uri + 'core/expedients/workOrder/getInfo.php',
        data: {
            ID: expedientIdUrl
        },
        type : 'POST',
        dataType: 'json',
        async: false,
        success: function(data){
            expedientData = data;
        }
    })
}

/**
 * Init pickers (date and time pickers)
 */
function init(){

    // Pickers
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
    });

    $('.datepicker').datepicker({
        todayHighlight: true,
        forceParse: false
    });
    
    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })
}

/**
 * Complete info for expedients section
 */
function inicializateExpedientSection(){

    // Expedient
    $('#formData #expedientNumber').val(expedientData.expedient.number);
    $('#formData #internalRef').val(expedientData.expedient.internalRef);
}

/**
 * Complete info for clients section
 */
function inicializateClientSection(){

    // Expedient
    $("#clientType").val(expedientData.expedient.client_type_name);
    $("#clientName").val(expedientData.expedient.client_name);
    $("#familyAssistance").val(expedientData.expedient.family_assistance);

    // Work order
    if(expedientData.workOrder != null){
        $("#clientTracing").val(expedientData.workOrder.clientTracing);
    }
}

/**
 * Complete info for carriers section
 */
function inicializateCarriersSection(){

    // Expedient
    $.each(expedientData.cars, function(index, value){
        var indexTable = index + 1;
        $("#driver" + indexTable).val(value.driver_name);
        $("#vehicle" + indexTable).val(value.car);
    })

    var funeralDateAux = '';
    if(expedientData.expedient.funeralDate != null){
        var dayAux = parseInt(moment(expedientData.expedient.funeralDate, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.funeralDate, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.funeralDate, "YYYY-MM-DD").format("MMMM")
        funeralDateAux = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    if(expedientData.expedient.funeralTime != null){
        funeralDateAux += ' ' + moment(expedientData.expedient.funeralTime, "HH:mm:ss").format("HH:mm");
    }
    $("#funeralDate").val(funeralDateAux);

    // Work order
    if(expedientData.workOrder != null){
        $("#carrierRoom").val(expedientData.workOrder.carrierRoom);
    }
}

/**
 * Complete info for deceased section
 */
function inicializateDeceasedSection(){

    // Expedient
    $("#deceasedName").val(expedientData.expedient.deceasedName + ' ' + expedientData.expedient.deceasedSurname);
    $("#deceasedNif").val(expedientData.expedient.deceasedNIF);
    if(expedientData.expedient.deceasedDate != null && expedientData.expedient.deceasedBirthday != null){
        $("#deceasedAge").val(moment(expedientData.expedient.deceasedDate, "YYYY-MM-DD").diff(moment(expedientData.expedient.deceasedBirthday, "YYYY-MM-DD"), 'years'));
    }

    var deceasedDateAux = ' ';
    if(expedientData.expedient.deceasedDate != null){
        var dayAux = parseInt(moment(expedientData.expedient.deceasedDate, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.deceasedDate, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.deceasedDate, "YYYY-MM-DD").format("MMMM")
        deceasedDateAux = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#deceasedDate").val(deceasedDateAux)
    if(expedientData.expedient.deceasedTime != null){
        $('#deceasedHour').val(moment(expedientData.expedient.deceasedTime, "HH:mm:ss").format("HH:mm"));
    }
    $("#deceasedIn").val(expedientData.expedient.deceasedLocation)
    $("#deceasedCause").val(expedientData.expedient.deceasedCause)
    
    if(parseInt(expedientData.expedient.moveJudicial) == 1){
        $("#judicial").prop('checked', true);
    }
    $("#familyContactName").val(expedientData.expedient.family_contact)
    $("#familyContactRelationship").val(expedientData.expedient.familyContactRelationship)
    $("#familyContactPhone").val(expedientData.expedient.familyContactPhone)
}

/**
 * Complete info for ark section
 */
function inicializateArkSection(){
    // Expedient
    $("#arkName").val(expedientData.expedient.arkName);

    // Work order

     // Events change
     $("#arkOther").change(function(){
        if($(this).prop('checked')){
            $("#arkOtherName").attr("readonly", false);
        }else{
            $("#arkOtherName").val('');
            $("#arkOtherName").attr("readonly", true);
        }
    })

    $("#arkThanatoplasty").change(function(){
        if($(this).prop('checked')){
            $("#arkThanatoplastyDate").attr("disabled", false);
            $("#arkThanatoplastyTime").attr("disabled", false);
        }else{
            $("#arkThanatoplastyDate").val('');
            $("#arkThanatoplastyDate").attr("disabled", true);
            $("#arkThanatoplastyTime").val('');
            $("#arkThanatoplastyTime").attr("disabled", true);
        }
    })

    $("#arkThanatopraxy").change(function(){
        if($(this).prop('checked')){
            $("#arkThanatopraxyDate").attr("disabled", false);
            $("#arkThanatopraxyTime").attr("disabled", false);
        }else{
            $("#arkThanatopraxyDate").val('');
            $("#arkThanatopraxyDate").attr("disabled", true);
            $("#arkThanatopraxyTime").val('');
            $("#arkThanatopraxyTime").attr("disabled", true);
        }
    })

    $("#arkCTransient").change(function(){
        if($(this).prop('checked')){
            $("#arkCTransientDate").attr("disabled", false);
            $("#arkCTransientTime").attr("disabled", false);
        }else{
            $("#arkCTransientDate").val('');
            $("#arkCTransientDate").attr("disabled", true);
            $("#arkCTransientTime").val('');
            $("#arkCTransientTime").attr("disabled", true);
        }
    })

    $("#arkEmbalmment").change(function(){
        if($(this).prop('checked')){
            $("#arkEmbalmmentDate").attr("disabled", false);
            $("#arkEmbalmmentTime").attr("disabled", false);
        }else{
            $("#arkEmbalmmentDate").val('');
            $("#arkEmbalmmentDate").attr("disabled", true);
            $("#arkEmbalmmentTime").val('');
            $("#arkEmbalmmentTime").attr("disabled", true);
        }
    })

    $("#arkClothesYes").change(function(){
        if($(this).prop('checked')){
            $("#arkClothesNo").prop('checked', false)
        }
    })

    $("#arkClothesNo").change(function(){
        if($(this).prop('checked')){
            $("#arkClothesYes").prop('checked', false)
        }
    })

    if(expedientData.workOrder != null){

        if(parseInt(expedientData.workOrder.arkCross) == 1){
            $("#arkCross").prop('checked', true);
        }
        if(parseInt(expedientData.workOrder.arkJesus) == 1){
            $("#arkJesus").prop('checked', true);
        }
        if(parseInt(expedientData.workOrder.arkOther) == 1){
            $("#arkOther").prop('checked', true).trigger('change')
            $("#arkOtherName").val(expedientData.workOrder.arkOtherName);
        }
    
        $("#arkAesthetics").val(expedientData.workOrder.arkAesthetics);
    
        $("#arkClothes").val(expedientData.workOrder.arkClothes);

        if(parseInt(expedientData.workOrder.arkClothesPhoto) == 1){
            $("#arkClothesPhoto").prop('checked', true);
        }
        if(parseInt(expedientData.workOrder.arkClothesRosary) == 1){
            $("#arkClothesRosary").prop('checked', true);
        }
        if(parseInt(expedientData.workOrder.arkClothesOwn) == 1){
            $("#arkClothesOwn").prop('checked', true);
        }

        if(parseInt(expedientData.workOrder.arkClothesYes) == 1){
            $("#arkClothesYes").prop('checked', true);
        }

        if(parseInt(expedientData.workOrder.arkClothesNo) == 1){
            $("#arkClothesNo").prop('checked', true);
        }
    
        $("#arkPersonalItems").val(expedientData.workOrder.arkPersonalItems);

        if(parseInt(expedientData.workOrder.arkPersonalItemsPacemaker) == 1){
            $("#arkPersonalItemsPacemaker").prop('checked', true);
        }
        if(parseInt(expedientData.workOrder.arkPersonalItemsShroud) == 1){
            $("#arkPersonalItemsShroud").prop('checked', true);
        }
    
        if(parseInt(expedientData.workOrder.arkThanatoplasty) == 1){
            $("#arkThanatoplasty").prop('checked', true).trigger('change');
        }
        if(expedientData.workOrder.arkThanatoplastyDate != null){
            $("#arkThanatoplastyDate").val(moment(expedientData.workOrder.arkThanatoplastyDate, 'X').format('DD/MM/YYYY'));
        }
        if(expedientData.workOrder.arkThanatoplastyTime != null){
            $("#arkThanatoplastyTime").val(moment(expedientData.workOrder.arkThanatoplastyTime, 'X').format('HH:mm'));
        }
    
        if(parseInt(expedientData.workOrder.arkThanatopraxy) == 1){
            $("#arkThanatopraxy").prop('checked', true).trigger('change');
        }
        if(expedientData.workOrder.arkThanatopraxyDate != null){
            $("#arkThanatopraxyDate").val(moment(expedientData.workOrder.arkThanatopraxyDate, 'X').format('DD/MM/YYYY'));
        }
        if(expedientData.workOrder.arkThanatopraxyTime != null){
            $("#arkThanatopraxyTime").val(moment(expedientData.workOrder.arkThanatopraxyTime, 'X').format('HH:mm'));
        }
    
        if(parseInt(expedientData.workOrder.arkCTransient) == 1){
            $("#arkCTransient").prop('checked', true).trigger('change');
        }
        if(expedientData.workOrder.arkCTransientDate != null){
            $("#arkCTransientDate").val(moment(expedientData.workOrder.arkCTransientDate, 'X').format('DD/MM/YYYY'));
        }
        if(expedientData.workOrder.arkCTransientTime != null){
            $("#arkCTransientTime").val(moment(expedientData.workOrder.arkCTransientTime, 'X').format('HH:mm'));
        }
    
        if(parseInt(expedientData.workOrder.arkEmbalmment) == 1){
            $("#arkEmbalmment").prop('checked', true).trigger('change');
        }
        if(expedientData.workOrder.arkEmbalmmentDate != null){
            $("#arkEmbalmmentDate").val(moment(expedientData.workOrder.arkEmbalmmentDate, 'X').format('DD/MM/YYYY'));
        }
        if(expedientData.workOrder.arkEmbalmmentTime != null){
            $("#arkEmbalmmentTime").val(moment(expedientData.workOrder.arkEmbalmmentTime, 'X').format('HH:mm'));
        }
    
        $("#arkMortuaryPractitioner").val(expedientData.workOrder.arkMortuaryPractitioner);
        $("#arkMortuaryPractitionerNif").val(expedientData.workOrder.arkMortuaryPractitionerNif);
    }
}

/**
 * Complete info for velation section
 */
function inicializateVelationSection(){
    // Expedient
    $("#deceasedMortuary").val(expedientData.expedient.deceasedMortuaryName);
    $("#deceasedRoom").val(expedientData.expedient.deceasedRoom);

    // Velacion 1
    var startvelationDate1 = '';
    if(expedientData.expedient.start_velacion_date_v1 != null){
        var dayAux = parseInt(moment(expedientData.expedient.start_velacion_date_v1, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.start_velacion_date_v1, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.start_velacion_date_v1, "YYYY-MM-DD").format("MMMM")
        startvelationDate1 = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#startVelacionDate1").val(startvelationDate1);
    if(expedientData.expedient.start_velacion_time_v1 != null){
        $('#startVelacionTime1').val(moment(expedientData.expedient.start_velacion_time_v1, "HH:mm:ss").format("HH:mm"));
    }

    var endVelationDate1 = '';
    if(expedientData.expedient.end_velacion_date_v1 != null){
        var dayAux = parseInt(moment(expedientData.expedient.end_velacion_date_v1, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.end_velacion_date_v1, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.end_velacion_date_v1, "YYYY-MM-DD").format("MMMM")
        endVelationDate1 = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#endVelacionDate1").val(endVelationDate1);

    if(expedientData.expedient.end_velacion_time_v1 != null){
        $('#endVelacionTime1').val(moment(expedientData.expedient.end_velacion_time_v1, "HH:mm:ss").format("HH:mm"));
    }

    // Velacion 2
    var startVelationDate2 = '';
    if(expedientData.expedient.start_velacion_date_v2 != null){
        var dayAux = parseInt(moment(expedientData.expedient.start_velacion_date_v2, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.start_velacion_date_v2, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.start_velacion_date_v2, "YYYY-MM-DD").format("MMMM")
        startVelationDate2 = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#startVelacionDate2").val(startVelationDate2);
    if(expedientData.expedient.start_velacion_time_v2 != null){
        $('#startVelacionTime2').val(moment(expedientData.expedient.start_velacion_time_v2, "HH:mm:ss").format("HH:mm"));
    }

    var endVelationDate2 = '';
    if(expedientData.expedient.end_velacion_date_v2 != null){
        var dayAux = parseInt(moment(expedientData.expedient.end_velacion_date_v2, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.end_velacion_date_v2, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.end_velacion_date_v2, "YYYY-MM-DD").format("MMMM")
        endVelationDate2 = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#endVelacionDate2").val(endVelationDate2);

    if(expedientData.expedient.end_velacion_time_v2 != null){
        $('#endVelacionTime2').val(moment(expedientData.expedient.end_velacion_time_v2, "HH:mm:ss").format("HH:mm"));
    }

    // Work order
    if(expedientData.workOrder != null){
        if(parseInt(expedientData.workOrder.velationCatering) == 1){
            $("#velationCatering").prop('checked', true)
        }
        if(parseInt(expedientData.workOrder.velationMemoriesScreen) == 1){
            $("#velationMemoriesScreen").prop('checked', true)
        }
        if(parseInt(expedientData.workOrder.velationPrivate) == 1){
            $("#velationPrivate").prop('checked', true)
        }
        if(parseInt(expedientData.workOrder.velationArkClosed) == 1){
            $("#velationArkClosed").prop('checked', true)
        }
        if(parseInt(expedientData.workOrder.velationPhotoFrame) == 1){
            $("#velationPhotoFrame").prop('checked', true)
        }
    }
}

/**
 * Complete info for ceremony section
 */
function inicializateCeremonySection(){

    // Expedient
    var churchName = '';
    if(expedientData.expedient.churchName != null){
        var churchName = (expedientData.expedient.churchLabel == 'Otro' ? expedientData.expedient.otherCeremony : expedientData.expedient.churchLabel == 'Iglesia Parroquial' ? expedientData.expedient.churchLabel + ' de': expedientData.expedient.churchLabel) + ' ' + (expedientData.expedient.churchName != null ? expedientData.expedient.churchName : '')
    }else{
        if(expedientData.expedient.churchLabel == 'Otro'){
            churchName = expedientData.expedient.otherCeremony;
        }
    }
    $("#church").val(churchName);

    var ceremonyDate = '';
    if(expedientData.expedient.ceremonyDate != null){
        var dayAux = parseInt(moment(expedientData.expedient.ceremonyDate, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.ceremonyDate, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.ceremonyDate, "YYYY-MM-DD").format("MMMM")
        ceremonyDate = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#ceremonyDate").val(ceremonyDate);

    if(expedientData.expedient.ceremonyTime != null){
        $('#ceremonyTime').val(moment(expedientData.expedient.ceremonyTime, "HH:mm:ss").format("HH:mm"));
    }

    // Work order
    if(expedientData.workOrder != null){
        if(parseInt(expedientData.workOrder.ceremonyResponse) == 1){
            $("#ceremonyResponse").prop('checked', true)
        }
        $("#ceremonyResponsePlace").val(expedientData.workOrder.ceremonyResponsePlace);
    
        if(parseInt(expedientData.workOrder.ceremonyFamilyWaitChurch) == 1){
            $("#ceremonyFamilyWaitChurch").prop('checked', true)
        }
        $("#ceremonyMusicalService").val(expedientData.workOrder.ceremonyMusicalService);
    
        if(parseInt(expedientData.workOrder.ceremonyBodyPresent) == 1){
            $("#ceremonyBodyPresent").prop('checked', true)
        }
        if(parseInt(expedientData.workOrder.ceremonyUrn) == 1){
            $("#ceremonyUrn").prop('checked', true)
        }
        $("#ceremonyWhoTakesUrn").val(expedientData.workOrder.ceremonyWhoTakesUrn);

        $("#ceremonyChurchPayment").val(expedientData.workOrder.ceremonyChurchPayment);
    }
}

/**
 * Complete info for crematory section
 */
function inicializateCrematorySection(){

    // Expedient
    $("#crematorium").val(expedientData.expedient.crematoriumName)

    var crematoriumEntryDate = '';
    if(expedientData.expedient.crematoriumEntry != null){
        var dayAux = parseInt(moment(expedientData.expedient.crematoriumEntry, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.crematoriumEntry, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.crematoriumEntry, "YYYY-MM-DD").format("MMMM")
        crematoriumEntryDate = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#crematoriumEntryDate").val(crematoriumEntryDate);

    if(expedientData.expedient.crematoriumEntry != null){
        $('#crematoriumEntryTime').val(moment(expedientData.expedient.crematoriumEntry, "YYYY-MM-DD HH:mm:ss").format("HH:mm"));
    }

    var crematoriumLeavingDate = '';
    if(expedientData.expedient.crematoriumLeaving != null){
        var dayAux = parseInt(moment(expedientData.expedient.crematoriumLeaving, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.crematoriumLeaving, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.crematoriumLeaving, "YYYY-MM-DD").format("MMMM")
        crematoriumLeavingDate = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#crematoriumLeavingDate").val(crematoriumLeavingDate);

    if(expedientData.expedient.crematoriumLeaving != null){
        $('#crematoriumLeavingTime').val(moment(expedientData.expedient.crematoriumLeaving, "YYYY-MM-DD HH:mm:ss").format("HH:mm"));
    }
    $('#trazabilityId').val(expedientData.expedient.trazabilityId);
    $('#crematoriumTechnical').val(expedientData.expedient.crematorium_technical);
    $('#crematoriumContactPerson').val(expedientData.expedient.crematoriumContactPerson);
    $('#crematoriumContactPhonePerson').val(expedientData.expedient.crematoriumContactPhonePerson);

    if(parseInt(expedientData.expedient.crematoriumIntroduction) == 1){
        $("#crematoriumIntroduction").prop('checked', true);
    }
    if(expedientData.expedient.crematoriumArriveTime != null){
        $('#crematoriumArriveTime').val(moment(expedientData.expedient.crematoriumArriveTime, "HH:mm:ss").format("HH:mm"));
    }
    if(parseInt(expedientData.expedient.crematoriumWaitOnRoom) == 1){
        $("#crematoriumWaitOnRoom").prop('checked', true);
    }
    if(parseInt(expedientData.expedient.crematoriumVaseBio) == 1){
        $("#crematoriumVaseBio").prop('checked', true);
    }

    $('#authName').val(expedientData.expedient.authName);
    $('#authDni').val(expedientData.expedient.authDni);
    $('#authContactPhone').val(expedientData.expedient.authContactPhone);

    var authDate = '';
    if(expedientData.expedient.authDate != null){
        var dayAux = parseInt(moment(expedientData.expedient.authDate, "X").format("DD"))
        var dayNameAux = moment(expedientData.expedient.authDate, "X").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.authDate, "X").format("MMMM")
        authDate = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#authDate").val(authDate);

    if(expedientData.expedient.authTime != null){
        $('#authTime').val(moment(expedientData.expedient.authTime, "X").format("HH:mm"));
    }

    $('#authPlace').val(expedientData.expedient.authPlace);

    // Work order
    if(expedientData.workOrder != null){
        if(expedientData.workOrder.crematoryCollectingAshesDate != null){
            $('#crematoryCollectingAshesDate').val(moment(expedientData.workOrder.crematoryCollectingAshesDate, "X").format("DD/MM/YYYY"));
        }
        if(expedientData.workOrder.crematoryCollectingAshesTime != null){
            $('#crematoryCollectingAshesTime').val(moment(expedientData.workOrder.crematoryCollectingAshesTime, "X").format("HH:mm"));
        }
        $("#crematoryUrn").val(expedientData.workOrder.crematoryUrn)

        $("#crematoryNotes").val(expedientData.workOrder.crematoryNotes)
    }
}

/**
 * Complete info for inhumation section
 */
function inicializateInhumationSection(){

    // Expedient
    var cemeteryName = '';
    if(expedientData.expedient.cemeteryName != null){
        if(expedientData.expedient.cemeteryLabel == 'Otro'){
            cemeteryName = expedientData.expedient.otherInhumation + ' ' + expedientData.expedient.cemeteryName;
        }else{
            cemeteryName = expedientData.expedient.cemeteryName;
        }
    }else{
        if(expedientData.expedient.cemeteryLabel == 'Otro'){
            cemeteryName = expedientData.expedient.otherInhumation;
        }
    }
    $("#cemetery").val(cemeteryName);

    var funeralDateBurial = '';
    if(expedientData.expedient.funeralDateBurial != null){
        var dayAux = parseInt(moment(expedientData.expedient.funeralDateBurial, "YYYY-MM-DD").format("DD"))
        var dayNameAux = moment(expedientData.expedient.funeralDateBurial, "YYYY-MM-DD").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.funeralDateBurial, "YYYY-MM-DD").format("MMMM")
        funeralDateBurial = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
    }
    $("#funeralDateBurial").val(funeralDateBurial);

    if(expedientData.expedient.funeralDateBurial != null){
        $('#funeralTimeBurial').val(moment(expedientData.expedient.funeralTimeBurial, "HH:mm:ss").format("HH:mm"));
    }
    $('#niche').val(expedientData.expedient.niche)
    $('#regime').val(expedientData.expedient.niche_regime)
    $('#nicheHeight').val(expedientData.expedient.nicheHeight)
    $('#funeralNicheNumber').val(expedientData.expedient.funeralNicheNumber)

    $('#exhumation1').val(expedientData.expedient.exhumation1)
    var exhumationDate1 = '';
    if(expedientData.expedient.exhumationDate1 != null){
        var dayAux = parseInt(moment(expedientData.expedient.exhumationDate1, "X").format("DD"))
        var dayNameAux = moment(expedientData.expedient.exhumationDate1, "X").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.exhumationDate1, "X").format("MMMM")
        var yearAux = moment(expedientData.expedient.exhumationDate1, "X").format("YYYY")
        exhumationDate1 = dayNameAux + ' ' + dayAux + ' de ' + monthAux + ' de ' + yearAux;
    }
    $("#exhumationDate1").val(exhumationDate1);
    if(expedientData.expedient.exhumation1 == null || expedientData.expedient.exhumation1 == ''){
        $("#inhumationReburial1").prop('disabled', true);
        $("#inhumationNotes1").prop('disabled', true);
    }

    $('#exhumation2').val(expedientData.expedient.exhumation2)
    var exhumationDate2 = '';
    if(expedientData.expedient.exhumationDate2 != null){
        var dayAux = parseInt(moment(expedientData.expedient.exhumationDate2, "X").format("DD"))
        var dayNameAux = moment(expedientData.expedient.exhumationDate2, "X").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.exhumationDate2, "X").format("MMMM")
        var yearAux = moment(expedientData.expedient.exhumationDate2, "X").format("YYYY")
        exhumationDate2 = dayNameAux + ' ' + dayAux + ' de ' + monthAux + ' de ' + yearAux;
    }
    $("#exhumationDate2").val(exhumationDate2);
    if(expedientData.expedient.exhumation2 == null || expedientData.expedient.exhumation2 == ''){
        $("#inhumationReburial2").prop('disabled', true);
        $("#inhumationNotes2").prop('disabled', true);
    }

    $('#exhumation3').val(expedientData.expedient.exhumation3)
    var exhumationDate3 = '';
    if(expedientData.expedient.exhumationDate3 != null){
        var dayAux = parseInt(moment(expedientData.expedient.exhumationDate3, "X").format("DD"))
        var dayNameAux = moment(expedientData.expedient.exhumationDate3, "X").format("dddd")
        dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
        var monthAux = moment(expedientData.expedient.exhumationDate3, "X").format("MMMM")
        var yearAux = moment(expedientData.expedient.exhumationDate3, "X").format("YYYY")
        exhumationDate3 = dayNameAux + ' ' + dayAux + ' de ' + monthAux + ' de ' + yearAux;
    }
    $("#exhumationDate3").val(exhumationDate3);
    if(expedientData.expedient.exhumation3 == null || expedientData.expedient.exhumation3 == ''){
        $("#inhumationReburial3").prop('disabled', true);
        $("#inhumationNotes3").prop('disabled', true);
    }

    $("#exhumation").val(expedientData.expedient.exhumation);

    // Work order
    if(expedientData.workOrder != null){

        $("#inhumationStreet").val(expedientData.workOrder.inhumationStreet)

        $("#inhumationBlock").val(expedientData.workOrder.inhumationBlock)

        if(parseInt(expedientData.workOrder.inhumationAttendOpening) == 1){
            $("#inhumationAttendOpening").prop('checked', true)
        }
        $("#inhumationDeclarant").val(expedientData.workOrder.inhumationDeclarant)

        $("#inhumationDeclarantPhone").val(expedientData.workOrder.inhumationDeclarantPhone)

        if(expedientData.workOrder.inhumationDeclarantDate != null){
            $('#inhumationDeclarantDate').val(moment(expedientData.workOrder.inhumationDeclarantDate, "X").format("DD/MM/YYYY"));
        }
        if(expedientData.workOrder.inhumationDeclarantTime != null){
            $('#inhumationDeclarantTime').val(moment(expedientData.workOrder.inhumationDeclarantTime, "X").format("HH:mm"));
        }
        if(parseInt(expedientData.workOrder.inhumationIronCross) == 1){
            $("#inhumationIronCross").prop('checked', true)
        }
        $("#inhumationIronCrossOther").val(expedientData.workOrder.inhumationIronCrossOther)
    
        if(parseInt(expedientData.workOrder.inhumationReburial1) == 1){
            $("#inhumationReburial1").prop('checked', true)
        }
        $("#inhumationNotes1").val(expedientData.workOrder.inhumationNotes1)
    
        if(parseInt(expedientData.workOrder.inhumationReburial2) == 1){
            $("#inhumationReburial2").prop('checked', true)
        }
        $("#inhumationNotes2").val(expedientData.workOrder.inhumationNotes2)
    
        if(parseInt(expedientData.workOrder.inhumationReburial3) == 1){
            $("#inhumationReburial3").prop('checked', true)
        }
        $("#inhumationNotes3").val(expedientData.workOrder.inhumationNotes3)
        
        if(parseInt(expedientData.workOrder.inhumationRemoveTombstone) == 1){
            $("#inhumationRemoveTombstone").prop('checked', true)
        }
        $("#inhumationRemoveTombstoneNote").val(expedientData.workOrder.inhumationRemoveTombstoneNote)

        $("#inhumationNotes").val(expedientData.workOrder.inhumationNotes)
    }
}

/**
 * Complete info for translation section
 */
function inicializateTranslationSection(){

    // Expedient
    $('#moveFuneralHome').val(expedientData.expedient.moveFuneralHome);
    $('#moveFuneralHomePhone').val(expedientData.expedient.moveFuneralHomePhone);
    $('#moveContactPerson').val(expedientData.expedient.moveContactPerson);
    $('#moveContactPhone').val(expedientData.expedient.moveContactPhone);
    $('#moveCollectionProvince').val(expedientData.expedient.moveCollectionProvince);
    $('#moveCollectionLocality').val(expedientData.expedient.moveCollectionLocality);
    $('#moveCollectionAddress').val(expedientData.expedient.moveCollectionAddress);

    var moveDestinationAddress = '';
    if(expedientData.expedient.moveDestinationAddress != null && expedientData.expedient.moveDestinationAddress != ''){
        moveDestinationAddress = expedientData.expedient.moveDestinationAddress;
    }
    if(expedientData.expedient.moveDestinationLocality != null && expedientData.expedient.moveDestinationLocality != ''){
        moveDestinationAddress += ', ' +  expedientData.expedient.moveDestinationLocality;
    }
    if(expedientData.expedient.moveDestinationProvince != null && expedientData.expedient.moveDestinationProvince != ''){
        moveDestinationAddress += ', ' +  expedientData.expedient.moveDestinationProvince;
    }
    $('#moveDestinationAddress').val(moveDestinationAddress);

    if(parseInt(expedientData.expedient.moveVia) === 0){
        $('#moveViaRoad').prop('checked', true);
        $('#roadCarCollection2').val(expedientData.expedient.carCollection2);
        $('#roadStaffTransfer1').val(expedientData.expedient.staffTransfer1);
        $('#roadStaffTransfer2').val(expedientData.expedient.staffTransfer2);

        var translationRoadLeavingDate = '';
        if(expedientData.expedient.moveLeavingDate != null){
            var dayAux = parseInt(moment(expedientData.expedient.moveLeavingDate, "YYYY-MM-DD").format("DD"))
            var dayNameAux = moment(expedientData.expedient.moveLeavingDate, "YYYY-MM-DD").format("dddd")
            dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
            var monthAux = moment(expedientData.expedient.moveLeavingDate, "YYYY-MM-DD").format("MMMM")
            translationRoadLeavingDate = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
        }
        $('#translationRoadLeavingDate').val(translationRoadLeavingDate);

        if(expedientData.expedient.moveLeavingTime != null){
            $('#translationRoadLeavingTime').val(moment(expedientData.expedient.moveLeavingTime, "HH:mm:ss").format("HH:mm"));
        }

        var translationRoadArrivalDate = '';
        if(expedientData.expedient.arrivalDate != null){
            var dayAux = parseInt(moment(expedientData.expedient.arrivalDate, "YYYY-MM-DD").format("DD"))
            var dayNameAux = moment(expedientData.expedient.arrivalDate, "YYYY-MM-DD").format("dddd")
            dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
            var monthAux = moment(expedientData.expedient.arrivalDate, "YYYY-MM-DD").format("MMMM")
            translationRoadArrivalDate = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
        }
        $('#translationRoadArrivalDate').val(translationRoadArrivalDate);

        if(expedientData.expedient.arrivalTime != null){
            $('#translationRoadArrivalTime').val(moment(expedientData.expedient.arrivalTime, "X").format("HH:mm"));
        }

        // Disabled fields for VIA AEREA
        $("#translationResponsibleSealed").attr('disabled', true);
        $("#translationLTA").attr('disabled', true);

    }else if(parseInt(expedientData.expedient.moveVia) === 1){
        $('#moveViaAir').prop('checked', true);

        // Expedient
        if(expedientData.expedient.agency != 'null'){
            $('#agency').val(expedientData.expedient.agency);
        }
        if(expedientData.expedient.agencyContact != 'null'){
            $('#agencyContact').val(expedientData.expedient.agencyContact);
        }
        if(expedientData.expedient.agencyContactPhone != 'null'){
            $('#agencyContactPhone').val(expedientData.expedient.agencyContactPhone);
        }

        $('#airCarCollection2').val(expedientData.expedient.carCollection2);
        $('#airStaffTransfer1').val(expedientData.expedient.staffTransfer1);
        $('#airStaffTransfer2').val(expedientData.expedient.staffTransfer2);

        if(expedientData.expedient.airportOrigin != 'null'){
            $('#airportOrigin').val(expedientData.expedient.airportOrigin);
        }
        if(expedientData.expedient.arrivalAirport != 'null'){
            $('#arrivalAirport').val(expedientData.expedient.arrivalAirport);
        }
        if(expedientData.expedient.flightNumber != 'null'){
            $('#flightNumber').val(expedientData.expedient.flightNumber);
        }

        var departureDateAux = '';
        if(expedientData.expedient.departureDate != null){
            var dayAux = parseInt(moment(expedientData.expedient.departureDate, "YYYY-MM-DD").format("DD"))
            var dayNameAux = moment(expedientData.expedient.departureDate, "YYYY-MM-DD").format("dddd")
            dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
            var monthAux = moment(expedientData.expedient.departureDate, "YYYY-MM-DD").format("MMMM")
            departureDateAux = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
        }
        $('#departureDate').val(departureDateAux);

        if(expedientData.expedient.departureTime != null){
            $('#departureTime').val(moment(expedientData.expedient.departureTime, "X").format("HH:mm"));
        }

        var arrivalDateAux = '';
        if(expedientData.expedient.arrivalDate != null){
            var dayAux = parseInt(moment(expedientData.expedient.arrivalDate, "YYYY-MM-DD").format("DD"))
            var dayNameAux = moment(expedientData.expedient.arrivalDate, "YYYY-MM-DD").format("dddd")
            dayNameAux = dayNameAux.charAt(0).toUpperCase() + dayNameAux.slice(1);
            var monthAux = moment(expedientData.expedient.arrivalDate, "YYYY-MM-DD").format("MMMM")
            arrivalDateAux = dayNameAux + ' ' + dayAux + ' de ' + monthAux;
        }
        $('#arrivalDate').val(arrivalDateAux);

        if(expedientData.expedient.arrivalTime != null){
            $('#arrivalTime').val(moment(expedientData.expedient.arrivalTime, "X").format("HH:mm"));
        }

        // Work order
        if(expedientData.workOrder != null){
            $("#translationLTA").val(expedientData.workOrder.translationLTA);

            // Responsable Precintado, Embalado
            $('.staff-collection').select2({
                language: langSelect2,
                placeholder: '--',
                allowClear: true,
                ajax: {
                    url: uri+'core/expedients/services/corpseCollectionData2.php',
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

            if(expedientData.workOrder.translationResponsibleSealed != null){
                if($('#translationResponsibleSealed').find("option[value='" + expedientData.workOrder.translationResponsibleSealed + "']").length) {
                    $('#translationResponsibleSealed').val(expedientData.workOrder.translationResponsibleSealed).trigger('change');
                }else { 
                    var newOption = new Option(expedientData.workOrder.translationResponsibleSealedName, expedientData.workOrder.translationResponsibleSealed, true, true);
                    $('#translationResponsibleSealed').append(newOption).trigger('change');
                }
            }
        }

        // Disabled fields for VIA TERRESTRE
        $("#translationRoadLeavingDate").attr('disabled', true);
        $("#translationRoadLeavingTime").attr('disabled', true);
        $("#translationRoadArrivalDate").attr('disabled', true);
        $("#translationRoadArrivalTime").attr('disabled', true);
    }

    // Work order
    if(expedientData.workOrder != null){
        $("#translationMoveContactEmail").val(expedientData.workOrder.translationMoveContactEmail)
        
        $("#translationMoveDestinationCountry").val(expedientData.workOrder.translationMoveDestinationCountry)

        $("#translationDepositAirport").val(expedientData.workOrder.translationDepositAirport);

        if(expedientData.workOrder.translationDepositDate != null){
            $('#translationDepositDate').val(moment(expedientData.workOrder.translationDepositDate, "X").format("DD/MM/YYYY"));
        }
        if(expedientData.workOrder.translationDepositTime != null){
            $('#translationDepositTime').val(moment(expedientData.workOrder.translationDepositTime, "X").format("HH:mm"));
        }
        $("#translationDepositWeight").val(expedientData.workOrder.translationDepositWeight)

        $("#translationNotes").val(expedientData.workOrder.translationNotes)
    }
}

/**
 * Complete info for communication section
 */
function inicializateCommunicationSection(){

    // Expedient
    expedientData.expedient.webConfirm == 0 ||expedientData.expedient.webConfirm == null ? $('#webConfirm').prop('checked', false) : $('#webConfirm').prop('checked', true)
    expedientData.expedient.showAgeObituaryWeb == 0 ||expedientData.expedient.showAgeObituaryWeb == null ? $('#showAgeObituaryWeb').prop('checked', true) : $('#showAgeObituaryWeb').prop('checked', false)
    expedientData.expedient.showFinalDestinationWeb == 0 ||expedientData.expedient.showFinalDestinationWeb == null ? $('#showFinalDestinationWeb').prop('checked', false) : $('#showFinalDestinationWeb').prop('checked', true)
    expedientData.expedient.showVelationWeb == 0 ||expedientData.expedient.showVelationWeb == null ? $('#showVelationWeb').prop('checked', false) : $('#showVelationWeb').prop('checked', true)
    expedientData.expedient.showCeremonyWeb == 0 ||expedientData.expedient.showCeremonyWeb == null ? $('#showCeremonyWeb').prop('checked', false) : $('#showCeremonyWeb').prop('checked', true)
    
    // Comunciation items
    var html = '';
    $.each(expedientData.communication, function(index, value){

        var dateValue = value['date'] != null ? moment(value['date'], 'X').format('DD/MM/YYYY') : '';
        var photoValue = value['photo'] != null && parseInt(value['photo']) == 1 ? 'checked' : '';

        html +=  
            '   <div class="row communication-item" item="'+index+'"> '+
            '       <div class="col-xs-1 hide">'+
            '           <input type="text" class="form-control" id="communicationHiringID-'+index+'" value="'+value.ID+'" disabled>'+
            '       </div>'+
            '       <div class="col-xs-1 hide">'+
            '           <input type="text" class="form-control" id="communicationID-'+index+'" value="'+value.work_order_communication_id+'" disabled>'+
            '       </div>'+
            '       <div class="col-xs-4">'+
            '           <label class="toNormal">Periódico</label> '+
            '           <input type="text" class="form-control" name="communicationProductName-'+index+'" id="communicationProductName-'+index+'" value="'+value.product_name+'" readonly>'+
            '       </div>'+
            '       <div class="col-xs-4">'+
            '           <label class="toNormal">Modelo</label> '+
            '           <input type="text" class="form-control" name="communicationModelName-'+index+'" id="communicationModelName-'+index+'" value="'+value.model_name+'" readonly>'+
            '       </div>'+
            '       <div class="col-xs-1">'+
            '           <label class="toNormal">Fecha</label>'+
            '           <div class="input-group date">'+
            '               <input type="text" class="form-control datepicker" name="communicationDate-'+index+'" id="communicationDate-'+index+'" value="'+dateValue+'" autocomplete="off">'+
            '               <div class="input-group-addon">'+
            '                   <i class="fa fa-calendar"></i>'+
            '               </div>'+
            '           </div>'+
            '           <span class="inputError" id="communicationDate-'+index+'Error"></span>'+
            '       </div>'+
            '       <div class="col-xs-1">'+
            '           <label class="checkbox-inline" style="margin-top: 20px;margin-left: 10px;">'+
            '               <input type="checkbox" id="communicationPhoto-'+index+'" name="communicationPhoto-'+index+'" class="minimal mortuaryReg" '+photoValue+'> <span class="bolder">Foto</span>'+
            '           </label>'+
            '       </div>'+
            '   </div>'
    })
    $("#comunicationSection").append(html)
}

/**
 * Complete info for flowers section
 */
function inicializateFlowersSection(){

    // Expedient
    var html = '';
    $.each(expedientData.flowers, function(index, value){

        var dateValue = value['date'] != null ? moment(value['date'], 'X').format('DD/MM/YYYY') : '';
        var timeValue = value['time'] != null ? moment(value['time'], 'X').format('HH:mm') : '';

        html +=
            '   <div class="row flowers-item" item="'+index+'"> '+
            '       <div class="col-xs-1 hide">'+
            '           <input type="text" class="form-control" id="flowerID-'+index+'" value="'+value.work_order_flowers_id+'" disabled>'+
            '       </div>'+
            '       <div class="col-xs-1 hide">'+
            '           <input type="text" class="form-control" id="flowersHiringID-'+index+'" value="'+value.ID+'" disabled>'+
            '       </div>'+
            '       <div class="col-xs-3">'+
            '           <label class="toNormal">Proveedor</label> '+
            '           <input type="text" class="form-control" name="flowersSupplierName-'+index+'" id="flowersSupplierName-'+index+'" value="'+value.supplier_name+'" readonly>'+
            '       </div>'+
            '       <div class="col-xs-3">'+
            '           <label class="toNormal">Modelo</label> '+
            '           <input type="text" class="form-control" name="flowersModelName-'+index+'" id="flowersModelName-'+index+'" value="'+value.model_name+'" readonly>'+
            '       </div>'+
            '       <div class="col-xs-4">'+
            '           <label class="toNormal">Texto</label> '+
            '           <input type="text" class="form-control" name="flowersTexts-'+index+'" id="flowersTexts-'+index+'" value="'+value.texts+'" readonly>'+
            '       </div>'+
            '       <div class="col-xs-1">'+
            '           <label class="toNormal">Fecha</label>'+
            '           <div class="input-group date">'+
            '               <input type="text" class="form-control datepicker" name="flowersDate-'+index+'" id="flowersDate-'+index+'" autocomplete="off" value="'+dateValue+'">'+
            '               <div class="input-group-addon">'+
            '                   <i class="fa fa-calendar"></i>'+
            '               </div>'+
            '           </div>'+
            '           <span class="inputError" id="flowersDate-'+index+'Error"></span>'+
            '       </div>'+
            '       <div class="col-xs-1">'+
            '           <label class="toNormal">Hora</label>'+
            '           <div class="input-group bootstrap-timepicker timepicker">'+
            '               <input type="text" class="form-control time" name="flowersTime-'+index+'" id="flowersTime-'+index+'" autocomplete="off" value="'+timeValue+'">'+
            '               <div class="input-group-addon">'+
            '                   <i class="cursor-pointer fa fa-clock-o"></i>'+
            '               </div>'+
            '           </div>'+
            '           <span class="inputError" id="flowersTime-'+index+'Error"></span>'+
            '       </div>'+
            '   </div>'
    })

    $("#flowersSection").append(html);
}

/**
 * Complete info for notes section
 */
function inicializateNotesSection(){
    if(expedientData.workOrder != null){
        $("#notes").val(expedientData.workOrder.notes)
    }
}

/**
 * Checks save work order form
 * 
 * @return {array} data Data
 */
function checkSaveForm(mode = null){
    $('#saveForm').attr('disabled', true);

    var check = 0;
    var data = [];
    var existsChanges = 0;
    var checkCrematoryNotes = false;
    var checkInhumationNotes = false;
    var checkTranslationNotes = false;
    var checkNotes = false;

    $.each($('#formData').serializeArray(), function(index, elem){
        $('#formData #' + elem.name + 'Error').empty();
        switch(elem.name){
            case 'clientTracing':
            case 'carrierRoom':
            case 'arkOtherName':
            case 'arkAesthetics':
            case 'arkClothes':
            case 'arkPersonalItems':
            case 'arkMortuaryPractitioner':
            case 'arkMortuaryPractitionerNif':
            case 'ceremonyResponsePlace':
            case 'ceremonyMusicalService':
            case 'ceremonyWhoTakesUrn':
            case 'ceremonyChurchPayment':
            case 'crematoryUrn':
            case 'crematoryNotes':
            case 'inhumationStreet':
            case 'inhumationBlock':
            case 'inhumationDeclarant':
            case 'inhumationDeclarantPhone':
            case 'inhumationIronCrossOther':
            case 'inhumationNotes1':
            case 'inhumationNotes2':
            case 'inhumationNotes3':
            case 'inhumationRemoveTombstoneNote':
            case 'inhumationNotes':
            case 'translationMoveContactEmail':
            case 'translationMoveDestinationCountry':
            case 'translationDepositAirport':
            case 'translationDepositWeight':
            case 'translationLTA':
            case 'translationNotes':
            case 'notes':
                data[elem.name] = elem.value;

                // Checks if exists change in input values
                if(expedientData.workOrder != null){
                    var valueToCompare = expedientData.workOrder[elem.name] == null ||  expedientData.workOrder[elem.name] == 'null' ? '' : expedientData.workOrder[elem.name];
                    if(elem.value != valueToCompare){
                        existsChanges++;
                    }
                }

                if(elem.name == 'crematoryNotes'){
                    var checkElem = validateCrematoryNotes(elem.value) ? 0 : 1;
                    if(checkElem > 0){
                        check += checkElem
                        checkCrematoryNotes = true;
                    }
                }

                if(elem.name == 'inhumationNotes'){
                    var checkElem = validateInhumationNotes(elem.value) ? 0 : 1;
                    if(checkElem > 0){
                        check += checkElem
                        checkInhumationNotes = true;
                    }
                }

                if(elem.name == 'translationNotes'){
                    var checkElem = validateTranslationNotes(elem.value) ? 0 : 1;
                    if(checkElem > 0){
                        check += checkElem
                        checkTranslationNotes = true;
                    }
                }

                if(elem.name == 'notes'){
                    var checkElem = validateNotes(elem.value) ? 0 : 1;
                    if(checkElem > 0){
                        check += checkElem
                        checkNotes = true;
                    }
                }
            break;
            case 'arkThanatoplastyDate':
            case 'arkThanatopraxyDate':
            case 'arkCTransientDate':
            case 'arkEmbalmmentDate':
            case 'crematoryCollectingAshesDate':
            case 'inhumationDeclarantDate':
            case 'translationDepositDate':
                if(elem.value != ''){
                    if(moment(elem.value, "DD/MM/YYYY").isValid()){
                        data[elem.name] = moment(elem.value, "DD/MM/YYYY").format("X");
                    }else{
                        data[elem.name] = '';
                    }
                }else{
                    data[elem.name] = '';
                }

                // Checks if exists change in input values
                if(expedientData.workOrder != null){
                    var valueToCompare = expedientData.workOrder[elem.name] == null || expedientData.workOrder[elem.name] == 'null' ? '' : moment(expedientData.workOrder[elem.name], 'X').format('DD/MM/YYYY');
                    if(elem.value != valueToCompare){
                        existsChanges++;
                    }
                }
            break;
            case 'arkThanatoplastyTime':
            case 'arkThanatopraxyTime':
            case 'arkCTransientTime':
            case 'arkEmbalmmentTime':
            case 'crematoryCollectingAshesTime':
            case 'inhumationDeclarantTime':
            case 'translationDepositTime':
                if(elem.value != ''){
                    if(moment(moment().format('DD/MM/YYYY') + ' ' + elem.value, "DD/MM/YYYY HH:mm").isValid()){
                        data[elem.name] = moment(moment().format('DD/MM/YYYY') + ' ' + elem.value, "DD/MM/YYYY HH:mm").format("X");
                    }else{
                        data[elem.name] = '';
                    }
                }else{
                    data[elem.name] = '';
                }

                if(expedientData.workOrder != null){
                    var valueToCompare = expedientData.workOrder[elem.name] == null || expedientData.workOrder[elem.name] == 'null' ? '' : moment(expedientData.workOrder[elem.name], 'X').format('HH:mm');
                    if(elem.value != valueToCompare){
                        existsChanges++;
                    }
                }
            break;
        }
    })

    data.arkCross = $("#formData #arkCross").prop('checked') ? 1 : 0;
    data.arkJesus = $("#formData #arkJesus").prop('checked') ? 1 : 0;
    data.arkOther = $("#formData #arkOther").prop('checked') ? 1 : 0;
    data.arkClothesPhoto = $("#formData #arkClothesPhoto").prop('checked') ? 1 : 0;
    data.arkClothesRosary = $("#formData #arkClothesRosary").prop('checked') ? 1 : 0;
    data.arkClothesOwn = $("#formData #arkClothesOwn").prop('checked') ? 1 : 0;
    data.arkClothesYes = $("#formData #arkClothesYes").prop('checked') ? 1 : 0;
    data.arkClothesNo = $("#formData #arkClothesNo").prop('checked') ? 1 : 0;
    data.arkPersonalItemsPacemaker = $("#formData #arkPersonalItemsPacemaker").prop('checked') ? 1 : 0;
    data.arkPersonalItemsShroud = $("#formData #arkPersonalItemsShroud").prop('checked') ? 1 : 0;
    data.arkThanatoplasty = $("#formData #arkThanatoplasty").prop('checked') ? 1 : 0;
    data.arkThanatopraxy = $("#formData #arkThanatopraxy").prop('checked') ? 1 : 0;
    data.arkCTransient = $("#formData #arkCTransient").prop('checked') ? 1 : 0;
    data.arkEmbalmment = $("#formData #arkEmbalmment").prop('checked') ? 1 : 0;
    data.velationCatering = $("#formData #velationCatering").prop('checked') ? 1 : 0;
    data.velationMemoriesScreen = $("#formData #velationMemoriesScreen").prop('checked') ? 1 : 0;
    data.velationPrivate = $("#formData #velationPrivate").prop('checked') ? 1 : 0;
    data.velationArkClosed = $("#formData #velationArkClosed").prop('checked') ? 1 : 0;
    data.velationPhotoFrame = $("#formData #velationPhotoFrame").prop('checked') ? 1 : 0;
    data.ceremonyResponse = $("#formData #ceremonyResponse").prop('checked') ? 1 : 0;
    data.ceremonyFamilyWaitChurch = $("#formData #ceremonyFamilyWaitChurch").prop('checked') ? 1 : 0;
    data.ceremonyBodyPresent = $("#formData #ceremonyBodyPresent").prop('checked') ? 1 : 0;
    data.ceremonyUrn = $("#formData #ceremonyUrn").prop('checked') ? 1 : 0;
    data.inhumationAttendOpening = $("#formData #inhumationAttendOpening").prop('checked') ? 1 : 0;
    data.inhumationIronCross = $("#formData #inhumationIronCross").prop('checked') ? 1 : 0;
    data.inhumationReburial1 = $("#formData #inhumationReburial1").prop('checked') ? 1 : 0;
    data.inhumationReburial2 = $("#formData #inhumationReburial2").prop('checked') ? 1 : 0;
    data.inhumationReburial3 = $("#formData #inhumationReburial3").prop('checked') ? 1 : 0;
    data.inhumationRemoveTombstone = $("#formData #inhumationRemoveTombstone").prop('checked') ? 1 : 0;

    // Responsible sealed
    data.translationResponsibleSealed = $('#formData #translationResponsibleSealed').val();

    if(expedientData.workOrder != null){
        existsChanges += (parseInt(expedientData.workOrder.arkCross) != parseInt(data.arkCross) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkJesus) != parseInt(data.arkJesus) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkOther) != parseInt(data.arkOther) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkClothesPhoto) != parseInt(data.arkClothesPhoto) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkClothesRosary) != parseInt(data.arkClothesRosary) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkClothesOwn) != parseInt(data.arkClothesOwn) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkClothesYes) != parseInt(data.arkClothesYes) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkClothesNo) != parseInt(data.arkClothesNo) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkPersonalItemsPacemaker) != parseInt(data.arkPersonalItemsPacemaker) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkPersonalItemsShroud) != parseInt(data.arkPersonalItemsShroud) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkThanatoplasty) != parseInt(data.arkThanatoplasty) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkThanatopraxy) != parseInt(data.arkThanatopraxy) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkCTransient) != parseInt(data.arkCTransient) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.arkEmbalmment) != parseInt(data.arkEmbalmment) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.velationCatering) != parseInt(data.velationCatering) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.velationMemoriesScreen) != parseInt(data.velationMemoriesScreen) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.velationPrivate) != parseInt(data.velationPrivate) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.velationArkClosed) != parseInt(data.velationArkClosed) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.velationPhotoFrame) != parseInt(data.velationPhotoFrame) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.ceremonyResponse) != parseInt(data.ceremonyResponse) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.ceremonyFamilyWaitChurch) != parseInt(data.ceremonyFamilyWaitChurch) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.ceremonyBodyPresent) != parseInt(data.ceremonyBodyPresent) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.ceremonyUrn) != parseInt(data.ceremonyUrn) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.inhumationAttendOpening) != parseInt(data.inhumationAttendOpening) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.inhumationIronCross) != parseInt(data.inhumationIronCross) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.inhumationReburial1) != parseInt(data.inhumationReburial1) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.inhumationReburial2) != parseInt(data.inhumationReburial2) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.inhumationReburial3) != parseInt(data.inhumationReburial3) ? 1 : 0);
        existsChanges += (parseInt(expedientData.workOrder.inhumationRemoveTombstone) != parseInt(data.inhumationRemoveTombstone) ? 1 : 0);

        if(expedientData.workOrder.translationResponsibleSealed != data.translationResponsibleSealed){
            existsChanges++;
        }
    }

    // Communication items
    data.communicationItems = [];
    $.each($('.communication-item'), function(index, value){
        var itemSelected = $(this).attr("item");
        data.communicationItems[index] = {};

        // Communication ID
        if($("#communicationID-" + itemSelected).val() != 'null'){
            data.communicationItems[index]['communicationID'] = $("#communicationID-" + itemSelected).val();
        }else{
            data.communicationItems[index]['communicationID'] = '';
        }

        // Hiring ID
        data.communicationItems[index]['hiringID'] = $("#communicationHiringID-" + itemSelected).val();

        // Date
        if($("#communicationDate-" + itemSelected).val() != ''){
            data.communicationItems[index]['date'] = moment($("#communicationDate-" + itemSelected).val(), 'DD/MM/YYYY').format('X');
        }else{
            data.communicationItems[index]['date'] = '';
        }
        var valueToCompare = expedientData.communication[index]['date'] == null ? '' : moment(expedientData.communication[index]['date'], 'X').format('DD/MM/YYYY');
        if(valueToCompare != data.communicationItems[index]['date']){
            existsChanges++;
        }

        // Photo
        data.communicationItems[index]['photo'] = $("#communicationPhoto-" + itemSelected).prop('checked') ? 1 : 0;

        var valueToCompare = expedientData.communication[index]['photo'] == null ? '' : parseInt(expedientData.communication[index]['photo']);
        if(valueToCompare != data.communicationItems[index]['photo']){
            existsChanges++;
        }
    })

    // Flowers items
    data.flowersItems = [];
    $.each($('.flowers-item'), function(index, value){
        var itemSelected = $(this).attr("item");
        data.flowersItems[index] = {};

        // Flower ID
        if($("#flowerID-" + itemSelected).val() != 'null'){
            data.flowersItems[index]['flowerID'] = $("#flowerID-" + itemSelected).val();
        }else{
            data.flowersItems[index]['flowerID'] = '';
        }

        // Hiring ID
        data.flowersItems[index]['hiringID'] = $("#flowersHiringID-" + itemSelected).val();

        // Date
        if($("#flowersDate-" + itemSelected).val() != ''){
            data.flowersItems[index]['date'] = moment($("#flowersDate-" + itemSelected).val(), 'DD/MM/YYYY').format('X');
        }else{
            data.flowersItems[index]['date'] = '';
        }

        var valueToCompare = expedientData.flowers[index]['date'] == null ? '' : moment(expedientData.flowers[index]['date'], 'X').format('DD/MM/YYYY');
        if(valueToCompare != data.flowersItems[index]['date']){
            existsChanges++;
        }

        // Time
        if($("#flowersTime-" + itemSelected).val() != ''){
            data.flowersItems[index]['time'] = moment(moment().format('DD/MM/YYYY') + ' ' + $("#flowersTime-" + itemSelected).val(), 'DD/MM/YYYY HH:mm').format('X');
        }else{
            data.flowersItems[index]['time'] = '';
        }

        var valueToCompare = expedientData.flowers[index]['time'] == null ? '' : moment(expedientData.flowers[index]['time'], 'X').format('DD/MM/YYYY');
        if(valueToCompare != data.flowersItems[index]['time']){
            existsChanges++;
        }
    })
   
    data.expedient = expedientIdUrl;
    data.workOrderId = expedientData.workOrder != null ? expedientData.workOrder.ID : null;
    data.existsChanges = mode == null ? (existsChanges > 0 ? 1 : 0) : 0;

    var info = [];
    info.check = check;
    info.data = data;
    info.checkCrematoryNotes = checkCrematoryNotes;
    info.checkInhumationNotes = checkInhumationNotes;
    info.checkTranslationNotes = checkTranslationNotes;
    info.checkNotes = checkNotes;

    return info;
}

/**
 * Submits create work order form
 * 
 * @param {array} data Data
 */
function goCreateWorkOrder(data, reload){

    $.ajax({
        url : uri + 'core/expedients/workOrder/create.php',
        data: Object.assign({}, data),
        method : 'POST',
        async: false,
        success : function(data){
            data = $.parseJSON(data);
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La orden de trabajo ha sido generada con éxito.</div>');

                if(reload != null){
                    if(reload){
                        setTimeout(function(){
                            window.location.reload();
                        }, 1500);
                    }else{
                        setTimeout(function(){
                            window.location.href = changeTabRef;
                        }, 1500);
                    }
                }
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error al guardar</div>')
                
                setTimeout(function(){
                    $('#block-message').empty();
                }, 3500)
            }
            $('#saveForm').attr('disabled', false);
        }
    });
}

/**
 * Submits update work order form
 * 
 * @param {array} data Data
 */
function goUpdateWorkOrder(data, reload){

    $.ajax({
        url : uri + 'core/expedients/workOrder/update.php',
        data: Object.assign({}, data),
        method : 'POST',
        async: false,
        success : function(data){
            data = $.parseJSON(data);

            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La orden de trabajo ha sido actualizada con éxito.</div>');
            
                if(reload != null){
                    if(reload){
                        setTimeout(function(){
                            window.location.reload();
                        }, 1500);
                    }else{
                        setTimeout(function(){
                            window.location.href = changeTabRef;
                        }, 1500);
                    }
                }
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error al guardar</div>')
                
                setTimeout(function(){
                    $('#block-message').empty();
                }, 3500)
            }
            $('#saveForm').attr('disabled', false);
        }
    });
}

/**
 * Goes to generate work order document
 * 
 * @param {array} data Data
 */
function generateWorkOrderDoc(type){

    $.ajax({
        url: uri + 'core/expedients/workOrder/generateDoc.php',
        method: 'POST',
        data: {
            expedient: expedientIdUrl,
            type: type
        },
        async: false,
        success: function(data){
            try{
                filename = $.parseJSON(data)

                window.open(uri + 'descargar-archivo?file=expedients/'+ expedientIdUrl + '/workOrders/' + filename, '_blank')

                setTimeout(() => {
                    window.location.reload();
                }, 500);
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

    moment.locale('es');

    // TOOLBAR BOTTOM
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="reloadForm" name="reloadForm" class="btn btn-primary hide"><i class="fa fa-refresh" aria-hidden="true"></i> Recargar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
    changeSpaceFooter();

    $('#exitExpedient').click(function(){
        window.location.href = uri + 'expedientes'
    })

    $('#cancelLink').click(function(event){
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

    $('#backLink').click(function(event){
        if(document.referrer == uri + 'info'){
            window.close()
            return
        }
        $('#saveForm').click();
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

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Listar expedientes
    $('#getAllExpedients').select2({
        containerCssClass: 'select2-expedients',
        language: langSelect2,
        placeholder: 'Cambiar de expediente',
        allowClear: false,       
        ajax: {
            url: uri + 'core/expedients/obituary/listExpedients.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                return {
                    q: params.term || "",
                    page: params.page                
                }
            },
            processResults: function(data, params){
                return {
                    results: $.map(data.items, function(item){
                        return{
                            text: item.number,
                            id: item.expedientID,
                            status: item.status,
                            tpv: item.tpv
                        }
                    }),
                    pagination: {
                        more: false
                    }
                }
            },
            cache: false
        },
        escapeMarkup: function(markup){ return markup },
        templateResult: formatDataExpedients,
        templateSelection: formatDataExpedients
    });

    $('#goToExpedient').click(function(){
        expid = $('#getAllExpedients').val();    
        if(expid != null){           
            if($('#getAllExpedients').select2('data')[0].tpv == '1'){
                window.location.href = uri + 'editar-expediente-tpv/' + expid;
            }else{
                window.location.href = uri + 'editar-expediente/' + expid;
            }
        }
    })

    // Obtenemos el id del expediente
    if(isExpedient()){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }

    // Info expedient
    getExpedient();
    if(expedientData == null){
        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
        setTimeout(function(){
            $('#block-message').empty()
        }, 5000)
        return false;
    }

    // Complete expediente info
    $('.numberExp').text(expedientData.expedient.number);
    $('.footer-static-bottom #deceased').text(' ' + expedientData.expedient.deceasedName + ' ' + expedientData.expedient.deceasedSurname);
   
    // Work orders pdf generated
    if(expedientData.workOrdersDocsGenerated.length > 0){
        $("#liShowOTDocs").removeClass('hide')
        $("#liSeparatorOT").removeClass('hide')

        expedientData.workOrdersDocsGenerated.sort((a, b) => a[0] < b[0] ? 1 : -1);
        $.each(expedientData.workOrdersDocsGenerated, function(index, elem){
            $('#listWorkOrders tbody').append(
                '<tr>' +
                    '<td style="text-align:center">'+ (index+1)  +'</td>' + 
                    '<td style="text-align:center">'+ moment(elem[0], 'X').format('DD/MM/YYYY HH:mm:ss') + '</td>' +
                    '<td style="text-align:center">'+ elem[1] + '</td>' +
                    '<td style="text-align:center">'+
                    '   <i class="fa fa-download cursor-pointer download-workOrder-doc" doc="'+ elem[1] + '" title="Descargar orden de trabajo"></i>'+
                    '</td>'+
                '</tr>'
            );
        })

        $('#listWorkOrders tbody .download-workOrder-doc').click(function(){
            var doc = $(this).attr("doc");
            window.open(uri + 'descargar-archivo?file=expedients/' + expedientIdUrl + '/workOrders/' + doc, '_blank');
        })

        $("#viewOTs").click(function(){
            $("#modal-work-orders-history").modal('show');
        })

        if(expedientData.workOrder != null && parseInt(expedientData.workOrder.hasChanges) > 0){
            $("#changesWorkOrderSection").removeClass('hide');
        }
    }
    
    inicializateExpedientSection();

    inicializateClientSection();

    inicializateCarriersSection();

    inicializateDeceasedSection();

    inicializateArkSection();

    inicializateVelationSection();

    inicializateCeremonySection();

    inicializateCrematorySection();

    inicializateInhumationSection();
    
    inicializateTranslationSection();

    inicializateCommunicationSection();

    inicializateFlowersSection();
    
    inicializateNotesSection();

    // Plugins
    init();
    
    // Save
    $('#saveForm').click(function(){
        saveForm(true);
    })

    $('.changeTab').click(function(e){
        changeTabRef = $(this).attr("href");
        saveForm(false);
        e.preventDefault();
    })

    // Generate OT pdf
    $(".generate-ot-doc").click(function(){
        var info = checkSaveForm('generate-doc');
        if(info.check == 0){
            if(info.data.workOrderId != null){
                goUpdateWorkOrder(info.data, null);
            }else{
                goCreateWorkOrder(info.data, null);
            }
        }else{
            $('#saveForm').attr('disabled', false);
            if(info.checkCrematoryNotes){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>observaciones</strong> del bloque crematorio no cumple con el tamaño máximo permitido (max. 4 líneas y 70 caracteres por línea)</div>');
            }else if(info.checkInhumationNotes){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>observaciones</strong> del bloque inhumación no cumple con el tamaño máximo permitido (max. 4 líneas y 70 caracteres por línea)</div>');
            }else if(info.checkTranslationNotes){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>observaciones</strong> del bloque traslado no cumple con el tamaño máximo permitido (max. 4 líneas y 70 caracteres por línea)</div>');
            }else if(info.checkNotes){
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>notas</strong> no cumple con el tamaño máximo permitido (max. 5 líneas y 70 caracteres por línea)</div>');
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>');
            }
        }

        var type = parseInt($(this).attr('type'));
        generateWorkOrderDoc(type);
    })
})

function saveForm(reload){
    var info = checkSaveForm();
    if(info.check == 0){
        if(info.data.workOrderId != null){
            goUpdateWorkOrder(info.data, reload);
        }else{
            goCreateWorkOrder(info.data, reload);
        }
    }else{
        $('#saveForm').attr('disabled', false);
        if(info.checkCrematoryNotes){
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>observaciones</strong> del bloque crematorio no cumple con el tamaño máximo permitido (max. 4 líneas y 70 caracteres por línea)</div>');
        }else if(info.checkInhumationNotes){
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>observaciones</strong> del bloque inhumación no cumple con el tamaño máximo permitido (max. 4 líneas y 70 caracteres por línea)</div>');
        }else if(info.checkTranslationNotes){
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>observaciones</strong> del bloque traslado no cumple con el tamaño máximo permitido (max. 4 líneas y 70 caracteres por línea)</div>');
        }else if(info.checkNotes){
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campo <strong>notas</strong> no cumple con el tamaño máximo permitido (max. 5 líneas y 70 caracteres por línea)</div>');
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>');
        }
    }
}