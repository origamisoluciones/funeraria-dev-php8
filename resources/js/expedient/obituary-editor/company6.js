$(function(){
    hasTransept = true;
    hasLogo = false;

    if(!loadFlag){
        setTimeout(() => {

            var transeptX = 0;
            var transeptY  = 0;
            var transeptScaleX  = 0;
            var transeptScaleY  = 0;
        
            switch(parseInt(obituaryModel)){
                case 0:
                    transeptX = 342.5560381592557
                    transeptY = 10.209012491438237
                    transeptScaleX = 1.2090124914382379
                    transeptScaleY = 1.209012491438238
                break
                case 1:
                    transeptX = 46
                    transeptY = 95
                    transeptScaleX = 0.37
                    transeptScaleY = 0.37
                break
                case 2:
                    transeptX = 48
                    transeptY = 253.906
                    transeptScaleX = 0.28
                    transeptScaleY = 0.2439884483733514
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
                
                var text = 'TANATORIO DEL MIÑOR\nSabarís - Baiona\nTFNO: 629.41.61.21 - 606.33.55.44'
                var x = 42.6353759765625
                var y = 1037
                var fill = '#030000'
                var fontFamily = 'helvetica'
                var fontSize = 15
                var align = 'left'
                var lineHeight = 1.5
                var fontStyle = 'normal'
                var width = 293.3646240234375; 
    
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
                  
                    var funeralDate = obituary.funeralHomeEntryDate == null || obituary.funeralHomeEntryDate == '' ? '' : moment(obituary.funeralHomeEntryDate, 'YYYY-MM-DD').format('LL')
                    var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;
                    switch(parseInt(obituaryModel)){
                        case 0:
                            var x = 383
                            var y = 1071
                            if(obituaryType == '5'){
                                var text = obituary.deceasedLocality + ', ' + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                            }else{
                                var text = obituary.deceasedLocality + ', ' + funeralDate
                            }
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
                        break;
                        case 1:
                            var x = 383
                            var y = 1071
                            var text = obituary.deceasedLocality + ', ' + funeralDate
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
                        break;
                        case 2:
                            var x = 383
                            var y = 1071
                            var text = obituary.deceasedLocality + ', ' + funeralDate
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
                        break;
                        case 3:
                            var x = 383
                            var y = 1071
                            var text = obituary.deceasedLocality + ', ' + funeralDate
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
                        break;
                        case 4:
                            var x = 383
                            var y = 1071
                            var text = obituary.deceasedLocality + ', ' + funeralDate
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
                        break;
                        case 5:
                            var x = 383
                            var y = 1071
                            var text = obituary.deceasedLocality + ', ' + funeralDate
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
                        break;
                        case 6:
                            var x = 383
                            var y = 1071
                            var text = obituary.deceasedLocality + ', ' + funeralDate
                            var fontSize = 15
                            var fontStyle = 'normal'
                            var fontFamily = 'helvetica'
                            var fill = '#000000'
                            var width = 373
                            var align = 'right';
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
                                    quoteX = 150
                                    quoteY = 119
                                    quoteWidth = 535
                                    quoteFontFamily = 'helvetica'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#000000'
                                break
                                case 1:
                                    quoteX = 145
                                    quoteY = 30
                                    quoteWidth = 650
                                    quoteFontFamily = 'helvetica'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#000000'
                                break
                                case 2:
                                    quoteX = 143
                                    quoteY = 62
                                    quoteWidth = 535
                                    quoteFontFamily = 'helvetica'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#000000'
                                break
                                case 3:
                                    quoteX = 64
                                    quoteY = 287
                                    quoteWidth = 669
                                    quoteFontFamily = 'helvetica'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                                    fill = '#00305c'
                                break
                                case 4:
                                    quoteX = 50
                                    quoteY = 56
                                    quoteWidth = 700
                                    quoteFontFamily = 'helvetica'
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
                                    quoteFontFamily = 'helvetica'
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
                                    quoteFontFamily = 'helvetica'
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
    
                            var deceasedX2 = 0;
                            var deceasedY2 = 0;
                            var deceasedWidth2 = 0;
                            var deceasedFontFamily2 = '';
                            var deceasedFontSize2 = 0;
                            var deceasedFontStyleX2 = '';
                            var deceasedAlign2  = '';
                            var deceasedLineHeight2  = 0;
                        
                            switch(parseInt(obituaryModel)){
                                case 0:
                                    deceasedX = 1
                                    deceasedY = 188
                                    deceasedWidth = 794
                                    deceasedFontFamily = 'helvetica'
                                    deceasedFontSize = 48
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
    
                                    // LA SEÑORA // EL SEÑOR
                                    deceasedX2 = 0.36000000000001364
                                    deceasedY2 = 152
                                    deceasedWidth2 = $('#page').innerWidth()
                                    deceasedFontFamily2 = 'helvetica'
                                    deceasedFontSize2 = 30
                                    deceasedFontStyleX2 = 'bold'
                                    deceasedAlign2 = 'center'
                                    deceasedLineHeight2 = 1
                                    fill = '#000000'
                                break
                                case 1:
                                    deceasedX = 160.19094848632812 
                                    deceasedY = 102
                                    deceasedWidth = 640.1690515136719
                                    deceasedFontFamily = 'helvetica'
                                    deceasedFontSize = 42
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
    
                                    deceasedX2 = 153.19094848632812
                                    deceasedY2 = 64
                                    deceasedWidth2 = 640.1690515136719
                                    deceasedFontFamily2 = 'helvetica'
                                    deceasedFontSize2 = 28
                                    deceasedFontStyleX2 = 'bold'
                                    deceasedAlign2 = 'center'
                                    deceasedLineHeight2 = 1
                                    fill = '#000000'
                                break
                                case 2:
                                    deceasedX = 8
                                    deceasedY = 133
                                    deceasedWidth = 776.5023645019531
                                    deceasedFontFamily = 'helvetica'
                                    deceasedFontSize = 48
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 3:
                                    deceasedX = 64
                                    deceasedY = 320
                                    deceasedWidth = 669
                                    deceasedFontFamily = 'helvetica'
                                    deceasedFontSize = 48
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#00305c'
                                break
                                case 4:
                                    deceasedX = 50
                                    deceasedY = 95
                                    deceasedWidth = 700
                                    deceasedFontFamily = 'helvetica'
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
                                    deceasedFontFamily = 'helvetica'
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
                                    deceasedFontFamily = 'helvetica'
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
    
                            var styleDeceased = {
                                fontFamily: deceasedFontFamily,
                                fontSize: deceasedFontSize,
                                fontStyle: deceasedFontStyle,
                                fontVariant: 'normal',
                                textDecoration: 'empty string',
                                text: obituary.namePre + ' ' + obituary.name + ' ' + obituary.surname,
                                align: deceasedAlign,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: deceasedLineHeight,
                                wrap: 'word',
                                ellipsis: false
                            }
    
                            // PRE-FALLECIDO
                            var optionsDeceased2 = {
                                x: deceasedX2,
                                y: deceasedY2,
                                width: deceasedWidth2,
                                name: 'text',
                                id: 'deceased2',
                                draggable: true,
                                fill: fill,
                                opacity: 1
                            }
    
                            var styleDeceased2 = {
                                fontFamily: deceasedFontFamily2,
                                fontSize: deceasedFontSize2,
                                fontStyle: deceasedFontStyleX2,
                                fontVariant: 'normal',
                                textDecoration: 'empty string',
                                text: expedientInfo.deceasedGender == 'Mujer' ?  "LA SEÑORA" : "EL SEÑOR",
                                align: deceasedAlign2,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: deceasedLineHeight2,
                                wrap: 'word',
                                ellipsis: false
                            }
    
                            setTimeout(() => {
                                drawText(optionsDeceased, styleDeceased)
                                drawText(optionsDeceased2, styleDeceased2)
    
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
                                        extraTextX = 74
                                        extraTextY = 240
                                        extraTextWidth = 650
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 30
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 1:
                                        extraTextX = 157.19094848632812
                                        extraTextY = 152
                                        extraTextWidth = 632.8090515136719
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 30
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 2:
                                        extraTextX = 41
                                        extraTextY = 185
                                        extraTextWidth = 715
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 30
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 3:
                                        extraTextX = 64
                                        extraTextY = 365
                                        extraTextWidth = 669
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 48
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#00305c'
                                    break
                                    case 4:
                                        extraTextX = 50
                                        extraTextY = 150
                                        extraTextWidth = 700
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 48
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#00305c'
                                    break
                                    case 5:
                                        extraTextX = 215
                                        extraTextY = 135
                                        extraTextWidth = 535
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 48
                                        extraTextFontStyle = 'bold'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#00305c'
                                    break
                                    case 6:
                                        extraTextX = 215
                                        extraTextY = 135
                                        extraTextWidth = 535
                                        extraTextFontFamily = 'helvetica'
                                        extraTextFontSize = 48
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
                                    text: obituary.extraText == '' ? '' : obituary.extraText,
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
                                            widowX = 87
                                            widowY = 275
                                            widowWidth = 650
                                            widowFontFamily = 'helvetica'
                                            widowFontSize = 26
                                            widowFontStyle = 'bold'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 1:
                                            widowX = 194
                                            widowY = 194
                                            widowWidth = 570
                                            widowFontFamily = 'helvetica'
                                            widowFontSize = 26
                                            widowFontStyle = 'bold'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 2:
                                            widowX = 32
                                            widowY = 227
                                            widowWidth = 715
                                            widowFontFamily = 'helvetica'
                                            widowFontSize = 26
                                            widowFontStyle = 'bold'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 3:
                                            widowX = 64
                                            widowY = 415
                                            widowWidth = 669
                                            widowFontFamily = 'garamonditalic'
                                            widowFontSize = 26
                                            widowFontStyle = 'bold'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#00305c'
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
                                        var fill = '';
                                        switch(parseInt(obituaryModel)){
                                            case 0:
                                                diedX = 13
                                                diedY = 313
                                                diedWidth = 780
                                                diedFontFamily = 'helvetica'
                                                diedFontSize = 22
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 1:
                                                diedX = 225
                                                diedY = 230
                                                diedWidth = 480
                                                diedFontFamily = 'helvetica'
                                                diedFontSize = 22
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 2:
                                                diedX = 339
                                                diedY = 288
                                                diedWidth = 400
                                                diedFontFamily = 'helvetica'
                                                diedFontSize = 22
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'      
                                            break;
                                            case 3:
                                                diedX = 64
                                                diedY = 450
                                                diedWidth = 669
                                                diedFontFamily = 'helvetica'
                                                diedFontSize = 26
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#00305c'          
                                            break;
                                            case 4:
                                                diedX = 50
                                                diedY = 240
                                                diedWidth = 700
                                                diedFontFamily = 'helvetica'
                                                diedFontSize = 26
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#00305c'           
                                            break
                                            case 5:
                                                diedX = 215
                                                diedY = 280
                                                diedWidth = 535
                                                diedFontFamily = 'helvetica'
                                                diedFontSize = 26
                                                diedFontStyle = 'bold'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#00305c'      
                                            break
                                            case 6:
                                                diedX = 215
                                                diedY = 242
                                                diedWidth = 535
                                                diedFontFamily = 'helvetica'
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
                                                    depX = 16
                                                    depY = 351
                                                    depWidth = 778
                                                    depFontFamily = 'helvetica'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break;
                                                case 1:
                                                    depX = 165.19094848632812
                                                    depY = 295
                                                    depWidth = 614.8090515136719
                                                    depFontFamily = 'helvetica'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break;
                                                case 2:
                                                    depX = 337
                                                    depY = 377
                                                    depWidth = 400
                                                    depFontFamily = 'helvetica'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    depX = 64
                                                    depY = 510
                                                    depWidth = 669
                                                    depFontFamily = 'helvetica'
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
                                                    depFontFamily = 'helvetica'
                                                    depFontSize = 26
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#00305c'
                                                break
                                                case 5:
                                                    depX = 215
                                                    depY = 350
                                                    depWidth = 535
                                                    depFontFamily = 'helvetica'
                                                    depFontSize = 28
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#00305c'
                                                break
                                                case 6:
                                                    depX = 215
                                                    depY = 350
                                                    depWidth = 535
                                                    depFontFamily = 'helvetica'
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
                                                drawText(optionsDep, styleDep)
    
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
                                                        familyX = 130
                                                        familyY = 395
                                                        familyWidth = 535
                                                        familyFontFamily = 'helvetica'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 1:
                                                        familyX = 174.19094848632812
                                                        familyY = 335
                                                        familyWidth = 575.8090515136719
                                                        familyFontFamily = 'helvetica'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 2:
                                                        familyX = 50
                                                        familyY = 475
                                                        familyWidth = 700
                                                        familyFontFamily = 'helvetica'
                                                        familyFontSize = 24
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 3:
                                                        familyX = 64
                                                        familyY = 542
                                                        familyWidth = 669
                                                        familyFontFamily = 'helvetica'
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
                                                        familyFontFamily = 'helvetica'
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
                                                        familyFontFamily = 'helvetica'
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
                                                            prayX = 127
                                                            prayY = 616
                                                            prayWidth = 535
                                                            prayFontFamily = 'helvetica'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            prayX = 49
                                                            prayY = 646
                                                            prayWidth = 683
                                                            prayFontFamily = 'helvetica'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.5
                                                            fill = '#000000'
                                                        break;
                                                        case 2:
                                                            prayX = 50
                                                            prayY = 660
                                                            prayWidth = 700
                                                            prayFontFamily = 'helvetica'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 3:
                                                            prayX = 64
                                                            prayY = 720
                                                            prayWidth = 669
                                                            prayFontFamily = 'helvetica'
                                                            prayFontSize = 20
                                                            prayFontStyle = 'bold'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#00305c'
                                                        break;
                                                        case 4:
                                                            prayX = 50
                                                            prayY = 560
                                                            prayWidth = 700
                                                            prayFontFamily = 'helvetica'
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
                                                            prayFontFamily = 'helvetica'
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
                                                            prayFontFamily = 'helvetica'
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
    
                                                        var MourningX = 0;
                                                        var MourningY = 0;
                                                        var MourningWidth = 0;
                                                        var MourningFontFamily = '';
                                                        var MourningFontSize = 0;
                                                        var MourningFontStyle = '';
                                                        var MourningAlign = '';
                                                        var MourningLineHeight = 0;
                                                        var fill = '';
                                                        switch(parseInt(obituaryModel)){
                                                            case 0:
                                                                MourningX = 125
                                                                MourningY = 800
                                                                MourningWidth = 535
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'center'
                                                                MourningLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 1:
                                                                MourningX = 59
                                                                MourningY = 615
                                                                MourningWidth = 683
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.5
                                                                fill = '#00305c'
                                                            break
                                                            case 2:
                                                                MourningX = 50
                                                                MourningY = 660
                                                                MourningWidth = 700
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                            case 3:
                                                                MourningX = 64
                                                                MourningY = 720
                                                                MourningWidth = 669
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                            case 4:
                                                                MourningX = 50
                                                                MourningY = 560
                                                                MourningWidth = 700
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                            case 5:
                                                                MourningX = 215
                                                                MourningY = 635
                                                                MourningWidth = 535
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                            case 6:
                                                                MourningX = 215
                                                                MourningY = 635
                                                                MourningWidth = 535
                                                                MourningFontFamily = 'helvetica'
                                                                MourningFontSize = 20
                                                                MourningFontStyle = 'bold'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.25
                                                                fill = '#00305c'
                                                            break
                                                        }
        
                                                        // Ruegan
                                                        var optionsMourning = {
                                                            x: MourningX,
                                                            y: MourningY,
                                                            width: MourningWidth,
                                                            name: 'text',
                                                            id: 'mourning',
                                                            draggable: true,
                                                            fill: fill,
                                                            opacity: 1
                                                        }
    
                                                        var styleMourning = {
                                                            fontFamily: MourningFontFamily,
                                                            fontSize: MourningFontSize,
                                                            fontStyle: MourningFontStyle,
                                                            fontVariant: 'normal',
                                                            textDecoration: 'empty string',
                                                            text: parseInt(obituary.mourning) == 1 ? "No se recibe duelo" : "",
                                                            align: MourningAlign,
                                                            verticalAlign: 'top',
                                                            padding: 0,
                                                            lineHeight: MourningLineHeight,
                                                            wrap: 'word',
                                                            ellipsis: false
                                                        }
        
                                                        setTimeout(() => {
                                                            drawText(optionsMourning, styleMourning)
    
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
                                                                    FuneralX = 124
                                                                    FuneralY = 926
                                                                    FuneralWidth = 535
                                                                    FuneralFontFamily = 'helvetica'
                                                                    FuneralFontSize = 17
                                                                    FuneralFontStyle = 'normal'
                                                                    FuneralAlign = 'justify'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                case 1:
                                                                    FuneralX = 59
                                                                    FuneralY = 615
                                                                    FuneralWidth = 683
                                                                    FuneralFontFamily = 'helvetica'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'justify'
                                                                    FuneralLineHeight = 1.5
                                                                    fill = '#00305c'
                                                                break
                                                                case 2:
                                                                    FuneralX = 50
                                                                    FuneralY = 660
                                                                    FuneralWidth = 700
                                                                    FuneralFontFamily = 'helvetica'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'justify'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#00305c'
                                                                break
                                                                case 3:
                                                                    FuneralX = 64
                                                                    FuneralY = 720
                                                                    FuneralWidth = 669
                                                                    FuneralFontFamily = 'helvetica'
                                                                    FuneralFontSize = 20
                                                                    FuneralFontStyle = 'bold'
                                                                    FuneralAlign = 'justify'
                                                                    FuneralLineHeight = 1.25
                                                                    fill = '#00305c'
                                                                break
                                                                case 4:
                                                                    FuneralX = 50
                                                                    FuneralY = 560
                                                                    FuneralWidth = 700
                                                                    FuneralFontFamily = 'helvetica'
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
                                                                    FuneralFontFamily = 'helvetica'
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
                                                                    FuneralFontFamily = 'helvetica'
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
                                                            
                                                            var styleFuneral = {
                                                                fontFamily: FuneralFontFamily,
                                                                fontSize: FuneralFontSize,
                                                                fontStyle: FuneralFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: obituary.funeral,
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
                                                                        busX = 126.6353759765625
                                                                        busY = 855
                                                                        busWidth = 545.7239990234375
                                                                        busFontFamily = 'helvetica'
                                                                        busFontSize = 20
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.25
                                                                        fill = '#000000'
                                                                    break
                                                                    case 1:
                                                                        busX = 59
                                                                        busY = 846
                                                                        busWidth = 683
                                                                        busFontFamily = 'helvetica'
                                                                        busFontSize = 20
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#00305c'
                                                                    break
                                                                    case 2:
                                                                        busX = 50
                                                                        busY = 860
                                                                        busWidth = 700
                                                                        busFontFamily = 'helvetica'
                                                                        busFontSize = 20
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.25
                                                                        fill = '#00305c'
                                                                    break
                                                                    case 3:
                                                                        busX = 64
                                                                        busY = 896
                                                                        busWidth = 669
                                                                        busFontFamily = 'helvetica'
                                                                        busFontSize = 20
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.25
                                                                        fill = '#00305c'
                                                                    break
                                                                    case 4:
                                                                        busX = 50
                                                                        busY = 836
                                                                        busWidth = 700
                                                                        busFontFamily = 'helvetica'
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
                                                                        busFontFamily = 'helvetica'
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
                                                                        busFontFamily = 'helvetica'
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
                                                                    drawText(optionsBus, styleBus)
    
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
                                                                                    'deceased2',
                                                                                    'extraText',
                                                                                    'widow',
                                                                                    'died',
                                                                                    'dep',
                                                                                    'family',
                                                                                    'pray',
                                                                                    'mourning',
                                                                                    'funeral',
                                                                                    'bus',
                                                                                ]
    
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
            }, 150)
        }, 150)
    }
})