$(function(){
    hasTransept = true;
    hasLogo = true;
    
    if(!loadFlag){
        setTimeout(() => {
    
            var transeptX = 0;
            var transeptY  = 0;
            var transeptScaleX  = 0;
            var transeptScaleY  = 0;
    
            switch(parseInt(obituaryModel)){
                case 0:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break
                case 1:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break
                case 2:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break
                case 3:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break
                case 4:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break;
                case 5:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break
                case 6:
                    transeptX = 309
                    transeptY = 66
                    transeptScaleX = 0.50
                    transeptScaleY = 0.52
                break
            }
    
            var optionsTransept = {
                x: transeptX,
                y: transeptY,
                width: null,
                height: null,
                id: 'transept',
                draggable: true,
                name: 'image',
                src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/transept.jpg',
                mouse: true,
                rotation: null,
                scaleX: transeptScaleX,
                scaleY: transeptScaleY,
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
    
            drawImage(optionsTransept, expedientID, obituaryType, obituaryModel)
    
            setTimeout(() => {

                // Draw rectagle
                var backgroundBorders1 = {
                    x: 25,
                    y: 25,
                    width: 745,
                    height: 1075,
                    name: 'figure',
                    id: 'addFigure0',
                    draggable: false,
                    fill: '#FFFFFF',
                    stroke: '#000000',
                    strokeWidth: 7,
                    opacity: 1,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1
                }
                drawRectangle(backgroundBorders1)

                // Draw bottom line
                var bottomLine = {
                    x: 40.8529241460172,
                    y: 1047.8529241460171,
                    points: [0,0,500,0],
                    name: 'figure',
                    id: 'addFigure1',
                    draggable: true,
                    stroke: '#000000',
                    strokeWidth: 2,
                    lineCap: 'square',
                    lineJoin: 'square',
                    opacity: 1,
                    rotation: 0,
                    scaleX: 1.4184453248232331,
                    scaleY: 1.418445324823233
                }
                drawLine(bottomLine)
                
                setTimeout(() => {
    
                    var nameLogo = getNameLogo(obituaryType, obituaryModel)
                
                    // Logo
                    var scaleX = 0.42461935732608846
                    var scaleY = 0.42461935732608846
                    var x = 61
                    var y = 46
            
                    var optionsLogo = {
                        x: x,
                        y: y,
                        width: null,
                        height: null,
                        id: 'logo',
                        draggable: true,
                        name: 'image',
                        src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/' + nameLogo,
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
    
                    drawImage(optionsLogo, expedientID, obituaryType, obituaryModel)

                    setTimeout(() => {
                        var quoteX = 0;
                        var quoteY = 0;
                        var quoteWidth = 0;
                        var quoteFontFamily = '';
                        var quoteFontSize = 0;
                        var quoteFontStyle = '';
                        var quoteAlign = '';
                        var quoteLineHeight = 0;
                        var quoteText = '';
                        var fill = '';
            
                        switch(parseInt(obituaryModel)){
                            case 0:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                            case 1:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                            case 2:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                            case 3:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                            case 4:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                            case 5:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                            case 6:
                                quoteX = 4.359375
                                quoteY = 358
                                quoteWidth = 795.64
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 28
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
                            break
                        }
        
                        // Cita
                        var optionsQuote = {
                            x: quoteX,
                            y: quoteY,
                            width: quoteWidth,
                            name: 'text',
                            id: 'quote',
                            draggable: true,
                            fill: fill,
                            opacity: 1
                        }
        
                        var styleQuote = {
                            fontFamily: quoteFontFamily,
                            fontSize: quoteFontSize,
                            fontStyle: quoteFontStyle,
                            fontVariant: 'normal',
                            textDecoration: 'empty string',
                            text: quoteText,
                            align: quoteAlign,
                            verticalAlign: 'top',
                            padding: 0,
                            lineHeight: quoteLineHeight,
                            wrap: 'word',
                            ellipsis: false
                        }
        
                        setTimeout(() => {
                            drawText(optionsQuote, styleQuote)
                            
                            // Textos
                            // Datos de contacto
                            var text = 'Oficina c/ Manolo de la Ribera, 11 - Móvil 630908508 + Telf. 950400914 - Fax 950401919 - Velatorio 950560000\n04770 ADRA (Almería)'
                            var x = 34.35
                            var y = 1062
                            var fill = '#000000'
                            var fontFamily = 'times new roman'
                            var fontSize = 13
                            var align = 'left'
                            var lineHeight = 1.25
                            var fontStyle = 'normal'
                            var width = 709.64; 
        
                            var optionsContact = {
                                x: x,
                                y: y,
                                width: width,
                                name: 'text',
                                id: 'contact',
                                draggable: false,
                                fill: fill,
                                opacity: 1
                            }
            
                            var styleContact = {
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
                                // Draw Contact
                                drawText(optionsContact, styleContact)

                                // Textos
                                // Datos de contacto
                                var text = 'OLIVER'
                                var x = 96.027
                                var y = 992.40
                                var fill = '#000000'
                                var fontFamily = 'times new roman'
                                var fontSize = 27
                                var align = 'center'
                                var lineHeight = 1.25
                                var fontStyle = 'normal'
                                var width = 121.96; 
            
                                var optionsContact2 = {
                                    x: x,
                                    y: y,
                                    width: width,
                                    name: 'text',
                                    id: 'contact2',
                                    draggable: false,
                                    fill: fill,
                                    opacity: 1
                                }
                
                                var styleContact2 = {
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
                                    // Draw Contact
                                    drawText(optionsContact2, styleContact2)

                                    // Textos
                                    // Datos de contacto
                                    var text = 'Servicios Funerarios, S.L.'
                                    var x = 40.859375
                                    var y = 1020
                                    var fill = '#000000'
                                    var fontFamily = 'times new roman'
                                    var fontSize = 18
                                    var align = 'left'
                                    var lineHeight = 1.25
                                    var fontStyle = 'normal'
                                    var width = 230.14; 
                
                                    var optionsContact3 = {
                                        x: x,
                                        y: y,
                                        width: width,
                                        name: 'text',
                                        id: 'contact3',
                                        draggable: false,
                                        fill: fill,
                                        opacity: 1
                                    }
                    
                                    var styleContact3 = {
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
                                        // Draw Contact
                                        drawText(optionsContact3, styleContact3)

                                    
                                        var deceasedX = 0;
                                        var deceasedY = 0;
                                        var deceasedWidth = 0;
                                        var deceasedFontFamily = '';
                                        var deceasedFontSize = 0;
                                        var deceasedFontStyle = '';
                                        var deceasedAlign = '';
                                        var deceasedLineHeight = 0;
                                        var fill = '';
                                
                                        switch(parseInt(obituaryModel)){
                                            case 0:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 1:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 2:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 3:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 4:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 5:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 6:
                                                deceasedX = 2.859375
                                                deceasedY = 407
                                                deceasedWidth = 789.14
                                                deceasedFontFamily = 'times new roman'
                                                deceasedFontSize = 28
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1
                                                fill = '#000000'
                                            break
                                        }
            
                                        // Fallecido
                                        var optionsDeceased = {
                                            x: deceasedX,
                                            y: deceasedY,
                                            width: deceasedWidth,
                                            name: 'text',
                                            id: 'deceased',
                                            draggable: true,
                                            fill: fill,
                                            opacity: 1
                                        }

                                        var styleDeceased = {
                                            fontFamily: deceasedFontFamily,
                                            fontSize: deceasedFontSize,
                                            fontStyle: deceasedFontStyle,
                                            fontVariant: 'normal',
                                            textDecoration: 'empty string',
                                            text: obituary.name + ' ' + obituary.surname,
                                            align: deceasedAlign,
                                            verticalAlign: 'top',
                                            padding: 0,
                                            lineHeight: deceasedLineHeight,
                                            wrap: 'word',
                                            ellipsis: false
                                        }
                        
                                        setTimeout(() => {
                                            drawText(optionsDeceased, styleDeceased)
                        
                                            var diedX = 0;
                                            var diedY = 0;
                                            var diedWidth = 0;
                                            var diedFontFamily = '';
                                            var diedFontSize = 0;
                                            var diedFontStyle = '';
                                            var diedAlign = '';
                                            var diedLineHeight = 0;
                                            var fill = '';

                                            switch(parseInt(obituaryModel)){
                                                case 0:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 2:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 3:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 4:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 5:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 6:
                                                    diedX = 46.859375
                                                    diedY = 453
                                                    diedWidth = 702.64
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                            }
                        
                                            // Falleció
                                            var optionsDied = {
                                                x: diedX,
                                                y: diedY,
                                                width: diedWidth,
                                                name: 'text',
                                                id: 'died',
                                                draggable: true,
                                                fill: fill,
                                                opacity: 1
                                            }
                                                            
                                            var styleDied = {
                                                fontFamily: diedFontFamily,
                                                fontSize: diedFontSize,
                                                fontStyle: diedFontStyle,
                                                fontVariant: 'normal',
                                                textDecoration: 'empty string',
                                                text: obituary.died,
                                                align: diedAlign,
                                                verticalAlign: 'top',
                                                padding: 0,
                                                lineHeight: diedLineHeight,
                                                wrap: 'word',
                                                ellipsis: false
                                            }
                        
                                            setTimeout(() => {
                                                drawText(optionsDied, styleDied)

                                                var depX = 0;
                                                var depY = 0;
                                                var depWidth = 0;
                                                var depFontFamily = '';
                                                var depFontSize = 0;
                                                var depFontStyle = '';
                                                var depAlign = '';
                                                var depLineHeight = 0;
                                                var fill = '';
                                                switch(parseInt(obituaryModel)){
                                                    case 0:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break;
                                                    case 1:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break;
                                                    case 2:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break
                                                    case 3:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break
                                                    case 4:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break
                                                    case 5:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break
                                                    case 6:
                                                        depX = 3.35
                                                        depY = 535
                                                        depWidth = 784.64
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 27
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1
                                                        fill = '#000000'
                                                    break
                                                }

                                                // D.E.P.
                                                var optionsDep = {
                                                    x: depX,
                                                    y: depY,
                                                    width: depWidth,
                                                    name: 'text',
                                                    id: 'dep',
                                                    draggable: true,
                                                    fill: fill,
                                                    opacity: 1
                                                }

                                                var styleDep = {
                                                    fontFamily: depFontFamily,
                                                    fontSize: depFontSize,
                                                    fontStyle: depFontStyle,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'empty string',
                                                    text: obituary.dep == 1 ? 'D.E.P.' : '',
                                                    align: depAlign,
                                                    verticalAlign: 'top',
                                                    padding: 0,
                                                    lineHeight: depLineHeight,
                                                    wrap: 'word',
                                                    ellipsis: false
                                                }
                                                
                                                setTimeout(() => {
                                                    drawText(optionsDep, styleDep)

                                                    var familyX = 0;
                                                    var familyY = 0;
                                                    var familyWidth = 0;
                                                    var familyHeight = 0;
                                                    var familyFontFamily = '';
                                                    var familyFontSize = 0;
                                                    var familyFontStyle = '';
                                                    var familyAlign = '';
                                                    var familyLineHeight = 0;
                                                    var fill = '';
                                                    switch(parseInt(obituaryModel)){
                                                        case 0:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 2:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 3:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 4:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 5:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break   
                                                        case 6:
                                                            familyX = 60.859375
                                                            familyY = 583
                                                            familyWidth = 676.120625
                                                            familyHeight = 252.25
                                                            familyFontFamily = 'times new roman'
                                                            familyFontSize = 27
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                    }

                                                    // Familia
                                                    var optionsFamily = {
                                                        x: familyX,
                                                        y: familyY,
                                                        width: familyWidth,
                                                        height: familyHeight,
                                                        name: 'text',
                                                        id: 'family',
                                                        draggable: true,
                                                        fill: fill,
                                                        opacity: 1
                                                    }

                                                    var family = '';
                                                    if(obituary.deceasedMaritalStatus.toLowerCase() != 'viudo'){
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
                                                    if(family.length > 0){
                                                        family = family.slice(0, -2);
                                                    }
                                                    family += ' ' + obituary.restFamily

                                                    var styleFamily = {
                                                        fontFamily: familyFontFamily,
                                                        fontSize: familyFontSize,
                                                        fontStyle: familyFontStyle,
                                                        fontVariant: 'normal',
                                                        textDecoration: 'empty string',
                                                        text: family,
                                                        align: familyAlign,
                                                        verticalAlign: 'top',
                                                        padding: 0,
                                                        lineHeight: familyLineHeight,
                                                        wrap: 'word',
                                                        ellipsis: false
                                                    }

                                                    setTimeout(() => {
                                                        drawText(optionsFamily, styleFamily)

                                                        var prayX = 0;
                                                        var prayY = 0;
                                                        var prayWidth = 0;
                                                        var prayHeight = 0;
                                                        var prayFontFamily = '';
                                                        var prayFontSize = 0;
                                                        var prayFontStyle = '';
                                                        var prayAlign = '';
                                                        var prayLineHeight = 0;
                                                        var fill = '';
                                                        switch(parseInt(obituaryModel)){
                                                            case 0:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 1:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break;
                                                            case 2:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break;
                                                            case 3:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break;
                                                            case 4:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break   
                                                            case 5:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 6:
                                                                prayX = 59.859375
                                                                prayY = 892
                                                                prayHeight = 88
                                                                prayWidth = 690.140625
                                                                prayFontFamily = 'times new roman'
                                                                prayFontSize = 20
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = '#000000'
                                                            break;
                                                        }

                                                        // Ruegan
                                                        var optionsPray = {
                                                            x: prayX,
                                                            y: prayY,
                                                            width: prayWidth,
                                                            height: prayHeight,
                                                            name: 'text',
                                                            id: 'pray',
                                                            draggable: true,
                                                            fill: fill,
                                                            opacity: 1
                                                        }

                                                        var stylePray = {
                                                            fontFamily: prayFontFamily,
                                                            fontSize: prayFontSize,
                                                            fontStyle: prayFontStyle,
                                                            fontVariant: 'normal',
                                                            textDecoration: 'empty string',
                                                            text: obituary.pray,
                                                            align: prayAlign,
                                                            verticalAlign: 'top',
                                                            padding: 0,
                                                            lineHeight: prayLineHeight,
                                                            wrap: 'word',
                                                            ellipsis: false
                                                        }

                                                        setTimeout(() => {
                                                            drawText(optionsPray, stylePray)

                                                            var FuneralX = 0;
                                                            var FuneralY = 0;
                                                            var FuneralWidth = 0;
                                                            var FuneralFontFamily = '';
                                                            var FuneralFontSize = 0;
                                                            var FuneralFontStyle = '';
                                                            var FuneralAlign = '';
                                                            var FuneralLineHeight = 0;
                                                            var fill = '';
                                                            switch(parseInt(obituaryModel)){
                                                                case 0:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 1:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 2:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 3:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 4:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 5:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 6:
                                                                    FuneralX = 48.85937
                                                                    FuneralY = 856
                                                                    FuneralWidth = 701.14
                                                                    FuneralFontFamily = 'times new roman'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'center'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                            }

                                                            // Ruegan
                                                            var optionsFuneral = {
                                                                x: FuneralX,
                                                                y: FuneralY,
                                                                width: FuneralWidth,
                                                                name: 'text',
                                                                id: 'funeral',
                                                                draggable: true,
                                                                fill: fill,
                                                                opacity: 1
                                                            }
                                                                
                                                            var styleFuneral = {
                                                                fontFamily: FuneralFontFamily,
                                                                fontSize: FuneralFontSize,
                                                                fontStyle: FuneralFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: 'RUEGAN UNA ORACION POR SU ALMA',
                                                                align: FuneralAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: FuneralLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }

                                                            setTimeout(() => {
                                                                drawText(optionsFuneral, styleFuneral)

                                                                setTimeout(() => {
                                                                    stage.find('#background')[0].zIndex(0)
                                                                    stage.find('#addFigure0')[0].zIndex(1)
                                                                    stage.find('#addFigure1')[0].zIndex(2)
                                                                        
                                                                    switch(parseInt(obituaryModel)){
                                                                        case 0:
                                                                        case 1:
                                                                        case 2:
                                                                        case 3:
                                                                        case 5:
                                                                        case 6:
                                                                            var elems = [
                                                                                'transept',
                                                                                'addFigure0',
                                                                                'addFigure1',
                                                                                'logo',
                                                                                'quote',
                                                                                'contact',
                                                                                'contact2',
                                                                                'contact3',
                                                                                'deceased',
                                                                                'died',
                                                                                'dep',
                                                                                'family',
                                                                                'pray',
                                                                                'funeral',
                                                                            ]

                                                                            var i = 3
                                                                            $.each(elems, function(index, elem){
                                                                                if(stage.find('#' + elem)[0] != undefined){
                                                                                    stage.find('#' + elem)[0].zIndex(i)
                                                                                    i++
                                                                                }
                                                                            })
                                                                        break
                                                                        case 4:
                                                                            var i = 1
                                                                            $.each(elems, function(index, elem){
                                                                                if(stage.find('#' + elem)[0] != undefined){
                                                                                    stage.find('#' + elem)[0].zIndex(i)
                                                                                    i++
                                                                                }
                                                                            })
                                                                        break
                                                                    }

                                                                    stage.draw()
                                                                    states.push($.parseJSON(stage.toJSON()))
                                                                    $('.main').removeClass('hide')

                                                                    firtsLoad = false;
                                                                    maxZIndex = layer.children.length
                                                                }, 150)
                                                            }, 150)
                                                        }, 150)
                                                    }, 150)
                                                }, 150)
                                            }, 150)
                                        }, 150)
                                    }, 150)
                                }, 150)
                            }, 150)
                        }, 150)
                    }, 150)
                }, 150)
            }, 150);
        }, 150)
    }
})