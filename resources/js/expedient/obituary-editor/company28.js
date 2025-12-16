$(function(){
    hasTransept = false;
    hasLogo = false;
                
    if(!loadFlag){
        setTimeout(() => {

            var optionsTransept = {
                x: 367,
                y: 11.526956989114186,
                width: null,
                height: null,
                id: 'transept',
                draggable: true,
                name: 'image',
                src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/transept.png',
                mouse: true,
                rotation: null,
                scaleX: 0.44578195652964636,
                scaleY: 0.44578195652964625,
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
                        deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
                        fill = '#000000'
                    break
                    case 1:
                        deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
                        fill = '#000000'
                    break
                    case 2:
                        deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
                        fill = '#000000'
                    break
                    case 3:
                        deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
                        fill = '#000000'
                    break
                    case 4:
                       deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
                        fill = '#000000'
                    break
                    case 5:
                        deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
                        fill = '#000000'
                    break
                    case 6:
                        deceasedX = 37
                        deceasedY = 165
                        deceasedWidth = 724
                        deceasedFontFamily = 'arial'
                        deceasedFontSize = 35
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1.5
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
                    text:  obituary.namePre + ' ' + (obituary.name + ' ' + obituary.surname),
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
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
                        break
                        case 1:
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
                        break
                        case 2:
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
                        break
                        case 3:
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
                        break
                        case 4:
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
                        break
                        case 5:
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
                        break
                        case 6:
                            extraTextX = 35
                            extraTextY = 214
                            extraTextWidth = 725
                            extraTextFontFamily = 'arial'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1.5
                            fill = '#000000'
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
                                widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 1:
                               widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 2:
                                widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 3:
                                widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 4:
                                widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 5:
                                widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
                                widowAlign = 'center'
                                widowLineHeight = 1.25
                                fill = "#000000"
                            break
                            case 6:
                                widowX = 35
                                widowY = 249
                                widowWidth = 725
                                widowFontFamily = 'arial'
                                widowFontSize = 18
                                widowFontStyle = 'bold'
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
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
                                    fill = '#000000'
                                break
                                case 1:
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
                                    fill = '#000000'
                                break
                                case 2:
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
                                    fill = '#000000'
                                break;
                                case 3:
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
                                    fill = '#000000'
                                break;
                                case 4:
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
                                    fill = '#000000'
                                break
                                case 5:
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
                                    fill = '#000000'
                                break
                                case 6:
                                    diedX = 35
                                    diedY = 282
                                    diedWidth = 725
                                    diedFontFamily = "arial"
                                    diedFontSize = 16
                                    diedFontStyle = 'normal'
                                    diedAlign = 'center'
                                    diedLineHeight = 1.5
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
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
                                        fill = '#000000'
                                    break;
                                    case 1:
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
                                        fill = '#000000'
                                    break;
                                    case 2:
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
                                        fill = '#000000'
                                    break
                                    case 3:
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
                                        fill = '#000000'
                                    break
                                    case 4:
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
                                        fill = '#000000'
                                    break
                                    case 5:
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
                                        fill = '#000000'
                                    break
                                    case 6:
                                        depX = 33
                                        depY = 324
                                        depWidth = 725
                                        depFontFamily = 'arial'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1.5
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
                                    var familyFontFamily = '';
                                    var familyFontSize = 0;
                                    var familyFontStyle = '';
                                    var familyAlign = '';
                                    var familyLineHeight = 0;
                                    var fill = '';
                                    switch(parseInt(obituaryModel)){
                                        case 0:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 16
                                            familyFontStyle = 'normal'
                                            familyAlign = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break
                                        case 1:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 16
                                            familyFontStyle = 'normal'
                                            familyAlign = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break
                                        case 2:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 16
                                            familyFontStyle = 'normal'
                                            familyAlign = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break
                                        case 3:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 16
                                            familyFontStyle = 'normal'
                                            familyAlign = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break
                                        case 4:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 16
                                            familyFontStyle = 'normal'
                                            familyAlign = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break
                                        case 5:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 16
                                            familyFontStyle = 'normal'
                                            familyAlign = 'normal'
                                            familyLineHeight = 1.5
                                            fill = '#000000'
                                        break   
                                        case 6:
                                            familyX = 62
                                            familyY = 362
                                            familyWidth = 672
                                            familyFontFamily = 'arial'
                                            familyFontSize = 18
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.5
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
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break
                                            case 1:
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break;
                                            case 2:
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break;
                                            case 3:
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break;
                                            case 4:
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break   
                                            case 5:
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
                                                fill = '#000000'
                                            break
                                            case 6:
                                                prayX = 62
                                                prayY = 475
                                                prayWidth = 663
                                                prayFontFamily = 'arial'
                                                prayFontSize = 16
                                                prayFontStyle = 'normal'
                                                prayLineHeight = 1.5
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

                                            var mortuaryDateX = 0;
                                            var mortuaryDateY = 0;
                                            var mortuaryDateWidth = 0;
                                            var mortuaryDateFontFamily = '';
                                            var mortuaryDateFontSize = 0;
                                            var mortuaryDateFontStyle = '';
                                            var mortuaryDateAlign = '';
                                            var mortuaryDateLineHeight = 0;
                                            var fill = '';
                                            switch(parseInt(obituaryModel)){
                                                case 0:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                                case 2:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                                case 4:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                                case 5:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                                case 6:
                                                    mortuaryDateX = 62
                                                    mortuaryDateY = 565
                                                    mortuaryDateWidth = 672
                                                    mortuaryDateFontFamily = 'arial'
                                                    mortuaryDateFontSize = 16
                                                    mortuaryDateFontStyle = 'bold'
                                                    mortuaryDateLineHeight = 1.5
                                                    fill = '#000000'
                                                break
                                            }

                                            // Ruegan
                                            var optionsMortuaryDate = {
                                                x: mortuaryDateX,
                                                y: mortuaryDateY,
                                                width: mortuaryDateWidth,
                                                name: 'text',
                                                id: 'mortuaryDate',
                                                draggable: true,
                                                fill: fill,
                                                opacity: 1
                                            }

                                            var textMortuaryDate = "Día: ";
                                            if(obituaryType == '1'){
                                                textMortuaryDate = "Día do enterro: "
                                                moment.locale('gl'); 
                                            }
                                            if(expedientInfo.funeralDate != null && expedientInfo.funeralDate != ''){
                                                var deceasedDateAux =  moment(moment(expedientInfo.funeralDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                                                textMortuaryDate += deceasedDateAux[0].toUpperCase().replace(",", "") + ' ' + deceasedDateAux[1] + ' de ' + deceasedDateAux[3] + "."
                                            }

                                            var styleMortuaryDate = {
                                                fontFamily: mortuaryDateFontFamily,
                                                fontSize: mortuaryDateFontSize,
                                                fontStyle: mortuaryDateFontStyle,
                                                fontVariant: 'normal',
                                                textDecoration: 'empty string',
                                                text: textMortuaryDate,
                                                align: mortuaryDateAlign,
                                                verticalAlign: 'top',
                                                padding: 0,
                                                lineHeight: mortuaryDateLineHeight,
                                                wrap: 'word',
                                                ellipsis: false
                                            }

                                            setTimeout(() => {
                                                drawText(optionsMortuaryDate, styleMortuaryDate)

                                                var mortuaryTimeX = 0;
                                                var mortuaryTimeY = 0;
                                                var mortuaryTimeWidth = 0;
                                                var mortuaryTimeFontFamily = '';
                                                var mortuaryTimeFontSize = 0;
                                                var mortuaryTimeFontStyle = '';
                                                var mortuaryTimeAlign = '';
                                                var mortuaryTimeLineHeight = 0;
                                                var fill = '';
                                                switch(parseInt(obituaryModel)){
                                                    case 0:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                    case 1:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                    case 2:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                    case 3:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                    case 4:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                    case 5:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                    case 6:
                                                        mortuaryTimeX = 62
                                                        mortuaryTimeY = 595
                                                        mortuaryTimeWidth = 672
                                                        mortuaryTimeFontFamily = 'arial'
                                                        mortuaryTimeFontSize = 16
                                                        mortuaryTimeFontStyle = 'bold'
                                                        mortuaryTimeLineHeight = 1.5
                                                        fill = '#000000'
                                                    break
                                                }

                                                // Ruegan
                                                var optionsMortuaryTime = {
                                                    x: mortuaryTimeX,
                                                    y: mortuaryTimeY,
                                                    width: mortuaryTimeWidth,
                                                    name: 'text',
                                                    id: 'mortuaryTime',
                                                    draggable: true,
                                                    fill: fill,
                                                    opacity: 1
                                                }

                                                if(obituaryType == '1'){
                                                    var textMortuaryTime = "Saída do tanatorio: ";
                                                    var momento = 'mañá';
                                                }else{
                                                    var textMortuaryTime = "Salida del tanatorio: ";
                                                    var momento = 'mañana';
                                                }
                                                if (expedientInfo.funeralTime != null && expedientInfo.funeralTime != ''){
                                                    if(moment(expedientInfo.funeralTime, "hh:mm:ss").format('HH') > 14){
                                                        momento = "tarde";
                                                    }
                                                    var h = (moment(expedientInfo.funeralTime, "hh:mm:ss").format('HH'))           
                                                    var m = (moment(expedientInfo.funeralTime, "hh:mm:ss").format('mm'))
                                                    funerTime = getFuneralTime(h, m, 'es')
                                                }else{
                                                    funerTime = ''
                                                }

                                                if(obituaryType == '1'){
                                                    textMortuaryTime += funerTime + ' da ' + momento + ".";
                                                }else{
                                                    textMortuaryTime += funerTime + ' de la ' + momento + ".";
                                                }

                                                var styleMortuaryTime = {
                                                    fontFamily: mortuaryTimeFontFamily,
                                                    fontSize: mortuaryTimeFontSize,
                                                    fontStyle: mortuaryTimeFontStyle,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'empty string',
                                                    text: textMortuaryTime,
                                                    align: mortuaryTimeAlign,
                                                    verticalAlign: 'top',
                                                    padding: 0,
                                                    lineHeight: mortuaryTimeLineHeight,
                                                    wrap: 'word',
                                                    ellipsis: false
                                                }
                                                
                                                setTimeout(() => {
                                                    drawText(optionsMortuaryTime, styleMortuaryTime)
                                                    
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
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
                                                            fill = '#000000'
                                                        break
                                                        case 2:
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
                                                            fill = '#000000'
                                                        break
                                                        case 3:
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
                                                            fill = '#000000'
                                                        break
                                                        case 4:
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
                                                            fill = '#000000'
                                                        break
                                                        case 5:
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
                                                            fill = '#000000'
                                                        break
                                                        case 6:
                                                            MourningX = 62
                                                            MourningY = 862
                                                            MourningWidth = 668
                                                            MourningFontFamily = 'arial'
                                                            MourningFontSize = 17
                                                            MourningFontStyle = 'bold'
                                                            MourningLineHeight = 1.5
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
        
                                                    var textMourning = "";
                                                    var deceasedDateAux = '';
                                                    if(obituary.deceasedDate != null && obituary.deceasedDate != ''){
                                                        var deceasedDayAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD"))
                                                        var deceasedMonthAux = moment(obituary.deceasedDate, "YYYY-MM-DD").format("MMMM")
                                                        deceasedMonthAux = deceasedMonthAux.charAt(0).toUpperCase() + deceasedMonthAux.slice(1);
                                                        var deceasedYearAux = parseInt(moment(obituary.deceasedDate, "YYYY-MM-DD").format("YYYY"))
                                                        var deceasedDateAux = deceasedDayAux + ' de ' + deceasedMonthAux.toLowerCase() + ' de ' + deceasedYearAux;
                                                    }
        
                                                    var deceasedLocalityShow = '';
                                                    if(obituary.location != null){
                                                        deceasedLocalityShow = obituary.location;
                                                    }
        
                                                    textMourning =  deceasedLocalityShow + ', ' + deceasedDateAux + '.'
        
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
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
                                                                fill = '#000000'
                                                            break
                                                            case 1:
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
                                                                fill = '#000000'
                                                            break
                                                            case 2:
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
                                                                fill = '#000000'
                                                            break
                                                            case 3:
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
                                                                fill = '#000000'
                                                            break
                                                            case 4:
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
                                                                fill = '#000000'
                                                            break
                                                            case 5:
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
                                                                fill = '#000000'
                                                            break
                                                            case 6:
                                                                FuneralX = 62
                                                                FuneralY = 655
                                                                FuneralWidth = 673
                                                                FuneralFontFamily = 'arial'
                                                                FuneralFontSize = 17
                                                                FuneralFontStyle = 'normal'
                                                                FuneralAlign = 'normal'
                                                                FuneralLineHeight = 1.5
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

                                                            var mortuaryX = 0;
                                                            var mortuaryY = 0;
                                                            var mortuaryWidth = 0;
                                                            var mortuaryFontFamily = '';
                                                            var mortuaryFontSize = 0;
                                                            var mortuaryFontStyle = '';
                                                            var mortuaryAlign = '';
                                                            var mortuaryLineHeight = 0;
                                                            var fill = '';
                                                            switch(parseInt(obituaryModel)){
                                                                case 0:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                                case 1:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                                case 2:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                                case 3:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                                case 4:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                                case 5:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                                case 6:
                                                                    mortuaryX = 62
                                                                    mortuaryY = 625
                                                                    mortuaryWidth = 668.64
                                                                    mortuaryFontFamily = 'arial'
                                                                    mortuaryFontSize = 17
                                                                    mortuaryFontStyle = 'bold'
                                                                    mortuaryAlign = 'normal'
                                                                    mortuaryLineHeight = 1.5
                                                                    fill = '#000000'
                                                                break
                                                            }
        
                                                            // Mortuary
                                                            var optionsMortuary = {
                                                                x: mortuaryX,
                                                                y: mortuaryY,
                                                                width: mortuaryWidth,
                                                                name: 'text',
                                                                id: 'mortuary',
                                                                draggable: true,
                                                                fill: fill,
                                                                opacity: 1
                                                            }
        
                                                            var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;
                                                            var mortuaryText = 'Tanatorio ' + mortuaryName + ' - Sala Nº ' + obituary.roomNumber + '.';

                                                            var styleMortuary = {
                                                                fontFamily: mortuaryFontFamily,
                                                                fontSize: mortuaryFontSize,
                                                                fontStyle: mortuaryFontStyle,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: mortuaryText,
                                                                align: mortuaryAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: mortuaryLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }

                                                            setTimeout(() => {
                                                                drawText(optionsMortuary, styleMortuary)
                                                                
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
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
                                                                    break
                                                                    case 1:
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
                                                                    break
                                                                    case 2:
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
                                                                    break
                                                                    case 3:
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
                                                                    break
                                                                    case 4:
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
                                                                    break
                                                                    case 5:
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
                                                                    break
                                                                    case 6:
                                                                        busX = 62
                                                                        busY = 685
                                                                        busWidth = 668
                                                                        busFontFamily = 'arial'
                                                                        busFontSize = 17
                                                                        busFontStyle = 'normal'
                                                                        busAlign = 'justify'
                                                                        busLineHeight = 1.5
                                                                        fill = '#000000'
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

                                                                    var contactX = 45;
                                                                    var contactY = 960;
                                                                    var contactWidth = 240;
                                                                    var contactFontFamily = 'arial';
                                                                    var contactFontSize = 14;
                                                                    var contactFontStyle = 'normal';
                                                                    var contactAlign = 'normal';
                                                                    var contactLineHeight = 1;
                                                                    var fill = '#86754e';

                                                                    var contactText = 
                                                                        'Rúa Toxeira 1, baixo dereita' + '\n' +
                                                                        'Sigüeiro. 15888 Oroso (A Coruña)' + '\n\n' +
                                                                        'T. 981 695 849' + '\n' +
                                                                        'M. 608 106 653' + '\n\n' +
                                                                        'info@funerariamartinez.es' + '\n' +
                                                                        'www.funerariamartinez.es' + '\n'
                                                                    ;

                                                                    // Contact
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

                                                                        drawText(optionsContact, styleContact);

                                                                        var optionsLogo = {
                                                                            x: 582.33,
                                                                            y: 985.71,
                                                                            width: null,
                                                                            height: null,
                                                                            id: 'qrwhatsapp',
                                                                            draggable: true,
                                                                            name: 'image',
                                                                            src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/qrwhatsapp.png',
                                                                            mouse: true,
                                                                            rotation: null,
                                                                            scaleX:  0.33935168406613314,
                                                                            scaleY: 0.33935168406613303,
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
                                                                                        'deceased',
                                                                                        'widow',
                                                                                        'extraText',
                                                                                        'died',
                                                                                        'dep',
                                                                                        'family',
                                                                                        'pray',
                                                                                        'mortuaryDate',
                                                                                        'mortuaryTime',
                                                                                        'funeral',
                                                                                        'mortuary',
                                                                                        'bus',
                                                                                        'mourning',
                                                                                        'contact',
                                                                                        'qrwhatsapp',
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
                                                    }, 150);
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
    }
})


function getFuneralTime(hour, min, lang){
    var hr;
    var h;
    var m;
    switch(min){
        case '00' :        
            m = '';
        break;
        case '10' :                    
            m = ' Y DIEZ';
            if(lang == 'gl'){
                m = ' E DEZ'; 
            }else if(lang == 'cat'){
                m = ' I DEU'
            }
        break;
        case '15' :       
            m = ' Y CUARTO';
            if(lang == 'gl'){
                m = ' E CUARTO'; 
            }else if(lang == 'cat'){
                m = ' I QUATRE'
            }
        break;
        case '20' :        
            m = ' Y VEINTE';
            if(lang == 'gl'){
                m = ' E VINTE'; 
            }else if(lang == 'cat'){
                m = ' I VINT'
            }
        break;       
        case '25' :
            m = ' Y VEINTICINCO';
            if(lang == 'gl'){
                m = ' E VINTECINCO'; 
            }else if(lang == 'cat'){
                m = ' I VINT-I-CINC'
            }
        break;       
        case '30' :
            m = ' Y MEDIA';
            if (lang == 'gl'){
                m = ' E MEDIA'; 
            }else if(lang == 'cat'){
                m = ' I MITJA'
            }
        break;      
        case '35' :
            m = ' Y TREINTA Y CINCO';
            if (lang == 'gl'){
                m = ' E TRINTA E CINCO'; 
            }else if(lang == 'cat'){
                m = ' I TRENTA-CINC'
            }
            break;       
        case '40' :
            m = ' MENOS VEINTE';
            if (lang == 'gl'){
                m = ' MENOS VINTE'; 
            }else if(lang == 'cat'){
                m = ' MENYS VINT'
            }
            hour= parseInt(hour) + 1;  
        break;        
        case '45' :
            m = ' MENOS CUARTO';
            if (lang == 'gl'){
                m = ' MENOS CUARTO'; 
            }else if(lang == 'cat'){
                m = ' MENYS QUART'
            }
            hour= parseInt(hour) + 1;      
        break;
        case '50' :       
            m = ' MENOS DIEZ';
            if(lang == 'gl'){
                m = ' MENOS DEZ'; 
            }else if(lang == 'cat'){
                m = ' MENYS DEU'
            }
            hour= parseInt(hour) + 1;  
        break;       
        case '55' :
            m = ' MENOS CINCO';
            if(lang == 'gl'){
                m = ' MENOS CINCO'; 
            }else if(lang == 'cat'){
                m = ' MENYS CINC'
            }
            hour= parseInt(hour) + 1;  
        break;
        default :
            m = ":" + min;
        break;
    }
       
    hr = hour.toString();
    switch(hr){        
        case '00' :
        case '24':
        case '12' :
            h = 'DOCE';
        break;
        case '01' :
        case '1':
        case '13' :
            h = 'UNA'; 
            if (lang == 'gl'){
                h = ' UNHA'; 
            }           
        break;
        case '02' :
        case '2':
        case '14' :
            h = 'DOS';
            if (lang == 'gl'){
                h = ' DÚAS'; 
            }
        break;
        case '03' :
        case '3':
        case '15' :
            h = 'TRES';
        break;
        case '04' :
        case '4':
        case '16' :
            h = 'CUATRO';
            if (lang == 'gl'){
                h = ' CATRO'; 
            }else if (lang == 'cat'){
                h = ' QUATRE'; 
            }
        break;
        case '05' :
        case '5':
        case '17' :
            h = 'CINCO';
            if (lang == 'cat'){
                h = ' CINC'; 
            }
        break;
        case '06' :
        case '6':
        case '18' :
            h = 'SEIS';
            if (lang == 'cat'){
                h = ' SIS'; 
            }
        break;
        case '07' :
        case '7':
        case '19' :
            h = 'SIETE';
            if (lang == 'gl'){
                h = ' SETE'; 
            }else if (lang == 'cat'){
                h = ' SET'; 
            }
            break;
        case '08' :
        case '8':
        case '20' :
            h = 'OCHO';
            if (lang == 'gl'){
                h = ' OITO'; 
            }else if (lang == 'cat'){
                h = ' VUIT'; 
            }
        break;
        case '09' :
        case '9':
        case '21' :
            h = 'NUEVE';
            if (lang == 'gl'){
                h = ' NOVE'; 
            }else if (lang == 'cat'){
                h = ' NOU'; 
            }
        break;
        case '10' :       
        case '22' :
            h = 'DIEZ';
            if (lang == 'gl'){
                m = ' DEZ'; 
            }else if (lang == 'cat'){
                h = ' DEU'; 
            }
        break;
        case '11' :
        case '23' :
            h = 'ONCE';
            if (lang == 'cat'){
                m = ' ONZE'; 
            }
        break;
        default :
            h = hour;
        break;
    }    
    
    return h + m;
}