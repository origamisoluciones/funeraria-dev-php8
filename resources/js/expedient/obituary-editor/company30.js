$(function(){
    hasTransept = true;
    hasLogo = false;
                
    if(!loadFlag){
        setTimeout(() => {

            var optionsTransept = {
                x: 339,
                y: 42.52695698911418,
                width: null,
                height: null,
                id: 'transept',
                draggable: true,
                name: 'image',
                src: uri + 'resources/files/' + company + '/expedients/' + expedientID + '/obituary/' + obituaryType + '/' + obituaryModel + '/img/transept.jpg',
                mouse: true,
                rotation: null,
                scaleX: 0.7724539582284603,
                scaleY: 0.7724539582284603,
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
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 1:
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 2:
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 3:
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 4:
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 5:
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
                        deceasedFontStyle = 'bold'
                        deceasedAlign = 'center'
                        deceasedLineHeight = 1
                        fill = '#000000'
                    break
                    case 6:
                        deceasedX = 1
                        deceasedY = 449
                        deceasedWidth = 793
                        deceasedFontFamily = 'times new roman'
                        deceasedFontSize = 30
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
                    text:  obituary.namePre + ' ' + (obituary.name + ' \n' + obituary.surname),
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
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break
                        case 1:
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break
                        case 2:
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break
                        case 3:
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break
                        case 4:
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break
                        case 5:
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break
                        case 6:
                            extraTextX = 1
                            extraTextY = 528
                            extraTextWidth = 789
                            extraTextFontFamily = 'times new roman'
                            extraTextFontSize = 26
                            extraTextFontStyle = 'bold'
                            extraTextAlign = 'center'
                            extraTextLineHeight = 1
                            fill = '#000000'
                        break;
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
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break
                            case 1:
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break
                            case 2:
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break;
                            case 3:
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break;
                            case 4:
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break
                            case 5:
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break
                            case 6:
                                diedX = 1
                                diedY = 576
                                diedWidth = 789
                                diedFontFamily = "times new roman"
                                diedFontSize = 25
                                diedFontStyle = 'bold'
                                diedAlign = 'center'
                                diedLineHeight = 1
                                fill = '#000000'
                            break;
                        }

                        // Fallecido
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
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
                                    depFontStyle = 'bold'
                                    depAlign = 'center'
                                    depLineHeight = 1
                                    fill = '#000000'
                                break;
                                case 1:
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
                                    depFontStyle = 'bold'
                                    depAlign = 'center'
                                    depLineHeight = 1
                                    fill = '#000000'
                                break;
                                case 2:
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
                                    depFontStyle = 'bold'
                                    depAlign = 'center'
                                    depLineHeight = 1
                                    fill = '#000000'
                                break
                                case 3:
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
                                    depFontStyle = 'bold'
                                    depAlign = 'center'
                                    depLineHeight = 1
                                    fill = '#000000'
                                break
                                case 4:
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
                                    depFontStyle = 'bold'
                                    depAlign = 'center'
                                    depLineHeight = 1
                                    fill = '#000000'
                                break
                                case 5:
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
                                    depFontStyle = 'bold'
                                    depAlign = 'center'
                                    depLineHeight = 1
                                    fill = '#000000'
                                break
                                case 6:
                                    depX = 1
                                    depY = 629
                                    depWidth = 794
                                    depFontFamily = 'times new roman'
                                    depFontSize = 25
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
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 1:
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 2:
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 3:
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 4:
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 5:
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
                                        fill = '#000000'
                                    break   
                                    case 6:
                                        familyX = 78
                                        familyY = 686
                                        familyWidth = 644
                                        familyFontFamily = 'times new roman'
                                        familyFontSize = 26
                                        familyFontStyle = 'bold'
                                        familyAlign = 'center'
                                        familyLineHeight = 1
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
                                family += obituary.childrenNames != '' ? 'Sus ' + obituary.childrenNames + '; ' : ''
                                family += obituary.childrenInLawNames != '' ? obituary.childrenInLawPre + ' ' + obituary.childrenInLawNames + '; ' : ''
                                family += obituary.grandchildrenNames != '' ? obituary.grandchildrenPre + ' ' + obituary.grandchildrenNames + '; ' : ''
                                family += obituary.grandchildrenInLawNames != '' ? obituary.grandchildrenInLawPre + ' ' + obituary.grandchildrenInLawNames + '; ' : ''
                                family += obituary.greatGrandchildrenNames != '' ? obituary.greatGrandchildrenPre + ' ' + obituary.greatGrandchildrenNames + '; ' : ''
                                family += obituary.parentsNames != '' ? obituary.parentsPre + ' ' + obituary.parentsNames + '; ' : ''
                                family += obituary.parentsInLawNames != '' ? obituary.parentsInLawPre + ' ' + obituary.parentsInLawNames + '; ' : ''
                                family += obituary.paternalGrandfathersNames != '' ? obituary.paternalGrandfathersPre + ' ' + obituary.paternalGrandfathersNames + '; ' : ''
                                family += obituary.paternalGrandmotherNames != '' ? obituary.paternalGrandmotherPre + ' ' + obituary.paternalGrandmotherNames + '; ' : ''
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
                                family += obituary.siblingsNames != '' ? ' ' + obituary.siblingsNames[0].toLowerCase() + obituary.siblingsNames.slice(1) : ''
                                
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
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 1:
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 2:
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 3:
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 4:
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
                                            fill = '#000000'
                                        break   
                                        case 5:
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 6:
                                            prayX = 76
                                            prayY = 803
                                            prayWidth = 646
                                            prayFontFamily = 'times new roman'
                                            prayFontSize = 26
                                            prayFontStyle = 'bold'
                                            prayAlign = 'center'
                                            prayLineHeight = 1
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
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 1:
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 2:
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 3:
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 4:
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 5:
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                            case 6:
                                                FuneralX = 76
                                                FuneralY = 893
                                                FuneralWidth = 645
                                                FuneralFontFamily = 'times new roman'
                                                FuneralFontSize = 26
                                                FuneralFontStyle = 'bold'
                                                FuneralAlign = 'center'
                                                FuneralLineHeight = 1
                                                fill = '#000000'
                                            break
                                        }

                                        // Funeral
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
                                                            'deceased',
                                                            'extraText',
                                                            'died',
                                                            'dep',
                                                            'family',
                                                            'pray',
                                                            'funeral',
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
    }
})