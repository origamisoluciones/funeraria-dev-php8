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
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
                break
                case 1:
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
                break
                case 2:
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
                break
                case 3:
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
                break
                case 4:
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
                break;
                case 5:
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
                break
                case 6:
                    transeptX = 51.025122266515154
                    transeptY = 90.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.337222794580481
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
    
            setTimeout(() => {

                drawImage(optionsTransept, expedientID, obituaryType, obituaryModel)

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
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 1:
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 2:
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 3:
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 4:
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 5:
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 6:
                            quoteX = 228
                            quoteY = 46
                            quoteWidth = 838
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
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
                    }, 150)
                }

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
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
                    break
                    case 1:
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
                    break
                    case 2:
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
                    break
                    case 3:
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
                    break
                    case 4:
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
                    break
                    case 5:
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
                    break
                    case 6:
                        deceasedX = 227;
                        deceasedY = 86;
                        deceasedWidth = 838;
                        deceasedFontFamily = 'arial';
                        deceasedFontSize = 60
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.25
                        fill = "#000000"
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
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 1:
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 2:
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 3:
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 4:
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 5:
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 6:
                            extraTextX = 223
                            extraTextY = 232
                            extraTextWidth = 841
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 30
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.25
                            fill = "#000000"
                        break;
                    }

                    // Extra text
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
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 1:
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 2:
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 3:
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 4:
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 5:
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 6:
                                widowX = 212
                                widowY = 280
                                widowWidth = 853
                                widowFontFamily = 'arial'
                                widowFontSize = 21
                                widowFontStyle = 'normal'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
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
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 1:
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 2:
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
                                break;
                                case 3:
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
                                break;
                                case 4:
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 5:
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 6:
                                    diedX = 212
                                    diedY = 317
                                    diedWidth = 856
                                    diedFontFamily = 'arial'
                                    diedFontSize = 20
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.25
                                    fill = "#000000"
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

                            var diedText = obituary.died
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
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
                                    break;
                                    case 1:
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
                                    break;
                                    case 2:
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
                                    break
                                    case 3:
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
                                    break
                                    case 4:
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
                                    break
                                    case 5:
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
                                    break
                                    case 6:
                                        depX = 224
                                        depY = 357
                                        depWidth = 841
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1
                                        fill = "#000000"
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
                                    text: obituary.dep == 1 ? 'D . E . P .' : '',
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
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 1:
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 2:
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 3:
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 4:
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 5:
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
                                        break   
                                        case 6:
                                            familyX = 226
                                            familyY = 391
                                            familyWidth = 814
                                            familyHeight = 117
                                            familyFontFamily = 'arial'
                                            familyFontSize = 21
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25
                                            fill = "#000000"
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

                                    var family = '\t ';
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
                                                prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 1:
                                                prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
                                            break;
                                            case 2:
                                                prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
                                            break;
                                            case 3:
                                                prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
                                            break;
                                            case 4:
                                                prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
                                            break   
                                            case 5:
                                               prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 6:
                                                prayX = 226
                                                prayY = 511
                                                prayWidth = 820
                                                prayFontFamily = 'arial'
                                                prayFontSize = 21
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = "#000000"
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
                                            text: '\t ' + obituary.pray,
                                            align: prayAlign,
                                            verticalAlign: 'top',
                                            padding: 0,
                                            lineHeight: prayLineHeight,
                                            wrap: 'word',
                                            ellipsis: false
                                        }

                                        setTimeout(() => {
                                            drawText(optionsPray, stylePray)

                                            // Mortuary label
                                            switch(parseInt(obituaryModel)){
                                                default:
                                                    var mortuaryLabelX = 226
                                                    var mortuaryLabelY = 637
                                                    var mortuaryLabelWidth = 195
                                                    var mortuaryLabelFontFamily = 'arial'
                                                    var mortuaryLabelFontSize = 20
                                                    var mortuaryLabelFontStyle = 'normal'
                                                    var mortuaryLabelAlign = 'left'
                                                    var mortuaryLabelLineHeight = 1.5
                                                    var fill = '#000000'
                                                break
                                            }

                                            // Mortuary label day
                                            var optionsmortuaryLabel = {
                                                x: mortuaryLabelX,
                                                y: mortuaryLabelY,
                                                width: mortuaryLabelWidth,
                                                name: 'text',
                                                id: 'mortuaryLabel',
                                                draggable: true,
                                                fill: fill,
                                                opacity: 1
                                            }

                                            var stylemortuaryLabel = {
                                                fontFamily: mortuaryLabelFontFamily,
                                                fontSize: mortuaryLabelFontSize,
                                                fontStyle: mortuaryLabelFontStyle,
                                                fontVariant: 'normal',
                                                textDecoration: 'empty string',
                                                text: obituaryModel == 2 ? 'CAPELA ARDENTE' : 'CAPILLA ARDIENTE:',
                                                align: mortuaryLabelAlign,
                                                verticalAlign: 'top',
                                                padding: 0,
                                                lineHeight: mortuaryLabelLineHeight,
                                                wrap: 'word',
                                                ellipsis: false
                                            }

                                            setTimeout(() => {
                                                drawText(optionsmortuaryLabel, stylemortuaryLabel)

                                                // Mortuary info 1
                                                switch(parseInt(obituaryModel)){
                                                    default:
                                                        var mortuary1InfoX = 427
                                                        var mortuary1InfoY = 637
                                                        var mortuary1InfoWidth = 628
                                                        var mortuary1InfoFontFamily = 'arial'
                                                        var mortuary1InfoFontSize = 20
                                                        var mortuary1InfoFontStyle = 'bold'
                                                        var mortuary1InfoAlign = 'left'
                                                        var mortuary1InfoLineHeight = 1.5
                                                        var fill = '#000000'
                                                    break
                                                }

                                                // mortuary1 label
                                                var optionsMortuaryInfo1 = {
                                                    x: mortuary1InfoX,
                                                    y: mortuary1InfoY,
                                                    width: mortuary1InfoWidth,
                                                    name: 'text',
                                                    id: 'mortuaryInfo1',
                                                    draggable: true,
                                                    fill: fill,
                                                    opacity: 1
                                                }

                                                var mortuary1Text = 'Tanatorio ' + obituary.mortuary + ', sala nº ' + obituary.roomNumber

                                                var styleMortuaryInfo1 = {
                                                    fontFamily: mortuary1InfoFontFamily,
                                                    fontSize: mortuary1InfoFontSize,
                                                    fontStyle: mortuary1InfoFontStyle,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'empty string',
                                                    text: mortuary1Text,
                                                    align: mortuary1InfoAlign,
                                                    verticalAlign: 'top',
                                                    padding: 0,
                                                    lineHeight: mortuary1InfoLineHeight,
                                                    wrap: 'word',
                                                    ellipsis: false
                                                }

                                                setTimeout(() => {
                                                    drawText(optionsMortuaryInfo1, styleMortuaryInfo1)

                                                    // Mortuary info 1
                                                    switch(parseInt(obituaryModel)){
                                                        default:
                                                            var mortuary2InfoX = 427
                                                            var mortuary2InfoY = 667
                                                            var mortuary2InfoWidth = 326
                                                            var mortuary2InfoFontFamily = 'arial'
                                                            var mortuary2InfoFontSize = 20
                                                            var mortuary2InfoFontStyle = 'normal'
                                                            var mortuary2InfoAlign = 'left'
                                                            var mortuary2InfoLineHeight = 1.5
                                                            var fill = '#000000'
                                                        break
                                                    }

                                                    // mortuary2 label
                                                    var optionsMortuaryInfo2 = {
                                                        x: mortuary2InfoX,
                                                        y: mortuary2InfoY,
                                                        width: mortuary2InfoWidth,
                                                        name: 'text',
                                                        id: 'mortuaryInfo2',
                                                        draggable: true,
                                                        fill: fill,
                                                        opacity: 1
                                                    }

                                                    var mortuary2Text = '';
                                                    if(expedientInfo.mortuaryAddress != null && expedientInfo.mortuaryAddress != ''){
                                                        mortuary2Text = expedientInfo.mortuaryAddress

                                                        if(expedientInfo.mortuaryLocation != null && expedientInfo.mortuaryLocation != ''){
                                                            mortuary2Text += ', ' + expedientInfo.mortuaryLocation
                                                        }
                                                    }

                                                    var styleMortuaryInfo2 = {
                                                        fontFamily: mortuary2InfoFontFamily,
                                                        fontSize: mortuary2InfoFontSize,
                                                        fontStyle: mortuary2InfoFontStyle,
                                                        fontVariant: 'normal',
                                                        textDecoration: 'empty string',
                                                        text: mortuary2Text,
                                                        align: mortuary2InfoAlign,
                                                        verticalAlign: 'top',
                                                        padding: 0,
                                                        lineHeight: mortuary2InfoLineHeight,
                                                        wrap: 'word',
                                                        ellipsis: false
                                                    }

                                                    setTimeout(() => {
                                                        drawText(optionsMortuaryInfo2, styleMortuaryInfo2)

                                                        // Bus info
                                                        switch(parseInt(obituaryModel)){
                                                            default:
                                                                var busX = 228
                                                                var busY = 706
                                                                var busWidth = 569
                                                                var busFontFamily = 'arial'
                                                                var busFontSize = 19
                                                                var busFontStyle = 'bold'
                                                                var busAlign = 'left'
                                                                var busLineHeight = 1.25
                                                                var fill = '#000000'
                                                            break
                                                        }

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

                                                            // Funeral info
                                                            switch(parseInt(obituaryModel)){
                                                                default:
                                                                    var funeralX = 467
                                                                    var funeralY = 729
                                                                    var funeralWidth = 318
                                                                    var funeralFontFamily = 'arial'
                                                                    var funeralFontSize = 19
                                                                    var funeralFontStyle = 'normal'
                                                                    var funeralAlign = 'left'
                                                                    var funeralLineHeight = 1.25
                                                                    var fill = '#000000'
                                                                break
                                                            }

                                                            var optionsFuneral = {
                                                                x: funeralX,
                                                                y: funeralY,
                                                                width: funeralWidth,
                                                                name: 'text',
                                                                id: 'funeral',
                                                                draggable: true,
                                                                fill: fill,
                                                                opacity: 1
                                                            }

                                                            var funeralText = obituary.funeral;
                                                                
                                                            var styleFuneral = {
                                                                fontFamily: funeralFontFamily,
                                                                fontSize: funeralFontSize,
                                                                fontStyle: funeralFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: funeralText,
                                                                align: funeralAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: funeralLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }

                                                            setTimeout(() => {
                                                                drawText(optionsFuneral, styleFuneral)

                                                                // location info
                                                                switch(parseInt(obituaryModel)){
                                                                    default:
                                                                        var locationX = 228
                                                                        var locationY = 735
                                                                        var locationWidth = 307
                                                                        var locationFontFamily = 'arial'
                                                                        var locationFontSize = 18
                                                                        var locationFontStyle = 'normal'
                                                                        var locationAlign = 'left'
                                                                        var locationLineHeight = 1.25
                                                                        var fill = '#000000'
                                                                    break
                                                                }

                                                                var optionsLocation = {
                                                                    x: locationX,
                                                                    y: locationY,
                                                                    width: locationWidth,
                                                                    name: 'text',
                                                                    id: 'location',
                                                                    draggable: true,
                                                                    fill: fill,
                                                                    opacity: 1
                                                                }

                                                                var locationText = obituary.location;
                                                                    
                                                                var styleLocation = {
                                                                    fontFamily: locationFontFamily,
                                                                    fontSize: locationFontSize,
                                                                    fontStyle: locationFontStyle,
                                                                    fontVariant: 'normal',
                                                                    textDecoration: 'empty string',
                                                                    text: locationText,
                                                                    align: locationAlign,
                                                                    verticalAlign: 'top',
                                                                    padding: 0,
                                                                    lineHeight: locationLineHeight,
                                                                    wrap: 'word',
                                                                    ellipsis: false
                                                                }

                                                                setTimeout(() => {
                                                                    drawText(optionsLocation, styleLocation)
                                                                                
                                                                    // Contact info
                                                                    switch(parseInt(obituaryModel)){
                                                                        default:
                                                                            var contactX = 814
                                                                            var contactY = 676
                                                                            var contactWidth = 278
                                                                            var contactFontFamily = 'arial'
                                                                            var contactFontSize = 13
                                                                            var contactFontStyle = 'normal'
                                                                            var contactAlign = 'center'
                                                                            var contactLineHeight = 1.25
                                                                            var fill = '#000000'
                                                                        break
                                                                    }

                                                                    var optionsContact = {
                                                                        x: contactX,
                                                                        y: contactY,
                                                                        width: contactWidth,
                                                                        name: 'text',
                                                                        id: 'contact',
                                                                        draggable: true,
                                                                        fill: fill,
                                                                        opacity: 1
                                                                    }

                                                                    var contactText = 
                                                                        'FUNERARIAS MARIÑA SL\n'+
                                                                        'TANATORIOS - CREMATORIO\n'+
                                                                        'Burela y Cervo\n'+
                                                                        'Tfnos.: 982 58 01 99 - 617 49 04 20\n'+
                                                                        'CONDOLENCIAS en www.funerariaburela.es'

                                                                    var styleContact = {
                                                                        fontFamily: contactFontFamily,
                                                                        fontSize: contactFontSize,
                                                                        fontStyle: contactFontStyle,
                                                                        fontVariant: 'normal',
                                                                        textDecoration: 'empty string',
                                                                        text: contactText,
                                                                        align: contactAlign,
                                                                        verticalAlign: 'top',
                                                                        padding: 0,
                                                                        lineHeight: contactLineHeight,
                                                                        wrap: 'word',
                                                                        ellipsis: false
                                                                    }

                                                                    setTimeout(() => {
                                                                        drawText(optionsContact, styleContact)

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
                                                                                    'quote',
                                                                                    'deceased',
                                                                                    'extraText',
                                                                                    'widow',
                                                                                    'died',
                                                                                    'dep',
                                                                                    'family',
                                                                                    'pray',
                                                                                    'mortuaryLabel',
                                                                                    'mortuaryInfo1',
                                                                                    'mortuaryInfo2',
                                                                                    'bus',
                                                                                    'funeral',
                                                                                    'location',
                                                                                    'contact',
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