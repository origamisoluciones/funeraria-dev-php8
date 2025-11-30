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
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
                break
                case 1:
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
                break
                case 2:
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
                break
                case 3:
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
                break
                case 4:
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
                break;
                case 5:
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
                break
                case 6:
                    transeptX = 530.0974224873036
                    transeptY = 29.340000000000003
                    transeptScaleX = 0.23
                    transeptScaleY = 0.233
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

                var footerImageX = 0;
                var footerImageY  = 0;
                var footerImageScaleX  = 0;
                var footerImageScaleY  = 0;
                switch(parseInt(obituaryModel)){
                    case 0:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break
                    case 1:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break
                    case 2:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break
                    case 3:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break
                    case 4:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break;
                    case 5:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break
                    case 6:
                        footerImageX = 40.78125
                        footerImageY = 665.6841485732162
                        footerImageScaleX = 0.32566697332106714
                        footerImageScaleY = 0.3313773804375277
                    break
                }
        
                var optionsFooterImage = {
                    x: footerImageX,
                    y: footerImageY,
                    width: null,
                    height: null,
                    id: 'footerImage',
                    draggable: false,
                    name: 'image',
                    src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/footer.png',
                    mouse: true,
                    rotation: null,
                    scaleX: footerImageScaleX,
                    scaleY: footerImageScaleY,
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
        
                drawImage(optionsFooterImage, expedientID, obituaryType, obituaryModel)
                
                setTimeout(() => {
    
                    // Draw rectagles
                    var backgroundBorders1 = {
                        x: 16,
                        y: 15.61,
                        width: 1095,
                        height: 765,
                        name: 'figure',
                        id: 'addFigure0',
                        draggable: false,
                        fill: '#FFFFFF',
                        stroke: '#000000',
                        strokeWidth: 10,
                        opacity: 1,
                        rotation: 0,
                        scaleX: 1,
                        scaleY: 1
                    }
                    drawRectangle(backgroundBorders1)

                    setTimeout(() => {
                        
                        // Draw footer line
                        var footerLine = {
                            x: 56.074022010765134,
                            y: 654.61,
                            points: [0, 0, 500, 0],
                            name: 'figure',
                            id: 'addFigure1',
                            draggable: true,
                            stroke: '#000000',
                            strokeWidth: 10,
                            lineCap: 'square',
                            lineJoin: 'square',
                            opacity: 1,
                            rotation: null,
                            scaleX: 2.0311034217608612,
                            scaleY: 1
                        }

                        drawLine(footerLine)

                        setTimeout(() => {
                        
                            var mortuaryInfo = 'CASA DOLIENTE: ' + obituary.mortuary;
                            if(obituary.roomNumber != null && obituary.roomNumber != ''){
                                mortuaryInfo += ', Sala ' + obituary.roomNumber; 
                            }
                            
                            switch(parseInt(obituaryModel)){
                                case 0:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
                                    var align = 'left';
                                break;
                                case 1:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
                                    var align = 'left';
                                break;
                                case 2:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
                                    var align = 'left';
                                break;
                                case 3:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
                                    var align = 'left';
                                break;
                                case 4:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
                                    var align = 'left';
                                break;
                                case 5:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
                                    var align = 'left';
                                break;
                                case 6:
                                    var x = 45.7812
                                    var y = 577
                                    var text = mortuaryInfo
                                    var fontSize = 20
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 1038.8487499999999
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
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 1:
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 2:
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 3:
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 4:
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 5:
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 6:
                                        deceasedX = 46.78125
                                        deceasedY = 150.4375
                                        deceasedWidth = 1035.21
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 60
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
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
                                    text: (obituary.namePre + ' ' + obituary.name + '\n' + obituary.surname).toUpperCase(),
                                    align: deceasedAlign,
                                    verticalAlign: 'top',
                                    padding: 0,
                                    lineHeight: deceasedLineHeight,
                                    wrap: 'word',
                                    ellipsis: false
                                }

                                setTimeout(() => {
                                    drawText(optionsDeceased, styleDeceased)

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
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 25
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 1:
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
                                            depFontFamily = 'garamond'
                                            depFontSize = 28
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#00305c'
                                        break;
                                        case 2:
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
                                            depFontFamily = 'garamond'
                                            depFontSize = 28
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#00305c'
                                        break
                                        case 3:
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
                                            depFontFamily = 'garamond'
                                            depFontSize = 28
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#00305c'
                                        break
                                        case 4:
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
                                            depFontFamily = 'garamond'
                                            depFontSize = 26
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#00305c'
                                        break
                                        case 5:
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
                                            depFontFamily = 'garamond'
                                            depFontSize = 28
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#00305c'
                                        break
                                        case 6:
                                            depX = 21.78125
                                            depY = 350
                                            depWidth = 1085.21875
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
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
                                                    quoteAlign = 'center'
                                                    quoteLineHeight = 1
                                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
                                                    quoteAlign = 'center'
                                                    quoteLineHeight = 1
                                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                                    fill = '#000000'
                                                break
                                                case 2:
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
                                                    quoteAlign = 'center'
                                                    quoteLineHeight = 1
                                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
                                                    quoteAlign = 'center'
                                                    quoteLineHeight = 1
                                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                                    fill = '#000000'
                                                break
                                                case 4:
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
                                                    quoteAlign = 'center'
                                                    quoteLineHeight = 1
                                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                                    fill = '#000000'
                                                break
                                                case 5:
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
                                                    quoteAlign = 'center'
                                                    quoteLineHeight = 1
                                                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                                    fill = '#000000'
                                                break
                                                case 6:
                                                    quoteX = 16.10
                                                    quoteY = 127
                                                    quoteWidth = 1096.90
                                                    quoteFontFamily = 'times new roman'
                                                    quoteFontSize = 18
                                                    quoteFontStyle = 'normal'
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
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 1:
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 2:
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 3:
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 4:
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break   
                                            case 5:
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 20
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 6:
                                                prayX = 45.78125
                                                prayY = 469.546875
                                                prayWidth = 1034.21
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
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 2:
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 4:
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 5:
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break   
                                                case 6:
                                                    familyX = 46.78125
                                                    familyY = 399
                                                    familyWidth = 1032.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 20
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
                                            family += ' ' + obituary.restFamily;
        
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
                
                                                setTimeout(() => {
                
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
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 20
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 20
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 2:
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 20
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 3:
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 20
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 4:
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 20
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 5:
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 20
                                                            diedFontStyle = 'normal'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 6:
                                                            diedX = 17.10
                                                            diedY = 302
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
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
                
                                                        setTimeout(() => {
                                                    
                                                            var usualAddressX = 0;
                                                            var usualAddressY = 0;
                                                            var usualAddressWidth = 0;
                                                            var usualAddressFontFamily = '';
                                                            var usualAddressFontSize = 0;
                                                            var usualAddressFontStyle = '';
                                                            var usualAddressAlign = '';
                                                            var usualAddressLineHeight = 0;
                                                            var usualAddressfill  ='';
                                                            switch(parseInt(obituaryModel)){
                                                                case 0:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                                case 1:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                                case 2:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                                case 3:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                                case 4:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                                case 5:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                                case 6:
                                                                    usualAddressX = 130.78125
                                                                    usualAddressY = 606
                                                                    usualAddressWidth = 938.21875
                                                                    usualAddressFontFamily = 'times new roman'
                                                                    usualAddressFontSize = 20
                                                                    usualAddressFontStyle = 'bold'
                                                                    usualAddressAlign = 'left'
                                                                    usualAddressLineHeight = 1.25
                                                                    usualAddressfill = '#000000'
                                                                break
                                                            }
                
                                                            // Usual address
                                                            var optionsUsualAddress = {
                                                                x: usualAddressX,
                                                                y: usualAddressY,
                                                                width: usualAddressWidth,
                                                                name: 'text',
                                                                id: 'usualAddress',
                                                                draggable: true,
                                                                fill: usualAddressfill,
                                                                opacity: 1
                                                            }
                
                                                            var usualAddressText = 'RESIDÍA: ' + obituary.location;
                                                            var styleUsualAddress = {
                                                                fontFamily: usualAddressFontFamily,
                                                                fontSize: usualAddressFontSize,
                                                                fontStyle: usualAddressFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: usualAddressText,
                                                                align: usualAddressAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: usualAddressLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }
                
                                                            setTimeout(() => {
                                                                drawText(optionsUsualAddress, styleUsualAddress)
                                                                setTimeout(() => {
                                                                    stage.find('#background')[0].zIndex(0)
                                                                    stage.find('#addFigure0')[0].zIndex(1)
                                                                    stage.find('#addFigure1')[0].zIndex(1)
                                                                    
                                                                    switch(parseInt(obituaryModel)){
                                                                        case 0:
                                                                        case 1:
                                                                        case 2:
                                                                        case 3:
                                                                        case 5:
                                                                        case 6:
                                                                            var elems = [
                                                                                'transept',
                                                                                'footerImage',
                                                                                'addFigure0',
                                                                                'addFigure1',
                                                                                'mortuary',
                                                                                'deceased',
                                                                                'dep',
                                                                                'quote',
                                                                                'pray',
                                                                                'family',
                                                                                'died',
                                                                                'usualAddress',
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
                                                                }, 150)
                                                            }, 150)
                                                        }, 150)
                                                    }, 150)
                                                }, 150)
                                            }, 150)
                                        }, 150)
                                    }, 150);

                                }, 150);
                            }, 150)
                        }, 150)
                    }, 150);
                }, 150);
            }, 150);
        }, 150)
    }
})