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
                case 0:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
                break
                case 1:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
                break
                case 2:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
                break
                case 3:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
                break
                case 4:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
                break;
                case 5:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
                break
                case 6:
                    transeptX = 980.4381509719293
                    transeptY = 45.23806724348849
                    transeptScaleX = 0.3572634664666848
                    transeptScaleY = 0.3619234247249459
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

                var nameLogo = getNameLogo(obituaryType, obituaryModel)

                // Logo
                var scaleX = 0.7436179577464789
                var scaleY = 0.7000792701517592
                var x = 60
                var y = 60
        
                var optionsLogo = {
                    x: x,
                    y: y,
                    width: null,
                    height: null,
                    id: 'logo',
                    draggable: false,
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
    
                    // Draw rectagles borders
                    var backgroundBorders1 = {
                        x: 8.860457920792076,
                        y: 6.699622595437232,
                        width: 1095,
                        height: 765,
                        name: 'figure',
                        id: 'addFigure0',
                        draggable: false,
                        fill: '#FFFFFF',
                        stroke: '#817451',
                        strokeWidth: 15,
                        opacity: 1,
                        rotation: 0,
                        scaleX: 1.00990099009901,
                        scaleY: 1.0172061803422545
                    }
                    drawRectangle(backgroundBorders1)

                    setTimeout(() => {
                        
                        // Draw footer line
                        var footerLine = {
                            x: 23.67206122645132,
                            y: 757.8050000000001,
                            points: [0, 0, 500, 0],
                            name: 'figure',
                            id: 'addFigure1',
                            draggable: false,
                            stroke: '#817451',
                            strokeWidth: 10,
                            lineCap: 'square',
                            lineJoin: 'square',
                            opacity: 1,
                            rotation: null,
                            scaleX: 2.150711264898116,
                            scaleY: 4.761000000000001
                        }

                        drawLine(footerLine)

                        setTimeout(() => {
                        
                            var mortuaryInfo = 'Capilla ardiente: ' + obituary.mortuary;
                            if(obituary.roomNumber != null && obituary.roomNumber != ''){
                                mortuaryInfo += ' (SALA ' + obituary.roomNumber + ')'; 
                            }
                            
                            switch(parseInt(obituaryModel)){
                                case 0:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
                                break;
                                case 1:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
                                break;
                                case 2:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
                                break;
                                case 3:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
                                break;
                                case 4:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
                                break;
                                case 5:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
                                break;
                                case 6:
                                    var x = 270.78125
                                    var y = 690
                                    var text = mortuaryInfo
                                    var fontSize = 19
                                    var fontStyle = 'bold'
                                    var fontFamily = 'times new roman'
                                    var fill = '#000000'
                                    var width = 600.8487
                                    var align = 'left';
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
                                drawText(optionsMortuary, styleMortuary)
            
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
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 1:
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 2:
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 3:
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 4:
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 5:
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1
                                        fill = '#000000'
                                    break
                                    case 6:
                                        deceasedX = 379.78125
                                        deceasedY = 248
                                        deceasedWidth = 351.21000000000004
                                        deceasedFontFamily = 'times new roman'
                                        deceasedFontSize = 35
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
                                    text: (obituary.namePre + ' ' + obituary.name + '\n' + obituary.surname),
                                    align: deceasedAlign,
                                    verticalAlign: 'top',
                                    padding: 0,
                                    lineHeight: deceasedLineHeight,
                                    wrap: 'word',
                                    ellipsis: false
                                }

                                setTimeout(() => {
                                    drawText(optionsDeceased, styleDeceased)

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
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 1:
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break;
                                        case 2:
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 3:
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 4:
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 5:
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
                                            depAlign = 'center'
                                            depLineHeight = 1
                                            fill = '#000000'
                                        break
                                        case 6:
                                            depX = 946.78125
                                            depY = 147
                                            depWidth = 137.21875
                                            depFontFamily = 'times new roman'
                                            depFontSize = 20
                                            depFontStyle = 'normal'
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
                                        text: obituary.dep == 1 ? 'Q.E.P.D.' : '',
                                        align: depAlign,
                                        verticalAlign: 'top',
                                        padding: 0,
                                        lineHeight: depLineHeight,
                                        wrap: 'word',
                                        ellipsis: false
                                    }
                                                
                                    setTimeout(() => {
                                        drawText(optionsDep, styleDep)
    
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
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 19
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 1:
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 19
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 2:
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 19
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 3:
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 19
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break;
                                            case 4:
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 19
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break   
                                            case 5:
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
                                                prayFontSize = 19
                                                prayFontStyle = 'normal'
                                                prayAlign = 'justify'
                                                prayLineHeight = 1.25
                                                fill = '#000000'
                                            break
                                            case 6:
                                                prayX = 269.78125
                                                prayY = 495
                                                prayWidth = 600.21
                                                prayFontFamily = 'times new roman'
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
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 2:
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 4:
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 5:
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
                                                    familyFontStyle = 'normal'
                                                    familyAlign = 'justify'
                                                    familyLineHeight = 1.25
                                                    fill = '#000000'
                                                break   
                                                case 6:
                                                    familyX = 271.78125
                                                    familyY = 406
                                                    familyWidth = 585.22
                                                    familyFontFamily = 'times new roman'
                                                    familyFontSize = 19
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
                                            family += ' ' + obituary.restFamily;
        
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

                                                var optionsCircle = {
                                                    x: 562.8323912290901,
                                                    y: 123.25505263521339,
                                                    radius: 50,
                                                    name: 'figure',
                                                    id: 'addFigure2',
                                                    draggable: true,
                                                    fill: '#817451',
                                                    stroke: '#817451',
                                                    strokeWidth: 4,
                                                    opacity: 1,
                                                    rotation: null,
                                                    scaleX: 1.4647617071328725,
                                                    scaleY: 1.4647617071328725
                                                }
                
                                                setTimeout(() => {
                                                    drawCircle(optionsCircle)
                
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
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 1:
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 2:
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 3:
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break;
                                                        case 4:
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 5:
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
                                                            diedAlign = 'center'
                                                            diedLineHeight = 1.25
                                                            fill = '#000000'
                                                        break
                                                        case 6:
                                                            diedX = 15.10
                                                            diedY = 330
                                                            diedWidth = 1096.90
                                                            diedFontFamily = "times new roman"
                                                            diedFontSize = 19
                                                            diedFontStyle = 'bold'
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
                
                                                    var diedText = obituary.died + '\n'+ ' Habiendo recibido los Santos Sacramentos y la B.A.';
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
                                                    
                                                            var quoteX = 0;
                                                            var quoteY = 0;
                                                            var quoteWidth = 0;
                                                            var quoteFontFamily = '';
                                                            var quoteFontSize = 0;
                                                            var quoteFontStyle = '';
                                                            var quoteAlign = '';
                                                            var quoteLineHeight = 0;
                                                            var quoteText = obituary.namePre == 'Don' ? 'El Señor' : 'La Señora'
                                                            var fill = '';
                                                            switch(parseInt(obituaryModel)){
                                                                case 0:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                                case 1:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                                case 2:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                                case 3:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                                case 4:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                                case 5:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                                case 6:
                                                                    quoteX = 448.1
                                                                    quoteY = 222
                                                                    quoteWidth = 222
                                                                    quoteFontFamily = 'times new roman'
                                                                    quoteFontSize = 18
                                                                    quoteFontStyle = 'normal'
                                                                    quoteAlign = 'center'
                                                                    quoteLineHeight = 1
                                                                    fill = '#000000'
                                                                break
                                                            }
    
                                                            // Quote
                                                            var optionsQuote = {
                                                                x: quoteX,
                                                                y: quoteY,
                                                                width: quoteY,
                                                                name: 'text',
                                                                id: 'gender',
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

                                                                var footerTextX = 0;
                                                                var footerTextY = 0;
                                                                var footerTextWidth = 0;
                                                                var footerTextFontFamily = '';
                                                                var footerTextFontSize = 0;
                                                                var footerTextFontStyle = '';
                                                                var footerTextAlign = '';
                                                                var footerTextLineHeight = 0;
                                                                var footerTextFill = '';
                                                                switch(parseInt(obituaryModel)){
                                                                    case 0:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break;
                                                                    case 1:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break;
                                                                    case 2:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break
                                                                    case 3:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break
                                                                    case 4:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break
                                                                    case 5:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break
                                                                    case 6:
                                                                        footerTextX = 5.78125
                                                                        footerTextY = 754
                                                                        footerTextWidth = 1114.21875
                                                                        footerTextFontFamily = 'times new roman'
                                                                        footerTextFontSize = 20
                                                                        footerTextFontStyle = 'bold'
                                                                        footerTextAlign = 'center'
                                                                        footerTextLineHeight = 1
                                                                        footerTextFill = '#FFFFFF'
                                                                    break
                                                                }
                                    
                                                                // Footer text
                                                                var optionsFooterText = {
                                                                    x: footerTextX,
                                                                    y: footerTextY,
                                                                    width: footerTextWidth,
                                                                    name: 'text',
                                                                    id: 'footerText',
                                                                    draggable: false,
                                                                    fill: footerTextFill,
                                                                    opacity: 1
                                                                }

                                                                var styleDep = {
                                                                    fontFamily: footerTextFontFamily,
                                                                    fontSize: footerTextFontSize,
                                                                    fontStyle: footerTextFontStyle,
                                                                    fontVariant: 'normal',
                                                                    textDecoration: 'empty string',
                                                                    text: 'Teléfono 942888198 · info@espaciofunerario.com · www.espaciofunerario.com',
                                                                    align: footerTextAlign,
                                                                    verticalAlign: 'center',
                                                                    padding: 0,
                                                                    lineHeight: footerTextLineHeight,
                                                                    wrap: 'word',
                                                                    ellipsis: false
                                                                }

                                                                setTimeout(() => {

                                                                    drawText(optionsFooterText, styleDep)

                                                                    stage.find('#background')[0].zIndex(0)
                                                                    stage.find('#addFigure0')[0].zIndex(1)
                                                                    stage.find('#addFigure1')[0].zIndex(2)
                                                                    stage.find('#addFigure2')[0].zIndex(3)
                                                                    
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
                                                                                'addFigure0',
                                                                                'addFigure1',
                                                                                'mortuary',
                                                                                'deceased',
                                                                                'dep',
                                                                                'pray',
                                                                                'family',
                                                                                'addFigure2',
                                                                                'died',
                                                                                'gender',
                                                                                'footerText',
                                                                            ]
                
                                                                            var i = 2
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
                                                                }, 150)
                                                            }, 150)
                                                        }, 150)
                                                    }, 150)
                                                }, 150)
                                            }, 150)
                                        }, 150)
                                    }, 150);
                                }, 150);
                            }, 150)
                        }, 150)
                    }, 150);
                }, 150);
            }, 150);
        }, 150)
    }
})