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
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
                break
                case 1:
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
                break
                case 2:
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
                break
                case 3:
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
                break
                case 4:
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
                break;
                case 5:
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
                break
                case 6:
                    transeptX = 131.02512226651515
                    transeptY = 37.405042518242
                    transeptScaleX = 0.3067048604032566
                    transeptScaleY = 0.3067048604032567
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
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 1:
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 2:
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 3:
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 4:
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 5:
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
                            quoteFontFamily = 'arial'
                            quoteFontSize = 30
                            quoteFontStyle = 'bold'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                            fill = '#000000'
                        break
                        case 6:
                            quoteX = 252.6875
                            quoteY = 42
                            quoteWidth = 300
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


                var nameLogo = getNameLogo(obituaryType, obituaryModel)
                    
                // Logo
                var x = 80.03564988773016
                var y = 1037.6587643743242
                var scaleX = 0.30389881838594557
                var scaleY = 0.3038988183859456
        
                var optionsLogo = {
                    x: x,
                    y: y,
                    width: null,
                    height: null,
                    id: 'logo',
                    draggable: true,
                    name: 'image',
                    src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary-press/' + obituaryType + '/' + obituaryModel + '/img/' + nameLogo,
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
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
                            deceasedFontFamily = 'arial';
                            deceasedFontSize = 60
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 1:
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
                            deceasedFontFamily = 'arial';
                            deceasedFontSize = 60
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 2:
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
                            deceasedFontFamily = 'arial';
                            deceasedFontSize = 60
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 3:
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
                            deceasedFontFamily = 'arial';
                            deceasedFontSize = 60
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 4:
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
                            deceasedFontFamily = 'arial';
                            deceasedFontSize = 60
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 5:
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
                            deceasedFontFamily = 'arial';
                            deceasedFontSize = 60
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1.25
                            fill = "#000000"
                        break
                        case 6:
                            deceasedX = 18;
                            deceasedY = 84;
                            deceasedWidth = 758;
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
                        text: obituary.namePre + ' ' + obituary.name + '\n ' + obituary.surname,
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
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 30
                                extraTextFontStyle = 'bold'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 1:
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 30
                                extraTextFontStyle = 'bold'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 2:
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 30
                                extraTextFontStyle = 'bold'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 3:
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 30
                                extraTextFontStyle = 'bold'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 4:
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 30
                                extraTextFontStyle = 'bold'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 5:
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 30
                                extraTextFontStyle = 'bold'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 6:
                                extraTextX = 16
                                extraTextY = 233
                                extraTextWidth = 760
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
                            text: obituary.extraText == '' ? '' : '(' + obituary.extraText + ')',
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
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
                                    widowFontFamily = 'arial'
                                    widowFontSize = 21
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 1:
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
                                    widowFontFamily = 'arial'
                                    widowFontSize = 21
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 2:
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
                                    widowFontFamily = 'arial'
                                    widowFontSize = 21
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 3:
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
                                    widowFontFamily = 'arial'
                                    widowFontSize = 21
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 4:
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
                                    widowFontFamily = 'arial'
                                    widowFontSize = 21
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 5:
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
                                    widowFontFamily = 'arial'
                                    widowFontSize = 21
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 6:
                                    widowX = 26
                                    widowY = 275
                                    widowWidth = 745
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
                                text: obituary.deceasedMaritalStatus != null ? (obituary.deceasedMaritalStatus.toLowerCase() == 'viudo' ? '(' + obituary.spousePre + ' ' + obituary.spouseName + ')' : '') : '',
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
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
                                        diedFontFamily = 'arial'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 1:
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
                                        diedFontFamily = 'arial'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 2:
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
                                        diedFontFamily = 'arial'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = "#000000"
                                    break;
                                    case 3:
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
                                        diedFontFamily = 'arial'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = "#000000"
                                    break;
                                    case 4:
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
                                        diedFontFamily = 'arial'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 5:
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
                                        diedFontFamily = 'arial'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 6:
                                        diedX = 236
                                        diedY = 309
                                        diedWidth = 325
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
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
                                            fill = "#000000"
                                        break;
                                        case 1:
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
                                            fill = "#000000"
                                        break;
                                        case 2:
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 3:
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 4:
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 5:
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 6:
                                            depX = 14
                                            depY = 384
                                            depWidth = 762
                                            depFontFamily = 'arial'
                                            depFontSize = 30
                                            depFontStyle = 'bold italic'
                                            depAlign = 'center'
                                            depLineHeight = 1.25
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
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 1:
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 2:
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 3:
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 4:
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 5:
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = "#000000"
                                            break   
                                            case 6:
                                                familyX = 37.68
                                                familyY = 433
                                                familyWidth = 721
                                                familyHeight = 66
                                                familyFontFamily = 'arial'
                                                familyFontSize = 24
                                                familyFontStyle = 'bold'
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

                                        var family = '';

                                        if(obituary.deceasedMaritalStatus != null){
                                            if(obituary.deceasedMaritalStatus.toLowerCase() != 'viudo'){
                                                family += obituary.spouseName != '' ? obituary.spousePre + ' ' + obituary.spouseName + '; ' : ''
                                            }
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
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
                                                    prayLineHeight = 1.25
                                                    fill = "#000000"
                                                break
                                                case 1:
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
                                                    prayLineHeight = 1.25
                                                    fill = "#000000"
                                                break;
                                                case 2:
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
                                                    prayLineHeight = 1.25
                                                    fill = "#000000"
                                                break;
                                                case 3:
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
                                                    prayLineHeight = 1.25
                                                    fill = "#000000"
                                                break;
                                                case 4:
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
                                                    prayLineHeight = 1.25
                                                    fill = "#000000"
                                                break   
                                                case 5:
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
                                                    prayLineHeight = 1.25
                                                    fill = "#000000"
                                                break
                                                case 6:
                                                    prayX = 40
                                                    prayY = 608
                                                    prayWidth = 719
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 25
                                                    prayFontStyle = 'bold italic'
                                                    prayAlign = 'center'
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

                                                // Inhumation day
                                                switch(parseInt(obituaryModel)){
                                                    default:
                                                        var inhumationLabelX = 60
                                                        var inhumationLabelY = 664
                                                        var inhumationLabelWidth = 213
                                                        var inhumationLabelFontFamily = 'arial'
                                                        var inhumationLabelFontSize = 20
                                                        var inhumationLabelFontStyle = 'bold'
                                                        var inhumationLabelAlign = 'left'
                                                        var inhumationLabelLineHeight = 1.5
                                                        var fill = '#000000'
                                                    break
                                                }

                                                // Inhumation day
                                                var optionsInhumationLabel = {
                                                    x: inhumationLabelX,
                                                    y: inhumationLabelY,
                                                    width: inhumationLabelWidth,
                                                    name: 'text',
                                                    id: 'inhumationLabel',
                                                    draggable: true,
                                                    fill: fill,
                                                    opacity: 1
                                                }

                                                var styleInhumationLabel = {
                                                    fontFamily: inhumationLabelFontFamily,
                                                    fontSize: inhumationLabelFontSize,
                                                    fontStyle: inhumationLabelFontStyle,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'underline',
                                                    text: 'DÍA DEL ENTIERRO:',
                                                    align: inhumationLabelAlign,
                                                    verticalAlign: 'top',
                                                    padding: 0,
                                                    lineHeight: inhumationLabelLineHeight,
                                                    wrap: 'word',
                                                    ellipsis: false
                                                }

                                                setTimeout(() => {
                                                    drawText(optionsInhumationLabel, styleInhumationLabel)

                                                    // Inhumation info
                                                    switch(parseInt(obituaryModel)){
                                                        default:
                                                            var inhumationInfoX = 262
                                                            var inhumationInfoY = 664
                                                            var inhumationInfoWidth = 488
                                                            var inhumationInfoFontFamily = 'arial'
                                                            var inhumationInfoFontSize = 20
                                                            var inhumationInfoFontStyle = 'normal'
                                                            var inhumationInfoAlign = 'left'
                                                            var inhumationInfoLineHeight = 1.5
                                                            var fill = '#000000'
                                                        break
                                                    }

                                                    // Inhumation label
                                                    var optionsInhumationInfo = {
                                                        x: inhumationInfoX,
                                                        y: inhumationInfoY,
                                                        width: inhumationInfoWidth,
                                                        name: 'text',
                                                        id: 'inhumationInfo',
                                                        draggable: true,
                                                        fill: fill,
                                                        opacity: 1
                                                    }

                                                    var inhumationText = '';
                                                    if(expedientInfo.funeralDateBurial != null && expedientInfo.funeralDateBurial != ''){
                                                        var funeralDateAux = moment(expedientInfo.funeralDateBurial);
                                                        inhumationText = `${funeralDateAux.format('dddd').toUpperCase()}, DÍA ${funeralDateAux.format('D')} DE ${funeralDateAux.format('MMMM').toUpperCase()}`;
                                                    }

                                                    var styleInhumationInfo = {
                                                        fontFamily: inhumationInfoFontFamily,
                                                        fontSize: inhumationInfoFontSize,
                                                        fontStyle: inhumationInfoFontStyle,
                                                        fontVariant: 'normal',
                                                        textDecoration: 'empty string',
                                                        text: inhumationText,
                                                        align: inhumationInfoAlign,
                                                        verticalAlign: 'top',
                                                        padding: 0,
                                                        lineHeight: inhumationInfoLineHeight,
                                                        wrap: 'word',
                                                        ellipsis: false
                                                    }

                                                    setTimeout(() => {
                                                        drawText(optionsInhumationInfo, styleInhumationInfo)

                                                        // mortuary label
                                                        switch(parseInt(obituaryModel)){
                                                            default:
                                                                var MortuaryHourLabelX = 60
                                                                var MortuaryHourLabelY = 710
                                                                var MortuaryHourLabelWidth = 293 
                                                                var MortuaryHourLabelFontFamily = 'arial'
                                                                var MortuaryHourLabelFontSize = 20
                                                                var MortuaryHourLabelFontStyle = 'bold'
                                                                var MortuaryHourLabelAlign = 'left'
                                                                var MortuaryHourLabelLineHeight = 1.5
                                                                var fill = '#000000'
                                                            break
                                                        }

                                                        var optionsMortuaryHourLabel = {
                                                            x: MortuaryHourLabelX,
                                                            y: MortuaryHourLabelY,
                                                            width: MortuaryHourLabelWidth,
                                                            name: 'text',
                                                            id: 'mortuaryHourLabel',
                                                            draggable: true,
                                                            fill: fill,
                                                            opacity: 1
                                                        }

                                                        var styleMortuaryHourLabel = {
                                                            fontFamily: MortuaryHourLabelFontFamily,
                                                            fontSize: MortuaryHourLabelFontSize,
                                                            fontStyle: MortuaryHourLabelFontStyle,
                                                            fontVariant: 'normal',
                                                            textDecoration: 'underline',
                                                            text: 'HORA SALIDA TANATORIO:',
                                                            align: MortuaryHourLabelAlign,
                                                            verticalAlign: 'top',
                                                            padding: 0,
                                                            lineHeight: MortuaryHourLabelLineHeight,
                                                            wrap: 'word',
                                                            ellipsis: false
                                                        }

                                                        setTimeout(() => {
                                                            drawText(optionsMortuaryHourLabel, styleMortuaryHourLabel)

                                                            // Mortuary hour info
                                                            switch(parseInt(obituaryModel)){
                                                                default:
                                                                    var MortuaryHourInfoX = 328
                                                                    var MortuaryHourInfoY = 710
                                                                    var MortuaryHourInfoWidth = 443
                                                                    var MortuaryHourInfoFontFamily = 'arial'
                                                                    var MortuaryHourInfoFontSize = 20
                                                                    var MortuaryHourInfoFontStyle = 'normal'
                                                                    var MortuaryHourInfoAlign = 'left'
                                                                    var MortuaryHourInfoLineHeight = 1.5
                                                                    var fill = '#000000'
                                                                break
                                                            }

                                                            var optionsMortuaryHourInfo = {
                                                                x: MortuaryHourInfoX,
                                                                y: MortuaryHourInfoY,
                                                                width: MortuaryHourInfoWidth,
                                                                name: 'text',
                                                                id: 'mortuaryHourInfo',
                                                                draggable: true,
                                                                fill: fill,
                                                                opacity: 1
                                                            }

                                                            var mortuaryInfoText = '';
                                                            if(expedientInfo.funeralTime != null && expedientInfo.funeralTime != ''){
                                                                mortuaryInfoText = horaEnPalabras(expedientInfo.funeralTime)
                                                            }

                                                            var styleMortuaryHourInfo = {
                                                                fontFamily: MortuaryHourInfoFontFamily,
                                                                fontSize: MortuaryHourInfoFontSize,
                                                                fontStyle: MortuaryHourInfoFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: mortuaryInfoText,
                                                                align: MortuaryHourInfoAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: MortuaryHourInfoLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }

                                                            setTimeout(() => {
                                                                drawText(optionsMortuaryHourInfo, styleMortuaryHourInfo)

                                                                // Funeral label
                                                                switch(parseInt(obituaryModel)){
                                                                    default:
                                                                        var FuneralLabelX = 60
                                                                        var FuneralLabelY = 756
                                                                        var FuneralLabelWidth = 128
                                                                        var FuneralLabelFontFamily = 'arial'
                                                                        var FuneralLabelFontSize = 20
                                                                        var FuneralLabelFontStyle = 'bold'
                                                                        var FuneralLabelAlign = 'left'
                                                                        var FuneralLabelLineHeight = 1.5
                                                                        var fill = '#000000'
                                                                    break
                                                                }
    
                                                                var optionsFuneralLabel = {
                                                                    x: FuneralLabelX,
                                                                    y: FuneralLabelY,
                                                                    width: FuneralLabelWidth,
                                                                    name: 'text',
                                                                    id: 'funeralLabel',
                                                                    draggable: true,
                                                                    fill: fill,
                                                                    opacity: 1
                                                                }
    
                                                                var styleFuneralLabel = {
                                                                    fontFamily: FuneralLabelFontFamily,
                                                                    fontSize: FuneralLabelFontSize,
                                                                    fontStyle: FuneralLabelFontStyle,
                                                                    fontVariant: 'normal',
                                                                    textDecoration: 'underline',
                                                                    text: 'FUNERAL:',
                                                                    align: FuneralLabelAlign,
                                                                    verticalAlign: 'top',
                                                                    padding: 0,
                                                                    lineHeight: FuneralLabelLineHeight,
                                                                    wrap: 'word',
                                                                    ellipsis: false
                                                                }

                                                                setTimeout(() => {
                                                                    drawText(optionsFuneralLabel, styleFuneralLabel)

                                                                    // Funeral info
                                                                    switch(parseInt(obituaryModel)){
                                                                        default:
                                                                            var FuneralInfoX = 165
                                                                            var FuneralInfoY = 756
                                                                            var FuneralInfoWidth = 570 
                                                                            var FuneralInfoFontFamily = 'arial'
                                                                            var FuneralInfoFontSize = 20
                                                                            var FuneralInfoFontStyle = 'normal'
                                                                            var FuneralInfoAlign = 'left'
                                                                            var FuneralInfoLineHeight = 1.5
                                                                            var fill = '#000000'
                                                                        break
                                                                    }
        
                                                                    var optionsFuneralInfo = {
                                                                        x: FuneralInfoX,
                                                                        y: FuneralInfoY,
                                                                        width: FuneralInfoWidth,
                                                                        name: 'text',
                                                                        id: 'funeralInfo',
                                                                        draggable: true,
                                                                        fill: fill,
                                                                        opacity: 1
                                                                    }

                                                                    var funeralInfoText = '';
                                                                    if(expedientInfo.ceremonyTime != null && expedientInfo.ceremonyTime != ''){
                                                                        funeralInfoText = horaEnPalabras(expedientInfo.ceremonyTime)
                                                                    }
        
                                                                    var styleFuneralInfo = {
                                                                        fontFamily: FuneralInfoFontFamily,
                                                                        fontSize: FuneralInfoFontSize,
                                                                        fontStyle: FuneralInfoFontStyle,
                                                                        fontVariant: 'normal',
                                                                        textDecoration: 'empty string',
                                                                        text: funeralInfoText,
                                                                        align: FuneralInfoAlign,
                                                                        verticalAlign: 'top',
                                                                        padding: 0,
                                                                        lineHeight: FuneralInfoLineHeight,
                                                                        wrap: 'word',
                                                                        ellipsis: false
                                                                    }

                                                                    setTimeout(() => {
                                                                        drawText(optionsFuneralInfo, styleFuneralInfo)

                                                                        // Church and cemetery info
                                                                        switch(parseInt(obituaryModel)){
                                                                            default:
                                                                                var ChurchLabelX = 60
                                                                                var ChurchLabelY = 802
                                                                                var ChurchLabelWidth = 266
                                                                                var ChurchLabelFontFamily = 'arial'
                                                                                var ChurchLabelFontSize = 20
                                                                                var ChurchLabelFontStyle = 'bold'
                                                                                var ChurchLabelAlign = 'left'
                                                                                var ChurchLabelLineHeight = 1.5
                                                                                var fill = '#000000'
                                                                            break
                                                                        }
            
                                                                        var optionsChurchLabel = {
                                                                            x: ChurchLabelX,
                                                                            y: ChurchLabelY,
                                                                            width: ChurchLabelWidth,
                                                                            name: 'text',
                                                                            id: 'churchLabel',
                                                                            draggable: true,
                                                                            fill: fill,
                                                                            opacity: 1
                                                                        }

                                                                        var churchLabelText = 'IGLESIA Y ' + (expedientInfo.cemeteryLabel != null ? expedientInfo.cemeteryLabel.toUpperCase() : '') + ':';

                                                                        var styleChurchLabel = {
                                                                            fontFamily: ChurchLabelFontFamily,
                                                                            fontSize: ChurchLabelFontSize,
                                                                            fontStyle: ChurchLabelFontStyle,
                                                                            fontVariant: 'normal',
                                                                            textDecoration: 'underline',
                                                                            text: churchLabelText,
                                                                            align: ChurchLabelAlign,
                                                                            verticalAlign: 'top',
                                                                            padding: 0,
                                                                            lineHeight: ChurchLabelLineHeight,
                                                                            wrap: 'word',
                                                                            ellipsis: false
                                                                        }

                                                                        setTimeout(() => {
                                                                            drawText(optionsChurchLabel, styleChurchLabel)

                                                                            // Church and cemetery info
                                                                            switch(parseInt(obituaryModel)){
                                                                                default:
                                                                                    var ChurchInfoX = 312
                                                                                    var ChurchInfoY = 802
                                                                                    var ChurchInfoWidth = 440
                                                                                    var ChurchInfoFontFamily = 'arial'
                                                                                    var ChurchInfoFontSize = 20
                                                                                    var ChurchInfoFontStyle = 'normal'
                                                                                    var ChurchInfoAlign = 'left'
                                                                                    var ChurchInfoLineHeight = 1.5
                                                                                    var fill = '#000000'
                                                                                break
                                                                            }
                
                                                                            var optionsChurchInfo = {
                                                                                x: ChurchInfoX,
                                                                                y: ChurchInfoY,
                                                                                width: ChurchInfoWidth,
                                                                                name: 'text',
                                                                                id: 'churchInfo',
                                                                                draggable: true,
                                                                                fill: fill,
                                                                                opacity: 1
                                                                            }

                                                                            var churchInfoText = '';
                                                                            if(
                                                                                (expedientInfo.churchName != null && expedientInfo.churchName != '') ||
                                                                                (expedientInfo.cemeteryName != null && expedientInfo.cemeteryName != '')
                                                                            ){
                                                                                if(expedientInfo.churchName == expedientInfo.cemeteryName){
                                                                                    churchInfoText = 'PARROQUIALES DE ' + expedientInfo.churchName.toUpperCase();
                                                                                }else{
                                                                                    if(expedientInfo.churchName != null && expedientInfo.churchName != ''){
                                                                                        churchInfoText += expedientInfo.churchName.toUpperCase();
                                                                                    }
                                                                                    if(expedientInfo.cemeteryName != null && expedientInfo.cemeteryName != ''){
                                                                                        churchInfoText += ' CEMENTERIO DE ' + expedientInfo.cemeteryName.toUpperCase();
                                                                                    }
                                                                                }
                                                                            }

                                                                            var styleChurchInfo = {
                                                                                fontFamily: ChurchInfoFontFamily,
                                                                                fontSize: ChurchInfoFontSize,
                                                                                fontStyle: ChurchInfoFontStyle,
                                                                                fontVariant: 'normal',
                                                                                textDecoration: 'empty string',
                                                                                text: churchInfoText,
                                                                                align: ChurchInfoAlign,
                                                                                verticalAlign: 'top',
                                                                                padding: 0,
                                                                                lineHeight: ChurchInfoLineHeight,
                                                                                wrap: 'word',
                                                                                ellipsis: false
                                                                            }
                                                                            
                                                                            setTimeout(() => {
                                                                                drawText(optionsChurchInfo, styleChurchInfo)
                                                                                
                                                                                // Velation label
                                                                                switch(parseInt(obituaryModel)){
                                                                                    default:
                                                                                        var VelationLabelX = 60
                                                                                        var VelationLabelY = 878
                                                                                        var VelationLabelWidth = 138
                                                                                        var VelationLabelFontFamily = 'arial'
                                                                                        var VelationLabelFontSize = 20
                                                                                        var VelationLabelFontStyle = 'bold'
                                                                                        var VelationLabelAlign = 'left'
                                                                                        var VelationLabelLineHeight = 1.5
                                                                                        var fill = '#000000'
                                                                                    break
                                                                                }
                    
                                                                                var optionsVelationLabel = {
                                                                                    x: VelationLabelX,
                                                                                    y: VelationLabelY,
                                                                                    width: VelationLabelWidth,
                                                                                    name: 'text',
                                                                                    id: 'velationLabel',
                                                                                    draggable: true,
                                                                                    fill: fill,
                                                                                    opacity: 1
                                                                                }

                                                                                var styleVelationLabel = {
                                                                                    fontFamily: VelationLabelFontFamily,
                                                                                    fontSize: VelationLabelFontSize,
                                                                                    fontStyle: VelationLabelFontStyle,
                                                                                    fontVariant: 'normal',
                                                                                    textDecoration: 'underline',
                                                                                    text: 'VELATORIO:',
                                                                                    align: VelationLabelAlign,
                                                                                    verticalAlign: 'top',
                                                                                    padding: 0,
                                                                                    lineHeight: VelationLabelLineHeight,
                                                                                    wrap: 'word',
                                                                                    ellipsis: false
                                                                                }

                                                                                setTimeout(() => {
                                                                                    drawText(optionsVelationLabel, styleVelationLabel)

                                                                                    // Velation info
                                                                                    switch(parseInt(obituaryModel)){
                                                                                        default:
                                                                                            var VelationInfoX = 190
                                                                                            var VelationInfoY = 878
                                                                                            var VelationInfoWidth = 572
                                                                                            var VelationInfoFontFamily = 'arial'
                                                                                            var VelationInfoFontSize = 20
                                                                                            var VelationInfoFontStyle = 'normal'
                                                                                            var VelationInfoAlign = 'left'
                                                                                            var VelationInfoLineHeight = 1.5
                                                                                            var fill = '#000000'
                                                                                        break
                                                                                    }
                        
                                                                                    var optionsVelationInfo = {
                                                                                        x: VelationInfoX,
                                                                                        y: VelationInfoY,
                                                                                        width: VelationInfoWidth,
                                                                                        name: 'text',
                                                                                        id: 'velationInfo',
                                                                                        draggable: true,
                                                                                        fill: fill,
                                                                                        opacity: 1
                                                                                    }

                                                                                    var velationText = obituary.mortuary.toUpperCase() + ' - SALA ' + obituary.roomNumber

                                                                                    var styleVelationInfo = {
                                                                                        fontFamily: VelationInfoFontFamily,
                                                                                        fontSize: VelationInfoFontSize,
                                                                                        fontStyle: VelationInfoFontStyle,
                                                                                        fontVariant: 'normal',
                                                                                        textDecoration: 'empty string',
                                                                                        text: velationText,
                                                                                        align: VelationInfoAlign,
                                                                                        verticalAlign: 'top',
                                                                                        padding: 0,
                                                                                        lineHeight: VelationInfoLineHeight,
                                                                                        wrap: 'word',
                                                                                        ellipsis: false
                                                                                    }

                                                                                    setTimeout(() => {
                                                                                        drawText(optionsVelationInfo, styleVelationInfo)

                                                                                        // Contact info
                                                                                        switch(parseInt(obituaryModel)){
                                                                                            default:
                                                                                                var contactX = 422
                                                                                                var contactY = 1044
                                                                                                var contactWidth = 327
                                                                                                var contactFontFamily = 'arial'
                                                                                                var contactFontSize = 15
                                                                                                var contactFontStyle = 'normal'
                                                                                                var contactAlign = 'right'
                                                                                                var contactLineHeight = 1.5
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
                                                                                            'www.cardelle.es\n'+
                                                                                            'info@cardelle.es\n'+
                                                                                            'Telf. 663431631 - 630450930 - 659999559'

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


                                                                                            switch(parseInt(obituaryModel)){
                                                                                                case 0:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
                                                                                                    var align = 'left';
                                                                                                break;
                                                                                                case 1:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
                                                                                                    var align = 'left';
                                                                                                break;
                                                                                                case 2:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
                                                                                                    var align = 'left';
                                                                                                break;
                                                                                                case 3:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
                                                                                                    var align = 'left';
                                                                                                break;
                                                                                                case 4:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
                                                                                                    var align = 'left';
                                                                                                break;
                                                                                                case 5:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
                                                                                                    var align = 'left';
                                                                                                break;
                                                                                                case 6:
                                                                                                    var x = 46
                                                                                                    var y = 965
                                                                                                    var text = 'En ' + obituary.location + ', ' +moment().format('DD') + ' de '  + moment().format('MMMM') + ' de ' + moment().format('YYYY') 
                                                                                                    var fontSize = 22
                                                                                                    var fontStyle = 'bold'
                                                                                                    var fontFamily = 'arial'
                                                                                                    var fill = '#000000'
                                                                                                    var width = 480
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
                                                                                                // Draw Mortuary
                                                                                                drawText(optionsMortuary, styleMortuary)

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
                                                                                                                'quote',
                                                                                                                'logo',
                                                                                                                'deceased',
                                                                                                                'extraText',
                                                                                                                'widow',
                                                                                                                'died',
                                                                                                                'dep',
                                                                                                                'family',
                                                                                                                'pray',
                                                                                                                'inhumationLabel',
                                                                                                                'inhumationInfo',
                                                                                                                'mortuaryHourLabel',
                                                                                                                'mortuaryHourInfo',
                                                                                                                'funeralLabel',
                                                                                                                'funeralInfo',
                                                                                                                'churchLabel',
                                                                                                                'churchInfo',
                                                                                                                'velationLabel',
                                                                                                                'velationInfo',
                                                                                                                'mortuary',
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
                            }, 150)
                        }, 150)
                    }, 150)
                }, 150)
                }, 150)
               
            }, 150)
        }, 150)
    }
})

function horaEnPalabras(hora) {
  const m = moment(hora, 'HH:mm:ss');

  let h = m.hour();
  const min = m.minute();

  // Determinar tramo del día
  const tramo = h >= 12 ? 'DE LA TARDE' : 'DE LA MAÑANA';

  // Convertir a formato 12h para nombrarlo
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;

  const nombres = {
    1: 'UNA',
    2: 'DOS',
    3: 'TRES',
    4: 'CUATRO',
    5: 'CINCO',
    6: 'SEIS',
    7: 'SIETE',
    8: 'OCHO',
    9: 'NUEVE',
    10: 'DIEZ',
    11: 'ONCE',
    12: 'DOCE'
  };

  // Minutos especiales
  if (min === 0) return `${nombres[h12]} EN PUNTO ${tramo}`;
  if (min === 15) return `${nombres[h12]} Y CUARTO ${tramo}`;
  if (min === 30) return `${nombres[h12]} Y MEDIA ${tramo}`;
  if (min === 45) {
    const siguiente = nombres[(h12 % 12) + 1];
    return `${siguiente} MENOS CUARTO ${tramo}`;
  }

  // Cualquier otro minuto
  return `${nombres[h12]} Y ${min} ${tramo}`;
}