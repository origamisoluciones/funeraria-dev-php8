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
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
                break
                case 1:
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
                break
                case 2:
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
                break
                case 3:
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
                break
                case 4:
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
                break;
                case 5:
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
                break
                case 6:
                    transeptX = 60.48111509729807
                    transeptY = 59
                    transeptScaleX = 0.16167137970364923
                    transeptScaleY = 0.1013542899362436
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

                // Draw rectagles
                var backgroundBorders1 = {
                    x: 18.488551702538132,
                    y: 17.08860028423635,
                    width: 760,
                    height: 1093,
                    name: 'figure',
                    id: 'addFigure0',
                    draggable: false,
                    fill: '#FFFFFF',
                    stroke: '#092a59',
                    strokeWidth: 5,
                    opacity: 1,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1
                }
                drawRectangle(backgroundBorders1)

                setTimeout(() => {
                    
                    // Draw footer line
                    var footerLine = {
                        x: 79.37697322784908,
                        y: 947.4107360839844,
                        points: [0, 0, 638, 0],
                        name: 'figure',
                        id: 'addFigure1',
                        draggable: false,
                        stroke: '#092a59',
                        strokeWidth: 4,
                        lineCap: 'square',
                        lineJoin: 'square',
                        opacity: 1,
                        rotation: null,
                        scaleX: 1,
                        scaleY: 1
                    }

                    drawLine(footerLine)

                    setTimeout(() => {

                        var nameLogo = getNameLogo(obituaryType, obituaryModel)

                        // Logo
                        var scaleX = 0.9203192679952439
                        var scaleY = 0.8664347528632049
                        var x = 200
                        var y = 980.691561383084
                
                        var optionsLogo = {
                            x: x,
                            y: y,
                            width: null,
                            height: null,
                            id: 'logo',
                            draggable: false,
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

                            var footerX = 17.359375;
                            var footerY = 1080;
                            var footerWidth = 758.640625;
                            var footerFontFamily = 'times new roman';
                            var footerFontSize = 24;
                            var footerFontStyle = 'bold';
                            var footerAlign = 'center';
                            var footerLineHeight = 1;
                            var footerFill = '#092a59';

                            var footerPhoneOptions = {
                                x: footerX,
                                y: footerY,
                                width: footerWidth,
                                name: 'text',
                                id: 'footerphone',
                                draggable: true,
                                fill: footerFill,
                                opacity: 1
                            }

                            var footerPhoneStyle = {
                                fontFamily: footerFontFamily,
                                fontSize: footerFontSize,
                                fontStyle: footerFontStyle,
                                fontVariant: 'normal',
                                textDecoration: 'empty string',
                                text: '920251854 - 915410041',
                                align: footerAlign,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: footerLineHeight,
                                wrap: 'word',
                                ellipsis: false
                            }
                            drawText(footerPhoneOptions, footerPhoneStyle)

                            setTimeout(() => {
                                var mortuaryName = 'Capilla instalada en ' + (obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary);
                                mortuaryName += '\n' + obituary.location;
                                switch(parseInt(obituaryModel)){
                                    case 0:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
                                        var align = 'left';
                                    break;
                                    case 1:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
                                        var align = 'left';
                                    break;
                                    case 2:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
                                        var align = 'left';
                                    break;
                                    case 3:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
                                        var align = 'left';
                                    break;
                                    case 4:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
                                        var align = 'left';
                                    break;
                                    case 5:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
                                        var align = 'left';
                                    break;
                                    case 6:
                                        var x = 76.359375
                                        var y = 802
                                        var text = mortuaryName;
                                        var fontSize = 22
                                        var fontStyle = 'normal'
                                        var fontFamily = 'times new roman'
                                        var fill = "#092a59"
                                        var width = 645.630625
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
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
                                        break
                                        case 1:
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
                                        break
                                        case 2:
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
                                        break
                                        case 3:
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
                                        break
                                        case 4:
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
                                        break
                                        case 5:
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
                                        break
                                        case 6:
                                            quoteX = 25.36
                                            quoteY = 262
                                            quoteWidth = 744.64
                                            quoteFontFamily = 'arial'
                                            quoteFontSize = 23
                                            quoteFontStyle = 'normal'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText
                                            fill = "#000000"
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
                                                deceasedX = 223.359375;
                                                deceasedY = 84;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
                                            break
                                            case 1:
                                                deceasedX = 221.359375;
                                                deceasedY = 77;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
                                            break
                                            case 2:
                                                deceasedX = 221.359375;
                                                deceasedY = 77;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
                                            break
                                            case 3:
                                                deceasedX = 221.359375;
                                                deceasedY = 77;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
                                            break
                                            case 4:
                                                deceasedX = 221.359375;
                                                deceasedY = 77;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
                                            break
                                            case 5:
                                                deceasedX = 221.359375;
                                                deceasedY = 77;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
                                            break
                                            case 6:
                                                deceasedX = 221.359375;
                                                deceasedY = 77;
                                                deceasedWidth = 359.640625;
                                                deceasedFontFamily = 'times new roman italic';
                                                deceasedFontSize = 35
                                                deceasedFontStyle = 'bold'
                                                deceasedAlign = 'center'
                                                deceasedLineHeight = 1.25
                                                fill = "#092a59"
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
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
                                                break
                                                case 1:
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
                                                break
                                                case 2:
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
                                                break
                                                case 3:
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
                                                break
                                                case 4:
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
                                                break
                                                case 5:
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
                                                break
                                                case 6:
                                                    extraTextX = 297.359375
                                                    extraTextY = 59
                                                    extraTextWidth = 206.640625
                                                    extraTextFontFamily = 'times new roman italic'
                                                    extraTextFontSize = 23
                                                    extraTextFontStyle = 'normal'
                                                    extraTextAlign = 'center'
                                                    extraTextLineHeight = 1
                                                    fill = "#092a59"
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
                                                text: obituary.namePre == 'DON' ? 'EL SEÑOR' : 'LA SEÑORA',
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
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 20
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
                                                        fill = "#000000"
                                                    break
                                                    case 1:
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 26
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
                                                        fill = "#000000"
                                                    break
                                                    case 2:
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 26
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
                                                        fill = "#000000"
                                                    break
                                                    case 3:
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 26
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
                                                        fill = "#000000"
                                                    break
                                                    case 4:
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 26
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
                                                        fill = "#000000"
                                                    break
                                                    case 5:
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 26
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
                                                        fill = "#000000"
                                                    break
                                                    case 6:
                                                        widowX = 26.36
                                                        widowY = 345
                                                        widowWidth = 742.64
                                                        widowFontFamily = 'arial'
                                                        widowFontSize = 26
                                                        widowFontStyle = 'normal'
                                                        widowAlign = 'center'
                                                        widowLineHeight = 1
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
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
                                                        break
                                                        case 1:
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
                                                        break
                                                        case 2:
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
                                                        break;
                                                        case 3:
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
                                                        break;
                                                        case 4:
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
                                                        break
                                                        case 5:
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
                                                        break
                                                        case 6:
                                                            diedX = 245.35937
                                                            diedY = 189
                                                            diedWidth = 314.640625
                                                            diedFontFamily = 'times new roman'
                                                            diedFontSize = 24
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = "#092a59"
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

                                                    var diedText = obituary.died.replace(',', '\n').replace(',', '\n').replace(',', '\n');
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
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
                                                            break;
                                                            case 1:
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
                                                            break;
                                                            case 2:
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
                                                            break
                                                            case 3:
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
                                                            break
                                                            case 4:
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
                                                            break
                                                            case 5:
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
                                                            break
                                                            case 6:
                                                                depX = 74.359375
                                                                depY = 496
                                                                depWidth = 661.640625
                                                                depFontFamily = 'times new roman'
                                                                depFontSize = 30
                                                                depFontStyle = 'normal'
                                                                depAlign = 'center'
                                                                depLineHeight = 1
                                                                fill = "#092a59"
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
                                                            text: 'Ruegan una oración por su alma',
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
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
                                                                break
                                                                case 1:
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
                                                                break
                                                                case 2:
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
                                                                break
                                                                case 3:
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
                                                                break
                                                                case 4:
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
                                                                break
                                                                case 5:
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
                                                                break   
                                                                case 6:
                                                                    familyX = 76.359375
                                                                    familyY = 330.34375
                                                                    familyWidth = 657.630625
                                                                    familyHeight = 133.65625
                                                                    familyFontFamily = 'times new roman'
                                                                    familyFontSize = 30
                                                                    familyFontStyle = 'normal'
                                                                    familyAlign = 'justify'
                                                                    familyLineHeight = 1
                                                                    fill = "#092a59"
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
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
                                                                    break
                                                                    case 1:
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
                                                                    break;
                                                                    case 2:
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
                                                                    break;
                                                                    case 3:
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
                                                                    break;
                                                                    case 4:
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
                                                                    break   
                                                                    case 5:
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
                                                                    break
                                                                    case 6:
                                                                        prayX = 73.359375
                                                                        prayY = 565.09375
                                                                        prayWidth = 659.630625
                                                                        prayFontFamily = 'times new roman'
                                                                        prayFontSize = 26
                                                                        prayFontStyle = 'normal'
                                                                        prayAlign = 'left'
                                                                        prayLineHeight = 1.25
                                                                        fill = "#092a59"
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

                                                                    setTimeout(() => {
                                                                        stage.find('#background')[0].zIndex(0)
                                                                        stage.find('#addFigure0')[0].zIndex(1)
                                                                        
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
                                                                                    'footerphone',
                                                                                    'mortuary',
                                                                                    'quote',
                                                                                    'deceased',
                                                                                    'extraText',
                                                                                    'widow',
                                                                                    'died',
                                                                                    'dep',
                                                                                    'family',
                                                                                    'pray',
                                                                                ]

                                                                                var i = 2
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