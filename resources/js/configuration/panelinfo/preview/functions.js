/**
* @var int time interval to check for reload
*/
var interval = 1000 * 60 * 5;

/**
 * Función para cargar las imágenes de transición en la parte de fotos actuales seleccionadas
 * para visualizar en el panel informativo
 * 
 * @param mortuaryID 
 */
function loadImagesPanelInfo(mortuaryID){
    $.ajax({
        url: uri+"core/panelInfo/functions.php",
        data: {type: 'getImagesPanelInfo', mortuaryID: mortuaryID},
        type: 'POST',
        async: false,
        success: function (data) {
            if(data!=='false'){
                var data = $.parseJSON(data);
                $('#slide .carousel-inner').html('');
                $('#slide .carousel-inner').css('height', $(window).height() * 0.30)
                data.forEach(function(element, index) {
                    var active = '';
                    if(index==0){
                        active= ' active';
                    }
                    
                    $('#slide .carousel-inner').append('<div style="height: 100%;" class="item' + active + '"><div id="' + element + '" height="100%" style="background-image: url('+ uri + 'resources/files/configuration/panelInfo/' + mortuaryID + '/slides/' + element + ');background-size: contain; width: 100%; height: 100%; background-repeat: no-repeat;"> </div></div>');
                });
                return true;
            }else{
                return false;
            }
        }
    });
}

/**
 * Carga las imágenes del slider del footer
 * 
 * @param {int} mortuary Id del tanatorio
 */
function loadSliderFooter(mortuary){
    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'getSlideFooter',
            mortuary: mortuary
        },
        async: false,
        success: function(data){
            try{               

                data = $.parseJSON(data) 
                var arrayImgs = data.imgs
                $('#carousel-footer .carousel-inner').empty()

                var tableSize = $('.table-responsive').outerHeight();
                var windowSize = $(window).height();               
                var slide=0;
                var j = 0;
                setTimeout(() => {                    
                    
                    slide = $('#slide').outerHeight();
                    var photoSize = windowSize - tableSize - slide - 38
                    
                    //Recorrer el Objeto data que contiene slides
                    var i = 0
                    for (key in data) {
                        
                        if(key != 'imgs'){
                            
                            //Buscar el ID en el array de imagenes para saber si existe
                            if(arrayImgs.indexOf(data[key]['ID']) != -1 ){ //existe imagen
                                             
                                id = data[key]["ID"]
                                title = data[key]["title"]
                                message = data[key]["message"]
                                var flow='flowtype' + j;
                                if(i==0){
                                    $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                                    '       <div class="row">' +
                                                                                    '           <div class="col-xs-6">' +
                                                                                    //'               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide' + id + '.png">' +
                                                                                    '               <div class="photo" style="height:'+photoSize+'px; background-image: url(' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide' + id + '.png)"></div>' +
                                                                                    '           </div>' +
                                                                                    '           <div id="'+ flow + '" class="col-xs-6 flowtype" style="text-align: left;">' +
                                                                                    '               <p>' + title + '</p>' +
                                                                                    '               <p style="white-space: pre-wrap;">' + message + '</p>' +
                                                                                    '           </div>' +
                                                                                    '       </div>' +
                                                                                    '   </div>')
                                }else{
                                    $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                                    '       <div class="row">' +
                                                                                    '           <div class="col-xs-6">' +
                                                                                    //'               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide' + id + '.png">' +
                                                                                    '               <div class="photo" style="height:'+photoSize+'px; background-image: url(' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide' + id + '.png)"></div>' +
                                                                                    '           </div>' +
                                                                                    '           <div id="'+ flow + '" class="col-xs-6 flowtype" style="text-align: left;">' +
                                                                                    '               <p>' + title + '</p>' +
                                                                                    '               <p style="white-space: pre-wrap;">' + message + '</p>' +
                                                                                    '           </div>' +
                                                                                    '       </div>' +
                                                                                    '   </div>')
                                }                            
                            }else{ //No existe imagen
                               
                                if(i==0){
                                    $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                            '       <div class="row">' +
                                                                            '           <div class="col-xs-6"></div>' +
                                                                            '           <div id="'+ flow + '" class="col-xs-6 flowtype" style="text-align: left;">' +
                                                                            '               <p>' + title + '</p>' +
                                                                            '               <p style="white-space: pre-wrap;">' + title + '</p>' +
                                                                            '           </div>' +
                                                                            '       </div>' +
                                                                            '   </div>')
                                }else{
                                    $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                                    '       <div class="row">' +
                                                                                    '           <div class="col-xs-6"></div>' +
                                                                                    '           <div id="'+ flow + '" class="col-xs-6 flowtype" style="text-align: left;">' +
                                                                                    '               <p>' + title + '</p>' +
                                                                                    '               <p style="white-space: pre-wrap;">' + title + '</p>' +
                                                                                    '           </div>' +
                                                                                    '       </div>' +
                                                                                    '   </div>')
                                }
                            }  
                            i++                      
                        }  
                        j++;
                    }  
                    
                    var i=0;
                    $('#carousel-footer .carousel-inner .item').each(function(){
                        $('#' + $(this).find('.flowtype').attr('id')).flowtype({
                            minFont : 12,
                            maxFont : 40
                           });
                        if(i!=0){
                            $(this).removeClass('active');
                        }
                        i++;
                    });
                    
                    /*if(data.imgs.slide1){
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6">' +
                                                                        '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide1.png">' +
                                                                        '           </div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title1 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message1 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }else{
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title1 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message1 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }
                    if(data.imgs.slide2){
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6">' +
                                                                        '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide2.png">' +
                                                                        '           </div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title2 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message2 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }else{
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title2 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message2 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }
                    if(data.imgs.slide3){
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6">' +
                                                                        '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide3.png">' +
                                                                        '           </div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title3 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message3 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }else{
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title3 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message3 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }
                    if(data.imgs.slide4){
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6">' +
                                                                        '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide4.png">' +
                                                                        '           </div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title4 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message4 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }else{
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title4 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message4 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }
                    if(data.imgs.slide5){
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6">' +
                                                                        '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide5.png">' +
                                                                        '           </div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title5 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message5 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }else{
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title5 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message5 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }
                    if(data.imgs.slide6){
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6">' +
                                                                        '               <img width="100%" src="' + uri + 'resources/files/configuration/panelInfo/' + mortuary + '/footer/slide6.png">' +
                                                                        '           </div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title6 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message6 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }else{
                        $('#carousel-footer .carousel-inner').append(   '   <div class="item active">' +
                                                                        '       <div class="row">' +
                                                                        '           <div class="col-xs-6"></div>' +
                                                                        '           <div class="col-xs-6" style="text-align: left;">' +
                                                                        '               <p>' + data.title6 + '</p>' +
                                                                        '               <p style="white-space: pre-wrap;">' + data.message6 + '</p>' +
                                                                        '           </div>' +
                                                                        '       </div>' +
                                                                        '   </div>')
                    }*/
    
                    $('#carousel-footer').carousel({
                        interval: 5000,
                        pause: "false"
                    })
                }, 500)
                
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })
}

/**
 * Comprueba si la visita existe
 * 
 * @param {int} expedient Id de la visita
 * @return bool
 */
function existsMortuary(mortuary){
    var check

    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'existsMortuary',
            mortuary: mortuary
        },
        async: false,
        success: function(data){
            try{
                check = $.parseJSON(data)
            }catch(e){
                check = false
            }
        },
        error: function(){
            check = false
        }
    })

    return check
}

/**
 * Obtiene la información del tanatorio a mostrar
 * 
 * @param {int} mortuary Tanatorio
 * @return array
 */
function getMortuaryInfo(mortuary){
    var info = null

    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'getPanelInfo',
            mortuaryID: mortuary
        },
        dataType: 'json',
        async: false,
        success: function(data){
            try{
                info = data
            }catch(e){
                $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    
                setTimeout(function(){
                    $('#block-message').empty()
                }, 5000)
            }
        },
        error: function(){
            $('#block-message').html('<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Error mientras se procesaba su solicitud. Vuelva a intentarlo más tarde. Disculpe las molestias.</div>');
                    
            setTimeout(function(){
                $('#block-message').empty()
            }, 5000)
        }
    })

    return info
}

/**
 * Comprueba si la visita existe
 * 
 * @param {int} expedient Id de la visita
 * @return bool
 */
function getTimes(mortuary){
    var times

    $.ajax({
        url: uri + 'core/panelInfo/functions.php',
        method: 'POST',
        data: {
            type: 'getTimes',
            mortuary: mortuary
        },
        async: false,
        success: function(data){
            try{
                times = $.parseJSON(data)
            }catch(e){
                times = false
            }
        },
        error: function(){
            times = false
        }
    })

    return times
}

/**
 * Carga las fotos en el slide
 * 
 * @param {array} data Fotos
 */
function loadSlide(data){
    $('#carouselUpContent').html('')

    $.each(data, function(index, elem){
        var active = ''
        if(index == 0){
            active = ' active'
        }

        $('#carouselUpContent').append( '   <div class="item' + active + '">' +
                                        '       <img src="' + uri + elem + '" class="img-responsive panelInfoPreviewUpImg"></img>' +
                                        '   </div>')
    })
}

/**
 * Carga las fotos en el slide del footer
 * 
 * @param {array} data Fotos
 */
function loadFooterSlide(data){
    var active = true
    var activeClass = 'active'
    Object.keys(data).forEach(key => {
        var item = data[key]
        if(item.length > 1){
            $('#carouselDownContent').append(   '   <div class="item ' + activeClass + '">' +
                                                '       <div class="row containerAlignDown">' +
                                                '           <div style="margin-right: 20px;">' +
                                                '               <img class="panelInfoPreviewDownImg img-responsive" src="' + uri + item[1] + '">' +
                                                '           </div>' +
                                                '           <div style="text-align: left; margin-left: 20px;">' +
                                                '               <p class="panelInfoPreviewDownTitle">' + item[0].title + '</p>' +
                                                '               <p class="panelInfoPreviewDownMessage">' + item[0].message + '</p>' +
                                                '           </div>' +
                                                '       </div>' +
                                                '   </div>')

            if(active){
                activeClass = ''
                active = false
            }
        }else{
            $('#carouselDownContent').append(   '   <div class="item ' + activeClass + '">' +
                                                '       <div class="row containerAlignDown">' +
                                                '           <div style="margin-right: 20px;"></div>' +
                                                '           <div class="pull-left" style="margin-left: 20px;">' +
                                                '               <p class="panelInfoPreviewDownTitle">' + item[0].title + '</p>' +
                                                '               <p class="panelInfoPreviewDownMessage">' + item[0].message + '</p>' +
                                                '           </div>' +
                                                '       </div>' +
                                                '   </div>')

            if(active){
                activeClass = ''
                active = false
            }
        }      
    })
}
function changeSpaceFooter(){
    var heightFooter = $('.footer-static-bottom').height()
    $('.content-wrapper').css('padding-bottom', heightFooter)
}
$(window).scroll(function(){
    changeSpaceFooter()
})
$(window).resize(function(){
    changeSpaceFooter()
})
$(function(){

    var mortuary = $('#mortuaryID').val();
    if(existsMortuary(mortuary)){
        $('#existsMortuary').remove();
    }else{
        $('#existsMortuary').removeClass('hide');
        setTimeout(() => {
            window.location.href = uri + 'configuracion/panel-informativo';
        }, 2500)
        return false;
    }

    // Información del tanatorio
    var mortuaryInfo = getMortuaryInfo(mortuary)
    if(mortuaryInfo[0] != null){
        $.each(mortuaryInfo[0], function(index, elem){
            var room = elem.deceasedRoom
            var name = elem.deceasedName + ' ' + elem.deceasedSurname
            var day = elem.funeralDate == null || elem.funeralDate == '' ? '' : moment(elem.funeralDate, 'YYYY-MM-DD').format('DD')
            var time = elem.funeralTime == null || elem.funeralTime == '' ? '' : moment(elem.funeralTime, 'HH:mm:ss').format('HH:mm')
            var church = elem.churchName
            var cemetery = elem.cemeteryName == null || elem.cemeteryName == '' ? '' : elem.cemeteryName
            $('#mortuaryInfo tbody').append('   <tr>' +
                                            '       <td style="font-weight: normal;">' + room + '</td>' +
                                            '       <td style="font-weight: normal;">' + name + '</td>' +
                                            '       <td style="font-weight: normal;">' + day + '</td>' +
                                            '       <td style="font-weight: normal;">' + time + '</td>' +
                                            '       <td style="font-weight: normal;">' + church + '</td>' +
                                            '       <td style="font-weight: normal;">' + cemetery + '</td>' +
                                            '   </tr>')
        })
        if(mortuaryInfo[0].length > 0){
            $('#mortuaryName').html(mortuaryInfo[0][0].mortuaryName)
        }
    }

    $('#mortuaryName').html(mortuaryInfo[4])
    
    // Logo (superior - izquierda)
    $('#logoLeftUp').attr('src', mortuaryInfo[1])

    // Fotos (superior - derecha)
    loadSlide(mortuaryInfo[2])

    // Fotos (inferior)
    loadFooterSlide(mortuaryInfo[3])

    var mortuary = $('#mortuaryID').val()
    times = getTimes(mortuary)

    var upInterval, downInterval;
    if(times != null){
        upInterval = times[0]["upSlide"]
        downInterval = times[0]["downSlide"]
    }else{
        upInterval = 4000
        downInterval = 7000
    }

    $('#carouselUp').carousel({
        interval: upInterval,
        cycle: true
    })

    $('#carouselDown').carousel({
        interval: downInterval,
        cycle: true
    })
    setInterval(refresh, interval);

    changeSpaceFooter()
})

function refresh(){
    var mortuary = $('#mortuaryID').val()
    var mortuaryInfo = getMortuaryInfo(mortuary)
    if(mortuaryInfo[0] != null){
        $('#mortuaryInfo tbody').empty();
        $.each(mortuaryInfo[0], function(index, elem){
            var room = elem.deceasedRoom
            var name = elem.deceasedName + ' ' + elem.deceasedSurname
            var day = elem.funeralDate == null || elem.funeralDate == '' ? '' : moment(elem.funeralDate, 'YYYY-MM-DD').format('DD')
            var time = elem.funeralTime == null || elem.funeralTime == '' ? '' : moment(elem.funeralTime, 'HH:mm:ss').format('HH:mm')
            var church = elem.churchName
            var cemetery = elem.cemeteryName
            $('#mortuaryInfo tbody').append('   <tr>' +
                                            '       <td style="font-weight: normal;">' + room + '</td>' +
                                            '       <td style="font-weight: normal;">' + name + '</td>' +
                                            '       <td style="font-weight: normal;">' + day + '</td>' +
                                            '       <td style="font-weight: normal;">' + time + '</td>' +
                                            '       <td style="font-weight: normal;">' + church + '</td>' +
                                            '       <td style="font-weight: normal;">' + cemetery + '</td>' +
                                            '   </tr>')
        })
        if(mortuaryInfo[0].length > 0){
            $('#mortuaryName').html(mortuaryInfo[0][0].mortuaryName)
        }
    }
}