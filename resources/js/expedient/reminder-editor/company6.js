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
                var quoteX = 31.3,
                    quoteY = 33.9
                    quoteWidth = 367.91
                    quoteFontFamily = 'helvetica'
                    quoteFontSize = 14
                    quoteFontStyle = ''
                    quoteAlign = 'center'
                    quoteLineHeight = 1
                    quoteText = obituary.prayForText + ' ' + obituary.prayForGenre;
                    quoteFill = '#000000'
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
                    var deceasedX = 67.5
                        deceasedY = 59
                        deceasedWidth = 307.20
                        deceasedFontFamily = 'helvetica'
                        deceasedFontSize = 20
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1;
                        deceasedFill = '#000000'
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
                        var extraTextX = 73.3
                            extraTextY = 84
                            extraTextWidth = 286.20
                            extraTextFontFamily = 'helvetica'
                            extraTextFontSize = 18
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1;
                            extraTextFill = '#000000'
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

                var extraText = obituary.extraText == '' ? '' : obituary.extraText
            
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
                            var extraNupciasX = 67.30
                                extraNupciasY = 107
                                extraNupciasWidth = 299.20
                                extraNupciasFontFamily = 'helvetica'
                                extraNupciasFontSize = 16
                                extraNupciasFontStyle = 'bold'
                                extraNupciasAlign = 'center'
                                extraNupciasLineHeight = 1;
                                extraFill = '#000000'
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
                                var diedX = 32.30
                                    diedY = 135
                                    diedWidth = 355.20
                                    diedFontFamily = 'helvetica'
                                    diedFontSize = 17
                                    diedAlign = 'center'
                                    diedLineHeight = 1;
                                    diedFill = '#000000'
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
                                    var depX = 19.5
                                        depY = 183
                                        depWidth = 390
                                        depFontFamily = 'helvetica'
                                        depFontSize = 20
                                        depFontStyle = 'bold'
                                        depAlign = 'center'
                                        depLineHeight = 1;
                                        depLineFill = '#000000'
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
                                        var familyX = 46.30
                                            familyY = 213
                                            familyWidth = 327.20
                                            familyFontFamily = 'helvetica'
                                            familyFontSize = 18
                                            familyFontStyle = 'normal'
                                            familyAlign = 'justify'
                                            familyLineHeight = 1.25;
                                            familyLineFill = '#000000'
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
                                                var day = moment(expedient.deceasedDate, 'YYYY/MM/DD').format('DD');
                                                var texto = 'Morgadanes, ' + day + ' de ' + month.toLowerCase() + ' de ' + year;

                                                var dateDeceasedX = 46.5,
                                                    dateDeceasedY = 527
                                                    dateDeceasedWidth = 390
                                                    dateDeceasedFontFamily = 'helvetica'
                                                    dateDeceasedFontSize = 14
                                                    dateDeceasedAlign = 'left'
                                                    dateDeceasedLineHeight = 1
                                                    dateDeceasedText = texto;
                                                    dateDeceasedFill = '#000000'
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
                                
                                    setTimeout(() => {

                                        //ORACION - 1
                                        switch(obituaryType){
                                            case '0':
                                            case '1':
                                            case '5':
                                                //ORACION - 1
                                                var oracion1X = 513.4062347412109
                                                    oracion1Y = 29
                                                    oracion1Width = 254.640609
                                                    oracion1Height = 459.8
                                                    oracion1FontFamily = 'helvetica'
                                                    oracion1FontSize = 18
                                                    oracion1Align = 'center'
                                                    oracion1LineHeight = 1.1;

                                                var optionsDep = {
                                                    x: oracion1X,
                                                    y: oracion1Y,
                                                    width: oracion1Width,
                                                    height: oracion1Height,
                                                    name: 'text',
                                                    id: 'oracion1',
                                                    draggable: true,
                                                    fill: '#000000',
                                                    opacity: 1
                                                }
                                                if(expedient.deceasedGender == 'Mujer'){
                                                    var promA = 'a'
                                                }else{
                                                    var promA = 'o'
                                                }

                                                var oracion1 = "Un Padrenuestro te pido\n que por mi reces hermano.\n Sea tarde o temprano\n has de venir aquí. Lo que\n tu eres yo fui, lo que \nyo soy, tu serás\n Algún día te alegrarás,\nque te lo recen a ti.\n No lloréis\n Porque para vosotros\n no he muerto;\nse que me amáis como si\n estuviera en la tierra;\nyo también os amo desde\n el cielo.\n Sagrado Corazón de Jesús,\n guía a tu hij" + promA + "\n "+expedient.deceasedName.toUpperCase()+"\n para que alcance su salvación."
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

                                            setTimeout(() => {

                                                if(obituary.nif == 'A36601052'){
                                                    var oracion8Y = 485
                                                }else{
                                                    var oracion8Y = 534
                                                }

                                                var oracion8 = '';
                                                var oracion8X = 532.0252316370335
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
                                                        oracion8 = "TANATORIO DEL MIÑOR. Sabarís. Tfno. 621.41.61.21"
                                                        oracion8X = 532.0252316370335
                                                        oracion8Y = 472.90623474121094
                                                        oracion8Width = 201.97476836296653
                                                        oracion8FontFamily = 'helvetica'
                                                        oracion8FontSize = 14
                                                        oracion8Align = 'center'
                                                        oracion8LineHeight = 1,
                                                        fontStyle = 'bold';
                                                        oracionFill = '#000000'

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
                                                                var PrayDeceasedX = 46.07,
                                                                    PrayDeceasedY = 465.90
                                                                    PrayDeceasedWidth = 321.42
                                                                    PrayDeceasedFontFamily = 'helvetica'
                                                                    PrayDeceasedFontSize = 14
                                                                    PrayDeceasedAlign = 'justify'
                                                                    PrayDeceasedLineHeight = 1
                                                                    PrayDeceasedText = "RUEGAN una oración por su alma y manifiestan su agradecimiento por las muestras de cariño recibidas.";
                                                                    PrayDeceasedFill = '#000000'
                                                                
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
                                                                var PrayDeceasedX = 46.07,
                                                                    PrayDeceasedY = 465.90
                                                                    PrayDeceasedWidth = 321.42
                                                                    PrayDeceasedFontFamily = 'helvetica'
                                                                    PrayDeceasedFontSize = 16
                                                                    PrayDeceasedAlign = 'justify'
                                                                    PrayDeceasedLineHeight = 1
                                                                    PrayDeceasedText = obituary.pray
                                                                    PrayDeceasedFill = '#000000'
                                                                
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
}