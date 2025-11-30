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
                var quoteX = 20,
                    quoteY = 44
                    quoteWidth = 390
                    quoteFontFamily = 'times new roman'
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
                    var deceasedX = 20
                        deceasedY = 75
                        deceasedWidth = 385
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 17
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

                setTimeout(() => {

                    //FALLECIO CRISTIANAMENTE
                    switch(obituaryType){
                        case '0':
                        case '1':
                        case '5':
                            var diedX = 20
                                diedY = 104
                                diedWidth = 370
                                diedFontFamily = 'times new roman'
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

                    var styleDied = {
                        fontFamily: diedFontFamily,
                        fontSize: diedFontSize,
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
                        
                        //DEP
                        switch(obituaryType){
                            case '0':
                            case '1':
                            case '5':
                                var depX = 29.5
                                    depY = 183
                                    depWidth = 390
                                    depFontFamily = 'times new roman'
                                    depFontSize = 15
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
                                    var familyX = 24
                                        familyY = 300
                                        familyWidth = 370
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 17
                                        familyFontStyle = 'normal'
                                        familyAlign = 'center'
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
                                    var texto = (expedient.deceasedLocality != null ? expedient.deceasedLocality + ', ' : '') + parseInt(moment(expedient.deceasedDate, 'YYYY/MM/DD').format('DD')) + ' de ' + month + ' de ' + year;

                                    //Cita
                                    switch(obituaryType){
                                        case '0':
                                        case '1':
                                        case '5':
                                                var dateDeceasedX = 20,
                                                dateDeceasedY = 504
                                                dateDeceasedWidth = 382
                                                dateDeceasedFontFamily = 'times new roman'
                                                dateDeceasedFontSize = 14
                                                dateDeceasedAlign = 'center'
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

                                            var oracion1X = 450
                                                oracion1Y = 37
                                                oracion1Width = 315
                                                oracion1FontFamily = 'times new roman'
                                                oracion1FontSize = 19
                                                oracion1Align = 'center'
                                                oracion1LineHeight = 1;

                                            var optionsDep = {
                                                x: oracion1X,
                                                y: oracion1Y,
                                                width: oracion1Width,
                                                name: 'text',
                                                id: 'oracion1',
                                                draggable: true,
                                                fill: '#000000',
                                                opacity: 1
                                            }

                                            var oracion1 = "Padre"
                                            var styleDep = {
                                                fontFamily: oracion1FontFamily,
                                                fontSize: oracion1FontSize,
                                                fontVariant: 'bold',
                                                fontStyle: 'italic',
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
                                                var oracion4X = 450
                                                    oracion4Y = 72
                                                    oracion4Width = 315
                                                    oracion4FontFamily = 'times new roman'
                                                    oracion4FontSize = 17
                                                    oracion4Align = 'center'
                                                    oracion4LineHeight = 1;

                                                var optionsDep2 = {
                                                    x: oracion4X,
                                                    y: oracion4Y,
                                                    width: oracion4Width,
                                                    name: 'text',
                                                    id: 'oracion4',
                                                    draggable: true,
                                                    fill: '#000000',
                                                    opacity: 1
                                                }

                                                var oracion4 = "Por ese amor incondicional, por esas manos de consuelo, por ese abrazo protector levanto una oración al cielo."
                                                var styleDep2 = {
                                                    fontFamily: oracion4FontFamily,
                                                    fontSize: oracion4FontSize,
                                                    fontVariant: 'normal',
                                                    fontStyle: 'italic',
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
                                                    var oracion4X = 450
                                                        oracion4Y = 140
                                                        oracion4Width = 315
                                                        oracion4FontFamily = 'times new roman'
                                                        oracion4FontSize = 17
                                                        oracion4Align = 'center'
                                                        oracion4LineHeight = 1;

                                                    var optionsDep3 = {
                                                        x: oracion4X,
                                                        y: oracion4Y,
                                                        width: oracion4Width,
                                                        name: 'text',
                                                        id: 'oracion4',
                                                        draggable: true,
                                                        fill: '#000000',
                                                        opacity: 1
                                                    }

                                                    var oracion4 = "Levanto una oración por mi padre, que siga siendo esa luz que nunca se apagó en amor y paz."
                                                    var styleDep3 = {
                                                        fontFamily: oracion4FontFamily,
                                                        fontSize: oracion4FontSize,
                                                        fontStyle: 'italic',
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
                                                        var oracion4X = 450
                                                            oracion4Y = 209
                                                            oracion4Width = 315
                                                            oracion4FontFamily = 'times new roman'
                                                            oracion4FontSize = 17
                                                            oracion4Align = 'center'
                                                            oracion4LineHeight = 1;

                                                        var optionsDep4 = {
                                                            x: oracion4X,
                                                            y: oracion4Y,
                                                            width: oracion4Width,
                                                            name: 'text',
                                                            id: 'oracion4',
                                                            draggable: true,
                                                            fill: '#000000',
                                                            opacity: 1
                                                        }

                                                        var oracion4 = "Levanto una oración de amor para ese ser que dio tanto por mí, y hoy no puedo ver con mis ojos, pero en mi alma sigue latiendo su corazón."
                                                        var styleDep4 = {
                                                            fontFamily: oracion4FontFamily,
                                                            fontSize: oracion4FontSize,
                                                            fontStyle: 'italic',
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
                                                            var oracion5X = 450
                                                                oracion5Y = 295
                                                                oracion5Width = 315
                                                                oracion5FontFamily = 'times new roman'
                                                                oracion5FontSize = 17
                                                                oracion5Align = 'center'
                                                                oracion5LineHeight = 1;

                                                            var optionsDep5 = {
                                                                x: oracion5X,
                                                                y: oracion5Y,
                                                                width: oracion5Width,
                                                                name: 'text',
                                                                id: 'oracion5',
                                                                draggable: true,
                                                                fill: '#000000',
                                                                opacity: 1
                                                            }

                                                            var oracion5 = "Mi corazón se estremece al recordarte. Pero me consuela pensar que estás en un maravilloso lugar. Porque es ahí donde están las personas como tú."
                                                            var styleDep5 = {
                                                                fontFamily: oracion5FontFamily,
                                                                fontSize: oracion5FontSize,
                                                                fontVariant: 'normal',
                                                                fontStyle: 'italic',
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
                                                                var oracion6X = 450
                                                                    oracion6Y = 380
                                                                    oracion6Width = 315
                                                                    oracion6FontFamily = 'times new roman'
                                                                    oracion6FontSize = 17
                                                                    oracion6Align = 'center'
                                                                    oracion6LineHeight = 1
                                                                    fontStyle = 'normal';

                                                                var optionsDep6 = {
                                                                    x: oracion6X,
                                                                    y: oracion6Y,
                                                                    width: oracion6Width,
                                                                    name: 'text',
                                                                    id: 'oracion6',
                                                                    draggable: true,
                                                                    fill: '#000000',
                                                                    opacity: 1
                                                                }
    
                                                                var oracion6 = "Una oración de gratitud por el recuerdo de mi padre, porque nunca se aparte de mis memorias ni de mi corazón."
                                                                var styleDep6 = {
                                                                    fontFamily: oracion6FontFamily,
                                                                    fontSize: oracion6FontSize,
                                                                    fontStyle: fontStyle,
                                                                    fontStyle: 'italic',
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
                                                                    var oracion7X = 450
                                                                        oracion7Y = 445
                                                                        oracion7Width = 311
                                                                        oracion7FontFamily = 'times new roman'
                                                                        oracion7FontSize = 17
                                                                        oracion7Align = 'center'
                                                                        oracion7LineHeight = 1

                                                                    var optionsDep7 = {
                                                                        x: oracion7X,
                                                                        y: oracion7Y,
                                                                        width: oracion7Width,
                                                                        name: 'text',
                                                                        id: 'oracion7',
                                                                        draggable: true,
                                                                        fill: '#000000',
                                                                        opacity: 1
                                                                    }

                                                                    var oracion7 = "Levanto una oración a Dios por haber bendecido mi vida con la amada presencia de mi padre mientras nos fue concedido. Porque el amor hacia un padre es eterno."
                                                                    var styleDep7 = {
                                                                        fontFamily: oracion7FontFamily,
                                                                        fontSize: oracion7FontSize,
                                                                        fontStyle: 'italic',
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
                                                                var oracionFill = '#000000';
                                                                switch(obituaryType){
                                                                    case '0':
                                                                    case '1':
                                                                    case '5':
                                                                        //ORACION - CUERPO
                                                                        oracion8Width = 275
                                                                        oracion8FontFamily = 'calson'
                                                                        oracion8FontSize = 15
                                                                        oracion8Align = 'left'
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

                                                                                var PrayDeceasedX = 24,
                                                                                    PrayDeceasedY = 447
                                                                                    PrayDeceasedWidth = 370
                                                                                    PrayDeceasedFontFamily = 'times new roman'
                                                                                    PrayDeceasedFontSize = 14
                                                                                    PrayDeceasedAlign = 'left'
                                                                                    PrayDeceasedLineHeight = 1
                                                                                    PrayDeceasedText = "Ruegan a sus amistades y personas piadosas una oración por el eterno descanso de su alma";
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
                                                                                var PrayDeceasedX = 20,
                                                                                    PrayDeceasedY = 460
                                                                                    PrayDeceasedWidth = 390
                                                                                    PrayDeceasedFontFamily = 'caslon'
                                                                                    PrayDeceasedFontSize = 16
                                                                                    PrayDeceasedAlign = 'left'
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
                }, 50)
            }, 50)
        }, 50)
    }, 50)
}