/** @var {int} documentID Document ID */
var documentID = null;

/** @var {int} expedientID Expedient ID */
var expedientID = null;

/** @var {int} loadFlag Document info */
var loadFlag = false;

/** @var {int} documentInfo Document info */
var documentInfo = null;

/** @var {int} documentSources Document sources */
var documentSources = null;

/** @var {int} expedientDataSheetInfo Expedient data sheet info */
var expedientDataSheetInfo = null;

/** @var {boolean} locked Bandera que controla si el editor ya ha sido abierto o es la primera vez que se abre para este documento */
var locked = false;

/** @var {boolean} saveClick Bandera que controla si se ha pulsado el botón de guardar */
var saveClick = false;

/** @var {int} pageNumber Pages number */
var pageNumber = 0;

/** @var {boolean} currentPage Bandera que controla si se está editando texto */
var currentPage = 0;

/** @var {int} width Ancho del folio */
var width = 0;

/** @var {int} height Alto del folio */
var height = 0;

/** @var {array} stages Escenarios */
var stages = new Array;

/** @var {object} layers Capas */
var layers = new Array;

/** @var {object} gridLayers Rejillas */
var gridLayers = new Array;

/** @var {int} blockSnapSize Tamaño de la rejilla */
var blockSnapSize = 15;

/** @var {object} selected Elemento seleccionado */
var selected = null;

/** @var {int} addTextIndex Índice para el texto añadido */
var addTextIndex = 0;

/** @var {int} addSignIndex Índice para el texto tipo firma añadido */
var addSignIndex = 0;

/** @var {boolean} changingText Bandera que controla si se está editando texto */
var changingText = false;

/** @var {int} startX Posición x inicial */
var startX = 0;

/** @var {int} startY Posición y inicial */
var startY = 0;

/** @var {object} stamp Stamp */
var stamp = moment().format('X');

/** @var {int} saveState Último estado de guardado */
var saveState = 0;

/** @var {array} states Estados */
var states = new Array;

/** @var {int} currentState Estado actual */
var currentState = 0;

/** @var {boolean} saved Estado de guardado */
var saved = true;

/** @var {int} maxZIndex Z-index más alto (posicionamiento por capas) */
var maxZIndex = new Array;
maxZIndex.push(0);

/** @var {int} addFigureIndex Índice para las figuras añadidas */
var addFigureIndex = 0;

/** @var {boolean} flagUndoRedo Bandera que controla si se está realizando la acción de deshacer o rehacer */
var flagUndoRedo = false;

/** @var {boolean} pageSize Tamaño de la página */
var pageSize = false;

/** @var {int} imagesCont Contador de imágenes */
var imagesCont = 0;

/** @var {array} imagesToDelete Imágenes a elimina */
var imagesToDelete = new Array;

/** @var {array} imagesUnsaveToDelete Imágenes a eliminar que no se han guardado */
var imagesUnsaveToDelete = new Array;

/** @var {boolean} firtsLoad Bandera que controla si es la primera carga del editor */
var firtsLoad = true;

/** @var {boolean} confirmSave Bandera que controla si el usuario confirma volver a generar un documento ya firmado */
var confirmSave = false;

/**
 * Comprueba si el documento existe
 * 
 * @return {bool} check Check
 */
function existsDocument(){
    var check = false;

    $.ajax({
        url: uri + 'core/expedients/documentsEditor/check.php',
        method: 'POST',
        data: {
            document: documentID
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data);
            }catch(e){
                check = false;
            }
        },
        error: function(){
            check = false;
        }
    })

    return check;
}

/**
 * Comprueba si el pdf del documento ya se ha creado
 * 
 * @param {int} document Id del documento
 */
function checkView(){
    $.ajax({
        url: uri + 'core/expedients/documentsEditor/checkPdf.php',
        method: 'POST',
        data: {
            document: documentID,
            expedient: expedientID
        },
        async: true,
        success: function(data){
            try{
                data = $.parseJSON(data);
                
                if(data){
                    $('#view').removeClass('hide');
                }
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                setTimeout(function(){
                    $('#block-message').empty();
                }, 5000);
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
            setTimeout(function(){
                $('#block-message').empty();
            }, 5000);
        }
    })
}

/**
 * Abre el documento
 */
function goView(){
    $('#view').click(function(){
        window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/documentsEditor/' + documentID + '/files/documento.pdf', '_blank');
    })
}

/**
 * Comprueba si ya se ha generado algún documento
 * 
 * @return {array} info Info
 */
function getDocument(){
    var info = new Array;
    $.ajax({
        url: uri + 'core/expedients/documentsEditor/getData.php',
        method: 'POST',
        data: {
            document: documentID,
            expedient: expedientID
        },
        async: false,
        success: function(data){
            try{
                info = $.parseJSON(data);
            }catch(e){
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
    return info;
}

/**
 * Fix footer
 */
function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height()
    $('.content-wrapper').css('padding-bottom', heightFooter)
}

/**
 * Dibuja los datos cargados
 */
function drawLoad(){
    // Guardar datos y descargar pdf
	save();
    onlySave();

    width = $('#page' + pageNumber).innerWidth();
    height = $('#page' + pageNumber).innerHeight();

    $('#addPage').click(function(){
        $(".sidenav").removeClass('A6-sticky')

        pageNumber++;

        $('#pages').append(
            '   <div id="pageSection' + pageNumber + '">' +
            '       <h4>Página <span class="page-number">' + ($('.page-number').length + 1) + '</span> - <button type="button" class="btn btn-primary" id="deletePage' + pageNumber + '" pageNumber="' + pageNumber + '">Eliminar página</button></h4>' +
            '       <page size="' + pageSize + '" id="page' + pageNumber + '"></page>' +
            '       <page size="' + pageSize + '" class="hide" id="pageAux' + pageNumber + '"></page>' +
            '   </div>'
        )

        initScene(pageNumber);

        maxZIndex.push(0);

        $('#deletePage' + pageNumber).click(function(){
            if(confirm('¿Deseas eliminar la página? Ojo! Esta acción no se podrá deshacer')){
                var num = $(this).attr('pageNumber');
                $('#pageSection' + num).remove();
    
                delete stages[num];
                delete layers[num];
                delete gridLayers[num];
                $.each(states, function(index, elem){
                    if(states[index][num] != undefined){
                        delete states[index][num];
                    }
                })
    
                $('.page-number').each(function(index, elem){
                    $(elem).text(index + 1);
                })

                delete maxZIndex[num];
            }
        })
    })

    if(documentSources.length > 0){
        $.each(documentSources, function(index, elem){
            if(index == 0){
                initScene(0);
            }else{
                $('#addPage').click();
            }
        })
    }else{
        initScene(0);
    }

    var auxStages = new Array;
    $.each(documentSources, function(index, elem){
        auxStages.push([index, Konva.Node.create(elem, 'pageAux' + index)]);
    })

    var auxTexts = new Array;
    var auxFigures = new Array;
    var auxImages = new Array;

    $.each(auxStages, function(index, elem){
        currentPage = elem[0];

        var maxZIndexValue = 0;

        // Texts
        var texts = elem[1].find('.text');
        $.each(texts, function(){
            var optionsText = {
                x: $(this)[0].x(),
                y: $(this)[0].y(),
                height: $(this)[0].height(),
                width: $(this)[0].width(),
                name: $(this)[0].name(),
                id: $(this)[0].id(),
                draggable: $(this)[0].draggable(),
                fill: $(this)[0].fill(),
                opacity: $(this)[0].opacity(),
                rotation: $(this)[0].rotation(),
                editable: true
            }
            
            if($(this)[0].id().match(/addText/)){
                if(addTextIndex < parseInt($(this)[0].id().split('addText')[1])){
                    addTextIndex = parseInt($(this)[0].id().split('addText')[1]) + 1;
                }else{
                    addTextIndex++;
                }
            }else if($(this)[0].id().match(/addSign/)){
                if(addSignIndex < parseInt($(this)[0].id().split('addSign')[1])){
                    addSignIndex = parseInt($(this)[0].id().split('addSign')[1]) + 1;
                }else{
                    addSignIndex++;
                }
                optionsText.editable = false;
            }

            var text = $(this)[0].text();

            // "Fechas"
            text = text.split('#224#').join(moment().format('DD/MM/YYYY'));
            text = text.split('#225#').join(moment().format('LL'));

            // "Datos del expediente"
            text = text.split('#1#').join(expedientDataSheetInfo.number == null || expedientDataSheetInfo.number == '' ? '' : expedientDataSheetInfo.number);
            text = text.split('#4#').join(expedientDataSheetInfo.requestDate == null || expedientDataSheetInfo.requestDate == '' ? '' : moment(expedientDataSheetInfo.requestDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#167#').join(expedientDataSheetInfo.requestDate == null || expedientDataSheetInfo.requestDate == '' ? '' : moment(expedientDataSheetInfo.requestDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#168#').join(expedientDataSheetInfo.requestDate == null || expedientDataSheetInfo.requestDate == '' ? '' : moment(expedientDataSheetInfo.requestDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#169#').join(expedientDataSheetInfo.requestDate == null || expedientDataSheetInfo.requestDate == '' ? '' : moment(expedientDataSheetInfo.requestDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#2#').join(expedientDataSheetInfo.requestTime == null || expedientDataSheetInfo.requestTime == '' ? '' : moment(expedientDataSheetInfo.requestTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#254#').join(expedientDataSheetInfo.arriveDate == null || expedientDataSheetInfo.arriveDate == '' ? '' : moment(expedientDataSheetInfo.arriveDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#255#').join(expedientDataSheetInfo.arriveDate == null || expedientDataSheetInfo.arriveDate == '' ? '' : moment(expedientDataSheetInfo.arriveDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#256#').join(expedientDataSheetInfo.arriveDate == null || expedientDataSheetInfo.arriveDate == '' ? '' : moment(expedientDataSheetInfo.arriveDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#257#').join(expedientDataSheetInfo.arriveDate == null || expedientDataSheetInfo.arriveDate == '' ? '' : moment(expedientDataSheetInfo.arriveDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#3#').join(expedientDataSheetInfo.arriveTime == null || expedientDataSheetInfo.arriveTime == '' ? '' : moment(expedientDataSheetInfo.arriveTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#5#').join(expedientDataSheetInfo.type == null || expedientDataSheetInfo.type == '' ? '' : (expedientDataSheetInfo.type == '1' ? 'defunción' : (expedientDataSheetInfo.type == '2' ? 'presupuesto' : 'varios')));
            text = text.split('#6#').join(expedientDataSheetInfo.clientType == null || expedientDataSheetInfo.clientType == '' ? '' : (expedientDataSheetInfo.clientType == '1' ? 'particular' : (expedientDataSheetInfo.clientType == '2' ? 'seguros' : 'empresa')));
            text = text.split('#7#').join(expedientDataSheetInfo.policy == null || expedientDataSheetInfo.policy == '' ? '' : expedientDataSheetInfo.policy);
            text = text.split('#8#').join(expedientDataSheetInfo.capital == null || expedientDataSheetInfo.capital == '' ? '' : expedientDataSheetInfo.capital);
            text = text.split('#9#').join(expedientDataSheetInfo.lossNumber == null || expedientDataSheetInfo.lossNumber == '' ? '' : expedientDataSheetInfo.lossNumber);
            text = text.split('#10#').join(
                expedientDataSheetInfo.status == '2'
                ? 'en curso'
                : (
                    expedientDataSheetInfo.status == '3'
                    ? 'pendiente de facturación'
                    : (
                        expedientDataSheetInfo.status == '4'
                        ? 'facturado'
                        : (
                            expedientDataSheetInfo.status == '5'
                            ? 'finalizado'
                            : (
                                expedientDataSheetInfo.status == '6'
                                ? 'pendiente de revisión'
                                : ''
                            )
                        )
                    )
                )
            );
            text = text.split('#247#').join(expedientDataSheetInfo.internalRef == null || expedientDataSheetInfo.internalRef == '' ? '' : expedientDataSheetInfo.internalRef);

            // "Datos del solicitante"
            text = text.split('#11#').join(expedientDataSheetInfo.applicantName == null || expedientDataSheetInfo.applicantName == '' ? '' : expedientDataSheetInfo.applicantName);
            text = text.split('#12#').join(expedientDataSheetInfo.applicantSurname == null || expedientDataSheetInfo.applicantSurname == '' ? '' : expedientDataSheetInfo.applicantSurname);
            var surname = expedientDataSheetInfo.applicantSurname == null || expedientDataSheetInfo.applicantSurname == '' ? '' : expedientDataSheetInfo.applicantSurname;
            var firstSurname = '';
            var secondSurname = '';
            if(surname != null && surname != ''){
                var auxSurname = surname.split(' ');
                firstSurname = auxSurname[0];
                if(auxSurname.length > 1){
                    secondSurname = auxSurname[auxSurname.length - 1];
                }
            }
            text = text.split('#157#').join(firstSurname);
            text = text.split('#158#').join(secondSurname);
            text = text.split('#13#').join(expedientDataSheetInfo.applicantAddress == null || expedientDataSheetInfo.applicantAddress == '' ? '' : expedientDataSheetInfo.applicantAddress);
            text = text.split('#14#').join(expedientDataSheetInfo.applicantMail == null || expedientDataSheetInfo.applicantMail == '' ? '' : expedientDataSheetInfo.applicantMail);
            text = text.split('#15#').join(expedientDataSheetInfo.applicantProvince == null || expedientDataSheetInfo.applicantProvince == '' ? '' : expedientDataSheetInfo.applicantProvince);
            text = text.split('#16#').join(expedientDataSheetInfo.applicantLocation == null || expedientDataSheetInfo.applicantLocation == '' ? '' : expedientDataSheetInfo.applicantLocation);
            text = text.split('#258#').join(expedientDataSheetInfo.applicantPostalCode == null || expedientDataSheetInfo.applicantPostalCode == '' ? '' : expedientDataSheetInfo.applicantPostalCode);
            text = text.split('#17#').join(expedientDataSheetInfo.applicantPhone == null || expedientDataSheetInfo.applicantPhone == '' ? '' : expedientDataSheetInfo.applicantPhone);
            text = text.split('#18#').join(expedientDataSheetInfo.applicantMobilePhone == null || expedientDataSheetInfo.applicantMobilePhone == '' ? '' : expedientDataSheetInfo.applicantMobilePhone);
            text = text.split('#19#').join(expedientDataSheetInfo.applicantNIF == null || expedientDataSheetInfo.applicantNIF == '' ? '' : expedientDataSheetInfo.applicantNIF);

            // "Contratante"
            text = text.split('#20#').join(expedientDataSheetInfo.familyContactName == null || expedientDataSheetInfo.familyContactName == '' ? '' : expedientDataSheetInfo.familyContactName);
            text = text.split('#21#').join(expedientDataSheetInfo.familyContactSurname == null || expedientDataSheetInfo.familyContactSurname == '' ? '' : expedientDataSheetInfo.familyContactSurname);
            var surname = expedientDataSheetInfo.familyContactSurname == null || expedientDataSheetInfo.familyContactSurname == '' ? '' : expedientDataSheetInfo.familyContactSurname;
            var firstSurname = '';
            var secondSurname = '';
            if(surname != null && surname != ''){
                var auxSurname = surname.split(' ');
                firstSurname = auxSurname[0];
                if(auxSurname.length > 1){
                    secondSurname = auxSurname[auxSurname.length - 1];
                }
            }
            text = text.split('#159#').join(firstSurname);
            text = text.split('#160#').join(secondSurname);
            text = text.split('#22#').join(expedientDataSheetInfo.familyContactAddress == null || expedientDataSheetInfo.familyContactAddress == '' ? '' : expedientDataSheetInfo.familyContactAddress);
            text = text.split('#23#').join(expedientDataSheetInfo.familyContactMail == null || expedientDataSheetInfo.familyContactMail == '' ? '' : expedientDataSheetInfo.familyContactMail);
            text = text.split('#24#').join(expedientDataSheetInfo.familyContactProvince == null || expedientDataSheetInfo.familyContactProvince == '' ? '' : expedientDataSheetInfo.familyContactProvince);
            text = text.split('#25#').join(expedientDataSheetInfo.familyContactLocation == null || expedientDataSheetInfo.familyContactLocation == '' ? '' : expedientDataSheetInfo.familyContactLocation);
            text = text.split('#259#').join(expedientDataSheetInfo.familyContactPostalCode == null || expedientDataSheetInfo.familyContactPostalCode == '' ? '' : expedientDataSheetInfo.familyContactPostalCode);
            text = text.split('#26#').join(expedientDataSheetInfo.familyContactPhone == null || expedientDataSheetInfo.familyContactPhone == '' ? '' : expedientDataSheetInfo.familyContactPhone);
            text = text.split('#27#').join(expedientDataSheetInfo.familyContactMobilePhone == null || expedientDataSheetInfo.familyContactMobilePhone == '' ? '' : expedientDataSheetInfo.familyContactMobilePhone);
            text = text.split('#28#').join(expedientDataSheetInfo.familyContactNIF == null || expedientDataSheetInfo.familyContactNIF == '' ? '' : expedientDataSheetInfo.familyContactNIF);
            text = text.split('#29#').join(expedientDataSheetInfo.familyContactRelationship == null || expedientDataSheetInfo.familyContactRelationship == '' ? '' : expedientDataSheetInfo.familyContactRelationship);
            var familyContactNationality = '';
            if(expedientDataSheetInfo.familyContactNationality != null || expedientDataSheetInfo.familyContactNationality != ''){
                if(expedientDataSheetInfo.familyContactNationality == '1'){
                    familyContactNationality = 'España';
                }else{
                    if(expedientDataSheetInfo.familyContactOtherLocation == '' && expedientDataSheetInfo.familyContactOtherProvince == '' && expedientDataSheetInfo.familyContactOtherCountry != ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherCountry;
                    }else if(expedientDataSheetInfo.familyContactOtherLocation == '' && expedientDataSheetInfo.familyContactOtherProvince != '' && expedientDataSheetInfo.familyContactOtherCountry == ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherProvince;
                    }else if(expedientDataSheetInfo.familyContactOtherLocation == '' && expedientDataSheetInfo.familyContactOtherProvince != '' && expedientDataSheetInfo.familyContactOtherCountry != ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherProvince + ' (' + expedientDataSheetInfo.familyContactOtherCountry + ')';
                    }else if(expedientDataSheetInfo.familyContactOtherLocation != '' && expedientDataSheetInfo.familyContactOtherProvince == '' && expedientDataSheetInfo.familyContactOtherCountry == ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherLocation;
                    }else if(expedientDataSheetInfo.familyContactOtherLocation != '' && expedientDataSheetInfo.familyContactOtherProvince == '' && expedientDataSheetInfo.familyContactOtherCountry != ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherLocation + ' (' + expedientDataSheetInfo.familyContactOtherCountry + ')';
                    }else if(expedientDataSheetInfo.familyContactOtherLocation != '' && expedientDataSheetInfo.familyContactOtherProvince != '' && expedientDataSheetInfo.familyContactOtherCountry == ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherLocation + ' - ' + expedientDataSheetInfo.familyContactOtherProvince;
                    }else if(expedientDataSheetInfo.familyContactOtherLocation != '' && expedientDataSheetInfo.familyContactOtherProvince != '' && expedientDataSheetInfo.familyContactOtherCountry != ''){
                        familyContactNationality = expedientDataSheetInfo.familyContactOtherLocation + ' - ' + expedientDataSheetInfo.familyContactOtherProvince + ' (' + expedientDataSheetInfo.familyContactOtherCountry + ')';
                    }
                }
            }
            text = text.split('#30#').join(familyContactNationality);
            text = text.split('#31#').join(expedientDataSheetInfo.otherContactName == null || expedientDataSheetInfo.otherContactName == '' ? '' : expedientDataSheetInfo.otherContactName);
            text = text.split('#32#').join(expedientDataSheetInfo.otherContactPhone == null || expedientDataSheetInfo.otherContactPhone == '' ? '' : expedientDataSheetInfo.otherContactPhone);
            text = text.split('#33#').join(expedientDataSheetInfo.otherContactRelationship == null || expedientDataSheetInfo.otherContactRelationship == '' ? '' : expedientDataSheetInfo.otherContactRelationship);

            // "Facturar a"
            text = text.split('#34#').join(expedientDataSheetInfo.clientBrandName == null || expedientDataSheetInfo.clientBrandName == '' ? '' : expedientDataSheetInfo.clientBrandName);
            text = text.split('#35#').join(expedientDataSheetInfo.clientName == null || expedientDataSheetInfo.clientName == '' ? '' : expedientDataSheetInfo.clientName);
            text = text.split('#36#').join(expedientDataSheetInfo.clientSurname == null || expedientDataSheetInfo.clientSurname == '' ? '' : expedientDataSheetInfo.clientSurname);
            var surname = expedientDataSheetInfo.clientSurname == null || expedientDataSheetInfo.clientSurname == '' ? '' : expedientDataSheetInfo.clientSurname;
            var firstSurname = '';
            var secondSurname = '';
            if(surname != null && surname != ''){
                var auxSurname = surname.split(' ');
                firstSurname = auxSurname[0];
                if(auxSurname.length > 1){
                    secondSurname = auxSurname[auxSurname.length - 1];
                }
            }
            text = text.split('#161#').join(firstSurname);
            text = text.split('#162#').join(secondSurname);
            text = text.split('#37#').join(expedientDataSheetInfo.clientNIF == null || expedientDataSheetInfo.clientNIF == '' ? '' : expedientDataSheetInfo.clientNIF);
            text = text.split('#38#').join(expedientDataSheetInfo.clientMail == null || expedientDataSheetInfo.clientMail == '' ? '' : expedientDataSheetInfo.clientMail);
            text = text.split('#39#').join(expedientDataSheetInfo.clientProvince == null || expedientDataSheetInfo.clientProvince == '' ? '' : expedientDataSheetInfo.clientProvince);
            text = text.split('#40#').join(expedientDataSheetInfo.clientLocation == null || expedientDataSheetInfo.clientLocation == '' ? '' : expedientDataSheetInfo.clientLocation);
            text = text.split('#260#').join(expedientDataSheetInfo.clientPostalCode == null || expedientDataSheetInfo.clientPostalCode == '' ? '' : expedientDataSheetInfo.clientPostalCode);
            text = text.split('#41#').join(expedientDataSheetInfo.clientAddress == null || expedientDataSheetInfo.clientAddress == '' ? '' : expedientDataSheetInfo.clientAddress);
            text = text.split('#42#').join(expedientDataSheetInfo.clientPhones == null || expedientDataSheetInfo.clientPhones == '' ? '' : expedientDataSheetInfo.clientPhones);

            // "Datos del difunto"
            text = text.split('#43#').join(expedientDataSheetInfo.deceasedName == null || expedientDataSheetInfo.deceasedName == '' ? '' : expedientDataSheetInfo.deceasedName);
            text = text.split('#44#').join(expedientDataSheetInfo.deceasedSurname == null || expedientDataSheetInfo.deceasedSurname == '' ? '' : expedientDataSheetInfo.deceasedSurname);
            var surname = expedientDataSheetInfo.deceasedSurname == null || expedientDataSheetInfo.deceasedSurname == '' ? '' : expedientDataSheetInfo.deceasedSurname;
            var firstSurname = '';
            var secondSurname = '';
            if(surname != null && surname != ''){
                var auxSurname = surname.split(' ');
                firstSurname = auxSurname[0];
                if(auxSurname.length > 1){
                    secondSurname = auxSurname[auxSurname.length - 1];
                }
            }
            text = text.split('#163#').join(firstSurname);
            text = text.split('#164#').join(secondSurname);
            text = text.split('#45#').join(expedientDataSheetInfo.deceasedNIF == null || expedientDataSheetInfo.deceasedNIF == '' ? '' : expedientDataSheetInfo.deceasedNIF);
            if(expedientDataSheetInfo.deceasedMaritalStatus == null || expedientDataSheetInfo.deceasedMaritalStatus == ''){
                var deceasedMaritalStatus = '';
            }else{
                var deceasedMaritalStatus = expedientDataSheetInfo.deceasedMaritalStatus;
                if(expedientDataSheetInfo.deceasedGender == 'Mujer'){
                    switch(expedientDataSheetInfo.deceasedMaritalStatus){
                        case 'Soltero':
                            deceasedMaritalStatus = 'Soltera';
                        break;
                        case 'Casado':
                            deceasedMaritalStatus = 'Casada';
                        break;
                        case 'Divorciado':
                            deceasedMaritalStatus = 'Divorciada';
                        break;
                        case 'Viudo':
                            deceasedMaritalStatus = 'Viuda';
                        break;
                    }
                }
            }


            text = text.split('#46#').join(deceasedMaritalStatus);
            text = text.split('#47#').join(expedientDataSheetInfo.deceasedFirstNuptials == null || expedientDataSheetInfo.deceasedFirstNuptials == '' ? '' : expedientDataSheetInfo.deceasedFirstNuptials);
            text = text.split('#48#').join(expedientDataSheetInfo.deceasedSecondNuptials == null || expedientDataSheetInfo.deceasedSecondNuptials == '' ? '' : expedientDataSheetInfo.deceasedSecondNuptials);
            text = text.split('#49#').join(expedientDataSheetInfo.deceasedGender == null || expedientDataSheetInfo.deceasedGender == '' ? '' : (
                expedientDataSheetInfo.deceasedGender == 'Hombre' ? 'D.' : 'Dña.'
            ));
            text = text.split('#50#').join(expedientDataSheetInfo.deceasedGender == null || expedientDataSheetInfo.deceasedGender == '' ? '' : expedientDataSheetInfo.deceasedGender);
            text = text.split('#51#').join(expedientDataSheetInfo.deceasedChildOfFather == null || expedientDataSheetInfo.deceasedChildOfFather == '' ? '' : expedientDataSheetInfo.deceasedChildOfFather);
            text = text.split('#52#').join(expedientDataSheetInfo.deceasedChildOfMother == null || expedientDataSheetInfo.deceasedChildOfMother == '' ? '' : expedientDataSheetInfo.deceasedChildOfMother);
            text = text.split('#53#').join(expedientDataSheetInfo.deceasedNationality == null || expedientDataSheetInfo.deceasedNationality == '' ? '' : expedientDataSheetInfo.deceasedNationality);
            text = text.split('#54#').join(expedientDataSheetInfo.deceasedBirthday == null || expedientDataSheetInfo.deceasedBirthday == '' ? '' : moment(expedientDataSheetInfo.deceasedBirthday, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#170#').join(expedientDataSheetInfo.deceasedBirthday == null || expedientDataSheetInfo.deceasedBirthday == '' ? '' : moment(expedientDataSheetInfo.deceasedBirthday, 'YYYY-MM-DD').format('DD'));
            text = text.split('#171#').join(expedientDataSheetInfo.deceasedBirthday == null || expedientDataSheetInfo.deceasedBirthday == '' ? '' : moment(expedientDataSheetInfo.deceasedBirthday, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#172#').join(expedientDataSheetInfo.deceasedBirthday == null || expedientDataSheetInfo.deceasedBirthday == '' ? '' : moment(expedientDataSheetInfo.deceasedBirthday, 'YYYY-MM-DD').format('YYYY'));
            var yearsLife = '';
            if(expedientDataSheetInfo.deceasedDate != null && expedientDataSheetInfo.deceasedBirthday){
                yearsLife = moment(expedientDataSheetInfo.deceasedDate, "YYYY-MM-DD").diff(moment(expedientDataSheetInfo.deceasedBirthday, "YYYY-MM-DD"), 'years');
            }
            text = text.split('#253#').join(yearsLife);
            text = text.split('#55#').join(expedientDataSheetInfo.deceasedBirthdayProvince == null || expedientDataSheetInfo.deceasedBirthdayProvince == '' ? '' : expedientDataSheetInfo.deceasedBirthdayProvince);
            text = text.split('#56#').join(expedientDataSheetInfo.deceasedBirthdayLocation == null || expedientDataSheetInfo.deceasedBirthdayLocation == '' ? '' : expedientDataSheetInfo.deceasedBirthdayLocation);
            text = text.split('#57#').join(expedientDataSheetInfo.deceasedUsualAddress == null || expedientDataSheetInfo.deceasedUsualAddress == '' ? '' : expedientDataSheetInfo.deceasedUsualAddress);
            text = text.split('#58#').join(expedientDataSheetInfo.deceasedLocality == null || expedientDataSheetInfo.deceasedLocality == '' ? '' : expedientDataSheetInfo.deceasedLocality);
            text = text.split('#59#').join(expedientDataSheetInfo.deceasedProvince == null || expedientDataSheetInfo.deceasedProvince == '' ? '' : expedientDataSheetInfo.deceasedProvince);
            text = text.split('#60#').join(expedientDataSheetInfo.deceasedInName == null || expedientDataSheetInfo.deceasedInName == '' ? '' : expedientDataSheetInfo.deceasedInName);
            text = text.split('#226#').join(expedientDataSheetInfo.deceasedInLocation == null || expedientDataSheetInfo.deceasedInLocation == '' ? '' : expedientDataSheetInfo.deceasedInLocation);
            text = text.split('#227#').join(expedientDataSheetInfo.deceasedInProvince == null || expedientDataSheetInfo.deceasedInProvince == '' ? '' : expedientDataSheetInfo.deceasedInProvince);
            text = text.split('#61#').join(expedientDataSheetInfo.deceasedDate == null || expedientDataSheetInfo.deceasedDate == '' ? '' : moment(expedientDataSheetInfo.deceasedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#173#').join(expedientDataSheetInfo.deceasedDate == null || expedientDataSheetInfo.deceasedDate == '' ? '' : moment(expedientDataSheetInfo.deceasedDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#174#').join(expedientDataSheetInfo.deceasedDate == null || expedientDataSheetInfo.deceasedDate == '' ? '' : moment(expedientDataSheetInfo.deceasedDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#175#').join(expedientDataSheetInfo.deceasedDate == null || expedientDataSheetInfo.deceasedDate == '' ? '' : moment(expedientDataSheetInfo.deceasedDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#62#').join(expedientDataSheetInfo.deceasedTime == null || expedientDataSheetInfo.deceasedTime == '' ? '' : moment(expedientDataSheetInfo.deceasedTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#63#').join(expedientDataSheetInfo.deceasedDoctorName == null || expedientDataSheetInfo.deceasedDoctorName == '' ? '' : expedientDataSheetInfo.deceasedDoctorName);
            text = text.split('#64#').join(expedientDataSheetInfo.deceasedDoctorCertificate == null || expedientDataSheetInfo.deceasedDoctorCertificate == '' ? '' : expedientDataSheetInfo.deceasedDoctorCertificate);
            text = text.split('#65#').join(expedientDataSheetInfo.deceasedCause == null || expedientDataSheetInfo.deceasedCause == '' ? '' : expedientDataSheetInfo.deceasedCause);
            text = text.split('#66#').join(expedientDataSheetInfo.deceasedTribunal == null || expedientDataSheetInfo.deceasedTribunal == '' ? '' : expedientDataSheetInfo.deceasedTribunal);
            text = text.split('#67#').join(expedientDataSheetInfo.deceasedTribunalNumber == null || expedientDataSheetInfo.deceasedTribunalNumber == '' ? '' : expedientDataSheetInfo.deceasedTribunalNumber);
            
            // "Datos de la Velación"
            text = text.split('#68#').join(expedientDataSheetInfo.mortuaryName == null || expedientDataSheetInfo.mortuaryName == '' ? '' : expedientDataSheetInfo.mortuaryName);
            text = text.split('#69#').join(expedientDataSheetInfo.deceasedRoom == null || expedientDataSheetInfo.deceasedRoom == '' ? '' : expedientDataSheetInfo.deceasedRoom);
            text = text.split('#70#').join(expedientDataSheetInfo.startVelacionDate == null || expedientDataSheetInfo.startVelacionDate == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#176#').join(expedientDataSheetInfo.startVelacionDate == null || expedientDataSheetInfo.startVelacionDate == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#177#').join(expedientDataSheetInfo.startVelacionDate == null || expedientDataSheetInfo.startVelacionDate == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#178#').join(expedientDataSheetInfo.startVelacionDate == null || expedientDataSheetInfo.startVelacionDate == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#71#').join(expedientDataSheetInfo.startVelacionTime == null || expedientDataSheetInfo.startVelacionTime == '' ? '' : moment(expedientDataSheetInfo.startVelacionTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#232#').join(expedientDataSheetInfo.endVelacionDate == null || expedientDataSheetInfo.endVelacionDate == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#233#').join(expedientDataSheetInfo.endVelacionDate == null || expedientDataSheetInfo.endVelacionDate == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#234#').join(expedientDataSheetInfo.endVelacionDate == null || expedientDataSheetInfo.endVelacionDate == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#235#').join(expedientDataSheetInfo.endVelacionDate == null || expedientDataSheetInfo.endVelacionDate == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#236#').join(expedientDataSheetInfo.endVelacionTime == null || expedientDataSheetInfo.endVelacionTime == '' ? '' : moment(expedientDataSheetInfo.endVelacionTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#237#').join(expedientDataSheetInfo.startVelacionDate2 == null || expedientDataSheetInfo.startVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate2, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#238#').join(expedientDataSheetInfo.startVelacionDate2 == null || expedientDataSheetInfo.startVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate2, 'YYYY-MM-DD').format('DD'));
            text = text.split('#239#').join(expedientDataSheetInfo.startVelacionDate2 == null || expedientDataSheetInfo.startVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate2, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#240#').join(expedientDataSheetInfo.startVelacionDate2 == null || expedientDataSheetInfo.startVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.startVelacionDate2, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#241#').join(expedientDataSheetInfo.startVelacionTime2 == null || expedientDataSheetInfo.startVelacionTime2 == '' ? '' : moment(expedientDataSheetInfo.startVelacionTime2, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#242#').join(expedientDataSheetInfo.endVelacionDate2 == null || expedientDataSheetInfo.endVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate2, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#243#').join(expedientDataSheetInfo.endVelacionDate2 == null || expedientDataSheetInfo.endVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate2, 'YYYY-MM-DD').format('DD'));
            text = text.split('#244#').join(expedientDataSheetInfo.endVelacionDate2 == null || expedientDataSheetInfo.endVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate2, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#245#').join(expedientDataSheetInfo.endVelacionDate2 == null || expedientDataSheetInfo.endVelacionDate2 == '' ? '' : moment(expedientDataSheetInfo.endVelacionDate2, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#246#').join(expedientDataSheetInfo.endVelacionTime2 == null || expedientDataSheetInfo.endVelacionTime2 == '' ? '' : moment(expedientDataSheetInfo.endVelacionTime2, 'HH:mm:ss').format('HH:mm'));

            // "Datos del entierro"
            text = text.split('#72#').join(expedientDataSheetInfo.churchLabel == null || expedientDataSheetInfo.churchLabel == '' ? '' : expedientDataSheetInfo.churchLabel);
            text = text.split('#73#').join(expedientDataSheetInfo.churchName == null || expedientDataSheetInfo.churchName == '' ? '' : expedientDataSheetInfo.churchName);
            text = text.split('#74#').join(expedientDataSheetInfo.cemeteryLabel == null || expedientDataSheetInfo.cemeteryLabel == '' ? '' : expedientDataSheetInfo.cemeteryLabel);
            text = text.split('#75#').join(expedientDataSheetInfo.cemeteryName == null || expedientDataSheetInfo.cemeteryName == '' ? '' : expedientDataSheetInfo.cemeteryName);
            text = text.split('#76#').join(expedientDataSheetInfo.funeralDate == null || expedientDataSheetInfo.funeralDate == '' ? '' : moment(expedientDataSheetInfo.funeralDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#179#').join(expedientDataSheetInfo.funeralDate == null || expedientDataSheetInfo.funeralDate == '' ? '' : moment(expedientDataSheetInfo.funeralDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#180#').join(expedientDataSheetInfo.funeralDate == null || expedientDataSheetInfo.funeralDate == '' ? '' : moment(expedientDataSheetInfo.funeralDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#181#').join(expedientDataSheetInfo.funeralDate == null || expedientDataSheetInfo.funeralDate == '' ? '' : moment(expedientDataSheetInfo.funeralDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#77#').join(expedientDataSheetInfo.funeralTime == null || expedientDataSheetInfo.funeralTime == '' ? '' : moment(expedientDataSheetInfo.funeralTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#78#').join(expedientDataSheetInfo.ceremonyDate == null || expedientDataSheetInfo.ceremonyDate == '' ? '' : moment(expedientDataSheetInfo.ceremonyDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#182#').join(expedientDataSheetInfo.ceremonyDate == null || expedientDataSheetInfo.ceremonyDate == '' ? '' : moment(expedientDataSheetInfo.ceremonyDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#183#').join(expedientDataSheetInfo.ceremonyDate == null || expedientDataSheetInfo.ceremonyDate == '' ? '' : moment(expedientDataSheetInfo.ceremonyDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#184#').join(expedientDataSheetInfo.ceremonyDate == null || expedientDataSheetInfo.ceremonyDate == '' ? '' : moment(expedientDataSheetInfo.ceremonyDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#79#').join(expedientDataSheetInfo.ceremonyTime == null || expedientDataSheetInfo.ceremonyTime == '' ? '' : moment(expedientDataSheetInfo.ceremonyTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#80#').join(expedientDataSheetInfo.funeralDateNew == null || expedientDataSheetInfo.funeralDateNew == '' ? '' : moment(expedientDataSheetInfo.funeralDateNew, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#185#').join(expedientDataSheetInfo.funeralDateNew == null || expedientDataSheetInfo.funeralDateNew == '' ? '' : moment(expedientDataSheetInfo.funeralDateNew, 'YYYY-MM-DD').format('DD'));
            text = text.split('#186#').join(expedientDataSheetInfo.funeralDateNew == null || expedientDataSheetInfo.funeralDateNew == '' ? '' : moment(expedientDataSheetInfo.funeralDateNew, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#187#').join(expedientDataSheetInfo.funeralDateNew == null || expedientDataSheetInfo.funeralDateNew == '' ? '' : moment(expedientDataSheetInfo.funeralDateNew, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#81#').join(expedientDataSheetInfo.funeralTimeNew == null || expedientDataSheetInfo.funeralTimeNew == '' ? '' : moment(expedientDataSheetInfo.funeralTimeNew, 'HH:mm:ss').format('HH:mm'));
            
            text = text.split('#218#').join(expedientDataSheetInfo.funeralDateBurial == null || expedientDataSheetInfo.funeralDateBurial == '' ? '' : moment(expedientDataSheetInfo.funeralDateBurial, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#219#').join(expedientDataSheetInfo.funeralDateBurial == null || expedientDataSheetInfo.funeralDateBurial == '' ? '' : moment(expedientDataSheetInfo.funeralDateBurial, 'YYYY-MM-DD').format('DD'));
            text = text.split('#220#').join(expedientDataSheetInfo.funeralDateBurial == null || expedientDataSheetInfo.funeralDateBurial == '' ? '' : moment(expedientDataSheetInfo.funeralDateBurial, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#221#').join(expedientDataSheetInfo.funeralDateBurial == null || expedientDataSheetInfo.funeralDateBurial == '' ? '' : moment(expedientDataSheetInfo.funeralDateBurial, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#222#').join(expedientDataSheetInfo.funeralTimeBurial == null || expedientDataSheetInfo.funeralTimeBurial == '' ? '' : moment(expedientDataSheetInfo.funeralTimeBurial, 'HH:mm:ss').format('HH:mm'));
            
            text = text.split('#82#').join(expedientDataSheetInfo.niche == null || expedientDataSheetInfo.niche == '' ? '' : (
                expedientDataSheetInfo.niche == '1' ?
                '' : (
                    expedientDataSheetInfo.niche == '2' ?
                    'nicho' : (
                        expedientDataSheetInfo.niche == '3' ?
                        'panteón' : (
                            expedientDataSheetInfo.niche == '4' ?
                            'fosa' :
                            'otro'
                        )
                    )
                )
            ));
            text = text.split('#83#').join(expedientDataSheetInfo.funeralNicheNumber == null || expedientDataSheetInfo.funeralNicheNumber == '' ? '' : expedientDataSheetInfo.funeralNicheNumber);
            text = text.split('#84#').join(expedientDataSheetInfo.regime == null || expedientDataSheetInfo.regime == '' ? '' : (
                expedientDataSheetInfo.regime == '0' ?
                '' : (
                    expedientDataSheetInfo.regime == '1' ?
                    'propiedad' : (
                        expedientDataSheetInfo.regime == '2' ?
                        'alquiler' : (
                            expedientDataSheetInfo.regime == '3' ?
                            'concesión' :
                            'cesión temporal'
                        )
                    )
                )
            ));
            text = text.split('#85#').join(expedientDataSheetInfo.exhumation == null || expedientDataSheetInfo.exhumation == '' ? '' : expedientDataSheetInfo.exhumation);
            text = text.split('#86#').join(expedientDataSheetInfo.nicheHeight == null || expedientDataSheetInfo.nicheHeight == '' ? '' : (
                expedientDataSheetInfo.nicheHeight == '0' ?
                '' : (
                    expedientDataSheetInfo.nicheHeight == '1' ?
                    '1º' : (
                        expedientDataSheetInfo.nicheHeight == '2' ?
                        '2º' : (
                            expedientDataSheetInfo.nicheHeight == '3' ?
                            '3º' : (
                                expedientDataSheetInfo.nicheHeight == '4' ?
                                '4º' : (
                                    expedientDataSheetInfo.nicheHeight == '5' ?
                                    '5º' : (
                                        expedientDataSheetInfo.nicheHeight == '6' ?
                                        '6º' : (
                                            expedientDataSheetInfo.nicheHeight == '7' ?
                                            '7º' :
                                            '8º'
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            ));
            if(expedientDataSheetInfo.funeralBusyNiche == '1'){
                // Exhumantion 1
                text = text.split('#206#').join(expedientDataSheetInfo.deceasedNiche == null || expedientDataSheetInfo.deceasedNiche == '' ? '' : expedientDataSheetInfo.deceasedNiche);
                text = text.split('#207#').join(expedientDataSheetInfo.funeralDateNiche == null || expedientDataSheetInfo.funeralDateNiche == '' ? '' : moment(expedientDataSheetInfo.funeralDateNiche, 'X').format('DD/MM/YYYY'));
                
                // Exhumantion 2
                text = text.split('#228#').join(expedientDataSheetInfo.deceasedNiche2 == null || expedientDataSheetInfo.deceasedNiche2 == '' ? '' : expedientDataSheetInfo.deceasedNiche2);
                text = text.split('#229#').join(expedientDataSheetInfo.funeralDateNiche2 == null || expedientDataSheetInfo.funeralDateNiche2 == '' ? '' : moment(expedientDataSheetInfo.funeralDateNiche2, 'X').format('DD/MM/YYYY'));
                
                // Exhumantion 3
                text = text.split('#230#').join(expedientDataSheetInfo.deceasedNiche3 == null || expedientDataSheetInfo.deceasedNiche3 == '' ? '' : expedientDataSheetInfo.deceasedNiche3);
                text = text.split('#231#').join(expedientDataSheetInfo.funeralDateNiche3 == null || expedientDataSheetInfo.funeralDateNiche3 == '' ? '' : moment(expedientDataSheetInfo.funeralDateNiche3, 'X').format('DD/MM/YYYY'));
            }

            // "Datos cremacion"
            text = text.split('#87#').join(expedientDataSheetInfo.crematoriumName == null || expedientDataSheetInfo.crematoriumName == '' ? '' : expedientDataSheetInfo.crematoriumName);
            text = text.split('#88#').join(expedientDataSheetInfo.crematoriumStatus == null || expedientDataSheetInfo.crematoriumStatus == '' ? '' : (
                expedientDataSheetInfo.crematoriumStatus == '5' ? 'reservada' : 'confirmada'
            ));
            text = text.split('#89#').join(expedientDataSheetInfo.crematoriumStart == null || expedientDataSheetInfo.crematoriumStart == '' ? '' : moment(expedientDataSheetInfo.crematoriumStart, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#188#').join(expedientDataSheetInfo.crematoriumStart == null || expedientDataSheetInfo.crematoriumStart == '' ? '' : moment(expedientDataSheetInfo.crematoriumStart, 'YYYY-MM-DD').format('DD'));
            text = text.split('#189#').join(expedientDataSheetInfo.crematoriumStart == null || expedientDataSheetInfo.crematoriumStart == '' ? '' : moment(expedientDataSheetInfo.crematoriumStart, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#190#').join(expedientDataSheetInfo.crematoriumStart == null || expedientDataSheetInfo.crematoriumStart == '' ? '' : moment(expedientDataSheetInfo.crematoriumStart, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#90#').join(expedientDataSheetInfo.crematoriumStart == null || expedientDataSheetInfo.crematoriumStart == '' ? '' : moment(expedientDataSheetInfo.crematoriumStart, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'));
            text = text.split('#91#').join(expedientDataSheetInfo.crematoriumEnd == null || expedientDataSheetInfo.crematoriumEnd == '' ? '' : moment(expedientDataSheetInfo.crematoriumEnd, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#191#').join(expedientDataSheetInfo.crematoriumEnd == null || expedientDataSheetInfo.crematoriumEnd == '' ? '' : moment(expedientDataSheetInfo.crematoriumEnd, 'YYYY-MM-DD').format('DD'));
            text = text.split('#192#').join(expedientDataSheetInfo.crematoriumEnd == null || expedientDataSheetInfo.crematoriumEnd == '' ? '' : moment(expedientDataSheetInfo.crematoriumEnd, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#193#').join(expedientDataSheetInfo.crematoriumEnd == null || expedientDataSheetInfo.crematoriumEnd == '' ? '' : moment(expedientDataSheetInfo.crematoriumEnd, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#92#').join(expedientDataSheetInfo.crematoriumEnd == null || expedientDataSheetInfo.crematoriumEnd == '' ? '' : moment(expedientDataSheetInfo.crematoriumEnd, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'));
            text = text.split('#93#').join(expedientDataSheetInfo.crematoriumTechnical == null || expedientDataSheetInfo.crematoriumTechnical == '' ? '' : expedientDataSheetInfo.crematoriumTechnicalName + ' ' + expedientDataSheetInfo.crematoriumTechnicalSurname);
            text = text.split('#94#').join(expedientDataSheetInfo.trazabilityId == null || expedientDataSheetInfo.trazabilityId == '' ? '' : expedientDataSheetInfo.trazabilityId);
            text = text.split('#95#').join(expedientDataSheetInfo.crematoriumClientName == null || expedientDataSheetInfo.crematoriumClientName == '' ? '' : expedientDataSheetInfo.crematoriumClientName);
            text = text.split('#96#').join(expedientDataSheetInfo.crematoriumClientCif == null || expedientDataSheetInfo.crematoriumClientCif == '' ? '' : expedientDataSheetInfo.crematoriumClientCif);
            text = text.split('#97#').join(expedientDataSheetInfo.crematoriumContactPersonPhone == null || expedientDataSheetInfo.crematoriumContactPersonPhone == '' ? '' : expedientDataSheetInfo.crematoriumContactPersonPhone);
            text = text.split('#98#').join(expedientDataSheetInfo.crematoriumContactPerson == null || expedientDataSheetInfo.crematoriumContactPerson == '' ? '' : expedientDataSheetInfo.crematoriumContactPerson);
            text = text.split('#99#').join(expedientDataSheetInfo.crematoriumContactPhonePerson == null || expedientDataSheetInfo.crematoriumContactPhonePerson == '' ? '' : expedientDataSheetInfo.crematoriumContactPhonePerson);
            text = text.split('#100#').join(expedientDataSheetInfo.familyContactName == null || expedientDataSheetInfo.familyContactName == '' ? '' : expedientDataSheetInfo.familyContactName);
            text = text.split('#101#').join(expedientDataSheetInfo.familyContactSurname == null || expedientDataSheetInfo.familyContactSurname == '' ? '' : expedientDataSheetInfo.familyContactSurname);
            var surname = expedientDataSheetInfo.familyContactSurname == null || expedientDataSheetInfo.familyContactSurname == '' ? '' : expedientDataSheetInfo.familyContactSurname;
            var firstSurname = '';
            var secondSurname = '';
            if(surname != null && surname != ''){
                var auxSurname = surname.split(' ');
                firstSurname = auxSurname[0];
                if(auxSurname.length > 1){
                    secondSurname = auxSurname[auxSurname.length - 1];
                }
            }
            text = text.split('#165#').join(firstSurname);
            text = text.split('#166#').join(secondSurname);
            text = text.split('#102#').join(expedientDataSheetInfo.familyContactPhone == null || expedientDataSheetInfo.familyContactPhone == '' ? '' : expedientDataSheetInfo.familyContactPhone);
            text = text.split('#103#').join(expedientDataSheetInfo.authName == null || expedientDataSheetInfo.authName == '' ? '' : expedientDataSheetInfo.authName);
            text = text.split('#104#').join(expedientDataSheetInfo.authDni == null || expedientDataSheetInfo.authDni == '' ? '' : expedientDataSheetInfo.authDni);
            text = text.split('#105#').join(expedientDataSheetInfo.authContactPhone == null || expedientDataSheetInfo.authContactPhone == '' ? '' : expedientDataSheetInfo.authContactPhone);
            text = text.split('#106#').join(expedientDataSheetInfo.authDate == null || expedientDataSheetInfo.authDate == '' ? '' : moment(expedientDataSheetInfo.authDate, 'X').format('DD/MM/YYYY'));
            text = text.split('#194#').join(expedientDataSheetInfo.authDate == null || expedientDataSheetInfo.authDate == '' ? '' : moment(expedientDataSheetInfo.authDate, 'X').format('DD'));
            text = text.split('#195#').join(expedientDataSheetInfo.authDate == null || expedientDataSheetInfo.authDate == '' ? '' : moment(expedientDataSheetInfo.authDate, 'X').format('MMMM'));
            text = text.split('#196#').join(expedientDataSheetInfo.authDate == null || expedientDataSheetInfo.authDate == '' ? '' : moment(expedientDataSheetInfo.authDate, 'X').format('YYYY'));
            text = text.split('#107#').join(expedientDataSheetInfo.authTime == null || expedientDataSheetInfo.authTime == '' ? '' : moment(expedientDataSheetInfo.authTime, 'X').format('HH:mm'));
            text = text.split('#108#').join(expedientDataSheetInfo.authPlace == null || expedientDataSheetInfo.authPlace == '' ? '' : expedientDataSheetInfo.authPlace);
            text = text.split('#109#').join(expedientDataSheetInfo.smokeOpacityLoadWeight == null || expedientDataSheetInfo.smokeOpacityLoadWeight == '' ? '' : expedientDataSheetInfo.smokeOpacityLoadWeight);
            text = text.split('#110#').join(expedientDataSheetInfo.smokeOpacityBacharachScale == null || expedientDataSheetInfo.smokeOpacityBacharachScale == '' ? '' : expedientDataSheetInfo.smokeOpacityBacharachScale);
            text = text.split('#111#').join(expedientDataSheetInfo.smokeOpacityDateReading == null || expedientDataSheetInfo.smokeOpacityDateReading == '' ? '' : moment(expedientDataSheetInfo.smokeOpacityDateReading, 'X').format('DD/MM/YYYY'));
            text = text.split('#197#').join(expedientDataSheetInfo.smokeOpacityDateReading == null || expedientDataSheetInfo.smokeOpacityDateReading == '' ? '' : moment(expedientDataSheetInfo.smokeOpacityDateReading, 'X').format('DD'));
            text = text.split('#198#').join(expedientDataSheetInfo.smokeOpacityDateReading == null || expedientDataSheetInfo.smokeOpacityDateReading == '' ? '' : moment(expedientDataSheetInfo.smokeOpacityDateReading, 'X').format('MMMM'));
            text = text.split('#199#').join(expedientDataSheetInfo.smokeOpacityDateReading == null || expedientDataSheetInfo.smokeOpacityDateReading == '' ? '' : moment(expedientDataSheetInfo.smokeOpacityDateReading, 'X').format('YYYY'));
            text = text.split('#112#').join(expedientDataSheetInfo.smokeOpacityTimeReading == null || expedientDataSheetInfo.smokeOpacityTimeReading == '' ? '' : moment(expedientDataSheetInfo.smokeOpacityTimeReading, 'X').format('HH:mm'));
            text = text.split('#208#').join(expedientDataSheetInfo.crematoriumIntroduction == null || expedientDataSheetInfo.crematoriumIntroduction == '' ? '' : (expedientDataSheetInfo.crematoriumIntroduction == '0' ? 'No' : 'Si'));
            text = text.split('#209#').join(expedientDataSheetInfo.crematoriumWaitOnRoom == null || expedientDataSheetInfo.crematoriumWaitOnRoom == '' ? '' : (expedientDataSheetInfo.crematoriumWaitOnRoom == '0' ? 'No' : 'Si'));
            text = text.split('#210#').join(expedientDataSheetInfo.crematoriumVaseBio == null || expedientDataSheetInfo.crematoriumVaseBio == '' ? '' : (expedientDataSheetInfo.crematoriumVaseBio == '0' ? 'No' : 'Si'));
            text = text.split('#211#').join(expedientDataSheetInfo.ecologicCoffin == null || expedientDataSheetInfo.ecologicCoffin == '' ? '' : (expedientDataSheetInfo.ecologicCoffin == '0' ? 'No' : 'Si'));
            text = text.split('#212#').join(expedientDataSheetInfo.crematoriumPacemaker == null || expedientDataSheetInfo.crematoriumPacemaker == '' ? '' : (expedientDataSheetInfo.crematoriumPacemaker == '0' ? 'No' : 'Si'));
            text = text.split('#213#').join(expedientDataSheetInfo.crematoriumArriveTime == null || expedientDataSheetInfo.crematoriumArriveTime == '' ? '' : moment(expedientDataSheetInfo.crematoriumArriveTime, 'X').format('HH:mm'));
            
            // "Datos de personal y libros de registro"
            text = text.split('#113#').join(expedientDataSheetInfo.funeralHomeService == null || expedientDataSheetInfo.funeralHomeService == '' ? '' : expedientDataSheetInfo.funeralHomeService);
            text = text.split('#114#').join(expedientDataSheetInfo.familyAssistanceName == null || expedientDataSheetInfo.familyAssistanceName == '' ? '' : expedientDataSheetInfo.familyAssistanceName + ' ' + expedientDataSheetInfo.familyAssistanceSurname);
            if(expedientDataSheetInfo.carCollection1 == 0){
                text = text.split('#115#').join(expedientDataSheetInfo.carCollection1Brand + ' ' + expedientDataSheetInfo.carCollection1Model);
            }else{
                text = text.split('#115#').join(expedientDataSheetInfo.carCollectionBrand == null || expedientDataSheetInfo.carCollectionBrand == '' ? '' : expedientDataSheetInfo.carCollectionBrand + ' ' + expedientDataSheetInfo.carCollectionModel);
            }
            text = text.split('#116#').join(expedientDataSheetInfo.corpseCollection1Name == null || expedientDataSheetInfo.corpseCollection1Name == '' ? '' : expedientDataSheetInfo.corpseCollection1Name + ' ' + expedientDataSheetInfo.corpseCollection1Surname);
            text = text.split('#117#').join(expedientDataSheetInfo.corpseCollection2Name == null || expedientDataSheetInfo.corpseCollection2Name == '' ? '' : expedientDataSheetInfo.corpseCollection2Name + ' ' + expedientDataSheetInfo.corpseCollection2Surname);
            if(expedientDataSheetInfo.hearse == 0){
                text = text.split('#118#').join(expedientDataSheetInfo.hearseBrandOther + ' ' + expedientDataSheetInfo.hearseModelOther);
            }else{
                text = text.split('#118#').join(expedientDataSheetInfo.hearseBrand == null || expedientDataSheetInfo.hearseBrand == '' ? '' : expedientDataSheetInfo.hearseBrand + ' ' + expedientDataSheetInfo.hearseModel);
            }
            var placeDestinationMiddle = '';
            placeDestinationMiddle += expedientDataSheetInfo.placeDestinationMiddleName == null || expedientDataSheetInfo.placeDestinationMiddleName == '' ? '' : expedientDataSheetInfo.placeDestinationMiddleName;
            placeDestinationMiddle += expedientDataSheetInfo.placeDestinationMiddleLocation == null || expedientDataSheetInfo.placeDestinationMiddleLocation == '' ? '' : ' (' + expedientDataSheetInfo.placeDestinationMiddleLocation + ')';
            text = text.split('#119#').join(placeDestinationMiddle);
            text = text.split('#120#').join(expedientDataSheetInfo.placeDestinationFinalCemeteryName == null || expedientDataSheetInfo.placeDestinationFinalCemeteryName == '' ? '' : expedientDataSheetInfo.placeDestinationFinalCemeteryName);

            // Datos de entrada
            text = text.split('#121#').join(expedientDataSheetInfo.funeralHomeName == null || expedientDataSheetInfo.funeralHomeName == '' ? '' : expedientDataSheetInfo.funeralHomeName);
            text = text.split('#122#').join(expedientDataSheetInfo.funeralHomeNif == null || expedientDataSheetInfo.funeralHomeNif == '' ? '' : expedientDataSheetInfo.funeralHomeNif);
            text = text.split('#123#').join(expedientDataSheetInfo.funeralHomePhone == null || expedientDataSheetInfo.funeralHomePhone == '' ? '' : expedientDataSheetInfo.funeralHomePhone);
            text = text.split('#124#').join(expedientDataSheetInfo.funeralHomeFax == null || expedientDataSheetInfo.funeralHomeFax == '' ? '' : expedientDataSheetInfo.funeralHomeFax);
            text = text.split('#125#').join(expedientDataSheetInfo.funeralHomeEntryDate == null || expedientDataSheetInfo.funeralHomeEntryDate == '' ? '' : moment(expedientDataSheetInfo.funeralHomeEntryDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#200#').join(expedientDataSheetInfo.funeralHomeEntryDate == null || expedientDataSheetInfo.funeralHomeEntryDate == '' ? '' : moment(expedientDataSheetInfo.funeralHomeEntryDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#201#').join(expedientDataSheetInfo.funeralHomeEntryDate == null || expedientDataSheetInfo.funeralHomeEntryDate == '' ? '' : moment(expedientDataSheetInfo.funeralHomeEntryDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#202#').join(expedientDataSheetInfo.funeralHomeEntryDate == null || expedientDataSheetInfo.funeralHomeEntryDate == '' ? '' : moment(expedientDataSheetInfo.funeralHomeEntryDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#126#').join(expedientDataSheetInfo.funeralHomeEntryTime == null || expedientDataSheetInfo.funeralHomeEntryTime == '' ? '' : moment(expedientDataSheetInfo.funeralHomeEntryTime, 'HH:mm:ss').format('HH:mm'));
            
            var coffin = '';
            if(expedientDataSheetInfo.coffin != null && expedientDataSheetInfo.coffin != ''){
                switch(expedientDataSheetInfo.coffin){
                    case '0':
                        coffin = 'Féretro Común';
                    break;
                    case '1':
                        coffin = 'Féretro de Traslado';
                    break;
                    case '2':
                        coffin = 'Féretro Incinerar Ecológico';
                    break;
                    case '3':
                        coffin = expedientDataSheetInfo.otherCoffin;
                    break;
                    case '4':
                        coffin = 'Camilla de Recogida';
                    break;
                    case '5':
                        coffin = 'Caja de Restos';
                    break;
                    case '6':
                        coffin = 'Arca de Traslado';
                    break;
                }
            }

            text = text.split('#127#').join(coffin);
            text = text.split('#128#').join(expedientDataSheetInfo.tanatologicalPractice == null || expedientDataSheetInfo.tanatologicalPractice == '' ? '' : (
                expedientDataSheetInfo.tanatologicalPractice == '0' ?
                '' : (
                    expedientDataSheetInfo.tanatologicalPractice == '1' ?
                    'tanatoestética' : (
                        expedientDataSheetInfo.tanatologicalPractice == '2' ?
                        'tanatopraxia' : (
                            expedientDataSheetInfo.tanatologicalPractice == '3' ?
                            'embalsamamiento' :
                            'conservación'
                        )
                    )
                )
            ));
            text = text.split('#129#').join(expedientDataSheetInfo.responsibleUserName == null || expedientDataSheetInfo.responsibleUserName == '' ? '' : expedientDataSheetInfo.responsibleUserName + ' ' + expedientDataSheetInfo.responsibleUserSurname);
            text = text.split('#130#').join(expedientDataSheetInfo.responsibleUserNif == null || expedientDataSheetInfo.responsibleUserNif == '' ? '' : expedientDataSheetInfo.responsibleUserNif);

            text = text.split('#263#').join(expedientDataSheetInfo.refrigeratedChamberName == null || expedientDataSheetInfo.refrigeratedChamberName == '' ? '' : expedientDataSheetInfo.refrigeratedChamberName);
            text = text.split('#264#').join(expedientDataSheetInfo.refrigeratedChamberDateStart == null || expedientDataSheetInfo.refrigeratedChamberDateStart == '' ? '' : moment(expedientDataSheetInfo.refrigeratedChamberDateStart, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#265#').join(expedientDataSheetInfo.refrigeratedChamberTimeStart == null || expedientDataSheetInfo.refrigeratedChamberTimeStart == '' ? '' : moment(expedientDataSheetInfo.refrigeratedChamberTimeStart, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#266#').join(expedientDataSheetInfo.refrigeratedChamberDateEnd == null || expedientDataSheetInfo.refrigeratedChamberDateEnd == '' ? '' : moment(expedientDataSheetInfo.refrigeratedChamberDateEnd, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#267#').join(expedientDataSheetInfo.refrigeratedChamberTimeEnd == null || expedientDataSheetInfo.refrigeratedChamberTimeEnd == '' ? '' : moment(expedientDataSheetInfo.refrigeratedChamberTimeEnd, 'HH:mm:ss').format('HH:mm'));

            text = text.split('#214#').join(expedientDataSheetInfo.covid == null || expedientDataSheetInfo.covid == '' ? '' : (expedientDataSheetInfo.covid == '0' ? 'No' : 'Si'));
            text = text.split('#215#').join(expedientDataSheetInfo.moveJudicial == null || expedientDataSheetInfo.moveJudicial == '' ? '' : (expedientDataSheetInfo.moveJudicial == '0' ? 'No' : 'Si'));
            text = text.split('#216#').join(expedientDataSheetInfo.moveTraslado == null || expedientDataSheetInfo.moveTraslado == '' ? '' : (expedientDataSheetInfo.moveTraslado == '0' ? 'No' : 'Si'));
            text = text.split('#217#').join(expedientDataSheetInfo.moveDevolucion == null || expedientDataSheetInfo.moveDevolucion == '' ? '' : (expedientDataSheetInfo.moveDevolucion == '0' ? 'No' : 'Si'));
            
            // "Datos de traslado"
            text = text.split('#131#').join(expedientDataSheetInfo.moveFuneralHomeName == null || expedientDataSheetInfo.moveFuneralHomeName == '' ? '' : expedientDataSheetInfo.moveFuneralHomeName);
            text = text.split('#132#').join(expedientDataSheetInfo.moveFuneralHomeNif == null || expedientDataSheetInfo.moveFuneralHomeNif == '' ? '' : expedientDataSheetInfo.moveFuneralHomeNif);
            text = text.split('#133#').join(expedientDataSheetInfo.moveFuneralHomePhone == null || expedientDataSheetInfo.moveFuneralHomePhone == '' ? '' : expedientDataSheetInfo.moveFuneralHomePhone);
            text = text.split('#134#').join(expedientDataSheetInfo.moveFuneralHomeFax == null || expedientDataSheetInfo.moveFuneralHomeFax == '' ? '' : expedientDataSheetInfo.moveFuneralHomeFax);
            text = text.split('#135#').join(expedientDataSheetInfo.moveContactPerson == null || expedientDataSheetInfo.moveContactPerson == '' ? '' : expedientDataSheetInfo.moveContactPerson);
            text = text.split('#136#').join(expedientDataSheetInfo.moveContactPhone == null || expedientDataSheetInfo.moveContactPhone == '' ? '' : expedientDataSheetInfo.moveContactPhone);
            text = text.split('#137#').join(expedientDataSheetInfo.moveFuneralHomeAddress == null || expedientDataSheetInfo.moveFuneralHomeAddress == '' ? '' : expedientDataSheetInfo.moveFuneralHomeAddress);
            text = text.split('#138#').join(expedientDataSheetInfo.moveLeavingDate == null || expedientDataSheetInfo.moveLeavingDate == '' ? '' : moment(expedientDataSheetInfo.moveLeavingDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            text = text.split('#203#').join(expedientDataSheetInfo.moveLeavingDate == null || expedientDataSheetInfo.moveLeavingDate == '' ? '' : moment(expedientDataSheetInfo.moveLeavingDate, 'YYYY-MM-DD').format('DD'));
            text = text.split('#204#').join(expedientDataSheetInfo.moveLeavingDate == null || expedientDataSheetInfo.moveLeavingDate == '' ? '' : moment(expedientDataSheetInfo.moveLeavingDate, 'YYYY-MM-DD').format('MMMM'));
            text = text.split('#205#').join(expedientDataSheetInfo.moveLeavingDate == null || expedientDataSheetInfo.moveLeavingDate == '' ? '' : moment(expedientDataSheetInfo.moveLeavingDate, 'YYYY-MM-DD').format('YYYY'));
            text = text.split('#139#').join(expedientDataSheetInfo.moveLeavingTime == null || expedientDataSheetInfo.moveLeavingTime == '' ? '' : moment(expedientDataSheetInfo.moveLeavingTime, 'HH:mm:ss').format('HH:mm'));
            text = text.split('#140#').join(expedientDataSheetInfo.moveCollectionProvince == null || expedientDataSheetInfo.moveCollectionProvince == '' ? '' : expedientDataSheetInfo.moveCollectionProvince);
            text = text.split('#141#').join(expedientDataSheetInfo.moveCollectionLocation == null || expedientDataSheetInfo.moveCollectionLocation == '' ? '' : expedientDataSheetInfo.moveCollectionLocation);
            text = text.split('#261#').join(expedientDataSheetInfo.moveCollectionPostalCode == null || expedientDataSheetInfo.moveCollectionPostalCode == '' ? '' : expedientDataSheetInfo.moveCollectionPostalCode);
            text = text.split('#142#').join(expedientDataSheetInfo.moveCollectionAddress == null || expedientDataSheetInfo.moveCollectionAddress == '' ? '' : expedientDataSheetInfo.moveCollectionAddress);
            text = text.split('#143#').join(expedientDataSheetInfo.moveDestinationProvince == null || expedientDataSheetInfo.moveDestinationProvince == '' ? '' : expedientDataSheetInfo.moveDestinationProvince);
            text = text.split('#144#').join(expedientDataSheetInfo.moveDestinationLocation == null || expedientDataSheetInfo.moveDestinationLocation == '' ? '' : expedientDataSheetInfo.moveDestinationLocation);
            text = text.split('#262#').join(expedientDataSheetInfo.moveDestinationPostalCode == null || expedientDataSheetInfo.moveDestinationPostalCode == '' ? '' : expedientDataSheetInfo.moveDestinationPostalCode);
            text = text.split('#145#').join(expedientDataSheetInfo.moveDestinationAddress == null || expedientDataSheetInfo.moveDestinationAddress == '' ? '' : expedientDataSheetInfo.moveDestinationAddress);
            text = text.split('#146#').join(expedientDataSheetInfo.moveVia == null || expedientDataSheetInfo.moveVia == '' ? '' : (
                expedientDataSheetInfo.moveVia == '0' ? 'Carretera' : 'Avión'
            ));
            text = text.split('#147#').join(expedientDataSheetInfo.moveFinalDestination == null || expedientDataSheetInfo.moveFinalDestination == '' ? '' : expedientDataSheetInfo.moveFinalDestination);
            var hearse = '';
            if(expedientDataSheetInfo.hearse == 0){
                hearse += expedientDataSheetInfo.hearseLicensePlateOther == null || expedientDataSheetInfo.hearseLicensePlateOther == '' ? '' : expedientDataSheetInfo.hearseLicensePlateOther;
                hearse += expedientDataSheetInfo.hearseBrandOther == null || expedientDataSheetInfo.hearseBrandOther == '' ? '' : ' - ' + expedientDataSheetInfo.hearseBrandOther;
                hearse += expedientDataSheetInfo.hearseModelOther == null || expedientDataSheetInfo.hearseModelOther == '' ? '' : ' - ' + expedientDataSheetInfo.hearseModelOther;
            }else{
                hearse += expedientDataSheetInfo.hearseLicensePlate == null || expedientDataSheetInfo.hearseLicensePlate == '' ? '' : expedientDataSheetInfo.hearseLicensePlate;
                hearse += expedientDataSheetInfo.hearseBrand == null || expedientDataSheetInfo.hearseBrand == '' ? '' : ' - ' + expedientDataSheetInfo.hearseBrand;
                hearse += expedientDataSheetInfo.hearseModel == null || expedientDataSheetInfo.hearseModel == '' ? '' : ' - ' + expedientDataSheetInfo.hearseModel;
            }
            text = text.split('#148#').join(hearse);
            text = text.split('#149#').join(expedientDataSheetInfo.staffTransfer1Name == null || expedientDataSheetInfo.staffTransfer1Name == '' ? '' : expedientDataSheetInfo.staffTransfer1Name);
            text = text.split('#150#').join(expedientDataSheetInfo.staffTransfer2Name == null || expedientDataSheetInfo.staffTransfer2Name == '' ? '' : expedientDataSheetInfo.staffTransfer2Name);
            text = text.split('#151#').join(expedientDataSheetInfo.flightNumber == null || expedientDataSheetInfo.flightNumber == '' ? '' : expedientDataSheetInfo.flightNumber);
            text = text.split('#152#').join(expedientDataSheetInfo.airportOrigin == null || expedientDataSheetInfo.airportOrigin == '' ? '' : expedientDataSheetInfo.airportOrigin);
            text = text.split('#249#').join(expedientDataSheetInfo.departureDate == null || expedientDataSheetInfo.departureDate == '' ? '' : moment(expedientDataSheetInfo.departureDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
            text = text.split('#153#').join(expedientDataSheetInfo.departureTime == null || expedientDataSheetInfo.departureTime == '' ? '' : moment(expedientDataSheetInfo.departureTime, "X").format("HH:mm"));
            text = text.split('#154#').join(expedientDataSheetInfo.arrivalAirport == null || expedientDataSheetInfo.arrivalAirport == '' ? '' : expedientDataSheetInfo.arrivalAirport);
            text = text.split('#248#').join(expedientDataSheetInfo.arrivalDate == null || expedientDataSheetInfo.arrivalDate == '' ? '' : moment(expedientDataSheetInfo.arrivalDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
            text = text.split('#155#').join(expedientDataSheetInfo.arrivalTime == null || expedientDataSheetInfo.arrivalTime == '' ? '' : moment(expedientDataSheetInfo.arrivalTime, "X").format("HH:mm"));
            text = text.split('#250#').join(expedientDataSheetInfo.agency == null || expedientDataSheetInfo.agency == '' ? '' : expedientDataSheetInfo.agency);
            text = text.split('#251#').join(expedientDataSheetInfo.agencyContact == null || expedientDataSheetInfo.agencyContact == '' ? '' : expedientDataSheetInfo.agencyContact);
            text = text.split('#252#').join(expedientDataSheetInfo.agencyContactPhone == null || expedientDataSheetInfo.agencyContactPhone == '' ? '' : expedientDataSheetInfo.agencyContactPhone);
            text = text.split('#156#').join(expedientDataSheetInfo.moveNotes == null || expedientDataSheetInfo.moveNotes == '' ? '' : expedientDataSheetInfo.moveNotes);
            
            // "Observaciones"
            text = text.split('#223#').join(expedientDataSheetInfo.notesExpedient == null || expedientDataSheetInfo.notesExpedient == '' ? '' : expedientDataSheetInfo.notesExpedient);
            
            // "Orden de Trabajo"
            text = text.split('#268#').join(expedientDataSheetInfo.workOrderArkEmbalmmentDate == null || expedientDataSheetInfo.workOrderArkEmbalmmentDate == '' ? '' : moment(expedientDataSheetInfo.workOrderArkEmbalmmentDate, "X").format("DD/MM/YYYY"));
            text = text.split('#269#').join(expedientDataSheetInfo.workOrderArkEmbalmmentTime == null || expedientDataSheetInfo.workOrderArkEmbalmmentTime == '' ? '' : moment(expedientDataSheetInfo.workOrderArkEmbalmmentTime, "X").format("HH:mm"));
            text = text.split('#270#').join(expedientDataSheetInfo.workOrderArkCTransientDate == null || expedientDataSheetInfo.workOrderArkCTransientDate == '' ? '' : moment(expedientDataSheetInfo.workOrderArkCTransientDate, "X").format("DD/MM/YYYY"));
            text = text.split('#271#').join(expedientDataSheetInfo.workOrderArkCTransientTime == null || expedientDataSheetInfo.workOrderArkCTransientTime == '' ? '' : moment(expedientDataSheetInfo.workOrderArkCTransientTime, "X").format("HH:mm"));
            text = text.split('#272#').join(expedientDataSheetInfo.workOrderArkClothes == null || expedientDataSheetInfo.workOrderArkClothes == '' ? '' : expedientDataSheetInfo.workOrderArkClothes);
            text = text.split('#273#').join(expedientDataSheetInfo.workOrderArkAesthetics == null || expedientDataSheetInfo.workOrderArkAesthetics == '' ? '' : expedientDataSheetInfo.workOrderArkAesthetics);
            text = text.split('#274#').join(expedientDataSheetInfo.workOrderArkName == null || expedientDataSheetInfo.workOrderArkName == '' ? '' : expedientDataSheetInfo.workOrderArkName);
            text = text.split('#275#').join(expedientDataSheetInfo.workOrderArkClothesRosary == null || expedientDataSheetInfo.workOrderArkClothesRosary == '' ? '' : (expedientDataSheetInfo.workOrderArkClothesRosary == '0' ? 'No' : 'Si'));
            text = text.split('#276#').join(expedientDataSheetInfo.workOrderArkCross == null || expedientDataSheetInfo.workOrderArkCross == '' ? '' : (expedientDataSheetInfo.workOrderArkCross == '0' ? 'No' : 'Si'));
            text = text.split('#277#').join(expedientDataSheetInfo.workOrderArkJesus == null || expedientDataSheetInfo.workOrderArkJesus == '' ? '' : (expedientDataSheetInfo.workOrderArkJesus == '0' ? 'No' : 'Si'));
            text = text.split('#279#').join(expedientDataSheetInfo.workOrderInhumationIronCross == null || expedientDataSheetInfo.workOrderInhumationIronCross == '' ? '' : (expedientDataSheetInfo.workOrderInhumationIronCross == '0' ? 'No' : 'Si'));
            
            var workOrderPressItems = '';
            $.each(expedientDataSheetInfo.workOrderCommunication, function(indexPress, itPress){
                workOrderPressItems += itPress.product_name + ' Tamaño: ' + itPress.model_name + ' Fecha: ' + (itPress.date != null ? moment(itPress.date, "X").format("DD/MM/YYYY") : '-') + ' Foto: ' + (itPress.photo == 1 ? 'Si' : 'No') + '\n';
            })
            text = text.split('#278#').join(workOrderPressItems);
            
            var styleText = {
                fontFamily: $(this)[0].fontFamily(),
                fontSize: $(this)[0].fontSize(),
                fontStyle: $(this)[0].fontStyle(),
                fontVariant: $(this)[0].fontVariant(),
                textDecoration: $(this)[0].textDecoration(),
                text: text,
                align: $(this)[0].align(),
                verticalAlign: $(this)[0].verticalAlign(),
                padding: $(this)[0].padding(),
                lineHeight: $(this)[0].lineHeight(),
                wrap: $(this)[0].wrap(),
                ellipsis: $(this)[0].ellipsis()
            }
    
            drawText(optionsText, styleText);

            maxZIndexValue++;
        })
        auxTexts.push([currentPage, texts]);
        
        // Figures
        var figures = elem[1].find('.figure');
        $.each(figures, function(){
            var type = $(this)[0].getClassName();
            switch(type){
                case 'Rect':
                    var options = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        width: $(this)[0].width(),
                        height: $(this)[0].height(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }

                    drawRectangle(options);
                break;
                case 'Circle':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        radius: $(this)[0].radius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
                    
                    drawCircle(optionsFigure);
                break;
                case 'Ellipse':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        radiusX: $(this)[0].radiusX(),
                        radiusY: $(this)[0].radiusY(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawEllipse(optionsFigure);
                break;
                case 'Wedge':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        radius: $(this)[0].radius(),
                        angle: $(this)[0].angle(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        rotation: $(this)[0].rotation(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawWedge(optionsFigure);
                break;
                case 'Line':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        points: $(this)[0].points(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        lineCap: $(this)[0].lineCap(),
                        lineJoin: $(this)[0].lineJoin(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawLine(optionsFigure);
                break;
                case 'Star':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        numPoints: $(this)[0].numPoints(),
                        innerRadius: $(this)[0].innerRadius(),
                        outerRadius: $(this)[0].outerRadius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawStar(optionsFigure);
                break;
                case 'Ring':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        innerRadius: $(this)[0].innerRadius(),
                        outerRadius: $(this)[0].outerRadius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawRing(optionsFigure);
                break;
                case 'Arc':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        innerRadius: $(this)[0].innerRadius(),
                        outerRadius: $(this)[0].outerRadius(),
                        angle: $(this)[0].angle(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawArc(optionsFigure);
                break;
                case 'RegularPolygon':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        sides: $(this)[0].sides(),
                        radius: $(this)[0].radius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }

                    drawPolygon(optionsFigure);
                break;
                case 'Arrow':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        points: $(this)[0].points(),
                        pointerLength: $(this)[0].pointerLength(),
                        pointerWidth: $(this)[0].pointerWidth(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawArrow(optionsFigure);
                break;
            }

            if($(this)[0].id().match(/addFigure/)){
                if(addFigureIndex < parseInt($(this)[0].id().split('addFigure')[1])){
                    addFigureIndex = parseInt($(this)[0].id().split('addFigure')[1]) + 1;
                }else{
                    addFigureIndex++;
                }
            }

            maxZIndexValue++;
        })
        auxFigures.push([currentPage, figures]);

        // Images
        var images = null;
        var cont = null;
        $.ajax({
            url: uri + 'core/expedients/documentsEditor/scandir.php',
            method: 'POST',
            data: {
                expedient: expedientID,
                doc: documentID
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    images = data[0]
                    cont = data[1]
                }catch(e){
                    images = null
                    cont = 0
                }
            },
            error: function(){
                images = null
                cont = 0
            }
        })

        var imgs = elem[1].find('.image');
        if(images != null){
            $.each(imgs, function(){
                var optionsImg = {
                    x: $(this)[0].x(),
                    y: $(this)[0].y(),
                    width: $(this)[0].width(),
                    height: $(this)[0].height(),
                    id: $(this)[0].id(),
                    draggable: $(this)[0].draggable(),
                    name: $(this)[0].name(),
                    src: uri + 'resources/files/' + COMPANY + '/expedients/' + expedientID + '/documentsEditor/' + documentID + '/img/' + images[$(this)[0].id()],
                    mouse: true,
                    rotation: $(this)[0].rotation(),
                    scaleX: $(this)[0].scaleX(),
                    scaleY: $(this)[0].scaleY(),
                    blurRadius: $(this)[0].blurRadius(),
                    brightness: $(this)[0].brightness(),
                    contrast: $(this)[0].contrast(),
                    embossStrength: $(this)[0].embossStrength(),
                    embossBlend: $(this)[0].embossBlend(),
                    enhance: $(this)[0].enhance(),
                    noise: $(this)[0].noise(),
                    pixelate: $(this)[0].pixelSize(),
                    opacity: $(this)[0].opacity()
                }
    
                drawImage(optionsImg, currentPage);
            })
        }
        imagesCont = parseInt(cont);
        auxImages.push([currentPage, imgs]);

        maxZIndex[currentPage] = maxZIndexValue;
    })

    // Modifica el z-index de cada elemento
    setTimeout(() => {
        // Textos
        $.each(auxTexts, function(index, elem){
            $.each(elem[1], function(i, item){
                if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                    stages[elem[0]].find('#' + item.id())[0].zIndex(item.zIndex());
                }
            })
        })

        // Figuras
        $.each(auxFigures, function(index, elem){
            $.each(elem[1], function(i, item){
                if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                    stages[elem[0]].find('#' + item.id())[0].zIndex(item.zIndex());
                }
            })
        })

        // Images
        $.each(auxImages, function(index, elem){
            $.each(elem[1], function(i, item){
                if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                    stages[elem[0]].find('#' + item.id())[0].zIndex(item.zIndex());
                }
            })
        })

        var json = new Object;

        var i = 0;
        $.each(stages, function(index, elem){
            if(elem != undefined){
                json[i] = elem.toJSON();
                i++;
            }
        })

        states.push(json);

        $.each(stages, function(index, elem){
            elem.draw();
        })

        $('.main').removeClass('hide');
        flagUndoRedo = false;
        currentPage = 0;
    }, 1250);

    // Acciones
    unselectElement();

    // Navegador lateral
    // Elementos
    toAddText();
    toAddSign();
    toAddRectangle();
    toAddCircle();
    toAddEllipse();
    toAddWedge();
    toAddLine();
    toAddStar();
    toAddRing();
    toAddArc();
    toAddPolygon();
    toAddArrow();

    // Opciones
    toFillColor();
    toStrokeColor();
    changeOptions();

    // Acciones
    toDelete();
    toUndo();
    toRedo();
    toLayerPlus();
    toLayerMinus();

    // Texto
    toBold();
    toItalic();
    toUnderline();
    toLineThrough();
    toAlignLeft();
    toAlignCenter();
    toAlignRight();
    toAlignJustify();
    fillFontFamily();
    toFontFamily();
    fillFontSize();
    toFontSize();
    toFontColor();
    fillLineHeight();
    toLineHeight();

    // Imágenes
    openImageModal();
    uploadImage();
    uploadImageGallery();
    
    // Teclado
    keyboardActions();
    showHelp();
    showExpedientInfo();

    // Footer
    hardReload();
}

/**
 * Guardado de datos y descarga de pdf
 */
function save(){
	$('#download').click(function(){

        // Confirm overwrite document signed
        if(parseInt(documentInfo.isSigned) == 1 && confirmSave == false){
            confirmSave = true;
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                save();
            }
        }

        if(!saveClick){
            saveClick = true

            $('#modal-download').modal('show');

            setTimeout(() => {
                // Elimina todas las transformaciones
                $.ajax({
                    url: uri + 'core/expedients/documentsEditor/preSave.php',
                    method: 'POST',
                    data: {
                        document: documentID,
                        expedient: expedientID,
                        stamp: stamp
                    },
                    async: false,
                    dataType: 'json',
                    success: function(data){
                        if(data){
                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    elem.find('Transformer').destroy();
                                }
                            })
                            
                            $.each(gridLayers, function(index, elem){
                                if(elem != undefined){
                                    elem.hide();
                                }
                            })

                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    elem.draw();
                                }
                            })

                            if(selected != null){
                                selected.setDraggable(false);
                            }
                            selected = null;

                            var images = new Array;
                            var signs = new Array;
                            var signsToShow = new Array;
                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    // Sign positions
                                    signs[index] = new Array;

                                    $.each(elem.children[0].children, function(idx, item){
                                        if(item.attrs.id.match(/addSign/)){
                                            item.hide();

                                            signs[index].push({
                                                x: item.attrs.x,
                                                y: item.attrs.y
                                            })

                                            signsToShow.push(item);
                                        }
                                    })

                                    var canvas = elem.toCanvas({ pixelRatio: 2 });
                                    var ctx = canvas.getContext("2d");

                                    ctx.globalCompositeOperation = 'destination-over';
                                    ctx.fillStyle = '#ffffff';
                                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                                    var dataURL = canvas.toDataURL("image/png");

                                    images.push(dataURL);
                                }
                            })

                            var json = new Object;
                            var i = 0;
                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    json[i] = elem.toJSON();
                                    i++;
                                }
                            })

                            $.each(signsToShow, function(index, elem){
                                elem.show();
                            })

                            $.each(gridLayers, function(index, elem){
                                if(elem != undefined){
                                    elem.show();
                                }
                            })

                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    elem.draw();
                                }
                            })

                            $.ajax({
                                url: uri + 'core/expedients/documentsEditor/save.php',
                                method: 'POST',
                                data: {
                                    document: documentID,
                                    expedient: expedientID,
                                    images: images,
                                    json: json,
                                    pageSize: pageSize,
                                    stamp: stamp,
                                    signs: signs.length == 0 ? '' : signs
                                },
                                async: true,
                                success: function(data){
                                    try{
                                        url = $.parseJSON(data);
                                        saveAction(true);
                                        imagesUnsaveToDelete = [];
                                        saveState = currentState;
                                        saveClick = false;
                    
                                        window.open(uri + 'descargar-archivo?file=expedients/' + expedientID + '/documentsEditor/' + documentID + '/files/documento.pdf', '_blank');
                                    }catch(e){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                        setTimeout(function(){
                                            $('#block-message').empty();
                                        }, 5000);
                                    }
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty();
                                    }, 5000);
                                }
                            })
                        }
                    }
                })
    
                setTimeout(() => {
                    $('#modal-download').modal('hide');
                }, 3000);
            }, 500);
        }

        confirmSave = false;
    })
}

/**
 * Guardado de datos
 */
function onlySave(){
	$('#save').click(function(){

        // Confirm overwrite document signed
        if(parseInt(documentInfo.isSigned) == 1 && confirmSave == false){
            confirmSave = true;
            if(confirm("Va a editar un documento firmado. Si continúa, perderá la firma")){
                onlySave();
            }
        }

        if(!saveClick){
            saveClick = true

            $('#modal-save').modal('show');

            setTimeout(() => {
                // Elimina todas las transformaciones
                $.ajax({
                    url: uri + 'core/expedients/documentsEditor/preSave.php',
                    method: 'POST',
                    data: {
                        document: documentID,
                        expedient: expedientID,
                        stamp: stamp
                    },
                    async: false,
                    dataType: 'json',
                    success: function(data){
                        if(data){
                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    elem.find('Transformer').destroy();
                                }
                            })
                            
                            $.each(gridLayers, function(index, elem){
                                if(elem != undefined){
                                    elem.hide();
                                }
                            })

                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    elem.draw();
                                }
                            })
                            if(selected != null){
                                selected.setDraggable(false);
                            }
                            selected = null;

                            var images = new Array;
                            var signs = new Array;
                            var signsToShow = new Array;
                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    // Sign positions
                                    signs[index] = new Array;

                                    $.each(elem.children[0].children, function(idx, item){
                                        if(item.attrs.id.match(/addSign/)){
                                            item.hide();

                                            signs[index].push({
                                                x: item.attrs.x,
                                                y: item.attrs.y
                                            })

                                            signsToShow.push(item);
                                        }
                                    })

                                    var canvas = elem.toCanvas({ pixelRatio: 2 });
                                    var ctx = canvas.getContext("2d");

                                    ctx.globalCompositeOperation = 'destination-over';
                                    ctx.fillStyle = '#ffffff';
                                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                                    var dataURL = canvas.toDataURL("image/png");

                                    images.push(dataURL);
                                }
                            })

                            var json = new Object;
                            var i = 0;
                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    json[i] = elem.toJSON();
                                    i++;
                                }
                            })

                            $.each(signsToShow, function(index, elem){
                                elem.show();
                            })

                            $.each(gridLayers, function(index, elem){
                                if(elem != undefined){
                                    elem.show();
                                }
                            })

                            $.each(stages, function(index, elem){
                                if(elem != undefined){
                                    elem.draw();
                                }
                            })

                            $.ajax({
                                url: uri + 'core/expedients/documentsEditor/save.php',
                                method: 'POST',
                                data: {
                                    document: documentID,
                                    expedient: expedientID,
                                    images: images,
                                    json: json,
                                    pageSize: pageSize,
                                    stamp: stamp,
                                    signs: signs.length == 0 ? '' : signs
                                },
                                async: true,
                                success: function(data){
                                    try{
                                        url = $.parseJSON(data);
                                        saveAction(true);
                                        imagesUnsaveToDelete = [];
                                        saveState = currentState;
                                        saveClick = false;
                    
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 500);
                                    }catch(e){
                                        $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                        setTimeout(function(){
                                            $('#block-message').empty();
                                        }, 5000);

                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 500);
                                    }
                                },
                                error: function(){
                                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                                    setTimeout(function(){
                                        $('#block-message').empty();
                                    }, 5000);

                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 500);
                                }
                            })
                        }
                    }
                })
            }, 500);
        }

        confirmSave = false;
    })
}

/**
 * Elimina un elemento
 */
function removeElement(){
    if(selected.name() == 'image'){
        // Delete file on server when remove on stage
        var data = {
            expedient: expedientID,
            doc: documentID,
            filename: selected.id(),
            stamp: stamp
        }
        $.ajax({
            url: uri + 'core/expedients/documentsEditor/remove.php',
            method: 'POST',
            data: data,
            async: false
        })

        imagesToDelete.push(selected.id());
        
        selected.destroy();
        stages[currentPage].find('Transformer').destroy();
        layers[currentPage].draw();
        selected = null;
        imagesCont--;
    }else{
        selected.destroy();
        stages[currentPage].find('Transformer').destroy();
        layers[currentPage].draw();
        selected = null;
    }

    saveAction(false);
    maxZIndex[currentPage]--;

    cleanActions();
    cleanOptions();
}

/**
 * Sube una imagen
 */
function uploadImage(){
    $('#uploadImage').click(function(){
        if(document.getElementById('image').files.length == 0){
            $('#emptyError').removeClass('hide');
        }else{
            $('#emptyError').addClass('hide');

            var file = document.getElementById('image').files[0];
    
            var filename = file.name.split('.');
            var extension = filename[filename.length - 1];
            
            switch(extension.toLowerCase()){
                case 'png':
                    $('#formatError').addClass('hide');
                break;
                default:
                    $('#formatError').removeClass('hide');
                    return false;
                break;
            }
    
            var data = new FormData;
            data.append('expedient', expedientID);
            data.append('doc', documentID);
            data.append('file', file);
            data.append('cont', imagesCont);
            data.append('stamp', stamp);
            
            $.ajax({
                url: uri + 'core/expedients/documentsEditor/upload.php',
                method: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        if(data != 'error'){
                            var optionsImg = {
                                x: 50,
                                y: 50,
                                width: null,
                                height: null,
                                id: 'image_' + imagesCont,
                                draggable: true,
                                name: 'image',
                                src: uri + data[2] + '?v=' + moment().format('X'),
                                mouse: true,
                                rotation: null,
                                scaleX: null,
                                scaleY: null,
                                blurRadius: 0,
                                brightness: 0,
                                contrast: 0,
                                embossStrength: 0,
                                embossBlend: true,
                                enhance: 0,
                                noise: 0,
                                pixelate: 1,
                                opacity: 1
                            }

                            drawImage(optionsImg);
                            
                            imagesUnsaveToDelete.push('image_' + imagesCont);
                            imagesCont++;

                            setTimeout(() => {
                                saveAction(false);
                            }, 250)
                            maxZIndex[currentPage]++;
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

            $('#image').val('')
    
            $('#modal-upload-file').modal('hide')
        }
    })
}

/**
 * Sube una imagen y la añade a la galería
 */
function uploadImageGallery(){
    $('#uploadImageGallery').click(function(){
        if(document.getElementById('image').files.length == 0){
            $('#emptyError').removeClass('hide');
        }else{
            $('#emptyError').addClass('hide');

            var file = document.getElementById('image').files[0];
    
            var filename = file.name.split('.');
            var extension = filename[filename.length - 1];
            
            switch(extension.toLowerCase()){
                case 'png':
                    $('#formatError').addClass('hide');
                break;
                default:
                    $('#formatError').removeClass('hide');
                    return false;
                break;
            }
    
            var data = new FormData;
            data.append('expedient', expedientID);
            data.append('doc', documentID);
            data.append('file', file);
            data.append('cont', imagesCont);
            data.append('stamp', stamp);
            
            $.ajax({
                url: uri + 'core/expedients/documentsEditor/uploadGallery.php',
                method: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data)

                        if(data != 'error'){
                            var optionsImg = {
                                x: 50,
                                y: 50,
                                width: null,
                                height: null,
                                id: 'image_' + imagesCont,
                                draggable: true,
                                name: 'image',
                                src: uri + data[2] + '?v=' + moment().format('X'),
                                mouse: true,
                                rotation: null,
                                scaleX: null,
                                scaleY: null,
                                blurRadius: 0,
                                brightness: 0,
                                contrast: 0,
                                embossStrength: 0,
                                embossBlend: true,
                                enhance: 0,
                                noise: 0,
                                pixelate: 1,
                                opacity: 1
                            }

                            drawImage(optionsImg);
                            
                            imagesUnsaveToDelete.push('image_' + imagesCont);
                            imagesCont++;

                            setTimeout(() => {
                                saveAction(false);
                            }, 250)
                            maxZIndex[currentPage]++;
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

            $('#image').val('')
    
            $('#modal-upload-file').modal('hide')
        }
    })
}

/**
 * Vuelve a pintar el escenario después de deshacer/rehacer
 */
function redraw(){
    flagUndoRedo = true;
    $('#blockCanvas').removeClass('hide');
    $('.main').addClass('hide');

    var auxStages = new Array;
    $.each(stages, function(index, elem){
        if(elem != undefined){
            elem.destroy();
            if(states[currentState][index] == undefined){
                $('#deletePage' + index).click();
            }else{
                auxStages.push([index, Konva.Node.create(states[currentState][index], 'pageAux' + index)]);
            }
        }
    })

    $.each(stages, function(index, elem){
        if(elem != undefined){
            initScene(index);
        }
    })

    var auxTexts = new Array;
    var auxFigures = new Array;
    var auxImages = new Array;
    addTextIndex = 0;
    addSignIndex = 0;
    addFigureIndex = 0;
    $.each(auxStages, function(index, elem){
        currentPage = elem[0];

        var maxZIndexValue = 0;

        // Texts
        var texts = elem[1].find('.text');
        $.each(texts, function(){
            var optionsText = {
                x: $(this)[0].x(),
                y: $(this)[0].y(),
                height: $(this)[0].height(),
                width: $(this)[0].width(),
                name: $(this)[0].name(),
                id: $(this)[0].id(),
                draggable: $(this)[0].draggable(),
                fill: $(this)[0].fill(),
                opacity: $(this)[0].opacity(),
                rotation: $(this)[0].rotation(),
                editable: true
            }

            if($(this)[0].id().match(/addText/)){
                if(addTextIndex < parseInt($(this)[0].id().split('addText')[1])){
                    addTextIndex = parseInt($(this)[0].id().split('addText')[1]) + 1;
                }else{
                    addTextIndex++;
                }
            }else if($(this)[0].id().match(/addSign/)){
                if(addSignIndex < parseInt($(this)[0].id().split('addSign')[1])){
                    addSignIndex = parseInt($(this)[0].id().split('addSign')[1]) + 1;
                }else{
                    addSignIndex++;
                }
                optionsText.editable = false;
            }
    
            var styleText = {
                fontFamily: $(this)[0].fontFamily(),
                fontSize: $(this)[0].fontSize(),
                fontStyle: $(this)[0].fontStyle(),
                fontVariant: $(this)[0].fontVariant(),
                textDecoration: $(this)[0].textDecoration(),
                text: $(this)[0].text(),
                align: $(this)[0].align(),
                verticalAlign: $(this)[0].verticalAlign(),
                padding: $(this)[0].padding(),
                lineHeight: $(this)[0].lineHeight(),
                wrap: $(this)[0].wrap(),
                ellipsis: $(this)[0].ellipsis()
            }

            drawText(optionsText, styleText);

            maxZIndexValue++;
        })
        auxTexts.push([currentPage, texts]);
        
        // Figures
        var figures = elem[1].find('.figure');
        $.each(figures, function(){
            var type = $(this)[0].getClassName();
            switch(type){
                case 'Rect':
                    var options = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        width: $(this)[0].width(),
                        height: $(this)[0].height(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }

                    drawRectangle(options);
                break;
                case 'Circle':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        radius: $(this)[0].radius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
                    
                    drawCircle(optionsFigure);
                break;
                case 'Ellipse':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        radiusX: $(this)[0].radiusX(),
                        radiusY: $(this)[0].radiusY(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawEllipse(optionsFigure);
                break;
                case 'Wedge':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        radius: $(this)[0].radius(),
                        angle: $(this)[0].angle(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        rotation: $(this)[0].rotation(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
                    
                    drawWedge(optionsFigure);
                break;
                case 'Line':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        points: $(this)[0].points(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        lineCap: $(this)[0].lineCap(),
                        lineJoin: $(this)[0].lineJoin(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawLine(optionsFigure);
                break;
                case 'Star':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        numPoints: $(this)[0].numPoints(),
                        innerRadius: $(this)[0].innerRadius(),
                        outerRadius: $(this)[0].outerRadius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawStar(optionsFigure);
                break;
                case 'Ring':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        innerRadius: $(this)[0].innerRadius(),
                        outerRadius: $(this)[0].outerRadius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawRing(optionsFigure);
                break;
                case 'Arc':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        innerRadius: $(this)[0].innerRadius(),
                        outerRadius: $(this)[0].outerRadius(),
                        angle: $(this)[0].angle(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
                    
                    drawArc(optionsFigure);
                break;
                case 'RegularPolygon':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        sides: $(this)[0].sides(),
                        radius: $(this)[0].radius(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }

                    drawPolygon(optionsFigure);
                break;
                case 'Arrow':
                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        points: $(this)[0].points(),
                        pointerLength: $(this)[0].pointerLength(),
                        pointerWidth: $(this)[0].pointerWidth(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        fill: $(this)[0].fill(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: $(this)[0].strokeWidth(),
                        opacity: $(this)[0].opacity(),
                        rotation: $(this)[0].rotation(),
                        scaleX: $(this)[0].scaleX(),
                        scaleY: $(this)[0].scaleY()
                    }
    
                    drawArrow(optionsFigure);
                break;
            }
    
            if($(this)[0].id().match(/addFigure/)){
                if(addFigureIndex < parseInt($(this)[0].id().split('addFigure')[1])){
                    addFigureIndex = parseInt($(this)[0].id().split('addFigure')[1]) + 1;
                }else{
                    addFigureIndex++;
                }
            }

            maxZIndexValue++;
        })
        auxFigures.push([currentPage, figures]);

        // Images
        var images = null;
        var cont = 0;
        $.ajax({
            url: uri + 'core/expedients/documentsEditor/scandirRedraw.php',
            method: 'POST',
            data: {
                expedient: expedientID,
                doc: documentID,
                stamp: stamp
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data);
                    images = data[0];
                    cont = data[1];
                }catch(e){
                    images = null;
                    cont = 0;
                }
            },
            error: function(){
                images = null;
                cont = 0;
            }
        })

        var imgs = elem[1].find('.image');
        if(images != null){
            $.each(imgs, function(){
                var src = uri + 'resources/files/' + COMPANY + '/expedients/' + expedientID + '/documentsEditor/' + documentID + '/img/' + images[$(this)[0].id()];
                if(images[$(this)[0].id()].includes('------')){
                    src = uri + 'resources/files/' + COMPANY + '/tmp/expedients/' + expedientID + '/documentsEditor/' + documentID + '/img/' + images[$(this)[0].id()];
                }

                var optionsImg = {
                    x: $(this)[0].x(),
                    y: $(this)[0].y(),
                    width: $(this)[0].width(),
                    height: $(this)[0].height(),
                    id: $(this)[0].id(),
                    draggable: $(this)[0].draggable(),
                    name: $(this)[0].name(),
                    src: src,
                    mouse: true,
                    rotation: $(this)[0].rotation(),
                    scaleX: $(this)[0].scaleX(),
                    scaleY: $(this)[0].scaleY(),
                    blurRadius: $(this)[0].blurRadius(),
                    brightness: $(this)[0].brightness(),
                    contrast: $(this)[0].contrast(),
                    embossStrength: $(this)[0].embossStrength(),
                    embossBlend: $(this)[0].embossBlend(),
                    enhance: $(this)[0].enhance(),
                    noise: $(this)[0].noise(),
                    pixelate: $(this)[0].pixelSize(),
                    opacity: $(this)[0].opacity()
                }

                drawImage(optionsImg, elem[0]);

                maxZIndexValue++;
            })
        }
        imagesCont = parseInt(cont);
        auxImages.push([currentPage, imgs]);

        maxZIndex[currentPage] = maxZIndexValue;
    })

    // Modifica el z-index de cada elemento
    setTimeout(() => {
        // Textos
        $.each(auxTexts, function(index, elem){
            $.each(elem[1], function(i, item){
                if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                    stages[elem[0]].find('#' + item.id())[0].zIndex(item.zIndex());
                }
            })
        })

        // Figuras
        $.each(auxFigures, function(index, elem){
            $.each(elem[1], function(i, item){
                if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                    stages[elem[0]].find('#' + item.id())[0].zIndex(item.zIndex());
                }
            })
        })

        // Images
        $.each(auxImages, function(index, elem){
            $.each(elem[1], function(i, item){
                if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                    stages[elem[0]].find('#' + item.id())[0].zIndex(item.zIndex());
                }
            })
        })

        $.each(stages, function(index, elem){
            if(elem != undefined){
                elem.draw();
            }
        })

        $('.main').removeClass('hide');
        flagUndoRedo = false;
        $('#blockCanvas').addClass('hide');
    }, 1000);
}

/**
 * Devuelve el documento al estado original
 */
function hardReload(){
    $('#hardReload').click(function(){
        if(confirm('¿Estás seguro de que deseas regresar el documento a su formato inicial?')){
            $.ajax({
                url: uri + 'core/expedients/documentsEditor/hardReload.php',
                method: 'POST',
                data: {
                    document: documentID,
                    expedient: expedientID
                },
                async: true,
                success: function(data){
                    try{
                        if(data){
                            window.location.reload();
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
    })
}

$(window).scroll(function(){
    changeSpaceFooter()
})

$(window).resize(function(){
    changeSpaceFooter()
})

$(function(){
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>');
    changeSpaceFooter()
    $('#backLink').click(function(event){
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

    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    documentID = parseInt($('#documentIdentifier').val());
    expedientID = parseInt($('#expedientIdentifier').val());

    var isMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
    
    if(isMobile){
        $('#lockedMobileMessage').removeClass('hide');
        $('#blockCanvas').removeClass('hide');
        $('.sidenav').addClass('hide');
        return false;
    }else{
        // Bloquea el documento, de forma que sólo se pueda editar en el navegador que se haya abierto
        $.ajax({
            url: uri + 'core/expedients/documentsEditor/lock.php',
            method: 'POST',
            data: {
                document: documentID,
                expedient: expedientID
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data);
                    if(data == 'locked'){
                        locked = true;
                        $('#lockedMessage').removeClass('hide');
                        $('#blockCanvas').removeClass('hide');
                        $('.sidenav').addClass('hide');
                    }
                }catch(e){
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
    }

    if(existsDocument()){
        $('#existsDocument').remove();
    }else{
        $('#existsDocument').removeClass('hide');
        setTimeout(() => {
            window.location.href = uri + 'expediente/documentacion/' + expedientID;
        }, 2500);
        return false;
    }

    if(!locked){
        // $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="preview" class="btn btn-primary">Vista previa</button>');
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="hardReload" class="btn btn-danger">Recargar</button>')
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="save" class="btn btn-success">Guardar</button>');
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="download" class="btn btn-success">Guardar y ver</button>');
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="view" class="btn btn-primary hide">Ver</button>');
    }else{
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="view" class="btn btn-primary hide">Ver</button>');
    }

    checkView();
    goView();

    // Moment - Idioma
    moment.locale('es');

    // Images
    $('#chooseImage').click(function(){
        if($('.image-selected').length == 0){
            return false;
        }
        var imageName = $('.image-selected').attr('image-name');

        $.ajax({
            url: uri + 'core/expedients/documentsEditor/copyImage.php',
            method: 'POST',
            data: {
                expedient: expedientID,
                imageName: imageName,
                stamp: stamp,
                doc: documentID
            },
            async: false,
            dataType: 'json',
            success: function(data){
                try{
                    if(Array.isArray(data)){
                        if(data[0]){
                            var optionsImg = {
                                x: 50,
                                y: 50,
                                width: null,
                                height: null,
                                id: 'image_' + data[1],
                                draggable: true,
                                name: 'image',
                                src: uri + data[2] + '?v=' + moment().format('X'),
                                mouse: true,
                                rotation: null,
                                scaleX: null,
                                scaleY: null,
                                blurRadius: 0,
                                brightness: 0,
                                contrast: 0,
                                embossStrength: 0,
                                embossBlend: true,
                                enhance: 0,
                                noise: 0,
                                pixelate: 1,
                                opacity: 1
                            }

                            drawImage(optionsImg)
                            
                            imagesUnsaveToDelete.push('image_' + data[1])
                            imagesCont++

                            setTimeout(() => {
                                saveAction(false)
                            }, 250)
                            maxZIndex[currentPage]++;
                        }else{
                            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');

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

        $('#modal-upload-file').modal('hide')
    })

    // Carga de datos
    var data = getDocument();
    if(data.length == 0){
        return false;
    }

    loadFlag = data[0];
    documentInfo = data[1];
    documentSources = data[2];
    expedientDataSheetInfo = data[3];

    $('#documentName').text(documentInfo.documentName);

    pageSize = documentInfo.pageSize;
    if(pageSize == 'A6'){
        $(".sidenav").addClass('A6-sticky')
    }

    $('#page0').attr('size', pageSize);
    $('#pageAux0').attr('size', pageSize);

    drawLoad();

    firtsLoad = false;

    if(expedientDataSheetInfo.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }else{
        gender = "D. "
    }

    $(".footer-static-bottom .numberExp").text(expedientDataSheetInfo.number)
    $(".footer-static-bottom #deceased").text(' ' + gender + ' ' + expedientDataSheetInfo.deceasedName + ' ' + expedientDataSheetInfo.deceasedSurname)

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
})

window.onbeforeunload = () => {
    var formData = new FormData;

    formData.append('document', $('#documentIdentifier').val());
    formData.append('locked', locked ? 1 : 0);
    formData.append('page', window.location.pathname);

    navigator.sendBeacon(
        '/core/expedients/documentsEditor/unlock.php',
        formData
    )
}