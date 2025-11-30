/**  @var {string} planHired Plan hired */
var planHired = null;

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

$(function(){

    getPlanHired();

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

    $('#goToExpedient').click(function() {   
        expid = $('#getAllExpedients').val();
        if(expid != null){            
            if($('#getAllExpedients').select2('data')[0].tpv == '0'){
                window.location.href = uri + 'expediente/documentacion/' + expid;
            }else{
                window.location.href = uri + 'expediente/documentacion-tpv/' + expid;
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
            $('#deceasedName').val(' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
            $('.deceased').text(' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
            $('#numberExpedient').val(expedient.number);
            $('#numberHeader').text(expedient.number);
            $('.numExp').text(expedient.number);
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

    /* ******************************** Send Doc ******************************** */
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
    }, 250)

    var expedientData = getExpedient(expedientID)
    expedientStatus = expedientData.status;

    //BLOCK EXPEDIENT IF IT IS FINISHED
    setTimeout(function(){
        if(parseInt(expedientStatus) == 5){
            
            $('#saveForm').attr('disabled', true)
            $(".close").attr("disabled", false)

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
})