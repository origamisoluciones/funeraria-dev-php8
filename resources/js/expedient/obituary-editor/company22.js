$(function(){
    hasTransept = false;
    hasLogo = false;
    
    if(!loadFlag){
            
        setTimeout(() => {

            var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;

            switch(parseInt(obituaryModel)){
                case 0:
                    var x = 120
                    var y = 720
                    var text = 'El cadáver se vela en el ' + (mortuaryName == null ? '' : mortuaryName.toUpperCase()) + ' (SALA ' + obituary.roomNumber + ') y será inhumado en el cementerio de ' + (obituary.cemeteryName == null ? '' : obituary.cemeteryName.toUpperCase());  
                    var fontSize = 17
                    var fontStyle = 'normal'
                    var fontFamily = 'arial'
                    var fill = '#000000'
                    var width = 540
                    var align = 'justify';
                break;
                default:
                    var x = 120
                    var y = 720
                    var text = 'El cadáver se vela en el ' + (mortuaryName == null ? '' : mortuaryName.toUpperCase()) + ' (SALA ' + obituary.roomNumber + ') y será inhumado en el cementerio de ' + (obituary.cemeteryName == null ? '' : obituary.cemeteryName.toUpperCase());  
                    var fontSize = 17
                    var fontStyle = 'normal'
                    var fontFamily = 'arial'
                    var fill = '#000000'
                    var width = 540
                    var align = 'justify';
                break;
            }

            // Tanatorio
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
                lineHeight: 1.25,
                wrap: 'word',
                ellipsis: false,
                align: align,
            }
            
            setTimeout(() => {
                // Draw Mortuary
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
                            quoteX = 130
                            quoteY = 295
                            quoteWidth = 525
                            quoteFontFamily = 'arial'
                            quoteFontSize = 17
                            quoteFontStyle = 'normal'
                            quoteAlign = 'center'
                            quoteLineHeight = 1
                            quoteText = obituary.prayForText
                            fill = '#000000'
                        break
                        default:
                            quoteX = 130
                            quoteY = 295
                            quoteWidth = 525
                            quoteFontFamily = 'arial'
                            quoteFontSize = 17
                            quoteFontStyle = 'normal'
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
                            deceasedX = 124
                            deceasedY = 340
                            deceasedWidth = 536
                            deceasedFontFamily = 'arial'
                            deceasedFontSize = 32
                            deceasedFontStyle = 'bold'
                            deceasedAlign = 'center'
                            deceasedLineHeight = 1
                            fill = '#000000'
                        break
                        default:
                            deceasedX = 124
                            deceasedY = 340
                            deceasedWidth = 536
                            deceasedFontFamily = 'arial'
                            deceasedFontSize = 32
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
                                extraTextX = 130
                                extraTextY = 370
                                extraTextWidth = 525
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 17
                                extraTextFontStyle = 'italic'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1
                                fill = '#000000'
                            break
                            default:
                                extraTextX = 130
                                extraTextY = 370
                                extraTextWidth = 525
                                extraTextFontFamily = 'arial'
                                extraTextFontSize = 17
                                extraTextFontStyle = 'italic'
                                extraTextAlign = 'center'
                                extraTextLineHeight = 1
                                fill = '#000000'
                            break
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
                                    widowX = 130
                                    widowY = 370
                                    widowWidth = 525
                                    widowFontFamily = 'arial'
                                    widowFontSize = 17
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1
                                    fill = '#000000'
                                break
                                default:
                                    widowX = 130
                                    widowY = 370
                                    widowWidth = 525
                                    widowFontFamily = 'arial'
                                    widowFontSize = 17
                                    widowFontStyle = 'normal'
                                    widowAlign = 'center'
                                    widowLineHeight = 1
                                    fill = '#000000'
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
                                        diedX = 120
                                        diedY = 390
                                        diedWidth = 540
                                        diedFontFamily = 'arial'
                                        diedFontSize = 16
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    default:
                                        diedX = 120
                                        diedY = 390
                                        diedWidth = 540
                                        diedFontFamily = 'arial'
                                        diedFontSize = 16
                                        diedFontStyle = 'normal'
                                        diedAlign = 'center'
                                        diedLineHeight = 1
                                        fill = '#000000'
                                    break
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
                                            depX = 120
                                            depY = 455
                                            depWidth = 538
                                            depFontFamily = 'arial'
                                            depFontSize = 18
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        default:
                                            depX = 120
                                            depY = 455
                                            depWidth = 538
                                            depFontFamily = 'arial'
                                            depFontSize = 18
                                            depFontStyle = 'bold'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
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
                                                familyX = 120
                                                familyY = 490
                                                familyWidth = 540
                                                familyFontFamily = 'arial'
                                                familyFontSize = 20
                                                familyFontStyle = 'normal'
                                                familyAlign = 'justify'
                                                familyLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            default:
                                                familyX = 120
                                                familyY = 490
                                                familyWidth = 540
                                                familyFontFamily = 'arial'
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
                                                    prayX = 120
                                                    prayY = 595
                                                    prayWidth = 540
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 17
                                                    prayFontStyle = 'normal'
                                                    prayAlign = 'justify'
                                                    prayLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                default:
                                                    prayX = 120
                                                    prayY = 595
                                                    prayWidth = 540
                                                    prayFontFamily = 'arial'
                                                    prayFontSize = 17
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
                                                        MourningX = 120
                                                        MourningY = 880
                                                        MourningWidth = 540
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 17
                                                        MourningFontStyle = 'normal'
                                                        MourningAlign = 'center'
                                                        MourningLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    default:
                                                        MourningX = 120
                                                        MourningY = 880
                                                        MourningWidth = 540
                                                        MourningFontFamily = 'arial'
                                                        MourningFontSize = 17
                                                        MourningFontStyle = 'normal'
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
                                                            FuneralX = 120
                                                            FuneralY = 930
                                                            FuneralWidth = 540
                                                            FuneralFontFamily = 'arial'
                                                            FuneralFontSize = 17
                                                            FuneralFontStyle = 'normal'
                                                            FuneralAlign = 'justify'
                                                            FuneralLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        default:
                                                            FuneralX = 120
                                                            FuneralY = 930
                                                            FuneralWidth = 540
                                                            FuneralFontFamily = 'arial'
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
                                                                busX = 120
                                                                busY = 1020
                                                                busWidth = 540
                                                                busFontFamily = 'arial'
                                                                busFontSize = 17
                                                                busFontStyle = 'normal'
                                                                busAlign = 'justify'
                                                                busLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            default:
                                                                busX = 120
                                                                busY = 1020
                                                                busWidth = 540
                                                                busFontFamily = 'arial'
                                                                busFontSize = 17
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

                                                            // Localidad y fecha
                                                            var text = obituary.location + ', ' + moment().format("MMMM").toUpperCase() + ' DE ' +  moment().format("YYYY")
                                                            var x = 120
                                                            var y = 850
                                                            var fill = '#000000'
                                                            var fontFamily = 'arial'
                                                            var fontSize = 17
                                                            var align = 'right'
                                                            var lineHeight = 1
                                                            var fontStyle = 'normal'
                                                            var width = 540; 
                                            
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
           
    }
})