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
 * Modifica el estado de "guardado" y muestra/oculta el mensaje
 * 
 * @param {boolean} flag Estado
 */
function saveAction(flag){
    saved = flag;

    if(flag){
        $('#unsaveMessage').addClass('hide');
    }else{
        if(states.length > currentState + 1){
            var length = states.length;
            for(var i = currentState; i < length - 1; i++){
                states.pop();
            }
        }

        $('#unsaveMessage').removeClass('hide');
        var json = new Object;

        var i = 0;
        $.each(stages, function(index, elem){
            if(elem != undefined){
                json[i] = elem.toJSON();
                i++;
            }
        })

        states.push(json);
        currentState++;
    }
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
 * Starts the scene
 * 
 * @param {int} pageNumber Page number
 */
function initScene(pageNumber){
	// Escenario
    stages[pageNumber] = new Konva.Stage({
        container: 'page' + pageNumber,
        width: width,
		height: height,
		name: 'page-' + pageNumber
    })

    stages[pageNumber].on('click', function(){
        var name = $(this)[0].attrs.name;
        currentPage = parseInt(name.split('-')[1]);
    })

    gridLayers[pageNumber] = new Konva.Layer();
    var padding = blockSnapSize;
    for (var i = 0; i < width / padding; i++) {
        gridLayers[pageNumber].add(new Konva.Line({
            points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
            stroke: '#ddd',
            strokeWidth: 0.5,
        }))
    }

    gridLayers[pageNumber].add(new Konva.Line({points: [0,0,10,10]}));
    for (var j = 0; j < height / padding; j++) {
        gridLayers[pageNumber].add(new Konva.Line({
            points: [0, Math.round(j * padding), width, Math.round(j * padding)],
            stroke: '#ddd',
            strokeWidth: 0.5,
        }))
    }

	// Capa
    layers[pageNumber] = new Konva.Layer();
    
    stages[pageNumber].add(layers[pageNumber]);
    stages[pageNumber].add(gridLayers[pageNumber]);

    // Acciones
    selectElement(pageNumber);
}

/**
 * Añade un elemento texto
 */
function toAddText(){
    $('#toAddText').click(function(){
        var options = {
            x: 50,
            y: 50,
            height: 18,
            width: 100,
            name: 'text',
            id: 'addText' + addTextIndex,
            draggable: true,
            fill: '#00305c',
            opacity: 1,
            editable: true
        }
    
        var style = {
            fontFamily: "caslon",
            fontSize: 18,
            fontStyle: 'normal',
            fontVariant: 'normal',
            textDecoration: 'empty string',
            text: 'Texto',
            align: 'left',
            verticalAlign: 'top',
            padding: 0,
            lineHeight: 1.25,
            wrap: 'word',
            ellipsis: false
        }
    
        drawText(options, style);

        addTextIndex++;
        maxZIndex[currentPage]++;

        saveAction(false);
    })
}

/**
 * Añade un elemento texto para las firmas
 */
function toAddSign(){
    $('#toAddSign').click(function(){
        var options = {
            x: 50,
            y: 50,
            height: 18,
            width: 152,
            name: 'text',
            id: 'addSign' + addSignIndex,
            draggable: true,
            fill: '#00305c',
            opacity: 1,
            editable: false
        }
    
        var style = {
            fontFamily: "caslon",
            fontSize: 18,
            fontStyle: 'normal',
            fontVariant: 'normal',
            textDecoration: 'empty string',
            text: 'Fdo.: ____________',
            align: 'left',
            verticalAlign: 'top',
            padding: 0,
            lineHeight: 1.25,
            wrap: 'word',
            ellipsis: false
        }
    
        drawText(options, style);

        addSignIndex++;
        maxZIndex[currentPage]++;

        saveAction(false);
    })
}

/**
 * Añade un rectángulo
 */
function toAddRectangle(){
    $('#toAddRectangle').click(function(){
        var options = {
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawRectangle(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;

        saveAction(false);
    })
}

/**
 * Añade un círculo
 */
function toAddCircle(){
    $('#toAddCircle').click(function(){
        var options = {
            x: 100,
            y: 100,
            radius: 50,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawCircle(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade un círculo
 */
function toAddEllipse(){
    $('#toAddEllipse').click(function(){
        var options = {
            x: 100,
            y: 100,
            radiusX: 100,
            radiusY: 50,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawEllipse(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade una cuña
 */
function toAddWedge(){
    $('#toAddWedge').click(function(){
        var options = {
            x: 100,
            y: 100,
            radius: 50,
            angle: 40,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            rotation: -120,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawWedge(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade una línea
 */
function toAddLine(){
    $('#toAddLine').click(function(){
        var options = {
            x: 100,
            y: 100,
            points: [0, 0, 500, 0],
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            stroke: '#00305c',
            strokeWidth: 4,
            lineCap: 'square',
            lineJoin: 'square',
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawLine(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade una línea
 */
function toAddStar(){
    $('#toAddStar').click(function(){
        var options = {
            x: 100,
            y: 100,
            numPoints: 5,
            innerRadius: 40,
            outerRadius: 70,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawStar(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade un anillo
 */
function toAddRing(){
    $('#toAddRing').click(function(){
        var options = {
            x: 100,
            y: 100,
            innerRadius: 50,
            outerRadius: 70,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawRing(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade un arco
 */
function toAddArc(){
    $('#toAddArc').click(function(){
        var options = {
            x: 100,
            y: 100,
            innerRadius: 50,
            outerRadius: 70,
            angle: 180,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawArc(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade un polígono
 */
function toAddPolygon(){
    $('#toAddPolygon').click(function(){
        var options = {
            x: 100,
            y: 100,
            sides: 5,
            radius: 72,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawPolygon(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);
    })
}

/**
 * Añade una flecha
 */
function toAddArrow(){
    $('#toAddArrow').click(function(){
        var options = {
            x: 100,
            y: 100,
            points: [0, 100, 100, 100],
            pointerLength: 20,
            pointerWidth: 20,
            name: 'figure',
            id: 'addFigure' + addFigureIndex,
            draggable: true,
            fill: '#FFFFFF',
            stroke: '#00305c',
            strokeWidth: 4,
            opacity: 1,
            rotation: null,
            scaleX: null,
            scaleY: null
        }
    
        drawArrow(options);

        addFigureIndex++;
        maxZIndex[currentPage]++;;

        saveAction(false);

    })
}

/**
 * Dibuja texto
 * 
 * @param {object} options Opciones 
 * @param {object} style Estilos del texto 
 */
function drawText(options, style){
    var textNode = new Konva.Text({
        x: options.x,
        y: options.y,
        height: options.height,
        width: options.width,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontStyle: style.fontStyle,
        fontVariant: style.fontVariant,
        textDecoration: style.textDecoration,
        text: style.text,
        align: style.align,
        verticalAlign: style.verticalAlign,
        padding: style.padding,
        lineHeight: style.lineHeight,
        wrap: style.wrap,
        ellipsis: style.ellipsis,
        opacity: options.opacity,
        rotation: options.rotation,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    layers[currentPage].add(textNode);
    textNode.align(style.align);
    layers[currentPage].draw();

    textNode.on('dragend', function(){
        saveAction(false);
        if(selected != null){
            $('#xCoord').val(parseFloat(selected.x()).toFixed(2));
            $('#yCoord').val(parseFloat(selected.y()).toFixed(2));
        }
    })

    textNode.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    if(options.editable){
        textNode.on('transform', function(){
            this.setAttrs({
                width: Math.max(this.width() * this.scaleX(), 20),
                height: Math.max(this.height() * this.scaleY(), 20),
                scaleX: 1,
                scaleY: 1,
            });
        })
    
        textNode.on('transformend', function(){
            saveAction(false);
        })
    
        textNode.on('click tap', function(){
            selected = this;
    
            cleanOptions();
    
            $('#optionsSection').removeClass('hide');
            $('#toLayerPlus').attr('disabled', false);
            $('#toLayerMinus').attr('disabled', false);
            $('#textOptionsSection').removeClass('hide');
            $('#opacitySection').removeClass('hide');
    
            $('#opacityOption').val(selected.opacity());
            selected.fontStyle().search('bold') > -1 ? $('#toBold').addClass('active') : $('#toBold').removeClass('active');
            selected.fontStyle().search('italic') > -1 ? $('#toItalic').addClass('active') : $('#toItalic').removeClass('active');
            selected.textDecoration().search('underline') > -1 ? $('#toUnderline').addClass('active') : $('#toUnderline').removeClass('active');
            selected.textDecoration().search('line-through') > -1 ? $('#toLineThrough').addClass('active') : $('#toLineThrough').removeClass('active');
            switch(selected.align()){
                case 'left':
                    $('#toAlignLeft').addClass('active');
                    $('#toAlignCenter').removeClass('active');
                    $('#toAlignRight').removeClass('active');
                    $('#toAlignJustify').removeClass('active');
                break;
                case 'center':
                    $('#toAlignLeft').removeClass('active');
                    $('#toAlignCenter').addClass('active');
                    $('#toAlignRight').removeClass('active');
                    $('#toAlignJustify').removeClass('active');
                break;
                case 'right':
                    $('#toAlignLeft').removeClass('active');
                    $('#toAlignCenter').removeClass('active');
                    $('#toAlignRight').addClass('active');
                    $('#toAlignJustify').removeClass('active');
                break;
                case 'justify':
                    $('#toAlignLeft').removeClass('active');
                    $('#toAlignCenter').removeClass('active');
                    $('#toAlignRight').removeClass('active');
                    $('#toAlignJustify').addClass('active');
                break;
            }
            $('#toFontSize').val(selected.fontSize());
            $('#toFontFamily').val(selected.fontFamily());
            $('#toLineHeight').val(selected.lineHeight());
            $('#rotationSection').removeClass('hide');
            $('#rotationOption').val(selected.rotation());
            $('#xCoordSection').removeClass('hide');
            $('#yCoordSection').removeClass('hide');
            $('#xCoord').val(parseFloat(selected.x()).toFixed(2));
            $('#yCoord').val(parseFloat(selected.y()).toFixed(2));
            $('#widthSection').removeClass('hide');
            $('#heightSection').removeClass('hide');
            $('#widthOption').val(selected.width());
            $('#heightOption').val(selected.height());
        })

        handleTransform(textNode);
        handleMouse(textNode);
    }else{
        textNode.on('click tap', function(){
            selected = this;
        })
    }
}

/**
 * Dibuja un rectángulo
 * 
 * @param {object} options Opciones 
 */
function drawRectangle(options){
    var rect = new Konva.Rect({
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    rect.on('click tab', function(){
        selected = this;

        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#widthOption').val(selected.width());
        $('#heightOption').val(selected.height());
        $('#opacityOption').val(selected.opacity());
        cleanOptions();
        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#widthSection').removeClass('hide');
        $('#heightSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    rect.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })
    
    rect.on('dragend', function(){
        saveAction(false);
    })

    rect.on('transformend', function(){
        selected.setWidth(selected.getWidth() * selected.getScaleX());
        selected.setHeight(selected.getHeight() * selected.getScaleY());
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(rect);

    layers[currentPage].add(rect);
    layers[currentPage].draw();
}

/**
 * Dibuja un círculo
 * 
 * @param {object} options Opciones 
 */
function drawCircle(options){
    var circle = new Konva.Circle({
        x: options.x,
        y: options.y,
        radius: options.radius,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    circle.on('click tab', function(){
        selected = this;

        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#radiusOption').val(selected.radius());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();

        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#radiusSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    circle.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    circle.on('dragend', function(){
        saveAction(false);
    })

    circle.on('transformend', function(){
        selected.setRadius(selected.getRadius() * (selected.getScaleX() == 1 ? selected.getScaleY() : selected.getScaleX()));
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(circle);

    layers[currentPage].add(circle);
    layers[currentPage].draw();
}

/**
 * Dibuja una elipse
 * 
 * @param {object} options Opciones 
 */
function drawEllipse(options){
    var ellipse = new Konva.Ellipse({
        x: options.x,
        y: options.y,
        radiusX: options.radiusX,
        radiusY: options.radiusY,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    ellipse.on('click tab', function(){
        selected = this;

        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#radiusXOption').val(selected.radiusX());
        $('#radiusYOption').val(selected.radiusY());
        $('#opacityOption').val(selected.opacity());
        cleanOptions();
        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#radiusXSection').removeClass('hide');
        $('#radiusYSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    ellipse.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    ellipse.on('dragend', function(){
        saveAction(false);
    })

    ellipse.on('transformend', function(){
        selected.setRadiusX(selected.getRadiusX() * selected.getScaleX());
        selected.setRadiusY(selected.getRadiusY() * selected.getScaleY());
        selected.setScaleX(1);
        selected.setScaleY(1);
        
        saveAction(false);
    })
    
    handleMouse(ellipse);

    layers[currentPage].add(ellipse);
    layers[currentPage].draw();
}

/**
 * Dibuja una cuña
 * 
 * @param {object} options Opciones 
 */
function drawWedge(options){
    var wedge = new Konva.Wedge({
        x: options.x,
        y: options.y,
        radius: options.radius,
        angle: options.angle,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        rotation: options.rotation,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    wedge.on('click tab', function(){
        selected = this;

        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#radiusOption').val(selected.width());
        $('#angleOption').val(selected.angle());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();
        
        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#radiusSection').removeClass('hide');
        $('#angleSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    wedge.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    wedge.on('dragend', function(){
        saveAction(false);
    })

    wedge.on('transformend', function(){
        selected.setRadius(selected.getRadius() * (selected.getScaleX() == 1 ? selected.getScaleY() : selected.getScaleX()));
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(wedge);

    layers[currentPage].add(wedge);
    layers[currentPage].draw();
}

/**
 * Dibuja una línea
 * 
 * @param {object} options Opciones 
 */
function drawLine(options){
    var line = new Konva.Line({
        x: options.x,
        y: options.y,
        points: options.points,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        lineCap: options.lineCap,
        lineJoin: options.lineJoin,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    line.on('click tab', function(){
        selected = this;

        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();
        
        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    line.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    line.on('dragend', function(){
        saveAction(false);
    })

    line.on('transformend', function(){
        saveAction(false);
    })
    
    handleMouse(line);

    layers[currentPage].add(line);
    layers[currentPage].draw();
}

/**
 * Dibuja una estrella
 * 
 * @param {object} options Opciones 
 */
function drawStar(options){
    var star = new Konva.Star({
        x: options.x,
        y: options.y,
        numPoints: options.numPoints,
        innerRadius: options.innerRadius,
        outerRadius: options.outerRadius,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    star.on('click tab', function(){
        selected = this;

        $('#numPointsOption').val(selected.numPoints());
        $('#innerRadiusOption').val(selected.innerRadius());
        $('#outerRadiusOption').val(selected.outerRadius());
        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#opacityOption').val(selected.opacity());
        
        cleanOptions();

        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#numPointsSection').removeClass('hide');
        $('#innerRadiusSection').removeClass('hide');
        $('#outerRadiusSection').removeClass('hide');
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    star.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    star.on('dragend', function(){
        saveAction(false);
    })

    star.on('transformend', function(){
        selected.setInnerRadius(selected.getInnerRadius() * selected.getScaleX());
        selected.setOuterRadius(selected.getOuterRadius() * selected.getScaleX());
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(star);

    layers[currentPage].add(star);
    layers[currentPage].draw();
}

/**
 * Dibuja una estrella
 * 
 * @param {object} options Opciones 
 */
function drawRing(options){
    var ring = new Konva.Ring({
        x: options.x,
        y: options.y,
        innerRadius: options.innerRadius,
        outerRadius: options.outerRadius,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    ring.on('click tab', function(){
        selected = this;
        
        $('#innerRadiusOption').val(selected.innerRadius());
        $('#outerRadiusOption').val(selected.outerRadius());
        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();

        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#innerRadiusSection').removeClass('hide');
        $('#outerRadiusSection').removeClass('hide');
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    ring.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    ring.on('dragend', function(){
        saveAction(false);
    })

    ring.on('transformend', function(){
        selected.setInnerRadius(selected.getInnerRadius() * selected.getScaleX());
        selected.setOuterRadius(selected.getOuterRadius() * selected.getScaleY());
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(ring);

    layers[currentPage].add(ring);
    layers[currentPage].draw();
}

/**
 * Dibuja un arco
 * 
 * @param {object} options Opciones 
 */
function drawArc(options){
    var arc = new Konva.Arc({
        x: options.x,
        y: options.y,
        innerRadius: options.innerRadius,
        outerRadius: options.outerRadius,
        angle: options.angle,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    arc.on('click tab', function(){
        selected = this;

        $('#angleOption').val(selected.angle());
        $('#innerRadiusOption').val(selected.innerRadius());
        $('#outerRadiusOption').val(selected.outerRadius());
        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();

        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#angleSection').removeClass('hide');
        $('#innerRadiusSection').removeClass('hide');
        $('#outerRadiusSection').removeClass('hide');
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    arc.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    arc.on('dragend', function(){
        saveAction(false);
    })

    arc.on('transformend', function(){
        selected.setInnerRadius(selected.getInnerRadius() * selected.getScaleX());
        selected.setOuterRadius(selected.getOuterRadius() * selected.getScaleY());
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(arc);

    layers[currentPage].add(arc);
    layers[currentPage].draw();
}

/**
 * Dibuja un polígono
 * 
 * @param {object} options Opciones 
 */
function drawPolygon(options){
    var polygon = new Konva.RegularPolygon({
        x: options.x,
        y: options.y,
        sides: options.sides,
        radius: options.radius,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    polygon.on('click tab', function(){
        selected = this;

        $('#sidesOption').val(selected.sides());
        $('#radiusOption').val(selected.width());
        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();

        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#sidesSection').removeClass('hide');
        $('#radiusSection').removeClass('hide');
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    polygon.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    polygon.on('dragend', function(){
        saveAction(false);
    })

    polygon.on('transformend', function(){
        selected.setRadius(selected.getRadius() * (selected.getScaleX() == 1 ? selected.getScaleY() : selected.getScaleX()));
        selected.setScaleX(1);
        selected.setScaleY(1);

        saveAction(false);
    })
    
    handleMouse(polygon);

    layers[currentPage].add(polygon);
    layers[currentPage].draw();
}

/**
 * Dibuja una flecha
 * 
 * @param {object} options Opciones 
 */
function drawArrow(options){
    var arrow = new Konva.Arrow({
        x: options.x,
        y: options.y,
        points: options.points,
        pointerLength: options.pointerLength,
        pointerWidth: options.pointerWidth,
        name: options.name,
        id: options.id,
        draggable: options.draggable,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        opacity: options.opacity,
        rotation: options.rotation,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
        dragBoundFunc: function(pos){
            if(startX == null || startY == null){
                return {
                    x: pos.x,
                    y: pos.y
                }
            }else{
                var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    arrow.on('click tab', function(){
        selected = this;

        $('#pointerLengthOption').val(selected.pointerLength());
        $('#pointerWidthOption').val(selected.pointerWidth());
        $('#strokeWidthOption').val(selected.strokeWidth());
        $('#opacityOption').val(selected.opacity());

        cleanOptions();

        $('#optionsSection').removeClass('hide');
        $('#toLayerPlus').attr('disabled', false);
        $('#toLayerMinus').attr('disabled', false);
        
        $('#pointerLengthSection').removeClass('hide');
        $('#pointerWidthSection').removeClass('hide');
        $('#fillSection').removeClass('hide');
        $('#strokeSection').removeClass('hide');
        $('#strokeWidthSection').removeClass('hide');
        $('#opacitySection').removeClass('hide');
    })

    arrow.on('dragstart', function(){
        startX = this.x();
        startY = this.y();
    })

    arrow.on('dragend', function(){
        saveAction(false);
    })

    arrow.on('transformend', function(){
        saveAction(false);
    })
    
    handleMouse(arrow);

    layers[currentPage].add(arrow);
    layers[currentPage].draw();
}

/**
 * Para cambiar el color de relleno
 */
function toFillColor(){
    $('#fillOption').colpick({
        onSubmit: function(hsb, hex, rgb, el){
            $(el).colpickHide()

            if(selected != null && selected.name().toLowerCase() == 'figure'){
                selected.fill('#' + hex);
                layers[currentPage].draw();

                saveAction(false);
            }
        },
        submitText: 'Aceptar',
        style: {'z-index': '1000'}
    })
}

/**
 * Para cambiar el color de borde
 */
function toStrokeColor(){
    $('#strokeOption').colpick({
        onSubmit: function(hsb, hex, rgb, el){
            $(el).colpickHide()

            if(selected != null && selected.name().toLowerCase() == 'figure'){
                selected.stroke('#' + hex);
                layers[currentPage].draw();

                saveAction(false);
            }
        },
        submitText: 'Aceptar',
        style: {'z-index': '1000'}
    })
}

/**
 * Modifica las opciones de una figura
 */
function changeOptions(){
    $('#strokeWidthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.strokeWidth(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#widthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            var value = $(this).val().replace(',', '.');
            selected.width(Math.abs(value));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#heightOption').change(function(){
        if(selected != null && $(this).val() != ''){
            var value = $(this).val().replace(',', '.');
            selected.height(Math.abs(value));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#xCoord').change(function(){
        if(selected != null && $(this).val() != ''){
            var value = $(this).val().replace(',', '.');
            selected.x(Math.abs(value));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#yCoord').change(function(){
        if(selected != null && $(this).val() != ''){
            var value = $(this).val().replace(',', '.');
            selected.y(Math.abs(value));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#radiusOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.width(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#radiusXOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.radiusX(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#radiusYOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.radiusY(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#angleOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.angle(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#rotationOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.rotation(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#numPointsOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.numPoints(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#innerRadiusOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.innerRadius(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#outerRadiusOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.outerRadius(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#sidesOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.sides(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#pointerLengthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.pointerLength(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#pointerWidthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.pointerWidth(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#opacityOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.opacity(Math.abs($(this).val()));
            layers[currentPage].draw();

            saveAction(false);
        }
    })

    $('#blurOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })

    $('#brightnessOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })

    $('#contrastOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })

    $('#embossOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })

    $('#enhanceOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })

    $('#noiseOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })

    $('#pixelateOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle();
        }
    })
}

/**
 * Aplicar negrita
 */
function toBold(){
    $('#toBold').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var bold = selected.fontStyle().search('bold') > -1 ? true : false;
            var italic = selected.fontStyle().search('italic') > -1 ? true : false;
            if(bold && italic){
                selected.fontStyle('italic');
                $('#toBold').removeClass('active');
                $('#toItalic').addClass('active');
            }else if(bold && !italic){
                selected.fontStyle('normal');
                $('#toBold').removeClass('active');
                $('#toItalic').removeClass('active');
            }else if(!bold && italic){
                selected.fontStyle('bold italic');
                $('#toBold').addClass('active');
                $('#toItalic').addClass('active');
            }else{
                selected.fontStyle('bold');
                $('#toBold').addClass('active');
                $('#toItalic').removeClass('active');
            }

            layers[currentPage].draw();
            
            saveAction(false);
        }
    })
}

/**
 * Aplicar cursiva
 */
function toItalic(){
    $('#toItalic').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var bold = selected.fontStyle().search('bold') > -1 ? true : false;
            var italic = selected.fontStyle().search('italic') > -1 ? true : false;

            if(bold && italic){
                selected.fontStyle('bold');
                $('#toBold').addClass('active');
                $('#toItalic').removeClass('active');
            }else if(bold && !italic){
                selected.fontStyle('bold italic');
                $('#toBold').addClass('active');
                $('#toItalic').addClass('active');
            }else if(!bold && italic){
                selected.fontStyle('normal');
                $('#toBold').removeClass('active');
                $('#toItalic').removeClass('active');
            }else{
                selected.fontStyle('italic');
                $('#toBold').removeClass('active');
                $('#toItalic').addClass('active');
            }

            layers[currentPage].draw();
            
            saveAction(false);
        }
    })
}

/**
 * Aplicar subrayado
 */
function toUnderline(){
    $('#toUnderline').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var underline = selected.textDecoration().search('underline') > -1 ? true : false;
            var lineThrough = selected.textDecoration().search('line-through') > -1 ? true : false;

            if(underline && lineThrough){
                selected.textDecoration('line-through');
                $('#toUnderline').removeClass('active');
                $('#toLineThrough').addClass('active');
            }else if(underline && !lineThrough){
                selected.textDecoration('empty string');
                $('#toUnderline').removeClass('active');
                $('#toLineThrough').removeClass('active');
            }else if(!underline && lineThrough){
                selected.textDecoration('underline line-through');
                $('#toUnderline').addClass('active');
                $('#toLineThrough').addClass('active');
            }else{
                selected.textDecoration('underline');
                $('#toUnderline').addClass('active');
                $('#toLineThrough').removeClass('active');
            }

            layers[currentPage].draw();
            
            saveAction(false);
        }
    })
}

/**
 * Aplicar tachado
 */
function toLineThrough(){
    $('#toLineThrough').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var underline = selected.textDecoration().search('underline') > -1 ? true : false;
            var lineThrough = selected.textDecoration().search('line-through') > -1 ? true : false;

            if(underline && lineThrough){
                selected.textDecoration('underline');
                $('#toUnderline').addClass('active');
                $('#toLineThrough').removeClass('active');
            }else if(underline && !lineThrough){
                selected.textDecoration('underline line-through');
                $('#toUnderline').addClass('active');
                $('#toLineThrough').addClass('active');
            }else if(!underline && lineThrough){
                selected.textDecoration('empty string');
                $('#toUnderline').removeClass('active');
                $('#toLineThrough').removeClass('active');
            }else{
                selected.textDecoration('line-through');
                $('#toUnderline').removeClass('active');
                $('#toLineThrough').addClass('active');
            }

            layers[currentPage].draw();
            
            saveAction(false);
        }
    })
}

/**
 * Alinear texto a la izquierda
 */
function toAlignLeft(){
    $('#toAlignLeft').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('left');
            layers[currentPage].draw();
            $('#toAlignLeft').addClass('active');
            $('#toAlignCenter').removeClass('active');
            $('#toAlignRight').removeClass('active');
            $('#toAlignJustify').removeClass('active');
            
            saveAction(false);
        }
    })
}

/**
 * Alinear texto al centro
 */
function toAlignCenter(){
    $('#toAlignCenter').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('center');
            layers[currentPage].draw();
            $('#toAlignLeft').removeClass('active');
            $('#toAlignCenter').addClass('active');
            $('#toAlignRight').removeClass('active');
            $('#toAlignJustify').removeClass('active');
            
            saveAction(false);
        }
    })
}

/**
 * Alinear texto a la derecha
 */
function toAlignRight(){
    $('#toAlignRight').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('right');
            layers[currentPage].draw();
            $('#toAlignLeft').removeClass('active');
            $('#toAlignCenter').removeClass('active');
            $('#toAlignRight').addClass('active');
            $('#toAlignJustify').removeClass('active');
            
            saveAction(false);
        }
    })
}

/**
 * Alinear texto justificado
 */
function toAlignJustify(){
    $('#toAlignJustify').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('justify');
            layers[currentPage].draw();
            $('#toAlignLeft').removeClass('active');
            $('#toAlignCenter').removeClass('active');
            $('#toAlignRight').removeClass('active');
            $('#toAlignJustify').addClass('active');
            
            saveAction(false);
        }
    })
}

/**
 * Rellena el select de tipos de fuente
 */
function fillFontFamily(){
    $('#toFontFamily').append('<option value="arial">Arial</option>');
    $('#toFontFamily').append('<option value="caslon">Caslon540 BT</option>');
    $('#toFontFamily').append('<option value="comic sans ms">Comic Sans MS</option>');
    $('#toFontFamily').append('<option value="garamond">Garamond</option>');
    $('#toFontFamily').append('<option value="garamonditalic">Garamond Italic</option>');
    $('#toFontFamily').append('<option value="garamondbolditalic">Garamond Bold Italic</option>');
    $('#toFontFamily').append('<option value="helvetica">Helvetica</option>');
    $('#toFontFamily').append('<option value="tahoma">Tahoma</option>');
    $('#toFontFamily').append('<option value="times new roman">Timew New Roman</option>');
    $('#toFontFamily').append('<option value="times new roman italic">Timew New Roman Italic</option>')
    $('#toFontFamily').append('<option value="verdana">Verdana</option>');
}

/**
 * Cambia el tipo de fuente
 */
function toFontFamily(){
    $('#toFontFamily').change(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.fontFamily($(this).val());
            layers[currentPage].draw();
            
            saveAction(false);
        }
    })
}

/**
 * Rellena el select de tamaños de fuente
 */
function fillFontSize(){
    for(var i = 4; i <= 12; i += 2){
        $('#toFontSize').append('<option value="' + i + '">' + i + '</option>');
    }

    for(var i = 13; i <= 49; i++){
        $('#toFontSize').append('<option value="' + i + '">' + i + '</option>');
    }

    for(var i = 50; i <= 80; i += 5){
        $('#toFontSize').append('<option value="' + i + '">' + i + '</option>');
    }

    $('#toFontSize').find('option[value="12"]').attr('selected', true);
}

/**
 * Cambia el tamaño de fuente
 */
function toFontSize(){
    $('#toFontSize').change(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.fontSize($(this).val());
            layers[currentPage].draw();
            
            saveAction(false);
        }
    })
}

/**
 * Cambia el color de la fuente
 */
function toFontColor(){
    $('#colorPicker').colpick({
        onSubmit: function(hsb, hex, rgb, el){
            $(el).colpickHide()

            if(selected != null && selected.name().toLowerCase() == 'text'){
                selected.fill('#' + hex);
                layers[currentPage].draw();

                saveAction(false);
            }
        },
        submitText: 'Aceptar',
        style: {'z-index': '1000'}
    })
}

/**
 * Rellenar el select de alto de línea
 */
function fillLineHeight(){
    $('#toLineHeight').append('<option value="1">1</option>');
    $('#toLineHeight').append('<option value="1.25">1.25</option>');
    $('#toLineHeight').append('<option value="1.5">1.5</option>');
    $('#toLineHeight').append('<option value="1.75">1.75</option>');
    $('#toLineHeight').append('<option value="2">2</option>');
    $('#toLineHeight').append('<option value="2.25">2.25</option>');
    $('#toLineHeight').append('<option value="2.5">2.5</option>');
    $('#toLineHeight').append('<option value="2.75">2.75</option>');
    $('#toLineHeight').append('<option value="3">3</option>');
}

/**
 * Cambia el alto de línea
 */
function toLineHeight(){
    $('#toLineHeight').change(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.lineHeight($(this).val());
            layers[currentPage].draw();

            saveAction(false);
        }
    })
}

/**
 * Controla las transformaciones de los elementos
 * 
 * @param {object} textNode Nodo
 */
function handleTransform(textNode){
    switch(textNode.name()){
        case 'text':
            var options = {
                node: textNode,
                keepRatio: true,
                rotateEnabled: false
            }
        break;
        case 'image':
            var options = {
                node: textNode,
                keepRatio: true,
                rotateEnabled: true
            }
        break;
    }

    var tr = new Konva.Transformer(options);

    layers[currentPage].draw();

    var currentText = '';

    textNode.on('dblclick dbltap', () => {
        changingText = true;
        currentText = textNode.text();

        // Oculta el nodo texto y la transformación
        textNode.hide();
        tr.hide();
        layers[currentPage].draw();

        // Crea un textarea por encima del nodo texto para poder editarlo
        var textPosition = textNode.absolutePosition();
        var stageBox = stages[currentPage].container().getBoundingClientRect();
        var areaPosition = {
			x: stageBox.left + textPosition.x,
			y: stageBox.top + textPosition.y
        }

        var pageNumberHeight = 0;
        $.each(stages, function(i, elem){
            if(i == currentPage){
                return false;
            }
            if(elem != undefined){
                pageNumberHeight++;
            }
        })

        var top = $('#page' + currentPage)[0].getBoundingClientRect().top + window.scrollY + textPosition.y;

        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        $(window).resize(function(){
            var textPosition = textNode.absolutePosition();
            var stageBox = stages[currentPage].container().getBoundingClientRect();
            var areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y
            }
            textarea.style.left = areaPosition.x + 'px';

            var top = $('#page' + currentPage)[0].getBoundingClientRect().top + window.scrollY + textPosition.y;
            textarea.style.top = top + 'px';
        })

        // Estilos
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = top + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height = textNode.height() - textNode.padding() * 2 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.fontWeight = textNode.fontStyle();
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        var rotation = textNode.rotation();
        var transform = '';
        if(rotation){
            transform += 'rotateZ(' + rotation + 'deg)';
        }

        var px = 0;
        // En Firefox
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if(isFirefox){
            px += 2 + Math.round(fontSize / 20);
        }
        transform += 'translateY(-' + px + 'px)';

        textarea.style.transform = transform;

        textarea.focus();

        // Elimina el textarea creado por encima del nodo
        function removeTextarea(){
			textarea.parentNode.removeChild(textarea);
			window.removeEventListener('click', handleOutsideClick);
			textNode.show();
			tr.show();
			tr.forceUpdate();
            layers[currentPage].draw();
            changingText = false;
        }

        function setTextareaWidth(newWidth){
			if(!newWidth){
				// Asigna un ancho al placeholder
				newWidth = textNode.placeholder.length * textNode.fontSize();
            }
            
			// Arreglos en distintos navegadores
			var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
			if(isSafari || isFirefox){
				newWidth = Math.ceil(newWidth);
			}

			var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
			if(isEdge){
				newWidth += 1;
			}
			textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', function(e){
			// Eliminar y guardar estado al pulsar enter
			if(e.keyCode === 13 && !e.shiftKey){
				textNode.text(textarea.value);
                removeTextarea();
                if(currentText != textNode.text()){
                    saveAction(false);
                }

                stages[currentPage].find('Transformer').destroy();
                layers[currentPage].draw();
                selected = null;
                
                cleanActions();
			}
            
            // Al pulsar ESC no guarda el estado
			if(e.keyCode === 27){
                removeTextarea();
            }

            scale = textNode.getAbsoluteScale().x;
			setTextareaWidth(textNode.width() * scale);
			textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
        })

        // Elimina el textarea al clickar fuera de él
        function handleOutsideClick(e){
            if(e.target !== textarea){
                textNode.text(textarea.value);
                removeTextarea();
                if(currentText != textNode.text()){
                    saveAction(false);
                }

                stages[currentPage].find('Transformer').destroy();
                layers[currentPage].draw();
                selected = null;
                
                cleanActions();
			}
        }

        setTimeout(() => {
          	window.addEventListener('click', handleOutsideClick);
        })
    })
}

/**
 * Controla el puntero del ratón
 */
function handleMouse(node){
    node.on('mouseenter', function(){
        if(stages[currentPage] != undefined){
            stages[currentPage].container().style.cursor = 'move';
        }
    })
    node.on('mouseleave', function(){
        if(stages[currentPage] != undefined){
            stages[currentPage].container().style.cursor = 'default';
        }
    })
}

/**
 * Limpia los campos de las opciones
 */
function cleanOptions(){
    $('#optionsSection').addClass('hide');
    $('#fillSection').addClass('hide');
    $('#strokeSection').addClass('hide');
    $('#strokeWidthSection').addClass('hide');
    $('#widthSection').addClass('hide');
    $('#heightSection').addClass('hide');
    $('#radiusSection').addClass('hide');
    $('#radiusXSection').addClass('hide');
    $('#radiusYSection').addClass('hide');
    $('#angleSection').addClass('hide');
    $('#rotationSection').addClass('hide');
    $('#numPointsSection').addClass('hide');
    $('#innerRadiusSection').addClass('hide');
    $('#outerRadiusSection').addClass('hide');
    $('#sidesSection').addClass('hide');
    $('#pointerLengthSection').addClass('hide');
    $('#pointerWidthSection').addClass('hide');
    $('#textOptionsSection').addClass('hide');
    $('#imageOptionsSection').addClass('hide');
    $('#opacitySection').addClass('hide');
    $('#toLayerPlus').attr('disabled', true);
    $('#toLayerMinus').attr('disabled', true);
}

/**
 * Selecciona un elemento
 * 
 * @param {int} pageNumber Página
 */
function selectElement(pageNumber){
    stages[pageNumber].on('click tap', function(e){
        if(e.target.attrs.id != undefined && e.target.attrs.id.match(/addSign/)){
            return false;
        }

        // Elimina todas las transformaciones al clickar en una área vacía
        if(e.target.parent == null){
			stages[pageNumber].find('Transformer').destroy();
			layers[pageNumber].draw();

            cleanActions();
            cleanOptions();

			return false;
        }

        // Limpia los estados de los botones de las acciones
        if(e.target.name().toLowerCase() != 'text'){
            cleanActions();
        }
        
        // Elimina todas las transformaciones
        stages[pageNumber].find('Transformer').destroy();
  
        switch(e.target.name()){
            case 'text':
                var options = {
                    keepRatio: true,
                    rotateEnabled: false
                }
            break;
            case 'image':
                var options = {
                    keepRatio: true,
                    rotateEnabled: true
                }
            break;
        }

        switch(e.target.getClassName()){
            case 'Line':
                var options = {
                    keepRatio: true,
                    rotateEnabled: true,
                    enabledAnchors: ['middle-left', 'middle-right']
                }
            break;
        }

        var tr = new Konva.Transformer(options);
        layers[pageNumber].add(tr);
        tr.attachTo(e.target);
        layers[pageNumber].draw();
    })
}

/**
 * Quita la selección de un elemento
 */
function unselectElement(){
    document.addEventListener('keydown', function(e){
        if(selected != null && e.keyCode === 27){
            stages[currentPage].find('Transformer').destroy();
			layers[currentPage].draw();
            selected = null;
            
            cleanActions();
        }
    })
}

/**
 * Limpia los estados de los botones de las acciones
 */
function cleanActions(){
    $('#toBold').removeClass('active')
    $('#toItalic').removeClass('active')
    $('#toUnderline').removeClass('active')
    $('#toLineThrough').removeClass('active')
    $('#toAlignLeft').removeClass('active')
    $('#toAlignCenter').removeClass('active')
    $('#toAlignRight').removeClass('active')
    $('#toAlignJustify').removeClass('active')
    $('#toFontSize').val(12)
    $('#toLineHeight').val(1)
}

/**
 * Elimina un elemento
 */
function toDelete(){
    $('#toDelete').click(function(){
        if(selected != null){
            removeElement();
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
 * Mueve un elemento con las flechas del teclado
 */
function keyboardActions(){
    window.addEventListener('keydown', function(e){
        if(selected != null){
            // Mover elemento
            if(!changingText && e.keyCode == 37 && !e.shiftKey){
                var x = selected.x() - 5 < 0 ? selected.x() : selected.x() - 5;
                selected.setX(x);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }else if(!changingText && e.keyCode == 37 && e.shiftKey){
                var x = selected.x() - 10 < 0 ? selected.x() : selected.x() - 10;
                selected.setX(x);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }
            if(!changingText && e.keyCode == 38 && !e.shiftKey){
                var y = selected.y() - 5 < 0 ? selected.y() : selected.y() - 5;
                selected.setY(y);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }else if(!changingText && e.keyCode == 38 && e.shiftKey){
                var y = selected.y() - 10 < 0 ? selected.y() : selected.y() - 10;
                selected.setY(y);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }
            if(!changingText && e.keyCode == 39 && !e.shiftKey){
                var x = selected.x() + 20 > width ? selected.x() : selected.x() + 5;
                selected.setX(x);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }else if(!changingText && e.keyCode == 39 && e.shiftKey){
                var x = selected.x() + 20 > width ? selected.x() : selected.x() + 10;
                selected.setX(x);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }
            if(!changingText && e.keyCode == 40 && !e.shiftKey){
                var y = selected.y() + 20 > height ? selected.y() : selected.y() + 5;
                selected.setY(y);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }else if(!changingText && e.keyCode == 40 && e.shiftKey){
                var y = selected.y() + 20 > height ? selected.y() : selected.y() + 10;
                selected.setY(y);
                stages[currentPage].draw();
                saveAction(false);
                e.preventDefault();
            }

            // Eliminar un elemento
            if(e.keyCode == 46){
                if(!changingText){
                    $('#toDelete').click();
                }
            }

            // Subir una capa
            if(e.keyCode == 81 && e.ctrlKey){
                $('#toLayerPlus').click();
            }

            // Bajar una capa
            if(e.keyCode == 77 && e.ctrlKey){
                $('#toLayerMinus').click();
            }

            // Texto
            if(selected != null && selected.name() == 'text'){
                // Negrita
                if(e.keyCode == 66 && e.ctrlKey){
                    $('#toBold').click();
                }
                // Cursiva
                if(e.keyCode == 73 && e.ctrlKey){
                    $('#toItalic').click();
                }
                // Subrayado
                if(e.keyCode == 85 && e.ctrlKey){
                    $('#toUnderline').click();
                }
                // Tachado
                if(e.keyCode == 76 && e.ctrlKey){
                    $('#toLineThrough').click();
                }
                // Alinear a la izquierda
                if(e.keyCode == 65 && e.ctrlKey){
                    $('#toAlignLeft').click();
                }
                // Alinear al centro
                if(e.keyCode == 83 && e.ctrlKey){
                    $('#toAlignCenter').click();
                }
                // Alinear a la derecha
                if(e.keyCode == 68 && e.ctrlKey){
                    $('#toAlignRight').click();
                }
                // Justificar
                if(e.keyCode == 70 && e.ctrlKey){
                    $('#toAlignJustify').click();
                }
            }
        }

        // Deshacer
        if(e.keyCode == 90 && e.ctrlKey){
            $('#toUndo').click();
        }

        // Rehacer
        if(e.keyCode == 89 && e.ctrlKey){
            $('#toRedo').click();
        }
    })
}

/**
 * Mueve el elemento hacia arriba
 */
function toLayerPlus(){
    $('#toLayerPlus').click(function(){
        if(selected != null){
            var currentZIndex = selected.zIndex();
            if(currentZIndex >= 0 && currentZIndex < (maxZIndex[currentPage] - 1)){
                selected.zIndex(++currentZIndex);
                stages[currentPage].draw();
                saveAction(false);
            }
        }
    })
}

/**
 * Mueve el elemento hacia abajo
 */
function toLayerMinus(){
    $('#toLayerMinus').click(function(){
        if(selected != null){
            var currentZIndex = selected.zIndex();
            if(currentZIndex >= 1 && currentZIndex < maxZIndex[currentPage]){
                selected.zIndex(--currentZIndex);
                stages[currentPage].draw();
                saveAction(false);
            }
        }
    })
}

/**
 * Abre la modal de subida de imágenes
 */
function openImageModal(){
    $('#toAddImage').click(function(){
        // Gets images from source
        $('#imagesSources').empty()
        $('#loadingAddImage').removeClass('hide');
        $('#selectAddImageText').addClass('hide');
        $("#chooseImage").attr("disabled", true);
        $("#image").val('');

        $.ajax({
            url: uri + 'core/obituaries/functions.php',
            method: 'POST',
            data: {
                type: 'listDir'
            },
            async: false,
            dataType: 'json',
            success: function(data){
                try{
                    printImages(data)
                    $('#loadingAddImage').addClass('hide')
                    $('#selectAddImageText').removeClass('hide')
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
        
        $('#modal-upload-file').modal('show')
    })
}

/**
 * Prints images to upload section
 * 
 * @param {array} data Data
 */
function printImages(data){
    var html = ''

    $.each(data, function(index, elem){
        html +=
            '   <div class="col-xs-2" style="margin-bottom: 4px; display: flex; align-items: center;">' +
            '       <img class="img-responsive select-image" src="' + elem.img + '" image-name="' + elem.name + '" style="object-fit: contain; object-position: center; width: 100%; height: 100px;">' +
            '   </div>'
    })
    $('#imagesSources').html(html)
    $('#imagesSources').removeClass('hide')

    $('.select-image').click(function(){
        $('#imagesSources .select-image').css('border', 'none').removeClass('image-selected')
        $(this).css('border', 'solid 2px red').addClass('image-selected')

        $("#chooseImage").attr("disabled", false)
    })

    $('#chooseImage').closest('div').removeClass('hide')
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
 * Dibuja imagen
 * 
 * @param {object} options 
 */
function drawImage(options, page = null){
    var imageObj = new Image()
    imageObj.onload = function(){
        var image = new Konva.Image({
            x: options.x,
            y: options.y,
            image: imageObj,
            width: options.width,
            height: options.height,
            id: options.id,
            draggable: options.draggable,
            name: options.name,
            rotation: options.rotation,
            scaleX: options.scaleX,
            scaleY: options.scaleY,
            opacity: options.opacity,
            dragBoundFunc: function(pos){
                if(startX == null || startY == null){
                    return {
                        x: pos.x,
                        y: pos.y
                    }
                }else{
                    var x = pos.x < 0 || pos.x > width - 10 ? startX : pos.x
                    var y = pos.y < 0 || pos.y > height - 10 ? startY : pos.y
                    return {
                        x: x,
                        y: y
                    }
                }
            }
        })

        // Estilos
        image.cache()

        image.filters([
            Konva.Filters.Blur,
            Konva.Filters.Brighten,
            Konva.Filters.Contrast,
            Konva.Filters.Emboss,
            Konva.Filters.Enhance,
            Konva.Filters.Noise,
            Konva.Filters.Pixelate
        ])

        image.blurRadius(options.blurRadius)
        image.brightness(options.brightness)
        image.contrast(options.contrast)
        image.embossStrength(options.embossStrength)
        image.embossBlend(options.embossBlend)
        image.enhance(options.enhance)
        image.noise(options.noise)
        image.pixelSize(options.pixelate)

        image.on('click tab', function(){
            selected = this

            cleanOptions()

            $('#optionsSection').removeClass('hide')
            $('#toLayerPlus').attr('disabled', false)
            $('#toLayerMinus').attr('disabled', false)
            $('#imageOptionsSection').removeClass('hide')
            $('#opacitySection').removeClass('hide')

            $('#opacityOption').val(selected.opacity())
            $('#blurOption').val(selected.blurRadius())
            $('#brightnessOption').val(selected.brightness())
            $('#contrastOption').val(selected.contrast())
            $('#embossOption').val(selected.embossStrength())
            $('#enhanceOption').val(selected.enhance())
            $('#maskOption').val(selected.threshold())
            $('#noiseOption').val(selected.noise())
            $('#pixelateOption').val(selected.pixelSize())
        })

        image.on('dragstart', function(){
            startX = this.x()
            startY = this.y()
        })

        image.on('dragend', function(){
            saveAction(false)
        })

        image.on('transformend', function(){
            saveAction(false)
        })
        
        if(options.mouse){
            handleMouse(image);
        }

        if(page == null){
            layers[currentPage].add(image);
            layers[currentPage].draw();
        }else{
            layers[page].add(image);
            layers[page].draw();
        }
    }

    if(options.src.includes('--------') && firtsLoad){
        var stampAux = options.src.split('--------')[0].split(documentID+'/')[1];
        var newSrc = options.src.replace('/tmp/documentEditor/'+documentID+'/'+stampAux+'--------', '/documentEditor/'+documentID+'/img/');
        imageObj.src = newSrc;
    }else{
        imageObj.src = options.src;
    }
}

/**
 * Mostrar sección de ayuda
 */
function showHelp(){
    $('#showHelp').click(function(){
        $('#modal-help').modal('show');
    })
}

/**
 * Mostrar sección de datos del expedienet
 */
function showExpedientInfo(){
    $('#showExpedientInfo').click(function(){
        $('#modal-expedient-info').modal('show');
    })

    $('.expediente-copy-alias').click(function(){
        let text = $(this).attr('alias');
        copyToClipboard(text);
    })
}

/**
 * Acción deshacer
 */
function toUndo(){
    $('#toUndo').click(function(){
        if(!flagUndoRedo && currentState > 0){
            currentState--;
            
            redraw();
            cleanActions();
            cleanOptions();

            currentState == saveState ? $('#unsaveMessage').addClass('hide') : $('#unsaveMessage').removeClass('hide');
        }
    })
}

/**
 * Acción deshacer
 */
function toRedo(){
    $('#toRedo').click(function(){
        if(!flagUndoRedo && currentState < states.length - 1){
            currentState++;
            
            redraw();
            cleanActions();
            cleanOptions();

            currentState == saveState ? $('#unsaveMessage').addClass('hide') : $('#unsaveMessage').removeClass('hide');
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
 * Copies a text to clipboard
 * 
 * @param {string} text Text to copy
 */
async function copyToClipboard(text){
    try{
        await navigator.clipboard.writeText(text);

        $('#block-message').html('<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> El alias de los datos del expediente ha sido copiado</div>')
        setTimeout(function(){
            $('#block-message').empty();
        }, 5000)

        $('#modal-expedient-info').modal('hide');
    }catch(err){
        console.error('Failed to copy: ', err);
    }
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