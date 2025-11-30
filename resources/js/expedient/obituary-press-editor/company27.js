$(function(){
    hasTransept = false;
    hasLogo = false;

    var client = getClient(expedientID);
    
    if(!loadFlag){
    
        var funeralDate = obituary.ceremonyDate == null ? '' : moment(obituary.ceremonyDate, 'YYYY-MM-DD').format('LL')

        switch(parseInt(obituaryModel)){
            case 0:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
                var fill = '#000000'
                var width = 373
                var align = 'right';
            break;
            case 1:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
                var fill = '#000000'
                var width = 373
                var align = 'right';
            break;
            case 2:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
                var fill = '#000000'
                var width = 373
                var align = 'right';
            break;
            case 3:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
                var fill = '#000000'
                var width = 373
                var align = 'right';
            break;
            case 4:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
                var fill = '#000000'
                var width = 373
                var align = 'right';
            break;
            case 5:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
                var fill = '#000000'
                var width = 373
                var align = 'right';
            break;
            case 6:
                var x = 393
                var y = 1071
                var text = obituary.location + ', a ' + funeralDate
                var fontSize = 18
                var fontStyle = 'normal'
                var fontFamily = 'tahoma'
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
            // Draw Mortuary
            drawText(optionsMortuary, styleMortuary)

            // Label
            var infoTextX = 50;
            var infoTextY = 50;
            var infoTextWidth = 700;
            var infoTextFontFamily = 'tahoma';
            var infoTextFontSize = 18;
            var infoTextFontStyle = 'normal';
            var infoTextAlign = 'left';
            var infoTextLineHeight = 1.25;
            var fill = '';

            // Fallecido
            var optionsDInfoText = {
                x: infoTextX,
                y: infoTextY,
                width: infoTextWidth,
                name: 'text',
                id: 'infotext',
                draggable: true,
                fill: fill,
                opacity: 1
            }

            var styleInfoText = {
                fontFamily: infoTextFontFamily,
                fontSize: infoTextFontSize,
                fontStyle: infoTextFontStyle,
                fontVariant: 'normal',
                textDecoration: 'empty string',
                text: "FUNERARIA ICOD S.L.                                                                       TAMAÑO:",
                align: infoTextAlign,
                verticalAlign: 'top',
                padding: 0,
                lineHeight: infoTextLineHeight,
                wrap: 'word',
                ellipsis: false
            }

            setTimeout(() => {
                drawText(optionsDInfoText, styleInfoText)

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
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        case 1:
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        case 2:
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        case 3:
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        case 4:
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        case 5:
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        case 6:
                            deceasedX = 0
                            deceasedY = 272
                            deceasedWidth = 793
                            deceasedFontFamily = 'tahoma'
                            deceasedFontSize = 28
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
                        
                        var extraTextX = 142;
                        var extraTextY = 310;
                        var extraTextWidth = 514;
                        var extraTextFontFamily = 'tahoma';
                        var extraTextFontSize = 20;
                        var extraTextFontStyle = 'bold';
                        var extraTextAlign = 'center';
                        var extraTextLineHeight = 1;
                        var fill = '#000000';

                        switch(parseInt(obituaryModel)){
                            case 0:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
                            break
                            case 1:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
                            break
                            case 2:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
                            break
                            case 3:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
                            break
                            case 4:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
                            break
                            case 5:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
                            break
                            case 6:
                                extraTextX = 142;
                                extraTextY = 310;
                                extraTextWidth = 514;
                                extraTextFontFamily = 'tahoma';
                                extraTextFontSize = 20;
                                extraTextFontStyle = 'bold';
                                extraTextAlign = 'center';
                                extraTextLineHeight = 1;
                                fill = '#000000';
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
                                    widowX = 215
                                    widowY = 182
                                    widowWidth = 535
                                    widowFontFamily = 'garamonditalic'
                                    widowFontSize = 26
                                    widowFontStyle = 'bold'
                                    widowAlign = 'center'
                                    widowLineHeight = 1
                                    fill = '#000000'
                                break
                                case 1:
                                    widowX = 215
                                    widowY = 182
                                    widowWidth = 535
                                    widowFontFamily = 'garamonditalic'
                                    widowFontSize = 26
                                    widowFontStyle = 'bold'
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
                                    fill = '#000000'
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
                                    fill = '#000000'
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
                                    fill = '#000000'
                                break
                            }

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
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 1:
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 2:
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break;
                                    case 3:
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break;
                                    case 4:
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 5:
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
                                        diedFontSize = 20
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1.25
                                        fill = '#000000'
                                    break
                                    case 6:
                                        diedX = 60
                                        diedY = 347
                                        diedWidth = 677
                                        diedFontFamily = 'tahoma'
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

                                var diedText = obituary.died
                                diedText = ''
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
                                    
                                    setTimeout(() => {

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
                                                familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 1:
                                                familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 2:
                                                familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 3:
                                                familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 4:
                                                    familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 5:
                                                familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break   
                                            case 6:
                                                familyX = 61
                                                familyY = 416
                                                familyWidth = 675
                                                familyFontFamily = 'tahoma'
                                                familyFontSize = 22
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
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 2:
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 3:
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break;
                                                case 4:
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break   
                                                case 5:
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 6:
                                                    prayX = 60
                                                    prayY = 617
                                                    prayWidth = 679
                                                    prayFontFamily = 'tahoma'
                                                    prayFontSize = 19
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
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 1:
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 2:
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 3:
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 4:
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 5:
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
                                                        MourningFontStyle = 'bold'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    case 6:
                                                        MourningX = 64
                                                        MourningY = 835
                                                        MourningWidth = 679
                                                        MourningFontFamily = 'tahoma'
                                                        MourningFontSize = 20
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
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 2:
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 3:
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 4:
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 5:
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 6:
                                                            FuneralX = 63
                                                            FuneralY = 800
                                                            FuneralWidth = 673
                                                            FuneralFontFamily = 'tahoma'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
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
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 1:
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 2:
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 3:
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 4:
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 5:
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            case 6:
                                                                busX = 63
                                                                busY = 873
                                                                busWidth = 656
                                                                busFontFamily = 'tahoma'
                                                                busFontSize = 20
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
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
                                                                            'mortuary',
                                                                            'infotext',
                                                                            'deceased',
                                                                            'extraText',
                                                                            'died',
                                                                            'family',
                                                                            'pray',
                                                                            'mourning',
                                                                            'funeral',
                                                                            'bus',
                                                                        ]

                                                                        if(client == 1 || client == null){
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
                                                                        if(client == 1 || client == null){
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
                }, 150)
            }, 150)
        }, 150)
    }
})