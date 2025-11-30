$(function(){
    hasTransept = true;
    hasLogo = true;
    
    if(!loadFlag){
        setTimeout(() => {
    
            var transeptX = 0;
            var transeptY = 0;
            var transeptScaleX = 0;
            var transeptScaleY = 0;
    
            switch(parseInt(obituaryModel)){
                default:
                    transeptX = 322
                    transeptY = 43
                    transeptScaleX = 0.082
                    transeptScaleY = 0.082
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
                
                setTimeout(() => {
                    var nameLogo = getNameLogo(obituaryType, obituaryModel)
                
                    // Logo
                    // var scaleX = 0.1413074864046407;
                    // var scaleY = 0.14130748640464075;
                    // var x = 531.2380217525749;
                    // var y = 975.8666712690069;
                    var scaleX = 0.12;
                    var scaleY = 0.12;
                    var x = 565;
                    var y = 985;
            
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
                    
                    var mortuaryContactInfo = '';
                    mortuaryContactInfo += obituary.mortuaryAddress != null && obituary.mortuaryAddress != '' ? obituary.mortuaryAddress + '\n' : '\n'
                    mortuaryContactInfo += obituary.mortuaryPostalCode != null && obituary.mortuaryPostalCode != '' ? obituary.mortuaryPostalCode + ' - ' : ' - '
                    mortuaryContactInfo += obituary.mortuaryLocation != null && obituary.mortuaryLocation != '' ? obituary.mortuaryLocation + ', ' : ', '
                    mortuaryContactInfo += obituary.mortuaryProvince != null && obituary.mortuaryProvince != '' ? obituary.mortuaryProvince + '\n' : '\n'
                    mortuaryContactInfo += obituary.mortuaryPhones != null && obituary.mortuaryPhones != '' ? 'Telf: ' + obituary.mortuaryPhones : ''

                    // Datos de contacto
                    var text = mortuaryContactInfo
                    var x = 25
                    var y = 1021
                    var fill = '#6f6f6e'
                    var fontFamily = 'helvetica'
                    var fontSize = 15
                    var align = 'center'
                    var lineHeight = 1.5
                    var fontStyle = 'normal'
                    var width = 749; 
    
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

                        // Titulo - Datos de contacto
                        var text = (obituaryType == '0' ? 'Dirección Tanatorio:' : obituaryType == '1' ? 'Direcció del Tanatori:' : '')
                        var x = 25
                        var y = 996
                        var fill = '#6f6f6e'
                        var fontFamily = 'helvetica'
                        var fontSize = 15
                        var align = 'center'
                        var lineHeight = 1.5
                        var fontStyle = 'bold'
                        var width = 749; 
        
                        var optionsTitleContact = {
                            x: x,
                            y: y,
                            width: width,
                            name: 'text',
                            id: 'contact-title',
                            draggable: true,
                            fill: fill,
                            opacity: 1
                        }
            
                        var styleTitleContact = {
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
                            // Draw Title - Contact
                            drawText(optionsTitleContact, styleTitleContact)
    
                            var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;
                            switch(parseInt(obituaryModel)){
                                default:
                                    var x = (obituaryType == '0' ? 298 : obituaryType == '1' ? 272 : 298)
                                    var y = 834
                                    var text = mortuaryName
                                    var fontSize = 18
                                    var fontStyle = 'normal'
                                    var fontFamily = 'helvetica'
                                    var fill = '#6f6f6e'
                                    var width = 373
                                    var align = 'left';
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
                                lineHeight: 1.5,
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
                                        default:
                                            quoteX = 26
                                            quoteY = 207
                                            quoteWidth = 750
                                            quoteFontFamily = 'helvetica'
                                            quoteFontSize = 16
                                            quoteFontStyle = 'bold'
                                            quoteAlign = 'center'
                                            quoteLineHeight = 1
                                            quoteText = obituary.prayForText + ' ' + obituary.prayForGenre
                                            fill = '#6f6f6e'
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
                                        default:
                                            deceasedX = 20
                                            deceasedY = 243
                                            deceasedWidth = 750
                                            deceasedFontFamily = 'helvetica'
                                            deceasedFontSize = 35
                                            deceasedFontStyle = 'bold'
                                            deceasedAlign = 'center'
                                            deceasedLineHeight = 1
                                            fill = '#6f6f6e'
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
                                            default:
                                                extraTextX = 27
                                                extraTextY = 285
                                                extraTextWidth = 750
                                                extraTextFontFamily = 'helvetica'
                                                extraTextFontSize = 16
                                                extraTextFontStyle = 'normal'
                                                extraTextAlign = 'center'
                                                extraTextLineHeight = 1
                                                fill = '#6f6f6e'
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
                                                default:
                                                    widowX = 27
                                                    widowY = 309
                                                    widowWidth = 745
                                                    widowFontFamily = 'helvetica'
                                                    widowFontSize = 16
                                                    widowFontStyle = 'normal'
                                                    widowAlign = 'center'
                                                    widowLineHeight = 1
                                                    fill = '#6f6f6e'
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
                                                    default:
                                                        diedX = 134
                                                        diedY = 345
                                                        diedWidth = 535
                                                        diedFontFamily = 'helvetica'
                                                        diedFontSize = 16
                                                        diedFontStyle = 'normal'
                                                        diedAlign = 'center'
                                                        diedLineHeight = 1.25
                                                        fill = '#6f6f6e'
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
            
                                                var diedText = '';
                                                var obituaryDied = replaceAllCustom(obituary.died, '\\', '');
                                                var auxText = obituaryDied.split(',')
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
                                                        default:
                                                            depX = 24
                                                            depY = 409
                                                            depWidth = 745
                                                            depFontFamily = 'helvetica'
                                                            depFontSize = 24
                                                            depFontStyle = 'bold'
                                                            depAlign = 'center'
                                                            depLineHeight = 1
                                                            fill = '#6f6f6e'
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
                                                            default:
                                                                familyX = 75
                                                                familyY = 492
                                                                familyWidth = 650
                                                                familyFontFamily = 'helvetica'
                                                                familyFontSize = 27
                                                                familyFontStyle = 'normal'
                                                                familyAlign = 'justify'
                                                                familyLineHeight = 1.25
                                                                fill = '#6f6f6e'
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
            
                                                        var family =  '';
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
                                                        family += obituary.siblings == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'germans, ' : 'hermanos, ') : ''
                                                        family += obituary.politicalSiblings == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'germans polítics, ' : 'hermanos políticos, ') : ''
                                                        family += obituary.grandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'nets, ' : 'nietos, ') : ''
                                                        family += obituary.politicalGrandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'nets polítics, ' : 'nietos políticos, ') : ''
                                                        family += obituary.greatGrandchildren == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'besnets, ' : 'bisnietos, ') : ''
                                                        family += obituary.uncles == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'oncles, ' : 'hermanos, ') : ''
                                                        family += obituary.nephews == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'nebots, ' : 'sobrinos, ') : ''
                                                        family += obituary.cousins == 1 ? (obituaryType == '1' || obituaryType == '6' ? 'cosins, ' : 'primos, ') : ''
                                                        if(family.length > 0){
                                                            family = family.slice(0, -2);
                                                        }
                                                        family += ' ' + obituary.restFamily
                                                        family = family.charAt(0).toUpperCase() + family.slice(1);
            
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
                                                                default:
                                                                    prayX = 75
                                                                    prayY = 630
                                                                    prayWidth = 650
                                                                    prayFontFamily = 'helvetica'
                                                                    prayFontSize = 23
                                                                    prayFontStyle = 'normal'
                                                                    prayAlign = 'justify'
                                                                    prayLineHeight = 1.25
                                                                    fill = '#6f6f6e'
                                                                break
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
                                                                    default:
                                                                        MourningX = 75
                                                                        MourningY = 458
                                                                        MourningWidth = 643
                                                                        MourningFontFamily = 'helvetica'
                                                                        MourningFontSize = 24
                                                                        MourningFontStyle = 'bold'
                                                                        MourningAlign = 'left'
                                                                        MourningLineHeight = 1.25
                                                                        fill = '#6f6f6e'
                                                                    break
                                                                }
                
                                                                // Pre-text family
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
                                                                    text: (obituaryType == '0' ? 'Sus afligidos:' : obituaryType == '1' ? 'Els seus afligits:' : ''),
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
                                                                        default:
                                                                            FuneralX = 75
                                                                            FuneralY = 908
                                                                            FuneralWidth = 650
                                                                            FuneralFontFamily = 'helvetica'
                                                                            FuneralFontSize = 16
                                                                            FuneralFontStyle = 'normal'
                                                                            FuneralAlign = 'left'
                                                                            FuneralLineHeight = 1.25
                                                                            fill = '#6f6f6e'
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
                                                                            default:
                                                                                busX = 75
                                                                                busY = 932
                                                                                busWidth = 650
                                                                                busFontFamily = 'helvetica'
                                                                                busFontSize = 16
                                                                                busFontStyle = 'normal'
                                                                                busAlign = 'left'
                                                                                busLineHeight = 1.25
                                                                                fill = '#6f6f6e'
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

                                                                            // Ceremony label
                                                                            switch(parseInt(obituaryModel)){
                                                                                default:
                                                                                    var ceremonyLabelX = 75
                                                                                    var ceremonyLabelY = 765
                                                                                    var ceremonyLabelWidth = (obituaryType == '0' ? 197 : obituaryType == '1' ? 223 : 197)
                                                                                    var ceremonyLabelFontFamily = 'helvetica'
                                                                                    var ceremonyLabelFontSize = 18
                                                                                    var ceremonyLabelFontStyle = 'bold'
                                                                                    var ceremonyLabelAlign = 'left'
                                                                                    var ceremonyLabelLineHeight = 1.5
                                                                                    var fill = '#6f6f6e'
                                                                                break
                                                                            }
                
                                                                            // Ceremony label
                                                                            var optionsCeremonyLabel = {
                                                                                x: ceremonyLabelX,
                                                                                y: ceremonyLabelY,
                                                                                width: ceremonyLabelWidth,
                                                                                name: 'text',
                                                                                id: 'ceremonyLabel',
                                                                                draggable: true,
                                                                                fill: fill,
                                                                                opacity: 1
                                                                            }
                
                                                                            var styleCeremonyLabel = {
                                                                                fontFamily: ceremonyLabelFontFamily,
                                                                                fontSize: ceremonyLabelFontSize,
                                                                                fontStyle: ceremonyLabelFontStyle,
                                                                                fontVariant: 'normal',
                                                                                textDecoration: 'empty string',
                                                                                text: (obituaryType == '0' ? 'Lugar de la Ceremonia:' : obituaryType == '1' ? 'La ceremonia tindrà lloc a:' : 'Lugar de la Ceremonia:'),
                                                                                align: ceremonyLabelAlign,
                                                                                verticalAlign: 'top',
                                                                                padding: 0,
                                                                                lineHeight: ceremonyLabelLineHeight,
                                                                                wrap: 'word',
                                                                                ellipsis: false
                                                                            }

                                                                            setTimeout(() => {
                                                                                drawText(optionsCeremonyLabel, styleCeremonyLabel)

                                                                                // Ceremony info
                                                                                switch(parseInt(obituaryModel)){
                                                                                    default:
                                                                                        var ceremonyInfoX = (obituaryType == '0' ? 272 : obituaryType == '1' ? 298 : 272) 
                                                                                        var ceremonyInfoY = 765
                                                                                        var ceremonyInfoWidth = 446
                                                                                        var ceremonyInfoFontFamily = 'helvetica'
                                                                                        var ceremonyInfoFontSize = 18
                                                                                        var ceremonyInfoFontStyle = 'normal'
                                                                                        var ceremonyInfoAlign = 'left'
                                                                                        var ceremonyInfoLineHeight = 1.5
                                                                                        var fill = '#6f6f6e'
                                                                                    break
                                                                                }
                    
                                                                                // Ceremony label
                                                                                var optionsCeremonyInfo = {
                                                                                    x: ceremonyInfoX,
                                                                                    y: ceremonyInfoY,
                                                                                    width: ceremonyInfoWidth,
                                                                                    name: 'text',
                                                                                    id: 'ceremonyInfo',
                                                                                    draggable: true,
                                                                                    fill: fill,
                                                                                    opacity: 1
                                                                                }
                    
                                                                                var ceremonyPlace = obituary.churchLabel != null ? obituary.churchLabel : '';
                                                                                ceremonyPlace += obituary.churchName != null ? ' ' + obituary.churchName : '';

                                                                                var styleCeremonyInfo = {
                                                                                    fontFamily: ceremonyInfoFontFamily,
                                                                                    fontSize: ceremonyInfoFontSize,
                                                                                    fontStyle: ceremonyInfoFontStyle,
                                                                                    fontVariant: 'normal',
                                                                                    textDecoration: 'empty string',
                                                                                    text: ceremonyPlace,
                                                                                    align: ceremonyInfoAlign,
                                                                                    verticalAlign: 'top',
                                                                                    padding: 0,
                                                                                    lineHeight: ceremonyInfoLineHeight,
                                                                                    wrap: 'word',
                                                                                    ellipsis: false
                                                                                }

                                                                                setTimeout(() => {
                                                                                    drawText(optionsCeremonyInfo, styleCeremonyInfo)

                                                                                    // Ceremony hour label
                                                                                    switch(parseInt(obituaryModel)){
                                                                                        default:
                                                                                            var CeremonyHourLabelX = 75
                                                                                            var CeremonyHourLabelY = 800
                                                                                            var CeremonyHourLabelWidth = (obituaryType == '0' ? 123 : obituaryType == '1' ? 106 : 123) 
                                                                                            var CeremonyHourLabelFontFamily = 'helvetica'
                                                                                            var CeremonyHourLabelFontSize = 18
                                                                                            var CeremonyHourLabelFontStyle = 'bold'
                                                                                            var CeremonyHourLabelAlign = 'left'
                                                                                            var CeremonyHourLabelLineHeight = 1.5
                                                                                            var fill = '#6f6f6e'
                                                                                        break
                                                                                    }
                        
                                                                                    var optionsCeremonyHourLabel = {
                                                                                        x: CeremonyHourLabelX,
                                                                                        y: CeremonyHourLabelY,
                                                                                        width: CeremonyHourLabelWidth,
                                                                                        name: 'text',
                                                                                        id: 'ceremonyHourLabel',
                                                                                        draggable: true,
                                                                                        fill: fill,
                                                                                        opacity: 1
                                                                                    }
                        
                                                                                    var styleCeremonyHourLabel = {
                                                                                        fontFamily: CeremonyHourLabelFontFamily,
                                                                                        fontSize: CeremonyHourLabelFontSize,
                                                                                        fontStyle: CeremonyHourLabelFontStyle,
                                                                                        fontVariant: 'normal',
                                                                                        textDecoration: 'empty string',
                                                                                        text: (obituaryType == '0' ? 'Fecha y Hora:' : obituaryType == '1' ? 'Data i Hora:' : 'Fecha y Hora:'),
                                                                                        align: CeremonyHourLabelAlign,
                                                                                        verticalAlign: 'top',
                                                                                        padding: 0,
                                                                                        lineHeight: CeremonyHourLabelLineHeight,
                                                                                        wrap: 'word',
                                                                                        ellipsis: false
                                                                                    }

                                                                                    setTimeout(() => {
                                                                                        drawText(optionsCeremonyHourLabel, styleCeremonyHourLabel)

                                                                                        // Ceremony info
                                                                                        switch(parseInt(obituaryModel)){
                                                                                            default:
                                                                                                var CeremonyHourInfoX = (obituaryType == '0' ? 200 : obituaryType == '1' ? 180 : 200)
                                                                                                var CeremonyHourInfoY = 801
                                                                                                var CeremonyHourInfoWidth = 535
                                                                                                var CeremonyHourInfoFontFamily = 'helvetica'
                                                                                                var CeremonyHourInfoFontSize = 18
                                                                                                var CeremonyHourInfoFontStyle = 'normal'
                                                                                                var CeremonyHourInfoAlign = 'left'
                                                                                                var CeremonyHourInfoLineHeight = 1.5
                                                                                                var fill = '#6f6f6e'
                                                                                            break
                                                                                        }
                            
                                                                                        var optionsCeremonyHourInfo = {
                                                                                            x: CeremonyHourInfoX,
                                                                                            y: CeremonyHourInfoY,
                                                                                            width: CeremonyHourInfoWidth,
                                                                                            name: 'text',
                                                                                            id: 'ceremonyHourInfo',
                                                                                            draggable: true,
                                                                                            fill: fill,
                                                                                            opacity: 1
                                                                                        }
                            
                                                                                        var ceremonyInfoText = '';
                                                                                        if(obituary.ceremonyDate != null && obituary.ceremonyDate != ''){
                                                                                            if(obituaryType == '1'){ // Catalan
                                                                                                moment.locale('ca');
                                                                                                var ceremonyDateAux =  moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                                                                                                if(ceremonyDateAux.length == 9){
                                                                                                    ceremonyInfoText = ceremonyDateAux[1] + ' dia ' + ceremonyDateAux[2] + ' ' + ceremonyDateAux[3] + ', a les ' + moment(obituary.ceremonyTime, 'HH:mm:ss').format('HH:mm') + ' hores';
                                                                                                }else{
                                                                                                    ceremonyInfoText = ceremonyDateAux[1] + ' dia ' + ceremonyDateAux[2] + ' de ' + ceremonyDateAux[4] + ', a les ' + moment(obituary.ceremonyTime, 'HH:mm:ss').format('HH:mm') + ' hores';
                                                                                                }
                                                                                            }else{
                                                                                                var ceremonyDateAux =  moment(moment(obituary.ceremonyDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                                                                                                ceremonyInfoText = ceremonyDateAux[0].slice(0,-1) + ' día ' + ceremonyDateAux[1] + ' de ' + ceremonyDateAux[3] + ', a las ' + moment(obituary.ceremonyTime, 'HH:mm:ss').format('HH:mm') + ' horas';
                                                                                            }
                                                                                            ceremonyInfoText = ceremonyInfoText.charAt(0).toUpperCase() + ceremonyInfoText.slice(1);
                                                                                        }

                                                                                        var styleCeremonyHourInfo = {
                                                                                            fontFamily: CeremonyHourInfoFontFamily,
                                                                                            fontSize: CeremonyHourInfoFontSize,
                                                                                            fontStyle: CeremonyHourInfoFontStyle,
                                                                                            fontVariant: 'normal',
                                                                                            textDecoration: 'empty string',
                                                                                            text: ceremonyInfoText,
                                                                                            align: CeremonyHourInfoAlign,
                                                                                            verticalAlign: 'top',
                                                                                            padding: 0,
                                                                                            lineHeight: CeremonyHourInfoLineHeight,
                                                                                            wrap: 'word',
                                                                                            ellipsis: false
                                                                                        }

                                                                                        setTimeout(() => {
                                                                                            drawText(optionsCeremonyHourInfo, styleCeremonyHourInfo)

                                                                                            // Mortuary label
                                                                                            switch(parseInt(obituaryModel)){
                                                                                                default:
                                                                                                    var MortuaryLabelX = 75
                                                                                                    var MortuaryLabelY = 834
                                                                                                    var MortuaryLabelWidth = (obituaryType == '0' ? 228 : obituaryType == '1' ? 199 : 228) 
                                                                                                    var MortuaryLabelFontFamily = 'helvetica'
                                                                                                    var MortuaryLabelFontSize = 18
                                                                                                    var MortuaryLabelFontStyle = 'bold'
                                                                                                    var MortuaryLabelAlign = 'left'
                                                                                                    var MortuaryLabelLineHeight = 1.5
                                                                                                    var fill = '#6f6f6e'
                                                                                                break
                                                                                            }
                                
                                                                                            var optionsMortuaryLabel = {
                                                                                                x: MortuaryLabelX,
                                                                                                y: MortuaryLabelY,
                                                                                                width: MortuaryLabelWidth,
                                                                                                name: 'text',
                                                                                                id: 'mortuaryLabel',
                                                                                                draggable: true,
                                                                                                fill: fill,
                                                                                                opacity: 1
                                                                                            }
                                
                                                                                            var styleMortuaryLabel = {
                                                                                                fontFamily: MortuaryLabelFontFamily,
                                                                                                fontSize: MortuaryLabelFontSize,
                                                                                                fontStyle: MortuaryLabelFontStyle,
                                                                                                fontVariant: 'normal',
                                                                                                textDecoration: 'empty string',
                                                                                                text: (obituaryType == '0' ? 'El velatorio se realizará en:' : obituaryType == '1' ? 'El velatori tindrà lloc al:' : 'El velatorio se realizará en:'),
                                                                                                align: MortuaryLabelAlign,
                                                                                                verticalAlign: 'top',
                                                                                                padding: 0,
                                                                                                lineHeight: MortuaryLabelLineHeight,
                                                                                                wrap: 'word',
                                                                                                ellipsis: false
                                                                                            }

                                                                                            setTimeout(() => {
                                                                                                drawText(optionsMortuaryLabel, styleMortuaryLabel)

                                                                                                // Velation label
                                                                                                switch(parseInt(obituaryModel)){
                                                                                                    default:
                                                                                                        var VelationLabelX = 75
                                                                                                        var VelationLabelY = 870
                                                                                                        var VelationLabelWidth = 105 
                                                                                                        var VelationLabelFontFamily = 'helvetica'
                                                                                                        var VelationLabelFontSize = 18
                                                                                                        var VelationLabelFontStyle = 'bold'
                                                                                                        var VelationLabelAlign = 'left'
                                                                                                        var VelationLabelLineHeight = 1.5
                                                                                                        var fill = '#6f6f6e'
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
                                                                                                    textDecoration: 'empty string',
                                                                                                    text: 'A partir de:',
                                                                                                    align: VelationLabelAlign,
                                                                                                    verticalAlign: 'top',
                                                                                                    padding: 0,
                                                                                                    lineHeight: VelationLabelLineHeight,
                                                                                                    wrap: 'word',
                                                                                                    ellipsis: false
                                                                                                }

                                                                                                setTimeout(() => {
                                                                                                    drawText(optionsVelationLabel, styleVelationLabel)

                                                                                                    // Ceremony info
                                                                                                    switch(parseInt(obituaryModel)){
                                                                                                        default:
                                                                                                            var VelationHourInfoX = 175
                                                                                                            var VelationHourInfoY = 870
                                                                                                            var VelationHourInfoWidth = 535
                                                                                                            var VelationHourInfoFontFamily = 'helvetica'
                                                                                                            var VelationHourInfoFontSize = 18
                                                                                                            var VelationHourInfoFontStyle = 'normal'
                                                                                                            var VelationHourInfoAlign = 'left'
                                                                                                            var VelationHourInfoLineHeight = 1.5
                                                                                                            var fill = '#6f6f6e'
                                                                                                        break
                                                                                                    }
                                        
                                                                                                    var optionsVelationHourInfo = {
                                                                                                        x: VelationHourInfoX,
                                                                                                        y: VelationHourInfoY,
                                                                                                        width: VelationHourInfoWidth,
                                                                                                        name: 'text',
                                                                                                        id: 'velationInfo',
                                                                                                        draggable: true,
                                                                                                        fill: fill,
                                                                                                        opacity: 1
                                                                                                    }
                                        
                                                                                                    var velacionInfoText = '';
                                                                                                    if(obituary.startVelacionDate != null && obituary.startVelacionDate != ''){
                                                                                                        if(obituaryType == '1'){ // Catalan
                                                                                                            moment.locale('ca');
                                                                                                            var velacionDateAux =  moment(moment(obituary.startVelacionDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                                                                                                            if(velacionDateAux.length == 9){
                                                                                                                velacionInfoText = velacionDateAux[1] + ' dia ' + velacionDateAux[2] + ' ' + velacionDateAux[3] + ', a les ' + moment(obituary.startVelacionTime, 'HH:mm:ss').format('HH:mm') + ' hores';
                                                                                                            }else{
                                                                                                                velacionInfoText = velacionDateAux[1] + ' dia ' + velacionDateAux[2] + ' de ' + velacionDateAux[4] + ', a les ' + moment(obituary.startVelacionTime, 'HH:mm:ss').format('HH:mm') + ' hores';
                                                                                                            }
                                                                                                        }else{
                                                                                                            var velacionDateAux =  moment(moment(obituary.startVelacionDate, "YYYY-MM-DD").format("X"), "X").format('LLLL').split(' ');
                                                                                                            velacionInfoText = velacionDateAux[0].slice(0,-1) + ' día ' + velacionDateAux[1] + ' de ' + velacionDateAux[3] + ', a las ' + moment(obituary.startVelacionTime, 'HH:mm:ss').format('HH:mm') + ' horas';
                                                                                                        }
    
                                                                                                        velacionInfoText = velacionInfoText.charAt(0).toUpperCase() + velacionInfoText.slice(1);
                                                                                                    }

                                                                                                    var styleVelationHourInfo = {
                                                                                                        fontFamily: VelationHourInfoFontFamily,
                                                                                                        fontSize: VelationHourInfoFontSize,
                                                                                                        fontStyle: VelationHourInfoFontStyle,
                                                                                                        fontVariant: 'normal',
                                                                                                        textDecoration: 'empty string',
                                                                                                        text: velacionInfoText,
                                                                                                        align: VelationHourInfoAlign,
                                                                                                        verticalAlign: 'top',
                                                                                                        padding: 0,
                                                                                                        lineHeight: VelationHourInfoLineHeight,
                                                                                                        wrap: 'word',
                                                                                                        ellipsis: false
                                                                                                    }

                                                                                                    setTimeout(() => {
                                                                                                        drawText(optionsVelationHourInfo, styleVelationHourInfo)

                                                                                                        // Ceremony info
                                                                                                        switch(parseInt(obituaryModel)){
                                                                                                            default:
                                                                                                                var LinkWebX = 25
                                                                                                                var LinkWebY = 965
                                                                                                                var LinkWebWidth = 749
                                                                                                                var LinkWebFontFamily = 'helvetica'
                                                                                                                var LinkWebFontSize = 19
                                                                                                                var LinkWebFontStyle = 'bold'
                                                                                                                var LinkWebAlign = 'center'
                                                                                                                var LinkWebLineHeight = 1.25
                                                                                                                var fill = '#d95f86'
                                                                                                            break
                                                                                                        }
                                            
                                                                                                        var optionsLinkWeb = {
                                                                                                            x: LinkWebX,
                                                                                                            y: LinkWebY,
                                                                                                            width: LinkWebWidth,
                                                                                                            name: 'text',
                                                                                                            id: 'linkWeb',
                                                                                                            draggable: false,
                                                                                                            fill: fill,
                                                                                                            opacity: 1
                                                                                                        }

                                                                                                        var styleLinkWeb = {
                                                                                                            fontFamily: LinkWebFontFamily,
                                                                                                            fontSize: LinkWebFontSize,
                                                                                                            fontStyle: LinkWebFontStyle,
                                                                                                            fontVariant: 'normal',
                                                                                                            textDecoration: 'empty string',
                                                                                                            text: 'www.pompasfunebresibiza.es',
                                                                                                            align: LinkWebAlign,
                                                                                                            verticalAlign: 'top',
                                                                                                            padding: 0,
                                                                                                            lineHeight: LinkWebLineHeight,
                                                                                                            wrap: 'word',
                                                                                                            ellipsis: false
                                                                                                        }

                                                                                                        setTimeout(() => {
                                                                                                            drawText(optionsLinkWeb, styleLinkWeb)

                                                                                                            var optionsRectangleProfile = {
                                                                                                                x: 46,
                                                                                                                y: 46.55,
                                                                                                                width: 100,
                                                                                                                height: 100,
                                                                                                                name: 'figure',
                                                                                                                id: 'addFigure' + addFigureIndex,
                                                                                                                draggable: true,
                                                                                                                fill: '#FFFFFF',
                                                                                                                stroke: '#d96086',
                                                                                                                strokeWidth: 3,
                                                                                                                opacity: 1,
                                                                                                                rotation: null,
                                                                                                                scaleX: 1.37,
                                                                                                                scaleY: 1.57
                                                                                                            }
                                                                                                        
                                                                                                            setTimeout(() => {
                                                                                                                drawRectangle(optionsRectangleProfile)
                                                                                                                addFigureIndex++

                                                                                                                var optionsRectangleQR = {
                                                                                                                    x: 46,
                                                                                                                    y: 950,
                                                                                                                    width: 100,
                                                                                                                    height: 100,
                                                                                                                    name: 'figure',
                                                                                                                    id: 'addFigure' + addFigureIndex,
                                                                                                                    draggable: true,
                                                                                                                    fill: '#FFFFFF',
                                                                                                                    stroke: '#d96086',
                                                                                                                    strokeWidth: 3,
                                                                                                                    opacity: 1,
                                                                                                                    rotation: null,
                                                                                                                    scaleX: 1.344,
                                                                                                                    scaleY: 1.344
                                                                                                                }
                                                                                                            
                                                                                                                setTimeout(() => {
                                                                                                                    drawRectangle(optionsRectangleQR)
                                                                                                                    addFigureIndex++

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
                                                                                                                                    'contact-title',
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
                                                                                                                                    'ceremonyLabel',
                                                                                                                                    'ceremonyInfo',
                                                                                                                                    'ceremonyHourLabel',
                                                                                                                                    'ceremonyHourInfo',
                                                                                                                                    'mortuaryLabel',
                                                                                                                                    'velationLabel',
                                                                                                                                    'velationInfo',
                                                                                                                                    'linkWeb',
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
                                                                                                                }, 75)
                                                                                                            }, 75)
                                                                                                        }, 75)
                                                                                                    }, 75)
                                                                                                }, 75)
                                                                                            }, 75)
                                                                                        }, 75)
                                                                                    }, 75)
                                                                                }, 75)
                                                                            }, 75)
                                                                        }, 75)
                                                                    }, 75)
                                                                }, 75)
                                                            }, 75)
                                                        }, 75)
                                                    }, 75)
                                                }, 75)
                                            }, 75)
                                        }, 75)
                                    }, 75)
                                }, 75)
                            }, 75)
                        }, 75)
                    }, 75)
                }, 75)
            }, 75);
        }, 75)
    }
})

/**
 * Replace all
 * 
 * @param {string} string String
 * @param {string} search Search
 * @param {string} replace 
 */
function replaceAllCustom(string, search, replace){
    return string.split(search).join(replace);
}