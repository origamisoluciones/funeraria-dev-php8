// Select
var limit_page = 10
var langSelect2 = {
    inputTooShort: function(args){
        return "Escribir ..."
    },
    inputTooLong: function(args){
        return "Término demasiado largo"
    },
    errorLoading: function(){
        return "Sin resultados"
    },
    loadingMore: function(){
        return "Cargando más resultados"
    },
    noResults: function(){
        return "No hay resultados"
    },
    searching: function(){
        return "Buscando..."
    },
    maximumSelected: function(args){
        return "Sin resultados"
    }
}

/**
 * @var {object} stamp Stamp
 */
var stamp = moment().format('X')

/**
 * @var {object} stage Escenario
 */
var stage

/**
 * @var {object} layer Capa
 */
var layer

/**
 * @var {int} width Ancho del folio
 */
var width

/**
 * @var {int} height Alto del folio
 */
var height

/**
 * @var {object} selected Elemento seleccionado
 */
var selected

/**
 * @var {int} startX Posición x inicial
 */
var startX

/**
 * @var {int} startY Posición y inicial
 */
var startY

/**
 * @var {int} addTextIndex Índice para el texto añadido
 */
var addTextIndex = 0

/**
 * @var {int} addFigureIndex Índice para las figuras añadidas
 */
var addFigureIndex = 0

/**
 * @var {int} imagesCont Contador de imágenes
 */
var imagesCont = 0

/**
 * @var {array} imagesToDelete Imágenes a eliminar
 */
var imagesToDelete = new Array

/**
 * @var {array} imagesUnsaveToDelete Imágenes a eliminar que no se han guardado
 */
var imagesUnsaveToDelete = new Array

/**
 * @var {boolean} saved Estado de guardado
 */
var saved = true

/**
 * @var {int} maxZIndex Z-index más alto (posicionamiento por capas)
 */
var maxZIndex = 0

/**
 * @var {array} states Estados
 */
var states = new Array

/**
 * @var {int} currentState Estado actual
 */
var currentState = 0

/**
 * @var {int} saveState Último estado de guardado
 */
var saveState = 0

/**
 * @var {boolean} flagUndoRedo Bandera que controla si se está realizando la acción de deshacer o rehacer
 */
var flagUndoRedo = false

/**
 * @var {boolean} locked Bandera que controla si el editor ya ha sido abierto o es la primera vez que se abre para esta esquela
 */
var locked = false

/**
 * @var {boolean} locked Bandera que controla si se ha pulsado el botón de guardar
 */
var saveClick = false

/**
 * @var {object} gridLayer Rejilla
 */
var gridLayer

/**
 * @var {int} blockSnapSize Tamaño de la rejilla
 */
var blockSnapSize = 15

/**
 * @var {boolean} changingText Bandera que controla si se está editando texto
 */
var changingText = false

/**
 * @var {int} company Empresa 
 */
var company

/**
 * @var {int} hasTransept Bandera que controla se tiene la imagen crucero 
 */
var hasTransept

/**
 * @var {int} hasLogo Bandera que controla se tiene la imagen logo 
 */
var hasLogo

var firtsLoad = true;

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
 * Carga de datos
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 * @return {string} json Datos
 */
function load(expedient, type, model){
    var json

    $.ajax({
        url: uri + 'resources/files/' + company + '/expedients/' + expedient + '/tombstone/' + type + '/' + model + '/files/json.json?v=' + moment().format('X'),
        data: 'GET',
        async: false,
        success: function(data){
            try{
                json = data
            }catch(e){
                json = null
            }
        },
        error: function(){
            json = null
        }
    })

    return json
}

/**
 * Dibuja los datos cargados
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 * @param {string} data Datos
 */
function drawLoad(expedient, type, model, data){
    if(data != null){
        // Escenario auxiliar
        var stageAux = Konva.Node.create(data, 'pageAux')
        
        width = $('#page').innerWidth()
        height = $('#page').innerHeight()

        // Escenario
        stage = new Konva.Stage({
            container: 'page',
            width: width,
            height: height,
            name: 'page'
        })

        // Capa
        layer = new Konva.Layer()

        // Rejilla
        gridLayer = new Konva.Layer()
        var padding = blockSnapSize
        for (var i = 0; i < width / padding; i++) {
            gridLayer.add(new Konva.Line({
                points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
                stroke: '#ddd',
                strokeWidth: 0.5,
            }))
        }

        gridLayer.add(new Konva.Line({points: [0,0,10,10]}))
        for (var j = 0; j < height / padding; j++) {
            gridLayer.add(new Konva.Line({
                points: [0, Math.round(j * padding), width, Math.round(j * padding)],
                stroke: '#ddd',
                strokeWidth: 0.5,
            }))
        }

        stage.add(layer)
        stage.add(gridLayer)

        // Acciones
        reload(expedient, type, model)
        preview()
        save(expedient, type, model)
        selectElement()
        unselectElement()
        
        // Navegador lateral
        // Elementos
        toAddText()
        openImageModal()
        uploadImage(expedient, type, model)
        toAddCross()
        toAddRectangle()
        toAddCircle()
        toAddEllipse()
        toAddWedge()
        toAddLine()
        toAddStar()
        toAddRing()
        toAddArc()
        toAddPolygon()
        toAddArrow()
        
        // Opciones
        toFillColor()
        toStrokeColor()
        changeOptions()
        
        // Acciones
        toDelete(expedient, type, model)
        toUndo(expedient, type, model)
        toRedo(expedient, type, model)
        toLayerPlus()
        toLayerMinus()
        
        // Texto
        toBold()
        toItalic()
        toUnderline()
        toLineThrough()
        toAlignLeft()
        toAlignCenter()
        toAlignRight()
        toAlignJustify()
        fillFontFamily()
        toFontFamily()
        fillFontSize()
        toFontSize()
        toFontColor()
        fillLineHeight()
        toLineHeight()

        // Teclado
        keyboardActions()
        showHelp()

        // Imágenes
        var imgs = stageAux.find('.image')
        
        setTimeout(() => {
            // Fondo - Se carga primero para que esté en el fondo
            $.each(imgs, function(){
                if($(this)[0].id() == 'background'){
                    var optionsImg = {
                        x: $(this)[0].x(),
                        y: $(this)[0].y(),
                        width: $(this)[0].width(),
                        height: $(this)[0].height(),
                        id: $(this)[0].id(),
                        draggable: $(this)[0].draggable(),
                        name: $(this)[0].name(),
                        src: uri + 'resources/files/' + company + '/expedients/' + expedient + '/tombstone/' + type + '/' + model + '/img/background.jpg',
                        mouse: false,
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
    
                    drawImage(optionsImg, expedient, type, model)
    
                    return false
                }
            })

            setTimeout(() => {
                var images
                var cont
                $.ajax({
                    url: uri + 'core/expedients/tombstone/scandir.php',
                    method: 'POST',
                    data: {
                        expedient: expedient,
                        type: type,
                        model: model
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
                
                setTimeout(() => {
                    if(images != null){
                        $.each(imgs, function(){
                            if($(this)[0].id() != 'background'){
                                var optionsImg = {
                                    x: $(this)[0].x(),
                                    y: $(this)[0].y(),
                                    width: $(this)[0].width(),
                                    height: $(this)[0].height(),
                                    id: $(this)[0].id(),
                                    draggable: $(this)[0].draggable(),
                                    name: $(this)[0].name(),
                                    src: uri + 'resources/files/' + company + '/expedients/' + expedient + '/tombstone/' + type + '/' + model + '/img/' + images[$(this)[0].id()],
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
                    
                                //setTimeout(() => {
                                    drawImage(optionsImg, expedient, type, model)
                                //}, 150)
                            }
                        })
                    }

                    imagesCont = parseInt(cont)
                    
                    setTimeout(() => {
                        // Textos
                        var texts = stageAux.find('.text')
                        $.each(texts, function(){
                            var optionsText = {
                                x: $(this)[0].x(),
                                y: $(this)[0].y(),
                                width: $(this)[0].width(),
                                name: $(this)[0].name(),
                                id: $(this)[0].id(),
                                draggable: $(this)[0].draggable(),
                                fill: $(this)[0].fill(),
                                opacity: $(this)[0].opacity()
                            }
                            
                            if($(this)[0].id().match(/addText/)){
                                addTextIndex++
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

                            //setTimeout(() => {
                                drawText(optionsText, styleText)
                            //}, 150)
                        })

                        setTimeout(() => {
                            // Figuras
                            var figures = stageAux.find('.figure')
                            $.each(figures, function(){
                                var type = $(this)[0].getClassName()

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
                                        
                                        //setTimeout(() => {
                                            drawRectangle(options)
                                        //}, 150)
                                        break
                                        
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

                                        //setTimeout(() => {
                                            drawCircle(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawEllipse(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawWedge(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawLine(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawStar(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawRing(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawArc(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawPolygon(optionsFigure)
                                        //}, 150)
                                        break

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

                                        //setTimeout(() => {
                                            drawArrow(optionsFigure)
                                        //}, 150)
                                        break
                                }

                                if($(this)[0].id().match(/addFigure/)){
                                    addFigureIndex++
                                }
                            })

                            // Modifica el z-index de cada elemento
                            setTimeout(() => {
                                maxZIndex = layer.children.length
                                $.each(imgs, function(index, elem){
                                    if(stage.find('#' + elem.id())[0] != undefined){
                                        stage.find('#' + elem.id())[0].zIndex(elem.zIndex())
                                    }
                                })
                                $.each(texts, function(index, elem){
                                    if(stage.find('#' + elem.id())[0] != undefined){
                                        stage.find('#' + elem.id())[0].zIndex(elem.zIndex())
                                    }
                                })
                                $.each(figures, function(index, elem){
                                    if(stage.find('#' + elem.id())[0] != undefined){
                                        stage.find('#' + elem.id())[0].zIndex(elem.zIndex())
                                    }
                                })
                                
                                if(stage.find('#background')[0] != undefined){
                                    stage.find('#background')[0].zIndex(0)
                                }
                                stage.draw()

                                states.push($.parseJSON(stage.toJSON()))
                                $('.main').removeClass('hide')
                            }, 3000)
                        }, 150)
                    }, 150)
                }, 150)
            }, 150)
        }, 150)

        $('#pageAux').remove()

        saveAction(true)
    }
}

/**
 * Recarga la esquela con los datos del formulario
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function reload(expedient, type, model){
    $('#reload').click(function(){
        var obituary = null
        $.ajax({
            url: uri + 'core/expedients/tombstone/getData.php',
            method: 'POST',
            data: {
                expedient: expedient,
                type: type,
                model: model
            },
            async: false,
            success: function(data){
                try{
                    obituary = $.parseJSON(data)[1]
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

        if(obituary != null){
            /*stage.find('#quote')[0].text('" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "')
            var extraText = obituary.extraText == '' ? '' : ' (' + obituary.extraText + ')'
            stage.find('#deceased')[0].text(obituary.namePre + ' ' + obituary.name + ' ' + obituary.surname + extraText)
            if(obituary.spouseName == ''){
                stage.find('#widow')[0].text('')
            }else{
                stage.find('#widow')[0].text('(' + obituary.spousePre + ' ' + obituary.spouseName + ')')
            }
            stage.find('#died')[0].text(obituary.died)
            var dep = obituary.dep == 1 ? 'D.E.P.' : ''
            stage.find('#dep')[0].text(dep)
            var family = ''
            if(obituary.spouseName == ''){
                family += obituary.spouseName != '' ? obituary.spousePre + ' ' + obituary.spouseName + '; ' : ''
            }
            family += obituary.childrenNames != '' ? obituary.childrenPre + ' ' + obituary.childrenNames + '; ' : ''
            family += obituary.childrenInLawNames != '' ? obituary.childrenInLawPre + ' ' + obituary.childrenInLawNames + '; ' : ''
            family += obituary.grandchildrenNames != '' ? obituary.grandchildrenPre + ' ' + obituary.grandchildrenNames + '; ' : ''
            family += obituary.grandchildrenInLawNames != '' ? obituary.grandchildrenInLawPre + ' ' + obituary.grandchildrenInLawNames + '; ' : ''
            family += obituary.greatGrandchildrenNames != '' ? obituary.greatGrandchildrenPre + ' ' + obituary.greatGrandchildrenNames + '; ' : ''
            family += obituary.parentsNames != '' ? obituary.parentsPre + ' ' + obituary.parentsNames + '; ' : ''
            family += obituary.parentsInLawNames != '' ? obituary.parentsInLawPre + ' ' + obituary.parentsInLawNames + '; ' : ''
            family += obituary.paternalGrandfathersNames != '' ? obituary.paternalGrandfathersPre + ' ' + obituary.paternalGrandfathersNames + '; ' : ''
            family += obituary.paternalGrandmotherNames != '' ? obituary.paternalGrandmotherPre + ' ' + obituary.paternalGrandmotherNames + '; ' : ''
            family += obituary.siblingsNames != '' ? obituary.siblingsPre + ' ' + obituary.siblingsNames + '; ' : ''
            family += obituary.politicalSiblingsNames != '' ? obituary.politicalSiblingsPre + ' ' + obituary.politicalSiblingsNames + '; ' : ''
            family += obituary.siblings == 1 ? 'hermanos, ' : ''
            family += obituary.politicalSiblings == 1 ? 'hermanos políticos, ' : ''
            family += obituary.grandchildren == 1 ? 'nietos, ' : ''
            family += obituary.politicalGrandchildren == 1 ? 'nietos políticos, ' : ''
            family += obituary.greatGrandchildren == 1 ? 'bisnietos, ' : ''
            family += obituary.uncles == 1 ? 'tíos, ' : ''
            family += obituary.nephews == 1 ? 'sobrinos, ' : ''
            family += obituary.cousins == 1 ? 'primos, ' : ''
            family += ' ' + obituary.restFamily
            stage.find('#family')[0].text(family)
            stage.find('#pray')[0].text(obituary.pray)
            stage.find('#bus')[0].text(obituary.busRoute)*/

            stage.draw()

            saveAction(false)
        }
    })
}

/**
 * Guardado de datos y descarga de pdf
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function save(expedient, type, model){
	$('#download').click(function(){
        if(!saveClick){
            saveClick = true

            $('#modal-download').modal('show')

            setTimeout(() => {
                $.ajax({
                    url: uri + 'core/expedients/tombstone/preSave.php',
                    method: 'POST',
                    data: {
                        expedient: expedient,
                        type: type,
                        model: model,
                        stamp: stamp
                    },
                    async: false,
                    dataType: 'json',
                    success: function(data){
                        if(data){
                            // Elimina todas las transformaciones
                            stage.find('Transformer').destroy()
                            gridLayer.hide()
                            
                            stage.draw()
                            if(selected != null){
                                selected.setDraggable(false);
                            }
                            selected = null
                    
                            var canvas = stage.toCanvas({ pixelRatio: 2 });
                            var ctx = canvas.getContext("2d");

                            ctx.globalCompositeOperation = 'destination-over';
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            var img = canvas.toDataURL("image/png");
                            
                            var json = stage.toJSON()
                            gridLayer.show()
                            stage.draw()
            
                            $.ajax({
                                url: uri + 'core/expedients/tombstone/save.php',
                                method: 'POST',
                                data: {
                                    expedient: expedient,
                                    type: type,
                                    model: model,
                                    img: img,
                                    json: json,
                                    stamp: stamp
                                },
                                async: true,
                                success: function(data){
                                    try{
                                        url = $.parseJSON(data)
                                        saveAction(true)
                                        imagesUnsaveToDelete = []
                                        saveState = currentState
                                        saveClick = false
                    
                                        window.open(uri + 'descargar-archivo?file=expedients/'+ expedient + '/tombstone/' + type + '/' + model + '/files/lapida.pdf', '_blank')
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
    
                setTimeout(() => {
                    $('#modal-download').modal('hide')
                }, 3000)
            }, 500)
        }
    })
}

/**
 * Elimina un elemento
 */
function removeElement(expedient, type, model){
    if(selected.name() == 'image'){
        // Delete file on server when remove on stage
        var data = {
            expedient: expedient,
            type: type,
            model: model,
            filename: selected.id(),
            stamp: stamp
        }
        $.ajax({
            url: uri + 'core/expedients/tombstone/remove.php',
            method: 'POST',
            data: data,
            async: false
        })

        imagesToDelete.push(selected.id())
        
        selected.destroy()
        stage.find('Transformer').destroy()
        layer.draw()
        selected = null
        imagesCont--
    }else{
        selected.destroy()
        stage.find('Transformer').destroy()
        layer.draw()
        selected = null
    }

    saveAction(false)
    maxZIndex--

    cleanActions()
    cleanOptions()
}

/**
 * Sube una imagen
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function uploadImage(expedient, type, model){
    $('#uploadImage').click(function(){
        if(document.getElementById('image').files.length == 0){
            $('#emptyError').removeClass('hide')
        }else{
            $('#emptyError').addClass('hide')

            var file = document.getElementById('image').files[0]
    
            var filename = file.name.split('.')
            var extension = filename[filename.length - 1]
            
            switch(extension.toLowerCase()){
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                    $('#formatError').addClass('hide')
                    break
                    
                default:
                    $('#formatError').removeClass('hide')
                    return false
                    break
            }
    
            var data = new FormData
            data.append('expedient', expedient)
            data.append('type', type)
            data.append('model', model)
            data.append('file', file)
            data.append('cont', imagesCont)
            data.append('stamp', stamp)
            
            $.ajax({
                url: uri + 'core/expedients/tombstone/upload.php',
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
                                src: uri + data[2],
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

                            drawImage(optionsImg, expedient, type, model)
                            
                            imagesUnsaveToDelete.push('image_' + imagesCont)
                            imagesCont++

                            setTimeout(() => {
                                saveAction(false)
                            }, 250)
                            maxZIndex++
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
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function redraw(expedient, type, model){
    flagUndoRedo = true
    $('#blockCanvas').removeClass('hide')
    $('.main').addClass('hide')

    stage.destroy()

    $('.main').append('<div class="hide" id="pageAux"></div>')

    var stageAux = Konva.Node.create(states[currentState], 'pageAux')

    // Escenario
    stage = new Konva.Stage({
        container: 'page',
        width: width,
        height: height,
        name: 'page'
    })

    // Capa
    layer = new Konva.Layer()

    // Rejilla
    gridLayer = new Konva.Layer()
    var padding = blockSnapSize
    for (var i = 0; i < width / padding; i++) {
        gridLayer.add(new Konva.Line({
            points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
            stroke: '#ddd',
            strokeWidth: 0.5,
        }))
    }

    gridLayer.add(new Konva.Line({points: [0,0,10,10]}))
    for (var j = 0; j < height / padding; j++) {
        gridLayer.add(new Konva.Line({
            points: [0, Math.round(j * padding), width, Math.round(j * padding)],
            stroke: '#ddd',
            strokeWidth: 0.5,
        }))
    }

    stage.add(layer)
    stage.add(gridLayer)

    // Acciones
    selectElement()
    unselectElement()

    // Imágenes
    var imgs = stageAux.find('.image')
        
    // Fondo - Se carga primero para que esté en el fondo
    $.each(imgs, function(){
        if($(this)[0].id() == 'background'){
            var optionsImg = {
                x: $(this)[0].x(),
                y: $(this)[0].y(),
                width: $(this)[0].width(),
                height: $(this)[0].height(),
                id: $(this)[0].id(),
                draggable: $(this)[0].draggable(),
                name: $(this)[0].name(),
                src: uri + 'resources/files/' + company + '/expedients/' + expedient + '/tombstone/' + type + '/' + model + '/img/background.jpg',
                mouse: false,
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

            drawImage(optionsImg, expedient, type, model)

            return false
        }
    })

    var images
    var cont
    $.ajax({
        url: uri + 'core/expedients/tombstone/scandirRedraw.php',
        method: 'POST',
        data: {
            expedient: expedient,
            type: type,
            model: model,
            stamp: stamp
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

    if(images != null){
        $.each(imgs, function(){
            if($(this)[0].id() != 'background'){
                var src = uri + 'resources/files/' + company + '/expedients/' + expedient + '/obituary/' + type + '/' + model + '/img/' + images[$(this)[0].id()]
                if(images[$(this)[0].id()].includes('------')){
                    src = uri + 'resources/files/' + company + '/tmp/' + expedient + '/' + images[$(this)[0].id()]
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
    
                //setTimeout(() => {
                    drawImage(optionsImg, expedient, type, model)
                //}, 150)
            }
        })
    }

    imagesCont = parseInt(cont)

    // Textos
    var texts = stageAux.find('.text')
    $.each(texts, function(){
        var optionsText = {
            x: $(this)[0].x(),
            y: $(this)[0].y(),
            width: $(this)[0].width(),
            name: $(this)[0].name(),
            id: $(this)[0].id(),
            draggable: $(this)[0].draggable(),
            fill: $(this)[0].fill(),
            opacity: $(this)[0].opacity()
        }
        
        if($(this)[0].id().match(/addText/)){
            addTextIndex++
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

        //setTimeout(() => {
            drawText(optionsText, styleText)
        //}, 150)
    })

    // Figuras
    var figures = stageAux.find('.figure')
    $.each(figures, function(){
        var type = $(this)[0].getClassName()

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
                
                //setTimeout(() => {
                    drawRectangle(options)
                //}, 150)
                break
                
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

                //setTimeout(() => {
                    drawCircle(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawEllipse(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawWedge(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawLine(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawStar(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawRing(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawArc(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawPolygon(optionsFigure)
                //}, 150)
                break

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

                //setTimeout(() => {
                    drawArrow(optionsFigure)
                //}, 150)
                break
        }

        if($(this)[0].id().match(/addFigure/)){
            addFigureIndex++
        }
    })

    // Modifica el z-index de cada elemento
    setTimeout(() => {
        maxZIndex = layer.children.length
        $.each(imgs, function(index, elem){
            if(stage.find('#' + elem.id())[0] != undefined){
                stage.find('#' + elem.id())[0].zIndex(elem.zIndex())
            }
        })
        $.each(texts, function(index, elem){
            if(stage.find('#' + elem.id())[0] != undefined){
                stage.find('#' + elem.id())[0].zIndex(elem.zIndex())
            }
        })
        $.each(figures, function(index, elem){
            if(stage.find('#' + elem.id())[0] != undefined){
                stage.find('#' + elem.id())[0].zIndex(elem.zIndex())
            }
        })
        stage.draw()

        $('.main').removeClass('hide')
        flagUndoRedo = false
    }, 1000)

    $('#pageAux').remove()

    $('#blockCanvas').addClass('hide')
}

// Formato para el select
function formatData(data){
    return '<div id="' + data.id + '">' + data.text + '</div>'
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
 * Obtiene los datos del expediente
 * 
 * @param {int} expedientID Id del expediente
 */
function getExpedient(expedientID){
    var expedient
    
    $.ajax({
        url : uri + 'core/expedients/expedient/read.php',
        data : {
            ID: expedientID
        },
        type : 'POST',
        async : false,
        success : function(data){
            expedient = $.parseJSON(data)[0]
        }
    })

    return expedient
}

/**
 * Comprueba que los directorios para la esquela están creados
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function checkDirs(expedient, type, model){
    $.ajax({
        url: uri + 'core/expedients/tombstone/checkDirs.php',
        method: 'POST',
        data: {
            expedient: expedient,
            type: type,
            model: model
        },
        async: false,
        success: function(data){
            try{
                data = $.parseJSON(data)

                if(!data){
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

/**
 * Comprueba si ya se ha generado alguna esquela. En caso negativo, obtiene sus datos
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 * @return {array}
 */
function getObituary(expedient, type, model){
    var info = new Array
    $.ajax({
        url: uri + 'core/expedients/tombstone/getData.php',
        method: 'POST',
        data: {
            expedient: expedient,
            type: type,
            model: model
        },
        async: false,
        success: function(data){
            try{
                info = $.parseJSON(data)
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
 * Comprueba si el pdf de la esquela ya se ha creado
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function checkView(expedient, type, model){
    $.ajax({
        url: uri + 'core/expedients/tombstone/checkPdf.php',
        method: 'POST',
        data: {
            expedient: expedient,
            type: type,
            model: model
        },
        async: true,
        success: function(data){
            try{
                data = $.parseJSON(data)
                
                if(data){
                    $('#view').removeClass('hide')
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
 * Abre la esquela
 * 
 * @param {int} expedient Id del expediente
 * @param {int} type Tipo de esquela
 * @param {int} model Modelo de esquela
 */
function goView(expedient, type, model){
    $('#view').click(function(){
        window.open(uri + 'descargar-archivo?file=expedients/'+ expedient + '/tombstone/' + type + '/' + model + '/files/esquela.pdf', '_blank')
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
 * Obtiene el nombre del logo
 * 
 * @return string name Nombre del logo
 */
function getNameLogo(type, model){
    var name = 'logo.jpg'

    $.ajax({
        url: uri + 'core/expedients/tombstone/getLogo.php',
        method: 'POST',
        data: {
            type: type,
            model: model
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                name = data
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

    return name
}

/**
 * Obtiene el cliente del expediente
 * 
 * @param {int} expedient Expediente
 * @return {int} client Cliente
 */
function getClient(expedient){
    var client

    $.ajax({
        url: uri + 'core/expedients/tombstone/getClient.php',
        method: 'POST',
        data: {
            expedient: expedient
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                client = data
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

    return client
}

/**
 * Changes space on footer elements
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
    var expedientID = $('#expedientID').val()
    var obituaryType = $('#obituaryType').val()
    var obituaryModel = $('#obituaryModel').val()
    company = getCompany()
    if(company == null){
        return false
    }

    var isMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
    
    if(isMobile){
        $('#lockedMobileMessage').removeClass('hide')
        $('#blockCanvas').removeClass('hide')
        $('.sidenav').addClass('hide')
    }else{
        // Bloquea la esquela, de forma que sólo se pueda editar en el navegador que se haya abierto
        $.ajax({
            url: uri + 'core/expedients/tombstone/lock.php',
            method: 'POST',
            data: {
                expedient: expedientID,
                type: obituaryType,
                model: obituaryModel
            },
            async: false,
            success: function(data){
                try{
                    data = $.parseJSON(data)
                    if(data == 'locked'){
                        locked = true
                        $('#lockedMessage').removeClass('hide')
                        $('#blockCanvas').removeClass('hide')
                        $('.sidenav').addClass('hide')
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

    // Toolbar Bottom
    if(!locked){
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="preview" class="btn btn-primary">Vista previa</button>')
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="download" class="btn btn-success">Guardar y ver</button>')
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="view" class="btn btn-primary hide">Ver</button>')
    }else{
        $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="view" class="btn btn-primary hide">Ver</button>')
    }

    checkView(expedientID, obituaryType, obituaryModel)
    goView(expedientID, obituaryType, obituaryModel)

    if(isMobile){
        $('#reload').remove()
        $('#preview').remove()
        $('#download').remove()
    }
    $('.footer-static-bottom .block-2 .btn-gotop').before('<button type="button" id="backLink" class="btn btn-default"><i class="fa fa-arrow-circle-left c-lile" aria-hidden="true"></i> Volver</button>')
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
    changeSpaceFooter()

    setWidthBottomToolbar()
    $(window).resize(function(){
        setWidthBottomToolbar()
    })

    // Select
    $.fn.select2.defaults.set("width", "100%")
    
    $('.select2').select2({
        language: 'es',
        placeholder: '--',
        allowClear: true
    })

    // Go Top
    $('.btn-gotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 800)
        return false
    })

    // Moment - Idioma
    moment.locale('es')

    if(isExpedient(expedientID) && obituaryType != null && obituaryModel != null){
        $('#existsExpedient').remove()
    }else{
        $('#existsExpedient').removeClass('hide')
        setTimeout(() => {
            window.location.href = uri + 'expedientes'
        }, 2500)
        return
    }

    var expedient = getExpedient(expedientID)

    // CHECKS IF THE EXPEDIENT HAS RECTIFIED HIRING
    if(parseInt(expedient.hiring_rectified) == 1){
        $("#rectifiedTab").removeClass('hide');
    }else{
        $("#rectifiedTab").remove();
    }

    if(expedient.deceasedGender == 'Mujer'){
        gender = "Dña. "
    }else{
        gender = "D. "
    }
    $('#deceased').text(' '+gender + ' ' + expedient.deceasedName + ' ' + expedient.deceasedSurname);
    $('.numberExp').text(expedient.number);

    $('#chooseImage').click(function(){
        if($('.image-selected').length == 0){
            return false
        }
        var imageName = $('.image-selected').attr('image-name')

        $.ajax({
            url: uri + 'core/expedients/obituary/copyImage.php',
            method: 'POST',
            data: {
                expedient: expedientID,
                type: obituaryType,
                model: obituaryModel,
                imageName: imageName,
                stamp: stamp,
                doc: 'tombstone'
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
                                src: uri + data[2],
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

                            drawImage(optionsImg, expedientID, obituaryType, obituaryModel)
                            
                            imagesUnsaveToDelete.push('image_' + data[1])
                            imagesCont++

                            setTimeout(() => {
                                saveAction(false)
                            }, 250)
                            maxZIndex++
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
    var loadFlag = getObituary(expedientID, obituaryType, obituaryModel)
    if(loadFlag){
        var data = load(expedientID, obituaryType, obituaryModel)
        drawLoad(expedientID, obituaryType, obituaryModel, data)

        firtsLoad = false;
        return false
    }else{
        checkDirs(expedientID, obituaryType, obituaryModel)
    }

    // Guardar datos y descargar pdf
	save(expedientID, obituaryType, obituaryModel)
	
    width = $('#page').innerWidth()
    height = $('#page').innerHeight()

	// Escenario
    stage = new Konva.Stage({
        container: 'page',
        width: width,
		height: height,
		name: 'page'
    })

    gridLayer = new Konva.Layer()
    var padding = blockSnapSize
    for(var i = 0; i < width / padding; i++){
        gridLayer.add(new Konva.Line({
            points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
            stroke: '#ddd',
            strokeWidth: 0.5,
        }))
    }

    gridLayer.add(new Konva.Line({points: [0, 0 ,10 ,10]}))
    for(var j = 0; j < height / padding; j++){
        gridLayer.add(new Konva.Line({
            points: [0, Math.round(j * padding), width, Math.round(j * padding)],
            stroke: '#ddd',
            strokeWidth: 0.5,
        }))
    }

	// Capa
    layer = new Konva.Layer()
    
    stage.add(layer)
    stage.add(gridLayer)

    // Acciones
    reload(expedientID, obituaryType, obituaryModel)
    preview()
    selectElement()
    unselectElement()
    
    // Navegador lateral
    // Elementos
    toAddText()
    openImageModal()
    uploadImage(expedientID, obituaryType, obituaryModel)
    toAddCross()
    toAddRectangle()
    toAddCircle()
    toAddEllipse()
    toAddWedge()
    toAddLine()
    toAddStar()
    toAddRing()
    toAddArc()
    toAddPolygon()
    toAddArrow()

    // Opciones
    toFillColor()
    toStrokeColor()
    changeOptions()

    // Acciones
    toDelete(expedientID, obituaryType, obituaryModel)
    toUndo(expedientID, obituaryType, obituaryModel)
    toRedo(expedientID, obituaryType, obituaryModel)
    toLayerPlus()
    toLayerMinus()

    // Texto
    toBold()
    toItalic()
    toUnderline()
    toLineThrough()
    toAlignLeft()
    toAlignCenter()
    toAlignRight()
    toAlignJustify()
    fillFontFamily()
    toFontFamily()
    fillFontSize()
    toFontSize()
    toFontColor()
    fillLineHeight()
    toLineHeight()
    
    // Teclado
    keyboardActions()
    showHelp()
    
    var optionsBackground = {
        x: 0,
        y: 0,
        width: null,
        height: null,
        id: 'background',
        draggable: false,
        name: 'image',
        src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/tombstone/' + obituaryType + '/' + obituaryModel + '/img/background.jpg',
        mouse: false,
        rotation: null,
        scaleX: 0.68,
        scaleY: 0.68,
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

    drawImage(optionsBackground, expedientID, obituaryType, obituaryModel)
    
    hasLogo = false;
    switch(company){
        default:
            hasLogo = true
        break
    }

    if(hasLogo){
        // Logo
        switch(parseInt(company)){
            case 2:
            case 7:
                var scaleX = 0.07
                var scaleY = 0.07
                var x = 10
                var y = 620
            break
            case 3:
                var scaleX = 0.07
                var scaleY = 0.07
                var x = 10
                var y = 620
            break
            default:
                var scaleX = 1
                var scaleY = 1
                var x = 30
                var y = 700
            break
        }

        var optionsLogo = {
            x: x,
            y: y,
            width: null,
            height: null,
            id: 'logo',
            draggable: true,
            name: 'image',
            // src: uri + 'resources/files/' + company + '/settings/' + nameLogo,
            mouse: true,
            rotation: null,
            scaleX: scaleX,
            scaleY: scaleY,
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
    }

    setTimeout(() => {
        // if(hasLogo){
        //     setTimeout(() => {
        //         drawImage(optionsLogo, expedientID, obituaryType, obituaryModel)
        //     }, 250);
        // }

        // Nombre fallecido/a
        switch(obituaryModel){
            case '0':
                var x = 545
                var y = 185
                if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                    var fill = '#000000'
                }else{
                    var fill = '#00305c'
                }
                var width = 545
            break

            case '1':
                var x = 545
                var y = 185
                if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                    var fill = '#000000'
                }else{
                    var fill = '#84360f'
                }
                var width = 650
            break

            case '2':
                var x = 410
                var y = 145
                if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                    var fill = '#000000'
                }else{
                    var fill = '#00305c'
                }
                var width = 545
            break
        }
        
        var text = expedient.deceasedName + '\n' + expedient.deceasedSurname
        var x = x
        var y = y
        var fill = fill
        if(company == 6){
            var fontFamily = 'helvetica'
        }else if(company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
            var fontFamily = 'times new roman'
        }else{
            var fontFamily = 'garamonditalic'
        }
        var fontSize = 80
        var align = 'center'
        var lineHeight = 1.25
        var fontStyle = 'bold'

        var optionsDeceased = {
            x: x,
            y: y,
            width: width,
            name: 'text',
            id: 'deceased',
            draggable: true,
            fill: fill,
            opacity: 1
        }

        var styleDeceased = {
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontStyle: fontStyle,
            fontVariant: 'normal',
            textDecoration: 'empty string',
            text: text,
            align: align,
            verticalAlign: 'top',
            padding: 0,
            lineHeight: lineHeight,
            wrap: 'word',
            ellipsis: false
        }
        
        setTimeout(() => {
            drawText(optionsDeceased, styleDeceased)

            // Fecha fallecimiento y edad
            var deceasedDate = expedient.deceasedDate == null ? '' : moment(expedient.deceasedDate, 'YYYY-MM-DD').format('LL')
            if(expedient.deceasedDate == null || expedient.deceasedBirthday == null){
                var deceasedAge = ''
            }else{
                var deceasedAge = moment(expedient.deceasedDate).diff(moment(expedient.deceasedBirthday), 'years')
            }

            switch(obituaryModel){
                case '0':
                    var x = 55
                    var y = 480
                    if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                        var fill = '#000000'
                    }else{
                        var fill = '#00305c'
                    }
                    var width = 1045
                break
                case '1':
                    var x = 155
                    var y = 520
                    if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                        var fill = '#000000'
                    }else{
                        var fill = '#84360f'
                    }
                    var width = 945
                break
                case '2':
                    var x = 60
                    var y = 500
                    if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                        var fill = '#000000'
                    }else{
                        var fill = '#00305c'
                    }
                    var width = 1045
                break
            }

            var text = 'Falleció el día ' + deceasedDate + '\na los ' + deceasedAge + ' años de edad'
            var x = x
            var y = y
            var fill = fill
            if(company == 6){
                var fontFamily = 'helvetica'
            }else if(company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                var fontFamily = 'times new roman'
            }else{
                var fontFamily = 'caslon'
            }
            var fontSize = 60
            var align = 'center'
            var lineHeight = 1
            var fontStyle = 'bold'

            var optionsDeceasedDate = {
                x: x,
                y: y,
                width: width,
                name: 'text',
                id: 'deceasedDate',
                draggable: true,
                fill: fill,
                opacity: 1
            }

            var styleDeceasedDate = {
                fontFamily: fontFamily,
                fontSize: fontSize,
                fontStyle: fontStyle,
                fontVariant: 'normal',
                textDecoration: 'empty string',
                text: text,
                align: align,
                verticalAlign: 'top',
                padding: 0,
                lineHeight: lineHeight,
                wrap: 'word',
                ellipsis: false
            }

            setTimeout(() => {
                drawText(optionsDeceasedDate, styleDeceasedDate)

                // D.E.P.
                switch(obituaryModel){
                    case '0':
                        var x = 455
                        var y = 650
                        if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                            var fill = '#000000'
                        }else{
                            var fill = '#00305c'
                        }
                    break
                    case '1':
                        var x = 475
                        var y = 675
                        if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                            var fill = '#000000'
                        }else{
                            var fill = '#84360f'
                        }
                    break
                    case '2':
                        var x = 470
                        var y = 665
                        if(company == 6 || company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                            var fill = '#000000'
                        }else{
                            var fill = '#00305c'
                        }
                    break
                }

                var text = 'D.E.P.'
                var x = x
                var y = y
                var fill = fill
                if(company == 6){
                    var fontFamily = 'helvetica'
                }else if(company == 12 || company == 13 || company == 14 || company == 17 || company == 18 || company == 20 || company == 21){
                    var fontFamily = 'times new roman'
                }else{
                    var fontFamily = 'caslon'
                }
                var fontSize = 76
                var align = 'center'
                var lineHeight = 1
                var fontStyle = 'bold'

                var optionsDep = {
                    x: x,
                    y: y,
                    width: 250,
                    name: 'text',
                    id: 'dep',
                    draggable: true,
                    fill: fill,
                    opacity: 1
                }

                var styleDep = {
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontVariant: 'normal',
                    textDecoration: 'empty string',
                    text: text,
                    align: align,
                    verticalAlign: 'top',
                    padding: 0,
                    lineHeight: lineHeight,
                    wrap: 'word',
                    ellipsis: false
                }

                setTimeout(() => {
                    drawText(optionsDep, styleDep)
                    
                    setTimeout(() => {
                        stage.find('#background')[0].zIndex(0)
            
                        var elems = [
                            'logo'
                        ]
            
                        if(!hasLogo){
                            elems.shift()
                        }
            
                        var i = 1
                        $.each(elems, function(index, elem){
                            if(stage.find('#' + elem)[0] != undefined){
                                stage.find('#' + elem)[0].zIndex(i)
                                i++
                            }
                        })
            
                        stage.draw()
                
                        states.push($.parseJSON(stage.toJSON()))
                        $('.main').removeClass('hide')
                    }, 3000)
                }, 250)
            }, 250)
        }, 250)
    }, 250)
})

window.onbeforeunload = (e) => {
    var formData = new FormData

    formData.append('expedient', $('#expedientID').val())
    formData.append('type', $('#obituaryType').val())
    formData.append('model', $('#obituaryModel').val())
    formData.append('locked', locked ? 1 : 0)
    formData.append('page', window.location.pathname)

    navigator.sendBeacon(
        '/core/expedients/tombstone/unlock.php',
        formData
    )
}