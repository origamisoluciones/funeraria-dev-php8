$(function(){
    hasTransept = true;
    hasLogo = true;
    
    if(!loadFlag){
        setTimeout(() => {
    
            var transeptX = 0;
            var transeptY  = 0;
            var transeptScaleX  = 0;
            var transeptScaleY  = 0;
    
            switch(parseInt(obituaryModel)){
                case 0:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
                break
                case 1:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
                break
                case 2:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
                break
                case 3:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
                break
                case 4:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
                break;
                case 5:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
                break
                case 6:
                    transeptX = 336.83
                    transeptY = 27.563
                    transeptScaleX = 0.10641575489321653
                    transeptScaleY = 0.10641575489321652
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
    
            setTimeout(() => {

                drawImage(optionsTransept, expedientID, obituaryType, obituaryModel)

                var nameLogo = getNameLogo(obituaryType, obituaryModel)
                    
                // Logo
                var x = 271.18
                var y = 970.091
                var scaleX = 0.0699
                var scaleY = 0.0619
        
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

                    var dayMortuaryVelation = '--';
                    if(obituary.startVelacionDate != null && obituary.startVelacionDate != ''){

                        var timeMortuaryStartVelation = '--:--';
                        var timeMortuaryEndVelation = '--:--';
                        if(obituary.startVelacionTime != null && obituary.startVelacionTime != ''){
                            timeMortuaryStartVelation = obituary.startVelacionTime != '' ?  moment(obituary.startVelacionTime, "hh:mm:ss").format('HH:mm') : '';
                            timeMortuaryEndVelation = obituary.endVelacionTime != '' ?  moment(obituary.endVelacionTime, "hh:mm:ss").format('HH:mm') : '';
                        }

                        var day = moment(obituary.startVelacionDate, "YYYY-MM-DD").diff(moment(moment().format("YYYY/MM/DD"), "YYYY/MM/DD"), 'days');
                        difDaysAux = day
                        day = moment().add(day, 'days').calendar().toUpperCase();           
    
                        var ceremonyPreDay = moment(obituary.startVelacionDate, "YYYY-MM-DD").format('LLLL').toUpperCase().split(' ');  
                        if(day.indexOf("INVALID") == 0){
                            dayMortuaryVelation = ''
                        }else if(day.indexOf("MAÑANA") == 0){
                            dayMortuaryVelation = "MAÑANA DE " + timeMortuaryStartVelation + " A " + timeMortuaryEndVelation + 'H';
                        }else if(day.indexOf("HOY") ==0){
                            dayMortuaryVelation = "HOY DE " + timeMortuaryStartVelation; + " A " + timeMortuaryEndVelation + 'H';
                        }else if(day == 2){                 
                            dayMortuaryVelation = 'PASADO MAÑANA DE ' + timeMortuaryStartVelation + " A " + timeMortuaryEndVelation + 'H';
                        }else{
                            dayMortuaryVelation = ceremonyPreDay[1] + " DE " + ceremonyPreDay[3] +  " DE " + timeMortuaryStartVelation + " A " + timeMortuaryEndVelation + 'H';
                        }
                    }
                    
                    switch(parseInt(obituaryModel)){
                        case 0:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
                            var align = 'left';
                        break;
                        case 1:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
                            var align = 'left';
                        break;
                        case 2:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
                            var align = 'left';
                        break;
                        case 3:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
                            var align = 'left';
                        break;
                        case 4:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
                            var align = 'left';
                        break;
                        case 5:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
                            var align = 'left';
                        break;
                        case 6:
                            var x = 231
                            var y = 855
                            var text = 'VELATORIO: ' + dayMortuaryVelation;
                            var fontSize = 19
                            var fontStyle = 'bold'
                            var fontFamily = 'times new roman'
                            var fill = "#000000"
                            var width = 536
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
                        lineHeight: 1.25,
                        wrap: 'word',
                        ellipsis: false,
                        align: align,
                    }
                    
                    setTimeout(() => {
                        // Draw Mortuary
                        drawText(optionsMortuary, styleMortuary)

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
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
                            break
                            case 1:
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
                            break
                            case 2:
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
                            break
                            case 3:
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
                            break
                            case 4:
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
                            break
                            case 5:
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
                            break
                            case 6:
                                quoteX = 364
                                quoteY = 893
                                quoteWidth = 399
                                quoteFontFamily = 'times new roman'
                                quoteFontSize = 19
                                quoteFontStyle = 'bold'
                                quoteAlign = 'left'
                                quoteLineHeight = 1.25
                                quoteText = (obituary.funeralHome != null ? obituary.funeralHome.toUpperCase() : '-')
                                fill = "#000000"
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

                            var mortuaryName = (obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary) + ' - SALA ' + (obituary.roomNumber != null ? obituary.roomNumber : '-');

                            var mortuaryV2X = 0;
                            var mortuaryV2Y = 0;
                            var mortuaryV2Width = 0;
                            var mortuaryV2FontFamily = '';
                            var mortuaryV2FontSize = 0;
                            var mortuaryV2FontStyle = '';
                            var mortuaryV2Align = '';
                            var mortuaryV2LineHeight = 0;
                            var mortuaryV2Text = '';
                            var fill = '';
                            switch(parseInt(obituaryModel)){
                                case 0:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 1:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 2:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 3:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 4:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 5:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                                case 6:
                                    mortuaryV2X = 314
                                    mortuaryV2Y = 925
                                    mortuaryV2Width = 466
                                    mortuaryV2FontFamily = 'times new roman'
                                    mortuaryV2FontSize = 19
                                    mortuaryV2FontStyle = 'bold'
                                    mortuaryV2Align = 'left'
                                    mortuaryV2LineHeight = 1.25
                                    fill = "#000000"
                                break
                            }
    
                            // Cita
                            var optionsMortuaryV2 = {
                                x: mortuaryV2X,
                                y: mortuaryV2Y,
                                width: mortuaryV2Width,
                                name: 'text',
                                id: 'mortuaryV2',
                                draggable: true,
                                fill: fill,
                                opacity: 1
                            }
    
                            var styleMortuaryV2 = {
                                fontFamily: mortuaryV2FontFamily,
                                fontSize: mortuaryV2FontSize,
                                fontStyle: mortuaryV2FontStyle,
                                fontVariant: 'normal',
                                textDecoration: 'empty string',
                                text: mortuaryName,
                                align: mortuaryV2Align,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: mortuaryV2LineHeight,
                                wrap: 'word',
                                ellipsis: false
                            }

                            setTimeout(() => {

                                drawText(optionsMortuaryV2, styleMortuaryV2)

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
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 1:
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 2:
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 3:
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 4:
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 5:
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
                                    break
                                    case 6:
                                        deceasedX = 19.36;
                                        deceasedY = 246;
                                        deceasedWidth = 755.64;
                                        deceasedFontFamily = 'times new roman';
                                        deceasedFontSize = 40
                                        deceasedFontStyle = 'bold'
                                        deceasedAlign = 'center'
                                        deceasedLineHeight = 1.25
                                        fill = "#000000"
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
                                    text: obituary.namePre + ' ' + obituary.name + '\n ' + obituary.surname,
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
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 1:
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 2:
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 3:
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 4:
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 5:
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
                                        break
                                        case 6:
                                            extraTextX = 19
                                            extraTextY = 349
                                            extraTextWidth = 758
                                            extraTextFontFamily = 'times new roman'
                                            extraTextFontSize = 30
                                            extraTextFontStyle = 'bold'
                                            extraTextAlign = 'center'
                                            extraTextLineHeight = 1.25
                                            fill = "#000000"
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
                                        text: obituary.extraText == '' ? '' : '" ' + obituary.extraText + ' "',
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
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 1:
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 2:
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 3:
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 4:
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 5:
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
                                            break
                                            case 6:
                                                widowX = 19
                                                widowY = 390
                                                widowWidth = 755
                                                widowFontFamily = 'times new roman'
                                                widowFontSize = 30
                                                widowFontStyle = 'normal'
                                                widowAlign = 'center'
                                                widowLineHeight = 1.25
                                                fill = "#000000"
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
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
                                                break
                                                case 1:
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
                                                break
                                                case 2:
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
                                                break;
                                                case 3:
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
                                                break;
                                                case 4:
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
                                                break
                                                case 5:
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
                                                break
                                                case 6:
                                                    diedX = 171
                                                    diedY = 441
                                                    diedWidth = 461
                                                    diedFontFamily = 'times new roman'
                                                    diedFontSize = 20
                                                    diedFontStyle = 'normal'
                                                    diedAlign = 'center'
                                                    diedLineHeight = 1.25
                                                    fill = "#000000"
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
                                                    case 0:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
                                                    break;
                                                    case 1:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
                                                    break;
                                                    case 2:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
                                                    break
                                                    case 3:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
                                                    break
                                                    case 4:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
                                                    break
                                                    case 5:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
                                                    break
                                                    case 6:
                                                        depX = 66
                                                        depY = 514
                                                        depWidth = 668
                                                        depFontFamily = 'times new roman'
                                                        depFontSize = 30
                                                        depFontStyle = 'bold'
                                                        depAlign = 'center'
                                                        depLineHeight = 1.25
                                                        fill = "#000000"
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
                                                    text: obituary.dep == 1 ? 'D . E . P .' : '',
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
                                                    var familyHeight = 0;
                                                    var familyFontFamily = '';
                                                    var familyFontSize = 0;
                                                    var familyFontStyle = '';
                                                    var familyAlign = '';
                                                    var familyLineHeight = 0;
                                                    var fill = '';
                                                    switch(parseInt(obituaryModel)){
                                                        case 0:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break
                                                        case 1:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break
                                                        case 2:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break
                                                        case 3:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break
                                                        case 4:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break
                                                        case 5:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break   
                                                        case 6:
                                                            familyX = 61
                                                            familyY = 577
                                                            familyWidth = 674
                                                            familyHeight = 66
                                                            familyFontFamily = 'times new roman italic'
                                                            familyFontSize = 30
                                                            familyFontStyle = 'normal'
                                                            familyAlign = 'justify'
                                                            familyLineHeight = 1.25
                                                            fill = "#000000"
                                                        break
                                                    }

                                                    // Familia
                                                    var optionsFamily = {
                                                        x: familyX,
                                                        y: familyY,
                                                        width: familyWidth,
                                                        height: familyHeight,
                                                        name: 'text',
                                                        id: 'family',
                                                        draggable: true,
                                                        fill: fill,
                                                        opacity: 1
                                                    }

                                                    var family = 'Sus apenados: ';
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
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
                                                            break
                                                            case 1:
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
                                                            break;
                                                            case 2:
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
                                                            break;
                                                            case 3:
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
                                                            break;
                                                            case 4:
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
                                                            break   
                                                            case 5:
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
                                                            break
                                                            case 6:
                                                                prayX = 62
                                                                prayY = 728
                                                                prayWidth = 675
                                                                prayFontFamily = 'times new roman italic'
                                                                prayFontSize = 22
                                                                prayFontStyle = 'normal'
                                                                prayAlign = 'justify'
                                                                prayLineHeight = 1.25
                                                                fill = "#000000"
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
                                                                            'mortuaryV2',
                                                                            'deceased',
                                                                            'extraText',
                                                                            'widow',
                                                                            'died',
                                                                            'dep',
                                                                            'family',
                                                                            'pray',
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
    }
})