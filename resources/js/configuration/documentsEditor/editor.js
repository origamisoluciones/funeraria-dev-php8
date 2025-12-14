var flagFixDocuments = true;

/** @var {int} documentID Document ID */
var documentID = null;

/** @var {int} loadFlag Document info */
var loadFlag = false;

/** @var {int} documentInfo Document info */
var documentInfo = null;

/** @var {int} documentSources Document sources */
var documentSources = null;

/** @var {boolean} firtsLoad Bandera que controla si es la primera carga del editor */
var firtsLoad = true;

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

/**
 * Comprueba si el documento existe
 * 
 * @return {bool} check Check
 */
function existsDocument(){
    var check = false;

    $.ajax({
        url: uri + 'core/documentsEditor/check.php',
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
 * Comprueba si ya se ha generado algún documento
 * 
 * @return {array} info Info
 */
function getDocument(){
    var info = new Array
    $.ajax({
        url: uri + 'core/documentsEditor/getData.php',
        method: 'POST',
        data: {
            document: documentID
        },
        async: false,
        success: function(data){
            try{
                info = $.parseJSON(data);
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
    return info
}

/**
 * Comprueba que los directorios para el documento están creados
 */
function checkDirs(){
    $.ajax({
        url: uri + 'core/documentsEditor/checkDirs.php',
        method: 'POST',
        data: {
            document: documentID
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data);
                if(!data){
                    $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    setTimeout(function(){
                        $('#block-message').empty();
                    }, 5000);
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
 * Comprueba si el pdf del documento ya se ha creado
 * 
 * @param {int} document Id del documento
 */
function checkView(){
    $.ajax({
        url: uri + 'core/documentsEditor/checkPdf.php',
        method: 'POST',
        data: {
            document: documentID
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
        window.open(uri + 'descargar-archivo?file=documents/'+ documentID + '/files/documento.pdf', '_blank')
    })
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

    $.each(documentSources, function(index, elem){
        if(index == 0){
            initScene(0);
        }else{
            $('#addPage').click();
        }
    })

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

        var addTextId = 0;
        var addSignId = 0;
        
        // Texts
        var texts = elem[1].find('.text');
        $.each(texts, function(){
            if(flagFixDocuments){
                if($(this)[0].id().match(/addText/)){
                    $(this)[0].setId('addText' + addTextId);
                }else if($(this)[0].id().match(/addSign/)){
                    $(this)[0].setId('addSign' + addSignId);
                }
            }
            
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

            addTextId++;
            addSignId++;
        })
        auxTexts.push([currentPage, texts]);
        
        // Figures
        var figures = elem[1].find('.figure');

        var addFigureId = 0;
        $.each(figures, function(){
            if(flagFixDocuments){
                $(this)[0].setId('addFigure' + addFigureId)
            }

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
                    var strokeWidthAux = $(this)[0].strokeWidth();
                    if(parseInt(strokeWidthAux) < 1.75){
                        strokeWidthAux = 1.75;
                    }

                    var optionsFigure = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        points: $(this)[0].points(),
                        name: $(this)[0].name(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        stroke: $(this)[0].stroke(),
                        strokeWidth: strokeWidthAux,
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
            addFigureId++;
        })
        auxFigures.push([currentPage, figures]);

        // Images
        var images = null;
        var cont = null;
        $.ajax({
            url: uri + 'core/documentsEditor/scandir.php',
            method: 'POST',
            data: {
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
                    src: uri + 'resources/files/' + COMPANY + '/documentEditor/' + documentID + '/img/' + images[$(this)[0].id()],
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

                maxZIndexValue++;
            })
        }
        imagesCont = parseInt(cont);
        auxImages.push([currentPage, imgs])

        maxZIndex[currentPage] = maxZIndexValue;
    })

    // Modifica el z-index de cada elemento
    setTimeout(() => {
        if(flagFixDocuments){
            // START - REORDER ZINDEX
            var zIndex = 0;
    
            // Images
            $.each(auxImages, function(index, elem){
                $.each(elem[1], function(i, item){
                    if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                        stages[elem[0]].find('#' + item.id())[0].zIndex(zIndex);      
                        zIndex++;
                    }
                })
            })
    
            // Figuras
            $.each(auxFigures, function(index, elem){
                $.each(elem[1], function(i, item){
                    if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                        stages[elem[0]].find('#' + item.id())[0].zIndex(zIndex);
                        zIndex++;
                    }
                })
            })
    
            // Textos
            $.each(auxTexts, function(index, elem){
                $.each(elem[1], function(i, item){
                    if(stages[elem[0]].find('#' + item.id())[0] != undefined){
                        stages[elem[0]].find('#' + item.id())[0].zIndex(zIndex);
                        zIndex++;
                    }
                })
            })
            // END - REORDER ZINDEX
        }else{
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
        }

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
}

/**
 * Guardado de datos y descarga de pdf
 */
function save(){
	$('#download').click(function(){
        if(!saveClick){
            saveClick = true

            $('#modal-download').modal('show');

            setTimeout(() => {
                // Elimina todas las transformaciones
                $.ajax({
                    url: uri + 'core/documentsEditor/preSave.php',
                    method: 'POST',
                    data: {
                        document: documentID,
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
                                url: uri + 'core/documentsEditor/save.php',
                                method: 'POST',
                                data: {
                                    document: documentID,
                                    images: images,
                                    json: json,
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
                    
                                        window.open(uri + 'descargar-archivo?file=documentEditor/' + documentID + '/files/documento.pdf', '_blank');
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
    })
}

/**
 * Guardado de datos y descarga de pdf
 */
function onlySave(){
	$('#save').click(function(){
        if(!saveClick){
            saveClick = true

            $('#modal-save').modal('show');

            setTimeout(() => {
                // Elimina todas las transformaciones
                $.ajax({
                    url: uri + 'core/documentsEditor/preSave.php',
                    method: 'POST',
                    data: {
                        document: documentID,
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
                                url: uri + 'core/documentsEditor/save.php',
                                method: 'POST',
                                data: {
                                    document: documentID,
                                    images: images,
                                    json: json,
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
                    $('#modal-save').modal('hide');
                }, 3000);
            }, 500);
        }
    })
}

/**
 * Elimina un elemento
 */
function removeElement(){
    if(selected.name() == 'image'){
        // Delete file on server when remove on stage
        var data = {
            doc: documentID,
            filename: selected.id(),
            stamp: stamp
        }
        $.ajax({
            url: uri + 'core/documentsEditor/remove.php',
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
            data.append('doc', documentID);
            data.append('file', file);
            data.append('cont', imagesCont);
            data.append('stamp', stamp);
            
            $.ajax({
                url: uri + 'core/documentsEditor/upload.php',
                method: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data);

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
            data.append('doc', documentID);
            data.append('file', file);
            data.append('cont', imagesCont);
            data.append('stamp', stamp);

            $.ajax({
                url: uri + 'core/documentsEditor/uploadGallery.php',
                method: 'POST',
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                async: false,
                success: function(data){
                    try{
                        data = $.parseJSON(data);

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
            url: uri + 'core/documentsEditor/scandirRedraw.php',
            method: 'POST',
            data: {
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
                var src = uri + 'resources/files/' + COMPANY + '/documentEditor/' + documentID + '/img/' + images[$(this)[0].id()];
                if(images[$(this)[0].id()].includes('------')){
                    src = uri + 'resources/files/' + COMPANY + '/tmp/documentEditor/' + documentID + '/img/' + images[$(this)[0].id()];
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
 * Fix footer
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
            url: uri + 'core/documentsEditor/lock.php',
            method: 'POST',
            data: {
                document: documentID,
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
            window.location.href = uri + 'configuracion/editor-documentacion';
        }, 2500);
        return false;
    }

    if(!locked){
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
            url: uri + 'core/documentsEditor/copyImage.php',
            method: 'POST',
            data: {
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

    $('#documentName').text(documentInfo.documentName);
    pageSize = documentInfo.pageSize;

    if(pageSize == 'A6'){
        $(".sidenav").addClass('A6-sticky')
    }

    $('#page0').attr('size', pageSize);
    $('#pageAux0').attr('size', pageSize);

    // loadFlag = false;
    if(loadFlag){
        drawLoad();

        firtsLoad = false;
        return false;
    }else{
        checkDirs();
    }

    firtsLoad = false;

    // Guardar datos y descargar pdf
	save();
	onlySave();

    width = $('#page' + pageNumber).innerWidth();
    height = $('#page' + pageNumber).innerHeight();

    initScene(0);

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

    $('#addPage').click(function(){
        $(".sidenav").removeClass('A6-sticky')

        pageNumber++;

        $('#pages').append(
            '   <div id="pageSection' + pageNumber + '">' +
            '       <h4>Página <span class="page-number">' + ($('.page-number').length + 1) + '</span> - <button type="button" class="btn btn-primary" id="deletePage' + pageNumber + '" pageNumber="' + pageNumber + '">Eliminar página</button></h4>' +
            '       <page size="' + pageSize + '" id="page' + pageNumber + '"></page>' +
            '       <div class="overlay hide" id="blockCanvas"></div>' +
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

    $('.main').removeClass('hide');
})

window.onbeforeunload = () => {
    var formData = new FormData;

    formData.append('document', $('#documentIdentifier').val());
    formData.append('locked', locked ? 1 : 0);
    formData.append('page', window.location.pathname);

    navigator.sendBeacon(
        '/core/documentsEditor/unlock.php',
        formData
    )
}