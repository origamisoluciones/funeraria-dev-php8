/**
 * Muestra una vista previa de la esquela
 */
function preview(){
    $('#preview').click(function(){
        stage.setContainer('showPreview')
        gridLayer.hide()
        $('#showPreview').find('.konvajs-content').css({'margin': '0 auto'})
        $('#modal-preview').modal('show')
    })
    
    $('#modal-preview').on('hidden.bs.modal', function(){
        stage.setContainer('page')
        gridLayer.show()
    })
}

/**
 * Modifica el estado de "guardado" y muestra/oculta el mensaje
 * 
 * @param {boolean} flag Estado
 */
function saveAction(flag){
    saved = flag

    if(flag){
        $('#unsaveMessage').addClass('hide')
    }else{
        if(states.length > currentState + 1){
            var length = states.length
            for(var i = currentState; i < length - 1; i++){
                states.pop()
            }
        }

        $('#unsaveMessage').removeClass('hide')
        states.push($.parseJSON(stage.toJSON()))
        currentState++
    }
}

/**
 * Selecciona un elemento
 */
function selectElement(){
    stage.on('click tap', function(e){
        // Elimina todas las transformaciones al clickar en una área vacía
        if(e.target === stage){
            if(selected != null){
                selected.setDraggable(false);
                selected = null;
            }
			stage.find('Transformer').destroy()
			layer.draw()
			return
        }

        // Limpia los estados de los botones de las acciones
        if(e.target.name().toLowerCase() != 'text'){
            cleanActions()
        }
        
        // Elimina todas las transformaciones
        stage.find('Transformer').destroy()
  
        // Crea una nueva transformación
        switch(e.target.name()){
            case 'text':
                var options = {
                    keepRatio: true,
                    rotateEnabled: false
                }
                break;

            case 'image':
                if(e.target.attrs.id == 'background'){
                    var options = {
                        keepRatio: true,
                        rotateEnabled: false,
                        enabledAnchors: []
                    }
                }else{
                    var options = {
                        keepRatio: true,
                        rotateEnabled: true
                    }
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

        var tr = new Konva.Transformer(options)
        layer.add(tr)
        tr.attachTo(e.target)
        layer.draw()
    })
}

/**
 * Quita la selección de un elemento
 */
function unselectElement(){
    document.addEventListener('keydown', function(e){
        if(selected != null && e.keyCode === 27){
            stage.find('Transformer').destroy()
			layer.draw()
            selected.setDraggable(false);
            selected = null
            
            cleanActions()
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
 * Limpia los campos de las opciones
 */
function cleanOptions(){
    $('#optionsSection').addClass('hide')
    $('#fillSection').addClass('hide')
    $('#strokeSection').addClass('hide')
    $('#strokeWidthSection').addClass('hide')
    $('#widthSection').addClass('hide')
    $('#heightSection').addClass('hide')
    $('#radiusSection').addClass('hide')
    $('#radiusXSection').addClass('hide')
    $('#radiusYSection').addClass('hide')
    $('#angleSection').addClass('hide')
    $('#rotationSection').addClass('hide')
    $('#numPointsSection').addClass('hide')
    $('#innerRadiusSection').addClass('hide')
    $('#outerRadiusSection').addClass('hide')
    $('#sidesSection').addClass('hide')
    $('#pointerLengthSection').addClass('hide')
    $('#pointerWidthSection').addClass('hide')
    $('#textOptionsSection').addClass('hide')
    $('#imageOptionsSection').addClass('hide')
    $('#opacitySection').addClass('hide')
    $('#toLayerPlus').attr('disabled', true)
    $('#toLayerMinus').attr('disabled', true)
}

/**
 * Aplicar negrita
 */
function toBold(){
    $('#toBold').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var bold = selected.fontStyle().search('bold') > -1 ? true : false
            var italic = selected.fontStyle().search('italic') > -1 ? true : false
            if(bold && italic){
                selected.fontStyle('italic')
                $('#toBold').removeClass('active')
                $('#toItalic').addClass('active')
            }else if(bold && !italic){
                selected.fontStyle('normal')
                $('#toBold').removeClass('active')
                $('#toItalic').removeClass('active')
            }else if(!bold && italic){
                selected.fontStyle('bold italic')
                $('#toBold').addClass('active')
                $('#toItalic').addClass('active')
            }else{
                selected.fontStyle('bold')
                $('#toBold').addClass('active')
                $('#toItalic').removeClass('active')
            }

            layer.draw()
            
            saveAction(false)
        }
    })
}

/**
 * Aplicar cursiva
 */
function toItalic(){
    $('#toItalic').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var bold = selected.fontStyle().search('bold') > -1 ? true : false
            var italic = selected.fontStyle().search('italic') > -1 ? true : false

            if(bold && italic){
                selected.fontStyle('bold')
                $('#toBold').addClass('active')
                $('#toItalic').removeClass('active')
            }else if(bold && !italic){
                selected.fontStyle('bold italic')
                $('#toBold').addClass('active')
                $('#toItalic').addClass('active')
            }else if(!bold && italic){
                selected.fontStyle('normal')
                $('#toBold').removeClass('active')
                $('#toItalic').removeClass('active')
            }else{
                selected.fontStyle('italic')
                $('#toBold').removeClass('active')
                $('#toItalic').addClass('active')
            }

            layer.draw()
            
            saveAction(false)
        }
    })
}

/**
 * Aplicar subrayado
 */
function toUnderline(){
    $('#toUnderline').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var underline = selected.textDecoration().search('underline') > -1 ? true : false
            var lineThrough = selected.textDecoration().search('line-through') > -1 ? true : false

            if(underline && lineThrough){
                selected.textDecoration('line-through')
                $('#toUnderline').removeClass('active')
                $('#toLineThrough').addClass('active')
            }else if(underline && !lineThrough){
                selected.textDecoration('empty string')
                $('#toUnderline').removeClass('active')
                $('#toLineThrough').removeClass('active')
            }else if(!underline && lineThrough){
                selected.textDecoration('underline line-through')
                $('#toUnderline').addClass('active')
                $('#toLineThrough').addClass('active')
            }else{
                selected.textDecoration('underline')
                $('#toUnderline').addClass('active')
                $('#toLineThrough').removeClass('active')
            }

            layer.draw()
            
            saveAction(false)
        }
    })
}

/**
 * Aplicar tachado
 */
function toLineThrough(){
    $('#toLineThrough').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            var underline = selected.textDecoration().search('underline') > -1 ? true : false
            var lineThrough = selected.textDecoration().search('line-through') > -1 ? true : false

            if(underline && lineThrough){
                selected.textDecoration('underline')
                $('#toUnderline').addClass('active')
                $('#toLineThrough').removeClass('active')
            }else if(underline && !lineThrough){
                selected.textDecoration('underline line-through')
                $('#toUnderline').addClass('active')
                $('#toLineThrough').addClass('active')
            }else if(!underline && lineThrough){
                selected.textDecoration('empty string')
                $('#toUnderline').removeClass('active')
                $('#toLineThrough').removeClass('active')
            }else{
                selected.textDecoration('line-through')
                $('#toUnderline').removeClass('active')
                $('#toLineThrough').addClass('active')
            }

            layer.draw()
            
            saveAction(false)
        }
    })
}

/**
 * Alinear texto a la izquierda
 */
function toAlignLeft(){
    $('#toAlignLeft').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('left')
            removeJustify(selected);
            layer.draw()
            $('#toAlignLeft').addClass('active')
            $('#toAlignCenter').removeClass('active')
            $('#toAlignRight').removeClass('active')
            $('#toAlignJustify').removeClass('active')
            
            saveAction(false)
        }
    })
}

/**
 * Alinear texto al centro
 */
function toAlignCenter(){
    $('#toAlignCenter').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('center')
            removeJustify(selected);
            layer.draw()
            $('#toAlignLeft').removeClass('active')
            $('#toAlignCenter').addClass('active')
            $('#toAlignRight').removeClass('active')
            $('#toAlignJustify').removeClass('active')
            
            saveAction(false)
        }
    })
}

/**
 * Alinear texto a la derecha
 */
function toAlignRight(){
    $('#toAlignRight').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('right')
            removeJustify(selected);
            layer.draw()
            $('#toAlignLeft').removeClass('active')
            $('#toAlignCenter').removeClass('active')
            $('#toAlignRight').addClass('active')
            $('#toAlignJustify').removeClass('active')
            
            saveAction(false)
        }
    })
}

/**
 * Alinear texto justificado
 */
function toAlignJustify(){
    $('#toAlignJustify').click(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.align('justify')
            applyJustify(selected);
            layer.draw()
            $('#toAlignLeft').removeClass('active')
            $('#toAlignCenter').removeClass('active')
            $('#toAlignRight').removeClass('active')
            $('#toAlignJustify').addClass('active')
            
            saveAction(false)
        }
    })
}

/**
 * Rellena el select de tipos de fuente
 */
function fillFontFamily(){
    $('#toFontFamily').append('<option value="arial">Arial</option>')
    $('#toFontFamily').append('<option value="caslon">Caslon540 BT</option>')
    $('#toFontFamily').append('<option value="comic sans ms">Comic Sans MS</option>')
    $('#toFontFamily').append('<option value="garamond">Garamond</option>')
    $('#toFontFamily').append('<option value="garamonditalic">Garamond Italic</option>')
    $('#toFontFamily').append('<option value="garamondbolditalic">Garamond Bold Italic</option>')
    $('#toFontFamily').append('<option value="helvetica">Helvetica</option>')
    $('#toFontFamily').append('<option value="tahoma">Tahoma</option>')
    $('#toFontFamily').append('<option value="times new roman">Timew New Roman</option>')
    $('#toFontFamily').append('<option value="times new roman italic">Timew New Roman Italic</option>')
    $('#toFontFamily').append('<option value="verdana">Verdana</option>')
}

/**
 * Cambia el tipo de fuente
 */
function toFontFamily(){
    $('#toFontFamily').change(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.fontFamily($(this).val())
            layer.draw()
            
            saveAction(false)
        }
    })
}

/**
 * Rellena el select de tamaños de fuente
 */
function fillFontSize(){
    for(var i = 4; i <= 12; i += 2){
        $('#toFontSize').append('<option value="' + i + '">' + i + '</option>')
    }

    for(var i = 13; i <= 49; i++){
        $('#toFontSize').append('<option value="' + i + '">' + i + '</option>')
    }

    for(var i = 50; i <= 80; i += 5){
        $('#toFontSize').append('<option value="' + i + '">' + i + '</option>')
    }

    $('#toFontSize').find('option[value="12"]').attr('selected', true)
}

/**
 * Cambia el tamaño de fuente
 */
function toFontSize(){
    $('#toFontSize').change(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.fontSize($(this).val())
            layer.draw()
            
            saveAction(false)
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
                selected.fill('#' + hex)
                layer.draw()

                saveAction(false)
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
    $('#toLineHeight').append('<option value="1">1</option>')
    $('#toLineHeight').append('<option value="1.25">1.25</option>')
    $('#toLineHeight').append('<option value="1.5">1.5</option>')
    $('#toLineHeight').append('<option value="1.75">1.75</option>')
    $('#toLineHeight').append('<option value="2">2</option>')
    $('#toLineHeight').append('<option value="2.25">2.25</option>')
    $('#toLineHeight').append('<option value="2.5">2.5</option>')
    $('#toLineHeight').append('<option value="2.75">2.75</option>')
    $('#toLineHeight').append('<option value="3">3</option>')
}

/**
 * Cambia el alto de línea
 */
function toLineHeight(){
    $('#toLineHeight').change(function(){
        if(selected != null && selected.name().toLowerCase() == 'text'){
            selected.lineHeight($(this).val())
            layer.draw()

            saveAction(false)
        }
    })
}

/**
 * Añade una cruz
 */
function toAddCross(){
    $('#toAddCross').click(function(){
        var options = {
            x: 50,
            y: 50,
            width: null,
            name: 'text',
            id: 'addText' + addTextIndex,
            draggable: true,
            fill: '#00305c',
            opacity: 1
        }
    
        var style = {
            fontFamily: 'arial',
            fontSize: 24,
            fontStyle: 'normal',
            fontVariant: 'normal',
            textDecoration: 'empty string',
            text: '\u2020',
            align: 'left',
            verticalAlign: 'top',
            padding: 0,
            lineHeight: 1.25,
            wrap: 'word',
            ellipsis: false
        }
    
        setTimeout(() => {
            drawText(options, style)
        }, 150)

        addTextIndex++

        saveAction(false)
        maxZIndex++;
    })
}

/**
 * Añade un elemento texto
 */
function toAddText(){
    $('#toAddText').click(function(){
        var options = {
            x: 50,
            y: 50,
            width: 100,
            name: 'text',
            id: 'addText' + addTextIndex,
            draggable: true,
            fill: '#00305c',
            opacity: 1
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
    
        drawText(options, style)

        addTextIndex++
        maxZIndex++;

        saveAction(false)
    })
}

/**
 * Añade un elemento texto
 */
function toAddTextSet(options, style, height = null){
    drawText(options, style, height)

    addTextIndex++

    saveAction(false)
    maxZIndex++;
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
    
        drawRectangle(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawCircle(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawEllipse(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawWedge(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawLine(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawStar(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawRing(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawArc(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawPolygon(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
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
    
        drawArrow(options)

        addFigureIndex++
        maxZIndex++;

        saveAction(false)
    })
}

/**
 * Para cambiar el color de relleno
 */
function toFillColor(){
    $('#fillOption').colpick({
        onSubmit: function(hsb, hex, rgb, el){
            $(el).colpickHide()

            if(selected != null && selected.name().toLowerCase() == 'figure'){
                selected.fill('#' + hex)
                layer.draw()

                saveAction(false)
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
                selected.stroke('#' + hex)
                layer.draw()

                saveAction(false)
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
            selected.strokeWidth(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#widthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.width(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#heightOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.height(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#radiusOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.width(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#radiusXOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.radiusX(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#radiusYOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.radiusY(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#angleOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.angle(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#rotationOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.rotation(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#numPointsOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.numPoints(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#innerRadiusOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.innerRadius(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#outerRadiusOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.outerRadius(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#sidesOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.sides(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#pointerLengthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.pointerLength(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#pointerWidthOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.pointerWidth(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#opacityOption').change(function(){
        if(selected != null && $(this).val() != ''){
            selected.opacity(Math.abs($(this).val()))
            layer.draw()

            saveAction(false)
        }
    })

    $('#blurOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })

    $('#brightnessOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })

    $('#contrastOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })

    $('#embossOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })

    $('#enhanceOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })

    $('#noiseOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })

    $('#pixelateOption').change(function(){
        if(selected != null && $(this).val() != ''){
            changeStyle()
        }
    })
}

/**
 * Cambia el estilo de una imagen
 */
function changeStyle(){
    selected.cache()

    selected.filters([
        Konva.Filters.Blur,
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.Emboss,
        Konva.Filters.Enhance,
        Konva.Filters.Mask,
        Konva.Filters.Noise,
        Konva.Filters.Pixelate
    ])

    selected.blurRadius(Math.abs($('#blurOption').val()))
    selected.brightness($('#brightnessOption').val())
    selected.contrast($('#contrastOption').val())
    selected.embossStrength(Math.abs($('#embossOption').val()))
    selected.embossBlend(true)
    selected.enhance($('#enhanceOption').val())
    selected.noise(Math.abs($('#noiseOption').val()))
    selected.pixelSize(Math.abs($('#pixelateOption').val()))

    layer.draw()
    
    saveAction(false)
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
 * Mueve el elemento hacia arriba
 */
function toLayerPlus(){
    $('#toLayerPlus').click(function(){
        if(selected != null){
            var currentZIndex = selected.zIndex()
            if(currentZIndex > 0 && currentZIndex < maxZIndex){
                selected.zIndex(++currentZIndex)
                stage.draw()
                saveAction(false)
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
            var currentZIndex = selected.zIndex()
            if(currentZIndex > 1 && currentZIndex <= maxZIndex){
                selected.zIndex(--currentZIndex)
                stage.draw()
                saveAction(false)
            }
        }
    })
}

/**
 * Mueve un elemento con las flechas del teclado
 */
function keyboardActions(){
    window.addEventListener('keydown', function(e){
        if(selected != null){
            // Mover elemento
            if(!changingText && e.keyCode == 37 && !e.shiftKey){
                var x = selected.x() - 5 < 0 ? selected.x() : selected.x() - 5
                selected.setX(x)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }else if(!changingText && e.keyCode == 37 && e.shiftKey){
                var x = selected.x() - 10 < 0 ? selected.x() : selected.x() - 10
                selected.setX(x)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }
            if(!changingText && e.keyCode == 38 && !e.shiftKey){
                var y = selected.y() - 5 < 0 ? selected.y() : selected.y() - 5
                selected.setY(y)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }else if(!changingText && e.keyCode == 38 && e.shiftKey){
                var y = selected.y() - 10 < 0 ? selected.y() : selected.y() - 10
                selected.setY(y)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }
            if(!changingText && e.keyCode == 39 && !e.shiftKey){
                var x = selected.x() + 20 > width ? selected.x() : selected.x() + 5
                selected.setX(x)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }else if(!changingText && e.keyCode == 39 && e.shiftKey){
                var x = selected.x() + 20 > width ? selected.x() : selected.x() + 10
                selected.setX(x)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }
            if(!changingText && e.keyCode == 40 && !e.shiftKey){
                var y = selected.y() + 20 > height ? selected.y() : selected.y() + 5
                selected.setY(y)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }else if(!changingText && e.keyCode == 40 && e.shiftKey){
                var y = selected.y() + 20 > height ? selected.y() : selected.y() + 10
                selected.setY(y)
                stage.draw()
                saveAction(false)
                e.preventDefault()
            }

            // Eliminar un elemento
            if(e.keyCode == 46){
                if(!changingText){
                    $('#toDelete').click()
                }
            }

            // Subir una capa
            if(e.keyCode == 81 && e.ctrlKey){
                $('#toLayerPlus').click()
            }

            // Bajar una capa
            if(e.keyCode == 77 && e.ctrlKey){
                $('#toLayerMinus').click()
            }

            // Texto
            if(selected != null && selected.name() == 'text'){
                // Negrita
                if(e.keyCode == 66 && e.ctrlKey){
                    $('#toBold').click()
                }
                // Cursiva
                if(e.keyCode == 73 && e.ctrlKey){
                    $('#toItalic').click()
                }
                // Subrayado
                if(e.keyCode == 85 && e.ctrlKey){
                    $('#toUnderline').click()
                }
                // Tachado
                if(e.keyCode == 76 && e.ctrlKey){
                    $('#toLineThrough').click()
                }
                // Alinear a la izquierda
                if(e.keyCode == 65 && e.ctrlKey){
                    $('#toAlignLeft').click()
                }
                // Alinear al centro
                if(e.keyCode == 83 && e.ctrlKey){
                    $('#toAlignCenter').click()
                }
                // Alinear a la derecha
                if(e.keyCode == 68 && e.ctrlKey){
                    $('#toAlignRight').click()
                }
                // Justificar
                if(e.keyCode == 70 && e.ctrlKey){
                    $('#toAlignJustify').click()
                }
            }
        }

        // Deshacer
        if(e.keyCode == 90 && e.ctrlKey){
            $('#toUndo').click()
        }

        // Rehacer
        if(e.keyCode == 89 && e.ctrlKey){
            $('#toRedo').click()
        }
    })
}

/**
 * Mostrar sección de ayuda
 */
function showHelp(){
    $('#showHelp').click(function(){
        $('#modal-help').modal('show')
    })
}

/**
 * Acción deshacer
 * 
 * @param {int} expedient Id del expediente
 * @param {int} model Modelo de esquela
 */
function toUndo(expedient, type, model){
    $('#toUndo').click(function(){
        if(!flagUndoRedo && currentState > 0){
            currentState--
            
            redraw(expedient, type, model)
            cleanActions()
            cleanOptions()

            currentState == saveState ? $('#unsaveMessage').addClass('hide') : $('#unsaveMessage').removeClass('hide')
        }
    })
}

/**
 * Acción deshacer
 * 
 * @param {int} expedient Id del expediente
 * @param {int} model Modelo de esquela
 */
function toRedo(expedient, type, model){
    $('#toRedo').click(function(){
        if(!flagUndoRedo && currentState < states.length - 1){
            currentState++
            
            redraw(expedient, type, model)
            cleanActions()
            cleanOptions()

            currentState == saveState ? $('#unsaveMessage').addClass('hide') : $('#unsaveMessage').removeClass('hide')
        }
    })
}

/**
 * Elimina un elemento
 */
function toDelete(expedient, type, model){
    $('#toDelete').click(function(){
        if(selected != null){
            removeElement(expedient, type, model)
        }
    })
}

/**
 * Dibuja imagen
 * 
 * @param {object} options 
 */
function drawImage(options, expedient, type, model){
    var imageObj = new Image()
    imageObj.onload = function(){
        var image = new Konva.Image({
            x: options.x,
            y: options.y,
            image: imageObj,
            width: options.width,
            height: options.height,
            id: options.id,
            draggable: false,
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
                    var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                    var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
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
            if(selected != null){
                selected.setDraggable(false);
            }
            selected = this

            if(selected.attrs.id != 'background'){
                selected.setDraggable(true);
            }

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
            handleMouse(image)
        }

        layer.add(image)
        layer.draw()
    }

    if(options.src.includes('--------') && firtsLoad){
        var stampAux = options.src.split('--------')[0].split(expedient+'/')[1];
        var newSrc = options.src.replace('/tmp/'+expedient+'/'+stampAux+'--------', '/expedients/'+expedient+'/obituary/'+type+'/'+model+'/img/')
        imageObj.src = newSrc
    }else{
        imageObj.src = options.src
    }
}

/**
 * Dibuja texto
 * 
 * @param {object} options Opciones 
 * @param {object} style Estilos del texto 
 */
function drawText(options, style, heightParam = null){
    if(heightParam != null){
        var textNode = new Konva.Text({
            x: options.x,
            y: options.y,
            width: options.width,
            height:heightParam,
            name: options.name,
            id: options.id,
            draggable: false,
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
            dragBoundFunc: function(pos){
                if(startX == null || startY == null){
                    return {
                        x: pos.x,
                        y: pos.y
                    }
                }else{
                    var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                    var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                    return {
                        x: x,
                        y: y
                    }
                }
            }
        })
    }else{
        var textNode = new Konva.Text({
            x: options.x,
            y: options.y,
            width: options.width,
            name: options.name,
            id: options.id,
            draggable: false,
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
            dragBoundFunc: function(pos){
                if(startX == null || startY == null){
                    return {
                        x: pos.x,
                        y: pos.y
                    }
                }else{
                    var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                    var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                    return {
                        x: x,
                        y: y
                    }
                }
            }
        })
    }

    layer.add(textNode)
    layer.draw()

    switch(style.align){
        case 'left':
            textNode.align('left')
            layer.draw()
            setTimeout(() => {
                textNode.align('left')
                layer.draw()
            }, 150)
        break
        case 'center':
            textNode.align('left')
            layer.draw()
            setTimeout(() => {
                textNode.align('center')
                layer.draw()
            }, 150)
        break
        case 'right':
            textNode.align('left')
            layer.draw()
            setTimeout(() => {
                textNode.align('right')
                layer.draw()
            }, 150)
        break
        case 'justify':
            textNode.align('left')
            layer.draw()
            setTimeout(() => {
                textNode.align('justify')
                applyJustify(textNode);
                layer.draw()
            }, 150)
        break
    }

    textNode.on('transform', function(){
        this.setAttrs({
            width: Math.max(this.width() * this.scaleX(), 20),
            height: Math.max(this.height() * this.scaleY(), 20),
            scaleX: 1,
            scaleY: 1,
        });
    })

    textNode.on('dragend', function(){
        saveAction(false)
    })

    textNode.on('transformend', function(){
        saveAction(false)
    })

    textNode.on('click tap', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        $('#textOptionsSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')

        $('#opacityOption').val(selected.opacity())
        selected.fontStyle().search('bold') > -1 ? $('#toBold').addClass('active') : $('#toBold').removeClass('active')
        selected.fontStyle().search('italic') > -1 ? $('#toItalic').addClass('active') : $('#toItalic').removeClass('active')
        selected.textDecoration().search('underline') > -1 ? $('#toUnderline').addClass('active') : $('#toUnderline').removeClass('active')
        selected.textDecoration().search('line-through') > -1 ? $('#toLineThrough').addClass('active') : $('#toLineThrough').removeClass('active')
        switch(selected.align()){
            case 'left':
                $('#toAlignLeft').addClass('active')
                $('#toAlignCenter').removeClass('active')
                $('#toAlignRight').removeClass('active')
                $('#toAlignJustify').removeClass('active')
                break

            case 'center':
                $('#toAlignLeft').removeClass('active')
                $('#toAlignCenter').addClass('active')
                $('#toAlignRight').removeClass('active')
                $('#toAlignJustify').removeClass('active')
                break

            case 'right':
                $('#toAlignLeft').removeClass('active')
                $('#toAlignCenter').removeClass('active')
                $('#toAlignRight').addClass('active')
                $('#toAlignJustify').removeClass('active')
                break

            case 'justify':
                $('#toAlignLeft').removeClass('active')
                $('#toAlignCenter').removeClass('active')
                $('#toAlignRight').removeClass('active')
                $('#toAlignJustify').addClass('active')
                break
        }
        $('#toFontSize').val(selected.fontSize())
        $('#toFontFamily').val(selected.fontFamily())
        $('#toLineHeight').val(selected.lineHeight())
    })

    textNode.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    handleTransform(textNode)
    handleMouse(textNode)
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    rect.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#widthOption').val(selected.width())
        $('#heightOption').val(selected.height())
        $('#opacityOption').val(selected.opacity())
        cleanOptions()
        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#widthSection').removeClass('hide')
        $('#heightSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    rect.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })
    
    rect.on('dragend', function(){
        saveAction(false)
    })

    rect.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(rect)

    layer.add(rect)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    circle.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#radiusOption').val(selected.radius())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#radiusSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    circle.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    circle.on('dragend', function(){
        saveAction(false)
    })

    circle.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(circle)

    layer.add(circle)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    ellipse.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#radiusXOption').val(selected.radiusX())
        $('#radiusYOption').val(selected.radiusY())
        $('#opacityOption').val(selected.opacity())
        cleanOptions()
        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#radiusXSection').removeClass('hide')
        $('#radiusYSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    ellipse.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    ellipse.on('dragend', function(){
        saveAction(false)
    })

    ellipse.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(ellipse)

    layer.add(ellipse)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    wedge.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#radiusOption').val(selected.width())
        $('#angleOption').val(selected.angle())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()
        
        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#radiusSection').removeClass('hide')
        $('#angleSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    wedge.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    wedge.on('dragend', function(){
        saveAction(false)
    })

    wedge.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(wedge)

    layer.add(wedge)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    line.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()
        
        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    line.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    line.on('dragend', function(){
        saveAction(false)
    })

    line.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(line)

    layer.add(line)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    star.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#numPointsOption').val(selected.numPoints())
        $('#innerRadiusOption').val(selected.innerRadius())
        $('#outerRadiusOption').val(selected.outerRadius())
        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#opacityOption').val(selected.opacity())
        
        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#numPointsSection').removeClass('hide')
        $('#innerRadiusSection').removeClass('hide')
        $('#outerRadiusSection').removeClass('hide')
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    star.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    star.on('dragend', function(){
        saveAction(false)
    })

    star.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(star)

    layer.add(star)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    ring.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);
        
        $('#innerRadiusOption').val(selected.innerRadius())
        $('#outerRadiusOption').val(selected.outerRadius())
        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#innerRadiusSection').removeClass('hide')
        $('#outerRadiusSection').removeClass('hide')
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    ring.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    ring.on('dragend', function(){
        saveAction(false)
    })

    ring.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(ring)

    layer.add(ring)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    arc.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#angleOption').val(selected.angle())
        $('#innerRadiusOption').val(selected.innerRadius())
        $('#outerRadiusOption').val(selected.outerRadius())
        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#angleSection').removeClass('hide')
        $('#innerRadiusSection').removeClass('hide')
        $('#outerRadiusSection').removeClass('hide')
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    arc.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    arc.on('dragend', function(){
        saveAction(false)
    })

    arc.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(arc)

    layer.add(arc)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    polygon.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#sidesOption').val(selected.sides())
        $('#radiusOption').val(selected.width())
        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#sidesSection').removeClass('hide')
        $('#radiusSection').removeClass('hide')
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    polygon.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    polygon.on('dragend', function(){
        saveAction(false)
    })

    polygon.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(polygon)

    layer.add(polygon)
    layer.draw()
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
        draggable: false,
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
                var x = pos.x < (selected.getClientRect().width * - 1 + 15) || pos.x > width - 15 ? startX : pos.x
                var y = pos.y < (selected.getClientRect().height * - 1 + 15) || pos.y > height - 15 ? startY : pos.y
                return {
                    x: x,
                    y: y
                }
            }
        }
    })

    arrow.on('click tab', function(){
        if(selected != null){
            selected.setDraggable(false);
        }
        selected = this

        selected.setDraggable(true);

        $('#pointerLengthOption').val(selected.pointerLength())
        $('#pointerWidthOption').val(selected.pointerWidth())
        $('#strokeWidthOption').val(selected.strokeWidth())
        $('#opacityOption').val(selected.opacity())

        cleanOptions()

        $('#optionsSection').removeClass('hide')
        $('#toLayerPlus').attr('disabled', false)
        $('#toLayerMinus').attr('disabled', false)
        
        $('#pointerLengthSection').removeClass('hide')
        $('#pointerWidthSection').removeClass('hide')
        $('#fillSection').removeClass('hide')
        $('#strokeSection').removeClass('hide')
        $('#strokeWidthSection').removeClass('hide')
        $('#opacitySection').removeClass('hide')
    })

    arrow.on('dragstart', function(){
        startX = this.x()
        startY = this.y()
    })

    arrow.on('dragend', function(){
        saveAction(false)
    })

    arrow.on('transformend', function(){
        saveAction(false)
    })
    
    handleMouse(arrow)

    layer.add(arrow)
    layer.draw()
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

    var tr = new Konva.Transformer(options)

    layer.draw()

    var currentText = ''

    textNode.on('dblclick dbltap', () => {
        changingText = true
        currentText = textNode.text()

        // Oculta el nodo texto y la transformación
        textNode.hide()
        tr.hide()
        layer.draw()

        // Crea un textarea por encima del nodo texto para poder editarlo
        var textPosition = textNode.absolutePosition()
        var stageBox = stage.container().getBoundingClientRect()
        var areaPosition = {
			x: stageBox.left + textPosition.x,
			y: stageBox.top + textPosition.y
        }

        var top = $('#page')[0].getBoundingClientRect().top + window.scrollY + textPosition.y;

        var textarea = document.createElement('textarea')
        document.body.appendChild(textarea)

        $(window).resize(function(){
            var textPosition = textNode.absolutePosition()
            var stageBox = stage.container().getBoundingClientRect()
            var areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y
            }
            textarea.style.left = areaPosition.x + 'px'

            var top = $('#page')[0].getBoundingClientRect().top + window.scrollY + textPosition.y;
            textarea.style.top = top + 'px'
        })

        // Estilos
        textarea.value = textNode.text()
        textarea.style.position = 'absolute'
        textarea.style.top = top + 'px'
        textarea.style.left = areaPosition.x + 'px'
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px'
        textarea.style.height = textNode.height() - textNode.padding() * 2 + 'px'
        textarea.style.fontSize = textNode.fontSize() + 'px'
        textarea.style.fontWeight = textNode.fontStyle()
        textarea.style.border = 'none'
        textarea.style.padding = '0px'
        textarea.style.margin = '0px'
        textarea.style.overflow = 'hidden'
        textarea.style.background = 'none'
        textarea.style.outline = 'none'
        textarea.style.resize = 'none'
        textarea.style.lineHeight = textNode.lineHeight()
        textarea.style.fontFamily = textNode.fontFamily()
        textarea.style.transformOrigin = 'left top'
        textarea.style.textAlign = textNode.align()
        textarea.style.color = textNode.fill()
        rotation = textNode.rotation()
        var transform = ''
        if(rotation){
            transform += 'rotateZ(' + rotation + 'deg)'
        }

        var px = 0
        // En Firefox
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
        if(isFirefox){
            px += 2 + Math.round(fontSize / 20)
        }
        transform += 'translateY(-' + px + 'px)'

        textarea.style.transform = transform

        textarea.focus()

        // Elimina el textarea creado por encima del nodo
        function removeTextarea(){
			textarea.parentNode.removeChild(textarea)
			window.removeEventListener('click', handleOutsideClick)
			textNode.show()
			tr.show()
			tr.forceUpdate()
            layer.draw()
            changingText = false
        }

        function setTextareaWidth(newWidth){
			if(!newWidth){
				// Asigna un ancho al placeholder
				newWidth = textNode.placeholder.length * textNode.fontSize()
            }
            
			// Arreglos en distintos navegadores
			var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
			var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
			if(isSafari || isFirefox){
				newWidth = Math.ceil(newWidth)
			}

			var isEdge = document.documentMode || /Edge/.test(navigator.userAgent)
			if(isEdge){
				newWidth += 1
			}
			textarea.style.width = newWidth + 'px'
        }

        textarea.addEventListener('keydown', function(e){
			// Eliminar y guardar estado al pulsar enter
			if(e.keyCode === 13 && !e.shiftKey){
				textNode.text(textarea.value)
                removeTextarea()
                if(currentText != textNode.text()){
                    saveAction(false)
                }
			}
            
            // Al pulsar ESC no guarda el estado
			if(e.keyCode === 27){
                removeTextarea()
            }
        })

        textarea.addEventListener('keydown', function(e){
			scale = textNode.getAbsoluteScale().x
			setTextareaWidth(textNode.width() * scale)
			textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px'
        })

        // Elimina el textarea al clickar fuera de él
        function handleOutsideClick(e){
            if(e.target !== textarea){
				removeTextarea()
			}
        }
        setTimeout(() => {
          	window.addEventListener('click', handleOutsideClick)
        })
    })
}

/**
 * Controla el puntero del ratón
 */
function handleMouse(node){
    node.on('mouseenter', function(){
        stage.container().style.cursor = 'move'
    })
    node.on('mouseleave', function(){
        stage.container().style.cursor = 'default'
    })
}

/**
 * Applies justify alignment to a text
 * 
 * @param {object} textNode Text node
 */
function applyJustify(textNode){
  // reimpone ancho de envoltura, si lo tienes guardado
  if (textNode.getAttr('wrapWidth')) {
    textNode.width(textNode.getAttr('wrapWidth'));
  }

  textNode.sceneFunc((ctx, shape) => {
    const fontVariant = (shape.fontVariant && shape.fontVariant()) || '';
    const fontSize = Number(shape.fontSize()) || 0;
    const lineH = Math.max(0.5, Number(shape.lineHeight()) || 1);
    const pad = shape.padding ? shape.padding() : 0;
    const maxWidth = Math.max(1, (shape.getAttr('wrapWidth') || shape.width()) - pad * 2);

    ctx.font = `${shape.fontStyle()} ${fontVariant} ${fontSize}px ${shape.fontFamily()}`;
    ctx.fillStyle = shape.fill();
    ctx.textBaseline = 'alphabetic';

    const spaceW = ctx.measureText(' ').width;
    const words = shape.text().trim().split(/\s+/);

    const lines = [];
    let line = [];
    words.forEach(word => {
      const test = [...line, word].join(' ');
      if (ctx.measureText(test).width > maxWidth && line.length) {
        lines.push(line);
        line = [word];
      } else {
        line = [...line, word];
      }
    });
    lines.push(line);

    const hasUnderline = shape.textDecoration().includes('underline');
    const hasLineThrough = shape.textDecoration().includes('line-through');

    lines.forEach((ln, i) => {
      const isLast = i === lines.length - 1;
      const gaps = ln.length - 1;
      const wordsWidth = ln.reduce((s, w) => s + ctx.measureText(w).width, 0);
      const extra = (!isLast && gaps > 0) ? (maxWidth - wordsWidth) / gaps : spaceW;
      const y = pad + i * (fontSize * lineH) + fontSize;
      let x = pad;

      ln.forEach((w, idx) => {
        ctx.fillText(w, x, y);
        x += ctx.measureText(w).width + (idx < gaps ? extra : 0);
      });

      if (hasUnderline || hasLineThrough) {
        const lineEnd = x;
        const underlineY = y + fontSize * 0.15;
        const strikeY = y - fontSize * 0.3;
        ctx.beginPath();
        ctx.strokeStyle = shape.fill();
        ctx.lineWidth = Math.max(1, fontSize * 0.05);
        if (hasUnderline) { ctx.moveTo(pad, underlineY); ctx.lineTo(lineEnd, underlineY); }
        if (hasLineThrough) { ctx.moveTo(pad, strikeY); ctx.lineTo(lineEnd, strikeY); }
        ctx.stroke();
      }
    });
  });

  textNode.clearCache();
  textNode.getLayer() && textNode.getLayer().batchDraw();
}

/**
 * Applies justify alignment from a text
 * 
 * @param {object} textNode Text node
 */
function removeJustify(textNode){
    textNode.sceneFunc(null);
    textNode.clearCache();
}

/**
 * Abre la modal de subida de imágenes
 */
function openImageModal(){
    $('#toAddImage').click(function(){
        // Gets images from source
        $('#imagesSources').empty()
        $('#loadingAddImage').removeClass('hide')
        $('#selectAddImageText').addClass('hide')
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

document.onkeydown = function(event){
    switch(event.keyCode){
        // F5
        case 116:
            event.returnValue = false
            event.keyCode = 0
            return false
        break;
        // Ctrl + R
        case 82:
            if(event.ctrlKey){
                event.returnValue = false
                event.keyCode = 0
                return false
            }
        break;
    }
}