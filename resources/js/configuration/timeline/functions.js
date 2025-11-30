/** @var settignsTimelineID Store settings timeline ID */
var settignsTimelineID = null;

/** @var pendingTasksColor color picker for pending tasks color */
var pendingTasksColor = null;

/** @var departuresTodayOwnColor color picker for departures today own color */
var departuresTodayOwnColor = null;

/** @var departuresTodayExternalColor color picker for departures today external color*/
var departuresTodayExternalColor = null;

/** @var cremationsOwnColor color picker for cremations own color */
var cremationsOwnColor = null;

/** @var cremationsExternalColor color picker for cremations external color*/
var cremationsExternalColor = null;

//Select2 functions for remote data
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
 * Gets timeline configuration values
 * 
 * @return {array}
 */
function getTimelineSettings() {
    var info;

    $.ajax({
        url : uri+'core/timeline/read.php',
        data : null,
        type : 'POST',
        async : false,
        success : function(data){
            info = $.parseJSON(data);
        }
    })
    return info;
}

/**
 * Configure dropdowns and inicializate fields
 */
function configurePage(){

    // Configure dropdown - Pending tasks
    $('#sectionPendingTasks').on('shown.bs.collapse', function(){
        $('#toolsIconPendingTasks').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        return false;
    })
    $('#sectionPendingTasks').on('hidden.bs.collapse', function(){
        $('#toolsIconPendingTasks').removeClass('fa-arrow-up').addClass('fa-arrow-down');
        return false;
    })

    // Configure dropdown - Departures today
    $('#sectionDeparturesToday').on('shown.bs.collapse', function(){
        $('#toolsIconDeparturesToday').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        return false;
    })
    $('#sectionDeparturesToday').on('hidden.bs.collapse', function(){
        $('#toolsIconDeparturesToday').removeClass('fa-arrow-up').addClass('fa-arrow-down');
        return false;
    })

    // Configure dropdown - Cremations
    $('#sectionCremations').on('shown.bs.collapse', function(){
        $('#toolsIconCremations').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        return false;
    })
    $('#sectionCremations').on('hidden.bs.collapse', function(){
        $('#toolsIconCremations').removeClass('fa-arrow-up').addClass('fa-arrow-down');
        return false;
    })

    // Configure dropdown - Personal tasks
    $('#sectionPersonalTasks').on('shown.bs.collapse', function(){
        $('#toolsIconPersonalTasks').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        return false;
    })
    $('#sectionPersonalTasks').on('hidden.bs.collapse', function(){
        $('#toolsIconPersonalTasks').removeClass('fa-arrow-up').addClass('fa-arrow-down');
        return false;
    })
}

/**
 * Set timeline values
 */
function setValues(){
    var settings = getTimelineSettings();

    settignsTimelineID = settings['id'] == '' ? null : settings['id'];

    // Pending tasks
    $("#pendingTasksColor").val(settings['pendingTasksColor']);

    pendingTasksColor = new KellyColorPicker({
        place : 'addPicker',
        input : 'pendingTasksColor'
    });

    // Departures today
    $("#departuresTodayOwnColor").val(settings['departuresTodayOwnColor']);
    $("#departuresTodayExternalColor").val(settings['departuresTodayExternalColor']);
    $("#departuresTodayWidth").val(settings['departuresTodayWidth']);

    departuresTodayOwnColor = new KellyColorPicker({
        place : 'addPicker',
        input : 'departuresTodayOwnColor'
    });

    departuresTodayExternalColor = new KellyColorPicker({
        place : 'addPicker',
        input : 'departuresTodayExternalColor'
    });

    // Cremations
    $("#cremationsOwnColor").val(settings['cremationsOwnColor']);
    $("#cremationsExternalColor").val(settings['cremationsExternalColor']);

    cremationsOwnColor = new KellyColorPicker({
        place : 'addPicker',
        input : 'cremationsOwnColor'
    });

    cremationsExternalColor = new KellyColorPicker({
        place : 'addPicker',
        input : 'cremationsExternalColor'
    });

    // Personal tasks
    $("#personalTasksAdvanceWidth").val(settings['personalTasksAdvance']);
}

/**
 * Checks timeline settings
 *
 * @return {array} info Info
 */
function checkTimeline(){
    $('#updateSettings').attr('disabled', true);

    var validate = 0
    var data = [];
    var errorPendingTasks = 0;
    var errorDeparturesToday = 0;
    var errorCremations = 0;
    var errorPersonalTasks = 0;

    // Checks pending taks section
    if(isEmpty($("#formPendingTasks #pendingTasksColor"))){
        validate++;
        errorPendingTasks++;
    }
    data['pendingTasksColor'] = $("#formPendingTasks #pendingTasksColor").val();

    // Checks departures today section
    if(isEmpty($("#formDeparturesToday #departuresTodayOwnColor"))){
        validate++;
        errorDeparturesToday++;
    }
    data['departuresTodayOwnColor'] = $("#formDeparturesToday #departuresTodayOwnColor").val();

    if(isEmpty($("#formDeparturesToday #departuresTodayExternalColor"))){
        validate++;
        errorDeparturesToday++;
    }
    data['departuresTodayExternalColor'] = $("#formDeparturesToday #departuresTodayExternalColor").val();

    if(isEmpty($("#formDeparturesToday #departuresTodayWidth"))){
        validate++;
        errorDeparturesToday++;
    }
    if(isMinValue($("#formDeparturesToday #departuresTodayWidth"), 4)){
        validate++;
        errorPersonalTasks++;
    }
    data['departuresTodayWidth'] = $("#formDeparturesToday #departuresTodayWidth").val();

    // Checks cremations section
    if(isEmpty($("#formCremations #cremationsOwnColor"))){
        validate++;
        errorCremations++;
    }
    data['cremationsOwnColor'] = $("#formCremations #cremationsOwnColor").val();

    if(isEmpty($("#formCremations #cremationsExternalColor"))){
        validate++;
        errorCremations++;
    }
    data['cremationsExternalColor'] = $("#formCremations #cremationsExternalColor").val();

    // Checks personal taks section
    if(isEmpty($("#formPersonalTasks #personalTasksAdvanceWidth"))){
        validate++;
        errorPersonalTasks++;
    }
    data['personalTasksAdvance'] = $("#formPersonalTasks #personalTasksAdvanceWidth").val();

    data.id = settignsTimelineID;

    /*
     * Checks tabs errors 
    */

    // Open pending tasks dropdown
    if(errorPendingTasks > 0 && $("#sectionPendingTasksHeader").hasClass('collapsed')){
        $("#sectionPendingTasksHeader").click();
    }

    // Open departures today dropdown
    if(errorDeparturesToday > 0 && $("#sectionDeparturesTodayHeader").hasClass('collapsed')){
        $("#sectionDeparturesTodayHeader").click();
    }

    // Open cremations dropdown
    if(errorCremations > 0 && $("#sectionCremationsHeader").hasClass('collapsed')){
        $("#sectionCremationsHeader").click();
    }

    // Open personal tasks dropdown
    if(errorPersonalTasks > 0 && $("#sectionPersonalTasksHeader").hasClass('collapsed')){
        $("#sectionPersonalTasksHeader").click();
    }

    var info = [];
    info.check = validate;
    info.data = data;

    return info;
}

/**
 * Submits updates a timeline settings
 *
 * @param {array} data Data
 */
function goUpdateTimeline(data){

    $.ajax({
        url : uri+'core/timeline/update.php',
        method : 'POST',
        data : Object.assign({}, data),
        success : function(data){
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La configuración del timeline ha sido actualizada con éxito.</div>');
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            }

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            $("#updateSettings").attr("disabled", false);
        },
        error : function(data){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            $("#updateSettings").attr("disabled", false);
        }
    })
}

$(function(){

    // Toolbar Bottom
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    $('#backLink').click(function(event){
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
    changeSpaceFooter()
    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Botón "Arriba"
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    configurePage();

    setValues();

    // Update timeline settings
    $("#updateSettings").click(function(){
        var info = checkTimeline();
        if(info.check == 0){
            goUpdateTimeline(info.data);
        }else{
            $("#updateSettings").attr("disabled", false);
            $('#modal-new-event #block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')
        }
    })
})