$(function(){
    hasTransept = true;
    hasLogo = false;

    if(!loadFlag){
        setTimeout(() => {

            var transeptX = 0;
            var transeptY  = 0;
            var transeptScaleX  = 0;
            var transeptScaleY  = 0;
            switch(parseInt(obituaryModel)){
                case 0:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
                break
                case 1:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
                break
                case 2:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
                break
                case 3:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
                break
                case 4:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
                break;
                case 5:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
                break
                case 6:
                    transeptX = 489.88
                    transeptY = 33.34
                    transeptScaleX = 0.36159664689167464
                    transeptScaleY = 0.3669617766327709
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
    
                // Draw rectagles
                var backgroundBorders1 = {
                    x: 16,
                    y: 15.61,
                    width: 1095,
                    height: 765,
                    name: 'figure',
                    id: 'addFigure0',
                    draggable: true,
                    fill: '#FFFFFF',
                    stroke: '#000000',
                    strokeWidth: 1.5,
                    opacity: 1,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1
                }
                drawRectangle(backgroundBorders1)
    
                setTimeout(() => {
                    
                    var mortuaryName = obituary.mortuary == 'Otro' ? obituary.deceasedMortuaryAddress : obituary.mortuary;
                    switch(parseInt(obituaryModel)){
                        case 0:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
                        break;
                        case 1:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
                        break;
                        case 2:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
                        break;
                        case 3:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
                        break;
                        case 4:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
                        break;
                        case 5:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
                        break;
                        case 6:
                            var x = 17.09375
                            var y = 572
                            var text = mortuaryName
                            var fontSize = 40
                            var fontStyle = 'normal'
                            var fontFamily = 'times new roman'
                            var fill = '#000000'
                            var width = 1094.5462499999999
                            var align = 'center';
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
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1.25
                                fill = '#000000'
                            break
                            case 1:
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1.25
                                fill = '#000000'
                            break
                            case 2:
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1.25
                                fill = '#000000'
                            break
                            case 3:
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1.25
                                fill = '#000000'
                            break
                            case 4:
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1.25
                                fill = '#000000'
                            break
                            case 5:
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
                                deceasedFontStyle = 'bold'
                                deceasedAlign = 'center'
                                deceasedLineHeight = 1.25
                                fill = '#000000'
                            break
                            case 6:
                                deceasedX = 15.78125
                                deceasedY = 253
                                deceasedWidth = 1090.20875
                                deceasedFontFamily = 'times new roman'
                                deceasedFontSize = 90
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
                            text: obituary.name + '\n' + obituary.surname,
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
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break
                                case 1:
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break
                                case 2:
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break
                                case 3:
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break
                                case 4:
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break
                                case 5:
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break
                                case 6:
                                    extraTextX = 16.09375
                                    extraTextY = 514
                                    extraTextWidth = 1093.90625
                                    extraTextFontFamily = 'times new roman'
                                    extraTextFontSize = 30
                                    extraTextFontStyle = 'normal'
                                    extraTextAlign = 'center'
                                    extraTextLineHeight = 1
                                    fill = '#000000'
                                break;
                            }

                            // Extra Text
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
                                text: obituary.extraText,
                                align: extraTextAlign,
                                verticalAlign: 'top',
                                padding: 0,
                                lineHeight: extraTextLineHeight,
                                wrap: 'word',
                                ellipsis: false
                            }

                            setTimeout(() => {
                                drawText(optionsExtraText, styleExtraText)

                                setTimeout(() => {

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
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#000000'
                                        break
                                        case 1:
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#000000'
                                        break
                                        case 2:
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#000000'
                                        break;
                                        case 3:
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#000000'
                                        break;
                                        case 4:
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#000000'
                                        break
                                        case 5:
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
                                            diedAlign = 'center'
                                            diedLineHeight = 1.25
                                            fill = '#000000'
                                        break
                                        case 6:
                                            diedX = 14.10
                                            diedY = 471
                                            diedWidth = 1096.90625
                                            diedFontFamily = "times new roman"
                                            diedFontSize = 30
                                            diedFontStyle = 'normal'
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

                                        setTimeout(() => {
                                    
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
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 1:
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 2:
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 3:
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 4:
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 5:
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
                                                    fill = '#000000'
                                                break
                                                case 6:
                                                    FuneralX = 155.28125
                                                    FuneralY = 660
                                                    FuneralWidth = 829.71875
                                                    FuneralFontFamily = 'times new roman'
                                                    FuneralFontSize = 40
                                                    FuneralFontStyle = 'bold'
                                                    FuneralAlign = 'center'
                                                    FuneralLineHeight = 1.25
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
                                                    stage.find('#addFigure0')[0].zIndex(1)
                                                    
                                                    switch(parseInt(obituaryModel)){
                                                        case 0:
                                                        case 1:
                                                        case 2:
                                                        case 3:
                                                        case 5:
                                                        case 6:
                                                            var elems = [
                                                                'transept',
                                                                'addFigure0',
                                                                'mortuary',
                                                                'deceased',
                                                                'extraText',
                                                                'died',
                                                                'funeral',
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
                    }, 150)
                }, 150)
            }, 150);
        }, 150)
    }
})