$(function(){
    hasTransept = true;
    hasLogo = true;

    var client = getClient(expedientID);
    
    if(!loadFlag){
        setTimeout(() => {
    
            var transeptX = 0;
            var transeptY  = 0;
            var transeptScaleX  = 0;
            var transeptScaleY  = 0;
    
            switch(parseInt(obituaryModel)){
                case 0:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
                break
                case 1:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
                break
                case 2:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
                break
                case 3:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
                break
                case 4:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
                break;
                case 5:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
                break
                case 6:
                    transeptX = 46
                    transeptY = 42.022
                    transeptScaleX = 1.1344864128684642
                    transeptScaleY = 1.1344864128684642
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
    
            setTimeout(() => {
                
                setTimeout(() => {
                    var nameLogo = getNameLogo(obituaryType, obituaryModel)
                
                    // Logo
                    var scaleX = 0.18282977616017954
                    var scaleY = 0.18282977616017954
                    var x = 45.58511191991022
                    var y = 1003.5851119199104
            
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
                    var text = 'POMPAS FUNEBRES SANTA TEGRA S.L.\nTelf.: 986.61.15.57'
                    var x = 149.859375
                    var y = 1013
                    var fill = '#000000'
                    var fontFamily = 'arial'
                    var fontSize = 31
                    var align = 'center'
                    var lineHeight = 1.25
                    var fontStyle = 'bold'
                    var width = 600; 
    
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
                        // Draw Contact
                        drawText(optionsContact, styleContact)
        
                        if(client == 6){
                            setTimeout(() => {
                                var optionsFeLogo = {
                                    x: 565,
                                    y: 933,
                                    width: null,
                                    height: null,
                                    id: 'logoLaFe',
                                    draggable: true,
                                    name: 'image',
                                    src: uri + 'resources/files/' + company + '/obituaries/basic/lafe.jpg',
                                    mouse: true,
                                    rotation: null,
                                    scaleX:0.6,
                                    scaleY: 0.6,
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
    
                                drawImage(optionsFeLogo, expedientID, obituaryType, obituaryModel)
                            }, 150)
                        }
        
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
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                case 1:
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                case 2:
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                case 3:
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                case 4:
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                case 5:
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                case 6:
                                    quoteX = 151.34375
                                    quoteY = 42
                                    quoteWidth = 496.65625
                                    quoteFontFamily = 'arial'
                                    quoteFontSize = 20
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
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 1:
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 2:
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 3:
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 4:
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 5:
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1
                                    fill = '#000000'
                                break
                                case 6:
                                    deceasedX = 150.34375
                                    deceasedY = 79
                                    deceasedWidth = 495.65625
                                    deceasedFontFamily = 'arial'
                                    deceasedFontSize = 37
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
                                text: obituary.namePre + ' ' + obituary.name.toUpperCase() + '\n' + obituary.surname.toUpperCase(),
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
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 1:
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 2:
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break;
                                    case 3:
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break;
                                    case 4:
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 5:
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 6:
                                        diedX = 17.34375
                                        diedY = 167
                                        diedWidth = 759.65625
                                        diedFontFamily = 'arial'
                                        diedFontSize = 22
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

                                var diedText = obituary.died
                                diedText = ''
                                var auxText = (obituary.died).split('. A')
                                $.each(auxText, function(index, elem){
                                    if(index == auxText.length - 1){
                                        diedText += elem
                                    }else{
                                        diedText += elem + '.\n A'
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
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
                                            depFontSize = 27
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 1:
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
                                            depFontSize = 27
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 2:
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
                                            depFontSize = 27
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 3:
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
                                            depFontSize = 27
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 4:
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
                                            depFontSize = 27
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 5:
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
                                            depFontSize = 27
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 6:
                                            depX = 18.34375
                                            depY = 357
                                            depWidth = 759.65625
                                            depFontFamily = 'arial'
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
                                        var familyHeight = 152.25;
                                        var familyFontFamily = '';
                                        var familyFontSize = 0;
                                        var familyFontStyle = '';
                                        var familyAlign = '';
                                        var familyLineHeight = 0;
                                        var fill = '';
                                        switch(parseInt(obituaryModel)){
                                            case 0:
                                                familyX = 31.34375
                                                familyY = 389.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 1:
                                                familyX = 29.34375
                                                familyY = 394.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 2:
                                                familyX = 29.34375
                                                familyY = 394.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 3:
                                                familyX = 29.34375
                                                familyY = 394.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 4:
                                                familyX = 29.34375
                                                familyY = 394.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 5:
                                                familyX = 29.34375
                                                familyY = 394.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break   
                                            case 6:
                                                familyX = 29.34375
                                                familyY = 394.796875
                                                familyWidth = 722.65625
                                                familyFontFamily = 'arial'
                                                familyFontSize = 23
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
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 2:
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 3:
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 4:
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break   
                                                case 5:
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 6:
                                                    prayX = 30.34375
                                                    prayY = 548.390625
                                                    prayWidth = 722.65625
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 23
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
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 1:
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 2:
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 3:
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 4:
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 5:
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 6:
                                                        MourningX = 28.34375
                                                        MourningY = 878.390625
                                                        MourningWidth = 735.65625
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 30
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
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

                                                // var mourningText = '';
                                                // if(obituary.deceasedInName != null && obituary.deceasedInName != ''){
                                                //     mourningText += obituary.deceasedInName.toUpperCase() + ', ';
                                                // }
                                                var mourningText = obituary.deceasedLocality + ', ';
                                                if(obituary.deceasedDate != null && obituary.deceasedDate != ''){
                                                    var dayNameAux =  moment(obituary.deceasedDate, "YYYY-MM-DD").format('LLLL').toUpperCase().split(' ');
                                                    mourningText +=  dayNameAux[1] + ' DE '+dayNameAux[3] + ' DE ' + dayNameAux[5];
                                                }

                                                var styleMourning = {
                                                    fontFamily: MourningFontFamily,
                                                    fontSize: MourningFontSize,
                                                    fontStyle: MourningFontStyle,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'empty string',
                                                    text: mourningText,
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
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 2:
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 3:
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 4:
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 5:
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 6:
                                                            FuneralX = 29.34375
                                                            FuneralY = 776
                                                            FuneralWidth = 719.65625
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 23
                                                            FuneralFontStyle = 'bold'
                                                            FuneralAlign = 'justify'
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
                                                                        'logo',
                                                                        'contact',
                                                                        'logoLaFe',
                                                                        'quote',
                                                                        'deceased',
                                                                        'died',
                                                                        'dep',
                                                                        'family',
                                                                        'pray',
                                                                        'mourning',
                                                                        'funeral'
                                                                    ]

                                                                    if(client == 6 || client == null){
                                                                        elems.pop()
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
                                                                    if(client == 6 || client == null){
                                                                        elems.pop()
                                                                    }

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
            }, 150);
        }, 150)
    }
})