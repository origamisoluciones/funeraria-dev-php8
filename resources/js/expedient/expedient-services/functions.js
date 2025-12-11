/**  @var {array} expedientInfo Expedient info */
var expedientInfo = null;

/**  @var {array} expedientData Expedient info */
var expedientData = null;

/**  @var {string} planHired Plan hired */
var planHired = null;

/**  @var {boolean} hasViaFirmaKeys If company has via firma api keys */
var hasViaFirmaKeys = false;

/**  @var {boolean} hasVivoRecuerdoKeys If company has vivo recuerdo api keys */
var hasVivoRecuerdoKeys = false;

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

/** @var {int} rowClickSurvey Row click survey item */
var rowClickSurvey = 10;

/** @var {int} smsUpBalance Sms up balance*/
var smsUpBalance = 0;

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
 * Comprueba si la compañia tiene claves para smsUp
 */
function getSmsUp() {
    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'getSmsUp'
        },
        type : 'POST',
        async : false,
        success : function(data){
            data = $.parseJSON(data)
            if(data == null || data == false || data.status == 'error'){
                $('#surveysSection').remove()
            }else{
                smsUpBalance = parseInt(data.result.balance)
                $('#surveysSection').removeClass('hide')
            }
        }
    })
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

/**
 * Comprueba si la compañia tiene claves para Vivo Recuerdo
 * 
 * @param {int} expedient ID del expediente
 */
function getVivoRecuerdoApiKeys(expedient) {
    $.ajax({
        url : uri + 'core/tools/accessControl.php',
        method : 'POST',
        async : false,
        data : {
            action : 'checkVivaRecuerdoApiKeys',
            expedient: expedient
        },
        type : 'POST',
        async : false,
        success : function(data){
            hasVivoRecuerdoKeys = $.parseJSON(data)
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
        break;
        case '3':
            color = 'blue'
        break;
        case '6':
            color = 'orange'
        break;
    }
    return '<div style="color: ' + color + ';" id="' + data.id + '">' + data.text + '</div>';
}

// const existsTombstone = null;
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

function drawCarsData(expedientID){
    // COCHES
    var carsTableData

    $.ajax({
        url : uri + 'core/expedients/services/functions.php',
        method : 'POST',
        data : {
            type : 'getCars',
            expedient : expedientID
        },
        async : false,
        success : function(data){
            carsTableData = $.parseJSON(data)
        }
    })
     
    if(carsTableData != null){

        $("#carsTableBody").empty();

        $.each(carsTableData, function(index, elem){
            var scID = elem.ID
            var licensePlate = elem.licensePlate
            if(licensePlate == null){
                licensePlate = '-'
            }
            var brand = elem.brand
            if(brand == null){
                brand = '-'
            }
            var model = elem.model
            if(model == null){
                model = '-'
            }
            var driver = elem.driver
            var driverName = elem.driverName
            var cleanBefore = elem.cleanBefore
            var cleanBeforeName = elem.cleanBeforeName
            var cleanAfter = elem.cleanAfter
            var cleanAfterName = elem.cleanAfterName

            $('#carsTableBody').append( 
                '<tr>' +
                '    <td class="text-center scID hide">' + scID + '</td>' +
                '    <td class="text-center licensePlate">' + licensePlate + '</td>' +
                '    <td class="text-center brand">' + brand + '</td>' +
                '    <td class="text-center model">' + model + '</td>' +
                '    <td class="text-center">' + 
                '        <div class="form-group" style="margin-bottom:0!important;"><select class="form-control select2 driver" id="driver' + scID + '"></select></div>' +
                '    </td>' +
                '    <td class="text-center">' + 
                '        <div class="form-group" style="margin-bottom:0!important;"><select class="form-control select2 cleanBefore" id="cleanBefore' + scID + '"></select></div>' +
                '    </td>' +
                '    <td class="text-center">' + 
                '        <div class="form-group" style="margin-bottom:0!important;"><select class="form-control select2 cleanAfter" id="cleanAfter' + scID + '"></select></div>' +
                '    </td>' +
                '    <td class="text-center"><ul class="actions-menu"><li><a href="javascript:void(0)" class="carDel' + scID + '"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>' +
                '</tr>'
            );
            
            $('#driver' + scID).change(function(){
                var driver = $(this).val()
                var driverName = ''
                $.ajax({
                    url: uri + 'core/users/functions2.php',
                    method: 'POST',
                    data: {
                        id: driver,
                        type: 'getUserName'
                    },
                    async: false,
                    success: function(data){
                        var parse = $.parseJSON(data)
                        driverName = parse.name + " " + parse.surname
                    }
                })
                if($('#cleanAfter' + scID).find("option[value='" + driver + "']").length){
                    $('#cleanAfter' + scID).val(driver).trigger('change');
                }else{ 
                    var newOption = new Option(driverName, driver, true, true);
                    $('#cleanAfter' + scID).append(newOption).trigger('change');
                }
            })
            
            if(driver != null){
                if($('#driver' + scID).find("option[value='" + driver + "']").length){
                    $('#driver' + scID).val(driver).trigger('change');
                }else{ 
                    var newOption = new Option(driverName, driver, true, true);
                    $('#driver' + scID).append(newOption).trigger('change');
                }
            }

            if(cleanBefore != null){
                if($('#cleanBefore' + scID).find("option[value='" + cleanBefore + "']").length){
                    $('#cleanBefore' + scID).val(cleanBefore).trigger('change');
                }else{ 
                    var newOption = new Option(cleanBeforeName, cleanBefore, true, true);
                    $('#cleanBefore' + scID).append(newOption).trigger('change');
                }
            }

            if(cleanAfter != null){
                if($('#cleanAfter' + scID).find("option[value='" + cleanAfter + "']").length){
                    $('#cleanAfter' + scID).val(cleanAfter).trigger('change');
                }else{ 
                    var newOption = new Option(cleanAfterName, cleanAfter, true, true);
                    $('#cleanAfter' + scID).append(newOption).trigger('change');
                }
            }
            changeColorCars()

            $('.carDel' + scID).click(function(){
                if(confirm("¿Está seguro de que quiere borrar el coche: " + brand + " " + model + " " + licensePlate + "?")){
                    $.ajax({
                        url : uri + 'core/expedients/services/functions.php',
                        method : 'POST',
                        data : {
                            type : 'deleteCar',
                            serviceCar : scID
                        },
                        success : function(data){
                            data = $.parseJSON(data)
    
                            if(data){
                                $('#carsTableBody').find('.carDel' + scID).closest('tr').remove()
    
                                if($('#carsTableBody').find('tr').length == 0){
                                    $('#carsTableBody').append('<tr class="noCars"><td valign="top" colspan="7" class="dataTables_empty">Ningún dato disponible en esta tabla</td></tr>')
                                }
                                changeColorCars()
                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El coche se ha eliminado con éxito.</div>');
                            }else{
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            }

                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)

                            $('.carDel' + scID).tooltip('hide');
                        },
                        error : function(){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                }
            })
        })
    }else{
        $('#carsTableBody').append('<tr class="noCars"><td valign="top" colspan="7" class="dataTables_empty">Ningún dato disponible en esta tabla</td></tr>')
    }
        
    $('.driver').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/carrierData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    fromTime: $("#carriersTime").val(),
                    service: expedientID,
                    opt: "drivers"
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.carrierID
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
    })
    
    $('.cleanBefore').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/usersCleaningData.php',
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
    })
    
    $('.cleanAfter').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/carrierData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    fromTime: $("#carriersTime").val(),
                    service: expedientID,
                    opt: "drivers"
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.carrierID
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
    })

    changeColorCars();
}

/**
 * Draw docs table buttons
 */
function drawButtons(){
    $.ajax({
        url: uri + 'core/expedients/obituary/docExists.php',
        method: 'POST',
        data: {
            expedient: $('#expedientID').val()
        },
        async: false,
        dataType: 'json',
        success: function(data){
            try{
                if(Array.isArray(data.esquela) && data.esquela[0] != null && data.esquela[1] != null){
                    $('#viewObituarySection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/obituary/' + data.esquela[0] + '/' + data.esquela[1] + '/files/esquela.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editObituarySection').append('<a id="editObituarySectionEdit" style="cursor: pointer;"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a>')
                    $('#editObituarySectionEdit').click(function(){
                        $('#saveForm').click()
                        window.location.href = uri + 'expediente/esquela/' + $('#expedientID').val()
                    })
                }else{
                    $('#editObituarySection').append('<a id="editObituarySectionCreate" style="cursor: pointer;"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                    $('#editObituarySectionCreate').click(function(){
                        $('#saveForm').click()
                        window.location.href = uri + 'expediente/esquela/' + $('#expedientID').val()
                    })
                }
                if(Array.isArray(data.esquelaPrensa) && data.esquelaPrensa[0] != null && data.esquelaPrensa[1] != null){
                    $('#viewObituaryPressSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/obituary-press/' + data.esquelaPrensa[0] + '/' + data.esquelaPrensa[1] + '/files/esquela.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editObituaryPressSection').append('<a id="editObituaryPressSectionEdit" style="cursor: pointer;"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a>')
                    $('#editObituaryPressSectionEdit').click(function(){
                        $('#saveForm').click()
                        window.location.href = uri + 'expediente/esquela-prensa/' + $('#expedientID').val()
                    })
                }else{
                    $('#editObituaryPressSection').append('<a id="editObituaryPressSectionCreate" style="cursor: pointer;"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                    $('#editObituaryPressSectionCreate').click(function(){
                        $('#saveForm').click()
                        window.location.href = uri + 'expediente/esquela-prensa/' + $('#expedientID').val()
                    })
                }
                if(data.cerradoDefuncion){
                    $('#viewDeceasedCloseSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/closed-death/0/0/files/cerradoPorDefuncion.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editDeceasedCloseSection').append('<a id="goCerradoDefuncion"><i class="fa fa-pencil" style="cursor:pointer" aria-hidden="true" title="Editar cartel de cerrado por defunción"></i></a>')
                }else{
                    $('#editDeceasedCloseSection').append('<a id="goCerradoDefuncion"><i class="fa fa-plus-circle" style="cursor:pointer" aria-hidden="true" title="Nuevo cartel de cerrado por defunción"></i></a>')
                }
                if(data.lapida){
                    $('#viewTombstoneSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/tombstone/0/0/files/lapida.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                }
                if(data.duelo){
                    $('#viewDuelSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/no-duel-received/0/0/files/NoRecibeDuelo.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editDuelSection').append('<a href="' + uri + 'expediente/no-recibe-duelo/editor/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{
                    $('#editDuelSection').append('<a href="' + uri + 'expediente/no-recibe-duelo/editor/' + $('#expedientID').val() + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                }


                if(!data.recordatorio && !data.recordatorioGallego && !data.recordatorioAniversario){ // 000
                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                }else if(!data.recordatorio && !data.recordatorioGallego && data.recordatorioAniversario){ // 001
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(!data.recordatorio && data.recordatorioGallego && !data.recordatorioAniversario){ // 010
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(!data.recordatorio && data.recordatorioGallego && data.recordatorioAniversario){ // 011
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(data.recordatorio && !data.recordatorioGallego && !data.recordatorioAniversario){ // 100
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(data.recordatorio && !data.recordatorioGallego && data.recordatorioAniversario){ // 101
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(data.recordatorio && data.recordatorioGallego && !data.recordatorioAniversario){ // 110
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{ // 111
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')
                    
                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + $('#expedientID').val() + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                } 
             
                if(data.recordatorioSobre){
                    $('#viewReminderLetterSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder-packet/0/0/files/recordatorio-sobre.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editReminderLetterSection').append('<a id="goRecordatorioSobre" style="cursor:pointer"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{
                    $('#editReminderLetterSection').append('<a id="goRecordatorioSobre" style="cursor:pointer"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo "></i></a>')
                }
                if(data.recordatorioSobreCruz){
                    $('#viewReminderLetterCrossSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ $('#expedientID').val() + '/reminder-packet-cross/0/0/files/recordatorio-sobre-cruz.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editReminderLetterCrossSection').append('<a style="cursor:pointer" id="goRecordatorioSobreCruz"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{
                    $('#editReminderLetterCrossSection').append('<a style="cursor:pointer" id="goRecordatorioSobreCruz"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo "></i></a>')
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
 * Obtiene los datos del control
 * 
 * @param {int} expedient ID del expediente
 * @return {array} Datos del control
 */
function getControl(expedient){
    $.ajax({
        url : uri + 'core/expedients/services/functions.php',
        method : 'POST',
        data : {
            type : 'readControl',
            expedient : expedient
        },
        success : function(data){
            data = $.parseJSON(data)

            if(data != null){
                var control = data.control
               
                $('#controlExpedient').text(control.number)
                $('#controlName').text(control.deceasedName + ' ' + control.deceasedSurname)
                $('#controlDni').text(control.deceasedNIF)

                if(control.clientType == 2 || control.clientType == 3){
                    $('#controlCapital').text(control.capital)
                    $('#controlLoss').text(control.lossNumber)
                    $('#controlPolicy').text(control.policy)
                } else{
                    $("#divDetailPolicy").addClass("hide")
                    $("#divDetailLoss").addClass("hide")
                    $("#divDetailCapital").addClass("hide")
                    $("#divCapital").addClass("hide")
                    $("#divLoss").addClass("hide")
                    $("#divPolicy").addClass("hide")
                }
               
                deceasedGender = control.deceasedGender
                if(control.deceasedGender == 'Hombre'){
                    $('.controlDeceasedDate').text('Fallecido el día: ');
                    if(control.deceasedDate != null){
                        $('#controlDeceasedDate').text(moment(control.deceasedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    }
                    $('.controlDeceasedLocation').text('Fallecido en: ');
                    $('#controlDeceasedLocation').text(control.deceasedInName)
                }else{
                    $('.controlDeceasedDate').text('Fallecida el día: ');
                    if(control.deceasedDate != null){
                        $('#controlDeceasedDate').text(moment(control.deceasedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    }
                    $('.controlDeceasedLocation').text('Fallecida en: ');
                    $('#controlDeceasedLocation').text(control.deceasedInName)
                }
                $('#controlMortuary').text(control.mortuaryName)
                $('#controlNotes').val(control.notes)
                if(control.sent == 1){
                    $('#controlSent').text('El email ya ha sido enviado!')
                }

                var emails = data.emails
                if(emails != null){
                    $.each(emails, function(index, elem){
                        if($('#controlSend').find("option[value='" + elem.ID + "']").length){
                            $('#controlSend').val(elem.ID).trigger('change')
                        }else{ 
                            var newOption = new Option(elem.email, elem.ID, true, true)
                            $('#controlSend').append(newOption).trigger('change')
                        }
                    })
                }

                var assistances = data.assistances
                if(assistances != null){
                    $.each(assistances, function(index, elem){
                        if($('#controlAssistance').find("option[value='" + elem.ID + "']").length){
                            $('#controlAssistance').val(elem.ID).trigger('change')
                        }else{ 
                            var newOption = new Option(elem.name, elem.ID, true, true)
                            $('#controlAssistance').append(newOption).trigger('change')
                        }
                    })
                }

                var emails = data.copy
                if(emails != null){
                    $('#controlCopy').val(emails[0].emails)
                }
            }
        }
    })
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
 * Comprueba si el pdf de la esquela ya se ha creado
 * 
 * @param {int} expedient Id del expediente
 */
function checkView(expedient){
    var existsTombstone = false;
    $.ajax({
        url: uri + 'core/expedients/tombstone/checkPdf_v2.php',
        method: 'POST',
        data: {
            expedient: expedient
        },
        async: false,
        success: function(data){
            try{
                existsTombstone = data;
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

    return existsTombstone;
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

/**
 * Devuelve el expediente asociadoa uno
 * 
 * @param int expedientID Id del expediente
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
 * Cambia el color de las etiquetas de los curas
 */
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

/**
 * Cambia el color de las etiquetas de los porteadores
 */
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

/**
 * Cambia el color de las etiquetas de los campaneros
 */
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

/**
 * Cambia el color de las etiquetas de los coros
 */
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

/**
 * Cambia el color de las etiquetas de los porteadores
 */
function changeColorCarriers(){

    //Comprobamos si todos los campos están checkeados para cambiar el color de la sección
    var countCarriers = 0;
    var countCheckedCarriers = 0;
    $.each($("#carriers-table .confirmed"), function(index, elem){
        if($(this).prop('checked')){
            countCheckedCarriers ++;
        }
        countCarriers++;
    })

    if(countCarriers == countCheckedCarriers && countCarriers > 0){
        $('#porteadoresLbl').removeClass('label-primary').addClass('label-success')
        // $('#carriersFieldset').css('border-color', 'green')
    }else{
        $('#porteadoresLbl').removeClass('label-success').addClass('label-primary')
        $('#carriersFieldset').css('border-color', '#002490')
    }
}

/**
 * Cambia el color de las etiquetas de los coches utilizados
 */
function changeColorCars(){

    //Comprobamos si todos los campos están checkeados para cambiar el color de la sección
    var countCars = 0;
    var countCheckedCars = 0;
    $.each($("#carsTable .driver"), function(index, elem){
        if($(this).val() != null){
            countCheckedCars ++;
        }
        countCars++;
    })

    var countCarsCleanBefore = 0;
    var countCheckedCarsCleanBefore = 0;
    $.each($("#carsTable .cleanBefore"), function(index, elem){
        if($(this).val() != null){
            countCheckedCarsCleanBefore ++;
        }
        countCarsCleanBefore++;
    })

    var countCarsCleanAfter = 0;
    var countCheckedCarsCleanAfter = 0;
    $.each($("#carsTable .cleanAfter"), function(index, elem){
        if($(this).val() != null){
            countCheckedCarsCleanAfter ++;
        }
        countCarsCleanAfter++;
    })

    if(countCars == countCheckedCars && countCars > 0 && countCarsCleanBefore == countCheckedCarsCleanBefore && countCarsCleanBefore > 0  && countCarsCleanAfter == countCheckedCarsCleanAfter && countCarsCleanAfter > 0){
        $('#cochesLbl').removeClass('label-primary').addClass('label-success')
        // $('#carsFieldset').css('border-color', 'green')
    }else{
        $('#cochesLbl').removeClass('label-success').addClass('label-primary')
        $('#carsFieldset').css('border-color', '#002490')
    }
}

/**
 * Cambia el alto del footer
 */
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
    getSmsUp();
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

    $("#infoCopy").popover({placement:"top", container: 'body', html: true})
   
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
    getVivoRecuerdoApiKeys(expedientID);

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
            expedientInfo = expedient
        }
    });

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ------------------------------------------------ Sección de detalles del servicio ----------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    // Datos procedentes del expediente
    var gender = ''
    if(expedient.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }else{
        gender = "D. "
    }
    $('.numberExp').text(expedient.number);
    $('.deceased').text(' '+gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('#formCService #nameLastname').val(gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('#formCService #expedientNumber').val(expedient.number);
    if(expedient.clientType == '2'){
        $('#formCService #insurance').val(expedient.name);
    }
    
    if(expedient.clientType != 2 || expedient.clientType != 3){
        $('#formCService #policyNumber').val(expedient.policy);
        $('#formCService #capital').val(expedient.capital);
        $('#formCService #loss').val(expedient.lossNumber);
    } else{
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
    $('#formCService #dni').val(expedient.dni);
    var revReq = expedient.revReqCheck;

    if(expedient.revReqCheck == 1){
        $('#revReq').iCheck('check');
    }else{
        $('#revReq').iCheck('uncheck');
        $('#revReqText').addClass('c-red')
    }

    $('#revReq').on('ifUnchecked', function(event){
        revReq = 0;
        $('.controlSection').addClass('hide')
        $('#revReqText').addClass('c-red')
    });
    $('#revReq').on('ifChecked', function(event){
        revReq = 1;
        $('.controlSection').removeClass('hide')
        $('#revReqText').removeClass('c-red')
        getControl(expedientID)
    });

    if(expedient.revReqCheck == 1){
        $('.controlSection').removeClass('hide')
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
        ------------------------------------------------ Sección de control ----------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    if(expedient.control == 1){
        $('#control').prop('checked', true)
        // $("#controlFieldset").css('border-color', 'green');
        $('#controlTitle').removeClass('label-primary').addClass('label-success')
    }else{
        $('#controlCheck').addClass('c-red')
    }

    $('#controlAssistance').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expedients/services/assistants.php?expedient=' + expedientID,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    t : 0
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            id: item.ID,
                            text: item.name
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

    $('#controlSend').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expedients/services/emailsData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    t : 0
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            id: item.ID,
                            text: item.email
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

    getControl(expedientID)

    $('#sendControl').click(function(){
        $('#sendControl').attr('disabled', true);
        
        var toSend = []

        // Sent to
        var emails = $('#controlSend').val()
        if(emails == null){
            toSend.push(new Array(''));
        }else{
            $.ajax({
                url : uri + 'core/expedients/services/functions.php',
                method : 'POST',
                data : {
                    type : 'getEmailsControl',
                    emails : emails
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data)
                    
                    toSend.push(data)
                }
            })
        }

        // Copy
        var copy = $('#controlCopy').val();
        if(copy == null){
            toSend.push(new Array(''));
        }else{
            toSend.push(copy);
        }

        // Assistances
        var assistants = $('#controlAssistance').val();
        if(assistants == null){
            toSend.push(new Array(''));
        }else{
            $.ajax({
                url : uri + 'core/assistances/getEmails.php',
                method : 'POST',
                data : {
                    assistants : assistants
                },
                async : false,
                success : function(data){
                    data = $.parseJSON(data);
                    
                    var emails = new Array;
                    $.each(data, function(index, elem){
                        emails.push(elem.email)
                    })
                    toSend.push(emails);
                }
            })
        }

        var body = []
        var controlExpedient = 'Aviso de defunción Exp: ' + $('#controlExpedient').text()
        var controlName = 'Nombre: ' + $('#controlName').text()
        var controlDni = 'DNI: ' + $('#controlDni').text()
        var controlCapital = 'Capital: ' + $('#controlCapital').text()
        var controlPolicy = 'Póliza: ' + $('#controlPolicy').text()
        var controlDeceasedDate = $('.controlDeceasedDate').text() + ' ' + $('#controlDeceasedDate').text()
        var controlDeceasedLocation = $('.controlDeceasedLocation').text() + ' ' + $('#controlDeceasedLocation').text()
        var controlMortuary = 'Tanatorio: ' + $('#controlMortuary').text()
        var assistant = "";
        $.each($("#controlAssistance option:selected"), function(index, value){
            assistant += $(this).text() + ", "
        })
        var controlAssistanceData = assistant.substring(0, assistant.length - 2);
        var controlAssistance = 'Asistencia: ' + controlAssistanceData
        var controlNotes = 'Notas: ' + $('#controlNotes').val()
        
        body.push(  controlExpedient, controlName, controlDni, controlCapital, controlPolicy,
                    controlDeceasedDate, controlDeceasedLocation, controlMortuary, controlAssistance,
                    controlNotes)

        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            method : 'POST',
            data : {
                type : 'sendControl',
                emails : toSend,
                body : body,
                expedient : expedientID
            },
            success : function(data){
                data = $.parseJSON(data);

                $('.sendControlError').empty()
                if(data[0]){
                    if(data[1] == 0){
                        $('.sendControlError').removeClass('hide alert-danger')
                        $('.sendControlError').addClass('alert-danger')
                        $('.sendControlError').append('<p>No se ha escogido ningún destinatario para el envío del correo o los destinatarios escogidos no tienen un correo asignado</p>')
                        return false;
                    }
                    $('.sendControlError').removeClass('hide alert-danger')
                    $('.sendControlError').addClass('alert-success')
                    $('.sendControlError').append('<p>El correo ha sido enviado</p>')

                    $.ajax({
                        url : uri + 'core/expedients/services/functions.php',
                        method : 'POST',
                        data : {
                            type : 'updateControlSent',
                            expedient : expedientID
                        },
                        success : function(data){
                            $('#controlSent').text('El email ya ha sido enviado!')
                            setTimeout(function(){
                                $('#controlSent').empty()
                            }, 5000)
                        }
                    })
                }else{
                    $('.sendControlError').removeClass('hide alert-success')
                    $('.sendControlError').addClass('alert-danger')
                    $('.sendControlError').append('<p>Error al enviar el correo. Inténtelo de nuevo</p>')
                    setTimeout(function(){
                        $('.sendControlError').empty()
                    }, 5000)
                }

                $('#sendControl').attr('disabled', false);
            },
            error : function(){
                $('.sendControlError').removeClass('hide alert-success')
                $('.sendControlError').addClass('alert-danger')
                $('.sendControlError').empty()
                $('.sendControlError').append('<p>Error al enviar el correo. Inténtelo de nuevo</p>')
                setTimeout(function(){
                    $('.sendControlError').empty()
                }, 5000)

                $('#sendControl').attr('disabled', false);
            }
        })
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

        $('#modal-new-priest .churches').append(
            '<span class="label label-default small labelPhones">' +
            '   <input type="hidden" value="' + church + '">' +
            '   <span class="number">' + churchName + '</span> ' +
            '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
            '</span><br>'
        )

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
                if(data==0){
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

    // CEMENTERIOS
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

        $('#modal-new-gravedigger .cemeteries').append(  
            '<span class="label label-default small labelPhones">' +
            '   <input type="hidden" value="' + cemetery + '">' +
            '   <span class="number">' + cemeteryName + '</span> ' +
            '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
            '</span><br>'
        )

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
            if(location=="undefined" || location=="" ||  location == null){
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

        $('#modal-new-bellringer .churches').append(
            '<span class="label label-default small labelPhones">' +
            '   <input type="hidden" value="' + church + '">' +
            '   <span class="number">' + churchName + '</span> ' +
            '   <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i>' +
            '</span><br>'
        )

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

        if($('#modal-new-bellringer #email').val() != ''){
            if(!isEmail($("#modal-new-bellringer #email"))){
                validate++
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
            var email = $("#modal-new-bellringer #email").val()
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
                    email : email,
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
                if(data==0){
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

    var notifiedChoirCheck = expedient.notifiedChoir;
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
                        bellringerSelected = null
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
        -------------------------------------------------------- Sección de  ------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    // Datos del expediente - servicio
    if(expedient.carriersTime != null){       
        $('#carriersTime').val(moment(expedient.carriersTime, "HH:mm:ss").format("HH:mm"))
    }else{
        if(expedient.ceremonyTime != null && expedient.ceremonyTime != '' && expedient.ceremonyTime != undefined){
            var ceremonyTime = moment(expedient.ceremonyTime, 'HH:mm:ss').format('X')

            ceremonyTime = parseInt(ceremonyTime) - 3600
            ceremonyTime = moment(ceremonyTime, 'X').format('HH:mm')

            $('#carriersTime').val(ceremonyTime)
        }else{
            $('#carriersTimeLabel').addClass('c-red')
        }
    }

    $('#carriersTime').change(function(){
        if($(this).val() == '' || $(this).val() == null){
            $('#carriersTimeLabel').addClass('c-red')
        }else{
            $('#carriersTimeLabel').removeClass('c-red')
        }
    })

    if(expedient.carriersTimeCheck == 0){
        $('#carriersTimeCheckText').addClass('c-red')
    }else{
        $('#carriersTimeCheck').prop('checked', true)
    }

    $('#carriersTimeCheck').change(function(){
        if($(this).prop('checked')){
            $('#carriersTimeCheckText').removeClass('c-red')
        }else{
            $('#carriersTimeCheckText').addClass('c-red')
        }
    })

    // Seleccionados
    var carriersTable = $('#carriers-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/expedients/services/carriers.php?ID=" + expedientID,
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
            {"title": "Porteador"},
            {"title": "Teléfonos"},
            {"title": "Confirmado"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [{
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
            "className": "centered",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "7%",
            "render": function(data, type, row){
                if(data == 0){
                    return '<input class="confirmed" type="checkbox">';
                }else{
                    return '<input class="confirmed" type="checkbox" checked>';
                }
            }
        },
        {
            "className": "centered details-control removeClick",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            "defaultContent": "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
        }],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[0, 'asc']],
        "rowCallback" : function(row, data, index){
            if(data[3] == 0){
                $('td', row).css('color', '#E61919')
            }
        },
        "initComplete": function(){
            changeColorCarriers()
        }
    });

    // Listado de 
    $('#carrierAdd').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/carrierData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    fromTime: $("#carriersTime").val(),
                    service: expedientID
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            id: item.carrierID,
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

    $('#saveNewCarrier').click(function(){
        //Recogemos los parámetros del formulario y los enviamos para procesar la solicitud create
        var nif = $("#modal-new-carrier #nif").val();
        var name = $("#modal-new-carrier #name").val();
        var surname = $("#modal-new-carrier #surname").val();
        var address = $("#modal-new-carrier #address").val();
        var location = $("#modal-new-carrier #location").val();

        //Si el usuario no escoge una localidad por defecto dicho valor a nivel db debe indicarse "NULL"
        if(location == "undefined" || location == "" ||  location == null){
            location = 1;
        }

        var mail = $("#modal-new-carrier #mail").val();

        //Obtenemos los teléfonos con el formato "NUMERO1-NUMERO2"
        var phones = "";
        $('#modal-new-carrier .phones .label').each(function(){
            var number = $(this).find('.number').text();
            phones += number+"-";
        });

        //Eliminamos el último delimitador "-" de los teléfonos
        phones=phones.slice(0,-1);
        var drives = $("#modal-new-carrier #drives").val();

        //Si el usuario no escoge el "conduce" por defecto dicho valor a nivel db debe indicarse "NULL"
        if(drives=="undefined" || drives==""){
            drives = "NULL";
        }

        var entryDate = $("#modal-new-carrier #entryDate").val();
        if(moment(entryDate, "DD/MM/YYYY").isValid()){
            entryDate = moment(entryDate,"DD/MM/YYYY").format("YYYY-MM-DD");
        }else{
            entryDate ="NULL";
        }

        //Validaciones
        var validate = 0
        if($("#modal-new-carrier #formNewData #nif").val()!=""){
            if(!isNifCif($("#modal-new-carrier #formNewData #nif"))){
                validate++
            }
        }
        if(isEmpty($("#modal-new-carrier #formNewData #name"))){
            validate++
        }
        if($("#modal-new-carrier #formNewData #mail").val()!=""){
            if(!isMail($("#modal-new-carrier #formNewData #mail"))){
                validate++
            }
        }
        if($("#modal-new-carrier #formNewData #entryDate").val()!=""){
            if(!isDate($("#modal-new-carrier #formNewData #entryDate"))){
                validate++
            }
        }
        
        //Si las validaciones han resultado satisfactorias
        if(validate == 0){
            //Enviamos por post al CRUDLE para procesar la solicitud
            $.post(uri+"core/carriers/create.php", {location: location, nif: nif, name: name, surname: surname, address: address, mail: mail, phones: phones, drives: drives, entryDate}, function(data){
                data = $.parseJSON(data)
                if(data['success']){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El porteador se ha creado con éxito.</div>');
                    $('#modal-new-carrier').modal('hide');
                    table.ajax.reload();
                }else if(data['cif']){
                   $('#formNewData #msg').html('<div class="alert alert-error alert-dismissible text-center fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Ya existe un porteador con ese NIF.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    $('#modal-new-carrier').modal('hide');                  
                }

                setTimeout(function(){
                    $('#formNewData #msg').empty()
                    $('#block-message').empty()
                }, 5000)

                //Recargamos la tabla con los nuevos datos
                table.ajax.reload();
            });
        }else{
            $('#modal-new-carrier #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-carrier #warning-message').empty()
            }, 3500)
        }
    });

    // Selección de disponibles
    $('#carrierAdd').on('select2:select', function(){
        $.ajax({
            url: uri+"core/expedients/services/functions.php",
            data: {type: 'setCarrier', service: expedientID, carrier: $("#carrierAdd").val(), fromTime: $("#carriersTime").val()},
            type: 'POST',
            async: false,
            success: function (data) {
                if(data){
                    carriersTable.ajax.reload();
                }
            }
        });

        $("#carrierAdd").val('').change();
    });

    carriersTable.on('click', '.btn-delete', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-delete').tooltip('hide');

        var rowClick = carriersTable.row($(this).closest('tr')).data() == undefined ? carriersTable.row($(this).closest('tr.child').prev()).data() : carriersTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el porteador: " + rowClick[1] + "?")){
            $.ajax({
                url: uri + "core/expedients/services/functions.php",
                data: {type: 'deleteCarrier', serviceCarrier: rowClick[0]},
                type: 'POST',
                async: false,
                success: function(data){
                    if(data){
                        carriersTable.ajax.reload();
                        changeColorCarriers()
                        drawCarsData(expedientID)
                    }
                }
            });
        }
    });

    //Actualizamos el campo avisado para los en los porteadores
    carriersTable.on('click', '.confirmed', function () {
        var rowClick = carriersTable.row($(this).closest('tr')).data() == undefined ? carriersTable.row($(this).closest('tr.child').prev()).data() : carriersTable.row($(this).closest('tr')).data()
        var confirmed = $(this).prop('checked');
        
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {type: 'updateCarrier', serviceCarrier: rowClick[0], confirmed: confirmed},
            type: 'POST',
            async: false,
            success: function(data){
                if(data){
                    carriersTable.ajax.reload();
                    changeColorCarriers()
                }
            }
        });   
    });

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        ---------------------------------------------------------- Sección de coches ---------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    // Listado de coches
    $('#addCar').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/cars/dataServices.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    expedient: expedientID
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.brand + " - " + item.model + " - " + item.name + item.number,
                            id: item.carID,
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
    $('#addCar').on('select2:select', function(){
        $.ajax({
            url: uri + "core/expedients/services/functions.php",
            data: {
                type: 'setCar',
                service: expedientID,
                car: $("#addCar").val()
            },
            type: 'POST',
            async: false,
            success: function(data){
                data = $.parseJSON(data)

                if(data != null){
                    var scID = data.ID
                    var licensePlate = data.licensePlate
                    if(licensePlate == null){
                        licensePlate = '-'
                    }
                    var brand = data.brand
                    if(brand == null){
                        brand = '-'
                    }
                    var model = data.model
                    if(model == null){
                        model = '-'
                    }
                    // $('#carsTableBody').empty();

                    if($('#carsTableBody').find('tr.noCars').length == 1){
                        $('#carsTableBody').find('tr.noCars').remove();
                    }
                    $('#carsTableBody').append( 
                        '<tr>' +
                        '   <td class="text-center scID hide">' + scID + '</td>' +
                        '   <td class="text-center">' + licensePlate + '</td>' +
                        '   <td class="text-center">' + brand + '</td>' +
                        '   <td class="text-center">' + model + '</td>' +
                        '   <td class="text-center">' + 
                        '       <div class="form-group" style="margin-bottom:0!important;"><select class="form-control select2 driver" id="driver' + scID + '"></select></div>' +
                        '   </td>' +
                        '   <td class="text-center">' + 
                        '       <div class="form-group" style="margin-bottom:0!important;"><select class="form-control select2 cleanBefore" id="cleanBefore' + scID + '"></select></div>' +
                        '   </td>' +
                        '   <td class="text-center">' + 
                        '       <div class="form-group" style="margin-bottom:0!important;"><select class="form-control select2 cleanAfter" id="cleanAfter' + scID + '"></select></div>' +
                        '   </td>' +
                        '   <td class="text-center"><ul class="actions-menu"><li><a href="javascript:void(0)" class="carDel' + scID + '"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></li></ul>' +
                        '</tr>'
                    );

                    $('.driver').select2({
                        containerCssClass: 'select2-driver',
                        language: langSelect2,
                        placeholder: '--',
                        allowClear: true,
                        ajax: {
                            url: uri+'core/expedients/services/carrierData.php',
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                return {
                                    q: params.term || "",
                                    page_limit: limit_page,
                                    page: params.page,
                                    fromTime: $("#carriersTime").val(),
                                    service: expedientID,
                                    opt: "drivers"
                                };
                            },
                            processResults: function (data, params) {
                                return {
                                    results: $.map(data.items, function (item) {
                                        return {
                                            text: item.name,
                                            id: item.carrierID
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
                    })
                
                    $('.cleanBefore').select2({
                        containerCssClass: 'select2-cleanBefore',
                        language: langSelect2,
                        placeholder: '--',
                        allowClear: true,
                        ajax: {
                            url: uri+'core/expedients/services/usersCleaningData.php',
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
                    })
                
                    $('.cleanAfter').select2({
                        containerCssClass: 'select2-cleanAfter',
                        language: langSelect2,
                        placeholder: '--',
                        allowClear: true,
                        ajax: {
                            url: uri+'core/expedients/services/carrierData.php',
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                return {
                                    q: params.term || "",
                                    page_limit: limit_page,
                                    page: params.page,
                                    fromTime: $("#carriersTime").val(),
                                    service: expedientID,
                                    opt: "drivers"
                                };
                            },
                            processResults: function (data, params) {
                                return {
                                    results: $.map(data.items, function (item) {
                                        return {
                                            text: item.name,
                                            id: item.carrierID
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
                    })
                    $('#driver' + scID).change(function(){
                        var driver = $(this).val()
                        var driverName = ''
                        $.ajax({
                            url: uri + 'core/users/functions2.php',
                            method: 'POST',
                            data: {
                                id: driver,
                                type: 'getUserName'
                            },
                            async: false,
                            success: function(data){
                                var parse = $.parseJSON(data)
                                driverName = parse.name
                            }
                        })
                        if($('#cleanAfter' + scID).find("option[value='" + driver + "']").length){
                            $('#cleanAfter' + scID).val(driver).trigger('change');
                        }else{ 
                            var newOption = new Option(driverName, driver, true, true);
                            $('#cleanAfter' + scID).append(newOption).trigger('change');
                        }

                        changeColorCars()
                    })

                    $('.carDel' + scID).click(function(){
                        if(confirm("¿Está seguro de que quiere borrar el coche: " + brand + " " + model + " " + licensePlate + "?")){
                            $.ajax({
                                url : uri + 'core/expedients/services/functions.php',
                                method : 'POST',
                                data : {
                                    type : 'deleteCar',
                                    serviceCar : scID
                                },
                                success : function(data){
                                    data = $.parseJSON(data)
            
                                    if(data){
                                        $('#carsTableBody').find('.carDel' + scID).closest('tr').remove()
                                        if($('#carsTableBody').find('tr').length == 0){
                                            $('#carsTableBody').append('<tr class="noCars"><td valign="top" colspan="7" class="dataTables_empty">Ningún dato disponible en esta tabla</td></tr>')
                                        }
                                        
                                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El coche se ha eliminado con éxito.</div>');
                                    }else{
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    }
                                    
                                    var rows = document.getElementById('carsTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
                                    if(rows == 0){
                                        $('#carsTableBody').append( 
                                            '   <tr>' +
                                            '      <td valign="top" colspan="7" class="dataTables_empty">Ningún dato disponible en esta tabla</td>'+
                                            '   </tr>'
                                        )
                                    }
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
        
                                    $('.carDel' + scID).tooltip('hide');
                                },
                                error : function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
                            })
                            changeColorCars()
                        }
                    })
                }else{
                    $('#carsTableBody').append( 
                        '   <tr class="noCars">' +
                        '       <td valign="top" colspan="7" class="dataTables_empty">Ningún dato disponible en esta tabla</td>'+
                        '   </tr>'
                    );
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        });

        $("#addCar").val('').change();
    });

    // Nuevo vehículo
    $('#saveNewVehicle').click(function(){
        var validate = 0
        if(isEmpty($("#modal-new-car #licensePlate"))){
            validate++
        }
       
        if(isEmpty($("#modal-new-car #brand"))){
            validate++
        }
        if(isEmpty($("#modal-new-car #model"))){
            validate++
        }

        if(validate == 0){
            var licensePlate = $('#modal-new-car #licensePlate').val()
            var imei = $('#modal-new-car #imei').val()
            var brand = $('#modal-new-car #brand').val()
            var model = $('#modal-new-car #model').val()
            var kms = $('#modal-new-car #kms').val()
            var maintenance
            $('#modal-new-car #maintenance').prop('checked') ? maintenance = 1 : maintenance = 0
            var chassis = $('#modal-new-car #chassis').val()
            var type = $('#modal-new-car #type').val()
            var external
            $('#modal-new-car #external').prop('checked') ? external = 1 : external = 0

            $.ajax({
                url : uri + 'core/garage/vehicles/create.php',
                method : 'POST',
                data : {
                    licensePlate : licensePlate,
                    imei : imei,
                    brand : brand,
                    model : model,
                    kms : kms,
                    maintenance : maintenance,
                    chassis : chassis,
                    type : type,
                    external : external
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El vehículo se ha creado con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    table.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })

            $('#modal-new-car').modal('hide')
            changeColorCars()
            $('#modal-new-car input').val('')
        }else{
            $('#modal-new-car #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Faltan campos por cubrir o tienen un formato incorrecto</div>')

            setTimeout(function(){
                $('#modal-new-car #warning-message').empty()
            }, 3500)
        }
    })

    // COCHES
    drawCarsData(expedientID);

    $('.driver').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/carrierData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    fromTime: $("#carriersTime").val(),
                    service: expedientID,
                    opt: "drivers"
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.carrierID
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
    })

    $('.cleanBefore').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/usersCleaningData.php',
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
    })

    $('.cleanAfter').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri+'core/expedients/services/carrierData.php',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term || "",
                    page_limit: limit_page,
                    page: params.page,
                    fromTime: $("#carriersTime").val(),
                    service: expedientID,
                    opt: "drivers"
                };
            },
            processResults: function (data, params) {
                return {
                    results: $.map(data.items, function (item) {
                        return {
                            text: item.name,
                            id: item.carrierID
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
    })

    changeColorCars();

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
    if(company != 1 && company != 6 && company != 3 && company != 2 && company != 9 && company != 20 && company != 19 && company != 11 && company != 22){
        setTimeout(() => {
            $('#webNotApply').prop('checked', true).trigger('change')
        }, 250)
        $('#webSection').addClass('hide')
    }
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
                                        
                                        if(parseInt(elem2.action) == 6){ //Check de no aplica
                                            othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                        }

                                        if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){
                                            if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)"> <label>' + elem2.label + '</label></div>'
                                            }else{
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>'                                       
                                            }                                    
                                        }else{
                                            if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                            }else{
                                                text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                            }
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
                                                break
                        
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
                                                        break
                        
                                                    case '40':  
                                                        text += '<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>' 
                                                        // PICKERS
                                                        $('.timepicker').timepicker({
                                                            showInputs: false,
                                                            showMeridian: false,
                                                            timeFormat: 'HH:mm',
                                                            defaultTime: false
                                                        })
                                                        break
                        
                                                    default:  
                                                        if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'                                                    
                                                        }else{
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'                                                    
                                                        }
                                                        break
                                                }                                        
                                                break
                                                
                                            default:
                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'
                                                }else{
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                }
                                                break
                                        }
                                    break
                                        
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
                                    break
        
                                    case 'link':
                                        text += '<div class="spaceRight"><button type="button"></button></div>'
                                    break
                                        
                                    case 'button':
                                        text += '<div class="spaceRight"><button type="button"></button></div>'
                                    break
        
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
                                                placeholder: '--',
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
                                                escapeMarkup: function (markup) { return markup; },
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
                                    break
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

                                            if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                            }

                                            if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){   
                                                if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)"> <label>' + elem2.label + '</label></div>'                                            
                                                }else{
                                                    countCheckbox++;
                                                    checkboxItems++;
                                                  
                                                    redTittles.push('#'+elem.preOrderID+'lbl')
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>'                                            
                                                }                                 
                                            }else{

                                                if(parseInt(elem2.action) == 6){
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                                }else{
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                                }

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
                                                break
                            
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
                                                        break
                            
                                                        case '40':  
                                                            text += '<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>' 
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
                                                                text += '<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>'
                                                            }else{
                                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>'
                                                                }else{
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                                }
                                                            }
                                                        break
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
                                                break
                                            }
                                            //text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '"></div>'
                                            break
                                            
                                        case 'select':
                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>'
                                            switch(elem2.action){
                                                case '14':
                                                    $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                                    $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                                    $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                                    break;
                                            }
                                            break
            
                                        case 'link':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                            break
                                            
                                        case 'button':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                            break
            
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
                                            break
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

                                            if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                            }

                                            if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){  
                                                if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)"> <label>' + elem2.label + '</label></div>'                                            
                                                }else{
                                                    redTittles.push('#'+elem.preOrderID+'lbl')
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>'                                            
                                                    countCheckbox++;
                                                    checkboxItems++;
                                                }                                  
                                            }else{
                                                if(parseInt(elem2.action) == 6){ //Check de no aplica
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                                }else{
                                                    text += '<div class="spaceRight"><input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>'                                                                         
                                                }
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
                                                    
                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                            
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
                                                            text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>'                                                   
                                                            // PICKERS
                                                            $('.datepicker').datepicker({
                                                                autoclose: true,  
                                                                language: 'es',
                                                                weekStart: 1,
                                                                todayHighlight : true,forceParse: false
                                                            })
                                                        break
                            
                                                        case '40':  
                                                            text += '<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>' 
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
                                                                text += '<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>'
                                                            }else{
                                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:55px!important;text-align:center"></div>'
                                                                }else{
                                                                    text += '<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '" value="' + inputValue + '" style="width:350px!important;"></div>'
                                                                }
                                                            }
                                                        break
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
                                                break
                                            }
                                        break
                                            
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
                                            break
            
                                        case 'link':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                            break
                                            
                                        case 'button':
                                            text += '<div class="spaceRight"><button type="button"></button></div>'
                                            break
            
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
                                        break
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
                                            var order;
                                            order = orderID
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
                                        
                                        //$('#modal-view-orders').modal('hide')
                                        
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
                                    var order = elem.orderID;
                                    

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
                            }
                        }
                    }

                    supplierBtn = elem.supplierID
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
                                '                       <td width="10%" id="texts' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID + '"></td>' +
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
                        $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<p>-</p>')
                    }else{       
                        var countSuccess = 0;             
                        var countCheckbox = 0;          
                        $.each(elem.actions, function(index2, elem2){   
                            switch(elem2.type){
                                case 'checkbox':
                                    if(parseInt(elem2.action) == 6){ //Check de no aplica
                                        othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                    }

                                    if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){
                                        if(parseInt(elem2.action) == 6){ //Check de no aplica
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)"> <label>' + elem2.label + '</label></div>')
                                        }else{
                                            countCheckbox++;
                                            checkboxItems++;
                                            redTittles.push('#'+elem.modelID+'lbl')
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>')
                                        }                                    
                                    }else{
                                        if(parseInt(elem2.action) == 6){ //Check de no aplica
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" checked onchange="noApplyActions(this)"> <label>' + elem2.label + '</label></div>')                                   
                                        }else{
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>')                                   
                                        }

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
                                            
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '" ></div>')
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
                                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>')
                                                    // PICKERS
                                                    $('.datepicker').datepicker({
                                                        autoclose: true,  
                                                        language: 'es',
                                                        weekStart: 1,
                                                        todayHighlight : true,forceParse: false
                                                    })
                                                break
                    
                                                case '40':                                                
                                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>')
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
                                                        $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>')
                                                    }else{
                                                        if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:55px!important;text-align:center"></div>')
                                                        }else{
                                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width: 350px!important;"></div>')
                                                        }
                                                    }
                                                break
                                            }                                        
                                            break
                                            
                                        default:      
                                            if(elem2.label == 'Notas'){                                  
                                                $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>')
                                            }else{
                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>')
                                                }else{
                                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:350px!important;"></div>')
                                                }
                                            }
                                            break
                                    }
                                    break
                                    
                                case 'select':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>')
                                    switch(elem2.action){
                                        case '14':
                                            $('select[itemType="recordatorio"]').append('<option value="1">Para el cementerio</option>')
                                            $('select[itemType="recordatorio"]').append('<option value="2">Para la mesa</option>')
                                            $('select[itemType="recordatorio"]').val(elem2.value).trigger('change')
                                        break;
                                    }
                                    break

                                case 'link':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                break
                                    
                                case 'button':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                break

                                case 'staff':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>')
                                    
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
                        $('#texts' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<p>-</p>')
                    }else{
                        $.each(elem.texts, function(index2, elem2){
                            if(elem2.value == ""){
                                elem2.value = "-"
                            }
                            $('#texts' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<p>' + elem2.value + '</p>')
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
                        $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<p>-</p>')
                    }else{   
                        var countSuccess = 0;       
                        var countCheckbox = 0;                        
                        $.each(elem.actions, function(index2, elem2){                        
                            switch(elem2.type){
                                case 'checkbox':

                                    if(parseInt(elem2.action) == 6){ //Check de no aplica
                                        othersNotAplly.push(elem.modelID + '.' + elem2.action)
                                    }

                                    if(elem2.value == "0" || elem2.value == 0 || elem2.value == ""){
                                        if(parseInt(elem2.action) == 6){ //Check de no aplica
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)"> <label>' + elem2.label + '</label></div>')
                                        }else{
                                            countCheckbox++;
                                            checkboxItems++;
                                            redTittles.push('#'+elem.modelID+'lbl')
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '"> <label class="c-red">' + elem2.label + '</label></div>')
                                        }                                    
                                    }else{

                                        if(parseInt(elem2.action) == 6){ //Check de no aplica
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" onchange="noApplyActions(this)" checked> <label>' + elem2.label + '</label></div>')                                   
                                        }else{
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><input type="' + elem2.type + '" id="'+ elem.modelID + '.' +elem2.action+'" hiring="' + elem.hiringID + '" checked> <label>' + elem2.label + '</label></div>')                                   
                                        }
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

                                    switch(elem2.action){
                                        case '39':                                                
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="datepicker" value="' + inputValue + '"></div>')
                                            // PICKERS
                                            $('.datepicker').datepicker({
                                                autoclose: true,  
                                                language: 'es',
                                                weekStart: 1,
                                                todayHighlight : true,forceParse: false
                                            })
                                        break
            
                                        case '40':                                                
                                            $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight bootstrap-timepicker timepicker"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="timepicker" value="' + inputValue + '"></div>')
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
                                                $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <textarea type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" style="width: 350px !important; vertical-align: middle;">' + inputValue + '</textarea></div>')
                                            }else{
                                                if(elem2.label == 'Hora pedido' || elem2.label == 'Hora Recibido'){
                                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:55px!important;text-align:center;"></div>')
                                                }else{
                                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <input type="' + elem2.type + '" id="'+ elem.modelID + '.'  + elem2.action + '" hiring="' + elem.hiringID + '" class="" value="' + inputValue + '" style="width:350px!important;"></div>')
                                                }
                                            }
                                        break
                                    }                       
                                break;
                                    
                                case 'select':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select itemType="recordatorio" id="' + elem.modelID + '.' + elem2.action + '" hiring="' + elem.hiringID + '"></select></div>')
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
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                break
                                    
                                case 'button':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><button type="button"></button></div>')
                                break

                                case 'staff':
                                    $('#actions' + (elem.hiringID == null ? '' : elem.hiringID) + elem.modelID).append('<div class="spaceRight"><label>' + elem2.label + '</label> <select class="select2" id="' + elem.modelID + '.' + elem2.action + '" name="' + elem.productID +  '-' + elem2.action +'" hiring="' + elem.hiringID + '"></select></div>')
                                    
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

    $('#tribunalUser').select2({
        containerCssClass: 'select2-tribunalUser',
        language: langSelect2,
        placeholder: 'Quién lo realiza',
        allowClear: true,
        ajax: {
            url: uri + 'core/staff/expedientsTribunal.php',
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

    $('#doctorDeliver').select2({
        containerCssClass: 'select2-doctorDeliver',
        language: langSelect2,
        placeholder: 'Quién lo realiza',
        allowClear: true,
        ajax: {
            url: uri + 'core/staff/expedientsTribunal.php',
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

    //Recorrer las acciones de los productos
    if(expedient.notApplyAll == 1){
        $('#notApplyAll').prop('checked', true)
        // expedient.policeNotApply = 1
        // expedient.tribunalNotApply = 1
        // expedient.literalNotApply = 1
        // expedient.tombstoneNotApply = 1
        // expedient.doctorNotApply = 1
        // expedient.webNotApply = 1
        // expedient.preparationNotApply = 1
        // expedient.gravediggersNotApply = 1
    }

    $('#notApplyAll').change(function(){
        if($(this).prop('checked')){
            $('#notApplyAll').prop('checked', true)
            $('#literalNotApply').prop('checked', true)
            $('#literalNotApply').val(1).trigger('change')
            $('#tombstoneNotApply').prop('checked', true)
            $('#tombstoneNotApply').val(1).trigger('change')
            $('#policeNotApply').prop('checked', true)
            $('#policeNotApply').val(1).trigger('change')
            $('#gravediggersNotApply').prop('checked', true)
            $('#gravediggersNotApply').val(1).trigger('change')
            $('#tribunalNotApply').prop('checked', true)
            $('#tribunalNotApply').val(1).trigger('change')
            $('#literalNotApply').prop('checked', true)
            $('#literalNotApply').val(1).trigger('change')
            $('#doctorNotApply').prop('checked', true)
            $('#doctorNotApply').val(1).trigger('change')
            $('#webNotApply').prop('checked', true)
            $('#webNotApply').val(1).trigger('change')
            $('#preparationNotApply').prop('checked', true)
            $('#preparationNotApply').val(1).trigger('change')
            $('#vivoNotApply').prop('checked', true)
            $('#vivoNotApply').val(1).trigger('change')

            //No aplica de los productos de la seccion de Otros   
            $('#othersSection').find('input[type=checkbox]').each(function(index, elem){
                var item = $(this)
                $.each(othersNotAplly, function(index2, elem2){
                    if(item.attr('id') == elem2){
                        item.prop('checked', true)
                    }
                })
            })
        }else{
            $('#notApplyAll').prop('checked', false)
            $('#literalNotApply').prop('checked', false)
            $('#literalNotApply').val(0).trigger('change');
            $('#policeNotApply').prop('checked', false)
            $('#policeNotApply').val(0).trigger('change');
            $('#gravediggersNotApply').prop('checked', false)
            $('#gravediggersNotApply').val(0).trigger('change');
            $('#tribunalNotApply').prop('checked', false)
            $('#tribunalNotApply').val(0).trigger('change');
            $('#literalNotApply').prop('checked', false)
            $('#literalNotApply').val(0).trigger('change');
            $('#tombstoneNotApply').prop('checked', false)
            $('#tombstoneNotApply').val(0).trigger('change');
            $('#doctorNotApply').prop('checked', false)
            $('#doctorNotApply').val(0).trigger('change');
            $('#webNotApply').prop('checked', false)
            $('#webNotApply').val(0).trigger('change');
            $('#preparationNotApply').prop('checked', false)
            $('#preparationNotApply').val(0).trigger('change');
            $('#vivoNotApply').prop('checked', false)
            $('#vivoNotApply').val(0).trigger('change');
            
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

    expedient.literalReceived == 0 || expedient.literalReceived == null? $('#literalReceived').prop('checked', false) : $('#literalReceived').prop('checked', true)
    expedient.literalNoFinished == 0 || expedient.literalNoFinished == null? $('#literalNoFinished').prop('checked', false) : $('#literalNoFinished').prop('checked', true)
    expedient.literalRequest == 0 || expedient.literalRequest == null? $('#literalRequest').prop('checked', false) : $('#literalRequest').prop('checked', true)
    
    if(expedient.literalVolumePage != null && expedient.literalVolumePage != ''){
        $('#literalVolumePage').val(expedient.literalVolumePage)
    }

    if(expedient.literalWhoTakes != 'null' && expedient.literalWhoTakes != ''){
        $('#literalWhoTakes').val(expedient.literalWhoTakes)
    }

    if(expedient.literalCivilRegister != 'null' && expedient.literalCivilRegister != ''){
        $('#literalCivilRegister').val(expedient.literalCivilRegister)
    }
 
    if(expedient.literalDateExit != null && expedient.literalDateExit != '' && expedient.literalDateExit != 'null'){
        $('#literalDateExit').val(moment(expedient.literalDateExit,'YYYY-MM-DD').format('DD/MM/YYYY'))
    }

    $('#literalTimeExit').val(expedient.literalTimeExit)
    expedient.literalNotApply == 0 || expedient.literalNotApply == null? $('#literalNotApply').prop('checked', false) : $('#literalNotApply').prop('checked', true)    
    
    bgRed = 'c-red'
    if(expedient.literalNotApply == 0 || expedient.literalNotApply == null){ //Si no esta seleccionado "no aplica"
        var flagLiteral = 0
        if(expedient.literalReceived == 0 || expedient.literalReceived == null){ //Si no esta activado    
            $("#literalReceivedLbl").addClass(bgRed)
            flagLiteral++
        }else{            
            $("#literalReceivedLbl").removeClass(bgRed)
        }
        if(expedient.literalNoFinished == 0 || expedient.literalNoFinished == null){ //Si no esta activado            
            $("#literalNoFinishedLbl").addClass(bgRed)
            flagLiteral++
        }else{            
            $("#literalNoFinishedLbl").removeClass(bgRed)
        }
        if(expedient.literalRequest == 0 || expedient.literalRequest == null){ //Si no esta activado            
            $("#literalRequestLbl").addClass(bgRed)
            flagLiteral++
        }else{            
            $("#literalRequestLbl").removeClass(bgRed)
        }
        if(flagLiteral != 0){
            $("#literalTitle").removeClass("label-primary")
        }
    }else{
        $("#literalTitle").removeClass("label-danger").addClass("label-primary")
        $("#literalReceivedLbl").removeClass(bgRed)
        $("#literalNoFinishedLbl").removeClass(bgRed)
        $("#literalRequestLbl").removeClass(bgRed)
        $('#literalReceived').prop('checked', true)
        $('#literalReceived').closest('div').addClass('hide')
        $('#literalNoFinished').prop('checked', true)
        $('#literalNoFinished').closest('div').addClass('hide')
        $('#literalRequest').prop('checked', true)
        $('#literalRequest').closest('div').addClass('hide')

        $('#literalVolumePage').closest('div').addClass('hide')
        $('#literalWhoTakes').closest('div').addClass('hide')
        $('#literalCivilRegister').closest('div').addClass('hide')
        $('#literalDateExit').closest('div').addClass('hide')
        $('#literalTimeExit').closest('div').addClass('hide')
    }

    $('#literalNotApply').change(function(){
        if($(this).prop('checked')){
            $('#literalReceived').prop('checked', true)
            $('#literalReceived').closest('div').addClass('hide')
            $('#literalNoFinished').prop('checked', true)
            $('#literalNoFinished').closest('div').addClass('hide')
            $('#literalRequest').prop('checked', true)
            $('#literalRequest').closest('div').addClass('hide')
            $('#literalVolumePage').closest('div').addClass('hide')
            $('#literalWhoTakes').closest('div').addClass('hide')
            $('#literalCivilRegister').closest('div').addClass('hide')
            $('#literalDateExit').closest('div').addClass('hide')
            $('#literalTimeExit').closest('div').addClass('hide')
        }else{
            $('#literalReceived').prop('checked', false)
            $('#literalReceived').closest('div').removeClass('hide')
            $('#literalNoFinished').prop('checked', false)
            $('#literalNoFinished').closest('div').removeClass('hide')
            $('#literalRequest').prop('checked', false)
            $('#literalRequest').closest('div').removeClass('hide')
            $('#literalVolumePage').closest('div').removeClass('hide')
            $('#literalWhoTakes').closest('div').removeClass('hide')
            $('#literalCivilRegister').closest('div').removeClass('hide')
            $('#literalDateExit').closest('div').removeClass('hide')
            $('#literalTimeExit').closest('div').removeClass('hide')
           
            $("#literalVolumePage").val(null)
            $("#literalCivilRegister").val(null)
            $("#literalWhoTakes").val(null)
            $("#literalDateExit").val(null)
        }
    })

    $('#noAplicatedCheck').change(function(){
       
        $("#notApplyAll").attr('disabled', false)
        
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
            $('#gravediggersCheckPrintedText').removeClass('c-red')
            $('#gravediggersCheckSigned').prop('checked', true);
            $('#gravediggersCheckSignedText').removeClass('c-red')

            //SECCIÓN DE PORTEADOR
            $('#carriersTimeCheck').prop('checked', true);
            $('#carriersTimeCheckText').removeClass('c-red')
            $.each($('input.confirmed'), function(index, elem){
                if($(this).prop('checked') == false){
                    $(this).click();
                }
            })
           
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

            //SECCIÓN DE PORTEADOR
            $('#carriersTimeCheck').prop('checked', false);
            $('#carriersTimeCheckText').addClass('c-red')
            $.each($('input.confirmed'), function(index, elem){
                if($(this).prop('checked') == true){
                    $(this).click();
                }
            })

            $("#notApplyAll").click();
            $('.block-collapse').collapse('show');
        }
    })

    if($("#literalRequest").prop('checked') && $("#literalReceived").prop('checked')){
        if($('#literalNoFinished').prop('checked') == false){
            $('#literalTitle').removeClass('label-primary').addClass('label-success')
            checkboxItems += 2;
        }
    }else{
        $('#literalTitle').removeClass('label-success').addClass('label-primary')
    }
    checkboxTotal += 2;

    if($('#literalNotApply').prop('checked')){
        $('#literalTitle').removeClass('label-primary').addClass('label-success')
    }else{
        $("#literalNoFinishedLbl").removeClass(bgRed).css('border-color', '#002490');
    }

    expedient.policeNotified == 0 || expedient.policeNotified == null? $('#policeNotified').prop('checked', false) : $('#policeNotified').prop('checked', true)    
    $('#policeLocation').val(expedient.policeLocation)
    expedient.policeNotApply == 0 || expedient.policeNotApply == null? $('#policeNotApply').prop('checked', false) : $('#policeNotApply').prop('checked', true)
    bgRed = 'c-red'
    if(expedient.policeNotified == 0 || expedient.policeNotified == null){ //Si no esta activado avisar a la policia
        if(expedient.policeNotApply == 0 || expedient.policeNotApply == null){ //Si no esta seleccionado "no aplica"
            $("#policeTitle").removeClass("label-primary")
        }else{
            $("#policeTitle").removeClass("label-danger").addClass("label-primary")
            $('#policeNotified').prop('checked', true)
            $('#policeNotified').closest('div').addClass('hide')
            $('#policeLocation').closest('div').addClass('hide')
        }
    }else{
        $("#policeTitle").removeClass("label-danger").addClass("label-primary")
        $("#policeLbl").removeClass(bgRed)
        if(expedient.policeNotApply == 1){
            $('#policeNotified').prop('checked', true)
            $('#policeNotified').closest('div').addClass('hide')
            $('#policeLocation').closest('div').addClass('hide')
        }
    }

    if(expedient.policeNotified == 0 || expedient.policeNotified == null){
        $("#policeLbl").addClass(bgRed)
    }
    
    if($("#policeNotified").prop('checked')){
        $('#policeTitle').removeClass('label-primary').addClass('label-success')
        checkboxItems++;
    }else{
        $('#policeTitle').removeClass('label-success').addClass('label-primary')
    }

    checkboxTotal++;
    
    $('#policeNotApply').change(function(){
        if($(this).prop('checked')){
            $('#policeNotified').prop('checked', true)
            $('#policeNotified').closest('div').addClass('hide')
            $('#policeLocation').closest('div').addClass('hide')
        }else{
            $('#policeNotified').prop('checked', false)
            $('#policeNotified').closest('div').removeClass('hide')
            $('#policeLocation').closest('div').removeClass('hide')
        }
    })

    if($('#policeNotApply').prop('checked')){
        $('#policeTitle').removeClass('label-primary').addClass('label-success')
    }

    expedient.tribunalInProgress == 0 || expedient.tribunalInProgress == null? $('#tribunalInProgress').prop('checked', false) : $('#tribunalInProgress').prop('checked', true)
    expedient.tribunalDeliver == 0 || expedient.tribunalDeliver == null? $('#tribunalDeliver').prop('checked', false) : $('#tribunalDeliver').prop('checked', true)
    if(expedient.tribunalUser != null){
        if($('#tribunalUser').find("option[value='" + expedient.tribunalUser + "']").length) {
            $('#tribunalUser').val(expedient.tribunalUser).trigger('change');
        }else{
            var newOption = new Option(expedient.staffName + ' - ' + expedient.staffSurname, expedient.tribunalUser, true, true);
            $('#tribunalUser').append(newOption).trigger('change');
        }
    }
    if(expedient.tribunalLocation != ''){
        $('#tribunalLocation').val(expedient.tribunalLocation);
    }else if(expedient.deceasedTribunal != ''){
        $('#tribunalLocation').val(expedient.deceasedTribunal);
    }
    expedient.tribunalNotApply == 0 || expedient.tribunalNotApply == null? $('#tribunalNotApply').prop('checked', false) : $('#tribunalNotApply').prop('checked', true)    
    
    if(expedient.tribunalNotApply == 0 || expedient.tribunalNotApply == null){ //Si no esta seleccionado "no aplica"
        var flagTrib = 0
        if(expedient.tribunalInProgress == 0 || expedient.tribunalInProgress == null){ //Si no esta activado    
            $("#tribProgrLbl").addClass(bgRed)
            flagTrib++
        }else{            
            $("#tribProgrLbl").removeClass(bgRed)
        }
        if(expedient.tribunalDeliver == 0 || expedient.tribunalDeliver == null){ //Si no esta activado            
            $("#tribDelivLbl").addClass(bgRed)
            flagTrib++
        }else{            
            $("#tribDelivLbl").removeClass(bgRed)
        }
        if(flagTrib!=0){
            $("#tribunalTittle").removeClass("label-primary")
        }
    }else{
        $("#tribunalTittle").removeClass("label-danger").addClass("label-primary")
        $("#tribProgrLbl").removeClass(bgRed)
        $("#tribDelivLbl").removeClass(bgRed)

        $('#tribunalInProgress').prop('checked', true)
        $('#tribunalInProgress').closest('div').addClass('hide')
        $('#tribunalDeliver').prop('checked', true)
        $('#tribunalDeliver').closest('div').addClass('hide')
        $('#tribunalUser').closest('div').addClass('hide')
        $('#tribunalLocation').closest('div').addClass('hide')
    }

    if($("#tribunalInProgress").prop('checked') && $("#tribunalDeliver").prop('checked')){
        $('#tribunalTittle').removeClass('label-primary').addClass('label-success')
        checkboxItems+= 2;
    }else{
        $('#tribunalTittle').removeClass('label-success').addClass('label-primary')
    }
    checkboxTotal+= 2;

    $('#tribunalNotApply').change(function(){
        if($(this).prop('checked')){
            $('#tribunalInProgress').prop('checked', true)
            $('#tribunalInProgress').closest('div').addClass('hide')
            $('#tribunalDeliver').prop('checked', true)
            $('#tribunalDeliver').closest('div').addClass('hide')
            $('#tribunalUser').closest('div').addClass('hide')
            $('#tribunalLocation').closest('div').addClass('hide')
        }else{
            $('#tribunalInProgress').prop('checked', false)
            $('#tribunalInProgress').closest('div').removeClass('hide')
            $('#tribunalDeliver').prop('checked', false)
            $('#tribunalDeliver').closest('div').removeClass('hide')
            $('#tribunalUser').closest('div').removeClass('hide')
            $('#tribunalLocation').closest('div').removeClass('hide')
        }
    })

    if($('#tribunalNotApply').prop('checked')){
        $('#tribunalTittle').removeClass('label-primary').addClass('label-success')
    }

    expedient.doctorInProgress == 0 || expedient.doctorInProgress == null? $('#doctorInProgress').prop('checked', false) : $('#doctorInProgress').prop('checked', true)
    expedient.doctorDone == 0 || expedient.doctorDone == null? $('#doctorDone').prop('checked', false) : $('#doctorDone').prop('checked', true)
    if(expedient.doctorDeliver != null){
        if($('#doctorDeliver').find("option[value='" + expedient.doctorDeliver + "']").length) {
            $('#doctorDeliver').val(expedient.doctorDeliver).trigger('change');
        }else{
            var newOption = new Option(expedient.doctorDelivName + ' - ' + expedient.doctorDelivSurname, expedient.doctorDeliver, true, true);
            $('#doctorDeliver').append(newOption).trigger('change');
        }
    }
    expedient.doctorNotApply == 0 || expedient.doctorNotApply == null? $('#doctorNotApply').prop('checked', false) : $('#doctorNotApply').prop('checked', true)

    if(expedient.doctorNotApply == 0 || expedient.doctorNotApply == null){ //Si no esta seleccionado "no aplica"
        var flagDoc = 0
        if(expedient.doctorInProgress == 0 || expedient.doctorInProgress == null){ //Si no esta activado    
            $("#docInProgLbl").addClass(bgRed)
            flagDoc++
        }else{            
            $("#docInProgLbl").removeClass(bgRed)
        }
        if(expedient.doctorDone == 0 || expedient.doctorDone == null){ //Si no esta activado            
            $("#docDoneLbl").addClass(bgRed)
            flagDoc++
        }else{            
            $("#docDoneLbl").removeClass(bgRed)
        }
        if(flagDoc!=0){
            $("#doctorTitle").removeClass("label-primary")
        }
    }else{
        $("#doctorTitle").removeClass("label-danger").addClass("label-primary")
        $("#docInProgLbl").removeClass(bgRed)
        $("#docDoneLbl").removeClass(bgRed)

        $('#doctorInProgress').prop('checked', true)
        $('#doctorInProgress').closest('div').addClass('hide')
        $('#doctorDone').prop('checked', true)
        $('#doctorDone').closest('div').addClass('hide')
        $('#doctorDeliver').closest('div').addClass('hide')
    }

    if($("#doctorInProgress").prop('checked') && $("#doctorDone").prop('checked')){
        $('#doctorTitle').removeClass('label-primary').addClass('label-success')
        checkboxItems += 2;
    }else{
        $('#doctorTitle').removeClass('label-success').addClass('label-primary')
    }

    checkboxTotal+= 2

    if($('#doctorNotApply').prop('checked')){
        $('#doctorTitle').removeClass('label-primary').addClass('label-success')
    }

    $('#doctorNotApply').change(function(){
        if($(this).prop('checked')){
            $('#doctorInProgress').prop('checked', true)
            $('#doctorInProgress').closest('div').addClass('hide')
            $('#doctorDone').prop('checked', true)
            $('#doctorDone').closest('div').addClass('hide')
            $('#doctorDeliver').closest('div').addClass('hide')
        }else{
            $('#doctorInProgress').prop('checked', false)
            $('#doctorInProgress').closest('div').removeClass('hide')
            $('#doctorDone').prop('checked', false)
            $('#doctorDone').closest('div').removeClass('hide')
            $('#doctorDeliver').closest('div').removeClass('hide')
        }
    })

    expedient.webConfirm == 0 || expedient.webConfirm == null ? $('#webConfirm').prop('checked', false) : $('#webConfirm').prop('checked', true)
    expedient.showAgeObituaryWeb == 0 || expedient.showAgeObituaryWeb == null ? $('#showAgeObituaryWeb').prop('checked', true) : $('#showAgeObituaryWeb').prop('checked', false)
    expedient.showFinalDestinationWeb == 0 || expedient.showFinalDestinationWeb == null ? $('#showFinalDestinationWeb').prop('checked', false) : $('#showFinalDestinationWeb').prop('checked', true)
    expedient.showVelationWeb == 0 || expedient.showVelationWeb == null ? $('#showVelationWeb').prop('checked', false) : $('#showVelationWeb').prop('checked', true)
    expedient.showCeremonyWeb == 0 || expedient.showCeremonyWeb == null ? $('#showCeremonyWeb').prop('checked', false) : $('#showCeremonyWeb').prop('checked', true)
    expedient.webNotApply == 0 || expedient.webNotApply == null ? $('#webNotApply').prop('checked', false).trigger('change') : $('#webNotApply').prop('checked', true).trigger('change')
    $('#sinceAniversaryWeb').val(expedient.sinceAniversaryWeb == null || expedient.sinceAniversaryWeb == '' ? '' : moment(expedient.sinceAniversaryWeb, 'YYYY-MM-DD').format('DD/MM/YYYY'))
    $('#untilAniversaryWeb').val(expedient.untilAniversaryWeb == null || expedient.untilAniversaryWeb == '' ? '' : moment(expedient.untilAniversaryWeb, 'YYYY-MM-DD').format('DD/MM/YYYY'))

    if(expedient.churchAniversaryWeb != null){
        if($('#churchAniversaryWeb').find("option[value='" + expedient.churchAniversaryWeb + "']").length) {
            $('#churchAniversaryWeb').val(expedient.churchAniversaryWeb).trigger('change');
        }else{
            var newOption = new Option(expedient.churchAniversaryWebName, expedient.churchAniversaryWeb, true, true);
            $('#churchAniversaryWeb').append(newOption).trigger('change');
        }
    }
    $('#dateAniversaryWeb').val(expedient.dateAniversaryWeb == null || expedient.dateAniversaryWeb == '' ? '' : moment(expedient.dateAniversaryWeb, 'YYYY-MM-DD').format('DD/MM/YYYY'))
    $('#timeAniversaryWeb').val(expedient.timeAniversaryWeb == null || expedient.timeAniversaryWeb == '' ? '' :  moment(expedient.timeAniversaryWeb, "HH:mm:ss").format("HH:mm"))

    if(expedient.webConfirm == 0 || expedient.webConfirm == null){ //Si no esta activado 
        if(expedient.webNotApply == 0 || expedient.webNotApply == null){ //Si no esta seleccionado "no aplica"
            $("#webTitle").removeClass("label-primary")
            $("#webLbl").addClass(bgRed)
        }else{
            $("#webTitle").removeClass("label-danger").addClass("label-primary")
            $("#webLbl").removeClass(bgRed)
        }
    }else{
        $("#webTitle").removeClass("label-danger").addClass("label-primary")
        $("#webLbl").removeClass(bgRed)

        $('#webConfirm').prop('checked', true)
        $('#webLink').addClass('hide')
    }

    if(expedient.webLink == null){        
        $('#webLink').addClass('hide')
        $('#unpublish').addClass('hide')
    }else{        
        $('#publish').addClass('hide')
        $('#webLink').removeClass('hide')
        $('#webLink').attr('href', expedient.webLink)
    }

    if($("#webConfirm").prop('checked')){
        $('#webTitle').removeClass('label-primary').addClass('label-success')
        checkboxItems++;
    }else{
        $('#webTitle').removeClass('label-success').addClass('label-primary')
    }
    checkboxTotal++;

    $('#webNotApply').change(function(){
        if($(this).prop('checked')){
            $('#webConfirm').prop('checked', true)
            $('#webConfirm').closest('div').addClass('hide')
            $('#showAgeObituaryWeb').closest('div').addClass('hide')
            if(COMPANY == 11){
                $('#showFinalDestinationWeb').closest('div').addClass('hide')
                $('#showVelationWeb').closest('div').addClass('hide')
                $('#showCeremonyWeb').closest('div').addClass('hide')
            }
            $('#publish').closest('div').addClass('hide')
            $('#unpublish').closest('div').addClass('hide')
            $('#sinceAniversaryWeb').closest('div').addClass('hide')
            $('#untilAniversaryWeb').closest('div').addClass('hide')
            $('#webLink').addClass('hide')
        }else{
            $('#webConfirm').prop('checked', false)
            $('#webConfirm').closest('div').removeClass('hide')
            $('#showAgeObituaryWeb').closest('div').removeClass('hide')
            if(COMPANY == 11){
                $('#showFinalDestinationWeb').closest('div').removeClass('hide')
                $('#showVelationWeb').closest('div').removeClass('hide')
                $('#showCeremonyWeb').closest('div').removeClass('hide')
            }
            $('#publish').closest('div').removeClass('hide')
            $('#sinceAniversaryWeb').closest('div').removeClass('hide')
            $('#untilAniversaryWeb').closest('div').removeClass('hide')
            $('#webLink').removeClass('hide')
        }
    })

    if($("#webNotApply").prop('checked')){
        $('#webConfirm').prop('checked', true)
        $('#webConfirm').closest('div').addClass('hide')
    }

    // Publicar en web
    $('#publish').click(function(){
        if(confirm('Compruebe que la fecha y hora de salida y la fecha y hora de ceremonia estén cubiertos para que el expediente aparezca en la web.')){
            $.ajax({
                url: uri + 'core/expedients/services/functions.php',
                method: 'POST',
                data: {
                    type: 'publish',
                    expedient: expedientID
                },
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data);
    
                        $('#publish').addClass('hide')
                        $('#unpublish').removeClass('hide')
                        $('#webLink').removeClass('hide')

                        if(data != ''){
                            $('#webLink').attr('href', data)
                        }
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La esquela se ha publicado en la web</div>')
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
    })

    // Quitar de la web
    $('#unpublish').click(function(){
        $.ajax({
            url: uri + 'core/expedients/services/functions.php',
            method: 'POST',
            data: {
                type: 'unpublish',
                expedient: expedientID
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)

                    if(data){
                        $('#publish').removeClass('hide')
                        $('#unpublish').addClass('hide')
                        $('#webLink').addClass('hide')
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La esquela se ha quitado en la web</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
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
    })

    // PUBLICAR WEB - ANIVERSARIO
    expedientData = getExpedient(expedientID);
    expedientStatus = expedientData.status;

    // COMPROBAMOS SI DESDE LA FECHA DE FUNERAL VAN MÁS DE 0 MESES
    var funeralDateAux = null;
    if(expedientData.funeralDateNew != null && expedientData.funeralDateNew != ''){
        funeralDateAux = expedientData.funeralDateNew;
    }else if(expedientData.funeralDate != null && expedientData.funeralDate != ''){
        funeralDateAux = expedientData.funeralDate;
    }

    if(funeralDateAux != null){
        var startDate = moment(funeralDateAux, 'YYYY-MM-DD');
        var endDate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');

        var daysDiff = endDate.diff(startDate, 'days');
        var monthDiff = endDate.diff(startDate, 'months');
        switch(parseInt(company)){
            case 9:
                if(parseInt(daysDiff) > 1){
                    $(".web-aniversary").removeClass('hide');
                }
            break;
            default:
                if(parseInt(monthDiff) >= 9){
                    $(".web-aniversary").removeClass('hide');
                }
            break;
        }
        
    }

    expedient.preparationConfirm == 0 || expedient.preparationConfirm == null? $('#preparationConfirm').prop('checked', false) : $('#preparationConfirm').prop('checked', true)
    expedient.preparationNotApply == 0 || expedient.preparationNotApply == null? $('#preparationNotApply').prop('checked', false) : $('#preparationNotApply').prop('checked', true)

    if(expedient.preparationConfirm == 0 || expedient.preparationConfirm == null){ //Si no esta activado 
        if(expedient.preparationNotApply == 0 || expedient.preparationNotApply == null){ //Si no esta seleccionado "no aplica"
            $("#prepTitle").removeClass("label-primary")
            $("#prepLbl").addClass(bgRed)
        }else{
            $("#prepTitle").removeClass("label-danger").addClass("label-primary")
            $("#prepLbl").removeClass(bgRed)

            $('#preparationConfirm').prop('checked', true)
            $('#preparationConfirm').closest('div').addClass('hide')
            $('#preparationNew').closest('div').addClass('hide')
        }
    }else{
        $("#prepTitle").removeClass("label-danger").addClass("label-primary")
        $("#prepLbl").removeClass(bgRed)

        if(expedient.preparationNotApply == 1){
            $("#prepTitle").removeClass("label-danger").addClass("label-primary")
            $("#prepLbl").removeClass(bgRed)

            $('#preparationConfirm').prop('checked', true)
            $('#preparationConfirm').closest('div').addClass('hide')
            $('#preparationNew').closest('div').addClass('hide')
        }
    }

    $('#preparationNotApply').change(function(){
        if($(this).prop('checked')){
            $('#preparationConfirm').prop('checked', true)
            $('#preparationConfirm').closest('div').addClass('hide')
            $('#preparationNew').closest('div').addClass('hide')
        }else{
            $('#preparationConfirm').prop('checked', false)
            $('#preparationConfirm').closest('div').removeClass('hide')
            $('#preparationNew').closest('div').removeClass('hide')
        }
    })

    if($("#preparationConfirm").prop('checked')){
        $('#prepTitle').removeClass('label-primary').addClass('label-success')
        checkboxItems++;

    }else{
        $('#prepTitle').removeClass('label-success').addClass('label-primary')
    }
    checkboxTotal++;

    expedient.tombstonePrint == 0 || expedient.tombstonePrint == null? $('#tombstonePrint').prop('checked', false) : $('#tombstonePrint').prop('checked', true)
    expedient.tombstoneNotApply == 0 || expedient.tombstoneNotApply == null? $('#tombstoneNotApply').prop('checked', false) : $('#tombstoneNotApply').prop('checked', true)

    if(expedient.tombstonePrint == 0 || expedient.tombstonePrint == null){ //Si no esta activado 
        if(expedient.tombstoneNotApply == 0 || expedient.tombstoneNotApply == null){ //Si no esta seleccionado "no aplica"
            $("#tombstonePrintLbl").addClass(bgRed)
        }else{
            $("#tombstoneTitle").removeClass("label-danger").addClass("label-primary")
            $("#tombstonePrintLbl").removeClass(bgRed)
            $('#tombstonePrint').prop('checked', true)
            $('#tombstonePrint').closest('div').addClass('hide')
        }
    }else{
        $("#tombstoneTitle").removeClass("label-danger").addClass("label-primary")
        $("#tombstonePrintLbl").removeClass(bgRed)

        if(expedient.tombstoneNotApply == 1){
            $("#tombstoneTitle").removeClass("label-danger").addClass("label-primary")
            $("#tombstonePrintLbl").removeClass(bgRed)
            $('#tombstonePrint').prop('checked', true)
            $('#tombstonePrint').closest('div').addClass('hide')
        }
    }
    
    $('#tombstoneNotApply').change(function(){
        if($(this).prop('checked')){
            $('#tombstonePrint').prop('checked', true)
            $('#tombstonePrint').closest('div').addClass('hide')
        }else{
            $('#tombstonePrint').prop('checked', false)
            $('#tombstonePrint').closest('div').removeClass('hide')
           
        }
    })

    if($("#tombstonePrint").prop('checked')){
        $('#tombstoneTitle').removeClass('label-primary').addClass('label-success')
        checkboxItems++;
    }else{
        $('#tombstoneTitle').removeClass('label-success').addClass('label-primary')
    }
    checkboxTotal++;

    // Survey section
    expedient.surveySend == 0 || expedient.surveySend == null ? $('#surveySend').prop('checked', false) : $('#surveySend').prop('checked', true)
    expedient.surveyNotApply == 0 || expedient.surveyNotApply == null ? $('#surveyNotApply').prop('checked', false) : $('#surveyNotApply').prop('checked', true)
    expedient.surveyNotApply == 0 || expedient.surveyNotApply == null ? $('#activateSurvey').prop('checked', true) : $('#activateSurvey').prop('checked', false)
    if(expedient.surveySend == 0 || expedient.surveySend == null){ //Si no esta activado 
        if(expedient.surveyNotApply == 0 || expedient.surveyNotApply == null){ //Si no esta seleccionado "no aplica"
            $("#surveySendLbl").addClass(bgRed)

            $('.not-apply-survey').removeClass('hide')
        }else{
            $("#surveySendLbl").removeClass(bgRed)
            $('#surveySend').prop('checked', true)
            $('#surveySend').closest('div').addClass('hide')
            $('.not-apply-survey').addClass('hide')
        }
    }else{
        $("#surveySendLbl").removeClass(bgRed)

        if(expedient.surveyNotApply == 1){
            $("#surveySendLbl").removeClass(bgRed)
            $('#surveySend').prop('checked', true)
            $('#surveySend').closest('div').addClass('hide')
            $('.not-apply-survey').addClass('hide')
        }
    }

    $('#surveyNotApply').change(function(){
        if($(this).prop('checked')){
            $('#surveySend').prop('checked', true)
            $('.not-apply-survey').addClass('hide')
            $("#surveyTableDiv").addClass('hide')
        }else{
            $('#surveySend').prop('checked', false)
            $('.not-apply-survey').removeClass('hide')
            
            if($('#selectSurvey').val() != null){
                $("#surveyTableDiv").removeClass('hide')
            }
        }
    })

    $('#activateSurvey').change(function(){
        if($(this).prop('checked')){
            $('#surveyNotApply').prop('checked', false).trigger('change')
            $('#surveyNotApplySection').addClass('hide')
        }else{
            $('#surveyNotApply').prop('checked', true).trigger('change')
            $('#surveyNotApplySection').addClass('hide')
        }
    })

    if($("#surveySend").prop('checked') && $("#activateSurvey").prop('checked')){
        $('#surveyLbl').removeClass('label-primary').addClass('label-success')
        checkboxItems++;
    }else{
        $('#surveyLbl').removeClass('label-success').addClass('label-primary')
    }
    checkboxTotal++;
   
    $('input[name="deliverClothing"]').on('change', function() {
        if($(this).val() == 'NO'){
            $('input[name="revisedClothing"]').prop('disabled', true);
            $('#revisedClothing1').prop('checked', true);
        }else{
            $('input[name="revisedClothing"]').prop('disabled', false);
        }
    });

    $('#acta-preparacion-modal #pickPerson').change(function(){
        if($(this).val() == 'null'){
            $("#otherAgent").removeClass('hide')
        }else{
            $("#otherAgent").addClass('hide')
            $("#otherPickPerson").val('')
        }
    })

    // Documento - Acta de preparación
    $.ajax({
        url: uri + 'core/expedients/docs/functions.php',
        method: 'POST',
        data: {
            type: 'getStaffFuner'
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                if(data != null){
                    $.each(data, function(index, elem){
                        $('#acta-preparacion-modal #pickPerson').append('<option value="' + elem.name + ' ' + elem.surname + '">' + elem.name + ' ' + elem.surname + '</option>')
                    })
                    $('#acta-preparacion-modal #pickPerson').append('<option value="null">Otro</option>')
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

    //Sets the resposible value
    if(expedientData.responsibleUser == "" || expedientData.responsibleUser == null){
        $('#acta-preparacion-modal #pickPerson').val('' + expedientData.responsibleUser + '').trigger('change')
        $('#acta-preparacion-modal #otherPickPerson').val('' + expedientData.responsibleName + '')
    }else{
        $('#acta-preparacion-modal #pickPerson').val('' + expedientData.responsibleUserNamePreparacion + '').trigger('change')
    }

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

    $('input[name="belongings"]').on('change', function(){
        if($(this).val() == 'SI'){
            $('#belongingsText').removeClass('hide');
        }else{
            $('#belongingsText').addClass('hide');
            $('#belongingsText').val('');
        }
    });

    $('#acta-preparacion-modal').on('hidden.bs.modal', function(){
        $('#belongingsText').addClass('hide');
        $('#belongingsText').val('');
        $('input[name="belongings"][value="NO"]').prop('checked', true)
    })

    $('input[name="accesories"]').on('change', function(){
        if($(this).val() == 'SI'){
            $('#accesoriesText').removeClass('hide');
        }else{
            $('#accesoriesText').addClass('hide');
            $('#accesoriesText').val('');
        }
    });

    $('input[name="reconstructive"]').on('change', function(){
        if($(this).val() == 'SI'){
            $('#reconstructiveText').removeClass('hide');
            $('#reconstructiveText').val('');
        }else{
            $('#reconstructiveText').addClass('hide');
        }
    });

    $('#preparationNew').click(function(){
        $('#acta-preparacion-modal').modal('show')
    })

    $('#acta-preparacion-modal').click(function(){
        saveForm()
    })

    $.ajax({
        url: uri + 'core/expedients/services/functions.php',
        method: 'POST',
        data: {
            type: 'checkActPrep',
            expedient: expedientID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(data != null){
                    $('#preparationNew').addClass('hide')
                }else{
                    $('#preparationView').addClass('hide')
                    $('#preparationDelete').addClass('hide')
                }
            }catch(e){
                
            }
        }
    })

    $("#preparationView").click(function(){
        window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/actaPreparacion.pdf', '_blank')
    })

    $('#preparationDelete').click(function(){
        if(confirm("¿Está seguro de que quiere borrar el documento: Actividades preparación?")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: 'actaPreparacion'},
                type: 'POST',
                async: false
            });

            $('#preparationNew').removeClass('hide')
            $('#preparationView').addClass('hide')
            $('#preparationDelete').addClass('hide')
        }
    })

    expedient.tombstonePrint == 0 || expedient.tombstonePrint == null? $('#tombstonePrint').prop('checked', false) : $('#tombstonePrint').prop('checked', true)

    if(expedient.tombstonePrint == 0 || expedient.tombstonePrint == null){ //Si no esta activado         
        $("#tombstonePrintLbl").addClass(bgRed)
    }else{
        $("#tombstoneTitle").removeClass("label-danger").addClass("label-primary")
        $("#tombstonePrintLbl").removeClass(bgRed)
        $('#tombstonePrint').prop('checked', true)  
    }
  
    $("#tombstoneView").click(function(){
        $('#lapida-provisional-modal').modal('show')
    })

    // Lápida provisional
    $('#goLapida').click(function(){
        saveForm()
        var expedient = $('#lapida-provisional-modal #expedient').val()
        var type = $('#lapida-provisional-modal #type').val()
        var model = $('#lapida-provisional-modal input[name="model"]:checked').val()

        $.ajax({
            url: uri + 'core/expedients/tombstone/checkTombstone.php',
            method: 'POST',
            data: {
                expedient: expedient,
                type: type,
                model: model
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    if(data){
                        window.location.href = uri + 'expediente/lapida/editor/' + expedient + '/' + type + '/' + model
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
        return false
    })

    /*
        --------------------------------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------------- Formularios ----------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------------------------------
    */
    // Documentación cremación
    var table = $('#datatable-docs').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listCService.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 50,
        "lengthChange": true,
        "searching": false,
        "ordering": false,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user edit",
                "targets" : 1,
                "render" : function(data){
                    return data == null ? "-" : data;
                }
            },
            {
                "className" : "date",
                "targets" : 2,
                "render" : function(data){
                    return data == null ? "-" : moment(data).format("DD/MM/YYYY");
                }
            },
            {
                "className": "view centered",
                "targets": 4,
                "width" : '5%',
                "render": function(data, type, row){
                    switch(row[5]){
                        case '10':
                            return '<div id="viewDeceasedCloseSection"></div>'
                        break
                        case '17':
                            return '<div id="viewObituarySection"></div>'
                        break
                        case '18':
                            return '<div id="viewObituaryPressSection"></div>'
                        break
                        case '22':
                            return '<div id="viewTombstoneSection"></div>'
                        break
                        case '24':
                            return '<div id="viewDuelSection"></div>'
                        break
                        case '30':
                            return '<div id="viewReminderSection"></div>'
                        break
                        case '31':
                            return '<div id="viewReminderLetterSection"></div>'
                        break
                        case '32':
                            return '<div id="viewReminderLetterCrossSection"></div>'
                        break
                    }

                    if(row[5] == '26'){
                        return '<a class="btn-orders"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"  title="Ver"></i></a>';
                    }
                    if(row[6] != '' && row[6] != null){
                        //var path = row[6].split(uri + 'resources/files/')
                        var path = row[6].split(uri + 'resources/files/')[1].split('/')
                        path.shift()
                        var dirPath = ''
                        $.each(path, function(index, elem){
                            dirPath += elem + '/'
                        })
                        dirPath = dirPath.slice(0, -1)
                        return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i>';
                    }
                }
            },
            {
                "className": "edit centered",
                "targets": 5,
                "width" : '5%',
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '10':
                            return '<div id="editDeceasedCloseSection"></div>'
                        break
                        case '17':
                            return '<div id="editObituarySection"></div>'
                        break
                        case '18':
                            return '<div id="editObituaryPressSection"></div>'
                        break
                        case '24':
                            return '<div id="editDuelSection"></div>'
                        break
                        case '30':
                            return '<div id="editReminderSection"></div>'
                        break
                        case '31':
                            return '<div id="editReminderLetterSection"></div>'
                        break
                        case '32':
                            return '<div id="editReminderLetterCrossSection"></div>'
                        break
                        case '18':
                            return '<a href="' + uri + 'expediente/esquela-prensa/' + expedientID + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>'
                        break
                        case '26':
                            return ''
                        break;
                        case '23':
                            if(row[6] == '' || row[6] == null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<a href="' + uri + 'documento/nuevo/' + expedientID + '/libroVisitas"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>';
                            }
                        break
                        
                        case '9':
                        case '13':
                        case '14':
                        case '16':
                        case '28':
                        case '29':
                        case '32':
                        case '40':
                            if(row[6] == '' || row[6] == null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break

                        case '30':
                            if(row[6] == '' || row[6] == null){
                                return '<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo recordatorio"></i></a>'
                            }else{
                                return '<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar recordatorio"></i></a>'
                            }
                        break

                        case '31':
                            if(row[6] == '' || row[6] == null){
                                return '<a id="goRecordatorioSobre" style="cursor:pointer"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo sobre de recordatorio "></i></a>'
                            }else{
                                return '<a id="goRecordatorioSobre" style="cursor:pointer"><i class="fa fa-pencil" aria-hidden="true" title="Editar sobre de recordatorio"></i></a>'
                            }
                        break
                    }

                    if(row[6] != ''){
                        return '<i class="fa fa-plus-circle c-grey" aria-hidden="true"></i>';
                    }else{
                        return '<a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a>';
                    }
                }
            },
            {
                "className": "details-control centered",
                "targets": 7,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    if(planHired != 'plan_basic'){
                        if(hasViaFirmaKeys){
                            switch(row[5]){  
                                case '8':
                                case '9':
                                case '10':  
                                case '15':
                                case '16':
                                case '17':
                                case '18':
                                case '22':
                                case '23':
                                case '24':
                                case '25':
                                case '26':
                                case '30':
                                case '31':
                                case '32':
                                case '33':
                                case '39':
                                case '40':                            
                                    return '<div id="' + row[4] + '" class="c-grey">-</div>';                            
                                break                      

                                default:
                                    if(row[6] != '' && row[6]!=null){                        
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" title="Firmar" aria-hidden="true" style="cursor:pointer"></i></div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></div>';
                                    }
                                break
                            }
                        }else{
                            return '-'
                        }
                    }else{
                        return '-'
                    }
                }
            },
            {
                "className": "details-control centered",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[5] == '18' || row[5] == '26'){
                        return ''
                    }

                    if(row[6] != null){
                        return "<a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a>";
                    }else{
                        return '<i class="fa fa-trash c-grey" aria-hidden="true"></i>';
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[1, 'asc']],
        initComplete: function(){
            drawButtons()
        }
    });

    /* ******************************** Crear Doc ******************************** */
    table.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-edit').tooltip('hide');
        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        switch(rowClick[4]){
            case 'tarjetonAgradecimiento':
                $('#tarjeton-agradecimiento-modal').modal('show')
            break
            case 'libroVisitas':
                $('#libro-visitas-modal').modal('show')
            break;
            default:
                window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                table.ajax.reload()
                setTimeout(() => {
                    drawButtons()
                }, 150);
            break
        }
    })

    // FIRMAR DOCUMENTO
    table.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign-cremation').modal('show')
    })

    setTimeout(() => {
        $('#goLibroVisitas').click(function(){
            $('#libro-visitas-modal').modal('show')
        })
    }, 500)

    $('#modal-sign-cremation #signMobile').click(function(){
        $('#modal-sign-cremation #signConfirmMobile').removeClass('hide')
        $('#modal-sign-cremation #signMobile').attr('disabled', true)
        $('#modal-sign-cremation #signDesktop').attr('disabled', true)
        
        setTimeout(() => {
            var docName = $('#docname').val()
            var pathDoc = $('#docpath').val()
    
            // PLANTILLA CON EL CONTENIDO DEL PDF
            var template = ''
    
            // CONVERTIR A BASE 64
            $.ajax({
                url: uri + "core/tools/firmasPdf/firmasController.php",
                type: 'POST',
                data: {
                    type: "convertTo64",
                    path: pathDoc
                },           
                async: false,
                success: function(data){                
                    template = data            
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
    
            if(template != ''){
                // CUERPO DEL MENSAJE PARA LA SOLICITUD DE LA FIRMA
                msg = {
                    "groupCode": "funeraria_arosa",
                    "workflow": {
                        "type": "APP"
                    },
                    "notification": {
                        "text": "Solicitud de firma",
                        "detail": "Debe firmar el documento " + docName,
                        "devices": [{
                            "appCode": "com.viafirma.documents",
                            "code" : "emartineztorrado@gmail.com",
                            "userCode": "emartineztorrado@gmail.com"
                        }]
                    },
                    "policies": [{
                        "evidences": [{
                            "type": "SIGNATURE",
                            "typeFormatSign": "XADES_T"
                        }],
                        "signatures" : [{
                            "type" : "SERVER",
                            "typeFormatSign" : "PADES_LTA"
                        }]
                    }],
                    "document": {
                        "templateType" : "base64",
                        "templateReference" : template,
                    },
                    "callbackMails": DOMAIN,
                    "callbackURL" : ROOT + "core/tools/firmasPdf/pdfSignedDownload" + company + ".php"
                }
               
                // PETICION DE FIRMA
                var code = null
                $.ajax({
                    url: uri + "core/tools/firmasPdf/firmasController.php",
                    data: JSON.stringify(msg),
                    contentType: "application/json",
                    type: 'POST',
                    dataType: "json",
                    async: false,
                    success: function(data){
                        code = data
                    },
                    error: function(){
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                })
    
                if(code != null){
                    $.ajax({
                        url: uri + "core/tools/firmasPdf/firmasController.php",
                        type: 'POST',           
                        data: {
                            type: "savePDFSigned",
                            expedientID: expedientID,
                            docName: docName,
                            code: code
                        },           
                        async: false,
                        error: function(){
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
    
                    table.ajax.reload()
                }
            }
    
            $('#modal-sign-cremation #signConfirmMobile').addClass('hide')
            $('#modal-sign-cremation').modal('hide')
            $('#modal-sign-cremation #signMobile').attr('disabled', false)
            $('#modal-sign-cremation #signDesktop').attr('disabled', false)
        }, 250)
    })

    $('#modal-sign-cremation #signDesktop').click(function(){
        $('#modal-sign-cremation #signConfirmDesktop').removeClass('hide')
        $('#modal-sign-cremation #signDesktop').attr('disabled', true)
        $('#modal-sign-cremation #signMobile').attr('disabled', true)

        setTimeout(() => {
            var docName = $('#docname').val()
            var pathDoc = $('#docpath').val()
    
            // PLANTILLA CON EL CONTENIDO DEL PDF
            var template = ''
    
            // CONVERTIR A BASE 64
            $.ajax({
                url: uri + "core/tools/firmasPdf/firmasController.php",
                data: {
                    type: "convertTo64",
                    path: pathDoc
                },
                type: 'POST',
                async: false,
                success: function(data){
                    template = data
                },
                error: function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
    
            if(template != ''){
                // CUERPO DEL MENSAJE PARA LA SOLICITUD DE LA FIRMA
                var message = {
                    "groupCode": "funeraria_arosa",
                    "workflow": {
                        "type": "PRESENTIAL"
                    },
                    "notification": {
                        "text": "Solicitud de firma",
                        "detail": "Debe firmar el documento: " + docName,
                        "sharedLink": {
                            "appCode": "com.viafirma.documents",
                            "subject": "Firma con Wacom"
                        }
                    },
                    "document" : {
                        "policyCode" : "test_positionsText_funeraria",
                        "watermarkText" : "Previsualización",
                        "templateType" : "base64",
                        "templateReference": template
                    },
                    "callbackMails": DOMAIN,
                    "callbackURL" : ROOT + "core/tools/firmasPdf/pdfSignedDownload" + company + ".php"
                }
    
                // PETICION DE FIRMA
                var response = null
                $.ajax({
                    url: uri + 'core/tools/firmasPdf/pdfSign2.php',
                    type: 'POST',
                    data: JSON.stringify(message),
                    contentType: "application/json",
                    dataType: "json",
                    async: false,
                    success: function(data){
                        try{
                            if(data.status == 0){
                                response = $.parseJSON(data.data)
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
    
                if(response != null){
                    if(response.type == undefined){
                        $.ajax({
                            url: uri + 'core/tools/firmasPdf/firmasController.php',
                            type: 'POST',
                            data: {
                                type: "savePDFSigned",
                                expedientID: expedientID,
                                docName: docName,
                                code: response.code
                            },
                            async: false,
                            error: function(){
                                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                setTimeout(function(){
                                    $('#block-message').empty()
                                }, 5000)
                            }
                        })
        
                        window.open(response.notification.sharedLink.link)
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }
                }
            }

            $('#modal-sign-cremation #signConfirmDesktop').addClass('hide')
            $('#modal-sign-cremation').modal('hide')
            $('#modal-sign-cremation #signDesktop').attr('disabled', false)
            $('#modal-sign-cremation #signMobile').attr('disabled', false)
        }, 250)
    })

    // Pedidos
    table.on('click', '.btn-orders', function(){
        $('.btn-edit').tooltip('hide')
        $('.orders').empty()

        var orders = null

        $.ajax({
            url : uri + 'core/orders/functions.php',
            method : 'POST',
            data : {
                type : 'getPreOrders',
                expedient : expedientID
            },
            async: false,
            success : function(data){
                orders = $.parseJSON(data)
            }
        })

        if(orders == null){
            $('.orders').append('<p>No hay pedidos de compra</p>')
        }else{
            var supplierAux = 0
            var iTexts = 0
            $.each(orders, function(index, elem){
                if(supplierAux == elem.supplierID){
                    if(elem.texts){
                        $('#supplier' + elem.supplierID + ' tbody').append(
                            '   <tr>' +
                            '       <td class="hide">' + elem.ID + '</td>' +
                            '       <td class="hide product">' + elem.productID + '</td>' +
                            '       <td class="hide model">' + elem.modelID + '</td>' +
                            '       <td class="amount">' + elem.amount + '</td>' +
                            '       <td class="hide price">' + elem.price + '</td>' +
                            '       <td>' + elem.productName + '</td>' +
                            '       <td>' + elem.modelName + '</td>' +
                            '       <td id="texts' + iTexts + '"></td>' +
                            '   </tr>')

                        elem.texts.forEach(text => {
                            $('#supplier' + elem.supplierID + ' #texts' + iTexts).append('<p>' + text.value + '</p>')
                        })

                        iTexts++
                    }else{
                        $('#supplier' + elem.supplierID + ' tbody').append( 
                            '<tr>' +
                            '   <td class="hide">' + elem.ID + '</td>' +
                            '   <td class="hide product">' + elem.productID + '</td>' +
                            '   <td class="hide model">' + elem.modelID + '</td>' +
                            '   <td class="amount">' + elem.amount + '</td>' +
                            '   <td class="hide price">' + elem.price + '</td>' +
                            '   <td>' + elem.productName + '</td>' +
                            '   <td>' + elem.modelName + '</td>' +
                            '</tr>')
                    }
                }else{
                    iTexts = 0
                    var bottons = "";
                    if(parseInt(elem.supplierID) != mainSupplier){
                        supplierAux = elem.supplierID
                        if(elem.sentEmail == 1){
                            if(elem.order == null){
                                bottons =   '   <div class="clearfix"><div style="float: left">' +
                                            '       <input type="hidden" id="supplier' + elem.supplierID + '" value="' + elem.supplierID + '"/>' +
                                            '   </div>' +
                                            '   <div style="float: right" class="order-actions">' +
                                            '       <button type="button" class="btn btn-danger" id="newOrder' + elem.supplierID + '">Realizar pedido</button>' +
                                            '       <button type="button" class="btn btn-primary hide" id="viewOrder' + elem.supplierID + '">Ver pedido</button>' +
                                            '       <button type="button" class="btn btn-success" id="sentEmail' + elem.supplierID + '">Correo enviado</button>' +
                                            '       <button type="button" class="btn btn-secondary" id="genPDF' + elem.supplierID + '">Ver PDF</button>' +
                                            '       <p id="sentEmail' + elem.supplierID + '"></p>' +
                                            '   </div></div>';
                            }else{
                                bottons =   '   <div class="clearfix"><div style="float: left">' +
                                            '       <input type="hidden" id="supplier' + elem.supplierID + '" value="' + elem.supplierID + '"/>' +
                                            '   </div>' +
                                            '   <div style="float: right" class="order-actions">' +
                                            '       <button type="button" class="btn btn-primary" id="viewOrder' + elem.supplierID + '">Ver pedido</button>' +
                                            '       <button type="button" class="btn btn-success" id="sentEmail' + elem.supplierID + '">Correo enviado</button>' +
                                            '       <button type="button" class="btn btn-secondary" id="genPDF' + elem.supplierID + '">Ver PDF</button>' +
                                            '       <p id="sentEmail' + elem.supplierID + '"></p>' +
                                            '   </div></div>';
                            }
                        }else{
                            if(elem.order == null){
                                bottons =   '   <div class="clearfix"><div style="float: left">' +
                                            '       <input type="hidden" id="supplier' + elem.supplierID + '" value="' + elem.supplierID + '"/>' +
                                            '   </div>' +
                                            '   <div style="float: right" class="order-actions">' +
                                            '       <button type="button" class="btn btn-danger" id="newOrder' + elem.supplierID + '">Realizar pedido</button>' +
                                            '       <button type="button" class="btn btn-primary hide" id="viewOrder' + elem.supplierID + '">Ver pedido</button>' +
                                            '       <button type="button" class="btn btn-secondary" id="sentEmail' + elem.supplierID + '">Enviar correo</button>' +
                                            '       <button type="button" class="btn btn-secondary" id="genPDF' + elem.supplierID + '">Ver PDF</button>' +
                                            '       <p id="sentEmail' + elem.supplierID + '"></p>' +
                                            '   </div>';
                            }else{
                                bottons =   '   <div class="clearfix"><div style="float: left">' +
                                            '       <input type="hidden" id="supplier' + elem.supplierID + '" value="' + elem.supplierID + '"/>' +
                                            '   </div>' +
                                            '   <div style="float: right" class="order-actions">' +
                                            '       <button type="button" class="btn btn-primary" id="viewOrder' + elem.supplierID + '">Ver pedido</button>' +
                                            '       <button type="button" class="btn btn-danger" id="sentEmail' + elem.supplierID + '">Enviar correo</button>' +
                                            '       <button type="button" class="btn btn-secondary" id="genPDF' + elem.supplierID + '">Ver PDF</button>' +
                                            '       <p id="sentEmail' + elem.supplierID + '"></p>' +
                                            '   </div>';
                            }
                        }
    
                        if(elem.texts){

                            $('.orders').append(
                                '<fieldset>'+
                                '   <legend>'+
                                '       <span class="label label-primary labelLgExp">'+
                                '           <strong>Proveedor: </strong>' + elem.supplierName  + ' - <strong>Teléfono: </strong>' + elem.suplierPhone + 
                                '       </span>'+
                                '   </legend><table class="table table-striped table-bordered" id="supplier' + elem.supplierID + '">' +
                                '   <thead>' +
                                '       <tr>' +
                                '           <th class="hide">ID</th>' +
                                '           <th class="hide">productID</th>' +
                                '           <th class="hide">productModelID</th>' +
                                '           <th>Cantidad</th>' +
                                '           <th class="hide">Precio</th>' +
                                '           <th>Producto</th>' +
                                '           <th>Modelo</th>' +
                                '           <th>Textos</th>' +
                                '       </tr>' +
                                '   </thead>' +
                                '   <tbody>' +
                                '       <tr>' +
                                '           <td class="hide">' + elem.ID + '</td>' +
                                '           <td class="hide product">' + elem.productID + '</td>' +
                                '           <td class="hide model">' + elem.modelID + '</td>' +
                                '           <td class="amount">' + elem.amount + '</td>' +
                                '           <td class="hide price">' + elem.price + '</td>' +
                                '           <td>' + elem.productName + '</td>' +
                                '           <td>' + elem.modelName + '</td>' +
                                '           <td id="texts' + iTexts + '"></td>' +
                                '       </tr>' +
                                '   </tbody>' +
                                '</table>' + bottons + '</fieldset>')
    
                            elem.texts.forEach(text => {
                                $('#supplier' + elem.supplierID + ' #texts' + iTexts).append('<p>' + text.value + '</p>');   
                            });
    
                            iTexts++
                        }else{

                            $('.orders').append(
                                '<fieldset>'+
                                '   <legend>'+
                                '       <span class="label label-primary labelLgExp">'+
                                '           <strong>Proveedor: </strong>' + elem.supplierName  + ' - <strong>Teléfono: </strong>' + elem.suplierPhone + 
                                '       </span>'+
                                '   </legend>'+
                                '   <table class="table table-striped table-bordered" id="supplier' + elem.supplierID + '">' +
                                '   <thead>' +
                                '       <tr>' +
                                '           <th class="hide">ID</th>' +
                                '           <th class="hide">productID</th>' +
                                '           <th class="hide">productModelID</th>' +
                                '           <th>Cantidad</th>' +
                                '           <th class="hide">Precio</th>' +
                                '           <th>Producto</th>' +
                                '           <th>Modelo</th>' +
                                '       </tr>' +
                                '   </thead>' +
                                '   <tbody>' +
                                '       <tr>' +
                                '           <td class="hide">' + elem.ID + '</td>' +
                                '           <td class="hide product">' + elem.productID + '</td>' +
                                '           <td class="hide model">' + elem.modelID + '</td>' +
                                '           <td class="amount">' + elem.amount + '</td>' +
                                '           <td class="hide price">' + elem.price + '</td>' +
                                '           <td>' + elem.productName + '</td>' +
                                '           <td>' + elem.modelName + '</td>' +
                                '       </tr>' +
                                '   </tbody>' +
                                '</table>' + bottons + '</fieldset>')
                        }
    
                        // NUEVO PEDIDO
                        $('#newOrder' + elem.supplierID).click(function(){
                            var lines = []
    
                            $('#supplier' + elem.supplierID + ' tbody > tr').each(function(){
                                var model = $(this).find('td.model').text()
                                var amount = $(this).find('td.amount').text()
                                var price = $(this).find('td.price').text()
    
                                lines.push([model, amount, price])
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
                                    preOrder: elem.ID,
                                    supplier: elem.supplierID,
                                    expedient : expedientID,
                                    deliveryPlace : deliveryPlace,
                                    deceasedRoom: deceasedRoom,
                                    type : 0,
                                    date : currentDate,
                                    deliveryPlaceOther: '',
                                    deliveryDate : deliveryDate,
                                    notes : '',
                                    lines : lines
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
                                    elem.order = data;
                                    if(data){
                                        $('#newOrder' + elem.supplierID).prop('disabled', true)
                                        $('#newOrder' + elem.supplierID).html('Pedido realizado');
                                        $('#newOrder' + elem.supplierID).addClass('hide')
                                        $('#viewOrder' + elem.supplierID).removeClass('hide')
                                        $('#newOrder' + elem.supplierID).removeClass('btn-danger');
                                        $('#newOrder' + elem.supplierID).addClass('btn-success');
                                        $('#sentEmail' + elem.supplierID).prop('disabled', false)
                                        $('#viewOrder' + elem.supplierID).prop('disabled', false)
                                        $('#genPDF' + elem.supplierID).prop('disabled', false)
                                        $('#viewOrder' + elem.supplierID).click(function(){
                                            window.open(uri + 'almacen/pedidos/' + data)
                                        })
    
                                        // ENVIAR CORREO
                                        $('#sentEmail' + elem.supplierID).click(function(){
                                            $.ajax({
                                                url : uri + 'core/orders/functions.php',
                                                method : 'POST',
                                                data : {
                                                    type : 'getInfo',
                                                    order : data
                                                },
                                                async: false,
                                                success : function(data){
                                                    data = $.parseJSON(data)
                                                    
                                                    var order = data[0]
                                                    var orderLines = data[1]
                                                    
                                                    $('#modal-send-email #orderID').val(order.ID)
    
                                                    $('#modal-send-email #number').html(order.ID)
                                                    $('#modal-send-email #date').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                                    $('#modal-send-email #supplierName').html(order.supplierName)
                                                    $('#modal-send-email #supplierPhone').html(order.phones)
                                                    $('#modal-send-email #supplierFax').html(order.fax)
                                                    
                                                    $('#modal-send-email #orderLines').empty()
                                                    $('#modal-send-email #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                                '   <thead>' +
                                                                                                '       <tr>' +
                                                                                                '           <th>Cantidad</th>' +
                                                                                                '           <th>Producto</th>' +
                                                                                                '           <th>Modelo</th>' +
                                                                                                '       </tr>' +
                                                                                                '   </thead>' +
                                                                                                '   <tbody></tbody>' +
                                                                                                '</table>')
                                                    $.each(orderLines, function(index, elem){
                                                        $('#modal-send-email #orderLines tbody').append('<tr>' +
                                                                                                        '   <td>' + elem.amount + '</td>' +
                                                                                                        '   <td>' + elem.productName + '</td>' +
                                                                                                        '   <td>' + elem.modelName + '</td>' +
                                                                                                        '</tr>')
                                                    })
    
                                                    $('#modal-send-email #deceased').html(order.deceasedName + ' ' + order.deceasedSurname)
                                                    $('#modal-send-email #expedient').html(order.number)
                                                    if(order.deliveryPlace == null){
                                                        $('#modal-send-email #deliveryPlace').html(order.otherDeliveryPlace)
                                                    }else{
                                                        $('#modal-send-email #deliveryPlace').html(order.deliveryPlaceName)
                                                    }
                                                    if(order.deliveryDate != null){
                                                        $('#modal-send-email #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                                        if(moment(order.deliveryDate, 'X').format('HH:mm') != '00:00'){
                                                            $('#modal-send-email #deliveryTime').html(moment(order.deliveryDate, 'X').format('HH:mm'))
                                                        }else{
                                                            $('#modal-send-email #deliveryTime').html('-')
                                                        }
                                                    }
                                                    $('#modal-send-email #notes').html(order.notes)
                                                    $('#modal-send-email #send').html(order.mail)
    
                                                    if(order.sentEmail == 1){
                                                        $('#modal-send-email #sentEmail').html('El correo ya ha sido enviado')
                                                    }
                                                    
                                                    $('#modal-view-orders').modal('hide')
                                                    $('#modal-send-email').modal('show')
                                                },
                                                error : function(){
                                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                                                    setTimeout(function(){
                                                        $('#block-message').empty()
                                                    }, 5000)
                                                }
                                            })
                                        })
    
                                        window.open(uri + 'almacen/pedidos/' + elem.order)
    
                                        printOthers()
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
    
                        // Crear PDF
                        $('#genPDF' + elem.supplierID).click(function(){
                            var order;
                            var date;
                            order = elem.order;
                            date = elem.dateOrder;
    
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
    
                        // VER PEDIDO
                        if(elem.order == null){
                            $('#viewOrder' + elem.supplierID).prop('disabled', true)
                            $('#sentEmail' + elem.supplierID).prop('disabled', true)
                            $('#genPDF' + elem.supplierID).prop('disabled', true)
                        }else{
                            $('#genPDF' + elem.supplierID).prop('disabled', false)
                            $('#newOrder' + elem.supplierID).prop('disabled', true)
                            $('#newOrder' + elem.supplierID).html('Pedido realizado');
                            $('#newOrder' + elem.supplierID).removeClass('btn-danger');
                            $('#newOrder' + elem.supplierID).addClass('btn-success');
                            $('#viewOrder' + elem.supplierID).click(function(){
                                window.open(uri + 'almacen/pedidos/' + elem.order)
                            })
    
                            // ENVIAR CORREO
                            $('#sentEmail' + elem.supplierID).click(function(){
                                $.ajax({
                                    url : uri + 'core/orders/functions.php',
                                    method : 'POST',
                                    data : {
                                        type : 'getInfo',
                                        order : elem.order
                                    },
                                    async: false,
                                    success : function(data){
                                        data = $.parseJSON(data)
                                        
                                        var order = data[0]
                                        var orderLines = data[1]
    
                                        $('#modal-send-email #orderID').val(order.ID)
                                        $('#modal-send-email #number').html(order.ID)
                                        $('#modal-send-email #date').html(moment(order.date, 'X').format('DD/MM/YYYY'))
                                        $('#modal-send-email #supplierName').html(order.supplierName)
                                        $('#modal-send-email #supplierPhone').html(order.phones)
                                        $('#modal-send-email #supplierFax').html(order.fax)
                                        
                                        $('#modal-send-email #orderLines').empty()
                                        $('#modal-send-email #orderLines').append(  '<table class="table table-striped table-bordered">' +
                                                                                    '   <thead>' +
                                                                                    '       <tr>' +
                                                                                    '           <th>Cantidad</th>' +
                                                                                    '           <th>Producto</th>' +
                                                                                    '           <th>Modelo</th>' +
                                                                                    '       </tr>' +
                                                                                    '   </thead>' +
                                                                                    '   <tbody></tbody>' +
                                                                                    '</table>')
                                        $.each(orderLines, function(index, elem){
                                            $('#modal-send-email #orderLines tbody').append('<tr>' +
                                                                                            '   <td>' + elem.amount + '</td>' +
                                                                                            '   <td>' + elem.productName + '</td>' +
                                                                                            '   <td>' + elem.modelName + '</td>' +
                                                                                            '</tr>')
                                        })
                                        gender = ''
                                        if(order.deceasedGender == 'Hombre'){
                                            gender = 'D. '
                                        }else{
                                            gender = 'Dña. '
                                        }
                                        $('#modal-send-email #deceased').html(gender + order.deceasedName + ' ' + order.deceasedSurname)
                                        $('#modal-send-email #expedient').html(order.number)
                                        if(order.deliveryPlace == null){
                                            $('#modal-send-email #deliveryPlace').html(order.otherDeliveryPlace)
                                        }else{
                                            $('#modal-send-email #deliveryPlace').html(order.deliveryPlaceName)
                                        }
                                        if(order.deliveryDate != null){
                                            $('#modal-send-email #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
                                            if(moment(order.deliveryDate, 'X').format('HH:mm') != '00:00'){
                                                $('#modal-send-email #deliveryTime').html(moment(order.deliveryDate, 'X').format('HH:mm'))
                                            }else{
                                                $('#modal-send-email #deliveryTime').html('-')
                                            }
                                        }
                                        $('#modal-send-email #notes').html(order.notes)
                                        $('#modal-send-email #send').html(order.mail)
    
                                        if(order.sentEmail == 1){
                                            $('#modal-send-email #sentEmail').html('El correo ya ha sido enviado')
                                        }
                                        
                                        $('#modal-view-orders').modal('hide')
                                        $('#modal-send-email').modal('show')
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
                    }
                }
            })
        }
        
        $('#modal-view-orders').modal('show')
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

    /* ******************************** Borrar Doc ******************************** */
    table.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = table.row($(this).closest('tr')).data() == undefined ? table.row($(this).closest('tr.child').prev()).data() : table.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "?")){        
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4], path: rowClick[6]},
                type: 'POST',
                async: false
            });

            table.ajax.reload();
            setTimeout(() => {
                drawButtons()
            }, 150)
        }
    });

    $('.btn-del-actPrep').click(function(){
        $('.btn-del-actPrep').tooltip('hide');

        var docName = 'actPreparacion';

        $.ajax({
            url: uri + "core/expedients/docs/delete.php",
            data: {expedientID: expedientID, nameFile: docName},
            type: 'POST',
            async: false
        });
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
        var control = $('#control').prop('checked')

        var dni = $('#dni').val();

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

        // Porteadores
        var carrierTime
        $('#carriersTime').val() != "" ? carrierTime = $('#carriersTime').val() : carrierTime = 'null'

        var carriersTimeCheck = $('#carriersTimeCheck').prop('checked')

        var selectSurvey = $('#selectSurvey').val();
        if(selectSurvey == null){
            selectSurvey = "null";
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

        // Sección - Control
        var controlAssistance = $('#controlAssistance').val()
        var controlNotes = $('#controlNotes').val()
        var controlSend = $('#controlSend').val()
        var controlCopy = $('#controlCopy').val()

        // Otros
        var policeNotified = $('#policeNotified').prop('checked')
        var policeLocation = $('#policeLocation').val()
        var policeNotApply = $('#policeNotApply').prop('checked')
        var tribunalInProgress = $('#tribunalInProgress').prop('checked')
        var tribunalDeliver = $('#tribunalDeliver').prop('checked')
        var tribunalUser = $('#tribunalUser').val()
        var tribunalLocation = $('#tribunalLocation').val()
        var tribunalNotApply = $('#tribunalNotApply').prop('checked')

        var literalReceived = $('#literalReceived').prop('checked')
        var literalNoFinished = $('#literalNoFinished').prop('checked')
        var literalRequest = $('#literalRequest').prop('checked')
        var literalVolumePage = $('#literalVolumePage').val()
        var literalWhoTakes = $('#literalWhoTakes').val()
        var literalCivilRegister = $('#literalCivilRegister').val()
        if($('#literalDateExit').val() != null && $('#literalDateExit').val() != ''){
            var literalDateExit = moment( $('#literalDateExit').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        }else{
            var literalDateExit = 'null'
        }            
        var literalTimeExit = $('#literalTimeExit').val();
        var literalNotApply = $('#literalNotApply').prop('checked');

        var doctorInProgress = $('#doctorInProgress').prop('checked');
        var doctorDone = $('#doctorDone').prop('checked');
        var doctorDeliver = $('#doctorDeliver').val();
        var doctorNotApply = $('#doctorNotApply').prop('checked');
        var webConfirm = $('#webConfirm').prop('checked');
        var showAgeObituaryWeb = !$('#showAgeObituaryWeb').prop('checked');
        var showFinalDestinationWeb = $('#showFinalDestinationWeb').prop('checked') ? 1 : 0;
        var showVelationWeb = $('#showVelationWeb').prop('checked') ? 1 : 0;
        var showCeremonyWeb = $('#showCeremonyWeb').prop('checked') ? 1 : 0;
        var webNotApply = $('#webNotApply').prop('checked');
        var sinceAniversaryWeb = $('#sinceAniversaryWeb').val() == '' ? '' : moment($('#sinceAniversaryWeb').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        var untilAniversaryWeb = $('#untilAniversaryWeb').val() == '' ? '' : moment($('#untilAniversaryWeb').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        var churchAniversaryWeb = $('#churchAniversaryWeb').val();
        var dateAniversaryWeb = $('#dateAniversaryWeb').val() == '' ? '' : moment($('#dateAniversaryWeb').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var timeAniversaryWeb = $('#timeAniversaryWeb').val();
        var preparationConfirm = $('#preparationConfirm').prop('checked');
        var preparationNotApply = $('#preparationNotApply').prop('checked');
        var tombstonePrint = $('#tombstonePrint').prop('checked');
        var tombstoneNotApply = $('#tombstoneNotApply').prop('checked');
        var notApplyAll = $('#notApplyAll').prop('checked');
        var gravediggersCheckPrinted = $('#gravediggersCheckPrinted').prop('checked');
        var gravediggersCheckSigned = $('#gravediggersCheckSigned').prop('checked');
        var gravediggersNotApply = $('#gravediggersNotApply').prop('checked');
        var vivoSent = $('#vivoSent').prop('checked');
        var vivoNotApply = $('#vivoNotApply').prop('checked');
        var surveySend = $('#surveySend').prop('checked') == true ? 1 : 0;
        var surveyNotApply = $('#surveyNotApply').prop('checked') == true ? 1 : 0;

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

        // SECCIÓN DE COCHES
        var cars = new Array
        $('#carsTableBody tr').each(function(){
            var row = $(this)

            var scID = row.find('td.scID').html()
            var driver = row.find('td select.driver').val()
            var cleanBefore = row.find('td select.cleanBefore').val()
            var cleanAfter = row.find('td select.cleanAfter').val()

            cars.push([scID, driver, cleanBefore, cleanAfter])

            if(driver != null && driver != ''){
                logs.push('Ha añadido el conductor ' + row.find('td select.driver').text() + ' al coche '  + row.find('td.licensePlate').text() )
            }

            if(cleanBefore != null && cleanBefore != ''){
                logs.push('Ha establecido que ' + row.find('td select.cleanBefore').text() + ' limpiará el coche '  + row.find('td.licensePlate').text() + ' antes del servicio')
            }

            if(cleanAfter != null && cleanAfter != ''){
                logs.push('Ha establecido que ' + row.find('td select.cleanAfter').text() + ' limpiará el coche '  + row.find('td.licensePlate').text() + ' después del servicio')
            }
        })

        let logsClean = logs.filter(function(valor, indiceActual, arreglo) {
            let indiceAlBuscar = arreglo.indexOf(valor);
            if(indiceActual === indiceAlBuscar) {
                return true;
            }else{
                return false;
            }
        });

        flag = 0

        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            method : 'POST',
            data : {
                type: 'saveServiceExpedient',
                expedientID : expedientID,
                arriveTime : arriveTime,
                arriveDate : arriveDate,
                revReqCheck : revReq,
                control: control,
                dni : dni,
                priestTime : priestTime,
                priestTimeCheck : priestTimeCheck,
                priestInspected : priestInspected,
                priestPayed : priestPayed,
                priestNotes : priestNotes,
                choir : choir,
                carrierTime : carrierTime,
                carriersTimeCheck : carriersTimeCheck,
                selectSurvey : selectSurvey,
                notes: notes,
                gravediggersCheck : gravediggersCheck,
                gravediggersCheckPrinted : gravediggersCheckPrinted,
                gravediggersCheckSigned : gravediggersCheckSigned,
                gravediggersNotApply : gravediggersNotApply,
                notifiedChoir : notifiedChoirCheck,
                policeNotified: policeNotified,
                policeLocation: policeLocation,
                policeNotApply: policeNotApply,
                tribunalInProgress: tribunalInProgress,
                tribunalDeliver: tribunalDeliver,
                tribunalUser: tribunalUser,
                tribunalLocation: tribunalLocation,
                tribunalNotApply: tribunalNotApply,
                doctorInProgress: doctorInProgress,
                literalReceived: literalReceived,
                literalNoFinished: literalNoFinished,
                literalRequest: literalRequest,
                literalVolumePage: literalVolumePage,
                literalWhoTakes: literalWhoTakes,
                literalCivilRegister: literalCivilRegister,
                literalDateExit: literalDateExit,
                literalTimeExit: literalTimeExit,
                literalNotApply: literalNotApply,
                doctorDone: doctorDone,
                doctorDeliver: doctorDeliver,
                doctorNotApply: doctorNotApply,
                webConfirm: webConfirm,
                showAgeObituaryWeb: showAgeObituaryWeb,
                showFinalDestinationWeb: showFinalDestinationWeb,
                showVelationWeb: showVelationWeb,
                showCeremonyWeb: showCeremonyWeb,
                webNotApply: webNotApply,
                sinceAniversaryWeb: sinceAniversaryWeb,
                untilAniversaryWeb: untilAniversaryWeb,
                churchAniversaryWeb : churchAniversaryWeb,
                dateAniversaryWeb : dateAniversaryWeb,
                timeAniversaryWeb : timeAniversaryWeb,
                preparationConfirm: preparationConfirm,
                preparationNotApply: preparationNotApply,
                notApplyAll: notApplyAll,
                tombstoneNotApply: tombstoneNotApply,
                tombstonePrint: tombstonePrint,
                logs: logsClean,
                vivoSent: vivoSent,
                vivoNotApply: vivoNotApply,
                surveySend : surveySend,
                surveyNotApply : surveyNotApply,
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

        if(revReq == 1){
            $.ajax({
                url : uri + 'core/expedients/services/functions.php',
                method : 'POST',
                data : {
                    type : 'updateControl',
                    expedient : expedientID,
                    assistance : controlAssistance,
                    notes : controlNotes,
                    send : controlSend,
                    mailTo : controlCopy
                },
                success : function(data){
                    if(!data){
                        flag++
                    }
                },
                error : function(data){
                    if(!data){
                        flag++
                    }
                }
            })
        }

        $.ajax({
            url : uri + 'core/expedients/services/functions.php',
            method : 'POST',
            data : {
                type : 'updateCar',
                cars : cars
            },
            async : false,
            success : function(data){
                if(!data){
                    flag++
                }
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
        saveForm();

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

    var provinceCarrier
    $('#modal-new-carrier .province').change(function(){
        provinceCarrier = $(this).val()
        $('#modal-new-carrier .location').prop('disabled', false)
    })

    $('#modal-new-carrier .location').prop('disabled', true)

    // LOCALIDADES
    $('#modal-new-carrier .location').select2({
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
                    province : provinceCarrier
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

    /**
     * Acciones para los teléfonos: añadir y eliminar
     */
    $('#modal-new-carrier .btn-add-phone').click(function(){
        var phone = $(this).parent().parent().find('#phone')
        var phoneValue = phone.val()
        if(isPhone3('modal-new-carrier', phone)){
            $('#modal-new-carrier .phone').val('')
            $('#modal-new-carrier .phones').append('<span class="label label-default small labelPhones"><span class="number">' + phoneValue + '</span> <i class="fa fa-times-circle btn-remove" aria-hidden="true"></i></span><br>')
            if(!$('#modal-new-carrier .phones').hasClass('in')){
                $('#modal-new-carrier .phones').addClass('in')
            }
            $('#modal-new-carrier .phones .label .btn-remove').click(function(){
                $(this).parent('.label').remove()
            })
        }
    });

    $('#modal-new-carrier .phones .label .btn-remove').click(function(){
        $(this).parent('.label').remove();
    });

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

    $('#modal-new-carrier').on('hidden.bs.modal', function (e) {
        $('#modal-new-carrier input').val('');
        $('.phones').html('');
        if(!$('#modal-new-carrier .phones').hasClass('in')){
            $('#modal-new-carrier .phones').addClass('in');
        }
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)
        $("#modal-new-carrier #drives").val('').trigger('change');
        clean("formNewData");
    });

    $('#modal-new-choir').on('hidden.bs.modal', function (e) {
        $('#modal-new-choir input').val('');        
        $('.province').val('').trigger('change')
        $('.location').val('').trigger('change')
        $('.location').prop('disabled', true)        
        clean("formNewData");
    });

    $('#modal-new-car').on('hidden.bs.modal', function (e) {
        $('#modal-new-car #datos input').val('');
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
                        $('.btn-delete').attr('disabled', true)
                        $('#sendControl').attr('disabled', true)
                        $('select').attr('disabled', true)
                        $('textarea').attr('disabled', true)
                        $('#priestAdd').closest('div').find('a').remove()
                        $('#addGravedigger').closest('div').find('a').remove()
                        $('#carrierAdd').closest('div').find('a').remove()
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

                        setTimeout(() => {
                            $(".notifiedPriest").attr("disabled", true);
                            $(".notifiedBellringer").attr("disabled", true);
                            $(".notifiedChoir").attr("disabled", true);
                            $("#carriers-table .confirmed").attr("disabled", true);
                            $("#gravedigger-table .notified").attr("disabled", true);

                            $(".fa-plus-circle").parent().remove()
                            $(".btn-delete").remove()
                            $(".btn-danger").attr("disabled", true);
                            $(".fa-pencil").parent().remove()
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

    // Recordatorio sobre
    setTimeout(() => {
        $('#goRecordatorioSobre').click(function(){
            $('#saveForm').click()
            $.ajax({
                url: uri + 'core/expedients/reminder-packet/checkReminderPacket.php',
                method: 'POST',
                data: {
                    expedient: expedientID,
                    type: 0,
                    model: 0
                },
                dataType: 'json',
                async: false,
                success: function(data){
                    try{
                        if(data){
                            window.location.href = uri + 'expediente/recordatorio-sobre/editor/' + expedientID;
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
            return false
        })
    }, 1000)

    // Recordatorio sobre ceuz
    setTimeout(() => {
        $('#goRecordatorioSobreCruz').click(function(){
            $('#saveForm').click()
            $.ajax({
                url: uri + 'core/expedients/reminder-packet-cross/checkReminderPacketCross.php',
                method: 'POST',
                data: {
                    expedient: expedientID,
                    type: 0,
                    model: 0
                },
                dataType: 'json',
                async: false,
                success: function(data){
                    try{
                        if(data){
                            window.location.href = uri + 'expediente/recordatorio-sobre-cruz/editor/' + expedientID;
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
            return false
        })
    }, 1000)

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
            $('#carrierAdd').closest('div').find('a').remove()
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

            if(userType == 1 || userType == 2){
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

            //EXCEPTION PARA QUE LAS AZAFATAS PUEDAN ACTUALIZAR LOS LITERALES CON EL EXPEDIENTE FINALIZADO
            if(userType == 2){
                $(".literal-field").attr("disabled", false)
                $("#saveForm").addClass('hide');
                $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="saveFormLiterals" name="saveFormLiterals" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar</button>');
            

                $("#saveFormLiterals").click(function(){

                    var flag = 0;
                    var literalReceived = $('#literalReceived').prop('checked')
                    var literalNoFinished = $('#literalNoFinished').prop('checked')
                    var literalRequest = $('#literalRequest').prop('checked')
                    var literalVolumePage = $('#literalVolumePage').val()
                    var literalWhoTakes = $('#literalWhoTakes').val()
                    var literalCivilRegister = $('#literalCivilRegister').val()
                    if($('#literalDateExit').val() != null && $('#literalDateExit').val() != ''){
                        var literalDateExit = moment( $('#literalDateExit').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    }else{
                        var literalDateExit = 'null'
                    }            
                    var literalTimeExit = $('#literalTimeExit').val();
                    var literalNotApply = $('#literalNotApply').prop('checked');

                    $.ajax({
                        url : uri + 'core/expedients/services/functions.php',
                        method : 'POST',
                        data : {
                            type: 'updateServiceLiterals',
                            expedientID : expedientID,
                            
                            literalRequest: literalRequest,
                            literalReceived: literalReceived,
                            literalNoFinished: literalNoFinished,
                            literalNotApply: literalNotApply,
                            literalVolumePage: literalVolumePage,
                            literalCivilRegister: literalCivilRegister,
                            literalWhoTakes: literalWhoTakes,
                            literalDateExit: literalDateExit,
                            literalTimeExit: literalTimeExit,
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

                        setTimeout(function(){
                            window.location.reload()
                        }, 500)
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                })
            }
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

    // Vivo recuerdo API
    if(hasVivoRecuerdoKeys){
        $('#vivorecuerdoSection').append(
            '   <div class="panel box box-primary">' +
            '       <fieldset>' +
            '       <legend class="legendBottom"><span id="vivorecuerdoTitle" class="label label-primary labelLgExp">Vivo Recuerdo</span></legend>' +
            '           <div class="table-responsive">' +
            '               <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
            '                   <thead>' +
            '                       <tr>' +
            '                           <th width="55%">Acciones</th>' +
            '                       </tr>' +
            '                   </thead>' +
            '                   <tbody>' +
            '                       <tr>' +
            '                           <td width="5%">' +
            '                               <div class="col-xs-2">' +
            '                                   <button type="button" class="btn btn-primary" id="sendToModal">Enviar</button>' +
            '                               </div> ' +
            '                               <div class="col-xs-2">' +
            '                                   <input type="checkbox" id="vivoSent">' +
            '                                   <label id="vivoSentLbl" for="vivoSent">Enviado</label>' +
            '                               </div>' +
            '                               <div class="col-xs-2">' +
            '                                   <input type="checkbox" id="vivoNotApply">' +
            '                                   <label for="vivoNotApplyLbl">No aplica</label>' +
            '                               </div> ' +
            '                           </td>' +
            '                       </tr>' +
            '                   </tbody>' +
            '               </table>' +
            '           </div>' +
            '       </fieldset>' +
            '   </div>'
        )

        checkboxTotal++
        
        if(expedient.vivoSent == '1'){
            checkboxItems++

            $('#vivoSent').prop('checked', true)
            $('#vivorecuerdoTitle').removeClass('label-primary').addClass('label-success')
        }else{
            $('#vivoSentLbl').addClass('c-red')
        }
        
        if(expedient.vivoNotApply == '1'){
            checkboxItems++

            $('#vivoSent').closest('div').addClass('hide')
            $('#vivoNotApply').prop('checked', true)
            $('#vivorecuerdoTitle').removeClass('label-primary').addClass('label-success')
        }

        $('#vivoNotApply').change(function(){
            if($(this).prop('checked')){
                $('#vivoSent').prop('checked', true)
                $('#vivoSent').closest('div').addClass('hide')
            }else{
                $('#vivoSent').prop('checked', false)
                $('#vivoSent').closest('div').removeClass('hide')
            }
        })

        $('#sendToModal').click(function(){
            var info = null

            $.ajax({
                url: uri + 'core/expedients/services/functions.php',
                method: 'POST',
                data: {
                    type: 'getExpedientInfo',
                    expedientID: expedientID
                },
                dataType: 'json',
                async: false,
                success: function(data){
                    try{
                        info = data
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

            if(info == null){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else{
                if(info.deceasedDate != null && info.deceasedDate != ''){
                    $('#modal-vivorecuerdo #deceasedDate').val(moment(info.deceasedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                }
                $('#modal-vivorecuerdo #deceasedLocation').val(
                    (info.deceasedLocationName != null && info.deceasedLocationName != '' ? info.deceasedLocationName : '')
                )
                $('#modal-vivorecuerdo #deceasedName').val(info.deceasedName)
                $('#modal-vivorecuerdo #deceasedSurname').val(info.deceasedSurname)
                $('#modal-vivorecuerdo #extraText').val(info.extraText)
                if(info.deceasedBirthday != null){
                    $('#modal-vivorecuerdo #deceasedBirthday').val(moment(info.deceasedBirthday, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                }
                $('#modal-vivorecuerdo #deceasedBirthdayLocationName').val(info.deceasedBirthdayLocationName)
                $('#modal-vivorecuerdo #deceasedBirthdayLocationProvince').val(info.deceasedBirthdayLocationProvince)
                if(info.funeralDate != null && info.funeralDate != ''){
                    $('#modal-vivorecuerdo #funeralDate').val(moment(info.funeralDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
                }
                var churchName = info.churchName == null ? '' : info.churchName;
                if(info.churchLabel == 'Iglesia Parroquial' && churchName != ''){
                    churchName = info.churchLabel + ' de ' + info.churchName;
                }
                $('#modal-vivorecuerdo #churchName').val(churchName)
                $('#modal-vivorecuerdo #churchLocationName').val(info.churchLocationName)
                if(info.funeralTime != null && info.funeralTime != ''){
                    $('#modal-vivorecuerdo #funeralTime').val(moment(info.funeralTime, 'HH:mm:ss').format('HH:mm'))
                }
                if(info.cemeteryLabel == 'Cementerio'){
                    $('#modal-vivorecuerdo #destination').val('cementerio')
                    $('#modal-vivorecuerdo #destinationName').val('Cementerio ' + info.cemeteryName)
                    $('#modal-vivorecuerdo #destinationLocation').val(info.cemeteryLocationName)
                }else{
                    $('#modal-vivorecuerdo #destination').val('crematorio')
                    $('#modal-vivorecuerdo #destinationName').val('Crematorio ' + info.crematoriumName)
                    $('#modal-vivorecuerdo #destinationLocation').val(info.crematoriumLocationName)
                }
                $('#modal-vivorecuerdo #deceasedRoom').val(info.deceasedRoom)
                $('#modal-vivorecuerdo #phone1').val(info.familyContactMobilePhone)
                
                $('#modal-vivorecuerdo').modal('show')
            }
        })

        $('#modal-vivorecuerdo #sendToVivorecuerdo').click(function(){
            var validate = 0

            if(isEmpty($('#modal-vivorecuerdo #deceasedDate'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedLocation'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedName'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedSurname'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedBirthday'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedBirthdayLocationName'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedBirthdayLocationProvince'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #destination'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #deceasedRoom'))){
                validate++
            }
            if(isEmpty($('#modal-vivorecuerdo #phone1'))){
                validate++
            }else{
                if(!isPhone($("#modal-vivorecuerdo #phone1"))){
                    validate++
                }
            }

            if(validate == 0){
                var deceasedDate = $('#modal-vivorecuerdo #deceasedDate').val()
                var deceasedLocation = $('#modal-vivorecuerdo #deceasedLocation').val()
                var deceasedName = $('#modal-vivorecuerdo #deceasedName').val()
                var deceasedSurname = $('#modal-vivorecuerdo #deceasedSurname').val()
                var extraText = $('#modal-vivorecuerdo #extraText').val()
                var deceasedBirthday = $('#modal-vivorecuerdo #deceasedBirthday').val()
                var deceasedBirthdayLocationName = $('#modal-vivorecuerdo #deceasedBirthdayLocationName').val()
                var deceasedBirthdayLocationProvince = $('#modal-vivorecuerdo #deceasedBirthdayLocationProvince').val()
                var funeralDate = $('#modal-vivorecuerdo #funeralDate').val()
                var churchName = $('#modal-vivorecuerdo #churchName').val()
                var churchLocationName = $('#modal-vivorecuerdo #churchLocationName').val()
                var funeralTime = $('#modal-vivorecuerdo #funeralTime').val()
                var destination = $('#modal-vivorecuerdo #destination').val()
                var destinationLocation = $('#modal-vivorecuerdo #destinationLocation').val()
                var deceasedRoom = $('#modal-vivorecuerdo #deceasedRoom').val()
                var destinationName = $('#modal-vivorecuerdo #destinationName').val()
                var phone1 = $('#modal-vivorecuerdo #phone1').val()
                var phone2 = $('#modal-vivorecuerdo #phone2').val()
                var phone3 = $('#modal-vivorecuerdo #phone3').val()
                var phone4 = $('#modal-vivorecuerdo #phone4').val()
                var phone5 = $('#modal-vivorecuerdo #phone5').val()

                var destinationLocationAux = destinationName
                var destinationName = destinationLocation
                
                var data = {
                    type: 'create',
                    expedient: $('#formCService #expedientID').val(),
                    deceasedDate: deceasedDate,
                    deceasedLocation: deceasedLocation,
                    deceasedName: deceasedName,
                    deceasedSurname: deceasedSurname,
                    extraText: extraText,
                    deceasedBirthday: deceasedBirthday,
                    deceasedBirthdayLocationName: deceasedBirthdayLocationName,
                    deceasedBirthdayLocationProvince: deceasedBirthdayLocationProvince,
                    funeralDate: funeralDate,
                    churchName: churchName,
                    churchLocationName: churchLocationName,
                    funeralTime: funeralTime,
                    destination: destination,
                    destinationName: destinationName,
                    destinationLocation: destinationLocationAux,
                    deceasedRoom: deceasedRoom,
                    phone1: phone1,
                    phone2: phone2,
                    phone3: phone3,
                    phone4: phone4,
                    phone5: phone5
                }

                $.ajax({
                    url: uri + 'core/expedients/vivorecuerdo/functions.php',
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    async: false,
                    success: function(data){
                        try{
                            if(data.status){
                                var response = $.parseJSON(data.data)
                                if(response.status == undefined){
                                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La publicación en Vivo Recuerdo se ha realizado correctamente.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }else{
                                    $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' + response.message + '</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                }
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

                $('#modal-vivorecuerdo').modal('hide')
            }else{
                $('#modal-vivorecuerdo #messageVivorecuerdo').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Hay campos sin cubrir o tienen un formato incorrecto.</div>');
                setTimeout(function(){
                    $('#modal-vivorecuerdo #messageVivorecuerdo').empty()
                }, 5000)
            }
        })
    }else{

        $('#vivorecuerdoSection').append(
            '   <div class="panel box box-primary">' +
            '       <fieldset>' +
            '       <legend class="legendBottom"><span id="vivorecuerdoTitle" class="label label-primary labelLgExp">Vivo Recuerdo</span></legend>' +
            '           <div class="table-responsive">' +
            '               <table class="table table-striped table-bordered display" width="100%" cellspacing="0">' +
            '                   <thead>' +
            '                       <tr>' +
            '                           <th width="55%">Acciones</th>' +
            '                       </tr>' +
            '                   </thead>' +
            '                   <tbody>' +
            '                       <tr>' +
            '                           <td width="5%">' +
            '                               <div class="col-xs-2">' +
            '                                   <button type="button" class="btn btn-primary" id="sendToModal">Enviar</button>' +
            '                               </div> ' +
            '                               <div class="col-xs-2">' +
            '                                   <input type="checkbox" id="vivoSent">' +
            '                                   <label id="vivoSentLbl" for="vivoSent">Enviado</label>' +
            '                               </div>' +
            '                               <div class="col-xs-2">' +
            '                                   <input type="checkbox" id="vivoNotApply">' +
            '                                   <label for="vivoNotApplyLbl">No aplica</label>' +
            '                               </div> ' +
            '                           </td>' +
            '                       </tr>' +
            '                   </tbody>' +
            '               </table>' +
            '           </div>' +
            '       </fieldset>' +
            '   </div>'
        ).addClass('hide')

        $('#vivoNotApply').change(function(){
            if($(this).prop('checked')){
                $('#vivoSent').prop('checked', true)
                $('#vivoSent').closest('div').addClass('hide')
            }else{
                $('#vivoSent').prop('checked', false)
                $('#vivoSent').closest('div').removeClass('hide')
            }
        })

        $('#vivoNotApply').prop('checked', true).trigger('change')
    }

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
    })

    // Surveys
    // $('#surveysSection').addClass('hide');
    $("#sendSurveyHelp").popover({placement:"top", container: 'body', html: true})
    $('#selectSurvey').select2({
        language: langSelect2,
        placeholder: '--',
        allowClear: true,
        ajax: {
            url: uri + 'core/expedients/services/surveyData.php',
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
                            text: item.text,
                            id: item.id
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
        templateResult: formatData,
        templateSelection: formatData
    });

    $('#selectSurvey').change(function(){
        if($(this).val() != null){
            $("#surveyTableDiv").removeClass('hide');
        }else{
            $("#surveyTableDiv").addClass('hide');
        }
    })

    if(expedientInfo.poll != null && expedientInfo.poll != ''){
        if($('[id="selectSurvey"]').find("option[value='" + expedientInfo.poll + "']").length) {
            $('[id="selectSurvey"]').val(expedientInfo.poll).trigger('change');
        }else{
            var newOption = new Option(expedientInfo.poll_title, expedientInfo.poll, true, true);
            $('[id="selectSurvey"]').append(newOption).trigger('change');
        }
    }

    if(expedientInfo.otherContactPhone == null || expedientInfo.otherContactPhone == ''){
        $("#addPhoneContact").attr("disabled", true);
    }

    if(expedientInfo.familyContactMobilePhone == null || expedientInfo.familyContactMobilePhone == ''){
        $("#addPhoneFamilyContact").attr("disabled", true);
    }

    var surveysTable = $('#surveys-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri+"core/expedients/services/survey.php?expedient=" + expedientID,
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
            {"title": "Teléfono"},
            {"title": "¿Enviado?"},
            {"title": "Editar"},
            {"title": "Eliminar"},
        ],
        "columnDefs": [{
            "className": "id",
            "targets": 0,
            "searchable": false,
            "visible": false
        },
        {
            "targets": [1],
            "width": "7%",
            "render": function(data){
                return '<strong>' + data  + '</strong>'
            }
        },
        {
            "className": "centered",
            "targets": 2,
            "orderable": false,
            "searchable": false,
            "width": "7%",
            "render": function(data, type, row){
                if(data == 0){
                    return '<strong>No</strong>';
                }else{
                    return '<strong>Sí</strong>';
                }
            }
        },
        {
            "className": "centered details-control",
            "targets": 3,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                if(row[2] == 0){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-edit editClick' title='Editar teléfono'><i class='fa fa-pencil' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
            }
        },
        {
            "className": "centered details-control",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "4%",
            "data": null,
            render: function(data, type, row){
                if(row[2] == 0){
                    return "<ul class='actions-menu'><li><a href='javascript:void(0)' class='btn-delete removeClick' title='Borrar teléfono'><i class='fa fa-trash' aria-hidden='true'></i></a></li></ul>"
                }else{
                    return '-'
                }
            }
        }],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[0, 'asc']],
        "footerCallback" : function(row, data){
            var hasOtherContactPhone = false;
            var hasFamilyContactPhone = false;
            var hasSurveySended = 0;
            $("#addPhoneContact").attr("disabled", false);
            $("#addPhoneFamilyContact").attr("disabled", false);
            $.each(data, function(index, elem){
                // Checks contact buttons
                if(elem[1] == expedientInfo.otherContactPhone){
                    hasOtherContactPhone = true;
                }
                if(elem[1] == expedientInfo.familyContactMobilePhone){
                    hasFamilyContactPhone = true;
                }

                // Checks any survey was sended
                if(parseInt(elem[2]) == 1){
                    hasSurveySended++;
                }
            })

            if(hasOtherContactPhone || (expedientInfo.otherContactPhone == null || expedientInfo.otherContactPhone == '')){
                $("#addPhoneContact").attr("disabled", true);
            }
            if(hasFamilyContactPhone || (expedientInfo.familyContactMobilePhone == null || expedientInfo.familyContactMobilePhone == '')){
                $("#addPhoneFamilyContact").attr("disabled", true);
            }

            // Checks change survey block
            if(hasSurveySended  > 0 && hasSurveySended == data.length){
                $('#selectSurvey').attr("disabled", true);
                $('#sendSurvey').attr("disabled", true);
            }else{
                if(data.length > 0){
                    $('#sendSurvey').attr("disabled", false);

                    if(hasSurveySended > 0){
                        $('#selectSurvey').attr("disabled", true);
                    }
                }

                if(data.length == 0){
                    $('#selectSurvey').attr("disabled", false);
                    $('#sendSurvey').attr("disabled", true);
                }
            }
        }
    });

    $("#addPhoneContact").click(function(){
        if(expedientInfo.otherContactPhone != null && expedientInfo.otherContactPhone != ''){
            $("#phoneSurvey").val(expedientInfo.otherContactPhone);
        }
    })

    $("#addPhoneFamilyContact").click(function(){
        if(expedientInfo.familyContactMobilePhone != null && expedientInfo.familyContactMobilePhone != ''){
            $("#phoneSurvey").val(expedientInfo.familyContactMobilePhone);
        }
    })

    $("#addPhoneSurvey").click(function(){

        var validate = false;
        if($("#phoneSurvey").val() != "" && isPhone($("#phoneSurvey"))){
            validate = true;
        }

        var phone = $("#phoneSurvey").val();
        if(validate){
            $.ajax({
                url : uri + 'core/expedients/services/surveyExpedientCreate.php',
                method : 'POST',
                data : {
                    expedient: expedientID,
                    phone : phone
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El teléfono se ha añadido con éxito</div>')

                        $("#phoneSurvey").val('');
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    surveysTable.ajax.reload();
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }else{
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>El teléfono introducido no tiene un formato válido.</div>')
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    surveysTable.on('click', 'tbody .editClick', function(){
        $('.btn-edit').tooltip('hide');

        rowClickSurvey = surveysTable.row($(this).closest('tr')).data() == undefined ? surveysTable.row($(this).closest('tr.child').prev()).data() : surveysTable.row($(this).closest('tr')).data()

        $('#modal-surveys #phoneSurveyEdit').val(rowClickSurvey[1])
        
        $('#modal-surveys').modal('show')
    });

    $('#modal-surveys #goEditSurvey').click(function(){
        var validate = true;
        if($("#modal-surveys phoneSurveyEdit").val() != "" && !isPhone($("#modal-surveys #phoneSurveyEdit"))){
            validate = false;
        }

        var phone = $("#modal-surveys #phoneSurveyEdit").val();

        $.ajax({
            url : uri + 'core/expedients/services/surveyExpedientUpdate.php',
            method : 'POST',
            data : {
                ID: rowClickSurvey[0],
                phone : phone
            },
            dataType: 'json',
            async: false,
            success: function(data){
                try{
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El teléfono se ha modificado con éxito</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    surveysTable.ajax.reload()
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

        $('#modal-surveys').modal('hide')
    })

    surveysTable.on('click', 'tbody .removeClick', function(){
        $('.btn-delete').tooltip('hide');

        rowClickSurvey = surveysTable.row($(this).closest('tr')).data() == undefined ? surveysTable.row($(this).closest('tr.child').prev()).data() : surveysTable.row($(this).closest('tr')).data()

        if(confirm('¿Deseas eliminar el teléfono de la encuesta de satisfacción?')){
            $.ajax({
                url : uri + 'core/expedients/services/surveyExpedientDelete.php',
                method : 'POST',
                data : {
                    ID: rowClickSurvey[0]
                },
                success : function(data){
                    if(data){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El teléfono se ha eliminado con éxito</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    surveysTable.ajax.reload()
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    });

    $("#sendSurvey").click(function(){
        if(confirm('¿Deseas enviar la encuesta de satisfacción vía SMS?')){
            $.ajax({
                url : uri + 'core/expedients/services/surveyExpedientSendSMS.php',
                method : 'POST',
                data : {
                    survey: $('#selectSurvey').val(),
                    expedient: expedientID
                },
                dataType: 'json',
                success : function(data){
                    if(data[0] == 'noBalance'){

                        $("#modal-surveys-balance-error #balancePending").text(data[1]);
                        $("#modal-surveys-balance-error #totalSmsToSent").text(data[2]);
                        $("#modal-surveys-balance-error").modal("show");
                    }else if(data[0]){
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La encuesta ha sido enviada con éxito.</div>')
                    }else{
                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    }
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)

                    surveysTable.ajax.reload();
                },
                error : function(){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
                    setTimeout(function(){
                        $('#block-message').empty()
                    }, 5000)
                }
            })
        }
    });
})

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


function noApplyActions(elem){

    if(COMPANY == 3){
        var noApplyId = $(elem).attr("id")
        var parentTD = $(elem).parent().closest('td').attr("id");
        $.each($("#" + parentTD + ' div.spaceRight'), function(index, value){
    
            var itemID = $(value).children('input').attr("id");
    
            if(noApplyId != itemID){
                if($(elem).prop('checked')){
                    $(value).children('input').prop('checked', true);
                    $(value).addClass('hide');
                }else{
                    $(value).children('input').prop('checked', false);
                    $(value).removeClass('hide');
                }
            }
        })
    }
}