/**  @var {string} planHired Plan hired */
var planHired = null;

/**  @var {boolean} hasViaFirmaKeys If company has via firma api keys */
var hasViaFirmaKeys = false;

/**  @var {int} expedientStatus Stores expedient status */
var expedientStatus = null;

/** @var {int} company Empresa id */
var company = null

/** @var {int} mainSupplier Proveedor principal id */
var mainSupplier = null

/** @var {array} logs Temp logs */
var logs = [];

/** @var {int} limit_page Limit page select2 */
var limit_page = 10;

/** @var {string} langSelect2 Select2 language */
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

$(window).on("pageshow", function(event){
    if(event.originalEvent.persisted){
        window.location.reload() 
    }
})

if(!!window.performance && window.performance.navigation.type === 2){
    // value 2 means "The page was accessed by navigating into the history"
    window.location.reload()
}

/**
 * Devuelve el plan contratado por la compañía
 */
function getPlanHired() {
    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'getPlanHired'
        },
        type : 'POST',
        async : false,
        success : function(data){
            planHired = $.parseJSON(data)
        }
    })
}

/**
 * Comprueba si la compañia tiene claves para Via Firma
 */
function getViaFirmaApiKeys() {
    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'checkViaFirmaApiKeys'
        },
        type : 'POST',
        async : false,
        success : function(data){
            hasViaFirmaKeys = $.parseJSON(data)
        }
    })
}

// SELECT 2
$.fn.select2.defaults.set("width", "100%");
$('.select2').select2({
    language: 'es',
    placeholder: '--',
    allowClear: true
});

// Select sin cuadro de búsquedas
$('.infinitySelect').select2({
    language: 'es',
    placeholder: '--',
    allowClear: true,
    minimumResultsForSearch: Infinity
});

// Select2 functions for remote data
function formatData (data) {
    return '<div id="'+data.id+'">'+data.text+'</div>';
}

// Select2 functions for remote data
function formatData3 (data) {
    return '<div id="'+data.id+'" type="' + data.type + '">'+data.text+'</div>';
}

// Formato para el select de expedientes de la barra inferior
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

$( window ).on("load", function(e) {  
    if(e.target.referrer != 'http://localhost/control-de-servicios'){
        $('.cservice-page #expedient-tabs').css('display','block');
    }
});

function validateForm(){
    $.validator.addClassRules("form-control", { required: true});
    $("#formCService").validate({
        errorPlacement: function(error, element) {
            $(element).closest('.form-group div[class^="col"]').append(error);
        }
    });
    return true;
}

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
 * Logs read
 * 
 * @param int expedient Id del expediente
 */
function setLogRead(expedient){
    $.ajax({
        url: uri + 'core/expedients/services/functions.php',
        method: 'POST',
        data: {
            type: 'setLogRead',
            expedient: expedient
        },
        async: false
    })
}

/**
 * Logs update
 * 
 * @param int expedient Id del expediente
 */
function setLogUpdate(expedient){
    $.ajax({
        url: uri + 'core/expedients/services/functions.php',
        method: 'POST',
        data: {
            type: 'setLogUpdate',
            expedient: expedient
        },
        async: false
    })
}

/**
 * Comprueba si el expediente existe
 * 
 * @param {int} expedient Id del expediente
 * @return bool
 */
function isExpedient(expedient){
    var check

    $.ajax({
        url: uri + 'core/expedients/check.php',
        method: 'POST',
        data: {
            expedient: expedient,
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
 * Obtiene la empresa
 * 
 * @return {int} company Empresa
 */
function getCompany(){
    var company = null

    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getCompany'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                company = data
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

    return company
}

/**
 * Obtiene el proveedor principal de "configuración"
 * 
 * @return {int} company Empresa
 */
function getMainSupplier(){
    $.ajax({
        url: uri + 'core/tools/functions.php',
        method: 'POST',
        data: {
            type: 'getMainSupplier'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                if(data != null){
                    mainSupplier = parseInt(data)
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
}

/**
 * Comprueba si un producto está asociado a los bloques Curas/Coros/Enterradores/Campaneros
 * 
 * @param int expedient Id del expediente
 */
function checkBlockProduct(expedient){
    var result = false
    $.ajax({
        url: uri + "core/expedients/services/functions.php",
        data: {type: 'checkBlockProduct', expedient : expedient},
        type: 'POST',
        async: false,
        success: function(data){
            if(data){
                result = $.parseJSON(data)
                var flagGravedigger = true
                var flagPriest = true
                var flagChoir = true
                var flagBellringer = true
                $.each(result, function(index, elem){
                    switch(elem['serviceBelow']){
                        case '1':
                            flagGravedigger = false
                        break;
                        case '2':
                            flagPriest = false;
                        break;
                        case '3':
                            flagChoir = false;
                        break;
                        case '4':
                            flagBellringer = false;
                        break;
                    }
                })

                if(flagGravedigger){
                    $("#gravediggerFieldset").addClass('hide')
                    $('#gravediggersChecked').iCheck('check');
                    $('#gravediggersCheckPrinted').prop('checked');
                    $('#gravediggersCheckSigned').prop('checked');
                }

                if(flagPriest){
                    $("#priestFieldset").addClass('hide');
                    $('#priestTimeCheck').iCheck('check');
                }

                if(flagChoir){
                    $("#choirFieldset").addClass('hide');
                }

                if(flagBellringer){
                    $("#bellringersSection").addClass('hide');
                }
            }
        }
    });
    return result
}

function getAssociate(expedientID){
    var response = null
    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getAssociate',
            expedientID: expedientID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                response = data
            }catch(e){
                $('#errorAssociate').html('Error al obtener los expedientes')
            }
        },
        error: function(){
            $('#errorAssociate').html('Error al obtener los expedientes')
        }
    })
    return response
}

function changeColorPriest(){
    var countPriest = 0;
    var countCheckedPriest = 0;
    $.each($(".notifiedPriest"), function(index, elem){
        if($(this).prop('checked')){
            countCheckedPriest++;
        }
        countPriest++;
    })

    if(countPriest == countCheckedPriest && countPriest > 0 && $('#priestTimeCheck').prop('checked')){
        $('#curasLbl').removeClass('label-primary').addClass('label-success')
        // $('#priestFieldset').css('border-color', 'green')
    }else{
        $('#curasLbl').removeClass('label-success').addClass('label-primary')
        $('#priestFieldset').css('border-color', '#002490')
    }
}

function changeColorGravedigger(){

    //Comprobamos si todos los campos están checkeados para cambiar el color de la sección
    var countGravediggers = 0;
    var countCheckedGravediggers = 0;
    $.each($("#gravedigger-table .notified"), function(index, elem){
        if($(this).prop('checked')){
            countCheckedGravediggers ++;
        }
        countGravediggers++;
    })

    if(countGravediggers == countCheckedGravediggers && countGravediggers > 0 &&  $('#gravediggersCheckPrinted').prop('checked') && $('#gravediggersCheckSigned').prop('checked') && $('#gravediggersChecked').prop('checked')){
        $('#enterradorLbl').removeClass('label-primary').addClass('label-success')
        // $('#gravediggerFieldset').css('border-color', 'green')
    }else{
        $('#enterradorLbl').removeClass('label-success').addClass('label-primary')
        $('#gravediggerFieldset').css('border-color', '#002490')
    }
}

function changeColorBellringer(){

    //Comprobamos si todos los campos están checkeados para cambiar el color de la sección
    var countBellringers = 0;
    var countCheckedBellringers = 0;
    $.each($("#bellringer-table .notifiedBellringer"), function(index, elem){
        if($(this).prop('checked')){
            countCheckedBellringers ++;
        }
        countBellringers++;
    })

    if(countBellringers == countCheckedBellringers && countBellringers > 0){
        $('#campanerosLbl').removeClass('label-primary').addClass('label-success')
        // $('#bellringersSection').css('border-color', 'green')
    }else{
        $('#campanerosLbl').removeClass('label-success').addClass('label-primary')
        $('#bellringersSection').css('border-color', '#002490')
    }
}

function changeColorChoirs(){

    //Comprobamos si todos los campos están checkeados para cambiar el color de la sección
    var countChoirs = 0;
    var countCheckedChoirs = 0;
    $.each($("#choir-table .notifiedChoir"), function(index, elem){
        if($(this).prop('checked')){
            countCheckedChoirs ++;
        }
        countChoirs++;
    })

    if(countChoirs == countCheckedChoirs && countChoirs > 0){
        $('#corosLbl').removeClass('label-primary').addClass('label-success')
        // $('#choirFieldset').css('border-color', 'green')
    }else{
        $('#corosLbl').removeClass('label-success').addClass('label-primary')
        $('#choirFieldset').css('border-color', '#002490')
    }
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
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
    getViaFirmaApiKeys();
    getPlanHired();
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
    
    
    $('#exitExpedient').click(function() {              
        window.location.href = uri + 'expedientes'
    })

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })
    
    $('.changeTab').click(function(e){
        if(expedientStatus != '5'){
            if(!block){
                saveForm()
            }
        }
    })
    
    // PICKERS
    $('.datepicker').datepicker({
        autoclose: true,  
        language: 'es',
        weekStart: 1,
        todayHighlight : true,forceParse: false
    });

    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        timeFormat: 'HH:mm',
        defaultTime: false
    });

    $('.fa.fa-clock-o').click(function(){
        $(this).closest('div.input-group').find('input').focus()
    })

    $('.fa.fa-calendar').click(function(){
        $(this).closest('div.input-group.date').find('input').focus()
    })
    
    // ICHECK
    $('input[type="checkbox"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-purple'
    });
    
    // GO TOP
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
   
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
                    page_limit: limit_page,
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

    $('#goToExpedient').click(function() {   
        expid = $('#getAllExpedients').val();    
        if(expid != null){           
            if($('#getAllExpedients').select2('data')[0].tpv == '1'){
                // window.open(uri + 'expediente/cservicio-tpv/' + expid, '_blank');
                window.location.href = uri + 'expediente/cservicio-tpv/' + expid;
            }else{
                // window.open(uri + 'expediente/cservicio/' + expid, '_blank');
                window.location.href = uri + 'expediente/cservicio/' + expid;
            }
        }
    })

    localStorage.removeItem("AcualizarServicio");
    window.addEventListener('storage', storageEventHandler, false);
    function storageEventHandler(event) {
        if(event.key == "AcualizarServicio"){            
            localStorage.removeItem("AcualizarServicio");
        }
    }

    localStorage.removeItem("CreatedPDF");
    window.addEventListener('storage', storageEventHandler, false);
    function storageEventHandler(event) {
        if(event.key == "CreatedPDF"){
            localStorage.removeItem("CreatedPDF");
            $('#saveForm').click()
        }
    }

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ---------------------------------------------------------- Datos del expediente ------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    var expedientID = $('#formCService #expedientID').val();

    var associateExpedient = getAssociate(expedientID)
    if(associateExpedient != null){
        if(associateExpedient.deceasedName == ''){
            $('#expedientAssociate').html(associateExpedient.number)
            $('#associateNav').html(associateExpedient.number)
        }else{
            $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
            $('#associateNav').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
        }

        $('#associatedData').removeClass('hide')
    }
    checkBlockProduct(expedientID);

    if(isExpedient(expedientID)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }
    setLogRead(expedientID)
    company = getCompany()
    getMainSupplier()
       
    var expedient;
    $.ajax({
        url : uri + "core/expedients/services/functions.php",
        method : 'POST',
        data: {
            expedientID: expedientID,
            type: 'getServiceExpedient'
        },
        async: false,
        success: function (data){
            expedient = $.parseJSON(data)[0];
        }
    });

    /** Save!! */

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ------------------------------------------------ Sección de detalles del servicio ----------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    // Datos procedentes del expediente
    $('.numberExp').text(expedient.number);
    $('.deceased').text(' '+ expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('#formCService #nameLastname').val(' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('#formCService #expedientNumber').val(expedient.number);
    if(expedient.clientType == '2'){
        $('#formCService #insurance').val(expedient.name);
    }
    
    if(expedient.clientType != 2 || expedient.clientType != 3){
        $('#formCService #policyNumber').val(expedient.policy);
        $('#formCService #capital').val(expedient.capital);
        $('#formCService #loss').val(expedient.lossNumber);
    }else{
        $("#divDetailLoss").addClass("hide")
        $("#divDetailCapital").addClass("hide")
        $("#divDetailPolicy").addClass("hide")
    }
    
    if(expedient.requestTime != null && expedient.requestTime != '' && expedient.requestTime != 'null'){
        $('#formCService #callHour').val(moment(expedient.requestTime, 'HH:mm:ss').format('HH:mm'));
    }
    $('#formCService #expedienteDate').val(moment(expedient.requestDate,"YYYY-MM-DD").format("DD/MM/YYYY"));
    if(expedient.funeralHomeEntryTime != null && expedient.funeralHomeEntryTime != '' && expedient.funeralHomeEntryTime != 'null'){
        $('#formCService #entryHour').val(moment(expedient.funeralHomeEntryTime, 'HH:mm:ss').format('HH:mm'));
    }
    if(expedient.arriveDate != null){
        $('#formCService #arriveDate').val(moment(expedient.arriveDate,"YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.arriveTime != null){
        $('#formCService #arriveTime').val(moment(expedient.arriveTime, "HH:mm:ss").format("HH:mm"));
    }

    $('#arriveTime').change(function(){
        if($(this).val() == ''){
            $('#arriveTimeLabel').addClass('c-red')
        }else{
            $('#arriveTimeLabel').removeClass('c-red')
        }
    })

    $('#arriveDate').change(function(){
        if($(this).val() == ''){
            $('#arriveDateLabel').addClass('c-red')
        }else{
            $('#arriveDateLabel').removeClass('c-red')
        }
    })

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        -------------------------------------------------------- Sección de curas ------------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */

    if(expedient.priestTimeCheck == 1){
        $('#priestTimeCheck').iCheck('check'); 
    }else{
        $('#priestTimeCheck').iCheck('uncheck');
        $('#priestTimeCheckLabel').addClass('c-red')
    }

    var priestTimeCheck = expedient.priestTimeCheck;
    $('#priestTimeCheck').on('ifUnchecked', function(event){
        priestTimeCheck = 0;
        $('#priestTimeCheckLabel').addClass('c-red')
        changeColorPriest()
    });
    $('#priestTimeCheck').on('ifChecked', function(event){
        priestTimeCheck = 1;
        $('#priestTimeCheckLabel').removeClass('c-red')
        changeColorPriest()
    });

    if(expedient.funeralTime != null){
        if(expedient.priestTime == null){
            $('#priestTime').val(moment(expedient.funeralTime, "HH:mm:ss").format("HH:mm"));
        }else{
            $('#priestTime').val(moment(expedient.priestTime, "HH:mm:ss").format("HH:mm"));
        }
    }else{
        if(expedient.priestTime == null){
            $('#priestTimeLabel').addClass('c-red')
        }else{
            $('#priestTime').val(moment(expedient.priestTime, "HH:mm:ss").format("HH:mm"));
        }
    }

    $('#priestTime').change(function(){
        if($(this).val() == ''){
            $('#priestTimeLabel').addClass('c-red')
        }else{
            $('#priestTimeLabel').removeClass('c-red')
        }
    })

    if(expedient.priestTimeCheck != null){
        if(expedient.priestTimeCheck == 1){
            $('#priestTimeCheck').prop('checked', true)
            $('#priestTimeCheckLabel').removeClass('c-red')
        }else{
            $('#priestTimeCheckLabel').addClass('c-red')
        }
    }

    $('#funeralDateNew').val(expedient.funeralDateNew == null ? '-' : moment(expedient.funeralDateNew, 'YYYY-MM-DD').format('DD/MM/YYYY'))
    $('#funeralTimeNew').val(expedient.funeralTimeNew == null ? '-' : moment(expedient.funeralTimeNew, 'HH:mm:ss').format('HH:mm'))

    if(expedient.funeralDateNew != null && expedient.funeralTime != null){
        $('#divPriestMoreInfo').removeClass('hide')
        expedient.priestInspected == '1' ? $('#priestInspected').prop('checked', true).trigger('change') : $('#priestInspected').prop('checked', false).trigger('change')
        expedient.priestPayed == '1' ? $('#priestPayed').prop('checked', true).trigger('change') : $('#priestPayed').prop('checked', false).trigger('change')
        $('#priestNotes').val(expedient.priestNotes)
    }else{
        $('#divPriestMoreInfo').addClass('hide')
        $('#priestInspected').prop('checked', false).trigger('change')
        $('#priestPayed').prop('checked', false).trigger('change')
    }
    
    // Seleccionados
    var priestTable = $('#priests-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/expedients/services/priests.php?ID=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "#"},
            {"title": "Nombre"},
            {"title": "Zona"},
            {"title": "Parroquia"},
            {"title": "Teléfonos"},
            {"title": "Móvil"},
            {"title": "Otro"},
            {"title": "Avisado"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0, 5, 6],
            "searchable": false,
            "visible": false
        },
        {
            "targets": [1, 2, 3],
            "render": function(data){
                return '<strong>' + data  + '</strong>'
            }
        },
        {
            "className" : "priestPhones",
            "targets" : 4,
            "render" : function(data, type, row){
                var homePhone = row[4]
                var mobilePhone = row[5]
                var otherPhone = row[6]

                if(row[7] == 0){
                    if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                        return 'Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                        return 'Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                        return 'Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else{
                        return ''
                    }
                }else{
                    if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                        return 'Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                        return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                        return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else{
                        return ''
                    }
                }
            }
        },
        {
            "className": "centered",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "7%",
            "render": function(data, type, row){
                if(data == 0){
                    return '<input class="notifiedPriest" type="checkbox">';
                }else{
                    return '<input class="notifiedPriest" type="checkbox" checked>';
                }
            }
        },
        {
            "className": "centered details-control removeClick",
            "targets": 8,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[0, 'asc']],
        "rowCallback" : function(row, data, index){
            if(data[7] == 0){
                $('td', row).css('color', '#E61919');
            }
        },
        "initComplete": function(){
            changeColorPriest()
        }
    });

    function formatData2(data){
        if(data.busy == 0){
            return '<div id="' + data.id + '">' + data.text + '</div>';
        }else{
            return '<div id="' + data.id + '" style="color: #E61919">' + data.text + '</div>';
        }
    }
 
    // Disponibles
    $('#priestAdd').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/priestData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    fromTime: $("#priestTime").val(),
                    service: expedientID
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        var parish = item.parish != '' ? ' - ' + item.parish : ''
                        return {
                            id: item.priestID,
                            text: item.name + item.number + parish,
                            busy : item.busy
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
        templateResult: formatData2,
        templateSelection: formatData
    });
    
    // Selección de disponibles
    $('#priestAdd').on('select2:select', function(){
        $.ajax({
            url: uri+"core/expedients/services/functions.php",
            data: {type: 'setPriest', service: expedientID, priest: $("#priestAdd").val(), fromTime: $("#priestTime").val()},
            type: 'POST',
            async: false,
            success: function (data) {
                if(data){
                    priestTable.ajax.reload();
                }
            }
        });

        $("#priestAdd").val('').change();
    });

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

    // IGLESIAS
    $('.church').select2({
        containerCssClass: 'select2-church',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/churches/data.php',
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
                            id: item.churchID
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

    // IGLESIAS - AÑADIR
    $('#modal-new-priest .btn-add-church').click(function(){
        var church = $(this).parent().parent().find('#church').val()
        var churchName = $(this).parent().parent().find('#church').text()

        $('#modal-new-priest .churches').append('<span class="label label-default small labelPhones">' +
                                                '   <input type="hidden" value="' + church + '">' +
                                                '   <span class="number">' + churchName + '</span> ' +
                                                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                                                '</span><br>')

        if(!$('#modal-new-priest .churches').hasClass('in')){
            $('#modal-new-priest .churches').addClass('in')
        }

        $('#modal-new-priest .churches .label .btn-remove').click(function(){
            $(this).parent('.label').remove()
        })

        $('#modal-new-priest #formNewData #church').empty().trigger('change')
        $('#modal-new-priest #formEditData #church').empty().trigger('change')
    });

    $('#saveNewPriest').click(function(){
        var validate = 0

        if(isEmpty($('#formNewData #name'))){
            validate++
        }
        if($("#formNewData #nif").val()!=""){
            if(!isNifCif($("#formNewData #nif"))){
                validate++
            }
        }
        if($("#formNewData #homePhone").val()!=""){
            if(!isPhone($("#formNewData #homePhone"))){
                validate++
            }
        }
        if($("#formNewData #mobilePhone").val()!=""){
            if(!isPhone($("#formNewData #mobilePhone"))){
                validate++
            }
        }
        if($("#formNewData #otherPhone").val()!=""){
            if(!isPhone($("#formNewData #otherPhone"))){
                validate++
            }
        }

        if(validate == 0){
            var name = $("#formNewData #name").val()
            var surname = $("#formNewData #surname").val()
            var address = $("#formNewData #address").val()
            var nif = $("#formNewData #nif").val()
            var location = $("#formNewData #location").val()
            if(location == "undefined" || location == "" || location == null){
                location = "NULL"
            }
            var area = $("#formNewData #area").val()
            var parish = $("#formNewData #parish").val()
            var homePhone = $("#formNewData #homePhone").val()
            var mobilePhone = $("#formNewData #mobilePhone").val()
            var otherPhone = $("#formNewData #otherPhone").val()
            var churches = []
            $('#formNewData .churches .label').each(function(){
                var church = $(this).find('.number').parent().find('[type=hidden]').val()
                churches.push(church)
            })

            $.ajax({
                url: uri + 'core/priests/create.php',
                method: 'POST',
                data: {
                    name : name,
                    surname : surname,
                    address : address,
                    nif : nif,
                    location : location,
                    area : area,
                    parish : parish,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    churches : churches
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cura se ha creado con éxito.</div>');
                        $('#modal-new-priest').modal('hide');
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cura con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-priest').modal('hide');                   
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-priest #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-priest #warning-message').empty()
            }, 3500)
        }
    })

    priestTable.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = priestTable.row($(this).closest('tr')).data() == undefined ? priestTable.row($(this).closest('tr.child').prev()).data() : priestTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el cura: " + rowClick[1] + "?")){
            $.ajax({
                url: uri + "core/expedients/services/functions.php",
                data: {type: 'deletePriest', servicePriest: rowClick[0]},
                type: 'POST',
                async: false,
                success: function(data){
                    if(data){
                        priestTable.ajax.reload();
                        changeColorPriest()
                    }
                }
            });
        }
    });

    //Actualizamos el campo avisado para los curas
    priestTable.on('click', '.notifiedPriest', function () {
        var rowClick = priestTable.row($(this).closest('tr')).data() == undefined ? priestTable.row($(this).closest('tr.child').prev()).data() : priestTable.row($(this).closest('tr')).data()

        var notified = $(this).prop('checked');
        
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {type: 'updatePriest', servicePriest: rowClick[0], notified: notified},
            type: 'POST',
            async: false,
            success: function(data){
                if(data){
                    priestTable.ajax.reload();
                    changeColorPriest();
                }
            }
        });   
    });

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ------------------------------------------------------- Sección de enterradores ------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    // Datos procedentes del expediente
    $('#nicheNumber').val(expedient.funeralNicheNumber);
    $('#nicheType').val(expedient.niche);

    if(expedient.funeralBusyNiche == 1){
        $('#funeralBusyNiche').val('Sí')
    }else{
        $('#funeralBusyNiche').val('No')
    }

    $('#regime').val(expedient.regime).trigger('change')
    $('#deceasedNiche').val(expedient.deceasedNiche)
    $('#exhumation').val(expedient.exhumation)
    $('#nicheHeight').val(expedient.nicheHeight).trigger('change')

    if(expedient.gravediggersCheck == 1){
        $('#gravediggersChecked').iCheck('check'); 
    }else{
        $('#gravediggersChecked').iCheck('uncheck');
        $('#gravediggersCheckText').addClass('c-red')
    }

    var gravediggersCheck = expedient.gravediggersCheck;
    $('#gravediggersChecked').on('ifUnchecked', function(event){
        gravediggersCheck = 0;
        $('#gravediggersCheckText').addClass('c-red')
        changeColorGravedigger()
    });

    $('#gravediggersChecked').on('ifChecked', function(event){
        gravediggersCheck = 1;
        $('#gravediggersCheckText').removeClass('c-red')
        changeColorGravedigger()
    });

    if(expedient.gravediggersNotApply == 1 || expedient.gravediggersNotApply == '1'){
        $('#gravediggersNotApply').prop('checked', true);
        $('#divImpreso').addClass('hide')
        $('#divFirmado').addClass('hide')
    }else{
        $('#gravediggersNotApply').prop('checked', false);
        $('#divImpreso').removeClass('hide')
        $('#divFirmado').removeClass('hide')
    }

    $('#gravediggersNotApply').change(function(){
        if($(this).prop('checked')){
            $('#gravediggersCheckPrinted').prop('checked', true)
            $("#gravediggersCheckPrintedText").css("color", "#002490")
            $('#divImpreso').addClass('hide')
            $('#gravediggersCheckSigned').prop('checked', true)
            $("#gravediggersCheckSignedText").css("color", "#002490")
            $('#divFirmado').addClass('hide')
        }else{
            $('#gravediggersCheckPrinted').prop('checked', false)
            $("#gravediggersCheckPrintedText").css("color", "red")
            $('#divImpreso').removeClass('hide')
            $('#gravediggersCheckSigned').prop('checked', false)
            $("#gravediggersCheckSignedText").css("color", "red")
            $('#divFirmado').removeClass('hide')
        }
    })

    // Seleccionados
    var gravediggersTable = $('#gravedigger-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/expedients/services/gravediggers.php?ID=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "#"},
            {"title": "Enterrador"},
            {"title": "Localidad"},
            {"title": "Teléfonos"},
            {"title": "Móvil"},
            {"title": "Otros"},
            {"title": "Avisado"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets": [1],
            "render": function(data){
                return '<strong>' + data  + '</strong>'
            }
        },
        {
            'targets' : 3,
            'render' : function(data, type, row){
                var homePhone = row[3]
                var mobilePhone = row[4]
                var otherPhone = row[5]

                if(row[6] == 0){
                    if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                        return 'Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                        return 'Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                        return 'Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else{
                        return ''
                    }
                }else{
                    if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                        return 'Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                        return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                        return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else{
                        return ''
                    }
                }
            }
        },
        {
            'targets' : [4, 5],
            'visible' : false
        },
        {
            "className": "centered",
            "targets": 6,
            "width": "13%",
            "render": function (data, type, row) {
                if (data==0){
                    return '<input class="notified" type="checkbox">';
                }else{
                    return '<input class="notified" type="checkbox" checked>';
                }
            }
        },
        {
            "className": "centered details-control removeClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[0, 'asc']],
        "rowCallback" : function(row, data, index){
            if(data[6] == 0){
                $('td', row).css('color', '#E61919');
            }
        },
        "initComplete": function(){
            changeColorGravedigger()
        }
    });

    // Disponibles
    $('#addGravedigger').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/gravediggerData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    service: expedientID
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            id: item.priestID,
                            text: item.name + item.number,
                            busy : item.busy
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
        templateResult: formatData2,
        templateSelection: formatData
    });

    // Selección de disponibles
    $('#addGravedigger').on('select2:select', function(){
        $.ajax({
            url: uri+"core/expedients/services/functions.php",
            data: {type: 'setGravedigger', service: expedientID, gravedigger: $("#addGravedigger").val(), fromTime: $("#priestTime").val()},
            type: 'POST',
            async: false,
            success: function (data) {
                if(data){
                    gravediggersTable.ajax.reload();
                }
            }
        });

        $("#addGravedigger").val('').change();
    });

    var provinceGravedigger
    $('#modal-new-gravedigger .province').change(function(){
        provinceGravedigger = $(this).val()
        $('#modal-new-gravedigger .location').prop('disabled', false)
        $('#modal-new-gravedigger .location').val('').trigger('change')
    })

    $('#modal-new-gravedigger .location').prop('disabled', true)

    // LOCALIDADES
    $('#modal-new-gravedigger .location').select2({
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
                    province : provinceGravedigger
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

    // IGLESIAS
    $('#modal-new-gravedigger .cemetery').select2({
        containerCssClass: 'select2-cemetery',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cemeteries/data.php',
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
                            id: item.cemeteryID
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

    $('#modal-new-gravedigger .btn-add-cemetery').click(function(){
        var cemetery = $(this).parent().parent().find('#cemetery').val()
        var cemeteryName = $(this).parent().parent().find('#cemetery').text()

        $('#modal-new-gravedigger .cemeteries').append(  '<span class="label label-default small labelPhones">' +
                                '   <input type="hidden" value="' + cemetery + '">' +
                                '   <span class="number">' + cemeteryName + '</span> ' +
                                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                                '</span><br>')

        if(!$('#modal-new-gravedigger .cemeteries').hasClass('in')){
            $('#modal-new-gravedigger .cemeteries').addClass('in')
        }

        $('#modal-new-gravedigger .cemeteries .label .btn-remove').click(function(){
            $(this).parent('.label').remove()
        })

        $('#modal-new-gravedigger #formNewData #cemetery').empty().trigger('change')
        $('#modal-new-gravedigger #formEditData #cemetery').empty().trigger('change')
    });

    //Create. Nuevo enterrador
    $('#saveNewGravedigger').click(function(){
        var validate = 0;

        if(isEmpty($('#modal-new-gravedigger #name'))){
            validate++;
        }
        if($("#modal-new-gravedigger #nif").val()!=""){
            if(!isNifCif($("#modal-new-gravedigger #nif"))){
                validate++
            }
        }
        if($('#modal-new-gravedigger #mail').val() != ""){
            if(!isMail($('#modal-new-gravedigger #mail'))){
                validate++;
            }
        }
        if($('#modal-new-gravedigger #homePhone').val() != ""){
            if(!isPhone($('#modal-new-gravedigger #homePhone'))){
                validate++;
            }
        }
        if($('#modal-new-gravedigger #mobilePhone').val() != ""){
            if(!isPhone($('#modal-new-gravedigger #mobilePhone'))){
                validate++;
            }
        }
        if($('#modal-new-gravedigger #otherPhone').val() != ""){
            if(!isPhone($('#modal-new-gravedigger #otherPhone'))){
                validate++;
            }
        }

        if(validate == 0){
            var name = $("#modal-new-gravedigger #name").val();
            var surname = $("#modal-new-gravedigger #surname").val();
            var nif = $("#modal-new-gravedigger #nif").val();
            var address = $("#modal-new-gravedigger #address").val();
            var location = $("#modal-new-gravedigger #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "null";
            }
            var mail = $("#modal-new-gravedigger #mail").val();
            var homePhone = $('#modal-new-gravedigger #homePhone').val()
            var mobilePhone = $('#modal-new-gravedigger #mobilePhone').val()
            var otherPhone = $('#modal-new-gravedigger #otherPhone').val()

            var cemeteries = []
            $('#modal-new-gravedigger .cemeteries .label').each(function(){
                var cemetery = $(this).find('.number').parent().find('[type=hidden]').val()
                cemeteries.push(cemetery)
            })

            $.ajax({
                url : uri + 'core/gravediggers/create.php',
                method : 'POST',
                data : {
                    name : name,
                    surname : surname,
                    nif : nif,
                    address : address,
                    location : location,
                    mail : mail,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    cemeteries: cemeteries
                },
                success : function(data){
                   data = $.parseJSON(data)
                    if(data['success']){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El enterrador se ha creado con éxito.</div>');
                        $('#modal-new-gravedigger').modal('hide');
                        table.ajax.reload();
                    }else if(data['cif']){
                       $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un enterrador con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-gravedigger').modal('hide');
                    }

                    setTimeout(function(){
                        $('#formNewData #msg').empty()
                        $('#block-message').empty()
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-gravedigger').modal('hide');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-gravedigger #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-gravedigger #warning-message').empty()
            }, 3500)
        }
    });

    gravediggersTable.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = gravediggersTable.row($(this).closest('tr')).data() == undefined ? gravediggersTable.row($(this).closest('tr.child').prev()).data() : gravediggersTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el enterrador: " + rowClick[1] + "?")){
            $.ajax({
                url: uri + "core/expedients/services/functions.php",
                data: {type: 'deleteGravedigger', serviceGravedigger: rowClick[0]},
                type: 'POST',
                async: false,
                success: function(data){
                    if(data){
                        gravediggersTable.ajax.reload();
                        changeColorGravedigger()
                    }
                }
            });
        }
    });

    //Actualizamos el campo avisado para los en los enterradores
    gravediggersTable.on('click', '.notified', function () {
        var rowClick = gravediggersTable.row($(this).closest('tr')).data() == undefined ? gravediggersTable.row($(this).closest('tr.child').prev()).data() : gravediggersTable.row($(this).closest('tr')).data()
        var notified = $(this).prop('checked');
        
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {type: 'updateGravedigger', serviceGravedigger: rowClick[0], notified: notified},
            type: 'POST',
            async: false,
            success: function(data){
                if(data){
                    gravediggersTable.ajax.reload();
                    changeColorGravedigger()
                }
            }
        });   
    });

    $('#gravediggersDocLink').click(function(){
        window.open(uri + 'descargar-archivo?file=Cementerio_municipal_Villagarcía.pdf', '_blank')
    })

    if(expedient.gravediggersCheckPrinted == 0){
        $('#gravediggersCheckPrintedText').addClass('c-red')
    }else{
        $('#gravediggersCheckPrinted').prop('checked', true)
    }

    $('#gravediggersCheckPrinted').change(function(){
        if($(this).prop('checked')){
            $('#gravediggersCheckPrintedText').removeClass('c-red')
            changeColorGravedigger()
        }else{
            $('#gravediggersCheckPrintedText').addClass('c-red')
            changeColorGravedigger()
        }
    })

    if(expedient.gravediggersCheckSigned == 0){
        $('#gravediggersCheckSignedText').addClass('c-red')
    }else{
        $('#gravediggersCheckSigned').prop('checked', true)
    }

    $('#gravediggersCheckSigned').change(function(){
        if($(this).prop('checked')){
            $('#gravediggersCheckSignedText').removeClass('c-red')
            changeColorGravedigger()
        }else{
            $('#gravediggersCheckSignedText').addClass('c-red')
            changeColorGravedigger()
        }
    })

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------- Sección de coros -----------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
  
    var provincesList = getProvinces();
    if(provincesList != null){
        $('#formNewChoir #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
        $('#formNewChoir #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewChoir #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewChoir #province').change(function(){
        var province = $('#formNewChoir #province').val();

        if(province == ''){
            $('#formNewChoir #location').prop('disabled', true);
            $('#formNewChoir #location').val('').trigger('change');
        }else{
            $('#formNewChoir #location').prop('disabled', false);

        }

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewChoir #location').select2({
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

    $('#formNewChoir #saveNewchoir').click(function(){
        var name = $('#formNewChoir #name').val();
        var nif = $('#formNewChoir #nif').val();
        var mail = $('#formNewChoir #mail').val();
        var address = $('#formNewChoir #address').val();
        var location = $('#formNewChoir #location').val();
        var homePhone = $('#formNewChoir #homePhone').val();
        var mobilePhone = $('#formNewChoir #mobilePhone').val();
        var otherPhone = $('#formNewChoir #otherPhone').val();
        var validate = true;

        if(isEmpty($('#formNewChoir #name'))){
            validate = false;
        }
        if($("#formNewChoir #nif").val() != "" && !isNifCif($("#formNewChoir #nif"))){
            validate = false;               
        }
        if($("#formNewChoir #homePhone").val() != "" && !isPhone($("#formNewChoir #homePhone"))){
            validate = false;               
        }
        if($("#formNewChoir #mobilePhone").val() != "" && !isPhone($("#formNewChoir #mobilePhone"))){
            validate = false;               
        }
        if($("#formNewChoir #otherPhone").val() != "" && !isPhone($("#formNewChoir #otherPhone"))){
            validate = false;               
        }
        if($("#formNewChoir #mail").val() != "" && !isMail($("#formNewChoir #mail"))){
            validate = false;               
        }

        if(validate){
            $.ajax({
                url : uri + 'core/choirs/create.php',
                method : 'POST',
                data : {
                    name : name,
                    nif : nif,
                    address : address,
                    location : location,
                    mail : mail,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone
                },
                success : function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        $('#modal-new-choir').modal('hide');
                        table.ajax.reload();
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El coro se ha creado con éxito.</div>');
                    }else if(data["cif"]){
                        $('#formNewChoir #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un coro con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-choir').modal('hide');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewChoir #msg').empty()
                    }, 5000)
                },
                error : function(data){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-choir').modal('hide');
                    
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-choir #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-choir #warning-message').empty()
            }, 3500)
        }
    })

    // CAMPANEROS - AÑADIR 
    $('#modal-new-bellringer .btn-add-church').click(function(){
        var church = $(this).parent().parent().find('#church').val()
        var churchName = $(this).parent().parent().find('#church').text()

        $('#modal-new-bellringer .churches').append('<span class="label label-default small labelPhones">' +
                                                '   <input type="hidden" value="' + church + '">' +
                                                '   <span class="number">' + churchName + '</span> ' +
                                                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                                                '</span><br>')

        if(!$('#modal-new-bellringer .churches').hasClass('in')){
            $('#modal-new-bellringer .churches').addClass('in')
        }

        $('#modal-new-bellringer .churches .label .btn-remove').click(function(){
            $(this).parent('.label').remove()
        })

        $('#modal-new-bellringer #formNewData #church').empty().trigger('change')
        $('#modal-new-bellringer #formEditData #church').empty().trigger('change')
    });

    $('#formNewBellringer #saveNewBellringer').click(function(){
        var validate = true;

        if(isEmpty($('#modal-new-bellringer #name'))){
            validate = false
        }
        if($("#modal-new-bellringer #homePhone").val()!=""){
            if(!isPhone($("#modal-new-bellringer #homePhone"))){
                validate = false
            }
        }
        if($("#modal-new-bellringer #mobilePhone").val()!=""){
            if(!isPhone($("#modal-new-bellringer #mobilePhone"))){
               validate = false
            }
        }
        if($("#modal-new-bellringer #otherPhone").val()!=""){
            if(!isPhone($("#modal-new-bellringer #otherPhone"))){
                validate = false
            }
        }
        if($("#modal-new-bellringer #nif").val()!=""){
            if(!isNifCif($("#modal-new-bellringer #nif"))){
                validate = false
            }
        }

        if(validate){
            var name = $('#modal-new-bellringer #name').val()
            var surname = $("#modal-new-bellringer #surname").val()
            var address = $("#modal-new-bellringer #address").val()
            var nif = $("#modal-new-bellringer #nif").val()
            var location = $("#modal-new-bellringer #location").val()
            if(location == "undefined" || location == "" || location == null){
                location = "NULL"
            }
            var area = $("#modal-new-bellringer #area").val()
            var parish = $("#modal-new-bellringer #parish").val()
            var homePhone = $("#modal-new-bellringer #homePhone").val()
            var mobilePhone = $("#modal-new-bellringer #mobilePhone").val()
            var otherPhone = $("#modal-new-bellringer #otherPhone").val()
            var churches = []
            $('#modal-new-bellringer .churches .label').each(function(){
                var church = $(this).find('.number').parent().find('[type=hidden]').val()
                churches.push(church)
            })

            $.ajax({
                url: uri + 'core/bellringers/create.php',
                method: 'POST',
                data: {
                    name : name,
                    surname : surname,
                    address : address,
                    nif : nif,
                    location : location,
                    area : area,
                    parish : parish,
                    homePhone : homePhone,
                    mobilePhone : mobilePhone,
                    otherPhone : otherPhone,
                    churches : churches
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El campanero se ha creado con éxito.</div>')
                        $('#modal-new-bellringer').modal('hide')
                        table.ajax.reload();
                    }else if(data["cif"]){
                        $('#formNewBellringer #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un campanero con ese NIF.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        $('#modal-new-bellringer').modal('hide')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewBellringer #msg').empty()
                    }, 5000)
                       
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    $('#modal-new-bellringer').modal('hide')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#modal-new-bellringer #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos obligatorios.</div>');
            
            setTimeout(function(){
                $('#modal-new-bellringer #warning-message').empty()
            }, 3500)
        }
    })
    
    // Datos del servicio
    var choirTable = $('#choir-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/expedients/services/choir.php?ID=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "#"},
            {"title": "Nombre"},
            {"title": "Dirección"},
            {"title": "Teléfonos"},
            {"title": "Móvil"},
            {"title": "Otro"},
            {"title": "Avisado"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0,4,5],
            "searchable": false,
            "visible": false
        },
        {
            "targets": [1],
            "render": function(data){
                return '<strong>' + data  + '</strong>'
            }
        },
        {
            "className" : "choirPhones",
            "targets" : 3,
            "render" : function(data, type, row){
                var homePhone = row[3]
                var mobilePhone = row[4]
                var otherPhone = row[5]

                if(row[6] == 0){
                    if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                        return 'Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                        return 'Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                        return 'Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                        return 'Casa: <a class="c-red" href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a class="c-red" href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a class="c-red" href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else{
                        return ''
                    }
                }else{
                    if(homePhone == '' && mobilePhone == '' && otherPhone != ''){
                        return 'Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone == ''){
                        return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>'
                    }else if(homePhone == '' && mobilePhone != '' && otherPhone != ''){
                        return 'Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' && otherPhone == ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a>'
                    }else if(homePhone != '' && mobilePhone == '' & otherPhone != ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone == ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a>' 
                    }else if(homePhone != '' && mobilePhone != '' & otherPhone != ''){
                        return 'Casa: <a href="tel:' + homePhone + '">' + homePhone + '</a> - Móvil: <a href="tel:' + mobilePhone + '">' + mobilePhone + '</a> - Otro: <a href="tel:' + otherPhone + '">' + otherPhone + '</a>'
                    }else{
                        return ''
                    }
                }
            }
        },
        {
            'className' : 'centered notified',
            "targets": 6,
            "width": "7%",
            "render": function (data, type, row) {
                if (data==0){
                    return '<input class="notifiedChoir" type="checkbox">';
                }else{
                    return '<input class="notifiedChoir" type="checkbox" checked>';
                }
            }
        },
        {
            "className": "centered details-control removeClick",
            "targets": 7,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[0, 'asc']],
        "rowCallback" : function(row, data, index){
            if(data[6] == 0){
                $('td', row).css('color', '#E61919');
            }
        },
        "initComplete": function(){
            changeColorChoirs()
        }
    });

    if(expedient.notifiedChoir == 1){
        $('#notifiedChoir').iCheck('check');
    }else{
        $('#notifiedChoir').iCheck('uncheck');
    }

    choirTable.on('click', '.notified', function () {
        var rowClick = choirTable.row($(this).closest('tr')).data() == undefined ? choirTable.row($(this).closest('tr.child').prev()).data() : choirTable.row($(this).closest('tr')).data()
        var notified = $(this).prop('checked');
        
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {type: 'updateChoir', Service_Choir: rowClick[0], notified: notified, expedientID: expedientID},
            type: 'POST',
            async: false,
            success: function(data){
                if(data){
                    choirTable.ajax.reload();
                    changeColorChoirs()
                }
            }
        });   
    })

    // Listado de coros
    $('#choir').select2({
        language: langSelect2,
        placeholder: '--',
        //allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/choirData.php',
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
                            id: item.choirID
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

    // Selección de disponibles
    $('#choir').on('select2:select', function(e){
        var choirID = $(this).val()
        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            type : 'POST',
            data : {
                type: 'setCHoir',
                service: expedientID,
                choir: choirID,
                fromTime: expedient.funeralTime
            },
            async : false,
            success : function(data){
                if(data){
                    gravediggersTable.ajax.reload()
                }
            }
        })

        choirTable.ajax.url(uri + "core/expedients/services/choir.php?ID= " + expedientID + "&choirID=" + choirID).load()
        $(this).val('').trigger('change')
    });

    choirTable.on('click', 'tbody .removeClick', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = choirTable.row($(this).closest('tr')).data() == undefined ? choirTable.row($(this).closest('tr.child').prev()).data() : choirTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el coro: " + rowClick[1] + "?")){
            $.ajax({
                url: uri + "core/expedients/services/functions.php",
                data: {type: 'deleteChoir', choirID: rowClick[0]},
                type: 'POST',
                async: false,
                success: function(data){
                    if(data){
                        choirTable.ajax.url(uri + "core/expedients/services/choir.php?ID=" + expedientID).load()
                        $('#choir').val('').change()
                    }
                }
            });
        }
    });

    //Actualizamos el campo avisado para los en los enterradores
    choirTable.on('click', '.notifiedChoir', function () {
        var notified = $(this).prop('checked');
        
        if(notified == true){
            $('.notifiedChoirText').html('');
            notified = 1;
        }else{
            $('.notifiedChoirText').html('(sin avisar)');
            notified = 0;
        }
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {type: 'updateChoir', expedientID: expedientID, notified: notified},
            type: 'POST',
            async: false,
            success: function(data){
                if(data){
                    choirTable.ajax.reload();
                }
            }
        }); 
    });

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        -------------------------------------------------------- Sección de campaneros ------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    var bellringerTable = $('#bellringer-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/expedients/services/bellringer.php?ID=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "#"},
            {"title": "Nombre"},
            {"title": "Parroquia"},
            {"title": "Móvil"},
            {"title": "Avisado"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [{
            "className": "id",
            "targets": [0],
            "searchable": false,
            "visible": false
        },
        {
            "targets": [1, 2],
            "render": function(data){
                return '<strong>' + data  + '</strong>'
            }
        },
        {
            'className' : 'centered notified',
            "targets": 4,
            "width": "7%",
            "render": function(data, type, row){
                if(data == 0){
                    return '<input class="notifiedBellringer" type="checkbox">'
                }else{
                    return '<input class="notifiedBellringer" type="checkbox" checked>'
                }
            }
        },
        {
            "className": "centered details-control removeClick",
            "targets": 5,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[0, 'asc']],
        "rowCallback" : function(row, data, index){
            if(data[4] == 0){
                $('td', row).css('color', '#E61919')
            }
        },
        "initComplete": function(){
            changeColorBellringer()
        }
    })

    // Listado de campaneros
    $('#bellringer').select2({
        language: langSelect2,
        placeholder: '--',
        ajax: {
            url: uri + 'core/expedients/services/bellringersData.php',
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
                        var surname = item.surname !=  null ? item.surname : ''
                        var parish = item.parish !=  null && item.parish != '' ? ' (' + item.parish + ')' : ''
                        return {
                            text: item.name +  ' ' + surname +  parish,
                            id: item.ID
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

    if(expedient.notifiedBellringer == 1){
        $('#notifiedBellringer').prop('checked', true)
    }else{
        $('#notifiedBellringer').prop('checked', false)
    }

    // Selección de disponibles
    $('#bellringer').on('select2:select', function(e){
        var bellringerID = $(this).val()

        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            data : {
                type : 'setBellringer',
                service : expedientID,
                bellringer : bellringerID,
                fromTime: expedient.funeralTime
            },
            type : 'POST',
            async : false,
            success : function(data){
                if(data){
                    bellringerTable.ajax.reload()
                }
            }
        })

        bellringerTable.ajax.url(uri + 'core/expedients/services/bellringer.php?ID=' + expedientID + '&bellringerID=' + bellringerID).load()
        $('#bellringer').val('').trigger('change')
    });

    bellringerTable.on('click', 'tbody .removeClick', function(){
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide')

        var rowClick = bellringerTable.row($(this).closest('tr')).data() == undefined ? bellringerTable.row($(this).closest('tr.child').prev()).data() : bellringerTable.row($(this).closest('tr')).data()

        if(confirm('Está seguro de que quiere borrar el campanero: ' + rowClick[1] + '!')){
            $.ajax({
                url : uri + 'core/expedients/services/functions.php',
                data : {
                    type : 'deleteBellringer',
                    bellringerID : rowClick[0]
                },
                type : 'POST',
                async : false,
                success : function(data){
                    if(data){
                        bellringerTable.ajax.url(uri + 'core/expedients/services/bellringer.php?ID=' + expedientID).load()
                        $('#bellringer').val('').change()
                        changeColorBellringer()
                    }
                }
            })
        }
    })

    bellringerTable.on('click', '.notifiedBellringer', function () {
        var rowClick = bellringerTable.row($(this).closest('tr')).data() == undefined ? bellringerTable.row($(this).closest('tr.child').prev()).data() : bellringerTable.row($(this).closest('tr')).data()
        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            data : {
                type: 'updateBellringer',
                bellringerID: rowClick[0]
            },
            type : 'POST',
            async : false,
            success : function(data){
                if(data){
                    bellringerTable.ajax.reload();
                    changeColorBellringer()
                }
            }
        }); 
    });

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ---------------------------------------------------------- Sección de notas ----------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    $('#notesSection #notes').val(expedient.notes);

    // Listar usuarios
    $('#usersNotesThread').select2({
        containerCssClass: 'select2-price',
        language: langSelect2,
        placeholder: 'Seleccione un usuario...',
        allowClear: true,
        ajax: {
            url: uri+'core/users/dataUsers.php',
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
                            username: item.username,
                            text: item.name + ' ' + item.surname,
                            id: item.userID,
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

    $('#selectUserThread').click(function(){
        if($('#usersNotesThread').val() == null){
            $('#usersNotesThreadError').removeClass('hide')
            return false
        }

        var start = focusedNote[0].selectionStart

        var first = focusedNote.val().substr(0, start)
        var end = focusedNote.val().substr(start, focusedNote.val().length + 1)

        focusedNote.val(first + $('#usersNotesThread').select2('data')[0].username + ' ' + end)
        focusedNote.attr('disabled', false)

        $('#modal-users-notes-thread').modal('hide')
    })
    
    drawNotes(expedientID)
    $('#modal-users-notes-thread').on('hidden.bs.modal', function(){
        focusedNote.attr('disabled', false)
        $('#usersNotesThread').val(null).trigger('change')
        $('#usersNotesThreadError').addClass('hide')
    })

    $('#modal-users-notes-thread .close-user-note-thread').click(function(){
        focusedNote.val(currentNoteValue)
    })

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ---------------------------------------------------------- Sección de otros ----------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */

    var othersNotAplly = []
    var redTittles = [];
    var checkboxTotal = 0;
    var checkboxItems = 0;
    $('#othersSection').html('<div class="box-group" id="accordionOthersSection" role="tablist" aria-multiselectable="true"></div>');
    printOthers()
    function printOthers(){
        $('#othersSection').empty()

        var others

        $.ajax({
            url: uri + 'core/expedients/services/functions.php',
            method: 'POST',
            data: {
                type: 'getOthers',
                expedient: expedientID
            },
            async: false,
            success: function(data){
                try{
                    others = $.parseJSON(data)
                }catch(e){
                    others = null
                }
            },
            error: function(){
                others = null
            }
        })

        if(others[0] != null || others[1] != null || others[2] != null){
            if(others[0] != null){
                var withOthers = others[0]
                var supplier = null
                var text = ''
                var buttons = "";
                var order =null;
                var sentEmail =null;
                othersNotAplly = [];
              
                $.each(withOthers, function(index, elem){
                  
                    if(elem.supplierID == supplier){
                        text +=     '                   <tr>' +
                                    '                       <td width="5%" class="amount">' + elem.amount + '</td>' +
                                    '                       <td width="15%">' + elem.productName + '</td>' +
                                    '                       <td width="15%">' + elem.modelName + '</td>' +
                                    '                       <td class="hide model">' + elem.modelID + '</td>' +
                                    '                       <td class="hide price">' + elem.price + '</td>' +
                                    '                       <td width="10%" id="texts' + elem.texts + '">'

                        if(elem.texts != null){
                            $.each(elem.texts, function(index, elem){
                                text += '<p>' + elem.value + '</p>'
                            })
                        }
                    
                        text += '</td>' +
                                    '<td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '">'

                        if(elem.actions != null){
                            $.each(elem.actions, function(index2, elem2){
                                switch(elem2.type){
                                    case 'checkbox':
                                        
                                        if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                            othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                        }
                                        if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){
                                            if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label>' + elem2.label + '</label></div>'
                                            }else{
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>'                                       
                                            }                                    
                                        }else{
                                            text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                        }
                                        break
        
                                    case 'text':
                                        var inputValue
                                        if(elem2.value == '0'){
                                            inputValue = ''
                                        }else{
                                            inputValue = elem2.value
                                        }
                                        switch(elem.productID){
                                            case '76':
                                            case '77':
                                            case '54':
                                            case '36':
                                            case '108':
                                            case '52':
                                            case '53':
                                            case '38':
                                                
                                                text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                            
                                                // PICKERS
                                                $('.datepicker').datepicker({
                                                    autoclose: true,  
                                                    language: 'es',
                                                    weekStart: 1,
                                                    todayHighlight : true,forceParse: false
                                                })
                                            break;
                        
                                            case '205':
                                                switch(elem2.action){
                                                    case '39': 
                                                        text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                                   
                                                        // PICKERS
                                                        $('.datepicker').datepicker({
                                                            autoclose: true,  
                                                            language: 'es',
                                                            weekStart: 1,
                                                            todayHighlight : true,forceParse: false
                                                        })
                                                    break;
                        
                                                    case '40':  
                                                        text += '<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>' 
                                                        // PICKERS
                                                        $('.timepicker').timepicker({
                                                            showInputs: false,
                                                            showMeridian: false,
                                                            timeFormat: 'HH:mm',
                                                            defaultTime: false
                                                        })
                                                    break;
                        
                                                    default:  
                                                        if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'                                                    
                                                        }else{
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'                                                    
                                                        }
                                                    break;
                                                }                                        
                                            break;
                                                
                                            default:
                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'
                                                }else{
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                }
                                            break;
                                        }
                                        break;
                                        
                                    case 'select':
                                        text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>'
                                        switch(elem2.action){
                                            case '14':
                                                $('select[itemType="recordatorio"]').append('<option value="0">--</option>')
                                                $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                                $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                                $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                            break;
                                        }
                                    break;
        
                                    case 'link':
                                        text += '<div class="spaceRight"><button type="button"></button></div>'
                                    break;
                                        
                                    case 'button':
                                        text += '<div class="spaceRight"><button type="button"></button></div>'
                                    break;
        
                                    case 'staff':
                                        text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>'                                   
                                    
                                        var posts = null
                                        $.ajax({
                                            url: uri + 'core/products/functions.php',
                                            method: 'POST',
                                            data: {
                                                type: 'getPostForAction',
                                                actionID : elem2.action
                                            },
                                            async: false,
                                            success: function(data){
                                                data = $.parseJSON(data)
                    
                                                if(data != null){
                                                    posts = ''
                                                    $.each(data, function(index, i){
                                                        posts += i.idPost + ','
                                                    })
                                                    posts = posts.slice(0, -1)
                                                }
                                            }
                                        })

                                        setTimeout(() => {
                                            $('[name="'+ elem.productID + '-' + elem2.action +'"]').select2({
                                                containerCssClass: 'select2-staff',
                                                language: langSelect2,
                                                placeholder: '--', //--
                                                allowClear: true,
                                                ajax: {
                                                    url: uri + 'core/staff/data.php',
                                                    dataType: 'json',
                                                    delay: 250,
                                                    data: function (params) {
                                                        return {
                                                            q: params.term || "",
                                                            p: posts,
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
                                        
                                            if(elem2.value != ""){
                                                $.ajax({
                                                    url: uri+"core/staff/functions.php",
                                                    data: {type: 'getStaffByID', ID: elem2.value},
                                                    type: 'POST',
                                                    async: false,
                                                    success: function (data) {
                                                        data = $.parseJSON(data);
                                                        
                                                        if(data){
                                                            if($('[name="'+ elem.productID + '-' + elem2.action +'"]').find("option[value='" + elem2.value + "']").length) {
                                                                $('[name="'+ elem.productID + '-' + elem2.action +'"]').val(elem2.value).trigger('change');
                                                            }else{ 
                                                                // Creamos la nueva opción DOM para preseleccionarlo por defecto
                                                                var newOption = new Option(data[0].name + " " + data[0].surname, elem2.value, true, true);
                                                                //Lo añadimos al select
                                                                $('[name="'+ elem.productID + '-' + elem2.action +'"]').append(newOption).trigger('change');
                                                            }
                                                        }
                                                    }
                                                });
                                            }  
                                        }, 250);
                                    break;
                                }
                            })
                        }

                        text += '                           </td>' +
                                    '                   </tr>'
                    }else{           
                        if(supplier == null){    
               
                           
                            text += '   <fieldset>' +
                                    '       <legend class="legendBottom"><span id="'+elem.preOrderID+'lbl" class="label label-primary labelLgExp"><strong>Proveedor: </strong> ' + elem.supplierName  + ' - <strong>Teléfono: </strong>' + elem.suplierPhone + '</span></legend>' +
                                    '       <div class="table-responsive">' +
                                    '           <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
                                    '               <thead>' +
                                    '                   <tr>' +
                                    '                       <th width="5%">Cantidad</th>' +
                                    '                       <th width="15%">Producto</th>' +
                                    '                       <th width="15%">Modelo</th>' +
                                    '                       <th class="hide">productModelID</th>' +
                                    '                       <th class="hide">Precio</th>' +
                                    '                       <th width="10%">Textos</th>' +
                                    '                       <th width="55%">Acciones</th>' +
                                    '                   </tr>' +
                                    '               </thead>' +
                                    '               <tbody>' +
                                    '                   <tr>' +
                                    '                       <td width="5%" class="amount">' + elem.amount + '</td>' +
                                    '                       <td width="15%">' + elem.productName + '</td>' +
                                    '                       <td width="15%">' + elem.modelName + '</td>' +
                                    '                       <td class="hide model">' + elem.modelID + '</td>' +
                                    '                       <td class="hide price">' + elem.price + '</td>' +
                                    '                       <td width="10%" id="texts' + elem.modelID + '">'

                            if(elem.texts != null){
                                $.each(elem.texts, function(index, elem){
                                    text += '                   <p>' + elem.value + '</p>'
                                })
                            }
                            text += '                       </td>' +
                                    '                       <td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '">'

                            var countSuccess = 0;
                            var countCheckbox = 0;
                            if(elem.actions != null){
                                $.each(elem.actions, function(index2, elem2){  
                                    switch(elem2.type){
                                        case 'checkbox':

                                            if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                                othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                            }

                                            if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){   
                                                if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label>' + elem2.label + '</label></div>'                                            
                                                }else{
                                                    countCheckbox++;
                                                    checkboxItems++;
                                                  
                                                    redTittles.push('#'+elem.preOrderID+'lbl')
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>'                                            
                                                }                                 
                                            }else{
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                                countSuccess++;
                                                countCheckbox++;
                                                checkboxItems++;
                                                checkboxTotal++;
                                            }
                                        break
            
                                        case 'text':
                                            var inputValue
                                            if(elem2.value == '0'){
                                                inputValue = ''
                                            }else{
                                                inputValue = elem2.value
                                            }
                                            switch(elem.productID){
                                                case '76':
                                                case '77':
                                                case '54':
                                                case '36':
                                                case '108':
                                                case '52':
                                                case '53':
                                                case '38':
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                            
                                                    // PICKERS
                                                    $('.datepicker').datepicker({
                                                        autoclose: true,  
                                                        language: 'es',
                                                        weekStart: 1,
                                                        todayHighlight : true,forceParse: false
                                                    })
                                                break;
                            
                                                case '205':
                                                    switch(elem2.action){
                                                        case '39': 
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                                   
                                                            // PICKERS
                                                            $('.datepicker').datepicker({
                                                                autoclose: true,  
                                                                language: 'es',
                                                                weekStart: 1,
                                                                todayHighlight : true,forceParse: false
                                                            })
                                                        break;
                            
                                                        case '40':  
                                                            text += '<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>' 
                                                            // PICKERS
                                                            $('.timepicker').timepicker({
                                                                showInputs: false,
                                                                showMeridian: false,
                                                                timeFormat: 'HH:mm',
                                                                defaultTime: false
                                                            })
                                                        break;
                            
                                                        default:  
                                                            if(elem2.label == 'Notas'){
                                                                text += '<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>'
                                                            }else{
                                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'
                                                                }else{
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                                }
                                                            }
                                                        break;
                                                    }                                        
                                                    break;
                                                    
                                                default:
                                                    if(elem2.label == 'Notas'){
                                                        text += '<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>'
                                                    }else{
                                                        if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'
                                                        }else{
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                        }
                                                    }
                                                break;
                                            }
                                        break;
                                            
                                        case 'select':
                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>'
                                            switch(elem2.action){
                                                case '14':
                                                    $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                                    $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                                    $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                                break;
                                            }
                                        break;
            
                                        case 'link':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                        break;
                                            
                                        case 'button':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                        break;
            
                                        case 'staff':
                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>'                                   
                                    
                                            var posts = null
                                            $.ajax({
                                                url: uri + 'core/products/functions.php',
                                                method: 'POST',
                                                data: {
                                                    type: 'getPostForAction',
                                                    actionID : elem2.action
                                                },
                                                async: false,
                                                success: function(data){
                                                    try{
                                                        data = $.parseJSON(data)
                            
                                                        if(data != null){
                                                            posts = ''
                                                            $.each(data, function(index, i){
                                                                posts += i.idPost + ','
                                                            })
                                                            posts = posts.slice(0, -1)
                                                        }
                                                    }catch(e){}
                                                }
                                            })

                                            setTimeout(() => {
                                                $('[name="'+ elem.productID + '-' + elem2.action +'"]').select2({
                                                    containerCssClass: 'select2-staff',
                                                    language: langSelect2,
                                                    placeholder: '--', //--
                                                    allowClear: true,
                                                    ajax: {
                                                        url: uri + 'core/staff/data.php',
                                                        dataType: 'json',
                                                        delay: 250,
                                                        data: function (params) {
                                                            return {
                                                                q: params.term || "",
                                                                p: posts,
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
                                            
                                                if(elem2.value != ""){
                                                    $.ajax({
                                                        url: uri+"core/staff/functions.php",
                                                        data: {type: 'getStaffByID', ID: elem2.value},
                                                        type: 'POST',
                                                        async: false,
                                                        success: function (data) {
                                                            data = $.parseJSON(data);
                                                            
                                                            if(data){
                                                                if ($('[name="'+ elem.productID + '-' + elem2.action +'"]').find("option[value='" + elem2.value + "']").length) {
                                                                    $('[name="'+ elem.productID + '-' + elem2.action +'"]').val(elem2.value).trigger('change');
                                                                } else { 
                                                                    // Creamos la nueva opción DOM para preseleccionarlo por defecto
                                                                    var newOption = new Option(data[0].name + " " + data[0].surname, elem2.value, true, true);
                                                                    //Lo añadimos al select
                                                                    $('[name="'+ elem.productID + '-' + elem2.action +'"]').append(newOption).trigger('change');
                                                                }
                                                            }
                                                        }
                                                    });
                                                } 
                                            }, 250);
                                        break;
                                    }
                                    
                                })
                                if(countCheckbox == countSuccess){
                                    setTimeout(() => {
                                        $('#'+elem.preOrderID+'lbl').removeClass('label-primary').addClass('label-success')
                                    }, 500);
                                }
                            }
                            text += '                       </td>' +
                                    '                   </tr>'
                        }else{    
                            buttons = '';
                            if(parseInt(supplier) != mainSupplier){
                                if(sentEmail == 1){
                                    if(order == null){                            
                                        buttons =   '   <div style="float: right" class="order-actions">' +
                                                    '       <button type="button" class="btn btn-danger" id="newOrder1' + supplier + '">Realizar pedido</button>' +
                                                    '       <button type="button" class="btn btn-primary hide" id="viewOrder1' + supplier + '">Ver pedido</button>' +
                                                    '       <button type="button" class="btn btn-success" id="sentEmail1' + supplier + '" disabled>Correo enviado</button>' +
                                                    '       <button type="button" class="btn btn-secondary" id="genPDF1' + supplier + '"disabled>Ver PDF</button>' +
                                                    '       <p id="sentEmail1' + supplier + '"></p>' +
                                                    '   </div>'
                                    }else{
                                        buttons =   '   <div style="float: right" class="order-actions">' +
                                                    '       <button type="button" class="btn btn-primary" id="viewOrder1' + supplier + '">Ver pedido</button>' +
                                                    '       <button type="button" class="btn btn-success" id="sentEmail1' + supplier + '">Correo enviado</button>' +
                                                    '       <button type="button" class="btn btn-secondary" id="genPDF1' + supplier + '">Ver PDF</button>' +
                                                    '       <p id="sentEmail1' + supplier + '"></p>' +
                                                    '   </div>'
                                    }
                                }else{
                                    if(order == null){
                                        buttons =   '   <div style="float: right" class="order-actions">' +
                                                    '       <button type="button" class="btn btn-danger" id="newOrder1' + supplier + '">Realizar pedido</button>' +
                                                    '       <button type="button" class="btn btn-primary hide" id="viewOrder1' + supplier + '">Ver pedido</button>' +
                                                    '       <button type="button" class="btn btn-secondary" id="sentEmail1' + supplier + '" disabled>Enviar correo</button>' +
                                                    '       <button type="button" class="btn btn-secondary" id="genPDF1' + supplier + '"disabled>Ver PDF</button>' +
                                                    '       <p id="sentEmail1' + supplier + '"></p>' +
                                                    '   </div>'
                                    }else{
                                        buttons =   '   <div style="float: right" class="order-actions">' +
                                                    '       <button type="button" class="btn btn-primary" id="viewOrder1' + supplier + '">Ver pedido</button>' +
                                                    '       <button type="button" class="btn btn-danger" id="sentEmail1' + supplier + '">Enviar correo</button>' +
                                                    '       <button type="button" class="btn btn-secondary" id="genPDF1' + supplier + '">Ver PDF</button>' +
                                                    '       <p id="sentEmail1' + supplier + '"></p>' +
                                                    '   </div>'
                                    }
                                }
                            }
                                       
                            text += '               </tbody>' +
                            '           </table>' +
                            '       </div>' +      
                            buttons +
                            '   </fieldset>' +
                            '   <fieldset>' +
                            '   <legend><span id="'+elem.preOrderID+'lbl" class="label label-primary labelLgExp"><strong>Proveedor: </strong>' + elem.supplierName  + ' - <strong>Teléfono: </strong>' + elem.suplierPhone + '</span></legend>' +
                            '       <div class="table-responsive">' +
                            '           <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
                            '               <thead>' +
                            '                   <tr>' +
                            '                       <th width="5%">Cantidad</th>' +
                            '                       <th width="15%">Producto</th>' +
                            '                       <th width="15%">Modelo</th>' +
                            '                       <th class="hide">productModelID</th>' +
                            '                       <th class="hide">Precio</th>' +
                            '                       <th width="10%">Textos</th>' +
                            '                       <th width="55%">Acciones</th>' +
                            '                   </tr>' +
                            '               </thead>' +
                            '               <tbody>' +
                            '                   <tr>' +
                            '                       <td width="5%" class="amount">' + elem.amount + '</td>' +
                            '                       <td width="15%">' + elem.productName + '</td>' +
                            '                       <td width="15%">' + elem.modelName + '</td>' +
                            '                       <td class="hide model">' + elem.modelID + '</td>' +
                            '                       <td class="hide price">' + elem.price + '</td>' +
                            '                       <td width="10%" id="texts' + elem.modelID + '">'
                                    
                            if(elem.texts != null){
                                $.each(elem.texts, function(index, elem){
                                    text += '                   <p>' + elem.value + '</p>'
                                })
                            }
                                    
                            text += '                       </td>' +
                                    '                       <td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '">'
                               
                            var countSuccess = 0;
                            var countCheckbox = 0;
                            if(elem.actions != null){
                                $.each(elem.actions, function(index2, elem2){
                                    switch(elem2.type){
                                        case 'checkbox':
                                          
                                            if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                                othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                            }

                                            if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){  
                                                if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label>' + elem2.label + '</label></div>'                                            
                                                }else{
                                                    redTittles.push('#'+elem.preOrderID+'lbl')
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>'                                            
                                                    countCheckbox++;
                                                    checkboxItems++;
                                                }                                  
                                            }else{
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                                countSuccess++;
                                                countCheckbox++;
                                                checkboxItems++;
                                                checkboxTotal++
                                            }
                                            //text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '"> <label>' + elem2.label + '</label></div>'
                                            break
            
                                        case 'text':
                                            var inputValue
                                            if(elem2.value == '0'){
                                                inputValue = ''
                                            }else{
                                                inputValue = elem2.value
                                            }
                                            switch(elem.productID){
                                                case '76':
                                                case '77':
                                                case '54':
                                                case '36':
                                                case '108':
                                                case '52':
                                                case '53':
                                                case '38':
                                                    
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                            
                                                    // PICKERS
                                                    $('.datepicker').datepicker({
                                                        autoclose: true,  
                                                        language: 'es',
                                                        weekStart: 1,
                                                        todayHighlight : true,forceParse: false
                                                    })
                                                break;
                            
                                                case '205':
                                                    switch(elem2.action){
                                                        case '39': 
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                                   
                                                            // PICKERS
                                                            $('.datepicker').datepicker({
                                                                autoclose: true,  
                                                                language: 'es',
                                                                weekStart: 1,
                                                                todayHighlight : true,forceParse: false
                                                            })
                                                        break;
                            
                                                        case '40':  
                                                            text += '<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>' 
                                                            // PICKERS
                                                            $('.timepicker').timepicker({
                                                                showInputs: false,
                                                                showMeridian: false,
                                                                timeFormat: 'HH:mm',
                                                                defaultTime: false
                                                            })
                                                        break;
                            
                                                        default: 
                                                            if(elem2.label == 'Notas'){
                                                                text += '<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>'
                                                            }else{
                                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center"></div>'
                                                                }else{
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                                }
                                                            }
                                                        break;
                                                    }                                        
                                                    break
                                                    
                                                default:
                                                    if(elem2.label == 'Notas'){
                                                        text += '<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>'
                                                    }else{
                                                        if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'
                                                        }else{
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                        }
                                                    }
                                                break;
                                            }
                                        break;
                                            
                                        case 'select':
                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>'
                                            switch(elem2.action){
                                                case '14':
                                                    $('select[itemType="recordatorio"]').append('<option value="0">--</option>')
                                                    $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                                    $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                                    $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                                break;
                                            }
                                        break;
            
                                        case 'link':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                        break;
                                            
                                        case 'button':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                        break;
            
                                        case 'staff':
                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>'                                   
                                    
                                            var posts = null
                                            $.ajax({
                                                url: uri + 'core/products/functions.php',
                                                method: 'POST',
                                                data: {
                                                    type: 'getPostForAction',
                                                    actionID : elem2.action
                                                },
                                                async: false,
                                                success: function(data){
                                                    try{
                                                        data = $.parseJSON(data)
                            
                                                        if(data != null){
                                                            posts = ''
                                                            $.each(data, function(index, i){
                                                                posts += i.idPost + ','
                                                            })
                                                            posts = posts.slice(0, -1)
                                                        }
                                                    }catch(e){}
                                                }
                                            })
                                            setTimeout(() => {
                                                $('[name="'+ elem.productID + '-' + elem2.action +'"]').select2({
                                                    containerCssClass: 'select2-staff',
                                                    language: langSelect2,
                                                    placeholder: '--', //--
                                                    allowClear: true,
                                                    ajax: {
                                                        url: uri + 'core/staff/data.php',
                                                        dataType: 'json',
                                                        delay: 250,
                                                        data: function (params) {
                                                            return {
                                                                q: params.term || "",
                                                                p: posts,
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
                                                
                                                if(elem2.value != ""){
                                                    $.ajax({
                                                        url: uri+"core/staff/functions.php",
                                                        data: {type: 'getStaffByID', ID: elem2.value},
                                                        type: 'POST',
                                                        async: false,
                                                        success: function (data) {
                                                            data = $.parseJSON(data);
                                                            
                                                            if(data){
                                                                if ($('[name="'+ elem.productID + '-' + elem2.action +'"]').find("option[value='" + elem2.value + "']").length) {
                                                                    $('[name="'+ elem.productID + '-' + elem2.action +'"]').val(elem2.value).trigger('change');
                                                                } else { 
                                                                    // Creamos la nueva opción DOM para preseleccionarlo por defecto
                                                                    var newOption = new Option(data[0].name + " " + data[0].surname, elem2.value, true, true);
                                                                    //Lo añadimos al select
                                                                    $('[name="'+ elem.productID + '-' + elem2.action +'"]').append(newOption).trigger('change');
                                                                }
                                                            }
                                                        }
                                                    });
                                                } 
                                            }, 250);                
                                        break;
                                    }
                                })
                                                
                                if(countCheckbox == countSuccess){
                                    setTimeout(() => {
                                        $('#'+elem.preOrderID+'lbl').removeClass('label-primary').addClass('label-success')
                                    }, 500);
                                }
                            }
                            text += '                       </td>' +
                                    '                   </tr>'
                        }
                    }

                    supplier = elem.supplierID   
                    order = elem.orderID          
                    sentEmail = elem.sentEmail          
                })

                buttons = '';
                if(parseInt(supplier) != mainSupplier){
                    if(withOthers[withOthers.length - 1].sentEmail == 1){
                        if(withOthers[withOthers.length - 1].orderID == null){
                            buttons =   '   <div style="float: right" class="order-actions">' +
                                        '       <button type="button" class="btn btn-danger" id="newOrder1' + withOthers[withOthers.length - 1].supplierID + '">Realizar pedido</button>' +
                                        '       <button type="button" class="btn btn-primary hide" id="viewOrder1' + withOthers[withOthers.length - 1].supplierID + '">Ver pedido</button>' +
                                        '       <button type="button" class="btn btn-success" id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '" disabled>Correo enviado</button>' +
                                        '       <button type="button" class="btn btn-secondary" id="genPDF1' + withOthers[withOthers.length - 1].supplierID + '"disabled>Ver PDF</button>' +
                                        '       <p id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '"></p>' +
                                        '   </div>'
                        }else{
                            buttons =   '   <div style="float: right" class="order-actions">' +
                                        '       <button type="button" class="btn btn-primary" id="viewOrder1' + withOthers[withOthers.length - 1].supplierID + '">Ver pedido</button>' +
                                        '       <button type="button" class="btn btn-success" id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '">Correo enviado</button>' +
                                        '       <button type="button" class="btn btn-secondary" id="genPDF1' + withOthers[withOthers.length - 1].supplierID + '">Ver PDF</button>' +
                                        '       <p id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '"></p>' +
                                        '   </div>'
                        }
                    }else{
                        if(withOthers[withOthers.length - 1].orderID == null){
                            buttons =   '   <div style="float: right" class="order-actions">' +
                                        '       <button type="button" class="btn btn-danger" id="newOrder1' + withOthers[withOthers.length - 1].supplierID + '">Realizar pedido</button>' +
                                        '       <button type="button" class="btn btn-primary hide" id="viewOrder1' + withOthers[withOthers.length - 1].supplierID + '">Ver pedido</button>' +
                                        '       <button type="button" class="btn btn-secondary" id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '"disabled>Enviar correo</button>' +
                                        '       <button type="button" class="btn btn-secondary" id="genPDF1' + withOthers[withOthers.length - 1].supplierID + '"disabled>Ver PDF</button>' +
                                        '       <p id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '"></p>' +
                                        '   </div>'
                        }else{
                            buttons =   '   <div style="float: right" class="order-actions">' +
                                        '       <button type="button" class="btn btn-primary" id="viewOrder1' + withOthers[withOthers.length - 1].supplierID + '">Ver pedido</button>' +
                                        '       <button type="button" class="btn btn-danger" id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '">Enviar correo</button>' +
                                        '       <button type="button" class="btn btn-secondary" id="genPDF1' + withOthers[withOthers.length - 1].supplierID + '">Ver PDF</button>' +
                                        '       <p id="sentEmail1' + withOthers[withOthers.length - 1].supplierID + '"></p>' +
                                        '   </div>'
                        }
                    }
                }

                text += '                           </tbody>' +
                        '                       </table>' +
                        '                   </div>' +                    
                                            buttons +
                        '               </fieldset>'

                $('#othersSection').append(text)

                //----------------------------------- Acciones de los botones del pedido----------------------------------------
                var supplierBtn = null
                $.each(withOthers, function(index, elem){
                    if(supplierBtn == null){                    
                        $('#newOrder1' + elem.supplierID).click(function(){
                            var orderID = null
                            var linesTable = []
                            
                            $('#newOrder1' + elem.supplierID).closest('fieldset').find('table > tbody > tr').each(function(index, i){
                                
                                model = $(this).find('td.model')["0"].innerHTML
                                amount = $(this).find('td.amount')["0"].innerHTML
                                price = $(this).find('td.price')["0"].innerHTML
                                
                                linesTable.push([model, amount, price])
                            })
                            
                            var currentDate = moment(new Date()).format('X')
                            var deliveryDate = moment().add(1, 'days').format('X')

                            var deliveryPlace
                            $.ajax({
                                url: uri + 'core/expedients/services/functions.php',
                                method: 'POST',
                                data: {
                                    type: 'getDeliveryPlace',
                                    expedient : expedientID,
                                },
                                async: false,
                                success: function(data){
                                    try{
                                        data = $.parseJSON(data)
                                        deliveryPlace = data == null ? 0 : data
                                    }catch(e){
                                        deliveryPlace = 0
                                    }
                                },
                                error: function(){
                                    deliveryPlace = 0
                                }
                            })

                            var deceasedRoom
                            $.ajax({
                                url: uri + 'core/expedients/services/functions.php',
                                method: 'POST',
                                data: {
                                    type: 'getDeceasedRoom',
                                    expedient : expedientID,
                                },
                                async: false,
                                success: function(data){
                                    try{
                                        data = $.parseJSON(data)
                                        deceasedRoom = data == null ? 'null' : data
                                    }catch(e){
                                        deceasedRoom = 'null'
                                    }
                                },
                                error: function(){
                                    deceasedRoom = 'null'
                                }
                            })
                            
                            $.ajax({
                                url : uri + 'core/warehouse/orders/create.php',
                                method : 'POST',
                                data : {
                                    preOrder: elem.preOrderID,
                                    supplier: elem.supplierID,
                                    expedient : expedientID,
                                    deliveryPlace : deliveryPlace,
                                    deceasedRoom: deceasedRoom,
                                    type : 0,
                                    date : currentDate,
                                    deliveryPlaceOther: '',
                                    deliveryDate : deliveryDate,
                                    notes : '',
                                    lines : linesTable
                                },
                                success : function(data){
                                    data = $.parseJSON(data)
                                    if(data == 'deliveryPlace'){
                                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha podido crear el pedido porque no hay un lugar de entrega (casa mortuoria) asignado.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                        return false
                                    }
                                    orderID = data                              
                                
                                    if(data){
                                        $('#newOrder1' + elem.supplierID).prop('disabled', true)
                                        //$('#newOrder1' + elem.supplierID).html('Pedido realizado');
                                        $('#newOrder1' + elem.supplierID).addClass('hide')
                                        $('#viewOrder1' + elem.supplierID).removeClass('hide')
                                        $('#newOrder1' + elem.supplierID).removeClass('btn-danger');
                                        $('#newOrder1' + elem.supplierID).addClass('btn-success');
                                        $('#sentEmail1' + elem.supplierID).prop('disabled', false)
                                        $('#viewOrder1' + elem.supplierID).prop('disabled', false)
                                        $('#genPDF1' + elem.supplierID).prop('disabled', false)
                                        $('#viewOrder1' + elem.supplierID).click(function(){
                                            window.open(uri + 'almacen/pedidos/' + data)
                                        })
                                        
                                        // ENVIAR CORREO
                                        $('#sentEmail1' + elem.supplierID).click(function(){
                                            $.ajax({
                                                url : uri + 'core/orders/functions.php',
                                                method : 'POST',
                                                data : {
                                                    type : 'getInfo',
                                                    order : orderID
                                                },
                                                async: false,
                                                success : function(data){
                                                    data = $.parseJSON(data)                                                   
                                                    var order = data[0]                                                    
                                                    var orderLines = data[1]
                                                    
                                                    $('#modal-send-email1 #orderID').val(order.ID)

                                                    $('#modal-send-email1 #number').html(order.ID)
                                                    $('#modal-send-email1 #date').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                                    $('#modal-send-email1 #supplierName').html(order.supplierName)
                                                    $('#modal-send-email1 #supplierID').html(elem.supplierID)
                                                    $('#modal-send-email1 #supplierPhone').html(order.phones)
                                                    $('#modal-send-email1 #supplierFax').html(order.fax)
                                                    
                                                    $('#modal-send-email1 #orderLines').empty()
                                                   

                                                    var existsText = false;
                                                    $.each(orderLines, function(index, elem){
                                                        if(elem['texts'].length > 0){
                                                            existsText = true;
                                                        }
                                                    })
        
                                                    if(existsText){
                                                        $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                        '   <thead>' +
                                                                                                        '       <tr>' +
                                                                                                        '           <th class="centered">Cantidad</th>' +
                                                                                                        '           <th class="centered">Producto</th>' +
                                                                                                        '           <th class="centered">Modelo</th>' +
                                                                                                        '           <th class="centered">Textos</th>' +
                                                                                                        '       </tr>' +
                                                                                                        '   </thead>' +
                                                                                                        '   <tbody></tbody>' +
                                                                                                        '</table>')
                                                    }else{
                                                        $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                        '   <thead>' +
                                                                                                        '       <tr>' +
                                                                                                        '           <th class="centered">Cantidad</th>' +
                                                                                                        '           <th class="centered">Producto</th>' +
                                                                                                        '           <th class="centered">Modelo</th>' +
                                                                                                        '       </tr>' +
                                                                                                        '   </thead>' +
                                                                                                        '   <tbody></tbody>' +
                                                                                                        '</table>') 
                                                    }
        
                                                    $.each(orderLines, function(index, elem){
                                                        if(existsText){
        
                                                            var texts = ""
                                                            $.each(elem['texts'], function(index, elem){
                                                                texts += '<p>'+elem.value+'</p>'
                                                            })
        
                                                            $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                            '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                            '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                            '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                            '   <td class="centered">' + texts + '</td>' +
                                                                                                            '</tr>')
                                                        }else{
                                                            $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                            '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                            '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                            '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                            '</tr>')
                                                        }
                                                    })

                                                    gender = ''
                                                    if(order.deceasedGender == 'Hombre'){
                                                        gender = 'D. '
                                                    }else{
                                                        gender = 'Dña. '
                                                    }
                                                    $('#modal-send-email1 #deceased').html(gender + order.deceasedName + ' ' + order.deceasedSurname)
                                                    $('#modal-send-email1 #expedient').html(order.number)
                                                    if(order.deliveryPlace == null){
                                                        $('#modal-send-email1 #deliveryPlace').html(order.otherDeliveryPlace)
                                                    }else{
                                                        $('#modal-send-email1 #deliveryPlace').html(order.deliveryPlaceName)
                                                    }

                                                    if(order.deceasedRoom != null){
                                                        $('#modal-send-email1 #deliveryPlace').append( ', Sala Nº: ' + order.deceasedRoom)
                                                    }

                                                    if(order.deliveryDate != null){
                                                        $('#modal-send-email1 #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                                        if(moment(order.deliveryDate, 'X').format('HH:mm') != '00:00'){
                                                            $('#modal-send-email1 #deliveryTime').html(moment(order.deliveryDate, 'X').format('HH:mm'))
                                                        }else{
                                                            $('#modal-send-email1 #deliveryTime').html('-')
                                                        }
                                                    }
                                                    $('#modal-send-email1 #notes').html(order.notes)
                                                    $('#modal-send-email1 #send').html(order.mail)

                                                    if(order.sentEmail == 1){
                                                        $('#modal-send-email1 #sentEmail').html('El correo ya ha sido enviado')
                                                    }else{
                                                        $('#modal-send-email1 #sentEmail').html('')
                                                    }
                                                    
                                                    $('#modal-send-email1').modal('show')
                                                },
                                                error : function(){
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                    setTimeout(function(){
                                                        $('#block-message').empty()
                                                    }, 5000)
                                                }
                                            })
                                        })

                                        window.open(uri + 'almacen/pedidos/' + orderID)

                                        // Crear PDF
                                        $('#genPDF1' + elem.supplierID).click(function(){
                                            var order = orderID
                                            var text;
                                            //window.open(uri + 'documento/nuevo/' + order + '/pedido', '_blank');
                                            $.ajax({
                                                url: uri + 'core/libraries/pdfs/getPdfs.php',
                                                data: {doc: 'pedido', text: text, service: order, data: ""},
                                                type: 'POST',
                                                async: false,            
                                                success: function (data) {
                                                    text = data;
                                                    $.ajax({
                                                        url: uri + 'core/libraries/pdfs/process.php',
                                                        data: {text : text, doc : 'pedido', expedientID: 0},
                                                        type: 'POST',
                                                        async: false,            
                                                        success: function (data) {
                                                            window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/pedido.pdf', '_blank')
                                                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                                                    
                                                        setTimeout(function(){
                                                            $('#block-message').empty()
                                                        }, 5000)
                                                        }
                                                    });
                                                }
                                            });
                                        })
                                    }else{
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

                        })

                        // VER PEDIDO
                        if(elem.orderID == null){
                            $('#viewOrder1' + elem.supplierID).prop('disabled', true)
                            $('#sentEmail1' + elem.supplierID).prop('disabled', true)
                            $('#genPDF1' + elem.supplierID).prop('disabled', true)
                        }else{                           
                            $('#genPDF1' + elem.supplierID).prop('disabled', false)
                            $('#newOrder1' + elem.supplierID).prop('disabled', true)
                            $('#newOrder1' + elem.supplierID).html('Pedido realizado');
                            $('#newOrder1' + elem.supplierID).removeClass('btn-danger');
                            $('#newOrder1' + elem.supplierID).addClass('btn-success');

                            $('#viewOrder1' + elem.supplierID).click(function(){
                                window.open(uri + 'almacen/pedidos/' + elem.orderID) 
                            })

                            // ENVIAR CORREO
                            $('#sentEmail1' + elem.supplierID).click(function(){
                               
                                $.ajax({
                                    url : uri + 'core/orders/functions.php',
                                    method : 'POST',
                                    data : {
                                        type : 'getInfo',
                                        order : elem.orderID
                                    },
                                    async: false,
                                    success : function(data){
                                        data = $.parseJSON(data)
                                        
                                        var order = data[0]
                                        var orderLines = data[1]

                                        $('#modal-send-email1 #orderID').val(order.ID)
                                        $('#modal-send-email1 #number').html(order.ID)
                                        $('#modal-send-email1 #date').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                        $('#modal-send-email1 #supplierName').html(order.supplierName)
                                        $('#modal-send-email1 #supplierID').html(elem.supplierID)
                                        $('#modal-send-email1 #supplierPhone').html(order.phones)
                                        $('#modal-send-email1 #supplierFax').html(order.fax)
                                        
                                        $('#modal-send-email1 #orderLines').empty()

                                        var existsText = false;
                                        $.each(orderLines, function(index, elem){
                                            if(elem['texts'].length > 0){
                                                existsText = true;
                                            }
                                        })

                                        if(existsText){
                                            $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                            '   <thead>' +
                                                                                            '       <tr>' +
                                                                                            '           <th class="centered">Cantidad</th>' +
                                                                                            '           <th class="centered">Producto</th>' +
                                                                                            '           <th class="centered">Modelo</th>' +
                                                                                            '           <th class="centered">Textos</th>' +
                                                                                            '       </tr>' +
                                                                                            '   </thead>' +
                                                                                            '   <tbody></tbody>' +
                                                                                            '</table>')
                                        }else{
                                            $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                            '   <thead>' +
                                                                                            '       <tr>' +
                                                                                            '           <th class="centered">Cantidad</th>' +
                                                                                            '           <th class="centered">Producto</th>' +
                                                                                            '           <th class="centered">Modelo</th>' +
                                                                                            '       </tr>' +
                                                                                            '   </thead>' +
                                                                                            '   <tbody></tbody>' +
                                                                                            '</table>') 
                                        }

                                        $.each(orderLines, function(index, elem){
                                            if(existsText){

                                                var texts = ""
                                                $.each(elem['texts'], function(index, elem){
                                                    texts += '<p>'+elem.value+'</p>'
                                                })

                                                $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                '   <td class="centered">' + texts + '</td>' +
                                                                                                '</tr>')
                                            }else{
                                                $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                '</tr>')
                                            }
                                        })

                                        gender = ''
                                        if(order.deceasedGender == 'Hombre'){
                                            gender = 'D. '
                                        }else{
                                            gender = 'Dña. '
                                        }
                                        $('#modal-send-email1 #deceased').html(' ' + gender + ' ' + order.deceasedName + ' ' + order.deceasedSurname)
                                        $('#modal-send-email1 #expedient').html(order.number)
                                      
                                        if(order.deliveryPlace == null){
                                            $('#modal-send-email1 #deliveryPlace').html(order.otherDeliveryPlace)
                                        }else{
                                            $('#modal-send-email1 #deliveryPlace').html(order.deliveryPlaceName)
                                        }

                                        if(order.deceasedRoom != null){
                                            $('#modal-send-email1 #deliveryPlace').append( ', Sala Nº: ' + order.deceasedRoom)
                                        }

                                        if(order.deliveryDate != null){
                                            $('#modal-send-email1 #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                            if(moment(order.deliveryDate, 'X').format('HH:mm') != '00:00'){
                                                $('#modal-send-email #deliveryTime').html(moment(order.deliveryDate, 'X').format('HH:mm'))
                                            }else{
                                                $('#modal-send-email #deliveryTime').html('-')
                                            }
                                        }
                                        $('#modal-send-email1 #notes').html(order.notes)
                                        $('#modal-send-email1 #send').html(order.mail)

                                        if(order.sentEmail == 1){
                                            $('#modal-send-email1 #sentEmail').html('El correo ya ha sido enviado')
                                        }else{
                                            $('#modal-send-email1 #sentEmail').html('')
                                        }
                                        
                                        $('#modal-send-email1').modal('show')
                                    },
                                    error : function(){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
                                    }
                                })
                            })

                            // Crear PDF
                            $('#genPDF1' + elem.supplierID).click(function(){
                                var order = elem.orderID;                            
                                var text;
                                $.ajax({
                                    url: uri + 'core/libraries/pdfs/getPdfs.php',
                                    data: {doc: 'pedido', text: text, service: order, data: ""},
                                    type: 'POST',
                                    async: false,            
                                    success: function (data) {
                                        text = data;
                                        $.ajax({
                                            url: uri + 'core/libraries/pdfs/process.php',
                                            data: {text : text, doc : 'pedido', expedientID: 0},
                                            type: 'POST',
                                            async: false,            
                                            success: function (data) {
                                                window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/pedido.pdf', '_blank')
                                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                                        
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                            }
                                        });
                                    }
                                });
                            })
                        }
                    }else{
                        if(elem.supplierID != supplierBtn){
                            //Nuevo Pedido - Proveedor 2 al ultimo
                            $('#newOrder1' + elem.supplierID).click(function(){
                                var orderID = 1
                                var linesTable = []
                                
                                $('#newOrder1' + elem.supplierID).closest('fieldset').find('table > tbody > tr').each(function(index, i){
                                    
                                    model = $(this).find('td.model')["0"].innerHTML
                                    amount = $(this).find('td.amount')["0"].innerHTML
                                    price = $(this).find('td.price')["0"].innerHTML
                                    
                                    linesTable.push([model, amount, price])
                                })
                                
                                var currentDate = moment(new Date()).format('X')
                                var deliveryDate = moment().add(1, 'days').format('X')

                                var deliveryPlace
                                $.ajax({
                                    url: uri + 'core/expedients/services/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getDeliveryPlace',
                                        expedient : expedientID,
                                    },
                                    async: false,
                                    success: function(data){
                                        try{
                                            data = $.parseJSON(data)
                                            deliveryPlace = data == null ? 0 : data
                                        }catch(e){
                                            deliveryPlace = 0
                                        }
                                    },
                                    error: function(){
                                        deliveryPlace = 0
                                    }
                                })

                                var deceasedRoom
                                $.ajax({
                                    url: uri + 'core/expedients/services/functions.php',
                                    method: 'POST',
                                    data: {
                                        type: 'getDeceasedRoom',
                                        expedient : expedientID,
                                    },
                                    async: false,
                                    success: function(data){
                                        try{
                                            data = $.parseJSON(data)
                                            deceasedRoom = data == null ? 'null' : data
                                        }catch(e){
                                            deceasedRoom = 'null'
                                        }
                                    },
                                    error: function(){
                                        deceasedRoom = 'null'
                                    }
                                })
                            
                                $.ajax({
                                    url : uri + 'core/warehouse/orders/create.php',
                                    method : 'POST',
                                    data : {
                                        preOrder: elem.preOrderID,
                                        supplier: elem.supplierID,
                                        expedient : expedientID,
                                        deliveryPlace : deliveryPlace,
                                        deceasedRoom: deceasedRoom,
                                        type : 0,
                                        date : currentDate,
                                        deliveryPlaceOther: '',
                                        deliveryDate : deliveryDate,
                                        notes : '',
                                        lines : linesTable
                                    },
                                    success : function(data){
                                        data = $.parseJSON(data)    
                                        if(data == 'deliveryPlace'){
                                            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No se ha podido crear el pedido porque no hay un lugar de entrega (casa mortuoria) asignado.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                            return false
                                        }                               
                                        orderID = data;
                                        if(data){
                                            $('#newOrder1' + elem.supplierID).prop('disabled', true)
                                            $('#newOrder1' + elem.supplierID).addClass('hide')
                                            $('#viewOrder1' + elem.supplierID).removeClass('hide')
                                            $('#sentEmail1' + elem.supplierID).prop('disabled', false)
                                            $('#viewOrder1' + elem.supplierID).prop('disabled', false)
                                            $('#genPDF1' + elem.supplierID).prop('disabled', false)
                                            $('#viewOrder1' + elem.supplierID).click(function(){
                                                window.open(uri + 'almacen/pedidos/' + data)
                                            })
                                        
                                            // ENVIAR CORREO
                                            $('#sentEmail1' + elem.supplierID).click(function(){
                                                $.ajax({
                                                    url : uri + 'core/orders/functions.php',
                                                    method : 'POST',
                                                    data : {
                                                        type : 'getInfo',
                                                        order : orderID
                                                    },
                                                    async: false,
                                                    success : function(data){
                                                        data = $.parseJSON(data)                                                   
                                                        var order = data[0]                                                    
                                                        var orderLines = data[1]
                                                        
                                                        $('#modal-send-email1 #orderID').val(order.ID)

                                                        $('#modal-send-email1 #number').html(order.ID)
                                                        $('#modal-send-email1 #date').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                                        $('#modal-send-email1 #supplierName').html(order.supplierName)
                                                        $('#modal-send-email1 #supplierID').html(elem.supplierID)
                                                        $('#modal-send-email1 #supplierPhone').html(order.phones)
                                                        $('#modal-send-email1 #supplierFax').html(order.fax)
                                                        
                                                        $('#modal-send-email1 #orderLines').empty()
                                                        
                                                        var existsText = false;
                                                        $.each(orderLines, function(index, elem){
                                                            if(elem['texts'].length > 0){
                                                                existsText = true;
                                                            }
                                                        })
            
                                                        if(existsText){
                                                            $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                            '   <thead>' +
                                                                                                            '       <tr>' +
                                                                                                            '           <th class="centered">Cantidad</th>' +
                                                                                                            '           <th class="centered">Producto</th>' +
                                                                                                            '           <th class="centered">Modelo</th>' +
                                                                                                            '           <th class="centered">Textos</th>' +
                                                                                                            '       </tr>' +
                                                                                                            '   </thead>' +
                                                                                                            '   <tbody></tbody>' +
                                                                                                            '</table>')
                                                        }else{
                                                            $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                            '   <thead>' +
                                                                                                            '       <tr>' +
                                                                                                            '           <th class="centered">Cantidad</th>' +
                                                                                                            '           <th class="centered">Producto</th>' +
                                                                                                            '           <th class="centered">Modelo</th>' +
                                                                                                            '       </tr>' +
                                                                                                            '   </thead>' +
                                                                                                            '   <tbody></tbody>' +
                                                                                                            '</table>') 
                                                        }
            
                                                        $.each(orderLines, function(index, elem){
                                                            if(existsText){
            
                                                                var texts = ""
                                                                $.each(elem['texts'], function(index, elem){
                                                                    texts += '<p>'+elem.value+'</p>'
                                                                })
            
                                                                $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                                '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                                '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                                '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                                '   <td class="centered">' + texts + '</td>' +
                                                                                                                '</tr>')
                                                            }else{
                                                                $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                                '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                                '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                                '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                                '</tr>')
                                                            }
                                                        })
                                                        gender = ''
                                                        if(order.deceasedGender == 'Hombre'){
                                                            gender = 'D. '
                                                        }else{
                                                            gender = 'Dña. '
                                                        }
                                                        $('#modal-send-email1 #deceased').html(gender + order.deceasedName + ' ' + order.deceasedSurname)
                                                        $('#modal-send-email1 #expedient').html(order.number)
                                                        if(order.deliveryPlace == null){
                                                            $('#modal-send-email1 #deliveryPlace').html(order.otherDeliveryPlace)
                                                        }else{
                                                            $('#modal-send-email1 #deliveryPlace').html(order.deliveryPlaceName)
                                                        }

                                                        if(order.deceasedRoom != null){
                                                            $('#modal-send-email1 #deliveryPlace').append( ', Sala Nº: ' + order.deceasedRoom)
                                                        }

                                                        if(order.deliveryDate != null){
                                                            $('#modal-send-email1 #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                                            if(moment(order.deliveryDate, 'X').format('HH:mm') != '00:00'){
                                                                $('#modal-send-email1 #deliveryTime').html(moment(order.deliveryDate, 'X').format('HH:mm'))
                                                            }else{
                                                                $('#modal-send-email1 #deliveryTime').html('-')
                                                            }
                                                        }
                                                        $('#modal-send-email1 #notes').html(order.notes)
                                                        $('#modal-send-email1 #send').html(order.mail)

                                                        if(order.sentEmail == 1){
                                                            $('#modal-send-email1 #sentEmail').html('El correo ya ha sido enviado')
                                                        }else{
                                                            $('#modal-send-email1 #sentEmail').html('')
                                                        }

                                                        $('#modal-send-email1').modal('show')
                                                    },
                                                    error : function(){
                                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                        setTimeout(function(){
                                                            $('#block-message').empty()
                                                        }, 5000)
                                                    }
                                                })
                                            })

                                            window.open(uri + 'almacen/pedidos/' + orderID)

                                            // Crear PDF
                                            $('#genPDF1' + elem.supplierID).click(function(){
                                                var order= orderID                                            
                                                var text;
                                                $.ajax({
                                                    url: uri + 'core/libraries/pdfs/getPdfs.php',
                                                    data: {doc: 'pedido', text: text, service: order, data: ""},
                                                    type: 'POST',
                                                    async: false,            
                                                    success: function (data) {
                                                        text = data;
                                                        $.ajax({
                                                            url: uri + 'core/libraries/pdfs/process.php',
                                                            data: {text : text, doc : 'pedido', expedientID: 0},
                                                            type: 'POST',
                                                            async: false,            
                                                            success: function (data) {
                                                                window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/pedido.pdf', '_blank')
                                                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                                                        
                                                            setTimeout(function(){
                                                                $('#block-message').empty()
                                                            }, 5000)
                                                            }
                                                        });
                                                    }
                                                });
                                            })
                                        }else{
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
                            })
                                                
                            // VER PEDIDO
                            if(elem.orderID == null){
                                $('#viewOrder1' + elem.supplierID).prop('disabled', true)
                                $('#sentEmail1' + elem.supplierID).prop('disabled', true)
                                $('#genPDF1' + elem.supplierID).prop('disabled', true)
                            }else{
                                
                                $('#genPDF1' + elem.supplierID).prop('disabled', false)
                                $('#newOrder1' + elem.supplierID).prop('disabled', true)
                                $('#newOrder1' + elem.supplierID).addClass('hide');
                                $('#viewOrder1' + elem.supplierID).removeClass('hide')
                                $('#viewOrder1' + elem.supplierID).prop('disabled', false)
                                $('#viewOrder1' + elem.supplierID).click(function(){
                                    window.open(uri + 'almacen/pedidos/' + elem.orderID) 
                                })
                                $('#sentEmail1' + elem.supplierID).prop('disabled', false)
        
                                // ENVIAR CORREO
                                $('#sentEmail1' + elem.supplierID).click(function(){
                                    $.ajax({
                                        url : uri + 'core/orders/functions.php',
                                        method : 'POST',
                                        data : {
                                            type : 'getInfo',
                                            order : elem.orderID
                                        },
                                        async: false,
                                        success : function(data){
                                            data = $.parseJSON(data)
                                            
                                            var order = data[0]
                                            var orderLines = data[1]
                                            
        
                                            $('#modal-send-email1 #orderID').val(order.ID)
                                            $('#modal-send-email1 #number').html(order.ID)
                                            $('#modal-send-email1 #date').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                            $('#modal-send-email1 #supplierName').html(order.supplierName)
                                            $('#modal-send-email1 #supplierID').html(elem.supplierID)
                                            $('#modal-send-email1 #supplierPhone').html(order.phones)
                                            $('#modal-send-email1 #supplierFax').html(order.fax)

                                            $('#modal-send-email1 #orderLines').empty()

                                           var existsText = false;
                                            $.each(orderLines, function(index, elem){
                                                if(elem['texts'].length > 0){
                                                    existsText = true;
                                                }
                                            })

                                            if(existsText){
                                                $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                '   <thead>' +
                                                                                                '       <tr>' +
                                                                                                '           <th class="centered">Cantidad</th>' +
                                                                                                '           <th class="centered">Producto</th>' +
                                                                                                '           <th class="centered">Modelo</th>' +
                                                                                                '           <th class="centered">Textos</th>' +
                                                                                                '       </tr>' +
                                                                                                '   </thead>' +
                                                                                                '   <tbody></tbody>' +
                                                                                                '</table>')
                                            }else{
                                                $('#modal-send-email1 #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                '   <thead>' +
                                                                                                '       <tr>' +
                                                                                                '           <th class="centered">Cantidad</th>' +
                                                                                                '           <th class="centered">Producto</th>' +
                                                                                                '           <th class="centered">Modelo</th>' +
                                                                                                '       </tr>' +
                                                                                                '   </thead>' +
                                                                                                '   <tbody></tbody>' +
                                                                                                '</table>') 
                                            }

                                            $.each(orderLines, function(index, elem){
                                                if(existsText){

                                                    var texts = ""
                                                    $.each(elem['texts'], function(index, elem){
                                                        texts += '<p>'+elem.value+'</p>'
                                                    })

                                                    $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                    '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                    '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                    '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                    '   <td class="centered">' + texts + '</td>' +
                                                                                                    '</tr>')
                                                }else{
                                                    $('#modal-send-email1 #orderLines tbody').append('<tr>' +
                                                                                                    '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                    '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                    '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                    '</tr>')
                                                }
                                            })
                                            
                                            gender = ''
                                            if(order.deceasedGender == 'Hombre'){
                                                gender = 'D. '
                                            }else{
                                                gender = 'Dña. '
                                            }
                                            $('#modal-send-email1 #deceased').html(gender + order.deceasedName + ' ' + order.deceasedSurname)
                                            $('#modal-send-email1 #expedient').html(order.number)
                                            if(order.deliveryPlace == null){
                                                $('#modal-send-email1 #deliveryPlace').html(order.otherDeliveryPlace)
                                            }else{
                                                $('#modal-send-email1 #deliveryPlace').html(order.deliveryPlaceName)
                                            }

                                            if(order.deceasedRoom != null){
                                                $('#modal-send-email1 #deliveryPlace').append( ', Sala Nº: ' + order.deceasedRoom)
                                            }

                                            if(order.deliveryDate != null){
                                                $('#modal-send-email1 #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                                if(moment(order.deliveryDate, 'X').format('HH:mm') != '00:00'){
                                                    $('#modal-send-email1 #deliveryTime').html(moment(order.deliveryDate, 'X').format('HH:mm'))
                                                }else{
                                                    $('#modal-send-email1 #deliveryTime').html('-')
                                                }
                                            }
                                            $('#modal-send-email1 #notes').html(order.notes)
                                            $('#modal-send-email1 #send').html(" " + order.mail)
        
                                            if(order.sentEmail == 1){
                                                $('#modal-send-email1 #sentEmail').html('El correo ya ha sido enviado')
                                            }else{
                                                $('#modal-send-email1 #sentEmail').html('')
                                            }
                                            
                                            $('#modal-send-email1').modal('show')
                                        },
                                        error : function(){
                                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                            setTimeout(function(){
                                                $('#block-message').empty()
                                            }, 5000)
                                        }
                                    })
                                })

                                // Crear PDF
                                $('#genPDF1' + elem.supplierID).click(function(){
                                    var order;
                                    var date;                                
                                    order = elem.orderID;
                                    

                                    var text;
                                    //window.open(uri + 'documento/nuevo/' + order + '/pedido', '_blank');
                                    $.ajax({
                                        url: uri + 'core/libraries/pdfs/getPdfs.php',
                                        data: {doc: 'pedido', text: text, service: order, data: ""},
                                        type: 'POST',
                                        async: false,            
                                        success: function (data) {
                                            text = data;
                                            $.ajax({
                                                url: uri + 'core/libraries/pdfs/process.php',
                                                data: {text : text, doc : 'pedido', expedientID: 0},
                                                type: 'POST',
                                                async: false,            
                                                success: function (data) {
                                                    window.open(uri + 'descargar-archivo?file=expedients/' + 0 + '/docs/pedido.pdf', '_blank');
                                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la financiación ha sido creado con éxito.</div>');
                                            
                                                setTimeout(function(){
                                                    $('#block-message').empty();
                                                }, 5000)
                                                }
                                            });
                                        }
                                    });
                                })
                            }
                        }
                    }

                    supplierBtn = elem.supplierID;
                })

                $('#modal-send-email #sendEmail').click(function(){
                    var orderID = $('#modal-send-email #orderID').val()
                    $.ajax({
                        url : uri + 'core/orders/functions.php',
                        method : 'POST',
                        data : {
                            type : 'sendEmail',
                            order : orderID,
                            expedient : expedientID,
                            notes : $('#modal-send-email #notes').text(),
                            sendCopy : $('#modal-send-email #sendCopy').val()
                        },
                        async: false,
                        success : function(data){
                            if(data){
                                $('.btn-orders').click()
                                $('#modal-send-email').modal('hide')
            
                                printOthers()
                            }
                        },
                        error : function(){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                })
            
                $('#modal-send-email1 #sendEmail1').click(function(){
                    var orderID = $('#modal-send-email1 #orderID').val()
                    var suppID = $('#modal-send-email1 #supplierID').text()
            
                    $.ajax({
                        url : uri + 'core/orders/functions.php',
                        method : 'POST',
                        data : {
                            type : 'sendEmail',
                            order : orderID,
                            expedient : expedientID,
                            notes : $('#modal-send-email1 #notes').val(),
                            sendCopy : $('#modal-send-email1 #sendCopy').val()
                        },
                        async: false,
                        success : function(data){
                            if(data){
                                //$('.btn-orders').click()
                                $('#modal-send-email1').modal('hide')
                                $('#sentEmail1' + suppID).prop('disabled', false)
                                $('#sentEmail1' + suppID).html('Correo enviado');
                                $('#sentEmail1' + suppID).removeClass('btn-danger');
                                $('#sentEmail1' + suppID).addClass('btn-success');                   
                            }
                        },
                        error : function(){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                })
            }
            // END PRINT OTHERS

            //------------------------------------------------------Productos sin pedido--------------------------------------------------------------------------------------------
            if(others[1] != null){
                var withoutOrders = others[1]

                $.each(withoutOrders, function(index, elem){
                    
                    var supplierPhone = elem.supplierPhone == null ? '-' : elem.supplierPhone
                    var supplierName = elem.supplierName == 'No proveedor' ? '-' : elem.supplierName

                    switch (elem.productID) {
                        case '76':
                        case '77':
                        case '54':
                        case '36':
                        case '108':
                        case '52':
                        case '53':
                        case '38':
                            supp = 'Reparto de esquelas'
                            supp = '<legend class="legendBottom"><span id="'+elem.modelID+'lbl" class="label label-primary labelLgExp"><strong>'+ supp + '</strong></span></legend>'
                            tablaHead = '        <tr>' +
                            '                       <th width="5%">Cantidad</th>' +
                            '                       <th width="15%">Producto</th>' +
                            '                       <th width="55%">Acciones</th>' +
                            '                   </tr>' 
                            tablaTh = '          <tr>' +
                            '                       <td width="5%">' + elem.amount + '</td>' +
                            '                       <td width="15%">' + elem.productName + '</td>' +
                            '                       <td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '"></td>' +                       
                            '                   </tr>'
                            break;

                        case '37': //Recordatorios
                            supp = 'Recordatorios'
                            supp = '<legend class="legendBottom"><span id="'+elem.modelID+'lbl" class="label label-primary labelLgExp"><strong>'+ supp + '</strong></span></legend>'
                            tablaHead = '        <tr>' +
                            '                       <th width="5%">Cantidad</th>' +
                            '                       <th width="15%">Producto</th>' +
                            '                       <th width="55%">Acciones</th>' +
                            '                   </tr>' 
                            tablaTh = '          <tr>' +
                            '                       <td width="5%">' + elem.amount + '</td>' +
                            '                       <td width="15%">' + elem.productName + '</td>' +
                            '                       <td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '"></td>' +                       
                            '                   </tr>'
                            break;

                        default:
                            supp = '<legend class="legendBottom"><span id="'+elem.modelID+'lbl" class="label label-primary labelLgExp"><strong>Proveedor: </strong> ' + supplierName + ' - <strong>Teléfono: </strong>' + supplierPhone + '</span></legend>'
                            tablaHead = '        <tr>' +
                            '                       <th width="5%">Cantidad</th>' +
                            '                       <th width="15%">Producto</th>' +
                            '                       <th width="15%">Modelo</th>' +
                            '                       <th width="10%">Textos</th>' +
                            '                       <th width="55%">Acciones</th>' +
                            '                   </tr>' 
                            tablaTh = '         <tr>' +
                            '                       <td width="5%">' + elem.amount + '</td>' +
                            '                       <td width="15%">' + elem.productName + '</td>' +
                            '                       <td width="15%">' + elem.modelName + '</td>' +
                            '                       <td width="10%" id="texts' + elem.modelID + '"></td>' +
                            '                       <td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '"></td>' +
                            '                   </tr>'
                            break;
                    }   
                    $('#othersSection').append( '   <fieldset>' +
                                                            supp  +
                                                '       <div class="table-responsive">' +
                                                '           <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
                                                '               <thead>' +
                                                tablaHead +
                                                '               </thead>' +
                                                '               <tbody>' +
                                                tablaTh +
                                                '               </tbody>' +
                                                '           </table>' +
                                                '       </div>' +
                                                '   </fieldset>')

                    if(elem.actions == null){
                        $('#actions' + elem.modelID).append('<p>-</p>')
                    }else{       
                        var countSuccess = 0;             
                        var countCheckbox = 0;          
                        $.each(elem.actions, function(index2, elem2){                        
                            switch(elem2.type){
                                case 'checkbox':
                                    if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                        othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                    }

                                    if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){
                                        if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '"> <label>' + elem2.label + '</label></div>')
                                        }else{
                                            countCheckbox++;
                                            checkboxItems++;
                                            redTittles.push('#'+elem.modelID+'lbl')
                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>')
                                        }                                    
                                    }else{
                                        $('#actions' + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>')                                   
                                        countSuccess++;
                                        countCheckbox++;
                                        checkboxItems++;
                                        checkboxTotal++
                                    }
                                break

                                case 'text':
                                    var inputValue
                                    if(elem2.value == '0'){
                                        inputValue = ''
                                    }else{
                                        inputValue = elem2.value
                                    }
                                    switch(elem.productID){
                                        case '76':
                                        case '77':
                                        case '54':
                                        case '36':
                                        case '108':
                                        case '52':
                                        case '53':
                                        case '38':
                                            
                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '" ></div>')
                                            // PICKERS
                                            $('.datepicker').datepicker({
                                                autoclose: true,  
                                                language: 'es',
                                                weekStart: 1,
                                                todayHighlight : true,forceParse: false
                                            })
                                            break
                    
                                        case '205':
                                            switch(elem2.action){
                                                case '39':                                                
                                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>')
                                                    // PICKERS
                                                    $('.datepicker').datepicker({
                                                        autoclose: true,  
                                                        language: 'es',
                                                        weekStart: 1,
                                                        todayHighlight : true,forceParse: false
                                                    })
                                                    break
                    
                                                case '40':                                                
                                                    $('#actions' + elem.modelID).append('<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>')
                                                    // PICKERS
                                                    $('.timepicker').timepicker({
                                                        showInputs: false,
                                                        showMeridian: false,
                                                        timeFormat: 'HH:mm',
                                                        defaultTime: false
                                                    })
                                                    break
                    
                                                default:   
                                                    if(elem2.label == 'Notas'){                                            
                                                        $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>')
                                                    }else{
                                                        if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:55px!important;text-align:center"></div>')
                                                        }else{
                                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width: 350px!important;"></div>')
                                                        }
                                                    }
                                                    break
                                            }                                        
                                            break
                                            
                                        default:      
                                            if(elem2.label == 'Notas'){                                  
                                                $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>')
                                            }else{
                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>')
                                                }else{
                                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:350px!important;"></div>')
                                                }
                                            }
                                            break
                                    }
                                    break
                                    
                                case 'select':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>')
                                    switch(elem2.action){
                                        case '14':
                                            $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                            $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                            $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                            break;
                                    }
                                    break

                                case 'link':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                    break
                                    
                                case 'button':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                    break

                                case 'staff':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>')
                                    
                                    var posts = null
                                    $.ajax({
                                        url: uri + 'core/products/functions.php',
                                        method: 'POST',
                                        data: {
                                            type: 'getPostForAction',
                                            actionID : elem2.action
                                        },
                                        async: false,
                                        success: function(data){
                                            try{
                                                data = $.parseJSON(data)
                    
                                                if(data != null){
                                                    posts = ''
                                                    $.each(data, function(index, i){
                                                        posts += i.idPost + ','
                                                    })
                                                    posts = posts.slice(0, -1)
                                                }
                                            }catch(e){}
                                        }
                                    })

                                    setTimeout(() => {
                                        $('[name="'+ elem.productID + '-' + elem2.action +'"]').select2({
                                            containerCssClass: 'select2-staff',
                                            language: langSelect2,
                                            placeholder: '--', //--
                                            allowClear: true,
                                            ajax: {
                                                url: uri + 'core/staff/data.php',
                                                dataType: 'json',
                                                delay: 250,
                                                data: function (params) {
                                                    return {
                                                        q: params.term || "",
                                                        p: posts,
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
                                    
                                        if(elem2.value != ""){
                                            $.ajax({
                                                url: uri+"core/staff/functions.php",
                                                data: {type: 'getStaffByID', ID: elem2.value},
                                                type: 'POST',
                                                async: false,
                                                success: function (data) {
                                                    data = $.parseJSON(data);
                                                    
                                                    if(data){
                                                        if ($('[name="'+ elem.productID + '-' + elem2.action +'"]').find("option[value='" + elem2.value + "']").length) {
                                                            $('[name="'+ elem.productID + '-' + elem2.action +'"]').val(elem2.value).trigger('change');
                                                        } else { 
                                                            // Creamos la nueva opción DOM para preseleccionarlo por defecto
                                                            var newOption = new Option(data[0].name + " " + data[0].surname, elem2.value, true, true);
                                                            //Lo añadimos al select
                                                            $('[name="'+ elem.productID + '-' + elem2.action +'"]').append(newOption).trigger('change');
                                                        }
                                                    }
                                                }
                                            });
                                        }                                   
                                    }, 250);
                                    break
                            }
                        })
                        
                        if(countCheckbox == countSuccess){
                            setTimeout(() => {
                                $('#'+elem.modelID+'lbl').removeClass('label-primary').addClass('label-success')
                            }, 500);
                        }
                    }

                    if(elem.texts == null){
                        $('#texts' + elem.modelID).append('<p>-</p>')
                    }else{
                        $.each(elem.texts, function(index2, elem2){
                            if(elem2.value == ""){
                                elem2.value = "-"
                            }
                            $('#texts' + elem.modelID).append('<p>' + elem2.value + '</p>')
                        })
                    }
                })
            }
            if(others[2] != null){
                var withoutOrders = others[2]

                $.each(withoutOrders, function(index, elem){
                    var supplierPhone = elem.supplierPhone == null ? '-' : elem.supplierPhone
                    var supplierName = elem.supplierName == 'No proveedor' ? '-' : elem.supplierName

                    supp = '<span id="'+elem.modelID+'lbl" class="label label-primary labelLgExp"><strong>Proveedor: </strong>' + supplierName + ' - <strong>Teléfono: </strong>' + supplierPhone +'</span>'
                    tablaHead = '        <tr>' +
                    '                       <th width="5%">Cantidad</th>' +
                    '                       <th width="15%">Producto</th>' +
                    '                       <th width="15%">Modelo</th>' +
                    '                       <th width="55%">Acciones</th>' +
                    '                   </tr>' 
                    tablaTh = '         <tr>' +
                    '                       <td width="5%">' + elem.amount + '</td>' +
                    '                       <td width="15%">' + elem.productName + '</td>' +
                    '                       <td width="15%">' + elem.modelName + '</td>' +
                    '                       <td width="55%" class="actions" id="actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '"></td>' +
                    '                   </tr>'
 
                    $('#othersSection').append( '   <fieldset>' +
                                                '      <legend class="legendBottom">' + supp + '</legend>' +
                                                '       <div class="table-responsive">' +
                                                '           <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
                                                '               <thead>' +
                                                                    tablaHead +
                                                '               </thead>' +
                                                '               <tbody>' +
                                                                    tablaTh +
                                                '               </tbody>' +
                                                '           </table>' +
                                                '       </div>' +
                                                '   </fieldset>')

                    if(elem.actions == null){
                        $('#actions' + elem.modelID).append('<p>-</p>')
                    }else{   
                        var countSuccess = 0;       
                        var countCheckbox = 0;                        
                        $.each(elem.actions, function(index2, elem2){                        
                            switch(elem2.type){
                                case 'checkbox':
                                    if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                        othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                    }

                                    if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){
                                        if(elem2.action == 6 || elem2.action == '6'){ //Check de no aplica
                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '"> <label>' + elem2.label + '</label></div>')
                                        }else{
                                            countCheckbox++;
                                            checkboxItems++;
                                            redTittles.push('#'+elem.modelID+'lbl')
                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>')
                                        }                                    
                                    }else{
                                        $('#actions' + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>')                                   
                                        countSucess++;
                                        countCheckbox++;
                                        checkboxItems++;
                                        checkboxTotal++
                                    }
                                    break

                                case 'text':
                                    var inputValue
                                    if(elem2.value == '0'){
                                        inputValue = ''
                                    }else{
                                        inputValue = elem2.value
                                    }

                                    switch(elem2.action){
                                        case '39':                                                
                                            $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>')
                                            // PICKERS
                                            $('.datepicker').datepicker({
                                                autoclose: true,  
                                                language: 'es',
                                                weekStart: 1,
                                                todayHighlight : true,forceParse: false
                                            })
                                            break
            
                                        case '40':                                                
                                            $('#actions' + elem.modelID).append('<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>')
                                            // PICKERS
                                            $('.timepicker').timepicker({
                                                showInputs: false,
                                                showMeridian: false,
                                                timeFormat: 'HH:mm',
                                                defaultTime: false
                                            })
                                            break
            
                                        default:
                                            if(elem2.label == 'Notas'){
                                                $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>')
                                            }else{
                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>')
                                                }else{
                                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:350px!important;"></div>')
                                                }
                                            }
                                            break
                                    }                       
                                break;
                                    
                                case 'select':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>')
                                    switch(elem2.action){
                                        case '14':
                                            $('select[itemType="recordatorio"]').append('<option value="0">--</option>')
                                            $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                            $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                            $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                        break;
                                    }
                                    break

                                case 'link':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                    break
                                    
                                case 'button':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                    break

                                case 'staff':
                                    $('#actions' + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>')
                                    
                                    var posts = null
                                    $.ajax({
                                        url: uri + 'core/products/functions.php',
                                        method: 'POST',
                                        data: {
                                            type: 'getPostForAction',
                                            actionID : elem2.action
                                        },
                                        async: false,
                                        success: function(data){
                                            try{
                                                data = $.parseJSON(data)
                    
                                                if(data != null){
                                                    posts = ''
                                                    $.each(data, function(index, i){
                                                        posts += i.idPost + ','
                                                    })
                                                    posts = posts.slice(0, -1)
                                                }
                                            }catch(e){}
                                        }
                                    })
                    
                                    setTimeout(() => {
                                        $('[name="'+ elem.productID + '-' + elem2.action +'"]').select2({
                                            containerCssClass: 'select2-staff',
                                            language: langSelect2,
                                            placeholder: '--', //--
                                            allowClear: true,
                                            ajax: {
                                                url: uri + 'core/staff/data.php',
                                                dataType: 'json',
                                                delay: 250,
                                                data: function (params) {
                                                    return {
                                                        q: params.term || "",
                                                        p: posts,
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
                                    
                                        if(elem2.value != ""){
                                            $.ajax({
                                                url: uri+"core/staff/functions.php",
                                                data: {type: 'getStaffByID', ID: elem2.value},
                                                type: 'POST',
                                                async: false,
                                                success: function (data) {
                                                    data = $.parseJSON(data);
                                                    
                                                    if(data){
                                                        if ($('[name="'+ elem.productID + '-' + elem2.action +'"]').find("option[value='" + elem2.value + "']").length) {
                                                            $('[name="'+ elem.productID + '-' + elem2.action +'"]').val(elem2.value).trigger('change');
                                                        } else { 
                                                            // Creamos la nueva opción DOM para preseleccionarlo por defecto
                                                            var newOption = new Option(data[0].name + " " + data[0].surname, elem2.value, true, true);
                                                            //Lo añadimos al select
                                                            $('[name="'+ elem.productID + '-' + elem2.action +'"]').append(newOption).trigger('change');
                                                        }
                                                    }
                                                }
                                            });
                                        }                                   
                                    }, 250);
                                break
                            }
                        })

                        if(countCheckbox == countSuccess){
                            setTimeout(() => {
                                $('#'+elem.preOrderID+'lbl').removeClass('label-primary').addClass('label-success')
                            }, 500);
                        }
                    }
                })
            }
        }
    }
   
    //Colocamos los legends necesarios a rojo
    var uniqueNames = [];
    $.each(redTittles, function(index, elem){
        if($.inArray(elem, uniqueNames) === -1){
            uniqueNames.push(elem);
        }
    });

    //Recorrer las acciones de los productos
    if(expedient.notApplyAll == 1){
        $('#notApplyAll').prop('checked', true);
        expedient.gravediggersNotApply = 1;
    }

    $('#notApplyAll').change(function(){
        if($(this).prop('checked')){
            $('#notApplyAll').prop('checked', true);
            $('#gravediggersNotApply').prop('checked', true);
            $('#gravediggersNotApply').val(1).trigger('change');

            //No aplica de los productos de la seccion de Otros   
            $('#othersSection').find('input[type=checkbox]').each(function(index, elem){
                var item = $(this)
                $.each(othersNotAplly, function(index2, elem2){
                    if(item.attr('id') == elem2){
                        item.prop('checked', true);
                    }
                })
            })
        }else{
            $('#notApplyAll').prop('checked', false);
            $('#gravediggersNotApply').prop('checked', false);
            $('#gravediggersNotApply').val(0).trigger('change');
            
            $('#othersSection').find('input[type=checkbox]').each(function(index, elem){
                var item = $(this)
                $.each(othersNotAplly, function(index2, elem2){
                    if(item.attr('id') == elem2){
                        item.prop('checked', false)
                    }
                })
            })
        }
    })

    $('#noAplicatedCheck').change(function(){
       
        $("#notApplyAll").attr('disabled', false);
        
        if($(this).prop('checked')){

            //SECCIÓN DE CURAS
            $('#priestTimeCheck').iCheck('check');
            $('#priestTimeCheckLabel').removeClass('c-red')
            $.each($('input.notifiedPriest'), function(index, elem){
                if($(this).prop('checked') == false){
                    $(this).click();
                }
            })

            //SECCIÓN DE CORO
            $.each($('input.notifiedChoir'), function(index, elem){
                if($(this).prop('checked') == false){
                    $(this).click();
                }
            })

            //SECCIÓN DE CAMPANEROS
            $.each($('input.notifiedBellringer'), function(index, elem){
                if($(this).prop('checked') == false){
                    $(this).click();
                }
            })
        
            //SECCIÓN DE ENTERRADOR
            $('#gravediggersChecked').iCheck('check');
            $('#gravediggersCheckText').removeClass('c-red')
            $.each($('input.notified'), function(index, elem){
                if($(this).prop('checked') == false){
                    $(this).click();
                }
            })

            $('#gravediggersCheckPrinted').prop('checked', true);
            $('#gravediggersCheckPrintedText').removeClass('c-red');
            $('#gravediggersCheckSigned').prop('checked', true);
            $('#gravediggersCheckSignedText').removeClass('c-red');

            if($("#notApplyAll").prop('checked') == false){
                $("#notApplyAll").click();
                $("#notApplyAll").attr('disabled', true)
            }
    
            $('.block-collapse').collapse('hide');
        }else{

            //SECCIÓN DE CURAS
            $('#priestTimeCheck').iCheck('uncheck');
            $('#priestTimeCheckLabel').addClass('c-red');
            $.each($('input.notifiedPriest'), function(index, elem){
                if($(this).prop('checked') == true){
                    $(this).click();
                }
            })

            //SECCIÓN DE CORO
            $.each($('input.notifiedChoir'), function(index, elem){
                if($(this).prop('checked') == true){
                    $(this).click();
                }
            })

            //SECCIÓN DE CAMPANEROS
            $.each($('input.notifiedBellringer'), function(index, elem){
                if($(this).prop('checked') == true){
                    $(this).click();
                }
            })

            //SECCIÓN DE ENTERRADOR
            $('#gravediggersChecked').iCheck('check');
            $('#gravediggersCheckText').addClass('c-red')
            $.each($('input.notified'), function(index, elem){
                if($(this).prop('checked') == true){
                    $(this).click();
                }
            })
            $('#gravediggersCheckPrinted').prop('checked', false);
            $('#gravediggersCheckPrintedText').addClass('c-red')
            $('#gravediggersCheckSigned').prop('checked', false);
            $('#gravediggersCheckSignedText').addClass('c-red')

            $("#notApplyAll").click();
            $('.block-collapse').collapse('show');
        }
    })

    $('input[name="deliverClothing"]').on('change', function() {
        if($(this).val() == 'NO'){
            $('input[name="revisedClothing"]').prop('disabled', true);
            $('#revisedClothing1').prop('checked', true);
        }else{
            $('input[name="revisedClothing"]').prop('disabled', false);
        }
    });

    var expedientData = getExpedient(expedientID)
    expedientStatus = expedientData.status;

    /************************************* INICIO CREMATORIUM DATA - NEW **************************************/

    $('#crematoriumData #crematoriumWhoProgramOven').select2({
        placeholder: 'Seleccione un técnico',
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

    $('#crematoriumData #crematoriumWhoDelivered').select2({
        placeholder: 'Seleccione un técnico',
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

    if(expedientData.cremation == '1'){
        $("#panelCrematorium").removeClass('hide');
    }

    if(expedientData.crematoriumProgramOven != null && parseInt(expedientData.crematoriumProgramOven) == 1){
        $("#crematoriumData #crematoriumProgramOven").prop('checked', true)
    }

    if(expedientData.crematoriumWhoProgramOven != null && expedientData.crematoriumWhoProgramOven != ''){
        var newOption = new Option(expedientData.crematoriumWhoProgramOvenName + ' ' + expedientData.crematoriumWhoProgramOvenSurname, expedientData.crematoriumWhoProgramOven, true, true);
        $('#crematoriumData #crematoriumWhoProgramOven').append(newOption).trigger('change');
    }else{
        $("#crematoriumData #crematoriumWhoProgramOven").val(null).trigger('change');
    }

    if(expedientData.crematoriumTechnicalName != null && expedientData.crematoriumTechnicalName != ''){
        $("#crematoriumData #crematoriumTechnical").val(expedientData.crematoriumTechnicalName + ' ' + expedientData.crematoriumTechnicalSurname);
    }

    if(expedientData.crematoriumWhoDelivered != null && expedientData.crematoriumWhoDelivered != ''){
        var newOption = new Option(expedientData.crematoriumWhoDeliveredName + ' ' + expedientData.crematoriumWhoDeliveredSurname, expedientData.crematoriumWhoDelivered, true, true);
        $('#crematoriumData #crematoriumWhoDelivered').append(newOption).trigger('change');
    }else{
        $("#crematoriumData #crematoriumWhoDelivered").val(null).trigger('change');
    }

    if(expedientData.authPlace != null && expedientData.authPlace != ''){
        $("#crematoriumData #authPlace").val(expedientData.authPlace);
    }

    var authDateAux = '';
    if(expedientData.authDate != null && expedientData.authDate != ''){
        authDateAux = moment(expedientData.authDate, 'X').format('DD/MM/YYYY');
    }
    if(expedientData.authTime != null && expedientData.authTime != ''){
        authDateAux += ' a las ' + moment(expedientData.authTime, 'X').format('HH:mm') + 'h.'
    }
    $("#crematoriumData #authDate").val(authDateAux);

    if(expedientData.crematoriumNotes != null && expedientData.crematoriumNotes != ''){
        $("#crematoriumData #crematoriumNotes").val(expedientData.crematoriumNotes);
    }
    
    if(expedientData.crematoriumControlDeliversAshes != null && parseInt(expedientData.crematoriumControlDeliversAshes) == 1){
        $("#crematoriumData #crematoriumControlDeliversAshes").prop('checked', true);

        $("#genPDFCrematorium").attr("disabled", false);
    }else{
        $("#genPDFCrematorium").attr("disabled", true);
    }

    if(expedientData.crematoriumFirstGenerateDocDate != null && expedientData.crematoriumFirstGenerateDocUser != null){

        var textInfo = 
            '   El documento ha sido generado por primera vez por el usuario <strong>' + expedientData.crematoriumFirstGenerateDocUser + '</strong>'+
            '   el día <strong>' + moment(expedientData.crematoriumFirstGenerateDocDate, 'X').format('DD/MM/YYYY') + '</strong> a las <strong>' + moment(expedientData.crematoriumFirstGenerateDocDate, 'X').format('HH:mm') + '</strong>'

        $("#crematoriumButtonsSection").append(
            '<button id="infoSummaryCremationDoc" type="button" class="btn btn-info" style="padding: 2px 9px!important;" data-toggle="popover" title="Información del documento" data-content="'+textInfo+'">'+
            '    <i class="fa fa-info"></i>'+
            '</button>'
        );

        $("#infoSummaryCremationDoc").popover({placement:"left", container: 'body', html: true})
    }

    if(parseInt(expedientData.crematoriumControlDeliversAshes) == 1 && parseInt(expedientData.crematoriumProgramOven) == 1){
        $("#cremationTitle").removeClass('label-primary').addClass('label-success');
    }
    
    // Crear PDF resumen cremacion
    $('#panelCrematorium #genPDFCrematorium').click(function(){

        var text;
        $.ajax({
            url: uri + 'core/libraries/pdfs/getPdfs.php',
            data: {doc: 'resumenCremacion', text: text, expedient: $("#expedientID").val()},
            type: 'POST',
            async: false,            
            success: function (data) {
                text = data;
                $.ajax({
                    url: uri + 'core/libraries/pdfs/process.php',
                    data: {text : text, doc : 'resumenCremacion', expedientID: $("#expedientID").val()},
                    type: 'POST',
                    async: false,            
                    success: function (data) {
                        window.open(uri + 'descargar-archivo?file=expedients/' + $("#expedientID").val() + '/docs/resumenCremacion.pdf', '_blank')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf del resumen de la creación ha sido creado con éxito.</div>');
                
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                    }
                });
            }
        });
    })

    /************************************* FIN CREMATORIUM DATA - NEW **************************************/

    $.ajax({
        url : uri + "core/expedients/docs/functions.php", //clientes
        data : {
            type: 'getClientsCompany'
        },
        type : 'POST',
        async : false,
        success : function(data){
            var clients = $.parseJSON(data)
            $('#clientText').append($('<option/>').val('').text(''))
            if(clients != null){
                clients.forEach(element => {                
                    $('#clientText').append($('<option />').val(element.name).text(element.name))                
                });
            }
        }
    })

    $('input[name="belongings"]').on('change', function() {
        if($(this).val() == 'SI'){
            $('#belongingsText').removeClass('hide');
        }else{
            $('#belongingsText').addClass('hide');
            $('#belongingsText').val('');
        }
    });
   
    $('input[name="accesories"]').on('change', function() {
        if($(this).val() == 'SI'){
            $('#accesoriesText').removeClass('hide');
        }else{
            $('#accesoriesText').addClass('hide');
            $('#accesoriesText').val('');
        }
    });

    $('input[name="reconstructive"]').on('change', function() {
        if($(this).val() == 'SI'){
            $('#reconstructiveText').removeClass('hide');
            $('#reconstructiveText').val('');
        }else{
            $('#reconstructiveText').addClass('hide');
        }
    });
  
    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------------- Guardar --------------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    function saveForm(){

        // Detalles del servicio
        var arriveTime
        $('#arriveTime').val() != "" ? arriveTime = $('#arriveTime').val() : arriveTime = 'null'
        var arriveDate
        $('#arriveDate').val() != "" ? arriveDate = moment($('#arriveDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : arriveDate = 'null'

        // Curas
        var priestTime
        $('#priestTime').val() != "" ? priestTime = $('#priestTime').val() : priestTime = 'null'
        var priestTimeCheck = $('#priestTimeCheck').prop('checked')
        var priestInspected = 0;
        if($('#priestInspected').prop('checked')){
            priestInspected = 1;
        }
        var priestPayed = 0;
        if($('#priestPayed').prop('checked')){
            priestPayed = 1;
        }
        var priestNotes = $('#priestNotes').val()

        // Coros
        var choir = $('#choir').val()
        if(choir == null){
            choir = "null"
        }

        // Notas
        // var notes = $('#notesSection #notes').val();
        var notes = '';

        // Sección - Otros
        var inputsCheck = $('.actions').find('input[type=checkbox]');
        var inputsText = $('.actions').find('input[type=text]');
        var textareaText = $('.actions').find('textarea');
        var selects = $('.actions').find('select');
        var others = [];

        inputsCheck.each(function(){
            if($(this).attr('id') != undefined){               
                var product = $(this).attr('id');
                var hiring = $(this).attr('hiring');
                
                if($(this).prop('checked')){
                    value = 1;
                }else{
                    value = 0;
                }
                
                var product = product.split(".")
                var model = product[0]
                var action = product[1]               
                others.push([model, action, value, hiring]);
            }
        })

        inputsText.each(function(){
            if($(this).attr('id') != undefined){               
                var product = $(this).attr('id');                
                var value = $(this).val();
                var hiring = $(this).attr('hiring');
                
                var product = product.split(".")
                var model = product[0]
                var action = product[1]               
                others.push([model, action, value, hiring]);
            }
        })

        textareaText.each(function(){
            if($(this).attr('id') != undefined){               
                var product = $(this).attr('id');                
                var value = $(this).val();
                var hiring = $(this).attr('hiring');
                
                var product = product.split(".")
                var model = product[0]
                var action = product[1]               
                others.push([model, action, value, hiring]);
            }
        })

        selects.each(function(){
            if($(this).attr('id') != undefined){               
                var product = $(this).attr('id');                
                var value = $(this).val();
                var hiring = $(this).attr('hiring');
                
                var product = product.split(".")
                var model = product[0]
                var action = product[1]               
                others.push([model, action, value, hiring]);
            }
        })

        // Otros
        var notApplyAll = $('#notApplyAll').prop('checked');
        var gravediggersCheckPrinted = $('#gravediggersCheckPrinted').prop('checked');
        var gravediggersCheckSigned = $('#gravediggersCheckSigned').prop('checked');
        var gravediggersNotApply = $('#gravediggersNotApply').prop('checked');

        //SUMMARY CREMATION
        var crematoriumProgramOven = 0;
        if($('#panelCrematorium #crematoriumProgramOven').prop('checked')){
            crematoriumProgramOven = 1;
        }
        var crematoriumWhoDelivered = $('#panelCrematorium #crematoriumWhoDelivered').val();
        var crematoriumWhoProgramOven = $('#panelCrematorium #crematoriumWhoProgramOven').val();
        var crematoriumNotes = $('#panelCrematorium #crematoriumNotes').val();
        var crematoriumControlDeliversAshes = 0;
        if($('#panelCrematorium #crematoriumControlDeliversAshes').prop('checked')){
            crematoriumControlDeliversAshes = 1;
        }

        var logsClean = logs.filter(function(valor, indiceActual, arreglo) {
            var indiceAlBuscar = arreglo.indexOf(valor);
            if(indiceActual === indiceAlBuscar){
                return true;
            }else {
                return false;
            }
        });

        flag = 0

        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            method : 'POST',
            data : {
                type: 'saveServiceExpedientTPV',
                expedientID : expedientID,
                arriveTime : arriveTime,
                priestTime : priestTime,
                priestTimeCheck : priestTimeCheck,
                priestInspected : priestInspected,
                priestPayed : priestPayed,
                priestNotes : priestNotes,
                choir : choir,
                notes: notes,
                gravediggersCheck : gravediggersCheck,
                gravediggersCheckPrinted : gravediggersCheckPrinted,
                gravediggersCheckSigned : gravediggersCheckSigned,
                gravediggersNotApply : gravediggersNotApply,
                notApplyAll: notApplyAll,
                logs: logsClean,
                crematoriumProgramOven: crematoriumProgramOven,
                crematoriumWhoProgramOven: crematoriumWhoProgramOven,
                crematoriumWhoDelivered: crematoriumWhoDelivered,
                crematoriumNotes: crematoriumNotes,
                crematoriumControlDeliversAshes: crematoriumControlDeliversAshes
            },
            async : false,
            success : function(data){
                if(!data){ flag++ }
            },
            error : function(){
                flag++
            }
        })

        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            method : 'POST',
            data : {
                type: 'updateOthersSection',
                expedientID: expedientID,
                products: others
            },
            async : false,
            success : function(data){
                if(!data){ flag++ }
            },
            error : function(){
                flag++
            }
        })

        if(flag == 0){
            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El servicio se ha modificado con éxito.</div>');
            setLogUpdate(expedientID)
        }else{
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
        }
        setTimeout(function(){
            $('#block-message').empty()
        }, 5000)
    }

    $('#saveForm').click(function(){
        saveForm()
        setTimeout(function(){
            window.location.reload()
        }, 500)
    });

    // Sección "Resumen"
    $('#summary').click(function(){
        var summary;
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {expedientID: expedientID, type: 'getSummary'},
            type: 'POST',
            async: false,
            success: function (data){
                summary = $.parseJSON(data);
                $('#formEditSummary #expedient').val(summary.expedientID)
                $('#formEditSummary #deceased').val(summary.deceasedName + ' ' + summary.deceasedSurname)
                $('#formEditSummary #route').val(summary.routeSummary)
                $('#formEditSummary #notes').val(summary.notesSummary)
                $('#formEditSummary #churchData').prop('checked', parseInt(summary.churchSummary))
                $('#formEditSummary #license').prop('checked', parseInt(summary.licenseSummary))
                $('#formEditSummary #receive').prop('checked', parseInt(summary.deliveryReceiptSummary))
            }
        });

        $('#modal-summary').modal('show');
    })

    function saveSummary(){
        var expedient = $('#formEditSummary #expedient').val()
        var route = $('#formEditSummary #route').val()
        var notes = $('#formEditSummary #notes').val()
        var churchSummary = $('#formEditSummary #churchData').prop('checked')
        var licenseSummary = $('#formEditSummary #license').prop('checked')
        var deliveryReceiptSummary = $('#formEditSummary #receive').prop('checked')
        var reminderSummary = $('#formEditSummary #reminder').prop('checked')

        $.ajax({
            url: uri + 'core/expedients/services/functions.php',
            method: 'POST',
            data: {
                type: 'setSummary',
                expedient: expedient,
                route: route,
                notes: notes,
                churchSummary: churchSummary,
                licenseSummary: licenseSummary,
                deliveryReceiptSummary: deliveryReceiptSummary,
                reminderSummary: reminderSummary
            },
            async: false,
            success: function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El resumen se ha modificado con éxito.</div>');
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
    }

    $('#formEditSummary #saveSummary').click(function(){
        saveSummary()
        $('#modal-summary').modal('hide');
    })

    $('#formEditSummary #pdfSummary').click(function(){
        saveSummary()

        var docName = 'resumenServicio';

        $.ajax({
            url: uri + "core/libraries/pdfs/getPdfs.php",
            data: {doc: docName, data: expedientID},
            type: 'POST',
            async: false,
            success: function (data){
                text = data;
            }
        });

        $.ajax({
            url: uri + "core/libraries/pdfs/process.php",
            data: {doc: docName, text: text},
            type: 'POST',
            async: false
        });

        window.open(uri + 'descargar-archivo?file=expedients/docs/' + docName +'.pdf', '_blank')
        
        $('#modal-summary').modal('hide');
    })

    /**
     * Acciones para los teléfonos: añadir y eliminar
     */
    $('#modal-new-gravedigger .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone(phone)){
            $('#modal-new-gravedigger .phone').val('')
            $('#modal-new-gravedigger .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-gravedigger .phones').hasClass('in')){
                $('#modal-new-gravedigger .phones').addClass('in')
            }
            $('#modal-new-gravedigger .phones .label .btn-remove').click(function(){
                $(this).parent('.label').remove()
            })
        }
    });

    $('#modal-new-gravedigger .phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

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

    /**
     * Modales. Acciones
     */
    $('#modal-new-priest').on('hidden.bs.modal', function (e) {
        $('#modal-new-priest input').val('');
        $('.phones').html('');
        if(!$('#modal-new-priest .phones').hasClass('in')){
            $('#modal-new-priest .phones').addClass('in');
        }
        $('#modal-new-priest .churches').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewData");
    });

    $('#modal-new-bellringer').on('hidden.bs.modal', function (e) {
        $('#modal-new-bellringer input').val('');
        $('.phones').html('');
        if(!$('#modal-new-bellringer .phones').hasClass('in')){
            $('#modal-new-bellringer .phones').addClass('in');
        }
        $('#modal-new-bellringer .churches').empty()
        $('#modal-new-bellringer #church').val('').trigger('change')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewData");
    });

    $('#modal-new-gravedigger').on('hidden.bs.modal', function (e) {
        $('#modal-new-gravedigger input').val('');
        $('.phones').html('');
        if(!$('#modal-new-gravedigger .phones').hasClass('in')){
            $('#modal-new-gravedigger .phones').addClass('in');
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $("#modal-new-gravedigger #cemetery").val('').trigger('change')
        $("#modal-new-gravedigger .cemeteries").empty()
        clean("formNewData");
    });

    $('#modal-new-choir').on('hidden.bs.modal', function (e) {
        $('#modal-new-choir input').val('');        
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)        
        clean("formNewData");
    });

    // COMPRUEBA SI HAY ALGUIEN MÁS EN ESTE EXPEDIENTE Y BLOQUEA LA PÁGINA A LOS DEMÁS USUARIOS
    var block = false
    setTimeout(function(){
        $.ajax({
            url: uri + 'core/tools/accessControl.php',
            method: 'POST',
            data: {
                action: 'checkSessionExpedient',
                path: window.location.pathname
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data != null){
                        $('#expedientBlocked').removeClass('hide')

                        $('#firstUser').html(data[0].name + ' ' + data[0].surname)

                        block = true

                        $('#saveForm').remove()
                        $('#backLink').remove()
                        // $('input').attr('readonly', true)
                        $('.btn-delete').attr('disabled', true)
                        $('select').attr('disabled', true)
                        $('textarea').attr('disabled', true)
                        $('#priestAdd').closest('div').find('a').remove()
                        $('#addGravedigger').closest('div').find('a').remove()
                        $(document).find('.removeClick').addClass('hide')
                        $('.fa.fa-pencil-square-o').addClass('c-grey')
                        $('.fa.fa-pencil-square-o').closest('div').removeClass('signDocument')

                        $('.fa.fa-trash').addClass('c-grey')
                        $('.fa.fa-trash').closest('a').removeClass('btn-delete')

                        $('.fa.fa-pencil').addClass('c-grey')
                        $('.fa.fa-pencil').closest('a').removeClass('btn-new')

                        $('.fa.fa-plus-circle').addClass('c-grey')
                        $('.fa.fa-plus-circle').closest('a').removeClass('btn-new')

                        setTimeout(() => {
                            $(".notifiedPriest").attr("disabled", true);
                            $(".notifiedBellringer").attr("disabled", true);
                            $(".notifiedChoir").attr("disabled", true);
                            $("#gravedigger-table .notified").attr("disabled", true);

                            $(".fa-plus-circle").parent().remove()
                            $(".btn-delete").remove()
                            $(".btn-danger").attr("disabled", true);
                            $(".fa-pencil").parent().remove()
                            // $(".fa-trash").parent().remove()
                            $("#cancelLink").attr("disabled", false);
                        }, 500);
                    }
                }catch(e){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        if(block){
            setInterval(function(){
                checkSessionExpedient(window.location.pathname)
            }, 3000)
        }
    }, 250)

    setTimeout(function(){
        //BLOCK EXPEDIENT IF IT IS FINISHED
        if(parseInt(expedientStatus) == 5){

            $('#expedientFinished').removeClass('hide')
            $('#saveForm').attr("disabled", true)
            $('input').attr('disabled', true)
            $('button').attr('disabled', true)
            $('#summary').attr('disabled', false)
            $('#dropUpUsers').attr('disabled', false)
            $('#dropUpChat').attr('disabled', false)
            $('#goToExpedient').attr('disabled', false)
            $('#exitExpedient').attr('disabled', false)
            $('#exitExpedient').attr('disabled', false)
            $('#backLink').attr("disabled", true)
            $('.btn-gotop').attr('disabled', false)
            $('select').attr('disabled', true)
            $('#getAllExpedients').attr('disabled', false)
            $('textarea').attr('disabled', true)
            $('.select2').select2({
                language: 'es',
                placeholder: '--'
            })
            $(".details-control").removeClass('removeClick')
            $('#priestAdd').closest('div').find('a').remove()
            $('#addGravedigger').closest('div').find('a').remove()
            $('#addCar').closest('div').find('a').remove()
            $(document).find('.removeClick').addClass('hide')
            $('.fa.fa-pencil-square-o').addClass('c-grey')
            $('.fa.fa-pencil-square-o').closest('div').removeClass('signDocument')

            $('.fa.fa-trash').addClass('c-grey')
            $('.fa.fa-trash').closest('a').removeClass('btn-delete')

            $('.fa.fa-pencil').addClass('c-grey')
            $('.fa.fa-pencil').closest('a').removeClass('btn-new')

            $('.fa.fa-plus-circle').addClass('c-grey')
            $('.fa.fa-plus-circle').closest('a').removeClass('btn-new')

            if(userType == 1){
                $("#reactived").attr('disabled', false)
                $("#reactived").removeClass('hide')
            }else{
                $("#expedientFinishedText").empty();
                $("#expedientFinishedText").text(' Solicite a un usuario administrador que lo reactive (su estado pasará a facturado) para realizar modificaciones.')
            }

            $("#noAplicated").addClass('hide')
            $("#noAplicated").attr('disabled', true)

            $('[type=checkbox]').attr("disabled", true)
            $(".order-actions .btn-primary").attr("disabled", false)
            $(".close").attr("disabled", false)
            $("#cancelLink").attr("disabled", false);
        }
    
        $('#reactived').click(function(){
            $.ajax({
                url: uri + 'core/expedients/expedient/functions.php',
                method: 'POST',
                data: {
                    type: 'reactive',
                    expedientID: expedientID
                },
                async: false,
                success: function(data){
                    try{
                        if(data){
                            window.location.reload()
                        }
                    }catch(e){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        
        })
    }, 500)

    setTimeout(() => {
        if(checkboxItems == checkboxTotal){
            $("#othersTitle").removeClass('label-primary').addClass('label-success')
        }
    }, 200);

    $(':checkbox').change(function(){
      tr = $(this).parent().parent().siblings() 
      
      checkboxValue = $(this).prop('checked')
      checkBoxName = $(this).siblings().text()
      product = "", model = "";
      $.each(tr, function(index, elem) {
            if(index == 1){
                product = $(this).text();
            }
            if(index == 2){
                model =  $(this).text();
            }
        })

        if(product != ""){
            if(checkboxValue){
                if(model != ""){
                    logs.push('Ha seleccionado ' + checkBoxName + ' del producto ' + product + ' con modelo ' + model)
                }else{
                    logs.push('Ha seleccionado ' + checkBoxName + ' del producto ' + product)
                }
            }else{
                if(model != ""){
                    logs.push('Ha deseleccionado ' + checkBoxName + ' del producto ' + product + ' con modelo ' + model)
                }else{
                    logs.push('Ha deseleccionado ' + checkBoxName + ' del producto ' + product)
                }
            }
        }else{
            title = $(this).parent().parent().parent().parent().parent().parent().siblings().text()
            if(checkboxValue){
                logs.push('Ha seleccionado ' + checkBoxName + ' de la sección ' + title)
            }else{
                logs.push('Ha deseleccionado ' + checkBoxName + ' de la sección ' + title)
            }
        }
    })
})

/**
 * Comprueba si el expediente está libre para poder acceder a él
 * 
 * @param {string} path Ruta
 */
function checkSessionExpedient(path){
    $.ajax({
        url: uri + 'core/tools/accessControl.php',
        method: 'POST',
        data: {
            action: 'checkSessionExpedient',
            path: path
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)
                if(data == null){
                    window.location.reload()
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
}

/**
 * Devuelve información sobre el expediente
 * 
 * @param {int} expedientID expedientID
 */
function getExpedient(expedientID) {
    var expedient;
    $.ajax({
        url : uri+"core/expedients/expedient/read.php",
        data : {
            ID: expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            expedient = $.parseJSON(data)[0];
        }
    })
    return expedient;
}

/* ****************************** Draw notes section ****************************** */
var focusedNote = null
var currentNoteValue = ''
/**
 * Draws notes
 */
function drawNotes(expedientID){
    // NOTAS
    $.ajax({
        url: uri + 'core/expedients/services/functions.php',
        method: 'POST',
        data: {
            type: 'getNotesService',
            expedient: expedientID
        },
        async: true,
        success: function(data){
            try{
                data = $.parseJSON(data);
                $('#notesThreadSection').empty();

                var disabled = '';
                if(!$("#expedientFinished").hasClass('hide')){
                    disabled = 'disabled';
                }

                // Draw notes
                var html =
                    '   <button type="button" class="btn btn-primary" id="newNoteThread" '+disabled+'>Nueva nota</button> <span>Antes de guardar una nota nueva, deberá guardar las anteriores ya creadas si las ha modificado para no perder su contenido.</span>' +
                    '   <br><br>'

                $.each(data[0], function(index, elem){
                    var ownerButtons =
                        '   <button type="button" class="btn btn-primary update-note" style="margin-left:1em" note-id="' + elem.id + '" '+disabled+'>Editar</button>' +
                        '   <button type="button" class="btn btn-danger delete-note" style="margin-left:0.5em" note-id="' + elem.id + '" '+disabled+'>Eliminar</button>' +
                        '   <button type="button" class="btn btn-primary save-note hide" style="margin-left:1em" note-id="' + elem.id + '" '+disabled+'>Guardar</button>' +
                        '   <button type="button" class="btn btn-secondary cancel-edit-note hide" style="margin-left:0.5em" note-id="' + elem.id + '" '+disabled+'>Cancelar</button>'

                    var date = null
                    if(elem.create_date != null || elem.update_date != null){
                        date = moment((elem.update_date == null ? elem.create_date : elem.update_date), 'X')
                    }else{
                        date = '';
                    }

                    let rows = 1;
                    if(elem.note.length / 160 > 1){
                        rows = parseInt(elem.note.length / 160) + 1;
                    }
                        
                    html +=
                        '   <div style="margin-bottom: 1.5em;" id="section-note-' + elem.id + '">' +
                        '       <div style="display:flex;align-items:center">'+
                        '           <textarea class="form-control notesThread" style="font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;" id="notesThread' + elem.id + '" cols="160" rows="'+rows+'" placeholder="Escriba sus observaciones en este apartado..." disabled>' + elem.note + '</textarea>' +
                                    (data[1] == elem.user ? ownerButtons : '') +
                        '        </div>'+
                        '       <span>Escrita por ' + elem.user_name + (date != '' ? ' el ' + date.format('DD/MM/YYYY') + ' a las ' + date.format('HH:mm:ss') : '') + '</span>' +
                        '   </div>'
                })
                $('#notesThreadSection').append(html)

                setTimeout(() => {
                    $('textarea.notesThread').each(function(){
                        var elem = $(this)
    
                        // Auto resize
                        elem[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                        elem[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + elem[0].scrollHeight + 'px!important';
    
                        elem.keydown(function(){
                            currentNoteValue = elem.val()
                        })
    
                        elem.keyup(function(e){
                            elem[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                            elem[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + elem[0].scrollHeight + 'px!important';
                            
                            // Users select
                            if(elem[0].value.slice(-2) == ' @'){
                                $('#modal-users-notes-thread').modal('show')
                                elem.attr('disabled', true)
                            }
    
                            // Current focus
                            focusedNote = elem
                        })
                    })
                }, 250);


                // Update note
                $('.update-note').click(function(){
                    var id = $(this).attr('note-id')
                    $('#notesThread' + id).attr('disabled', false).focus()
                    $(this).addClass('hide')
                    $('.save-note[note-id="' + id + '"]').removeClass('hide')
                    $('.cancel-edit-note[note-id="' + id + '"]').removeClass('hide')
                    $('.delete-note[note-id="' + id + '"]').addClass('hide')
                })

                // Delete note
                $('.delete-note').click(function(){
                    var id = $(this).attr('note-id')
                    if(confirm('¿Estás seguro de que deseas eliminar esta nota?')){
                        // Ajax delete
                        $.ajax({
                            url: uri + 'core/expedients/notes/functions.php',
                            method: 'POST',
                            data: {
                                type: 'deleteNote',
                                id: id
                            },
                            async: false,
                            success: function(){
                                $('#section-note-' + id).remove()
                            }
                        })   
                    }
                })

                // Save note
                $('.save-note').click(function(){
                    var id = $(this).attr('note-id')
                    var value = $('#notesThread' + id).val()

                    var users = []
                    if(value.indexOf(' @') != -1){
                        $.each(value.split(' @'), function(index, elem){
                            if(elem != ''){
                                users.push(elem.split(' ')[0])
                            }
                        })
                    }

                    // Ajax save
                    $.ajax({
                        url: uri + 'core/expedients/notes/functions.php',
                        method: 'POST',
                        data: {
                            type: 'updateNote',
                            id: id,
                            value: value,
                            users: users
                        },
                        async: false,
                        success: function(){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La nota se ha actualizado con éxito.</div>');
                            $('.save-note[note-id="' + id + '"]').addClass('hide')
                            $('.cancel-edit-note[note-id="' + id + '"]').addClass('hide')
                            $('.update-note[note-id="' + id + '"]').removeClass('hide')
                            $('.delete-note[note-id="' + id + '"]').removeClass('hide')
                            $('#notesThread' + id).attr('disabled', true)
                        }
                    })   
                })

                $(".cancel-edit-note").click(function(){

                    var id = $(this).attr('note-id')

                    $('.save-note[note-id="' + id + '"]').addClass('hide')
                    $('.cancel-edit-note[note-id="' + id + '"]').addClass('hide')
                    $('.update-note[note-id="' + id + '"]').removeClass('hide')
                    $('.delete-note[note-id="' + id + '"]').removeClass('hide')
                    $('#notesThread' + id).attr('disabled', true)
                })

                // Create note
                $('#newNoteThread').click(function(){
                    var html =
                        '   <div style="margin-bottom: 1.5em;" id="section-note-new">' +
                        '       <div style="display:flex;align-items:center">'+
                        '           <textarea class="form-control notesThread" style="font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;" id="notesThreadNew" cols="160" rows="1" placeholder="Escriba sus observaciones en este apartado..."></textarea>' +
                        '           <button type="button" class="btn btn-primary" id="save-note-new" style="margin-left:1em">Guardar</button>' +
                        '           <button type="button" class="btn btn-secondary" id="cancel-note-new" style="margin-left:0.5em">Cancelar</button>' +
                        '        </div>'+
                        '       <span>Escrita por ' + user[0].name +
                        '   </div>'

                    $('#notesThreadSection').append(html)

                    $('#newNoteThread').attr('disabled', true)
                    
                    $('html, body').animate({
                        scrollTop: $("#notesThreadNew").offset().top
                    }, 500);

                    // Auto resize
                    $('#notesThreadNew').keydown(function(){
                        currentNoteValue = $('#notesThreadNew').val()
                    })

                    $('#notesThreadNew').keyup(function(e){
                        $('#notesThreadNew')[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                        $('#notesThreadNew')[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + $('#notesThreadNew')[0].scrollHeight + 'px!important';
                        
                        // Users select
                        if($('#notesThreadNew').val().slice(-2) == ' @'){
                            $('#modal-users-notes-thread').modal('show')
                            $('#notesThreadNew').attr('disabled', true)
                        }

                        // Current focus
                        focusedNote = $('#notesThreadNew')
                    })

                    $('#save-note-new').keyup(function(e){
                        $('#save-note-new')[0].style.cssText = 'font-size:15px;font-weight:600;height:auto; padding:0';
                        $('#save-note-new')[0].style.cssText = 'font-size:15px;font-weight:600;overflow:hidden!important;display:block!important;resize: none!important;height:' + $('#save-note-new')[0].scrollHeight + 'px!important';
                        
                        // Users select
                        if($('#save-note-new').val().slice(-2) == ' @'){
                            $('#modal-users-notes-thread').modal('show')
                            $('#save-note-new').attr('disabled', true)
                        }

                        // Current focus
                        focusedNote = $('#notesThreadNew')
                    })

                    $('#save-note-new').click(function(){
                        var value = $('#notesThreadNew').val()

                        var users = []
                        if(value.indexOf(' @') != -1){
                            $.each(value.split(' @'), function(index, elem){
                                if(elem != ''){
                                    users.push(elem.split(' ')[0])
                                }
                            })
                        }

                        // Ajax save
                        $.ajax({
                            url: uri + 'core/expedients/notes/functions.php',
                            method: 'POST',
                            data: {
                                type: 'createNote',
                                note: value,
                                expedient: $('#formCService #expedientID').val(),
                                section: 1,
                                users: users
                            },
                            async: false,
                            success: function(){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La nota se ha creado con éxito.</div>');
                                drawNotes($('#formCService #expedientID').val())
                            }
                        })
                    })

                    $("#cancel-note-new").click(function(){
                        drawNotes($('#formCService #expedientID').val())
                    })

                })
            }catch(e){}
        }
    })
}
/* ****************************** Draw notes section ****************************** */