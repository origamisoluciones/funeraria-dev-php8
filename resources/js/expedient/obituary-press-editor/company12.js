$(function(){
    hasTransept = false;
    hasLogo = false;
                
    if(!loadFlag){
        setTimeout(() => {

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
                        quoteX = 126
                        quoteY = 195
                        quoteWidth = 535
                        quoteFontFamily = 'times new roman'
                        quoteFontSize = 18
                        quoteFontStyle = 'bold'
                        quoteAlign = 'center'
                        quoteLineHeight = 1
                        quoteText = obituary.prayForText
                        fill = '#000000'
                    break
                    case 1:
                        quoteX = 215
                        quoteY = 50
                        quoteWidth = 535
                        quoteFontFamily = 'caslon'
                        quoteFontSize = 20
                        quoteFontStyle = 'bold'
                        quoteAlign = 'center'
                        quoteLineHeight = 1
                        quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                        fill = '#00305c'
                    break
                    case 2:
                        quoteX = 39
                        quoteY = 49
                        quoteWidth = 715
                        quoteFontFamily = 'caslon'
                        quoteFontSize = 20
                        quoteFontStyle = 'bold'
                        quoteAlign = 'center'
                        quoteLineHeight = 1
                        quoteText = '" ' + obituary.prayForText + ' ' + obituary.prayForGenre + ' "'
                        fill = '#00305c'
                    break
                    case 3:
                        quoteX = 64
                        quoteY = 287
                        quoteWidth = 669
                        quoteFontFamily = 'caslon'
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
                        deceasedX = 50.36
                        deceasedY = 228
                        deceasedWidth = 696.64
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 39
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 1:
                        deceasedX = 215
                        deceasedY = 92
                        deceasedWidth = 535
                        deceasedFontFamily = 'garamonditalic'
                        deceasedFontSize = 48
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#00305c'
                    break
                    case 2:
                        deceasedX = 39
                        deceasedY = 90
                        deceasedWidth = 715
                        deceasedFontFamily = 'garamonditalic'
                        deceasedFontSize = 48
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#00305c'
                    break
                    case 3:
                        deceasedX = 64
                        deceasedY = 320
                        deceasedWidth = 669
                        deceasedFontFamily = 'garamonditalic'
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

                var styleDeceased = {
                    fontFamily: deceasedFontFamily,
                    fontSize: deceasedFontSize,
                    fontStyle: deceasedFontStyle,
                    fontVariant: 'normal',
                    textDecoration: 'empty string',
                    text:  obituary.namePre + ' ' + (obituary.name + ' ' + obituary.surname).toUpperCase(),
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
                            extraTextX = 215
                            extraTextY = 140
                            extraTextWidth = 535
                            extraTextFontFamily = 'garamonditalic'
                            extraTextFontSize = 23
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#00305c'
                        break
                        case 1:
                            extraTextX = 215
                            extraTextY = 140
                            extraTextWidth = 535
                            extraTextFontFamily = 'garamonditalic'
                            extraTextFontSize = 32
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#00305c'
                        break
                        case 2:
                            extraTextX = 39
                            extraTextY = 145
                            extraTextWidth = 715
                            extraTextFontFamily = 'garamonditalic'
                            extraTextFontSize = 32
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#00305c'
                        break
                        case 3:
                            extraTextX = 64
                            extraTextY = 365
                            extraTextWidth = 669
                            extraTextFontFamily = 'garamonditalic'
                            extraTextFontSize = 32
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#00305c'
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
                                widowX = 4.359375
                                widowY = 308
                                widowWidth = 786
                                widowFontFamily = 'times new roman italic'
                                widowFontSize = 15
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1
                                fill = '#000000'
                            break
                            case 1:
                                widowX = 4.359375
                                widowY = 303
                                widowWidth = 786
                                widowFontFamily = 'times new roman italic'
                                widowFontSize = 15
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1
                                fill = '#000000'
                            break
                            case 2:
                                widowX = 39
                                widowY = 197
                                widowWidth = 715
                                widowFontFamily = 'garamonditalic'
                                widowFontSize = 26
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1
                                fill = '#00305c'
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
                                    diedX = 146.36
                                    diedY = 332
                                    diedWidth = 489.28
                                    diedFontFamily = "times new roman"
                                    diedFontSize = 15
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = '#000000'
                                break
                                case 1:
                                    diedX = 215
                                    diedY = 230
                                    diedWidth = 435
                                    diedFontFamily = 'caslon'
                                    diedFontSize = 26
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = '#00305c'
                                break
                                case 2:
                                    diedX = 342
                                    diedY = 253
                                    diedWidth = 399
                                    diedFontFamily = 'caslon'
                                    diedFontSize = 26
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = '#00305c'
                                break;
                                case 3:
                                    diedX = 64
                                    diedY = 450
                                    diedWidth = 669
                                    diedFontFamily = 'caslon'
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
                                        depX = 42.35
                                        depY = 406
                                        depWidth = 703
                                        depFontFamily = 'times new roman'
                                        depFontSize = 12
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = '#000000'
                                    break;
                                    case 1:
                                        depX = 215
                                        depY = 295
                                        depWidth = 535
                                        depFontFamily = 'garamond'
                                        depFontSize = 28
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = '#00305c'
                                    break;
                                    case 2:
                                        depX = 342
                                        depY = 324
                                        depWidth = 399
                                        depFontFamily = 'garamond'
                                        depFontSize = 28
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = '#00305c'
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
                                            familyX = 61.36
                                            familyY = 450
                                            familyWidth = 681
                                            familyFontFamily = 'times new roman'
                                            familyFontSize = 20
                                            familyFontStyle = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break
                                        case 1:
                                            familyX = 59
                                            familyY = 406
                                            familyWidth = 683
                                            familyFontFamily = 'garamond'
                                            familyFontSize = 24
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.5
                                            fill = '#00305c'
                                        break
                                        case 2:
                                            familyX = 50
                                            familyY = 475
                                            familyWidth = 700
                                            familyFontFamily = 'garamond'
                                            familyFontSize = 24
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = '#00305c'
                                        break
                                        case 3:
                                            familyX = 64
                                            familyY = 542
                                            familyWidth = 669
                                            familyFontFamily = 'garamond'
                                            familyFontSize = 24
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = '#00305c'
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
                                        family += obituary.spouseName != '' ? capitalizeFirstLetter(obituary.spousePre).replace(",", ":") + ' ' + obituary.spouseName + '.\n' : ''
                                    }
                                        
                                    family += obituary.childrenNames != '' ? capitalizeFirstLetter(obituary.childrenPre).replace(",", ":") + ' ' + obituary.childrenNames + '.\n' : ''
                                    family += obituary.childrenInLawNames != '' ? capitalizeFirstLetter(obituary.childrenInLawPre).replace(",", ":") + ' ' + obituary.childrenInLawNames + '.\n' : ''
                                    family += obituary.grandchildrenNames != '' ?  capitalizeFirstLetter(obituary.grandchildrenPre).replace(",", ":") + ' ' + obituary.grandchildrenNames + '.\n' : ''
                                    family += obituary.grandchildrenInLawNames != '' ? capitalizeFirstLetter(obituary.grandchildrenInLawPre).replace(",", ":") + ' ' + obituary.grandchildrenInLawNames + '.\n' : ''
                                    family += obituary.greatGrandchildrenNames != '' ? capitalizeFirstLetter(obituary.greatGrandchildrenPre).replace(",", ":") + ' ' + obituary.greatGrandchildrenNames + '.\n' : ''
                                    family += obituary.parentsNames != '' ? capitalizeFirstLetter(obituary.parentsPre).replace(",", ":") + ' ' + obituary.parentsNames + '.\n' : ''
                                    family += obituary.parentsInLawNames != '' ? capitalizeFirstLetter(obituary.parentsInLawPre).replace(",", ":") + ' ' + obituary.parentsInLawNames + '.\n' : ''
                                    family += obituary.paternalGrandfathersNames != '' ?  capitalizeFirstLetter(obituary.paternalGrandfathersPre).replace(",", ":") + ' ' + obituary.paternalGrandfathersNames + '.\n' : ''
                                    family += obituary.paternalGrandmotherNames != '' ? capitalizeFirstLetter(obituary.paternalGrandmotherPre).replace(",", ":") + ' ' + obituary.paternalGrandmotherNames + '.\n' : ''
                                    family += obituary.siblingsNames != '' ? capitalizeFirstLetter(obituary.siblingsPre).replace(",", ":") + ' ' + obituary.siblingsNames + '.\n' : ''
                                    family += obituary.politicalSiblingsNames != '' ? capitalizeFirstLetter(obituary.politicalSiblingsPre).replace(",", ":") + ' ' + obituary.politicalSiblingsNames + '.\n' : ''

                                    var familyRest = '';
                                    familyRest += obituary.siblings == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'irmáns, ' : 'hermanos, ') : ''
                                    familyRest += obituary.politicalSiblings == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'irmáns políticos, ' : 'hermanos políticos, ') : ''
                                    familyRest += obituary.grandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'netos, ' : 'nietos, ') : ''
                                    familyRest += obituary.politicalGrandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'netos políticos, ' : 'nietos políticos, ') : ''
                                    familyRest += obituary.greatGrandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'bisnetos, ' : 'bisnietos, ') : ''
                                    familyRest += obituary.uncles == 1 ? 'tíos, ' : ''
                                    familyRest += obituary.nephews == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'sobriños, ' : 'sobrinos, ') : ''
                                    familyRest += obituary.cousins == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'curmáns, ' : 'primos, ') : ''
                                    familyRest = capitalizeFirstLetter(familyRest);
                                    family += familyRest;
                                    
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
                                                prayX = 61.36
                                                prayY = 738
                                                prayWidth = 654.64
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break
                                            case 1:
                                                prayX = 59
                                                prayY = 61
                                                prayWidth = 683
                                                prayFontFamily = 'caslon'
                                                prayFontSize = 20
                                                prayFontStyle = 'bold'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.5
                                                fill = '#00305c'
                                            break;
                                            case 2:
                                                prayX = 50
                                                prayY = 660
                                                prayWidth = 700
                                                prayFontFamily = 'caslon'
                                                prayFontSize = 20
                                                prayFontStyle = 'bold'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#00305c'
                                            break;
                                            case 3:
                                                prayX = 64
                                                prayY = 720
                                                prayWidth = 669
                                                prayFontFamily = 'caslon'
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
                                                    MourningX = 65.36
                                                    MourningY = 983
                                                    MourningWidth = 386.64
                                                    MourningFontFamily = 'times new roman'
                                                    MourningFontSize = 15
                                                    MourningFontStyle = 'bold'
                                                    MourningLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    MourningX = 59
                                                    MourningY = 615
                                                    MourningWidth = 683
                                                    MourningFontFamily = 'caslon'
                                                    MourningFontSize = 20
                                                    MourningFontStyle = 'bold'
                                                    MourningAlign = 'justify'
                                                    MourningLineHeight = 1.5
                                                break
                                                case 2:
                                                    MourningX = 50
                                                    MourningY = 660
                                                    MourningWidth = 700
                                                    MourningFontFamily = 'caslon'
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
                                                    MourningFontFamily = 'caslon'
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
                                                    MourningFontFamily = 'caslon'
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
                                                    MourningFontFamily = 'caslon'
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
                                                    MourningFontFamily = 'caslon'
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

                                            var textMourning = "";
                                            var deceasedDateFormat = '';
                                            if(obituary.deceasedDate != null && obituary.deceasedDate != ''){
                                                var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                                                var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                                                deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                                                var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))
                                                deceasedDateFormat = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                                            }

                                            var deceasedLocalityShow = '';
                                            if(obituary.deceasedLocality != null){
                                                deceasedLocalityShow = obituary.deceasedLocality;
                                            }

                                            var deceasedLocalityProvinceShow = '';
                                            if(obituary.deceasedLocality != null){
                                                deceasedLocalityProvinceShow = obituary.deceasedProvince;
                                            }

                                            textMourning =  deceasedLocalityShow + ', ' + deceasedLocalityProvinceShow + ', ' + deceasedDateFormat

                                            var styleMourning = {
                                                fontFamily: MourningFontFamily,
                                                fontSize: MourningFontSize,
                                                fontStyle: MourningFontStyle,
                                                fontVariant: 'normal',
                                                textDecoration: 'empty string',
                                                text: textMourning,
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
                                                        FuneralX = 42.36
                                                        FuneralY = 685
                                                        FuneralWidth = 702.64
                                                        FuneralFontFamily = 'times new roman italic'
                                                        FuneralFontSize = 12
                                                        FuneralFontStyle = 'bold'
                                                        FuneralAlign = 'center'
                                                        FuneralLineHeight = 1
                                                        fill = '#000000'
                                                    break
                                                    case 1:
                                                        FuneralX = 59
                                                        FuneralY = 615
                                                        FuneralWidth = 683
                                                        FuneralFontFamily = 'caslon'
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
                                                        FuneralFontFamily = 'caslon'
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
                                                        FuneralFontFamily = 'caslon'
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
                                                
                                                var funeralText = 'Ruegan una oración por su alma';
                                                if(obituaryType == '1'){
                                                    funeralText = 'Pregan unha oración pola súa alma';
                                                }

                                                var styleFuneral = {
                                                    fontFamily: FuneralFontFamily,
                                                    fontSize: FuneralFontSize,
                                                    fontStyle: FuneralFontStyle,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'empty string',
                                                    text: funeralText,
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
                                                            busX = 59
                                                            busY = 846
                                                            busWidth = 683
                                                            busFontFamily = 'caslon'
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
                                                            busFontFamily = 'caslon'
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
                                                            busFontFamily = 'caslon'
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
                                                                        'quote',
                                                                        'deceased',
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
    }
})