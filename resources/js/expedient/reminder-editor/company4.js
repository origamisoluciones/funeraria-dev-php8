function drawReminderEditor(expedientID, obituaryType, obituaryModel, obituary, expedient){

    // Fondo
    var optionsBackground = {
        x: 0,
        y: 0,
        width: null,
        height: null,
        id: 'background',
        draggable: false,
        name: 'image',
        src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/reminder/' + obituaryType + '/' + obituaryModel + '/img/background.jpg',
        mouse: false,
        rotation: null,
        scaleX: 0.68,
        scaleY: 0.68,
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

    drawImage(optionsBackground, expedientID, obituaryType, obituaryModel)
        
    setTimeout(() => {

        //NOMBRE FALLECIDO
        switch(obituaryType){
            case '0':
            case '1':
            case '5':
                var quoteX = 0.5,
                    quoteY = 15
                    quoteWidth = 390
                    quoteFontFamily = 'caslon'
                    quoteFontSize = 14
                    quoteFontStyle = ''
                    quoteAlign = 'center'
                    quoteLineHeight = 1
                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre;
                    quoteFill = '#00305c'
            break;
        }
        
        // Cita
        var optionsQuote = {
            x: quoteX,
            y: quoteY,
            width: quoteWidth,
            name: 'text',
            id: 'quote',
            draggable: true,
            fill: quoteFill,
            opacity: 1
        }

        var styleQuote = {
            fontFamily: quoteFontFamily,
            fontSize: quoteFontSize,
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

            //NOMBRE FALLECIDO
            switch(obituaryType){
                case '0':
                case '1':
                case '5':
                    var deceasedX = 0.5
                        deceasedY = 50
                        deceasedWidth = 390
                        deceasedFontFamily = 'garamonditalic'
                        deceasedFontSize = 28
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1;
                        deceasedFill = '#00305c'
                break;
            }

            // Fallecido
            var optionsDeceased = {
                x: deceasedX,
                y: deceasedY,
                width: deceasedWidth,
                name: 'text',
                id: 'deceased',
                draggable: true,
                fill: deceasedFill,
                opacity: 1
            }

            var deceasedNameValue = obituary.namePre + ' ' + obituary.name + ' ' + obituary.surname; 
            var styleDeceased = {
                fontFamily: deceasedFontFamily,
                fontSize: deceasedFontSize,
                fontStyle: deceasedFontStyle,
                fontVariant: 'normal',
                textDecoration: 'empty string',
                text: deceasedNameValue,
                align: deceasedAlign,
                verticalAlign: 'top',
                padding: 0,
                lineHeight: deceasedLineHeight,
                wrap: 'word',
                ellipsis: false
            }

            setTimeout(() => {
                drawText(optionsDeceased, styleDeceased)

                //TEXTO EXTRA
                switch(obituaryType){
                    case '0':
                    case '1':
                    case '5':
                        var extraTextX = 0.5
                            extraTextY = 100
                            extraTextWidth = 390
                            extraTextFontFamily = 'garamonditalic'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1;
                            extraTextFill = '#00305c'
                    break;
                }
                
                var optionsExtraText = {
                    x: extraTextX,
                    y: extraTextY,
                    width: extraTextWidth,
                    name: 'text',
                    id: 'extraText',
                    draggable: true,
                    fill: extraTextFill,
                    opacity: 1
                }

                var extraText = obituary.extraText == '' ? '' : ' (' + obituary.extraText + ')'
            
                var styleExtraText = {
                    fontFamily: extraTextFontFamily,
                    fontSize: extraTextFontSize,
                    fontStyle: extraTextFontStyle,
                    fontVariant: 'normal',
                    textDecoration: 'empty string',
                    text: extraText,
                    align: extraTextAlign,
                    verticalAlign: 'top',
                    padding: 0,
                    lineHeight: extraTextLineHeight,
                    wrap: 'word',
                    ellipsis: false
                }

                setTimeout(() => {
                    if(extraText != ''){
                        drawText(optionsExtraText, styleExtraText) 
                    }

                    //TEXTO EXTRA
                    switch(obituaryType){
                        case '0':
                        case '1':
                        case '5':
                            var extraNupciasX = 0.5
                                extraNupciasY = 100
                                extraNupciasWidth = 390
                                extraNupciasFontFamily = 'caslon'
                                extraNupciasFontSize = 18
                                extraNupciasFontStyle = 'bold'  
                                extraNupciasAlign = 'center'
                                extraNupciasLineHeight = 1;
                                extraFill = '#00305c'
                        break;
                    }

                    //TEXTO NUPCIAS
                    var optionsExtraNupcias = {
                        x: extraNupciasX,
                        y: extraNupciasY,
                        width: extraNupciasWidth,
                        name: 'text',
                        id: 'extraNupcias',
                        draggable: true,
                        fill: extraFill,
                        opacity: 1
                    }

                    if(expedient.deceasedGender == 'Mujer'){
                        var article = 'a'
                    }else{
                        var article = 'o'
                    }

                    if(obituary.deceasedMaritalStatus.toLowerCase() == 'viudo'){
                        var maritalStatus = 'Vd' + article;
                    }
                    
                    var styleExtraNupcias = {
                        fontFamily: extraNupciasFontFamily,
                        fontSize: extraNupciasFontSize,
                        fontStyle: extraNupciasFontStyle,
                        fontVariant: 'normal',
                        textDecoration: 'empty string',
                        text: '('+maritalStatus+'. de '  + obituary.spouseName + ')',
                        align: extraNupciasAlign,
                        verticalAlign: 'top',
                        padding: 0,
                        lineHeight: extraNupciasLineHeight,
                        wrap: 'word',
                        ellipsis: false
                    }

                    setTimeout(() => {

                        if(obituary.deceasedMaritalStatus.toLowerCase() == 'viudo'  && obituary.spouseName != '' && obituary.spouseName != null){
                            drawText(optionsExtraNupcias, styleExtraNupcias)
                        }

                        //FALLECIO CRISTIANAMENTE
                        switch(obituaryType){
                            case '0':
                            case '1':
                            case '5':
                                var diedX = 0.5
                                    diedY = 135
                                    diedWidth = 390
                                    diedFontFamily = 'caslon'
                                    diedFontSize = 17
                                    diedAlign = 'center'
                                    diedLineHeight = 1;
                                    diedFill = '#00305c'
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
                            fill: diedFill,
                            opacity: 1
                        }

                        if(obituary.deceasedDate != null){
                            var onlyDay = moment(obituary.deceasedDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                            onlyDay = onlyDay.split(' ')
                            onlyDay = 'el ' + onlyDay[0] + ' de ' + onlyDay[1] + ' de ' + onlyDay[2]
                        }else{
                            var onlyDay = ''
                        }
                        if(obituary.deceasedBirthday != null && obituary.deceasedDate != null){
                            var yearsLife = moment(obituary.deceasedDate, "YYYY-MM-DD").diff(moment(obituary.deceasedBirthday, "YYYY-MM-DD"), 'years');
                        }else{
                            yearsLife = ''
                        }

                        var diedTextFrom = 'Que falleció cristianamente ' +  onlyDay + ', a los ' + yearsLife + ' años de edad. '
                        var styleDied = {
                            fontFamily: diedFontFamily,
                            fontSize: diedFontSize,
                            fontVariant: 'normal',
                            textDecoration: 'empty string',
                            text: diedTextFrom,
                            align: diedAlign,
                            verticalAlign: 'top',
                            padding: 0,
                            lineHeight: diedLineHeight,
                            wrap: 'word',
                            ellipsis: false
                        }

                        setTimeout(() => {
                            drawText(optionsDied, styleDied)
                            
                            //DEP
                            switch(obituaryType){
                                case '0':
                                case '1':
                                case '5':
                                    var depX = 0.5
                                        depY = 167
                                        depWidth = 390
                                        depFontFamily = 'garamond'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1;
                                        depLineFill = '#00305c'
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
                                fill: depLineFill,
                                opacity: 1
                            }
                          
                            var dep = obituary.dep == 1 ? 'D.E.P.' : ''
                            var styleDep = {
                                fontFamily: depFontFamily,
                                fontSize: depFontSize,
                                fontStyle: depFontStyle,
                                fontVariant: 'normal',
                                textDecoration: 'empty string',
                                text: dep,
                                align: depAlign,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: depLineHeight,
                                wrap: 'word',
                                ellipsis: false
                            }

                            setTimeout(() => {
                                drawText(optionsDep, styleDep)
                                
                                //FAMILIA
                                switch(obituaryType){
                                    case '0':
                                    case '1':
                                    case '5':
                                        var familyX = 9.6
                                            familyY = 221
                                            familyWidth = 353.9
                                            familyFontFamily = 'caslon'
                                            familyFontSize = 24
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25;
                                            familyLineFill = '#00305c'
                                    break;
                                }

                                // Familia
                                var optionsFamily = {
                                    x: familyX,
                                    y: familyY,
                                    width: familyWidth,
                                    name: 'text',
                                    id: 'family',
                                    draggable: true,
                                    fill: familyLineFill,
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

                                    if(expedient.deceasedDate != null){
                                        var auxMonth = moment(expedient.deceasedDate, 'YYYY/MM/DD').format('MMMM');
                                        var month = auxMonth.charAt(0).toUpperCase() + auxMonth.slice(1)
                                        var year = moment(expedient.deceasedDate, 'YYYY/MM/DD').format('YYYY');
                                        var texto = month.toLowerCase() + ' de ' + year;

                                        //Cita
                                        switch(obituaryType){
                                            case '0':
                                            case '1':
                                            case '5':
                                                 var dateDeceasedX = 0.5,
                                                    dateDeceasedY = 534
                                                    dateDeceasedWidth = 390
                                                    dateDeceasedFontFamily = 'caslon'
                                                    dateDeceasedFontSize = 14
                                                    dateDeceasedAlign = 'left'
                                                    dateDeceasedLineHeight = 1
                                                    dateDeceasedText = texto;
                                                    dateDeceasedFill = '#00305c'
                                            break;
                                        }
                                    
                                        // Cita
                                        var optionsDate = {
                                            x: dateDeceasedX,
                                            y: dateDeceasedY,
                                            width: dateDeceasedWidth,
                                            name: 'text',
                                            id: 'dateDeceased',
                                            draggable: true,
                                            fill: dateDeceasedFill,
                                            opacity: 1
                                        }
                            
                                        var styleDate = {
                                            fontFamily: dateDeceasedFontFamily,
                                            fontSize: dateDeceasedFontSize,
                                            fontVariant: 'normal',
                                            textDecoration: 'empty string',
                                            text: dateDeceasedText,
                                            align: dateDeceasedAlign,
                                            verticalAlign: 'top',
                                            padding: 0,
                                            lineHeight: dateDeceasedLineHeight,
                                            wrap: 'word',
                                            ellipsis: false
                                        }
                            
                                        setTimeout(() => {
                                            drawText(optionsDate, styleDate)
                                        }, 150)
                                    }

                                    //CRUZ
                                    var optionsLogo = {
                                        x: 417,
                                        y: 37,
                                        width: 80,
                                        height: 335,
                                        id: 'logo',
                                        draggable: true,
                                        name: 'image',
                                        src: uri + 'core/libraries/pdfs/images/cruz.jpg',
                                        mouse: true,
                                        rotation: null,
                                        scaleX:  0.75,
                                        scaleY: 0.785,
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
                                        drawImage(optionsLogo, expedientID, obituaryType, obituaryModel)

                                        //ORACION - 1
                                        switch(obituaryType){
                                            case '0':
                                            case '1':
                                            case '5':

                                                var oracion1X = 494.59375
                                                    oracion1Y = 22
                                                    oracion1Width = 275.40625
                                                    oracion1FontFamily = 'garamonditalic'
                                                    oracion1FontSize = 19
                                                    oracion1Align = 'left'
                                                    oracion1LineHeight = 1;

                                                var optionsDep = {
                                                    x: oracion1X,
                                                    y: oracion1Y,
                                                    width: oracion1Width,
                                                    name: 'text',
                                                    id: 'oracion1',
                                                    draggable: true,
                                                    fill: '#00305c',
                                                    opacity: 1
                                                }

                                                if(expedient.deceasedGender == 'Mujer'){
                                                    var promA = 'ella'
                                                }else{
                                                    var promA = 'él'
                                                }

                                                var oracion1 = "Dale Señor el descanso eterno y brille para " +promA+ " la luz perpetua."
                                                var styleDep = {
                                                    fontFamily: oracion1FontFamily,
                                                    fontSize: oracion1FontSize,
                                                    fontVariant: 'normal',
                                                    textDecoration: 'empty string',
                                                    text: oracion1,
                                                    align: oracion1Align,
                                                    verticalAlign: 'top',
                                                    padding: 0,
                                                    lineHeight: oracion1LineHeight,
                                                    wrap: 'word',
                                                    ellipsis: false
                                                }
                                            break;
                                        }
                                    
                                        setTimeout(() => {
                                            drawText(optionsDep, styleDep)

                                            switch(obituaryType){
                                                case '0':
                                                case '1':
                                                case '5':
                                                    //ORACION - 2
                                                    var oracion4X = 494.59375
                                                        oracion4Y = 90
                                                        oracion4Width = 177.40625
                                                        oracion4FontFamily = 'garamonditalic'
                                                        oracion4FontSize = 19
                                                        oracion4Align = 'left'
                                                        oracion4LineHeight = 1;
    
                                                    var optionsDep2 = {
                                                        x: oracion4X,
                                                        y: oracion4Y,
                                                        width: oracion4Width,
                                                        name: 'text',
                                                        id: 'oracion4',
                                                        draggable: true,
                                                        fill: '#00305c',
                                                        opacity: 1
                                                    }
    
                                                    if(expedient.deceasedGender == 'Mujer'){
                                                        var promPo = 'a'
                                                    }else{
                                                        var promPo = 'o'
                                                    }
    
                                                    var oracion4 = "Tuy"+promPo+" soy, Señor"
                                                    var styleDep2 = {
                                                        fontFamily: oracion4FontFamily,
                                                        fontSize: oracion4FontSize,
                                                        fontVariant: 'normal',
                                                        textDecoration: 'empty string',
                                                        text: oracion4,
                                                        align: oracion4Align,
                                                        verticalAlign: 'top',
                                                        padding: 0,
                                                        lineHeight: oracion4LineHeight,
                                                        wrap: 'word',
                                                        ellipsis: false
                                                    }
                                                break;
                                            }

                                            setTimeout(() => {
                                                
                                                drawText(optionsDep2, styleDep2)

                                                switch(obituaryType){
                                                    case '0':
                                                    case '1':
                                                    case '5':
                                                        //ORACION - 3
                                                        var oracion4X = 494.59375
                                                            oracion4Y = 135
                                                            oracion4Width = 240
                                                            oracion4FontFamily = 'garamonditalic'
                                                            oracion4FontSize = 19
                                                            oracion4Align = 'left'
                                                            oracion4LineHeight = 1;
    
                                                        var optionsDep3 = {
                                                            x: oracion4X,
                                                            y: oracion4Y,
                                                            width: oracion4Width,
                                                            name: 'text',
                                                            id: 'oracion4',
                                                            draggable: true,
                                                            fill: '#00305c',
                                                            opacity: 1
                                                        }
    
                                                        var oracion4 = "La muerte no es el final del camino."
                                                        var styleDep3 = {
                                                            fontFamily: oracion4FontFamily,
                                                            fontSize: oracion4FontSize,
                                                            fontVariant: 'normal',
                                                            textDecoration: 'empty string',
                                                            text: oracion4,
                                                            align: oracion4Align,
                                                            verticalAlign: 'top',
                                                            padding: 0,
                                                            lineHeight: oracion4LineHeight,
                                                            wrap: 'word',
                                                            ellipsis: false
                                                        }
                                                    break;
                                                }

                                                setTimeout(() => {
                                                    drawText(optionsDep3, styleDep3)

                                                    switch(obituaryType){
                                                        case '0':
                                                        case '1':
                                                        case '5':
                                                            //ORACION - 4
                                                            var oracion4X = 494.59375
                                                                oracion4Y = 195
                                                                oracion4Width = 290
                                                                oracion4FontFamily = 'garamonditalic'
                                                                oracion4FontSize = 19
                                                                oracion4Align = 'left'
                                                                oracion4LineHeight = 1;
    
                                                            var optionsDep4 = {
                                                                x: oracion4X,
                                                                y: oracion4Y,
                                                                width: oracion4Width,
                                                                name: 'text',
                                                                id: 'oracion4',
                                                                draggable: true,
                                                                fill: '#00305c',
                                                                opacity: 1
                                                            }
    
                                                            var oracion4 = "Caminando a tu lado, no va a faltarme tu amor."
                                                            var styleDep4 = {
                                                                fontFamily: oracion4FontFamily,
                                                                fontSize: oracion4FontSize,
                                                                fontVariant: 'normal',
                                                                textDecoration: 'empty string',
                                                                text: oracion4,
                                                                align: oracion4Align,
                                                                verticalAlign: 'top',
                                                                padding: 0,
                                                                lineHeight: oracion4LineHeight,
                                                                wrap: 'word',
                                                                ellipsis: false
                                                            }
                                                        break;
                                                    }

                                                    setTimeout(() => {
                                                        drawText(optionsDep4, styleDep4)

                                                        switch(obituaryType){
                                                            case '0':
                                                            case '1':
                                                            case '5':

                                                                //ORACION - 5
                                                                var oracion5X = 494.59375
                                                                    oracion5Y = 256
                                                                    oracion5Width = 290
                                                                    oracion5FontFamily = 'garamonditalic'
                                                                    oracion5FontSize = 19
                                                                    oracion5Align = 'left'
                                                                    oracion5LineHeight = 1;

                                                                var optionsDep5 = {
                                                                    x: oracion5X,
                                                                    y: oracion5Y,
                                                                    width: oracion5Width,
                                                                    name: 'text',
                                                                    id: 'oracion5',
                                                                    draggable: true,
                                                                    fill: '#00305c',
                                                                    opacity: 1
                                                                }

                                                                var oracion5 = "No lloréis, para vosotros no he muerto, sé que me amáis como si estuviera en la tierra y yo os amo desde el cielo."
                                                                var styleDep5 = {
                                                                    fontFamily: oracion5FontFamily,
                                                                    fontSize: oracion5FontSize,
                                                                    fontVariant: 'normal',
                                                                    textDecoration: 'empty string',
                                                                    text: oracion5,
                                                                    align: oracion5Align,
                                                                    verticalAlign: 'top',
                                                                    padding: 0,
                                                                    lineHeight: oracion5LineHeight,
                                                                    wrap: 'word',
                                                                    ellipsis: false
                                                                }
                                                            break;
                                                        }

                                                        setTimeout(() => {
                                                            drawText(optionsDep5, styleDep5)

                                                            switch(obituaryType){
                                                                case '0':
                                                                case '1':
                                                                case '5':

                                                                    //ORACION - TITULO
                                                                    var oracion6X = 559.3333333333334
                                                                        oracion6Y = 345
                                                                        oracion6Width = 100
                                                                        oracion6FontFamily = 'calson'
                                                                        oracion6FontSize = 17
                                                                        oracion6Align = 'center'
                                                                        oracion6LineHeight = 1
                                                                        fontStyle = 'bold';
    
                                                                    var optionsDep6 = {
                                                                        x: oracion6X,
                                                                        y: oracion6Y,
                                                                        width: oracion6Width,
                                                                        name: 'text',
                                                                        id: 'oracion6',
                                                                        draggable: true,
                                                                        fill: '#00305c',
                                                                        opacity: 1
                                                                    }
        
                                                                    var oracion6 = "ORACIÓN"
                                                                    var styleDep6 = {
                                                                        fontFamily: oracion6FontFamily,
                                                                        fontSize: oracion6FontSize,
                                                                        fontStyle: fontStyle,
                                                                        fontVariant: 'normal',
                                                                        textDecoration: 'empty string',
                                                                        text: oracion6,
                                                                        align: oracion6Align,
                                                                        verticalAlign: 'top',
                                                                        padding: 0,
                                                                        lineHeight: oracion6LineHeight,
                                                                        wrap: 'word',
                                                                        ellipsis: false
                                                                    }
                                                                break;
                                                            }

                                                            setTimeout(() => {

                                                                drawText(optionsDep6, styleDep6)
                                                                
                                                                switch(obituaryType){
                                                                    case '0':
                                                                    case '1':
                                                                    case '5':

                                                                        //ORACION - CUERPO
                                                                        var oracion7X = 435.59375
                                                                            oracion7Y = 380
                                                                            oracion7Width = 346.40625
                                                                            oracion7FontFamily = 'garamonditalic'
                                                                            oracion7FontSize = 19
                                                                            oracion7Align = 'justify'
                                                                            oracion7LineHeight = 1
    
                                                                        var optionsDep7 = {
                                                                            x: oracion7X,
                                                                            y: oracion7Y,
                                                                            width: oracion7Width,
                                                                            name: 'text',
                                                                            id: 'oracion7',
                                                                            draggable: true,
                                                                            fill: '#00305c',
                                                                            opacity: 1
                                                                        }
    
                                                                        if(expedient.deceasedGender == 'Mujer'){
                                                                            var genderOR = "a"
                                                                        }else{
                                                                            var genderOR = "o"
                                                                        }
    
                                                                        var oracion7 = "Dulce Jesús mío, por la sangre preciosa que derramasteis en el Calvario, tened piedad de vuestr"+genderOR  +" hij"+ genderOR + " " + expedient.deceasedName +" y abridle las puertas de la mansión celestial. Amén"
                                                                        var styleDep7 = {
                                                                            fontFamily: oracion7FontFamily,
                                                                            fontSize: oracion7FontSize,
                                                                            fontVariant: 'normal',
                                                                            textDecoration: 'empty string',
                                                                            text: oracion7,
                                                                            align: oracion7Align,
                                                                            verticalAlign: 'top',
                                                                            padding: 0,
                                                                            lineHeight: oracion7LineHeight,
                                                                            wrap: 'word',
                                                                            ellipsis: false
                                                                        }
                                                                    break;
                                                                }

                                                                setTimeout(() => {
                                                                    drawText(optionsDep7, styleDep7)

                                                                    if(obituary.nif == 'A36601052'){
                                                                        var oracion8Y = 485
                                                                    }else{
                                                                        var oracion8Y = 534
                                                                    }

                                                                    var oracion8 = '';
                                                                    var oracion8X = 434
                                                                    var oracion8Width = 275;
                                                                    var oracion8FontFamily = 'calson';
                                                                    var oracion8FontSize = 15;
                                                                    var oracion8Align = 'left'
                                                                    var oracion8LineHeight = 1;
                                                                    var fontStyle = 'bold';
                                                                    var oracionFill = '#00305c';
                                                                    switch(obituaryType){
                                                                        case '0':
                                                                        case '1':
                                                                        case '5':
                                                                            //ORACION - CUERPO
                                                                            oracion8 = "Grupo Garrido - Tanatorio & Funeraria"
                                                                            oracion8X = 434
                                                                            oracion8Width = 275
                                                                            oracion8FontFamily = 'calson'
                                                                            oracion8FontSize = 15
                                                                            oracion8Align = 'left'
                                                                            oracion8LineHeight = 1,
                                                                            fontStyle = 'bold';
                                                                            oracionFill = '#00305c'

                                                                            var optionsDep8 = {
                                                                                x: oracion8X,
                                                                                y: oracion8Y,
                                                                                width: oracion8Width,
                                                                                name: 'text',
                                                                                id: 'oracion8',
                                                                                draggable: true,
                                                                                fill: oracionFill,
                                                                                opacity: 1
                                                                            }
    
                                                                            var styleDep8 = {
                                                                                fontFamily: oracion8FontFamily,
                                                                                fontSize: oracion8FontSize,
                                                                                fontVariant: 'normal',
                                                                                fontStyle: fontStyle,
                                                                                textDecoration: 'empty string',
                                                                                text: oracion8,
                                                                                align: oracion8Align,
                                                                                verticalAlign: 'top',
                                                                                padding: 0,
                                                                                lineHeight: oracion8LineHeight,
                                                                                wrap: 'word',
                                                                                ellipsis: false
                                                                            }
                                                                        break
                                                                    }

                                                                    setTimeout(() => {
                                                                        drawText(optionsDep8, styleDep8)

                                                                        if(obituary.nif == 'A36601052'){
                                                                            var optionsLogoFe = {
                                                                                x: 685.03,
                                                                                y: 524.22,
                                                                                draggable: true,
                                                                                width: null,
                                                                                height: null,
                                                                                id: 'logoFe',
                                                                                name: 'image',
                                                                                src: uri + 'resources/files/' + company + '/obituaries/basic/lafe.jpg',
                                                                                mouse: false,
                                                                                rotation: null,
                                                                                scaleX: 0.29,
                                                                                scaleY: 0.29,
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
                                                                        }
                                                                                
                                                                        setTimeout(() => {
                                                                            if(obituary.nif == 'A36601052'){
                                                                                drawImage(optionsLogoFe, expedientID, obituaryType, obituaryModel)
                                                                            }

                                                                            switch(obituaryType){
                                                                                case '0':
                                                                                case '1':

                                                                                    var PrayDeceasedX = 0.5,
                                                                                        PrayDeceasedY = 500
                                                                                        PrayDeceasedWidth = 390
                                                                                        PrayDeceasedFontFamily = 'caslon'
                                                                                        PrayDeceasedFontSize = 14
                                                                                        PrayDeceasedAlign = 'left'
                                                                                        PrayDeceasedLineHeight = 1
                                                                                        PrayDeceasedText = "Rueguen una oración por su alma";
                                                                                        PrayDeceasedFill = '#00305c'
                                                                                    
                                                                                    // Cita
                                                                                    var optionsPray = {
                                                                                        x: PrayDeceasedX,
                                                                                        y: PrayDeceasedY,
                                                                                        width: PrayDeceasedWidth,
                                                                                        name: 'text',
                                                                                        id: 'prayDeceased',
                                                                                        draggable: true,
                                                                                        fill: PrayDeceasedFill,
                                                                                        opacity: 1
                                                                                    }
                                                                        
                                                                                    var stylePray = {
                                                                                        fontFamily: PrayDeceasedFontFamily,
                                                                                        fontSize: PrayDeceasedFontSize,
                                                                                        fontVariant: 'normal',
                                                                                        textDecoration: 'empty string',
                                                                                        text: PrayDeceasedText,
                                                                                        align: PrayDeceasedAlign,
                                                                                        verticalAlign: 'top',
                                                                                        padding: 0,

                                                                                        lineHeight: PrayDeceasedLineHeight,
                                                                                        wrap: 'word',
                                                                                        ellipsis: false
                                                                                    }
                                                                                break;
                                                                                case '5':
                                                                                    var PrayDeceasedX = 0.5,
                                                                                        PrayDeceasedY = 460
                                                                                        PrayDeceasedWidth = 390
                                                                                        PrayDeceasedFontFamily = 'caslon'
                                                                                        PrayDeceasedFontSize = 16
                                                                                        PrayDeceasedAlign = 'left'
                                                                                        PrayDeceasedLineHeight = 1
                                                                                        PrayDeceasedText = obituary.pray
                                                                                        PrayDeceasedFill = '#00305c'
                                                                                    
                                                                                    // Cita
                                                                                    var optionsPray = {
                                                                                        x: PrayDeceasedX,
                                                                                        y: PrayDeceasedY,
                                                                                        width: PrayDeceasedWidth,
                                                                                        name: 'text',
                                                                                        id: 'prayDeceased',
                                                                                        draggable: true,
                                                                                        fill: PrayDeceasedFill,
                                                                                        opacity: 1
                                                                                    }
                                                                        
                                                                                    var stylePray = {
                                                                                        fontFamily: PrayDeceasedFontFamily,
                                                                                        fontSize: PrayDeceasedFontSize,
                                                                                        fontVariant: 'normal',
                                                                                        textDecoration: 'empty string',
                                                                                        text: PrayDeceasedText,
                                                                                        align: PrayDeceasedAlign,
                                                                                        verticalAlign: 'top',
                                                                                        padding: 0,
                                                                                        lineHeight: PrayDeceasedLineHeight,
                                                                                        wrap: 'word',
                                                                                        ellipsis: false
                                                                                    }
                                                                                break;
                                                                            }
                                                                            setTimeout(() => {
                                                                                drawText(optionsPray, stylePray)

                                                                                stage.draw()
                                                                                states.push($.parseJSON(stage.toJSON()))
                                                                                $('.main').removeClass('hide')
                                                                            }, 150)
                                                                        }, 50)
                                                                    }, 50)
                                                                }, 50)
                                                            }, 50)
                                                        }, 50)
                                                    }, 50)
                                                }, 50)
                                            }, 50)
                                        }, 50)
                                    }, 50)
                                }, 50)
                            }, 50)
                        }, 50)
                    }, 50)
                }, 50)
            }, 50)
        }, 50)
    }, 50)
}