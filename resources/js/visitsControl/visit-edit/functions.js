var visitControlID = null;

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
}

//Función que pasando como parámetro el ID de visita  se obtiene el Id del control de visita
function getVisitControlID(visit) {
    var visitControlID;
    $.ajax({
        url: uri+"core/visitsControl/visits/functions.php",
        data: {visitID: visit, type: 'getVisitControlByVisit'},
        type: 'POST',
        async: false,
        success: function (data) {
            visitControlID = $.parseJSON(data);
        }
        
    });

    return visitControlID;
}

//Función que pasando como parámetro el ID de visita se obtiene el Id del expediente
function getExpedientID(visitControlID) {
    var expedient;
    $.ajax({
        url: uri+"core/visitsControl/visits/functions.php",
        data: {visitID: visitControlID, type: 'getExpedientByVisit'},
        type: 'POST',
        async: false,
        success: function (data) {
            expedient = $.parseJSON(data);
        }
    });
    return expedient;
}

//Función que pasando como parámetro el ID del control de visitas obtiene los IDs de todas la visitas
function getVisitsIDs(visitControlID) {
    var expedient;
    $.ajax({
        url: uri+"core/visitsControl/visits/functions.php",
        data: {visitID: visitControlID, type: 'getVisitsIDs'},
        type: 'POST',
        async: false,
        success: function (data) {
            expedient = $.parseJSON(data);
        }
    });
    return expedient;
}

/**
 * Comprueba si la visita existe
 * 
 * @param {int} expedient Id de la visita
 * @return bool
 */
function existsVisit(visit){
    var check

    $.ajax({
        url: uri + 'core/visitsControl/visits/functions.php',
        method: 'POST',
        data: {
            type: 'existsVisitEdit',
            visit: visit
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
//Obtener el ID del usuario en sesion
function getUserID(){
    var userID;
    $.ajax({

        url: uri+"core/users/functions2.php",
        data: {type: 'getUserId'},
        type: 'POST',
        async: false,
        success: function (data) {
            userID = $.parseJSON(data);            
        }
    });
    return userID;
}
//Obtener el personal con userID
function getStaffByUserID(id){
    var staff;
    $.ajax({

        url: uri+"core/visitsControl/visits/functions.php",
        data: {type: 'getStaffByUserID', id:id},
        type: 'POST',
        async: false,
        success: function (data) {
            staff = $.parseJSON(data);            
        }
    });
    return staff;
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
    //Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<div id="msg"></div>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveEditVisit" name="saveEditVisit" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    changeSpaceFooter()
    $('#cancelLink').click(function(event) {
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

    $('#backLink').click(function(event) {
        // $('#saveEditVisit').click();
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

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    //Select
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

    //Pickers
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    });
    
    //Obtenemos el ID de la visita para obtener el expediente
    var visit = $('#visit').val();
    if(existsVisit(visit)){
        $('#existsVisit').remove()
    }else{
        $('#existsVisit').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'control-de-visitas'
        }, 2500);
        return
    }
    
    //Obetener el usuario en sesion
    var userID = getUserID() 
    //Obtener el nombre del personal en sesion
    var staff = getStaffByUserID(userID)

    //Obtenemos el ID del visitControl
    visitControlID = getVisitControlID(visit);

    //Obtenemos el ID del expediente
    var expedientID = getExpedientID(visitControlID[0]['visitControl']);

    //Obtenemos los IDs de las visitas para controlar la primera y la última
    var visitsIDs = getVisitsIDs(visitControlID[0]['visitControl']);
    var firstVisit = visitsIDs[0].ID;
    var lastVisit = visitsIDs[visitsIDs.length - 1].ID;

    $.post(uri+"core/visitsControl/visits/read.php", {expedientID: expedientID}, function(data){
        data = $.parseJSON(data);
        var gender = ''
        if(data.deceasedgender == 'Mujer'){
            gender = "Dña. "
        }else{
            gender = "D. "
        }
        $('#expedientNumber').html(data[0].number);
        $('#expedientDeceasedName').html(gender + " " + data[0].deceasedName+" "+data[0].deceasedSurname);
        $('#funeralEntryDate').html(moment(data[0].funeralHomeEntryDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' ' + moment(data[0].funeralHomeEntryTime, "HH:mm:ss").format('HH:mm'));
        $('#funeralDate').html(moment(data[0].funeralDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' ' + moment(data[0].funeralTime, "HH:mm:ss").format('HH:mm'))
        $('#expedientMortuoryName').html(data[0].name);
        $('#expedientEntryFuneralTime').html(moment(data[0].funeralHomeEntryTime, "HH:mm:ss").format("HH:mm"));
        $('#expedientRoom').html(data[0].deceasedRoom);
        $('#expedientFuneralTime').html(moment(data[0].funeralTime, "HH:mm:ss").format("HH:mm"));
    });

    // Cargamos los datos de los usuarios en el select
    $('.cleaningUsers').select2({
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

    // Cargamos los datos de los usuarios en el select
    $('.visitUsers').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/visitsControl/visitsDescriptions/dataVisitUsers.php',
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
                            text: item.name + " "+ item.surname,
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

    //Se obtiene la descripcion de la visita
    $.post(uri+"core/visitsControl/visits/readDescription.php", {visitID: visit}, function(data){
        data = $.parseJSON(data);

        $('#startCoffeShopCheck').prop("checked", parseInt(data.startCoffeShopCheck));
        if(data.startCoffeShopUser != null){
            if($('#startCoffeShopUser').find("option[value='" + data.startCoffeShopUser + "']").length){
                $('#startCoffeShopUser').val(data.startCoffeShopUser).trigger('change');
            }else{ 
                var newOption = new Option(data.startCoffeShopUserName +' '+ data.startCoffeShopUserSurname , data.startCoffeShopUser, true, true);
                $('#startCoffeShopUser').append(newOption).trigger('change');
            }
        }
        $('#startCoffeShopUser').val(data.startCoffeShopUser).trigger('change');
        if(data.startCoffeShopTime != null){
            
            $('#startCoffeShopTime').val(moment(data.startCoffeShopTime, "X").format("HH:mm"));
        }
        $('#startCoffeShopResolved').prop("checked", parseInt(data.startCoffeShopResolved));
        $('#deliveryKeysCheck').prop("checked", parseInt(data.deliveryKeysCheck));
        if(data.deliveryKeysUser != null){
            if($('#deliveryKeysUser').find("option[value='" + data.deliveryKeysUser + "']").length){
                $('#deliveryKeysUser').val(data.deliveryKeysUser).trigger('change');
            }else{ 
                var newOption = new Option(data.deliveryKeysUserName +' '+ data.deliveryKeysUserSurname, data.deliveryKeysUser, true, true);
                $('#deliveryKeysUser').append(newOption).trigger('change');
            }
        }
        $('#deliveryKeysUser').val(data.deliveryKeysUser).trigger('change');
        $('#deliveryKeysTo').val(data.deliveryKeysTo);
        if(data.deliveryKeysTime != null){
            
            $('#deliveryKeysTime').val(moment(data.deliveryKeysTime, "X").format("HH:mm"));
        }
        $('#deliveryKeysResolved').prop("checked", parseInt(data.deliveryKeysResolved));
        $('#courtesyQuestionCheck').prop("checked", parseInt(data.courtesyQuestionCheck));
        if(data.courtesyQuestionUser != null){
            if($('#courtesyQuestionUser').find("option[value='" + data.courtesyQuestionUser + "']").length){
                $('#courtesyQuestionUser').val(data.courtesyQuestionUser).trigger('change');
            }else{ 
                var newOption = new Option(data.courtesyQuestionUserName +' '+ data.courtesyQuestionUserSurname, data.courtesyQuestionUser, true, true);
                $('#courtesyQuestionUser').append(newOption).trigger('change');
            }
        }
        $('#courtesyQuestionUser').val(data.courtesyQuestionUser).trigger('change');
        if(data.courtesyQuestionTime != null){
            
            $('#courtesyQuestionTime').val(moment(data.courtesyQuestionTime, "X").format("HH:mm"));
        }
        $('#courtesyQuestionResolved').prop("checked", parseInt(data.courtesyQuestionResolved));
        $('#roomReviewCheck').prop("checked", parseInt(data.roomReviewCheck));
        if(data.roomReviewUser != null){
            if($('#roomReviewUser').find("option[value='" + data.roomReviewUser + "']").length){
                $('#roomReviewUser').val(data.roomReviewUser).trigger('change');
            }else{ 
                var newOption = new Option(data.roomReviewUserName +' '+ data.roomReviewUserSurname, data.roomReviewUser, true, true);
                $('#roomReviewUser').append(newOption).trigger('change');
            }
        }
        $('#roomReviewUser').val(data.roomReviewUser).trigger('change');
        if(data.roomReviewTime != null){
            
            $('#roomReviewTime').val(moment(data.roomReviewTime, "X").format("HH:mm"));
        }
        $('#roomReviewResolved').prop("checked", parseInt(data.roomReviewResolved));
        $('#roomHandkerchiefReviewCheck').prop("checked", parseInt(data.roomHandkerchiefReviewCheck));
        if(data.roomHandkerchiefReviewUser != null){
            if($('#roomHandkerchiefReviewUser').find("option[value='" + data.roomHandkerchiefReviewUser + "']").length){
                $('#roomHandkerchiefReviewUser').val(data.roomHandkerchiefReviewUser).trigger('change');
            }else{ 
                var newOption = new Option(data.roomHandkerchiefReviewUserName +' '+ data.roomHandkerchiefReviewUserSurname, data.roomHandkerchiefReviewUser, true, true);
                $('#roomHandkerchiefReviewUser').append(newOption).trigger('change');
            }
        }
        $('#roomHandkerchiefReviewUser').val(data.roomHandkerchiefReviewUser).trigger('change');
        if(data.roomHandkerchiefReviewTime != null){
            
            $('#roomHandkerchiefReviewTime').val(moment(data.roomHandkerchiefReviewTime, "X").format("HH:mm"));
        }
        $('#roomHandkerchiefReviewResolved').prop("checked", parseInt(data.roomHandkerchiefReviewResolved));
        $('#toiletReviewCheck').prop("checked", parseInt(data.toiletReviewCheck));
        if(data.toiletReviewUser != null){
            if($('#toiletReviewUser').find("option[value='" + data.toiletReviewUser + "']").length){
                $('#toiletReviewUser').val(data.toiletReviewUser).trigger('change');
            }else{ 
                var newOption = new Option(data.toiletReviewUserName +' '+ data.toiletReviewUserSurname, data.toiletReviewUser, true, true);
                $('#toiletReviewUser').append(newOption).trigger('change');
            }
        }
        $('#toiletReviewUser').val(data.toiletReviewUser).trigger('change');
        if(data.toiletReviewTime != null){
            
            $('#toiletReviewTime').val(moment(data.toiletReviewTime, "X").format("HH:mm"));
        }
        $('#toiletReviewResolved').prop("checked", parseInt(data.toiletReviewResolved));
        $('#toiletPaperReviewCheck').prop("checked", parseInt(data.toiletPaperReviewCheck));
        if(data.toiletPaperReviewUser != null){
            if($('#toiletPaperReviewUser').find("option[value='" + data.toiletPaperReviewUser + "']").length){
                $('#toiletPaperReviewUser').val(data.toiletPaperReviewUser).trigger('change');
            }else{ 
                var newOption = new Option(data.toiletPaperReviewUserName +' '+ data.toiletPaperReviewUserSurname, data.toiletPaperReviewUser, true, true);
                $('#toiletPaperReviewUser').append(newOption).trigger('change');
            }
        }
        $('#toiletPaperReviewUser').val(data.toiletPaperReviewUser).trigger('change');
        if(data.toiletPaperReviewTime != null){
            
            $('#toiletPaperReviewTime').val(moment(data.toiletPaperReviewTime, "X").format("HH:mm"));
        }
        $('#toiletPaperReviewResolved').prop("checked", parseInt(data.toiletPaperReviewResolved));
        $('#roomBurialReviewCheck').prop("checked", parseInt(data.roomBurialReviewCheck));
        if(data.roomBurialReviewUser != null){
            if($('#roomBurialReviewUser').find("option[value='" + data.roomBurialReviewUser + "']").length){
                $('#roomBurialReviewUser').val(data.roomBurialReviewUser).trigger('change');
            }else{ 
                var newOption = new Option(data.roomBurialReviewUserName +' '+ data.roomBurialReviewUserSurname, data.roomBurialReviewUser, true, true);
                $('#roomBurialReviewUser').append(newOption).trigger('change');
            }
        }
        $('#roomBurialReviewUser').val(data.roomBurialReviewUser).trigger('change');
        if(data.roomBurialReviewTime != null){
            $('#roomBurialReviewTime').val(moment(data.roomBurialReviewTime, "X").format("HH:mm"));
        }
        $('#roomBurialReviewResolved').prop("checked", parseInt(data.roomBurialReviewResolved));
        $('#roomTempCheck').prop("checked", parseInt(data.roomTempCheck));
        if(data.roomTempUser != null){
            if($('#roomTempUser').find("option[value='" + data.roomTempUser + "']").length){
                $('#roomTempUser').val(data.roomTempUser).trigger('change');
            }else{ 
                var newOption = new Option(data.roomTempUserName +' '+ data.roomTempUserSurname, data.roomTempUser, true, true);
                $('#roomTempUser').append(newOption).trigger('change');
            }
        }
        $('#roomTempUser').val(data.roomTempUser).trigger('change');
        if(data.roomTempTime != null){
            
            $('#roomTempTime').val(moment(data.roomTempTime, "X").format("HH:mm"));
        }
        $('#roomTempResolved').prop("checked", parseInt(data.roomTempResolved));
        $('#burialTemp').val(data.burialTemp);
        $('#burialTempCheck').prop("checked", parseInt(data.burialTempCheck));
        if(data.burialTempUser != null){
            if($('#burialTempUser').find("option[value='" + data.burialTempUser + "']").length){
                $('#burialTempUser').val(data.burialTempUser).trigger('change');
            }else{ 
                var newOption = new Option(data.burialTempUserName +' '+ data.burialTempUserSurname, data.burialTempUser, true, true);
                $('#burialTempUser').append(newOption).trigger('change');
            }
        }
        $('#burialTempUser').val(data.burialTempUser).trigger('change');
        if(data.burialTempTime != null){
            
            $('#burialTempTime').val(moment(data.burialTempTime, "X").format("HH:mm"));
        }
        $('#burialTempResolved').prop("checked", parseInt(data.burialTempResolved));
        $('#thanatopraxieTempCheck').prop("checked", parseInt(data.thanatopraxieTempCheck));
        if(data.thanatopraxieTempUser != null){
            if($('#thanatopraxieTempUser').find("option[value='" + data.thanatopraxieTempUser + "']").length){
                $('#thanatopraxieTempUser').val(data.thanatopraxieTempUser).trigger('change');
            }else{ 
                var newOption = new Option(data.thanatopraxieTempUserName +' '+ data.thanatopraxieTempUserSurname, data.thanatopraxieTempUser, true, true);
                $('#thanatopraxieTempUser').append(newOption).trigger('change');
            }
        }
        $('#thanatopraxieTempUser').val(data.thanatopraxieTempUser).trigger('change');
        if(data.thanatopraxieTempTime != null){
            
            $('#thanatopraxieTempTime').val(moment(data.thanatopraxieTempTime, "X").format("HH:mm"));
        }
        $('#thanatopraxieTempResolved').prop("checked", parseInt(data.thanatopraxieTempResolved));
        $('#controlProductsCoffeShopCheck').prop("checked", parseInt(data.controlProductsCoffeShopCheck));
        if(data.controlProductsCoffeShopUser != null){
            if($('#controlProductsCoffeShopUser').find("option[value='" + data.controlProductsCoffeShopUser + "']").length){
                $('#controlProductsCoffeShopUser').val(data.controlProductsCoffeShopUser).trigger('change');
            }else{ 
                var newOption = new Option(data.controlProductsCoffeShopUserName +' '+ data.controlProductsCoffeShopUserSurname, data.controlProductsCoffeShopUser, true, true);
                $('#controlProductsCoffeShopUser').append(newOption).trigger('change');
            }
        }
        $('#controlProductsCoffeShopUser').val(data.controlProductsCoffeShopUser).trigger('change');
        if(data.controlProductsCoffeShopTime != null){
            
            $('#controlProductsCoffeShopTime').val(moment(data.controlProductsCoffeShopTime, "X").format("HH:mm"));
        }
        $('#controlProductsCoffeShopResolved').prop("checked", parseInt(data.controlProductsCoffeShopResolved));
        $('#offeringCheck').prop("checked", parseInt(data.offeringCheck));
        if(data.offeringUser != null){
            if($('#offeringUser').find("option[value='" + data.offeringUser + "']").length){
                $('#offeringUser').val(data.offeringUser).trigger('change');
            }else{ 
                var newOption = new Option(data.offeringUserName +' '+ data.offeringUserSurname, data.offeringUser, true, true);
                $('#offeringUser').append(newOption).trigger('change');
            }
        }
        $('#offeringUser').val(data.offeringUser).trigger('change');
        if(data.offeringTime != null){
            
            $('#offeringTime').val(moment(data.offeringTime, "X").format("HH:mm"));
        }
        $('#offeringResolved').prop("checked", parseInt(data.offeringResolved));
        $('#commonBathroomsCleaningCheck').prop("checked", parseInt(data.commonBathroomsCleaningCheck));
        if(data.commonBathroomsCleaningUser != null){
            if($('#commonBathroomsCleaningUser').find("option[value='" + data.commonBathroomsCleaningUser + "']").length){
                $('#commonBathroomsCleaningUser').val(data.commonBathroomsCleaningUser).trigger('change');
            }else{ 
                var newOption = new Option(data.commonBathroomsCleaningUserName +' '+ data.commonBathroomsCleaningUserSurname, data.commonBathroomsCleaningUser, true, true);
                $('#commonBathroomsCleaningUser').append(newOption).trigger('change');
            }
        }
        $('#commonBathroomsCleaningUser').val(data.commonBathroomsCleaningUser).trigger('change');
        if(data.commonBathroomsCleaningTime != null){
            
            $('#commonBathroomsCleaningTime').val(moment(data.commonBathroomsCleaningTime, "X").format("HH:mm"));
        }
        $('#commonBathroomsCleaningResolved').prop("checked", parseInt(data.commonBathroomsCleaningResolved));
        $('#roomBathroomsCleaningCheck').prop("checked", parseInt(data.roomBathroomsCleaningCheck));
        if(data.roomBathroomsCleaningUser != null){
            if($('#roomBathroomsCleaningUser').find("option[value='" + data.roomBathroomsCleaningUser + "']").length){
                $('#roomBathroomsCleaningUser').val(data.roomBathroomsCleaningUser).trigger('change');
            }else{ 
                var newOption = new Option(data.roomBathroomsCleaningUserName +' '+ data.roomBathroomsCleaningUserSurname, data.roomBathroomsCleaningUser, true, true);
                $('#roomBathroomsCleaningUser').append(newOption).trigger('change');
            }
        }
        $('#roomBathroomsCleaningUser').val(data.roomBathroomsCleaningUser).trigger('change');
        if(data.roomBathroomsCleaningTime != null){
            
            $('#roomBathroomsCleaningTime').val(moment(data.roomBathroomsCleaningTime, "X").format("HH:mm"));
        }
        $('#roomBathroomsCleaningResolved').prop("checked", parseInt(data.roomBathroomsCleaningResolved));
        $('#roomCleaningCheck').prop("checked", parseInt(data.roomCleaningCheck));
        if(data.roomCleaningUser != null){
            if($('#roomCleaningUser').find("option[value='" + data.roomCleaningUser + "']").length){
                $('#roomCleaningUser').val(data.roomCleaningUser).trigger('change');
            }else{ 
                var newOption = new Option(data.roomCleaningUserName +' '+ data.roomCleaningUserSurname, data.roomCleaningUser, true, true);
                $('#roomCleaningUser').append(newOption).trigger('change');
            }
        }
        $('#roomCleaningUser').val(data.roomCleaningUser).trigger('change');
        if(data.roomCleaningTime != null){
            
            $('#roomCleaningTime').val(moment(data.roomCleaningTime, "X").format("HH:mm"));
        }
        $('#roomCleaningResolved').prop("checked", parseInt(data.roomCleaningResolved));
        $('#thanatopraxieCleaningCheck').prop("checked", parseInt(data.thanatopraxieCleaningCheck));
        if(data.thanatopraxieCleaningUser != null){
            if($('#thanatopraxieCleaningUser').find("option[value='" + data.thanatopraxieCleaningUser + "']").length){
                $('#thanatopraxieCleaningUser').val(data.thanatopraxieCleaningUser).trigger('change');
            }else{ 
                var newOption = new Option(data.thanatopraxieCleaningUserName +' '+ data.thanatopraxieCleaningUserSurname, data.thanatopraxieCleaningUser, true, true);
                $('#thanatopraxieCleaningUser').append(newOption).trigger('change');
            }
        }
        $('#thanatopraxieCleaningUser').val(data.thanatopraxieCleaningUser).trigger('change');
        if(data.thanatopraxieCleaningTime != null){
            
            $('#thanatopraxieCleaningTime').val(moment(data.thanatopraxieCleaningTime, "X").format("HH:mm"));
        }
        $('#thanatopraxieCleaningResolved').prop("checked", parseInt(data.thanatopraxieCleaningResolved));
        $('#commonZonesCleaningCheck').prop("checked", parseInt(data.commonZonesCleaningCheck));
        if(data.commonZonesCleaningUser != null){
            if($('#commonZonesCleaningUser').find("option[value='" + data.commonZonesCleaningUser + "']").length){
                $('#commonZonesCleaningUser').val(data.commonZonesCleaningUser).trigger('change');
            }else{ 
                var newOption = new Option(data.commonZonesCleaningUserName +' '+ data.commonZonesCleaningUserSurname, data.commonZonesCleaningUser, true, true);
                $('#commonZonesCleaningUser').append(newOption).trigger('change');
            }
        }
        $('#commonZonesCleaningUser').val(data.commonZonesCleaningUser).trigger('change');
        if(data.commonZonesCleaningTime != null){
            
            $('#commonZonesCleaningTime').val(moment(data.commonZonesCleaningTime, "X").format("HH:mm"));
        }
        $('#commonZonesCleaningResolved').prop("checked", parseInt(data.commonZonesCleaningResolved));
        $('#burialCleaningCheck').prop("checked", parseInt(data.burialCleaningCheck));
        if(data.burialCleaningUser != null){
            if($('#burialCleaningUser').find("option[value='" + data.burialCleaningUser + "']").length){
                $('#burialCleaningUser').val(data.burialCleaningUser).trigger('change');
            }else{ 
                var newOption = new Option(data.burialCleaningUserName +' '+ data.burialCleaningUserSurname, data.burialCleaningUser, true, true);
                $('#burialCleaningUser').append(newOption).trigger('change');
            }
        }
        $('#burialCleaningUser').val(data.burialCleaningUser).trigger('change');
        if(data.burialCleaningTime != null){
            
            $('#burialCleaningTime').val(moment(data.burialCleaningTime, "X").format("HH:mm"));
        }
        $('#burialCleaningResolved').prop("checked", parseInt(data.burialCleaningResolved));
        $('#notes').val(data.notes);

        if(visit == firstVisit){
            $('#courtesyQuestion').removeClass('hide');
            $('#roomReview').removeClass('hide');
            $('#roomBurialReview').removeClass('hide');
            //$('#roomHandkerchiefReview').removeClass('hide');
            $('#toiletReview').removeClass('hide');
            //$('#toiletPaperReview').removeClass('hide');
            //$('#roomTemp').removeClass('hide');
            //$('#burialTemp').removeClass('hide');
            //$('#thanatopraxieTemp').removeClass('hide');
            $('#startCoffeShop').removeClass('hide');
            $('#deliveryKeys').removeClass('hide');
            //$('#controlProductsCoffeShop').removeClass('hide');
            //$('#offering').removeClass('hide');
        }
        if(visit == lastVisit){
            $('#roomHandkerchiefReview').removeClass('hide');
            $('#toiletPaperReview').removeClass('hide');
            $('#commonBathroomsCleaning').removeClass('hide');
            $('#roomBathroomsCleaning').removeClass('hide');
            $('#roomCleaning').removeClass('hide');
            $('#thanatopraxieCleaning').removeClass('hide');
            $('#commonZonesCleaning').removeClass('hide');
            $('#burialCleaning').removeClass('hide');
        }
        if(visit != firstVisit && visit != lastVisit){
            $('#toiletReview').removeClass('hide');
            $('#courtesyQuestion').removeClass('hide');
            $('#roomReview').removeClass('hide');
            //$('#roomBurialReview').removeClass('hide');
            $('#toiletPaperReview').removeClass('hide');
            $('#roomTemp').removeClass('hide');
            $('#burialTemp1').removeClass('hide');
            $('#roomHandkerchiefReview').removeClass('hide');
            //$('#controlProductsCoffeShop').removeClass('hide');
            $('#offering').removeClass('hide');
            $('#cafeProducts').removeClass('hide');
        }


        //CAMBIAMOS LOS ICONOS EN CASO DE QUE EXISTA INCIDENCIA

        //Se asigna los datos de las incidencias en los modales
        $.post(uri+"core/incidents/list.php", {visitID: visit}, function(data){
            data = $.parseJSON(data);
            
            $.each(data, function(index, elem){
                $("#" + elem.type + "Icon").removeClass('fa fa-plus').addClass('fa fa-pencil')
            })
            
        });                   

        //Al hacer clic en el check, que obtenga la hora actual y seleccionar el usuario en sesion
        $('#courtesyQuestionCheck').click(function(){
            if($('#courtesyQuestionCheck').prop('checked')){
                var now = new Date()                
                $('#courtesyQuestionTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); 
                    $('#courtesyQuestionUser').append(newOption).trigger('change');
                }
            }            
        });        
        
        $('#roomReviewCheck').click(function(){
            if($('#roomReviewCheck').prop('checked')){
                var now = new Date()                
                $('#roomReviewTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#roomReviewUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#toiletReviewCheck').click(function(){
            if($('#toiletReviewCheck').prop('checked')){
                var now = new Date()                
                $('#toiletReviewTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#toiletReviewUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#toiletPaperReviewCheck').click(function(){
            if($('#toiletPaperReviewCheck').prop('checked')){
                var now = new Date()                
                $('#toiletPaperReviewTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#toiletPaperReviewUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#roomTempCheck').click(function(){
            if($('#roomTempCheck').prop('checked')){
                var now = new Date()                
                $('#roomTempTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#roomTempUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#burialTempCheck').click(function(){
            if($('#burialTempCheck').prop('checked')){
                var now = new Date()                
                $('#burialTempTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#burialTempUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#roomHandkerchiefReviewCheck').click(function(){
            if($('#roomHandkerchiefReviewCheck').prop('checked')){
                var now = new Date()                
                $('#roomHandkerchiefReviewTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#roomHandkerchiefReviewUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#offeringCheck').click(function(){
            if($('#offeringCheck').prop('checked')){
                var now = new Date()                
                $('#offeringTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#offeringUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#roomBurialReviewCheck').click(function(){
            if($('#roomBurialReviewCheck').prop('checked')){
                var now = new Date()                
                $('#roomBurialReviewTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#roomBurialReviewUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#startCoffeShopCheck').click(function(){
            if($('#startCoffeShopCheck').prop('checked')){
                var now = new Date()                
                $('#startCoffeShopTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#startCoffeShopUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#deliveryKeysCheck').click(function(){
            if($('#deliveryKeysCheck').prop('checked')){
                var now = new Date()                
                $('#deliveryKeysTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#deliveryKeysUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#commonBathroomsCleaningCheck').click(function(){
            if($('#commonBathroomsCleaningCheck').prop('checked')){
                var now = new Date()                
                $('#commonBathroomsCleaningTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#commonBathroomsCleaningUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#roomBathroomsCleaningCheck').click(function(){
            if($('#roomBathroomsCleaningCheck').prop('checked')){
                var now = new Date()                
                $('#roomBathroomsCleaningTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#roomBathroomsCleaningUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#roomCleaningCheck').click(function(){
            if($('#roomCleaningCheck').prop('checked')){
                var now = new Date()                
                $('#roomCleaningTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#roomCleaningUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#thanatopraxieCleaningCheck').click(function(){
            if($('#thanatopraxieCleaningCheck').prop('checked')){
                var now = new Date()                
                $('#thanatopraxieCleaningTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#thanatopraxieCleaningUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#commonZonesCleaningCheck').click(function(){
            if($('#commonZonesCleaningCheck').prop('checked')){
                var now = new Date()                
                $('#commonZonesCleaningTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#commonZonesCleaningUser').append(newOption).trigger('change');
                }
            }            
        });
        $('#burialCleaningCheck').click(function(){
            if($('#burialCleaningCheck').prop('checked')){
                var now = new Date()                
                $('#burialCleaningTime').val(moment(now, "X").format("HH:mm"));

                if(staff != null && staff != ''){
                    var newOption = new Option(staff[0].name + ' ' + staff[0].surname, staff[0].ID, true, true); //prueba
                    $('#burialCleaningUser').append(newOption).trigger('change');
                }
            }            
        });

        // PRODUCTOS DE CAFETERÍA
        if(data.cafe.length > 0){
            $.each(data.cafe, function(index, elem){
                var index = $('#cafeBody tr').length
                var id = elem.ID
                var amount = elem.amount
                var product = elem.product
                var productName = elem.productName
                var model = elem.model
                var modelName = elem.modelName
                var user = elem.user
                var userName = elem.userName
                var userSurname = elem.userSurname
        
                $('#cafeBody').append(  '   <tr>' +
                                        '       <td width="5%" class="index hide">' + index + '</td>' +
                                        '       <td width="5%" class="id hide">' + id + '</td>' +
                                        '       <td width="10%">' +
                                        '           <input type="number" min="1" class="cafeAmount input-medium" id="cafeAmount' + index + '" value="' + amount + '" />' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '           <select class="cafeProduct" id="cafeProduct' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '           <select class="cafeModel" id="cafeModel' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="10%">' +
                                        '           <select class="cafeUser" id="cafeUser' + index + '"></select>' +
                                        '       </td>' +
                                        '       <td width="5%">' +
                                        '           <ul class="actions-menu"><li><a href="javascript:void(0)" class="btnDel' + index + '"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>' +
                                        '       </td>' +
                                        '   </tr>')
        
                $('#cafeProduct' + index).select2({
                    containerCssClass: 'select2-cafeProductsAdd',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: false,
                    ajax: {
                        url: uri + 'core/visitsControl/visitsDescriptions/dataProducts.php',
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
                                        id: item.productID
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
                    templateSelection: formatData,
                })

                $('#cafeProduct' + index).change(function(){
                    product = $(this).val()
    
                    $('#cafeModel' + index).val('').trigger('change')
    
                    // LISTADO DE MODELOS POR PRODUCTO
                    $('#cafeModel' + index).select2({
                        containerCssClass: 'select2-cafeModel',
                        language: langSelect2,
                        placeholder: '--',
                        ajax: {
                            url: uri + 'core/visitsControl/visitsDescriptions/dataModels.php?product=' + product,
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
                                            id: item.productModelID
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
                        templateSelection: formatData,
                    })
                })
        
                $('#cafeModel' + index).select2({
                    containerCssClass: 'select2-cafeModels',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: false,
                    ajax: {
                        url: uri + 'core/warehouse/orders/lines/dataModels.php?product=' + product,
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
                                        id: item.productID
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
                    templateSelection: formatData,
                })
            
                // LISTADO DE USUARIOS
                $('#cafeUser' + index).select2({
                    containerCssClass: 'select2-cafeUsers',
                    language: langSelect2,
                    placeholder: '--',
                    allowClear: false,
                    ajax: {
                        url: uri + 'core/visitsControl/visitsDescriptions/dataUsers.php',
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
                                        id: item.userID
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
                    templateSelection: formatData,
                })
        
                if($('#cafeProduct' + index).find("option[value='" + product + "']").length){
                    $('#cafeProduct' + index).val(product).trigger('change');
                }else{ 
                    var newOption = new Option(productName, product, true, true);
                    $('#cafeProduct' + index).append(newOption).trigger('change');
                }
        
                if($('#cafeModel' + index).find("option[value='" + model + "']").length){
                    $('#cafeModel' + index).val(model).trigger('change');
                }else{ 
                    var newOption = new Option(modelName, model, true, true);
                    $('#cafeModel' + index).append(newOption).trigger('change');
                }
        
                if($('#cafeUser' + index).find("option[value='" + user + "']").length){
                    $('#cafeUser' + index).val(user).trigger('change');
                }else{ 
                    var newOption = new Option(userName + ' '+ userSurname, user, true, true);
                    $('#cafeUser' + index).append(newOption).trigger('change');
                }

                // ELIMINAR PRODUCTO DE CAFETERÍA
                $('.btnDel' + index).click(function(){
                    var row = $(this).closest('tr')
            
                    var id = row.find('td.id').html()
                    if(id != ''){
                        toDelete.push(id)
                    }

                    row.remove()
                })
            })
        }
    });    

    //Update. Actualizamos los datos de la visita
    $('#saveEditVisit').click(function(){
        var validate = 0

        if($('#cafeBody tr').length > 0){
            $('#cafeBody tr').each(function(elem, index){
                var row = $(this)
                
                var indexTr = row.find('td.index').html()

                if(isEmpty($('#cafeAmount' + indexTr))){
                    validate++
                }
            })
        }

        if(validate == 0){
            var visit = $('#visit').val();
            var startCoffeShopCheck = $('#startCoffeShopCheck').is(':checked');
            var startCoffeShopUser = $('#startCoffeShopUser').val();
            var startCoffeShopTime = "null";
            if($('#startCoffeShopTime').val() != ''){
                startCoffeShopTime = moment($('#startCoffeShopTime').val(), "HH:mm").format('X');
            }
            var startCoffeShopResolved = $('#startCoffeShopResolved').is(':checked');
            var deliveryKeysCheck = $('#deliveryKeysCheck').is(':checked');
            var deliveryKeysUser = $('#deliveryKeysUser').val();
            var deliveryKeysTo = 'null';
            var deliveryKeysTime = "null";
            if($('#deliveryKeysTime').val() != ''){
                deliveryKeysTime = moment($('#deliveryKeysTime').val(), "HH:mm").format('X');
            }
            var deliveryKeysResolved = $('#deliveryKeysResolved').is(':checked');
            var courtesyQuestionCheck = $('#courtesyQuestionCheck').is(":checked");
            var courtesyQuestionUser = $('#courtesyQuestionUser').val();
            var courtesyQuestionTime = "null";
            if($('#courtesyQuestionTime').val() != ''){
                courtesyQuestionTime = moment($('#courtesyQuestionTime').val(), "HH:mm").format('X');
            }
            var courtesyQuestionResolved = $('#courtesyQuestionResolved').is(':checked');
            var roomReviewCheck = $('#roomReviewCheck').is(':checked');
            var roomReviewUser = $('#roomReviewUser').val();
            var roomReviewTime = "null";
            if($('#roomReviewTime').val() != ''){
                roomReviewTime = moment($('#roomReviewTime').val(), "HH:mm").format('X');
            }
            var roomReviewResolved = $('#roomReviewResolved').is(':checked');
            var roomHandkerchiefReviewCheck = $('#roomHandkerchiefReviewCheck').is(':checked');
            var roomHandkerchiefReviewUser = $('#roomHandkerchiefReviewUser').val();
            var roomHandkerchiefReviewTime = "null";
            if($('#roomHandkerchiefReviewTime').val() != ''){
                roomHandkerchiefReviewTime = moment($('#roomHandkerchiefReviewTime').val(), "HH:mm").format('X');
            }
            var roomHandkerchiefReviewResolved = $('#roomHandkerchiefReviewResolved').is(':checked');
            var toiletReviewCheck = $('#toiletReviewCheck').is(':checked');
            var toiletReviewUser = $('#toiletReviewUser').val();
            var toiletReviewTime = "null";
            if($('#toiletReviewTime').val() != ''){
                toiletReviewTime = moment($('#toiletReviewTime').val(), "HH:mm").format('X');
            }
            var toiletReviewResolved = $('#toiletReviewResolved').is(':checked');
            var toiletPaperReviewCheck = $('#toiletPaperReviewCheck').is(':checked');
            var toiletPaperReviewUser = $('#toiletPaperReviewUser').val();
            var toiletPaperReviewTime = "null";
            if($('#toiletPaperReviewTime').val() != ''){
                toiletPaperReviewTime = moment($('#toiletPaperReviewTime').val(), "HH:mm").format('X');
            }
            var toiletPaperReviewResolved = $('#toiletPaperReviewResolved').is(':checked');
            var roomBurialReviewCheck = $('#roomBurialReviewCheck').is(':checked');
            var roomBurialReviewUser = $('#roomBurialReviewUser').val();
            var roomBurialReviewTime = "null";
            if($('#roomBurialReviewTime').val() != ''){
                roomBurialReviewTime = moment($('#roomBurialReviewTime').val(), "HH:mm").format('X');
            }
            var roomBurialReviewResolved = $('#roomBurialReviewResolved').is(':checked');
            var roomTempCheck = $('#roomTempCheck').is(':checked');
            var roomTempUser = $('#roomTempUser').val();
            var roomTempTime = "null";
            if($('#roomTempTime').val() != ''){
                roomTempTime = moment($('#roomTempTime').val(), "HH:mm").format('X');
            }
            var roomTempResolved = $('#roomTempResolved').is(':checked');
    
            var burialTemp = $('#burialTemp').val();
            var burialTempCheck = $('#burialTempCheck').is(':checked');
            var burialTempUser = $('#burialTempUser').val();
            var burialTempTime = "null";
            if($('#burialTempTime').val() != ''){
                burialTempTime = moment($('#burialTempTime').val(), "HH:mm").format('X');
            }
            var burialTempResolved = $('#burialTempResolved').is(':checked');
            var thanatopraxieTempCheck = $('#thanatopraxieTempCheck').is(':checked');
            var thanatopraxieTempUser = $('#thanatopraxieTempUser').val();
            var thanatopraxieTempTime = "null";
            if($('#thanatopraxieTempTime').val() != ''){
                thanatopraxieTempTime = moment($('#thanatopraxieTempTime').val(), "HH:mm").format('X');
            }
            var thanatopraxieTempResolved = $('#thanatopraxieTempResolved').is(':checked');
            var controlProductsCoffeShopCheck = $('#controlProductsCoffeShopCheck').is(':checked');
            var controlProductsCoffeShopUser = $('#controlProductsCoffeShopUser').val();
            var controlProductsCoffeShopTime = "null";
            if($('#controlProductsCoffeShopTime').val() != ''){
                controlProductsCoffeShopTime = moment($('#controlProductsCoffeShopTime').val(), "HH:mm").format('X');
            }
            var controlProductsCoffeShopResolved = $('#controlProductsCoffeShopResolved').is(':checked');
            var offeringCheck = $('#offeringCheck').is(':checked');
            var offeringUser = $('#offeringUser').val();
            var offeringTime = "null";
            if($('#offeringTime').val() != ''){
                offeringTime = moment($('#offeringTime').val(), "HH:mm").format('X');
            }
            var offeringResolved = $('#offeringResolved').is(':checked');
            var commonBathroomsCleaningCheck = $('#commonBathroomsCleaningCheck').is(':checked');
            var commonBathroomsCleaningUser = $('#commonBathroomsCleaningUser').val();
            var commonBathroomsCleaningTime = "null";
            if($('#commonBathroomsCleaningTime').val() != ''){
                commonBathroomsCleaningTime = moment($('#commonBathroomsCleaningTime').val(), "HH:mm").format('X');
            }
            var commonBathroomsCleaningResolved = $('#commonBathroomsCleaningResolved').is(':checked');
            var roomBathroomsCleaningCheck = $('#roomBathroomsCleaningCheck').is(':checked');
            var roomBathroomsCleaningUser = $('#roomBathroomsCleaningUser').val();
            var roomBathroomsCleaningTime = "null";
            if($('#roomBathroomsCleaningTime').val() != ''){
                roomBathroomsCleaningTime = moment($('#roomBathroomsCleaningTime').val(), "HH:mm").format('X');
            }
            var roomBathroomsCleaningResolved = $('#roomBathroomsCleaningResolved').is(':checked');
            var roomCleaningCheck = $('#roomCleaningCheck').is(':checked');
            var roomCleaningUser = $('#roomCleaningUser').val();
            var roomCleaningTime = "null";
            if($('#roomCleaningTime').val() != ''){
                roomCleaningTime = moment($('#roomCleaningTime').val(), "HH:mm").format('X');
            }
            var roomCleaningResolved = $('#roomCleaningResolved').is(':checked');
            var thanatopraxieCleaningCheck = $('#thanatopraxieCleaningCheck').is(':checked');
            var thanatopraxieCleaningUser = $('#thanatopraxieCleaningUser').val();
            var thanatopraxieCleaningTime = "null";
            if($('#thanatopraxieCleaningTime').val() != ''){
                thanatopraxieCleaningTime = moment($('#thanatopraxieCleaningTime').val(), "HH:mm").format('X');
            }
            var thanatopraxieCleaningResolved = $('#thanatopraxieCleaningResolved').is(':checked');
            var commonZonesCleaningCheck = $('#commonZonesCleaningCheck').is(':checked');
            var commonZonesCleaningUser = $('#commonZonesCleaningUser').val();
            var commonZonesCleaningTime = "null";
            if($('#commonZonesCleaningTime').val() != ''){
                commonZonesCleaningTime = moment($('#commonZonesCleaningTime').val(), "HH:mm").format('X');
            }
            var commonZonesCleaningResolved = $('#commonZonesCleaningResolved').is(':checked');
            var burialCleaningCheck = $('#burialCleaningCheck').is(':checked');
            var burialCleaningUser = $('#burialCleaningUser').val();
            var burialCleaningTime = "null";
            if($('#burialCleaningTime').val() != ''){
                burialCleaningTime = moment($('#burialCleaningTime').val(), "HH:mm").format('X');
            }
            var burialCleaningResolved = $('#burialCleaningResolved').is(':checked');
            var notes = $('#notes').val();

            // PRODUCTOS DE CAFETERÍA
            var cafe = new Array
            $('#cafeBody tr').each(function(elem, index){
                var row = $(this)
                
                var i = row.find('td.index').html()

                var id = row.find('td.id').html()
                var amount = row.find('input#cafeAmount' + i).val()
                var product = row.find('select#cafeProduct' + i).val()
                var model = row.find('select#cafeModel' + i).val()
                var user = row.find('select#cafeUser' + i).val()

             
                cafe.push([id, visit, amount, product, model, user])
            })
    
            $.ajax({
                url: uri+"core/visitsControl/visits/updateVisit.php",
                data: {visit: visit, startCoffeShopCheck: startCoffeShopCheck, startCoffeShopUser: startCoffeShopUser, startCoffeShopTime: startCoffeShopTime, startCoffeShopResolved: startCoffeShopResolved, 
                    deliveryKeysCheck: deliveryKeysCheck, deliveryKeysUser: deliveryKeysUser, deliveryKeysTo: deliveryKeysTo, deliveryKeysTime: deliveryKeysTime, deliveryKeysResolved: deliveryKeysResolved, courtesyQuestionCheck: courtesyQuestionCheck, 
                    courtesyQuestionUser: courtesyQuestionUser, courtesyQuestionTime: courtesyQuestionTime, courtesyQuestionResolved: courtesyQuestionResolved, roomReviewCheck: roomReviewCheck, roomReviewUser: roomReviewUser, roomReviewTime: roomReviewTime, 
                    roomReviewResolved: roomReviewResolved, roomHandkerchiefReviewCheck: roomHandkerchiefReviewCheck, roomHandkerchiefReviewUser: roomHandkerchiefReviewUser, roomHandkerchiefReviewTime: roomHandkerchiefReviewTime, 
                    roomHandkerchiefReviewResolved: roomHandkerchiefReviewResolved, toiletReviewCheck: toiletReviewCheck, toiletReviewUser: toiletReviewUser, toiletReviewTime: toiletReviewTime, toiletReviewResolved: toiletReviewResolved, 
                    toiletPaperReviewCheck: toiletPaperReviewCheck, toiletPaperReviewUser: toiletPaperReviewUser, toiletPaperReviewTime: toiletPaperReviewTime, toiletPaperReviewResolved: toiletPaperReviewResolved, roomBurialReviewCheck: roomBurialReviewCheck, 
                    roomBurialReviewUser: roomBurialReviewUser, roomBurialReviewTime: roomBurialReviewTime, roomBurialReviewResolved: roomBurialReviewResolved, roomTempCheck: roomTempCheck, roomTempUser: roomTempUser, roomTempTime: roomTempTime, 
                    roomTempResolved: roomTempResolved, burialTemp: burialTemp, burialTempCheck: burialTempCheck, burialTempUser: burialTempUser, burialTempTime: burialTempTime, burialTempResolved: burialTempResolved, thanatopraxieTempCheck: thanatopraxieTempCheck, 
                    thanatopraxieTempUser: thanatopraxieTempUser, thanatopraxieTempTime: thanatopraxieTempTime, thanatopraxieTempResolved: thanatopraxieTempResolved, controlProductsCoffeShopCheck: controlProductsCoffeShopCheck, 
                    controlProductsCoffeShopUser: controlProductsCoffeShopUser, controlProductsCoffeShopTime: controlProductsCoffeShopTime, controlProductsCoffeShopResolved: controlProductsCoffeShopResolved, offeringCheck: offeringCheck, offeringUser: offeringUser, 
                    offeringTime: offeringTime, offeringResolved: offeringResolved, commonBathroomsCleaningCheck: commonBathroomsCleaningCheck, commonBathroomsCleaningUser: commonBathroomsCleaningUser, commonBathroomsCleaningTime: commonBathroomsCleaningTime, 
                    commonBathroomsCleaningResolved: commonBathroomsCleaningResolved, roomBathroomsCleaningCheck: roomBathroomsCleaningCheck, roomBathroomsCleaningUser: roomBathroomsCleaningUser, roomBathroomsCleaningTime: roomBathroomsCleaningTime, 
                    roomBathroomsCleaningResolved: roomBathroomsCleaningResolved, roomCleaningCheck: roomCleaningCheck, roomCleaningUser: roomCleaningUser, roomCleaningTime: roomCleaningTime, roomCleaningResolved: roomCleaningResolved, 
                    thanatopraxieCleaningCheck: thanatopraxieCleaningCheck, thanatopraxieCleaningUser: thanatopraxieCleaningUser, thanatopraxieCleaningTime: thanatopraxieCleaningTime, thanatopraxieCleaningResolved: thanatopraxieCleaningResolved, 
                    commonZonesCleaningCheck: commonZonesCleaningCheck, commonZonesCleaningUser: commonZonesCleaningUser, commonZonesCleaningTime: commonZonesCleaningTime, commonZonesCleaningResolved: commonZonesCleaningResolved, 
                    burialCleaningCheck: burialCleaningCheck, burialCleaningUser: burialCleaningUser, burialCleaningTime: burialCleaningTime, burialCleaningResolved: burialCleaningResolved, notes: notes, cafe: cafe, toDelete: toDelete},
                type: 'POST',
                async: false,
                success: function (data) {
                    data = $.parseJSON(data);
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La visita ha sido modificado con éxito.</div>');
                        setTimeout(() => {
                            $('#block-message').empty();
                            window.location.href = uri + "control-de-visitas/editar-visita/" + visit;
                        }, 1500);
                    }else{
                        $('#block-message').html('<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La visita no se ha podido modificar.</div>');
                        setTimeout(() => {
                            $('#block-message').empty();
                        }, 1500);
                    }
                }
            });
    
    
            //Go Top
            $('html, body').animate({scrollTop : 0},800);
        }
    });

    //Edit. Acción editar una incidencia
    $('.btn-edit').click(function () {

        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');

        $('#incidentType').val($(this).attr('id'));

        //Se asigna los datos de las incidencias en los modales
        $.post(uri+"core/incidents/read.php", {visitID: visit, type: $(this).attr('id')}, function(data){
            data = $.parseJSON(data);
            
            if(data!= null){
                $('#incident').val(data[0].description);                 
            }else{
                $('#incident').val(""); 
            }
        });                                

        //Mostramos la modal
        $('#incident-modal').modal('show');
    });

    //Create/Update. Actualizamos los datos de las incidencias
    $('#saveIncident').click(function(){
        //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud update
        var incident = $('#incident').val();        
        var type = $('#incidentType').val();
        switch(type){
            case "courtesyQuestionIncident": 
                var name = "Preguntas de cortesía";
                break;
            case "toiletPaperIncident": 
                var name = "Papel higiénico";
                break;
            case "cleaningBathroomsIncident": 
                var name = "Limpieza de baños";
                break;
            case "productsControlCafeIncident": 
                var name = "Control de productos en cafetería";
                break;
            case "productsCafeOfferIncident": 
                var name = "Ofrecimiento de productos cafetería";
                break;
            case "handkerchiefRoomIncident": 
                var name = "Pañuelos en sala";
                break;
            case "roomIncident": 
                var name = "Revisión Sala";
                break;
            case "roomTanatopraxiaIncident": 
                var name = "Revisión Sala Tanatopraxia";
                break;
            case "burialMoundIncident": 
                var name = "Revisión Túmulo";
                break; 
        }


        //Validaciones
        var validate = 0;
        if(isEmpty($("#incident-modal #formData #incident"))){
            validate++
        }

        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/incidents/read.php", {visitID: visit, type: type}, function(data){
                data = $.parseJSON(data);
                if(data!= null){
                    $.post(uri+"core/incidents/update.php", {visit: visit, type: type, description: incident}, function(data){
                        $('#block-message').empty();
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la incidencia se han actualizado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(() => {
                            $('#block-message').empty();
                        }, 1500);
                    });
                }else{
                    $.post(uri+"core/incidents/create.php", {visit: visit, type: type, name: name, description: incident}, function(data){
                        $('#block-message').empty();
                        if(data){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los datos de la incidencia se han creado con éxito.</div>');
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        }
                        setTimeout(() => {
                            $('#block-message').empty();
                        }, 1500);
                    });
                }
            });
            
            //Ocultamos la ventana modal
            $('#incident-modal').modal('hide');

            //Go Top
            $('html, body').animate({scrollTop : 0},800);
        }
    });

    // PRODUCTOS DE CAFETERÍA
    // LISTADO DE PRODUCTOS DE CAFETERÍA
    $('#cafeProductAdd').select2({
        containerCssClass: 'select2-cafeProductAdd',
        language: langSelect2,
        placeholder: '--',
        ajax: {
            url: uri + 'core/visitsControl/visitsDescriptions/dataProducts.php',
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
                            id: item.productID
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
        templateSelection: formatData,
    })

    var product
    $('#cafeProductAdd').change(function(){
        product = $(this).val()

        if(product == null){
            $('#cafeModelAdd').attr('disabled', true)
        }else{
            $('#cafeModelAdd').attr('disabled', false)

            // LISTADO DE MODELOS POR PRODUCTO
            $('#cafeModelAdd').select2({
                containerCssClass: 'select2-cafeModelAdd',
                language: langSelect2,
                placeholder: '--',
                ajax: {
                    url: uri + 'core/visitsControl/visitsDescriptions/dataModels.php?product=' + product,
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
                                    id: item.productModelID
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
                templateSelection: formatData,
            })
        }
    })

    // LISTADO DE USUARIOS
    $('#cafeUserAdd').select2({
        containerCssClass: 'select2-cafeUserAdd',
        language: langSelect2,
        placeholder: '--',
        ajax: {
            url: uri + 'core/visitsControl/visitsDescriptions/dataUsers.php',
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
                            id: item.userID
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
        templateSelection: formatData,
    })

    var toDelete = new Array
    $('#cafeBtnAdd').click(function(){
        var validate = 0

        if(isEmpty($('#cafeAmountAdd'))){
            validate++
        }
        if(isEmpty($('#cafeProductAdd'))){
            $('.select2-' + $('#cafeProductAdd').attr('id')).addClass('validateError')
            $('.select2-' + $('#cafeProductAdd').attr('class')).addClass('validateError')

            validate++
        }else{
            $('.select2-' + $('#cafeProductAdd').attr('id')).removeClass('validateError')
            $('.select2-' + $('#cafeProductAdd').attr('class')).removeClass('validateError')
        }
        if(isEmpty($('#cafeModelAdd'))){
            $('.select2-' + $('#cafeModelAdd').attr('id')).addClass('validateError')
            $('.select2-' + $('#cafeModelAdd').attr('class')).addClass('validateError')

            validate++
        }else{
            $('.select2-' + $('#cafeModelAdd').attr('id')).removeClass('validateError')
            $('.select2-' + $('#cafeModelAdd').attr('class')).removeClass('validateError')
        }
        if(isEmpty($('#cafeUserAdd'))){
            $('.select2-' + $('#cafeUserAdd').attr('id')).addClass('validateError')
            $('.select2-' + $('#cafeUserAdd').attr('class')).addClass('validateError')

            validate++
        }else{
            $('.select2-' + $('#cafeUserAdd').attr('id')).removeClass('validateError')
            $('.select2-' + $('#cafeUserAdd').attr('class')).removeClass('validateError')
        }

        if(validate == 0){
            var index = $('#cafeBody tr').length
            var amount = $('#cafeAmountAdd').val()
            var product = $('#cafeProductAdd').val()
            var productName = $('#cafeProductAddText #' + product).html()
            var model = $('#cafeModelAdd').val()
            var modelName = $('#cafeModelAddText #' + model).html()
            var user = $('#cafeUserAdd').val()
            var userName = $('#cafeUserAddText #' + user).html()
    
            $('#cafeBody').append(  '   <tr>' +
                                    '       <td width="5%" class="index hide">' + index + '</td>' +
                                    '       <td width="5%" class="id hide"></td>' +
                                    '       <td width="10%">' +
                                    '           <input type="number" min="1" class="cafeAmount input-medium" id="cafeAmount' + index + '" value="' + amount + '" />' +
                                    '       </td>' +
                                    '       <td width="10%">' +
                                    '           <select class="cafeProduct" id="cafeProduct' + index + '"></select>' +
                                    '       </td>' +
                                    '       <td width="10%">' +
                                    '           <select class="cafeModel" id="cafeModel' + index + '"></select>' +
                                    '       </td>' +
                                    '       <td width="10%">' +
                                    '           <select class="cafeUser" id="cafeUser' + index + '"></select>' +
                                    '       </td>' +
                                    '       <td width="5%">' +
                                    '           <ul class="actions-menu"><li><a href="javascript:void(0)" class="btnDel' + index + '"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>' +
                                    '       </td>' +
                                    '   </tr>')
    
            // LISTADO DE PRODUCTOS DE CAFETERÍA
            $('#cafeProduct' + index).select2({
                containerCssClass: 'select2-cafeProducts',
                language: langSelect2,
                placeholder: '--',
                allowClear: false,
                ajax: {
                    url: uri + 'core/visitsControl/visitsDescriptions/dataProducts.php',
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
                                    id: item.productID
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
                templateSelection: formatData,
            })

            $('#cafeProduct' + index).change(function(){
                product = $(this).val()

                $('#cafeModel' + index).val('').trigger('change')

                // LISTADO DE MODELOS POR PRODUCTO
                $('#cafeModel' + index).select2({
                    containerCssClass: 'select2-cafeModel',
                    language: langSelect2,
                    placeholder: '--',
                    ajax: {
                        url: uri + 'core/visitsControl/visitsDescriptions/dataModels.php?product=' + product,
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
                                        id: item.productModelID
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
                    templateSelection: formatData,
                })
            })

            // LISTADO DE MODELOS POR PRODUCTO
            $('#cafeModel' + index).select2({
                containerCssClass: 'select2-cafeModel',
                language: langSelect2,
                placeholder: '--',
                ajax: {
                    url: uri + 'core/visitsControl/visitsDescriptions/dataModels.php?product=' + product,
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
                                    id: item.productModelID
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
                templateSelection: formatData,
            })
        
            // LISTADO DE USUARIOS
            $('#cafeUser' + index).select2({
                containerCssClass: 'select2-cafeUsers',
                language: langSelect2,
                placeholder: '--',
                allowClear: false,
                ajax: {
                    url: uri + 'core/visitsControl/visitsDescriptions/dataUsers.php',
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
                                    id: item.userID
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
                templateSelection: formatData,
            })
    
            if($('#cafeProduct' + index).find("option[value='" + product + "']").length){
                $('#cafeProduct' + index).val(product).trigger('change');
            }else{ 
                var newOption = new Option(productName, product, true, true);
                $('#cafeProduct' + index).append(newOption).trigger('change');
            }
    
            if($('#cafeModel' + index).find("option[value='" + model + "']").length){
                $('#cafeModel' + index).val(model).trigger('change');
            }else{ 
                var newOption = new Option(modelName, model, true, true);
                $('#cafeModel' + index).append(newOption).trigger('change');
            }
    
            if($('#cafeUser' + index).find("option[value='" + user + "']").length){
                $('#cafeUser' + index).val(user).trigger('change');
            }else{ 
                var newOption = new Option(userName, user, true, true);
                $('#cafeUser' + index).append(newOption).trigger('change');
            }

            $('#cafeAmountAdd').val('')
            $('#cafeProductAdd').val('').trigger('change')
            $('#cafeModelAdd').attr('disabled', true).val('').trigger('change')
            $('#cafeUserAdd').val('').trigger('change')
        }
        
        // ELIMINAR PRODUCTO DE CAFETERÍA
        $('.btnDel' + index).click(function(){
            var row = $(this).closest('tr')
    
            var id = row.find('td.id').html()
            if(id != ''){
                toDelete.push(id)
            }

            row.remove()
        })
    })
})