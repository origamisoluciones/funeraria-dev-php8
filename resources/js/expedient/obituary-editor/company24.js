$(function(){
    hasTransept = true;
    hasLogo = true;
    
    if(!loadFlag){

        var transeptX = 0;
        var transeptY  = 0;
        var transeptScaleX  = 0;
        var transeptScaleY  = 0;

        switch(parseInt(obituaryModel)){
            default:
                transeptX = 60
                transeptY = 76.67
                transeptScaleX = 0.055
                transeptScaleY = 0.058
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
            src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/transept.png',
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

            var nameLogo = getNameLogo(obituaryType, obituaryModel)
                
            // Logo
            var scaleX = 0.035475428903751084
            var scaleY = 0.038342245989304906
            var x = 85
            var y = 985
    
            var optionsLogo = {
                x: x,
                y: y,
                width: null,
                height: null,
                id: 'logo',
                draggable: true,
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

                setTimeout(() => {

                    var mortuaryName = 'Capilla Ardiente. - ' + (obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary) + '. Sala ' + (obituary.roomNumber != null ? obituary.roomNumber : '-') + '.';

                    switch(parseInt(obituaryModel)){
                        case 0:
                            var x = 120
                            var y = 841
                            var fontSize = 23
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 540
                            var align = 'justify';
                        break;
                        default:
                            var x = 120
                            var y = 841
                            var fontSize = 23
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
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
                        textDecoration: 'underline',
                        text: mortuaryName,
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
                                    quoteX = 200
                                    quoteY = 117
                                    quoteWidth = 372
                                    quoteFontFamily = 'times new roman'
                                    quoteFontSize = 34
                                    quoteFontStyle = 'bold'
                                    quoteAlign = 'center'
                                    quoteLineHeight = 1
                                    quoteText = obituary.prayForText
                                    fill = '#000000'
                                break
                                default:
                                    quoteX = 200
                                    quoteY = 117
                                    quoteWidth = 372
                                    quoteFontFamily = 'times new roman'
                                    quoteFontSize = 34
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
                                    deceasedX = 147
                                    deceasedY = 156
                                    deceasedWidth = 514
                                    deceasedFontFamily = 'times new roman'
                                    deceasedFontSize = 55
                                    deceasedFontStyle = 'bold'
                                    deceasedAlign = 'center'
                                    deceasedLineHeight = 1.25
                                    fill = '#000000'
                                break
                                default:
                                    deceasedX = 147
                                    deceasedY = 156
                                    deceasedWidth = 514
                                    deceasedFontFamily = 'times new roman'
                                    deceasedFontSize = 55
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
                                        extraTextX = 167
                                        extraTextY = 295
                                        extraTextWidth = 495
                                        extraTextFontFamily = 'times new roman italic'
                                        extraTextFontSize = 22
                                        extraTextFontStyle = 'normal'
                                        extraTextAlign = 'center'
                                        extraTextLineHeight = 1
                                        fill = '#000000'
                                    break
                                    default:
                                        extraTextX = 167
                                        extraTextY = 295
                                        extraTextWidth = 495
                                        extraTextFontFamily = 'times new roman italic'
                                        extraTextFontSize = 22
                                        extraTextFontStyle = 'normal'
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
                                            widowX = 167
                                            widowY = 323
                                            widowWidth = 495
                                            widowFontFamily = 'times new roman italic'
                                            widowFontSize = 21
                                            widowFontStyle = 'normal'
                                            widowAlign = 'center'
                                            widowLineHeight = 1
                                            fill = '#000000'
                                        break
                                        default:
                                            widowX = 167
                                            widowY = 323
                                            widowWidth = 495
                                            widowFontFamily = 'times new roman italic'
                                            widowFontSize = 21
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
                                                diedY = 370
                                                diedWidth = 540
                                                diedFontFamily = 'times new roman'
                                                diedFontSize = 23
                                                diedFontStyle = 'normal'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            default:
                                                diedX = 120
                                                diedY = 370
                                                diedWidth = 540
                                                diedFontFamily = 'times new roman'
                                                diedFontSize = 23
                                                diedFontStyle = 'normal'
                                                diedAlign = 'center'
                                                diedLineHeight = 1.25
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
                                                    depY = 450
                                                    depWidth = 538
                                                    depFontFamily = 'times new roman'
                                                    depFontSize = 22
                                                    depFontStyle = 'bold'
                                                    depAlign = 'center'
                                                    depLineHeight = 1
                                                    fill = '#000000'
                                                break;
                                                default:
                                                    depX = 120
                                                    depY = 450
                                                    depWidth = 538
                                                    depFontFamily = 'times new roman'
                                                    depFontSize = 22
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
                                                text: obituary.dep == 1 ? 'D. E. P.' : '',
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
                                                        familyY = 495
                                                        familyWidth = 540
                                                        familyFontFamily = 'times new roman'
                                                        familyFontSize = 22
                                                        familyFontStyle = 'normal'
                                                        familyAlign = 'justify'
                                                        familyLineHeight = 1.25
                                                        fill = '#000000'
                                                    break
                                                    default:
                                                        familyX = 120
                                                        familyY = 495
                                                        familyWidth = 540
                                                        familyFontFamily = 'times new roman'
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
                                                            prayY = 610
                                                            prayWidth = 540
                                                            prayFontFamily = 'times new roman'
                                                            prayFontSize = 22
                                                            prayFontStyle = 'normal'
                                                            prayAlign = 'justify'
                                                            prayLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        default:
                                                            prayX = 120
                                                            prayY = 610
                                                            prayWidth = 540
                                                            prayFontFamily = 'times new roman'
                                                            prayFontSize = 22
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
                                                                MourningY = 912
                                                                MourningWidth = 540
                                                                MourningFontFamily = 'times new roman'
                                                                MourningFontSize = 21
                                                                MourningFontStyle = 'normal'
                                                                MourningAlign = 'justify'
                                                                MourningLineHeight = 1.25
                                                                fill = '#000000'
                                                            break
                                                            default:
                                                                MourningX = 120
                                                                MourningY = 912
                                                                MourningWidth = 540
                                                                MourningFontFamily = 'times new roman'
                                                                MourningFontSize = 21
                                                                MourningFontStyle = 'normal'
                                                                MourningAlign = 'justify'
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
                                                            text: obituary.funeral,
                                                            align: MourningAlign,
                                                            verticalAlign: 'top',
                                                            padding: 0,
                                                            lineHeight: MourningLineHeight,
                                                            wrap: 'word',
                                                            ellipsis: false
                                                        }

                                                        setTimeout(() => {
                                                            drawText(optionsMourning, styleMourning)
                                                                
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
                                                                    busY = 752
                                                                    busWidth = 540
                                                                    busFontFamily = 'times new roman'
                                                                    busFontSize = 22
                                                                    busFontStyle = 'normal'
                                                                    busAlign = 'justify'
                                                                    busLineHeight = 1.25
                                                                    fill = '#000000'
                                                                break
                                                                default:
                                                                    busX = 120
                                                                    busY = 752
                                                                    busWidth = 540
                                                                    busFontFamily = 'times new roman'
                                                                    busFontSize = 22
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
                                                                text: 'Nota. - ' + obituary.busRoute,
                                                                align: busAlign,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: busLineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }

                                                            setTimeout(() => {
                                                                drawText(optionsBus, styleBus)

                                                                // Tanatorio
                                                                var text ='Crematorio - Tanatorios Luis Iglesias'
                                                                var x = 120
                                                                var y = 1050
                                                                var fill = '#000000'
                                                                var fontFamily = 'times new roman'
                                                                var fontSize = 30
                                                                var align = 'center'
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
                                                                                    'transept',
                                                                                    'logo',
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
                                                                                    'bus',
                                                                                    'contact'
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