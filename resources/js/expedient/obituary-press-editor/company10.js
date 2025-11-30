$(function(){
    hasTransept = false;
    hasLogo = false;

    if(!loadFlag){
        setTimeout(() => {

            switch(parseInt(obituaryModel)){
                case 0:
                case 1:
                case 2:
                    hasTransept = true
                break;
            }
    
            if(hasTransept){
        
                switch(parseInt(obituaryModel)){
                    case 0:
                        transeptX = 130.30584073920966
                        transeptY = 83.03278491007563
                        transeptScaleX = 0.8711511574206066
                        transeptScaleY = 0.9089046311927521
                    break
                    case 1:
                        transeptX = 34
                        transeptY = 131
                        transeptScaleX = 0.8610612532634988
                        transeptScaleY = 0.963276836158192
                    break
                    case 2:
                        transeptX = 27
                        transeptY = 177
                        transeptScaleX = 0.8610612532634988
                        transeptScaleY = 0.9265536723163842
                    break
                    case 3:
                        transeptX = 59
                        transeptY = 41
                        transeptScaleX = 0.29
                        transeptScaleY = 0.29
                    break
                    case 4:
                        transeptX = 44
                        transeptY = 180
                        transeptScaleX = 1
                        transeptScaleY = 1
                    break;
                    case 5:
                        transeptX = 46
                        transeptY = 220
                        transeptScaleX = 0.39
                        transeptScaleY = 0.39
                    break
                    case 6:
                        transeptX = 51
                        transeptY = 214
                        transeptScaleX = 0.45
                        transeptScaleY = 0.45
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
                    src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary-press/' + obituaryType + '/' + obituaryModel + '/img/transept.jpg',
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
            }
    
            setTimeout(() => {
                
                // Textos
                // Datos de contacto
                var text = 'Tanatorio - Funeraria \n"Los Dolores" \n☎ 981 835601'
                var x = 144
                var y = 1034
                var fill = '#22468f'
                var fontFamily = 'times new roman italic'
                var fontSize = 19
                var align = 'center'
                var lineHeight = 1
                var fontStyle = 'normal'
                var width = 535;
    
                var optionsContact = {
                    x: x,
                    y: y,
                    width: width,
                    name: 'text',
                    id: 'contact',
                    draggable: true,
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
                    drawText(optionsContact, styleContact)
                    
                    var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;
    
                    switch(parseInt(obituaryModel)){
                        case 0:
                            var x = 181.359375
                            var y = 790
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ', ' + obituary.location
                            var fontSize = 16
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 476.640625
                            var align = 'left';
                        break;
                        case 1:
                            var x = 222
                            var y = 663
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ', ' + obituary.location
                            var fontSize = 16
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 476.640625
                            var align = 'left';
                        break;
                        case 2:
                            var x = 226.359375
                            var y = 793
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ', ' + obituary.location
                            var fontSize = 16
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 476.640625
                            var align = 'left';
                        break;
                        case 3:
                            var x = 61.359375
                            var y = 738
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ', ' + obituary.location
                            var fontSize = 18
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 552.640625
                            var align = 'left';
                        break;
                        case 4:
                            var x = 181.359375
                            var y = 790
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ' ' + obituary.location
                            var fontSize = 18
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 476.640625
                            var align = 'left';
                        break;
                        case 5:
                            var x = 181.359375
                            var y = 790
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ' ' + obituary.location
                            var fontSize = 18
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 476.640625
                            var align = 'left';
                        break;
                        case 6:
                            var x = 181.359375
                            var y = 790
                            var text = 'Capilla ardiente: ' + mortuaryName + ', Sala nº ' + obituary.roomNumber + ' ' + obituary.location
                            var fontSize = 18
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 476.640625
                            var align = 'left';
                        break;
                    }
    
                    // Tanatorio, localidad y fecha
                    var optionsMortuary = {
                        x: x,
                        y: y,
                        width: width,
                        name: 'text',
                        id: 'mortuary',
                        draggable: true,
                        fill: fill,
                        opacity: 1
                    }
    
                    var styleMortuary = {
                        fontFamily: fontFamily,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontVariant: 'normal',
                        textDecoration: 'empty string',
                        text: text,
                        verticalAlign: 'top',
                        padding: 0,
                        lineHeight: 1.5,
                        wrap: 'word',
                        ellipsis: false,
                        align: align,
                    }
                    
                    setTimeout(() => {
                        drawText(optionsMortuary, styleMortuary)
    
                        if(obituary.prayForCheck == '1'){
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
                                    quoteX = 371
                                    quoteY = 140
                                    quoteWidth = 117.640625
                                    quoteFontFamily = 'times new roman'
                                    quoteFontSize = 22
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                    fill = '#000000'
                                break
                                case 1:
                                    // LA SEÑORA // EL SEÑOR
                                    quoteX = 228.359375
                                    quoteY = 63
                                    quoteWidth = 449.640625
                                    quoteFontFamily = 'times new roman'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'normal'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                    fill = '#000000'
                                break
                                case 2:
                                    quoteX = 241
                                    quoteY = 99
                                    quoteWidth = 387
                                    quoteFontFamily = 'times new roman'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'normal'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                    fill = '#000000'
                                break
                                case 3:
                                    quoteX = 188
                                    quoteY = 90
                                    quoteWidth = 387
                                    quoteFontFamily = 'times new roman'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'normal'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                    fill = '#000000'
                                break
                                case 4:
                                    quoteX = 50
                                    quoteY = 56
                                    quoteWidth = 700
                                    quoteFontFamily = 'caslon'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#00305c'
                                break
                                case 5:
                                    quoteX = 215
                                    quoteY = 45
                                    quoteWidth = 535
                                    quoteFontFamily = 'caslon'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#00305c'
                                break
                                case 6:
                                    quoteX = 215
                                    quoteY = 45
                                    quoteWidth = 535
                                    quoteFontFamily = 'caslon'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#00305c'
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
                            }, 150)
                        }
    
                        setTimeout(() => {
                           
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
                                    deceasedX = 267
                                    deceasedY = 170
                                    deceasedWidth = 320.640625
                                    deceasedFontFamily = 'times new roman'
                                    deceasedFontSize = 38
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1.25
                                    fill = '#000000'
                                break
                                case 1:
                                    deceasedX = 227.359375
                                    deceasedY = 81
                                    deceasedWidth = 444.640625
                                    deceasedFontFamily = 'times new roman'
                                    deceasedFontSize = 46
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1.25
                                    fill = '#000000'
                                break
                                case 2:
                                    deceasedX = 296.359375
                                    deceasedY = 282
                                    deceasedWidth = 285.640625
                                    deceasedFontFamily = 'times new roman'
                                    deceasedFontSize = 36
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1.25
                                    fill = '#000000'
                                break
                                case 3:
                                    deceasedX = 64
                                    deceasedY = 300
                                    deceasedWidth = 669
                                    deceasedFontFamily = 'times new roman'
                                    deceasedFontSize = 36
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1.25
                                    fill = '#000000'
                                break
                                case 4:
                                    deceasedX = 50
                                    deceasedY = 95
                                    deceasedWidth = 700
                                    deceasedFontFamily = 'garamonditalic'
                                    deceasedFontSize = 48
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#00305c'
                                break
                                case 5:
                                    deceasedX = 215
                                    deceasedY = 77
                                    deceasedWidth = 535
                                    deceasedFontFamily = 'garamonditalic'
                                    deceasedFontSize = 48
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#00305c'
                                break
                                case 6:
                                    deceasedX = 215
                                    deceasedY = 77
                                    deceasedWidth = 535
                                    deceasedFontFamily = 'garamonditalic'
                                    deceasedFontSize = 48
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#00305c'
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
    
                            if(parseInt(obituaryModel) == 0){
                                deceasedText = obituary.namePre.charAt(0).toUpperCase() + obituary.namePre.slice(1).toLowerCase() + " " + obituary.name + ' ' + obituary.surname
                            }else if(parseInt(obituaryModel) == 2 || parseInt(obituaryModel) == 3){
                                deceasedText = obituary.namePre.charAt(0).toUpperCase() + obituary.namePre.slice(1).toLowerCase() + " " + obituary.name + ' ' + obituary.surname
                            }
    
                            var styleDeceased = {
                                fontFamily: deceasedFontFamily,
                                fontSize: deceasedFontSize,
                                fontStyle: deceasedFontStyle,
                                fontVariant: 'normal',
                                textDecoration: 'empty string',
                                text: deceasedText,
                                align: deceasedAlign,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: deceasedLineHeight,
                                wrap: 'word',
                                ellipsis: false
                            }
    
                            setTimeout(() => {
                                drawText(optionsDeceased, styleDeceased)
                               
                                var extraTextX = 0;
                                var extraTextY = 0;
                                var extraTextWidth = 0;
                                var extraTextFontFamily = '';
                                var extraTextFontSize = 0;
                                var extraTextFontStyle = '';
                                var extraTextAlign = '';
                                var extraTextLineHeight = 0;
                                var fill = '';
                                switch(parseInt(obituaryModel)){
                                    case 0:
                                        extraTextX = 155
                                        extraTextY = 261
                                        extraTextWidth = 484.640625
                                        extraTextFontFamily = 'times new roman italic'
                                        extraTextFontSize = 18
                                        extraTextFontStyle = 'normal'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 1:
                                        extraTextX = 212
                                        extraTextY = 194
                                        extraTextWidth = 535
                                        extraTextFontFamily = 'times new roman italic'
                                        extraTextFontSize = 18
                                        extraTextFontStyle = 'normal'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 2:
                                        extraTextX = 245.359375
                                        extraTextY = 357
                                        extraTextWidth = 420.640625
                                        extraTextFontFamily = 'times new roman italic'
                                        extraTextFontSize = 15
                                        extraTextFontStyle = 'normal'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 3:
                                        extraTextX = 64
                                        extraTextY = 337
                                        extraTextWidth = 669
                                        extraTextFontFamily = 'times new roman italic'
                                        extraTextFontSize = 20
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 4:
                                        extraTextX = 50
                                        extraTextY = 150
                                        extraTextWidth = 700
                                        extraTextFontFamily = 'garamonditalic'
                                        extraTextFontSize = 32
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#00305c'
                                    break
                                    case 5:
                                        extraTextX = 215
                                        extraTextY = 135
                                        extraTextWidth = 535
                                        extraTextFontFamily = 'garamonditalic'
                                        extraTextFontSize = 32
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#00305c'
                                    break
                                    case 6:
                                        extraTextX = 215
                                        extraTextY = 135
                                        extraTextWidth = 535
                                        extraTextFontFamily = 'garamonditalic'
                                        extraTextFontSize = 32
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#00305c'
                                    break;
                                }
    
                                // Fallecido
                                var optionsExtraText = {
                                    x: extraTextX,
                                    y: extraTextY,
                                    width: extraTextWidth,
                                    name: 'text',
                                    id: 'extraText',
                                    draggable: true,
                                    fill: fill,
                                    opacity: 1
                                }
                                
                                var styleExtraText = {
                                    fontFamily: extraTextFontFamily,
                                    fontSize: extraTextFontSize,
                                    fontStyle: extraTextFontStyle,
                                    fontVariant: 'normal',
                                    textDecoration: 'empty string',
                                    text: obituary.extraText == '' ? '' : '"' + obituary.extraText + '"',
                                    align: extraTextAlign,
                                    verticalAlign: 'top',
                                    padding: 0,
                                    lineHeight: extraTextLineHeight,
                                    wrap: 'word',
                                    ellipsis: false
                                }
    
                                setTimeout(() => {
                                    drawText(optionsExtraText, styleExtraText)
    
                                    var widowX = 0;
                                    var widowY = 0;
                                    var widowWidth = 0;
                                    var widowFontFamily = '';
                                    var widowFontSize = 0;
                                    var widowFontStyle = '';
                                    var widowAlign = '';
                                    var widowLineHeight = 0;
                                    var fill = '';
                                    switch(parseInt(obituaryModel)){
                                        case 0:
                                            widowX = 146
                                            widowY = 376
                                            widowWidth = 535
                                            widowFontFamily = 'times new roman'
                                            widowFontSize = 20
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 1:
                                            widowX = 227.359375
                                            widowY = 327
                                            widowWidth = 484.640625
                                            widowFontFamily = 'times new roman'
                                            widowFontSize = 18
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 2:
                                            widowX = 195.359375
                                            widowY = 478
                                            widowWidth = 484.640625
                                            widowFontFamily = 'times new roman italic'
                                            widowFontSize = 16
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 3:
                                            widowX = 48
                                            widowY = 421
                                            widowWidth = 669
                                            widowFontFamily = 'times new roman italic'
                                            widowFontSize = 18
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 4:
                                            widowX = 50
                                            widowY = 205
                                            widowWidth = 700
                                            widowFontFamily = 'garamonditalic'
                                            widowFontSize = 26
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#00305c'
                                        break
                                        case 5:
                                            widowX = 215
                                            widowY = 190
                                            widowWidth = 535
                                            widowFontFamily = 'garamonditalic'
                                            widowFontSize = 26
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#00305c'
                                        break
                                        case 6:
                                            widowX = 215
                                            widowY = 190
                                            widowWidth = 535
                                            widowFontFamily = 'garamonditalic'
                                            widowFontSize = 26
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#00305c'
                                        break
                                    }
    
                                    // Viudo/a
                                    var optionsWidow = {
                                        x: widowX,
                                        y: widowY,
                                        width: widowWidth,
                                        name: 'text',
                                        id: 'widow',
                                        draggable: true,
                                        fill: fill,
                                        opacity: 1
                                    }
    
                                    var styleWidow = {
                                        fontFamily: widowFontFamily,
                                        fontSize: widowFontSize,
                                        fontStyle: widowFontStyle,
                                        fontVariant: 'normal',
                                        textDecoration: 'empty string',
                                        text: obituary.deceasedMaritalStatus.toLowerCase() == 'viudo' ? '(' + obituary.spousePre + ' ' + obituary.spouseName + ')' : '',
                                        align: widowAlign,
                                        verticalAlign: 'top',
                                        padding: 0,
                                        lineHeight: widowLineHeight,
                                        wrap: 'word',
                                        ellipsis: false
                                    }
    
                                    setTimeout(() => {
                                        drawText(optionsWidow, styleWidow)
    
                                        var diedX = 0;
                                        var diedY = 0;
                                        var diedWidth = 0;
                                        var diedFontFamily = '';
                                        var diedFontSize = 0;
                                        var diedFontStyle = '';
                                        var diedAlign = '';
                                        var diedLineHeight = 0;
                                        switch(parseInt(obituaryModel)){
                                            case 0:
                                                diedX = 175.359375
                                                diedY = 297
                                                diedWidth = 484.640625
                                                diedFontFamily = "times new roman"
                                                diedFontSize = 18
                                                diedFontStyle = 'normal'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 1:
                                                diedX = 240.359375
                                                diedY = 229
                                                diedWidth = 444.640625
                                                diedFontFamily = "times new roman"
                                                diedFontSize = 18
                                                diedFontStyle = 'normal'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 2:
                                                diedX = 225.359375
                                                diedY = 393
                                                diedWidth = 444.640625
                                                diedFontFamily = "times new roman"
                                                diedFontSize = 18
                                                diedFontStyle = 'normal'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 3:
                                                diedX = 181.359375
                                                diedY = 366
                                                diedWidth = 415.640625
                                                diedFontFamily = "times new roman"
                                                diedFontSize = 18
                                                diedFontStyle = 'normal'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 4:
                                                diedX = 50
                                                diedY = 240
                                                diedWidth = 700
                                                diedFontFamily = 'caslon'
                                                diedFontSize = 26
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#00305c'
                                            break
                                            case 5:
                                                diedX = 215
                                                diedY = 230
                                                diedWidth = 535
                                                diedFontFamily = 'caslon'
                                                diedFontSize = 26
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#00305c'
                                            break
                                            case 6:
                                                diedX = 215
                                                diedY = 230
                                                diedWidth = 535
                                                diedFontFamily = 'caslon'
                                                diedFontSize = 26
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#00305c'
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
    
                                        var diedText = '';
                                        var auxText = (obituary.died).split(',')
                                        $.each(auxText, function(index, elem){
                                            if(index == auxText.length - 1){
                                                diedText += elem
                                            }else{
                                                diedText += elem + ',\n'
                                            }
                                        })
                                        
                                        var styleDied = {
                                            fontFamily: diedFontFamily,
                                            fontSize: diedFontSize,
                                            fontStyle: diedFontStyle,
                                            fontVariant: 'normal',
                                            textDecoration: 'empty string',
                                            text: diedText,
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
                                                    depX = 335.359375
                                                    depY = 336
                                                    depWidth = 152.640625
                                                    depFontFamily = 'times new roman'
                                                    depFontSize = 24
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break;
                                                case 1:
                                                    depX = 245.359375
                                                    depY = 272.746
                                                    depWidth = 435.640625
                                                    depFontFamily = 'times new roman'
                                                    depFontSize = 24
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break;
                                                case 2:
                                                    depX = 345.359375
                                                    depY = 435.746
                                                    depWidth = 197.640625
                                                    depFontFamily = 'times new roman'
                                                    depFontSize = 20
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    depX = 64
                                                    depY = 510
                                                    depWidth = 669
                                                    depFontFamily = 'garamond'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#00305c'
                                                break
                                                case 4:
                                                    depX = 50
                                                    depY = 300
                                                    depWidth = 700
                                                    depFontFamily = 'garamond'
                                                    depFontSize = 26
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#00305c'
                                                break
                                                case 5:
                                                    depX = 215
                                                    depY = 295
                                                    depWidth = 535
                                                    depFontFamily = 'garamond'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#00305c'
                                                break
                                                case 6:
                                                    depX = 215
                                                    depY = 295
                                                    depWidth = 535
                                                    depFontFamily = 'garamond'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#00305c'
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
                                                if(parseInt(obituaryModel) != 3){
                                                    drawText(optionsDep, styleDep)
                                                }
    
                                                var familyX = 0;
                                                var familyY = 0;
                                                var familyWidth = 0;
                                                var familyFontFamily = '';
                                                var familyFontSize = 0;
                                                var familyFontStyle = '';
                                                var familyAlign = '';
                                                var familyLineHeight = 0;
                                                var fill = '';
                                                switch(parseInt(obituaryModel)){
                                                    case 0:
                                                        familyX = 176.359375
                                                        familyY = 406
                                                        familyWidth = 483.640625
                                                        familyFontFamily = 'times new roman'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 1:
                                                        familyX = 232.359375
                                                        familyY = 356
                                                        familyWidth = 482.640625
                                                        familyFontFamily = 'times new roman'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 2:
                                                        familyX = 226.359375
                                                        familyY = 496
                                                        familyWidth = 499.640625
                                                        familyFontFamily = 'times new roman'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 3:
                                                        familyX = 60
                                                        familyY = 447
                                                        familyWidth = 669
                                                        familyFontFamily = 'times new roman'
                                                        familyFontSize = 20
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 4:
                                                        familyX = 50
                                                        familyY = 335
                                                        familyWidth = 700
                                                        familyFontFamily = 'garamond'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#00305c'
                                                    break
                                                    case 5:
                                                        familyX = 215
                                                        familyY = 407
                                                        familyWidth = 535
                                                        familyFontFamily = 'garamond'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#00305c'
                                                    break   
                                                    case 6:
                                                        familyX = 215
                                                        familyY = 407
                                                        familyWidth = 535
                                                        familyFontFamily = 'garamond'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#00305c'
                                                    break
                                                }
    
                                                // Familia
                                                var optionsFamily = {
                                                    x: familyX,
                                                    y: familyY,
                                                    width: familyWidth,
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
                                                family += obituary.siblings == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'irmáns, ' : 'hermanos, ') : ''
                                                family += obituary.politicalSiblings == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'irmáns políticos, ' : 'hermanos políticos, ') : ''
                                                family += obituary.grandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'netos, ' : 'nietos, ') : ''
                                                family += obituary.politicalGrandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'netos políticos, ' : 'nietos políticos, ') : ''
                                                family += obituary.greatGrandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'bisnetos, ' : 'bisnietos, ') : ''
                                                family += obituary.uncles == 1 ? 'tíos, ' : ''
                                                family += obituary.nephews == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'sobriños, ' : 'sobrinos, ') : ''
                                                family += obituary.cousins == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'curmáns, ' : 'primos, ') : ''
                                                
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
                                                    var prayFontFamily = '';
                                                    var prayFontSize = 0;
                                                    var prayFontStyle = '';
                                                    var prayAlign = '';
                                                    var prayLineHeight = 0;
                                                    var fill = '';
                                                    switch(parseInt(obituaryModel)){
                                                        case 0:
                                                            prayX = 178.359375
                                                            prayY = 657
                                                            prayWidth = 480.640625
                                                            prayFontFamily = 'times new roman'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'normal'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            prayX = 222.359375
                                                            prayY = 532
                                                            prayWidth = 496.640625
                                                            prayFontFamily = 'times new roman'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'normal'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 2:
                                                            prayX = 224.359375
                                                            prayY = 680
                                                            prayWidth = 496.640625
                                                            prayFontFamily = 'times new roman'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'normal'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 3:
                                                            prayX = 58.359375
                                                            prayY = 625
                                                            prayWidth = 667.640625
                                                            prayFontFamily = 'times new roman'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'normal'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 4:
                                                            prayX = 50
                                                            prayY = 560
                                                            prayWidth = 700
                                                            prayFontFamily = 'caslon'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#00305c'
                                                        break   
                                                        case 5:
                                                            prayX = 215
                                                            prayY = 635
                                                            prayWidth = 535
                                                            prayFontFamily = 'caslon'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#00305c'
                                                        break
                                                        case 6:
                                                            prayX = 215
                                                            prayY = 635
                                                            prayWidth = 535
                                                            prayFontFamily = 'caslon'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#00305c'
                                                        break;
                                                    }
    
                                                    // Ruegan
                                                    var optionsPray = {
                                                        x: prayX,
                                                        y: prayY,
                                                        width: prayWidth,
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
                                                        var fill  ='';
                                                        switch(parseInt(obituaryModel)){
                                                            case 0:
                                                                FuneralX = 184.359375
                                                                FuneralY = 835
                                                                FuneralWidth = 459.640625
                                                                FuneralFontFamily = 'times new roman'
                                                                FuneralFontSize = 18
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'right'
                                                                FuneralLineHeight = 1
                                                                fill = '#000000'
                                                            break
                                                            case 1:
                                                                FuneralX = 443.359375
                                                                FuneralY = 890
                                                                FuneralWidth = 274.640625
                                                                FuneralFontFamily = 'times new roman'
                                                                FuneralFontSize = 18
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'right'
                                                                FuneralLineHeight = 1
                                                                fill = '#000000'
                                                            break
                                                            case 2:
                                                                FuneralX = 229.359375
                                                                FuneralY = 840
                                                                FuneralWidth = 493.640625
                                                                FuneralFontFamily = 'times new roman'
                                                                FuneralFontSize = 18
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'right'
                                                                FuneralLineHeight = 1
                                                                fill = '#000000'
                                                            break
                                                            case 3:
                                                                FuneralX = 226.359375
                                                                FuneralY = 778
                                                                FuneralWidth = 493.640625
                                                                FuneralFontFamily = 'times new roman'
                                                                FuneralFontSize = 18
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'right'
                                                                FuneralLineHeight = 1
                                                                fill = '#000000'
                                                            break
                                                            case 4:
                                                                FuneralX = 50
                                                                FuneralY = 560
                                                                FuneralWidth = 700
                                                                FuneralFontFamily = 'caslon'
                                                                FuneralFontSize = 20
                                                                FuneralFontStyle = 'bold'
                                                                FuneralAlign = 'justify'
                                                                FuneralLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                            case 5:
                                                                FuneralX = 215
                                                                FuneralY = 635
                                                                FuneralWidth = 535
                                                                FuneralFontFamily = 'caslon'
                                                                FuneralFontSize = 20
                                                                FuneralFontStyle = 'bold'
                                                                FuneralAlign = 'justify'
                                                                FuneralLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                            case 6:
                                                                FuneralX = 215
                                                                FuneralY = 635
                                                                FuneralWidth = 535
                                                                FuneralFontFamily = 'caslon'
                                                                FuneralFontSize = 20
                                                                FuneralFontStyle = 'bold'
                                                                FuneralAlign = 'justify'
                                                                FuneralLineHeight = 1.25
                                                                fill = '#00305c'
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
    
                                                        var funeralDate = obituary.funeralHomeEntryDate == null || obituary.funeralHomeEntryDate == '' ? '' : moment(obituary.funeralHomeEntryDate, 'YYYY-MM-DD').format('LL');
                                                        var styleFuneral = {
                                                            fontFamily: FuneralFontFamily,
                                                            fontSize: FuneralFontSize,
                                                            fontStyle: FuneralFontStyle,
                                                            fontVariant: 'normal',
                                                            textDecoration: 'empty string',
                                                            text: (obituary.mortuaryLocation == null ? '' : obituary.mortuaryLocation) + ', ' + funeralDate,
                                                            align: FuneralAlign,
                                                            verticalAlign: 'top',
                                                            padding: 0,
                                                            lineHeight: FuneralLineHeight,
                                                            wrap: 'word',
                                                            ellipsis: false
                                                        }
        
                                                        setTimeout(() => {
                                                            drawText(optionsFuneral, styleFuneral)
                                                                
                                                            var busX = 0;
                                                            var busY = 0;
                                                            var busWidth = 0;
                                                            var busFontFamily = '';
                                                            var busFontSize = 0;
                                                            var busFontStyle = '';
                                                            var busAlign = '';
                                                            var busLineHeight = 0;
                                                            var fill = '';
                                                            switch(parseInt(obituaryModel)){
                                                                case 0:
                                                                    busX = 45.359375
                                                                    busY = 873
                                                                    busWidth = 675
                                                                    busFontFamily = 'caslon'
                                                                    busFontSize = 20
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'justify'
                                                                    busLineHeight = 1.25
                                                                    fill = '#00305c'
                                                                break
                                                                case 1:
                                                                    busX = 482.359375
                                                                    busY = 693
                                                                    busWidth = 240.640625
                                                                    busFontFamily = 'times new roman italic'
                                                                    busFontSize = 13
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'right'
                                                                    busLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 2:
                                                                    busX = 482.359375
                                                                    busY = 693
                                                                    busWidth = 240.640625
                                                                    busFontFamily = 'times new roman'
                                                                    busFontSize = 13
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'right'
                                                                    busLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 3:
                                                                    busX = 63
                                                                    busY = 782
                                                                    busWidth = 669
                                                                    busFontFamily = 'times new roman'
                                                                    busFontSize = 18
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'right'
                                                                    busLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 4:
                                                                    busX = 50
                                                                    busY = 836
                                                                    busWidth = 700
                                                                    busFontFamily = 'caslon'
                                                                    busFontSize = 20
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'justify'
                                                                    busLineHeight = 1.25
                                                                    fill = '#00305c'
                                                                break
                                                                case 5:
                                                                    busX = 60
                                                                    busY = 870
                                                                    busWidth = 675
                                                                    busFontFamily = 'caslon'
                                                                    busFontSize = 20
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'justify'
                                                                    busLineHeight = 1.25
                                                                    fill = '#00305c'
                                                                break
                                                                case 6:
                                                                    busX = 60
                                                                    busY = 895
                                                                    busWidth = 675
                                                                    busFontFamily = 'caslon'
                                                                    busFontSize = 20
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'justify'
                                                                    busLineHeight = 1.25
                                                                    fill = '#00305c'
                                                                break
                                                            }
    
                                                            // Omnibús
                                                            var optionsBus = {
                                                                x: busX,
                                                                y: busY,
                                                                width: busWidth,
                                                                name: 'text',
                                                                id: 'bus',
                                                                draggable: true,
                                                                fill: fill,
                                                                opacity: 1
                                                            }
    
                                                            if(parseInt(obituaryModel) == 1){
                                                                obituary.busRoute = '¡Oh , Señor! \nHaz que yo quiera consolar \nque ser consolado; \ncomprender que ser comprendido; \namar que ser amado. \n Pues; \nes dado lo que se recibe, \nes perdonado lo que se perdona \ny es muriendo que se renace para \nla Vida Eterna.'
                                                            }
    
                                                            var styleBus = {
                                                                fontFamily: busFontFamily,
                                                                fontSize: busFontSize,
                                                                fontStyle: busFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: obituary.busRoute,
                                                                align: busAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: busLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }
    
                                                            setTimeout(() => {
    
                                                                if(parseInt(obituaryModel) == 1){
                                                                    drawText(optionsBus, styleBus)
                                                                }
    
                                                                setTimeout(() => {
                                                                    stage.find('#background')[0].zIndex(0)
                                                                        
                                                                    switch(parseInt(obituaryModel)){
                                                                        case 0:
                                                                        case 1:
                                                                        case 2:
                                                                        case 3:
                                                                        case 5:
                                                                        case 6:
                                                                            var elems = [
                                                                                'transept',
                                                                                'contact',
                                                                                'mortuary',
                                                                                'quote',
                                                                                'deceased',
                                                                                'extraText',
                                                                                'widow',
                                                                                'died',
                                                                                'dep',
                                                                                'family',
                                                                                'pray',
                                                                                'funeral',
                                                                                'bus',
                                                                            ]
    
                                                                            if(!hasTransept){
                                                                                elems.shift()
                                                                            }
    
                                                                            var i = 1
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
                                                                }, 300)
                                                            }, 150);
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
    }
})