$(function(){
    hasTransept = false;
    hasLogo = true;
        
    if(!loadFlag){
        setTimeout(() => {

            if(obituaryType == 2){ 
                // Esq. Evangelica de Golpe
                var optionsBiblia = {
                    x: 150.4,
                    y: 28,
                    width: 500.64,
                    name: 'text',
                    id: 'biblia',
                    draggable: true,
                    fill: "#030000",
                    opacity: 1
                }
    
                var styleBiblia = {
                    fontFamily: "garamond",
                    fontSize: "22",
                    fontStyle: "normal",
                    fontVariant: 'normal',
                    textDecoration: 'empty string',
                    text: "\"YO SOY EL CAMINO Y LA VERDAD, Y LA VIDA;\nNADIE VIENE AL PADRE SINO POR MI\"\n\n                                                                      IVAN-14:6",
                    align: "center",
                    verticalAlign: 'top',
                    padding: 0,
                    lineHeight: 1,
                    wrap: 'word',
                    ellipsis: false
                }
    
                drawText(optionsBiblia, styleBiblia)
            }else{
                //CRUZ
                var optionsLogo = {
                    x: 378,
                    y: 12,
                    width: 80,
                    height: 150,
                    id: 'cruz',
                    draggable: true,
                    name: 'image',
                    src: uri + 'core/libraries/pdfs/images/cruz2.jpg',
                    mouse: true,
                    rotation: null,
                    scaleX:  0.5537637794956859,
                    scaleY: 0.8431098222329328,
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
            }
    
            var nameLogo = getNameLogo(obituaryType, obituaryModel)
    
            // Logo
            switch(company){
                case '2':
                    var scaleX = 0.75
                    var scaleY = 0.75
                    var x = 510
                    var y = 865
                break
                case '7':
                    var scaleX = 0.04872942149579449
                    var scaleY = 0.0487294214957945
                    var x = 543.4259343683967
                    var y = 880.5546750811845
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
            
            // Textos
            // Datos de contacto
            var text = '(www.funerariagolpe.com - Tel. 981 67 35 52)'
            var x = 450
            var y = 941
            var fill = '#030000'
            var fontFamily = 'time new roman'
            var fontSize = 18
            var align = ''
            var lineHeight = 1
            var fontStyle = 'normal'
            var fill = '#030000'
    
            var text1 = obituary.location
            var x1 = 53
            var y1 = 914
            var fontFamily1 = 'time new roman'
            var fontSize1 = 18
            var align1= ''
            var lineHeight1 = 1
            var fontStyle1 = 'normal'
            var fill1 = '#030000'
            var width = 550; 
    
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
    
            var optionsContact1 = {
                x: x1,
                y: y1,
                width: width,
                name: 'text',
                id: 'contact',
                draggable: true,
                fill: fill1,
                opacity: 1
            }
    
            var styleContact1 = {
                fontFamily: fontFamily1,
                fontSize: fontSize1,
                fontStyle: fontStyle1,
                fontVariant: 'normal',
                textDecoration: 'empty string',
                text: text1,
                align: align1,
                verticalAlign: 'top',
                padding: 0,
                lineHeight: lineHeight1,
                wrap: 'word',
                ellipsis: false
            }
            
            setTimeout(() => {
                drawText(optionsContact, styleContact)
                drawText(optionsContact1, styleContact1)
                
                var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;
                switch(parseInt(obituaryModel)){
                    case 0:
                        var x = 53
                        var y = 881
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
                        var align = 'left';
                    break;
                    case 1:
                        var x = 52
                        var y = 714
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
                        var align = 'left';
                    case 2:
                        var x = 53
                        var y = 881
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
                        var align = 'left';
                    break;
                    case 3:
                        var x = 53
                        var y = 881
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
                            var align = 'left';
                    break;
                    case 4:
                        var x = 53
                        var y = 881
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
                        var align = 'left';
                    break;
                    case 5:
                        var x = 53
                        var y = 881
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
                        var align = 'left';
                    break;
                    case 6:
                        var x = 53
                        var y = 881
                        var text = 'Hogar funerario: ' + mortuaryName + ', sala nº ' + obituary.roomNumber
                        var fontSize = 18
                        var fontStyle = 'normal'
                        var fontFamily = 'caslon'
                        var fill = '#030000'
                        var width = 462.640625
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
                                quoteX = 0.36
                                quoteY = 158
                                quoteWidth = $('#page').innerWidth()
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 20
                                quoteFontStyle = 'normal'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#030000'
                            break
                            case 1:
                                quoteX = 0.36
                                quoteY = 158
                                quoteWidth = $('#page').innerWidth()
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 20
                                quoteFontStyle = 'normal'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#030000'
                            break
                            case 2:
                                quoteX = 19
                                quoteY = 95
                                quoteWidth = 776.5023645019531
                                quoteFontFamily = 'helvetica'
                                quoteFontSize = 30
                                quoteFontStyle = 'bold'
                                quoteAlign = 'center'
                                quoteLineHeight = 1
                                quoteText = obituary.prayForText
                                fill = '#000000'
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
                                deceasedX = 6.35
                                deceasedY = 201
                                deceasedWidth = 787
                                deceasedFontFamily = 'garamonditalic'
                                deceasedFontSize = 48
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1
                                fill = '#030000'
                            break
                            case 1:
                                deceasedX = 6.35
                                deceasedY = 201
                                deceasedWidth = 787
                                deceasedFontFamily = 'garamonditalic'
                                deceasedFontSize = 48
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1
                                fill = '#030000'
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
                                    extraTextX = 133.64
                                    extraTextY = 257
                                    extraTextWidth = 535
                                    extraTextFontFamily = 'garamonditalic'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#030000'
                                break
                                case 1:
                                    extraTextX = 133.64
                                    extraTextY = 257
                                    extraTextWidth = 535
                                    extraTextFontFamily = 'garamonditalic'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#030000'
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
                                        widowX = 139
                                        widowY = 297
                                        widowWidth = 535
                                        widowFontFamily = 'garamonditalic'
                                        widowFontSize = 26
                                        widowFontStyle = 'bold'
                                        widowAlign = 'center'
                                        widowLineHeight = 1
                                        fill = '#030000'
                                    break
                                    case 1:
                                        widowX = 139
                                        widowY = 297
                                        widowWidth = 535
                                        widowFontFamily = 'garamonditalic'
                                        widowFontSize = 26
                                        widowFontStyle = 'bold'
                                        widowAlign = 'center'
                                        widowLineHeight = 1
                                        fill = '#030000'
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
                                            diedX = 2.5
                                            diedY = 342
                                            diedWidth = 794
                                            diedFontFamily = 'caslon'
                                            diedFontSize = 22
                                            diedFontStyle = 'bold'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#030000'
                                        break
                                        case 1:
                                            diedX = 2.5
                                            diedY = 342
                                            diedWidth = 794
                                            diedFontFamily = 'caslon'
                                            diedFontSize = 22
                                            diedFontStyle = 'bold'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#030000'
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
    
                                    var diedText = '';
                                    var auxText = (obituary.died).split(',')
                                    $.each(auxText, function(index, elem){
                                        if(index == auxText.length - 2){
                                            diedText += elem + ',\n'
                                        }else{
                                            diedText += elem 
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
                                                depX = 11
                                                depY = 410
                                                depWidth = 770
                                                depFontFamily = 'garamond'
                                                depFontSize = 28
                                                depFontStyle = 'bold'
                                                depAlign = 'center'
                                                depLineHeight = 1
                                                fill = '#030000'
                                            break;
                                            case 1:
                                                depX = 11
                                                depY = 410
                                                depWidth = 770
                                                depFontFamily = 'garamond'
                                                depFontSize = 28
                                                depFontStyle = 'bold'
                                                depAlign = 'center'
                                                depLineHeight = 1
                                                fill = '#030000'
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
                                                    familyX = 52
                                                    familyY = 453
                                                    familyWidth = 690
                                                    familyFontFamily = 'garamond'
                                                    familyFontSize = 24
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#030000'
                                                break
                                                case 1:
                                                    familyX = 52
                                                    familyY = 453
                                                    familyWidth = 690
                                                    familyFontFamily = 'garamond'
                                                    familyFontSize = 24
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#030000'
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
                                                        prayX = 53
                                                        prayY = 611
                                                        prayWidth = 690
                                                        prayFontFamily = 'caslon'
                                                        prayFontSize = 20
                                                        prayFontStyle = 'bold'
                                                        if(obituaryType == 7){
                                                            prayAlign = 'left'
                                                        }else{
                                                            prayAlign = 'justify'
                                                        }
                                                        prayLineHeight = 1.25
                                                        fill = '#030000'
                                                    break
                                                    case 1:
                                                        prayX = 53
                                                        prayY = 611
                                                        prayWidth = 690
                                                        prayFontFamily = 'caslon'
                                                        prayFontSize = 20
                                                        prayFontStyle = 'bold'
                                                        prayAlign = 'left'
                                                        prayLineHeight = 1.25
                                                        fill = '#030000'
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
                                                            MourningX = 53
                                                            MourningY = 849
                                                            MourningWidth = 690
                                                            MourningFontFamily = 'caslon'
                                                            MourningFontSize = 20
                                                            MourningFontStyle = 'bold'
                                                            MourningAlign = 'center'
                                                            MourningLineHeight = 1.25
                                                            fill = '#030000'
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
                                                            fill = '#00305c'
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
                                                                FuneralX = 53
                                                                FuneralY = 767
                                                                FuneralWidth = 690
                                                                FuneralFontFamily = 'caslon'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'justify'
                                                                FuneralLineHeight = 1.25
                                                                fill = '#030000'
                                                            break
                                                            case 1:
                                                                FuneralX = 58
                                                                FuneralY = 845
                                                                FuneralWidth = 690
                                                                FuneralFontFamily = 'caslon'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'justify'
                                                                FuneralLineHeight = 1.25
                                                                fill = '#030000'
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
                                                                    busX = 53
                                                                    busY = 820
                                                                    busWidth = 690
                                                                    busFontFamily = 'caslon'
                                                                    busFontSize = 20
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'justify'
                                                                    busLineHeight = 1.25
                                                                    fill = '#030000'
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
                                                                text: 'Nota: ' + obituary.busRoute,
                                                                align: busAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: busLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }
    
                                                            setTimeout(() => {
                                                                drawText(optionsBus, styleBus)
    
                                                                // Para Abrisa, el texto del fondo de la esquela para confirmación de datos
                                                                switch(parseInt(obituaryModel)){
                                                                    case 0:
                                                                    case 1:
                                                                        var options = {
                                                                            x: 53,
                                                                            y: 978,
                                                                            width: 717,
                                                                            height: 125,
                                                                            name: 'figure',
                                                                            id: 'addFigure0',
                                                                            draggable: true,
                                                                            fill: '#FFFFFF',
                                                                            stroke: '#030000',
                                                                            strokeWidth: 4,
                                                                            opacity: 1,
                                                                            rotation: 0,
                                                                            scaleX: 1,
                                                                            scaleY: 1
                                                                        }
                                                                        
                                                                        drawRectangle(options)
                                                                    break
                                                                }
    
                                                                setTimeout(() => {
                                                                    switch(parseInt(obituaryModel)){
                                                                        case 0:
                                                                        case 1:
                                                                            var options = {
                                                                                x: 53,
                                                                                y: 952,
                                                                                width: 250,
                                                                                name: 'text',
                                                                                id: 'addText' + addTextIndex,
                                                                                draggable: true,
                                                                                fill: '#030000',
                                                                                opacity: 1
                                                                            }
                                                                        
                                                                            var style = {
                                                                                fontFamily: 'arial',
                                                                                fontSize: 18,
                                                                                fontStyle: 'normal',
                                                                                fontVariant: 'normal',
                                                                                textDecoration: 'empty string',
                                                                                text: 'Confirmación de datos',
                                                                                align: 'left',
                                                                                verticalAlign: 'top',
                                                                                padding: 0,
                                                                                lineHeight: 1,
                                                                                wrap: 'word',
                                                                                ellipsis: false
                                                                            }
        
                                                                            toAddTextSet(options, style)
        
                                                                            var options = {
                                                                                x: 68,
                                                                                y: 993,
                                                                                width: 686,
                                                                                height: 98,
                                                                                name: 'text',
                                                                                id: 'addText' + addTextIndex,
                                                                                draggable: true,
                                                                                fill: '#030000',
                                                                                opacity: 1
                                                                            }
                                                                        
                                                                            var style = {
                                                                                fontFamily: 'arial',
                                                                                fontSize: 18,
                                                                                fontStyle: 'normal',
                                                                                fontVariant: 'normal',
                                                                                textDecoration: 'empty string',
                                                                                text: '',
                                                                                align: 'left',
                                                                                verticalAlign: 'top',
                                                                                padding: 0,
                                                                                lineHeight: 1,
                                                                                wrap: 'word',
                                                                                ellipsis: false
                                                                            }
        
                                                                            toAddTextSet(options, style, 98)
                                                                        break;
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
                                                                                    'biblia',
                                                                                    'cruz',
                                                                                    'logo',
                                                                                    'logo',
                                                                                    'contact',
                                                                                    'contact2',
                                                                                    'mortuary',
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
                                                                                    'addFigure0',
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
                                                                    }, 500)
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
        }, 150)
    }
})