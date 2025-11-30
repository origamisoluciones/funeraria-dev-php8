/**  @var {string} expedientIdUrl Plan hired */
var expedientIdUrl = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

/**  @var {string} planHired Plan hired */
var planHired = null;

/**  @var {boolean} hasViaFirmaKeys If company has via firma api keys */
var hasViaFirmaKeys = false;

/**  @var {int} company Empresa */
var company = null;

/**  @var {int} expedientStatus Store expedient status */
var expedientStatus = null;

/**  @var {array} historyDocsSent Store history docs sent data */
var historyDocsSent = null;

/**  @var {array} rowClickHistoryDoc Store click history docs sent data */
var rowClickHistoryDoc = null;

/**  @var {array} historyDocsEmailsSent Store history docs emails sent data */
var historyDocsEmailsSent = null;

/**  @var {array} allCategories Stores documents all categories */
var allCategories = new Array;

/**  @var {array} customDocuments Stores custom documents table */
var customDocuments = new Array;

/**  @var {array} rowClickCustomDocuments Stores custom documents table */
var rowClickCustomDocuments = null;

/**  @var {array} customDocumentsIndex Stores custom documents index */
var customDocumentsIndex = 0;

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

/**
 * Devuelve el plan contratado por la compañía
 */
function getPlanHired(){
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
function getViaFirmaApiKeys(){
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

/** 
 * Select2 functions for remote data 
 */
function formatData(data){
    var data = '<div id="'+data.id+'">'+data.text+'</div>';
    return data;
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
 * Checks if a document is signed
 * 
 * @param {string} docName Document name
 * @returns 
 */
function isPDFSigned(docName){
    $.ajax({
        url: uri + "core/tools/firmasPdf/firmasController.php",
        data: {type: "checkPDFsigned", expedientID: expedientIdUrl, docName:docName},           
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
 * Devuelve información sobre el expediente
 */
function getExpedient() {
    var expedient;
    // DATOS DEL SOLICITANTE - PROVINCIAS
    $.ajax({
        url : uri+"core/expedients/expedient/read.php",
        data : {
            ID: expedientIdUrl
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
 * @param {string} docName Nombre en clave del documento
 */
function drawHistoryDocsSentTable(docName){

    $("#modal-send-docs-emails #title").text(docName);

    if(historyDocsSent != null){
        historyDocsSent.clear();
        historyDocsSent.destroy();
        $('.docsSentSection').empty();
        $(".docsSentSection").append('<table id="docs-sent-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>')
    }

    historyDocsSent = $('#modal-send-docs-emails #docs-sent-table').DataTable({
        "ajax": uri + "core/expedients/docs/listHistoryDocsSent.php?expedient=" + expedientIdUrl + "&docName=" + docName,
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

        window.open(uri + 'descargar-archivo?file=expedients/' + rowClickHistoryDoc[0] + '/documentsEditor/history_sent/' + rowClick[0] + '/'+rowClickHistoryDoc[2], '_blank')
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
 * Gets all categories
 */
function getAllCategories(){
    $.ajax({
        url: uri + "core/documentsEditor/getAllCategories.php",
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            allCategories = data;
        }
    });
}

/**
 * Prints all categories
 */
function printAllCategories(){
    if(allCategories.length == 0){
        $('#allCategoriesSection').append('<div class="alert alert-info alert-dismissible fade in" role="alert">Todavía no has creado ninguna plantilla de documentación personalizada. Para ello, debes hacerlo desde la sección <a href="' + uri + 'configuracion/editor-documentacion/categorias"><strong>Configuración -> Documentos personalizados</strong></a></div>');
        return false;
    }

    $('#allCategoriesSection').append('<ul class="list-unstyled"></ul>');

    $.each(allCategories, function(index, elem){
        var disabled = parseInt(expedientStatus) == 5 ? true : false;
        var classDisabled = '';
        if(disabled){
            classDisabled = 'class="card-disabled"';
        }

        $('#allCategoriesSection .list-unstyled').append(
            '   <li class="col-xs-3">' +
            '       <div ' + classDisabled + ' id="category-' + elem.ID + '" category-id="' + elem.ID + '" category-name="' + elem.name + '">' +
            '           <a class="category-card-content">' +
            '               <i class="fa fa-file-text-o" aria-hidden="true"></i>' +
            '               <span>' + elem.name + '</span>' +
            '           </a>' +
            '       </div>' +
            '   </li>'
        );

        if(!disabled){
            $('#category-' + elem.ID).click(function(){
                var disabled = $(this).hasClass('card-disabled');
                var categoryId = $(this).attr('category-id');
                var categoryName = $(this).attr('category-name');
                if(!disabled){
                    customDocuments.push({
                        'id': categoryId,
                        'name': categoryName,
                        'docs': null
                    })
    
                    var item = {
                        id: categoryId,
                        name: categoryName
                    }
                    drawDocumentsSection(item);
    
                    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                }
            })
        }
    })
}

/**
 * Prints docs
 */
function printDocs(){
    // Gets categories
    $.ajax({
        url: uri + "core/documentsEditor/getCategoriesForExpedient.php",
        data: {
            expedient: expedientIdUrl
        },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            categories = data;
        }
    });

    customDocuments = new Array;
    
    $.each(categories, function(index, elem){
        customDocuments.push({
            'id': elem.ID,
            'name': elem.name,
            'docs': null
        })
    })

    $('#documentsTables').empty();

    // Draws documents by category
    $.each(customDocuments, function(index, elem){
        drawDocumentsSection(elem);
    })
}

/**
 * Draws documents section
 * 
 * @param {array} elem Elem
 */
function drawDocumentsSection(elem){
    // Section
    if(!$('#allCategoriesSection #category-' + elem.id).hasClass('card-disabled')){
        $('#allCategoriesSection #category-' + elem.id).addClass('card-disabled');
    }
    var addDocSection = '';
    if(parseInt(expedientStatus) != 5){
        addDocSection =
        '   <div class="docAttachSection">' +
        '       <div class="row" style="margin-left: 1em;">' +
        '           <div class="col-xs-6" style="display: flex;">' +
        '               <label for="customDocuments' + elem.id + '">Selecciona documento para añadir</label>' +
        '               <div class="input-group" style="margin-left: 1em;">' +
        '                   <select class="form-control" name="customDocuments' + elem.id + '" id="customDocuments' + elem.id + '" category="' + elem.id + '" custom-document-index="' + customDocumentsIndex + '"></select>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>'
        ;
    }
    $('#documentsTables').append(
        '   <fieldset class="cservice-page">' +
        '       <legend class="legendBottom"><span class="label label-primary labelLgExp">' + elem.name + '</span></legend>' +
        '       <div class="panel box box-primary">' +
        '           <div class="box-header">' +
        '               <h4 class="box-title">' +
        '                   <a data-toggle="collapse" data-parent="#customDocumentsSection' + customDocumentsIndex + '" href="#customDocumentsSection' + customDocumentsIndex + '" aria-expanded="true"></a>' +
        '               </h4>' +
        '           </div>' +
        '           <div id="customDocumentsSection' + customDocumentsIndex + '" class="box-collapse collapse in" aria-expanded="true">' +
        '               <div class="box-body">' +
                            addDocSection +
        '                   <div class="table-responsive clearfix" style="margin-bottom: 10px">' +
        '                       <table id="custom-documents-table' + customDocumentsIndex + '" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>' +
        '                   </div>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </fieldset>'
    )

    drawDocumentsTable(elem);
    customDocumentsIndex++;
}

/**
 * Draws documents table
 * 
 * @param {array} elem Elem
 */
function drawDocumentsTable(elem){
    // Docs select
    var filtered = allCategories.filter(function(item){
        return item.ID == elem.id;
    })
    var documents = filtered.length == 0 ? new Array : filtered[0].documents;
    $('#customDocuments' + elem.id).select2({
        containerCssClass: 'select2-document',
        language: langSelect2,
        placeholder: 'Seleccione un documento',
        data: documents
    })
    $('#customDocuments' + elem.id).val(null).trigger('change');
    $('#customDocuments' + elem.id).change(function(){
        var document = $(this).val();
        var category = $(this).attr('category');
        var index = $(this).attr('custom-document-index');
        if(document != null){
            $.ajax({
                url : uri + "core/documentsEditor/addToExpedient.php",
                data : {
                    expedient: expedientIdUrl,
                    document: document
                },
                type : 'POST',
                dataType: 'json',
                async : false,
                success : function(data){
                    if(data == 'already_added'){
                        $('#customDocuments' + category).val(null).trigger('change');

                        $('#block-message').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El documento ya ha sido añadido</div>');

                        setTimeout(function(){
                            $('#block-message').empty()
                        }, 5000)
                    }else{
                        customDocuments[index].docs.ajax.reload(null, false);
                        $('#customDocuments' + category).val(null).trigger('change');
                    }
                }
            })
        }
    })

    var index = customDocumentsIndex;

    // Table
    customDocuments[customDocumentsIndex].docs = $('#custom-documents-table' + customDocumentsIndex).DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": uri + "core/expedients/docs/listCustom.php?expedient=" + expedientIdUrl + "&category=" + elem.id,
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
        "fixedHeader": {
            header: true,
            footer: true
        },
        "columns": [
            {"title": "#"},
            {"title": "# documento conf"},
            {"title": "Usuario"},
            {"title": "Fecha"},
            {"title": "Documento"},
            {"title": "Ver"},
            {"title": "Editar"},
            {"title": "Firmar"},
            {"title": "Enviar"},
            {"title": "Eliminar"}
        ],
        "columnDefs": [ 
            {
                "targets": [0, 1],
                "searchable": false,
                "visible": false
            },
            {
                "className" : "user",
                "targets" : 2,
                orderable: false
            },
            {
                "className" : "date",
                "targets" : 3,
                orderable: false,
                "render" : function(data, type, row){
                    return data == null ? "-" : moment(data, 'X').format("DD/MM/YYYY")
                }
            },
            {
                "targets" : 4,
                orderable: false
            },
            {
                "className": "centered linkView",
                "targets": 5,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render": function(data, type, row){
                    if(row[5]){
                        return '<a target="_blank" href="' + uri + 'descargar-archivo?file=expedients/' + expedientIdUrl + '/documentsEditor/' + row[0] + '/files/documento.pdf"  title="Ver"><i class="fa fa-eye"  style="cursor:pointer" aria-hidden="true"></i></a>';
                    }else{
                        return '<i class="fa fa-eye c-grey" style="cursor:pointer" aria-hidden="true"></i>';
                    }
                }
            },
            {
                "className": "details-control centered linkEdit",
                "targets": 6,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    if(row[4]){
                        return '<div id="' + row[5] + '"><a class="btn-edit" custom-document-index="' + index + '"><i class="fa fa-pencil" style="cursor:pointer" aria-hidden="true" title="Editar"></i></a></div>';
                    }else{
                        return '<div id="' + row[5] + '"><a class="btn-new" custom-document-index="' + index + '"><i class="fa fa-plus-circle" style="cursor:pointer" aria-hidden="true" title="Nuevo"></i></a></div>';
                    }
                }
            },
            {
                "className": "details-control centered",
                "targets": 7,
                "width" : '5%',
                // visible: false,
                "orderable": false,
                "searchable": false,
                "render" : function(data, type, row){
                    if(planHired != 'plan_basic'){
                        if(hasViaFirmaKeys){
                            if(row[5]){                        
                                return '<div class="signDocument" custom-document-index="' + index + '"><i class="fa fa-pencil-square-o" style="cursor:pointer" title="Firmar" aria-hidden="true"></i></div>';
                            }else{
                                return '<div class="c-grey"><i class="fa fa-pencil-square-o" style="cursor:pointer" aria-hidden="true"></i></div>';
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
                "className": "details-control centered sendEmail cursor-pointer",
                "targets": 8,
                "searchable": false,
                "orderable": false,
                "width" : '5%',
                "render" : function(data, type, row){
                    if(row[5]){
                        return '<a href="javascript:void(0)" class="btn-send-email" title="Enviar por correo" custom-document-index="' + index + '"><i class="fa fa-envelope" aria-hidden="true"></i></a>';
                    }else{
                        return '<i class="fa fa-envelope c-grey" aria-hidden="true"></i>';
                    }
                }
            },
            {
                "className": "details-control centered linkDelete",
                "targets": 9,
                "width" : '5%',
                "orderable": false,
                "searchable": false,
                "render" : function(){
                    return '<a href="javascript:void(0)" class="btn-delete" title="Borrar" custom-document-index="' + index + '"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                }
            }
        ],
        "dom": 'Brt<"bottom bottom-2"lp><"clear">',
        "order": [[3, 'asc']]
    });

    customDocuments[customDocumentsIndex].docs.on('click', '.btn-new', function(){
        var index = $(this).attr('custom-document-index');
        $('.btn-new').tooltip('hide');

        rowClickCustomDocuments = customDocuments[index].docs.row($(this).closest('tr')).data() == undefined ? customDocuments[index].docs.row($(this).closest('tr.child').prev()).data() : customDocuments[index].docs.row($(this).closest('tr')).data()

        generateCustomDoc(rowClickCustomDocuments[0], rowClickCustomDocuments[1]);
    });

    customDocuments[customDocumentsIndex].docs.on('click', '.btn-edit', function(){
        var index = $(this).attr('custom-document-index');
        $('.btn-edit').tooltip('hide');

        rowClickCustomDocuments = customDocuments[index].docs.row($(this).closest('tr')).data() == undefined ? customDocuments[index].docs.row($(this).closest('tr.child').prev()).data() : customDocuments[index].docs.row($(this).closest('tr')).data()

        if(rowClickCustomDocuments[6] == '1'){
            if(confirm('El documento ya ha sido firmado. ¿Estás seguro de que deseas editarlo? Esta acción eliminará la firma actual del documento en el caso de que lo guardes, por lo que tendrás que volver a firmarlo.')){
                window.location.href = uri + 'expediente/editor-documento/' + expedientIdUrl + '-' + rowClickCustomDocuments[0];
            }
        }else{
            window.location.href = uri + 'expediente/editor-documento/' + expedientIdUrl + '-' + rowClickCustomDocuments[0];
        }
    });

    customDocuments[customDocumentsIndex].docs.on('click', '.btn-delete', function(){
        var index = $(this).attr('custom-document-index');
        $('.btn-delete').tooltip('hide');

        rowClickCustomDocuments = customDocuments[index].docs.row($(this).closest('tr')).data() == undefined ? customDocuments[index].docs.row($(this).closest('tr.child').prev()).data() : customDocuments[index].docs.row($(this).closest('tr')).data()

        if(confirm("¿Está seguro de que quiere borrar el documento: " + rowClickCustomDocuments[4] + " creado por el usuario " + rowClickCustomDocuments[2] + " con fecha " + moment(rowClickCustomDocuments[3], 'X').format('DD/MM/YYYY') + "?")){
            $.ajax({
                url: uri + "core/expedients/docs/deleteCustom.php",
                data: {
                    ID: rowClickCustomDocuments[0],
                    expedientID: expedientIdUrl,
                    nameFile: rowClickCustomDocuments[4]
                },
                type: 'POST',
                async: false
            });

            customDocuments[index].docs.ajax.reload(null, false);
        }
    });

    customDocuments[customDocumentsIndex].docs.on('click', '.signDocument', function(){
        var index = $(this).attr('custom-document-index');
        $('.signDocument').tooltip('hide');

        rowClickCustomDocuments = customDocuments[index].docs.row($(this).closest('tr')).data() == undefined ? customDocuments[index].docs.row($(this).closest('tr.child').prev()).data() : customDocuments[index].docs.row($(this).closest('tr')).data();

        $('#docname').val(rowClickCustomDocuments[4]);
        $('#docpath').val(uri + 'resources/files/' + COMPANY + '/expedients/' + expedientIdUrl + '/documentsEditor/' + rowClickCustomDocuments[0] + '/files/documento.pdf');

        $('#modal-sign').modal('show');
    })

    customDocuments[customDocumentsIndex].docs.on('click', '.btn-send-email', function(){
        var index = $(this).attr('custom-document-index');
        $('.btn-send-email').tooltip('hide');

        rowClickCustomDocuments = customDocuments[index].docs.row($(this).closest('tr')).data() == undefined ? customDocuments[index].docs.row($(this).closest('tr.child').prev()).data() : customDocuments[index].docs.row($(this).closest('tr')).data()
        rowClickHistoryDoc = [expedientIdUrl, rowClickCustomDocuments[4], rowClickCustomDocuments[4] + '.pdf', rowClickCustomDocuments[0]];

        drawHistoryDocsSentTable(rowClickCustomDocuments[4]);
    });
}

$(function(){
    getPlanHired();
    getViaFirmaApiKeys();

    // Carga de datos del expediente
    if(isExpedient(expedientIdUrl)){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500);
        return
    }
    setLogRead(expedientIdUrl)

    company = getCompany()

    // TOOLBAR BOTTOM
    $('.footer-static-bottom .pull-left').before('<select id="getAllExpedients" name="getAllExpedients"></select>');
    $('.footer-static-bottom .pull-left').before('<button type="button" id="goToExpedient" class="btn btn-success">Cambiar</button>')

    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="exitExpedient" class="btn btn-default"><i class="fa fa-times-circle c-lile" aria-hidden="true"></i> Salir</button>')
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
    
    changeSpaceFooter()

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
    $('#exitExpedient').click(function(){
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
                // window.open(uri + 'expediente/documentacion/' + expid, '_blank');
                window.location.href = uri + 'expediente/documentacion/' + expid
            }else{
                // window.open(uri + 'expediente/documentacion-tpv/' + expid, '_blank');
                window.location.href = uri + 'expediente/documentacion-tpv/' + expid
            }
        }
    })
    
    var expedient;
    $.ajax({
        url: uri+"core/expedients/logs/functions.php",
        data: {expedient: expedientIdUrl, type: 'getExpedient'},
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
                    "callbackURL" : ROOT + "core/tools/firmasPdf/pdfSignedDownloadEditor" + company + ".php"
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
                                type: "savePDFSignedEditor",
                                expedient: expedientIdUrl,
                                doc: rowClickCustomDocuments[0],
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
                    "callbackURL" : ROOT + "core/tools/firmasPdf/pdfSignedDownloadEditor" + company + ".php"
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
                                type: "savePDFSignedEditor",
                                expedient: expedientIdUrl,
                                doc: rowClickCustomDocuments[0],
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
                        $('.docAttachSection').remove()

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
    }, 750)

    var expedientData = getExpedient()
    expedientStatus = expedientData.status;

    //BLOCK EXPEDIENT IF IT IS FINISHED
    setTimeout(function(){
        if(parseInt(expedientStatus) == 5){
            
            $('#customDocuments').attr('disabled', true);
            $('#saveForm').attr('disabled', true)

            $('.fa.fa-envelope').addClass('c-grey')
            $('.fa.fa-envelope').closest('a').removeClass('btn-send-email')

            $('.fa.fa-pencil-square-o').addClass('c-grey')
            $('.fa.fa-pencil-square-o').closest('div').removeClass('signDocument')

            $('.fa.fa-trash').addClass('c-grey')
            $('.fa.fa-trash').closest('a').removeClass('btn-delete')

            $('.fa.fa-pencil').addClass('c-grey')
            $('.fa.fa-pencil').closest('a').removeClass('btn-edit')

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
                    expedientID: expedientIdUrl
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
                expedientID: expedientIdUrl
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
            url: uri + 'core/expedients/docs/sendExpedientDocEmailEditor.php',
            method: 'POST',
            data: {
                expedient : rowClickHistoryDoc[0],
                doc_name : rowClickHistoryDoc[1],
                doc : rowClickHistoryDoc[1],
                fileName : rowClickHistoryDoc[2],
                docEditorId : rowClickHistoryDoc[3],
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

    // Categories
    getAllCategories();
    printAllCategories();
    printDocs();
})