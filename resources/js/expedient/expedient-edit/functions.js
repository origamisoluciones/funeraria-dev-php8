/**  @var {array} invoiceInfo Store expedient invoice info */
var invoiceInfo = [];

/**  @var {int} expedientStatus Store expedient status */
var expedientStatus = null;

/**  @var {array} provincesList Store provinces in select2 format to load */
var provincesList = null;

/**  @var {string} changeTabRef Store url to change pre save */
var changeTabRef = null;

/**  @var {boolean} changeTab Store if is a change expedient tab */
var changeTab = true;

/**  @var {array} attachSmokeFile Store smoke oppacity file to upload */
var attachSmokeFile = null;

/**  @var {string} attachSmokeFileName Store smoke oppacity file name to upload */
var attachSmokeFileName = null;

/**  @var {string} attachDeleteSmokeFileName Store smoke oppacity file name to delete */
var attachDeleteSmokeFileName = null;

/** @var {int} _URL URL for virtual upload image to get resolution */
_URL = window.URL || window.webkitURL;

/**  @var {int} defaultTrazabilityID Store trazability id to evaluate if the users change it */
var defaultTrazabilityID = null;

/**  @var {boolean} firstTimeLoad Store first time load */
var firstTimeLoad = true;

/**  @var {boolean} currentMortuary Store current mortuary */
var currentMortuary = null;

/**  @var {boolean} currentTellmebyeRoom Store current tellmebye room */
var currentTellmebyeRoom = null;

/**  @var {boolean} hasChanges Store if expedient has changes */
var hasChanges = false;

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
 * Obtiene los datos de una tarifa
 * 
 * @param {int} priceID Price id
 * @return {array} price Datos de la tarifa
 */
function getParticularPrice() {
    var price;
    $.ajax({
        url: uri+"core/prices/functions.php",
        data: {type: 'getParticularPrice'},
        type: 'POST',
        async: false,
        success: function (data) {
            price = $.parseJSON(data);
        }
    });
    return price;
}

/**
 * Gets differents expedients status
 * 
 * @return {array}
 */
function getExpedientsStatus() {
    var status
    $.ajax({
        url : uri+'core/expedients/expedient/functions.php',
        data : {type: 'getExpedientStatus'},
        type : 'POST',
        async : false,
        success : function(data){
            status = $.parseJSON(data);
        }
    })
    return status;
}

/**
 * Gets funeral homes
 * 
 * @param {int} funeralHomeID Funeral home id
 * @return {array}
 */
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

/**
 * Gets provinces
 * 
 * @return {array}
 */
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
 * Gets current expedient info
 * 
 * @param {int} expedientID Expedient id
 * @return {array}
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

/**
 * Gets location info
 * 
 * @param {int} locationID Location id
 * @return {array}
 */
function getLocation(locationID) {
    var location;
    $.ajax({
        url: uri+"core/locations/functions.php",
        data: {locationID: locationID, type: 'getLocationsByID'},
        type: 'POST',
        async: false,
        success: function (data) {
            location = $.parseJSON(data);
        }
    });
    return location;
}

/**
 * Gets client info by expedient id
 * 
 * @param {int} expedientID expedientID id
 * @return {array}
 */
function getClient(expedientID) {
    var client;
    $.ajax({
        url: uri + "core/expedients/expedient/functions.php",
        data: {expedientID: expedientID, type: 'getClient'},
        type: 'POST',
        async: false,
        success: function (data) {
            client = $.parseJSON(data);
            if(client != null){
                client = client[0];
            }
        }
    });
    return client;
}

/**
 * Gets niches
 * 
 * @return {array}
 */
function getNiches(){
    var niches
    $.ajax({
        url: uri+'core/niches/functions.php',
        data: {
            type: 'getNiches'
        },
        type: 'POST',
        async: false,
        success: function(data){
            niches = $.parseJSON(data)
        }
    })
    return niches
}

/**
 * Comprueba si ya hay una cremación para una fecha dada
 * 
 * @param {int} start Fecha de inicio
 * @param {int} end Fecha de fin
 * @returns {boolean}
 */
function checkCremationBusy(start, end, expedient, crematorium){
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
 * Formats result for select2
 * 
 * @param {array} data Select option info
 * @return {string}
 */
function formatDataClient(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
}

/**
 * Gets active expedients
 * 
 * @return {array}
 */
function getActiveExpedients(){
    var response = null

    $.ajax({
        url: uri + 'core/expedients/expedient/functions.php',
        method: 'POST',
        data: {
            type: 'getActiveExpedients'
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

/**
 * Gets expedient associate with this expedient
 * 
 * @param {array} expedientID Expedient id
 * @return {array}
 */
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
 * Gets if exists control emission file
 * 
 * @param {int} expedientID Expedient id
 */
function getControlEmissionFile(expedientID) {
    $.ajax({
        url : uri+"core/expedients/expedient/getFile.php",
        data : {
            expedientID: expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            var info = $.parseJSON(data);

            if(info != null && info.length > 0){
                $("#titleDocSmoke").text(info[0].name);
                $("#titleDocSmoke").attr("src", info[0].src)
                $("#fileAttachDoc").attr("disabled", true);
                $("#titleDocSmokeSection").removeClass('hide');
                attachSmokeFileName = info[0].name;
            }
        }
    })
}

/**
 * Checks upload control emissions doc (image)
 * 
 * @return {array} data Data
 */
function updateSmokeDocument(){

    var fileParam = (attachSmokeFile != null && attachSmokeFile.length > 0) ? attachSmokeFile[0] : null;
    var response = [true, null];

    var data = new FormData();
    data.append('archivo', fileParam);
    data.append('expedientID', $("#expedientID").val());
    data.append('docName', attachSmokeFileName);
    data.append('docNameToDelete', attachDeleteSmokeFileName);

    $.ajax({
        url: uri + "core/expedients/expedient/updateFile.php",
        type: 'POST',
        contentType: false,
        data: data,
        dataType: 'json',
        processData: false,
        cache: false,
        async: false,
        success: function(data){
            try{
                switch(data){
                    case true:
                        response = [true, null];
                    break
                    case false:
                        response = [false, null];
                    break
                    case 'extension':
                        response = [false, 'extension'];
                    break
                    default:
                        response = [false, null];
                    break
                }
            }catch(e){
                response = [false, null];
            }
        },
        error: function(){
            response = [false, null];
        }
    })

    return response;
}

/**
 * Comprueba si el expediente existe
 * 
 * @return bool
 */
function getCompany(){
    var check

    $.ajax({
        url: uri + 'core/settings/functions.php',
        method: 'POST',
        data: {type : 'getCompany'},
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
 * Gets tellmebye info by mortuary
 * 
 * @param {int} mortuary Mortuary
 * @return bool
 */
function getTellmebyeInfoByMortuary(mortuary){
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

$(function(){
    // TOOLBAR BOTTOM
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="cancelLink" class="btn btn-danger"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>');
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveForm" name="saveForm" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
    
    changeSpaceFooter()

    $('#exitExpedient').click(function() {              
        window.location.href = uri + 'expedientes'
    })

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
                changeTabRef = $(this).attr("href");
                saveForm()
            }
        }

        if(changeTab == false){
            e.preventDefault();
        }
    })

    //Pickers
    $('.time').timepicker({
        showInputs: false,
        showMeridian: false,
        defaultTime: false,
        timeFormat: 'HH:mm'
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

    var limit_page = 10;

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

    //Select sin cuadro de búsquedas
    $('.infinitySelect').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true,
        minimumResultsForSearch: Infinity
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

    //Obtenemos el id del expediente
    var expedientID = $('#formEditExpedient #expedientID').val();
    if(isExpedient(expedientID)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }

    var expedient = getExpedient(expedientID);

    expedientStatus = expedient.status;

    // Set expediente invoice info
    invoiceInfo['expedientType'] = expedient.type;

    // Hide cremation options if is a budget
    if(parseInt(expedient.type) != '2'){
        $("#cremationCheckSection").removeClass('hide');
    }
    
    invoiceInfo['client'] = null;
    if(expedient.client != null && expedient.client != ''){
        invoiceInfo['client'] = expedient.client;
    }
    
    invoiceInfo['invoice'] = null;
    invoiceInfo['numInvoice'] = null;
    invoiceInfo['series'] = null;
    if(expedient.invoice != null && expedient.invoice != ''){
        invoiceInfo['invoice'] = expedient.invoice;
        if(expedient.numInvoice != null && expedient.numInvoice != ''){
            invoiceInfo['numInvoice'] = expedient.numInvoice;
            invoiceInfo['series'] =  expedient.numInvoice.split('-')[0];
        }
    }

    // Checks if expedients has invoice
    if(expedient.last_invoice_not_anuled != null && expedient.last_invoice_not_anuled != ''){
        $("#formEditExpedient #client").attr("disabled", true);
        $("#formEditExpedient #client").attr("disabled", true);
        $("#formEditExpedient #addClientButton").remove();
        $("#formEditExpedient .search-client-section").remove();
    }
    
    // Asociar a expediente
    switch(expedient.type){
        case '2':
            $('#convertToExpedientSection').removeClass('hide')

            $('#convertToExpedient1').click(function(){
                if(confirm('Desea convertir este presupuesto en defunción?')){
                    var response = saveForm(false);
                    if(response){
                        $.ajax({
                            url: uri + 'core/expedients/expedient/functions.php',
                            method: 'POST',
                            data: {
                                type: 'convertToExpedient',
                                expedient: expedientID,
                                expedientType: 1
                            },
                            async: false,
                            success: function(data){
                                try{
                                    data = $.parseJSON(data)
    
                                    if(data){
                                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido copiado a defunción.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)
    
                                        $('#convertToExpedientSection').addClass('hide');
    
                                        window.location.href = uri + 'expedientes';
                                    }else{
                                        $("#modal-coverted-contado-warning #typeConverted").text('una defunción');
                                        $("#modal-coverted-contado-warning").modal("show");

                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 3500);
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
                }
            })

            $('#convertToExpedient2').click(function(){
                if(confirm('Desea convertir este presupuesto en varios?')){

                    if(saveForm(false)){

                        $.ajax({
                            url: uri + 'core/expedients/expedient/functions.php',
                            method: 'POST',
                            data: {
                                type: 'convertToExpedient',
                                expedient: expedientID,
                                expedientType: 3
                            },
                            async: false,
                            success: function(data){
                                try{
                                    data = $.parseJSON(data)

                                    if(data){
                                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El presupuesto ha sido copiado a varios.</div>')
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                        }, 5000)

                                        $('#convertToExpedientSection').addClass('hide');

                                        window.location.href = uri + 'expedientes';
                                    }else{
                                        $("#modal-coverted-contado-warning #typeConverted").text('un expediente de varios');
                                        $("#modal-coverted-contado-warning").modal("show");

                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 3500);
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
                }
            })
        break

        case '3':
            $('#associateSection').removeClass('hide')
            var associateID;
            var activeExpedients = getActiveExpedients()
            if(activeExpedients == null || activeExpedients.length == 0){
                $('#expedients').append('<option value="null" selected>No hay expedientes activos</option>')
                $('#expedients').attr("disabled", true)
                $('#associate').attr("disabled", true)
            }else{
                $.each(activeExpedients, function(index, elem){
                    $('#expedients').append('<option value="' + elem.expedientID + '">' + elem.number + ' - ' + elem.deceasedName + ' ' + elem.deceasedSurname + '</option>')
                })

                $('#expedients').select2({
                    allowClear: true,
                    language: 'es',
                    placeholder: 'Selecciona un expediente...',
                    containerCssClass: 'select2-expedients-associate'
                })
            }
            
            var associateExpedient = getAssociate(expedientID)
            if(associateExpedient == null){
                $('#expedientToAssociateSection').removeClass('hide')
                $('#expedientAssociateSection').addClass('hide')
            }else{
                associateID = associateExpedient.ID
                $('#expedientToAssociateSection').addClass('hide')
                $('#expedientAssociateSection').removeClass('hide')
                $('#associatedData').removeClass('hide')

                if(associateExpedient.deceasedName == ''){
                    $('#expedientAssociate').html(associateExpedient.number)
                    $('#associateNav').html(associateExpedient.number)
                }else{
                    $('#expedientAssociate').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
                    // $('#associateNav').html(associateExpedient.number + ' - ' + associateExpedient.deceasedName + ' ' + associateExpedient.deceasedSurname)
                    $('#associateNav').html(associateExpedient.number)
                }
            }

            $('#associate').click(function(){
                if(confirm('Desea asociar este expediente a otro expediente?')){
                    var expedientToAssociate = $('#expedients').val()                    
    
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'associate',
                            expedient: expedientToAssociate,
                            associate: expedientID
                        },
                        async: false,
                        success: function(data){
                            try{
                                data = $.parseJSON(data)
                                
                                if(data == null){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }else{
                                    $('#expedientToAssociateSection').addClass('hide')
                                    $('#expedientAssociateSection').addClass('hide')
    
                                    window.location.reload();
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            }catch(e){
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        },
                        error: function(){
                            $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido asociado con éxito.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                }
            })

            $('#deleteAssociation').click(function(){
                if(confirm('Está seguro de que desea eliminar esta asociación?')){
                    $.ajax({
                        url: uri + 'core/expedients/expedient/functions.php',
                        method: 'POST',
                        data: {
                            type: 'deleteAssociation',
                            associate: associateID
                        },
                        async: false,
                        success: function(data){
                            try{
                                if(data){
                                    $('#expedientToAssociateSection').removeClass('hide')
                                    $('#expedientAssociateSection').addClass('hide')
    
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La asociación se ha eliminado con éxito</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                    window.location.reload()
                                }else{
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
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
            })
        break
    }

    $('#formEditExpedient #applicantName').val(expedient.applicantName);
    $('.numberExp').text(expedient.number);
    expedient.covid == '1' ? $('#covid').prop('checked', true) : $('#covid').prop('checked', false)

    if(expedient.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }else{
        gender = "D. "
    }
    $('#deceased').text(' '+gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    if(expedient.arriveTime != null){ 
        $('#formEditExpedient #arriveTime').val(moment(expedient.arriveTime, "HH:mm:ss").format("HH:mm"));
    }else{
        $('#formEditExpedient #arriveTime').val('');
    }
    $('#formEditExpedient #requestTime').val(moment(expedient.requestTime, "HH:mm:ss").format("HH:mm"));
    $('#formEditExpedient #requestDate').val(moment(expedient.requestDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    if(expedient.arriveDate != null && expedient.arriveDate != ''){
        $('#formEditExpedient #arriveDate').val(moment(expedient.arriveDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    switch (expedient.expedientType) {
        case '1':
            $('#formEditExpedient #type').val('Defunción');
        break;
        case '2':
            $('#formEditExpedient #type').val('Presupuesto');
        break;
        case '3':
            $('#formEditExpedient #type').val('Varios');
        break;
    }

    $('#formEditExpedient #policy').val(expedient.policy);
    $('#formEditExpedient #capital').val(expedient.capital);

    var listStatus = getExpedientsStatus();
    listStatus.forEach(function(status, index) {
        var optionsExpedientStatus;
        if(status.expedientStatusID == expedient.status){
            optionsExpedientStatus = new Option(status.name, status.expedientStatusID, true, true);
        }else{
            optionsExpedientStatus = new Option(status.name, status.expedientStatusID, false, false);
        }
        // Añadimos al select de "status" del expediente
        $('#status').append(optionsExpedientStatus).trigger('change');
    });

    $('#formEditExpedient #room').prop('checked', parseInt(expedient.room));
    $('#formEditExpedient #cremation').prop('checked', parseInt(expedient.cremation));
    if(expedient.cremation == '1'){
        $('#cremationData').removeClass('hide');

        getControlEmissionFile(expedientID);
    }else{
        $('#cremationData').addClass('hide');
    }
    $('#formEditExpedient #cremation').change(function(){
        if($('#cremation').is(':checked')){
            $('#cremationData').removeClass('hide');
        }else{
            $('#cremationData').addClass('hide');
            $("#crematorium").val(null).trigger('change')
            $("#crematoriumStatus").val(6).trigger('change')
            $("#crematoriumEntryDate").val(null)
            $("#crematoriumEntryTime").val(null)
            $("#crematoriumLeavingDate").val('')
            $("#crematoriumLeavingTime").val(null)
            $("#crematoriumTechnical").val(null).trigger('change')
            $("#crematoriumClient").val(null).trigger('change')
            $("#crematoriumContactPerson").val(null)
            $("#crematoriumContactName").val(null)
            $("#crematoriumClientCIF").val(null)
            $("#crematoriumContactPersonPhone").val(null)
            $("#crematoriumContactPhonePerson").val(null)
            $("#crematoriumContactSurname").val(null)
            $("#crematoriumContactPhone").val(null)
            $("#crematoriumArriveTime").val(null)
            $("#authName").val(null)
            $("#authDni").val(null)
            $("#authContactPhone").val(null)
            $("#authDate").val(null)
            $("#authTime").val(null)
            $("#authPlace").val(null)
            $("#trazabilityId").val(null)

            attachSmokeFile = null;
            attachSmokeFileName = null;
            attachDeleteSmokeFileName = null;
        }
    });
    $('#formEditExpedient #move').change(function(){
        if($('#move').is(':checked')){
            $('#moveSection').removeClass('hide');
        }else{
            $('#moveSection').addClass('hide');
        }

    });
    $('#formEditExpedient #move').prop('checked', parseInt(expedient.move));
    if(expedient.move == '1'){
        $('#moveSection').removeClass('hide')
    }else{
        $('#moveSection').addClass('hide')
    }
    $('#formEditExpedient #literal').prop('checked', parseInt(expedient.literal));

    $('#formEditExpedient #clientType').val(expedient.clientType);

    if(expedient.clientType == 2 || expedient.clientType == 3){
        //Expedient fields
        $('#loss').removeClass('hide')
        $('#divPolicy').removeClass("hide");
        $('#divCapital').removeClass("hide");

        //Searchs client fields
        $("#divSearchByBrandName").removeClass('hide');
        $("#searchByBrandName").val('');
        $("#divSearchByName").addClass('hide');
        $("#searchByName").val('');
        $("#divSearchBySurname").addClass('hide');
        $("#searchBySurname").val('');
        $("#searchByNIF").val('');

        //Client fields
        $("#divClientBrandName").removeClass('hide');
        $("#divClientName").addClass('hide');
        $("#divClientSurname").addClass('hide');

    }else{
        //Expedient fields
        $('#loss').addClass('hide')
        $('#divPolicy').addClass("hide");
        $('#divCapital').addClass("hide");

        //Searchs client fields
        $("#divSearchByBrandName").addClass('hide');
        $("#searchByBrandName").val('');
        $("#divSearchByName").removeClass('hide');
        $("#searchByName").val('');
        $("#divSearchBySurname").removeClass('hide');
        $("#searchBySurname").val('');
        $("#searchByNIF").val('');

        //Client fields
        $("#divClientBrandName").addClass('hide');
        $("#divClientName").removeClass('hide');
        $("#divClientSurname").removeClass('hide');
    }
   
    $('#formEditExpedient #clientType').change(function(){
        clientType = $(this).val();

        if(!$("#divResults").hasClass('hide')){
            $("#searchBtn").click();
        }
       
        $('#formEditExpedient #client').val('').trigger('change')
        $('#formEditExpedient #clientName').val('')
        $('#formEditExpedient #clientSurname').val('')
        $('#formEditExpedient #clientNIF').val('')
        $('#formEditExpedient #clientMail').val('')
        $('#formEditExpedient #clientAddress').val('')
        $('#formEditExpedient #clientLocation').val('').trigger('change')
        $('#formEditExpedient #clientPostalCode').val('')
        $('#formEditExpedient #clientProvince').val('')
        $('#formEditExpedient #clientPhone').val('')
        $('#formEditExpedient #clientSection .phones.in').empty()
        $('#formEditExpedient #clientBrandName').val('')

        if(clientType == 2 || clientType == 3){
            //Expedient fields
            $('#loss').removeClass('hide')
            $('#divPolicy').removeClass("hide");
            $('#divCapital').removeClass("hide");

            //Searchs client fields
            $("#divSearchByBrandName").removeClass('hide');
            $("#searchByBrandName").val('');
            $("#divSearchByName").addClass('hide');
            $("#searchByName").val('');
            $("#divSearchBySurname").addClass('hide');
            $("#searchBySurname").val('');
            $("#searchByNIF").val('');

            //Client fields
            $("#divClientBrandName").removeClass('hide');
            $("#divClientName").addClass('hide');
            $("#divClientSurname").addClass('hide');
        }else{
            //Expedient fields
            $('#loss').addClass('hide')
            $('#divPolicy').addClass("hide");
            $('#divCapital').addClass("hide");

            //Searchs client fields
            $("#divSearchByBrandName").addClass('hide');
            $("#searchByBrandName").val('');
            $("#divSearchByName").removeClass('hide');
            $("#searchByName").val('');
            $("#divSearchBySurname").removeClass('hide');
            $("#searchBySurname").val('');
            $("#searchByNIF").val('');

            //Client fields
            $("#divClientBrandName").addClass('hide');
            $("#divClientName").removeClass('hide');
            $("#divClientSurname").removeClass('hide');
        }

        // - Cliente    
        $('#client').select2({
            containerCssClass: 'select2-client',
            language: langSelect2,
            placeholder: '--',
            allowClear: true,
            ajax: {
                url: uri+'core/clients/dataClientsType.php?clientType=' +  $('#formEditExpedient #clientType :selected').val(),
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
                            id: item.clientID
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

        switch($("#formEditExpedient #clientType").val()){
            case '1':
                $('#modal-new-client #type').empty().append('<option value="1">Particular</option>');
            break;
            case '2':
                $('#modal-new-client #type').empty().append('<option value="2">Seguros</option>');
            break;
            case '3':
                $('#modal-new-client #type').empty().append('<option value="3">Empresa</option>');
            break;
        }

        $('#modal-new-client #type').val(null).trigger('change');
    })

    switch($("#formEditExpedient #clientType").val()){
        case '1':
            $('#modal-new-client #type').append('<option value="1">Particular</option>');
        break;
        case '2':
            $('#modal-new-client #type').append('<option value="2">Seguros</option>');
        break;
        case '3':
            $('#modal-new-client #type').append('<option value="3">Empresa</option>');
        break;
    }

    $('#modal-new-client #type').val(null).trigger('change');

    $('#formEditExpedient #lossNumber').val(expedient.lossNumber);
    $('#formEditExpedient #internalRef').val(expedient.internalRef);

    if($('#formEditExpedient #clientType').val() == 2 || $('#formEditExpedient #clientType').val() == 3){
        //Client fields
        $("#divClientBrandName").removeClass('hide');
        $("#divClientName").addClass('hide');
        $("#divClientSurname").addClass('hide');
    } else{
        //Client fields
        $("#divClientBrandName").addClass('hide');
        $("#divClientName").removeClass('hide');
        $("#divClientSurname").removeClass('hide');
    }

    /*--------------------------CARGA DE DATOS SOLICITANTE---------------------------*/
    $('#applicantProvince').append($('<option selected/>').val('').text('Selecciona una provincia'));
    $('#applicantLocation').append($('<option selected/>').val('').text('Selecciona una localidad'));

    $('#formEditExpedient #applicantSurname').val(expedient.applicantSurname);
    $('#formEditExpedient #applicantAddress').val(expedient.applicantAddress);
    $('#formEditExpedient #applicantNIF').val(expedient.applicantNIF);
    $('#formEditExpedient [name="applicantNifType"]').filter('[value="' + expedient.applicantNifType + '"]').prop('checked', true)

    provincesList = getProvinces();
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#applicantProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#applicantProvince').change(function(){
        $('#applicantLocation').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#applicantLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#applicantProvince').val()
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

    if(expedient.applicantLocationProvince == null){
        $("#formEditExpedient #applicantProvince option[value='']").attr('disabled', false)
        $('#applicantLocation').prop('disabled', true)
    }else{
        applicantProvince = expedient.applicantLocationProvince
        $("#formEditExpedient #applicantProvince option[value='']").attr('disabled', true)
        $('#formEditExpedient #applicantProvince').val(expedient.applicantLocationProvince)
        $('#applicantLocation').prop('disabled', false)

        if($('#formEditExpedient #applicantProvince').val() == null){
            var newOption = new Option(expedient.applicantLocationProvince, expedient.applicantLocationProvince, true, true)
            $('#formEditExpedient #applicantProvince').append(newOption).trigger('change')
        }

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#applicantLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formEditExpedient #applicantProvince').val()
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
    }
    if(expedient.applicantLocation != null){
        $('#formEditExpedient #applicantLocation').prop('disabled', false)
        if($('#formEditExpedient #applicantLocation').find("option[value='" + expedient.applicantLocation + "']").length){
            $('#formEditExpedient #applicantLocation').val(expedient.applicantLocation).trigger('change')
        }else{ 
            var newOption = new Option(expedient.applicantLocationName + ' - ' + expedient.applicantLocationPostalCode, expedient.applicantLocation, true, true)
            $('#formEditExpedient #applicantLocation').append(newOption).trigger('change')
        }
    }

    $('#formEditExpedient #applicantMail').val(expedient.applicantMail);
    $('#formEditExpedient #applicantPhone').val(expedient.applicantPhone);
    $('#formEditExpedient #applicantMobilePhone').val(expedient.applicantMobilePhone);

    if(expedient.clientType == 2 || expedient.clientType == 3){
        $('#loss').removeClass('hide')
    }else{
        $('#loss').addClass('hide')
    }

    /*--------------------------CARGA DE DATOS CONTACTO ---------------------------*/
    $('#familyContactProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#familyContactLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    $('#formEditExpedient #familyContactName').val(expedient.familyContactName);
    $('#formEditExpedient #crematoriumContactName').val(expedient.familyContactName);
    $('#formEditExpedient #familyContactSurname').val(expedient.familyContactSurname);
    $('#formEditExpedient #crematoriumContactSurname').val(expedient.familyContactSurname);
    $('#formEditExpedient #familyContactNIF').val(expedient.familyContactNIF);
    $('#formEditExpedient [name="familyContactNifType"]').filter('[value="' + expedient.familyContactNifType + '"]').attr('checked', true)
    $('#formEditExpedient #familyContactAddress').val(expedient.familyContactAddress);

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#familyContactProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#familyContactProvince').change(function(){
        $('#familyContactLocation').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#familyContactLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#familyContactProvince').val()
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

    if(expedient.familyContactLocationProvince == null){
        $("#formEditExpedient #familyContactProvince option[value='']").attr('disabled', false)
        $('#familyContactLocation').prop('disabled', true)
    }else{
        familyContactProvince = expedient.familyContactLocationProvince
        $("#formEditExpedient #familyContactProvince option[value='']").attr('disabled', true)
        $('#formEditExpedient #familyContactProvince').val(expedient.familyContactLocationProvince).trigger('change');
        $('#familyContactLocation').prop('disabled', false)
        if($('#formEditExpedient #familyContactProvince').val() == null){
            var newOption = new Option(expedient.familyContactLocationProvince, expedient.familyContactLocationProvince, true, true)
            $('#formEditExpedient #familyContactProvince').append(newOption).trigger('change')
        }

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#familyContactLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formEditExpedient #familyContactProvince').val()
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
    }
    if(expedient.familyContactLocation != null){
        $('#formEditExpedient #familyContactLocation').prop('disabled', false)
        if($('#formEditExpedient #familyContactLocation').find("option[value='" + expedient.familyContactLocation + "']").length){
            $('#formEditExpedient #familyContactLocation').val(expedient.familyContactLocation).trigger('change')
        }else{
            var newOption = new Option(expedient.familyContactLocationName + ' - ' + expedient.familyContactLocationPostalCode, expedient.familyContactLocation, true, true)
            $('#formEditExpedient #familyContactLocation').append(newOption).trigger('change')
        }
    }

    $('#formEditExpedient #familyContactMail').val(expedient.familyContactMail);
    $('#formEditExpedient #familyContactPhone').val(expedient.familyContactPhone);
    $('#formEditExpedient #crematoriumContactPhone').val(expedient.familyContactPhone);
    $('#formEditExpedient #familyContactMobilePhone').val(expedient.familyContactMobilePhone);
    $('#formEditExpedient #familyContactNationality').val(expedient.familyContactNationality);
    $('#formEditExpedient #familyContactRelationship').val(expedient.familyContactRelationship);
    switch(expedient.familyContactNationality){
        case '1':
            $('#familyContactSpainFields').removeClass('hide')
            $('#familyContactOtherFields').addClass('hide')
        break
        case '2':
            $('#familyContactSpainFields').addClass('hide')
            $('#familyContactOtherFields').removeClass('hide')

            $('#formEditExpedient #familyContactOtherCountry').val(expedient.familyContactOtherCountry)
            $('#formEditExpedient #familyContactOtherProvince').val(expedient.familyContactOtherProvince)
            $('#formEditExpedient #familyContactOtherLocation').val(expedient.familyContactOtherLocation)
        break
    }

    $('#familyContactNationality').change(function(){
        if($(this).val() == 1){
            $('#familyContactSpainFields').removeClass('hide')
            $('#familyContactOtherFields').addClass('hide')

            $('#familyContactOtherCountry').val('')
            $('#familyContactOtherProvince').val('')
            $('#familyContactOtherLocation').val('')
        }else{
            $('#familyContactSpainFields').addClass('hide')
            $('#familyContactOtherFields').removeClass('hide')

            $('#familyContactProvince').val('')
            $('#familyContactLocation').val('').trigger('change').attr('disabled', true)
        }
    });

    $('#formEditExpedient #otherContactName').val(expedient.otherContactName);
    $('#formEditExpedient #otherContactPhone').val(expedient.otherContactPhone);
    $('#formEditExpedient #otherContactRelationship').val(expedient.otherContactRelationship);

    $('#clientProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#clientLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#formNewClient #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewClient #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));
 
    // - Cliente    
    $('#client').select2({
        containerCssClass: 'select2-client',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/clients/dataClientsType.php?clientType=' + $('#formEditExpedient #clientType').val(),
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
                            id: item.clientID
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
        templateResult: formatDataClient,
        templateSelection: formatDataClient
    });

    //Evento para mostrar los datos del cliente que se deben facturar al seleccionarlo
    $('#client').on('select2:select', function () {
        $('#clientProvince').val('').trigger('change')
        $('#clientLocation').prop('disabled', true)
        $('#clientLocation').val('').trigger('change')
        
        var clientID = $(this).val();
        $.post(uri+'core/clients/functions.php', {clientID: clientID, type: 'getClient'}, function(data){
            data = $.parseJSON(data);

            // Si el expediente es de varios y tiene factura generada, comprobamos si el nuevo cliente modifica la serie (V- to FS- o viceversa)
            if(invoiceInfo['invoice'] != null) {

                var clientContado = null;
                switch(getCompany()){
                    case '1':
                    case '3':
                        clientContado = '1116';
                    break;
                    case '2':
                        clientContado = '573';
                    break;
                    case '4':
                        clientContado = '22';
                    break;
                    case '5':
                        clientContado = '24';
                    break;
                    case 27:
                        clientContado = '1058';
                    break;
                    default:
                        clientContado = '1';
                    break;
                }

                // New serie
                var newSerie = '';
                if(invoiceInfo['expedientType'] == 1){
                    newSerie = 'D';
                }else if(invoiceInfo['expedientType'] == 3){
                    newSerie = 'V';
                }
                if(clientID == clientContado){
                    newSerie = 'FS';
                }

                if(invoiceInfo['series'] != newSerie){

                    $("#modal-change-cliente-warning #oldSerie").text(invoiceInfo['series']);
                    $("#modal-change-cliente-warning #newSerie").text(newSerie);
                    $("#modal-change-cliente-warning").modal("show");

                    $('#client').val(invoiceInfo['client']).trigger('change');

                    return;
                }
            }
            
            $('#formEditExpedient #phone').val("");
            $('#formEditExpedient #phone').removeClass('validateError')
            $('#formEditExpedient #phoneError').hide()

            $('#formEditExpedient #clientName').val(data[0].name);
            $('#formEditExpedient #clientSurname').val(data[0].surname);
            $('#formEditExpedient #clientNIF').val(data[0].nif);
            $('#formEditExpedient #clientMail').val(data[0].mail);
            $('#formEditExpedient #clientAddress').val(data[0].address);
            $('#formEditExpedient #clientBrandName').val(data[0].brandName);

            if(data[0].province != null){
                clientProvince = data[0].province
                $('#clientProvince').val(data[0].province).trigger('change');
                
                if(data[0].location != null){
                    // $('#formEditExpedient #clientLocation').prop('disabled', false)
                    if($('#formEditExpedient #clientLocation').find("option[value='" + data[0].location + "']").length){
                        $('#formEditExpedient #clientLocation').val(data[0].location).trigger('change');
                    }else{
                        var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].location, true, true);
                        $('#formEditExpedient #clientLocation').append(newOption).trigger('change');
                    }
                }
            }

            $('#formEditExpedient #clientPostalCode').val(data[0].postalCode);
            $('#formEditExpedient #clientProvince').val(data[0].province);

            $('#formEditExpedient #clientSection .phones').empty()
            if(data[0].phones != ""){
                var arrayPhones;
                if(data[0].phones != null){
                    arrayPhones = data[0].phones.split("-");
                }else{
                    arrayPhones = "";
                }

                for (var i=0; i < arrayPhones.length; i ++){
                    $('#formEditExpedient #clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                }                
                if(!$('#formEditExpedient #clientSection .phones').hasClass('in')){
                    $('#formEditExpedient #clientSection .phones').addClass('in');
                }
                $('#formEditExpedient #clientSection .phones .label .btn-remove').click(function(){
                    $(this).parent('.label').remove();
                });
                $('#formEditExpedient #phones').val(data[0].phones);
            }
        });
    });
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#clientProvince').append(optionsExpedientProvince).trigger('change');
        });
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewClient #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#clientProvince').change(function(){
        // $('#clientLocation').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#clientLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#clientProvince').val()
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

    var client = getClient(expedientID);
    if(client != null){
        if ($('[id="client"]').find("option[value='" + client.id + "']").length) {
            $('[id="client"]').val(client.id).trigger('change');
        } else { 
            if(client.type == '2' || client.type == '3'){
                var newOption = new Option(client.brandName + " " + client.nif, client.clientID, true, true);
            }else{
                if(client.nif != null && client.nif != ''){
                    var newOption = new Option(client.name + ' ' + client.surname + ' - ' + client.nif, client.clientID, true, true);
                }else{
                    var newOption = new Option(client.name + ' ' + client.surname, client.clientID, true, true);
                }
            }
            $('[id="client"]').append(newOption).trigger('change');
        }

        $('#formEditExpedient #clientName').val(client.name);
        $('#formEditExpedient #clientSurname').val(client.surname);
        $('#formEditExpedient #clientNIF').val(client.nif);
        $('#formEditExpedient #clientMail').val(client.mail);
        $('#formEditExpedient #clientAddress').val(client.address);

        if(client.province == null){
            $("#formEditExpedient #clientProvince option[value='']").attr('disabled', false)
            $('#clientLocation').prop('disabled', true)
        }else{
            clientProvince = client.province
            $("#formEditExpedient #clientProvince option[value='']").attr('disabled', true)
            $('#formEditExpedient #clientProvince').val(client.province)
            // $('#clientLocation').prop('disabled', false)

            // DATOS DEL SOLICITANTE - LOCALIDADES
            $('#clientLocation').select2({
                language: langSelect2,
                placeholder: 'Seleccione una localidad',
                allowClear: true,
                ajax: {
                    url: uri + 'core/locations/data2.php',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term || "",
                            province : $('#clientProvince').val()
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
        }
        if(client.location != null){
            if ($('#formEditExpedient #clientLocation').find("option[value='" + client.location + "']").length) {
                $('#formEditExpedient #clientLocation').val(client.location).trigger('change');
            } else { 
                var newOption = new Option(client.locationName + ' - ' + client.postalCode, client.location, true, true);
                $('#formEditExpedient #clientLocation').append(newOption).trigger('change');
            }
        }
        
        if(client.phones!=""){
            var arrayPhones;
            if(client.phones != null){
                arrayPhones = client.phones.split("-");
            }else{
                arrayPhones = "";
            }
            for (var i=0; i < arrayPhones.length; i ++){
                $('#formEditExpedient #clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
            }                
            if(!$('#formEditExpedient #clientSection .phones').hasClass('in')){
                $('#formEditExpedient #clientSection .phones').addClass('in');
            }
            $('#formEditExpedient #clientSection .phones .label .btn-remove').click(function(){
                $(this).parent('.label').remove();
            });
            $('#formEditExpedient #phones').val(client.phones);
        }

        $('#formEditExpedient #clientBrandName').val(client.brandName);
    }

    if(parseInt(expedient.total_invoices) > 0){
        $("#formEditExpedient #clientType").attr("disabled", true);
        // $("#addClientButton").addClass('hide');

        $("#infoNotChangeClient").removeClass('hide');

        $("#notChangeClientHelp").popover({placement:"top", container: 'body', html: true});

        if(expedient.numInvoice != null && expedient.numInvoice != ''){
            $("#numberInvoiceData").removeClass('hide');
            $("#numberInvoiceNav").text(expedient.numInvoice);
        }
    }

    $('#formNewClient #province').change(function(){
        $('#formNewClient #location').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewClient #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formNewClient #province').val()
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

    //Cargar los datos del solicitante en los de "familiar de contacto" cuando
    //el usuario hace click en el botón de cargar solicitante
    $('#btn-add-applicant').click(function(){
        //Recogemos los campos de "datos de soliciantes"
        var applicantName = $('#applicantName').val();
        var applicantSurname = $('#applicantSurname').val();
        var applicantAddress = $('#applicantAddress').val();
        var applicantNIF = $('#applicantNIF').val();
        var applicantProvince = $('#applicantProvince').val();
        var applicantLocation = $('#applicantLocation').val();
        var applicantMail = $('#applicantMail').val();
        var applicantPhone = $('#applicantPhone').val();
        var applicantMobilePhone = $('#applicantMobilePhone').val();

        //Aplicamos los datos anteriores en los de "familiar de contacto"
        $('#familyContactName').val(applicantName);
        $('#familyContactSurname').val(applicantSurname);
        $('#familyContactNIF').val(applicantNIF);
        $('#familyContactAddress').val(applicantAddress);
        if(applicantProvince != ''){
            familyContactProvince = applicantProvince
            $('#familyContactProvince').val(applicantProvince);
            $('#familyContactLocation').prop('disabled', false)
            $('#familyContactLocation').val('').trigger('change')
            $('#familyContactLocation').val(applicantLocation);

            if(applicantLocation != null){
                var locationData = getLocation(applicantLocation)
                var locationName = locationData[0].name
                var locationPostalCode = locationData[0].postalCode
                if($('#familyContactLocation').find("option[value='" + applicantLocation + "']").length){
                    $('#familyContactLocation').val(applicantLocation).trigger('change')
                }else{ 
                    var newOption = new Option(locationName + ' - ' + locationPostalCode, applicantLocation, true, true)
                    $('#familyContactLocation').append(newOption).trigger('change')
                }
            }
        }
        $('#familyContactMail').val(applicantMail);
        $('#familyContactPhone').val(applicantPhone);
        $('#familyContactMobilePhone').val(applicantMobilePhone);

        $('#crematoriumContactName').val($('#familyContactName').val());
        $('#crematoriumContactSurname').val($('#familyContactSurname').val());
        $('#crematoriumContactPhone').val($('#familyContactPhone').val());
    });

    /*--------------------------CARGA DE DATOS DIFUNTO ---------------------------*/
    $('#deceasedBirthdayProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#deceasedProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#deceasedBirthdayLocation').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#formNewDeceased #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewDeceased #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    // Añadimos al select de "pronvicias" del expediente
    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#deceasedBirthdayProvince').append(optionsExpedientProvince).trigger('change');
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#deceasedProvince').append(optionsExpedientProvince).trigger('change');
        });
    }
    
    $('#deceasedMaritalStatus').change(function(){
        if($(this).val() == "Otros"){
            $('.otherMaritalStatus').removeClass('hide')
        }else{
            $('.otherMaritalStatus').addClass('hide')
        }
    })

    $('#deceasedNationality').change(function(){
        if($(this).val() == "Otro"){
            $('.deceasedNationalityName').removeClass('hide');
        }else{
            $('.deceasedNationalityName').addClass('hide');
            $('#deceasedNationalityName').val('');
            $('#deceasedNationalityProvince').val('');
            $('#deceasedNationalityLocation').val('');
        }
    })

    $('#deceasedBirthdayProvince').change(function(){
        $('#deceasedBirthdayLocation').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#deceasedBirthdayLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#deceasedBirthdayProvince').val()
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

    $('#deceasedLocation').select2({
        containerCssClass: 'select2-deceasedLocation',
        language: langSelect2,
        placeholder: 'Seleccione una localidad',
        allowClear: true,
        ajax: {
            url: uri+'core/deceasedIn/data.php',
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
                            id: item.deceasedInID
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
        templateResult: formatDataClient,
        templateSelection: formatDataClient
    });

    $('#deceasedLocation').change(function(){
        if($(this).val() == 0){
            $("#otherDeceasedLocationDiv").removeClass('hide')
        }else{
            $("#otherDeceasedLocationDiv").addClass('hide')
            $("#otherDeceasedLocation").val('');
        }
    })

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewDeceased #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewDeceased #province').change(function(){
        $('#formNewDeceased #location').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewDeceased #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formNewDeceased #province').val()
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

    $('#deceasedDoctor').select2({
        containerCssClass: 'select2-doctor',
        language: langSelect2,
        placeholder: 'Seleccione un médico',
        allowClear: true,
        ajax: {
            url: uri + 'core/doctors/data.php',
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

    currentMortuary = expedient.deceasedMortuary;
    currentTellmebyeRoom = expedient.tellmebyeRoom;

    var initialData = new Array;
    if(expedient.deceasedMortuary != null){
        var tellmebyeRoom = expedient.tellmebyeRoom;
        var tellmebyeRoomName = expedient.tellmebyeRoomName;
        if(tellmebyeRoom == '' || expedient.tellmebyeRoom != expedient.mortuaryTellmebye){
            tellmebyeRoom = expedient.mortuaryTellmebye;
            tellmebyeRoomName = expedient.mortuaryTellmebyeName;
        }

        initialData = [{
            tellmebyeName: tellmebyeRoomName,
            tellmebye: tellmebyeRoom,
            text: expedient.deceasedMortuaryName,
            id: expedient.deceasedMortuary
        }];
    }
    $('#deceasedMortuary').select2({
        containerCssClass: 'select2-deceasedMortuary',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/mortuaries/data.php',
            dataType: 'json',
            delay: 250,
            async: false,
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
                        tellmebyeName: item.tellmebyeName,
                        tellmebye: item.tellmebye,
                        text: item.name,
                        id: item.mortuaryID
                    }
                }),
                pagination: {
                    more: false
                }
            };
            },
            cache: false
        },
        data: initialData,
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });
    $('#deceasedMortuary').change(function(){
        if($(this).val() != null && $(this).select2('data')[0].text == 'Otro'){
            $('#deceasedMortuaryAddressField').removeClass('hide');

            $('#tellmebyeRoom').empty().select2({
                language: langSelect2,
                placeholder: 'Selecciona una sala...',
                allowClear: true,
                disabled: false
            })
            $('#tellmebyeRoom').val(null).trigger('change');

            $('#tellmebyeRoomSection').addClass('hide');
        }else{
            $('#tellmebyeRoom').empty().select2({
                language: langSelect2,
                placeholder: 'Selecciona una sala...',
                allowClear: true,
                disabled: false
            })
            $('#tellmebyeRoom').val(null).trigger('change');

            $('#deceasedMortuaryAddressField').addClass('hide');

            if($(this).val() == null){
                $('#tellmebyeRoomSection').addClass('hide');
            }else{
                var mortuaryData = $(this).select2('data')[0];

                if(mortuaryData.tellmebye != '' && mortuaryData.tellmebye != null){
                    var info = getTellmebyeInfoByMortuary(mortuaryData.tellmebye);
                    if(info != null){
                        var roomsAux = new Array;
                        $.each(info.rooms, function(index, elem){
                            roomsAux.push({id: elem.id, text: elem.name});
                        })
                        rooms = roomsAux.sort(sortSelect2);

                        $('#tellmebyeRoom').empty().select2({
                            language: langSelect2,
                            placeholder: 'Selecciona una sala...',
                            allowClear: true,
                            disabled: false,
                            data: rooms
                        })

                        if(expedient.tellmebyeRoom != null && expedient.tellmebyeRoom != '' && firstTimeLoad){
                            $('#tellmebyeRoom').val(expedient.tellmebyeRoom).trigger('change');
                            if($('#tellmebyeRoom').val() == null){
                                var option = new Option(expedient.tellmebyeRoomName, expedient.tellmebyeRoom, true, true);
                                $('#tellmebyeRoom').append(option);
                            }
                        }else{
                            $('#tellmebyeRoom').val(null).trigger('change');
                        }
                    }
                    
                    $('#tellmebyeRoomSection').removeClass('hide');
                }else{
                    $('#tellmebyeRoomSection').addClass('hide');
                }
            }
        }
    })
    $('#deceasedMortuary').trigger('change');

    $('#formEditExpedient .deceasedPanel.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#deceasedPanel').val(1);
        deceasedPanel = 1;
    });
    $('#formEditExpedient .deceasedPanel.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#deceasedPanel').val(0);
    });

    $('#formEditExpedient #deceasedName').val(expedient.deceasedName);
    $('#formEditExpedient #deceasedSurname').val(expedient.deceasedSurname);
    $('#formEditExpedient #deceasedNIF').val(expedient.deceasedNIF);
    $('#formEditExpedient #deceasedLocality').val(expedient.deceasedLocality);
    if(expedient.deceasedProvince != '' && expedient.deceasedProvince != null){
        $('#formEditExpedient #deceasedProvince').val(expedient.deceasedProvince).trigger('change');
    }
    if(expedient.deceasedNIF != ''){
        $('input[name="deceasedNifType"][value="' + expedient.deceasedNifType + '"]').prop('checked', true)
    }
    $('#formEditExpedient #deceasedGender').val(expedient.deceasedGender);
    $('#formEditExpedient #deceasedMaritalStatus').val(expedient.deceasedMaritalStatus);
    $('#formEditExpedient #deceasedMaritalStatusDescription').val(expedient.deceasedMaritalStatusDescription);
    if(expedient.deceasedMaritalStatusDescription != null && expedient.deceasedMaritalStatusDescription != ""){
        $('.otherMaritalStatus').removeClass('hide');
    }
    $('#formEditExpedient #deceasedChildOfFather').val(expedient.deceasedChildOfFather);
    $('#formEditExpedient #deceasedChildOfMother').val(expedient.deceasedChildOfMother);
    $('#formEditExpedient #deceasedFirstNuptials').val(expedient.deceasedFirstNuptials);
    $('#formEditExpedient #deceasedSecondNuptials').val(expedient.deceasedSecondNuptials);
    $('#formEditExpedient #deceasedNationality').val(expedient.deceasedNationality);
    if(expedient.deceasedNationality == 'Otro'){
        $('#formEditExpedient .deceasedNationalityName').removeClass('hide');
        $('#formEditExpedient #deceasedNationalityName').val(expedient.deceasedNationalityName);
        $('#formEditExpedient #deceasedNationalityProvince').val(expedient.deceasedNationalityProvince);
        $('#formEditExpedient #deceasedNationalityLocation').val(expedient.deceasedNationalityLocation);
    }
    if(expedient.deceasedBirthday != null){
        $('#formEditExpedient #deceasedBirthday').val(moment(expedient.deceasedBirthday, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.deceasedBirthdayLocationProvince == null){
        $("#formEditExpedient #deceasedBirthdayProvince option[value='']").attr('disabled', false)
        $('#deceasedBirthdayLocation').prop('disabled', true)
    }else{
        deceasedBirthdayProvince = expedient.deceasedBirthdayLocationProvince
        if($('#formEditExpedient #deceasedBirthdayProvince option[value="' + expedient.deceasedBirthdayLocationProvince + '"]').length == 0){
            var optionsExpedientProvince = new Option(expedient.deceasedBirthdayLocationProvince, expedient.deceasedBirthdayLocationProvince, false, false);
            $('#deceasedBirthdayProvince').append(optionsExpedientProvince).trigger('change');
        }
        $("#formEditExpedient #deceasedBirthdayProvince option[value='']").attr('disabled', true)
        $('#formEditExpedient #deceasedBirthdayProvince').val(expedient.deceasedBirthdayLocationProvince)
        $('#deceasedBirthdayLocation').prop('disabled', false)

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#deceasedBirthdayLocation').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#deceasedBirthdayProvince').val()
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
    }
    if(expedient.deceasedBirthdayLocation != null){
        $('#formEditExpedient #deceasedBirthdayLocation').prop('disabled', false)
        if($('#formEditExpedient #deceasedBirthdayLocation').find("option[value='" + expedient.deceasedBirthdayLocation + "']").length){
            $('#formEditExpedient #deceasedBirthdayLocation').val(expedient.deceasedBirthdayLocation).trigger('change')
        }else{ 
            var newOption = new Option(expedient.deceasedBirthdayLocationName + ' - ' + expedient.deceasedBirthdayLocationPostalCode, expedient.deceasedBirthdayLocation, true, true)
            $('#formEditExpedient #deceasedBirthdayLocation').append(newOption).trigger('change')
        }
    }
    $('#formEditExpedient #deceasedUsualAddress').val(expedient.deceasedUsualAddress);
    if(expedient.deceasedDate != null){
        $('#formEditExpedient #deceasedDate').val(moment(expedient.deceasedDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.deceasedTime != null){
        $('#formEditExpedient #deceasedTime').val(moment(expedient.deceasedTime, "HH:mm:ss").format("HH:mm"));
    }
    if(expedient.deceasedLocation != null){
        if($('#formEditExpedient #deceasedLocation').find("option[value='" + expedient.deceasedLocation + "']").length){
            $('#formEditExpedient #deceasedLocation').val(expedient.deceasedLocation).trigger('change');
        }else{ 
            var newOption = new Option(expedient.deceasedLocationName, expedient.deceasedLocation, true, true);
            $('#formEditExpedient #deceasedLocation').append(newOption).trigger('change');
        }

        if(expedient.deceasedLocation == "0"){
            $("#otherDeceasedLocationDiv").removeClass('hide')
            $("#otherDeceasedLocation").val(expedient.otherDeceasedLocation)
        }
    }
    if(expedient.deceasedDoctorID != null){
        if($('#formEditExpedient #deceasedDoctor').find("option[value='" + expedient.deceasedDoctorID + "']").length){
            $('#formEditExpedient #deceasedDoctor').val(expedient.deceasedDoctorID).trigger('change');
        }else{ 
            var newOption = new Option(expedient.deceasedDoctorName, expedient.deceasedDoctorID, true, true);
            $('#formEditExpedient #deceasedDoctor').append(newOption).trigger('change');
        }
    }
    $('#formEditExpedient #deceasedDoctorCertificate').val(expedient.deceasedDoctorCertificate);
    $('#formEditExpedient #deceasedCause').val(expedient.deceasedCause);
    $('#formEditExpedient #deceasedTribunal').val(expedient.deceasedTribunal);
    $('#formEditExpedient #deceasedTribunalNumber').val(expedient.deceasedTribunalNumber);
    $('#formEditExpedient #deceasedRoom').val(expedient.deceasedRoom);
    $('#formEditExpedient #deceasedMortuaryAddress').val(expedient.deceasedMortuaryAddress);
    if(expedient.deceasedPanel=='1'){
        $('#formEditExpedient #deceasedPanel').val(1);
        $('#formEditExpedient .deceasedPanel.minimal').iCheck('check');
    }else{
        $('#formEditExpedient #deceasedPanel').val(0);
        $('#formEditExpedient .deceasedPanel.minimal').iCheck('uncheck');
    }

    if(expedient.startVelacionDate != null){
        $('#formEditExpedient #startVelacionDate').val(moment(expedient.startVelacionDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.startVelacionTime != null){
        $('#formEditExpedient #startVelacionTime').val(moment(expedient.startVelacionTime, "HH:mm:ss").format("HH:mm"));
    }
    if(expedient.endVelacionDate != null){
        $('#formEditExpedient #endVelacionDate').val(moment(expedient.endVelacionDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.endVelacionTime != null){
        $('#formEditExpedient #endVelacionTime').val(moment(expedient.endVelacionTime, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.startVelacionDate2 != null){
        $('#formEditExpedient #startVelacionDate2').val(moment(expedient.startVelacionDate2, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.startVelacionTime2 != null){
        $('#formEditExpedient #startVelacionTime2').val(moment(expedient.startVelacionTime2, "HH:mm:ss").format("HH:mm"));
    }
    if(expedient.endVelacionDate2 != null){
        $('#formEditExpedient #endVelacionDate2').val(moment(expedient.endVelacionDate2, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.endVelacionTime2 != null){
        $('#formEditExpedient #endVelacionTime2').val(moment(expedient.endVelacionTime2, "HH:mm:ss").format("HH:mm"));
    }

    /*--------------------------CARGA DE DATOS ENTIERRO ---------------------------*/
    $('#formNewChurch #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewChurch #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    $('#churchLabel').change(function(){
        if($(this).val() == "Otro"){
            $('.otherCeremonyText').removeClass('hide')
        }else{
            $('.otherCeremonyText').addClass('hide')
        }
    })

    $('#churchLabel').val(expedient.churchLabel)
    if(expedient.churchLabel == 'Otro'){
        $('#formEditExpedient .otherCeremonyText').removeClass('hide');
        $('#formEditExpedient #otherCeremony').val(expedient.otherCeremony);       
    }
   
    $('#church').select2({
        containerCssClass: 'select2-church',
        language: langSelect2,
        placeholder: 'Seleccione una iglesia',
        allowClear: true,
        ajax: {
            url: uri+'core/churches/data.php',
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
                            id: item.churchID
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

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewChurch #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewChurch #province').change(function(){
        $('#formNewChurch #location').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewChurch #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formNewChurch #province').val()
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

    var lat;
    var long;
    var href = 'https://google.es/maps/search/?api=1&query=';  
    $('#formNewChurch #latitude').on('blur', function(){
        lat = $(this).val();
    }).on('blur', function() {
        $('#formNewChurch .situation-link a').attr('href',href+lat);
    });
    $('#formNewChurch #longitude').on('blur', function(){
        long = $(this).val();
    }).on('blur', function() {
        $('#formNewChurch .situation-link a').attr('href',href+lat+', '+long);
    });

    $('#formNewChurch #priest').select2({
        containerCssClass: 'select2-priest',
        language: langSelect2,
        placeholder: 'Seleccione un cura',
        allowClear: true,
        ajax: {
            url: uri+'core/priests/data.php',
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
                            id: item.priestID
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

    $('.btn-add-priest').click(function(){
        var priest = $(this).parent().parent().find('#priest').val();
        var priestName = $(this).parent().parent().find('#priest').text();

        $('.priests').append(   '<span class="label label-default small labelPhones">' +
                                '   <input type="hidden" value="' + priest + '">' +
                                '   <span class="number">' + priestName + '</span> ' +
                                '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
                                '</span><br>')

        if(!$('.priests').hasClass('in')){
            $('.priests').addClass('in');
        }

        $('.priests .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });

        $('#formNewData #priest').empty().trigger('change')
    });

    $('#cemeteryLabel').change(function(){
        if($(this).val() == "Otro"){
            $('.otherInhumationText').removeClass('hide')
        }else if($(this).val() == 'Crematorio'){
        }else{
            $('.otherInhumationText').addClass('hide')
        }
    })

    $('#cemeteryLabel').val(expedient.cemeteryLabel)
    if(expedient.cemeteryLabel == 'Otro'){
        $('#formEditExpedient .otherInhumationText').removeClass('hide');
        $('#formEditExpedient #otherInhumation').val(expedient.otherInhumation);       
    }
    $('#cemetery').select2({
        containerCssClass: 'select2-cemetery',
        language: langSelect2,
        placeholder: 'Seleccione un cementerio',
        allowClear: true,
        ajax: {
            url: uri+'core/cemeteries/data.php',
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
                        id: item.cemeteryID
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

    $('#cemetery').change(function(){
        if($('#placeDestinationSearch').prop('checked') == false){
            if($('#cemetery').val() != null){
                var cemeterySelectedID = $('#cemetery').val();
                var cemeterySelectedName = $('#cemetery').select2('data')[0].text;
                if($('#formEditExpedient #placeDestinationFinalCemetery').find("option[value='" + cemeterySelectedID + "']").length){
                    $('#formEditExpedient #placeDestinationFinalCemetery').val(cemeterySelectedID).trigger('change');
                }else{ 
                    var newOption = new Option(cemeterySelectedName, cemeterySelectedID, true, true);
                    $('#formEditExpedient #placeDestinationFinalCemetery').append(newOption).trigger('change');
                }
            }else{
                $('#placeDestinationFinalCemetery').val(null).trigger('change');
            }
        }
    })

    $('#formNewCemetery #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewCemetery #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            // Añadimos al select de "pronvicias" del expediente
            $('#formNewCemetery #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewCemetery #province').change(function(){
        $('#formNewCemetery #location').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewCemetery #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formNewCemetery #province').val()
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

    $('#formNewCemetery #latitude').on('blur', function(){
        lat = $(this).val();
    }).on('blur', function() {
        $('#formNewCemetery .situation-link a').attr('href',href+lat);
    });
    $('#formNewCemetery #longitude').on('blur', function(){
        long = $(this).val();
    }).on('blur', function() {
        $('#formNewCemetery .situation-link a').attr('href',href+lat+', '+long);
    });

    var nichesList = getNiches();
    if(nichesList != null){
        nichesList.forEach(function(niche) {
            var optionsNiches = new Option(niche.name, niche.nicheID, false, false);
            // Añadimos al select de "Nicho"
            $('#niche').append(optionsNiches).trigger('change');
        });
    }

    $('#formEditExpedient #funeralBusyNiche').prop('checked', parseInt(expedient.funeralBusyNiche));
    if(expedient.funeralBusyNiche == 1){
        $('#formEditExpedient .busyNiche').removeClass('hide')
    }else{
        $('#formEditExpedient .busyNiche').addClass('hide')
    }
    $('#formEditExpedient #funeralBusyNiche').change(function(){
        if($('#funeralBusyNiche').is(':checked')){
            $('#formEditExpedient .busyNiche').removeClass('hide')
        }else{
            $('#formEditExpedient .busyNiche').addClass('hide')
        }
    });

    if(expedient.church != null){
        if($('#formEditExpedient #church').find("option[value='" + expedient.church + "']").length){
            $('#formEditExpedient #church').val(expedient.church).trigger('change');
        }else{ 
            var newOption = new Option(expedient.churchName, expedient.church, true, true);
            $('#formEditExpedient #church').append(newOption).trigger('change');
        }
    }

    if(expedient.cemetery != null){
        if($('#formEditExpedient #cemetery').find("option[value='" + expedient.cemetery + "']").length){
            $('#formEditExpedient #cemetery').val(expedient.cemetery).trigger('change');
        }else{ 
            var newOption = new Option(expedient.cemeteryName, expedient.cemetery, true, true);
            $('#formEditExpedient #cemetery').append(newOption).trigger('change');
        }
    }

    if(expedient.funeralDate != null){
        $('#formEditExpedient #funeralDate').val(moment(expedient.funeralDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.funeralTime != null){
        $('#formEditExpedient #funeralTime').val(moment(expedient.funeralTime, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.ceremonyDate != null && expedient.ceremonyDate != ''){
        $('#formEditExpedient #ceremonyDate').val(moment(expedient.ceremonyDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.ceremonyTime != null){
        $('#formEditExpedient #ceremonyTime').val(moment(expedient.ceremonyTime, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.funeralDateNew != null){
        $('#formEditExpedient #funeralDateNew').val(moment(expedient.funeralDateNew, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.funeralTimeNew != null){
        $('#formEditExpedient #funeralTimeNew').val(moment(expedient.funeralTimeNew, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.funeralDateBurial != null){
        $('#formEditExpedient #funeralDateBurial').val(moment(expedient.funeralDateBurial, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.funeralTimeBurial != null){
        $('#formEditExpedient #funeralTimeBurial').val(moment(expedient.funeralTimeBurial, "HH:mm:ss").format("HH:mm"));
    }

    $('#formEditExpedient #niche').val(expedient.niche);
    $('#formEditExpedient #funeralNicheNumber').val(expedient.funeralNicheNumber);
    $('#formEditExpedient #funeralBusyNiche').val(expedient.funeralBusyNiche);

    // 1
    $('#formEditExpedient #deceasedNiche').val(expedient.deceasedNiche);
    if(expedient.funeralDateNiche != null){
        $('#formEditExpedient #funeralDateNiche').val(moment(expedient.funeralDateNiche, "X").format("DD/MM/YYYY"));
    }

    // 2
    $('#formEditExpedient #deceasedNiche2').val(expedient.deceasedNiche2);
    if(expedient.funeralDateNiche2 != null){
        $('#formEditExpedient #funeralDateNiche2').val(moment(expedient.funeralDateNiche2, "X").format("DD/MM/YYYY"));
    }

    // 3
    $('#formEditExpedient #deceasedNiche3').val(expedient.deceasedNiche3);
    if(expedient.funeralDateNiche3 != null){
        $('#formEditExpedient #funeralDateNiche3').val(moment(expedient.funeralDateNiche3, "X").format("DD/MM/YYYY"));
    }

    $('#formEditExpedient #regime').val(expedient.regime).trigger('change');
    $('#formEditExpedient #exhumation').val(expedient.exhumation);
    $('#formEditExpedient #nicheHeight').val(expedient.nicheHeight).trigger('change');
    
    if($('#formEditExpedient #regime').val()== 2 ){
        $('#formEditExpedient #exhumTitular').addClass('hide')
    }else{
        $('#formEditExpedient #exhumTitular').removeClass('hide')
    }
    $('#formEditExpedient #regime').change(function(){
        if($('#formEditExpedient #regime').val()== 2 ){
            $('#formEditExpedient #exhumTitular').addClass('hide')
        }else{
            $('#formEditExpedient #exhumTitular').removeClass('hide')
        }
    })

    /*--------------------------CARGA DE PERSONAL ---------------------------*/

    // Listado de funerarias
    $('#funeralHomeService').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/funeralHomeData.php',
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
                            id: item.funeralHomeID
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

    if(expedient.funeralHomeService != null){
        if($('#funeralHomeService').find("option[value='" + expedient.funeralHomeService + "']").length) {
            $('#funeralHomeService').val(expedient.funeralHomeService).trigger('change');
        }else{
            var newOption = new Option(expedient.fuName, expedient.funeralHomeService, true, true);
            $('#funeralHomeService').append(newOption).trigger('change');
        }
    }

    // Listado de asistencia a la familia
    $('#familyAssistance').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/familyAssistanceData.php',
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
                            text: item.name + " " + item.surname,
                            id: item.userID
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

    if(expedient.familyAssistance != null){
        if($('[id="familyAssistance"]').find("option[value='" + expedient.familyAssistance + "']").length) {
            $('[id="familyAssistance"]').val(expedient.familyAssistance).trigger('change');
        }else{
            var newOption = new Option(expedient.faName1 + " " + expedient.faSurname1, expedient.familyAssistance, true, true);
            $('[id="familyAssistance"]').append(newOption).trigger('change');
        }
    }

    // Recogida de cadaver y traslado
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

    // Recogida de cadaver 1
    if(expedient.corpseCollection1 != null){
        if($('#corpseCollection1').find("option[value='" + expedient.corpseCollection1 + "']").length) {
            $('#corpseCollection1').val(expedient.corpseCollection1).trigger('change');
        }else { 
            var newOption = new Option(expedient.corpseCollection1Name, expedient.corpseCollection1, true, true);
            $('#corpseCollection1').append(newOption).trigger('change');
        }
    }

    // Recogida de cadaver 2
    if(expedient.corpseCollection2 != null){
        if($('#corpseCollection2').find("option[value='" + expedient.corpseCollection2 + "']").length) {
            $('#corpseCollection2').val(expedient.corpseCollection2).trigger('change');
        }else{
            var newOption = new Option(expedient.corpseCollection2Name, expedient.corpseCollection2, true, true);
            $('#corpseCollection2').append(newOption).trigger('change');
        }
    }

    //Coches de recogida
    $('.cars-collection').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cars/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    load_other: 1
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: (item.carID == 0 ? item.name : item.brand + " - " + item.model + " - " + item.name),
                            id: item.carID
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

    // Other - Vehículo de Recogida Inicial
    $("#carCollection1").change(function(){
        if($(this).val() == 0){
            $(".car-collection-1-other").removeClass('hide')
        }else{
            $("#carCollection1LicensePlate").val('');
            $("#carCollection1Brand").val('');
            $("#carCollection1Model").val('');

            $(".car-collection-1-other").addClass('hide')
        }
    })

    // Other - Vehículo de Conducción
    $("#hearse").change(function(){
        if($(this).val() == 0){
            $(".hearse-other").removeClass('hide')
        }else{
            $("#hearseLicensePlate").val('');
            $("#hearseBrand").val('');
            $("#hearseModel").val('');

            $(".hearse-other").addClass('hide')
        }
    })
    
    // Vehículo de recogida inicial
    if(expedient.carCollection != null){
        if($('[id="carCollection1"]').find("option[value='" + expedient.carCollection + "']").length) {
            $('[id="carCollection1"]').val(expedient.carCollection).trigger('change');
        }else{
            if(expedient.carCollection == 0){
                var newOption = new Option('Otro', expedient.carCollection, true, true);

                $("#carCollection1LicensePlate").val(expedient.carCollection1LicensePlate)
                $("#carCollection1Brand").val(expedient.carCollection1Brand)
                $("#carCollection1Model").val(expedient.carCollection1Model)
            }else{
                var newOption = new Option(expedient.carBrand + " - " + expedient.carModel + " - " + expedient.carLicense, expedient.carCollection, true, true);
            }
            $('[id="carCollection1"]').append(newOption).trigger('change');
        }
    }

    // Vehículo de conduccion
    if(expedient.hearse != null){
        if($('[id="hearse"]').find("option[value='" + expedient.hearse + "']").length) {
            $('[id="hearse"]').val(expedient.hearse).trigger('change');
        }else{
            if(expedient.hearse == 0){
                var newOption = new Option('Otro', expedient.hearse, true, true);

                $("#hearseLicensePlate").val(expedient.hearseLicensePlate)
                $("#hearseBrand").val(expedient.hearseBrand)
                $("#hearseModel").val(expedient.hearseModel)
            }else{
                var newOption = new Option(expedient.carBrandHearse + " - " + expedient.carModelHearse + " - " + expedient.carLicenseHearse, expedient.hearse, true, true);
            }
            $('[id="hearse"]').append(newOption).trigger('change');
        }

        if(parseInt(expedient.hearse_from_service) > 0){
            $("#hearse").attr("disabled", true);
        }
    }

    // Coche - Traslado
    $('#carCollection2').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/cars/data.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    load_other: 0
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: (item.carID == '0' ? item.name : item.brand + " - " + item.model + " - " + item.name),
                            id: item.carID
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

    if(expedient.mortuaryRegNotes != null && expedient.mortuaryRegNotes != 'null'){
        $("#mortuaryRegNotes").val(expedient.mortuaryRegNotes);
    }

    // PLACE DESTINY MIDDLE
    $('#placeDestinationMiddle').select2({
        containerCssClass: 'select2-destinationPlaceMiddle',
        language: langSelect2,
        placeholder: 'Seleccione un lugar',
        allowClear: true,
        ajax: {
            url: uri+'core/destinationPlaces/middle/data.php',
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
                            id: item.placesID
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
        templateResult: formatDataClient,
        templateSelection: formatDataClient
    });

    if(expedient.placeDestinationMiddle != null){
        if($('#formEditExpedient #placeDestinationMiddle').find("option[value='" + expedient.placeDestinationMiddle + "']").length){
            $('#formEditExpedient #placeDestinationMiddle').val(expedient.placeDestinationMiddle).trigger('change');
        }else{ 
            var newOption = new Option(expedient.placeDestinationMiddleName + ' - ' + expedient.placeDestinationMiddleLocality, expedient.placeDestinationMiddle, true, true);
            $('#formEditExpedient #placeDestinationMiddle').append(newOption).trigger('change');
        }
    }

    // Added place destination middle
    $('#formNewDestinationPlaceMiddle #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewDestinationPlaceMiddle #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#formNewDestinationPlaceMiddle #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewDestinationPlaceMiddle #province').change(function(){
        $('#formNewDestinationPlaceMiddle #location').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewDestinationPlaceMiddle #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formNewDestinationPlaceMiddle #province').val()
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
    });

    // DESTINO INTERMEDIO - NUEVO
    $('#saveNewDestinationPlace').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewDestinationPlaceMiddle #name'))){
            validate++;
        }
        if(isEmpty($('#formNewDestinationPlaceMiddle #location'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewDestinationPlaceMiddle #name").val();
            var location = $("#formNewDestinationPlaceMiddle #location").val();
            if(location == "undefined" || location=="" ||  location == null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/middle/create.php',
                method: 'POST',
                data: {
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino intermedio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Recargamos los datos del select "Destino Intermedio"
                    $('#placeDestinationMiddle').trigger('change.select2');
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-destinationPlaceMiddle').modal('hide');
        }else{
            $('#modal-new-destinationPlaceMiddle #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-destinationPlaceMiddle #warning-message').empty()
            }, 3500)
        }
    });
    
    // PLACE DESTINY FINAL
    $('#placeDestinationFinal').select2({
        containerCssClass: 'select2-destinationPlaceFinal',
        language: langSelect2,
        placeholder: 'Seleccione un lugar',
        allowClear: true,
        ajax: {
            url: uri+'core/destinationPlaces/final/data.php',
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
                            id: item.placesID
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
        templateResult: formatDataClient,
        templateSelection: formatDataClient
    });

    // Added place destination final
    $('#formNewDestinationPlaceFinal #province').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#formNewDestinationPlaceFinal #location').append($('<option default selected/>').val('').text('Selecciona una localidad'));

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#formNewDestinationPlaceFinal #province').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#formNewDestinationPlaceFinal #province').change(function(){
        $('#formNewDestinationPlaceFinal #location').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#formNewDestinationPlaceFinal #location').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#formNewDestinationPlaceFinal #province').val()
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

    // DESTINO FINAL - NUEVO
    $('#saveNewDestinationPlaceFinal').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewDestinationPlaceFinal #name'))){
            validate++;
        }
        if(isEmpty($('#formNewDestinationPlaceFinal #location'))){
            validate++;
        }

        if(validate == 0){
            var name = $("#formNewDestinationPlaceFinal #name").val();
            var location = $("#formNewDestinationPlaceFinal #location").val();
            if(location == "undefined" || location=="" ||  location == null){
                location = 1;
            }

            $.ajax({
                url: uri + 'core/destinationPlaces/final/create.php',
                method: 'POST',
                data: {
                    name: name,
                    location: location
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)

                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El destino intermedio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    //Recargamos los datos del select "Destino Final"
                    $('#placeDestinationFinal').trigger('change.select2');
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-destinationPlaceFinal').modal('hide');
        }else{
            $('#modal-new-destinationPlaceFinal #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-destinationPlaceFinal #warning-message').empty()
            }, 3500)
        }
    });

    // DESTINO FINAL CEMENTERIO
    $('#placeDestinationFinalCemetery').select2({
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
                    page_limit: limit_page,
                    page: params.page
                };
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
            };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });
    $('#placeDestinationFinalCemetery').attr("disabled", true);

    $('#placeDestinationSearch').change(function(){
        if($('#placeDestinationSearch').prop('checked')){

            $(".destination-place-final").removeClass('hide').addClass('display-flex');
            $(".destination-place-final-cemetery").addClass('hide');
        }else{
            $(".destination-place-final").addClass('hide').removeClass('display-flex');
            $(".destination-place-final-cemetery").removeClass('hide');
        }
    });

    if(expedient.placeDestinationFinal != null){
        $('#placeDestinationSearch').prop('checked', true).trigger('change');

        if($('#formEditExpedient #placeDestinationFinal').find("option[value='" + expedient.placeDestinationFinal + "']").length){
            $('#formEditExpedient #placeDestinationFinal').val(expedient.placeDestinationFinal).trigger('change');
        }else{ 
            var newOption = new Option(expedient.placeDestinationFinalName + ' - ' + expedient.placeDestinationFinalLocality, expedient.placeDestinationFinal, true, true);
            $('#formEditExpedient #placeDestinationFinal').append(newOption).trigger('change');
        }
    }else if(expedient.placeDestinationFinalCemetery != null){
        $('#placeDestinationSearch').prop('checked', false).trigger('change');

        if($('#formEditExpedient #placeDestinationFinalCemetery').find("option[value='" + expedient.placeDestinationFinalCemetery + "']").length){
            $('#formEditExpedient #placeDestinationFinalCemetery').val(expedient.placeDestinationFinalCemetery).trigger('change');
        }else{ 
            var newOption = new Option(expedient.placeDestinationFinalCemeteryName , expedient.placeDestinationFinalCemetery, true, true);
            $('#formEditExpedient #placeDestinationFinalCemetery').append(newOption).trigger('change');
        }
    }

    /*--------------------------CARGA DE DATOS ENTRADA ---------------------------*/
    $('#funeralHome').select2({
        containerCssClass: 'select2-funeralHome',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/funeralHomes/data.php',
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
                        id: item.funeralHomeID
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

    $('#funeralHome').on('select2:select', function () {
        var funeralHomeID = $(this).val();
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#funeralHomeCIF').val(data[0].nif);
            $('#funeralHomePhone').val(data[0].phones);
            $('#funeralHomeFax').val(data[0].fax);
        });
    });

    if(expedient.funeralHome != null){
        if($('#formEditExpedient #funeralHome').find("option[value='" + expedient.funeralHome + "']").length){
            $('#formEditExpedient #funeralHome').val(expedient.funeralHome).trigger('change');
        }else{ 
            var newOption = new Option(expedient.funeralHomeName, expedient.funeralHome, true, true);
            $('#formEditExpedient #funeralHome').append(newOption).trigger('change');
        }
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: expedient.funeralHome, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#funeralHomeCIF').val(data[0].nif);
            $('#funeralHomePhone').val(data[0].phones);
            $('#funeralHomeFax').val(data[0].fax);
        });
    }

    if(expedient.funeralHomeEntryDate != null){
        $('#formEditExpedient #funeralHomeEntryDate').val(moment(expedient.funeralHomeEntryDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.funeralHomeEntryTime != null){
        $('#formEditExpedient #funeralHomeEntryTime').val(moment(expedient.funeralHomeEntryTime, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.entryDateBarrow != null){
        $('#formEditExpedient #entryDateBarrow').val(moment(expedient.entryDateBarrow, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.entryTimeBarrow != null){
        $('#formEditExpedient #entryTimeBarrow').val(moment(expedient.entryTimeBarrow, "HH:mm:ss").format("HH:mm"));
    }

    $('#formEditExpedient #refrigeratedChamberName').val(expedient.refrigeratedChamberName);
    if(expedient.refrigeratedChamberDateStart != null){
        $('#formEditExpedient #refrigeratedChamberDateStart').val(moment(expedient.refrigeratedChamberDateStart, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.refrigeratedChamberTimeStart != null){
        $('#formEditExpedient #refrigeratedChamberTimeStart').val(moment(expedient.refrigeratedChamberTimeStart, "HH:mm:ss").format("HH:mm"));
    }
    if(expedient.refrigeratedChamberDateEnd != null){
        $('#formEditExpedient #refrigeratedChamberDateEnd').val(moment(expedient.refrigeratedChamberDateEnd, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.refrigeratedChamberTimeEnd != null){
        $('#formEditExpedient #refrigeratedChamberTimeEnd').val(moment(expedient.refrigeratedChamberTimeEnd, "HH:mm:ss").format("HH:mm"));
    }

    $('#formEditExpedient #coffin').val(expedient.coffin);
    if(expedient.coffin == 3){
        $('#otherCoffinSection').removeClass('hide')
    }
    $('#formEditExpedient #otherCoffin').val(expedient.otherCoffin);
    $('#responsibleUser').select2({
        placeholder: 'Otro',
        allowClear: true,
        ajax: {
            url: uri+'core/users/funeralData.php',
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
                        text: item.name + ' - ' + item.nif,
                        id: item.userID
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

    $('#responsibleUser').change(function(){
        if($(this).val() != null){
            $('#responsibleNameDiv').addClass('hide');
            $('#responsibleNIF').addClass('hide');
            $('#respNifLBL').addClass('hide');
            $('#responsibleNIF').attr('disabled', true);
        }else{
            $('#responsibleNameDiv').removeClass('hide');
            $('#responsibleNIF').removeClass('hide');
            $('#respNifLBL').removeClass('hide');
            $('#responsibleNIF').attr('disabled', false);
            $('#responsibleName').val('');
            $('#responsibleNIF').val('');
        }
    });
    if(expedient.responsibleUser != null){
        $('#responsibleNameDiv').addClass('hide');
        $('#responsibleNIF').addClass('hide');
        $('#respNifLBL').addClass('hide');
        $('#responsibleNIF').attr('disabled', true);
        
        if($('#formEditExpedient #responsibleUser').find("option[value='" + expedient.responsibleUser + "']").length){
            $('#formEditExpedient #responsibleUser').val(expedient.responsibleUser).trigger('change');
        }else{ 
            var newOption = new Option(expedient.responsibleUserNamePreparacion + " - " + expedient.responsibleUserNif, expedient.responsibleUser, true, true);
            $('#formEditExpedient #responsibleUser').append(newOption).trigger('change');
        }
    }else{
        $('#responsibleNameDiv').removeClass('hide');
        $('#responsibleNIF').removeClass('hide');
        $('#respNifLBL').removeClass('hide');
        $('#responsibleNIF').attr('disabled', false);
        $('#responsibleName').val('');
        $('#responsibleNIF').val('');
        $('#responsibleName').val(expedient.responsibleName);
        $('#responsibleNIF').val(expedient.responsibleNIF);
        if(expedient.responsibleNIF != '' && expedient.responsibleNIF != null){
            if(!checkNifCif(expedient.responsibleNIF)){
                $('input[name="responsibleNifType"][value="2"]').prop('checked', true)
            }
        }
    }

    $("#formEditExpedient #mortuaryReg").change(function(){
        if($('#formEditExpedient #mortuaryReg').prop('checked')){
            $("#formEditExpedient .mortuary-reg-section").removeClass('hide');
        }else{
            $("#formEditExpedient #mortuaryRegNotes").val('');
            $("#formEditExpedient .mortuary-reg-section").addClass('hide');
        }
    })

    $('#formEditExpedient #responsibleUser').val(expedient.responsibleUser);
    $('#formEditExpedient #tanatologicalPractice').val(expedient.tanatologicalPractice);
    $('#formEditExpedient #mortuaryReg').prop('checked', parseInt(expedient.mortuaryReg));
    $('#formEditExpedient #funeralReg').prop('checked', parseInt(expedient.funeralReg));
    $('#formEditExpedient #personalReg').prop('checked', parseInt(expedient.personalReg));
    $('#formEditExpedient #crematoriumReg').prop('checked', parseInt(expedient.crematoriumReg));

    // Féretro
    $('#coffin').change(function(){
        if($(this).val() == 3){
            $('#otherCoffinSection').removeClass('hide')
        }else{
            $('#otherCoffinSection').addClass('hide')
        }
    });
    
    /*--------------------------CARGA DE DATOS CREMACIÓN ---------------------------*/
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
                };
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
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#formEditExpedient #crematoriumEntryDate').change(function(){
        if($(this).val() == ''){
            $("#formEditExpedient #smokeOpacityDateStart").val('');
            $("#formEditExpedient #smokeOpacityDateReading").val('');

            $('#formEditExpedient #crematoriumLeavingDate').attr('disabled', true)
            $('#formEditExpedient #crematoriumLeavingDate').val('')
            $("#formEditExpedient #smokeOpacityDateEnd").val('');
            
            $('#formEditExpedient #crematoriumEntryTime').attr('disabled', true)
            $('#formEditExpedient #crematoriumEntryTime').val('')
            $("#formEditExpedient #smokeOpacityTimeStart").val('');

            $('#formEditExpedient #crematoriumLeavingTime').attr('disabled', true)
            $('#formEditExpedient #crematoriumLeavingTime').val('')
            $("#formEditExpedient #smokeOpacityTimeEnd").val('');

        }else{
            $('#formEditExpedient #crematoriumEntryTime').attr('disabled', false)

            $("#formEditExpedient #smokeOpacityDateStart").val($(this).val());
            $("#formEditExpedient #smokeOpacityDateReading").val($(this).val());
        }

        if($('#crematoriumLeavingDate').val() != ''){
            if(compareDates($("#crematoriumEntryDate").val(), $("#crematoriumLeavingDate").val()) > 0){
                $("#crematoriumLeavingDate").val($("#crematoriumEntryDate").val())

                $("#formEditExpedient #smokeOpacityDateEnd").val($("#crematoriumEntryDate").val());
            }
        }
    });

    $('#formEditExpedient #crematoriumEntryTime').change(function(){
        if($(this).val() == ''){

            $("#formEditExpedient #smokeOpacityTimeStart").val('');

            $('#formEditExpedient #crematoriumLeavingDate').attr('disabled', true)
            $('#formEditExpedient #crematoriumLeavingDate').val('')
            $("#formEditExpedient #smokeOpacityDateEnd").val('');

            $('#formEditExpedient #crematoriumLeavingTime').attr('disabled', true)
            $('#formEditExpedient #crematoriumLeavingTime').val('')
            $("#formEditExpedient #smokeOpacityTimeEnd").val('');
        }else{
            $("#formEditExpedient #smokeOpacityTimeStart").val($(this).val());

            $('#formEditExpedient #crematoriumLeavingDate').attr('disabled', false)
            $('#formEditExpedient #crematoriumLeavingTime').attr('disabled', false)

            var startDate = $('#formEditExpedient #crematoriumEntryDate').val()
            var startTime = $(this).val()
            
            var sDate = moment(startDate + ' ' + startTime, 'DD/MM/YYYY HH:mm').format('X')
            sDate = parseInt(sDate) + parseInt(3 * 60 * 60)
            
            var endDate = moment(sDate, 'X').format('DD/MM/YYYY')
            var endTime = moment(sDate, 'X').format('HH:mm')

            $('#formEditExpedient #crematoriumLeavingDate').val(endDate)
            $("#formEditExpedient #smokeOpacityDateEnd").val(endDate);

            $('#formEditExpedient #crematoriumLeavingTime').val(endTime)
            $("#formEditExpedient #smokeOpacityTimeEnd").val(endTime);
        }
    });

    $('#crematoriumLeavingDate').change(function(){
        $("#formEditExpedient #smokeOpacityDateEnd").val($(this).val());

        if($('#crematoriumEntryDate').val() != ''){
            if(compareDates($("#crematoriumLeavingDate").val(), $("#crematoriumEntryDate").val()) < 0){
                $("#crematoriumEntryDate").val($("#crematoriumLeavingDate").val())

                $("#formEditExpedient #smokeOpacityDateStart").val($(this).val());
                $("#formEditExpedient #smokeOpacityDateReading").val($(this).val());
            }
        }
    });

    $('#crematoriumLeavingTime').change(function(){
        $("#formEditExpedient #smokeOpacityTimeEnd").val($(this).val())
    });

    // Emissions control file

    // Set doc
    $("#fileAttachDoc").change(function(){
        var inputFile = document.getElementById('fileAttachDoc');
        var files = inputFile.files;
        attachSmokeFile = files;

        if(files.length > 0){

            var flag = true;
            var time = moment().format('X');
            attachSmokeFileName = files[0].name;

            var extension = attachSmokeFileName.split('.')[attachSmokeFileName.split('.').length - 1];
            attachSmokeFileName = attachSmokeFileName.split('.').slice(0, -1).join('.');
            attachSmokeFileName = attachSmokeFileName + '_' + time + '.' + extension;
            switch(extension.toLowerCase()){
                case 'jpeg':
                case 'jpg':
                case 'png':
                break
                default:
                    flag = false;
                break
            }

            if(!flag){
                $("#fileAttachDoc").val('')
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El archivo seleccionado tiene un formato no permitido.</div>');
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000)
                return false
            }else{
                $("#titleDocSmoke").text(files[0].name);
                $("#titleDocSmokeSection").removeClass('hide');
    
                $("#fileAttachDoc").attr("disabled", true);
            }
        }else{
            $(".remove-file").click();
        }
    });

    // Show file
    $("#titleDocSmoke").click(function(){
        if(attachSmokeFile != null && attachSmokeFile.length > 0){
            var objectUrl = _URL.createObjectURL(attachSmokeFile[0]);
        }else{
            var objectUrl = $("#titleDocSmoke").attr("src");
        }

        $('#previewImageModal #previewImage').attr('src', objectUrl);
        $('#previewImageModal #previewImage').attr('alt', attachSmokeFileName);

        $("#previewImageModal").modal("show");
    });

    // Delete file
    $("#removeSmokeFile").click(function(){
        $("#titleDocSmoke").text('');
        $("#titleDocSmoke").attr('src', '');
        $("#titleDocSmokeSection").addClass('hide');
        $("#fileAttachDoc").attr("disabled", false)
        $("#fileAttachDoc").val('');

        attachDeleteSmokeFileName = attachSmokeFileName;

        attachSmokeFile = null;
        attachSmokeFileName = null;
    });

    $('#crematoriumClient').select2({
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/funeralHomes/data.php',
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
                        id: item.funeralHomeID
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

    $('#crematoriumClient').change(function(){
        var funeralHomeID = $(this).val();
        if(funeralHomeID != null){
            var funeralHome = getFuneralHome(funeralHomeID);       
            $('#crematoriumClientCIF').val(funeralHome.nif);
            $('#crematoriumContactPersonPhone').val(funeralHome.phones);
            if(expedient.crematoriumClient == funeralHomeID){
                if(expedient.crematoriumContactPerson == null || expedient.crematoriumContactPerson == 'null'){                
                    if(funeralHome.person != 'null' && funeralHome.person != null){
                        $('#formEditExpedient #crematoriumContactPerson').val(funeralHome.person);
                    }
                }else{   
                    $('#formEditExpedient #crematoriumContactPerson').val(expedient.crematoriumContactPerson);
                }                          
                if(expedient.crematoriumContactPhonePerson == null){
                    $('#formEditExpedient #crematoriumContactPhonePerson').val(funeralHome.phones);
                }else{
                    $('#formEditExpedient #crematoriumContactPhonePerson').val(expedient.crematoriumContactPhonePerson);
                }  
            }else{
                $('#formEditExpedient #crematoriumContactPerson').val(funeralHome.person);
                $('#formEditExpedient #crematoriumContactPhonePerson').val(funeralHome.phones);
            }  
        }
    });

    $('.crematoriumStatusColor').css('color', '#f47d42')
    $('#crematoriumStatus').val(expedient.crematoriumStatus)
    switch(expedient.crematoriumStatus){
        case '6':
            $('.crematoriumStatusColor').css('color', '#f47d42')
        break
        case '7':
            $('.crematoriumStatusColor').css('color', '#614126')
            $("#crematoriumEntryDate").attr("disabled", true);
            $("#crematoriumEntryTime").attr("disabled", true);
            $("#crematoriumLeavingDate").attr("disabled", true);
            $("#crematoriumLeavingTime").attr("disabled", true);
        break
    }
    $('#crematoriumStatus').change(function(){
        switch($(this).val()){
            case '6':
                $('.crematoriumStatusColor').css('color', '#f47d42')
            break
            case '7':
                $('.crematoriumStatusColor').css('color', '#614126')
            break
        }
    });

    $('#loadFamilyContactCremation').click(function(){
        $('#authName').val($('#familyContactName').val() + ' ' + $('#familyContactSurname').val())
        $('#authDni').val($('#familyContactNIF').val())
        $('#authContactPhone').val($('#familyContactMobilePhone').val())

        $('#formEditExpedient [name="authDniType"]').filter('[value="' + $('input[name="familyContactNifType"]:checked').val() + '"]').prop('checked', true)
    });

    $('#crematoriumTechnical').select2({
        language: langSelect2,
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

    $('#formEditExpedient #familyContactName').on('blur', function(){
        familyContactName = $(this).val();
    }).on('blur', function() {
        $('#formEditExpedient #crematoriumContactName').val(familyContactName);
    });

    var familyContactSurname;
    $('#formEditExpedient #familyContactSurname').on('blur', function(){
        familyContactSurname = $(this).val();
    }).on('blur', function() {
        $('#formEditExpedient #crematoriumContactSurname').val(familyContactSurname);
    });

    var familyContactPhone;
    $('#formEditExpedient #familyContactPhone').on('blur', function(){
        familyContactPhone = $(this).val();
    }).on('blur', function() {
        $('#formEditExpedient #crematoriumContactPhone').val(familyContactPhone);
    });

    $('#formEditExpedient #crematoriumIntroduction').prop('checked', parseInt(expedient.crematoriumIntroduction));
    $('#formEditExpedient #crematoriumIntroduction').change(function(){
        if($('#crematoriumIntroduction').is(':checked')){
            $('#arriveFamilyTime').removeClass('hide');
        }else{
            $('#arriveFamilyTime').addClass('hide');
        }
    });
    if(expedient.crematoriumIntroduction == '1'){
        $('#arriveFamilyTime').removeClass('hide')
    }else{
        $('#arriveFamilyTime').addClass('hide')
    }
    $('#formEditExpedient #crematoriumWaitOnRoom').prop('checked', parseInt(expedient.crematoriumWaitOnRoom));
    $('#formEditExpedient #crematoriumVaseBio').prop('checked', parseInt(expedient.crematoriumVaseBio));
    $('#formEditExpedient #ecologicCoffin').prop('checked', parseInt(expedient.ecologicCoffin));
    $('#formEditExpedient #crematoriumPacemaker').prop('checked', parseInt(expedient.crematoriumPacemaker));
    $('#formEditExpedient #authName').val(expedient.authName);
    $('#formEditExpedient #authDni').val(expedient.authDni);    
    $('#formEditExpedient [name="authDniType"]').filter('[value="' + expedient.authDniType + '"]').prop('checked', true)
    
    if(expedient.crematoriumTechnical != null){
        if($('#formEditExpedient #crematoriumTechnical').find("option[value='" + expedient.crematoriumTechnical + "']").length){
            $('#formEditExpedient #crematoriumTechnical').val(expedient.crematoriumTechnical).trigger('change');
        }else{
            var newOption = new Option(expedient.crematoriumTechnicalName + ' ' + expedient.crematoriumTechnicalSurname, expedient.crematoriumTechnical, true, true);
            $('#formEditExpedient #crematoriumTechnical').append(newOption).trigger('change');
        }
    }
    if(expedient.authDate != null){
        $('#formEditExpedient #authDate').val(moment(expedient.authDate, 'X').format('DD/MM/YYYY'));
    }
    if(expedient.authTime != null){
        $('#formEditExpedient #authTime').val(moment(expedient.authTime, 'X').format('HH:mm'));
    }
    $('#formEditExpedient #authPlace').val(expedient.authPlace);

    if(expedient.crematorium != null){
        if($('#formEditExpedient #crematorium').find("option[value='" + expedient.crematorium + "']").length){
            $('#formEditExpedient #crematorium').val(expedient.crematorium).trigger('change');
        }else{ 
            var newOption = new Option(expedient.crematoriumName, expedient.crematorium, true, true);
            $('#formEditExpedient #crematorium').append(newOption).trigger('change');
        }
    }

    if(expedient.crematoriumEntry != null){
        $('#formEditExpedient #crematoriumEntryDate').val(moment(expedient.crematoriumEntry, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY"));
        $('#formEditExpedient #crematoriumEntryTime').val(moment(expedient.crematoriumEntry, "YYYY-MM-DD HH:mm:ss").format("HH:mm"));
    }
    if(expedient.crematoriumLeaving != null){
        $('#formEditExpedient #crematoriumLeavingDate').val(moment(expedient.crematoriumLeaving, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY"));
        $('#formEditExpedient #crematoriumLeavingTime').val(moment(expedient.crematoriumLeaving, "YYYY-MM-DD HH:mm:ss").format("HH:mm"));
    }

    if(expedient.crematoriumClient != null){
        var funeralHome = getFuneralHome(expedient.crematoriumClient);
        $('#crematoriumClientCIF').val(funeralHome.nif);
        $('#crematoriumContactPerson').val(funeralHome.person);
        $('#crematoriumContactPersonPhone').val(funeralHome.phones);
        if($('#formEditExpedient #crematoriumClient').find("option[value='" + expedient.crematoriumClient + "']").length){
            $('#formEditExpedient #crematoriumClient').val(expedient.crematoriumClient).trigger('change');
        }else{ 
            var newOption = new Option(expedient.crematoriumClientName, expedient.crematoriumClient, true, true);
            $('#formEditExpedient #crematoriumClient').append(newOption).trigger('change');
        }    
    }

    if(expedient.crematoriumArriveTime != null){
        $('#formEditExpedient #crematoriumArriveTime').val(moment(expedient.crematoriumArriveTime, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.crematoriumContactPhonePerson != null){
        $('#formEditExpedient #crematoriumContactPhonePerson').val(expedient.crematoriumContactPhonePerson );
    }
    if(expedient.authContactPhone != null){
        $('#formEditExpedient #authContactPhone').val(expedient.authContactPhone);
    }
    $('#formEditExpedient #trazabilityId').val(expedient.trazabilityId);
    defaultTrazabilityID = expedient.trazabilityId;
    
    $('#formEditExpedient #trazabilityIdCheck').change(function(){
        if($(this).prop('checked')){
            $('#formEditExpedient #trazabilityId').attr("disabled", false);
        }else{
            $('#formEditExpedient #trazabilityId').attr("disabled", true);
        }
    })

    $('#smokeOpacityIncidents').change(function(){
        if($(this).val() == '1'){
            $("#smokeOpacityNotesSection").removeClass('hide');
        }else{
            $("#smokeOpacityNotesSection").addClass('hide');
            $("#smokeOpacityIncidentsNotes").val('');
        }
    })

    if(expedient.smokeOpacityDateStart != null){
        $('#formEditExpedient #smokeOpacityDateStart').val(moment(expedient.smokeOpacityDateStart, 'X').format('DD/MM/YYYY'));
    }
    if(expedient.smokeOpacityTimeStart != null){
        $('#formEditExpedient #smokeOpacityTimeStart').val(moment(expedient.smokeOpacityTimeStart, 'X').format('HH:mm'));
    }

    if(expedient.smokeOpacityDateEnd != null){
        $('#formEditExpedient #smokeOpacityDateEnd').val(moment(expedient.smokeOpacityDateEnd, 'X').format('DD/MM/YYYY'));
    }
    if(expedient.smokeOpacityTimeEnd != null){
        $('#formEditExpedient #smokeOpacityTimeEnd').val(moment(expedient.smokeOpacityTimeEnd, 'X').format('HH:mm'));
    }

    if(expedient.smokeOpacityDateReading != null){
        $('#formEditExpedient #smokeOpacityDateReading').val(moment(expedient.smokeOpacityDateReading, 'X').format('DD/MM/YYYY'));
    }
    if(expedient.smokeOpacityTimeReading != null){
        $('#formEditExpedient #smokeOpacityTimeReading').val(moment(expedient.smokeOpacityTimeReading, 'X').format('HH:mm'));
    }

    $("#smokeOpacityLoadWeight").val(expedient.smokeOpacityLoadWeight);
    if(expedient.smokeOpacityBacharachScale == null){
        $("#smokeOpacityBacharachScale").val("null").trigger('change');
    }else{
        $("#smokeOpacityBacharachScale").val(expedient.smokeOpacityBacharachScale).trigger('change');
    }
    $("#smokeOpacityIncidents").val(expedient.smokeOpacityIncidents).trigger('change');
    $("#smokeOpacityIncidentsNotes").val(expedient.smokeOpacityIncidentsNotes);


    // LOAD SMOKE FIELD

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
                $('#modal-new-crematorium .province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('#modal-new-crematorium .province').append($('<option />').val(this.province).text(this.province))
                })

                $('#modal-new-crematorium .province').change(function(){
                    $('#modal-new-crematorium .province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var provinceCrematorium
    $('#modal-new-crematorium .province').change(function(){
        provinceCrematorium = $(this).val()
        $('#modal-new-crematorium .location').prop('disabled', false)
        $('#modal-new-crematorium .location').val('').trigger('change')
    })

    $('#modal-new-crematorium .location').prop('disabled', true)

    // LOCALIDADES
    $('#modal-new-crematorium .location').select2({
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
                    province : provinceCrematorium
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

    // GOOGLE MAPS
    var lat;
    var long;
    var href = 'https://google.es/maps/search/?api=1&query=';

    $('#modal-new-crematorium #latitude').on('blur', function(){
        lat = $(this).val();
    }).on('blur', function() {
        $('#modal-new-crematorium .situation-link a').attr('href',href+lat);
    });
    $('#modal-new-crematorium #longitude').on('blur', function(){
        long = $(this).val();
    }).on('blur', function() {
        $('#modal-new-crematorium .situation-link a').attr('href',href+lat+', '+long);
    });

    $('#saveNewCrematorium').click(function(){
        var validate = 0;

        if(isEmpty($('#modal-new-crematorium #name'))){
            validate++;
        }
        if($('#modal-new-crematorium #longitude').val() != ""){
            if(isEmpty($('#modal-new-crematorium #latitude'))){
                validate++;
            }
        }
        if($('#modal-new-crematorium #latitude').val() != ""){
            if(isEmpty($('#modal-new-crematorium #longitude'))){
                validate++;
            }
        }
        if($('#modal-new-crematorium #mail').val() != ""){
            if(!isMail($('#modal-new-crematorium #mail'))){
                validate++;
            }
        }

        if(validate == 0){
            var name = $("#modal-new-crematorium #name").val();
            var address = $("#modal-new-crematorium #address").val();
            var location = $("#modal-new-crematorium #location").val();
            var latitude =  parseFloat($('#modal-new-crematorium #latitude').val());
            var longitude = parseFloat($('#modal-new-crematorium #longitude').val());
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var mail = $("#modal-new-crematorium #mail").val();
            var phones = "";
            $('#modal-new-crematorium .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);

            $.ajax({
                url: uri + 'core/crematoriums/create.php',
                method: 'POST',
                data: {
                    name: name,
                    address: address,
                    location: location,
                    latitude: latitude,
                    longitude: longitude,
                    mail: mail,
                    phones: phones,
                    isYourOwn: $('#modal-new-crematorium #isYourOwn').prop('checked')
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    
                    if(data){        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El crematorio se ha creado con éxito.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    
                    setTimeout(function(){
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
            
            $('#modal-new-crematorium').modal('hide');
        }else{
            $('#modal-new-crematorium #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-crematorium #warning-message').empty()
            }, 3500)
        }
    })

    /*--------------------------CARGA DE DATOS TRASLADO ---------------------------*/
    if(expedient.moveVia == 1){
        $('.flightSection').removeClass('hide')
    }else if(expedient.moveVia == 0){
        $('.flightSection').addClass('hide')
    }

    $('#moveVia').change(function(){
        if($(this).val() == 1){
            $('.flightSection').removeClass('hide');     
        }else{
            $('.flightSection').addClass('hide');
        }
    })
    $('#moveCollectionProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#moveCollection').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#moveDestinationProvince').append($('<option default selected/>').val('').text('Selecciona una provincia'));
    $('#moveDestination').append($('<option default selected/>').val('').text('Selecciona una localidad'));
    $('#moveFuneralHome').select2({
        containerCssClass: 'select2-moveFuneralHome',
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/funeralHomes/data.php',
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
                        id: item.funeralHomeID
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

    $('#formEditExpedient #moveFuneralHome').on('select2:select', function () {
        var funeralHomeID = $(this).val();
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: funeralHomeID, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formEditExpedient #moveFuneralHomeCIF').val(data[0].nif);
            $('#formEditExpedient #moveFuneralHomePhone').val(data[0].phones);
            $('#formEditExpedient #moveFuneralHomeFax').val(data[0].fax);
            $('#formEditExpedient #moveFuneralHomeAddress').val(data[0].address);
            if(expedient.moveFuneralHome == funeralHomeID){
                if(expedient.moveContactPerson == null){
                    $('#formEditExpedient #moveContactPerson').val(data[0].person);
                }else{
                    $('#formEditExpedient #moveContactPerson').val(expedient.moveContactPerson);
                }                          
                if(expedient.moveContactPhone == null){
                    $('#formEditExpedient #moveContactPhone').val(data[0].phones);
                }else{
                    $('#formEditExpedient #moveContactPhone').val(expedient.moveContactPhone);
                }  
            }else{
                $('#formEditExpedient #moveContactPerson').val(data[0].person);
                $('#formEditExpedient #moveContactPhone').val(data[0].phones);
            }            
        });
        
    });

    if(provincesList != null){
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#moveCollectionProvince').append(optionsExpedientProvince).trigger('change');
        });
        provincesList.forEach(function(province, index) {
            var optionsExpedientProvince = new Option(province.province, province.province, false, false);
            $('#moveDestinationProvince').append(optionsExpedientProvince).trigger('change');
        });
    }

    $('#moveCollectionProvince').change(function(){
        $('#moveCollection').attr('disabled', false);

        var province = $('#moveCollectionProvince').val();

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#moveCollection').select2({
            language: langSelect2,
            placeholder: '--',
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
    });

    $('#moveDestinationProvince').change(function(){
        $('#moveDestination').attr('disabled', false);

        // DATOS DEL SOLICITANTE - LOCALIDADES
        $('#moveDestination').select2({
            language: langSelect2,
            placeholder: 'Seleccione una localidad',
            allowClear: true,
            ajax: {
                url: uri + 'core/locations/data2.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term || "",
                        province : $('#moveDestinationProvince').val()
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
    });

    $('#formEditExpedient .moveJudicial.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#moveJudicial').val(1);
    });
    $('#formEditExpedient .moveJudicial.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#moveJudicial').val(0);
    });

    $('#formEditExpedient .moveTraslado.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#moveTraslado').val(1);
    });
    $('#formEditExpedient .moveTraslado.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#moveTraslado').val(0);
    });

    $('#formEditExpedient .moveDevolucion.minimal').on('ifChecked', function(event){
        $(this).parent().parent().find('#moveDevolucion').val(1);
    });
    $('#formEditExpedient .moveDevolucion.minimal').on('ifUnchecked', function(event){
        $(this).parent().parent().find('#moveDevolucion').val(0);
    });

    if(expedient.moveFuneralHome != null){
        if($('#formEditExpedient #moveFuneralHome').find("option[value='" + expedient.moveFuneralHome + "']").length){
            $('#formEditExpedient #moveFuneralHome').val(expedient.moveFuneralHome).trigger('change');
        }else{ 
            var newOption = new Option(expedient.moveFuneralHomeName, expedient.moveFuneralHome, true, true);
            $('#formEditExpedient #moveFuneralHome').append(newOption).trigger('change');
        }
        $.post(uri+'core/funeralHomes/functions.php', {funeralHomeID: expedient.moveFuneralHome, type: 'getFuneralHome'}, function(data){
            data = $.parseJSON(data);
            $('#formEditExpedient #moveFuneralHomeCIF').val(data[0].nif);
            $('#formEditExpedient #moveFuneralHomePhone').val(data[0].phones);
            $('#formEditExpedient #moveFuneralHomeFax').val(data[0].fax);
            $('#formEditExpedient #moveFuneralHomeAddress').val(data[0].address);
            if(expedient.moveContactPerson == null){
                $('#formEditExpedient #moveContactPerson').val(data[0].person);
            }else{
                $('#formEditExpedient #moveContactPerson').val(expedient.moveContactPerson);
            }                       
            if(expedient.moveContactPhone == null){
                $('#formEditExpedient #moveContactPhone').val(data[0].phones);
            }else{
                $('#formEditExpedient #moveContactPhone').val(expedient.moveContactPhone);
            }   
        });
    }

    if(expedient.moveLeavingDate != null){
        $('#formEditExpedient #moveLeavingDate').val(moment(expedient.moveLeavingDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }

    if(expedient.moveLeavingTime != null){
        $('#formEditExpedient #moveLeavingTime').val(moment(expedient.moveLeavingTime, "HH:mm:ss").format("HH:mm"));
    }

    if(expedient.moveCollectionProvince == null){
        $("#formEditExpedient #moveCollectionProvince option[value='']").attr('disabled', false)
        $('#moveCollection').prop('disabled', true)
    }else{
        moveCollectionProvince = expedient.moveCollectionProvince
        $("#formEditExpedient #moveCollectionProvince option[value='']").attr('disabled', true)
        $('#formEditExpedient #moveCollectionProvince').val(expedient.moveCollectionProvince)
        $('#moveCollection').prop('disabled', false)
    }
    if(expedient.moveCollection != null){
        $('#formEditExpedient #moveCollection').prop('disabled', false)
        if($('#formEditExpedient #moveCollection').find("option[value='" + expedient.moveCollection + "']").length){
            $('#formEditExpedient #moveCollection').val(expedient.moveCollection).trigger('change')
        }else{ 
            var newOption = new Option(expedient.moveCollectionName + ' - ' + expedient.moveCollectionPostalCode, expedient.moveCollection, true, true)
            $('#formEditExpedient #moveCollection').append(newOption).trigger('change')
        }
    }
    if(expedient.moveDestinationProvince == null){
        $("#formEditExpedient #moveDestinationProvince option[value='']").attr('disabled', false)
        $('#moveDestination').prop('disabled', true)
    }else{
        moveDestinationProvince = expedient.moveDestinationProvince
        $("#formEditExpedient #moveDestinationProvince option[value='']").attr('disabled', true)
        $('#formEditExpedient #moveDestinationProvince').val(expedient.moveDestinationProvince)
        $('#moveDestination').prop('disabled', false)
    }
    if(expedient.moveDestination != null){
        $('#formEditExpedient #moveDestination').prop('disabled', false)
        if($('#formEditExpedient #moveDestination').find("option[value='" + expedient.moveDestination + "']").length){
            $('#formEditExpedient #moveDestination').val(expedient.moveDestination).trigger('change')
        }else{ 
            var newOption = new Option(expedient.moveDestinationName + ' - ' + expedient.moveDestinationPostalCode, expedient.moveDestination, true, true)
            $('#formEditExpedient #moveDestination').append(newOption).trigger('change')
        }
    }
    $('#formEditExpedient #moveVia').val(expedient.moveVia);
    if(expedient.moveCollectionAddress != null){
        $('#formEditExpedient #moveCollectionAddress').val(expedient.moveCollectionAddress);
    }
    if(expedient.moveDestinationAddress != null){
        $('#formEditExpedient #moveDestinationAddress').val(expedient.moveDestinationAddress);
    }
    if(expedient.moveFinalDestination != null){        
        $('#formEditExpedient #moveFinalDestination').val(expedient.moveFinalDestination);
    }
    if(expedient.flightNumber != null && expedient.flightNumber != 'null'){        
        $('#formEditExpedient #flightNumber').val(expedient.flightNumber);
    }
    if(expedient.airportOrigin != null && expedient.airportOrigin != 'null'){        
        $('#formEditExpedient #airportOrigin').val(expedient.airportOrigin);
    }
    if(expedient.departureDate != null){        
        $('#formEditExpedient #departureDate').val(moment(expedient.departureDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.departureTime != null){        
        $('#formEditExpedient #departureTime').val(moment(expedient.departureTime, "X").format("HH:mm"));
    }
    if(expedient.arrivalAirport != null && expedient.arrivalAirport != 'null'){        
        $('#formEditExpedient #arrivalAirport').val(expedient.arrivalAirport);
    }
    if(expedient.arrivalDate != null){        
        $('#formEditExpedient #arrivalDate').val(moment(expedient.arrivalDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    if(expedient.arrivalTime != null){        
        $('#formEditExpedient #arrivalTime').val(moment(expedient.arrivalTime, "X").format("HH:mm"));
    }
    if(expedient.agency != null && expedient.agency != 'null'){        
        $('#formEditExpedient #agency').val(expedient.agency);
    }
    if(expedient.agencyContact != null && expedient.agencyContact != 'null'){        
        $('#formEditExpedient #agencyContact').val(expedient.agencyContact);
    }
    if(expedient.agencyContactPhone != null && expedient.agencyContactPhone != 'null'){        
        $('#formEditExpedient #agencyContactPhone').val(expedient.agencyContactPhone);
    }

    if(expedient.moveJudicial=='1'){
        $('#formEditExpedient #moveJudicial').val(1);
        $('#formEditExpedient .moveJudicial.minimal').iCheck('check');
    }else{
        $('#formEditExpedient #moveJudicial').val(0);
        $('#formEditExpedient .moveJudicial.minimal').iCheck('uncheck');
    }
    if(expedient.moveTraslado=='1'){
        $('#formEditExpedient #moveTraslado').val(1);
        $('#formEditExpedient .moveTraslado.minimal').iCheck('check');
    }else{
        $('#formEditExpedient #moveTraslado').val(0);
        $('#formEditExpedient .moveTraslado.minimal').iCheck('uncheck');
    }
    if(expedient.moveDevolucion=='1'){
        $('#formEditExpedient #moveDevolucion').val(1);
        $('#formEditExpedient .moveDevolucion.minimal').iCheck('check');
    }else{
        $('#formEditExpedient #moveDevolucion').val(0);
        $('#formEditExpedient .moveDevolucion.minimal').iCheck('uncheck');
    }

    $('#formEditExpedient #moveNotes').val(expedient.moveNotes);

    // Vehiculo de traslado
    if(expedient.carCollection2 != null){
        if($('[id="carCollection2"]').find("option[value='" + expedient.carCollection2 + "']").length) {
            $('[id="carCollection2"]').val(expedient.carCollection2).trigger('change');
        }else{
            var newOption = new Option(expedient.carBrand2 + " - " + expedient.carModel2 + " - " + expedient.carLicense2, expedient.carCollection2, true, true);
            $('[id="carCollection2"]').append(newOption).trigger('change');
        }
    }

    // Personal de traslado 1
    if(expedient.staffTransfer1 != null){
        if($('#staffTransfer1').find("option[value='" + expedient.staffTransfer1 + "']").length) {
            $('#staffTransfer1').val(expedient.staffTransfer1).trigger('change');
        }else { 
            var newOption = new Option(expedient.staffTransfer1Name, expedient.staffTransfer1, true, true);
            $('#staffTransfer1').append(newOption).trigger('change');
        }
    }

    // Personal de traslado 2
    if(expedient.staffTransfer2 != null){
        if($('#staffTransfer2').find("option[value='" + expedient.staffTransfer2 + "']").length) {
            $('#staffTransfer2').val(expedient.staffTransfer2).trigger('change');
        }else { 
            var newOption = new Option(expedient.staffTransfer2Name, expedient.staffTransfer2, true, true);
            $('#staffTransfer2').append(newOption).trigger('change');
        }
    }

    $('#formEditExpedient #notesExpedient').val(expedient.notesExpedient);

    $('#saveForm').click(function(){
        changeTabRef = null;

        if(
            hasTellmebye == 1 &&
            (
                $('#deceasedMortuary').val() != currentMortuary ||
                $('#tellmebyeRoom').val() != currentTellmebyeRoom
            )
        ){
            if(confirm('El tanatorio o la sala en Tellmebye seleccionados son diferentes a los que tiene asignados actualmente el expediente. Para que los cambios se efectúen en el Tellmebye, debes recargar la ficha de Tellmebye y guardar los datos. ¿Deseas continuar?')){
                saveForm();
            }
        }else{
            saveForm();
        }
    });

    changeTab = true;
    function saveForm(reloadFlag = true){
        var validate = true;
        //Datos expediente
        var requestTime = $('#requestTime').val();
        var requestDate = '';
        if($('#requestDate').val() != ''){
            requestDate = moment($('#requestDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var arriveDate = '';
        if($('#arriveDate').val() != ''){
            arriveDate = moment($('#arriveDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        
        var arriveTime = $('#formEditExpedient #arriveTime').val();
        var expType
        switch ($('#formEditExpedient #type').val()) {
            case 'Defunción':                
                expType = '1';
            break;
            case 'Presupuesto':                
                expType = '2';
            break;
            case 'Varios':                
                expType = '3';
            break;
        }
        var clientType = $('#clientType').val();
        var policy = $('#policy').val();
        var capital = $('#capital').val();
        var status = $('#status').val();
        var lossNumber = $('#lossNumber').val();
        var internalRef = $('#internalRef').val();
        var room = $('#room').is(':checked');
        var cremation = $('#cremation').is(':checked');
        var move = $('#move').is(':checked');
        var literal = $('#literal').is(':checked');

        //Datos Solicitante
        var applicantName = $('#applicantName').val();
        var applicantSurname = $('#applicantSurname').val();
        var applicantAddress = $('#applicantAddress').val();
        var applicantNIF = $('#applicantNIF').val();
        var applicantNifType = $('input[name="applicantNifType"]:checked').val()
        var applicantProvince = $('#applicantProvince').val();
        var applicantLocation = $('#applicantLocation').val();
        var applicantMail = $('#applicantMail').val();
        var applicantPhone = $('#applicantPhone').val();
        var applicantMobilePhone = $('#applicantMobilePhone').val();

        //Datos Contacto
        var familyContactName = $('#familyContactName').val();
        var familyContactSurname = $('#familyContactSurname').val();
        var familyContactAddress = $('#familyContactAddress').val();
        var familyContactNIF = $('#familyContactNIF').val();
        var familyContactNifType = $('input[name="familyContactNifType"]:checked').val()
        var familyContactProvince = $('#familyContactProvince').val();
        var familyContactLocation = $('#familyContactLocation').val();
        var familyContactMail = $('#familyContactMail').val();
        var familyContactPhone = $('#familyContactPhone').val();
        var familyContactMobilePhone = $('#familyContactMobilePhone').val();
        var familyContactNationality = $('#familyContactNationality').val();
        var familyContactRelationship = $('#familyContactRelationship').val();
        var familyContactOtherCountry = $('#familyContactOtherCountry').val();
        var familyContactOtherProvince = $('#familyContactOtherProvince').val();
        var familyContactOtherLocation = $('#familyContactOtherLocation').val();
        var otherContactName = $('#otherContactName').val();
        var otherContactPhone = $('#otherContactPhone').val();
        var otherContactRelationship = $('#otherContactRelationship').val();

        //Datos Difunto
        var deceasedName = $('#deceasedName').val();
        var deceasedSurname = $('#deceasedSurname').val();
        var deceasedNIF = $('#deceasedNIF').val();
        var deceasedNifType = $('input[name="deceasedNifType"]:checked').val();
        var deceasedGender = $('#deceasedGender').val();
        var deceasedMaritalStatus = $('#deceasedMaritalStatus').val();
        var deceasedMaritalStatusDescription = $('#deceasedMaritalStatusDescription').val();
        var deceasedChildOfFather = $('#deceasedChildOfFather').val();
        var deceasedChildOfMother = $('#deceasedChildOfMother').val();
        var deceasedFirstNuptials = $('#deceasedFirstNuptials').val();
        var deceasedSecondNuptials = $('#deceasedSecondNuptials').val();
        var deceasedNationality = $('#deceasedNationality').val();
        var deceasedNationalityName = $('#deceasedNationalityName').val();
        var deceasedNationalityProvince = $('#deceasedNationalityProvince').val();
        var deceasedNationalityLocation = $('#deceasedNationalityLocation').val();
        var deceasedBirthday = '';
        if($('#deceasedBirthday').val() != ''){
            deceasedBirthday = moment($('#deceasedBirthday').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var deceasedBirthdayProvince = $('#deceasedBirthdayProvince').val();
        var deceasedBirthdayLocation = $('#deceasedBirthdayLocation').val();
        var deceasedLocality = $('#deceasedLocality').val();
        var deceasedUsualAddress = $('#deceasedUsualAddress').val();
        var deceasedLocation = $('#deceasedLocation').val();
        var deceasedProvince = $('#deceasedProvince').val();
        var otherDeceasedLocation = $("#otherDeceasedLocation").val();
        var deceasedUsualAddress = $('#deceasedUsualAddress').val();
        var deceasedDate = '';
        if($('#deceasedDate').val() != ''){
            deceasedDate = moment($('#deceasedDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var deceasedTime = $('#deceasedTime').val();
        var deceasedDoctor = $('#deceasedDoctor').val();
        var deceasedDoctorCertificate = $('#deceasedDoctorCertificate').val();
        var deceasedCause = $('#deceasedCause').val();
        var deceasedTribunal = $('#deceasedTribunal').val();
        var deceasedTribunalNumber = $('#deceasedTribunalNumber').val();
        var deceasedMortuary = $('#deceasedMortuary').val();
        var deceasedMortuaryAddress = $('#deceasedMortuaryAddress').val();
        var deceasedRoom = $('#deceasedRoom').val();
        var tellmebyeRoom = $('#tellmebyeRoom').val() == null ? '' : $('#tellmebyeRoom').val();
        var tellmebyeRoomName = $('#tellmebyeRoom').val() == null ? '' : $('#tellmebyeRoom').select2('data')[0].text;
        var startVelacionDate = ''
        if($('#startVelacionDate').val() != ''){
            startVelacionDate = moment($('#startVelacionDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var startVelacionTime = $('#startVelacionTime').val();
        var endVelacionDate = ''
        if($('#endVelacionDate').val() != ''){
            endVelacionDate = moment($('#endVelacionDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var endVelacionTime = $('#endVelacionTime').val();

        var startVelacionDate2 = ''
        if($('#startVelacionDate2').val() != ''){
            startVelacionDate2 = moment($('#startVelacionDate2').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var startVelacionTime2 = $('#startVelacionTime2').val();
        var endVelacionDate2 = ''
        if($('#endVelacionDate2').val() != ''){
            endVelacionDate2 = moment($('#endVelacionDate2').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var endVelacionTime2 = $('#endVelacionTime2').val();

        //Datos Facturar
        var client = $('#client').val();

        //Datos Entierro
        var church = $('#church').val();
        var churchLabel = $('#churchLabel').val();
        var cemetery = $('#cemetery').val();
        var cemeteryLabel = $('#cemeteryLabel').val();
        var funeralDate = '';
        if($('#funeralDate').val() != ''){
            funeralDate = moment($('#funeralDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralTime = $('#funeralTime').val();

        var ceremonyDate = '';
        if($('#ceremonyDate').val() != ''){
            ceremonyDate = moment($('#ceremonyDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var ceremonyTime = $('#ceremonyTime').val();
        var funeralDateNew = '';
        if($('#funeralDateNew').val() != ''){
            funeralDateNew = moment($('#funeralDateNew').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralTimeNew = $('#funeralTimeNew').val();
        var funeralDateBurial = '';
        if($('#funeralDateBurial').val() != ''){
            funeralDateBurial = moment($('#funeralDateBurial').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralTimeBurial = $('#funeralTimeBurial').val();
        var niche = $('#niche').val();
        var funeralNicheNumber = $('#funeralNicheNumber').val();
        var regime = $('#regime').val();
        var propertyName = $('#propertyName').val();
        // 1
        var deceasedNiche = $('#deceasedNiche').val();
        var funeralDateNiche = '';
        if($('#funeralDateNiche').val() != ''){
            funeralDateNiche = moment($('#funeralDateNiche').val(), 'DD/MM/YYYY').format('X');
        }
        // 2
        var deceasedNiche2 = $('#deceasedNiche2').val();
        var funeralDateNiche2 = '';
        if($('#funeralDateNiche2').val() != ''){
            funeralDateNiche2 = moment($('#funeralDateNiche2').val(), 'DD/MM/YYYY').format('X');
        }
        // 3
        var deceasedNiche3 = $('#deceasedNiche3').val();
        var funeralDateNiche3 = '';
        if($('#funeralDateNiche3').val() != ''){
            funeralDateNiche3 = moment($('#funeralDateNiche3').val(), 'DD/MM/YYYY').format('X');
        }
        var exhumation = $('#exhumation').val();
        var nicheHeight = $('#nicheHeight').val();
        var funeralBusyNiche = $('#funeralBusyNiche').is(':checked');
        var deceasedPanel = $('#deceasedPanel').is(':checked');
        var otherCeremony = $('#otherCeremony').val();
        var otherInhumation = $('#otherInhumation').val();

        // Datos de Personal
        var funeralHomeService = $('#funeralHomeService').val();
        if(funeralHomeService == null){
            funeralHomeService = "null";
        }

        var familyAssistance = $('#familyAssistance').val();
        if(familyAssistance == null){
            familyAssistance = "null";
        }

        var carCollection1 = $('#carCollection1').val();
        if(carCollection1 == null){
            carCollection1 = "null";
        }

        var corpseCollection1 = $('#corpseCollection1').val();
        if(corpseCollection1 == null || corpseCollection1 == '--'){
            corpseCollection1 = "null";
        }

        var corpseCollection2 = $('#corpseCollection2').val();
        if(corpseCollection2 == null || corpseCollection2 == '--'){
            corpseCollection2 = "null";
        }

        var hearse = $('#hearse').val();

        var placeDestinationMiddle = $('#placeDestinationMiddle').val();

        var placeDestinationFinal = '';
        var placeDestinationFinalCemetery = '';
        if($('#placeDestinationSearch').prop('checked')){
            placeDestinationFinal = $('#placeDestinationFinal').val();
        }else{
            placeDestinationFinalCemetery = $("#placeDestinationFinalCemetery").val(); 
        }

        //Datos Entrada
        var funeralHome = $('#funeralHome').val();
        var funeralHomeEntryDate = '';
        if($('#funeralHomeEntryDate').val() != ''){
            funeralHomeEntryDate = moment($('#funeralHomeEntryDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var funeralHomeEntryTime = $('#funeralHomeEntryTime').val();
        var responsibleUser = $('#responsibleUser').val();
        var responsibleName = $('#responsibleName').val();
        var responsibleNIF = $('#responsibleNIF').val();
        var coffin = $('#coffin').val();
        var otherCoffin = $('#otherCoffin').val();
        var mortuaryReg = $('#mortuaryReg').is(':checked');
        var funeralReg = $('#funeralReg').is(':checked');
        var personalReg = $('#personalReg').is(':checked');
        var crematoriumReg = $('#crematoriumReg').is(':checked');
        var tanatologicalPractice = $('#tanatologicalPractice').val();
        var carCollection1LicensePlate = $('#carCollection1LicensePlate').val();
        var carCollection1Brand = $('#carCollection1Brand').val();
        var carCollection1Model = $('#carCollection1Model').val();
        var hearseLicensePlate = $('#hearseLicensePlate').val();
        var hearseBrand = $('#hearseBrand').val();
        var hearseModel = $('#hearseModel').val();
        var mortuaryRegNotes = $('#mortuaryRegNotes').val();

        // Fecha y hora entrada en tumulo
        var entryDateBarrow = '';
        if($('#entryDateBarrow').val() != ''){
            entryDateBarrow = moment($('#entryDateBarrow').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var entryTimeBarrow = $('#entryTimeBarrow').val();

        // Camara refrigerada
        var refrigeratedChamberName = $('#refrigeratedChamberName').val();
        // Fecha y hora entrada en camara
        var refrigeratedChamberDateStart = '';
        if($('#refrigeratedChamberDateStart').val() != ''){
            refrigeratedChamberDateStart = moment($('#refrigeratedChamberDateStart').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var refrigeratedChamberTimeStart = $('#refrigeratedChamberTimeStart').val();
        // Fecha y hora salida de camara
        var refrigeratedChamberDateEnd = '';
        if($('#refrigeratedChamberDateEnd').val() != ''){
            refrigeratedChamberDateEnd = moment($('#refrigeratedChamberDateEnd').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var refrigeratedChamberTimeEnd = $('#refrigeratedChamberTimeEnd').val();

        //Datos Cremación
        var crematorium = $('#crematorium').val();
        var crematoriumStatus = $('#crematoriumStatus').val();
        var crematoriumEntryDate = '';
        if($('#crematoriumEntryDate').val() != ''){
            crematoriumEntryDate = moment($('#crematoriumEntryDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var crematoriumEntryTime = $('#crematoriumEntryTime').val();
        var crematoriumArriveTime = $('#crematoriumArriveTime').val();
        var crematoriumLeavingDate = '';
        if($('#crematoriumLeavingDate').val() != ''){
            crematoriumLeavingDate = moment($('#crematoriumLeavingDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var crematoriumLeavingTime = $('#crematoriumLeavingTime').val();
        var crematoriumClient = $('#crematoriumClient').val();
        var crematoriumContactPersonPhone = $('#crematoriumContactPersonPhone').val();
        var crematoriumContactPerson = $('#crematoriumContactPerson').val();
        var crematoriumTechnical = $('#crematoriumTechnical').val();
        var crematoriumIntroduction = $('#crematoriumIntroduction').is(':checked');
        var crematoriumWaitOnRoom = $('#crematoriumWaitOnRoom').is(':checked');
        var crematoriumVaseBio = $('#crematoriumVaseBio').is(':checked');
        var crematoriumPacemaker = $('#crematoriumPacemaker').is(':checked');
        var ecologicCoffin = $('#ecologicCoffin').is(':checked');
        var authName = $('#authName').val();
        var authDni = $('#authDni').val();
        var authNifType = $('input[name="authDniType"]:checked').val()
        var authDate = $('#authDate').val() == '' ? null : moment($('#authDate').val(), 'DD/MM/YYYY').format('X')
        var authTime = $('#authTime').val() == '' ? null : moment($('#authTime').val(), 'HH:mm').format('X')
        var authPlace = $('#authPlace').val()
        var crematoriumContactPhonePerson = $('#formEditExpedient #crematoriumContactPhonePerson').val();
        var authContactPhone = $('#formEditExpedient #authContactPhone').val();
        var trazabilityId = $('#formEditExpedient #trazabilityId').val();
        var changeTrazabilityID = $('#formEditExpedient #trazabilityId').val() == defaultTrazabilityID ? false : true;

        // Smoke Opacity
        var smokeOpacityDateStart = $('#smokeOpacityDateStart').val() == '' ? null : moment($('#smokeOpacityDateStart').val(), 'DD/MM/YYYY').format('X')
        var smokeOpacityTimeStart = $('#smokeOpacityTimeStart').val() == '' ? null : moment($('#smokeOpacityDateStart').val() + ' ' + $('#smokeOpacityTimeStart').val(), 'DD/MM/YYYY HH:mm').format('X')
        var smokeOpacityDateEnd = $('#smokeOpacityDateEnd').val() == '' ? null : moment($('#smokeOpacityDateEnd').val(), 'DD/MM/YYYY').format('X')
        var smokeOpacityTimeEnd = $('#smokeOpacityTimeEnd').val() == '' ? null : moment($('#smokeOpacityDateEnd').val() + ' ' + $('#smokeOpacityTimeEnd').val(), 'DD/MM/YYYY HH:mm').format('X')
        var smokeOpacityLoadWeight = $('#smokeOpacityLoadWeight').val();
        var smokeOpacityBacharachScale = $('#smokeOpacityBacharachScale').val();
        var smokeOpacityDateReading = $('#smokeOpacityDateReading').val() == '' ? null : moment($('#smokeOpacityDateReading').val(), 'DD/MM/YYYY').format('X')
        var smokeOpacityTimeReading = $('#smokeOpacityTimeReading').val() == '' ? null : moment($('#smokeOpacityDateReading').val() + ' ' + $('#smokeOpacityTimeReading').val(), 'DD/MM/YYYY HH:mm').format('X')
        var smokeOpacityIncidents = $('#smokeOpacityIncidents').val();
        var smokeOpacityIncidentsNotes = $('#smokeOpacityIncidentsNotes').val();

        //Datos Traslado
        var moveFuneralHome = $('#moveFuneralHome').val();
        var moveClient = "";
        var moveContactPerson = $('#moveContactPerson').val();
        var moveContactPhone = $('#moveContactPhone').val();
        var moveLeavingDate = '';
        if($('#moveLeavingDate').val() != ''){
            moveLeavingDate = moment($('#moveLeavingDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var moveLeavingTime = $('#moveLeavingTime').val();
        var moveCollection = $('#moveCollection').val();
        var moveDestination = $('#moveDestination').val();
        var moveDestinationAddress = $('#moveDestinationAddress').val();
        var moveFinalDestination = $('#moveFinalDestination').val();
        var moveVia = $('#moveVia').val();
        var moveNotes = $('#moveNotes').val();
        var moveCollectionAddress = $('#moveCollectionAddress').val();
        var moveJudicial = $('#moveJudicial').is(':checked');
        var moveTraslado = $('#moveTraslado').is(':checked');
        var moveDevolucion = $('#moveDevolucion').is(':checked');
        
        var flightNumber = $('#flightNumber').val();
        var airportOrigin = $('#airportOrigin').val();

        var departureDate = '';
        if($('#departureDate').val() != ''){
            departureDate = moment($('#departureDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var departureTime = $('#departureTime').val() == '' ? null : moment($('#departureTime').val(), 'HH:mm').format('X')
        var arrivalAirport = $('#arrivalAirport').val();
        
        var arrivalDate = '';
        if($('#arrivalDate').val() != ''){
            arrivalDate = moment($('#arrivalDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        var arrivalTime = $('#arrivalTime').val() == '' ? null : moment($('#arrivalTime').val(), 'HH:mm').format('X')
        var agency = $('#agency').val();
        var agencyContact = $('#agencyContact').val();
        var agencyContactPhone = $('#agencyContactPhone').val();

        var covid = $('#covid').prop('checked') ? 1 : 0

        var carCollection2 = $('#carCollection2').val();
        if(carCollection2 == null){
            carCollection2 = "null";
        }

        var staffTransfer1 = $('#staffTransfer1').val();
        if(staffTransfer1 == null || staffTransfer1 == '--'){
            staffTransfer1 = "null";
        }

        var staffTransfer2 = $('#staffTransfer2').val();
        if(staffTransfer2 == null || staffTransfer2 == '--'){
            staffTransfer2 = "null";
        }

        var notesExpedient = $('#notesExpedient').val();
    
        if(validate){
            //validaciones traslado
            if($("#moveContactPhone").val() != ""){
                if(!isPhone($("#moveContactPhone"))){
                    validate = false;
                }
            }
            if($("#crematoriumContactPhonePerson").val() != ""){                
                if(!isPhone($("#crematoriumContactPhonePerson"))){
                    validate = false;
                }
            }
            if($("#authContactPhone").val() != ""){
                if(!isPhone($("#authContactPhone"))){
                    validate = false;
                }
            }
            if($("#departureTime").val() != ''){
                if(!isTime($("#departureTime"))){            
                    validate = false;
                }
            }
            if($("#arrivalTime").val() != ''){
                if(!isTime($("#arrivalTime"))){            
                    validate = false;
                }
            }
            if($("#crematoriumContactPersonPhone").val() != "" && !isPhone($("#crematoriumContactPersonPhone"))){
                validate = false;               
            }

            //Validaciones expediente
            if(!isTime($("#requestTime"))){
                validate = false;
            }
            if(!isDate($("#requestDate"))){
                validate = false;
            }
            // if(!isDate($("#arriveDate"))){
            //     validate = false;
            // }

            //Validaciones solicitante
            if(isEmpty($("#applicantName"))){
                validate = false;
            }
            if(isEmpty($("#expType"))){
                validate = false;
            }

            $('#applicantNIFError').hide()
            $('#applicantNIF').removeClass('validateError')

            if( $('#applicantNIF').val() !== ''){
                if($('input[name="applicantNifType"]:checked').val() == "1" || $('input[name="applicantNifType"]:checked').val() == "2"){
                    if(isEmpty($("#applicantNIF"))){
                        validate = false;
                    }else{
                        if(!isNifCif($("#applicantNIF"))){
                            validate = false;
                        }
                    }
                }
            }
           
            if($("#applicantMail").val() != "" && !isMail($("#applicantMail"))){
                validate = false;
            }
            if($("#applicantPhone").val() != "" && !isPhone($("#applicantPhone"))){
                validate = false;
            }
            if($("#applicantMobilePhone").val() != "" && !isPhone($("#applicantMobilePhone"))){
                validate = false;
            }
            
            //Validaciones Contacto
            $('#familyContactNIFError').hide()
            $('#familyContactNIF').removeClass('validateError')

            if( $('#familyContactNIF').val() !== ''){
                if($('input[name="familyContactNifType"]:checked').val() == "1" || $('input[name="familyContactNifType"]:checked').val() == "2"){
                    if(isEmpty($("#familyContactNIF"))){
                        validate = false;
                    }else{
                        if(!isNifCif($("#familyContactNIF"))){
                            validate = false;
                        }
                    }
                }
            }

            if($("#familyContactMail").val() != "" && !isMail($("#familyContactMail"))){
                validate = false;
            }
            if($("#familyContactPhone").val() != "" && !isPhone($("#familyContactPhone"))){
                validate = false;
            }
            if($("#familyContactMobilePhone").val() != "" && !isPhone($("#familyContactMobilePhone"))){
                validate = false;
            }
            if($("#otherContactPhone").val() != "" && !isPhone($("#otherContactPhone"))){
                validate = false;
            }

            //Validaciones Difunto
            $('#deceasedNIFError').hide()
            $('#deceasedNIF').removeClass('validateError')

            if( $('#deceasedNIF').val() !== ''){
                if($('input[name="deceasedNifType"]:checked').val() == "1" || $('input[name="deceasedNifType"]:checked').val() == "2"){
                    if(isEmpty($("#deceasedNIF"))){
                        validate = false;
                    }else{
                        if(!isNifCif($("#deceasedNIF"))){
                            validate = false;
                        }
                    }
                }
            }

            if($('#responsibleNIF').val() !== ''){
                if(isEmpty($('#responsibleNIF'))){
                    validate = false;
                }else{
                    if(!isNifCif($('#responsibleNIF'))){
                        validate = false
                    }
                }
            }

            $('#startVelacionDateError').hide()
            $('#startVelacionDate').removeClass('validateError')

            $('#startVelacionTimeError').hide()
            $('#startVelacionTime').removeClass('validateError')

            $('#endVelacionDateError').hide()
            $('#endVelacionDate').removeClass('validateError')

            $('#endVelacionTimeError').hide()
            $('#endVelacionTime').removeClass('validateError')

            $('#startVelacionDate2Error').hide()
            $('#startVelacionDate2').removeClass('validateError')

            $('#startVelacionTime2Error').hide()
            $('#startVelacionTime2').removeClass('validateError')

            $('#endVelacionDate2Error').hide()
            $('#endVelacionDate2').removeClass('validateError')

            $('#endVelacionTime2Error').hide()
            $('#endVelacionTime2').removeClass('validateError')

            //Validaciones Velacion
            if($("#startVelacionDate").val() != '' && $("#startVelacionTime").val() == ''){
                if(isEmpty($('#startVelacionTime'))){
                    validate = false;
                }
            }

            if($("#startVelacionDate").val() == '' && $("#startVelacionTime").val() != ''){
                if(isEmpty($('#startVelacionDate'))){
                    validate = false;
                }
            }

            if($("#endVelacionDate").val() != '' && $("#endVelacionTime").val() == ''){
                if(isEmpty($('#endVelacionTime'))){
                    validate = false;
                }
            }

            if($("#endVelacionDate").val() == '' && $("#endVelacionTime").val() != ''){
                if(isEmpty($('#endVelacionDate'))){
                    validate = false;
                }
            }

            if($("#startVelacionDate2").val() != '' && $("#startVelacionTime2").val() == ''){
                if(isEmpty($('#startVelacionTime2'))){
                    validate = false;
                }
            }

            if($("#startVelacionDate2").val() == '' && $("#startVelacionTime2").val() != ''){
                if(isEmpty($('#startVelacionDate2'))){
                    validate = false;
                }
            }
            
            if($("#endVelacionDate2").val() != '' && $("#endVelacionTime2").val() == ''){
                if(isEmpty($('#endVelacionTime2'))){
                    validate = false;
                }
            }

            if($("#endVelacionDate2").val() == '' && $("#endVelacionTime2").val() != ''){
                if(isEmpty($('#endVelacionDate2'))){
                    validate = false;
                }
            }

            //Validaciones Cremación
            if(cremation){
                if(isEmpty($("#formEditExpedient #crematorium"))){
                    validate = false;
                }
                if(isEmpty($("#formEditExpedient #crematoriumStatus"))){
                    validate = false;
                }
                if(!isDate($("#formEditExpedient #crematoriumEntryDate"))){
                    validate = false;
                }
                if(!isTime($("#formEditExpedient #crematoriumEntryTime"))){
                    validate = false;
                }
                if(!isDate($("#formEditExpedient #crematoriumLeavingDate"))){
                    validate = false;
                }
                if(!isTime($("#formEditExpedient #crematoriumLeavingTime"))){
                    validate = false;
                }
                if(isEmpty($("#formEditExpedient #crematoriumClient"))){
                    validate = false;
                }
                $('#authDniError').hide()
                $('#authDni').removeClass('validateError')
        
                if( $('#authDni').val() !== ''){
                    if($('input[name="authDniType"]:checked').val() == "1" || $('input[name="authDniType"]:checked').val() == "2"){
                        if(isEmpty($("#authDni"))){
                            validate = false;
                        }else{
                            if(!isNifCif($("#authDni"))){
                                validate = false;
                            }
                        }
                    }
                }
            }

            // Validaciones Libro de Registros
            if($('#mortuaryReg').is(':checked')){
                if($("#carCollection1").val() == 0){
                    if(isEmpty($('#carCollection1LicensePlate'))){
                        validate = false;
                    }
                    if(isEmpty($('#carCollection1Brand'))){
                        validate = false;
                    }
                    if(isEmpty($('#carCollection1Model'))){
                        validate = false;
                    }
                }

                if($("#hearse").val() == 0){
                    if(isEmpty($('#hearseLicensePlate'))){
                        validate = false;
                    }
                    if(isEmpty($('#hearseBrand'))){
                        validate = false;
                    }
                    if(isEmpty($('#hearseModel'))){
                        validate = false;
                    }
                }
            }

            changeTab = validate;
            flag = false
            if(validate){
                if($('#cremation').is(':checked')){
                    // COMPRUEBA SI YA HAY UNA CREMACIÓN PARA ESA FECHA Y HORA
                    var crematorium = $("#formEditExpedient #crematorium").val();
                    var crematoriumEntry = moment($('#formEditExpedient #crematoriumEntryDate').val() + ' ' + $('#formEditExpedient #crematoriumEntryTime').val(), 'DD/MM/YYYY HH:mm').format('X')
                    var crematoriumLeaving = moment($('#formEditExpedient #crematoriumLeavingDate').val() + ' ' + $('#formEditExpedient #crematoriumLeavingTime').val(), 'DD/MM/YYYY HH:mm').format('X')
    
                    var busy = checkCremationBusy(crematoriumEntry, crematoriumLeaving, expedientID, crematorium)
                    if(busy){
                        validate = false
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya hay una cremación en ese crematorio para la fecha y hora seleccionadas</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                            $("#saveForm").attr('disabled', false);
                        }, 5000)
                    }else{
                        flag = true;
                    }
                }
                if(validate){
                    var reponseUpdate = false;
                    $.ajax({
                        url : uri + 'core/expedients/expedient/update.php',
                        method : 'POST',
                        data : {
                            expedientID : expedientID, arriveTime: arriveTime, requestTime: requestTime, requestDate: requestDate, arriveDate: arriveDate, expType: expType, clientType: clientType, status: status, policy: policy, lossNumber: lossNumber, internalRef: internalRef, 
                            capital: capital, room: room, cremation: cremation, move: move, literal: literal, applicantName: applicantName, applicantSurname: applicantSurname,
                            applicantAddress: applicantAddress, applicantNIF: applicantNIF, applicantLocation: applicantLocation, applicantMail: applicantMail,
                            applicantPhone: applicantPhone, applicantMobilePhone: applicantMobilePhone, familyContactName: familyContactName, familyContactSurname: familyContactSurname,
                            familyContactAddress: familyContactAddress, familyContactNIF: familyContactNIF, familyContactLocation: familyContactLocation, familyContactMail: familyContactMail,
                            familyContactPhone: familyContactPhone, familyContactMobilePhone: familyContactMobilePhone, 
                            familyContactNationality: familyContactNationality, familyContactRelationship: familyContactRelationship, familyContactOtherCountry: familyContactOtherCountry, familyContactOtherProvince: familyContactOtherProvince,
                            familyContactOtherLocation: familyContactOtherLocation,
                            otherContactName: otherContactName, otherContactPhone: otherContactPhone,
                            otherContactRelationship: otherContactRelationship, client: client, deceasedName: deceasedName, deceasedSurname: deceasedSurname, deceasedNIF: deceasedNIF, 
                            deceasedGender: deceasedGender, deceasedMaritalStatus: deceasedMaritalStatus, deceasedMaritalStatusDescription: deceasedMaritalStatusDescription, deceasedChildOfFather: deceasedChildOfFather, deceasedChildOfMother: deceasedChildOfMother,
                            deceasedFirstNuptials: deceasedFirstNuptials, deceasedSecondNuptials: deceasedSecondNuptials, deceasedNationality: deceasedNationality, deceasedNationalityName: deceasedNationalityName,
                            deceasedNationalityProvince: deceasedNationalityProvince, deceasedNationalityLocation: deceasedNationalityLocation,
                            deceasedBirthday: deceasedBirthday, deceasedBirthdayProvince: deceasedBirthdayProvince, deceasedBirthdayLocation: deceasedBirthdayLocation, deceasedLocality: deceasedLocality, deceasedProvince: deceasedProvince,
                            deceasedUsualAddress: deceasedUsualAddress, deceasedLocation: deceasedLocation, otherDeceasedLocation: otherDeceasedLocation, deceasedDate: deceasedDate, deceasedTime: deceasedTime, 
                            deceasedDoctor: deceasedDoctor, deceasedDoctorCertificate: deceasedDoctorCertificate, deceasedCause: deceasedCause, deceasedTribunal: deceasedTribunal, deceasedTribunalNumber: deceasedTribunalNumber,
                            deceasedMortuary: deceasedMortuary, deceasedMortuaryAddress: deceasedMortuaryAddress, deceasedRoom: deceasedRoom, tellmebyeRoom: tellmebyeRoom, tellmebyeRoomName: tellmebyeRoomName,
                            deceasedPanel: deceasedPanel, church: church, cemetery: cemetery, funeralDate: funeralDate,
                            funeralTime: funeralTime, ceremonyDate: ceremonyDate, ceremonyTime: ceremonyTime, funeralDateNew: funeralDateNew, funeralTimeNew: funeralTimeNew, funeralDateBurial: funeralDateBurial, funeralTimeBurial: funeralTimeBurial, 
                            niche: niche, funeralNicheNumber: funeralNicheNumber, funeralBusyNiche: funeralBusyNiche, regime: regime, propertyName: propertyName, 
                            deceasedNiche: deceasedNiche, funeralDateNiche: funeralDateNiche, deceasedNiche2: deceasedNiche2, funeralDateNiche2: funeralDateNiche2, deceasedNiche3: deceasedNiche3, funeralDateNiche3: funeralDateNiche3,
                            exhumation: exhumation, nicheHeight: nicheHeight, mortuaryReg: mortuaryReg, funeralReg: funeralReg, personalReg: personalReg, 
                            crematoriumReg: crematoriumReg, tanatologicalPractice: tanatologicalPractice, funeralHome: funeralHome, funeralHomeEntryDate: funeralHomeEntryDate, funeralHomeEntryTime: funeralHomeEntryTime, entryDateBarrow: entryDateBarrow, entryTimeBarrow: entryTimeBarrow, 
                             refrigeratedChamberName: refrigeratedChamberName, refrigeratedChamberDateStart: refrigeratedChamberDateStart, refrigeratedChamberTimeStart: refrigeratedChamberTimeStart, refrigeratedChamberDateEnd: refrigeratedChamberDateEnd, refrigeratedChamberTimeEnd: refrigeratedChamberTimeEnd,
                            coffin: coffin, responsibleUser: responsibleUser, responsibleName: responsibleName, responsibleNIF: responsibleNIF, crematorium: crematorium, crematoriumStatus: crematoriumStatus,
                            crematoriumEntryDate: crematoriumEntryDate, crematoriumEntryTime: crematoriumEntryTime, crematoriumLeavingDate: crematoriumLeavingDate, crematoriumArriveTime: crematoriumArriveTime, crematoriumLeavingTime: crematoriumLeavingTime, crematoriumClient: crematoriumClient,
                            crematoriumContactPersonPhone: crematoriumContactPersonPhone, crematoriumContactPerson: crematoriumContactPerson, crematoriumIntroduction: crematoriumIntroduction, 
                            crematoriumWaitOnRoom: crematoriumWaitOnRoom, crematoriumVaseBio: crematoriumVaseBio, moveFuneralHome: moveFuneralHome, moveClient: moveClient, moveLeavingDate: moveLeavingDate,
                            moveLeavingTime: moveLeavingTime, moveCollection: moveCollection, moveDestination: moveDestination, moveVia: moveVia, 
                            moveNotes: moveNotes, moveJudicial: moveJudicial, moveTraslado: moveTraslado, moveDevolucion: moveDevolucion, ecologicCoffin: ecologicCoffin, authName: authName, authDni: authDni, otherCoffin: otherCoffin, churchLabel: churchLabel, cemeteryLabel: cemeteryLabel,
                            authDate: authDate, authTime: authTime, authPlace: authPlace, smokeOpacityDateStart: smokeOpacityDateStart, smokeOpacityTimeStart: smokeOpacityTimeStart, smokeOpacityDateEnd: smokeOpacityDateEnd, smokeOpacityTimeEnd: smokeOpacityTimeEnd, 
                            smokeOpacityLoadWeight: smokeOpacityLoadWeight, smokeOpacityBacharachScale: smokeOpacityBacharachScale, smokeOpacityDateReading: smokeOpacityDateReading, smokeOpacityTimeReading: smokeOpacityTimeReading, smokeOpacityIncidents: smokeOpacityIncidents, smokeOpacityIncidentsNotes: smokeOpacityIncidentsNotes, 
                            crematoriumPacemaker: crematoriumPacemaker, crematoriumTechnical: crematoriumTechnical, moveContactPerson : moveContactPerson, moveContactPhone : moveContactPhone, moveDestinationAddress : moveDestinationAddress,
                            moveCollectionAddress : moveCollectionAddress, moveFinalDestination : moveFinalDestination, crematoriumContactPhonePerson : crematoriumContactPhonePerson, authContactPhone : authContactPhone,
                            flightNumber : flightNumber, airportOrigin : airportOrigin, departureDate: departureDate, departureTime : departureTime, arrivalAirport : arrivalAirport, arrivalDate: arrivalDate, arrivalTime : arrivalTime, agency : agency, agencyContact : agencyContact, agencyContactPhone : agencyContactPhone, otherCeremony:otherCeremony, otherInhumation:otherInhumation,
                            applicantNifType: applicantNifType, familyContactNifType: familyContactNifType, deceasedNifType: deceasedNifType, covid: covid, trazabilityId: trazabilityId, changeTrazabilityID:changeTrazabilityID, defaultTrazabilityID:defaultTrazabilityID, authNifType: authNifType, 
                            startVelacionDate: startVelacionDate, startVelacionTime: startVelacionTime, endVelacionDate: endVelacionDate, endVelacionTime: endVelacionTime,
                            startVelacionDate2: startVelacionDate2, startVelacionTime2: startVelacionTime2, endVelacionDate2: endVelacionDate2, endVelacionTime2: endVelacionTime2,
                            funeralHomeService : funeralHomeService, familyAssistance : familyAssistance, carCollection1 : carCollection1, carCollection1LicensePlate: carCollection1LicensePlate, carCollection1Brand: carCollection1Brand, carCollection1Model: carCollection1Model,
                            corpseCollection1 : corpseCollection1, corpseCollection2 : corpseCollection2,
                            carCollection2 : carCollection2, staffTransfer1 : staffTransfer1, staffTransfer2: staffTransfer2, 
                            hearse : hearse,  hearseLicensePlate: hearseLicensePlate, hearseBrand: hearseBrand, hearseModel: hearseModel, mortuaryRegNotes: mortuaryRegNotes,
                            placeDestinationMiddle: placeDestinationMiddle, placeDestinationFinal: placeDestinationFinal, placeDestinationFinalCemetery: placeDestinationFinalCemetery,
                            notesExpedient: notesExpedient, hasChanges: hasChanges
                        },
                        async: false,
                        success : function(data){
                            data = $.parseJSON(data);
                            if(data){
                                // Checks to upload emission file
                                if(
                                    (attachSmokeFile != null && attachSmokeFile.length > 0) ||
                                    (attachDeleteSmokeFileName != null && attachDeleteSmokeFileName != '')
                                ){
                                    var uploadResponse = updateSmokeDocument(data.expedient);

                                    if(uploadResponse[0] == false){
                                        var reasonFailed = uploadResponse[1] == null ? 'El expediente se ha actualizado correctamente pero ha ocurrido un error al subir el fichero adjunto.' : 'El fichero adjunto no ha podido subirse ya que la extensión proporcionada es incorrecta.';

                                        reponseUpdate = true;
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> '+reasonFailed+'</div>');
                                        setTimeout(function(){
                                            $('#block-message').empty()
                                            if(changeTabRef == null){
                                                if(reloadFlag){
                                                    if(
                                                        hasTellmebye == 1 &&
                                                        (
                                                            $('#deceasedMortuary').val() != currentMortuary ||
                                                            $('#tellmebyeRoom').val() != currentTellmebyeRoom
                                                        )
                                                    ){
                                                        window.location.href = uri + 'expediente/tellmebye/' + expedientID;
                                                    }else{
                                                        window.location.reload();
                                                    }
                                                }
                                            }else{
                                                window.location.href = changeTabRef;
                                            }
                                        }, 2000)
                                    }
                                }

                                reponseUpdate = true;
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El expediente ha sido modificado con éxito.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty();
                                    if(changeTabRef == null){
                                        if(reloadFlag){
                                            if(
                                                hasTellmebye == 1 &&
                                                (
                                                    $('#deceasedMortuary').val() != currentMortuary ||
                                                    $('#tellmebyeRoom').val() != currentTellmebyeRoom
                                                )
                                            ){
                                                window.location.href = uri + 'expediente/tellmebye/' + expedientID;
                                            }else{
                                                window.location.reload();
                                            }
                                        }
                                    }else{
                                        window.location.href = changeTabRef;
                                    }
                                }, 2000)
                            }else{
                                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error al guardar</div>')

                                setTimeout(function(){
                                    $('#block-message').empty();
                                }, 3500)
                            }
                        }
                    });
                }else{
                    if(flag != false){
                        $('#saveForm').attr('disabled', false);
                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos necesarios para la creación del expediente.</div>');
                        setTimeout(function(){
                            $('#block-message').empty();
                        }, 5000)
                    }
                }
            }else{
                $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

                setTimeout(function(){
                    $('#block-message').empty();
                }, 3500)
            }
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#block-message').empty();
            }, 3500)
        }

        return reponseUpdate;
    }

    $('#loadApplicant').click(function(){
        var applicantName = $('#applicantName').val();
        var applicantSurname = $('#applicantSurname').val();
        var applicantAddress = $('#applicantAddress').val();
        var applicantNIF = $('#applicantNIF').val();
        var applicantProvince = $('#applicantProvince').val();
        var applicantLocation = $('#applicantLocation').val();
        var applicantMail = $('#applicantMail').val();
        var applicantPhone = $('#applicantPhone').val();

        $('#formNewClient #name').val(applicantName);
        $('#formNewClient #surname').val(applicantSurname);
        $('#formNewClient #nif').val(applicantNIF);
        $('#formNewClient #address').val(applicantAddress);
        if(applicantProvince != ''){
            $('#formNewClient #province').val(applicantProvince);
            $('#formNewClient #location').prop('disabled', false)
            $('#formNewClient #location').val('').trigger('change')
            $('#formNewClient #location').val(applicantLocation);

            if(applicantLocation != null){
                var locationData = getLocation(applicantLocation)
                var locationName = locationData[0].name
                var locationPostalCode = locationData[0].postalCode
                if($('#formNewClient #location').find("option[value='" + applicantLocation + "']").length){
                    $('#formNewClient #location').val(applicantLocation).trigger('change')
                }else{ 
                    var newOption = new Option(locationName + ' - ' + locationPostalCode, applicantLocation, true, true)
                    $('#formNewClient #location').append(newOption).trigger('change')
                }
            }
        }
        $('#formNewClient #mail').val(applicantMail);
        if(applicantPhone != ''){
            $('#formNewClient #phone').val(applicantPhone)
            $('#formNewClient .btn-add-phone').click()
        }
    })

    $('#loadFamilyContact').click(function(){
        var familyContactName = $('#familyContactName').val();
        var familyContactSurname = $('#familyContactSurname').val();
        var familyContactAddress = $('#familyContactAddress').val();
        var familyContactNIF = $('#familyContactNIF').val();
        var familyContactProvince = $('#familyContactProvince').val();
        var familyContactLocation = $('#familyContactLocation').val();
        var familyContactMail = $('#familyContactMail').val();
        var familyContactPhone = $('#familyContactPhone').val();

        $('#formNewClient #name').val(familyContactName);
        $('#formNewClient #surname').val(familyContactSurname);
        $('#formNewClient #nif').val(familyContactNIF);
        $('#formNewClient #address').val(familyContactAddress);
        if(familyContactProvince != ''){
            $('#formNewClient #province').val(familyContactProvince);
            $('#formNewClient #location').prop('disabled', false)
            $('#formNewClient #location').val('').trigger('change')
            $('#formNewClient #location').val(familyContactLocation);

            if(familyContactLocation != null){
                var locationData = getLocation(familyContactLocation)
                var locationName = locationData[0].name
                var locationPostalCode = locationData[0].postalCode
                if($('#formNewClient #location').find("option[value='" + familyContactLocation + "']").length){
                    $('#formNewClient #location').val(familyContactLocation).trigger('change')
                }else{ 
                    var newOption = new Option(locationName + ' - ' + locationPostalCode, familyContactLocation, true, true)
                    $('#formNewClient #location').append(newOption).trigger('change')
                }
            }
        }
        $('#formNewClient #mail').val(familyContactMail);
        if(familyContactPhone != ''){
            $('#formNewClient #phone').val(familyContactPhone)
            $('#formNewClient .btn-add-phone').click()
        }
    })

    $('#loadDeceased').click(function(){
        var deceasedName = $('#deceasedName').val();
        var deceasedSurname = $('#deceasedSurname').val();
        var deceasedAddress = $('#deceasedUsualAddress').val();
        var deceasedNIF = $('#deceasedNIF').val();
        var deceasedProvince = $('#deceasedProvince').val();

        $('#formNewClient #name').val(deceasedName);
        $('#formNewClient #surname').val(deceasedSurname);
        $('#formNewClient #nif').val(deceasedNIF);
        $('#formNewClient #address').val(deceasedAddress);
        if(deceasedProvince != ''){
            deceasedProvince = deceasedProvince
            $('#formNewClient #province').val(deceasedProvince).trigger('change');
        }
    })

    // DATOS DE LA TARIFA
    $('#modal-new-client #price').select2({
        containerCssClass: 'select2-price',
        language: langSelect2,
        placeholder: 'Seleccione una tarifa',
        allowClear: true,
        ajax: {
            url: uri+'core/prices/dataCompanies.php',
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
                            id: item.priceID
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

    $('#modal-new-client #type').change(function(){
        $('#modal-new-client #obituaryAnniversaryReminder').iCheck('uncheck');
        
        if($(this).val() != null){
            if($(this).val() == 1){
                $('#modal-new-client #prices').addClass('hide');
                $('#modal-new-client #obituaryAnniversaryReminderSection').addClass('hide');
            }else{
                $('#modal-new-client #prices').removeClass('hide');
                $('#modal-new-client #obituaryAnniversaryReminderSection').removeClass('hide');
            }
        }else{
            $('#modal-new-client #prices').addClass('hide');
        }
    })

    $('#saveNewClient').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewClient #name'))){
            validate++;
        }
        if(isEmpty($('#formNewClient #nif'))){
            validate++;
        }else{
            if(
                $('#modal-new-client #authNifType1').prop('checked') ||
                $('#modal-new-client #authNifType2').prop('checked')
            ){
                if(!isNifCif($("#formNewClient #nif"))){
                    validate++
                }
            }
        }
        if($('#formNewClient #mail').val() != ""){
            if(!isMail($('#formNewClient #mail'))){
                validate++;
            }
        }
        if($('#formNewClient #type').val() == 2){
            if(isEmpty($('#modal-new-client #formNewClient #price'))){
                validate++;
            }
        }

        if(validate == 0){
            var brandName = $("#formNewClient #brandName").val();
            var name = $("#formNewClient #name").val();
            var surname = $("#formNewClient #surname").val();
            var address = $("#formNewClient #address").val();
            var nif = $("#formNewClient #nif").val();
            var mail = $("#formNewClient #mail").val();
            var type = $("#formNewClient #type").val();
            var location = $("#formNewClient #location").val();
            if(location == "undefined" || location == "" ||  location == null){
                location = "NULL";
            }
            var mail = $("#formNewClient #mail").val();
            var phones = "";
            $('#formNewClient .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones = phones.slice(0,-1);

            var priceP = getParticularPrice()
            var price;
            if(type == '1'){
                price = priceP
            }else{
                price = $('#formNewClient #price').val()
            }
            var nifType = 1
            if($('#modal-new-client #authNifType1').prop('checked')){
                nifType = 1
            }else if($('#modal-new-client #authNifType2').prop('checked')){
                nifType = 2
            }else if($('#modal-new-client #authNifType3').prop('checked')){
                nifType = 3
            }else if($('#modal-new-client #authNifType4').prop('checked')){
                nifType = 4
            }
            var protocol = $("#modal-new-client #protocol").val();

            var obituaryAnniversaryReminder = 0;
            if($('#modal-new-client #formNewClient #obituaryAnniversaryReminder').prop('checked')){
                obituaryAnniversaryReminder = 1;
            }

            $.post(uri+"core/clients/createExpedient.php", {brandName : brandName, name: name, surname: surname, nif: nif, mail: mail, type: type, location: location, phones: phones, address: address, price : price, nifType: nifType, protocol: protocol, obituaryAnniversaryReminder: obituaryAnniversaryReminder}, function(data){
                data = $.parseJSON(data)
                if(data["success"]){
                    $('#modal-new-client').modal('hide');
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cliente se ha creado con éxito</div>');
                    // $('#client').trigger('change.select2');

                    var newOption = new Option(data["success"][1], data["success"][0], true, true)
                    $('#client').append(newOption).trigger('change')

                    $.post(uri+'core/clients/functions.php', {clientID: data["success"][0], type: 'getClient'}, function(data){
                        data = $.parseJSON(data);
                        
                        $('#formEditExpedient #phone').val("");
                        $('#formEditExpedient #phone').removeClass('validateError')
                        $('#formEditExpedient #phoneError').hide()
            
                        $('#formEditExpedient #clientName').val(data[0].name);
                        $('#formEditExpedient #clientSurname').val(data[0].surname);
                        $('#formEditExpedient #clientNIF').val(data[0].nif);
                        $('#formEditExpedient #clientMail').val(data[0].mail);
                        $('#formEditExpedient #clientAddress').val(data[0].address);
                        $('#formEditExpedient #clientBrandName').val(data[0].brandName);
            
                        if(data[0].province != null){
                            clientProvince = data[0].province
                            $('#clientProvince').val(data[0].province).trigger('change');
                            
                            if(data[0].location != null){
                                // $('#formEditExpedient #clientLocation').prop('disabled', false)
                                if($('#formEditExpedient #clientLocation').find("option[value='" + data[0].location + "']").length){
                                    $('#formEditExpedient #clientLocation').val(data[0].location).trigger('change');
                                }else{
                                    var newOption = new Option(data[0].locationName + ' - ' + data[0].postalCode, data[0].location, true, true);
                                    $('#formEditExpedient #clientLocation').append(newOption).trigger('change');
                                }
                            }
                        }
            
                        $('#formEditExpedient #clientPostalCode').val(data[0].postalCode);
                        $('#formEditExpedient #clientProvince').val(data[0].province);
            
                        $('#formEditExpedient #clientSection .phones').empty()
                        if(data[0].phones!=""){
                            var arrayPhones;
                            if(data[0].phones != null){
                                arrayPhones = data[0].phones.split("-");
                            }else{
                                arrayPhones = "";
                            }
                            for (var i=0; i < arrayPhones.length; i ++){
                                $('#formEditExpedient #clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">'+arrayPhones[i]+'</span> </span><br>')
                            }                
                            if(!$('#formEditExpedient #clientSection .phones').hasClass('in')){
                                $('#formEditExpedient #clientSection .phones').addClass('in');
                            }
                            $('#formEditExpedient #clientSection .phones .label .btn-remove').click(function(){
                                $(this).parent('.label').remove();
                            });
                            $('#formEditExpedient #phones').val(data[0].phones);
                        }
                    });
                }else if(data["cif"]){
                    $('#formNewClient #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un cliente con ese NIF.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-client').modal('hide');
                }
                setTimeout(function(){
                    $('#block-message').empty()
                    $('#formNewClient #msg').empty();
                }, 5000)
            });
        
        }else{
            $('#modal-new-client #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-client #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveNewDeceasedIn').click(function(){
        //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
        var name = $("#formNewDeceased #name").val();
        var location = $("#formNewDeceased #location").val();
        var text = $("#formNewDeceased #text").is(':checked');

        //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
        if(location=="undefined" || location=="" ||  location==null){
            location = 1;
        }
        
        //Validaciones
        var validate = 0;
        if(isEmpty($("#formNewDeceased #name"))){
            validate++
        }
        if(isEmpty($("#formNewDeceased #location"))){
            validate++
        }
        
        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/deceasedIn/create.php", {name: name, text: text, location: location}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El "fallecido en" se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                //Recargamos los datos del select "Fallecido en"
                $('#deceasedLocation').trigger('change.select2');
            });

            //Ocultamos la ventana modal
            $('#modal-new-deceased').modal('hide');
        }else{
            $('#modal-new-deceased #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceased #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveNewDoctor').click(function(){
        // Validaciones
        var validate = 0
        
        if(isEmpty($('#formNewDeceasedDoctor #name'))){
            validate++
        }
        
        if(validate == 0){
            var name = $('#formNewDeceasedDoctor #name').val()
            var college = $('#formNewDeceasedDoctor #college').val()
            var email = $('#formNewDeceasedDoctor #email').val()

            $.post(uri + 'core/doctors/create.php', {name : name, college : college, email : email})

            $('#modal-new-deceasedDoctor').modal('hide')
        }else{
            $('#modal-new-deceasedDoctor #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceasedDoctor #warning-message').empty()
            }, 3500)
        }
    })

    $('#saveNewChurch').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewChurch #name'))){
            validate++;
        }
        if($('#formNewChurch #latitude').val() != ""){
            if(isEmpty($('#formNewChurch #longitude'))){
                validate++;
            }
        }
        if($('#formNewChurch #longitude').val() != ""){
            if(isEmpty($('#formNewChurch #latitude'))){
                validate++;
            }
        }
        
        if(validate == 0){
            var name = $("#formNewChurch #name").val();
            var address = $("#formNewChurch #address").val();
            var location = $("#formNewChurch #location").val();
            var latitude =  parseFloat($('#formNewChurch #latitude').val());
            var longitude = parseFloat($('#formNewChurch #longitude').val());
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var phones = "";
            $('#formNewChurch .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var priests = []
            $('#formNewChurch .priests .label').each(function(){
                var priest = $(this).find('.number').parent().find('[type=hidden]').val();
                priests.push(priest)
            });
            if(priests.length == 0){
                priests = null
            }

            $.post(uri+"core/churches/create.php", {name: name, address: address, location: location, latitude: latitude, longitude: longitude, phones: phones, priests : priests}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La iglesia se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            $('#modal-new-church').modal('hide');
        }else{
            $('#modal-new-church #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-church #warning-message').empty()
            }, 3500)
        }
    });

    $('#saveNewCemetery').click(function(){
        var validate = 0;

        if(isEmpty($('#formNewCemetery #name'))){
            validate++;
        }
        if($('#formNewCemetery #latitude').val() != ""){
            if(isEmpty($('#formNewCemetery #longitude'))){
                validate++;
            }    
        }
        if($('#formNewCemetery #longitude').val() != ""){
            if(isEmpty($('#formNewCemetery #latitude'))){
                validate++;
            }
        }
        if($('#formNewCemetery #mail').val() != ""){
            if(!isMail($('#formNewCemetery #mail'))){
                validate++;
            }
        }
        if(validate == 0){
            var name = $("#formNewCemetery #name").val();
            var address = $("#formNewCemetery #address").val();
            var location = $("#formNewCemetery #location").val();
            var latitude =  parseFloat($('#formNewCemetery #latitude').val());
            var longitude = parseFloat($('#formNewCemetery #longitude').val());
            
            if(location=="undefined" || location=="" ||  location==null){
                location = 'NULL';
            }
            if(isNaN(latitude)){
                latitude = 'NULL';
            }
            if(isNaN(longitude)){
                longitude = 'NULL';
            }
            var mail = $("#formNewCemetery #mail").val();
            
            var phones = "";
            $('#formNewCemetery .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
    
            $.post(uri+"core/cemeteries/create.php", {name: name, address: address, location: location, latitude: latitude, longitude: longitude, mail: mail, phones: phones}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El cementerio se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });
    
            $('#modal-new-cemetery').modal('hide');
        }else{
            $('#modal-new-cemetery #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-cemetery #warning-message').empty()
            }, 3500)
        }
    });

    // FUNERARIA DE PROCEDENCIA - DESTINO
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
                $('#modal-new-funeralHome .province').append($('<option default />').val('').text('Selecciona una provincia'))
                $.each(provinces, function(){
                    $('#modal-new-funeralHome .province').append($('<option />').val(this.province).text(this.province))
                })

                $('#modal-new-funeralHome .province').change(function(){
                    $('#modal-new-funeralHome .province option[value=""]').attr('disabled', true)
                })
            }
        }
    })

    var provinceFuneralHome
    $('#modal-new-funeralHome .province').change(function(){
        provinceFuneralHome = $(this).val()
        $('#modal-new-funeralHome .location').prop('disabled', false)
        $('#modal-new-funeralHome .location').val('').trigger('change')
    })

    $('#modal-new-funeralHome .location').prop('disabled', true)

    // LOCALIDADES
    $('#modal-new-funeralHome .location').select2({
        language: langSelect2,
        placeholder: 'Seleccione una localidad',
        allowClear: true,
        ajax: {
            url: uri+'core/locations/data2.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    province : provinceFuneralHome
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

    $('#saveNewFuneralHome').click(function(){
        var validate = 0;

        if(isEmpty($('#modal-new-funeralHome #name'))){
            validate++;
        }
        if(isEmpty($('#modal-new-funeralHome #nif'))){
            validate++;
        }else{
            if(!isNifCif($("#modal-new-funeralHome #nif"))){
                validate++
            }
        }
        if($('#modal-new-funeralHome #mail').val() != ""){
            if(!isMail($('#modal-new-funeralHome #mail'))){
                validate++;
            }
        }
        if($("#modal-new-funeralHome #fax").val()!=""){
            if(!isPhone($("#modal-new-funeralHome #fax"))){
                validate++
            }
        }

        if(validate == 0){
            var name = $("#modal-new-funeralHome #name").val();
            var address = $("#modal-new-funeralHome #address").val();
            var nif = $("#modal-new-funeralHome #nif").val();
            var location = $("#modal-new-funeralHome #location").val();
            if(location=="undefined" || location=="" ||  location==null){
                location = "NULL";
            }
            var mail = $("#modal-new-funeralHome #mail").val();
            var phones = "";
            $('#modal-new-funeralHome .phones .label').each(function(){
                var number = $(this).find('.number').text();
                phones += number+"-";
            });
            phones=phones.slice(0,-1);
            var fax = $("#modal-new-funeralHome #fax").val();
            var contactPeople = "";
            $('#modal-new-funeralHome .contactPeople .label').each(function(){
                var name = $(this).find('.name').text();
                var post = $(this).find('.post').text();
                contactPeople += name+"?"+post+"-";
            });
            contactPeople=contactPeople.slice(0,-1);

            $.ajax({
                url: uri + 'core/funeralHomes/create.php',
                method: 'POST',
                data: {
                    name: name,
                    address: address,
                    nif: nif,
                    location: location,
                    mail: mail,
                    phones: phones,
                    fax: fax,
                    person: contactPeople
                },
                async: false,
                success: function(data){
                    data = $.parseJSON(data)
                    if(data["success"]){
                        $('#modal-new-funeralHome').modal('hide');
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La funeraria se ha creado con éxito</div>');
                        $('#funeralHome').trigger('change.select2');
                        $('#funeralHomeService').trigger('change.select2');
                    }else if(data["cif"] != undefined && data["cif"] != null){
                        $('#formNewFuneralHome #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe una funeraria con ese NIF.</div>');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        $('#modal-new-funeralHome').modal('hide');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                        $('#formNewFuneralHome #msg').empty();
                    }, 5000)
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-funeralHome').modal('hide');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

        }else{
            $('#modal-new-funeralHome #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-funeralHome #warning-message').empty()
            }, 3500)
        }
    });

    //Acción para añadir nuevos teléfonos
    $('#clientSection .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#clientSection .phone').val('')
            $('#clientSection .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> </span><br>')
            if(!$('#clientSection .phones').hasClass('in')){
                $('#clientSection .phones').addClass('in')
            }
            $('#clientSection .phones .label .btn-remove').click(function(){
                $(this).parent('#clientSection .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#clientSection .phones .label .btn-remove').click(function(){
        $(this).parent('#clientSection .label').remove();
    });

    $('#modal-new-church .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-church .phone').val('')
            $('#modal-new-church .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-church .phones').hasClass('in')){
                $('#modal-new-church .phones').addClass('in')
            }
            $('#modal-new-church .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-church .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-church .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-church .label').remove();
    });

    $('#modal-new-cemetery .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-cemetery .phone').val('')
            $('#modal-new-cemetery .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-cemetery .phones').hasClass('in')){
                $('#modal-new-cemetery .phones').addClass('in')
            }
            $('#modal-new-cemetery .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-cemetery .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-cemetery .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-cemetery .label').remove();
    });

    $('#modal-new-crematorium .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-crematorium .phone').val('')
            $('#modal-new-crematorium .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-crematorium .phones').hasClass('in')){
                $('#modal-new-crematorium .phones').addClass('in')
            }
            $('#modal-new-crematorium .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-crematorium .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-crematorium .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-crematorium .label').remove();
    });

    $('#modal-new-client .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-client .phone').val('')
            $('#modal-new-client .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-client .phones').hasClass('in')){
                $('#modal-new-client .phones').addClass('in')
            }
            $('#modal-new-client .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-client .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-client .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-client .label').remove();
    });

    $('#modal-new-mortuary .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-mortuary .phone').val('')
            $('#modal-new-mortuary .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-mortuary .phones').hasClass('in')){
                $('#modal-new-mortuary .phones').addClass('in')
            }
            $('#modal-new-mortuary .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-mortuary .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-mortuary .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-mortuary .label').remove();
    });

    $('#modal-new-funeralHome .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone2(phone)){
            $('#modal-new-funeralHome .phone').val('')
            $('#modal-new-funeralHome .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-funeralHome .phones').hasClass('in')){
                $('#modal-new-funeralHome .phones').addClass('in')
            }
            $('#modal-new-funeralHome .phones .label .btn-remove').click(function(){
                $(this).parent('#modal-new-funeralHome .label').remove()
            })
        }
    });

    //Acción para eliminar un teléfono
    $('#modal-new-funeralHome .phones .label .btn-remove').click(function(){
        $(this).parent('#modal-new-funeralHome .label').remove();
    });

    // AÑADIR PERSONAS DE CONTACTO
    $('.btn-add-person').click(function(){
        var name = $(this).parent().parent().find('#person').val();
        var post = $(this).parent().parent().find('#post').val();
        $('.input-contactPeople .form-control').val('');
        $('.contactPeople').append('<span class="label label-default small"><span class="name">'+name+'</span> (<span class="post">'+post+'</span>) <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span>')
        if(!$('.contactPeople').hasClass('in')){
            $('.contactPeople').addClass('in');
        }
        $('.contactPeople .label .btn-remove').click(function(){
            $(this).parent('.label').remove();
        });
    });

    // ELIMINAR PERSONAS DE CONTACTO
    $('.contactPeople .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

    $('#modal-new-church').on('hidden.bs.modal', function (e) {
        $('#formNewChurch input').val('')
        $('#formNewChurch .phones').html('')
        if(!$('#formNewChurch .phones').hasClass('in')){
            $('#formNewChurch .phones').addClass('in')
        }
        $('#formNewChurch #priest').val('').trigger('change')
        $('#formNewChurch .priests').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewChurch")
        $('#modal-new-church #warning-message').empty()
    });

    $('#modal-new-deceased').on('hidden.bs.modal', function (e) {
        $('#formNewDeceased input').val('')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewDeceased")
        $('#modal-new-deceased #warning-message').empty()
    });

    $('#modal-new-cemetery').on('hidden.bs.modal', function (e) {
        $('#formNewCemetery input').val('')
        $('#formNewCemetery .phones').html('')
        if(!$('#formNewCemetery .phones').hasClass('in')){
            $('#formNewCemetery .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewCemetery")
        $('#modal-new-cemetery #warning-message').empty()
    });

    $('#modal-new-crematorium').on('hidden.bs.modal', function (e) {
        $('#formNewCrematorium input').val('')
        $('#formNewCrematorium .phones').html('')
        if(!$('#formNewCrematorium .phones').hasClass('in')){
            $('#formNewCrematorium .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewCrematorium")
        $('#modal-new-crematorium #warning-message').empty()
    });

    $('#modal-new-client').on('hidden.bs.modal', function (e) {
        $('#formNewClient input').val('')
        $('#formNewClient .phones').html('')
        if(!$('#formNewClient .phones').hasClass('in')){
            $('#formNewClient .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $('#modal-new-client #type').val('').trigger('change')
        $('#modal-new-client #price').val('').trigger('change')
        clean("formNewClient")
        $('#modal-new-client #warning-message').empty()

        $('#modal-new-client #obituaryAnniversaryReminderSection').addClass('hide');
        $('#modal-new-client #obituaryAnniversaryReminder').iCheck('uncheck');
    });

    $('#modal-new-deceasedBirthdayLocation').on('hidden.bs.modal', function (e) {
        $('#formNewDeceasedBirthayLocation input').val('')
        clean("formNewDeceasedBirthayLocation")
        $('#modal-new-deceasedBirthdayLocation #warning-message').empty()
    });

    $('#modal-new-deceasedDoctor').on('hidden.bs.modal', function (e) {
        $('#formNewDeceasedDoctor input').val('')
        clean("formNewDeceasedDoctor")
        $('#modal-new-deceasedDoctor #warning-message').empty()
    });

    $('#modal-new-mortuary').on('hidden.bs.modal', function (e) {
        $('#formNewMortuary input').val('')
        $('#formNewMortuary .phones').html('')
        if(!$('#formNewMortuary .phones').hasClass('in')){
            $('#formNewMortuary .phones').addClass('in')
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewMortuary")
        $('#modal-new-mortuary #warning-message').empty()
    });

    $('#modal-new-funeralHome').on('hidden.bs.modal', function (e) {
        $('#formNewFuneralHome input').val('')
        $('#formNewFuneralHome .phones').html('')        
        if(!$('#formNewFuneralHome .phones').hasClass('in')){
            $('#formNewFuneralHome .phones').addClass('in')
        }
        $('#formNewFuneralHome .contactPeople').empty()
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewFuneralHome")
        $('#modal-new-funeralHome #warning-message').empty()
    });

    $('#modal-new-destinationPlaceMiddle').on('hidden.bs.modal', function (e) {
        $('#formNewDestinationPlaceMiddle input').val('')
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        clean("formNewDestinationPlaceMiddle")
        $('#modal-new-destinationPlaceMiddle #warning-message').empty()
    });

    //Create. Nueva localidad
    $('#saveNewDeceasedBirthdayLocation').click(function(){
        // Validaciones
        var validate = 0;

        if(isEmpty($('#formNewDeceasedBirthayLocation #name'))){
            validate++;
        }
        if(isEmpty($('#formNewDeceasedBirthayLocation #postalCode'))){
            validate++;
        }
        if(isEmpty($('#formNewDeceasedBirthayLocation #province'))){
            validate++;
        }

        if(validate == 0){
            //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
            var locationID = $("#formNewDeceasedBirthayLocation #locationID").val();
            var name = $("#formNewDeceasedBirthayLocation #name").val();
            var postalCode = $("#formNewDeceasedBirthayLocation #postalCode").val();
            
            if(postalCode=="undefined" || postalCode==""){
                postalCode = "NULL";
            }

            var province = $("#formNewDeceasedBirthayLocation #province").val();

            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/locations/create.php", {name: name, postalCode: postalCode, province: province}, function(data){
                if(data){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La localidad se ha creado con éxito.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            });

            //Ocultamos la ventana modal
            $('#modal-new-deceasedBirthdayLocation').modal('hide');
        }else{
            $('#modal-new-deceasedBirthdayLocation #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-deceasedBirthdayLocation #warning-message').empty()
            }, 3500)
        }
    });

    // COMPRUEBA SI HAY ALGUIEN MÁS EN ESTE EXPEDIENTE Y BLOQUEA LA PÁGINA A LOS DEMÁS USUARIOS
    var block = false
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
                    $('#deleteAssociation').attr('disabled', true)
                    $('input').attr('disabled', true)
                    $('select').attr('disabled', true)
                    $('textarea').attr('disabled', true)
                    $('#btn-add-applicant').remove()
                    $('#client').closest('div').find('span.input-group-addon').remove()
                    $('.phone').closest('div').find('span.input-group-addon').remove()
                    $('.phones.in').find('.btn-remove').remove()
                    $('.fa.fa-plus').closest('span').remove()
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

    /**
     * When the user searchs a client by differentes fields
     */
    $("#searchBtn").click(function(){
        data = [];

        data["name"] = $("#searchByName").val();
        data["surname"] = $("#searchBySurname").val();
        data["nif"] = $("#searchByNIF").val();
        data["brandName"] = $("#searchByBrandName").val();
        data["type"] = $('#formEditExpedient #clientType').val();
   
        $.ajax({
            url: uri+'core/clients/searchClients.php',
            data: Object.assign({}, data),
            type: "POST",
            dataType: 'json',
            success : function(response) {
                switch (response.status) {
                    case 0:
                        $('#searchResults').empty();
                        $('#searchResults').select2({
                            containerCssClass: 'select2-status',
                            language: langSelect2,
                            placeholder: 'Selecciona un cliente',
                            data: response.data,
                            escapeMarkup: function (markup) { return markup; },
                            templateResult: formatData,
                            templateSelection: formatData
                        });

                        if(response.data != null && response.data.length == 1){
                            $('#searchResults').val(response.data[0]['id']).trigger('change')
                        }else{
                            $('#searchResults').val(null).trigger('change')
                        }
                        $("#divResults").removeClass("hide")
                    break;
                }
            }
        });
    });

    /**
     * When the user select a search result, sets the values in fields
     */
    $("#selectResult").click(function(){
     
        data["clientID"] = $('#searchResults :selected').val();
        
        var newOption = new Option($('#searchResults :selected').text(),$('#searchResults :selected').val(), true, true);
        $('#client').append(newOption).trigger('change');
        // $("#client").val().trigger("change")

        $.ajax({
            url: uri+'core/clients/read.php',
            data: Object.assign({}, data),
            type: "POST",
            dataType: 'json',
            success : function(response) {
               
                $("#clientBrandName").val(response[0].brandName);
                $("#clientName").val(response[0].clientsName);
                $("#clientSurname").val(response[0].surname);
                $("#clientNIF").val(response[0].nif);
                $("#clientMail").val(response[0].mail);
                $("#clientAddress").val(response[0].address);

                
                if(response[0].province == null){
                    $("#clientProvince option[value='']").attr('disabled', false)
                    $('#clientLocation').prop('disabled', true)
                }else{
                    province = response[0].province
                    $("#clientProvince option[value='']").attr('disabled', true)
                    $('#clientProvince').val(response[0].province)
                    // $('#clientLocation').prop('disabled', false)
                }
                if(response[0].locationID != null){
                    // $('#clientLocation').prop('disabled', false)
                    if($('#clientLocation').find("option[value='" + response[0].locationID + "']").length){
                        $('#clientLocation').val(response[0].locationID).trigger('change')
                    }else{ 
                        var newOption = new Option(response[0].locationName + ' - ' + response[0].postalCode, response[0].locationID, true, true)
                        $('#clientLocation').append(newOption).trigger('change')
                    }
                }
                $("#divPhones #phone").val(response[0].phones);
            }
        });
    });

    //BLOCK EXPEDIENT IF IT IS FINISHED
    if(parseInt(expedient.status) == 5){

        if(userType == 1){
            $("#reactived").attr('disabled', false);
            $("#reactived").removeClass('hide');
        }else{
            $("#expedientFinishedText").empty();
            $("#expedientFinishedText").text(' Solicite a un usuario administrador que lo reactive (su estado pasará a facturado) para realizar modificaciones.');
        }

        $('#expedientFinished').removeClass('hide');
        $('#saveForm').attr("disabled", true);
        $('#backLink').attr("disabled", true);
        $('input').attr('disabled', true);
        $('select').attr('disabled', true);
        $('textarea').attr('disabled', true);
        $('#btn-add-applicant').remove();
        $('#client').closest('div').find('span.input-group-addon').remove();
        $('.phone').closest('div').find('span.input-group-addon').remove();
        $('.phones.in').find('.btn-remove').remove();
        $('.fa.fa-plus').closest('span').remove();
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
    });

    $('#funeralDate').change(function(){
        if($(this).val() != ''){
            $('#ceremonyDate').val($(this).val())
        }
    });

    $('#funeralTime').change(function(){
        if($(this).val() != ''){
            $('#ceremonyTime').val($(this).val())
        }
    });

    $('#goToAssistance').click(function(){
        $.ajax({
            url: uri + 'core/expedients/expedient/functions.php',
            method: 'POST',
            data: {
                type: 'checkAssistance',
                expedientID: expedientID
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    window.location.href = uri + 'asistencias/editar/' + data;
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
    });

    firstTimeLoad = false;

    // Check expedients changes
    $("input").change(function(){
        hasChanges = true;
    })
    $("select").change(function(){
        hasChanges = true;
    })
    $("textarea").change(function(){
        hasChanges = true;
    })
});

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