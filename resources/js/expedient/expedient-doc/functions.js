/**  @var {string} planHired Plan hired */
var planHired = null;

/**  @var {boolean} hasViaFirmaKeys If company has via firma api keys */
var hasViaFirmaKeys = false;

/**  @var {int} company Empresa */
var company = null

/**  @var {array} docsMultiple Store docs multiple data */
var docsMultiple = null

/**  @var {int} expedientStatus Store expedient status */
var expedientStatus = null;

/**  @var {array} historyDocsSent Store history docs sent data */
var historyDocsSent = null;

/**  @var {array} rowClickHistoryDoc Store click history docs sent data */
var rowClickHistoryDoc = null;

/**  @var {array} historyDocsEmailsSent Store history docs emails sent data */
var historyDocsEmailsSent = null;

/**  @var {array} customDocumentsTable Stores custom documents table */
var customDocumentsTable = null;

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
        success : function(data){
            hasViaFirmaKeys = $.parseJSON(data)
        }
    })
}

//Select2 functions for remote data
function formatData (data) {
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
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

function getUserID(){
    var user;
    $.ajax({

        url: uri+"core/users/functions2.php",
        data: {type: 'getUser'},
        type: 'POST',
        async: false,
        success: function (data) {
            user = $.parseJSON(data);            
        }
    });
    return user[0].userID;
}

/**
 * Logs read
 * 
 * @param int expedient Id del expediente
 */
function setLogRead(expedient){
    $.ajax({
        url: uri + 'core/expedients/docs/functions.php',
        method: 'POST',
        data: {
            type: 'setLogRead',
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

function isPDFSigned(expedientID, docName){
    $.ajax({
        url: uri + "core/tools/firmasPdf/firmasController.php",
        data: {type: "checkPDFsigned", expedientID: expedientID, docName:docName},           
        type: 'POST',           
        async: false,
        success: function (data) {    
                    
            if(data == 1){                
                ret = true;
            }else{
                ret = false;
            }  
        }
    });

    return ret
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
 * Cubre la modal de la carta de flores
 * 
 * @param {int} expedient Expediente
 * @return array info Información
 */
function fillCartaFloresModal(expedient){
    var info = null
    $.ajax({
        url: uri + 'core/expedients/docs/functions.php',
        method: 'POST',
        data: {
            type: 'fillCartaFlores',
            expedient: expedient
        },
        dataType: 'json',
        async: false,
        success: function(data){
            info = data
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
    return info
}

/**
 * Devuelve la información del familiar de contacto
 * 
 * @param {int} expedient Expediente
 * @return array info Información
 */
function getFamilyContact(expedient){
    var info = null
    $.ajax({
        url: uri + 'core/expedients/docs/functions.php',
        method: 'POST',
        data: {
            type: 'getFamilyContact',
            expedient: expedient
        },
        dataType: 'json',
        async: false,
        success: function(data){
            info = data
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
    return info
}

/**
 * Gets associate
 * 
 * @param {int} expedientID Expedient ID
 * @returns 
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
 * Devuelve información sobre el expediente
 * 
 * @param {int} expedientID expedientID
 */
function getExpedient(expedientID) {
    var expedient;
    // DATOS DEL SOLICITANTE - PROVINCIAS
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
 * Actualiza los iconos de la tabla (comprobando si tiene documentos)
 */
function updateTable(){

    var expedientID = $("#expedient").val()
    $.ajax({
        url: uri + 'core/expedients/obituary/docExists.php',
        method: 'POST',
        data: {
            expedient: expedientID
        },
        async: false,
        dataType: 'json',
        success: function(data){
            try{
                if(Array.isArray(data.esquela) && data.esquela[0] != null && data.esquela[1] != null){
                    $('#viewObituarySection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/obituary/' + data.esquela[0] + '/' + data.esquela[1] + '/files/esquela.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editObituarySection').append('<a href="' + uri + 'expediente/esquela/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a>')
                }else{
                    $('#editObituarySection').append('<a href="' + uri + 'expediente/esquela/' + expedientID + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                }
                if(Array.isArray(data.esquelaPrensa) && data.esquelaPrensa[0] != null && data.esquelaPrensa[1] != null){
                    $('#viewObituaryPressSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/obituary-press/' + data.esquelaPrensa[0] + '/' + data.esquelaPrensa[1] + '/files/esquela.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editObituaryPressSection').append('<a href="' + uri + 'expediente/esquela-prensa/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a>')
                }else{
                    $('#editObituaryPressSection').append('<a href="' + uri + 'expediente/esquela-prensa/' + expedientID + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                }
                if(data.cerradoDefuncion){
                    $('#viewDeceasedCloseSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/closed-death/0/0/files/cerradoPorDefuncion.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editDeceasedCloseSection').append('<a id="goCerradoDefuncion"><i class="fa fa-pencil" style="cursor:pointer" aria-hidden="true" title="Editar cartel de cerrado por defunción"></i></a>')
                }else{
                    $('#editDeceasedCloseSection').append('<a id="goCerradoDefuncion"><i class="fa fa-plus-circle" style="cursor:pointer" aria-hidden="true" title="Nuevo cartel de cerrado por defunción"></i></a>')
                }
                if(Array.isArray(data.lapida) && data.lapida[0] != null && data.lapida[1] != null){
                    $('#viewTombstoneSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/tombstone/' + data.lapida[0] + '/' + data.lapida[1] + '/files/lapida.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                }
                if(data.duelo){
                    $('#viewDuelSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/no-duel-received/0/0/files/NoRecibeDuelo.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editDuelSection').append('<a id="goNoRecibeDuelo" style="cursor:pointer"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{
                    $('#editDuelSection').append('<a id="goNoRecibeDuelo" style="cursor:pointer"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                }

                if(!data.recordatorio && !data.recordatorioGallego && !data.recordatorioAniversario){ // 000
                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a>')
                }else if(!data.recordatorio && !data.recordatorioGallego && data.recordatorioAniversario){ // 001
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(!data.recordatorio && data.recordatorioGallego && !data.recordatorioAniversario){ // 010
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(!data.recordatorio && data.recordatorioGallego && data.recordatorioAniversario){ // 011
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(data.recordatorio && !data.recordatorioGallego && !data.recordatorioAniversario){ // 100
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(data.recordatorio && !data.recordatorioGallego && data.recordatorioAniversario){ // 101
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else if(data.recordatorio && data.recordatorioGallego && !data.recordatorioAniversario){ // 110
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')

                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{ // 111
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/0/0/files/recordatorio.pdf" title="Ver recordatorio"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/1/0/files/recordatorio.pdf" title="Ver recordatorio en gallego"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a> / ')
                    $('#viewReminderSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder/5/0/files/recordatorio.pdf" title="Ver recordatorio aniversario"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a>')
                    
                    $('#editReminderSection').append('<a href="' + uri + 'expediente/recordatorio/' + expedientID + '"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                } 

                if(data.recordatorioSobre){
                    $('#viewReminderLetterSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder-packet/0/0/files/recordatorio-sobre.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editReminderLetterSection').append('<a id="goRecordatorioSobre" href="#"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{
                    $('#editReminderLetterSection').append('<a id="goRecordatorioSobre" href="#"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo "></i></a>')
                }
                if(data.recordatorioSobreCruz){
                    $('#viewReminderLetterCrossSection').append('<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/reminder-packet-cross/0/0/files/recordatorio-sobre-cruz.pdf" title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>')
                    $('#editReminderLetterCrossSection').append('<a id="goRecordatorioSobreCruz" href="#"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>')
                }else{
                    $('#editReminderLetterCrossSection').append('<a id="goRecordatorioSobreCruz" href="#"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo "></i></a>')
                }

                // Lápida provisional
                setTimeout(() => {
                    $('#goLapida').click(function(){
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
                }, 1000)

                //Libro Visitas
                setTimeout(() => {
                    $('#goLibroVisitas').click(function(){
                        $('#libro-visitas-modal').modal('show')
                    })
                }, 1000)

                // Recordatorio sobre
                setTimeout(() => {
                    $('#goRecordatorioSobre').click(function(){
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

                // Cerrado por defunción
                setTimeout(() => {
                    $('#goCerradoDefuncion').click(function(){
                        $.ajax({
                            url: uri + 'core/expedients/closed-death/checkClosedDeath.php',
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
                                        window.location.href = uri + 'expediente/cerrado-defuncion/editor/' + expedientID;
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

                // No se recibe duelo
                setTimeout(() => {
                    $('#goNoRecibeDuelo').click(function(){
                        $.ajax({
                            url: uri + 'core/expedients/no-duel-received/checkNoDuelReceived.php',
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
                                        window.location.href = uri + 'expediente/no-recibe-duelo/editor/' + expedientID;
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

                // Recordatorio sobre cruz
                setTimeout(() => {
                    $('#goRecordatorioSobreCruz').click(function(){
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

/**
 * Inicializa los selectores para el envio de correos
 */
function inicializateAddresseeHistoryDocsSent(){

    $('#modal-send-docs-emails #assistants').select2({
        containerCssClass: 'select2-assistants',
        language: langSelect2,
        placeholder: 'Seleccione un asistente...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/assistants/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #bellringers').select2({
        containerCssClass: 'select2-bellringers',
        language: langSelect2,
        placeholder: 'Seleccione un campanero...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/bellringers/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #cemeteries').select2({
        containerCssClass: 'select2-cemeteries',
        language: langSelect2,
        placeholder: 'Seleccione un cementerio...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/cemeteries/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #clients').select2({
        containerCssClass: 'select2-clients',
        language: langSelect2,
        placeholder: 'Seleccione un cliente...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/clients/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #choirs').select2({
        containerCssClass: 'select2-choirs',
        language: langSelect2,
        placeholder: 'Seleccione un coro...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/choirs/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #priests').select2({
        containerCssClass: 'select2-priests',
        language: langSelect2,
        placeholder: 'Seleccione un cura...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/priests/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #gravediggers').select2({
        containerCssClass: 'select2-gravediggers',
        language: langSelect2,
        placeholder: 'Seleccione un enterrador...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/gravediggers/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #churches').select2({
        containerCssClass: 'select2-churches',
        language: langSelect2,
        placeholder: 'Seleccione una iglesia...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/churches/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #doctors').select2({
        containerCssClass: 'select2-doctors',
        language: langSelect2,
        placeholder: 'Seleccione un doctor...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/doctors/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #staff').select2({
        containerCssClass: 'select2-staff',
        language: langSelect2,
        placeholder: 'Seleccione un miembro del personal...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/staff/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #carriers').select2({
        containerCssClass: 'select2-carriers',
        language: langSelect2,
        placeholder: 'Seleccione un porteador...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/carriers/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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

    $('#modal-send-docs-emails #suppliers').select2({
        containerCssClass: 'select2-suppliers',
        language: langSelect2,
        placeholder: 'Seleccione un proveedor...',
        allowClear: true,
        multiple: true,
        ajax: {
            url: uri+'core/suppliers/getAddressee.php',
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
                            text: item.text,
                            id: item.id
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
}

/**
 * Inicializa la tabla con el histórico de envio de documentos por email
 * 
 * @param {int} expedientID expedientID
 * @param {string} docName Nombre en clave del documento
 * @param {string} doc Nombre del documento
 */
function drawHistoryDocsSentTable(expedientID, docName, doc, fileName){

    $("#modal-send-docs-emails #title").text(doc);

    if(historyDocsSent != null){
        historyDocsSent.clear();
        historyDocsSent.destroy();
        $('.docsSentSection').empty();
        $(".docsSentSection").append('<table id="docs-sent-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>')
    }

    historyDocsSent = $('#modal-send-docs-emails #docs-sent-table').DataTable({
        "ajax": uri + "core/expedients/docs/listHistoryDocsSent.php?expedient=" + expedientID + "&docName=" + docName+ "&fileName=" + fileName,
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Fecha envío"},
            {"title": "Destinatarios"},
            {"title": "Document name"},
            {"title": "Ver fichero"},
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0,3],
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered",
            "targets": [1],
            "render": function (data, type, row) {
                return moment(data, 'X').format('DD/MM/YYYY HH:mm:ss')
            }
        },
        {
            "className": "centered editClick get-users",
            "targets": [2],
            "render": function (data, type, row) {
                return '<u>'+data+'</u>'
            }
        },
        {
            "className": "details-control centered",
            "targets": 4,
            "orderable": false,
            "searchable": false,
            "width": "100px",
            "align": "center",
            "data": null,
            "defaultContent": "<a href='#' class='get-file-version' title='Ver versión del fichero'><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a>"
        },
        ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [],
        "order": [[1, 'desc']]
    });

    // Download file version
    historyDocsSent.on('click', '.get-file-version', function(){
        var rowClick = historyDocsSent.row($(this).closest('tr')).data() == undefined ? historyDocsSent.row($(this).closest('tr.child').prev()).data() : historyDocsSent.row($(this).closest('tr')).data()

        window.open(uri + 'descargar-archivo?file=expedients/' + rowClickHistoryDoc[0] + '/docs/history_sent/' + rowClick[0] + '/'+rowClickHistoryDoc[3], '_blank')
    });

    historyDocsSent.on('click', '.get-users', function(){
        var rowClick = historyDocsSent.row($(this).closest('tr')).data() == undefined ? historyDocsSent.row($(this).closest('tr.child').prev()).data() : historyDocsSent.row($(this).closest('tr')).data()

        drawUsersEmailsHistoryDocs(rowClick[0])
    });

    
    $("#modal-send-docs-emails").modal("show");
}

/**
 * Inicializa la tabla con los usuarios a los que se les envío un documento
 * 
 * @param {int} historyID Expedient History Docs Emails id 
 */
function drawUsersEmailsHistoryDocs(historyID){

    if(historyDocsEmailsSent != null){
        historyDocsEmailsSent.clear();
        historyDocsEmailsSent.destroy();
        $('.docsSentEmailsSection').empty();
        $(".docsSentEmailsSection").append('<table id="docs-sent-emails-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>')
    }

    historyDocsEmailsSent = $('#modal-send-docs-users-emails #docs-sent-emails-table').DataTable({
        "ajax": uri + "core/expedients/docs/listHistoryDocsEmailsSent.php?history=" + historyID,
        "responsive": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Nombre y apellidos"},
            {"title": "Email"},
            {"title": "Grupo"},
        ],
        "columnDefs": [ {
            "className": "id",
            "targets": [0],
            "searchable": false,
            "visible": false
        },
        {
            "className": "centered editClick get-users",
            "targets": [1,2,3],
        },
        ],
        "dom": 'rt<"bottom bottom-2"Bp><"clear">',
        "buttons": [],
        "order": [[1, 'desc']]
    });

    $("#modal-send-docs-emails").modal("hide");
    
    $("#modal-send-docs-users-emails").modal("show");
}

/**
 * Generates a custom doc
 * 
 * @param {int} doc Doc
 * @param {int} expedient Expedient
 */
function generateCustomDoc(doc, confDoc, expedient){
    $.ajax({
        url: uri + 'core/expedients/documentsEditor/create.php',
        method: 'POST',
        data: {
            expedient: expedient,
            doc: doc,
            confDoc: confDoc
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                if(data){
                    customDocumentsTable.ajax.reload();
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
}

$(function(){

    getPlanHired();
    getViaFirmaApiKeys();

    // Carga de datos del expediente
    var expedientID = $('#expedient').val();
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
    
    localStorage.removeItem("CreatedPDF");
    window.addEventListener('storage', storageEventHandler, false);
    function storageEventHandler(event) {
        if(event.key == "CreatedPDF"){
            cremationTable.ajax.reload();
            generatedTable.ajax.reload(updateTable);
            exhumationsTable.ajax.reload();
            avantiaTable.ajax.reload();
            ocasoTable.ajax.reload();
            albiaTable.ajax.reload();
            generalesTable.ajax.reload();
            
            $('#goLibroVisitas').click(function(){
                $('#libro-visitas-modal').modal('show')
            })
            $("#modal-incineration-preview").modal('hide')
            $("#libro-visitas-modal").modal('hide')
            // alert("Nuevo documento creado!: " + event.newValue + ".pdf");
            localStorage.removeItem("CreatedPDF");
            docsMultiple.ajax.reload()
        }
    }

    // TOOLBAR BOTTOM
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
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

    //Select
    $.fn.select2.defaults.set("width", "100%");
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    });

    inicializateAddresseeHistoryDocsSent();

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
            if($('#getAllExpedients').select2('data')[0].tpv == '0'){
                window.location.href = uri + 'expediente/documentacion/' + expid
            }else{
                window.location.href = uri + 'expediente/documentacion-tpv/' + expid
            }
        }
    })
    
    var expedient;
    $.ajax({
        url: uri+"core/expedients/logs/functions.php",
        data: {expedient: expedientID, type: 'getExpedient'},
        type: 'POST',
        async: false,
        success: function (data) {
            expedient = $.parseJSON(data)[0];
            var gender = ''
            if(expedient.deceasedGender == 'Mujer'){
                gender = "Dña. "
            }else{
                gender = "D. "
            }
            $('#deceasedName').val(gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
            $('.deceased').text(' '+gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
            $('#numberExpedient').val(expedient.number);
            $('#numberHeader').text(expedient.number);
            $('.numExp').text(expedient.number);
        }
    });

    var heighCremationTable = '160px';
    switch(company){
        case '10':
            heighCremationTable = '185px';
        break;
        default:
            heighCremationTable = '160px';
        break;
    }

    // Documentación cremación
    var cremationTable = $('#cremation-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listC.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 50,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  heighCremationTable,
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
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
                "targets" : 3,
                "orderable": false,
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render": function(data, type, row){
                    if(row[6] != '' && row[6] != null){
                        //var path = row[6].split(uri + 'resources/files/')
                        var path = row[6].split(uri + 'resources/files/')[1].split('/')
                        path.shift()
                        var dirPath = ''
                        $.each(path, function(index, elem){
                            dirPath += elem + '/'
                        })
                        dirPath = dirPath.slice(0, -1)
                        return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '1':
                        case '2':
                        case '53':
                        case '56':
                        case '58':
                            if(row[6] == '' || row[6]==null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a></div>';
                            }
                        break
                    }

                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                    }else{
                        return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo"></i></a></div>';
                    }
                }
            },
            {
                "className": "details-control centered",
                "targets": 7,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(planHired != 'plan_basic'){
                        if(hasViaFirmaKeys){
                            if(row[6] != '' && row[6] !=null){                        
                                return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
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
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete" title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    cremationTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');

        var rowClick = cremationTable.row($(this).closest('tr')).data() == undefined ? cremationTable.row($(this).closest('tr.child').prev()).data() : cremationTable.row($(this).closest('tr')).data()

        firmado = isPDFSigned(expedientID, rowClick[4]);
        
        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch ( rowClick[4]) {
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' +  rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' +  rowClick[4];
                    break;
                }                
            }
        }else{
            switch ( rowClick[4]) {
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' +  rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' +  rowClick[4];
                break;
            }    
        }
        
    })

    cremationTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = cremationTable.row($(this).closest('tr')).data() == undefined ? cremationTable.row($(this).closest('tr.child').prev()).data() : cremationTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign').modal('show')
    })

    $('#modal-sign #signMobile').click(function(){

        $("#modal-sign .phoneNotificationError").addClass('hide');
 
        var phoneNotification = $("#modal-sign #phoneNotification").val();
        var validate = 0;

        // Validate phone
        if(phoneNotification == ''){
            validate++;
        }
        if(!isPhone($("#modal-sign #phoneNotification"))){
            validate++;
        }

        if(validate > 0){
            $("#modal-sign .phoneNotificationError").removeClass('hide');
            return;
        }

        $('#modal-sign #signConfirmMobile').removeClass('hide')
        $('#modal-sign #signMobile').attr('disabled', true)
        $('#modal-sign #signDesktop').attr('disabled', true)

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
                //SMS
                var message = {
                    "groupCode": "funeraria_arosa",
                    "workflow": {
                        "type": "WEB"
                    },
                    "notification": {
                        "text": "Solicitud de firma",
                        "detail": "Debe firmar el documento: " + docName,
                        "notificationType": "SMS",
                        "sharedLink": {
                            "appCode": "com.viafirma.documents",
                            "phone": "+34" + phoneNotification,
                            "subject": "Firma con SMS"
                        },
                    },
                    "document" : {
                        "templateType": "base64",
                        "templateReference" : template,
                        "templateCode": "sms_positionsText_funeraria",
                        "readRequired": false,
                        "watermarkText": "Previsualización",
                        "formRequired": false
                    },
                    "metadataList": [{
                        "key": "phoneNumber",
                        "value": "+34" + phoneNotification,
                    }],
                    "callbackMails": "developer@origamisoluciones.com",
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
        
                        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> La petición de firma del documento ha sido enviada con éxito.</div>');
                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        if(response.type == 'Error' && response.code == 47){
                            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El documento no dispone de firma. Por favor, añade al menos una antes de firmarlo</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    }
                }
            }

            $('#modal-sign #signConfirmMobile').addClass('hide')
            $('#modal-sign').modal('hide')
            $('#modal-sign #signDesktop').attr('disabled', false)
            $('#modal-sign #signMobile').attr('disabled', false)
        }, 250)
    })

    $('#modal-sign #signDesktop').click(function(){
        $('#modal-sign #signConfirmDesktop').removeClass('hide')
        $('#modal-sign #signDesktop').attr('disabled', true)
        $('#modal-sign #signMobile').attr('disabled', true)

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

                // WACOM
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
                    "callbackMails": "developer@origamisoluciones.com",
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
                        if(response.type == 'Error' && response.code == 47){
                            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El documento no dispone de firma. Por favor, añade al menos una antes de firmarlo</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    }
                }
            }

            $('#modal-sign #signConfirmDesktop').addClass('hide')
            $('#modal-sign').modal('hide')
            $('#modal-sign #signDesktop').attr('disabled', false)
            $('#modal-sign #signMobile').attr('disabled', false)
        }, 250)
    })

    cremationTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = cremationTable.row($(this).closest('tr')).data() == undefined ? cremationTable.row($(this).closest('tr.child').prev()).data() : cremationTable.row($(this).closest('tr')).data()
        var fileNameComplete = rowClick[6].split('/');

        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    cremationTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = cremationTable.row($(this).closest('tr')).data() == undefined ? cremationTable.row($(this).closest('tr.child').prev()).data() : cremationTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4]},
                type: 'POST',
                async: false
            });

            cremationTable.ajax.reload();
        }
    });

    $('input[name="deliverClothing"]').on('change', function() {
        if($(this).val() == 'NO'){
            $('input[name="revisedClothing"]').prop('disabled', true);
            $('#revisedClothing1').prop('checked', true);
        }else{
            $('input[name="revisedClothing"]').prop('disabled', false);
        }
    });

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
    
    contactData = getFamilyContact(expedient.expedientID);
    $("#acta-preparacion-modal #familyText").val(contactData)

    $('input[name="belongings"]').on('change', function() {
        if($(this).val() == 'SI'){
            $('#belongingsText').removeClass('hide');
        }else{
            $('#belongingsText').addClass('hide');
            $('#belongingsText').val('');
        }
    });
    $('#acta-preparacion-modal').on('hidden.bs.modal', function () {
        $('#belongingsText').addClass('hide');
        $('#belongingsText').val('');
        $('input[name="belongings"][value="NO"]').prop('checked',true)
    })
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
    
    var scrollDocs = '930px';
    switch(company){
        case '11':
            scrollDocs = '1040px';
        break;
        default:
           scrollDocs = '930px';
        break;
    }

    // Documentación expediente
    var generatedTable = $('#generated-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listDocExpedient.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  scrollDocs,
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 1,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '21':
                            return ''
                        break
                        default:
                            return data == null ? "-" : data;
                        break
                    }
                }
            },
            {
                "targets" : 3,
                "orderable": false,
            },
            {
                "className" : "date",
                "orderable": false,
                "targets" : 2,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '21':
                            return ''
                        break
                        default:
                            return data == null ? "-" : moment(data).format("DD/MM/YYYY")
                        break
                    }
                }
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "searchable": false,
                "orderable": false,
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
                        case '21':                            
                            return '<div id="' + row[4] + '"><a class="btn-edit-multiple"  title="Ver"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"></i></a></div>';
                        break
                        case '18':
                            return '<div id="' + row[4] + '"></div>'
                        break
                        case '25':
                            return '<div id="' + row[4] + '"><a class="btn-condolences"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"  title="Ver"></i></a></div>';
                        break
                        case '26':
                            return '<div id="' + row[4] + '"><a class="btn-orders"><i class="fa fa-eye" style="cursor:pointer" aria-hidden="true"  title="Ver"></i></a></div>';
                        break

                        default:
                            if(row[6] != '' && row[6] != null){
                                var path = row[6].split(uri + 'resources/files/')[1].split('/')
                                path.shift()
                                var dirPath = ''
                                $.each(path, function(index, elem){
                                    dirPath += elem + '/'
                                })
                                dirPath = dirPath.slice(0, -1)
                                return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i></div>';
                            }

                        break
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    
                    switch(row[5]){
                        case '21':
                        case '26':
                            return '<div id="' + row[4] + '"></div>'
                        break
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

                        case '24':
                            if(row[6] == '' || row[6] == null){
                                return '<a id="goNoRecibeDuelo" href="#"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo cartel de no se recibe duelo"></i></a>'
                            }else{
                                return '<a id="goNoRecibeDuelo" href="#"><i class="fa fa-pencil" aria-hidden="true" title="Editar cartel de no se recibe duelo"></i></a>'
                            }
                        break

                        case '23':
                            if(row[6] == '' || row[6] == null){
                                return '<a id="goLibroVisitas" style="cursor:pointer"><i class="fa fa-plus-circle" aria-hidden="true" title="Nuevo Libro de visitas"></i></a>'
                            }else{
                                return '<a href="' + uri + 'documento/nuevo/' + expedientID + '/libroVisitas"><i class="fa fa-pencil" aria-hidden="true" title="Editar"></i></a>';
                            }
                        break;

                        case '3':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '11':
                        case '12':
                        case '16':
                        case '28':
                        case '29':
                        case '33':
                        case '39':
                        case '40':
                        case '43':
                        case '59':
                        case '60':
                        case '62':
                            if(row[6] == '' || row[6] == null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        case '25':
                            return ''
                        break
                        case '61':
                            if(row[6] == '' || row[6] == null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-edit-instanciaAytoSJoanLibritja" style="cursor:pointer"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }
                        break
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
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
                                    }
                                break
                            }
                        }else{
                            return '-';
                        }
                    }else{
                        return '-';
                    }
                }
            },
            {
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6] != null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '17':
                        case '18':
                        case '21':
                        case '26':
                            return '<div id="' + row[4] + '"></div>'
                        break
                        case '25':
                            return ''
                        break
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'desc']],
        initComplete: function(){
            updateTable();
        }
    });

    generatedTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');
        
        var rowClick = generatedTable.row($(this).closest('tr')).data() == undefined ? generatedTable.row($(this).closest('tr.child').prev()).data() : generatedTable.row($(this).closest('tr')).data()

        firmado = isPDFSigned(expedientID, rowClick[4]);

        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch (rowClick[4]) {
                    case 'autoIncineracion':
                        $('#modal-incineration-preview').modal('show');
                    break;
                    case 'actaPreparacion':
                        $('#acta-preparacion-modal').modal('show');
                    break;
                    case 'cartaFlores':
                        if(rowClick[6] == null){
                            var info = fillCartaFloresModal(expedientID)

                            $('#carta-flores-modal .datepicker').datepicker({
                                todayHighlight : true,forceParse: false
                            });

                            $('#carta-flores-modal #currentCoronas').empty();
                            $('#carta-flores-modal #currentCentros').empty();
                            $('#carta-flores-modal #currentRamos').empty();
                        
                            if(info[1] != null){
                                $.each(info[1], function(index, elem){
                                    switch(elem.serviceBelow){
                                        case '5':
                                            $('#currentCoronas').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                        break
                                            
                                        case '6':
                                            $('#currentCentros').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                        break
                                            
                                        case '7':
                                            $('#currentRamos').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                        break
                                    }
                                })
                            }
        
                            if(info[0] != null){
                                var coronas = new Array
                                var ramos = new Array
                                var centros = new Array
                                $.each(info[0], function(index, elem){
                                    switch(elem.category){
                                        case 'attention':
                                            $('#carta-flores-modal #attention').val(elem.value)
                                        break
                                        case 'date':
                                            $('#carta-flores-modal #date').val(elem.value)
                                        break
                                        case 'deceased':
                                            $('#carta-flores-modal #deceased').val(elem.value)
                                        break
                                        case 'coronas':
                                            coronas.push(elem.value)
                                        break   
                                        case 'ramos':
                                            ramos.push(elem.value)
                                        break
                                        case 'centros':
                                            centros.push(elem.value)
                                        break
                                    }
                                })
        
                                $('#moreCoronas').empty()
                                $('#moreCentros').empty()
                                $('#moreRamos').empty()
                                if(coronas.length > 0){
                                    $.each(coronas, function(index, elem){
                                        $('#moreCoronas').append('<input type="text" class="form-control floresInputModalBottom" id="coronas' + index + '" value="' + elem + '">')
                                    })
                                }
                                if(centros.length > 0){
                                    $.each(centros, function(index, elem){
                                        $('#moreCentros').append('<input type="text" class="form-control floresInputModalBottom" id="centros' + index + '" value="' + elem + '">')
                                    })
                                }
                                if(ramos.length > 0){
                                    $.each(ramos, function(index, elem){
                                        $('#moreRamos').append('<input type="text" class="form-control floresInputModalBottom" id="ramos' + index + '" value="' + elem + '">')
                                    })
                                }
                            }
    
                            $('#carta-flores-modal').modal('show');

                        }else{
                            // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                            window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                        }
                    break;
                    case 'lapidaProvisional':
                        $('#lapida-provisional-modal').modal('show')
                    break;
                    case 'tarjetonAgradecimiento':
                        $('#tarjeton-agradecimiento-modal').modal('show')
                    break;
                    case 'instanciaAytoSJoanLibritja':
                        $('#instancia-ayto-sant-joan-modal').modal('show')
                    break;
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    break;
                }
            }
        }else{
            switch(rowClick[4]){
                case 'autoIncineracion':
                    $('#modal-incineration-preview').modal('show');
                break;
                case 'actaPreparacion':
                    $('#acta-preparacion-modal').modal('show');
                break;
                case 'cartaFlores':
                    var rowClick = generatedTable.row($(this).closest('tr')).data() == undefined ? generatedTable.row($(this).closest('tr.child').prev()).data() : generatedTable.row($(this).closest('tr')).data()

                    if(rowClick[6] == null){
                        var info = fillCartaFloresModal(expedientID)
                        var expedientData = getExpedient(expedientID)

                        if(company == '2' || company == '7'){
                            $('#carta-flores-modal #attention').val(expedientData.applicantName+' '+expedientData.applicantSurname)
                        }else{
                            $('#carta-flores-modal #attention').val('')
                        }
                        if(expedientData.funeralDate != null){
                            $('#carta-flores-modal #date').val(moment(expedientData.funeralDate, 'YYYY-MM-DD').format("DD/MM/YYYY"))
                        }

                        $('#carta-flores-modal .datepicker').datepicker({
                            todayHighlight : true,forceParse: false
                        });
                        
                        $('#carta-flores-modal #currentCoronas').empty()
                        $('#carta-flores-modal #currentCentros').empty()
                        $('#carta-flores-modal #currentRamos').empty()
                        
                        
                        if(info[0] != null){
                            $.each(info[0], function(index, elem){
                                switch(elem.serviceBelow){
                                    case '5':
                                        $('#currentCoronas').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                    break
                                    case '6':
                                        $('#currentCentros').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                    break
                                    case '7':
                                        $('#currentRamos').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                    break
                                }
                            })
                        }
                        
                        if(info[1] != null){
                            $.each(info[1], function(index, elem){
                                switch(elem.serviceBelow){
                                    case '5':
                                        $('#currentCoronas').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                    break
                                    case '6':
                                        $('#currentCentros').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                    break
                                    case '7':
                                        $('#currentRamos').append('<input type="text" class="form-control floresInputModalBottom" value="' + elem.value + '" disabled>')
                                    break
                                        
                                }
                            })
                        }
    
                        if(info[0] != null){
                            var coronas = new Array
                            var ramos = new Array
                            var centros = new Array
                            $.each(info[0], function(index, elem){
                                switch(elem.category){
                                    case 'attention':
                                        $('#carta-flores-modal #attention').val(elem.value)
                                    break
                                    case 'date':
                                        $('#carta-flores-modal #date').val(elem.value)
                                    break
                                    case 'deceased':
                                        $('#carta-flores-modal #deceased').val(elem.value)
                                    break
                                    case 'coronas':
                                        coronas.push(elem.value)
                                    break
                                    case 'ramos':
                                        ramos.push(elem.value)
                                    break
                                    case 'centros':
                                        centros.push(elem.value)
                                    break
                                }
                            })
    
                            $('#moreCoronas').empty()
                            $('#moreCentros').empty()
                            $('#moreRamos').empty()
                            if(coronas.length > 0){
                                $.each(coronas, function(index, elem){
                                    $('#moreCoronas').append('<input type="text" class="form-control floresInputModalBottom" id="coronas' + index + '" value="' + elem + '">')
                                })
                            }
                            if(ramos.length > 0){
                                $.each(ramos, function(index, elem){
                                    $('#moreRamos').append('<input type="text" class="form-control floresInputModalBottom" id="ramos' + index + '" value="' + elem + '">')
                                })
                            }
                            if(centros.length > 0){
                                $.each(centros, function(index, elem){
                                    $('#moreCentros').append('<input type="text" class="form-control floresInputModalBottom" id="centros' + index + '" value="' + elem + '">')
                                })
                            }
                        }
    
                        $('#carta-flores-modal').modal('show')
                    }else{
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    }
                break;
                case 'lapidaProvisional':
                    $('#lapida-provisional-modal').modal('show')
                break
                case 'tarjetonAgradecimiento':
                    $('#tarjeton-agradecimiento-modal').modal('show')
                break
                case 'instanciaAytoSJoanLibritja':
                    $('#instancia-ayto-sant-joan-modal').modal('show')
                break;
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                break;
            }
        }
    });

    generatedTable.on('click', '.btn-condolences', function(){
        $('.btn-condolences').tooltip('hide')
        $('.condolences').empty()
        $('#downloadSelectedError').addClass('hide')

        var condolences = null

        $.ajax({
            url: uri + 'core/condolences/functions.php',
            method: 'POST',
            data: {
                type: 'getCondolences',
                expedient: expedientID
            },
            async: false,
            success: function(data){
                try{
                    condolences = $.parseJSON(data)
                    if(condolences == null){
                        $('.condolences').append('  <p>No hay pésames web</p>')
                        $("#downloadAll").attr('disabled', true)
                    }else{
                        $("#downloadAll").attr('disabled', false)
                        var table = '   <table id="condolencesTable" class="table table-striped table-bordered">' +
                                    '       <thead>' +
                                    '           <tr>' +
                                    '               <th class="hide">ID</th>' +
                                    '               <th style="text-align: center">Seleccionado</th>' +
                                    '               <th style="text-align: center">Entregado</th>' +
                                    '               <th style="text-align: center">Fecha</th>' +
                                    '               <th style="text-align: center">Nombre</th>' +
                                    '               <th style="text-align: center">Teléfono</th>' +
                                    '               <th style="text-align: center">Dirección</th>' +
                                    '               <th style="text-align: center">Ciudad</th>' +
                                    '               <th style="text-align: center">PDF</th>' +
                                    '           </tr>' +
                                    '       </thead>' +
                                    '       <tbody>'

                        $.each(condolences, function(index, elem){
                            table +=    '       <tr>' +
                                        '           <td class="condolenceID hide">' + elem.ID + '</td>' +
                                        '           <td class="condolenceSelected" style="text-align: center"><input type="checkbox"></td>';
                            if(elem.delivered == 0){
                                table +=           '           <td class="condolenceDelivered" style="text-align: center"><input type="checkbox" id="check' + elem.ID + '" disabled></td>';
                            }else{
                                table +=           '           <td class="condolenceDelivered" style="text-align: center"><input type="checkbox" id="check' + elem.ID + '" checked disabled></td>';
                            }
                            table +=    '           <td class="condolenceDate" style="text-align: center">' + moment(elem.date, 'X').format('DD/MM/YYYY') + '</td>' +
                                        '           <td class="condolenceName" style="text-align: center">' + elem.name + '</td>' +
                                        '           <td class="condolencePhone" style="text-align: center">' + elem.phone + '</td>' +
                                        '           <td class="condolenceAddress" style="text-align: center">' + elem.address + '</td>' +
                                        '           <td class="condolenceCity" style="text-align: center">' + elem.city + '</td>' +
                                        '           <td class="condolencePdf" style="text-align: center">' +
                                        '               <a href="javascript:void(0)" class="btn-pdf-condolence" title="PDF"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>' +
                                        '           </td>' +
                                        '       </tr>'
                        })
                        table +=    '       </tbody>' +
                                    '   </table>'

                        $('.condolences').append(table)
                    }
                    $('#modal-view-condolences').modal('show');

                    $('.btn-pdf-condolence').click(function(){
                        var condolenceID = $(this).closest('tr').find('td.condolenceID').html()
                        // var condolenceID = $(this).closest('tr').find('td.condolenceDelivered').html()
                        
                        var text;
                        $.ajax({
                            url: uri + 'core/libraries/pdfs/getPdfs.php',
                            data: {doc: 'pesameWeb', text: text, service: condolenceID, data: ""},
                            type: 'POST',
                            async: false,            
                            success: function(data){
                                text = data;
                                $.ajax({
                                    url: uri + 'core/libraries/pdfs/process.php',
                                    data: {text : text, doc : 'pesameWeb', nameFile: 'pesameWeb'},
                                    type: 'POST',
                                    async: false,            
                                    success: function (data) {

                                        $.ajax({
                                            url: uri + 'core/condolences/functions.php',
                                            method: 'POST',
                                            data: {
                                                type: 'updateDelivered',
                                                ID: condolenceID
                                            },
                                            async: false,
                                            success: function(data){
                                                $(".btn-condolences").click()
                                                window.open(uri + 'descargar-archivo?file=expedients/docs/pesameWeb.pdf', '_blank')
                                                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El pdf de la condolencia ha sido creado con éxito.</div>');
                                            }
                                        });

                                    setTimeout(function(){
                                        $('#block-message').empty()
                                    }, 5000)
                                    }
                                });
                            }
                        });
                    })
                }catch(e){
                }
            }
        })
    })

    generatedTable.on('click', '.btn-orders', function(){
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
            $.each(orders, function(index, elem){
                if(supplierAux == elem.supplierID){
                    var texts = '';
                    if(elem.texts){
                        elem.texts.forEach(text => {
                            texts += '<p>' + text.value + '</p>';   
                        });
                    }
                    $('#supplier' + elem.supplierID + ' tbody').append( '<tr>' +
                                                                        '   <td class="hide">' + elem.ID + '</td>' +
                                                                        '   <td class="hide product">' + elem.productID + '</td>' +
                                                                        '   <td class="hide model">' + elem.modelID + '</td>' +
                                                                        '   <td class="centered amount">' + elem.amount + '</td>' +
                                                                        '   <td class="hide price">' + elem.price + '</td>' +
                                                                        '   <td class="centered">' + elem.productName + '</td>' +
                                                                        '   <td class="centered">' + elem.modelName + '</td>' +
                                                                        '   <td class="centered">' + texts + '</td>' +
                                                                        '</tr>')
                }else{
                    supplierAux = elem.supplierID
                    var bottons = "";
                    if(elem.sentEmail == 1){
                        if(elem.order == null){
                            bottons =   '   <div class="clearfix"><div style="float: left">' +
                                        '       <input type="hidden" id="supplier' + elem.supplierID + '" value="' + elem.supplierID + '"/>' +
                                        '   </div>' +
                                        '   <div style="float: right">' +
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
                                        '   <div style="float: right">' +
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
                                        '   <div style="float: right">' +
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
                                        '   <div style="float: right">' +
                                        '       <button type="button" class="btn btn-primary" id="viewOrder' + elem.supplierID + '">Ver pedido</button>' +
                                        '       <button type="button" class="btn btn-danger" id="sentEmail' + elem.supplierID + '">Enviar correo</button>' +
                                        '       <button type="button" class="btn btn-secondary" id="genPDF' + elem.supplierID + '">Ver PDF</button>' +
                                        '       <p id="sentEmail' + elem.supplierID + '"></p>' +
                                        '   </div>';
                        }
                    }

                    if(elem.texts){
                        $('.orders').append('<fieldset><legend><span class="label label-primary labelLgExp"><strong>Proveedor: </strong>' + elem.supplierName + '</legend><table class="table table-striped table-bordered" id="supplier' + elem.supplierID + '">' +
                                            '   <thead>' +
                                            '       <tr>' +
                                            '           <th class="hide">ID</th>' +
                                            '           <th class="hide">productID</th>' +
                                            '           <th class="hide">productModelID</th>' +
                                            '           <th class="centered">Cantidad</th>' +
                                            '           <th class="hide">Precio</th>' +
                                            '           <th class="centered">Producto</th>' +
                                            '           <th class="centered">Modelo</th>' +
                                            '           <th class="centered">Textos</th>' +
                                            '       </tr>' +
                                            '   </thead>' +
                                            '   <tbody>' +
                                            '       <tr>' +
                                            '           <td class="hide">' + elem.ID + '</td>' +
                                            '           <td class="hide product">' + elem.productID + '</td>' +
                                            '           <td class="hide model">' + elem.modelID + '</td>' +
                                            '           <td class="amount centered">' + elem.amount + '</td>' +
                                            '           <td class="hide price">' + elem.price + '</td>' +
                                            '           <td class="centered">' + elem.productName + '</td>' +
                                            '           <td class="centered">' + elem.modelName + '</td>' +
                                            '           <td id="texts" class="centered"></td>' +
                                            '       </tr>' +
                                            '   </tbody>' +
                                            '</table>' + bottons + '</fieldset>')

                        elem.texts.forEach(text => {
                            $('#supplier' + elem.supplierID + ' #texts').append('<p>' + text.value + '</p>');   
                        });
                    }else{
                        $('.orders').append('<fieldset><legend><span class="label label-primary labelLgExp"><strong>Proveedor: </strong>' + elem.supplierName + '</legend><table class="table table-striped table-bordered" id="supplier' + elem.supplierID + '">' +
                                            '   <thead>' +
                                            '       <tr>' +
                                            '           <th class="hide">ID</th>' +
                                            '           <th class="hide">productID</th>' +
                                            '           <th class="hide">productModelID</th>' +
                                            '           <th class="centered">Cantidad</th>' +
                                            '           <th class="hide">Precio</th>' +
                                            '           <th class="centered">Producto</th>' +
                                            '           <th class="centered">Modelo</th>' +
                                            '       </tr>' +
                                            '   </thead>' +
                                            '   <tbody>' +
                                            '       <tr>' +
                                            '           <td class="hide">' + elem.ID + '</td>' +
                                            '           <td class="hide product">' + elem.productID + '</td>' +
                                            '           <td class="hide model">' + elem.modelID + '</td>' +
                                            '           <td class="amount centered">' + elem.amount + '</td>' +
                                            '           <td class="hide price">' + elem.price + '</td>' +
                                            '           <td class="centered">' + elem.productName + '</td>' +
                                            '           <td class="centered">' + elem.modelName + '</td>' +
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

                                                var existsText = false;
                                                $.each(orderLines, function(index, elem){
                                                    if(elem['texts'].length > 0){
                                                        existsText = true;
                                                    }
                                                })

                                                if(existsText){
                                                    $('#modal-send-email #orderLines').append(  '<table class="table table-striped table-bordered">' +
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
                                                    $('#modal-send-email #orderLines').append(  '<table class="table table-striped table-bordered">' +
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

                                                        $('#modal-send-email #orderLines tbody').append('<tr>' +
                                                                                                        '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                        '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                        '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                        '   <td class="centered">' + texts + '</td>' +
                                                                                                        '</tr>')

                                                    }else{
                                                        $('#modal-send-email #orderLines tbody').append('<tr>' +
                                                                                                        '   <td class="centered">' + elem.amount + '</td>' +
                                                                                                        '   <td class="centered">' + elem.productName + '</td>' +
                                                                                                        '   <td class="centered">' + elem.modelName + '</td>' +
                                                                                                        '</tr>')
                                                    }
                                                })
                                                

                                                $('#modal-send-email #deceased').html(order.deceasedName + ' ' + order.deceasedSurname)
                                                $('#modal-send-email #expedientID').html(order.expedient)
                                                $('#modal-send-email #deliveryPlace').html(order.deliveryPlaceName + ", Sala Nº: " + order.deceasedRoom)
                                                if(order.deliveryDate != null){
                                                    $('#modal-send-email #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
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


                                    var existsText = false;
                                    $.each(orderLines, function(index, elem){
                                        if(elem['texts'].length > 0){
                                            existsText = true;
                                        }
                                    })

                                    if(existsText){
                                        $('#modal-send-email #orderLines').append(  
                                            '<table class="table table-striped table-bordered">' +
                                            '   <thead>' +
                                            '       <tr>' +
                                            '           <th class="centered">Cantidad</th>' +
                                            '           <th class="centered">Producto</th>' +
                                            '           <th class="centered">Modelo</th>' +
                                            '           <th class="centered">Textos</th>' +
                                            '       </tr>' +
                                            '   </thead>' +
                                            '   <tbody></tbody>' +
                                            '</table>'
                                        )
                                    }else{
                                        $('#modal-send-email #orderLines').append(  
                                            '<table class="table table-striped table-bordered">' +
                                            '   <thead>' +
                                            '       <tr>' +
                                            '           <th class="centered">Cantidad</th>' +
                                            '           <th class="centered">Producto</th>' +
                                            '           <th class="centered">Modelo</th>' +
                                            '       </tr>' +
                                            '   </thead>' +
                                            '   <tbody></tbody>' +
                                            '</table>'
                                        )
                                    }

                                    $.each(orderLines, function(index, elem){

                                        if(existsText){
                                            var texts = ""
                                            $.each(elem['texts'], function(index, elem){
                                                texts += '<p>'+elem.value+'</p>'
                                            })

                                            $('#modal-send-email #orderLines tbody').append(
                                                '<tr>' +
                                                '   <td class="centered">' + elem.amount + '</td>' +
                                                '   <td class="centered">' + elem.productName + '</td>' +
                                                '   <td class="centered">' + elem.modelName + '</td>' +
                                                '   <td class="centered">' + texts + '</td>' +
                                                '</tr>'
                                            )
                                        }else{
                                            $('#modal-send-email #orderLines tbody').append(
                                                '<tr>' +
                                                '   <td class="centered">' + elem.amount + '</td>' +
                                                '   <td class="centered">' + elem.productName + '</td>' +
                                                '   <td class="centered">' + elem.modelName + '</td>' +
                                                '</tr>'
                                            )
                                        }
                                    })

                                    $('#modal-send-email #deceased').html(order.deceasedName + ' ' + order.deceasedSurname)
                                    $('#modal-send-email #expedientID').html(order.expedient)
                                    $('#modal-send-email #deliveryPlace').html(order.deliveryPlaceName + ", Sala Nº: " + order.deceasedRoom)
                                    if(order.deliveryDate != null){
                                        $('#modal-send-email #deliveryDate').html(moment(order.deliveryDate, 'X').format('DD/MM/YYYY'))
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
            })
        }
        
        $('#modal-view-orders').modal('show')
    })

    generatedTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = generatedTable.row($(this).closest('tr')).data() == undefined ? generatedTable.row($(this).closest('tr.child').prev()).data() : generatedTable.row($(this).closest('tr')).data()
        var fileNameComplete = rowClick[6].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    generatedTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = generatedTable.row($(this).closest('tr')).data() == undefined ? generatedTable.row($(this).closest('tr.child').prev()).data() : generatedTable.row($(this).closest('tr')).data()
        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4], pathFile: rowClick[6]},
                type: 'POST',
                async: false
            });

            generatedTable.ajax.reload(updateTable);
            $('#goLibroVisitas').click(function(){
                $('#libro-visitas-modal').modal('show')
            })
        }
    });

    // FIRMAR DOCUMENTO
    generatedTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = generatedTable.row($(this).closest('tr')).data() == undefined ? generatedTable.row($(this).closest('tr.child').prev()).data() : generatedTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign').modal('show')
    })

    $('#incVigoMemorial').click(function(){
        window.open(uri + 'descargar-archivo?file=expedients/docs/Solicitud Incineracion Vigomemorial.pdf', '_blank')
    })
    $('#incTanatorioBoisaca').click(function(){
        // window.open(uri + 'documento/nuevo/' + expedientID + '/incTanatorioBoisaca', '_blank')
        window.location.href = uri + 'documento/nuevo/' + expedientID + '/incTanatorioBoisaca';
    })

    $("#downloadAll").click(function(){
        var ids = new Array
        $('#condolencesTable tr').each(function(){
            var row = $(this)
            var id = row.find('td.condolenceID').text()
            if(id != ''){
                ids.push([id])
            }
        })

        if(ids.length > 0){
            var text
            $.ajax({
                url: uri + 'core/libraries/pdfs/getPdfs.php',
                data: {
                    doc: 'pesamesWeb',
                    text: text,
                    ids: ids,
                    data: "",
                    all: 1
                },
                type: 'POST',
                async: false,            
                success: function(data){
                    text = data
                    $.ajax({
                        url: uri + 'core/libraries/pdfs/process.php',
                        data: {text: text,
                            doc: 'pesamesWeb',
                            nameFile: 'pesamesWeb'
                        },
                        type: 'POST',
                        async: false,            
                        success: function(){
                            $(".btn-condolences").click()
                            window.open(uri + 'descargar-archivo?file=expedients/docs/pesamesWeb.pdf', '_blank')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                }
            })
        }
    })

    $("#downloadSelected").click(function(){
        var ids = new Array
        $('#condolencesTable tr').each(function(){
            var row = $(this)
            if(row.find('td.condolenceSelected').find('input').prop('checked')){
                var id = row.find('td.condolenceID').text()
                if(id != ''){
                    ids.push([id])
                }
            }
        })

        if(ids.length > 0){
            $('#downloadSelectedError').addClass('hide')
            var text
            $.ajax({
                url: uri + 'core/libraries/pdfs/getPdfs.php',
                data: {
                    doc: 'pesamesWeb',
                    text: text,
                    ids: ids,
                    data: "",
                    all: 0
                },
                type: 'POST',
                async: false,            
                success: function(data){
                    text = data
                    $.ajax({
                        url: uri + 'core/libraries/pdfs/process.php',
                        data: {
                            text: text,
                            doc: 'pesamesWeb',
                            nameFile: 'pesamesWeb'
                        },
                        type: 'POST',
                        async: false,            
                        success: function(){
                            $(".btn-condolences").click()
                            window.open(uri + 'descargar-archivo?file=expedients/docs/pesamesWeb.pdf', '_blank')
                            setTimeout(function(){
                                $('#block-message').empty()
                            }, 5000)
                        }
                    })
                }
            })
        }else{
            $('#downloadSelectedError').removeClass('hide')
        }
    })

    $('#modal-send-email #sendEmail').click(function(){
        var orderID = $('#modal-send-email #orderID').val()
        $.ajax({
            url : uri + 'core/orders/functions.php',
            method : 'POST',
            data : {
                type : 'sendEmail',
                order : orderID,
                notes : $('#modal-send-email #notes').text(),
                sendCopy : $('#modal-send-email #sendCopy').val(),
                expedient: $('#expedient').val()
            },
            async: false,
            success : function(data){
                if(data){
                    $('.btn-orders').click()
                    $('#modal-send-email').modal('hide')
                }
            },
            error : function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>')
            }
        })
    })

    $('#expedient-new-order').click(function(){
        window.location.href = uri + 'almacen/pedidos/nuevo-pedido/' + expedientID;
    })

    // Documentación múltiple
    docsMultiple = $('#docs-multiple').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listM.php?expedient=" + expedientID + "&docType=" + 1,
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
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "",
                "targets": [0],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
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
                "orderable": false,
                "searchable": false,
                "render": function(data, type, row){
                    if(row[6] != ''){
                        return '<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/'+ expedientID + '/docs/' + data + '.pdf"  title="Ver"><i class="fa fa-eye" aria-hidden="true"></i></a>';
                    }else{
                        return '<i class="fa fa-eye c-grey" aria-hidden="true"></i>';
                    }
                }
            },
            {
                "className": "details-control centered",
                "targets": 5,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != ''){
                        return "<a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a>";
                    }else{
                        return '<i class="fa fa-trash c-grey" aria-hidden="true"></i>';
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[1, 'asc']]
    });

    generatedTable.on('click', '.btn-edit-multiple', function () {
        modification = true;
        
        $('.btn-edit').tooltip('hide');

        var rowClick = generatedTable.row($(this).closest('tr')).data() == undefined ? generatedTable.row($(this).closest('tr.child').prev()).data() : generatedTable.row($(this).closest('tr')).data()
        var docType = rowClick[5]

        switch(rowClick[5]){
            case '21':
                $('#modal-view-docs #docType').text('Justificantes de asistencia al sepelio')
            break
            default:
                $('#modal-view-docs #docType').text('-')
            break
        }

        docsMultiple.ajax.url(uri + "core/expedients/docs/listM.php?expedient=" + expedientID + "&docType=" + docType).load()

        $('#modal-view-docs').modal('show');

        $('#modal-view-docs #modal-new-doc').click(function(){
            switch(docType){
                case '21':
                    var docName = 'justificanteSepelio'
                break
            }

            if(docName == 'autoIncineracion'){
                $('#modal-incineration-preview').modal('show');
            }else{
                // window.open(uri + 'documento/nuevo/' + expedientID + '/' + docName, '_blank');
                window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + docName;
            }
        });

        docsMultiple.on('click', '.btn-delete', function () {
            $('.btn-delete').tooltip('hide');
    
            var rowClick = docsMultiple.row($(this).closest('tr')).data() == undefined ? docsMultiple.row($(this).closest('tr.child').prev()).data() : docsMultiple.row($(this).closest('tr')).data()

            if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "?")){
                $.ajax({
                    url: uri + "core/expedients/docs/delete.php",
                    data: {
                        expedientID: expedientID,
                        nameFile: rowClick[4],
                        docID : rowClick[0],
                        opt : "upload"
                    },
                    type: 'POST',
                    async: false
                });
        
                docsMultiple.ajax.reload();
            }
        });
    });

    // EVENTOS PARA INSTANCIA AYTO SANT JOAN
    $("#instancia-ayto-sant-joan-modal #saveNewInstanciaAytoSantJoan").click(function(){

        $('#instancia-ayto-sant-joan-modal #saveNewInstanciaAytoSantJoan').attr('disabled', true)

        var data = [];

        $.each($('#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan').serializeArray(), function(index, elem){
    
            switch(elem.name){
                case 'interestedNif':
                case 'interestedName':
                case 'interestedSurname1Pre':
                case 'interestedSurname1':
                case 'interestedSurname2Pre':
                case 'interestedSurname2':
                case 'interestedBusinessName':

                case 'representantNif':
                case 'representantName':
                case 'representantSurname1Pre':
                case 'representantSurname1':
                case 'representantSurname2Pre':
                case 'representantSurname2':
                case 'representantBusinessName':
                    
                case 'notificationEmail':
                case 'notificationPhone':
                case 'notificationCountry':
                case 'notificationProvince':
                case 'notificationLocality':
                case 'notificationCore':
                case 'notificationPostalCode':
                case 'notificationAddressType':
                case 'notificationAddress':
                case 'notificationAddresNum':
                case 'notificationAddresBlock':
                case 'notificationAddressStairs':
                case 'notificationAddressFloor':
                case 'notificationAddressDoor':
                case 'notificationAddressExtra':
                    
                case 'deceasedNif':
                case 'deceasedNameData':
                case 'deceasedSurname1Pre':
                case 'deceasedSurname1':
                case 'deceasedSurname2Pre':
                case 'deceasedSurname2':
                case 'deceasedBusinessName':
                case 'deceasedEmail':
                case 'deceasedPhone':
                case 'deceasedCountry':
                case 'deceasedProvince':
                case 'deceasedLocality':
                case 'deceasedCore':
                case 'deceasedPostalCode':
                case 'deceasedAddressType':
                case 'deceasedAddress':
                case 'deceasedAddresNum':
                case 'deceasedAddresBlock':
                case 'deceasedAddressStairs':
                case 'deceasedAddressFloor':
                case 'deceasedAddressDoor':
                case 'deceasedAddressExtra':
                case 'deceasedGeographicalPoint':
                case 'deceasedDeliveryPoint':
                case 'deceasedRelationship':
                case 'deceasedPlaceLocation':
                case 'deceasedDate':

                case 'nicheNum':
                case 'nicheLocation':

                case 'inhumationDate':
                case 'inhumationComments':

                case 'firmLocation':
                case 'firmDate':
                    data[elem.name] = elem.value;
                break;
            }
        })

        // Selects
        data['interestedType'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #interestedType").val();
        data['representantType'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #representantType").val();
        data['representantAuthority'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #representantAuthority").val();
        data['representantCovenant'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #representantCovenant").val();
        data['notificationSource'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #notificationSource").val();
        data['deceasedType'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #deceasedType").val();
        data['deceasedSource'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #deceasedSource").val();

        // Checkbox
        data['obligatoryCertificate'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #obligatoryCertificate").prop('checked') ? 1 : 0;
        data['obligatoryIdentificationData'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #obligatoryIdentificationData").prop('checked') ? 1 : 0;
        data['LOPDConsent'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #LOPDConsent").prop('checked') ? 1 : 0;
        data['firmConsent'] = $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #firmConsent").prop('checked') ? 1 : 0;
        
        data['expedient'] = $('#expedient').val();
        $.ajax({
            url: uri + "core/expedients/docs/createAytoSantJoanDoc.php",
            data:   Object.assign({}, data),
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function (data){
                if(data){
                    window.open(uri + 'descargar-archivo?file=expedients/'+ $('#expedient').val() + '/docs/instanciaAytoSJoanLibritja.pdf');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                }
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        });

        $('#instancia-ayto-sant-joan-modal #saveNewInstanciaAytoSantJoan').attr('disabled', false)
    })

    generatedTable.on('click', '.btn-edit-instanciaAytoSJoanLibritja', function(){

        var autoSJoanLibritjaInfo = null;
        $.ajax({
            url: uri + 'core/expedients/docs/readAytoSantJoanDoc.php',
            method: 'POST',
            data: {
                expedient: $('#expedient').val()
            },
            async: false,
            dataType: 'json',
            success: function(data){
                try{
                    autoSJoanLibritjaInfo = data;
                    $.each(Object.entries(autoSJoanLibritjaInfo), function(index, value){
                        switch(value[0]){
                            case 'interestedType':
                            case 'representantType':
                            case 'representantAuthority':
                            case 'representantCovenant':
                            case 'notificationSource':
                            case 'deceasedType':
                            case 'deceasedSource':
                                $("#instancia-ayto-sant-joan-modal #"+value[0]).val(value[1]).trigger('change');
                            break;

                            case 'obligatoryCertificate':
                            case 'obligatoryIdentificationData':
                            case 'LOPDConsent':
                            case 'firmConsent':
                                if(parseInt(value[1]) == 1){
                                    $("#instancia-ayto-sant-joan-modal #"+value[0]).prop('checked', true);
                                }
                            break;

                            default:
                                $("#instancia-ayto-sant-joan-modal #"+value[0]).val(value[1]);
                            break;
                        }
                    })
                    
                    $('#instancia-ayto-sant-joan-modal').modal('show');

                }catch(e){

                }
            }
        })
    })

    $('#instancia-ayto-sant-joan-modal').on('hidden.bs.modal', function(){

		cleanModal("formInstanciaAytoSantJoan");

        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #interestedType").val(null).trigger('change');
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #representantType").val(null).trigger('change');
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #representantAuthority").val(null).trigger('change');
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #representantCovenant").val(null).trigger('change');
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #notificationSource").val(null).trigger('change');
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #deceasedType").val(null).trigger('change');
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #deceasedSource").val(null).trigger('change');

        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #obligatoryCertificate").prop('checked', false);
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #obligatoryIdentificationData").prop('checked', false);
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #LOPDConsent").prop('checked', false);
        $("#instancia-ayto-sant-joan-modal #formInstanciaAytoSantJoan #firmConsent").prop('checked', false);
    });

    /**************************  Documentación exhumaciones y traslados **************************/
    var heighExhumationsTable = '300px';
    switch(company){
        case '13':
            heighExhumationsTable = '340px';
        break;
        default:
            heighExhumationsTable = '300px';
        break;
    }

    var exhumationsTable = $('#exhumations-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listExhumations.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  heighExhumationsTable,
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 1,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : data;
                        break
                    }
                }
            },
            {
                "className" : "date",
                "targets" : 2,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : moment(data).format("DD/MM/YYYY")
                        break
                    }
                }
            },
            {
                "targets" : 3,
                "orderable": false,
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6] != null){
                                var path = row[6].split(uri + 'resources/files/')[1].split('/')
                                path.shift()
                                var dirPath = ''
                                $.each(path, function(index, elem){
                                    dirPath += elem + '/'
                                })
                                dirPath = dirPath.slice(0, -1)
                                return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i></div>';
                            }

                        break
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '19':
                        case '20':
                        case '27':
                        case '34':
                        case '35':
                        case '36':
                        case '37':
                        case '38':
                            if(row[6] == '' || row[6]==null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }
                        break
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
                                default:
                                    if(row[6] != '' && row[6]!=null){                        
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
                                    }
                                break;
                            }
                        }else{
                            return '-';
                        }
                    }else{
                        return '-';
                    }
                }
            },
            {
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    exhumationsTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');
        
        var rowClick = exhumationsTable.row($(this).closest('tr')).data() == undefined ? exhumationsTable.row($(this).closest('tr.child').prev()).data() : exhumationsTable.row($(this).closest('tr')).data()

        firmado = isPDFSigned(expedientID, rowClick[4]);

        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch (rowClick[4]) {
                    case 'exhumacionJudicial':
                        if(rowClick[6] == null){
                            $('#exhumacion-judicial-modal').modal('show')
                        }else{
                            // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank')
                            window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                        }
                    break
                    case 'precintadoFeretro':
                        if(rowClick[6] == null){
                            $('#precintado-feretro-modal').modal('show')
                        }else{
                            // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank')
                            window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                        }
                    break;
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    break;
                }
            }
        }else{
            switch(rowClick[4]){
                case 'exhumacionJudicial':
                    if(rowClick[6] == null){
                        $('#exhumacion-judicial-modal').modal('show')
                    }else{
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank')
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    }
                break
                case 'precintadoFeretro':
                    if(rowClick[6] == null){
                        $('#precintado-feretro-modal').modal('show')
                    }else{
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank')
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    }
                break
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                break;
            }
        }
    });

    exhumationsTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = exhumationsTable.row($(this).closest('tr')).data() == undefined ? exhumationsTable.row($(this).closest('tr.child').prev()).data() : exhumationsTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign').modal('show')
    })

    exhumationsTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = exhumationsTable.row($(this).closest('tr')).data() == undefined ? exhumationsTable.row($(this).closest('tr.child').prev()).data() : exhumationsTable.row($(this).closest('tr')).data()
        var fileNameComplete = rowClick[6].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    exhumationsTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = exhumationsTable.row($(this).closest('tr')).data() == undefined ? exhumationsTable.row($(this).closest('tr.child').prev()).data() : exhumationsTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4]},
                type: 'POST',
                async: false
            });

            exhumationsTable.ajax.reload();
        }
    });

    /************************** Documentación Avantia **************************/
    var avantiaTable = $('#avantia-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listAvantia.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '150px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 1,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : data;
                        break
                    }
                }
            },
            {
                "className" : "date",
                "targets" : 2,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : moment(data).format("DD/MM/YYYY")
                        break
                    }
                }
            },
            {
                "targets" : 3,
                "orderable": false,
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6] != null){
                                var path = row[6].split(uri + 'resources/files/')[1].split('/')
                                path.shift()
                                var dirPath = ''
                                $.each(path, function(index, elem){
                                    dirPath += elem + '/'
                                })
                                dirPath = dirPath.slice(0, -1)
                                return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i></div>';
                            }

                        break
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '42':
                        case '44':
                        case '45':
                        case '52':
                        case '54':
                        case '55':
                            if(row[6] == '' || row[6]==null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }
                        break
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
                                default:
                                    if(row[6] != '' && row[6]!=null){                        
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
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
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    avantiaTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');
        
        var rowClick = avantiaTable.row($(this).closest('tr')).data() == undefined ? avantiaTable.row($(this).closest('tr.child').prev()).data() : avantiaTable.row($(this).closest('tr')).data()
        firmado = isPDFSigned(expedientID, rowClick[4]);

        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch (rowClick[4]) {
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    break;
                }
            }
        }else{
            switch(rowClick[4]){
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                break;
            }
        }
    });

    avantiaTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = avantiaTable.row($(this).closest('tr')).data() == undefined ? avantiaTable.row($(this).closest('tr.child').prev()).data() : avantiaTable.row($(this).closest('tr')).data()
        var fileNameComplete = rowClick[6].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    avantiaTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = avantiaTable.row($(this).closest('tr')).data() == undefined ? avantiaTable.row($(this).closest('tr.child').prev()).data() : avantiaTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign').modal('show')
    })

    avantiaTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = avantiaTable.row($(this).closest('tr')).data() == undefined ? avantiaTable.row($(this).closest('tr.child').prev()).data() : avantiaTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4]},
                type: 'POST',
                async: false
            });

            avantiaTable.ajax.reload();
        }
    });

    /************************** Documentación ocaso **************************/
    var ocasoTable = $('#ocaso-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listOcaso.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '40px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 1,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : data;
                        break
                    }
                }
            },
            {
                "targets" : 3,
                "orderable": false,
            },
            {
                "className" : "date",
                "targets" : 2,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : moment(data).format("DD/MM/YYYY")
                        break
                    }
                }
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6] != null){
                                var path = row[6].split(uri + 'resources/files/')[1].split('/')
                                path.shift()
                                var dirPath = ''
                                $.each(path, function(index, elem){
                                    dirPath += elem + '/'
                                })
                                dirPath = dirPath.slice(0, -1)
                                return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    
                    switch(row[5]){
                        case '46':
                            if(row[6] == '' || row[6]==null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }
                        break
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
                                default:
                                    if(row[6] != '' && row[6]!=null){                        
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
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
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    ocasoTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');
        
        var rowClick = ocasoTable.row($(this).closest('tr')).data() == undefined ? ocasoTable.row($(this).closest('tr.child').prev()).data() : ocasoTable.row($(this).closest('tr')).data()

        firmado = isPDFSigned(expedientID, rowClick[4]);

        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch (rowClick[4]) {
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    break;
                }
            }
        }else{
            switch(rowClick[4]){
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                break;
            }
        }
    });

    ocasoTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide');

        var rowClick = ocasoTable.row($(this).closest('tr')).data() == undefined ? ocasoTable.row($(this).closest('tr.child').prev()).data() : ocasoTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4]);
        $('#docpath').val(rowClick[6]);

        $('#modal-sign').modal('show');
    });

    ocasoTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = ocasoTable.row($(this).closest('tr')).data() == undefined ? ocasoTable.row($(this).closest('tr.child').prev()).data() : ocasoTable.row($(this).closest('tr')).data()

        var fileNameComplete = rowClick[6].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    ocasoTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = ocasoTable.row($(this).closest('tr')).data() == undefined ? ocasoTable.row($(this).closest('tr.child').prev()).data() : ocasoTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4]},
                type: 'POST',
                async: false
            });

            ocasoTable.ajax.reload();
            $('#goLibroVisitas').click(function(){
                $('#libro-visitas-modal').modal('show');
            })
        }
    });

    /************************** Documentación Albia - Santa Lucía **************************/
    var albiaTable = $('#albia-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listAlbia.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '80px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 1,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : data;
                        break
                    }
                }
            },
            {
                "className" : "date",
                "targets" : 2,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : moment(data).format("DD/MM/YYYY")
                        break
                    }
                }
            },
            {
                "targets" : 3,
                "orderable": false,
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6] != null){
                                var path = row[6].split(uri + 'resources/files/')[1].split('/')
                                path.shift()
                                var dirPath = ''
                                $.each(path, function(index, elem){
                                    dirPath += elem + '/'
                                })
                                dirPath = dirPath.slice(0, -1)
                                return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i></div>';
                            }

                        break
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    
                    switch(row[5]){
                        case '49':
                        case '50':
                            if(row[6] == '' || row[6]==null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }
                        break
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
                                case '49':
                                case '50':
                                    return '<div id="' + row[4] + '" class="c-grey">-</div>';                            
                                break                      
                                default:
                                    if(row[6] != '' && row[6]!=null){                        
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                                        //return '<div id="' + row[4] + '" class="c-grey">Firma</div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
                                    }
                                break
                            }
                        }else{
                            return '-';
                        }
                    }else{
                        return '-';
                    }
                }
            },
            {
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    albiaTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');
        
        var rowClick = albiaTable.row($(this).closest('tr')).data() == undefined ? albiaTable.row($(this).closest('tr.child').prev()).data() : albiaTable.row($(this).closest('tr')).data()

        firmado = isPDFSigned(expedientID, rowClick[4]);

        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch (rowClick[4]) {
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    break;
                }
            }
        }else{
            switch(rowClick[4]){
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                break;
            }
        }
    });

    albiaTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = albiaTable.row($(this).closest('tr')).data() == undefined ? albiaTable.row($(this).closest('tr.child').prev()).data() : albiaTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign').modal('show')
    });

    albiaTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = albiaTable.row($(this).closest('tr')).data() == undefined ? albiaTable.row($(this).closest('tr.child').prev()).data() : albiaTable.row($(this).closest('tr')).data()
      
        var fileNameComplete = rowClick[6].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    albiaTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = albiaTable.row($(this).closest('tr')).data() == undefined ? albiaTable.row($(this).closest('tr.child').prev()).data() : albiaTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4]},
                type: 'POST',
                async: false
            });

            albiaTable.ajax.reload();
        }
    });

    /************************** Documentación Varios **************************/
    var generalesTable = $('#general-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listGenerales.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 25,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '410px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Crear/Editar"},
            {"title": ""},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0, 6],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 1,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : data;
                        break
                    }
                }
            },
            {
                "className" : "date",
                "targets" : 2,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            return data == null ? "-" : moment(data).format("DD/MM/YYYY")
                        break
                    }
                }
            },
            {
                "className": "centered linkView",
                "targets": 4,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6] != null){
                                var path = row[6].split(uri + 'resources/files/')[1].split('/')
                                path.shift()
                                var dirPath = ''
                                $.each(path, function(index, elem){
                                    dirPath += elem + '/'
                                })
                                dirPath = dirPath.slice(0, -1)
                                return '<div id="' + row[4] + '"><a target="_blank" href="' + uri + 'descargar-archivo?file=' + dirPath + '"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 5,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        case '5':
                        case '13':
                        case '15':
                        case '41':
                        case '47':
                        case '48':
                        case '51':
                        case '57':
                        case '63':
                        case '66':
                            if(row[6] == '' || row[6] == null){
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-pencil" aria-hidden="true"  title="Editar"></i></a></div>';
                            }
                        break
                        default:
                            if(row[6] != '' && row[6] != null){
                                return '<div id="' + row[4] + '"><i class="fa fa-plus-circle c-grey" aria-hidden="true"></i></div>';
                            }else{
                                return '<div id="' + row[4] + '"><a class="btn-new"><i class="fa fa-plus-circle" aria-hidden="true"  title="Nuevo"></i></a></div>';
                            }
                        break
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
                                case '15':
                                // case '47':
                                case '48':
                                case '63':
                                    return '<div id="' + row[4] + '" class="c-grey">-</div>';                            
                                break                      
                                default:
                                    if(row[6] != '' && row[6]!=null){                        
                                        return '<div id="' + row[4] + '" class="signDocument"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                                    }else{
                                        return '<div id="' + row[4] + '" class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
                                    }
                                break
                            }
                        }else{
                            return '-';
                        }
                    }else{
                        return '-';
                    }
                }
            },
            {
                "className": "details-control centered sendEmail",
                "targets": 8,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[6] != '' && row[6]!=null){
                        return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a></div>';
                    }else{
                        return '<div id="' + row[4] + '"><i class="fa fa-envelope c-grey" aria-hidden="true"></i></div>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    switch(row[5]){
                        default:
                            if(row[6] != '' && row[6]!=null){
                                return '<div id="' + row[4] + '"><a href="javascript:void(0)" class="btn-delete"  title="Borrar"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            }else{
                                return '<div id="' + row[4] + '"><i class="fa fa-trash c-grey" aria-hidden="true"></i></div>';
                            }
                        break
                    }
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    generalesTable.on('click', '.btn-new', function () {
        //Tras hacer click ocultamos el tooltip informativo
        $('.btn-new').tooltip('hide');
        
        var rowClick = generalesTable.row($(this).closest('tr')).data() == undefined ? generalesTable.row($(this).closest('tr.child').prev()).data() : generalesTable.row($(this).closest('tr')).data()
        firmado = isPDFSigned(expedientID, rowClick[4]);

        if(firmado){
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                switch (rowClick[4]) {
                    case 'trasladoHospital':
                        $('#traslado-cadaveres-modal').modal('show')
                    break;
                
                    default:
                        // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                        window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                    break;
                }
            }
        }else{
            switch(rowClick[4]){
                case 'trasladoHospital':
                    $('#traslado-cadaveres-modal').modal('show')
                break
            
                default:
                    // window.open(uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4], '_blank');
                    window.location.href = uri + 'documento/nuevo/' + expedientID + '/' + rowClick[4];
                break;
            }
        }
    });

    generalesTable.on('click', '.signDocument', function(){
        $('.signDocument').tooltip('hide')

        var rowClick = generalesTable.row($(this).closest('tr')).data() == undefined ? generalesTable.row($(this).closest('tr.child').prev()).data() : generalesTable.row($(this).closest('tr')).data()

        $('#docname').val(rowClick[4])
        $('#docpath').val(rowClick[6])

        $('#modal-sign').modal('show')
    });

    generalesTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = generalesTable.row($(this).closest('tr')).data() == undefined ? generalesTable.row($(this).closest('tr.child').prev()).data() : generalesTable.row($(this).closest('tr')).data()
        var fileNameComplete = rowClick[6].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[4], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[4], rowClick[3], fileNameComplete);
    });

    generalesTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = generalesTable.row($(this).closest('tr')).data() == undefined ? generalesTable.row($(this).closest('tr.child').prev()).data() : generalesTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "? Si está firmado perderá la firma.")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {expedientID: expedientID, nameFile: rowClick[4]},
                type: 'POST',
                async: false
            });

            generalesTable.ajax.reload();
        }
    });

    // Documentación adjunta
    var attachedTable = $('#attached-table').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listA.php?expedient=" + expedientID,
        "responsive": false,
        "paging": false,
        "pageLength": 50,
        "lengthChange": true,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        "scrollY":  '350px',
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "className": "id",
                "targets": [0],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
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
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    if(row[4] != ''){
                        return '<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/' + expedientID + '/docs/' + row[3] + '"  title="Ver"><i class="fa fa-eye" aria-hidden="true"></i></a>';
                    }else{
                        return '<i class="fa fa-eye" aria-hidden="true"></i>';
                    }
                }
            },
            {
                "className": "details-control centered sendEmail",
                "targets": 5,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[4] != ''){
                        return '<a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo"><i class="fa fa-envelope" aria-hidden="true"></i></a>';
                    }else{
                        return '<i class="fa fa-envelope c-grey" aria-hidden="true"></i>';
                    }
                }
            },
            {
                "className": "centered delete",
                "targets": 6,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    return "<a href='javascript:void(0)' class='btn-delete'  title='Borrar'><i class='fa fa-trash' aria-hidden='true'></i></a>";
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    attachedTable.on('click', '.btn-send-email', function () {
        $('.btn-send-email').tooltip('hide');

        var rowClick = attachedTable.row($(this).closest('tr')).data() == undefined ? attachedTable.row($(this).closest('tr.child').prev()).data() : attachedTable.row($(this).closest('tr')).data()
        var fileNameComplete = rowClick[4].split('/');
        fileNameComplete = fileNameComplete[fileNameComplete.length-1];

        rowClickHistoryDoc = [expedientID, rowClick[3], rowClick[3], fileNameComplete];

        drawHistoryDocsSentTable(expedientID, rowClick[3], rowClick[3], fileNameComplete);
    });

    /* ******************************** Borrar Doc ******************************** */
    attachedTable.on('click', '.btn-delete', function () {
        $('.btn-delete').tooltip('hide');

        var rowClick = attachedTable.row($(this).closest('tr')).data() == undefined ? attachedTable.row($(this).closest('tr.child').prev()).data() : attachedTable.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClick[3] + "?")){
            $.ajax({
                url: uri + "core/expedients/docs/delete.php",
                data: {opt: 'upload', expedientID: expedientID, nameFile: rowClick[4], docID: rowClick[0]},
                type: 'POST',
                async: false
            });
            attachedTable.ajax.reload();
        }
    });

    /* ******************************** Upload File ******************************** */
    $('#uploadFile').click(function(){
        var inputFile = document.getElementById('fileAttachDoc');
        var files = inputFile.files;
        var flag = true
        var validate = 0
        if(files.length == 0){
            $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> No has seleccionado ningún archivo</div>');
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
            return false
        }
        var time = moment().format('X')
        for(var i = 0; i < files.length; i++){
            time++
            var docName = files[i].name

            var extension = docName.split('.')[docName.split('.').length - 1]
            docName = docName.split('.').slice(0, -1).join('.')
            docName = docName + '_' + time + '.' + extension
            var flagUp = true
            switch(extension.toLowerCase()){
                case 'rar':
                case 'zip':
                case 'mp3':
                case 'doc':
                case 'docx':
                case 'dot':
                case 'odt':
                case 'pdf':
                case 'txt':
                case 'xls':
                case 'xlsx':
                case 'ppt':
                case 'pptx':
                case 'csv':
                case 'svg':
                case 'bmp':
                case 'gif':
                case 'jpeg':
                case 'jpg':
                case 'png':
                case 'psd':
                case 'tiff':
                case 'avi':
                case 'flv':
                case 'mkv':
                case 'mpeg':
                break
                default:
                    flag = false
                    flagUp = false
                break
            }

            if(flagUp){
                var data = new FormData();
                data.append('archivo', files[i]);
                data.append('expedientID', expedientID);
                data.append('docName', docName);
                $.ajax({
                    url: uri + "core/expedients/docs/upload.php",
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
                                    $.ajax({
                                        url: uri + "core/expedients/docs/create.php",
                                        data: {opt: "upload", expedientID: expedientID, userID: getUserID(), nameFile: docName, file: uri + 'resources/files/expedients/'+ expedientID + '/docs/' + docName},
                                        type: 'POST',
                                        async: false
                                    });
                                break
                                case false:
                                    validate++
                                break
                                case 'extension':
                                    flag = false
                                    validate++
                                break
                                default:
                                    validate++
                                break
                            }
                        }catch(e){
                            validate++
                        }
                    },
                    error: function(){
                        validate++
                    }
                })
            }
        }

        if(flag){
            if(validate == 0){
                $('#fileAttachDoc').val('')
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Los archivos se han subido correctamente.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        }else{
            if(validate == 0){
                $('#fileAttachDoc').val('')
                $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos archivos non se han subido porque tienen un formato de archivo no permitido.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }else{
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Algunos archivos non se han subido porque tienen un formato de archivo no permitido.</div>');
    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        }
                
        attachedTable.ajax.reload();
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
                        $('input').attr('disabled', true)
                        $('#docAttachSection').remove()

                        $('.fa.fa-envelope').addClass('c-grey')
                        $('.fa.fa-envelope').closest('a').removeClass('btn-send-email')

                        $('.fa.fa-pencil-square-o').addClass('c-grey')
                        $('.fa.fa-pencil-square-o').closest('div').removeClass('signDocument')

                        $('.fa.fa-trash').addClass('c-grey')
                        $('.fa.fa-trash').closest('a').removeClass('btn-delete')

                        $('.fa.fa-pencil').addClass('c-grey')
                        $('.fa.fa-pencil').closest('a').removeClass('btn-new')

                        $('.fa.fa-plus-circle').addClass('c-grey')
                        $('.fa.fa-plus-circle').closest('a').removeClass('btn-new')

                        $('tbody .linkEdit a').attr("style", "cursor:initial")
                        $('tbody .fa-pencil-square-o').attr("style", "cursor:initial")
                        $('tbody .linkEdit a').click(function(e) {
                            e.preventDefault();
                        });

                        $('#modal-new-doc').remove()
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
    }, 750)

    // Documento - Carta de flores
    $('#setMoreCoronas').click(function(){
        var i = 0
        $('#carta-flores-modal #moreCoronas input').each(function(){
            i++
        })
        $('#carta-flores-modal #moreCoronas').append('<input type="text" class="form-control floresInputModalBottom" id="coronas' + i + '">')
    })

    $('#setMoreCentros').click(function(){
        var i = 0
        $('#carta-flores-modal #moreCentros input').each(function(){
            i++
        })
        $('#carta-flores-modal #moreCentros').append('<input type="text" class="form-control floresInputModalBottom" id="centros' + i + '">')
    })

    $('#setMoreRamos').click(function(){
        var i = 0
        $('#carta-flores-modal #moreRamos input').each(function(){
            i++
        })
        $('#carta-flores-modal #moreRamos').append('<input type="text" class="form-control floresInputModalBottom" id="ramos' + i + '">')
    })

    $('#carta-flores-modal #goCartaFlores').click(function(e){
        var attention = $('#carta-flores-modal #attention').val()
        var date = $('#carta-flores-modal #date').val()
        var deceased = $('#carta-flores-modal #deceased').val()
        var coronas = new Array
        var centros = new Array
        var ramos = new Array

        $('#carta-flores-modal #moreCoronas input').each(function(){
            coronas.push($(this).val())
        })

        $('#carta-flores-modal #moreCentros input').each(function(){
            centros.push($(this).val())
        })

        $('#carta-flores-modal #moreRamos input').each(function(){
            ramos.push($(this).val())
        })

        var data = {
            attention: attention,
            date: date,
            deceased: deceased,
            coronas: coronas,
            centros: centros,
            ramos: ramos
        }
        
        $.ajax({
            url: uri + 'core/expedients/docs/functions.php',
            method: 'POST',
            data: {
                type: 'setCartaFlores',
                expedient: expedientID,
                data: data
            },
            dataType: 'json',
            async: false,
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })

        $(this).submit()
    })

    // Documento - Exhumación judicial
    $('#exhumacion-judicial-modal #goJudicial').click(function(e){
        $(this).submit()
    })

    // Documento - Precintado féretro
    $('#precintado-feretro-modal #goFeretro').click(function(e){
        $(this).submit()
    })

    $('#acta-preparacion-modal #pickPerson').change(function(){
        if($(this).val() == 'null'){
            $("#otherAgent").removeClass('hide')
        }else{
            $("#otherAgent").addClass('hide')
            $("#otherPickPerson").val('')
        }
    })

    var expedientData = getExpedient(expedientID)
    expedientStatus = expedientData.status;

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

    //Sets the resposible value
    if(expedientData.responsibleUser == "" || expedientData.responsibleUser == null){
        $('#acta-preparacion-modal #pickPerson').val('' + expedientData.responsibleUser + '').trigger('change')
        $('#acta-preparacion-modal #otherPickPerson').val('' + expedientData.responsibleName + '')
    }else{
        $('#acta-preparacion-modal #pickPerson').val('' + expedientData.responsibleUserNamePreparacion + '').trigger('change')
    }

    //BLOCK EXPEDIENT IF IT IS FINISHED
    setTimeout(function(){
        if(parseInt(expedientStatus) == 5){
            
            $('#saveForm').attr('disabled', true)

            $('.fa.fa-envelope').addClass('c-grey')
            $('.fa.fa-envelope').closest('a').removeClass('btn-send-email')

            $('.fa.fa-pencil-square-o').addClass('c-grey')
            $('.fa.fa-pencil-square-o').closest('div').removeClass('signDocument')

            $('.fa.fa-trash').addClass('c-grey')
            $('.fa.fa-trash').closest('a').removeClass('btn-delete')

            $('.fa.fa-pencil').addClass('c-grey')
            $('.fa.fa-pencil').closest('a').removeClass('btn-new')

            $('.fa.fa-plus-circle').addClass('c-grey')
            $('.fa.fa-plus-circle').closest('a').removeClass('btn-new')

            $(".close").attr("disabled", false)
            $('#expedientFinished').removeClass('hide')

            if(userType == 1){
                $("#reactived").attr('disabled', false)
                $("#reactived").removeClass('hide')
            }else{
                $("#expedientFinishedText").empty();
                $("#expedientFinishedText").text(' Solicite a un usuario administrador que lo reactive (su estado pasará a facturado) para realizar modificaciones.')
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

    $('#modal-sign').on('hidden.bs.modal', function () {
        $("#modal-sign .phoneNotificationError").addClass('hide');
        $("#modal-sign #phoneNotification").val('');
        $("#modal-sign #phoneNotification").removeClass('validateError')
    })

    // Modal history docs and sent a doc
    $('#goHistoryDocsSent').click(function(){
        $("#sendDocSection").addClass('hide');
        $("#historyDocsSentSection").removeClass('hide');

        $("#modal-send-docs-emails #send").addClass('hide');
    })

    $('#goSendDoc').click(function(){
        $("#historyDocsSentSection").addClass('hide');
        $("#sendDocSection").removeClass('hide');

        $("#modal-send-docs-emails #send").removeClass('hide');

        setTimeout(() => {
            if($('#modal-send-docs-emails #assistants').val() == null){
                $('#modal-send-docs-emails #assistants').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #bellringers').val() == null){
                $('#modal-send-docs-emails #bellringers').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #cemeteries').val() == null){
                $('#modal-send-docs-emails #cemeteries').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #clients').val() == null){
                $('#modal-send-docs-emails #clients').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #choirs').val() == null){
                $('#modal-send-docs-emails #choirs').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #priests').val() == null){
                $('#modal-send-docs-emails #priests').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #gravediggers').val() == null){
                $('#modal-send-docs-emails #gravediggers').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #churches').val() == null){
                $('#modal-send-docs-emails #churches').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #doctors').val() == null){
                $('#modal-send-docs-emails #doctors').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #staff').val() == null){
                $('#modal-send-docs-emails #staff').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #carriers').val() == null){
                $('#modal-send-docs-emails #carriers').val(null).trigger('change');
            }

            if($('#modal-send-docs-emails #suppliers').val() == null){
                $('#modal-send-docs-emails #suppliers').val(null).trigger('change');
            }
        }, 200);
    })

    $('#modal-send-docs-emails #send').click(function(){
        $('#modal-send-docs-emails #warning-message').empty();
        $('#modal-send-docs-emails #send').attr("disabled", true);

        var validate = 0;
        if(
            isEmpty($('#modal-send-docs-emails #assistants'))
            && isEmpty($('#modal-send-docs-emails #bellringers'))
            && isEmpty($('#modal-send-docs-emails #cemeteries'))
            && isEmpty($('#modal-send-docs-emails #clients'))
            && isEmpty($('#modal-send-docs-emails #choirs'))
            && isEmpty($('#modal-send-docs-emails #priests'))
            && isEmpty($('#modal-send-docs-emails #gravediggers'))
            && isEmpty($('#modal-send-docs-emails #churches'))
            && isEmpty($('#modal-send-docs-emails #doctors'))
            && isEmpty($('#modal-send-docs-emails #staff'))
            && isEmpty($('#modal-send-docs-emails #carriers'))
            && isEmpty($('#modal-send-docs-emails #suppliers'))
            && $('#modal-send-docs-emails #otherEmail').val() == ''
        ){
            validate++;
        }

        // Checks other email
        if($('#modal-send-docs-emails #otherEmail').val() != ''){
            if(!isEmailArray($('#modal-send-docs-emails #otherEmail'))){
                validate++
            }
        }

        if(validate > 0){
            $('#modal-send-docs-emails #warning-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Es necesario indicar algún destinatario.</div>')
            $("#modal-send-docs-emails").animate({scrollTop: $('#modal-send-docs-emails').offset().top}, 200);
            $('#modal-send-docs-emails #send').attr("disabled", false);
            setTimeout(function(){
                $('#modal-send-docs-emails #warning-message').empty()
            }, 3500)
            return false;
        }

        var assistants = $('#assistants').val();
        var bellringers = $('#bellringers').val();
        var cemeteries = $('#cemeteries').val();
        var clients = $('#clients').val();
        var choirs = $('#choirs').val();
        var priests = $('#priests').val();
        var gravediggers = $('#gravediggers').val();
        var churches = $('#churches').val();
        var doctors = $('#doctors').val();
        var staff = $('#staff').val();
        var carriers = $('#carriers').val();
        var suppliers = $('#suppliers').val();
        var othersEmails = $('#modal-send-docs-emails #otherEmail').val().split(";");

        $.ajax({
            url: uri + 'core/expedients/docs/sendExpedientDocEmail.php',
            method: 'POST',
            data: {
                expedient : rowClickHistoryDoc[0],
                doc_name : rowClickHistoryDoc[1],
                doc : rowClickHistoryDoc[2],
                fileName : rowClickHistoryDoc[3],
                assistants: assistants,
                bellringers: bellringers,
                cemeteries: cemeteries,
                clients: clients,
                choirs: choirs,
                priests: priests,
                gravediggers: gravediggers,
                churches: churches,
                doctors: doctors,
                staff: staff,
                carriers: carriers,
                suppliers: suppliers,
                othersEmails: othersEmails
            },
            async: true,
            success: function(data){
                data = $.parseJSON(data)

                if(data === true){
                    $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>El documento ha sido procesado para su envío.</div>');
                }else{
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+data+'</div>');
                }

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)

                $('#modal-send-docs-emails').modal("hide");
            },
            error: function(){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        })
    })

    $('#modal-send-docs-emails').on('hidden.bs.modal', function () {
        $('#modal-send-docs-emails #assistants').val(null).trigger('change');
        $('#modal-send-docs-emails #bellringers').val(null).trigger('change');
        $('#modal-send-docs-emails #cemeteries').val(null).trigger('change');
        $('#modal-send-docs-emails #clients').val(null).trigger('change');
        $('#modal-send-docs-emails #choirs').val(null).trigger('change');
        $('#modal-send-docs-emails #priests').val(null).trigger('change');
        $('#modal-send-docs-emails #gravediggers').val(null).trigger('change');
        $('#modal-send-docs-emails #churches').val(null).trigger('change');
        $('#modal-send-docs-emails #doctors').val(null).trigger('change');
        $('#modal-send-docs-emails #staff').val(null).trigger('change');
        $('#modal-send-docs-emails #carriers').val(null).trigger('change');
        $('#modal-send-docs-emails #suppliers').val(null).trigger('change');
        $('#modal-send-docs-emails #otherEmail').val('');

        $("#modal-send-docs-emails #send").addClass('hide');
        $('#modal-send-docs-emails #send').attr("disabled", false);

        $("#goHistoryDocsSent").click();
    })

    $('#modal-send-docs-users-emails').on('hidden.bs.modal', function () {
        $("#modal-send-docs-emails").modal("show");
    })
})