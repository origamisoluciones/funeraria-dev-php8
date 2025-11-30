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
                transeptX = 356
                transeptY = 40
                transeptScaleX = 0.16
                transeptScaleY = 0.16
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

        setTimeout(() => {
            drawImage(optionsTransept, expedientID, obituaryType, obituaryModel)

            setTimeout(() => {

                var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;

                switch(parseInt(obituaryModel)){
                    default:
                        var x = 250
                        var y = 870
                        var text =  mortuaryName;  
                        var fontSize = 20
                        var fontStyle = 'normal'
                        var fontFamily = 'arial'
                        var fill = '#01184c'
                        var width = 480
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
                    lineHeight: 1,
                    wrap: 'word',
                    ellipsis: false,
                    align: align,
                }
                
                setTimeout(() => {
                    // Draw Mortuary
                    drawText(optionsMortuary, styleMortuary)

                    // if(obituary.prayForCheck == '1'){
                    //     var quoteX = 0;
                    //     var quoteY = 0;
                    //     var quoteWidth = 0;
                    //     var quoteFontFamily = '';
                    //     var quoteFontSize = 0;
                    //     var quoteFontStyle = '';
                    //     var quoteAlign = '';
                    //     var quoteLineHeight = 0;
                    //     var quoteText = '';
                    //     var fill = '';
                    //     switch(parseInt(obituaryModel)){
                    //         default:
                    //             quoteX = 130
                    //             quoteY = 295
                    //             quoteWidth = 525
                    //             quoteFontFamily = 'arial'
                    //             quoteFontSize = 17
                    //             quoteFontStyle = 'normal'
                    //             quoteAlign = 'center'
                    //             quoteLineHeight = 1
                    //             quoteText = obituary.prayForText
                    //             fill = '#000000'
                    //         break
                    //     }

                    //     // Cita
                    //     var optionsQuote = {
                    //         x: quoteX,
                    //         y: quoteY,
                    //         width: quoteWidth,
                    //         name: 'text',
                    //         id: 'quote',
                    //         draggable: true,
                    //         fill: fill,
                    //         opacity: 1
                    //     }

                    //     var styleQuote = {
                    //         fontFamily: quoteFontFamily,
                    //         fontSize: quoteFontSize,
                    //         fontStyle: quoteFontStyle,
                    //         fontVariant: 'normal',
                    //         textDecoration: 'empty string',
                    //         text: quoteText,
                    //         align: quoteAlign,
                    //         verticalAlign: 'top',
                    //         padding: 0,
                    //         lineHeight: quoteLineHeight,
                    //         wrap: 'word',
                    //         ellipsis: false
                    //     }

                    //     setTimeout(() => {
                    //         drawText(optionsQuote, styleQuote)
                    //     }, 150)
                    // }

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
                                deceasedX = 21
                                deceasedY = 229
                                deceasedWidth = 755
                                deceasedFontFamily = 'arial'
                                deceasedFontSize = 40
                                deceasedFontStyle = 'bold italic'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1
                                fill = '#01184c'
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
                            
                            switch(parseInt(obituaryModel)){
                                default:
                                    var extraTextX = 20
                                    var extraTextY = 272
                                    var extraTextWidth = 756
                                    var extraTextFontFamily = 'arial'
                                    var extraTextFontSize = 17
                                    var extraTextFontStyle = 'italic'
                                    var extraTextAlign = 'center'
                                    var extraTextLineHeight = 1
                                    var fill = '#01184c'
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
                                        widowX = 20
                                        widowY = 290
                                        widowWidth = 755
                                        widowFontFamily = 'arial'
                                        widowFontSize = 17
                                        widowFontStyle = 'normal'
                                        widowAlign = 'center'
                                        widowLineHeight = 1
                                        fill = '#01184c'
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
                                            diedX = 160
                                            diedY = 314
                                            diedWidth = 515
                                            diedFontFamily = 'arial'
                                            diedFontSize = 18
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#01184c'
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
                                            default:
                                                depX = 20
                                                depY = 185
                                                depWidth = 759
                                                depFontFamily = 'arial'
                                                depFontSize = 23
                                                depFontStyle = 'bold'
                                                depAlign = 'center'
                                                depLineHeight = 1
                                                fill = '#01184c'
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
                                                    familyX = 60
                                                    familyY = 420
                                                    familyWidth = 675
                                                    familyFontFamily = 'arial'
                                                    familyFontSize = 26
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#01184c'
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
                                                    default:
                                                        prayX = 60
                                                        prayY = 615
                                                        prayWidth = 675
                                                        prayFontFamily = 'arial'
                                                        prayFontSize = 22
                                                        prayFontStyle = 'normal'
                                                        prayAlign = 'justify'
                                                        prayLineHeight = 1.25
                                                        fill = '#01184c'
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

                                                    switch(parseInt(obituaryModel)){
                                                        default:
                                                            var MourningX = 60
                                                            var MourningY = 720
                                                            var MourningWidth = 675
                                                            var MourningFontFamily = 'arial'
                                                            var MourningFontSize = 17
                                                            var MourningFontStyle = 'normal'
                                                            var MourningAlign = 'center'
                                                            var MourningLineHeight = 1.25
                                                            var fill = '#01184c'
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

                                                        switch(parseInt(obituaryModel)){
                                                            default:
                                                                var FuneralX = 60
                                                                var FuneralY = 760
                                                                var FuneralWidth = 675
                                                                var FuneralFontFamily = 'arial'
                                                                var FuneralFontSize = 17
                                                                var FuneralFontStyle = 'normal'
                                                                var FuneralAlign = 'justify'
                                                                var FuneralLineHeight = 1.25
                                                                var fill = '#01184c'
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
                                                            
                                                            switch(parseInt(obituaryModel)){
                                                                default:
                                                                    var busX = 60
                                                                    var busY = 800
                                                                    var busWidth = 675
                                                                    var busFontFamily = 'arial'
                                                                    var busFontSize = 17
                                                                    var busFontStyle = 'normal'
                                                                    var busAlign = 'justify'
                                                                    var busLineHeight = 1.25
                                                                    var fill = '#01184c'
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
                                                                var text = obituary.mortuaryProvince +  ', ' + moment().format("DD") + ' de ' + moment().format("MMMM") + ' de ' +  moment().format("YYYY")
                                                                var x = 503
                                                                var y = 969
                                                                var fill = '#01184c'
                                                                var fontFamily = 'arial'
                                                                var fontSize = 14
                                                                var align = 'right'
                                                                var lineHeight = 1
                                                                var fontStyle = 'normal'
                                                                var width = 230; 
                                                
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

                                                                    // Mortuary label
                                                                    var text = 'Lugar de Velación:'
                                                                    var x = 75
                                                                    var y = 870
                                                                    var fill = '#01184c'
                                                                    var fontFamily = 'arial'
                                                                    var fontSize = 20
                                                                    var align = 'left'
                                                                    var lineHeight = 1
                                                                    var fontStyle = 'bold'
                                                                    var width = 198; 
                                                    
                                                                    var optionsMortuaryLabel = {
                                                                        x: x,
                                                                        y: y,
                                                                        width: width,
                                                                        name: 'text',
                                                                        id: 'mortuaryLabel',
                                                                        draggable: true,
                                                                        fill: fill,
                                                                        opacity: 1
                                                                    }
                                                        
                                                                    var styleMortuaryLabel = {
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
                                                                        // Draw mortyuary label
                                                                        drawText(optionsMortuaryLabel, styleMortuaryLabel)

                                                                        // Mortuary room label
                                                                        var text = 'Sala:'
                                                                        var x = 75
                                                                        var y = 905
                                                                        var fill = '#01184c'
                                                                        var fontFamily = 'arial'
                                                                        var fontSize = 20
                                                                        var align = 'left'
                                                                        var lineHeight = 1
                                                                        var fontStyle = 'bold'
                                                                        var width = 52; 
                                                        
                                                                        var optionsMortuaryRoomLabel = {
                                                                            x: x,
                                                                            y: y,
                                                                            width: width,
                                                                            name: 'text',
                                                                            id: 'mortuaryRoomLabel',
                                                                            draggable: true,
                                                                            fill: fill,
                                                                            opacity: 1
                                                                        }
                                                            
                                                                        var styleMortuaryRomLabel = {
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
                                                                            // Draw mortyuary label
                                                                            drawText(optionsMortuaryRoomLabel, styleMortuaryRomLabel)

                                                                            // Mortuary room 
                                                                            var text = obituary.roomNumber
                                                                            var x = 130
                                                                            var y = 905
                                                                            var fill = '#01184c'
                                                                            var fontFamily = 'arial'
                                                                            var fontSize = 20
                                                                            var align = 'left'
                                                                            var lineHeight = 1
                                                                            var fontStyle = 'normal'
                                                                            var width = 85; 
                                                            
                                                                            var optionsMortuaryRoom = {
                                                                                x: x,
                                                                                y: y,
                                                                                width: width,
                                                                                name: 'text',
                                                                                id: 'mortuaryRoom',
                                                                                draggable: true,
                                                                                fill: fill,
                                                                                opacity: 1
                                                                            }
                                                                
                                                                            var styleMortuaryRom = {
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
                                                                                // Draw mortyuary label
                                                                                drawText(optionsMortuaryRoom, styleMortuaryRom)

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
                                                                                                'mortuary', 
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
                                                                                                'mortuaryLabel',
                                                                                                'mortuaryRoomLabel',
                                                                                                'mortuaryRoom'
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
    }
})