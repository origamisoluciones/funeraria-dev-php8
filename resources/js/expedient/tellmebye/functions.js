/** @var {string} expedientIdUrl Expedient ID */
var expedientIdUrl = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

/** @var {array} expedientTellmebyeData Expedient tellmebye data */
var expedientTellmebyeData = null;

/** @var {array} moreHiringIndex Store more hiring index */
var moreHiringIndex = 2;

/** @var {array} hiringData Store hiring data */
var hiringData = new Array;

/** @var {array} moreEventsIndex Store more events index */
var moreEventsIndex = 5;

/** @var {array} eventsData Store events data */
var eventsData = new Array;

/** @var {array} mortuaries Store mortuaries */
var mortuaries = new Array;

/** @var {array} rooms Store rooms */
var rooms = new Array;

/** @var {array} cameras Store cameras */
var cameras = new Array;

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

/** @var {int} tellmebyeMode Store tellmebye mode (0 = create, 1 = update) */
var tellmebyeMode = null;

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
        url: uri + 'core/expedients/tellmebye/getDataSheetInfo.php',
        data: {
            ID: expedientIdUrl
        },
        type : 'POST',
        dataType: 'json',
        async: false,
        success: function(data){
            expedientTellmebyeData = data;
        }
    })
}

/**
 * On change hiring trigger
 * 
 * @param {int} index Index
 * @param {object} hiringItems Hiring items
 */
function onChangeHiring(index, hiringItems = null){
    if(hiringItems == null){
        hiringData[index] = new Object;
        hiringData[index].id = '';
        hiringData[index].name = '';
        hiringData[index].surname = '';
        hiringData[index].nif = '';
        hiringData[index].relationship = '';
        hiringData[index].phone = '';
        hiringData[index].mobilePhone = '';
        hiringData[index].email = '';
        hiringData[index].address = '';
        hiringData[index].status = 'keep';
    }else{
        hiringData[index] = hiringItems;
    }

    $('#formData #hiringName' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].name = $(this).val();
    })
    $('#formData #hiringSurname' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].surname = $(this).val();
    })
    $('#formData #hiringNif' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].nif = $(this).val();
    })
    $('#formData #hiringRelationship' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].relationship = $(this).val();
    })
    $('#formData #hiringPhone' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].phone = $(this).val();
    })
    $('#formData #hiringMobilePhone' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].mobilePhone = $(this).val();
    })
    $('#formData #hiringEmail' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].email = $(this).val();
    })
    $('#formData #hiringAddress' + index).change(function(){
        var indexItem = $(this).closest('div.hiring-section').attr('moreHiringIndex');
        hiringData[indexItem].address = $(this).val();
    })
}

/**
 * On change event trigger
 * 
 * @param {int} index Index
 * @param {object} eventItems Event items
 */
function onChangeEvent(index, eventItems = null){
    if(eventItems == null){
        eventsData[index] = new Object;
        eventsData[index].id = '';
        eventsData[index].type = 'other';
        eventsData[index].name = '';
        eventsData[index].place = '';
        eventsData[index].room = '';
        eventsData[index].roomName = '';
        eventsData[index].address = '';
        eventsData[index].city = '';
        eventsData[index].camera = '';
        eventsData[index].cameraName = '';
        eventsData[index].startDate = '';
        eventsData[index].startTime = '';
        eventsData[index].endDate = '';
        eventsData[index].endTime = '';
        eventsData[index].status = 'keep';
    }else{
        eventsData[index] = eventItems;
    }

    switch(eventsData[index].type){
        case 'velation':
            $('#formData #eventVelationMortuary').change(function(){
                eventsData[0].place = $(this).val();
            })
            $('#formData #eventVelationRoom').change(function(){
                eventsData[0].room = $(this).val() == null ? '' : $(this).val();
                eventsData[0].roomName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventVelationMortuaryAddress').change(function(){
                eventsData[0].address = $(this).val();
            })
            $('#formData #eventVelationCity').change(function(){
                eventsData[0].city = $(this).val();
            })
            $('#formData #eventVelationCamera').change(function(){
                eventsData[0].camera = $(this).val() == null ? '' : $(this).val();
                eventsData[0].cameraName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventVelationStartDate').change(function(){
                eventsData[0].startDate = $(this).val();

                $('#formData #eventVelationEndDate').val($(this).val()).trigger('change');
            })
            $('#formData #eventVelationStartTime').change(function(){
                eventsData[0].startTime = $(this).val();
            })
            $('#formData #eventVelationEndDate').change(function(){
                eventsData[0].endDate = $(this).val();
            })
            $('#formData #eventVelationEndTime').change(function(){
                eventsData[0].endTime = $(this).val();
            })
        break;
        case 'ceremony':
            $('#formData #eventCeremonyPlace').change(function(){
                eventsData[1].place = $(this).val();
            })
            $('#formData #eventCeremonyRoom').change(function(){
                eventsData[1].room = $(this).val() == null ? '' : $(this).val();
                eventsData[1].roomName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventCeremonyAddress').change(function(){
                eventsData[1].address = $(this).val();
            })
            $('#formData #eventCeremonyCity').change(function(){
                eventsData[1].city = $(this).val();
            })
            $('#formData #eventCeremonyCamera').change(function(){
                eventsData[1].camera = $(this).val() == null ? '' : $(this).val();
                eventsData[1].cameraName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventCeremonyStartDate').change(function(){
                eventsData[1].startDate = $(this).val();
            })
            $('#formData #eventCeremonyStartTime').change(function(){
                eventsData[1].startTime = $(this).val();
            })
            $('#formData #eventCeremonyEndDate').change(function(){
                eventsData[1].endDate = $(this).val();
            })
            $('#formData #eventCeremonyEndTime').change(function(){
                eventsData[1].endTime = $(this).val();
            })
        break;
        case 'funeral':
            $('#formData #eventFuneralPlace').change(function(){
                eventsData[2].place = $(this).val();
            })
            $('#formData #eventFuneralRoom').change(function(){
                eventsData[2].room = $(this).val() == null ? '' : $(this).val();
                eventsData[2].roomName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventFuneralAddress').change(function(){
                eventsData[2].address = $(this).val();
            })
            $('#formData #eventFuneralCity').change(function(){
                eventsData[2].city = $(this).val();
            })
            $('#formData #eventFuneralCamera').change(function(){
                eventsData[2].camera = $(this).val() == null ? '' : $(this).val();
                eventsData[2].cameraName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventFuneralStartDate').change(function(){
                eventsData[2].startDate = $(this).val();
            })
            $('#formData #eventFuneralStartTime').change(function(){
                eventsData[2].startTime = $(this).val();
            })
            $('#formData #eventFuneralEndDate').change(function(){
                eventsData[2].endDate = $(this).val();
            })
            $('#formData #eventFuneralEndTime').change(function(){
                eventsData[2].endTime = $(this).val();
            })
        break;
        case 'cremation':
            $('#formData #eventCremationPlace').change(function(){
                eventsData[3].place = $(this).val();
            })
            $('#formData #eventCremationRoom').change(function(){
                eventsData[3].room = $(this).val() == null ? '' : $(this).val();
                eventsData[3].roomName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventCremationAddress').change(function(){
                eventsData[3].address = $(this).val();
            })
            $('#formData #eventCremationCity').change(function(){
                eventsData[3].city = $(this).val();
            })
            $('#formData #eventCremationCamera').change(function(){
                eventsData[3].camera = $(this).val() == null ? '' : $(this).val();
                eventsData[3].cameraName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventCremationStartDate').change(function(){
                eventsData[3].startDate = $(this).val();
            })
            $('#formData #eventCremationStartTime').change(function(){
                eventsData[3].startTime = $(this).val();
            })
            $('#formData #eventCremationEndDate').change(function(){
                eventsData[3].endDate = $(this).val();
            })
            $('#formData #eventCremationEndTime').change(function(){
                eventsData[3].endTime = $(this).val();
            })
        break;
        case 'burial':
            $('#formData #eventBurialPlace').change(function(){
                eventsData[4].place = $(this).val();
            })
            $('#formData #eventBurialRoom').change(function(){
                eventsData[4].room = $(this).val() == null ? '' : $(this).val();
                eventsData[4].roomName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventBurialAddress').change(function(){
                eventsData[4].address = $(this).val();
            })
            $('#formData #eventBurialCity').change(function(){
                eventsData[4].city = $(this).val();
            })
            $('#formData #eventBurialCamera').change(function(){
                eventsData[4].camera = $(this).val() == null ? '' : $(this).val();
                eventsData[4].cameraName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventBurialStartDate').change(function(){
                eventsData[4].startDate = $(this).val();
            })
            $('#formData #eventBurialStartTime').change(function(){
                eventsData[4].startTime = $(this).val();
            })
            $('#formData #eventBurialEndDate').change(function(){
                eventsData[4].endDate = $(this).val();
            })
            $('#formData #eventBurialEndTime').change(function(){
                eventsData[4].endTime = $(this).val();
            })
        break;
        case 'other':
            $('#formData #eventOtherName' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].name = $(this).val();
            })
            $('#formData #eventOtherPlace' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].place = $(this).val();
            })
            $('#formData #eventOtherRoom' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].room = $(this).val() == null ? '' : $(this).val();
                eventsData[indexItem].roomName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventOtherAddress' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].address = $(this).val();
            })
            $('#formData #eventOtherCity' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].city = $(this).val();
            })
            $('#formData #eventOtherCamera' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].camera = $(this).val() == null ? '' : $(this).val();
                eventsData[indexItem].cameraName = $(this).val() == null ? '' : $(this).select2('data')[0].text;
            })
            $('#formData #eventOtherStartDate' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].startDate = $(this).val();
            })
            $('#formData #eventOtherStartTime' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].startTime = $(this).val();
            })
            $('#formData #eventOtherEndDate' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].endDate = $(this).val();
            })
            $('#formData #eventOtherEndTime' + index).change(function(){
                var indexItem = $(this).closest('div.events-section').attr('moreEventsIndex');
                eventsData[indexItem].endTime = $(this).val();
            })
        break;
    }
}

/**
 * Init pickers (date and time pickers)
 */
function init(flag){
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

    if(flag){
        // SELECT2
        $.fn.select2.defaults.set("width", "100%");
        $('.select2').select2({
            language: 'es',
            placeholder: '--',
            allowClear: true
        });
    
        $('.select2-no-clear').select2({
            language: 'es',
            placeholder: '--',
            allowClear: false
        });
    
        // Select sin cuadro de búsquedas
        $('.infinitySelect').select2({
            language: 'es',
            placeholder: '--',
            allowClear: true,
            minimumResultsForSearch: Infinity
        });
    
        // Toogle switch
        // Show tv info
        $('.show-tv-info-no').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.show-tv-info-yes').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.show-tv-info-yes').removeClass('active');
                }
                if($(this).hasClass('btn-danger')){
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    $('.show-tv-info-yes').removeClass('btn-default').addClass('btn-success');
                }else{
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    $('.show-tv-info-yes').addClass('btn-default').removeClass('btn-success');
                }
            }
        })
        $('.show-tv-info-yes').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.show-tv-info-no').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.show-tv-info-no').removeClass('active');
                }
                if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success').addClass('btn-default');
                    $('.show-tv-info-no').removeClass('btn-default').addClass('btn-danger');
                }else{
                    $(this).addClass('btn-success').removeClass('btn-default');
                    $('.show-tv-info-no').addClass('btn-default').removeClass('btn-danger');
                }
            }
        })
        $('.show-tv-info-yes').click();
    
        // Show service room
        $('.show-service-room-no').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.show-service-room-yes').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.show-service-room-yes').removeClass('active');
                }
                if($(this).hasClass('btn-danger')){
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    $('.show-service-room-yes').removeClass('btn-default').addClass('btn-success');
                }else{
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    $('.show-service-room-yes').addClass('btn-default').removeClass('btn-success');
                }
            }
        })
        $('.show-service-room-yes').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.show-service-room-no').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.show-service-room-no').removeClass('active');
                }
                if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success').addClass('btn-default');
                    $('.show-service-room-no').removeClass('btn-default').addClass('btn-danger');
                }else{
                    $(this).addClass('btn-success').removeClass('btn-default');
                    $('.show-service-room-no').addClass('btn-default').removeClass('btn-danger');
                }
            }
        })
        $('.show-service-room-yes').click();
    
        // Create wall reminder
        $('.create-wall-reminder-no').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.create-wall-reminder-yes').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.create-wall-reminder-yes').removeClass('active');
                }
                if($(this).hasClass('btn-danger')){
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    $('.create-wall-reminder-yes').removeClass('btn-default').addClass('btn-success');
                }else{
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    $('.create-wall-reminder-yes').addClass('btn-default').removeClass('btn-success');
                }

                $('.supervised-no').click();
                $('#supervisedSection').addClass('d-none');
                $('.private-no').click();
                $('#privateSection').addClass('d-none');
            }
        })
        $('.create-wall-reminder-yes').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.create-wall-reminder-no').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.create-wall-reminder-no').removeClass('active');
                }
                if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success').addClass('btn-default');
                    $('.create-wall-reminder-no').removeClass('btn-default').addClass('btn-danger');
                }else{
                    $(this).addClass('btn-success').removeClass('btn-default');
                    $('.create-wall-reminder-no').addClass('btn-default').removeClass('btn-danger');
                }

                $('#supervisedSection').removeClass('d-none');
                $('#privateSection').removeClass('d-none');
            }
        })
        $('.create-wall-reminder-yes').click();

        // Supervised
        $('.supervised-no').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.supervised-yes').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.supervised-yes').removeClass('active');
                }
                if($(this).hasClass('btn-danger')){
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    $('.supervised-yes').removeClass('btn-default').addClass('btn-success');
                }else{
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    $('.supervised-yes').addClass('btn-default').removeClass('btn-success');
                }

                $('#privateSection').removeClass('d-none');
            }
        })
        $('.supervised-yes').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.supervised-no').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.supervised-no').removeClass('active');
                }
                if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success').addClass('btn-default');
                    $('.supervised-no').removeClass('btn-default').addClass('btn-danger');
                }else{
                    $(this).addClass('btn-success').removeClass('btn-default');
                    $('.supervised-no').addClass('btn-default').removeClass('btn-danger');
                }

                $('.private-no').click();
                $('#privateSection').addClass('d-none');
            }
        })
        $('.supervised-no').click();

        // Private
        $('.private-no').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.private-yes').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.private-yes').removeClass('active');
                }
                if($(this).hasClass('btn-danger')){
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    $('.private-yes').removeClass('btn-default').addClass('btn-success');
                }else{
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    $('.private-yes').addClass('btn-default').removeClass('btn-success');
                }

                $('#supervisedSection').removeClass('d-none');
                $('#wallPassword').val('');
                $('#passwordSection').addClass('d-none');
            }
        })
        $('.private-yes').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.private-no').addClass('active');
                }else{
                    $(this).addClass('active');
                    $('.private-no').removeClass('active');
                }
                if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success').addClass('btn-default');
                    $('.private-no').removeClass('btn-default').addClass('btn-danger');
                }else{
                    $(this).addClass('btn-success').removeClass('btn-default');
                    $('.private-no').addClass('btn-default').removeClass('btn-danger');
                }

                $('.supervised-no').click();
                $('#supervisedSection').addClass('d-none');
                $('#passwordSection').removeClass('d-none');
            }
        })
        $('.private-no').click();
    
        // Deceased picture
        $('.deceased-picture-no').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.deceased-picture-yes').addClass('active');
    
                    // Show image upload section
                    $('.deceased-picture-section').removeClass('d-none');
                }else{
                    $(this).addClass('active');
                    $('.deceased-picture-yes').removeClass('active');
    
                    // Hide image upload secion
                    $('.deceased-picture-section').addClass('d-none');

                    $('#deceasedPictureSrcSection').addClass('d-none');
                }
                if($(this).hasClass('btn-danger')){
                    $(this).removeClass('btn-danger').addClass('btn-default');
                    $('.deceased-picture-yes').removeClass('btn-default').addClass('btn-success');
                }else{
                    $(this).addClass('btn-danger').removeClass('btn-default');
                    $('.deceased-picture-yes').addClass('btn-default').removeClass('btn-success');
                }
            }
        })
        $('.deceased-picture-yes').click(function(){
            if(!$(this).hasClass('active')){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.deceased-picture-no').addClass('active');
    
                    // Hide image upload secion
                    $('.deceased-picture-section').addClass('d-none');
                }else{
                    $(this).addClass('active');
                    $('.deceased-picture-no').removeClass('active');
    
                    // Show image upload section
                    $('.deceased-picture-section').removeClass('d-none');
                }
                if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success').addClass('btn-default');
                    $('.deceased-picture-no').removeClass('btn-default').addClass('btn-danger');
                }else{
                    $(this).addClass('btn-success').removeClass('btn-default');
                    $('.deceased-picture-no').addClass('btn-default').removeClass('btn-danger');
                }
            }
        })
    }
}

/**
 * Saves form
 * 
 * @param {boolean} checkBusy Check busy flag
 * @param {boolean} reload Reload
 */
function saveForm(checkBusy, reload){
    if(checkBusy){
        $('#saveForm').attr('disabled', true);
    }else{
        $('#busyEventsModal #continueNoOverlap').attr('disabled', true);
    }

    // Validations
    clean("formData");

    var validate = 0;

    // Header
    if(isEmpty($("#tellmebyeMortuary"))){
        validate++;
    }
    if(isEmpty($("#tellmebyeRoom"))){
        validate++;
    }

    // Datos del Obituario -Fallecido-
    if(isEmpty($("#deceasedGender"))){
        validate++;
    }
    if(isEmpty($("#deceasedTitle"))){
        validate++;
    }
    if(isEmpty($("#deceasedName"))){
        validate++;
    }
    if(isEmpty($("#deceasedSurname"))){
        validate++;
    }
    if(isEmpty($("#formData #deceasedBirthdate"))){
        validate++;
    }else if(!isDate($("#formData #deceasedBirthdate"))){
        validate++;
    }
    if(isEmpty($("#formData #deceasedDeceasedDate"))){
        validate++;
    }else if(!isDate($("#formData #deceasedDeceasedDate"))){
        validate++;
    }
    if(isEmpty($("#formData #deceasedDeceasedTime"))){
        validate++;
    }else if(!isTime($("#formData #deceasedDeceasedTime"))){
        validate++;
    }
    if($('#formData .private-yes').hasClass('active')){
        if(isEmpty($("#formData #wallPassword"))){
            validate++;
        }
    }

    // Datos de los Administradores -Contratante-
    var hiringEmails = new Array;
    var repeatEmail = false;
    $.each(hiringData, function(index, elem){
        hiringData[index].status = 'keep';

        if(index == 0){
            if(isEmpty($('#formData #hiringName' + index))){
                validate++;
            }
            if(isEmpty($('#formData #hiringMobilePhone' + index))){
                validate++;
            }
            if(isEmpty($('#formData #hiringEmail' + index))){
                validate++;
            }
        }else{
            if(
                $('#formData #hiringName' + index).length > 0 &&
                (
                    $('#formData #hiringName' + index).val() != '' ||
                    $('#formData #hiringMobilePhone' + index).val() != '' ||
                    $('#formData #hiringEmail' + index).val() != ''
                )
            ){
                if(isEmpty($('#formData #hiringName' + index))){
                    validate++;
                }
                if(isEmpty($('#formData #hiringMobilePhone' + index))){
                    validate++;
                }
                if(isEmpty($('#formData #hiringEmail' + index))){
                    validate++;
                }
            }else if(elem.id != ''){
                hiringData[index].status = 'delete';
            }else if(elem.id == ''){
                hiringData[index].status = 'reject';
            }
        }

        if(elem.email != ''){
            var foundEmail = hiringEmails.find(email => email == elem.email);
            if(foundEmail != undefined){
                repeatEmail = true;
            }else{
                hiringEmails.push(elem.email);
            }
        }
    })

    // Datos de los Eventos -Ceremonia/Inhumación-
    $.each(eventsData, function(index, elem){
        eventsData[index].status = 'keep';

        switch(elem.type){
            case 'velation':
                if(
                    $('#formData #eventVelationMortuary').val() != '' ||
                    $('#formData #eventVelationRoom').val() != null ||
                    // $('#formData #eventVelationMortuaryAddress').val() != '' ||
                    // $('#formData #eventVelationCity').val() != '' ||
                    $('#formData #eventVelationStartDate').val() != '' ||
                    $('#formData #eventVelationStartTime').val() != '' ||
                    $('#formData #eventVelationEndTime').val() != '' ||
                    $('#formData #eventVelationEndTime').val() != ''
                ){
                    if(isEmpty($('#formData #eventVelationMortuary'))){
                        validate++;
                    }
                    if(isEmpty($('#formData #eventVelationRoom'))){
                        validate++;
                    }
                    // if(isEmpty($('#formData #eventVelationMortuaryAddress'))){
                    //     validate++;
                    // }
                    // if(isEmpty($('#formData #eventVelationCity'))){
                    //     validate++;
                    // }
                    var flagStartDate = true;
                    if(isEmpty($('#formData #eventVelationStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }else if(!isDate($('#formData #eventVelationStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }
                    var flagStartTime = true;
                    if(isEmpty($('#formData #eventVelationStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }else if(!isTime($('#formData #eventVelationStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }
                    var flagEndDate = true;
                    if(isEmpty($('#formData #eventVelationEndDate'))){
                        validate++;
                        flagEndDate = false;
                    }else if(!isDate($('#formData #eventVelationEndDate'))){
                        validate++;
                        flagEndDate = false;
                    }
                    var flagEndTime = true;
                    if(isEmpty($('#formData #eventVelationEndTime'))){
                        validate++;
                        flagEndTime = false;
                    }else if(!isTime($('#formData #eventVelationEndTime'))){
                        validate++;
                        flagEndTime = false;
                    }
                    if(flagStartDate && flagStartTime){
                        eventsData[index].startDate = moment($('#formData #eventVelationStartDate').val() + ' ' + $('#formData #eventVelationStartTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if(flagEndDate && flagEndTime){
                        eventsData[index].endDate = moment($('#formData #eventVelationEndDate').val() + ' ' + $('#formData #eventVelationEndTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if($('#formData #eventVelationCamera').val() != null){
                        if(isEmpty($('#formData #eventVelationCamera'))){
                            validate++;
                        }
                    }

                    if(tellmebyeMode == 0){
                        eventsData[index].freeRoom = true;

                        if($('#formData #eventVelationCamera').val() != null){
                            eventsData[index].freeCamera = true;
                        }
                    }
                }else if(elem.id != ''){
                    eventsData[index].status = 'delete';
                }else if(elem.id == ''){
                    eventsData[index].status = 'reject';
                }
            break;
            case 'ceremony':
                if(
                    $('#formData #eventCeremonyPlace').val() != '' ||
                    $('#formData #eventCeremonyRoom').val() != null ||
                    // $('#formData #eventCeremonyAddress').val() != '' ||
                    // $('#formData #eventCeremonyCity').val() != '' ||
                    $('#formData #eventCeremonyStartDate').val() != '' ||
                    $('#formData #eventCeremonyStartTime').val() != ''
                ){
                    if(isEmpty($('#formData #eventCeremonyPlace'))){
                        validate++;
                    }
                    if($('#formData #eventCeremonyRoom').val() != null){
                        if(isEmpty($('#formData #eventCeremonyEndDate'))){
                            validate++;
                        }
                        if(!isTime($('#formData #eventCeremonyEndTime'))){
                            validate++;
                        }
                    }
                    // if(isEmpty($('#formData #eventCeremonyAddress'))){
                    //     validate++;
                    // }
                    // if(isEmpty($('#formData #eventCeremonyCity'))){
                    //     validate++;
                    // }
                    var flagStartDate = true;
                    if(isEmpty($('#formData #eventCeremonyStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }else if(!isDate($('#formData #eventCeremonyStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }
                    var flagStartTime = true;
                    if(isEmpty($('#formData #eventCeremonyStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }else if(!isTime($('#formData #eventCeremonyStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }
                    if(flagStartDate && flagStartTime){
                        eventsData[index].startDate = moment($('#formData #eventCeremonyStartDate').val() + ' ' + $('#formData #eventCeremonyStartTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if(
                        $('#formData #eventCeremonyEndDate').val() != '' &&
                        $('#formData #eventCeremonyEndTime').val() != ''
                    ){
                        eventsData[index].endDate = moment($('#formData #eventCeremonyEndDate').val() + ' ' + $('#formData #eventCeremonyEndTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }else{
                        eventsData[index].endDate = '';
                    }
                    if($('#formData #eventCeremonyCamera').val() != null){
                        if(isEmpty($('#formData #eventCeremonyCamera'))){
                            validate++;
                        }
                    }

                    if(tellmebyeMode == 0){
                        if($('#formData #eventCeremonyRoom').val() != null){
                            eventsData[index].freeRoom = true;
                        }

                        if($('#formData #eventCeremonyCamera').val() != null){
                            eventsData[index].freeCamera = true;
                        }
                    }
                }else if(elem.id != ''){
                    eventsData[index].status = 'delete';
                }else if(elem.id == ''){
                    eventsData[index].status = 'reject';
                }
            break;
            case 'funeral':
                if(
                    $('#formData #eventFuneralPlace').val() != '' ||
                    $('#formData #eventFuneralRoom').val() != null ||
                    // $('#formData #eventFuneralAddress').val() != '' ||
                    // $('#formData #eventFuneralCity').val() != '' ||
                    $('#formData #eventFuneralStartDate').val() != '' ||
                    $('#formData #eventFuneralStartTime').val() != '' ||
                    $('#formData #eventFuneralEndDate').val() != '' ||
                    $('#formData #eventFuneralEndTime').val() != ''
                ){
                    if(isEmpty($('#formData #eventFuneralPlace'))){
                        validate++;
                    }
                    if($('#formData #eventFuneralRoom').val() != null){
                        if(isEmpty($('#formData #eventFuneralEndDate'))){
                            validate++;
                        }
                        if(!isTime($('#formData #eventFuneralEndTime'))){
                            validate++;
                        }
                    }
                    // if(isEmpty($('#formData #eventFuneralAddress'))){
                    //     validate++;
                    // }
                    // if(isEmpty($('#formData #eventFuneralCity'))){
                    //     validate++;
                    // }
                    var flagStartDate = true;
                    if(isEmpty($('#formData #eventFuneralStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }else if(!isDate($('#formData #eventFuneralStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }
                    var flagStartTime = true;
                    if(isEmpty($('#formData #eventFuneralStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }else if(!isTime($('#formData #eventFuneralStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }
                    if(flagStartDate && flagStartTime){
                        eventsData[index].startDate = moment($('#formData #eventFuneralStartDate').val() + ' ' + $('#formData #eventFuneralStartTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if(
                        $('#formData #eventFuneralEndDate').val() != '' ||
                        $('#formData #eventFuneralEndTime').val() != ''
                    ){
                        eventsData[index].endDate = moment($('#formData #eventFuneralEndDate').val() + ' ' + $('#formData #eventFuneralEndTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }else{
                        eventsData[index].endDate = '';
                    }
                    if($('#formData #eventFuneralCamera').val() != null){
                        if(isEmpty($('#formData #eventFuneralCamera'))){
                            validate++;
                        }
                    }

                    if(tellmebyeMode == 0){
                        if($('#formData #eventFuneralRoom').val() != null){
                            eventsData[index].freeRoom = true;
                        }

                        if($('#formData #eventFuneralCamera').val() != null){
                            eventsData[index].freeCamera = true;
                        }
                    }
                }else if(elem.id != ''){
                    eventsData[index].status = 'delete';
                }else if(elem.id == ''){
                    eventsData[index].status = 'reject';
                }
            break;
            case 'cremation':
                if(
                    $('#formData #eventCremationPlace').val() != '' ||
                    $('#formData #eventCremationRoom').val() != null ||
                    // $('#formData #eventCremationAddress').val() != '' ||
                    // $('#formData #eventCremationCity').val() != '' ||
                    $('#formData #eventCremationStartDate').val() != '' ||
                    $('#formData #eventCremationStartTime').val() != '' ||
                    $('#formData #eventCremationEndDate').val() != '' ||
                    $('#formData #eventCremationEndTime').val() != ''
                ){
                    if(isEmpty($('#formData #eventCremationPlace'))){
                        validate++;
                    }
                    if($('#formData #eventCremationRoom').val() != null){
                        if(isEmpty($('#formData #eventCremationEndDate'))){
                            validate++;
                        }
                        if(!isTime($('#formData #eventCremationEndTime'))){
                            validate++;
                        }
                    }
                    // if(isEmpty($('#formData #eventCremationAddress'))){
                    //     validate++;
                    // }
                    // if(isEmpty($('#formData #eventCremationCity'))){
                    //     validate++;
                    // }
                    var flagStartDate = true;
                    if(isEmpty($('#formData #eventCremationStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }else if(!isDate($('#formData #eventCremationStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }
                    var flagStartTime = true;
                    if(isEmpty($('#formData #eventCremationStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }else if(!isTime($('#formData #eventCremationStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }
                    if(flagStartDate && flagStartTime){
                        eventsData[index].startDate = moment($('#formData #eventCremationStartDate').val() + ' ' + $('#formData #eventCremationStartTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if(
                        $('#formData #eventCremationEndDate').val() != '' ||
                        $('#formData #eventCremationEndTime').val() != ''
                    ){
                        eventsData[index].endDate = moment($('#formData #eventCremationEndDate').val() + ' ' + $('#formData #eventCremationEndTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }else{
                        eventsData[index].endDate = '';
                    }
                    if($('#formData #eventCremationCamera').val() != null){
                        if(isEmpty($('#formData #eventCremationCamera'))){
                            validate++;
                        }
                    }

                    if(tellmebyeMode == 0){
                        if($('#formData #eventCremationRoom').val() != null){
                            eventsData[index].freeRoom = true;
                        }

                        if($('#formData #eventCremationCamera').val() != null){
                            eventsData[index].freeCamera = true;
                        }
                    }
                }else if(elem.id != ''){
                    eventsData[index].status = 'delete';
                }else if(elem.id == ''){
                    eventsData[index].status = 'reject';
                }
            break;
            case 'burial':
                if(
                    $('#formData #eventBurialPlace').val() != '' ||
                    $('#formData #eventBurialRoom').val() != null ||
                    // $('#formData #eventBurialAddress').val() != '' ||
                    // $('#formData #eventBurialCity').val() != '' ||
                    $('#formData #eventBurialStartDate').val() != '' ||
                    $('#formData #eventBurialStartTime').val() != '' ||
                    $('#formData #eventBurialEndDate').val() != '' ||
                    $('#formData #eventBurialEndTime').val() != ''
                ){
                    if(isEmpty($('#formData #eventBurialPlace'))){
                        validate++;
                    }
                    if($('#formData #eventBurialRoom').val() != null){
                        if(isEmpty($('#formData #eventBurialEndDate'))){
                            validate++;
                        }
                        if(!isTime($('#formData #eventBurialEndTime'))){
                            validate++;
                        }
                    }
                    // if(isEmpty($('#formData #eventBurialAddress'))){
                    //     validate++;
                    // }
                    // if(isEmpty($('#formData #eventBurialCity'))){
                    //     validate++;
                    // }
                    var flagStartDate = true;
                    if(isEmpty($('#formData #eventBurialStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }else if(!isDate($('#formData #eventBurialStartDate'))){
                        validate++;
                        flagStartDate = false;
                    }
                    var flagStartTime = true;
                    if(isEmpty($('#formData #eventBurialStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }else if(!isTime($('#formData #eventBurialStartTime'))){
                        validate++;
                        flagStartTime = false;
                    }
                    if(flagStartDate && flagStartTime){
                        eventsData[index].startDate = moment($('#formData #eventBurialStartDate').val() + ' ' + $('#formData #eventBurialStartTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if(
                        $('#formData #eventBurialEndDate').val() != '' ||
                        $('#formData #eventBurialEndTime').val() != ''
                    ){
                        eventsData[index].endDate = moment($('#formData #eventBurialEndDate').val() + ' ' + $('#formData #eventBurialEndTime').val(), 'DD/MM/YYYY HH:mm').format('X');
                    }else{
                        eventsData[index].endDate = '';
                    }
                    if($('#formData #eventBurialCamera').val() != null){
                        if(isEmpty($('#formData #eventBurialCamera'))){
                            validate++;
                        }
                    }

                    if(tellmebyeMode == 0){
                        if($('#formData #eventBurialRoom').val() != null){
                            eventsData[index].freeRoom = true;
                        }

                        if($('#formData #eventBurialCamera').val() != null){
                            eventsData[index].freeCamera = true;
                        }
                    }
                }else if(elem.id != ''){
                    eventsData[index].status = 'delete';
                }else if(elem.id == ''){
                    eventsData[index].status = 'reject';
                }
            break;
            case 'other':
                if(
                    $('#formData #eventOtherName' + index).length > 0 &&
                    (
                        $('#formData #eventOtherName' + index).val() != '' ||
                        $('#formData #eventOtherPlace' + index).val() != '' ||
                        $('#formData #eventOtherRoom' + index).val() != null ||
                        // $('#formData #eventOtherAddress' + index).val() != '' ||
                        // $('#formData #eventOtherCity' + index).val() != '' ||
                        $('#formData #eventOtherStartDate' + index).val() != '' ||
                        $('#formData #eventOtherStartTime' + index).val() != '' ||
                        $('#formData #eventOtherEndDate' + index).val() != '' ||
                        $('#formData #eventOtherEndTime' + index).val() != ''
                    )
                ){
                    if(isEmpty($('#formData #eventOtherName' + index))){
                        validate++;
                    }
                    if($('#formData #eventOtherRoom' + index).val() != null){
                        if(isEmpty($('#formData #eventOtherEndDate' + index))){
                            validate++;
                        }
                        if(!isTime($('#formData #eventOtherEndTime' + index))){
                            validate++;
                        }
                    }
                    if(isEmpty($('#formData #eventOtherPlace' + index))){
                        validate++;
                    }
                    // if(isEmpty($('#formData #eventOtherAddress' + index))){
                    //     validate++;
                    // }
                    // if(isEmpty($('#formData #eventOtherCity' + index))){
                    //     validate++;
                    // }
                    var flagStartDate = true;
                    if(isEmpty($('#formData #eventOtherStartDate' + index))){
                        validate++;
                        flagStartDate = false;
                    }else if(!isDate($('#formData #eventOtherStartDate' + index))){
                        validate++;
                        flagStartDate = false;
                    }
                    var flagStartTime = true;
                    if(isEmpty($('#formData #eventOtherStartTime' + index))){
                        validate++;
                        flagStartTime = false;
                    }else if(!isTime($('#formData #eventOtherStartTime' + index))){
                        validate++;
                        flagStartTime = false;
                    }
                    if(flagStartDate && flagStartTime){
                        eventsData[index].startDate = moment($('#formData #eventOtherStartDate' + index).val() + ' ' + $('#formData #eventOtherStartTime' + index).val(), 'DD/MM/YYYY HH:mm').format('X');
                    }
                    if(
                        $('#formData #eventOtherEndDate' + index).val() != '' ||
                        $('#formData #eventOtherEndTime' + index).val() != ''
                    ){
                        eventsData[index].endDate = moment($('#formData #eventOtherEndDate' + index).val() + ' ' + $('#formData #eventOtherEndTime' + index).val(), 'DD/MM/YYYY HH:mm').format('X');
                    }else{
                        eventsData[index].endDate = '';
                    }
                    if($('#formData #eventOtherCamera' + index).val() != null){
                        if(isEmpty($('#formData #eventOtherCamera' + index))){
                            validate++;
                        }
                    }
                
                    if(tellmebyeMode == 0){
                        if($('#formData #eventOtherRoom' + index).val() != null){
                            eventsData[index].freeRoom = true;
                        }

                        if($('#formData #eventOtherCamera' + index).val() != null){
                            eventsData[index].freeCamera = true;
                        }
                    }
                }else if(elem.id != ''){
                    eventsData[index].status = 'delete';
                }else if(elem.id == ''){
                    eventsData[index].status = 'reject';
                }
            break;
        }
    })

    if(repeatEmail){
        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El correo electrónico no se puede repetir en los datos de los administradores.</div>');
        setTimeout(function(){
            $('#block-message').empty();
        }, 5000);

        if(checkBusy){
            $('#saveForm').attr('disabled', false);
        }else{
            $('#busyEventsModal #continueNoOverlap').attr('disabled', false);
        }
    }else{
        if(validate == 0){
            // Request data
            // Header
            var showTvInfo = $('#formData .show-tv-info-no').hasClass('active') ? 0 : 1;
            var showServiceRoom = $('#formData .show-service-room-no').hasClass('active') ? 0 : 1;
            var createWallReminder = $('#formData .create-wall-reminder-no').hasClass('active') ? 0 : 1;
            var supervised = $('#formData .supervised-no').hasClass('active') ? 0 : 1;
            var private = $('#formData .private-no').hasClass('active') ? 0 : 1;
            var wallPassword = $('#formData #wallPassword').val();
            var tellmebyeMortuary = $('#formData #tellmebyeMortuary').val();
            var tellmebyeRoom = $('#formData #tellmebyeRoom').val();
            var tellmebyeRoomName = $('#formData #tellmebyeRoom').select2('data')[0].text;
        
            // Datos del Obituario -Fallecido-
            var deceasedGender = $('#formData #deceasedGender').val();
            var deceasedTitle = $('#formData #deceasedTitle').val();
            var deceasedName = $('#formData #deceasedName').val();
            var deceasedSurname = $('#formData #deceasedSurname').val();
            var deceasedAlias = $('#formData #deceasedAlias').val();
            var deceasedBirthdate = moment($('#formData #deceasedBirthdate').val(), 'DD/MM/YYYY').format('X');
            var deceasedDeceasedDate = moment($('#formData #deceasedDeceasedDate').val() + ' ' + $('#formData #deceasedDeceasedTime').val(), 'DD/MM/YYYY HH:mm').format('X');
            var deceasedPicture = $('#formData .deceased-picture-no').hasClass('active') ? 0 : 1;
            var wallPassword = $('#formData #wallPassword').val();
    
            var checkBusyParam = checkBusy ? 1 : 0;
        
            $.ajax({
                url: uri + 'core/expedients/tellmebye/saveDataSheet.php',
                data: {
                    expedient: expedientIdUrl,
                    showTvInfo: showTvInfo,
                    showServiceRoom: showServiceRoom,
                    createWallReminder: createWallReminder,
                    supervised: supervised,
                    private: private,
                    wallPassword: wallPassword,
                    tellmebyeMortuary: tellmebyeMortuary,
                    tellmebyeRoom: tellmebyeRoom,
                    tellmebyeRoomName: tellmebyeRoomName,
                    deceasedGender: deceasedGender,
                    deceasedTitle: deceasedTitle,
                    deceasedName: deceasedName,
                    deceasedSurname: deceasedSurname,
                    deceasedAlias: deceasedAlias,
                    deceasedBirthdate: deceasedBirthdate,
                    deceasedDeceasedDate: deceasedDeceasedDate,
                    deceasedPicture: deceasedPicture,
                    wallPassword: wallPassword,
                    checkBusy: checkBusyParam,
                    hiringData: hiringData,
                    eventsData: eventsData
                },
                type: 'POST',
                async: false,
                dataType: 'json',
                success: function(data){
                    if(data[0]){
                        if(data[1].length == 0){
                            if(!checkBusy){
                                $('#busyEventsModal').modal('hide');
                            }
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La ficha de Tellmebye ha sido guardada con éxito.</div>');
                            // if(COMPANY != 8){
                                if(reload){
                                    setTimeout(function(){
                                        window.location.reload();
                                    }, 1500);
                                }else{
                                    setTimeout(function(){
                                        window.location.href = changeTabRef;
                                    }, 1500);
                                }
                            // }
                        }else{
                            $('#busyEventsModal #busySection').empty();
                            $.each(data[1], function(index, elem){
                                switch(elem.event.type){
                                    case 'velation':
                                        var eventType = 'Velación';
                                    break;
                                    case 'ceremony':
                                        var eventType = 'Ceremonia';
                                    break;
                                    case 'funeral':
                                        var eventType = 'Funeral';
                                    break;
                                    case 'cremation':
                                        var eventType = 'Cremación';
                                    break;
                                    case 'burial':
                                        var eventType = 'Inhumación';
                                    break;
                                    default:
                                        var eventType = elem.event.name;
                                    break;
                                }
    
                                var html =
                                    '   <table class="table table-striped table-bordered display">' +
                                    '       <thead>' +
                                    '           <tr>' +
                                    '               <th>' +
                                    '                   <input type="checkbox" id="freeEventCheck' + elem.event.index + '" index="' + elem.event.index + '">' +
                                    '               </th>' +
                                    '               <th class="text-center" colspan="4"><span>Evento: ' + eventType + '</span> <span style="margin-left: 80px;">Sala: ' + elem.event.roomName + '</span> <span style="margin-left: 80px;">Cámara: ' + (elem.event.cameraName == '' ? '-' : elem.event.cameraName) + '</span></th>' +
                                    '           </tr>' +
                                    '           <tr>'+
                                    '               <th>Expediente</th>' +
                                    '               <th>Fallecido</th>' +
                                    '               <th>Evento</th>' +
                                    '               <th>Fecha y hora de inicio</th>' +
                                    '               <th>Fecha y hora de fin</th>' +
                                    '           </tr>'+
                                    '       </thead>' +
                                    '       <tbody>'
                                ;
    
                                $.each(elem.overlaped, function(index, item){
                                    switch(item.type){
                                        case 'velation':
                                            var eventType = 'Velación';
                                        break;
                                        case 'ceremony':
                                            var eventType = 'Ceremonia';
                                        break;
                                        case 'funeral':
                                            var eventType = 'Funeral';
                                        break;
                                        case 'cremation':
                                            var eventType = 'Cremación';
                                        break;
                                        case 'burial':
                                            var eventType = 'Inhumación';
                                        break;
                                        default:
                                            var eventType = item.name;
                                        break;
                                    }
                                    html +=
                                        '       <tr>' +
                                        '           <td>' + item.number + '</td>' +
                                        '           <td>' + item.deceasedTitle + ' ' + item.deceasedName + ' ' + item.deceasedSurname + '</td>' +
                                        '           <td>' + eventType + '</td>' +
                                        '           <td>' + moment(item.startDate, 'X').format('DD/MM/YYYY HH:mm') + '</td>' +
                                        '           <td>' + moment(item.endDate, 'X').format('DD/MM/YYYY HH:mm') + '</td>' +
                                        '       </tr>'
                                    ;
                                })
    
                                html +=
                                    '       </tbody>' +
                                    '   </table>'
                                ;
                                $('#busyEventsModal #busySection').append(html);
    
                                $('#freeEventCheck' + elem.event.index).click(function(){
                                    var index = $(this).attr('index');
                                    if($(this).prop('checked')){
                                        eventsData[index].freeRoom = true;
                                        eventsData[index].freeCamera = true;
                                    }else{
                                        eventsData[index].freeRoom = false;
                                        eventsData[index].freeCamera = false;
                                    }
                                })
                                $('#freeEventCheck' + elem.event.index).click();
                            })
    
                            $('#busyEventsModal').modal('show');
    
                            if(checkBusy){
                                $('#saveForm').attr('disabled', false);
                            }else{
                                $('#busyEventsModal #continueNoOverlap').attr('disabled', false);
                            }
                        }
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
    
                        if(checkBusy){
                            $('#saveForm').attr('disabled', false);
                        }else{
                            $('#busyEventsModal #continueNoOverlap').attr('disabled', false);
                        }
                        // if(COMPANY != 8){
                            setTimeout(function(){
                                window.location.reload();
                            }, 1500);
                        // }
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    
                    if(checkBusy){
                        $('#saveForm').attr('disabled', false);
                    }else{
                        $('#busyEventsModal #continueNoOverlap').attr('disabled', false);
                    }
                    // if(COMPANY != 8) {
                        setTimeout(function(){
                            window.location.reload();
                        }, 1500);
                    // }
                }
            });
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>');
            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
    
            if(checkBusy){
                $('#saveForm').attr('disabled', false);
            }else{
                $('#busyEventsModal #continueNoOverlap').attr('disabled', false);
            }
        }
    }
}

/**
 * Reload form
 */
function reloadForm(){
    $('#reloadForm').attr('disabled', true);

    $.ajax({
        url: uri + 'core/expedients/tellmebye/reloadDataSheet.php',
        data: {
            expedient: expedientIdUrl
        },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            if(data != null){
                // Sub-header
                var tellmebyeMortuaryFlag = false;
                if(data.tellmebyeMortuary != '' && data.tellmebyeMortuary != null){
                    $('#tellmebyeMortuary').val(data.tellmebyeMortuary).trigger('change');
                    if($('#tellmebyeMortuary').val() == null){
                        var option = new Option(data.tellmebyeMortuaryName, data.tellmebyeMortuary, true, true);
                        $('#tellmebyeMortuary').append(option).trigger('change');
                    }
                    tellmebyeMortuaryFlag = true;
                }else{
                    $('#tellmebyeMortuary').val(null).trigger('change');
                }

                var tellmebyeRoomFlag = false;
                if(data.tellmebyeRoom != '' && data.tellmebyeRoom != null){
                    $('#tellmebyeRoom').val(data.tellmebyeRoom).trigger('change');
                    if($('#tellmebyeRoom').val() == null){
                        var option = new Option(data.tellmebyeRoomName, data.tellmebyeRoom, true, true);
                        $('#tellmebyeRoom').append(option).trigger('change');
                    }
                    $('#tellmebyeRoom').attr('disabled', true);
                    
                    tellmebyeRoomFlag = true;
                }else{
                    $('#tellmebyeRoom').val(null).trigger('change');
                    $('#tellmebyeRoom').attr('disabled', true);
                }

                if(!tellmebyeMortuaryFlag || !tellmebyeRoomFlag){
                    var warningText = '';
                    if(!tellmebyeMortuaryFlag){
                        warningText += 'Debes seleccionar un tanatorio propio que tenga una sucursal de Tellmebye asociada';
                    }
                    if(!tellmebyeRoomFlag){
                        warningText += (warningText == '' ? 'Debes seleccionar ' : ' y ') + 'una sala en Tellmebye';
                    }
                    warningText += ' en la ficha del expediente';

                    $('#subheaderWarning').text(warningText);
                    $('#subheaderWarningSection').removeClass('hide');
                }

                // Datos del Obituario -Fallecido-
                $('#formData #deceasedGender').val(data.deceasedGender);
                $('#formData #deceasedTitle').val(data.deceasedGender == 'Hombre' ? 'D.' : 'Dña.');
                $('#formData #deceasedName').val(data.deceasedName);
                $('#formData #deceasedSurname').val(data.deceasedSurname);
                $('#formData #deceasedAlias').val(data.extraText);
                if(data.deceasedBirthday != null && data.deceasedDate != null){
                    $('#formData #deceasedAge').val(moment(data.deceasedDate, 'YYYY-MM-DD').diff(moment(data.deceasedBirthday, 'YYYY-MM-DD'), 'years'));
                }else{
                    $('#formData #deceasedAge').val('');
                }
                if(data.deceasedBirthday != null){
                    $('#formData #deceasedBirthdate').val(moment(data.deceasedBirthday, 'YYYY-MM-DD').format('DD/MM/YYYY'));
                }else{
                    $('#formData #deceasedBirthdate').val('');
                }
                if(data.deceasedDate != null){
                    $('#formData #deceasedDeceasedDate').val(moment(data.deceasedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
                    $('#formData #deceasedDeceasedTime').val(moment(data.deceasedTime, 'HH:mm').format('HH:mm'));
                }else{
                    $('#formData #deceasedDeceasedDate').val('');
                    $('#formData #deceasedDeceasedTime').val('');
                }

                // Datos de los Administradores -Contratante-
                $('#formData #hiringName0').val(data.familyContactName).trigger('change');
                $('#formData #hiringSurname0').val(data.familyContactSurname).trigger('change');
                $('#formData #hiringNif0').val(data.familyContactNIF).trigger('change');
                $('#formData #hiringRelationship0').val(data.familyContactRelationship).trigger('change');
                $('#formData #hiringPhone0').val(data.familyContactPhone).trigger('change');
                $('#formData #hiringMobilePhone0').val(data.familyContactMobilePhone).trigger('change');
                $('#formData #hiringEmail0').val(data.familyContactMail).trigger('change');
                $('#formData #hiringAddress0').val(data.familyContactAddress).trigger('change');

                // Datos de los Eventos -Ceremonia/Inhumación-
                // Velation
                $('#formData #eventVelationMortuary').val(data.deceasedMortuaryName).trigger('change');
                if(data.tellmebyeRoom != '' && data.tellmebyeRoom != null){
                    $('#eventVelationRoom').val(data.tellmebyeRoom).trigger('change');
                    if($('#eventVelationRoom').val() == null){
                        var option = new Option(data.tellmebyeRoomName, data.tellmebyeRoom, true, true);
                        $('#eventVelationRoom').append(option).trigger('change');
                    }
                    $('#eventVelationRoom').attr('disabled', true);
                }else{
                    $('#eventVelationRoom').val(null).trigger('change');
                    $('#eventVelationRoom').attr('disabled', true);

                    $('#eventVelationWarning').text('Debes seleccionar una sala en Tellmebye en la ficha del expediente');
                    $('#eventVelationWarningSection').removeClass('hide');
                }
                $('#formData #eventVelationMortuaryAddress').val(data.deceasedMortuaryName == 'Otro' ? data.deceasedMortuaryAddressOther : data.deceasedMortuaryAddress).trigger('change');
                $('#formData #eventVelationCity').val(data.deceasedMortuaryLocation).trigger('change');
                if(data.startVelacionDate != null && data.startVelacionDate != ''){
                    $('#formData #eventVelationStartDate').val(moment(data.startVelacionDate, 'YYYY-MM-DD').format('DD/MM/YYYY')).trigger('change');
                }else if(data.funeralHomeEntryDate != null && data.funeralHomeEntryDate != ''){
                    $('#formData #eventVelationStartDate').val(moment(data.funeralHomeEntryDate, 'YYYY-MM-DD').format('DD/MM/YYYY')).trigger('change');
                }else{
                    $('#formData #eventVelationStartDate').val('').trigger('change');
                }
                if(data.startVelacionTime != null && data.startVelacionTime != ''){
                    $('#formData #eventVelationStartTime').val(moment(data.startVelacionTime, 'HH:mm:ss').format('HH:mm')).trigger('change');
                }else if(data.funeralHomeEntryTime != null && data.funeralHomeEntryTime != ''){
                    $('#formData #eventVelationStartTime').val(moment(data.funeralHomeEntryTime, 'HH:mm:ss').format('HH:mm')).trigger('change');
                }else{
                    $('#formData #eventVelationStartTime').val('').trigger('change');
                }
                if(data.funeralDate != null && data.funeralDate != ''){
                    $('#formData #eventVelationEndDate').val(moment(data.funeralDate, 'YYYY-MM-DD').format('DD/MM/YYYY')).trigger('change');
                }else{
                    $('#formData #eventVelationEndDate').val('').trigger('change');
                }
                if(data.funeralTime != null && data.funeralTime != ''){
                    $('#formData #eventVelationEndTime').val(moment(data.funeralTime, 'HH:mm:ss').format('HH:mm')).trigger('change');
                }else{
                    $('#formData #eventVelationEndTime').val('').trigger('change');
                }

                // Ceremony
                $('#formData #eventCeremonyPlace').val(data.churchName).trigger('change');
                $('#formData #eventCeremonyAddress').val(data.churchAddress).trigger('change');
                $('#formData #eventCeremonyCity').val(data.churchLocation).trigger('change');
                if(data.ceremonyDate != null && data.ceremonyDate != ''){
                    $('#formData #eventCeremonyStartDate').val(moment(data.ceremonyDate, 'YYYY-MM-DD').format('DD/MM/YYYY')).trigger('change');
                }else{
                    $('#formData #eventCeremonyStartDate').val('').trigger('change');
                }
                if(data.ceremonyTime != null && data.ceremonyTime != ''){
                    $('#formData #eventCeremonyStartTime').val(moment(data.ceremonyTime, 'HH:mm:ss').format('HH:mm')).trigger('change');
                }else{
                    $('#formData #eventCeremonyStartTime').val('').trigger('change');
                }

                // Funeral
                if(data.funeralDateNew != null && data.funeralTimeNew != null){
                    $('#formData #eventFuneralPlace').val(data.churchName).trigger('change');
                    $('#formData #eventFuneralAddress').val(data.churchAddress).trigger('change');
                    $('#formData #eventFuneralCity').val(data.churchLocation).trigger('change');
                    if(data.ceremonyDate != null && data.ceremonyDate != ''){
                        $('#formData #eventFuneralStartDate').val(moment(data.ceremonyDate, 'YYYY-MM-DD').format('DD/MM/YYYY')).trigger('change');
                    }else{
                        $('#formData #eventFuneralStartDate').val('').trigger('change');
                    }
                    if(data.ceremonyTime != null && data.ceremonyTime != ''){
                        $('#formData #eventFuneralStartTime').val(moment(data.ceremonyTime, 'HH:mm:ss').format('HH:mm')).trigger('change');
                    }else{
                        $('#formData #eventFuneralStartTime').val('').trigger('change');
                    }
                }else{
                    $('#formData #eventFuneralPlace').val('').trigger('change');
                    $('#formData #eventFuneralAddress').val('').trigger('change');
                    $('#formData #eventFuneralCity').val('').trigger('change');
                    $('#formData #eventFuneralStartDate').val('').trigger('change');
                    $('#formData #eventFuneralStartTime').val('').trigger('change');
                }

                // Cremation
                $('#formData #eventCremationPlace').val(data.crematoriumName).trigger('change');
                $('#formData #eventCremationAddress').val(data.crematoriumAddress).trigger('change');
                $('#formData #eventCremationCity').val(data.crematoriumLocation).trigger('change');
                if(data.crematoriumStart != null && data.crematoriumStart != ''){
                    $('#formData #eventCremationStartDate').val(moment(data.crematoriumStart, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')).trigger('change');
                    $('#formData #eventCremationStartTime').val(moment(data.crematoriumStart, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')).trigger('change');
                }else{
                    $('#formData #eventCremationStartDate').val('').trigger('change');
                    $('#formData #eventCremationStartTime').val('').trigger('change');
                }
                if(data.crematoriumEnd != null && data.crematoriumEnd != ''){
                    $('#formData #eventCremationEndDate').val(moment(data.crematoriumEnd, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')).trigger('change');
                    $('#formData #eventCremationEndTime').val(moment(data.crematoriumEnd, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')).trigger('change');
                }else{
                    $('#formData #eventCremationEndDate').val('').trigger('change');
                    $('#formData #eventCremationEndTime').val('').trigger('change');
                }

                // Burial
                $('#formData #eventBurialPlace').val(data.cemeteryName).trigger('change');
                $('#formData #eventBurialAddress').val(data.cemeteryAddress).trigger('change');
                $('#formData #eventBurialCity').val(data.cemeteryLocationName).trigger('change');
                if(data.funeralDateBurial != null && data.funeralDateBurial != ''){
                    $('#formData #eventBurialStartDate').val(moment(data.funeralDateBurial, 'YYYY-MM-DD').format('DD/MM/YYYY')).trigger('change');
                }else{
                    $('#formData #eventBurialStartDate').val('').trigger('change');
                }
                if(data.funeralTimeBurial != null && data.funeralTimeBurial != ''){
                    $('#formData #eventBurialStartTime').val(moment(data.funeralTimeBurial, 'HH:mm:ss').format('HH:mm')).trigger('change');
                }else{
                    $('#formData #eventBurialStartTime').val('').trigger('change');
                }
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }

            $('#reloadForm').attr('disabled', false);
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)

            $('#reloadForm').attr('disabled', false);
        }
    });
}

/**
 * Gets info by mortuary
 * 
 * @param {int} mortuary Mortuary
 * @return bool
 */
function getInfoByMortuary(mortuary){
    var info = null;

    $.ajax({
        url: uri + 'core/expedients/tellmebye/getInfoByMortuary.php',
        method: 'POST',
        data: {
            mortuary: mortuary
        },
        async: false,
        success: function(data){
            try{
                info = $.parseJSON(data)
            }catch(e){
                info = null;
            }
        },
        error: function(){
            info = null;
        }
    })

    return info;
}

/**
 * Sort select2 values
 * 
 * @param {string} a
 * @param {string} b
 */
function sortSelect2(a, b){
    return a.text.localeCompare(b.text);
}

/**
 * Uploads an image
 */
function uploadImage(){
    $('#uploadImage').attr('disabled', true);

    if(document.getElementById('deceasedPicture').files.length == 0){
        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debes seleccionar una imagen para subir.</div>');
        setTimeout(function(){
            $('#block-message').empty();
        }, 5000)
        
        $('#uploadImage').attr('disabled', false);

        return false;
    }

    var tellmebyeMortuary = $('#formData #tellmebyeMortuary').val();
    if(tellmebyeMortuary == null){
        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Debes seleccionar tanatorio para poder subir una imagen.</div>');
        setTimeout(function(){
            $('#block-message').empty();
        }, 5000)
        
        $('#uploadImage').attr('disabled', false);

        return false;
    }

    var file = document.getElementById('deceasedPicture').files[0];

    var data = new FormData;
    data.append('expedient', expedientIdUrl);
    data.append('tellmebyeMortuary', tellmebyeMortuary);
    data.append('file', file);
    
    $.ajax({
        url: uri + 'core/expedients/tellmebye/uploadImage.php',
        method: 'POST',
        contentType: false,
        data: data,
        dataType: 'json',
        processData: false,
        cache: false,
        async: false,
        success: function(data){
            if(data){
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La imagen ha sido subida con éxito.</div>');
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            setTimeout(function(){
                $('#block-message').empty();
            }, 5000)
        }
    })

    $('#uploadImage').attr('disabled', false);
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

    $('.changeTab').click(function(e){
        changeTabRef = $(this).attr("href");
        saveForm(true, false);
        e.preventDefault();
    })

    // Plugins
    init(true);

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
    if(expedientTellmebyeData == null){
        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
        setTimeout(function(){
            $('#block-message').empty()
        }, 5000)
        return false;
    }

    // Mortuaries
    $.each(expedientTellmebyeData.delegations, function(index, elem){
        mortuaries.push({id: elem.id, text: elem.name});
    })

    $('#tellmebyeMortuary').select2({
        language: langSelect2,
        placeholder: 'Selecciona un tanatorio...',
        allowClear: false,
        data: mortuaries,
        disabled: true
    })
    $('#tellmebyeMortuary').val(null).trigger('change');
    $('#tellmebyeMortuary').change(function(){
        var value = $(this).val();
        
        $('.tellmebye-room').val(null).trigger('change');
        $('.tellmebye-camera').val(null).trigger('change');

        if(value == null){
            $('.tellmebye-room').attr('disabled', true);
            $('.tellmebye-camera').attr('disabled', true);

            rooms = new Array;
            cameras = new Array;
        }else{
            var info = getInfoByMortuary(value);
            if(info != null){
                var roomsAux = new Array;
                $.each(info.rooms, function(index, elem){
                    roomsAux.push({id: elem.id, text: elem.name});
                })
                rooms = roomsAux.sort(sortSelect2);

                $('.tellmebye-room').empty().select2({
                    language: langSelect2,
                    placeholder: 'Selecciona una sala...',
                    allowClear: true,
                    disabled: false,
                    data: rooms
                })
                $('.tellmebye-room').val(null).trigger('change');
    
                var camerasAux = new Array;
                $.each(info.cameras, function(index, elem){
                    camerasAux.push({id: elem.id, text: elem.name});
                })
                cameras = camerasAux.sort(sortSelect2);

                $('.tellmebye-camera').empty().select2({
                    language: langSelect2,
                    placeholder: 'Selecciona una cámara...',
                    allowClear: true,
                    disabled: false,
                    data: cameras
                })
                $('.tellmebye-camera').val(null).trigger('change');
            }else{
                $('.tellmebye-room').attr('disabled', true);
                $('.tellmebye-camera').attr('disabled', true);
            }
        }
    })

    $('.tellmebye-room').select2({
        language: langSelect2,
        placeholder: 'Selecciona una sala...',
        allowClear: true,
        disabled: true
    })
    $('.tellmebye-room').val(null).trigger('change');

    $('.tellmebye-camera').select2({
        language: langSelect2,
        placeholder: 'Selecciona una cámara...',
        allowClear: true,
        disabled: true
    })
    $('.tellmebye-camera').val(null).trigger('change');

    // More hiring
    $('#addMoreHiring').click(function(){
        var html = 
            '   <div class="hiring-section" id="moreHiringIndexSection' + moreHiringIndex + '" moreHiringIndex="' + moreHiringIndex + '">' +
            '       <hr>' +
            '       <div class="row">' +
            '           <div class="col-xs-3">' +
            '               <label class="toNormal">Nombre del Administrador</label>' +
            '               <input type="text" class="form-control" name="hiringName' + moreHiringIndex + '" id="hiringName' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringName' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '           <div class="col-xs-3">' +
            '               <label class="toNormal">Apellidos del Administrador</label>' +
            '               <input type="text" class="form-control" name="hiringSurname' + moreHiringIndex + '" id="hiringSurname' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringSurname' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '           <div class="col-xs-2">' +
            '               <label class="toNormal">DNI</label>' +
            '               <input type="text" class="form-control" name="hiringNif' + moreHiringIndex + '" id="hiringNif' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringNif' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '           <div class="col-xs-2">' +
            '               <label class="toNormal">Parentesco</label>' +
            '               <input type="text" class="form-control" name="hiringRelationship' + moreHiringIndex + '" id="hiringRelationship' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringRelationship' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '           <div class="col-xs-2">' +
            '               <label class="toNormal">Teléfono fijo</label>' +
            '               <input type="text" class="form-control" name="hiringPhone' + moreHiringIndex + '" id="hiringPhone' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringPhone' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '       </div>' +
            '       <div class="row">' +
            '           <div class="col-xs-2">' +
            '               <label class="toNormal">Teléfono Móvil</label>' +
            '               <input type="text" class="form-control" name="hiringMobilePhone' + moreHiringIndex + '" id="hiringMobilePhone' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringMobilePhone' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '           <div class="col-xs-4">' +
            '               <label class="toNormal">Dirección de eMail</label>' +
            '               <input type="text" class="form-control" name="hiringEmail' + moreHiringIndex + '" id="hiringEmail' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringEmail' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '           <div class="col-xs-6">' +
            '               <label class="toNormal">Domicilio</label>' +
            '               <input type="text" class="form-control" name="hiringAddress' + moreHiringIndex + '" id="hiringAddress' + moreHiringIndex + '" autocomplete="off">' +
            '               <span class="inputError" id="hiringAddress' + moreHiringIndex + 'Error"></span>' +
            '           </div>' +
            '       </div>' +
            '       <div class="row">' +
            '           <div class="col-xs-12">' +
            '               <button type="button" class="float-right btn btn-danger" id="deleteHiring' + moreHiringIndex + '" moreHiringIndex="' + moreHiringIndex + '">Eliminar administrador</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>'
        
        $('#moreHiring').append(html);

        onChangeHiring(moreHiringIndex);

        $('#deleteHiring' + moreHiringIndex).click(function(){
            var index = $(this).attr('moreHiringIndex');
            $('#moreHiringIndexSection' + index).remove();

            hiringData[index].status = 'delete';
        })

        moreHiringIndex++;
    })

    // More events
    $('#addEvent').click(function(){
        var html = 
            '   <div class="events-section" id="moreEventsIndexSection' + moreEventsIndex + '" moreEventsIndex="' + moreEventsIndex + '">' +
            '       <fieldset>' +
            '           <legend class="toBold fsExp">' +
            '               <input type="text" class="form-control" name="eventOtherName' + moreEventsIndex + '" id="eventOtherName' + moreEventsIndex + '" autocomplete="off">' +
            '           </legend>' +
            '           <div class="row">' +
            '               <div class="col-xs-3">' +
            '                   <label class="toNormal">Lugar</label>' +
            '                   <input type="text" class="form-control" name="eventOtherPlace' + moreEventsIndex + '" id="eventOtherPlace' + moreEventsIndex + '" autocomplete="off">' +
            '                   <span class="inputError" id="eventOtherPlace' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '               <div class="col-xs-3">' +
            '                   <label class="toNormal">Sala asignada</label>' +
            '                   <select class="form-control tellmebye-room" name="eventOtherRoom' + moreEventsIndex + '" id="eventOtherRoom' + moreEventsIndex + '"></select>' +
            '                   <span class="inputError" id="eventOtherRoom' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '               <div class="col-xs-4">' +
            '                   <label class="toNormal">Dirección</label>' +
            '                   <input type="text" class="form-control" name="eventOtherAddress' + moreEventsIndex + '" id="eventOtherAddress' + moreEventsIndex + '" autocomplete="off">' +
            '                   <span class="inputError" id="eventOtherAddress' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '               <div class="col-xs-2">' +
            '                   <label class="toNormal">Municipio</label>' +
            '                   <input type="text" class="form-control" name="eventOtherCity' + moreEventsIndex + '" id="eventOtherCity' + moreEventsIndex + '" autocomplete="off">' +
            '                   <span class="inputError" id="eventOtherCity' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '           </div>' +
            '           <div class="row">' +
            '               <div class="col-xs-3">' +
            '                   <label class="toNormal">Cámara asignada</label>' +
            '                   <select class="form-control tellmebye-camera" name="eventOtherCamera' + moreEventsIndex + '" id="eventOtherCamera' + moreEventsIndex + '"></select>' +
            '                   <span class="inputError" id="eventOtherCamera' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '               <div class="col-xs-2">' +
            '                   <div class="float-right">' +
            '                       <label class="toNormal">Fecha</label>' +
            '                       <div class="input-group date">' +
            '                           <input type="text" class="form-control datepicker" name="eventOtherStartDate' + moreEventsIndex + '" id="eventOtherStartDate' + moreEventsIndex + '" autocomplete="off">' +
            '                           <div class="input-group-addon">' +
            '                               <i class="fa fa-calendar"></i>' +
            '                           </div>' +
            '                       </div>' +
            '                       <span class="inputError" id="eventOtherStartDate' + moreEventsIndex + 'Error"></span>' +
            '                   </div>' +
            '               </div>' +
            '               <div class="col-xs-2">' +
            '                   <label class="toNormal">Hora</label>' +
            '                   <div class="input-group bootstrap-timepicker timepicker">' +
            '                       <input type="text" class="form-control time" name="eventOtherStartTime' + moreEventsIndex + '" id="eventOtherStartTime' + moreEventsIndex + '" autocomplete="off">' +
            '                       <div class="input-group-addon">' +
            '                           <i class="fa fa-clock-o"></i>' +
            '                       </div>' +
            '                   </div>' +
            '                   <span class="inputError" id="eventOtherStartTime' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '               <div class="col-xs-2">' +
            '                   <div class="float-right">' +
            '                       <label class="toNormal">Fecha</label>' +
            '                       <div class="input-group date">' +
            '                           <input type="text" class="form-control datepicker" name="eventOtherEndDate' + moreEventsIndex + '" id="eventOtherEndDate' + moreEventsIndex + '" autocomplete="off">' +
            '                           <div class="input-group-addon">' +
            '                               <i class="fa fa-calendar"></i>' +
            '                           </div>' +
            '                       </div>' +
            '                       <span class="inputError" id="eventOtherEndDate' + moreEventsIndex + 'Error"></span>' +
            '                   </div>' +
            '               </div>' +
            '               <div class="col-xs-2">' +
            '                   <label class="toNormal">Hora</label>' +
            '                   <div class="input-group bootstrap-timepicker timepicker">' +
            '                       <input type="text" class="form-control time" name="eventOtherEndTime' + moreEventsIndex + '" id="eventOtherEndTime' + moreEventsIndex + '" autocomplete="off">' +
            '                       <div class="input-group-addon">' +
            '                           <i class="fa fa-clock-o"></i>' +
            '                       </div>' +
            '                   </div>' +
            '                   <span class="inputError" id="eventOtherEndTime' + moreEventsIndex + 'Error"></span>' +
            '               </div>' +
            '               <div class="col-xs-1"></div>' +
            '           </div>' +
            '           <div class="row">' +
            '               <div class="col-xs-12">' +
            '                   <button type="button" class="float-right btn btn-danger" id="deleteEvent' + moreEventsIndex + '" moreEventsIndex="' + moreEventsIndex + '">Eliminar evento</button>' +
            '               </div>' +
            '           </div>' +
            '       </fieldset>' +
            '   </div>'
        ;

        $('#moreEvents').append(html);

        init(false);

        if($('#tellmebyeMortuary').val() == null){
            $('#eventOtherRoom' + moreEventsIndex).select2({
                language: langSelect2,
                placeholder: 'Selecciona una sala...',
                allowClear: true,
                disabled: true
            })
            $('#eventOtherRoom' + moreEventsIndex).val(null).trigger('change');
    
            $('#eventOtherCamera' + moreEventsIndex).select2({
                language: langSelect2,
                placeholder: 'Selecciona una cámara...',
                allowClear: true,
                disabled: true
            })
            $('#eventOtherCamera' + moreEventsIndex).val(null).trigger('change');
        }else{
            $('#eventOtherRoom' + moreEventsIndex).select2({
                language: langSelect2,
                placeholder: 'Selecciona una sala...',
                allowClear: true,
                disabled: false,
                data: rooms
            })
            $('#eventOtherRoom' + moreEventsIndex).val(null).trigger('change');

            $('#eventOtherCamera' + moreEventsIndex).select2({
                language: langSelect2,
                placeholder: 'Selecciona una cámara...',
                allowClear: true,
                disabled: false,
                data: cameras
            })
            $('#eventOtherCamera' + moreEventsIndex).val(null).trigger('change');
        }

        $('#eventOtherCamera' + moreEventsIndex).val(null).trigger('change');

        onChangeEvent(moreEventsIndex);

        $('#deleteEvent' + moreEventsIndex).click(function(){
            if(confirm('¿Deseas eliminar el evento? Recuerda que para que se borre el evento, tienes que guardar la ficha de Tellmebye en el margen inferior derecho')){
                var index = $(this).attr('moreEventsIndex');
                $('#moreEventsIndexSection' + index).remove();
    
                eventsData[index].status = 'delete';
            }
        })

        moreEventsIndex++;
    })

    // Load data
    if(expedientTellmebyeData.loadedFrom == 'expedient'){ // Loaded from expedient data
        // Tellmebye mode
        tellmebyeMode = 0;

        // Reload button
        $('#reloadForm').remove();

        $('.numberExp').text(expedientTellmebyeData.number);
        $('#expedientNumber').val(expedientTellmebyeData.number);
        $('.footer-static-bottom #deceased').text(' ' + expedientTellmebyeData.deceasedName + ' ' + expedientTellmebyeData.deceasedSurname);
    
        // Header
        $('#formData #familyAttendance').val(expedientTellmebyeData.familyAssistance);

        // Sub-header
        var tellmebyeMortuaryFlag = false;
        if(expedientTellmebyeData.tellmebyeMortuary != '' && expedientTellmebyeData.tellmebyeMortuary != null){
            $('#tellmebyeMortuary').val(expedientTellmebyeData.tellmebyeMortuary).trigger('change');
            if($('#tellmebyeMortuary').val() == null){
                var option = new Option(expedientTellmebyeData.tellmebyeMortuaryName, expedientTellmebyeData.tellmebyeMortuary, true, true);
                $('#tellmebyeMortuary').append(option).trigger('change');
            }
            tellmebyeMortuaryFlag = true;
        }

        var tellmebyeRoomFlag = false;
        if(expedientTellmebyeData.tellmebyeRoom != '' && expedientTellmebyeData.tellmebyeRoom != null){
            $('#tellmebyeRoom').val(expedientTellmebyeData.tellmebyeRoom).trigger('change');
            if($('#tellmebyeRoom').val() == null){
                var option = new Option(expedientTellmebyeData.tellmebyeRoomName, expedientTellmebyeData.tellmebyeRoom, true, true);
                $('#tellmebyeRoom').append(option).trigger('change');
            }
            $('#tellmebyeRoom').attr('disabled', true);
            
            tellmebyeRoomFlag = true;
        }else{
            $('#tellmebyeRoom').attr('disabled', true);
        }

        if(!tellmebyeMortuaryFlag || !tellmebyeRoomFlag){
            var warningText = '';
            if(!tellmebyeMortuaryFlag){
                warningText += 'Debes seleccionar un tanatorio propio que tenga una sucursal de Tellmebye asociada';
            }
            if(!tellmebyeRoomFlag){
                warningText += (warningText == '' ? 'Debes seleccionar ' : ' y ') + 'una sala para Tellmebye';
            }
            warningText += ' en la ficha del expediente';

            $('#subheaderWarning').text(warningText);
            $('#subheaderWarningSection').removeClass('hide');
        }

        // Datos del Obituario -Fallecido-
        $('#formData #deceasedGender').val(expedientTellmebyeData.deceasedGender);
        $('#formData #deceasedTitle').val(expedientTellmebyeData.deceasedGender == 'Hombre' ? 'D.' : 'Dña.');
        $('#formData #deceasedName').val(expedientTellmebyeData.deceasedName);
        $('#formData #deceasedSurname').val(expedientTellmebyeData.deceasedSurname);
        $('#formData #deceasedAlias').val(expedientTellmebyeData.extraText);
        if(expedientTellmebyeData.deceasedBirthday != null && expedientTellmebyeData.deceasedDate != null){
            $('#formData #deceasedAge').val(moment(expedientTellmebyeData.deceasedDate, 'YYYY-MM-DD').diff(moment(expedientTellmebyeData.deceasedBirthday, 'YYYY-MM-DD'), 'years'));
        }
        if(expedientTellmebyeData.deceasedBirthday != null){
            $('#formData #deceasedBirthdate').val(moment(expedientTellmebyeData.deceasedBirthday, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        }
        if(expedientTellmebyeData.deceasedDate != null){
            $('#formData #deceasedDeceasedDate').val(moment(expedientTellmebyeData.deceasedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            $('#formData #deceasedDeceasedTime').val(moment(expedientTellmebyeData.deceasedTime, 'HH:mm').format('HH:mm'));
        }

        // Datos de los Administradores -Contratante-
        $('#formData #hiringName0').val(expedientTellmebyeData.familyContactName);
        $('#formData #hiringSurname0').val(expedientTellmebyeData.familyContactSurname);
        $('#formData #hiringNif0').val(expedientTellmebyeData.familyContactNIF);
        $('#formData #hiringRelationship0').val(expedientTellmebyeData.familyContactRelationship);
        $('#formData #hiringPhone0').val(expedientTellmebyeData.familyContactPhone);
        $('#formData #hiringMobilePhone0').val(expedientTellmebyeData.familyContactMobilePhone);
        $('#formData #hiringEmail0').val(expedientTellmebyeData.familyContactMail);
        $('#formData #hiringAddress0').val(expedientTellmebyeData.familyContactAddress);

        var hiringItems = new Object;
        hiringItems.id = '';
        hiringItems.name = expedientTellmebyeData.familyContactName;
        hiringItems.surname = expedientTellmebyeData.familyContactSurname;
        hiringItems.nif = expedientTellmebyeData.familyContactNIF;
        hiringItems.relationship = expedientTellmebyeData.familyContactRelationship;
        hiringItems.phone = expedientTellmebyeData.familyContactPhone;
        hiringItems.mobilePhone = expedientTellmebyeData.familyContactMobilePhone;
        hiringItems.email = expedientTellmebyeData.familyContactMail;
        hiringItems.address = expedientTellmebyeData.familyContactAddress;
        hiringItems.status = 'keep';
        onChangeHiring(0, hiringItems);
        onChangeHiring(1);

        // Datos de los Eventos -Ceremonia/Inhumación-
        // Velation
        $('#formData #eventVelationMortuary').val(expedientTellmebyeData.deceasedMortuaryName);
        if(expedientTellmebyeData.tellmebyeRoom != '' && expedientTellmebyeData.tellmebyeRoom != null){
            $('#formData #eventVelationRoom').val(expedientTellmebyeData.tellmebyeRoom).trigger('change');
            if($('#formData #eventVelationRoom').val() == null){
                var option = new Option(expedientTellmebyeData.tellmebyeRoomName, expedientTellmebyeData.tellmebyeRoom, true, true);
                $('#formData #eventVelationRoom').append(option).trigger('change');
            }
        }else{
            $('#eventVelationWarning').text('Debes seleccionar una sala en Tellmebye en la ficha del expediente');
            $('#eventVelationWarningSection').removeClass('hide');
        }
        $('#formData #eventVelationRoom').attr('disabled', true);
        $('#formData #eventVelationMortuaryAddress').val(expedientTellmebyeData.deceasedMortuaryName == 'Otro' ? expedientTellmebyeData.deceasedMortuaryAddressOther : expedientTellmebyeData.deceasedMortuaryAddress);
        $('#formData #eventVelationCity').val(expedientTellmebyeData.deceasedMortuaryLocation);
        if(expedientTellmebyeData.startVelacionDate != null && expedientTellmebyeData.startVelacionDate != ''){
            $('#formData #eventVelationStartDate').val(moment(expedientTellmebyeData.startVelacionDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        }else if(expedientTellmebyeData.funeralHomeEntryDate != null && expedientTellmebyeData.funeralHomeEntryDate != ''){
            $('#formData #eventVelationStartDate').val(moment(expedientTellmebyeData.funeralHomeEntryDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        }
        if(expedientTellmebyeData.startVelacionTime != null && expedientTellmebyeData.startVelacionTime != ''){
            $('#formData #eventVelationStartTime').val(moment(expedientTellmebyeData.startVelacionTime, 'HH:mm:ss').format('HH:mm'));
        }else if(expedientTellmebyeData.funeralHomeEntryTime != null && expedientTellmebyeData.funeralHomeEntryTime != ''){
            $('#formData #eventVelationStartTime').val(moment(expedientTellmebyeData.funeralHomeEntryTime, 'HH:mm:ss').format('HH:mm'));
        }
        if(expedientTellmebyeData.funeralDate != null && expedientTellmebyeData.funeralDate != ''){
            $('#formData #eventVelationEndDate').val(moment(expedientTellmebyeData.funeralDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        }
        if(expedientTellmebyeData.funeralTime != null && expedientTellmebyeData.funeralTime != ''){
            $('#formData #eventVelationEndTime').val(moment(expedientTellmebyeData.funeralTime, 'HH:mm:ss').format('HH:mm'));
        }

        var eventItems = new Object;
        eventItems.id = '';
        eventItems.type = 'velation';
        eventItems.place = $('#formData #eventVelationMortuary').val();
        eventItems.room = $('#formData #eventVelationRoom').val();
        eventItems.roomName = $('#formData #eventVelationRoom').val() == null ? '' : $('#formData #eventVelationRoom').select2('data')[0].text;
        eventItems.freeRoom = false;
        eventItems.address = $('#formData #eventVelationMortuaryAddress').val();
        eventItems.city = $('#formData #eventVelationCity').val();
        eventItems.camera = $('#formData #eventVelationCamera').val();
        eventItems.cameraName = '';
        eventItems.freeCamera = false;
        eventItems.startDate = $('#formData #eventVelationStartDate').val();
        eventItems.startTime = $('#formData #eventVelationStartTime').val();
        eventItems.endDate = $('#formData #eventVelationEndDate').val();
        eventItems.endTime = $('#formData #eventVelationEndTime').val();
        eventItems.status = 'keep';
        onChangeEvent(0, eventItems);

        // Ceremony
        $('#formData #eventCeremonyPlace').val(expedientTellmebyeData.churchName);
        $('#formData #eventCeremonyAddress').val(expedientTellmebyeData.churchAddress);
        $('#formData #eventCeremonyCity').val(expedientTellmebyeData.churchLocation);
        if(expedientTellmebyeData.ceremonyDate != null && expedientTellmebyeData.ceremonyDate != ''){
            $('#formData #eventCeremonyStartDate').val(moment(expedientTellmebyeData.ceremonyDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        }
        if(expedientTellmebyeData.ceremonyTime != null && expedientTellmebyeData.ceremonyTime != ''){
            $('#formData #eventCeremonyStartTime').val(moment(expedientTellmebyeData.ceremonyTime, 'HH:mm:ss').format('HH:mm'));
        }

        var eventItems = new Object;
        eventItems.id = '';
        eventItems.type = 'ceremony';
        eventItems.place = $('#formData #eventCeremonyPlace').val();
        eventItems.room = $('#formData #eventCeremonyRoom').val();
        eventItems.roomName = '';
        eventItems.freeRoom = false;
        eventItems.address = $('#formData #eventCeremonyAddress').val();
        eventItems.city = $('#formData #eventCeremonyCity').val();
        eventItems.camera = $('#formData #eventCeremonyCamera').val();
        eventItems.cameraName = '';
        eventItems.freeCamera = false;
        eventItems.startDate = $('#formData #eventCeremonyStartDate').val();
        eventItems.startTime = $('#formData #eventCeremonyStartTime').val();
        eventItems.endDate = $('#formData #eventCeremonyEndDate').val();
        eventItems.endTime = $('#formData #eventCeremonyEndTime').val();
        eventItems.status = 'keep';
        onChangeEvent(1, eventItems);

        // Funeral
        if(expedientTellmebyeData.funeralDateNew != null && expedientTellmebyeData.funeralTimeNew != null){
            $('#formData #eventFuneralPlace').val(expedientTellmebyeData.churchName);
            $('#formData #eventFuneralAddress').val(expedientTellmebyeData.churchAddress);
            $('#formData #eventFuneralCity').val(expedientTellmebyeData.churchLocation);
            if(expedientTellmebyeData.funeralDateNew != null && expedientTellmebyeData.funeralDateNew != ''){
                $('#formData #eventFuneralStartDate').val(moment(expedientTellmebyeData.funeralDateNew, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            }
            if(expedientTellmebyeData.funeralTimeNew != null && expedientTellmebyeData.funeralTimeNew != ''){
                $('#formData #eventFuneralStartTime').val(moment(expedientTellmebyeData.funeralTimeNew, 'HH:mm:ss').format('HH:mm'));
            }
        }else{
            $('#formData #eventFuneralPlace').val('');
            $('#formData #eventFuneralAddress').val('');
            $('#formData #eventFuneralCity').val('');
            $('#formData #eventFuneralStartDate').val('');
            $('#formData #eventFuneralStartTime').val('');
        }

        var eventItems = new Object;
        eventItems.id = '';
        eventItems.type = 'funeral';
        eventItems.place = $('#formData #eventFuneralPlace').val();
        eventItems.room = $('#formData #eventFuneralRoom').val();
        eventItems.roomName = '';
        eventItems.freeRoom = false;
        eventItems.address = $('#formData #eventFuneralAddress').val();
        eventItems.city = $('#formData #eventFuneralCity').val();
        eventItems.camera = $('#formData #eventFuneralCamera').val();
        eventItems.cameraName = '';
        eventItems.freeCamera = false;
        eventItems.startDate = $('#formData #eventFuneralStartDate').val();
        eventItems.startTime = $('#formData #eventFuneralStartTime').val();
        eventItems.endDate = $('#formData #eventFuneralEndDate').val();
        eventItems.endTime = $('#formData #eventFuneralEndTime').val();
        eventItems.status = 'keep';
        onChangeEvent(2, eventItems);

        // Cremation
        $('#formData #eventCremationPlace').val(expedientTellmebyeData.crematoriumName);
        $('#formData #eventCremationAddress').val(expedientTellmebyeData.crematoriumAddress);
        $('#formData #eventCremationCity').val(expedientTellmebyeData.crematoriumLocation);
        if(expedientTellmebyeData.crematoriumStart != null && expedientTellmebyeData.crematoriumStart != ''){
            $('#formData #eventCremationStartDate').val(moment(expedientTellmebyeData.crematoriumStart, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
            $('#formData #eventCremationStartTime').val(moment(expedientTellmebyeData.crematoriumStart, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'));
        }
        if(expedientTellmebyeData.crematoriumEnd != null && expedientTellmebyeData.crematoriumEnd != ''){
            $('#formData #eventCremationEndDate').val(moment(expedientTellmebyeData.crematoriumEnd, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
            $('#formData #eventCremationEndTime').val(moment(expedientTellmebyeData.crematoriumEnd, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'));
        }

        var eventItems = new Object;
        eventItems.id = '';
        eventItems.type = 'cremation';
        eventItems.place = $('#formData #eventCremationPlace').val();
        eventItems.room = $('#formData #eventCremationRoom').val();
        eventItems.roomName = '';
        eventItems.freeRoom = false;
        eventItems.address = $('#formData #eventCremationAddress').val();
        eventItems.city = $('#formData #eventCremationCity').val();
        eventItems.camera = $('#formData #eventCremationCamera').val();
        eventItems.cameraName = '';
        eventItems.freeCamera = false;
        eventItems.startDate = $('#formData #eventCremationStartDate').val();
        eventItems.startTime = $('#formData #eventCremationStartTime').val();
        eventItems.endDate = $('#formData #eventCremationEndDate').val();
        eventItems.endTime = $('#formData #eventCremationEndTime').val();
        eventItems.status = 'keep';
        onChangeEvent(3, eventItems);

        // Burial
        $('#formData #eventBurialPlace').val(expedientTellmebyeData.cemeteryName);
        $('#formData #eventBurialAddress').val(expedientTellmebyeData.cemeteryAddress);
        $('#formData #eventBurialCity').val(expedientTellmebyeData.cemeteryLocationName);
        if(expedientTellmebyeData.funeralDateBurial != null && expedientTellmebyeData.funeralDateBurial != ''){
            $('#formData #eventBurialStartDate').val(moment(expedientTellmebyeData.funeralDateBurial, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        }
        if(expedientTellmebyeData.funeralTimeBurial != null && expedientTellmebyeData.funeralTimeBurial != ''){
            $('#formData #eventBurialStartTime').val(moment(expedientTellmebyeData.funeralTimeBurial, 'HH:mm:ss').format('HH:mm'));
        }

        var eventItems = new Object;
        eventItems.id = '';
        eventItems.type = 'burial';
        eventItems.place = $('#formData #eventBurialPlace').val();
        eventItems.room = $('#formData #eventBurialRoom').val();
        eventItems.roomName = '';
        eventItems.freeRoom = false;
        eventItems.camera = $('#formData #eventBurialCamera').val();
        eventItems.cameraName = '';
        eventItems.freeCamera = false;
        eventItems.address = $('#formData #eventBurialAddress').val();
        eventItems.city = $('#formData #eventBurialCity').val();
        eventItems.startDate = $('#formData #eventBurialStartDate').val();
        eventItems.startTime = $('#formData #eventBurialStartTime').val();
        eventItems.endate = $('#formData #eventBurialEndDate').val();
        eventItems.endTime = $('#formData #eventBurialEndTime').val();
        eventItems.status = 'keep';
        onChangeEvent(4, eventItems);
    }else{ // Loaded from tellmebye data
        // Tellmebye mode
        tellmebyeMode = 1;

        // Reload button
        $('#reloadForm').removeClass('hide');

        // Check data (mortuary and room) between expediente and tellmebye sheet
        var message = '';
        if(expedientTellmebyeData.general.mortuaryTellmebyeMortuary != expedientTellmebyeData.general.tellmebyeMortuary){
            message += 'El tanatorio seleccionado en la ficha de expediente no coincide con el establecido en Tellmebye';
        }
        if(expedientTellmebyeData.general.expedientTellmebyeRoom != expedientTellmebyeData.general.tellmebyeRoom){
            if(message == ''){
                message += 'La sala seleccionada en la ficha de expediente no coincide con la establecida en Tellmebye';
            }else{
                message += ', ni tampoco la sala asociada';
            }
        }
        if(message != ''){
            message += '. Pulsa el botón <strong>Recargar</strong> de la parte inferior derecha para actualizar los datos en Tellmebye.';

            $('#mortuaryRoomWarning').html(message);
            $('#mortuaryRoomWarningSection').removeClass('hide');
        }else{
            $('#mortuaryRoomWarningSection').remove();
        }

        $('.numberExp').text(expedientTellmebyeData.general.number);
        $('#formData #expedientNumber').val(expedientTellmebyeData.general.number);
        $('.footer-static-bottom #deceased').text(' ' + expedientTellmebyeData.general.deceasedNameExpedient + ' ' + expedientTellmebyeData.general.deceasedSurnameExpedient);

        // General info
        $('#formData #tellmebyeCode').val(expedientTellmebyeData.general.idTellmebye);
        $('#formData #familyAttendance').val(expedientTellmebyeData.general.familyAssistance);
        if(expedientTellmebyeData.general.showTvInfo == '1'){
            $('.tellmebye-button.show-tv-info-yes').click();
        }else{
            $('.tellmebye-button.show-tv-info-no').click();
        }
        if(expedientTellmebyeData.general.showServiceRoom == '1'){
            $('.tellmebye-button.show-service-room-yes').click();
        }else{
            $('.tellmebye-button.show-service-room-no').click();
        }
        if(expedientTellmebyeData.general.createWallReminder == '1'){
            $('.tellmebye-button.create-wall-reminder-yes').click();
        }else{
            $('.tellmebye-button.create-wall-reminder-no').click();
        }
        if(expedientTellmebyeData.general.supervised == '1'){
            $('.tellmebye-button.supervised-yes').click();
        }else{
            $('.tellmebye-button.supervised-no').click();
        }
        if(expedientTellmebyeData.general.private == '1'){
            $('.tellmebye-button.private-yes').click();
            $('#formData #wallPassword').val(expedientTellmebyeData.general.wallPassword);
        }else{
            $('.tellmebye-button.private-no').click();
        }
        $('#formData #tellmebyeMortuary').val(expedientTellmebyeData.general.tellmebyeMortuary).trigger('change');
        $('#formData #tellmebyeRoom').val(expedientTellmebyeData.general.tellmebyeRoom).trigger('change');
        if($('#formData #tellmebyeRoom').val() == null){
            var option = new Option(expedientTellmebyeData.general.tellmebyeRoomName, expedientTellmebyeData.general.tellmebyeRoom, true, true);
            $('#formData #tellmebyeRoom').append(option);
        }
        $('#formData #tellmebyeRoom').attr('disabled', true);
        if(COMPANY == 3){
            $('#formData #tellmebyeWallUrl').val('https://dev.tellmebye.com/' + expedientTellmebyeData.general.tellmebyeWallUrl);
        }else{
            $('#formData #tellmebyeWallUrl').val('https://tellmebye.com/' + expedientTellmebyeData.general.tellmebyeWallUrl);
        }
        $('#formData #tellmebyeWallUrl').addClass('cursor-pointer').click(function(){
            window.open($(this).val());
        })

        // Datos del Obituario -Fallecido-
        $('#formData #deceasedGender').val(expedientTellmebyeData.general.deceasedGender);
        $('#formData #deceasedTitle').val(expedientTellmebyeData.general.deceasedTitle);
        $('#formData #deceasedName').val(expedientTellmebyeData.general.deceasedName);
        $('#formData #deceasedSurname').val(expedientTellmebyeData.general.deceasedSurname);
        $('#formData #deceasedAlias').val(expedientTellmebyeData.general.deceasedAlias);
        if(expedientTellmebyeData.general.deceasedBirthdate != null && expedientTellmebyeData.general.deceasedDeceasedDate != null){
            $('#formData #deceasedAge').val(moment(expedientTellmebyeData.general.deceasedDeceasedDate, 'X').diff(moment(expedientTellmebyeData.general.deceasedBirthdate, 'X'), 'years'));
        }
        if(expedientTellmebyeData.general.deceasedBirthdate != null){
            $('#formData #deceasedBirthdate').val(moment(expedientTellmebyeData.general.deceasedBirthdate, 'X').format('DD/MM/YYYY'));
        }
        if(expedientTellmebyeData.general.deceasedDeceasedDate != null){
            $('#formData #deceasedDeceasedDate').val(moment(expedientTellmebyeData.general.deceasedDeceasedDate, 'X').format('DD/MM/YYYY'));
            $('#formData #deceasedDeceasedTime').val(moment(expedientTellmebyeData.general.deceasedDeceasedDate, 'X').format('HH:mm'));
        }
        
        $('.deceased-picture-update').removeClass('d-none');
        if(expedientTellmebyeData.general.deceasedPicture == '1'){
            $('.tellmebye-button.deceased-picture-yes').click();
            $('.deceased-picture-section').removeClass('d-none');

            if(expedientTellmebyeData.deceasedImage != null){
                $('#deceasedPictureSrc').attr('src', uri + expedientTellmebyeData.deceasedImage);
                $('#deceasedPictureSrcSection').removeClass('d-none');
            }
        }

        // Hiring info
        $.each(expedientTellmebyeData.hiring, function(index, elem){
            if(index > 1){
                $('#addMoreHiring').click();
            }

            $('#formData #hiringName' + index).val(elem.name);
            $('#formData #hiringSurname' + index).val(elem.surname);
            $('#formData #hiringNif' + index).val(elem.nif);
            $('#formData #hiringRelationship' + index).val(elem.relationship);
            $('#formData #hiringPhone' + index).val(elem.phone);
            $('#formData #hiringMobilePhone' + index).val(elem.mobilePhone);
            $('#formData #hiringEmail' + index).val(elem.email);
            $('#formData #hiringAddress' + index).val(elem.address);

            if(index <= 1){
                var hiringItems = new Object;
                hiringItems.id = elem.id;
                hiringItems.name = elem.name;
                hiringItems.surname = elem.surname;
                hiringItems.nif = elem.nif;
                hiringItems.relationship = elem.relationship;
                hiringItems.phone = elem.phone;
                hiringItems.mobilePhone = elem.mobilePhone;
                hiringItems.email = elem.email;
                hiringItems.address = elem.address;
                hiringItems.status = 'keep';

                onChangeHiring(index, hiringItems);
            }else{
                hiringData[index] = new Object;
                hiringData[index].id = elem.id;
                hiringData[index].name = elem.name;
                hiringData[index].surname = elem.surname;
                hiringData[index].nif = elem.nif;
                hiringData[index].relationship = elem.relationship;
                hiringData[index].phone = elem.phone;
                hiringData[index].mobilePhone = elem.mobilePhone;
                hiringData[index].email = elem.email;
                hiringData[index].address = elem.address;
                hiringData[index].status = 'keep';
            }
        })

        if(expedientTellmebyeData.hiring.length == 1){
            onChangeHiring(1);
        }

        // Events info
        var velation = null;
        var ceremony = null;
        var funeral = null;
        var cremation = null;
        var burial = null;
        var other = new Array;
        $.each(expedientTellmebyeData.events, function(index, elem){
            switch(elem.type){
                case 'velation':
                    velation = elem;
                break;
                case 'ceremony':
                    ceremony = elem;
                break;
                case 'funeral':
                    funeral = elem;
                break;
                case 'cremation':
                    cremation = elem;
                break;
                case 'burial':
                    burial = elem;
                break;
                case 'other':
                    other.push(elem);
                break;
            }
        })

        if(velation != null){
            $('#formData #eventVelationMortuary').val(velation.place);
            $('#formData #eventVelationRoom').val(velation.room).trigger('change');
            if($('#formData #eventVelationRoom').val() == null && velation.room != null){
                var roomOption = new Option(velation.roomName, velation.room, true, true);
                $('#formData #eventVelationRoom').append(roomOption).trigger('change');
            }
            $('#formData #eventVelationRoom').attr('disabled', true);
            $('#formData #eventVelationMortuaryAddress').val(velation.address);
            $('#formData #eventVelationCity').val(velation.city);
            $('#formData #eventVelationCamera').val(velation.camera).trigger('change');
            if($('#formData #eventVelationCamera').val() == null && velation.camera != null){
                var cameraOption = new Option(velation.cameraName, velation.camera, true, true);
                $('#formData #eventVelationCamera').append(cameraOption).trigger('change');
            }
            $('#formData #eventVelationStartDate').val(velation.startDate != null ? moment(velation.startDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventVelationStartTime').val(velation.startDate != null ? moment(velation.startDate, 'X').format('HH:mm') : '');
            $('#formData #eventVelationEndDate').val(velation.endDate != null ? moment(velation.endDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventVelationEndTime').val(velation.endDate != null ? moment(velation.endDate, 'X').format('HH:mm') : '');
            
            velation.status = 'keep';
            velation.startTime = velation.startDate != null ? moment(velation.startDate, 'X').format('HH:mm') : '';
            velation.startDate = velation.startDate != null ? moment(velation.startDate, 'X').format('DD/MM/YYYY') : '';
            velation.endTime = velation.endDate != null ? moment(velation.endDate, 'X').format('HH:mm') : '';
            velation.endDate = velation.endDate != null ? moment(velation.endDate, 'X').format('DD/MM/YYYY') : '';
            velation.roomName = velation.roomName;
            velation.freeRoom = false;
            velation.cameraName = velation.cameraName;
            velation.freeCamera = false;

            onChangeEvent(0, velation);
        }else{
            var eventItems = new Object;
            eventItems.id = '';
            eventItems.type = 'velation';
            eventItems.place = '';
            eventItems.room = '';
            eventItems.roomName = '';
            eventItems.freeRoom = false;
            eventItems.address = '';
            eventItems.city = '';
            eventItems.camera = '';
            eventItems.cameraName = '';
            eventItems.freeCamera = false;
            eventItems.startDate = '';
            eventItems.startTime = '';
            eventItems.endDate = '';
            eventItems.endTime = '';
            eventItems.status = 'keep';

            onChangeEvent(0, eventItems);
        }

        if(ceremony != null){
            $('#formData #eventCeremonyPlace').val(ceremony.place);
            $('#formData #eventCeremonyRoom').val(ceremony.room).trigger('change');
            if($('#formData #eventCeremonyRoom').val() == null && ceremony.room != null){
                var roomOption = new Option(ceremony.roomName, ceremony.room, true, true);
                $('#formData #eventCeremonyRoom').append(roomOption).trigger('change');
            }
            $('#formData #eventCeremonyAddress').val(ceremony.address);
            $('#formData #eventCeremonyCity').val(ceremony.city);
            $('#formData #eventCeremonyCamera').val(ceremony.camera).trigger('change');
            if($('#formData #eventCeremonyCamera').val() == null && ceremony.camera != null){
                var cameraOption = new Option(ceremony.cameraName, ceremony.camera, true, true);
                $('#formData #eventCeremonyCamera').append(cameraOption).trigger('change');
            }
            $('#formData #eventCeremonyStartDate').val(ceremony.startDate != null ? moment(ceremony.startDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventCeremonyStartTime').val(ceremony.startDate != null ? moment(ceremony.startDate, 'X').format('HH:mm') : '');
            $('#formData #eventCeremonyEndDate').val(ceremony.endDate != null ? moment(ceremony.endDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventCeremonyEndTime').val(ceremony.endDate != null ? moment(ceremony.endDate, 'X').format('HH:mm') : '');

            ceremony.status = 'keep';
            ceremony.startTime = ceremony.startDate != null ? moment(ceremony.startDate, 'X').format('HH:mm') : '';
            ceremony.startDate = ceremony.startDate != null ? moment(ceremony.startDate, 'X').format('DD/MM/YYYY') : '';
            ceremony.endTime = ceremony.endDate != null ? moment(ceremony.endDate, 'X').format('HH:mm') : '';
            ceremony.endDate = ceremony.endDate != null ? moment(ceremony.endDate, 'X').format('DD/MM/YYYY') : '';
            ceremony.roomName = ceremony.roomName;
            ceremony.freeRoom = false;
            ceremony.cameraName = ceremony.cameraName;
            ceremony.freeCamera = false;
            
            onChangeEvent(1, ceremony);
        }else{
            var eventItems = new Object;
            eventItems.id = '';
            eventItems.type = 'ceremony';
            eventItems.place = '';
            eventItems.room = '';
            eventItems.roomName = '';
            eventItems.freeRoom = false;
            eventItems.address = '';
            eventItems.city = '';
            eventItems.camera = '';
            eventItems.cameraName = '';
            eventItems.freeCamera = false;
            eventItems.startDate = '';
            eventItems.startTime = '';
            eventItems.endDate = '';
            eventItems.endTime = '';
            eventItems.status = 'keep';

            onChangeEvent(1, eventItems);
        }

        if(funeral != null){
            $('#formData #eventFuneralPlace').val(funeral.place);
            $('#formData #eventFuneralRoom').val(funeral.room).trigger('change');
            if($('#formData #eventFuneralRoom').val() == null && funeral.room != null){
                var roomOption = new Option(funeral.roomName, funeral.room, true, true);
                $('#formData #eventFuneralRoom').append(roomOption).trigger('change');
            }
            $('#formData #eventFuneralAddress').val(funeral.address);
            $('#formData #eventFuneralCity').val(funeral.city);
            $('#formData #eventFuneralCamera').val(funeral.camera).trigger('change');
            if($('#formData #eventFuneralCamera').val() == null && funeral.camera != null){
                var cameraOption = new Option(funeral.cameraName, funeral.camera, true, true);
                $('#formData #eventFuneralCamera').append(cameraOption).trigger('change');
            }
            $('#formData #eventFuneralStartDate').val(funeral.startDate != null ? moment(funeral.startDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventFuneralStartTime').val(funeral.startDate != null ? moment(funeral.startDate, 'X').format('HH:mm') : '');
            $('#formData #eventFuneralEndDate').val(funeral.endDate != null ? moment(funeral.endDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventFuneralEndTime').val(funeral.endDate != null ? moment(funeral.endDate, 'X').format('HH:mm') : '');
            
            funeral.status = 'keep';
            funeral.startTime = funeral.startDate != null ? moment(funeral.startDate, 'X').format('HH:mm') : '';
            funeral.startDate = funeral.startDate != null ? moment(funeral.startDate, 'X').format('DD/MM/YYYY') : '';
            funeral.endTime = funeral.endDate != null ? moment(funeral.endDate, 'X').format('HH:mm') : '';
            funeral.endDate = funeral.endDate != null ? moment(funeral.endDate, 'X').format('DD/MM/YYYY') : '';
            funeral.roomName = funeral.roomName;
            funeral.freeRoom = false;
            funeral.cameraName = funeral.cameraName;
            funeral.freeCamera = false;

            onChangeEvent(2, funeral);
        }else{
            var eventItems = new Object;
            eventItems.id = '';
            eventItems.type = 'funeral';
            eventItems.place = '';
            eventItems.room = '';
            eventItems.roomName = '';
            eventItems.freeRoom = false;
            eventItems.address = '';
            eventItems.city = '';
            eventItems.camera = '';
            eventItems.cameraName = '';
            eventItems.freeCamera = false;
            eventItems.startDate = '';
            eventItems.startTime = '';
            eventItems.endDate = '';
            eventItems.endTime = '';
            eventItems.status = 'keep';

            onChangeEvent(2, eventItems);
        }

        if(cremation != null){
            $('#formData #eventCremationPlace').val(cremation.place);
            $('#formData #eventCremationRoom').val(cremation.room).trigger('change');
            if($('#formData #eventCremationRoom').val() == null && cremation.room != null){
                var roomOption = new Option(cremation.roomName, cremation.room, true, true);
                $('#formData #eventCremationRoom').append(roomOption).trigger('change');
            }
            $('#formData #eventCremationAddress').val(cremation.address);
            $('#formData #eventCremationCity').val(cremation.city);
            $('#formData #eventCremationCamera').val(cremation.camera).trigger('change');
            if($('#formData #eventCremationCamera').val() == null && cremation.camera != null){
                var cameraOption = new Option(cremation.cameraName, cremation.camera, true, true);
                $('#formData #eventCremationCamera').append(cameraOption).trigger('change');
            }
            $('#formData #eventCremationStartDate').val(cremation.startDate != null ? moment(cremation.startDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventCremationStartTime').val(cremation.startDate != null ? moment(cremation.startDate, 'X').format('HH:mm') : '');
            $('#formData #eventCremationEndDate').val(cremation.endDate != null ? moment(cremation.endDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventCremationEndTime').val(cremation.endDate != null ? moment(cremation.endDate, 'X').format('HH:mm') : '');
            
            cremation.status = 'keep';
            cremation.startTime = cremation.startDate != null ? moment(cremation.startDate, 'X').format('HH:mm') : '';
            cremation.startDate = cremation.startDate != null ? moment(cremation.startDate, 'X').format('DD/MM/YYYY') : '';
            cremation.endTime = cremation.endDate != null ? moment(cremation.endDate, 'X').format('HH:mm') : '';
            cremation.endDate = cremation.endDate != null ? moment(cremation.endDate, 'X').format('DD/MM/YYYY') : '';
            cremation.roomName = cremation.roomName;
            cremation.freeRoom = false;
            cremation.cameraName = cremation.cameraName;
            cremation.freeCamera = false;

            onChangeEvent(3, cremation);
        }else{
            var eventItems = new Object;
            eventItems.id = '';
            eventItems.type = 'cremation';
            eventItems.place = '';
            eventItems.room = '';
            eventItems.roomName = '';
            eventItems.freeRoom = false;
            eventItems.address = '';
            eventItems.city = '';
            eventItems.camera = '';
            eventItems.cameraName = '';
            eventItems.freeCamera = false;
            eventItems.startDate = '';
            eventItems.startTime = '';
            eventItems.endDate = '';
            eventItems.endTime = '';
            eventItems.status = 'keep';

            onChangeEvent(3, eventItems);
        }

        if(burial != null){
            $('#formData #eventBurialPlace').val(burial.place);
            $('#formData #eventBurialRoom').val(burial.room).trigger('change');
            if($('#formData #eventBurialRoom').val() == null && burial.room != null){
                var roomOption = new Option(burial.roomName, burial.room, true, true);
                $('#formData #eventBurialRoom').append(roomOption).trigger('change');
            }
            $('#formData #eventBurialAddress').val(burial.address);
            $('#formData #eventBurialCity').val(burial.city);
            $('#formData #eventBurialCamera').val(burial.camera).trigger('change');
            if($('#formData #eventBurialCamera').val() == null && burial.camera != null){
                var cameraOption = new Option(burial.cameraName, burial.camera, true, true);
                $('#formData #eventBurialCamera').append(cameraOption).trigger('change');
            }
            $('#formData #eventBurialStartDate').val(burial.startDate != null ? moment(burial.startDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventBurialStartTime').val(burial.startDate != null ? moment(burial.startDate, 'X').format('HH:mm') : '');
            $('#formData #eventBurialEndDate').val(burial.endDate != null ? moment(burial.endDate, 'X').format('DD/MM/YYYY') : '');
            $('#formData #eventBurialEndTime').val(burial.endDate != null ? moment(burial.endDate, 'X').format('HH:mm') : '');
            
            burial.status = 'keep';
            burial.startTime = burial.startDate != null ? moment(burial.startDate, 'X').format('HH:mm') : '';
            burial.startDate = burial.startDate != null ? moment(burial.startDate, 'X').format('DD/MM/YYYY') : '';
            burial.endTime = burial.endDate != null ? moment(burial.endDate, 'X').format('HH:mm') : '';
            burial.endDate = burial.endDate != null ? moment(burial.endDate, 'X').format('DD/MM/YYYY') : '';
            burial.roomName = burial.roomName;
            burial.freeRoom = false;
            burial.cameraName = burial.cameraName;
            burial.freeCamera = false;

            onChangeEvent(4, burial);
        }else{
            var eventItems = new Object;
            eventItems.id = '';
            eventItems.type = 'burial';
            eventItems.place = '';
            eventItems.room = '';
            eventItems.roomName = '';
            eventItems.freeRoom = false;
            eventItems.address = '';
            eventItems.city = '';
            eventItems.camera = '';
            eventItems.cameraName = '';
            eventItems.freeCamera = false;
            eventItems.startDate = '';
            eventItems.startTime = '';
            eventItems.endDate = '';
            eventItems.endTime = '';
            eventItems.status = 'keep';

            onChangeEvent(4, eventItems);
        }

        if(other.length > 0){
            $.each(other, function(index, elem){
                var eventIndex = moreEventsIndex;

                $('#addEvent').click();

                $('#formData #eventOtherName' + eventIndex).val(elem.name);
                $('#formData #eventOtherPlace' + eventIndex).val(elem.place);
                $('#formData #eventOtherRoom' + eventIndex).val(elem.room).trigger('change');
                if($('#formData #eventOtherRoom' + eventIndex).val() == null && elem.room != null){
                    var roomOption = new Option(elem.roomName, elem.room, true, true);
                    $('#formData #eventOtherRoom' + eventIndex).append(roomOption).trigger('change');
                }
                $('#formData #eventOtherAddress' + eventIndex).val(elem.address);
                $('#formData #eventOtherCity' + eventIndex).val(elem.city);
                $('#formData #eventOtherCamera' + eventIndex).val(elem.camera).trigger('change');
                if($('#formData #eventOtherCamera' + eventIndex).val() == null && elem.camera != null){
                    var cameraOption = new Option(elem.cameraName, elem.camera, true, true);
                    $('#formData #eventOtherCamera' + eventIndex).append(cameraOption).trigger('change');
                }
                $('#formData #eventOtherStartDate' + eventIndex).val(moment(elem.startDate, 'X').format('DD/MM/YYYY'));
                $('#formData #eventOtherStartTime' + eventIndex).val(moment(elem.startDate, 'X').format('HH:mm'));
                $('#formData #eventOtherEndDate' + eventIndex).val(elem.endDate == null ? '' : moment(elem.endDate, 'X').format('DD/MM/YYYY'));
                $('#formData #eventOtherEndTime' + eventIndex).val(elem.endDate == null ? '' : moment(elem.endDate, 'X').format('HH:mm'));

                eventsData[eventIndex].id = elem.id;
                eventsData[eventIndex].type = 'other';
                eventsData[eventIndex].name = elem.name;
                eventsData[eventIndex].place = elem.place;
                eventsData[eventIndex].room = elem.room;
                eventsData[eventIndex].roomName = elem.roomName;
                eventsData[eventIndex].freeRoom = false;
                eventsData[eventIndex].address = elem.address;
                eventsData[eventIndex].city = elem.city;
                eventsData[eventIndex].camera = elem.camera;
                eventsData[eventIndex].cameraName = elem.cameraName;
                eventsData[eventIndex].freeCamera = false;
                eventsData[eventIndex].startDate = moment(elem.startDate, 'X').format('DD/MM/YYYY');
                eventsData[eventIndex].startTime = moment(elem.startDate, 'X').format('HH:mm');
                eventsData[eventIndex].endDate = elem.endDate == null ? '' : moment(elem.endDate, 'X').format('DD/MM/YYYY');
                eventsData[eventIndex].endTime = elem.endDate == null ? '' : moment(elem.endDate, 'X').format('HH:mm');
                eventsData[eventIndex].status = 'keep';
            })
        }
    }

    // Save
    $('#saveForm').click(function(){
        saveForm(true, true);
    })

    $('#busyEventsModal #continueNoOverlap').click(function(){
        saveForm(false, false);
    })

    // Reload
    $('#reloadForm').click(function(){
        if(confirm('¿Deseas restablecer la información de la ficha Tellmebye? Solamente se restablecerá la información que se obtenga del expediente. Para enviarlo de nuevo a Tellmebye, deberás guardar la ficha.')){
            reloadForm();
        }
    })

    // Upload image
    $('#uploadImage').click(function(){
        uploadImage();
    })

    // Clean events
    $('#cleanEventVelation').click(function(){
        if(confirm('¿Deseas vaciar la información de este evento? Recuerda que para confirmar esta acción, tienes que guardar la ficha de Tellmebye en el margen inferior derecho')){
            $('#formData #eventVelationMortuary').val('').trigger('change');
            $('#formData #eventVelationRoom').val(null).trigger('change');
            $('#formData #eventVelationMortuaryAddress').val('').trigger('change');
            $('#formData #eventVelationCity').val('').trigger('change');
            $('#formData #eventVelationCamera').val(null).trigger('change');
            $('#formData #eventVelationStartDate').val('').trigger('change');
            $('#formData #eventVelationStartTime').val('').trigger('change');
            $('#formData #eventVelationEndDate').val('').trigger('change');
            $('#formData #eventVelationEndTime').val('').trigger('change');
        }
    })
    $('#cleanEventCeremony').click(function(){
        if(confirm('¿Deseas vaciar la información de este evento? Recuerda que para confirmar esta acción, tienes que guardar la ficha de Tellmebye en el margen inferior derecho')){
            $('#formData #eventCeremonyPlace').val('').trigger('change');
            $('#formData #eventCeremonyRoom').val(null).trigger('change');
            $('#formData #eventCeremonyAddress').val('').trigger('change');
            $('#formData #eventCeremonyCity').val('').trigger('change');
            $('#formData #eventCeremonyCamera').val(null).trigger('change');
            $('#formData #eventCeremonyStartDate').val('').trigger('change');
            $('#formData #eventCeremonyStartTime').val('').trigger('change');
            $('#formData #eventCeremonyEndDate').val('').trigger('change');
            $('#formData #eventCeremonyEndTime').val('').trigger('change');
        }
    })
    $('#cleanEventFuneral').click(function(){
        if(confirm('¿Deseas vaciar la información de este evento? Recuerda que para confirmar esta acción, tienes que guardar la ficha de Tellmebye en el margen inferior derecho')){
            $('#formData #eventFuneralPlace').val('').trigger('change');
            $('#formData #eventFuneralRoom').val(null).trigger('change');
            $('#formData #eventFuneralAddress').val('').trigger('change');
            $('#formData #eventFuneralCity').val('').trigger('change');
            $('#formData #eventFuneralCamera').val(null).trigger('change');
            $('#formData #eventFuneralStartDate').val('').trigger('change');
            $('#formData #eventFuneralStartTime').val('').trigger('change');
            $('#formData #eventFuneralEndDate').val('').trigger('change');
            $('#formData #eventFuneralEndTime').val('').trigger('change');
        }
    })
    $('#cleanEventCremation').click(function(){
        if(confirm('¿Deseas vaciar la información de este evento? Recuerda que para confirmar esta acción, tienes que guardar la ficha de Tellmebye en el margen inferior derecho')){
            $('#formData #eventCremationPlace').val('').trigger('change');
            $('#formData #eventCremationRoom').val(null).trigger('change');
            $('#formData #eventCremationAddress').val('').trigger('change');
            $('#formData #eventCremationCity').val('').trigger('change');
            $('#formData #eventCremationCamera').val(null).trigger('change');
            $('#formData #eventCremationStartDate').val('').trigger('change');
            $('#formData #eventCremationStartTime').val('').trigger('change');
            $('#formData #eventCremationEndDate').val('').trigger('change');
            $('#formData #eventCremationEndTime').val('').trigger('change');
        }
    })
    $('#cleanEventBurial').click(function(){
        if(confirm('¿Deseas vaciar la información de este evento? Recuerda que para confirmar esta acción, tienes que guardar la ficha de Tellmebye en el margen inferior derecho')){
            $('#formData #eventBurialPlace').val('').trigger('change');
            $('#formData #eventBurialRoom').val(null).trigger('change');
            $('#formData #eventBurialAddress').val('').trigger('change');
            $('#formData #eventBurialCity').val('').trigger('change');
            $('#formData #eventBurialCamera').val(null).trigger('change');
            $('#formData #eventBurialStartDate').val('').trigger('change');
            $('#formData #eventBurialStartTime').val('').trigger('change');
            $('#formData #eventBurialEndDate').val('').trigger('change');
            $('#formData #eventBurialEndTime').val('').trigger('change');
        }
    })
})